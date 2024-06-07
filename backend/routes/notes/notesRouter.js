const express = require('express');
const router = express.Router();
const notesController = require('../../controllers/notes/notes');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/addnote/:rel_id", verifyToken, notesController.addNote) // done
    .get("/:rel_id", verifyToken, notesController.getNotes) // done

module.exports = router;