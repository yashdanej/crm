const db = require("../../db");
const { verifyToken } = require("../../middleware/verifyToken");
const querystring = require('querystring');
const url = require('url');

exports.NewLead = async (req, res, next) => {
    const { status, source, assigned, name, address, position, city, email, state, website, country, phonenumber, zip, lead_value, default_language, company, description, is_public } = req.body;
    console.log(status, source, assigned, name, address, position, city, email, state, website, country, phonenumber, zip, lead_value, default_language, company, description, is_public);
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        console.log('userAddedFrom', getUser);
        const userAssigned = await new Promise((resolve, reject) => {
            db.query("select * from users where id = ?", [assigned], (err, result) => {
                if(err){
                    console.log("error in userAssigned", err);
                    reject("error in userAssigned");
                }else{
                    console.log('result', result);
                    if(result === undefined || result.length === 0){
                        return res.status(400).json({ success: false, message: "no assigned user found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log('userAssigned', userAssigned);
        const userCoutry = await new Promise((resolve, reject) => {
            db.query("select * from tblcountries where country_id = ?", [country], (err, result) => {
                if(err){
                    console.log("error in userAssigned", err);
                    reject("error in userCoutry");
                }else{
                    if(!result || result.length === 0){
                        return res.status(400).json({ success: false, message: "no country found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log('userCoutry', userCoutry);

        const userSource = await new Promise((resolve, reject) => {
            db.query("select * from tblleads_sources where id = ?", [source], (err, result) => {
                if(err){
                    console.log("error in userSource", err);
                    reject("error in userSource");
                }else{
                    if(!result || result.length === 0){
                        return res.status(400).json({ success: false, message: "no source found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log('userSource', userSource);

        const userStatus = await new Promise((resolve, reject) => {
            db.query("select * from tblleads_status where id = ?", [status], (err, result) => {
                if(err){
                    console.log("error in userStatus", err);
                    reject("error in userStatus");
                }else{
                    if(!result || result.length === 0){
                        return res.status(400).json({ success: false, message: "no status found" });
                    }else{
                        resolve(result[0]);
                    }
                }
            });
        });
        console.log('userStatus', userStatus);

        const newLead = await new Promise((resolve, reject) => {
            db.query("insert into tblleads set ?", {
                status: userStatus.id,
                source: userSource.id,
                assigned: userAssigned.id,
                name,
                address,
                title: position,
                city,
                email, state, website, country: userCoutry.country_id, phonenumber, zip, lead_value, default_language, company, description, is_public,
                addedfrom: getUser,
                dateadded: new Date(),
                lastcontact: new Date()
            }, (err, result) => {
                if(err){
                    console.log("error in newLead", err);
                    reject("error in newLead");
                }else{
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        console.log('newLead', newLead);
        if(newLead.affectedRows === 1){
            return res.status(200).json({ success: true, message: "Lead added successfully" })
        }else{
            return res.status(400).json({ success: false, message: "Error NewLead" });
        }
    } catch (error) {
        console.error("Error NewLead:", error);
        return res.status(400).json({ success: false, message: "Error NewLead", error: error });
    }
}

exports.GetLead = async (req, res, next) => {
    try {
        let parsed_Url = url.parse(req.url);
        // Parse only querystring.
        let parsed_queryString = querystring.parse(parsed_Url.query);
        console.log('parsed_queryString', parsed_queryString);
        console.log(parsed_queryString);
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        let query = "select * from tblleads where addedfrom = ?";
        let queryParams = [getUser];
        const getLeads = await new Promise((resolve, reject) => {
            if(Object.keys(parsed_queryString).length > 0){
                Object.keys(parsed_queryString).forEach(key => {
                    let moreQuery;
                    if(key === "status"){
                        moreQuery = ` and ${key} in (${parsed_queryString.status})`
                        query+=moreQuery;
                    }else if(key === "filter"){
                        moreQuery = ` and ${parsed_queryString.filter} = true`;
                        query+=moreQuery;
                    }
                    else{
                        moreQuery = ` and ${key} = ? `;
                        queryParams.push(parsed_queryString[key]);
                        query+=moreQuery;
                    }
                    console.log('query', query);
                    console.log('queryParams', queryParams);
                });
            }
            db.query(query, queryParams, (err, result) => {
                if(err){
                    console.log("error in getLeads", err);
                    reject("error in getLeads");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getLeads){
            return res.status(200).json({ success: true, message: "Leads fetched successfully", data: getLeads })
        }else{
            return res.status(400).json({ success: false, message: "Error GetLead" });
        }
    } catch (error) {
        console.error("Error GetLead:", error);
        return res.status(400).json({ success: false, message: "Error GetLead", error: error });
    }
}

exports.ViewLead = async (req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(400).json({ success: false, message: "id not provided" });
        }
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const viewLead = await new Promise((resolve, reject) => {
            db.query("select * from tblleads where addedfrom = ? and id = ?", [getUser, id], (err, result) => {
                if(err){
                    console.log("error in ViewLead", err);
                    reject("error in ViewLead");
                }else{
                    console.log('result', result);
                    resolve(result);
                }   
            });
        })
        console.log('viewLead', viewLead);
        if(viewLead.length>0){
            return res.status(200).json({ success: true, message: "Leads fetched successfully", data: viewLead })
        }else{
            return res.status(200).json({ success: true, message: "No lead found" });
        }
    } catch (error) {
        console.error("Error GetLead:", error);
        return res.status(400).json({ success: false, message: "Error GetLead", error: error });
    }
}

exports.GetCountries = async (req, res) => {
    try {
        const getCountries = await new Promise((resolve, reject) => {
            db.query("select country_id, short_name from tblcountries", (err, result) => {
                if(err){
                    console.log("error in getCountries", err);
                    reject("error in getCountries");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getCountries.length>0){
            return res.status(200).json({ success: true, message: "Countries fetched successfully", data: getCountries })
        }else{
            return res.status(200).json({ success: true, message: "No countries found" });
        }
    } catch (error) {
        console.error("Error getCountries:", error);
        return res.status(400).json({ success: false, message: "Error getCountries", error: error });
    }
}

exports.GetStatus = async (req, res) => {
    try {
        const getStatus = await new Promise((resolve, reject) => {
            db.query("select * from tblleads_status", (err, result) => {
                if(err){
                    console.log("error in getStatus", err);
                    reject("error in getStatus");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getStatus.length>0){
            return res.status(200).json({ success: true, message: "Status fetched successfully", data: getStatus })
        }else{
            return res.status(200).json({ success: true, message: "No status found" });
        }
    } catch (error) {
        console.error("Error getStatus:", error);
        return res.status(400).json({ success: false, message: "Error getStatus", error: error });
    }
}

exports.GetSources = async (req, res) => {
    try {
        const getSources = await new Promise((resolve, reject) => {
            db.query("select * from tblleads_sources", (err, result) => {
                if(err){
                    console.log("error in getSources", err);
                    reject("error in getSources");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getSources.length>0){
            return res.status(200).json({ success: true, message: "Sources fetched successfully", data: getSources })
        }else{
            return res.status(200).json({ success: true, message: "No sources found" });
        }
    } catch (error) {
        console.error("Error getSources:", error);
        return res.status(400).json({ success: false, message: "Error getSources", error: error });
    }
}

exports.GetUsers = async (req, res) => {
    try {
        const getUsers = await new Promise((resolve, reject) => {
            db.query("select * from users", (err, result) => {
                if(err){
                    console.log("error in getUsers", err);
                    reject("error in getUsers");
                }else{
                    resolve(result);
                }   
            });
        });
        if(getUsers.length>0){
            return res.status(200).json({ success: true, message: "Users fetched successfully", data: getUsers })
        }else{
            return res.status(200).json({ success: true, message: "No users found" });
        }
    } catch (error) {
        console.error("Error getUsers:", error);
        return res.status(400).json({ success: false, message: "Error getUsers", error: error });
    }
}

exports.LeadsSearch = async (req, res, next) => {
    let parsed_Url = url.parse(req.url);
    // Parse only querystring.
    let parsed_queryString = querystring.parse(parsed_Url.query);
    const searchLead = `%${parsed_queryString.search}%`;

    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);

        const leadsSearch = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM tblleads WHERE addedfrom = ? AND (id LIKE ? OR name LIKE ? OR email LIKE ? OR company LIKE ?)",
                [getUser, searchLead, searchLead, searchLead, searchLead],
                (err, result) => {
                    if (err) {
                        console.error("Error in leadsSearch query:", err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        return res.status(200).json({ success: true, message: "Searched user fetched successfully", data: leadsSearch });
    } catch (error) {
        console.error("Error in LeadsSearch:", error);
        return res.status(400).json({ success: false, message: "Error in LeadsSearch", error: error });
    }
}


exports.StatusChange = async (req, res, next) => {
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        let parsed_Url = url.parse(req.url);
        let parsed_queryString = querystring.parse(parsed_Url.query);
        const {currentStatus, newStatus, user} = parsed_queryString;
        console.log(currentStatus, newStatus, user);
        const statusChange = await new Promise((resolve, reject) => {
            db.query("update tblleads set last_lead_status = ?, last_status_change = ?, status = ? where addedfrom = ? and id = ?", [currentStatus, new Date(), newStatus, getUser, user], (err, result) => {
                if (err) {
                    console.error("Error in statusChange query:", err);
                    reject(err);
                } else {
                    console.log('result', result);
                    resolve(result);
                }
            });
        });
        console.log('statusChange', statusChange);
        if(statusChange.changedRows === 1){
            return res.status(200).json({ success: true, message: "Status changed successfully" });
        }else{
            return res.status(200).json({ success: false, message: "Nothing changed!" });
        }
    } catch (error) {
        console.error("Error in statusChange:", error);
        return res.status(400).json({ success: false, message: "Error in statusChange", error: error });
    }
}

exports.UpdateLead = async (req, res, next) => {
    const leadId = req.params.id;
    const { status, source, assigned, name, address, position, city, email, state, website, country, phonenumber, zip, lead_value, default_language, company, description, is_public } = req.body;
    try {
        const getUser = await verifyToken(req, res, next, verifyUser=true);
        const updateFields = [];
        const queryParams = [];
        let userAssigned;
        let userCoutry;
        let userSource;
        let userStatus;
        
        if (country !== undefined) {
            userCoutry = await new Promise((resolve, reject) => {
                db.query("select * from tblcountries where country_id = ?", [country], (err, result) => {
                    if(err){
                        console.log("error in userAssigned", err);
                        reject("error in userCoutry");
                    }else{
                        if(!result || result.length === 0){
                            return res.status(400).json({ success: false, message: "no country found" });
                        }else{
                            resolve(result[0]);
                        }
                    }
                });
            });
            updateFields.push("country = ?");
            queryParams.push(userCoutry.country_id);
        }

        if (status !== undefined) {
            try {
                const userStatus = await new Promise((resolve, reject) => {
                    db.query("SELECT * FROM tblleads_status WHERE id = ?", [status], (err, result) => {
                        if (err) {
                            console.log("Error in userStatus:", err);
                            reject(err);
                        } else {
                            if (!result || result.length === 0) {
                                return res.status(400).json({ success: false, message: "No status found" });
                            } else {
                                resolve(result[0]);
                            }
                        }
                    });
                });
        
                if (userStatus !== undefined) {
                    console.log("User status:", userStatus);
        
                    const currentStatus = await new Promise((resolve, reject) => {
                        db.query("SELECT * FROM tblleads WHERE id = ?", [leadId], (err, result) => {
                            if (err) {
                                console.log("Error fetching current status:", err);
                                reject(err);
                            } else {
                                resolve(result[0]);
                            }
                        });
                    });
        
                    console.log('Current status:', currentStatus.status);
        
                    await new Promise((resolve, reject) => {
                        db.query("UPDATE tblleads SET last_lead_status = ?, last_status_change = ?, status = ? WHERE addedfrom = ? AND id = ?", [currentStatus.status, new Date(), userStatus.id, getUser, leadId], (err, result) => {
                            if (err) {
                                console.log("Error updating lead:", err);
                                reject(err);
                            } else {
                                console.log('Lead updated successfully');
                                resolve(result);
                            }
                        });
                    });
        
                    updateFields.push("status = ?");
                    queryParams.push(userStatus.id);
                } else {
                    return res.status(400).json({ success: false, message: "Error updating status" });
                }
            } catch (error) {
                console.error("Error in status update:", error);
                return res.status(400).json({ success: false, message: "Error updating status", error: error });
            }
        }
        if (source !== undefined) {
            userSource = await new Promise((resolve, reject) => {
                db.query("select * from tblleads_sources where id = ?", [source], (err, result) => {
                    if(err){
                        console.log("error in userSource", err);
                        reject("error in userSource");
                    }else{
                        if(!result || result.length === 0){
                            return res.status(400).json({ success: false, message: "no source found" });
                        }else{
                            resolve(result[0]);
                        }
                    }
                });
            });
            updateFields.push("source = ?");
            queryParams.push(userSource.id);
        }
        if (assigned !== undefined) {
            userAssigned = await new Promise((resolve, reject) => {
                db.query("select * from users where id = ?", [assigned], (err, result) => {
                    if(err){
                        console.log("error in userAssigned", err);
                        reject("error in userAssigned");
                    }else{
                        console.log('result', result);
                        if(result === undefined || result.length === 0){
                            return res.status(400).json({ success: false, message: "no assigned user found" });
                        }else{
                            resolve(result[0]);
                        }
                    }
                });
            });
            updateFields.push("assigned = ?");
            queryParams.push(userAssigned.id);
        }
        if (name !== undefined) {
            updateFields.push("name = ?");
            queryParams.push(name);
        }
        if (address !== undefined) {
            updateFields.push("address = ?");
            queryParams.push(address);
        }
        if (position !== undefined) {
            updateFields.push("title = ?");
            queryParams.push(position);
        }
        if (city !== undefined) {
            updateFields.push("city = ?");
            queryParams.push(city);
        }
        if (email !== undefined) {
            updateFields.push("email = ?");
            queryParams.push(email);
        }
        if (state !== undefined) {
            updateFields.push("state = ?");
            queryParams.push(state);
        }
        if (website !== undefined) {
            updateFields.push("website = ?");
            queryParams.push(website);
        }
        if (phonenumber !== undefined) {
            updateFields.push("phonenumber = ?");
            queryParams.push(phonenumber);
        }
        if (zip !== undefined) {
            updateFields.push("zip = ?");
            queryParams.push(zip);
        }
        if (lead_value !== undefined) {
            updateFields.push("lead_value = ?");
            queryParams.push(lead_value);
        }
        if (default_language !== undefined) {
            updateFields.push("default_language = ?");
            queryParams.push(default_language);
        }
        if (company !== undefined) {
            updateFields.push("company = ?");
            queryParams.push(company);
        }
        if (description !== undefined) {
            updateFields.push("description = ?");
            queryParams.push(description);
        }
        if (is_public !== undefined) {
            updateFields.push("is_public = ?");
            queryParams.push(is_public);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: "No fields to update" });
        }

        // Construct the SQL update query
        const updateQuery = `UPDATE tblleads SET ${updateFields.join(', ')} WHERE id = ? AND addedfrom = ?`;
        queryParams.push(leadId, getUser);

        // Execute the update query
        const updateLead = await new Promise((resolve, reject) => {
            db.query(updateQuery, queryParams, (err, result) => {
                if (err) {
                    console.error("Error updating lead:", err);
                    reject(err);
                } else {
                    console.log('Lead updated successfully');
                    resolve(result);
                }
            });
        });

        if (updateLead.affectedRows === 1) {
            return res.status(200).json({ success: true, message: "Lead updated successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Error updating lead" });
        }
    } catch (error) {
        console.error("Error in updateLead:", error);
        return res.status(400).json({ success: false, message: "Error in updateLead", error: error });
    }
}