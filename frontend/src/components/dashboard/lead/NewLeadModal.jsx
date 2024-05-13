import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Filter from './Filter';
import DropDown from './DropDown';
import DropDown2 from './DropwDown2';
import { useEffect } from 'react';
import { api, changeText } from '../../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getCountries, getLead } from '../../../store/slices/LeadSlices';
import { useState } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function NewLeadModal({lead, setLead, handleClose, open, onHandleNewLeadClick, getLeads}) {
    const leadData = useSelector((state) => state.leads.leadData);
    const countriesData = useSelector((state) => state.countries.countriesData);
    const dispatch = useDispatch();
    const languages = ["Turkish", "Japanese", "Persian", "Portuguise_br", "Dutch", "Spanish", "Czech", "Polish", "Catalan", "French", "Greek", "Swedish", "Ukrainian", "Portuguese", "Romanian", "Italian", "Chinese", "Indonesia", "Vietnamese", "Bulgarian", "German", "Norwegian", "English", "Slovak", "Russian"];
    useEffect(() => {
        api("/lead/getcountries", "get", false, false, true)
        .then((res) => {
            dispatch(getCountries(res.data.data));
        })
        .catch((err) => {
            console.log('err in countries', err);
        })
    }, []);
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setLead(prevLead => ({
            ...prevLead,
            [name]: checked ? 1 : 0
        }));
    };
    const handelCloseLeadModal = () => {
        handleClose();
        dispatch(getLead([]));
    }
    useEffect(() => {
      console.log('leadData.length', leadData.length);
      if(leadData?.length>0){
        setLead({
          status: leadData[0].status,
          source: leadData[0].source,
          assigned: leadData[0].assigned,
          name: leadData[0].name,
          address: leadData[0].address,
          position: leadData[0].title,
          city: leadData[0].city,
          email: leadData[0].email,
          state: leadData[0].state,
          website: leadData[0].website,
          country: leadData[0].country,
          phonenumber: leadData[0].phonenumber,
          zip: leadData[0].zip,
          lead_value: leadData[0].lead_value,
          default_language: leadData[0].default_language,
          company: leadData[0].company,
          description: leadData[0].description,
          is_public: leadData[0].is_public
        })
      }
    }, [leadData]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="lg"
      >
       <div className='p-8'>
            <p className='pb-4 font-bold'>Add new lead</p>
            <div className="flex w-full justify-between items-center gap-7 flex-column flex-wrap md:flex-row md:space-y-0 bg-white pb-8">
                <div>
                    <p className='text-xs font-semibold mb-1 text-black'>Status</p>
                    <DropDown2 lead={lead} setLead={setLead} from="Status" />
                </div>
                <div>
                    <p className='text-xs font-semibold mb-1 text-black'>Source</p>
                    <DropDown2 lead={lead} setLead={setLead} from="Source" />
                </div>
                <div>
                <p className='text-xs font-semibold mb-1 text-black'>Assigned</p>
                    <DropDown2 lead={lead} setLead={setLead} from="Assigned" />
                </div>
            </div>
            <div>
                <div className='sm:flex block gap-8'>
                    <div className='w-full'>
                        <label htmlFor="name" className="mb-2 text-sm text-start text-grey-900">Name*</label>
                        <input id="name" type="text" name="name" value={lead?.name} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Enter your name" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="address" className="mb-2 text-sm text-start text-grey-900">Address*</label>
                        <textarea rows={1} id="address" value={lead?.address} onChange={(e) => {changeText(e, setLead, lead)}} name="address" placeholder="Enter your address" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"></textarea>
                    </div>
                </div>
                <div className='sm:flex block gap-8'>
                    <div className='w-full'>
                        <label htmlFor="position" className="mb-2 text-sm text-start text-grey-900">Position*</label>
                        <input id="position" type="text" value={lead?.position} onChange={(e) => {changeText(e, setLead, lead)}} name="position" placeholder="Enter your position" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
                    </div>
                    <div className='w-full'>
                    <label htmlFor="city" className="mb-2 text-sm text-start text-grey-900">City*</label>
                        <input id="city" type="text" name="city" value={lead?.city} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Enter your city" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
                    </div>
                </div>
                

                <div className='sm:flex block gap-8'>
            <div className='w-full'>
              <label htmlFor="email" className="mb-2 text-sm text-start text-grey-900">Email*</label>
              <input id="email" type="email" name="email" value={lead?.email} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="mail@loopple.com" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
            <div className='w-full'>
              <label htmlFor="state" className="mb-2 text-sm text-start text-grey-900">State*</label>
              <input id="state" type="text" name="state" value={lead?.state} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="State" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
            <div className='w-full'>
              <label htmlFor="website" className="mb-2 text-sm text-start text-grey-900">Website</label>
              <input id="website" type="text" name="website" value={lead?.website} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Website" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
            <div className='w-full'>
              <label htmlFor="country" className="mb-2 text-sm text-start text-grey-900">Country*</label>
              <select id="country" name="country" value={lead?.country} onChange={(e) => {
                const value = parseInt(e.target.value); // Parse input value as a number
                changeText(e, setLead, lead, value) 
                }} 
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl">
                {countriesData?.map(country => (
                  <option key={country.country_id} value={country.country_id}>{country.short_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
            <div className='w-full'>
              <label htmlFor="phonenumber" className="mb-2 text-sm text-start text-grey-900">Phone</label>
              <input id="phonenumber" type="text" name="phonenumber" value={lead?.phonenumber} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Phone" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
            <div className='w-full'>
              <label htmlFor="zip" className="mb-2 text-sm text-start text-grey-900">Zip Code</label>
              <input id="zip" type="text" name="zip" value={lead?.zip} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Zip Code" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
          <div className='w-full'>
    <label htmlFor="lead_value" className="mb-2 text-sm text-start text-grey-900">Lead Value*</label>
    <input 
        id="lead_value" 
        type="number" 
        name="lead_value" 
        value={lead?.lead_value} 
        onChange={(e) => { 
            const value = parseInt(e.target.value); // Parse input value as a number
            changeText(e, setLead, lead, value) 
        }} 
        placeholder="Lead Value" 
        className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
    />
</div>

            <div className='w-full'>
              <label htmlFor="country" className="mb-2 text-sm text-start text-grey-900">System Language*</label>
              <select id="default_language" name="default_language" value={lead?.default_language} onChange={(e) => {changeText(e, setLead, lead)}} className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl">
                {languages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
            <div className='w-full'>
              <label htmlFor="company" className="mb-2 text-sm text-start text-grey-900">Company</label>
              <input id="company" type="text" name="company" value={lead?.company} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Company" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
            <div className='w-full'>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
            <div className='w-full'>
              <label htmlFor="description" className="mb-2 text-sm text-start text-grey-900">Description</label>
              <textarea id="description" name="description" value={lead?.description} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Description" rows="4" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="public" 
                        name="is_public" 
                        className="mr-2" 
                        checked={lead.is_public === 1}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="public" className="text-sm text-grey-900">Public</label>
                </div>
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="contacted" 
                        name="contacted" 
                        className="mr-2" 
                        checked={true} // Set to true to make it checked by default
                    />
                    <label htmlFor="contacted" className="text-sm text-grey-900">Contacted Today</label>
                </div>
            </div>
            </div>
        <div className='flex gap-2 my-5 justify-end'>
            <button onClick={handelCloseLeadModal} className='bg-blue-950 p-4 px-12 rounded-xl font-bold text-white'>Cancel</button>
            <button onClick={onHandleNewLeadClick} className='bg-purple-blue-500 p-4 px-12 rounded-xl font-bold text-white'>Submit</button>
        </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}