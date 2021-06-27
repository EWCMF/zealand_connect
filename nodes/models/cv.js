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

      CV.belongsTo(models.Education, {
        as: "education",
        foreignKey: 'fk_education'
      })

      // Relationship for CVtype
      CV.belongsToMany(models.CVtype, {
        through: models.CV_CVtype,
        foreignKey: "cv_id",
        as: "cvtype"
        /* options */ });

      // Relationship for FavouriteCV
      CV.belongsToMany(models.Virksomhed, {
        through: models.FavouriteCV,
        foreignKey: "cv_id"
      });
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
    it_kompetencer: DataTypes.TEXT,
    udenlandsophold_og_frivilligt_arbejde: DataTypes.TEXT,
    erhvervserfaring: DataTypes.TEXT,
    tidligere_uddannelse: DataTypes.TEXT,
    hjemmeside: DataTypes.STRING,
    fritidsinteresser: DataTypes.TEXT,
    availability: DataTypes.INTEGER,
    gyldig: DataTypes.BOOLEAN,
    postcode: DataTypes.INTEGER,
    city: DataTypes.STRING,
    geo_lat: DataTypes.DOUBLE,
    geo_lon: DataTypes.DOUBLE,
    post_subscription: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'CV',
  });
  return CV;
};