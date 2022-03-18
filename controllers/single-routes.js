const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


// gets comment specified by id for comment edit/delete
router.get('/edit/:id', withAuth, (req, res) => {
    Comment.findOne({
        where: {
            id: req.params.id,
        },
        attributes: [
            'id',
            'comment_text',
            'user_id',
            'post_id',
        ],
        include: [
            {
                model: Post,
                attributes: ['id'],
            },
            {
                model: User,
                attributes: ['id']
            }
        ],
        })
        .then((dbCommentData) => {
            if (!dbCommentData) {
            res.status(404).json({ message: "No comment found with this id" });
            return;
            }

            // serialize the data
            const comment = dbCommentData.get({ plain: true });

            res.render('edit-comment', {
                comment,
                loggedIn: true
            });
    })
});

module.exports = router;