import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const SuperAdminTable = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const devData = useSelector(state => state.dev.superadmin);
    const companyData = useSelector(state => state.dev.company);
    console.log("devData", devData);
  return (
    <div className='setup w-full h-[70vh] overflow-auto'>
        <table className="table-fill">
            <thead>
                <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">NAME</th>
                    <th className="text-left">EMAIL</th>
                    <th className="text-left">COMPANY</th>
                </tr>
            </thead>
            <tbody className="table-hover">
                {
                    devData?.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <td className="text-left">{item.id}</td>
                                <td className="text-left">{item.full_name}</td>
                                <td className="text-left">{item.email}</td>
                                <td className="text-left">{companyData?.find(company => company.id === item.company_id)?.name}</td>
                            </tr>
                        )
                    })
                }
                
            </tbody>
        </table>
    </div>
  )
}

export default SuperAdminTable
