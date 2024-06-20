import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getContact } from '../../../../store/slices/CustomerSlices';

const ContactTable = () => {
    const customerId = useSelector(state => state.customer.id);
    const contactData = useSelector(state => state.customer.contacts);
    console.log("contactData", contactData);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getContact(customerId));
      }, [dispatch]);
  return (
    <div className="relative overflow-x-auto sm:rounded-lg p-5">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Full Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Position
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Phone
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Active
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Edit/Delete
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    contactData && contactData.isisLoading ? "Loading...":
                    (
                        contactData && contactData.data.length > 0 &&
                        contactData?.data?.map((item) => {
                            return (
                                <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <img className="w-10 h-10 rounded-full" src={item.profile_image} alt="Contact image" />
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">{item.firstname} {item.lastname}</div>
                                        </div>  
                                    </th>
                                    <td className="px-6 py-4">
                                        {item.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.phonenumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.active}
                                    </td>
                                    <td className="px-6 py-4">
                                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit/Delete</a>
                                    </td>
                                </tr>
                            )
                        })
                    )
                }
            </tbody>
        </table>
    </div>
  )
}

export default ContactTable
