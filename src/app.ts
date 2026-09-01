import express from 'express';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';

import db from './config/db.js';
import './models/index.js';

import swaggerSpec from './config/swagger.js';

import usuarioRouter from './routes/UsuarioRoutes.js';
import clinicaRouter from './routes/ClinicaRoutes.js';
import almacenRouter from './routes/AlmacenRoutes.js';
import medicamentoRouter from './routes/MedicamentoRoutes.js';
import inventarioRouter from './routes/InventarioRoutes.js';
import solicitudRouter from './routes/SolicitudRoutes.js';
import detalleSolicitudRouter from './routes/DetalleSolicitudRoutes.js';
import ciudadRouter from './routes/CiudadRoutes.js';
import telefonoRouter from './routes/TelefonoRoutes.js';
import nitRouter from './routes/NitRoutes.js';

const { PORT } = process.env;

const app = express();

app.use(express.json());

// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
app.use('/usuarios', usuarioRouter);
app.use('/clinicas', clinicaRouter);
app.use('/almacenes', almacenRouter);
app.use('/medicamentos', medicamentoRouter);
app.use('/inventarios', inventarioRouter);
app.use('/solicitudes', solicitudRouter);
app.use('/detalles-solicitud', detalleSolicitudRouter);
app.use('/ciudades', ciudadRouter);
app.use('/telefonos', telefonoRouter);
app.use('/nits', nitRouter);

async function start(): Promise<void> {
  try {
    await db.authenticate();

    console.log('Database connected successfully');

    await db.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger running on http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

start();

export default app;
