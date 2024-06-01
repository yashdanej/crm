const db = require("../../db");
const { verifyToken } = require("../../middleware/verifyToken");
const { Activity_log } = require("../utils/util");

exports.AddNotification = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const receiveid = req.params.receiveid;
        await new Promise((resolve, reject) => {
            db.query("select * from users where id = ?", [receiveid], (err, result) => {
                if(err){
                    console.log("error in AddNotification", err);
                    reject("error in AddNotification");
                }else{
                    if(result.length == 0){
                        return res.status(200).json({success: false, message: "No user found!"});
                    }else{
                        resolve(result);
                    }
                }
            });
        })
        const { type } = req.body;
        const addNotification = await new Promise((resolve, reject) => {
            db.query("insert into notification set ?", {senderuser_id: getUser, receiveuser_id: receiveid, type}, (err, result) => {
                if(err){
                    console.log("error in addNotification", err);
                    reject("error in addNotification");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        })
        console.log("addNotification", addNotification);
        const newNotification = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM notification WHERE id = ?", [addNotification.insertId], (err, result) => {
                if (err) {
                    console.log("error in retrieving new notification", err);
                    reject("error in retrieving new notification");
                } else {
                    resolve(result);
                }
            });
        });
        if(addNotification.affectedRows === 1){
            return res.status(200).json({ success: true, message: "Notification sent!", data: newNotification[0] })
        }else{
            return res.status(400).json({ success: false, message: "Error addNotification" });
        }
    } catch (error) {
        console.error("Error addNotification:", error);
        return res.status(400).json({ success: false, message: "Error addNotification", error: error });
    }
}

exports.GetNotification = async (req, res, next) => {
    try {
        const getNotification = await new Promise((resolve, reject) => {
            db.query("select * from notification where is_read = ?", [0], (err, result) => {
                if(err){
                    console.log("error in getNotification", err);
                    reject("error in getNotification");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getNotification.length>0){
            return res.status(200).json({ success: true, message: "Notification fetched successfully", data: getNotification })
        }else{
            return res.status(200).json({ success: true, message: "No notification found" });
        }
    } catch (error) {
        console.error("Error getNotification:", error);
        return res.status(400).json({ success: false, message: "Error getNotification", error: error });
    }
}

exports.GetUserNotification = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const getUserNotification = await new Promise((resolve, reject) => {
            db.query("select * from notification where receiveuser_id = ? and is_read = ?", [getUser, 0], (err, result) => {
                if(err){
                    console.log("error in getUserNotification", err);
                    reject("error in getUserNotification");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getUserNotification.length>0){
            return res.status(200).json({ success: true, message: "Notification fetched successfully", data: getUserNotification })
        }else{
            return res.status(200).json({ success: true, message: "No notification found" });
        }
    } catch (error) {
        console.error("Error getUserNotification:", error);
        return res.status(400).json({ success: false, message: "Error getUserNotification", error: error });
    }
}

exports.SeenNotification = async (req, res, next) => {
    try {
        const notification_id = req.params.notificationid;
        await new Promise((resolve, reject) => {
            db.query("select * from notification where id = ?", [notification_id], (err, result) => {
                if(err){
                    console.log("error in SeenNotification", err);
                    reject("error in SeenNotification");
                }else{
                    if(result.length == 0){
                        return res.status(200).json({success: false, message: "No notification id found!"});
                    }else{
                        resolve(result);
                    }
                }
            });
        })
        const seenNotification = await new Promise((resolve, reject) => {
            db.query("update notification set is_read = 1 where id = ?", [notification_id], (err, result) => {
                if(err){
                    console.log("error in seenNotification", err);
                    reject("error in seenNotification");
                }else{
                    resolve(result);
                }   
            });
        });

        // adding activity log
        req.body.description = `Notification seen`;
        await Activity_log(req, res, next);

        return res.status(200).json({success: true, message: "Notification seen successful"});
    } catch (error) {
        console.error("Error seenNotification:", error);
        return res.status(400).json({ success: false, message: "Error seenNotification", error: error });
    }
}

