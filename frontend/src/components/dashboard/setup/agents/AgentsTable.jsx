import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SnackbarWithDecorators, { api, displayTimeOfPost } from '../../../../utils/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAssigned } from '../../../../store/slices/LeadSlices';
import '../table.css';
import { getAgents } from '../../../../store/slices/SetupSlices';

const AgentsTable = ({handleEdit}) => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const getAllAgents = () => {
        api("/agents/getallagents", "get", false, false, true)
        .then((res) => {
            dispatch(getAgents(res.data.data));
        })
        .catch((err) => {
            console.log("error in getallagents", err);
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
    }, []);
    const assignedData = useSelector(state => state.assigned.assignedData);
    const agentsData = useSelector(state => state.setup.agents);
    console.log("assignedData", assignedData);
    const handleDelete = (id) => {
        api(`/agents/deleteagent/${id}`, "delete", false, false, true)
        .then((res) => {
            console.log("res in delete", res);
            getAllAgents();
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
                    agentsData?.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <td className="text-left">{item.id}</td>
                                <td className="text-left">{item.name}</td>
                                <td className="text-left">{assignedData?.find(option => option.id === item.addedfrom)?.full_name}</td>
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

export default AgentsTable
