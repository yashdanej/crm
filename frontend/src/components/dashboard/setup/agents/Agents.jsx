import React, { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'; // Import the color picker component
import { api, changeText } from '../../../../utils/Utils';
import { useDispatch } from 'react-redux';
import AgentsTable from './AgentsTable';
import { getAgents } from '../../../../store/slices/SetupSlices';

const Agents = () => {
    const [name, setName] = useState("");
    const [err, setErr] = useState("");
    const handleStatusSubmit = (e) => {
        e.preventDefault();
        if(name.trim() === ""){
            setErr("Please fill out this field.");
            return;
        }
        api("/agents/addagent", "post", {name: name}, false, true)
        .then((res) => {
            fetchAgentsData();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const dispatch = useDispatch();

    const fetchAgentsData = () => {
        api("/agents/getallagents", "get", false, false, true)
        .then((res) => {
            dispatch(getAgents(res.data.data));
        })
        .catch((err) => {
            console.log("err in fetchAgentsData");
        })
    }

    useEffect(() => {
        fetchAgentsData();
    }, [])
  return (
    <div className='m-6'>
        <h1 className='text-3xl font-bold bg-gray-900 text-white p-5'>Agent Master</h1>
        <div className='xl:flex gap-10 my-6'>
            <form className="w-full max-w-lg bg-gray-50 p-5 rounded-3xl">
                <div className="w-full mb-6">
                    <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Agent name
                        </label>
                        <input onChange={(e) => setName(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" name='name' placeholder="Jane"/>
                        <p className="text-red-500 text-xs italic">{err}</p>
                    </div>
                    <button onClick={handleStatusSubmit} className='px-10 p-4 bg-gray-900 text-white mx-3'>Submit</button>
                </div>
            </form>
            <div className='my-6'>
                <AgentsTable/>
            </div>
        </div>
    </div>
  )
}

export default Agents
