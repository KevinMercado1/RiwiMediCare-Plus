import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class DetalleSolicitud extends Model {
  declare solicitudId: string;
  declare medicamentoId: string;
  declare cantidadSolicitada: number;
}

DetalleSolicitud.init(
  {
    solicitudId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    medicamentoId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    cantidadSolicitada: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    tableName: 'detalles_solicitud',
    timestamps: false,
  }
);

export default DetalleSolicitud;
