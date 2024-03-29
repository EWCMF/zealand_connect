'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfessorCV extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProfessorCV.belongsTo(models.Professor, {
        foreignKey: 'professor_id',
        as: 'professor'
      });

      ProfessorCV.belongsToMany(models.Uddannelse, {
        through: models.ProfessorCV_Education,
        foreignKey: 'cv_id'
      });

      ProfessorCV.belongsTo(models.ProfessorPosition, {
        foreignKey: 'position_id',
        as: 'position'
      });

      ProfessorCV.belongsTo(models.ProfessorCampus, {
        foreignKey: 'campus_id',
        as: 'campus',
      })
    }
  };
  ProfessorCV.init({
    overskrift: DataTypes.STRING,
    email: DataTypes.STRING,
    telefon: DataTypes.STRING,
    sprog: DataTypes.STRING,
    linkedIn: DataTypes.STRING,
    website: DataTypes.STRING,
    postcode: DataTypes.INTEGER,
    city: DataTypes.STRING,
    arbejdssted: DataTypes.STRING,
    teaches: DataTypes.STRING,
    about: DataTypes.TEXT,
    it_kompetencer: DataTypes.TEXT,
    interesser: DataTypes.STRING,
    erhvervserfaring: DataTypes.TEXT,
    tidligere_uddannelse: DataTypes.TEXT,
    tidligere_projekter: DataTypes.TEXT,
    offentlig: DataTypes.BOOLEAN,
    
  }, {
    sequelize,
    modelName: 'ProfessorCV',
  });
  return ProfessorCV;
};