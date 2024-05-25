import React, { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'; // Import the color picker component
import { api, changeText } from '../../../../utils/Utils';
import StatusTable from './StatusTable';
import { useDispatch } from 'react-redux';
import { getStatus } from '../../../../store/slices/LeadSlices';

const Status = () => {
    const [status, setStatus] = useState({
        name: "",
        color: "#000000"
    });
    const [err, setErr] = useState("");
    const handleColorChange = (color) => {
        setStatus({ ...status, color: color.hex }); // Update the color value
    }
    useEffect(() => {
        console.log("status", status);
    }, [status]);
    const handleStatusSubmit = (e) => {
        e.preventDefault();
        if(status.name.trim() === ""){
            setErr("Please fill out this field.");
            return;
        }
        api("/lead/addstatus", "post", status, false, true)
        .then((res) => {
            fetchStatusData();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const dispatch = useDispatch();

    const fetchStatusData = () => {
        api("/lead/getstatus", "get", false, false, true)
        .then((res) => {
            dispatch(getStatus(res.data.data));
        })
        .catch((err) => {
            console.log("err in fetchStatusData", fetchStatusData);
        })
    }

    useEffect(() => {
        fetchStatusData();
    }, [])
  return (
    <div className='m-6'>
        <h1 className='text-3xl font-bold bg-gray-900 text-white p-5'>Status Master</h1>
        <div className='xl:flex gap-10 my-6'>
            <form className="w-full max-w-lg bg-gray-50 p-5 rounded-3xl">
                <div className="w-full mb-6">
                    <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Status name
                        </label>
                        <input onChange={(event) => changeText(event, setStatus, status)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" name='name' placeholder="Jane"/>
                        <p className="text-red-500 text-xs italic">{err}</p>
                    </div>
                    <div className="w-full px-3 mb-6">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                        </label>
                            <ChromePicker
                                color={status.color}
                                onChangeComplete={handleColorChange}
                            />
                        {/* <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe"/> */}
                    </div>
                    <button onClick={handleStatusSubmit} className='px-10 p-4 bg-gray-900 text-white mx-3'>Submit</button>
                </div>
            </form>
            <div className='my-6'>
                <StatusTable/>
            </div>
        </div>
    </div>
  )
}

export default Status
