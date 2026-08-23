import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  SYSTEM_SCREENS,
  SYSTEM_ROUTINES,
  SYSTEM_RESOURCES,
  INITIAL_ACCESS_PROFILES,
  INITIAL_EMPLOYEES,
  evaluateUserPermission,
  getEffectiveAllowedScreens,
} from './src/lib/permissionsEngine';
import { AccessProfile, UserEmployee } from './src/types';
import {
  INITIAL_CLIENTS,
  CATALOG_PRODUCTS as INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_QUOTES,
  INITIAL_TRANSACTIONS,
} from './src/data/mockData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // In-Memory Database Stores (Persistent across server session)
  let accessProfiles = [...INITIAL_ACCESS_PROFILES];
  let employees = [...INITIAL_EMPLOYEES];
  let clients = [...INITIAL_CLIENTS];
  let products = [...INITIAL_PRODUCTS];
  let orders = [...INITIAL_ORDERS];
  let quotes = [...INITIAL_QUOTES];
  let transactions = [...INITIAL_TRANSACTIONS];
  let currentLoggedUserId = 'emp-1'; // Default: Carlos Oliveira (Admin)

  // ===================================================
  // 1. AUTHENTICATION & ACCESS CONTROL API ROUTES
  // ===================================================

  // GET /api/auth/me - Current User Profile & Effective Permissions
  app.get('/api/auth/me', (req, res) => {
    const user = employees.find((e) => e.id === currentLoggedUserId) || employees[0];
    const allowedScreens = getEffectiveAllowedScreens(user, accessProfiles);
    const assignedProfiles = accessProfiles.filter((p) => user.profileIds.includes(p.id));

    res.json({
      user,
      assignedProfiles,
      allowedScreens,
      isAdmin: user.profileIds.includes('prof_admin'),
    });
  });

  // POST /api/auth/simulate - Switch Active User for Audit/Simulation
  app.post('/api/auth/simulate', (req, res) => {
    const { userId } = req.body;
    const targetUser = employees.find((e) => e.id === userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    currentLoggedUserId = targetUser.id;
    res.json({ success: true, activeUser: targetUser });
  });

  // GET /api/permissoes/catalogo - Master Screen & Routine Catalog
  app.get('/api/permissoes/catalogo', (req, res) => {
    res.json({
      screens: SYSTEM_SCREENS,
      routines: SYSTEM_ROUTINES,
    });
  });

  // POST /api/permissoes/verificar - Evaluates Access for any user & permission
  app.post('/api/permissoes/verificar', (req, res) => {
    const { userId, permissionId, type } = req.body;
    const targetUser = employees.find((e) => e.id === (userId || currentLoggedUserId));
    if (!targetUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const evaluation = evaluateUserPermission(
      targetUser,
      permissionId,
      accessProfiles,
      type || 'screen'
    );
    res.json(evaluation);
  });

  // ===================================================
  // 2. PERFIS DE ACESSO (PROFILES CRUD)
  // ===================================================

  // GET /api/perfis - List all access profiles
  app.get('/api/perfis', (req, res) => {
    // Add count of members in each profile
    const profilesWithCounts = accessProfiles.map((p) => {
      const memberCount = employees.filter((e) => e.profileIds.includes(p.id)).length;
      return { ...p, memberCount };
    });
    res.json(profilesWithCounts);
  });

  // GET /api/resources - Master list of resources and actions (standard resource.action)
  app.get('/api/resources', (req, res) => {
    res.json(SYSTEM_RESOURCES);
  });

  // POST /api/perfis - Create new profile
  app.post('/api/perfis', (req, res) => {
    const { name, code, description, color, icon, allowedPermissions, allowedScreens, allowedRoutines } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Nome e código do perfil são obrigatórios' });
    }

    const newProfile: AccessProfile = {
      id: `prof_${Date.now()}`,
      name,
      code: code.toUpperCase().trim(),
      description: description || '',
      color: color || '#3b82f6',
      icon: icon || 'Shield',
      isSystemDefault: false,
      allowedPermissions: allowedPermissions || allowedRoutines || [],
      allowedScreens: allowedScreens || [],
      allowedRoutines: allowedRoutines || allowedPermissions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    accessProfiles.push(newProfile);
    res.status(201).json(newProfile);
  });

  // PUT /api/perfis/:id - Update profile
  app.put('/api/perfis/:id', (req, res) => {
    const { id } = req.params;
    const index = accessProfiles.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    const current = accessProfiles[index];
    accessProfiles[index] = {
      ...current,
      ...req.body,
      id: current.id, // Immutable ID
      updatedAt: new Date().toISOString(),
    };

    res.json(accessProfiles[index]);
  });

  // DELETE /api/perfis/:id - Delete profile
  app.delete('/api/perfis/:id', (req, res) => {
    const { id } = req.params;
    const profile = accessProfiles.find((p) => p.id === id);
    if (!profile) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }
    if (profile.isSystemDefault) {
      return res.status(400).json({ error: 'Perfis de sistema padrão não podem ser excluídos' });
    }

    // Remove profile assignment from any user
    employees = employees.map((e) => ({
      ...e,
      profileIds: e.profileIds.filter((pId) => pId !== id),
    }));

    accessProfiles = accessProfiles.filter((p) => p.id !== id);
    res.json({ success: true, message: 'Perfil excluído com sucesso' });
  });

  // ===================================================
  // 3. COLABORADORES & USUÁRIOS (USERS & DIRECT GRANTS)
  // ===================================================

  // GET /api/usuarios - List all employees with profiles and custom permissions
  app.get('/api/usuarios', (req, res) => {
    res.json(employees);
  });

  // POST /api/usuarios - Create new employee
  app.post('/api/usuarios', (req, res) => {
    const { name, email, whatsapp, jobTitle, department, profileIds } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
    }

    const newEmployee = {
      id: `emp-${Date.now()}`,
      name,
      email,
      whatsapp: whatsapp || '',
      jobTitle: jobTitle || 'Colaborador',
      department: department || 'Comercial',
      status: 'Ativo' as const,
      profileIds: profileIds && profileIds.length > 0 ? profileIds : ['prof_comercial'],
      customPermissions: [],
      createdAt: new Date().toISOString(),
      lastLogin: 'Nunca acessou',
    };

    employees.push(newEmployee);
    res.status(201).json(newEmployee);
  });

  // PUT /api/usuarios/:id - Update employee
  app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    employees[index] = {
      ...employees[index],
      ...req.body,
      id: employees[index].id,
    };

    res.json(employees[index]);
  });

  // PUT /api/usuarios/:id/perfis - Update user assigned profile list (multiple profiles)
  app.put('/api/usuarios/:id/perfis', (req, res) => {
    const { id } = req.params;
    const { profileIds } = req.body;
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    employees[index].profileIds = Array.isArray(profileIds) ? profileIds : [];
    res.json(employees[index]);
  });

  // POST /api/usuarios/:id/permissoes-avulsas - Grant custom/temporary permission
  app.post('/api/usuarios/:id/permissoes-avulsas', (req, res) => {
    const { id } = req.params;
    const { permissionId, permissionType, permissionName, grantType, expiresAt, reason, grantedBy } = req.body;

    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const newGrant = {
      id: `cust-${Date.now()}`,
      permissionId,
      permissionType: permissionType || 'routine',
      permissionName: permissionName || permissionId,
      grantType: grantType || 'allow',
      expiresAt: expiresAt || null, // null = permanente | ISO = temporário
      grantedAt: new Date().toISOString(),
      grantedBy: grantedBy || 'Carlos Oliveira (Admin)',
      reason: reason || 'Concessão direta autorizada',
    };

    // Remove previous grant for same permission if exists, then add new
    employees[index].customPermissions = [
      ...employees[index].customPermissions.filter((p) => p.permissionId !== permissionId),
      newGrant,
    ];

    res.status(201).json(employees[index]);
  });

  // DELETE /api/usuarios/:id/permissoes-avulsas/:grantId - Revoke custom permission
  app.delete('/api/usuarios/:id/permissoes-avulsas/:grantId', (req, res) => {
    const { id, grantId } = req.params;
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    employees[index].customPermissions = employees[index].customPermissions.filter(
      (p) => p.id !== grantId
    );

    res.json(employees[index]);
  });

  // ===================================================
  // 4. CORE OPERATIONAL API ROUTES (Orders, Quotes, Clients)
  // ===================================================

  app.get('/api/pedidos', (req, res) => res.json(orders));
  app.get('/api/orcamentos', (req, res) => res.json(quotes));
  app.get('/api/clientes', (req, res) => res.json(clients));
  app.get('/api/produtos', (req, res) => res.json(products));
  app.get('/api/financeiro/transacoes', (req, res) => res.json(transactions));

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'smartGraph API Server',
      timestamp: new Date().toISOString(),
    });
  });

  // ===================================================
  // 5. VITE INTEGRATION & PRODUCTION ASSET SERVING
  // ===================================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[smartGraph] Servidor rodando com sucesso em http://0.0.0.0:${PORT}`);
  });
}

startServer();
