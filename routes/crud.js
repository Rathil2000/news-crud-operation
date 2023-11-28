const express = require('express');
const router = express.Router();
const { createNews, getAllNews, getNewsById, updateNews, deleteNews } = require('../controllers/crudController');
const auth = require('../middlewares/authMiddleware');

// router.use(authMiddleware); // Protect all routes with authentication

router.post('/create', auth, createNews);
router.get('/read', auth, getAllNews);
router.get('/read/:id', auth, getNewsById);
router.put('/update/:id', auth, updateNews);
router.delete('/delete/:id', auth, deleteNews);

module.exports = router;
