import React, { useEffect, useState } from 'react'
import SnackbarWithDecorators, { changeText } from '../../../../utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { addReminder, fetchReminder } from '../../../../store/slices/ReminderSlice';

const Reminders = ({from}) => {
  const [reminder, setReminder] = useState({
    description: "",
    date: null,
    staff: 0,
    rel_type: from === "customer"?"customer":"lead",
    notify_by_email: 1
  });
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const customerId = useSelector(state => state.customer.id);
  const leadData = useSelector(state => state.leads.leadData);
  const userData = useSelector(state => state.assigned.assignedData);
  const reminderData = useSelector(state => state.reminder.lead);
  const dispatch = useDispatch();
  const handleReminderAdd = () => {
    if(reminder.description === "" || !reminder.date || reminder.date === undefined || reminder.staff === 0){
      setSnackbarProperty(prevState => ({
        ...prevState,
        text: "* fields are required!",
        color: "danger"
      }));
      setSnackAlert(true);
    }else{
      dispatch(addReminder({id: from==="customer"?customerId:leadData[0]?.id, data: reminder}));
    }
  }
  useEffect(() => {
    dispatch(fetchReminder({id: from==="customer"?customerId:leadData[0]?.id, rel_type: from === "customer"?"customer":"lead"}));
  }, []);
  return (
    <div className='my-3 p-4 rounded-sm w-full min:h-full max:h-[50vh] overflow-auto bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
      {
        snackAlert ?
        <SnackbarWithDecorators  snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
        : null
      }
      <table className="w-full min-w-[540px] mb-5" data-tab-for="order" data-page="active">
        <thead>
            <tr>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Description</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Date</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Remind</th>
                <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Is notified</th>
            </tr>
        </thead>
        <tbody>
          {
            reminderData && reminderData?.data && reminderData?.data?.length > 0 &&
            reminderData?.data?.map((item) => {
              return (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                      <p className="text-[13px] font-medium text-gray-400">{item?.description}</p>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                      <p className="text-[13px] font-medium text-gray-400">{item?.date?.split("T")[0]}</p>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                      <p className="text-[13px] font-medium text-gray-400">{userData && userData?.length > 0 && userData?.find(user => user.id === item?.staff)?.full_name}</p>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                      <p className="text-[13px] font-medium text-gray-400">{item?.isnotified}</p>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div className='my-3'>
          <label htmlFor="date_contacted" className="block mb-2 text-sm font-medium my-2 text-gray-900 dark:text-white">
            <span className='text-red-600'>* </span>Date to be notified
          </label>
          <input
          name='date'
          value={reminder.date}
          onChange={(e) => { changeText(e, setReminder, reminder); }}
          type="datetime-local"
          id="date_contacted"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        </div>
        <div className='my-3'>
          <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>* </span>Set reminder to</label>
          <select name="staff" onChange={(e) => changeText(e, setReminder, reminder)} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option></option>
              {
                userData && userData.length > 0 &&
                userData.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>{item.full_name}</option>
                  )
                })
              }
          </select>
        </div>
        <div className='my-3'>
          <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"><span className='text-red-600'>* </span>Description</label>
          <textarea
          name='description'
          value={reminder.description}
          onChange={(e) => { changeText(e, setReminder, reminder) }}
          id="message"
          rows="4"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write notes here..."
        ></textarea>
        </div>
        {/* <div className='my-3'>
          <div className="flex items-center mb-4">
            <input name="notify_by_email" checked={reminder.notify_by_email} onChange={(e) => setReminder({...reminder, notify_by_email: e.target.checked})} id="default-checkbox" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
            <label for="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Send also an email for this reminder</label>
          </div>
        </div> */}
        <hr />
        <div className='flex justify-end mt-4'>
          <button
            onClick={() => handleReminderAdd()}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add
          </button>
        </div>
    </div>
  )
}

export default Reminders;