const express = require('express');
const router = express.Router();
const leadController = require('../../controllers/lead/lead');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/newlead", verifyToken, leadController.NewLead) // email, whatsapp
    .get("/getleads", verifyToken, leadController.GetLead)
    .get("/viewlead/:id", verifyToken, leadController.ViewLead)
    .get("/getcountries", verifyToken, leadController.GetCountries)
    .get("/getstatus", verifyToken, leadController.GetStatus)
    .post("/addstatus", verifyToken, leadController.AddStatus)
    .get("/getsources", verifyToken, leadController.GetSources)
    .post("/addsources", verifyToken, leadController.AddSource)
    .get("/getusers/:id?", verifyToken, leadController.GetUsers)
    .get("/leadssearch", verifyToken, leadController.LeadsSearch)
    .patch("/statuschange", verifyToken, leadController.StatusChange) // email, whatsapp
    .patch("/updatelead/:id", verifyToken, leadController.UpdateLead) // email, whatsapp
    .get("/kanbanview", verifyToken, leadController.KanbanView)
    .patch("/bulkaction", verifyToken, leadController.BulkAction) // email, whatsapp
    .post("/convert/:leadid", verifyToken, leadController.ConvertToCustomer) // email, whatsapp

    // Customization - ProfileOfClient
    .post("/addprofileofclient", verifyToken, leadController.AddProfileOfClient)
    .get("/getallprofileofclients", verifyToken, leadController.GetAllProfileOfClients)
    .get("/getprofileofclient/:id", verifyToken, leadController.GetProfileOfClient)
    .patch("/updateprofileofclient/:id", verifyToken, leadController.UpdateProfileOfClient)
    .delete("/deleteprofileofclient/:id", verifyToken, leadController.DeleteProfileOfClient)

    // Customization - ProfileOfClient
    .post("/addtypeofwork", verifyToken, leadController.AddTypeOfWork)
    .get("/getalltypesofwork", verifyToken, leadController.GetAllTypesOfWork)
    .get("/gettypeofwork/:id", verifyToken, leadController.GetTypeOfWork)
    .patch("/updatetypeofwork/:id", verifyToken, leadController.UpdateTypeOfWork)
    .delete("/deletetypeofwork/:id", verifyToken, leadController.DeleteTypeOfWork)

module.exports = router;