import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Medicamento extends Model {
  declare id: string;
  declare codigo: string;
  declare nombre: string;
  declare descripcion: string | null;
  declare precio: number;
}

Medicamento.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'medicamentos',
    timestamps: true,
  }
);

export default Medicamento;
