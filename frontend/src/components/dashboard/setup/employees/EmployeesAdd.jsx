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
        fullname: "",
        email: "",
        phone: "",
        address: "",
        postal_code: null,
        designation: "",
        joining_date: null,
        role: 1,
        user_password: ""
    });

    const dispatch = useDispatch();
    const countriesData = useSelector((state) => state.countries.countriesData);
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
      }, []);
    useEffect(() => {
        dispatch(getRoles());
    }, []);
    useEffect(() => {
        console.log("Employees", employee);
    }, [employee]);

    const handleEmployeeAdd = () => {
        dispatch(addEmployee(employee));
    }

  return (
    <div className='mx-6 my-10'>
        {
            snackAlert ?
            <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
            : null
        }
        <div className='w-[65%] m-auto'>
            <label for="first_name" className="block mb-2 text-xl font-semibold text-slate-600">Add Employee</label>
            <div className="my-6 bg-white rounded-lg shadow-md">
                <div className='p-6'>
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
                        <input value={employee.fullname} onChange={(e) => changeText(e, setEmployee, employee)} name="fullname" type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
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
