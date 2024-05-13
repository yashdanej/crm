import React, { useEffect } from 'react'
import Filter from './Filter'
import DropDown from './DropDown'
import { api } from '../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { getAllLeads } from '../../../store/slices/LeadSlices'

const Table = ({getLeads}) => {
    const leadsData = useSelector((state) => state.leads.leadsData);
    console.log('leadsData', leadsData);
    
    useEffect(() => {
        getLeads();
    }, []);

  return (
    <div class="overflow-x-auto">
    <table class="w-full min-w-[540px]" data-tab-for="order" data-page="active">
        <thead>
            <tr>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Name</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Company</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Email</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Phone</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Value</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Tags</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Assigned</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Status</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Source</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Last Contact</th>
                <th class="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Created</th>
            </tr>
        </thead>
        <tbody>
            {
                leadsData?.map((item) => {
                    return (
                    <tr key={item.id}>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <div class="flex items-center">
                                <a href="#" class="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">{item.id}</a>
                            </div>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.name}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.company}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.email}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.phonenumber}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.lead_value}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400"></span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                        {/* <img src="https://placehold.co/32x32" alt="" class="w-8 h-8 rounded object-cover block"/> */}
                            <span class="text-[13px] font-medium text-gray-400">{item.addedfrom}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            {/* <span class="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">In progress</span> */}
                            <span class="text-[13px] font-medium text-gray-400">{item.status}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.source}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.lastcontact}</span>
                        </td>
                        <td class="py-2 px-4 border-b border-b-gray-50">
                            <span class="text-[13px] font-medium text-gray-400">{item.dateadded}</span>
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
