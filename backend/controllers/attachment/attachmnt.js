const db = require("../../db");
const { verifyToken } = require("../../middleware/verifyToken");
const cloudinary = require("../utils/cloudinary");
const util = require("util");
const { Activity_log } = require("../utils/util");
const query = util.promisify(db.query).bind(db);

exports.Attachment = async (req, res, next) => {
    try {
    const rel_id = req.params.rel_id;
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "crm",
        resource_type: "auto"
    });
    console.log("result", result);
    const { rel_type } = req.body;
    const file_name = result.original_filename;
    const filetype = result.format?result.format:"Not recognised";
    const attachment_key = result.public_id;
    const external_link = result.secure_url;
        const getUser = await verifyToken(req, res, next, true);
        const addAttachment = await query("insert into tblfiles set ?", {
            rel_id,
            rel_type,
            file_name,
            filetype,
            attachment_key,
            external_link,
            staffid: getUser,
            dateadded: new Date()
        });
        if(addAttachment.affectedRows == 1){
            const getFile = await query("select * from tblfiles where id = ?", [addAttachment.insertId]);
            req.body.description = `Added attachment in lead id: [${rel_id}] and filname: [${file_name}] and url: [${external_link}]`;
            req.body.leadid = rel_id;
            await Activity_log(req, res, next);
            return res.status(200).json({success: false, message: "Attchment added successfully", data: getFile})
        }else{
            return res.status(400).json({success: false, message: "No attchment added"})
        }
    } catch (error) {
        console.log("error in Attachment", error);
        return res.status(400).json({success: false, message: error})
    }
}

exports.GetAttachment = async (req, res) => {
    try {
        const rel_id = req.params.rel_id;
        const rel_type = req.params.rel_type;
        const getAttachment = await query("select * from tblfiles where rel_id = ? and rel_type = ?", [rel_id, rel_type]);
        if(getAttachment.length>0){
            return res.status(200).json({success: true, message: "Attachment fetched successfully", data: getAttachment});
        }else{
            return res.status(200).json({success: true, message: "No attachment found", data: []});
        }
    } catch (error) {
        console.log("error in GetAttachment", error);
        return res.status(400).json({success: false, message: error})
    }
}