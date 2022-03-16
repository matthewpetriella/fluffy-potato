const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


// get all users
router.get('/', (req, res) => {
  Post.findAll({
    order: [['created_at', 'DESC']],
    attributes: [
      'id',
      'title',
      'description',
      'image_url',
      'user_id',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'description',
      'image_url',
      'user_id',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'user_id', 'created_at'],
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
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', description: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    description: req.body.description,
    image_url: req.body.image_url,
    user_id: req.session.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// these must come before the /:id route to avoid being considered a post id
// router.post('/vote', withAuth, (req, res) => {
//   Post.vote({ ...req.body, user_id: req.session.user_id }, { Vote })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

// router.delete('/vote', withAuth, (req, res) => {
//   Post.unvote({ ...req.body, user_id: req.session.user_id }, { Vote })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => {
//       console.log(err);
//       res.status(400).json(err);
//     });
// });

router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      description: req.body.description,
      image_url: req.body.image_url

    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// router.post("/image-upload", (request, response) => {
//   // collected image from a user
//   const data = {
//     image: request.body.image,
//   }

//   // upload image here
//   cloudinary.uploader.upload(data.image)
//     .then((result) => {
//       response.status(200).send({
//         message: "success",
//         result,
//       });
//     }).catch((error) => {
//       response.status(500).send({
//         message: "failure",
//         error,
//       });
//     });

// });


module.exports = router;
