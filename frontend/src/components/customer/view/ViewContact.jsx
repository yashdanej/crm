import React, { useEffect, useState } from 'react';
import Contact from './views/Contact';
import { useDispatch, useSelector } from 'react-redux';
import Reminders from '../../dashboard/lead/view/Reminders';
import Notes from '../../dashboard/lead/view/Notes';
import Attachments from '../../dashboard/lead/view/Attachments';

const ViewContact = () => {
  const [active, setActive] = useState("Contact");
  const customerId = useSelector(state => state.customer.id);
  const customerData = useSelector(state => state.customer.customers);
  const customeFn = () => {
    const customer = customerData?.data?.find(data => data.id === customerId);
    console.log("customer", customer);
    return `#${customer?.id} ${customer?.company}`
  }
  
  const dispatch = useDispatch();
  // useEffect(() => {
  //   // return () => {
  //   //   dispatch(emptyContactId())
  //   // }
  // }, [dispatch]);
  return (
    <div className='m-6'>
      <div className='grid grid-cols-12 gap-10'>
        <div className='col-span-12 md:col-span-4'>
          <p className='mb-4 font-bold text-2xl text-slate-700'>{customeFn()}</p>
          <div className="bg-white rounded-lg shadow-md">
            {/* Left column content */}
            <p onClick={() => {setActive("Contact")}} className={`px-5 py-3 border-b border-b-slate-200 cursor-pointer font-semibold ${active === "Contact" ? "text-blue-600": "text-slate-700"}`}>Contacts</p>
            <p onClick={() => {setActive("Notes")}} className={`px-5 py-3 border-b border-b-slate-200 cursor-pointer font-semibold ${active === "Notes" ? "text-blue-600": "text-slate-700"}`}>Notes</p>
            <p onClick={() => {setActive("Files")}} className={`px-5 py-3 border-b border-b-slate-200 cursor-pointer font-semibold ${active === "Files" ? "text-blue-600": "text-slate-700"}`}>Files</p>
            <p onClick={() => {setActive("Reminders")}} className={`px-5 py-3 border-b border-b-slate-200 cursor-pointer font-semibold ${active === "Reminders" ? "text-blue-600": "text-slate-700"}`}>Reminders</p>
          </div>
        </div>
        <div className='col-span-12 md:col-span-8'>
          <p className='mb-4 font-bold text-2xl text-slate-700'>Contacts</p>
          <div className="bg-white rounded-lg shadow-md">
            {active === "Contact" && <Contact/> }
            {active === "Notes" && <Notes from="customer" /> }
            {active === "Files" && <Attachments from="customer" /> }
            {active === "Reminders" && <Reminders from="customer" /> }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewContact;
