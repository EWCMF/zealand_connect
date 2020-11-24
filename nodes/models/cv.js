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
    overskrift: DataTypes.STRING,
    uddannelse: DataTypes.STRING,
    email: DataTypes.STRING,
    sprog: DataTypes.STRING,
    speciale: DataTypes.STRING,
    telefon: DataTypes.INTEGER,
    linkedIn: DataTypes.STRING,
    yt_link: DataTypes.STRING,
    om_mig: DataTypes.STRING,
    it_kompetencer: DataTypes.STRING,
    udenlandsophold_og_frivilligt_arbejde: DataTypes.STRING,
    erhvervserfaring: DataTypes.STRING,
    tidligere_uddannelse: DataTypes.STRING,
    hjemmeside: DataTypes.STRING,
    fritidsinteresser: DataTypes.STRING,
    offentlig: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CV',
  });
  return CV;
};