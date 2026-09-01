import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Inventario extends Model {
  declare almacenId: string;
  declare medicamentoId: string;
  declare cantidad: number;
}

Inventario.init(
  {
    almacenId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    medicamentoId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'inventarios',
    timestamps: false,
  }
);

export default Inventario;
