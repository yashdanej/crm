import React, { useEffect, useState } from 'react';
import { getCustomer } from '../../../store/slices/CustomerSlices';
import { useDispatch, useSelector } from 'react-redux';
import { changeText } from '../../../utils/Utils';
import { getEmployee } from '../../../store/slices/SetupSlices';
import { addAppointment, completeAppoinment, fetchAppointments, updateAppoinment } from '../../../store/slices/AppointmentSlices';

const AddEvent = ({apmntData, toggleModal, resetState, appointment, setAppointment, emp_client, setEmp_Client}) => {
    
    const customerData = useSelector(state => state.customer.customers);
    const empData = useSelector(state => state.setup.employees);

    const dispatch = useDispatch();
    const OnSubmit = (e) => {
        e.preventDefault();
        const {employee_id, client_id, subject, client_or_other_name, phone, email, appointment_date, remark} = appointment;
        if(apmntData && apmntData.edit && apmntData.edit.data.length > 0){
            dispatch(updateAppoinment({id: apmntData?.edit?.data[0]?.id, data: appointment}));
            dispatch(fetchAppointments());
        }else{
            dispatch(addAppointment(appointment));
        }
        // onEventAdded({
        //     employee_id, client_id, subject, client_or_other_name, phone, email, appointment_date, remark
        // });
        toggleModal();
        resetState();
    }
    const handleComplete = (id) => {
        dispatch(completeAppoinment(id));
        toggleModal();
        resetState();
    }
    useEffect(() => {
        dispatch(getCustomer());
        dispatch(getEmployee());
    }, []);
    useEffect(() => {
        console.log('emp_client', emp_client);
        console.log('appointment', appointment);
    }, [emp_client, appointment]);
    useEffect(() => {
        if (apmntData && apmntData.edit && apmntData.edit.data.length > 0) {
          const data = apmntData.edit.data[0];
          setAppointment({
            employee_id: data.employee_id,
            client_id: data.client_id,
            subject: data.subject,
            client_or_other_name: data.client_or_other_name,
            phone: data.phone,
            email: data.email,
            appointment_date: data.appoinment_date,
            remark: data.remark
          });
          if(data.client_id === null){
            setEmp_Client({...emp_client, client: 'false'})
          }
          if(data.client_id === null){
            setEmp_Client({...emp_client, client: 'false'})
          }
        }
      }, [apmntData.edit.data]);
    return (
        <>
             <button
            onClick={toggleModal}
            className="my-2 block text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="button"
        >
            Add Appointment
                </button>
                <div
                    id="crud-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                <div className="m-auto relative p-4 w-full max-w-5xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Create New Appointment
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-toggle="crud-modal"
                                onClick={toggleModal}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form className="p-4 md:p-5">
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Appointment for
                                    </label>
                                    <select
                                        onChange={(e) =>
                                            setEmp_Client({
                                                ...emp_client,
                                                employee: e.target.value
                                            })
                                        }
                                        name="designation"
                                        id="designation"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value={true}>Employee</option>
                                        <option value={false}>Self</option>
                                    </select>
                                </div>
                                {emp_client.employee == 'true' && (
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Employee
                                        </label>
                                        <select
                                            onChange={(e) =>
                                                changeText(
                                                    e,
                                                    setAppointment,
                                                    appointment
                                                )
                                            }
                                            name="employee_id"
                                            id="employee_id"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option value={null}></option>
                                            {empData &&
                                                empData.data?.map((item) => {
                                                    return (
                                                        <option
                                                            selected={
                                                                item.id ==
                                                                appointment?.client_id
                                                            }
                                                            key={item.id}
                                                            value={item.id}
                                                        >
                                                            {item.full_name}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                )}
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Appointment type
                                    </label>
                                    <select
                                        onChange={(e) =>
                                            setEmp_Client({
                                                ...emp_client,
                                                client: e.target.value
                                            })
                                        }
                                        name="designation"
                                        id="designation"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value={true}>Client</option>
                                        <option value={false}>Other</option>
                                    </select>
                                </div>
                                {emp_client.client == 'true' && (
                                    <div className="col-span-2">
                                        <label
                                            htmlFor="name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Client
                                        </label>
                                        <select
                                            onChange={(e) =>
                                                changeText(
                                                    e,
                                                    setAppointment,
                                                    appointment
                                                )
                                            }
                                            name="client_id"
                                            id="client_id"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
                                            <option value={null}></option>
                                            {customerData &&
                                                customerData.data?.map(
                                                    (item) => {
                                                        return (
                                                            <option
                                                                selected={
                                                                    item.id ==
                                                                    appointment?.client_id
                                                                }
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                {item.company}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </div>
                                )}
                                {emp_client.client == 'false' && (
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Client/Other name
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            changeText(
                                                e,
                                                setAppointment,
                                                appointment
                                            )
                                        }
                                        value={appointment?.client_or_other_name}
                                        type="text"
                                        name="client_or_other_name"
                                        id="remark"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Type remark"
                                        required=""
                                    />
                                </div>
                                )}
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Subject
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            changeText(
                                                e,
                                                setAppointment,
                                                appointment
                                            )
                                        }
                                        value={appointment?.subject}
                                        type="text"
                                        name="subject"
                                        id="subject"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Type subject"
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            changeText(
                                                e,
                                                setAppointment,
                                                appointment
                                            )
                                        }
                                        value={appointment?.phone}
                                        type="number"
                                        name="phone"
                                        id="phone"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Type phone number"
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Email
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            changeText(
                                                e,
                                                setAppointment,
                                                appointment
                                            )
                                        }
                                        value={appointment?.email}
                                        type="text"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Type email"
                                        required=""
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        <span className="text-red-500">* </span>
                                        Joining Date
                                    </label>
                                    <input
                                        defaultValue={appointment ? appointment.appointment_date : ''}
                                        onChange={(e) =>
                                            changeText(
                                                e,
                                                setAppointment,
                                                appointment
                                            )
                                        }
                                        name="appointment_date"
                                        type="datetime-local"
                                        id="first_name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Joining date"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Remark
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            changeText(
                                                e,
                                                setAppointment,
                                                appointment
                                            )
                                        }
                                        value={appointment?.remark}
                                        type="text"
                                        name="remark"
                                        id="remark"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        placeholder="Type remark"
                                        required=""
                                    />
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <button
                                    type="submit"
                                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    onClick={OnSubmit}
                                >
                                    <svg
                                        className="me-1 -ms-1 w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    {
                                        apmntData?.edit?.data.length>0?
                                        "Update Appointment":
                                        "Add New Appointment"
                                    }
                                </button>
                                {
                                    apmntData?.edit?.data.length>0 &&
                                    <button
                                    type="submit"
                                    className="mx-2 text-white inline-flex items-center bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    onClick={() => handleComplete(apmntData?.edit?.data[0].id)}
                                    >
                                        Mark as complete
                                    </button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddEvent;
