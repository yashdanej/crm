const express = require('express');
const router = express.Router();
const agentController = require('../../controllers/agents/agents');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/addagent", verifyToken, agentController.AddAgent)
    .get("/getallagents", verifyToken, agentController.GetAllAgents)
    .get("/getagent/:id", verifyToken, agentController.GetAgent)
    .patch("/updateagent/:id", verifyToken, agentController.UpdateAgent)
    .delete("/deleteagent/:id", verifyToken, agentController.DeleteAgent)

module.exports = router;