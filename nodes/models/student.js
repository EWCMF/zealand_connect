'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            // define association here
            Student.hasOne(models.CV, {
                as: 'cv',
                foreignKey: 'student_id'
            });

            Student.belongsToMany(models.InternshipPost, {
                through: models.FavouritePost,
                foreignKey: "student_id",
                as: "favouritePost"
            });
        }
    };
    Student.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        fornavn: DataTypes.STRING,
        efternavn: DataTypes.STRING,
        tlfnr: DataTypes.STRING,
        foedselsdato: DataTypes.DATE,
        profilbillede: DataTypes.STRING,
        last_login: DataTypes.DATE,
        user_data_consent: DataTypes.BOOLEAN,
        email_notification_date: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Student',
    });
    return Student;
};
