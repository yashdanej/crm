import React, { useEffect, useState } from 'react'
import { changeText } from '../../../../utils/Utils';

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
    useEffect(() => {
        console.log("contact", contact);
    }, [contact]);
  return (
    <>
        <div className='p-5'>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Profile Image</label>
                <div className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2'>
                    <input type="file" onChange={(e) => setContact({...contact, profile_image: e.target.files[0]})} />
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
            <div className='md:flex md:justify-around md:gap-10'>
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
            <button onClick={() => setActive("ContactTable")} type="button" className="text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2">Back</button>
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2">Add Contact</button>
        </div>
    </>
  )
}

export default ContactForm
