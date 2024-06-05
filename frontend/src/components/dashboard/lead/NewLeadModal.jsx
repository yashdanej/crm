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
import { api, changeText, displayTimeOfPost, selectedItem } from '../../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { getAssigned, getCountries, getLead, getSource, getStatus, leadIdDeselectAll } from '../../../store/slices/LeadSlices';
import { useState } from 'react';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import AddStatusSources from './AddStatusSources';
import { Chip, Stack, TextField } from '@mui/material';
import InputTags from './tags/InputTags';
import SelectDropDown from './SelectDropDown';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import { fetchCustomFields, getAgents } from '../../../store/slices/SetupSlices';
import Profile from './view/Profile';
import Proposals from './view/Proposals';
import Tasks from './view/Tasks';
import Attachments from './view/Attachments';
import Reminders from './view/Reminders';
import Notes from './view/Notes';
import ActivityLog from './view/ActivityLog';
import { ChromePicker } from 'react-color';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function NewLeadModal({ConvertToCustomer, getDropdownData, setBulkAction, bulkAction, handleCloseView, view, lead, setLead, handleClose, open, onHandleNewLeadClick, getLeads}) {
    const leadIds = useSelector(state => state.leads.leadIds);
    const [openS, setOpenS] = useState(false);
    const [from, setFrom] = useState("");
    const leadData = useSelector((state) => state.leads.leadData);
    const statusDatas = useSelector(state => state.status.statusData);
    const sourceDatas = useSelector(state => state.source.sourceData);
    const assignedDatas = useSelector(state => state.assigned.assignedData);
    const typeOfWorkData = useSelector(state => state.setup.typeOfWork);
    const profileOfClientData = useSelector(state => state.setup.profileOfClient);
    const agentsData = useSelector(state => state.setup.agents);
    const [lost, setLost] = useState(false);
    const [lastcontact, setLastContact] = useState(null);
    const [is_public, setIs_Public] = useState(false);

    const [selectStatus, setSelectStatus] = useState(null);
    const [selectSource, setSelectSource] = useState(null);
    const [selectAssigned, setSelectAssigned] = useState(null);
    const [selectedView, setSelectedView] = useState("Profile");
    const countriesData = useSelector((state) => state.countries.countriesData);

    // custom field
    const customFieldsData = useSelector(state => state.setup.customFields);

    const dispatch = useDispatch();
    const handleDateChange = (date) => {
      setLastContact(date ? dayjs(date).format('MM/DD/YYYY') : null);
    };
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
        handleCloseView();
        dispatch(getLead([]));
    }
    useEffect(() => {
      if(leadData?.length>0){
        setLead({
          status: leadData[0]?.status,
          source: leadData[0]?.source,
          assigned: leadData[0]?.assigned,
          name: leadData[0]?.name,
          address: leadData[0]?.address,
          profileofclient: profileOfClientData?.find(option => option.id == leadData[0]?.profileofclient)?.id,
          typeofwork: typeOfWorkData?.find(option => option.id == leadData[0]?.typeofwork)?.id,
          agent: agentsData?.find(option => option.id == leadData[0]?.agent)?.id,
          tags: leadData[0]?.tags,
          city: leadData[0]?.city,
          email: leadData[0]?.email,
          state: leadData[0]?.state,
          website: leadData[0]?.website,
          country: leadData[0]?.country,
          phonenumber: leadData[0]?.phonenumber,
          zip: leadData[0]?.zip,
          lead_value: leadData[0]?.lead_value,
          default_language: leadData[0]?.default_language,
          company: leadData[0]?.company,
          description: leadData[0]?.description,
          is_public: leadData[0]?.is_public
        })
      }
    }, [leadData]);
    const statusData = useSelector((state) => state.status.statusData);
    const sourceData = useSelector((state) => state.source.sourceData);
    const assignedData = useSelector((state) => state.assigned.assignedData);
   
    let pathname;
    pathname = "/lead/getstatus";

    useEffect(() => {
      console.log('lead', lead);
    console.log("leadIds", leadIds);
      console.log(selectStatus, selectSource, selectAssigned);
    }, [lead, selectStatus, selectSource, selectAssigned]);
    let getUser = JSON.parse(localStorage.getItem("user"));

    const handleSelectLost = (e) => {
      setLost(!lost);
    }
    const handleChange = (event) => {
      setIs_Public(event.target.value === 'public');
    };
    const onBulkAction = () => {
      function formatDateToMySQL(date) {
        const [month, day, year] = date.split('/');
        return `${year}-${month}-${day}`;
      }
      let lastcontected;
      if(lastcontact != undefined || lastcontact != null){
        lastcontected = formatDateToMySQL(lastcontact);
      }
      console.log({leadids: leadIds, lost, status:selectStatus, source: selectSource, lastcontact, assigned: selectAssigned, tags: lead?.tags, is_public});
      api("/lead/bulkaction", "patch", {leadids: leadIds, lost, status:selectStatus, source: selectSource, lastcontact: lastcontected, assigned: selectAssigned, tags: lead?.tags, is_public}, false, true)
      .then((res) => {
        getLeads();
        handleCloseView();
        setBulkAction(false);
        dispatch(leadIdDeselectAll());
        handelCloseLeadModal();
      })
      .catch((err) => {
        console.log("Error in onBulkAction", err);
        handleCloseView();
        setBulkAction(false);
        handelCloseLeadModal();
      });
    }
    const [validationMessage, setValidationMessage] = useState('');
    const [mobileValidation, setMobileValidation] = useState('');
    const validateWebsite = (e) => {
      const urlPattern = new RegExp(
        '^https?:\\/\\/www\\.' + // protocol and www.
        '([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.' + // domain name
        '([a-z]{2,})$', // domain extension
        'i' // case insensitive
      );
  
      const { value } = e.target;
      changeText(e, setLead, lead);
      if (value.trim() !== "" && !urlPattern.test(value)) {
        setValidationMessage('Please enter a valid URL starting with www and ending with a domain extension like .com or .in.');
      } else {
        setValidationMessage('');
      }
    };

    const validatePhoneNumber = (e) => {
      const phoneNumberPattern = /^\d{10}$/; // This pattern matches exactly 10 digits
    const { value } = e.target;
    changeText(e, setLead, lead);

    if (!phoneNumberPattern.test(value)) {
      setMobileValidation('Please enter a valid 10-digit phone number.');
    } else {
      setMobileValidation('');
    }
    };
    const [emailValidation, setEmailValidation] = useState('');
    const validateEmail = (e) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
      const { value } = e.target;
      changeText(e, setLead, lead);
  
      if (!emailPattern.test(value)) {
        setEmailValidation('Please enter a valid email address.');
      } else {
        setEmailValidation('');
      }
    };

    const fetchLocationInfo = async (zipCode) => {
      try {
        console.log(zipCode);
        console.log("Running fetchLocationInfo");
  
        const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?apikey=67783eb0-173d-11ef-934a-11338ba92fe9&codes=${zipCode}`)
  
        console.log("response from axios", response);
  
        const data = response.data;
        console.log("data from zipcode", data);
  
        if (data && data.results && data.results[zipCode]) {
          const firstResult = data.results[zipCode][0];
          const { province, state, country_code } = firstResult;
          console.log("province, state, country_code", province, state, country_code);
          return { province, state, country_code };
        }
      } catch (error) {
        console.error('Error fetching location information:', error);
      }
      return null;
    };
  
    const handleZipCodeChange = async (e) => {
      const zipCode = e.target.value;
      setLead((prevLead) => ({ ...prevLead, zip: zipCode }));
  
      // Fetch location information based on zip code
      const locationInfo = await fetchLocationInfo(zipCode);
      if (locationInfo) {
        const { province, state, country_code } = locationInfo;
        const country = countriesData.find(option => option.iso2 === country_code)  
        setLead((prevLead) => ({ ...prevLead, state, city: province, country: country.short_name }));
      }
    };
    useEffect(() => {
      const fetchAgentsData = () => {
        api("/agents/getallagents", "get", false, false, true)
        .then((res) => {
            dispatch(getAgents(res.data.data));
        })
        .catch((err) => {
            console.log("err in fetchAgentsData", err);
        })
    }
    fetchAgentsData();
  }, []);

  const typeForCustomField = (type) => {
    if(type === "input"){
      return "text";
    }else if(type === "number"){
      return "number";
    }else if(type === "textarea"){
      return "textarea";
      }else if(type === "date_picker"){
        return "date";
      }else if(type === "datetime_picker"){
      return "datetime-local";
    }else if(type === "color_picker"){
      return "color";
    }
  }

  const handleColorChange = (color, name) => {
    setLead({ ...lead, [name]: color.hex });
  };

  const multipleSelectChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setLead({ ...lead, [event.target.name]: selectedOptions.join(",") });
  };

  return (
    <React.Fragment>
      {
        !bulkAction?(
        !view?(
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
                    <p className='text-xs font-semibold mb-1 text-black'>Status*</p>
                    <div className="flex">
                      <DropDown2 leadData={leadData[0]} lead={lead} setLead={setLead} from="Status" />
                        {
                          getUser.role !== 1 &&
                          <button onClick={() => {setOpenS(true);setFrom("Status")}} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                            <ControlPointDuplicateIcon/>
                            
                          </button>
                        }
                    </div>
                </div>
                {
                  openS && <AddStatusSources getDropdownData={getDropdownData} openS={openS} setOpenS={setOpenS} from={from} />
                }
                <div>
                    <p className='text-xs font-semibold mb-1 text-black'>Source*</p>
                    <div className="flex">
                      <DropDown2 leadData={leadData[0]} lead={lead} setLead={setLead} from="Source" />
                      {
                          getUser.role !== 1 &&
                          <button onClick={() => {setOpenS(true);setFrom("Sources")}} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                            <ControlPointDuplicateIcon/>
                          </button>
                        }
                    </div>
                </div>
                <div></div>
                <div>
                <p className='text-xs font-semibold mb-1 text-black'>Assigned*</p>
                    <DropDown2 leadData={leadData[0]} lead={lead} setLead={setLead} from="Assigned" />
                </div>
            </div>
            {
              lead?.source == 3 &&
            <div>
              <p className='text-xs font-semibold mb-1 text-black'>Select Agent*</p>
              <select id="agent" name="agent" value={lead?.agent} onChange={(e) => {changeText(e, setLead, lead)}} className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl">
                <option>Agents</option>
                {agentsData?.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            }
            <div>
              <InputTags lead={lead} setLead={setLead} tagss={leadData[0]?.tags} />
            </div>
            <div>
                <div className='sm:flex block gap-8'>
                    <div className='w-full'>
                        <label htmlFor="name" className="mb-2 text-sm text-start text-grey-900">Name*</label>
                        <input id="name" type="text" name="name" value={lead?.name} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Enter your name" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="address" className="mb-2 text-sm text-start text-grey-900">Address (optional)</label>
                        <textarea rows={1} id="address" value={lead?.address} onChange={(e) => {changeText(e, setLead, lead)}} name="address" placeholder="Enter your address" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"></textarea>
                    </div>
                </div>
                <div className='sm:flex block gap-8'>
                    <div className='w-full'>
                        <label htmlFor="country" className="mb-2 text-sm text-start text-grey-900">Type Of Work (optional)</label>
                        <select id="typeofwork" name="typeofwork" value={lead?.typeofwork} onChange={(e) => {changeText(e, setLead, lead)}} className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl">
                          <option>Type Of Work</option>
                          {typeOfWorkData?.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                    </div>
                    <div className='w-full'>
                        <label htmlFor="country" className="mb-2 text-sm text-start text-grey-900">Profile Of Client (optional)</label>
                        <select id="profileofclient" name="profileofclient" value={lead?.profileofclient} onChange={(e) => {changeText(e, setLead, lead)}} className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl">
                          <option>Profile Of Client</option>
                          {profileOfClientData?.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                    </div>
                    <div className='w-full'>
                    <label htmlFor="zip" className="mb-2 text-sm text-start text-grey-900">Zip Code (optional)</label>
                    <input
                      id="zip"
                      type="number"
                      name="zip"
                      value={lead.zip}
                      onChange={handleZipCodeChange}
                      placeholder="Zip Code"
                      className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                    />
                  </div>
                </div>
                

                <div className='sm:flex block gap-8'>
                <div className='w-full'>
                  <label htmlFor="email" className="mb-2 text-sm text-start text-grey-900">Email{getUser.role === 1 ? "*" : " (optional)"}</label>
                  <span className='text-xs text-red-500'> &nbsp; Recommended for sending mail</span>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={lead?.email.toLowerCase()}
                    onChange={(e) => { validateEmail(e); }}
                    placeholder="mail@loopple.com"
                    className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-1 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  {emailValidation && (
                    <p className="mb-7 text-red-500 text-sm">{emailValidation}</p>
                  )}
                </div>
                <div className='w-full'>
                  <label htmlFor="state" className="mb-2 text-sm text-start text-grey-900">State (optional)</label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={lead.state}
                    disabled
                    placeholder="State"
                    className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                </div>
          </div>
          <div className='sm:flex block gap-8'>
          <div className='w-full'>
      <label htmlFor="website" className="mb-2 text-sm text-start text-grey-900">Website (optional)</label>
      <input
        id="website"
        type="text"
        name="website"
        value={lead?.website}
        onChange={(e) => validateWebsite(e)}
        placeholder="https://www.example.com"
        className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-1 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
      />
      {validationMessage && (
        <p className="mb-7 text-red-500 text-sm">{validationMessage}</p>
      )}
    </div>
        <div className='w-full'>
          <label htmlFor="country" className="mb-2 text-sm text-start text-grey-900">Country (optional)</label>
          <input
            id="country"
            type="text"
            name="country"
            value={lead.country}
            disabled
            placeholder="Country"
            className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
          />
        </div>
          </div>
          <div className='sm:flex block gap-8'>
          <div className='w-full'>
            <label htmlFor="phonenumber" className="mb-2 text-sm text-start text-grey-900">Phone*</label>
            <input
              id="phonenumber"
              type="number"
              name="phonenumber"
              value={lead?.phonenumber}
              onChange={(e) => { validatePhoneNumber(e); }}
              placeholder="Phone"
              className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-1 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />
            {mobileValidation && (
              <p className="mb-7 text-red-500 text-sm">{mobileValidation}</p>
            )}
          </div>
          <div className='w-full'>
          <label htmlFor="city" className="mb-2 text-sm text-start text-grey-900">City (optional)</label>
          <input
            id="city"
            type="text"
            name="city"
            value={lead.city}
            disabled
            placeholder="City"
            className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
          />
        </div>
          </div>
          <div className='sm:flex block gap-8'>
          <div className='w-full'>
            <label htmlFor="lead_value" className="mb-2 text-sm text-start text-grey-900">Lead Value (optional)</label>
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
              <label htmlFor="country" className="mb-2 text-sm text-start text-grey-900">System Language (optional)</label>
              <select id="default_language" name="default_language" value={lead?.default_language} onChange={(e) => {changeText(e, setLead, lead)}} className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl">
                <option>Select default language</option>
                {languages?.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
            <div className='w-full'>
              <label htmlFor="company" className="mb-2 text-sm text-start text-grey-900">Company {getUser.role === 1 ? "*":"(optional)"}</label>
              <input id="company" type="text" name="company" value={lead?.company} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Company" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
            <div className='w-full'>
              <label htmlFor="company" className="mb-2 text-sm text-start text-grey-900">Priority (optional)</label>
              <div className='flex items-center'>
                <select onChange={(e) => changeText(e, setLead, lead)} className='w-full bg-slate-100 rounded-xl p-4' name="priority" id="">
                  <option selected={lead?.priority === "Low"} value="Low">Low</option>
                  <option selected={lead?.priority === "Medium"} value="Medium">Medium</option>
                  <option selected={lead?.priority === "High"} value="High">High</option>
                  <option selected={lead?.priority === "Urgent"} value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
          <div className='sm:flex block gap-8'>
            <div className='w-full'>
              <label htmlFor="description" className="mb-2 text-sm text-start text-grey-900">Description*</label>
              <textarea id="description" name="description" value={lead?.description} onChange={(e) => {changeText(e, setLead, lead)}} placeholder="Description" rows="4" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            </div>
          </div>
          {/* custom fields */}
          <p className='mb-2 font-semibold text-slate-600'>Custom fields:</p>
          {customFieldsData?.data && customFieldsData?.data.length === 0 && <p>No fields found</p>}
          <div className='flex flex-wrap gap-4 justify-between'>
            {
              customFieldsData?.data?.map((item) => {
                if(item.type === "select"){
                  return (
                  <div className='w-[48%]'>
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name}</label>
                    <select name={item.name} onChange={(event) => changeText(event, setLead, lead)} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option></option>
                        {
                            item.options.split(",").map((item2) => {
                                return (
                                    <option value={item2}>{item2}</option>
                                )
                            })
                        }
                    </select>
                  </div>
                  )
                }else if(item.type === "multi_select"){
                  return(
                    <div className='w-[48%]'>
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name} <span className='text-xs'>(To select multiple values hold CTRL)</span></label>
                    <select multiple name={item.name} onChange={multipleSelectChange} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option></option>
                        {
                            item.options.split(",").map((item2) => {
                                return (
                                    <option value={item2}>{item2}</option>
                                )
                            })
                        }
                    </select>
                  </div>
                  )
                }else if(item.type === "checkbox"){
                  return (
                    <div className='w-[48%] flex items-center'>
                      <input name={item.name} onChange={(event) => setLead({...lead, [item.name]: event.target.checked})} id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"><span className='text-red-600'>{item.required ? "* " : ""}</span>{item.name}</label>
                    </div>
                  )
                }else if(item.type === "color_picker"){
                  return (
                    <div className='w-[48%] my-3'>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <span className='text-red-600'>{item.required ? "* " : ""}</span>{item.name}
                      </label>
                      <ChromePicker
                        color={lead[item.name] || (item.default_value ? item.default_value : "#000000")}
                        onChangeComplete={(color) => handleColorChange(color, item.name)}
                      />
                    </div>
                  )
                }
                else{
                  return (
                    <div className='w-[48%]'>
                        <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name}</label>
                        <input name={item.name} onChange={(event) => changeText(event, setLead, lead)} type={typeForCustomField(item.type)} id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={item.required} />
                    </div>
                  )
                }
              })
            }
          </div>
          <div className='sm:flex block gap-8 my-3'>
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
            <button disabled={validationMessage !=="" || mobileValidation !== "" || emailValidation !== ""} onClick={onHandleNewLeadClick} className='disabled:bg-slate-300 bg-purple-blue-500 p-4 px-12 rounded-xl font-bold text-white'>{leadData?.length>0?"Update":"Submit"}</button>
        </div>
        </div>
      </Dialog>
        ):
        (
          <>
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
              <p>#{leadData[0]?.id} {lead?.name}</p>
              <div className='flex items-center my-2 text-slate-600 gap-10'>
                <p className={`cursor-pointer ${selectedView === "Profile" && "p-2 px-7 rounded-lg bg-blue-600 text-white"}`} onClick={() => setSelectedView("Profile")}>Profile</p>
                <p className={`cursor-pointer ${selectedView === "Proposals" && "p-2 px-7 rounded-lg bg-blue-600 text-white"}`} onClick={() => setSelectedView("Proposals")}>Proposals</p>
                <p className={`cursor-pointer ${selectedView === "Tasks" && "p-2 px-7 rounded-lg bg-blue-600 text-white"}`} onClick={() => setSelectedView("Tasks")}>Tasks</p>
                <p className={`cursor-pointer ${selectedView === "Attachments" && "p-2 px-7 rounded-lg bg-blue-600 text-white"}`} onClick={() => setSelectedView("Attachments")}>Attachments</p>
                <p className={`cursor-pointer ${selectedView === "Reminders" && "p-2 px-7 rounded-lg bg-blue-600 text-white"}`} onClick={() => setSelectedView("Reminders")}>Reminders</p>
                <p className={`cursor-pointer ${selectedView === "Notes" && "p-2 px-7 rounded-lg bg-blue-600 text-white"}`} onClick={() => setSelectedView("Notes")}>Notes</p>
                <p className={`cursor-pointer ${selectedView === "Activity Log" && "p-2 px-7 rounded-lg bg-blue-600 text-white"}`} onClick={() => setSelectedView("Activity Log")}>Activity Log</p>
              </div>
              {
                selectedView === "Profile"?<Profile lead={lead} leadData={leadData} ConvertToCustomer={ConvertToCustomer} />:
                selectedView === "Proposals"?<Proposals/>:
                selectedView === "Tasks"?<Tasks/>:
                selectedView === "Attachments"?<Attachments/>:
                selectedView === "Reminders"?<Reminders/>:
                selectedView === "Notes"?<Notes/>:
                <ActivityLog/>
              }
              
            </div>
          </Dialog>
          </>
        )
      ):<>
        <Dialog
        open={bulkAction}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <div className='p-10'>
          <p className='text-gray-500 font-bold text-xl'>Bulk Action</p>
          <hr className='my-6' />
          <div className="flex items-center mb-4">
              <input onChange={(e) => handleSelectLost(e)} checked={lost} id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
              <label for="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mark as lost</label>
          </div>
          <div className="mb-4">
          <label htmlFor="lastcontact-datepicker" className="block text-sm font-medium text-gray-700">Last Contact</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Last Contact"
              value={lastcontact ? dayjs(lastcontact, 'MM/DD/YYYY') : null}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </div>
          {
            !lost &&
            <SelectDropDown name="Change Status" data={statusDatas} set={setSelectStatus} value={selectStatus} />
          }
            <SelectDropDown name="Change Sources" data={sourceDatas} set={setSelectSource} value={selectSource} />
            <SelectDropDown name="Change Assigned" data={assignedDatas} set={setSelectAssigned} value={selectAssigned} />
            Tags:
            <InputTags lead={lead} setLead={setLead} />
            <div>
              <input
                type="radio"
                name="is_public"
                value="public"
                checked={is_public === true}
                onChange={handleChange}
              /> Public

              <input
                type="radio"
                className='ml-5'
                name="is_public"
                value="private"
                checked={is_public === false}
                onChange={handleChange}
              /> Private
            </div>
          </div>
          <button onClick={handleClose} className='bg-slate-500 text-white p-5'>Cancel</button>
          <button onClick={onBulkAction} className='bg-slate-900 text-white p-5'>Bulk action</button>
        </Dialog>
      </>
      }
      
    </React.Fragment>
  );
}
