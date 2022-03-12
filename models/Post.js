const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// create our Post model
class Post extends Model {
  static vote(body, models) {
    return models.Vote.upsert({
      user_id: body.user_id,
      post_id: body.post_id,
      like: body.like
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          [sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND `like`)"), "likes"],
          [sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND NOT `like`)"), "dislikes"],
          [sequelize.literal("(SELECT '" + (body.like ? 'like' : 'dislike') + "')"), "vote"]
        ],
      });
    });
  }

  // un-like or un-dislike a post
  static unvote(body, models) {
    return models.Vote.destroy({
      where: {
        user_id: body.user_id,
        post_id: body.post_id
      }
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          [sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND `like`)"), "likes"],
          [sequelize.literal("(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND NOT `like`)"), "dislikes"],
          [sequelize.literal("(SELECT 'no-vote')"), "vote"]
        ],
      });
    });
  }
}

// create fields/columns for Post model
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;
