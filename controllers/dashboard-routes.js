const router = require('express').Router();
const sequelize = require('../config/connection');
const { Op } = require('sequelize');
const { Post, User, Comment, Tag, Vote, UserTag } = require('../models');
const { withAuth } = require('../utils/auth');
const { getPostQueryAttributes, getPostQueryInclude, processPostsDbData, sortPosts } = require('../utils/query-utils');

const POST_IMAGE_WIDTH = 400;

router.get('/', withAuth, (req, res) => {
  User.findOne({
    where: {
      id: req.session.user_id
    },
    attributes: [
      'id',
      'username',
      'nickname',
      'email',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE user.id = vote.user_id AND `like`)'), 'likes_count'],
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE user.id = vote.user_id AND NOT`like`)'), 'dislikes_count']
    ],
    include: [
      {
        model: Tag,
        attributes: [['id', 'tag_id'], 'tag_name'],
        through: {
          model: UserTag,
          attributes: []
        }
      }
    ]
  })
    .then(dbUserData => {
      const user = dbUserData.get({ plain: true });

      const attributes = getPostQueryAttributes(req.session);
      const include = getPostQueryInclude();

      return Post.findAll({
        where: {
          user_id: req.session.user_id
        },
        attributes,
        order: [['created_at', 'DESC'], ['id', 'DESC']],
        include
      })
        .then(dbPostData => {
          let posts = processPostsDbData(dbPostData, req.session);
          posts = sortPosts(posts, req.query);

          posts.forEach(post => { post.allowEdit = true; });
          return { user, posts };
        });
    })
    .then(({ user, posts }) => {
      const selectedTagIds = user.tags.map(tag => tag.tag_id);
      return Tag.findAll({
        attributes: [['id', 'tag_id'], 'tag_name'],
        order: [['tag_name', 'ASC']]
      })
        .then(dbTagData => {
          const allTags = dbTagData.map(tag => {
            const merged = tag.get({ plain: true });
            merged.selected = selectedTagIds.includes(merged.tag_id);
            return merged;
          });

          const dashboard = {
            user,
            posts,
            other_tags: allTags,
            loggedIn: req.session.loggedIn
          };
          res.render('dashboard-posts', dashboard);
        })
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

const getVoted = function (req, type) {
  return Vote.findAll({
    where: {
      user_id: req.session.user_id,
      like: { [Op.is]: (type === 'likes') }
    },
    attributes: ['post_id']
  })
    .then(votedPostIds => {
      const postIds = votedPostIds.map(postVote => postVote.get({ plain: true }).post_id);

      const attributes = getPostQueryAttributes(req.session);
      const include = getPostQueryInclude();

      return Post.findAll({
        where: {
          id: { [Op.in]: postIds }
        },
        attributes,
        order: [['created_at', 'DESC'], ['id', 'DESC']],
        include
      });
    });
};

router.get('/likes', withAuth, (req, res) => {
  getVoted(req, 'likes')
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      posts.forEach(post => {
        post.image_url_sized = post.image_url ? post.image_url.replace('upload/', 'upload/' + `c_scale,w_${POST_IMAGE_WIDTH}/`) : '';
        post.liked = true;
      });
      res.render('dashboard-likes', { posts, tab: 'Liked', loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

router.get('/dislikes', withAuth, (req, res) => {
  getVoted(req, 'dislikes')
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      console.log('disliked posts', posts);
      posts.forEach(post => {
        post.image_url_sized = post.image_url ? post.image_url.replace('upload/', 'upload/' + `c_scale,w_${POST_IMAGE_WIDTH}/`) : '';
        post.disliked = true;
      });
      res.render('dashboard-likes', { posts, tab: 'Disliked', loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

router.get('/create', withAuth, (req, res) => {
  const post = {
    id: 0,
    title: '',
    description: '',
    image_url: '',
    tags: [],
    loggedIn: req.session.loggedIn
  }
  Tag.findAll({
    attributes: ['id', 'tag_name']
  })
    .then(dbTagData => {
      const tags = dbTagData.map(tag => tag.get({ plain: true }));
      res.render('edit-post', { post, tags, loggedIn: req.session.loggedIn });
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
  const attributes = getPostQueryAttributes(req.session);
  const include = getPostQueryInclude();
  include.push({
    model: Comment,
    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
    include: {
      model: User,
      attributes: ['nickname']
    }
  });

  Post.findOne({
    where: {
      id: req.params.id,
      user_id: req.session.user_id
    },
    attributes,
    include
  })
    .then(dbPostData => {
      if (!dbPostData) {
        return res.render('error', { status: 404, message: 'Post not found' });
      }
      const post = processPostsDbData([dbPostData], req.session)[0];

      // tags are not being used at this time, but code will be used in the future
      Tag.findAll({
        attributes: ['id', 'tag_name']
      })
        .then(dbTagData => {
          const tags = dbTagData.map(tag => {
            const currentTag = tag.get({ plain: true });
            currentTag.checked = post.tags.filter(postTag => currentTag.id === postTag.tag_id).length > 0;
            return currentTag;
          });
          post.loggedIn = req.session.loggedIn;
          res.render('edit-post', { post, tags, loggedIn: req.session.loggedIn });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

module.exports = router;