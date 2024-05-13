import React from 'react'
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/joy/IconButton';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Table from './Table';
import Filter from './Filter';
import DropDown from './DropDown';
import NewLeadModal from './NewLeadModal';
import { useState } from 'react';
import SnackbarWithDecorators, { api } from '../../../utils/Utils';
import { getAllLeads, getLead } from '../../../store/slices/LeadSlices';
import { useDispatch } from 'react-redux';

const Lead = () => {
  const [open, setOpen] = useState(false);
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const [lead, setLead] = useState({
    status: null,
    source: null,
    assigned: null,
    name: "",
    address: "",
    position: "",
    city: "",
    email: "",
    state: "",
    website: "",
    country: null,
    phonenumber: "",
    zip: "",
    lead_value: null,
    default_language: "",
    company: "",
    description: "",
    is_public: 0
});

const dispatch = useDispatch();

  const handleNewLead = () => {
    setLead({
      status: null,
      source: null,
      assigned: null,
      name: "",
      address: "",
      position: "",
      city: "",
      email: "",
      state: "",
      website: "",
      country: null,
      phonenumber: "",
      zip: "",
      lead_value: null,
      default_language: "",
      company: "",
      description: "",
      is_public: 0
  });
  handleClickOpen();
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setLead(prevLead => ({
      status: null,
      source: null,
      assigned: null,
      name: "",
      address: "",
      position: "",
      city: "",
      email: "",
      state: "",
      website: "",
      country: null,
      phonenumber: "",
      zip: "",
      lead_value: null,
      default_language: "",
      company: "",
      description: "",
      is_public: 0
  }));
    dispatch(getLead([]));
    setOpen(false);
  };

  const getLeads = () => {
    api("/lead/getleads", "get", false, false, true)
    .then((res) => {
        console.log("res fron getLeads", res);
        dispatch(getAllLeads(res.data.data));
    })
    .catch((err) => {
        console.log("err fron getLeads", err);
    })
    .finally(() => {
        console.log("Completed");
    })
}

  const onHandleNewLeadClick = () => {
    console.log("lead", lead);
    if (
      lead.name === "" ||
      lead.status === null ||
      lead.source === null ||
      lead.assigned === null ||
      lead.address === "" ||
      lead.position === "" ||
      lead.city === "" ||
      lead.email === "" ||
      lead.state === "" ||
      lead.website === "" ||
      lead.country === null ||
      lead.phonenumber === "" ||
      lead.zip === "" ||
      lead.lead_value === null ||
      lead.default_language === "" ||
      lead.company === "" ||
      lead.description === ""
    ) {
      setSnackbarProperty(prevState => ({
        ...prevState,
        text: "All fields are required",
        color: "danger"
      }));
      setSnackAlert(true);
      return;
    }else{
      api("/lead/newlead", "post", lead, false, true)
      .then((res) => {
        console.log("res from newLead", res);
        handleClose();
        getLeads();
        setSnackbarProperty(prevState => ({
          ...prevState,
          text: res.data.message,
          color: "success"
        }));
        setSnackAlert(true);
      })
      .catch((err) => {
        console.log("err from newLead", err);
      })
      .finally(() => {
        console.log("Completed");
      })
    }
  }
  return (
    <div className="p-6">
      {
      snackAlert?
      <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
      :null
      }
      <div className='flex gap-4'>
        <Button onClick={handleNewLead} startDecorator={<Add />}>New Lead</Button>
        <IconButton variant="soft" >
          <FavoriteBorder />
        </IconButton>
        <IconButton variant="soft" aria-label="Open in new tab" component="a" href="#as-link">
          <OpenInNew />
        </IconButton>
      </div>
      <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 my-6 rounded-md">
        <div className="flex items-center gap-7 flex-column flex-wrap md:flex-row md:space-y-0 bg-white pb-8">
          <div>
              <span className='text-xs font-semibold text-black'>Filter by</span>
            <Filter/>
          </div>
          <div>
              <span className='text-xs font-semibold text-black'>Filter by</span>
            <DropDown/>
          </div>
          <div>
              <span className='text-xs font-semibold text-black'>Filter by</span>
            <DropDown/>
          </div>
        </div>
        
                <div className="flex justify-between mb-4 items-start">
                    <div className="font-medium">Manage orders</div>
                    <div className="dropdown">
                        <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
                        <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                            <li>
                                <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center mb-4 order-tab">
                    <button type="button" data-tab="order" data-tab-page="active" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">Active</button>
                    <button type="button" data-tab="order" data-tab-page="completed" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">Completed</button>
                    <button type="button" data-tab="order" data-tab-page="canceled" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tr-md rounded-br-md hover:text-gray-600">Canceled</button>
                </div>
               <Table handleClickOpen={handleClickOpen} getLeads={getLeads} />
          </div>   
          {
        open && <NewLeadModal onHandleNewLeadClick={onHandleNewLeadClick} lead={lead} setLead={setLead} handleClose={handleClose} open={open} />
      }
    </div>
  )
}

export default Lead
