import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

export type RolUsuario = 'administrador' | 'gestor';
export type EstadoUsuario = 'activo' | 'inactivo';

class Usuario extends Model {
  declare id: string;
  declare nombre: string;
  declare email: string;
  declare password: string;
  declare rol: RolUsuario;
  declare estado: EstadoUsuario;
}

Usuario.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    rol: {
      type: DataTypes.ENUM('administrador', 'gestor'),
      allowNull: false,
      defaultValue: 'gestor',
    },

    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      allowNull: false,
      defaultValue: 'activo',
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
  }
);

export default Usuario;
