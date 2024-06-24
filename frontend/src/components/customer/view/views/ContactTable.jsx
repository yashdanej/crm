import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact, getContact, getContactById } from '../../../../store/slices/CustomerSlices';
import { unwrapResult } from '@reduxjs/toolkit';
import SnackbarWithDecorators from '../../../../utils/Utils';
import { useNavigate } from 'react-router-dom';

const ContactTable = ({setActive}) => {
    const customerId = useSelector(state => state.customer.id);
    const contactData = useSelector(state => state.customer.contacts);
    console.log("contactData", contactData);
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getContact(customerId));
    }, [dispatch]);
    const onDelete = async (id) => {
        try {
            const resultAction = await dispatch(deleteContact(id));
            const result = unwrapResult(resultAction);
            console.log("result", result);
            // Handle successful case
            setSnackbarProperty({
                text: "Contact deleted successfully.",
                color: "success"
            });
            setSnackAlert(true);
        } catch (err) {
            console.log("err", err);
            // Handle error case
            setSnackbarProperty({
                text: err || "Failed to delete contact.",
                color: "danger"
            });
            setSnackAlert(true);
        }
    }
    const onEdit = async (id) => {
        try {
            const resultAction = await dispatch(getContactById(id));
            const result = unwrapResult(resultAction);
            console.log("result", result);
            if(result.length > 0){
                setActive("ContactForm");
            }
        } catch (err) {
            console.log("err", err);
            // Handle error case
            setSnackbarProperty({
                text: err || "Failed to edit contact.",
                color: "danger"
            });
            setSnackAlert(true);
        }
    }
  return (
    <div className="relative overflow-x-auto sm:rounded-lg p-5">
        {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
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
                                        <span onClick={() => onEdit(item.id)} className="cursor-pointer font-medium text-blue-600 hover:underline">Edit </span>
                                        <span>/ </span>
                                        <span onClick={() => onDelete(item.id)} className="cursor-pointer font-medium text-red-600 hover:underline">Delete</span>
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
