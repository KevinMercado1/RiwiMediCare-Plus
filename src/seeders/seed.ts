import sequelize from '../config/db.js';
import {
  Usuario,
  Clinica,
  Almacen,
  Medicamento,
  Inventario,
  Solicitud,
  DetalleSolicitud,
  Ciudad,
  Telefono,
  Nit,
} from '../models/index.js';

import bcrypt from 'bcrypt';

async function ejecutarSeed() {
  try {
    await sequelize.authenticate();

    console.log('==========================================');
    console.log('Conectado a PostgreSQL');
    console.log('Iniciando Seed...');
    console.log('==========================================');

    // LIMPIAR DATOS

    // Primero las tablas que tienen relaciones con otras tablas
    await DetalleSolicitud.destroy({ where: {} });
    await Solicitud.destroy({ where: {} });
    await Inventario.destroy({ where: {} });

    await Medicamento.destroy({ where: {} });
    await Almacen.destroy({ where: {} });
    await Clinica.destroy({ where: {} });

    await Nit.destroy({ where: {} });
    await Telefono.destroy({ where: {} });
    await Ciudad.destroy({ where: {} });

    await Usuario.destroy({ where: {} });

    console.log('Datos anteriores eliminados correctamente.');

    // USUARIOS

    const passwordHasheada = await bcrypt.hash('password123', 10);

    const admin = await Usuario.create({
      nombre: 'Carlos Administrador',
      email: 'admin@riwimedicare.com',
      password: passwordHasheada,
      rol: 'administrador',
      estado: 'activo',
    });

    const gestor = await Usuario.create({
      nombre: 'Juan Gestor',
      email: 'juan.gestor@riwimedicare.com',
      password: passwordHasheada,
      rol: 'gestor',
      estado: 'activo',
    });

    console.log('Usuarios creados.');

    // CIUDADES

    const barranquilla = await Ciudad.create({
      nombre: 'Barranquilla',
      departamento: 'Atlántico',
    });

    const bogota = await Ciudad.create({
      nombre: 'Bogotá',
      departamento: 'Cundinamarca',
    });

    const cartagena = await Ciudad.create({
      nombre: 'Cartagena',
      departamento: 'Bolívar',
    });

    console.log('Ciudades creadas.');

    // TELEFONOS

    const telefonoCentral = await Telefono.create({
      numero: '3001234567',
      tipo: 'movil',
    });

    const telefonoNorte = await Telefono.create({
      numero: '3017654321',
      tipo: 'movil',
    });

    console.log('Teléfonos creados.');

    // NITS

    const nitCentral = await Nit.create({
      numero: '900123456-1',
    });

    const nitNorte = await Nit.create({
      numero: '900123456-2',
    });

    console.log('NITs creados.');

    // CLINICAS

    const clinicaCentral = await Clinica.create({
      nombre: 'Clínica Riwi Central',
      nitId: nitCentral.id,
      direccion: 'Calle 45 #12-34',
      ciudadId: barranquilla.id,
      telefonoId: telefonoCentral.id,
      responsable: 'Pedro Martínez',
    });

    const clinicaNorte = await Clinica.create({
      nombre: 'Clínica Riwi Norte',
      nitId: nitNorte.id,
      direccion: 'Carrera 53 #80-25',
      ciudadId: barranquilla.id,
      telefonoId: telefonoNorte.id,
      responsable: 'Laura Rodríguez',
    });

    console.log('Clínicas creadas.');

    // ALMACENES

    const almacenPrincipal = await Almacen.create({
      nombre: 'Almacén Principal',
      ciudadId: barranquilla.id,
      direccion: 'Vía 40 #85-10',
    });

    const almacenBogota = await Almacen.create({
      nombre: 'Almacén Bogotá',
      ciudadId: bogota.id,
      direccion: 'Av. Américas #30-22',
    });

    const almacenCartagena = await Almacen.create({
      nombre: 'Almacén Cartagena',
      ciudadId: cartagena.id,
      direccion: 'Carrera 10 #25-30',
    });

    console.log('Almacenes creados.');

    // MEDICAMENTOS

    const acetaminofen = await Medicamento.create({
      codigo: 'MED-ACE-500',
      nombre: 'Acetaminofén',
      descripcion: 'Analgésico y antipirético',
      precio: 2500,
    });

    const ibuprofeno = await Medicamento.create({
      codigo: 'MED-IBU-400',
      nombre: 'Ibuprofeno',
      descripcion: 'Analgésico y antiinflamatorio',
      precio: 3500,
    });

    const amoxicilina = await Medicamento.create({
      codigo: 'MED-AMO-500',
      nombre: 'Amoxicilina',
      descripcion: 'Antibiótico de amplio espectro',
      precio: 8000,
    });

    console.log('Medicamentos creados.');

    // INVENTARIO

    await Inventario.create({
      almacenId: almacenPrincipal.id,
      medicamentoId: acetaminofen.id,
      cantidad: 100,
    });

    await Inventario.create({
      almacenId: almacenPrincipal.id,
      medicamentoId: ibuprofeno.id,
      cantidad: 80,
    });

    await Inventario.create({
      almacenId: almacenPrincipal.id,
      medicamentoId: amoxicilina.id,
      cantidad: 60,
    });

    await Inventario.create({
      almacenId: almacenBogota.id,
      medicamentoId: acetaminofen.id,
      cantidad: 50,
    });

    await Inventario.create({
      almacenId: almacenCartagena.id,
      medicamentoId: ibuprofeno.id,
      cantidad: 40,
    });

    console.log('Inventario creado.');

    // SOLICITUD

    const solicitud = await Solicitud.create({
      clinicaId: clinicaCentral.id,
      almacenId: almacenPrincipal.id,
      usuarioId: gestor.id,
    });

    console.log('Solicitud creada.');

    // DETALLE DE SOLICITUD

    await DetalleSolicitud.create({
      solicitudId: solicitud.id,
      medicamentoId: acetaminofen.id,
      cantidadSolicitada: 20,
    });

    await DetalleSolicitud.create({
      solicitudId: solicitud.id,
      medicamentoId: ibuprofeno.id,
      cantidadSolicitada: 10,
    });

    console.log('Detalles de solicitud creados.');

    // RESUMEN

    console.log('');
    console.log('==========================================');
    console.log('SEED FINALIZADO CORRECTAMENTE');
    console.log('==========================================');
    console.log('Usuarios: 2');
    console.log('Ciudades: 3');
    console.log('Teléfonos: 2');
    console.log('NITs: 2');
    console.log('Clínicas: 2');
    console.log('Almacenes: 3');
    console.log('Medicamentos: 3');
    console.log('Registros de inventario: 5');
    console.log('Solicitudes: 1');
    console.log('Detalles de solicitud: 2');
    console.log('==========================================');
    console.log('Contraseña de prueba: password123');
    console.log('==========================================');

    await sequelize.close();

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('Error crítico al ejecutar el seed:');
    console.error(error);

    await sequelize.close();

    process.exit(1);
  }
}

ejecutarSeed();
