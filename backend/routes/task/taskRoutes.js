const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task/task');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/", verifyToken, taskController.createTask) // done
    .get("/", verifyToken, taskController.getAllTasks) // done
    .get("/:id", verifyToken, taskController.getTaskById) // done
    .patch("/:id", verifyToken, taskController.updateTask) // done
    .delete("/:id", verifyToken, taskController.deleteTask) // done

module.exports = router;