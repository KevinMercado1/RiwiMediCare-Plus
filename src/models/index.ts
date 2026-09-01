import Usuario from './Usuario.js';
import Clinica from './Clinica.js';
import Almacen from './Almacen.js';
import Medicamento from './Medicamento.js';
import Inventario from './Inventario.js';
import Solicitud from './Solicitud.js';
import DetalleSolicitud from './DetalleSolicitud.js';
import Ciudad from './Ciudad.js';
import Telefono from './Telefono.js';
import Nit from './Nit.js';

// CIUDAD - CLINICA

Ciudad.hasMany(Clinica, {
  foreignKey: 'ciudadId',
  as: 'clinicas',
});

Clinica.belongsTo(Ciudad, {
  foreignKey: 'ciudadId',
  as: 'ciudad',
});

// CIUDAD - ALMACEN

Ciudad.hasMany(Almacen, {
  foreignKey: 'ciudadId',
  as: 'almacenes',
});

Almacen.belongsTo(Ciudad, {
  foreignKey: 'ciudadId',
  as: 'ciudad',
});

// NIT - CLINICA

Nit.hasOne(Clinica, {
  foreignKey: 'nitId',
  as: 'clinica',
});

Clinica.belongsTo(Nit, {
  foreignKey: 'nitId',
  as: 'nit',
});

// TELEFONO - CLINICA

Clinica.belongsTo(Telefono, {
  foreignKey: 'telefonoId',
  as: 'telefono',
});

Telefono.hasOne(Clinica, {
  foreignKey: 'telefonoId',
  as: 'clinica',
});

// CLINICA - SOLICITUD

Clinica.hasMany(Solicitud, {
  foreignKey: 'clinicaId',
  as: 'solicitudes',
});

Solicitud.belongsTo(Clinica, {
  foreignKey: 'clinicaId',
  as: 'clinica',
});

// ALMACEN - SOLICITUD

Almacen.hasMany(Solicitud, {
  foreignKey: 'almacenId',
  as: 'solicitudesAtendidas',
});

Solicitud.belongsTo(Almacen, {
  foreignKey: 'almacenId',
  as: 'almacen',
});

// USUARIO - SOLICITUD

Usuario.hasMany(Solicitud, {
  foreignKey: 'usuarioId',
  as: 'solicitudesRegistradas',
});

Solicitud.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

// ALMACEN - MEDICAMENTO
// N:M mediante Inventario

Almacen.belongsToMany(Medicamento, {
  through: Inventario,
  foreignKey: 'almacenId',
  otherKey: 'medicamentoId',
  as: 'medicamentosDisponibles',
});

Medicamento.belongsToMany(Almacen, {
  through: Inventario,
  foreignKey: 'medicamentoId',
  otherKey: 'almacenId',
  as: 'almacenes',
});

// SOLICITUD - MEDICAMENTO
// N:M mediante DetalleSolicitud

Solicitud.belongsToMany(Medicamento, {
  through: DetalleSolicitud,
  foreignKey: 'solicitudId',
  otherKey: 'medicamentoId',
  as: 'medicamentosSolicitados',
});

Medicamento.belongsToMany(Solicitud, {
  through: DetalleSolicitud,
  foreignKey: 'medicamentoId',
  otherKey: 'solicitudId',
  as: 'solicitudes',
});

export {
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
};
