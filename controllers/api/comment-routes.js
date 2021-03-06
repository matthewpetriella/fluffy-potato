const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


// GET all comments
router.get('/', (req, res) => {
    Comment.findAll({

    })
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST create a comment
router.post('/', withAuth, (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id
    })
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT update a comment
router.put('/:id', withAuth, (req, res) => {
    Comment.update({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id
    },
    {
        where: {
            id: req.params.id,
        },
    })
    .then((dbCommentData) => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE destroy a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id,
        },
    })
    .then((dbCommentData) => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
