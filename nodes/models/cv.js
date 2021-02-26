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
      CV.belongsTo(models.Student, {
        as: 'student',
        foreignKey: 'student_id'
      });

      CV.belongsTo(models.Uddannelse, {
        as: "education",
        foreignKey: 'fk_education'
      })
      CV.belongsToMany(models.CVtype, {
        through: models.CV_CVtype,
        foreignKey: "cvtype_id",
        otherKey: "cv_id",
        as: "cvtype"
        /* options */ });
    }
  };
  CV.init({
    overskrift: DataTypes.STRING,
    email: DataTypes.STRING,
    sprog: DataTypes.STRING,
    speciale: DataTypes.STRING,
    telefon: DataTypes.STRING,
    linkedIn: DataTypes.STRING,
    yt_link: DataTypes.STRING,
    om_mig: DataTypes.TEXT,
    it_kompetencer: DataTypes.STRING,
    udenlandsophold_og_frivilligt_arbejde: DataTypes.TEXT,
    erhvervserfaring: DataTypes.TEXT,
    tidligere_uddannelse: DataTypes.TEXT,
    hjemmeside: DataTypes.STRING,
    fritidsinteresser: DataTypes.TEXT,
    offentlig: DataTypes.BOOLEAN,
    gyldig: DataTypes.BOOLEAN,
    postcode: DataTypes.INTEGER,
    city: DataTypes.STRING,
    geo_lat: DataTypes.DOUBLE,
    geo_lon: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'CV',
  });
  return CV;
};