const express = require('express');
const router = express.Router();
const customerController = require('../../controllers/customer/customer');
const { verifyToken } = require('../../middleware/verifyToken');

router
    .post("/", verifyToken, customerController.createCustomer) // done
    .get("/", verifyToken, customerController.getCustomers) // done
    .get("/:id", verifyToken, customerController.getCustomerById) // done
    .patch("/:id", verifyToken, customerController.updateCustomer) // done
    .delete("/:id", verifyToken, customerController.deleteCustomer) // done

module.exports = router;