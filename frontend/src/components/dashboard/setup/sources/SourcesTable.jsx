import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SnackbarWithDecorators, { api, displayTimeOfPost } from '../../../../utils/Utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getAssigned, getSource } from '../../../../store/slices/LeadSlices';
import '../table.css';

const SourcesTable = () => {
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
        api("/lead/getsources", "get", false, false, true)
        .then((res) => {
            dispatch(getSource(res.data.data));
        })
        .catch((err) => {
            console.log("error in fetchSources", err);
        })
    }, []);
    const assignedData = useSelector(state => state.assigned.assignedData);
    const sourcesData = useSelector(state => state.source.sourceData);
    console.log("assignedData", assignedData);
  return (
    <div className='setup w-full h-[70vh] overflow-auto'>
        <table className="table-fill">
            <thead>
                <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">NAME</th>
                    <th className="text-left">ADDED BY</th>
                </tr>
            </thead>
            <tbody className="table-hover">
                {
                    sourcesData?.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <td className="text-left">{item.id}</td>
                                <td className="text-left">{item.name}</td>
                                <td className="text-left">{assignedData?.find(option => option.id === item.addedfrom)?.full_name}</td>
                            </tr>
                        )
                    })
                }
                
            </tbody>
        </table>
    </div>
  )
}

export default SourcesTable
