import AdminJS, { ComponentLoader } from 'adminjs';
import express from 'express';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';

AdminJS.registerAdapter({ Database, Resource });

export const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

const start = async () => {
  const app = express();

  const admin = new AdminJS({
    componentLoader: new ComponentLoader(),
    rootPath: '/admin',
    resources: [
      { options: {}, resource: { model: getModelByName('Employee'), client: prisma } },
      { options: {}, resource: { model: getModelByName('Account'), client: prisma } },
      { options: {}, resource: { model: getModelByName('Task'), client: prisma } },
      { options: {}, resource: { model: getModelByName('LearningMaterial'), client: prisma } },
    ],
    databases: [],
  });

  if (process.env.NODE_ENV === 'production') {
    await admin.initialize();
  } else {
    admin.watch();
  }

  const router = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, router);

  app.listen(port, () => {
    console.log(`AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
  });
};

start();
