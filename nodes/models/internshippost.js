'use strict';
const {
    Model, STRING
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class InternshipPost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            InternshipPost.belongsTo(models.Virksomhed, {
                as: 'virksomhed',
                foreignKey: 'fk_company'
            });

            InternshipPost.belongsToMany(models.Uddannelse, {
                through: models.InternshipPost_Education,
                as: 'education',
                foreignKey: 'education_id'
            });

            InternshipPost.belongsToMany(models.Student, {
                through: models.FavouritePost,
                foreignKey: "internship_post_id",
                as: "likedBy"
            });
        }
    };
    InternshipPost.init({
        title: DataTypes.STRING,
        post_type: DataTypes.INTEGER,
        email: DataTypes.STRING,
        contact: DataTypes.STRING,
        country: DataTypes.INTEGER,
        region: DataTypes.STRING,
        post_start_date: DataTypes.STRING,
        post_end_date: DataTypes.STRING,
        post_text: DataTypes.TEXT,
        city: DataTypes.TEXT,
        postcode: DataTypes.INTEGER,
        cvr_number: DataTypes.INTEGER,
        company_link: DataTypes.TEXT,
        post_document: DataTypes.STRING,
        dawa_json: DataTypes.TEXT,
        dawa_uuid: DataTypes.STRING,
        expired: DataTypes.BOOLEAN,
        phone_number: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'InternshipPost',
    });
    return InternshipPost;
};
