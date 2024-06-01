const express = require('express');
const router = express.Router();
const leadController = require('../../controllers/lead/lead');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/newlead", verifyToken, leadController.NewLead) // email, whatsapp, // done
    .get("/getleads", verifyToken, leadController.GetLead)
    .get("/viewlead/:id", verifyToken, leadController.ViewLead)
    .get("/getcountries", verifyToken, leadController.GetCountries)
    .get("/getstatus", verifyToken, leadController.GetStatus)
    .post("/addstatus", verifyToken, leadController.AddStatus) // done
    .get("/getsources", verifyToken, leadController.GetSources)
    .post("/addsources", verifyToken, leadController.AddSource) // done
    .get("/getusers/:id?", verifyToken, leadController.GetUsers)
    .get("/leadssearch", verifyToken, leadController.LeadsSearch)
    .patch("/statuschange", verifyToken, leadController.StatusChange) // email, whatsapp // done
    .patch("/updatelead/:id", verifyToken, leadController.UpdateLead) // email, whatsapp // done
    .get("/kanbanview", verifyToken, leadController.KanbanView)
    .patch("/bulkaction", verifyToken, leadController.BulkAction) // email, whatsapp // done
    .post("/convert/:leadid", verifyToken, leadController.ConvertToCustomer) // email, whatsapp // done

    // Customization - ProfileOfClient
    .post("/addprofileofclient", verifyToken, leadController.AddProfileOfClient) // done
    .get("/getallprofileofclients", verifyToken, leadController.GetAllProfileOfClients)
    .get("/getprofileofclient/:id", verifyToken, leadController.GetProfileOfClient)
    .patch("/updateprofileofclient/:id", verifyToken, leadController.UpdateProfileOfClient) // done
    .delete("/deleteprofileofclient/:id", verifyToken, leadController.DeleteProfileOfClient) // done

    // Customization - ProfileOfClient
    .post("/addtypeofwork", verifyToken, leadController.AddTypeOfWork) // done
    .get("/getalltypesofwork", verifyToken, leadController.GetAllTypesOfWork)
    .get("/gettypeofwork/:id", verifyToken, leadController.GetTypeOfWork)
    .patch("/updatetypeofwork/:id", verifyToken, leadController.UpdateTypeOfWork) // done
    .delete("/deletetypeofwork/:id", verifyToken, leadController.DeleteTypeOfWork) // done

module.exports = router;