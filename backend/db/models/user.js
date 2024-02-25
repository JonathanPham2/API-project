'use strict';
const {
  Model,
  Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate :{
        len: [4,30],
        isNotEmail(value) {
          if(Validator.isEmail(value)) {
            throw new Error("Cannot be an email")
          }

        }
       
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [3,256]
      }
    
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isCapitalize(value) {
          if(value[0] !== value[0].toUpperCase()){
            value = value[0].toUpperCase()
          }
        },
        len: [4,60]
      }


    },
    lastName: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        isCapitalize(value) {
          if(value[0] !== value[0].toUpperCase()){
            value = value[0].toUpperCase()
          }
        },
        len: [4, 60]

      }

    },
    hashedPassword:{type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate:{
        len: [60, 60]
      }
    
    
    }
  }, {
    sequelize,
    modelName: 'User',

    defaultScope: {
      attributes: {
        exclude: ["email", "hashedPassword", "createdAt", "updatedAt"]
      }
    }
  },

  );
  return User;
};