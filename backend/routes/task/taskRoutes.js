const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task/task');
const { verifyToken } = require('../../middleware/verifyToken');
const { upload, xlsxUpload } = require('../../middleware/upload');

router
    // tbltasks table
    .post("/", verifyToken, taskController.createTask) // done
    .get("/", verifyToken, taskController.getAllTasks) // done
    .get("/:id", verifyToken, taskController.getTaskById) // done
    .patch("/:id", verifyToken, taskController.updateTask) // done
    .delete("/:id", verifyToken, taskController.deleteTask) // done

    // tbltask_assigned table
    .post('/task-assigned', verifyToken, taskController.createTaskAssigned)
    .get("/task-assigned/:taskid", verifyToken, taskController.getAllTaskAssigned)
    .get('/task-assigned/:id', verifyToken, taskController.getTaskAssignedById)
    .patch('/task-assigned/:taskid', verifyToken, taskController.updateTaskAssigned)
    .delete('/task-assigned/:id', verifyToken, taskController.deleteTaskAssigned)

    // tbltask_followers table
    .post('/task-follower', verifyToken, taskController.createTaskFollowers)
    .patch('/task-follower/:taskid', verifyToken, taskController.updateTaskFollowers)
    .get("/task-follower/:taskid", verifyToken, taskController.getTaskFollowers)

    // tbltask_comments table
    .post('/task-comment', verifyToken, upload.single("file"), taskController.createTaskComment)
    .get('/task-comment/:taskid', verifyToken, taskController.getTaskComments)
    .delete('/task-comment/:id', verifyToken, taskController.deleteTaskComment)

    // tbltasktimers
    .post('/task-timer', verifyToken, taskController.startTaskTimer)
    .patch('/task-timer/:id', verifyToken, taskController.endTaskTimer)
    .get('/task-timer/get', verifyToken, taskController.getTaskTimers)

    // tbltasks_checklist_item
    .post('/checklist-item', verifyToken, taskController.createChecklistItem )
    .get('/checklist-item/:taskid', verifyToken, taskController.getChecklistItems )
    .patch('/checklist-item/:id', verifyToken, taskController.updateChecklistItem )
    .delete('/checklist-item/:id', verifyToken, taskController.deleteChecklistItem )

    // tbltasks_checklist_templates
    .post('/checklist-templates', verifyToken, taskController.createChecklistTemplate )
    .get('/checklist-templates/:user_id', verifyToken, taskController.getChecklistTemplates )
    .delete('/checklist-templates/:id', verifyToken, taskController.deleteChecklistTemplate )

module.exports = router;