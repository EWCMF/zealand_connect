'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CV extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CV.init({
    Overskrift: DataTypes.STRING,
    Uddannelse: DataTypes.STRING,
    Email: DataTypes.STRING,
    Sprog: DataTypes.STRING,
    Speciale: DataTypes.STRING,
    Telefon: DataTypes.INTEGER,
    LinkedIn: DataTypes.STRING,
    Om_mig: DataTypes.STRING,
    IT_Kompetencer: DataTypes.STRING,
    Udenlandsophold_og_frivilligt_arbejde: DataTypes.STRING,
    Erhvervserfaring: DataTypes.STRING,
    Tidligere_uddannelse: DataTypes.STRING,
    Hjemmeside: DataTypes.STRING,
    Fritidsinteresser: DataTypes.STRING,
    offentlig: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CV',
  });
  return CV;
};