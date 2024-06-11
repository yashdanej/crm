import React, { useEffect, useState } from 'react';
import SuperAdminTable from './SuperAdminTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany, fetchSuperAdmins } from '../../store/slices/DevSlices';
import { api, changeText } from '../../utils/Utils';

const SuperAdmin = () => {
    const [userObj, setUserObj] = useState({
        full_name: "",
        email: "",
        user_password: "",
        phonenumber: "",
        company_id: null
    });
    const [errors, setErrors] = useState({});
    const [mobileValidation, setMobileValidation] = useState("");
    const [emailValidation, setEmailValidation] = useState("");

    const validatePhoneNumber = (e) => {
        const phoneNumberPattern = /^\d{10}$/; // This pattern matches exactly 10 digits
        const { value } = e.target;
        changeText(e, setUserObj, userObj);

        if (!phoneNumberPattern.test(value)) {
            setMobileValidation('Please enter a valid 10-digit phone number.');
        } else {
            setMobileValidation('');
        }
    };

    const validateEmail = (e) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
        const { value } = e.target;
        changeText(e, setUserObj, userObj);

        if (!emailPattern.test(value)) {
            setEmailValidation('Please enter a valid email address.');
        } else {
            setEmailValidation('');
        }
    };

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!userObj.full_name) newErrors.full_name = "Full name is required.";
        if (!userObj.email) newErrors.email = "Email is required.";
        if (!userObj.user_password) newErrors.user_password = "Password is required.";
        if (!userObj.phonenumber) newErrors.phonenumber = "Phonenumber is required.";
        if (!userObj.company_id) newErrors.company_id = "Company is required.";
        if (mobileValidation) newErrors.phonenumber = mobileValidation;
        if (emailValidation) newErrors.email = emailValidation;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        api("/developer/superadmin", "post", userObj, false, true)
            .then((res) => {
                fetchSourceData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const dispatch = useDispatch();

    const fetchSourceData = () => {
        api("/developer/superadmins", "get", false, false, true)
            .then((res) => {
                dispatch(fetchSuperAdmins(res.data.data));
            })
            .catch((err) => {
                console.log("err in fetchSourcesData");
            });
    };

    const fetchCompanyData = () => {
        api("/developer/company", "get", false, false, true)
            .then((res) => {
                dispatch(fetchCompany(res.data.data));
            })
            .catch((err) => {
                console.log("err in fetchSourcesData");
            });
    };

    useEffect(() => {
        fetchSourceData();
    }, []);

    useEffect(() => {
        api("/util/last_active", "patch", false, false, true)
            .then((res) => {
                console.log("res", res);
            })
            .catch((err) => {
                console.log("err in activity log");
            });
        fetchCompanyData();
    }, []);

    const companyData = useSelector(state => state.dev.company);

    return (
        <div className='m-6'>
            <h1 className='text-3xl font-bold bg-gray-900 text-white p-5'>Super Admin Master</h1>
            <div className='xl:flex gap-10 my-6'>
                <form className="w-full max-w-lg bg-gray-50 p-5 rounded-3xl">
                    <div className="w-full mb-6">
                        <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-full-name">
                                <span className='text-red-500'>* </span> Full name
                            </label>
                            <input
                                name='full_name'
                                onChange={(e) => changeText(e, setUserObj, userObj)}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.full_name ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-full-name"
                                type="text"
                                placeholder="Jane"
                            />
                            {errors.full_name && <p className="text-red-500 text-xs italic">{errors.full_name}</p>}
                        </div>
                        <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
                                <span className='text-red-500'>* </span> Email
                            </label>
                            <input
                                name='email'
                                onChange={validateEmail}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-email"
                                type="email"
                                placeholder="jane@gmail.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                        </div>
                        <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                                <span className='text-red-500'>* </span> Password
                            </label>
                            <input
                                name='user_password'
                                onChange={(e) => changeText(e, setUserObj, userObj)}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.user_password ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-password"
                                type="password"
                                placeholder="*******"
                            />
                            {errors.user_password && <p className="text-red-500 text-xs italic">{errors.user_password}</p>}
                        </div>
                        <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-phonenumber">
                                <span className='text-red-500'>* </span> Phonenumber
                            </label>
                            <input
                                name='phonenumber'
                                onChange={validatePhoneNumber}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.phonenumber ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                                id="grid-phonenumber"
                                type="number"
                                placeholder="0123456789"
                            />
                            {errors.phonenumber && <p className="text-red-500 text-xs italic">{errors.phonenumber}</p>}
                            {mobileValidation && <p className="text-red-500 text-xs italic">{mobileValidation}</p>}
                        </div>
                        <div className="w-full md:w-[20rem] xl:w-full px-3 mb-6 md:mb-0">
                            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900"><span className='text-red-500'>* </span> Company</label>
                            <select
                                name='company_id'
                                onChange={(event) => changeText(event, setUserObj, userObj)}
                                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${errors.company_id ? 'border-red-500' : 'border-gray-200'} rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
                            >
                                <option value={null}>Select company</option>
                                {
                                    companyData?.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </select>
                            {errors.company_id && <p className="text-red-500 text-xs italic">{errors.company_id}</p>}
                        </div>
                        <button onClick={handleStatusSubmit} className='px-10 p-4 bg-gray-900 text-white mx-3'>Submit</button>
                    </div>
                </form>
                <div className='my-6'>
                    <SuperAdminTable />
                </div>
            </div>
        </div>
    );
};

export default SuperAdmin;
