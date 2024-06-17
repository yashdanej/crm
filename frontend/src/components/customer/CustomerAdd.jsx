import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { api, changeText } from '../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomFields, getCurrency, getGroup, getItStatus, getLeadCustomField, getMasterType, getSubType, resetCustomField } from '../../store/slices/SetupSlices';
import axios from 'axios';
import { addCustomer, updateCustomer } from '../../store/slices/CustomerSlices';
import { ChromePicker } from 'react-color';

const CustomerAdd = () => {
    // selector state
    const usersData = useSelector(state => state.assigned.assignedData);
    const groupData = useSelector(state => state.setup.group);
    const currencyData = useSelector(state => state.setup.currency);
    const countriesData = useSelector((state) => state.countries.countriesData);
    const it_statusData = useSelector((state) => state.setup.it_status);
    const master_typeData = useSelector((state) => state.setup.master_type);
    const sub_masterData = useSelector((state) => state.setup.sub_type);
    const customerData = useSelector(state => state.customer.customers);
    const customFieldsData = useSelector(state => state.setup.customFields);

    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const [customer, setCustomer] = useState({
        company: "",
        primary_contact: "",
        email: "",
        vat: "",
        phone: "",
        website: "",
        in_groups: "",
        currency: null,
        default_language: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        it_status: null,
        master_type: null,
        sub_type: null,
        pan_no: "",
        gstin: "",
        aadhar_no: "",
        incorporation_date_from: "",
        incorporation_date_to: "",
        licence_no: "",
        licence_authority: "",
        trn_no: "",
        description: "",
        support_employee: ""
    });

    // setting up data for edit
    useEffect(() => {
        if (customerData && customerData.edit && customerData.edit.data.length > 0) {
            const data = customerData.edit.data[0];
            setCustomer(prevCustomer => ({
                ...prevCustomer,
                company: data.company || "",
                primary_contact: data.primary_contact || "",
                email: data.email || "",
                vat: data.vat || "",
                phone: data.phone || "",
                website: data.website || "",
                in_groups: data.in_groups || "",
                currency: data.currency || null,
                default_language: data.default_language || "",
                address: data.address || "",
                city: data.city || "",
                state: data.state || "",
                zip: data.zip || "",
                country: data.country || "",
                it_status: data.it_status || null,
                master_type: data.master_type || null,
                sub_type: data.sub_type || null,
                pan_no: data.pan_no || "",
                gstin: data.gstin || "",
                aadhar_no: data.aadhar_no || "",
                incorporation_date_from: data.incorporation_date_from || "",
                incorporation_date_to: data.incorporation_date_to || "",
                licence_no: data.licence_no || "",
                licence_authority: data.licence_authority || "",
                trn_no: data.trn_no || "",
                description: data.description || "",
                support_employee: data.support_employee || ""
            }));
            dispatch(getLeadCustomField(customerData.edit.id));
        }
    }, [customerData]);

    const dispatch = useDispatch();

    // for zip
    const changeText = async (e) => {
        const { name, value } = e.target;
        setCustomer((prevCustomer) => ({
          ...prevCustomer,
          [name]: value
        }));
    
        if (name === "zip") {
          try {
            const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?apikey=67783eb0-173d-11ef-934a-11338ba92fe9&codes=${value}`);
            console.log("response", response);
            if (response?.data?.results && response?.data?.results[value].length > 0) {
              const { country_code, state, province } = response.data.results[value][0];
              console.log("in");
              setCustomer((prevCustomer) => ({
                ...prevCustomer,
                country: countriesData?.find(country => country.iso2 === country_code)?.short_name,
                state: state,
                city: province
              }));
            } else {
              console.log("out");
              // Clear city, state, and country if no data is found
              setCustomer((prevCustomer) => ({
                ...prevCustomer,
                country: "",
                state: "",
                city: ""
              }));
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      };
      const resetValues = () => {
        setCustomer({
            company: "",
            primary_contact: "",
            email: "",
            vat: "",
            phone: "",
            website: "",
            in_groups: "",
            currency: null,
            default_language: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            it_status: null,
            master_type: null,
            sub_type: null,
            pan_no: "",
            gstin: "",
            aadhar_no: "",
            incorporation_date_from: "",
            incorporation_date_to: "",
            licence_no: "",
            licence_authority: "",
            trn_no: "",
            description: "",
            support_employee: ""
        });
    }
    const handleCustomerAddUpdate = async () => {
        const requireField = ["it_status", "master_type", "company"];
        let isEmpty = false;
        requireField.forEach(element => {
            if (customer[element] === "" || customer[element] === null || customer[element] === undefined) {
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
        const validateVAT = (vat) => {
            const vatRegex = /^[A-Z0-9]{8,12}$/; // Example regex, adjust based on your needs
            return vatRegex.test(vat);
        };
        const validatePhone = (phone) => {
            // Simple example validation: Checks if the phone number is 10 digits
            const phoneRegex = /^\d{10}$/;
            return phoneRegex.test(phone);
        };
        const validateWebsite = (url) => {
            // Regular expression pattern for a basic URL validation
            const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
            return urlRegex.test(url);
        };
    
        if (customer?.email !== "" && !gmailRegex.test(customer?.email)) {
            setSnackbarProperty({
                text: "Please enter a valid email address.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        } else if (customer?.vat !== "" && !validateVAT(customer?.vat)) {
            setSnackbarProperty({
                text: "Please enter a valid VAT number.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        } else if (customer?.phone !== "" && !validatePhone(customer?.phone)) {
            setSnackbarProperty({
                text: "Please enter a valid phone number.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        } else if (customer?.website !== "" && !validateWebsite(customer?.website)) {
            setSnackbarProperty({
                text: "Please enter a valid website URL.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        } else {
            try {
                if (customerData && customerData.edit && customerData.edit.data.length > 0) {
                    await dispatch(updateCustomer({ id: customerData.edit.data[0].id, data: customer })).unwrap();
                    setSnackbarProperty({
                        text: "Customer updated successfully!",
                        color: "success"
                    });
                } else {
                    await dispatch(addCustomer(customer)).unwrap();
                    setSnackbarProperty({
                        text: "Customer added successfully!",
                        color: "success"
                    });
                }
                resetValues();
            } catch (error) {
                setSnackbarProperty({
                    text: error, // Display the error message
                    color: "danger"
                });
            } finally {
                setSnackAlert(true);
            }
        }
    };
    
    useEffect(() => {
        console.log("customer", customer);
        dispatch(getGroup());
        dispatch(getCurrency());
        dispatch(getItStatus());
        dispatch(getMasterType());
        dispatch(getSubType());
    }, [customer]);

    // activity log
    useEffect(() => {
        api("/util/last_active", "patch", false, false, true)
        .then((res) => {
        console.log("res", res);
        })
        .catch((err) => {
        console.log("err in activity log");
        });
        
    }, []);

    useEffect(() => {
        dispatch(getGroup());
        dispatch(fetchCustomFields("tbl_customer"))
    }, []);
    useEffect(() => {
        return () => {
          dispatch(resetCustomField());
        }
    }, []);
    
    useEffect(() => {
        if (customFieldsData?.field?.data && customerData?.edit?.data?.length > 0) {
            const updatedCustomer = { ...customer };
            customFieldsData?.data?.forEach((item) => {
                updatedCustomer[item.name] = customFieldsData?.field?.data?.find(field => field.fieldid === item.id)?.column_value || "";
            });
            console.log("updatedCustomer----------", updatedCustomer);
            setCustomer(updatedCustomer);
        }
    }, [customFieldsData, customerData]);

    const handleColorChange = (color, name) => {
        setCustomer({ ...customer, [name]: color.hex });
    };

    const multipleSelectChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setCustomer({ ...customer, [event.target.name]: selectedOptions.join(",") });
    };
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
  return (
    <div className='mx-6 my-10'>
        {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
        <div className='w-[65%] m-auto'>
            <label for="first_name" className="block mb-2 text-xl font-semibold text-slate-600">Add Customer</label>
            <div className="my-6 bg-white rounded-lg shadow-md">
                <div className='p-6'>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        <span className='text-red-500'>* </span>Company
                        </label>
                        <input
                        value={customer.company}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="company"
                        type="text"
                        id="company"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Company"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Primary Contact
                        </label>
                        <input
                        value={customer.primary_contact}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="primary_contact"
                        type="text"
                        id="primary_contact"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Primary Contact"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Email
                        </label>
                        <input
                        value={customer.email}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="email"
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Email"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        VAT
                        </label>
                        <input
                        value={customer.vat}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="vat"
                        type="text"
                        id="vat"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="VAT"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Phone
                        </label>
                        <input
                        value={customer.phone}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="phone"
                        type="number"
                        id="phone"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Phone"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Website
                        </label>
                        <input
                        value={customer.website}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="website"
                        type="text"
                        id="website"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Website"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        In Groups
                        </label>
                        <select value={customer?.in_groups} name='in_groups' onChange={(event) => changeText(event, setCustomer, customer)} id="in_groups" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option></option>
                            {
                                groupData?.data?.map((item) => {
                                    return (
                                        <option value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Currency
                        </label>
                        <select value={customer?.currency} name='currency' onChange={(event) => changeText(event, setCustomer, customer)} id="currency" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option></option>
                            {
                                currencyData?.data?.map((item) => {
                                    return (
                                        <option value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Address
                        </label>
                        <textarea value={customer.address} name="address" onChange={(event) => changeText(event, setCustomer, customer)} id="address" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your options here..."></textarea>
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Zip
                        </label>
                        <input
                        value={customer.zip}
                        onChange={changeText}
                        name="zip"
                        type="text"
                        id="zip"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Zip"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Country
                        </label>
                        <input
                        value={customer.country}
                        onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                        name="country"
                        type="text"
                        id="country"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Country"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        State
                        </label>
                        <input
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        name="state"
                        type="text"
                        id="state"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="State"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        City
                        </label>
                        <input
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        name="city"
                        type="text"
                        id="city"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="City"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        <span className='text-red-500'>* </span>IT Status
                        </label>
                        <select value={customer?.it_status} name='it_status' onChange={(event) => changeText(event, setCustomer, customer)} id="it_status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option></option>
                            {
                                it_statusData?.data?.map((item) => {
                                    return (
                                        <option value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        <span className='text-red-500'>* </span>Master Type
                        </label>
                        <select value={customer?.master_type} name='master_type' onChange={(event) => changeText(event, setCustomer, customer)} id="master_type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option></option>
                            {
                                master_typeData?.data?.map((item) => {
                                    return (
                                        <option value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Sub Type
                        </label>
                        <select value={customer?.sub_type} name='sub_type' onChange={(event) => changeText(event, setCustomer, customer)} id="sub_type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option></option>
                            {
                                sub_masterData?.data?.map((item) => {
                                    return (
                                        <option value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        PAN No
                        </label>
                        <input
                        value={customer.pan_no}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="pan_no"
                        type="text"
                        id="pan_no"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="PAN No"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        GSTIN
                        </label>
                        <input
                        value={customer.gstin}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="gstin"
                        type="text"
                        id="gstin"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="GSTIN"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Aadhar No
                        </label>
                        <input
                        value={customer.aadhar_no}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="aadhar_no"
                        type="text"
                        id="aadhar_no"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Aadhar No"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Incorporation Date From
                        </label>
                        <input
                        value={customer.incorporation_date_from}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="incorporation_date_from"
                        type="date"
                        id="incorporation_date_from"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Incorporation Date From"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Incorporation Date To
                        </label>
                        <input
                        value={customer.incorporation_date_to}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="incorporation_date_to"
                        type="date"
                        id="incorporation_date_to"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Incorporation Date To"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Licence No
                        </label>
                        <input
                        value={customer.licence_no}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="licence_no"
                        type="text"
                        id="licence_no"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Licence No"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Licence Authority
                        </label>
                        <input
                        value={customer.licence_authority}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="licence_authority"
                        type="text"
                        id="licence_authority"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Licence Authority"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        TRN No
                        </label>
                        <input
                        value={customer.trn_no}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="trn_no"
                        type="text"
                        id="trn_no"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="TRN No"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Description
                        </label>
                        <textarea
                        value={customer.description}
                        onChange={(e) => changeText(e, setCustomer, customer)}
                        name="description"
                        id="description"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Description"
                        required
                        />
                    </div>
                    <div className='my-3'>
                        <label className="block mb-2 text-sm font-medium text-gray-900">
                        Support Employee
                        </label>
                        <select value={customer?.support_employee} name='support_employee' onChange={(event) => changeText(event, setCustomer, customer)} id="support_employee" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option></option>
                            {
                                usersData?.map((item) => {
                                    return (
                                        <option value={item.id}>{item.full_name}</option>
                                    )
                                })
                            }
                        </select>
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
                                    <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name}</label>
                                    <select name={item.name} onChange={(event) => changeText(event, setCustomer, customer)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option></option>
                                        {
                                            item?.options?.split(",").map((item2) => {
                                                return (
                                                    <option selected={customer[item.name]} value={item2}>{item2}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            )
                            }else if(item.type === "multi_select"){
                                return(
                                    <div className='w-[48%]'>
                                    <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name} <span className='text-xs'>(To select multiple values hold CTRL)</span></label>
                                    <select multiple name={item.name} onChange={multipleSelectChange} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option></option>
                                        {
                                            item?.options?.split(",").map((item2) => {
                                                return (
                                                    <option selected={customer[item.name]} value={item2}>{item2}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            )
                            }else if(item.type === "checkbox"){
                                return (
                                    <div className='w-[48%] flex items-center'>
                                    <input selected={customer[item.name]} name={item.name} onChange={(event) => setCustomer({...customer, [item.name]: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label for="link-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"><span className='text-red-600'>{item.required ? "* " : ""}</span>{item.name}</label>
                                    </div>
                                )
                            }else if(item.type === "color_picker"){
                                return (
                                    <div className='w-[48%] my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        <span className='text-red-600'>{item.required ? "* " : ""}</span>{item.name}
                                    </label>
                                    <ChromePicker
                                        color={customer[item.name] || (item.default_value ? item.default_value : "#000000")}
                                        onChangeComplete={(color) => handleColorChange(color, item.name)}
                                    />
                                    </div>
                                )
                            }
                            else if(item.type === "textarea"){
                                return (
                                    <div className='w-[48%] my-3'>
                                    <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name}</label>
                                    <textarea value={customer && customer[item.name]} name={item.name} onChange={(event) => changeText(event, setCustomer, customer)} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Write here...' required={item.required}></textarea>
                                    </div>
                                )
                            }else{
                                return (
                                    <div className='w-[48%]'>
                                        <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name}</label>
                                        <input value={customer[item.name]} name={item.name} onChange={(event) => changeText(event, setCustomer, customer)} type={typeForCustomField(item.type)} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={item.required} />
                                    </div>
                                )
                            }
                        })
                        }
                    </div>
                </div>
                <div className='bg-slate-100 border px-6 py-2 flex items-center justify-end'>
                    <button onClick={handleCustomerAddUpdate} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{customerData && customerData.edit && customerData.edit.data.length > 0 ? "Update":"Add"}</button>
                </div>
            </div>
      </div>
    </div>
  )
}

export default CustomerAdd
