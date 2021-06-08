const express = require('express');
const router = express.Router();
const bookmarksController = require('../controllers/BookMarksController');


router.get('/', bookmarksController.index);

router.post('/add', bookmarksController.add);

router.post("/remove",bookmarksController.remove);

module.exports = router;
