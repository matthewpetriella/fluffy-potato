const router = require("express").Router();
const { User, Post, Comment, Vote } = require("../../models");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// // GET /api/users
// router.get("/", (req, res) => {
//     User.findAll({
//         attributes: { exclude: ['password'] } // added attribute to exclude password on GET It's in an array because 
//         // if we want to exclude more than one, we can just add more
//     })
//         .then((dbUserData) => res.json(dbUserData))
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// // GET /api/users/1
// router.get("/:id", (req, res) => {
//     User.findOne({
//         attributes: { exclude: ['password'] }, // Can be chained together
//         where: {
//             id: req.params.id
//         },
//         include: [
//             {
//                 model: Post,
//                 attributes: ['id', 'title', 'post_url', 'created_at']
//             },
//             // include the Comment model here:
//             {
//                 model: Comment,
//                 attributes: ['id', 'comment_text', 'created_at'],
//                 include: {
//                     model: Post,
//                     attributes: ['title']
//                 }
//             },
//             {
//                 model: Post,
//                 attributes: ['title'],
//                 through: Vote,
//                 as: 'voted_posts'
//             }
//         ]

//     })
//         .then((dbUserData) => {
//             if (!dbUserData) {
//                 res.status(404).json({ message: "No user found with this id" });
//                 return;
//             }
//             res.json(dbUserData);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });
// POST /api/users
router.post("/", upload.single('avatar'), (req, res,) => {
    console.log(req.file);
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
});

// router.post('/login', (req, res) => {
//     // expects {email: 'lernantino@gmail.com', password: 'password1234'}
//     User.findOne({
//         where: {
//             email: req.body.email
//         }
//     }).then(dbUserData => {
//         if (!dbUserData) {
//             res.status(400).json({ message: 'No user with that email address!' });
//             return;
//         }

//         //res.json({ user: dbUserData });

//         // Verify user
//         const validPassword = dbUserData.checkPassword(req.body.password);
//         if (!validPassword) {
//             res.status(400).json({ message: 'Incorrect password!' });
//             return;
//         }
//         req.session.save(() => {
//             // declare session variables
//             req.session.user_id = dbUserData.id;
//             req.session.username = dbUserData.username;
//             req.session.loggedIn = true;

//             res.json({ user: dbUserData, message: 'You are now logged in!' });

//         });
//     })
// });

// router.post('/logout', (req, res) => {
//     if (req.session.loggedIn) {
//         req.session.destroy(() => {
//             res.status(204).end();
//         });
//     } else {
//         res.status(404).end();
//     }

// });

// // PUT /api/users/1
// router.put("/:id", (req, res) => {
//     // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

//     // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
//     // This .update() method combines the parameters for creating data and looking up data.
//     // We pass in req.body to provide the new data we want to use in the update and
//     // req.params.id to indicate where exactly we want that new data to be used.

//     // pass in req.body instead to only update what's passed through
//     User.update(req.body, {
//         individualHooks: true, // This was added in as a requirement to use beforeUpdate hook in User model
//         where: {
//             id: req.params.id,
//             // sql version would be UPDATE users
//             // SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
//             // WHERE id = 1;
//         },
//     })
//         .then((dbUserData) => {
//             if (!dbUserData[0]) {
//                 res.status(404).json({ message: "No user found with this id" });
//                 return;
//             }
//             res.json(dbUserData);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

// // DELETE /api/users/1
// router.delete("/:id", (req, res) => {
//     //To delete data, use the .destroy() method and provide some type of identifier
//     // to indicate where exactly we would like to delete data from the user database table.
//     User.destroy({
//         where: {
//             id: req.params.id,
//         },
//     })
//         .then((dbUserData) => {
//             if (!dbUserData) {
//                 res.status(404).json({ message: "No user found with this id" });
//                 return;
//             }
//             res.json(dbUserData);
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json(err);
//         });
// });

module.exports = router;
