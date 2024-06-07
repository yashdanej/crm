const util = require('util');
const { Activity_log } = require('../utils/util');
const db = require('../../db');
const { verifyToken } = require('../../middleware/verifyToken');

const query = util.promisify(db.query).bind(db);

exports.addNote = async (req, res, next) => {
 try {
    const getUser = await verifyToken(req, res, next, verifyUser=true);
    const rel_id = req.params.rel_id;
    const { rel_type, description, date_contacted = null } = req.body;
    const addingNote = await query("insert into tblnotes set ?", {
        rel_id,
        rel_type,
        description,
        date_contacted,
        addedfrom: getUser
    });
    console.log("addingNote", addingNote);
    if(addingNote.affectedRows === 1){
        req.body.description = `Added note in lead id: [${rel_id}] and description: [${description}]${date_contacted && `, date contacted: ${date_contacted}`}`;
        req.body.leadid = rel_id;
        await Activity_log(req, res, next);
        const noteData = await query("select * from tblnotes where id = ?", [addingNote.insertId]);
        return res.status(200).json({success: true, message: "Note added successfully", data: noteData});
    }else{
        return res.status(500).json({success: false, message: "Internal sever error"});
    }
 } catch (error) {
    console.log("error in addNote", error);
 }
}

exports.getNotes = async (req, res, next) => {
    try {
        const rel_id = req.params.rel_id;
        const addingNote = await query("select * from tblnotes where rel_id = ?", [rel_id]);
        console.log("addingNote", addingNote);
        if(addingNote.length > 0){
            return res.status(200).json({success: true, message: "Notes fetched successfully!", data: addingNote});
        }else{
            return res.status(200).json({success: true, message: "No note found!", data: []});
        }
     } catch (error) {
        console.log("error in addNote", error);
     }
}