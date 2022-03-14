// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/connection');

// class Comment extends Model {}

// Comment.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     comment_text: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: [1]
//       }
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: 'user',
//         key: 'id'
//       }
//     },
//     post_id: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: 'post',
//         key: 'id'
//       }
//     }
//   },
//   {
//     sequelize,
//     freezeTableName: true,
//     underscored: true,
//     modelName: 'comment'
//   }
// );

// module.exports = Comment;

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create comment model
class Comment extends Model { }
// Table Column Definitions

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    comment_text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'comment',
  }
);

module.exports = Comment;
