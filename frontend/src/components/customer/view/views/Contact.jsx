import React, { useState } from 'react'
import ContactTable from './ContactTable'
import ContactForm from './ContactForm';

const Contact = () => {
    const [active, setActive] = useState("ContactTable");
  return (
    <div>
        <div className='pt-5 px-5'>
            <button onClick={() => {setActive("ContactForm")}} type="button" className={`${active === "ContactForm" ? "hidden":"block"} text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2`}>+ Add Contact</button>
        </div>
        <div>
            { active === "ContactTable" && <ContactTable/> }
            { active === "ContactForm" && <ContactForm setActive={setActive} /> }
        </div>
    </div>
  )
}

export default Contact
