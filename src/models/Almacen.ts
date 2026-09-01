import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Almacen extends Model {
  declare id: string;
  declare nombre: string;
  declare ciudadId: string;
  declare direccion: string;
}

Almacen.init(
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

    ciudadId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ciudades',
        key: 'id',
      },
    },

    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'almacenes',
    timestamps: true,
  }
);

export default Almacen;
