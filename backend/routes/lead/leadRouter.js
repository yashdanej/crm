const express = require('express');
const router = express.Router();
const leadController = require('../../controllers/lead/lead');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/newlead", verifyToken, leadController.NewLead)
    .get("/getleads", verifyToken, leadController.GetLead)
    .get("/viewlead/:id", verifyToken, leadController.ViewLead)
    .get("/getcountries", verifyToken, leadController.GetCountries)
    .get("/getstatus", verifyToken, leadController.GetStatus)
    .get("/getsources", verifyToken, leadController.GetSources)
    .get("/leadssearch", verifyToken, leadController.LeadsSearch)
    .patch("/statuschange", verifyToken, leadController.StatusChange)
    .patch("/updatelead/:id", verifyToken, leadController.UpdateLead)

module.exports = router;