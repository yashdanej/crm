import Add from '@mui/icons-material/Add'
import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getEmployee, getRoles } from '../../../../store/slices/SetupSlices'

const Employees = () => {
    const empData = useSelector(state => state.setup.employees);
    const rolesData = useSelector(state => state.setup.roles);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getEmployee());
        dispatch(getRoles());
    }, []);
  return (
    <div className='m-6'>
            <div className='mb-4'>
                <Link to="/setup/employee/add">
                    <Button
                        variant="soft"
                        color="primary"
                        startDecorator={<Add />}
                        >
                        Add Custom Field
                    </Button>
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
                        <thead>
                            <tr>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">#ID</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Full name</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Email</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Role</th>
                                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                empData?.data?.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <p className="text-[13px] font-medium text-gray-400">{item.id}</p>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <p className="text-[13px] font-medium text-gray-400">{item.full_name}</p>
                                                <span className='text-xs hover:underline cursor-pointer text-green-950'>Edit </span>
                                                <span className='text-xs hover:underline cursor-pointer'>/</span>
                                                <span className='text-xs hover:underline cursor-pointer text-red-950'> Delete</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{item.email}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{rolesData?.data?.find(role => role.id === item.role)?.name}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b border-b-gray-50">
                                                <span className="text-[13px] font-medium text-gray-400">{item.phone}</span>
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

export default Employees
