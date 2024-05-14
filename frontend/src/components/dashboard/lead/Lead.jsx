import React, { useEffect } from 'react'
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
import { getAllLeads, getAssigned, getLead, getSource, getStatus } from '../../../store/slices/LeadSlices';
import { useDispatch, useSelector } from 'react-redux';

const Lead = () => {
  const leadData = useSelector((state) => state.leads.leadData);
  const [open, setOpen] = useState(false);
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const [view, setView] = useState(false);
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
  const handleCloseView = () => {
    setView(false);
  }
  const handleOpenView = () => {
    setView(true);
    handleClickOpen();
  }
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
    handleCloseView();
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
      console.log("leaddData lead", leadData);
      const pathname = leadData.length>0?`/lead/updatelead/${leadData[0].id}`:"/lead/newlead";
      const method = leadData.length>0?"patch":"post";
      api(pathname, method, lead, false, true)
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
  useEffect(() => {
    const fetchData = async (pathname) => {
      try {
          const response = await api(pathname, false, false, true);
          return response.data.data;
      } catch (error) {
          console.error("Error fetching dropdown data:", error);
          return [];
      }
    };
    const getDropdownData = async () => {
        let pathname;
        pathname = "/lead/getstatus";
        dispatch(getStatus(await fetchData(pathname)));
        pathname = "/lead/getsources";
        dispatch(getSource(await fetchData(pathname)));
        pathname = "/lead/getusers";
        dispatch(getAssigned(await fetchData(pathname)));
        }
        getDropdownData();
        
  }, []);
  useEffect(() => {
    console.log("open", open, "view", view);
  }, [open])
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
          <span className='text-xs font-semibold text-black'>Filter by</span>
        <div className="flex items-center gap-7 flex-column flex-wrap md:flex-row md:space-y-0 bg-white pb-8">
          <div>
            <Filter/>
          </div>
          <div>
            <DropDown from="Source" />
          </div>
          <div>
            <DropDown from="Assigned"/>
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
                <div className="flex justify-between items-center mb-4 order-tab">
                    <div>
                      <button type="button" data-tab="order" data-tab-page="active" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">Active</button>
                      <button type="button" data-tab="order" data-tab-page="completed" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">Completed</button>
                      <button type="button" data-tab="order" data-tab-page="canceled" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tr-md rounded-br-md hover:text-gray-600">Canceled</button>
                    </div>
                    <div>
                      <form class="max-w-md mx-auto">   
                          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                          <div class="relative">
                              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                  </svg>
                              </div>
                              <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"placeholder="Search..." />
                              <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
                          </div>
                      </form>
                    </div>
                </div>
               <Table handleOpenView={handleOpenView} handleClickOpen={handleClickOpen} getLeads={getLeads} />
          </div>   
          {
        open && <NewLeadModal handleCloseView={handleCloseView} view={view} onHandleNewLeadClick={onHandleNewLeadClick} lead={lead} setLead={setLead} handleClose={handleClose} open={open} />
      }
    </div>
  )
}

export default Lead
