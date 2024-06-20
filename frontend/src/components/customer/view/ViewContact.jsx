import React, { useEffect, useState } from 'react';
import Contact from './views/Contact';
import CustomerNotes from './views/CustomerNotes';
import CustomerFile from './views/CustomerFile';
import { useDispatch, useSelector } from 'react-redux';
import { emptyContactId, getContact } from '../../../store/slices/CustomerSlices';

const ViewContact = () => {
  const [active, setActive] = useState("Contact");
  const customerId = useSelector(state => state.customer.id);
  
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
          <p className='mb-4 font-bold text-2xl text-slate-700'>#144 3Squares</p>
          <div className="bg-white rounded-lg shadow-md">
            {/* Left column content */}
            <p onClick={() => {setActive("Contact")}} className={`px-5 py-3 border-b border-b-slate-200 cursor-pointer font-semibold ${active === "Contact" ? "text-blue-600": "text-slate-700"}`}>Contacts</p>
            <p onClick={() => {setActive("Notes")}} className={`px-5 py-3 border-b border-b-slate-200 cursor-pointer font-semibold ${active === "Notes" ? "text-blue-600": "text-slate-700"}`}>Notes</p>
            <p onClick={() => {setActive("Files")}} className={`px-5 py-3 border-b border-b-slate-200 cursor-pointer font-semibold ${active === "Files" ? "text-blue-600": "text-slate-700"}`}>Files</p>
          </div>
        </div>
        <div className='col-span-12 md:col-span-8'>
          <p className='mb-4 font-bold text-2xl text-slate-700'>Contacts</p>
          <div className="bg-white rounded-lg shadow-md">
            {active === "Contact" && <Contact/> }
            {active === "Notes" && <CustomerNotes/> }
            {active === "Files" && <CustomerFile/> }
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewContact;
