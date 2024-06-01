import React, { useEffect, useState } from 'react';
import { api } from '../../../../utils/Utils'; // Ensure 'api' function is correctly imported
import { useDispatch } from 'react-redux';
import AgentsTable from './AgentsTable';
import { getAgents } from '../../../../store/slices/SetupSlices';

const Agents = () => {
    const [name, setName] = useState("");
    const [err, setErr] = useState("");
    const [editAgentId, setEditAgentId] = useState(null); // New state for tracking edit

    const dispatch = useDispatch();

    const fetchAgentsData = () => {
        api("/agents/getallagents", "get", false, false, true)
        .then((res) => {
            dispatch(getAgents(res.data.data));
        })
        .catch((err) => {
            console.log("err in fetchAgentsData", err);
        })
    }

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        if(name.trim() === ""){
            setErr("Please fill out this field.");
            return;
        }
        
        if (editAgentId) {
            // Update existing agent
            api(`/agents/updateagent/${editAgentId}`, "patch", { name: name }, false, true)
            .then((res) => {
                setName("");
                setEditAgentId(null);
                fetchAgentsData();
            })
            .catch((err) => {
                console.log("Error updating agent:", err);
            });
        } else {
            // Add new agent
            api("/agents/addagent", "post", { name: name }, false, true)
            .then((res) => {
                setName("");
                fetchAgentsData();
            })
            .catch((err) => {
                console.log("Error adding agent:", err);
            });
        }
    }

    const handleEdit = (id) => {
        api(`/agents/getagent/${id}`, "get", false, false, true)
        .then((res) => {
            setName(res.data.data[0]?.name);
            setEditAgentId(id); // Set the ID of the agent being edited
        })
        .catch((err) => {
            console.log("Error in handleEdit", err);
        })
    }
    const cancelEdit = () => {
        setEditAgentId(null);
        setName("");
    }

    useEffect(() => {
        fetchAgentsData();
    }, []);
// activity log
useEffect(() => {
    api("/util/activity_log", "post", false, false, true)
    .then((res) => {
      console.log("res", res);
    })
    .catch((err) => {
      console.log("err in activity log");
    });
  }, []);
    return (
        <div className='m-6'>
            <h1 className='text-3xl font-bold bg-gray-900 text-white p-5'>Agent Master</h1>
            <div className='xl:flex gap-10 my-6'>
                <form className="w-full max-w-lg bg-gray-50 p-5 rounded-3xl" onSubmit={handleStatusSubmit}>
                    <div className="w-full mb-6">
                        <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Agent name
                            </label>
                            <input 
                                onChange={(e) => setName(e.target.value)} 
                                value={name} 
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                                id="grid-first-name" 
                                type="text" 
                                name='name' 
                                placeholder="Jane" 
                            />
                            <p className="text-red-500 text-xs italic">{err}</p>
                        </div>
                        <button type="submit" className='px-10 p-4 bg-gray-900 text-white mx-3'>
                            {editAgentId ? "Update" : "Submit"}
                        </button>
                        {
                            editAgentId && 
                            <button onClick={cancelEdit} type="submit" className='px-10 p-4 bg-gray-900 text-white mx-3'>
                                Cancel Edit
                            </button>
                        }
                    </div>
                </form>
                <div className='my-6'>
                    <AgentsTable handleEdit={handleEdit} />
                </div>
            </div>
        </div>
    )
}

export default Agents;
