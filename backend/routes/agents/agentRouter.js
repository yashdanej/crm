const express = require('express');
const router = express.Router();
const agentController = require('../../controllers/agents/agents');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/addagent", verifyToken, agentController.AddAgent) // done
    .get("/getallagents", verifyToken, agentController.GetAllAgents)
    .get("/getagent/:id", verifyToken, agentController.GetAgent)
    .patch("/updateagent/:id", verifyToken, agentController.UpdateAgent) // done
    .delete("/deleteagent/:id", verifyToken, agentController.DeleteAgent) // done

module.exports = router;