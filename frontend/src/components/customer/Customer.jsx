import Add from '@mui/icons-material/Add'
import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { addContactId, deleteCustomer, getCustomer, getCustomerById } from '../../store/slices/CustomerSlices'
import { api } from '../../utils/Utils'
import { getGroup } from '../../store/slices/SetupSlices'

const Customer = () => {
    const dispatch = useDispatch();
    const customerData = useSelector(state => state.customer.customers);
    const usersData = useSelector(state => state.assigned.assignedData);
    const groupData = useSelector(state => state.setup.group);
    useEffect(() => {
        dispatch(getCustomer());
    }, []);

    const handleDeleteCustomer = (id) => {
        dispatch(deleteCustomer(id));
    }
    const navigate = useNavigate();
    const handlEditCustomer = (id) => {
        dispatch(getCustomerById(id));
        navigate("/admin/customer/update");
    }

    // activity log
    useEffect(() => {
        api("/util/last_active", "patch", false, false, true)
        .then((res) => {
        console.log("res", res);
        })
        .catch((err) => {
        console.log("err in activity log");
        });
        dispatch(getGroup());
    }, []);

    return (
        <div className='m-6'>
                <div className='mb-4'>
                    <Link to="/admin/customer/add">
                        <Button
                            variant="soft"
                            color="primary"
                            startDecorator={<Add />}
                            >
                            Add Customer
                        </Button>
                    </Link>
                </div>
                <div className="bg-white border border-1 rounded-lg shadow-md p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                            <thead>
                                <tr>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#ID</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Company</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Contact</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Primary Email</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Phone</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Active</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Groups</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date Created</th>
                                    <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Added By</th>
                                </tr>
                            </thead>
                            <tbody>
                                { customerData &&
                                    customerData?.data?.map((item) => {
                                        return (
                                            <tr key={item.id}>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <p className="text-[13px] font-medium text-gray-400">{item.id}</p>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <p className="text-[13px] font-medium text-gray-400">{item?.company === "" ?"[Company name not found]":item?.company}</p>
                                                    <Link onClick={() => dispatch(addContactId(item.id))} to="/admin/customer/view"><span className='text-xs hover:underline cursor-pointer text-green-950'>Contact </span></Link>
                                                    <span className='text-xs hover:underline cursor-pointer'>/</span>
                                                    <span onClick={() => {handlEditCustomer(item?.id)}} className='text-xs hover:underline cursor-pointer text-green-950'> Edit </span>
                                                    <span className='text-xs hover:underline cursor-pointer'>/</span>
                                                    <span onClick={() => {handleDeleteCustomer(item?.id)}} className='text-xs hover:underline cursor-pointer text-red-950'> Delete</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <span className="text-[13px] font-medium text-gray-400">{item.primary_contact}</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <span className="text-[13px] font-medium text-gray-400">{item.email}</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <span className="text-[13px] font-medium text-gray-400">{item.phone}</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <span className="text-[13px] font-medium text-gray-400">{item.is_active}</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <span className="text-[13px] font-medium text-gray-400">{groupData?.data?.find(group => group.id === item.in_groups)?.name}</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <span className="text-[13px] font-medium text-gray-400">{item.created_at}</span>
                                                </td>
                                                <td className="py-2 px-4 border-b border-b-gray-50">
                                                    <span className="text-[13px] font-medium text-gray-400">{usersData?.find(option => option.id === item.addedfrom)?.full_name}</span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
              </div>
      )
}

export default Customer
