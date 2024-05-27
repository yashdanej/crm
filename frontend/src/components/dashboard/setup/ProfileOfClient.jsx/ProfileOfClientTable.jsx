import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SnackbarWithDecorators, { api, displayTimeOfPost } from '../../../../utils/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAssigned } from '../../../../store/slices/LeadSlices';
import '../table.css';
import { getProfileOfClient } from '../../../../store/slices/SetupSlices';

const ProfileOfClientTable = ({handleEdit}) => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const getAllProfileOfClient = () => {
        api("/lead/getallprofileofclients", "get", false, false, true)
        .then((res) => {
            dispatch(getProfileOfClient(res.data.data));
        })
        .catch((err) => {
            console.log("error in getallprofileofclients", err);
        })
    }
    const dispatch = useDispatch();
    useEffect(() => {
        api("/lead/getusers", "get", false, false, true)
        .then((res) => {
            dispatch(getAssigned(res.data.data));
        })
        .catch((err) => {
            console.log("error in fetchAssigned", err);
        })
        getAllProfileOfClient();
    }, []);
    const assignedData = useSelector(state => state.assigned.assignedData);
    const profileOfClientData = useSelector(state => state.setup.profileOfClient);
    const handleDelete = (id) => {
        api(`/lead/deleteprofileofclient/${id}`, "delete", false, false, true)
        .then((res) => {
            console.log("res in delete", res);
            getAllProfileOfClient();
        })
        .catch((err) => {
            console.log("err in delete", err);
        })
    }
  return (
    <div className='setup w-full h-[70vh] overflow-auto'>
        <table className="table-fill">
            <thead>
                <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">NAME</th>
                    <th className="text-left">ADDED BY</th>
                    <th className="text-left">EDIT</th>
                    <th className="text-left">DELETE</th>
                </tr>
            </thead>
            <tbody className="table-hover">
                {
                    profileOfClientData?.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <td className="text-left">{item.id}</td>
                                <td className="text-left">{item.name}</td>
                                <td className="text-left">{assignedData?.find(option => option.id === item.addedFrom)?.full_name}</td>
                                <td className="text-left cursor-pointer" onClick={() => handleEdit(item.id)}>Edit</td>
                                <td className="text-left cursor-pointer" onClick={() => handleDelete(item.id)}>Delete</td>
                            </tr>
                        )
                    })
                }
                
            </tbody>
        </table>
    </div>
  )
}

export default ProfileOfClientTable
