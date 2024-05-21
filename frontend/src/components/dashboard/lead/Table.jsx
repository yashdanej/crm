import React, { useEffect, useState } from 'react'
import Filter from './Filter'
import DropDown from './DropDown'
import SnackbarWithDecorators, { api, selectedItem } from '../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLeads, getLead, leadIdSelect } from '../../../store/slices/LeadSlices'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const Table = ({ handleOpenView, getLeads, handleClickOpen }) => {
    const leadsData = useSelector((state) => state.leads.leadsData);
    const getAllStatus = useSelector(state => state.status.statusData);
    const dispatch = useDispatch();
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const [selectedLeads, setSelectedLeads] = useState([]); // State to manage selected checkboxes
    const [selectAll, setSelectAll] = useState(false); // State to manage select all checkbox
    useEffect(() => {
        getLeads();
    }, []);

    useEffect(() => {
        if (selectAll) {
            setSelectedLeads(leadsData.map(lead => lead.id));
        } else {
            setSelectedLeads([]);
        }
    }, [selectAll, leadsData]);

    const handleLeadEdit = (id) => {
        api(`/lead/viewlead/${id}`, "get", false, false, true)
            .then((res) => {
                dispatch(getLead(res.data.data));
            })
            .catch((err) => {
                console.log("err from handleView", err);
            })
            .finally(() => {
                console.log("Completed");
            });
    }

    const handleView = (id) => {
        handleLeadEdit(id);
        handleOpenView();
    }

    const handleEdit = (id) => {
        handleLeadEdit(id);
        handleClickOpen();
    }

    const statusData = useSelector(state => state.status.statusData);
    const sourceData = useSelector(state => state.source.sourceData);
    const assignedData = useSelector(state => state.assigned.assignedData);

    const onStatusChange = (currentStatus, newStatus, user) => {
        api(`/lead/statuschange?currentStatus=${currentStatus}&newStatus=${newStatus}&user=${user}`, "patch", false, false, true)
            .then((res) => {
                console.log(res);
                setSnackbarProperty(prevState => ({
                    ...prevState,
                    text: res?.data?.message,
                    color: "success"
                }));
                setSnackAlert(true);
            })
            .catch((err) => {
                console.log("err in onStatusChange", err);
                setSnackbarProperty(prevState => ({
                    ...prevState,
                    text: err,
                    color: "danger"
                }));
                setSnackAlert(true);
            })
    }

    const handleCheckboxChange = (id) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
            dispatch(leadIdSelect(id));
        } else {
            setSelectedLeads([...selectedLeads, id]);
            dispatch(leadIdSelect(id));
        }
    }

    return (
        <div className="overflow-x-auto">
            {
                snackAlert ?
                    <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
                    : null
            }
            <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                <thead>
                    <tr>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">
                            <input type="checkbox" checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)} />
                        </th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Name</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Company</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Email</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Phone</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Value</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Tags</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Assigned</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Status</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Source</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Priority</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Last Contact</th>
                        <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Created</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        leadsData?.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <input type="checkbox" checked={selectedLeads.includes(item.id)} onChange={() => handleCheckboxChange(item.id)} />
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <p className="text-[13px] font-medium text-gray-400">{item.name}</p>
                                        <span onClick={() => handleView(item.id)} className='text-xs hover:underline cursor-pointer text-green-950'>View </span>
                                        <span className='text-xs hover:underline cursor-pointer'>/</span>
                                        <span onClick={() => handleEdit(item.id)} className='text-xs hover:underline cursor-pointer text-red-950'> Edit</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{item.company}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{item.email}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{item.phonenumber}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{item.lead_value}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">
                                            {
                                                item.tags &&
                                                <Stack direction="row" spacing={1}>
                                                    {item.tags.split(",").map((tag) => {
                                                        return (
                                                            <Chip label={tag} variant="outlined" />
                                                        )
                                                    })}
                                                </Stack>
                                            }
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{selectedItem(item, assignedData, "Assigned")}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="inline-block p-1 rounded bg-emerald-500/10 font-medium text-[12px] leading-none"
                                            style={{ color: getAllStatus.find(option => option.id === item.status)?.color }}
                                        >
                                            <select onChange={(e) => onStatusChange(item.status, e.target.value, item.id)} name="" id="">
                                                {
                                                    statusData?.map((item2) => {
                                                        return (
                                                            <option selected={item.status === item2.id} value={item2.id}>{item2.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{selectedItem(item, sourceData, "Source")}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{item.priority}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{item.lastcontact}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b border-b-gray-50">
                                        <span className="text-[13px] font-medium text-gray-400">{item.dateadded}</span>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
