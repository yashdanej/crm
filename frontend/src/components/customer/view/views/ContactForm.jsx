import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { LoadingAnimation, changeText } from '../../../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, emptyContactEdit, updateContact } from '../../../../store/slices/CustomerSlices';
import { unwrapResult } from '@reduxjs/toolkit';

const ContactForm = ({setActive}) => {
    const [contact, setContact] = useState({
        profile_image: null,
        userid: null,
        is_primary: true,
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
        title: "",
        password: "",
        invoice_emails: false,
        estimate_emails: false,
        credit_note_emails: false,
        contract_emails: false,
        task_emails: false,
        project_emails: false,
        ticket_emails: false
    });
    const contactEditData = useSelector(state => state.customer.contacts);
    useEffect(() => {
        if (contactEditData && contactEditData.edit && contactEditData.edit.data && contactEditData.edit.data.length > 0) {
            const data = contactEditData.edit.data[0];
            setContact(prevContact => ({
                ...prevContact,
                profile_image: data.profile_image || null,
                userid: data.userid || null,
                is_primary: data.is_primary !== undefined ? data.is_primary : true,
                firstname: data.firstname || "",
                lastname: data.lastname || "",
                email: data.email || "",
                phonenumber: data.phonenumber || "",
                title: data.title || "",
                password: data.password || "",
                invoice_emails: data.invoice_emails || false,
                estimate_emails: data.estimate_emails || false,
                credit_note_emails: data.credit_note_emails || false,
                contract_emails: data.contract_emails || false,
                task_emails: data.task_emails || false,
                project_emails: data.project_emails || false,
                ticket_emails: data.ticket_emails || false
            }));
        }
    }, [contactEditData]);
    
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const contactData = useSelector(state => state.customer);
    
    const dispatch = useDispatch();
    const resetValues = () => {
        setContact({
            profile_image: null,
            userid: null,
            is_primary: true,
            firstname: "",
            lastname: "",
            email: "",
            phonenumber: "",
            title: "",
            password: "",
            invoice_emails: false,
            estimate_emails: false,
            credit_note_emails: false,
            contract_emails: false,
            task_emails: false,
            project_emails: false,
            ticket_emails: false
        });
    }
    const onSubmit = async () => {
        const requireField = ["firstname", "lastname", "email", "password"];
        let isEmpty = false;
        requireField.forEach(element => {
            if (contact[element] === "" || contact[element] === null || contact[element] === undefined) {
                setSnackbarProperty({
                    text: `${element} is required`,
                    color: "danger"
                });
                setSnackAlert(true);
                isEmpty = true; // Set isEmpty to true if a required field is empty
            }
        });
    
        // If any required field is empty, return from the function
        if (isEmpty) {
            return;
        }
    
        const gmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validatePhone = (phone) => {
            // Simple example validation: Checks if the phone number is 10 digits
            const phoneRegex = /^\d{10}$/;
            return phoneRegex.test(phone);
        };
    
        if (contact?.email !== "" && !gmailRegex.test(contact?.email)) {
            setSnackbarProperty({
                text: "Please enter a valid email address.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        }else if (contact?.phonenumber !== "" && !validatePhone(contact?.phonenumber)) {
            setSnackbarProperty({
                text: "Please enter a valid phone number.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        }
        // Convert boolean values to integers
        const formattedContact = {
            ...contact,
            is_primary: contact.is_primary ? 1 : 0,
            invoice_emails: contact.invoice_emails ? 1 : 0,
            estimate_emails: contact.estimate_emails ? 1 : 0,
            credit_note_emails: contact.credit_note_emails ? 1 : 0,
            contract_emails: contact.contract_emails ? 1 : 0,
            task_emails: contact.task_emails ? 1 : 0,
            project_emails: contact.project_emails ? 1 : 0,
            ticket_emails: contact.ticket_emails ? 1 : 0
        };

        try {
            if(contactEditData && contactEditData.edit && contactEditData.edit.data && contactEditData.edit.data.length > 0){
                const resultAction = await dispatch(updateContact({id: contactEditData?.edit?.data[0]?.id, data: formattedContact}));
                const result = unwrapResult(resultAction);
                console.log("result", result);
                // Handle successful case
                if(result.success){
                    setSnackbarProperty({
                        text: "Contact updated successfully.",
                        color: "success"
                    });
                    setSnackAlert(true);
                    resetValues();
                }else{
                   // Handle error case
                    setSnackbarProperty({
                        text: contactData.contacts.message || "Failed to add contact.",
                        color: "danger"
                    });
                    setSnackAlert(true);
                }
            }else{
                const resultAction = await dispatch(addContact(formattedContact));
                const result = unwrapResult(resultAction);
                console.log("result", result);
                // Handle successful case
                if(result.success){
                    setSnackbarProperty({
                        text: "Contact added successfully.",
                        color: "success"
                    });
                    setSnackAlert(true);
                    resetValues();
                }else{
                   // Handle error case
                    setSnackbarProperty({
                        text: contactData.contacts.message || "Failed to add contact.",
                        color: "danger"
                    });
                    setSnackAlert(true);
                }
            }
        } catch (err) {
            console.log("err", err);
            // Handle error case
            setSnackbarProperty({
                text: err || "Failed to add contact.",
                color: "danger"
            });
            setSnackAlert(true);
        }
    }

    useEffect(() => {
        console.log("contact", contact);
        contact.userid = contactData.id;
    }, [contact]);
  return (
    <>
    {
        contactData.contacts.isLoading || contactData.contacts.edit.isLoading && <LoadingAnimation/>
    }
        {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
        <div className='p-5'>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Profile Image</label>
                <div className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2'>
                    <label htmlFor="profile_image_input" className="cursor-pointer">
                        Choose Profile Image
                        <input 
                            id="profile_image_input"
                            type="file" 
                            multiple={false} // Set to true if you want to allow multiple files
                            onInput={(e) => setContact({...contact, profile_image: e.target.files[0]})}
                            style={{ display: 'none' }} // Hide the input visually
                        />
                    </label>
                    {contact.profile_image && (
                        <div>Selected File:
                            {contact.profile_image.name?contact.profile_image.name:<a className='text-blue-600' target='_blank' href={contact.profile_image}>{contact.profile_image}</a>}</div>
                    )}
                </div>
            </div>
            <div className='md:flex md:justify-between md:gap-10'>
                <div className='w-full my-3'>
                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>First Name</label>
                    <input
                    value={contact.firstname}
                    onChange={(e) => changeText(e, setContact, contact)}
                    name="firstname"
                    type="text"
                    id="firstname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                    />
                </div>
                <div className='w-full my-3'>
                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Last Name</label>
                    <input
                    value={contact.lastname}
                    onChange={(e) => changeText(e, setContact, contact)}
                    name="lastname"
                    type="text"
                    id="lastname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                    />
                </div>
            </div>
            <div className='w-full my-3'>
                <label className="block mb-2 text-sm font-medium text-gray-900">Position</label>
                <input
                value={contact.title}
                onChange={(e) => changeText(e, setContact, contact)}
                name="title"
                type="text"
                id="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder=""
                required
                />
            </div>
            <div className='md:flex md:justify-between md:gap-10'>
                <div className='w-full my-3'>
                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Email</label>
                    <input
                    value={contact.email}
                    onChange={(e) => changeText(e, setContact, contact)}
                    name="email"
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                    />
                </div>
                <div className='w-full my-3'>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Phone</label>
                    <input
                    value={contact.phonenumber}
                    onChange={(e) => changeText(e, setContact, contact)}
                    name="phonenumber"
                    type="number"
                    id="phonenumber"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder=""
                    required
                    />
                </div>
            </div>
            <div className='w-full my-3'>
                <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Password</label>
                <input
                value={contact.password}
                onChange={(e) => changeText(e, setContact, contact)}
                name="password"
                type="text"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder=""
                required
                />
            </div>
            <hr className='my-7' />
            <div className='md:flex md:justify-around md:gap-4 lg:gap-10'>
                <div className="my-2 flex items-center">
                    <input checked={contact?.is_primary} name='is_primary' onChange={(event) => setContact({...contact, is_primary: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                    <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Primary Contact</label>
                </div>
                <div className="my-2 flex items-center">
                    <input checked={contact?.invoice_emails} name='invoice_emails' onChange={(event) => setContact({...contact, invoice_emails: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                    <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Invoices</label>
                </div>
                <div className="my-2 flex items-center">
                    <input checked={contact?.estimate_emails} name='estimate_emails' onChange={(event) => setContact({...contact, estimate_emails: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                    <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Estimates</label>
                </div>
                <div className="my-2 flex items-center">
                    <input checked={contact?.contract_emails} name='contract_emails' onChange={(event) => setContact({...contact, contract_emails: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                    <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Contracts</label>
                </div>
                <div className="my-2 flex items-center">
                    <input checked={contact?.project_emails} name='project_emails' onChange={(event) => setContact({...contact, project_emails: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"/>
                    <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Projects</label>
                </div>
            </div>
        </div>
        <div className='bg-slate-100 border px-6 py-2 flex items-center justify-end'>
            <button onClick={() => {setActive("ContactTable"); dispatch(emptyContactEdit())}} type="button" className="text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2">Back</button>
            <button onClick={onSubmit} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2">{contactEditData && contactEditData.edit && contactEditData.edit.data && contactEditData.edit.data.length > 0 ? "Update Contact":"Add Contact"} {contactData.contacts.isLoading && "--Loading..."} {contactData.contacts.edit.isLoading && "--Loading..."}</button>
        </div>
    </>
  )
}

export default ContactForm
