import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Telefono extends Model {
  declare id: string;
  declare numero: string;
  declare tipo: string;
}

Telefono.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'movil',
    },
  },
  {
    sequelize,
    tableName: 'telefonos',
    timestamps: true,
  }
);

export default Telefono;
