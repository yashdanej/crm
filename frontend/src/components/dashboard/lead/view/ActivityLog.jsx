import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { api, displayTimeOfPost } from '../../../../utils/Utils';

const ActivityLog = () => {
    const leadData = useSelector(state => state.leads.leadData);
    const [leadUserActivity, setLeadUserActivity] = useState([]);
    const userLeadActivity = () => {
        api(`/util/lead_activity/${leadData[0]?.id}`, "get", false, false, true)
        .then((res) => {
            console.log("res from userLeadActivity", res.data);
            setLeadUserActivity(res.data);
        })
        .catch((err) => {
            console.log("err from userLeadActivity", err);
        });
    }
    useEffect(() => {
        userLeadActivity();
    }, [])
  return (
    <div className='my-3 p-10 rounded-xl w-full min:h-full max:h-[50vh] overflow-auto bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        {
        leadUserActivity && leadUserActivity.data?.length > 0 ? leadUserActivity.data.map((item) => {
            return (
                <div className='text-[14px] p-5 bg-gray-50 border'>
                <p className='font-bold text-slate-600'>{item.full_name}</p>
                <p className='text-slate-600 font-semibold'>{item.last_active.split("T")[0]} ({displayTimeOfPost(item.last_active)})</p>
                <p className='text-slate-600'>{item.description}</p>
            </div>
            )
        }):<p className='font-semibold text-slate-600'>No Activity</p>
        }
    </div>
  )
}

export default ActivityLog
