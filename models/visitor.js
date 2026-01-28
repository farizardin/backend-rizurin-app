'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Visitor extends Model {
        static associate(models) {
            // define association here
        }
    }
    Visitor.init({
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        visitCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Visitor',
    });
    return Visitor;
};
