import React, { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'; // Import the color picker component
import { api, changeText } from '../../../../utils/Utils';
import { useDispatch } from 'react-redux';
import { getSource, getStatus } from '../../../../store/slices/LeadSlices';
import TypeOfWorkTable from './TypeOfWorkTable';
import { getTypeOfWork } from '../../../../store/slices/SetupSlices';

const TypeOfWork = () => {
    const [name, setName] = useState("");
    const [err, setErr] = useState("");
    const handleStatusSubmit = (e) => {
        e.preventDefault();
        if(name.trim() === ""){
            setErr("Please fill out this field.");
            return;
        }
        api("/lead/addtypeofwork", "post", {name: name}, false, true)
        .then((res) => {
            fetchTypeData();
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const dispatch = useDispatch();

    const fetchTypeData = () => {
        api("/lead/getalltypesofwork", "get", false, false, true)
        .then((res) => {
            dispatch(getTypeOfWork(res.data.data));
        })
        .catch((err) => {
            console.log("err in fetchTypeData");
        })
    }

    useEffect(() => {
        fetchTypeData();
    }, []);
  return (
    <div className='m-6'>
        <h1 className='text-3xl font-bold bg-gray-900 text-white p-5'>Type Of Work Master</h1>
        <div className='xl:flex gap-10 my-6'>
            <form className="w-full max-w-lg bg-gray-50 p-5 rounded-3xl">
                <div className="w-full mb-6">
                    <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            Type of work name
                        </label>
                        <input onChange={(e) => setName(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" name='name' placeholder="Jane"/>
                        <p className="text-red-500 text-xs italic">{err}</p>
                    </div>
                    <button onClick={handleStatusSubmit} className='px-10 p-4 bg-gray-900 text-white mx-3'>Submit</button>
                </div>
            </form>
            <div className='my-6'>
                <TypeOfWorkTable/>
            </div>
        </div>
    </div>
  )
}

export default TypeOfWork