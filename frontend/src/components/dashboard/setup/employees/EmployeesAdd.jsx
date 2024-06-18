import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { api, changeText } from '../../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, addEmployeeDetail, fetchCustomFields, getDesignation, getEmployeeDetails, getLeadCustomField, getRoles, resetCustomField, resetEmployee, updateEmployee } from '../../../../store/slices/SetupSlices';
import axios from 'axios';
import { getCountries } from '../../../../store/slices/LeadSlices';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';

const EmployeesAdd = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const empData = useSelector(state => state.setup.employees)
    const designationData = useSelector(state => state.setup.designation)
    const customFieldsData = useSelector(state => state.setup.customFields);

    const [employee, setEmployee] = useState({
        profile_img: null,
        full_name: "",
        email: "",
        phone: "",
        address: "",
        postal_code: "",
        designation: "",
        joining_date: "",
        role: 1,
        user_password: ""
    });

    useEffect(() => {
        if (empData && empData.details && empData.details.data.length > 0) {
            const data = empData.details.data[0];
            setEmployee({
                profile_img: data.profile_img || null,
                full_name: data.full_name || "",
                email: data.email || "",
                phone: data.phone || "",
                address: data.address || "",
                postal_code: data.postal_code || "",
                designation: data.designation || "",
                joining_date: data.joining_date || "",
                role: data.role || 1,
                user_password: data.user_password || ""
            });
            dispatch(getLeadCustomField(empData.details.id));
        }
    }, [empData]);
    useEffect(() => {
        console.log("employee", employee);
    }, [employee]);
    const [empDetail, setEmpDetail] = useState({
        pf_number: "",
        aadhar_number: "",
        passport: "",
        passport_authority: "",
        visa: "",
        visa_authority: "",
        eid: "",
        eid_authority: "",
        bank_name: "",
        account_holder_name: "",
        bank_ifsc_code: "",
        esi_number: "",
        driving_licence_no: "",
        passport_date_from: "",
        passport_date_to: "",
        visa_date: "",
        eid_date_from: "",
        eid_date_to: "",
        bank_branch: "",
        bank_account_no: "",
    });
    useEffect(() => {
        if (empData && empData.edit && empData.edit.data.length > 0) {
            const data = empData.edit.data[0];
            setEmpDetail({
                pf_number: data.pf_number || "",
                aadhar_number: data.aadhar_number || "",
                passport: data.passport || "",
                passport_authority: data.passport_authority || "",
                visa: data.visa || "",
                visa_authority: data.visa_authority || "",
                eid: data.eid || "",
                eid_authority: data.eid_authority || "",
                bank_name: data.bank_name || "",
                account_holder_name: data.account_holder_name || "",
                bank_ifsc_code: data.bank_ifsc_code || "",
                esi_number: data.esi_number || "",
                driving_licence_no: data.driving_licence_no || "",
                passport_date_from: data.passport_date_from || "",
                passport_date_to: data.passport_date_to || "",
                visa_date: data.visa_date || "",
                eid_date_from: data.eid_date_from || "",
                eid_date_to: data.eid_date_to || "",
                bank_branch: data.bank_branch || "",
                bank_account_no: data.bank_account_no || ""
            });
        }
    }, [empData]);
    const [detail, setDetail] = useState(false);
    const dispatch = useDispatch();
    const rolesData = useSelector(state => state.setup.roles);
    
      useEffect(() => {
        api("/lead/getcountries", "get", false, false, true)
        .then((res) => {
            dispatch(getCountries(res.data.data));
        })
        .catch((err) => {
            console.log('err in countries', err);
        })

        // last active
        api("/util/last_active", "patch", false, false, true)
        .then((res) => {
        console.log("res", res);
        })
        .catch((err) => {
        console.log("err in activity log");
        });
      }, []);

    const fetchDesignationsData = () => {
        api("/util/designation", "get", false, false, true)
        .then((res) => {
            dispatch(getDesignation(res.data.data));
        })
        .catch((err) => {
            console.log("err in fetchDesignationsData", err);
        })
    }
    useEffect(() => {
        dispatch(getRoles());
        fetchDesignationsData();
    }, []);
    const handleEmployeeAdd = () => {
        if (employee.full_name === "" || employee.email === "" || employee.phone === "" || employee.joining_date === "" || employee.user_password === "") {
            setSnackbarProperty({
                text: "* fields are required.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        }
        // Mobile number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(employee.phone)) {
            setSnackbarProperty({
                text: "Please enter a valid phone number.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        }
    
        // Gmail validation
        const gmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!gmailRegex.test(employee.email)) {
            setSnackbarProperty({
                text: "Please enter a valid Gmail address.",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        }
    
        try {
            if (empData && empData.details && empData.details.data.length > 0) {
                dispatch(updateEmployee({ id: empData.details.id, data: employee }))
                    .then((response) => {
                        if (response.payload?.success) {
                            dispatch(getEmployeeDetails(empData.details.id));
                            setDetail(true);
                        } else {
                            setSnackbarProperty({
                                text: response.payload?.message || "An error occurred",
                                color: "danger"
                            });
                            setSnackAlert(true);
                        }
                    })
                    .catch((error) => {
                        console.log("error in updating employee", error);
                        setSnackbarProperty({
                            text: error.message || "An error occurred",
                            color: "danger"
                        });
                        setSnackAlert(true);
                    });
            } else {
                dispatch(addEmployee(employee))
                    .then((response) => {
                        console.log("response-----------wdwd", response);
                        if (response.payload?.success) {
                            setDetail(true);
                        } else {
                            setSnackbarProperty({
                                text: response.payload || "An error occurred",
                                color: "danger"
                            });
                            setSnackAlert(true);
                        }
                    })
                    .catch((error) => {
                        console.log("error in adding employee", error);
                        setSnackbarProperty({
                            text: error.message || "An error occurred",
                            color: "danger"
                        });
                        setSnackAlert(true);
                    });
            }
        } catch (error) {
            console.log("error in handling employee", error);
            setSnackbarProperty({
                text: error.message || "An error occurred",
                color: "danger"
            });
            setSnackAlert(true);
            return;
        }
    }
    useEffect(() => {
        if(empData.message !== "")
        if(empData.success){
            setSnackbarProperty({
                text: empData.message,
                color: "success"
            });
            setSnackAlert(true);
        }else{
            setSnackbarProperty({
                text: empData.message,
                color: "danger"
            });
            setSnackAlert(true);
        }
    }, [empData]);

    useEffect(() => {
        if(detail){
            dispatch(getEmployeeDetails(empData?.details?.id));
        }
    }, [detail]);
    const validateInput = (name, value) => {
        // Add validation logic based on the input name
        switch (name) {
            case 'pf_number':
                // Example validation for PF number
                return validator.isLength(value, { min: 6 });
            case 'aadhar_number':
                // Example validation for Aadhar number
                return validator.isLength(value, { exact: 12 });
            case 'passport':
                // Example validation for Passport
                return validator.isPassportNumber(value, 'IN');
            case 'passport_authority':
                // Example validation for Passport Authority
                return validator.isAlphanumeric(value);
            case 'visa':
                // Example validation for Visa
                return validator.isAlphanumeric(value);
            case 'visa_authority':
                // Example validation for Visa Authority
                return validator.isAlphanumeric(value);
            case 'eid':
                // Example validation for EID
                return validator.isAlphanumeric(value);
            case 'eid_authority':
                // Example validation for EID Authority
                return validator.isAlphanumeric(value);
            case 'bank_name':
                // Example validation for Bank Name
                return validator.isAlphanumeric(value);
            case 'account_holder_name':
                // Example validation for Account Holder Name
                return validator.isAlphanumeric(value);
            case 'bank_ifsc_code':
                // Example validation for Bank IFSC Code
                return validator.isAlphanumeric(value);
            case 'esi_number':
                // Example validation for ESI Number
                return validator.isAlphanumeric(value);
            case 'driving_licence_no':
                // Example validation for Driving Licence Number
                return validator.isAlphanumeric(value);
            case 'passport_date_from':
                // Example validation for Passport Date From
                return validator.isDate(value);
            case 'passport_date_to':
                // Example validation for Passport Date To
                return validator.isDate(value);
            case 'visa_date':
                // Example validation for Visa Date
                return validator.isDate(value);
            case 'eid_date_from':
                // Example validation for EID Date From
                return validator.isDate(value);
            case 'eid_date_to':
                // Example validation for EID Date To
                return validator.isDate(value);
            case 'bank_branch':
                // Example validation for Bank Branch
                return validator.isAlphanumeric(value);
            case 'bank_account_no':
                // Example validation for Bank Account Number
                return validator.isAlphanumeric(value);
            default:
                return true;
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        console.log("empData", empData);
    }, [empData]);
    // useEffect(() => {
    //     if(empData.details.message !== "")
    //     if(empData.details.success){
    //         setSnackbarProperty({
    //             text: empData.details.message,
    //             color: "success"
    //         });
    //         setSnackAlert(true);
    //     }else{
    //         setSnackbarProperty({
    //             text: empData.details.message,
    //             color: "danger"
    //         });
    //         setSnackAlert(true);
    //     }
    // }, [empData.details]);
    const handleEmpDetail = () => {
        for (const key in empDetail) {
            // Skip validation if the field is empty
            if (!empDetail[key]) {
                continue;
            }
            if (!validateInput(key, empDetail[key])) {
                setSnackbarProperty({
                    text: `Enter valid ${key}`,
                    color: "danger"
                });
                setSnackAlert(true);
                console.error(`Validation failed for ${key}`);
                return;
            }
        }
        dispatch(addEmployeeDetail({id: empData.details.id, data: empDetail}))
        navigate("/setup/employees");
    }
    useEffect(() => {
        dispatch(fetchCustomFields("users"))
        return () => {
            dispatch(resetEmployee());
            dispatch(resetCustomField());
        }
    }, []);

    useEffect(() => {
        if (customFieldsData?.field?.data && empData?.details?.data?.length > 0) {
            const updatedEmployee = { ...employee };
            customFieldsData?.data?.forEach((item) => {
                updatedEmployee[item.name] = customFieldsData?.field?.data?.find(field => field.fieldid === item.id)?.column_value || "";
            });
            console.log("updatedEmployee----------", updatedEmployee);
            setEmployee(updatedEmployee);
        }
    }, [customFieldsData, empData]);

    const handleColorChange = (color, name) => {
        setEmployee({ ...employee, [name]: color.hex });
    };

    const multipleSelectChange = (event) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setEmployee({ ...employee, [event.target.name]: selectedOptions.join(",") });
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
        <button onClick={() => setDetail(false)} type="button" className={`text-white ${!detail?"bg-blue-700": "bg-blue-400"} hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm me-2 px-5 py-[9px]`}>Employee</button>
        <button onClick={() => setDetail(true)} type="button" disabled={!empData?.details?.id} className={`text-white ${detail?"bg-blue-700": "bg-blue-400"} hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px]`}>{!empData?.details?.id ? "--disabled Employee Other Details":"Employee Other Details"}</button>
            <div className="my-6 bg-white rounded-lg shadow-md">
                <div className='p-6'>
                    {
                        !detail ? (
                            <>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Profile image</label>

                                    <div className="flex items-center justify-center w-full">
                                        <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input onChange={(e) => setEmployee({...employee, profile_img: e.target.files[0]})} name="profile_img" id="dropzone-file" type="file" className="hidden" />
                                        </label>
                                    </div> 
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Fullname</label>
                                    <input value={employee?.full_name} onChange={(e) => changeText(e, setEmployee, employee)} name="full_name" type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                                </div>
                                
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Email</label>
                                    <input value={employee?.email} onChange={(e) => changeText(e, setEmployee, employee)} name="email" type="email" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Phonenumber</label>
                                    <input value={employee?.phone} onChange={(e) => changeText(e, setEmployee, employee)} name="phone" type="number" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                    <textarea value={employee?.address} onChange={(e) => changeText(e, setEmployee, employee)} name="address" id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your address here..."></textarea>
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Postal Code</label>
                                    <input name="postal_code" value={employee?.postal_code} onChange={(e) => changeText(e, setEmployee, employee)} type="number" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Designation</label>
                                    <select onChange={(e) => changeText(e, setEmployee, employee)} name='designation' id="designation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option>Nothing selected</option>
                                        {
                                            designationData && designationData?.map((item) => {
                                                return (
                                                    <option selected={item.id == employee?.designation} key={item.id} value={item.id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Joining Date</label>
                                    <input value={employee?.joining_date} onChange={(e) => changeText(e, setEmployee, employee)} name="joining_date" type="date" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Role</label>
                                    <select onChange={(e) => changeText(e, setEmployee, employee)} name='role' id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option>Nothing selected</option>
                                        {
                                            rolesData && rolesData?.data?.map((item) => {
                                                return (
                                                    <option selected={item.id === employee?.role} key={item.id} value={item.id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Password</label>
                                    <input value={employee?.user_password} onChange={(e) => changeText(e, setEmployee, employee)} name="user_password" type="password" id="first_name" className="disabled:bg-slate-200 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
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
                                                <select name={item.name} onChange={(event) => changeText(event, setEmployee, employee)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                    <option></option>
                                                    {
                                                        item?.options?.split(",").map((item2) => {
                                                            return (
                                                                <option selected={employee[item.name]} value={item2}>{item2}</option>
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
                                                                <option selected={employee[item.name]} value={item2}>{item2}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        )
                                        }else if(item.type === "checkbox"){
                                            return (
                                                <div className='w-[48%] flex items-center'>
                                                <input selected={employee[item.name]} name={item.name} onChange={(event) => setEmployee({...employee, [item.name]: event.target.checked})} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
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
                                                    color={employee[item.name] || (item.default_value ? item.default_value : "#000000")}
                                                    onChangeComplete={(color) => handleColorChange(color, item.name)}
                                                />
                                                </div>
                                            )
                                        }
                                        else if(item.type === "textarea"){
                                            return (
                                                <div className='w-[48%] my-3'>
                                                <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name}</label>
                                                <textarea value={employee && employee[item.name]} name={item.name} onChange={(event) => changeText(event, setEmployee, employee)} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Write here...' required={item.required}></textarea>
                                                </div>
                                            )
                                        }else{
                                            return (
                                                <div className='w-[48%]'>
                                                    <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>{item.required?"* ":""}</span>{item.name}</label>
                                                    <input value={employee[item.name]} name={item.name} onChange={(event) => changeText(event, setEmployee, employee)} type={typeForCustomField(item.type)} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={item.required} />
                                                </div>
                                            )
                                        }
                                    })
                                    }
                                </div>
                            </>
                        ): (
                            <>
                                 <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">PF Number</label>
                                    <input 
                                        value={empDetail?.pf_number} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('pf_number', e.target.value)}
                                        name="pf_number" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.pf_number) && !validateInput('pf_number', empDetail.pf_number) && <span className="text-red-500 text-xs">Please enter a valid PF Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Aadhar Number</label>
                                    <input 
                                        value={empDetail?.aadhar_number} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('aadhar_number', e.target.value)}
                                        name="aadhar_number" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.aadhar_number) && !validateInput('aadhar_number', empDetail.aadhar_number) && <span className="text-red-500 text-xs">Please enter a valid Aadhar Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport</label>
                                    <input 
                                        value={empDetail?.passport} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('passport', e.target.value)}
                                        name="passport" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.passport) && !validateInput('passport', empDetail.passport) && <span className="text-red-500 text-xs">Please enter a valid Passport</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport Authority</label>
                                    <input 
                                        value={empDetail?.passport_authority} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('passport_authority', e.target.value)}
                                        name="passport_authority" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.passport_authority) && !validateInput('passport_authority', empDetail.passport_authority) && <span className="text-red-500 text-xs">Please enter a valid Passport Authority</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Visa</label>
                                    <input 
                                        value={empDetail?.visa} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('visa', e.target.value)}
                                        name="visa" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.visa) && !validateInput('visa', empDetail.visa) && <span className="text-red-500 text-xs">Please enter a valid Visa</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Visa Authority</label>
                                    <input 
                                        value={empDetail?.visa_authority} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('visa_authority', e.target.value)}
                                        name="visa_authority" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail.visa_authority) && !validateInput('visa_authority', empDetail.visa_authority) && <span className="text-red-500 text-xs">Please enter a valid Visa Authority</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID</label>
                                    <input 
                                        value={empDetail?.eid} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('eid', e.target.value)}
                                        name="eid" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.eid) && !validateInput('eid', empDetail.eid) && <span className="text-red-500 text-xs">Please enter a valid EID</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID Authority</label>
                                    <input 
                                        value={empDetail?.eid_authority} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('eid_authority', e.target.value)}
                                        name="eid_authority" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.eid_authority) && !validateInput('eid_authority', empDetail.eid_authority) && <span className="text-red-500 text-xs">Please enter a valid EID Authority</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank Name</label>
                                    <input 
                                        value={empDetail?.bank_name} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('bank_name', e.target.value)}
                                        name="bank_name" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.bank_name) && !validateInput('bank_name', empDetail.bank_name) && <span className="text-red-500 text-xs">Please enter a valid Bank Name</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Account Holder Name</label>
                                    <input 
                                        value={empDetail?.account_holder_name} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('account_holder_name', e.target.value)}
                                        name="account_holder_name" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.account_holder_name) && !validateInput('account_holder_name', empDetail.account_holder_name) && <span className="text-red-500 text-xs">Please enter a valid Account Holder Name</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank IFSC Code</label>
                                    <input 
                                        value={empDetail?.bank_ifsc_code} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('bank_ifsc_code', e.target.value)}
                                        name="bank_ifsc_code" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.bank_ifsc_code) && !validateInput('bank_ifsc_code', empDetail.bank_ifsc_code) && <span className="text-red-500 text-xs">Please enter a valid Bank IFSC Code</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">ESI Number</label>
                                    <input 
                                        value={empDetail?.esi_number} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('esi_number', e.target.value)}
                                        name="esi_number" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.esi_number) && !validateInput('esi_number', empDetail.esi_number) && <span className="text-red-500 text-xs">Please enter a valid ESI Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Driving Licence Number</label>
                                    <input 
                                        value={empDetail?.driving_licence_no} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('driving_licence_no', e.target.value)}
                                        name="driving_licence_no" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.driving_licence_no) && !validateInput('driving_licence_no', empDetail.driving_licence_no) && <span className="text-red-500 text-xs">Please enter a valid Driving Licence Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport Date From</label>
                                    <input 
                                        value={empDetail?.passport_date_from} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('passport_date_from', e.target.value)}
                                        name="passport_date_from" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.passport_date_from) && !validateInput('passport_date_from', empDetail.passport_date_from) && <span className="text-red-500 text-xs">Please enter a valid Passport Date From</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport Date To</label>
                                    <input 
                                        value={empDetail?.passport_date_to} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('passport_date_to', e.target.value)}
                                        name="passport_date_to" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.passport_date_to) && !validateInput('passport_date_to', empDetail.passport_date_to) && <span className="text-red-500 text-xs">Please enter a valid Passport Date To</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Visa Date</label>
                                    <input 
                                        value={empDetail?.visa_date} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('visa_date', e.target.value)}
                                        name="visa_date" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.visa_date) && !validateInput('visa_date', empDetail.visa_date) && <span className="text-red-500 text-xs">Please enter a valid Visa Date</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID Date From</label>
                                    <input 
                                        value={empDetail?.eid_date_from} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('eid_date_from', e.target.value)}
                                        name="eid_date_from" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.eid_date_from) && !validateInput('eid_date_from', empDetail.eid_date_from) && <span className="text-red-500 text-xs">Please enter a valid EID Date From</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID Date To</label>
                                    <input 
                                        value={empDetail?.eid_date_to} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('eid_date_to', e.target.value)}
                                        name="eid_date_to" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.eid_date_to) && !validateInput('eid_date_to', empDetail.eid_date_to) && <span className="text-red-500 text-xs">Please enter a valid EID Date To</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank Branch</label>
                                    <input 
                                        value={empDetail.bank_branch} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('bank_branch', e.target.value)}
                                        name="bank_branch" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.bank_branch) && !validateInput('bank_branch', empDetail.bank_branch) && <span className="text-red-500 text-xs">Please enter a valid Bank Branch</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank Account Number</label>
                                    <input 
                                        value={empDetail?.bank_account_no} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={(e) => validateInput('bank_account_no', e.target.value)}
                                        name="bank_account_no" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validator.isEmpty(empDetail?.bank_account_no) && !validateInput('bank_account_no', empDetail.bank_account_no) && <span className="text-red-500 text-xs">Please enter a valid Bank Account Number</span>}
                                </div>
                            </>
                        )
                    }
                    
                </div>
                <div className='bg-slate-100 border px-6 py-2 flex items-center justify-end'>
                    <button onClick={() => {detail?handleEmpDetail():handleEmployeeAdd()}} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{detail?empData?.details?.data.length?"Update Employee Details":"Add Employee Details":empData?.details?.data.length?"Update Employee":"Add Employee"} {empData.isLoading && "Loading..."}</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EmployeesAdd
