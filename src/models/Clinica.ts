import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Clinica extends Model {
  declare id: string;
  declare nombre: string;
  declare nitId: string;
  declare direccion: string;
  declare ciudadId: string;
  declare telefonoId: string;
  declare responsable: string;
}

Clinica.init(
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

    nitId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'nits',
        key: 'id',
      },
    },

    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ciudadId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ciudades',
        key: 'id',
      },
    },

    telefonoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'telefonos',
        key: 'id',
      },
    },

    responsable: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'clinicas',
    timestamps: true,
  }
);

export default Clinica;
