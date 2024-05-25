import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SnackbarWithDecorators, { api, displayTimeOfPost } from '../../../../utils/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAssigned } from '../../../../store/slices/LeadSlices';
import '../table.css';
import { getProfileOfClient } from '../../../../store/slices/SetupSlices';

const ProfileOfClientTable = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const dispatch = useDispatch();
    useEffect(() => {
        api("/lead/getusers", "get", false, false, true)
        .then((res) => {
            dispatch(getAssigned(res.data.data));
        })
        .catch((err) => {
            console.log("error in fetchAssigned", err);
        })
        api("/lead/getallprofileofclients", "get", false, false, true)
        .then((res) => {
            dispatch(getProfileOfClient(res.data.data));
        })
        .catch((err) => {
            console.log("error in getallprofileofclients", err);
        })
    }, []);
    const assignedData = useSelector(state => state.assigned.assignedData);
    const profileOfClientData = useSelector(state => state.setup.profileOfClient);
  return (
    <div className='setup w-full h-[70vh] overflow-auto'>
        <table class="table-fill">
            <thead>
                <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">NAME</th>
                    <th class="text-left">ADDED BY</th>
                </tr>
            </thead>
            <tbody class="table-hover">
                {
                    profileOfClientData?.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <td class="text-left">{item.id}</td>
                                <td class="text-left">{item.name}</td>
                                <td class="text-left">{assignedData?.find(option => option.id === item.addedFrom)?.full_name}</td>
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
