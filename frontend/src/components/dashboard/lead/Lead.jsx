import React, { useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import Add from '@mui/icons-material/Add';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/joy/IconButton';
import OpenInNew from '@mui/icons-material/OpenInNew';
import Table from './Table';
import Filter from './Filter';
import DropDown from './DropDown';
import NewLeadModal from './NewLeadModal';
import SnackbarWithDecorators, { BACKEND, api } from '../../../utils/Utils';
import { getAllLeads, getAssigned, getLead, getSource, getStatus, kanbanLeads, kanbanViewFn } from '../../../store/slices/LeadSlices';
import { useDispatch, useSelector } from 'react-redux';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import LeadsKanaban from './kanbanBoard/LeadsKanaban';
import { getUserNotification } from '../../../store/slices/Notification';
import io from 'socket.io-client';
import addNotification from "react-push-notification";

const Lead = () => {
  const leadData = useSelector((state) => state.leads.leadData);
  const checkLeadIdSelected = useSelector(state => state.leads.leadIds);
  const leadsStatus = useSelector(state => state.leads.leadsByStatus);
  const getAllStatus = useSelector(state => state.status.statusData);
  const [open, setOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const [summary, setSummary] = useState(false);
  const [statusQuery, setStatusQuery] = useState([]);
  const [sourceQuery, setSourceQuery] = useState([]);
  const [assignedQuery, setAssignedQuery] = useState([]);
  const [view, setView] = useState(false);
  const [lead, setLead] = useState({
    status: null,
    source: null,
    assigned: null,
    name: "",
    address: "",
    position: "",
    tags: null,
    city: "",
    email: "",
    state: "",
    website: "",
    country: "",
    phonenumber: "",
    zip: "",
    lead_value: null,
    default_language: "",
    company: "",
    description: "",
    priority: "Low",
    is_public: 0
  });
  const kanbanView = useSelector(state => state.leads.kanbanView);
  const socket = useSelector(state => state.notification.socket);
  let getUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (socket) {
      socket.emit("setup", getUser);
    }
  }, [socket, getUser]);
  
  console.log("getUser", getUser);
  const dispatch = useDispatch();

  const handleCloseView = () => {
    setView(false);
    setBulkAction(false);
  };

  const handleOpenView = () => {
    setView(true);
    handleClickOpen();
  };

  const handleNewLead = () => {
    setLead({
      status: null,
      source: null,
      assigned: null,
      name: "",
      address: "",
      position: "",
      tags: null,
      city: "",
      email: "",
      state: "",
      website: "",
      country: "",
      phonenumber: "",
      zip: "",
      lead_value: null,
      default_language: "",
      company: "",
      description: "",
      priority: "",
      is_public: 0
    });
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setLead({
      status: null,
      source: null,
      assigned: null,
      name: "",
      address: "",
      position: "",
      tags: null,
      city: "",
      email: "",
      state: "",
      website: "",
      country: "",
      phonenumber: "",
      zip: "",
      lead_value: null,
      default_language: "",
      company: "",
      description: "",
      is_public: 0
    });
    dispatch(getLead([]));
    handleCloseView();
    setOpen(false);
  };
  const getLeadsByStatus = () => {
    api("/lead/kanbanview", "get", false, false, true)
      .then((res) => {
        dispatch(kanbanLeads(res.data.data));
      })
      .catch((err) => {
        console.log("err in getLeadsByStatus", err);
      });
  };

  const getLeads = () => {
    let query = "";
    if (Array.isArray(statusQuery) && statusQuery.length > 0) {
        console.log('statusQuery', statusQuery);
        query += `status=${statusQuery.join(",")}&`;
    }
    if (Array.isArray(sourceQuery) && sourceQuery.length > 0) {
        console.log('sourceQuery', sourceQuery);
        query += `source=${sourceQuery.join(",")}&`;
    }
    if (Array.isArray(assignedQuery) && assignedQuery.length > 0) {
        console.log('assignedQuery', assignedQuery);
        query += `assigned=${assignedQuery.join(",")}&`;
    }

    api(`/lead/getleads?${query}`, "get", false, false, true)
    .then((res) => {
        console.log("res from getLeads", res);
        dispatch(getAllLeads(res.data.data));
    })
    .catch((err) => {
        console.log("err from getLeads", err);
    })
    .finally(() => {
        console.log("Completed");
    });
}
const countriesData = useSelector((state) => state.countries.countriesData);

  const isFieldEmpty = (field) => field === "" || field === null || field === undefined;
  const onHandleNewLeadClick = () => {
    console.log("lead", lead);
    if (
      (getUser.role === 1 && (isFieldEmpty(lead.email) || isFieldEmpty(lead.company))) ||
      isFieldEmpty(lead.name) ||
      isFieldEmpty(lead.status) ||
      isFieldEmpty(lead.source) ||
      isFieldEmpty(lead.assigned) ||
      isFieldEmpty(lead.phonenumber) ||
      isFieldEmpty(lead.description)
    ) {
      setSnackbarProperty(prevState => ({
        ...prevState,
        text: "* fields are required!",
        color: "danger"
      }));
      setSnackAlert(true);
      return;
    } else {
      console.log("leadData lead", leadData);
      const pathname = leadData.length > 0 ? `/lead/updatelead/${leadData[0].id}` : "/lead/newlead";
      const method = leadData.length > 0 ? "patch" : "post";
      api(pathname, method, lead, false, true)
        .then((res) => {
          console.log("res from newLead", res);
          handleClose();
          api(`/notification/addnotification/${lead.assigned}`, "post", {type: "leadassign"}, false, true)
            .then((res) => {
              if (socket) {
                socket.emit("newnotification", res.data.data);
              }
            })
            .catch((err) => {
              console.log("err from newLead", err);
            })
            .finally(() => {
              console.log("Completed");
            });
          getLeads();
          setSnackbarProperty(prevState => ({
            ...prevState,
            text: res?.data?.message,
            color: "success"
          }));
          setSnackAlert(true);
        })
        .catch((err) => {
          console.log("err from newLead", err);
        })
        .finally(() => {
          console.log("Completed");
        });
    }
  };

  const onSearchLead = (e) => {
    e.preventDefault();
    api(`/lead/leadssearch?search=${searchTxt}`, "get", false, false, true)
      .then((res) => {
        console.log('res', res);
        dispatch(getAllLeads(res.data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setFilterQuery = (type, value) => {
    console.log('value', value);
    if (type === 'status') {
      setStatusQuery(value);
    } else if (type === 'source') {
      setSourceQuery(value);
    } else if (type === 'assigned') {
      setAssignedQuery(value);
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
  };
  const fetchData = async (pathname) => {
    try {
      const response = await api(pathname, "get", false, false, true);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      return [];
    }
  };

  useEffect(() => {
    getDropdownData();
    getLeads(); // Fetch leads initially
    getLeadsByStatus();
  }, []);

  
  useEffect(() => {
    getLeads(); // Fetch leads whenever statusQuery, sourceQuery, or assignedQuery changes
  }, [statusQuery, sourceQuery, assignedQuery]);
 
  return (
    <div className="p-6">
      {
        snackAlert ?
          <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
          : null
      }
      <div className='mb-4 flex gap-4'>
        <Button
          variant="soft"
          color="primary"
          startDecorator={<Add />}
          onClick={handleNewLead}
        >
          Add new lead
        </Button>
        <IconButton onClick={() => setSummary(!summary)} variant="soft" >
          <FavoriteBorder />
        </IconButton>
        {
          !kanbanView?
          <IconButton onClick={() => dispatch(kanbanViewFn(true))} variant="soft" aria-label="Open in new tab" component="a">
            <ArrowCircleRightOutlinedIcon />
          </IconButton>:
          <IconButton onClick={() => dispatch(kanbanViewFn(false))} variant="soft" aria-label="Open in new tab" component="a">
            <ArrowCircleLeftOutlinedIcon />
          </IconButton>
        }
      </div>
      {
        summary && (
          <>
            <p className='font-bold text-xl text-slate-600'>Leads Summary</p>
            <div className="flex flex-wrap justify-between my-6">
              {
                Object.keys(leadsStatus).map((statusKey) => {
                  console.log("statusKey", statusKey);
                  return (
                    <span className={`font-bold text-slate-600`} key={statusKey}>{leadsStatus[statusKey].length}<span style={{color: `${getAllStatus?.find(option => option.id == statusKey)?.color}`}}> {getAllStatus.find(option => option.id == statusKey)?.name}</span> </span>
                  )
                })
              }
            </div>
          </>
        )
      }
      {
        !kanbanView?(
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-4">
          <div className="sm:flex m-auto sm:m-0 space-x-4">
            <Filter setStatusQuery={(value) => setFilterQuery('status', value)} />
            <DropDown from="Source" onChange={setSourceQuery} />
            <DropDown from="Assigned" onChange={setAssignedQuery} />

          </div>
        </div>

        <div className="flex justify-between mb-4 items-start">
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
            <button type="button" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">Active</button>
            <button type="button" className="bg-gray-200 text-sm font-medium disabled:bg-gray-50 disabled:text-gray-400 text-gray-800 py-2 px-4 rounded-tr-md rounded-br-md hover:text-gray-600" disabled={checkLeadIdSelected === "" || checkLeadIdSelected == []} onClick={() => setBulkAction(true)}>Bulk Actions</button>
          </div>
          <div>
            <form className="max-w-md mx-auto">
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input onChange={(e) => setSearchTxt(e.target.value)} value={searchTxt} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." />
                <button onClick={(e) => onSearchLead(e)} type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
              </div>
            </form>
          </div>
        </div>
        <Table handleOpenView={handleOpenView} handleClickOpen={handleClickOpen} getLeads={getLeads} />
      </div>
        ):<LeadsKanaban/>
      }
      {
      ( bulkAction || open) && <NewLeadModal getDropdownData={getDropdownData} getLeads={getLeads} setBulkAction={setBulkAction} bulkAction={bulkAction} handleCloseView={handleCloseView} view={view} onHandleNewLeadClick={onHandleNewLeadClick} lead={lead} setLead={setLead} handleClose={handleClose} open={open} />
      }
    </div>
  );
};

export default Lead;
