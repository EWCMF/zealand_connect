'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CVtype extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CVtype.belongsTo(models.CV, {
        as: 'cv',
        foreignKey: 'cv_id'
      });

      CVtype.belongsTo(models.Student, {
        as: 'student',
        foreignKey: 'student_id'
      });
    }
  };
  CVtype.init({
    cvType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CVtype',
  });
  return CVtype;
};