const router = require('express').Router();
const postController = require('../controllers/post.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer();

/*----- POSTS -----*/
router.get('/', postController.readPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

/*----- LIKES -----*/
router.patch('/like-post/:id', postController.like);
router.patch('/unlike-post/:id', postController.unlike);

/*----- COMMENTS -----*/
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

/*----- PICTURE -----*/
router.post('/upload', upload.single('file'), uploadController.uploadProfile);

module.exports = router;