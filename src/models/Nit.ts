import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Nit extends Model {
  declare id: string;
  declare numero: string;
}

Nit.init(
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
  },
  {
    sequelize,
    tableName: 'nits',
    timestamps: true,
  }
);

export default Nit;
