const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get all posts for dashboard
router.get('/', withAuth, (req, res) => {
  User.findOne({
    where: {
      id: req.session.user_id
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'User Not Found' });
    }
    else {
      userAvatar = dbUserData.avatar_url;
      userName = dbUserData.username;
      console.log("Avatar URL is  " + userAvatar);
    }
  });

  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'title',
      'description',
      'image_url',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username', 'avatar_url']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true, userAvatar, userName });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get route for user to create a new post
router.get('/new', withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
    order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'title',
      'description',
      'image_url',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        // gets comment, the creator's username, and date created
        attributes: ['id', 'comment_text', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        // gets username for post
        attributes: ['username', 'avatar_url']
      }
    ]
  })
    .then((dbPostData) => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('new-post', { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


// post edit by id 

router.get('/edit/:id', withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
    attributes: [
      'id',
      'title',
      'description',
      'image_url',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username', 'avatar_url']
      }
    ]
  })
    .then(dbPostData => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });

        res.render('edit-post', {
          post,
          loggedIn: true
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
