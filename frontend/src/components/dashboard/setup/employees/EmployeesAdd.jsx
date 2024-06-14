import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { api, changeText } from '../../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee, getRoles } from '../../../../store/slices/SetupSlices';
import axios from 'axios';
import { getCountries } from '../../../../store/slices/LeadSlices';

const EmployeesAdd = () => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });

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
    const [detail, setDetail] = useState(false);
    const dispatch = useDispatch();
    // const countriesData = useSelector((state) => state.countries.countriesData);
    const rolesData = useSelector(state => state.setup.roles);

    // const fetchLocationInfo = async (zipCode) => {
    //     try {
    //       console.log(zipCode);
    //       console.log("Running fetchLocationInfo");
    
    //       const response = await axios.get(`https://app.zipcodebase.com/api/v1/search?apikey=67783eb0-173d-11ef-934a-11338ba92fe9&codes=${zipCode}`)
    
    //       console.log("response from axios", response);
    
    //       const data = response.data;
    //       console.log("data from zipcode", data);
    
    //       if (data && data.results && data.results[zipCode]) {
    //         const firstResult = data.results[zipCode][0];
    //         const { province, state, country_code } = firstResult;
    //         console.log("province, state, country_code", province, state, country_code);
    //         return { province, state, country_code };
    //       }
    //     } catch (error) {
    //       console.error('Error fetching location information:', error);
    //     }
    //     return null;
    //   };
    
    //   const handleZipCodeChange = async (e) => {
    //     const zipCode = e.target.value;
    //     setEmployee((prevEmp) => ({ ...prevEmp, zip: zipCode }));
    
    //     // Fetch location information based on zip code
    //     const locationInfo = await fetchLocationInfo(zipCode);
    //     if (locationInfo) {
    //       const { province, state, country_code } = locationInfo;
    //       const country = countriesData.find(option => option.iso2 === country_code)
    //       setEmployee((prevEmp) => ({ ...prevEmp, state, city: province, country: country.short_name }));
    //     }
    //   };
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

    useEffect(() => {
        dispatch(getRoles());
    }, []);
    const empData = useSelector(state => state.setup.employees)
    const handleEmployeeAdd = () => {
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
         const gmailRegex = /^[^\s@]+@gmail\.com$/i;
         if (!gmailRegex.test(employee.email)) {
             setSnackbarProperty({
                 text: "Please enter a valid Gmail address.",
                 color: "danger"
             });
             setSnackAlert(true);
             return;
         }
 
         // Dispatch action to add employee
        dispatch(addEmployee(employee));
        
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
    const validateInput = (name) => {
        // Add validation logic based on the input name
        switch (name) {
            case 'pf_number':
                // Example validation for PF number
                return empDetail.pf_number.length >= 6;
            case 'aadhar_number':
                // Example validation for Aadhar number
                return empDetail.aadhar_number.length === 12;
            case 'passport':
                // Example validation for Passport
                return empDetail.passport !== "";
            case 'passport_authority':
                // Example validation for Passport Authority
                return empDetail.passport_authority !== "";
            case 'visa':
                // Example validation for Visa
                return empDetail.visa !== "";
            case 'visa_authority':
                // Example validation for Visa Authority
                return empDetail.visa_authority !== "";
            case 'eid':
                // Example validation for EID
                return empDetail.eid !== "";
            case 'eid_authority':
                // Example validation for EID Authority
                return empDetail.eid_authority !== "";
            case 'bank_name':
                // Example validation for Bank Name
                return empDetail.bank_name !== "";
            case 'account_holder_name':
                // Example validation for Account Holder Name
                return empDetail.account_holder_name !== "";
            case 'bank_ifsc_code':
                // Example validation for Bank IFSC Code
                return empDetail.bank_ifsc_code !== "";
            case 'esi_number':
                // Example validation for ESI Number
                return empDetail.esi_number !== "";
            case 'driving_licence_no':
                // Example validation for Driving Licence Number
                return empDetail.driving_licence_no !== "";
            case 'passport_date_from':
                // Example validation for Passport Date From
                return empDetail.passport_date_from !== "";
            case 'passport_date_to':
                // Example validation for Passport Date To
                return empDetail.passport_date_to !== "";
            case 'visa_date':
                // Example validation for Visa Date
                return empDetail.visa_date !== "";
            case 'eid_date_from':
                // Example validation for EID Date From
                return empDetail.eid_date_from !== "";
            case 'eid_date_to':
                // Example validation for EID Date To
                return empDetail.eid_date_to !== "";
            case 'bank_branch':
                // Example validation for Bank Branch
                return empDetail.bank_branch !== "";
            case 'bank_account_no':
                // Example validation for Bank Account Number
                return empDetail.bank_account_no !== "";
            default:
                return true;
        }
    };
    useEffect(() => {
        console.log("empDetail", empDetail);
    }, [empDetail]);
  return (
    <div className='mx-6 my-10'>
        {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
        <div className='w-[65%] m-auto'>
        <button onClick={() => setDetail(false)} type="button" className={`text-white ${!detail?"bg-blue-700": "bg-blue-400"} hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm me-2 px-5 py-[9px]`}>Employee</button>
        <button onClick={() => setDetail(true)} type="button" className={`text-white ${detail?"bg-blue-700": "bg-blue-400"} hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px]`}>Employee Other Details</button>
            <div className="my-6 bg-white rounded-lg shadow-md">
                <div className='p-6'>
                    {
                        !detail ? (
                            <>
                                <div className='my-3'>
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Profile image</label>

                                    <div class="flex items-center justify-center w-full">
                                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                            <input onChange={(e) => setEmployee({...employee, profile_img: e.target.files[0]})} name="profile_img" id="dropzone-file" type="file" class="hidden" />
                                        </label>
                                    </div> 
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Fullname</label>
                                    <input value={employee.fullname} onChange={(e) => changeText(e, setEmployee, employee)} name="full_name" type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
                                </div>
                                
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Email</label>
                                    <input value={employee.email} onChange={(e) => changeText(e, setEmployee, employee)} name="email" type="email" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Phonenumber</label>
                                    <input value={employee.phone} onChange={(e) => changeText(e, setEmployee, employee)} name="phone" type="number" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                                    <textarea value={employee.address} onChange={(e) => changeText(e, setEmployee, employee)} name="address" id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your address here..."></textarea>
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Postal Code</label>
                                    <input name="postal_code" value={employee.postal_code} onChange={(e) => changeText(e, setEmployee, employee)} type="number" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Designation</label>
                                    <input value={employee.designation} onChange={(e) => changeText(e, setEmployee, employee)} name="designation" type="email" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Joining Date</label>
                                    <input value={employee.joining_date} onChange={(e) => changeText(e, setEmployee, employee)} name="joining_date" type="date" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Role</label>
                                    <select onChange={(e) => changeText(e, setEmployee, employee)} name='role' id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option>Nothing selected</option>
                                        {
                                            rolesData && rolesData?.data?.map((item) => {
                                                return (
                                                    <option selected={item.id === employee.role} key={item.id} value={item.id}>{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span>Password</label>
                                    <input value={employee.user_password} onChange={(e) => changeText(e, setEmployee, employee)} name="user_password" type="password" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john@gmail.com" required />
                                </div>
                            </>
                        ): (
                            <>
                                 <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">PF Number</label>
                                    <input 
                                        value={empDetail.pf_number} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('pf_number')}
                                        name="pf_number" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('pf_number') && <span className="text-red-500 text-xs">Please enter a valid PF Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Aadhar Number</label>
                                    <input 
                                        value={empDetail.aadhar_number} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('aadhar_number')}
                                        name="aadhar_number" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('aadhar_number') && <span className="text-red-500 text-xs">Please enter a valid Aadhar Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport</label>
                                    <input 
                                        value={empDetail.passport} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('passport')}
                                        name="passport" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('passport') && <span className="text-red-500 text-xs">Please enter a valid Passport</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport Authority</label>
                                    <input 
                                        value={empDetail.passport_authority} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('passport_authority')}
                                        name="passport_authority" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('passport_authority') && <span className="text-red-500 text-xs">Please enter a valid Passport Authority</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Visa</label>
                                    <input 
                                        value={empDetail.visa} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('visa')}
                                        name="visa" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('visa') && <span className="text-red-500 text-xs">Please enter a valid Visa</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Visa Authority</label>
                                    <input 
                                        value={empDetail.visa_authority} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('visa_authority')}
                                        name="visa_authority" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('visa_authority') && <span className="text-red-500 text-xs">Please enter a valid Visa Authority</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID</label>
                                    <input 
                                        value={empDetail.eid} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('eid')}
                                        name="eid" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('eid') && <span className="text-red-500 text-xs">Please enter a valid EID</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID Authority</label>
                                    <input 
                                        value={empDetail.eid_authority} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('eid_authority')}
                                        name="eid_authority" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('eid_authority') && <span className="text-red-500 text-xs">Please enter a valid EID Authority</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank Name</label>
                                    <input 
                                        value={empDetail.bank_name} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('bank_name')}
                                        name="bank_name" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('bank_name') && <span className="text-red-500 text-xs">Please enter a valid Bank Name</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Account Holder Name</label>
                                    <input 
                                        value={empDetail.account_holder_name} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('account_holder_name')}
                                        name="account_holder_name" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('account_holder_name') && <span className="text-red-500 text-xs">Please enter a valid Account Holder Name</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank IFSC Code</label>
                                    <input 
                                        value={empDetail.bank_ifsc_code} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('bank_ifsc_code')}
                                        name="bank_ifsc_code" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('bank_ifsc_code') && <span className="text-red-500 text-xs">Please enter a valid Bank IFSC Code</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">ESI Number</label>
                                    <input 
                                        value={empDetail.esi_number} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('esi_number')}
                                        name="esi_number" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('esi_number') && <span className="text-red-500 text-xs">Please enter a valid ESI Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Driving Licence Number</label>
                                    <input 
                                        value={empDetail.driving_licence_no} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('driving_licence_no')}
                                        name="driving_licence_no" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('driving_licence_no') && <span className="text-red-500 text-xs">Please enter a valid Driving Licence Number</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport Date From</label>
                                    <input 
                                        value={empDetail.passport_date_from} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('passport_date_from')}
                                        name="passport_date_from" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('passport_date_from') && <span className="text-red-500 text-xs">Please enter a valid Passport Date From</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Passport Date To</label>
                                    <input 
                                        value={empDetail.passport_date_to} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('passport_date_to')}
                                        name="passport_date_to" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('passport_date_to') && <span className="text-red-500 text-xs">Please enter a valid Passport Date To</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Visa Date</label>
                                    <input 
                                        value={empDetail.visa_date} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('visa_date')}
                                        name="visa_date" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('visa_date') && <span className="text-red-500 text-xs">Please enter a valid Visa Date</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID Date From</label>
                                    <input 
                                        value={empDetail.eid_date_from} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('eid_date_from')}
                                        name="eid_date_from" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('eid_date_from') && <span className="text-red-500 text-xs">Please enter a valid EID Date From</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">EID Date To</label>
                                    <input 
                                        value={empDetail.eid_date_to} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('eid_date_to')}
                                        name="eid_date_to" 
                                        type="date" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('eid_date_to') && <span className="text-red-500 text-xs">Please enter a valid EID Date To</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank Branch</label>
                                    <input 
                                        value={empDetail.bank_branch} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('bank_branch')}
                                        name="bank_branch" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('bank_branch') && <span className="text-red-500 text-xs">Please enter a valid Bank Branch</span>}
                                </div>
                                <div className='my-3'>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">Bank Account Number</label>
                                    <input 
                                        value={empDetail.bank_account_no} 
                                        onChange={(e) => changeText(e, setEmpDetail, empDetail)}
                                        onBlur={() => validateInput('bank_account_no')}
                                        name="bank_account_no" 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        required 
                                    />
                                    {!validateInput('bank_account_no') && <span className="text-red-500 text-xs">Please enter a valid Bank Account Number</span>}
                                </div>
                            </>
                        )
                    }
                    
                </div>
                <div className='bg-slate-100 border px-6 py-2 flex items-center justify-end'>
                    <button onClick={handleEmployeeAdd} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[9px] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Add</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EmployeesAdd
