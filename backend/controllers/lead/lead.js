const db = require("../../db");

exports.NewLead = async (req, res) => {
    const { status, source, assigned, name, address, position, city, email, state, website, country, phonenumber, zip, lead_value, dafault_language, company, description, is_public } = req.body;
    console.log(status, source, assigned, name, address, position, city, email, state, website, country, phonenumber, zip, lead_value, dafault_language, company, description, is_public);
    try {
        const userAssigned = await new Promise((resolve, reject) => {
            db.query("select * from users where id = ?", [assigned], (err, result) => {
                if(err){
                    console.log("error in userAssigned", err);
                    reject("error in userAssigned");
                }else{
                    if(result === undefined){
                        return res.status(400).json({ success: false, message: "no assigned found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log(userAssigned);
        const userCoutry = await new Promise((resolve, reject) => {
            db.query("select * from tblcountries where country_id = ?", [country], (err, result) => {
                if(err){
                    console.log("error in userAssigned", err);
                    reject("error in userCoutry");
                }else{
                    if(!result){
                        return res.status(400).json({ success: false, message: "no country found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log(userCoutry);

        const userSource = await new Promise((resolve, reject) => {
            db.query("select * from tblleads_sources where id = ?", [source], (err, result) => {
                if(err){
                    console.log("error in userSource", err);
                    reject("error in userSource");
                }else{
                    if(!result){
                        return res.status(400).json({ success: false, message: "no source found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log(userSource);

        const userStatus = await new Promise((resolve, reject) => {
            db.query("select * from tblleads_status where id = ?", [status], (err, result) => {
                if(err){
                    console.log("error in userStatus", err);
                    reject("error in userStatus");
                }else{
                    if(!result){
                        return res.status(400).json({ success: false, message: "no status found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log(userStatus);
    } catch (error) {
        console.error("Error NewLead:", error);
        return res.status(400).json({ success: false, message: "Error NewLead", error: error });
    }
}