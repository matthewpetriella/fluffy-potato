// import all models
// tags are being left in for future development but not used at this time
const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');
const Tag = require('./Tag');
const UserTag = require('./UserTag');
const PostTag = require('./PostTag');

// create associations
Post.belongsToMany(Tag, {
  through: PostTag,
  foreignKey: 'post_id'
});

Tag.belongsToMany(Post, {
  through: PostTag,
  foreignKey: 'tag_id'
});

User.belongsToMany(Tag, {
  through: UserTag,
  foreignKey: 'user_id'
});

Tag.belongsToMany(User, {
  through: UserTag,
  foreignKey: 'tag_id'
});

User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id'
});

User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment, Tag, PostTag, UserTag };
