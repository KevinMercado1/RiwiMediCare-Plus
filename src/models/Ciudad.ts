import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Ciudad extends Model {
  declare id: string;
  declare nombre: string;
  declare departamento: string;
}

Ciudad.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ciudades',
    timestamps: true,
  }
);

export default Ciudad;
