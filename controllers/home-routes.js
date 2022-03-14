const router = require('express').Router();
const { Op } = require('sequelize');
const { Post, User, Comment, PostTag, UserTag, Tag, Vote } = require('../models');
const { withAuth } = require('../utils/auth');
const { getPostQueryAttributes, getPostQueryInclude, processPostsDbData, sortPosts } = require('../utils/query-utils');

router.get('/', (req, res) => {

  // if the user has never been to the site before, give a welcome message
  // need to create a welcome page that gives basic instructions for use
  if (!req.session.loggedIn && !req.cookies.cc) {
    return res.cookie('cc', 1, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }).render('homepage');
  }

  const attributes = getPostQueryAttributes(req.session);
  const include = getPostQueryInclude();

  Post.findAll({
    attributes,
    order: [['created_at', 'DESC'], ['id', 'DESC']],
    include
  })
    .then(dbPostData => {
      let posts = processPostsDbData(dbPostData, req.session);
      posts = sortPosts(posts, req.query);

      res.render('homepage', { posts, title: "Amazing Photos", loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

router.get('/user/:id', (req, res) => {

  const attributes = getPostQueryAttributes(req.session);
  const include = getPostQueryInclude();

  Post.findAll({
    where: {
      user_id: req.params.id
    },
    attributes,
    order: [['created_at', 'DESC'], ['id', 'DESC']],
    include
  })
    .then(dbPostData => {
      User.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['nickname']
      })
        .then(dbUserData => {
          if (dbUserData) {
            let posts = processPostsDbData(dbPostData, req.session);
            posts = sortPosts(posts, req.query);
            const nickname = dbUserData.dataValues.nickname;
            res.render('homepage', { posts, loggedIn: req.session.loggedIn, title: nickname + "'s Places", nextUrl: '/user/' + req.params.id, no_results: `${nickname} hasn't posted anything.` });
          } else {
            res.render('error', { status: 404, message: 'User not found' });
          }
        })
        .catch(err => {
          console.log(err);
          res.render('error', { status: 500, message: 'Internal Server Error' });
        });
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});
// tags are not being used yet.  Possible use in future development
const findByTag = function (tagString, session) {
  const tagsQuery = {
    attributes: ['id', 'tag_name'],
    include: {
      model: Post,
      through: {
        model: PostTag,
        attributes: []
      },
      attributes: ['id']
    }
  };

  const multiTags = tagString ? tagString.split(',') : [];
  if (multiTags.length) {
    tagsQuery.where = { tag_name: { [Op.in]: multiTags } };
  }

  return Tag.findAll(tagsQuery)
    .then(dbTagData => {
      const postIdArrays = dbTagData.map(tagData => tagData.get({ plain: true }).posts);
      let postIds = [];
      postIdArrays.forEach(postIdArr => {
        postIdArr.forEach(postId => {
          if (postIds.indexOf(postId.id) === -1) {
            postIds.push(postId.id);
          }
        })
      })

      const attributes = getPostQueryAttributes(session);
      const include = getPostQueryInclude();
      const postsQuery = {
        attributes,
        order: [['created_at', 'DESC'], ['id', 'DESC']],
        include
      };

      if (postIds.length) {
        postsQuery.where = { id: { [Op.in]: postIds } };
      } else if (tagString.length) {
        postsQuery.where = { id: 0 };
      }

      return Post.findAll(postsQuery);
    })
}

router.get('/tag/:tag_name', (req, res) => {
  findByTag(req.params.tag_name, req.session)
    .then(dbPostData => {
      let posts = processPostsDbData(dbPostData, req.session);
      posts = sortPosts(posts, req.query);

      const tag_string = req.params.tag_name.split(',').map(tag => tag[0].toUpperCase() + tag.substring(1)).join(', ');
      const homepageData = { posts, loggedIn: req.session.loggedIn, title: "Places for " + tag_string, tag_string, nextUrl: '/tag/' + req.params.tag_name, no_results: `No places match ${tag_string}.` };
      res.render('homepage', homepageData);
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

router.get('/interests', (req, res) => {

  User.findOne({
    where: {
      id: req.session.user_id
    },
    include: {
      model: Tag,
      attributes: ['id', 'tag_name'],
      through: {
        model: UserTag,
        attributes: []
      }
    }
  })
    .then(dbUserTagData => {
      const byTags = dbUserTagData.tags.map(tag => tag.get({ plain: true }).tag_name).join(',');
      findByTag(byTags, req.session)
        .then(dbPostData => {
          let posts = processPostsDbData(dbPostData, req.session);
          posts = sortPosts(posts, req.query);

          const title = 'Places you might enjoy';
          const homepageData = { posts, loggedIn: req.session.loggedIn, title, nextUrl: '/interests', no_results: `No places match your interests.` };
          res.render('homepage', homepageData);
        })
        .catch(err => {
          console.log(err);
          res.render('error', { status: 500, message: 'Internal Server Error' });
        });
    });
});

const getVoted = function (type, session) {
  return Vote.findAll({
    where: {
      user_id: session.user_id,
      like: { [Op.is]: (type === 'likes') }
    },
    attributes: ['post_id']
  })
    .then(votedPostIds => {
      const postIds = votedPostIds.map(postVote => postVote.get({ plain: true }).post_id);

      const attributes = getPostQueryAttributes(session);
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
  getVoted('likes', req.session)
    .then(dbPostData => {
      let posts = processPostsDbData(dbPostData, req.session);
      posts = sortPosts(posts, req.query);
      const homepageData = { posts, loggedIn: req.session.loggedIn, title: 'Places you like', nextUrl: '/likes' + req.params.id, no_results: "You haven't liked any places yet." };
      res.render('homepage', homepageData);
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/post/:id', (req, res) => {

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
    where: { id: req.params.id },
    attributes,
    include
  })
    .then(dbPostData => {
      if (!dbPostData) {
        return res.render('error', { status: 404, message: 'Post not found' });
      }
      const singlePost = {}
      singlePost.post = processPostsDbData([dbPostData], req.session)[0];
      singlePost.loggedIn = req.session.loggedIn;
      singlePost.showComments = singlePost.post.comment_count || req.session.loggedIn;
      singlePost.nextUrl = `/post/${req.params.id}`;
      res.render('single-post', singlePost);
    })
    .catch(err => {
      console.log(err);
      res.render('error', { status: 500, message: 'Internal Server Error' });
    });
});

module.exports = router;
