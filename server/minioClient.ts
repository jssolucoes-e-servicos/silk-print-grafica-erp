import * as Minio from 'minio';
import { MinioConfig, MinioBucketItem, MinioFileItem } from '../src/types';

let minioClient: Minio.Client | null = null;
let currentMinioConfig: MinioConfig = {
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  bucket: process.env.MINIO_BUCKET || 'silkprint-files',
  status: 'disconnected',
};

// Clean endpoint if it contains protocol
function cleanEndpoint(ep: string) {
  return ep.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
}

export function getMinioConfig(): MinioConfig {
  return { ...currentMinioConfig };
}

export function setMinioConfig(newConfig: Partial<MinioConfig>) {
  currentMinioConfig = { ...currentMinioConfig, ...newConfig };
}

export function initMinioClient(config?: Partial<MinioConfig>): Minio.Client {
  const merged = { ...currentMinioConfig, ...config };
  currentMinioConfig = merged;

  const endpoint = cleanEndpoint(merged.endpoint || 'localhost');

  minioClient = new Minio.Client({
    endPoint: endpoint,
    port: merged.port || 9000,
    useSSL: merged.useSSL || false,
    accessKey: merged.accessKey || '',
    secretKey: merged.secretKey || '',
  });

  return minioClient;
}

/**
 * Test MinIO S3 Server Connection
 */
export async function testMinioConnection(config?: Partial<MinioConfig>): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
  buckets: MinioBucketItem[];
  totalBuckets: number;
}> {
  const startTime = Date.now();
  try {
    const client = initMinioClient(config);
    const bucketsList = await client.listBuckets();
    const latencyMs = Date.now() - startTime;

    const buckets: MinioBucketItem[] = (bucketsList || []).map((b) => ({
      name: b.name,
      creationDate: b.creationDate ? b.creationDate.toISOString() : new Date().toISOString(),
    }));

    currentMinioConfig.status = 'connected';
    currentMinioConfig.lastChecked = new Date().toISOString();
    currentMinioConfig.totalBuckets = buckets.length;

    // Check if target bucket exists, if not create it
    const targetBucket = currentMinioConfig.bucket || 'silkprint-files';
    const exists = await client.bucketExists(targetBucket).catch(() => false);
    if (!exists) {
      try {
        await client.makeBucket(targetBucket, 'us-east-1');
        buckets.unshift({
          name: targetBucket,
          creationDate: new Date().toISOString(),
        });
      } catch (err: any) {
        console.log('[MinIO] Note: could not auto-create target bucket:', err.message);
      }
    }

    return {
      success: true,
      message: `Conectado ao servidor MinIO S3 com sucesso! (${latencyMs}ms)`,
      latencyMs,
      buckets,
      totalBuckets: buckets.length,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    currentMinioConfig.status = 'error';
    console.error('[MinIO] Connection test failed:', err);

    let errorMsg = `Erro ao conectar no MinIO: ${err.message || 'Falha de rede'}`;
    if (err.code === 'ECONNREFUSED') {
      errorMsg = `Conexão recusada em ${currentMinioConfig.endpoint}:${currentMinioConfig.port}. Verifique se o MinIO está rodando e a porta está liberada.`;
    } else if (err.code === 'InvalidAccessKeyId' || err.code === 'SignatureDoesNotMatch') {
      errorMsg = 'Credenciais incorretas (Access Key ou Secret Key inválidos no MinIO).';
    }

    return {
      success: false,
      message: errorMsg,
      latencyMs,
      buckets: [],
      totalBuckets: 0,
    };
  }
}

/**
 * List Buckets in MinIO
 */
export async function listMinioBuckets(): Promise<MinioBucketItem[]> {
  const client = minioClient || initMinioClient();
  const raw = await client.listBuckets();
  return (raw || []).map((b) => ({
    name: b.name,
    creationDate: b.creationDate ? b.creationDate.toISOString() : new Date().toISOString(),
  }));
}

/**
 * Create a new bucket in MinIO
 */
export async function createMinioBucket(bucketName: string): Promise<boolean> {
  const client = minioClient || initMinioClient();
  const cleanName = bucketName.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
  const exists = await client.bucketExists(cleanName).catch(() => false);
  if (!exists) {
    await client.makeBucket(cleanName, 'us-east-1');
  }
  return true;
}

/**
 * List files inside a MinIO bucket
 */
export async function listMinioFiles(bucketName?: string): Promise<MinioFileItem[]> {
  const client = minioClient || initMinioClient();
  const bucket = bucketName || currentMinioConfig.bucket || 'silkprint-files';

  const exists = await client.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(bucket, 'us-east-1').catch(() => {});
  }

  return new Promise((resolve, reject) => {
    const files: MinioFileItem[] = [];
    const stream = client.listObjectsV2(bucket, '', true);

    stream.on('data', (item) => {
      if (item && item.name) {
        files.push({
          name: item.name,
          size: item.size || 0,
          lastModified: item.lastModified ? item.lastModified.toISOString() : new Date().toISOString(),
          etag: item.etag,
          category: item.name.includes('arte')
            ? 'arte'
            : item.name.includes('comp')
            ? 'comprovante'
            : 'geral',
        });
      }
    });

    stream.on('error', (err) => {
      console.error('[MinIO] List objects error:', err);
      reject(err);
    });

    stream.on('end', () => {
      resolve(files);
    });
  });
}

/**
 * Upload a file to MinIO
 */
export async function uploadMinioFile(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  bucketName?: string,
  metadata?: Record<string, string>
): Promise<{
  success: boolean;
  filename: string;
  bucket: string;
  size: number;
  etag?: string;
  url?: string;
}> {
  const client = minioClient || initMinioClient();
  const bucket = bucketName || currentMinioConfig.bucket || 'silkprint-files';

  const exists = await client.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await client.makeBucket(bucket, 'us-east-1');
  }

  // Sanitize filename and add timestamp prefix
  const timestamp = Date.now();
  const safeName = `${timestamp}-${fileName.replace(/\s+/g, '_')}`;

  const metaData = {
    'Content-Type': mimeType || 'application/octet-stream',
    ...(metadata || {}),
  };

  const uploadResult = await client.putObject(bucket, safeName, fileBuffer, fileBuffer.length, metaData);

  return {
    success: true,
    filename: safeName,
    bucket,
    size: fileBuffer.length,
    etag: uploadResult.etag,
    url: `/api/minio/download/${encodeURIComponent(bucket)}/${encodeURIComponent(safeName)}`,
  };
}

/**
 * Delete a file from MinIO
 */
export async function deleteMinioFile(fileName: string, bucketName?: string): Promise<boolean> {
  const client = minioClient || initMinioClient();
  const bucket = bucketName || currentMinioConfig.bucket || 'silkprint-files';
  await client.removeObject(bucket, fileName);
  return true;
}

/**
 * Get File Stream from MinIO
 */
export async function getMinioFileStream(fileName: string, bucketName?: string) {
  const client = minioClient || initMinioClient();
  const bucket = bucketName || currentMinioConfig.bucket || 'silkprint-files';
  return client.getObject(bucket, fileName);
}
