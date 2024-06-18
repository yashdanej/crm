const express = require('express');
const router = express.Router();
const appoinmentController = require('../../controllers/appoinment/appoinment');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/", verifyToken, appoinmentController.createAppointment) // done
    .get("/", verifyToken, appoinmentController.getAppointments) // done
    .get("/:id", verifyToken, appoinmentController.getAppointmentById) // done
    .patch("/:id", verifyToken, appoinmentController.updateAppointment) // done
    .delete("/:id", verifyToken, appoinmentController.deleteAppointment) // done
    .patch("/complete/:id", verifyToken, appoinmentController.CompleteAppointment) // done

module.exports = router;