import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

export type EstadoSolicitud =
  | 'pendiente'
  | 'aprobada'
  | 'despachada'
  | 'cancelada';

class Solicitud extends Model {
  declare id: string;
  declare clinicaId: string;
  declare almacenId: string;
  declare usuarioId: string;
  declare fechaSolicitud: Date;
  declare estado: EstadoSolicitud;
}

Solicitud.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    clinicaId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clinicas',
        key: 'id',
      },
    },

    almacenId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'almacenes',
        key: 'id',
      },
    },

    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },

    fechaSolicitud: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobada', 'despachada', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
  },
  {
    sequelize,
    tableName: 'solicitudes',
    timestamps: true,
  }
);

export default Solicitud;
