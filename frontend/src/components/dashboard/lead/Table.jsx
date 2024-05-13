import React, { useEffect } from 'react'
import Filter from './Filter'
import DropDown from './DropDown'
import { api } from '../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLeads, getLead } from '../../../store/slices/LeadSlices'

const Table = ({getLeads, handleClickOpen}) => {
    const leadsData = useSelector((state) => state.leads.leadsData);
    console.log('leadsData', leadsData);
    const dispatch = useDispatch();
    useEffect(() => {
        getLeads();
    }, []);

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
        handleLeadEdit(id)
    }
    const handleEdit = (id) => {
        handleLeadEdit(id);
        handleClickOpen();
    }

  return (
    <div className="overflow-x-auto">
    <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
        <thead>
            <tr>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Name</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Company</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Email</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Phone</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Value</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Tags</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Assigned</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Status</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Source</th>
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
                            <div className="flex items-center">
                                <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">{item.id}</a>
                            </div>
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
                            <span className="text-[13px] font-medium text-gray-400"></span>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                        {/* <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block"/> */}
                            <span className="text-[13px] font-medium text-gray-400">{item.addedfrom}</span>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                            {/* <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">In progress</span> */}
                            <span className="text-[13px] font-medium text-gray-400">{item.status}</span>
                        </td>
                        <td className="py-2 px-4 border-b border-b-gray-50">
                            <span className="text-[13px] font-medium text-gray-400">{item.source}</span>
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
