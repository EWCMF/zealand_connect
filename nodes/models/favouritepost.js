'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class FavouritePost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    FavouritePost.init({
        student_id: DataTypes.INTEGER,
        internship_post_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'FavouritePosts',
    });
    return FavouritePost;
};