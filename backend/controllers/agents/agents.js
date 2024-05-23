const db = require("../../db");
const { verifyToken } = require("../../middleware/verifyToken");

exports.AddAgent = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser = true);
        const getSelectedUser = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [getUser], (err, result) => {
                if (err) {
                    console.error("Error getSelectedUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });

        if (getSelectedUser.role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }
        const { name } = req.body;
        const existAgent = await new Promise((resolve, reject) => {
            db.query("select * from agents where name = ?", [name], (err, result) => {
                if (err) {
                    console.error(`Error in existAgent:`, err);
                    reject(err);
                } else {
                    console.log(`results`, result);
                    resolve({ success: true, result });
                }
            });
        });
        console.log('existAgent.result', existAgent.result.length);
        if(existAgent.result.length > 0){
            return res.status(200).json({success: true, message: "This agent already exists!"});
        }else{
            if(name){
                const newAgent = await new Promise((resolve, reject) => {
                    db.query("insert into agents set ?", {name, addedfrom: getUser}, (err, result) => {
                        if (err) {
                            console.error(`Error in newAgent:`, err);
                            reject(err);
                        } else {
                            console.log(`result`, result);
                            resolve({ success: true, result });
                        }
                    });
                })
                return res.status(200).json({success: true, message: "Agent added successfully"});
            }else{
                console.error("Error in newAgent:", error);
                return res.status(400).json({ success: false, message: "Name is required" }); 
            }
        }
    } catch (error) {
        console.error("Error in AddAgent:", error);
        return res.status(400).json({ success: false, message: "Error in AddAgent", error: error });
    }
}

exports.GetAllAgents = async (req, res, next) => {
    try {
        const getAllAgents = await new Promise((resolve, reject) => {
            db.query("select * from agents", (err, result) => {
                if(err){
                    console.log("error in getAllAgents", err);
                    reject("error in getAllAgents");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getAllAgents.length>0){
            return res.status(200).json({ success: true, message: "Agents fetched successfully", data: getAllAgents })
        }else{
            return res.status(200).json({ success: true, message: "No agent profile found" });
        }
    } catch (error) {
        console.error("Error getAllAgents:", error);
        return res.status(400).json({ success: false, message: "Error getAllAgents", error: error });
    }
}

exports.GetAgent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const getAgent = await new Promise((resolve, reject) => {
            db.query("select * from agents where id = ?", [id], (err, result) => {
                if(err){
                    console.log("error in getAgent", err);
                    reject("error in getAgent");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getAgent.length>0){
            return res.status(200).json({ success: true, message: "Agent fetched successfully", data: getAgent })
        }else{
            return res.status(200).json({ success: true, message: "No agent found" });
        }
    } catch (error) {
        console.error("Error getAgent:", error);
        return res.status(400).json({ success: false, message: "Error getAgent", error: error });
    }
}

exports.UpdateAgent = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser = true);
        const getSelectedUser = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [getUser], (err, result) => {
                if (err) {
                    console.error("Error getSelectedUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });

        if (getSelectedUser.role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }
        const { name } = req.body;
        const id = req.params.id;
        const existAgent = await new Promise((resolve, reject) => {
            db.query("select * from agents where name = ?", [name], (err, result) => {
                if (err) {
                    console.error(`Error in existAgent:`, err);
                    reject(err);
                } else {
                    console.log(`results`, result);
                    resolve({ success: true, result });
                }
            });
        });
        console.log('existAgent.result[0].id', existAgent.result[0]?.id);
        if(existAgent.result.length > 0 && existAgent.result[0]?.id != id ){
            return res.status(200).json({success: true, message: "This agent already exists!"});
        }else{
            if(name){
                const updateAgent = await new Promise((resolve, reject) => {
                    db.query("update agents set name = ?, addedfrom = ? where id = ?", [name, getUser, id], (err, result) => {
                        if (err) {
                            console.error(`Error in updateAgent:`, err);
                            reject(err);
                        } else {
                            console.log(`result`, result);
                            resolve({ success: true, result });
                        }
                    });
                })
                return res.status(200).json({success: true, message: "Agent updated successfully"});
            }else{
                console.error("Error in updateAgent:", error);
                return res.status(400).json({ success: false, message: "Name is required" }); 
            }
        }
    } catch (error) {
        console.error("Error in updateAgent:", error);
        return res.status(400).json({ success: false, message: "Error in updateAgent", error: error });
    }
}

exports.DeleteAgent = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser = true);
        const getSelectedUser = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM users WHERE id = ?", [getUser], (err, result) => {
                if (err) {
                    console.error("Error getSelectedUser:", err);
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });

        if (getSelectedUser.role === 1) {
            return res.status(400).json({ success: false, message: "Permission denied" });
        }
        const id = req.params.id;
        if(!id){
            return res.status(400).json({ success: false, message: "No id provided" });
        }
        const deleteAgent = await new Promise((resolve, reject) => {
            db.query("delete from agents where id = ?", [id], (err, result) => {
                if(err){
                    console.log("error in deleteAgent", err);
                    reject("error in deleteAgent");
                }else{
                    resolve(result);
                }   
            });
        });
        console.log("deleteAgent", deleteAgent);
        if(deleteAgent.affectedRows == 1){
            return res.status(200).json({ success: true, message: "Agent deleted successfully" })
        }else{
            return res.status(200).json({ success: true, message: "No agent found" });
        }
    } catch (error) {
        console.error("Error deleteAgent:", error);
        return res.status(400).json({ success: false, message: "Error deleteAgent", error: error });
    }
}
