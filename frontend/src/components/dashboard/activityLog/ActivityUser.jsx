import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api, displayTimeOfPost } from '../../../utils/Utils';

const ActiveUser = () => {
  const [userObj, setUserObj] = useState([]);
  const [isActiveUser, setIsActiveUser] = useState([]);
  const location = useLocation();
  console.log("location", location);
  const userId = location.pathname.split("/")[2];

  const userActivity = () => {
    api(`/util/user_activity/${userId}`, "get", false, false, true)
    .then((res) => {
      console.log("res from ActiveUser", res.data);
      setUserObj(res.data);
    })
    .catch((err) => {
      console.log("err from ActiveUser", err);
    });
  }

  const lastActive = () => {
    api(`/util/last_active/${userId}`, "get", false, false, true)
    .then((res) => {
      console.log("res from IsActive", res.data);
      setIsActiveUser(res.data);
    })
    .catch((err) => {
      console.log("err from IsActive", err);
    });
  }
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
    userActivity();
    lastActive();
  }, []);
  return (
    <div className='m-6'>
      <div className='flex items-center gap-7'>
        <img src="/images/unknown.jpg" width={50} height={50} className='rounded-full' alt="" /> <span className='font-bold text-xl text-slate-800'>{isActiveUser && isActiveUser.data && isActiveUser.data[0]?.full_name}</span>
      </div>
      <div className='lg:flex gap-7 justify-between'>
        <div className='w-full'>
          <div className='my-3 font-semibold text-slate-800 rounded-xl p-10 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
            <p>- Last Active : <span className='text-slate-500'>{isActiveUser && isActiveUser.last_Active ? isActiveUser.last_Active: "Never logged in"}</span></p>
            <p className='text-blue-500 underline cursor-pointer'>{isActiveUser && isActiveUser.data && isActiveUser.data[0]?.email}</p>
          </div>
        </div>
        <div className='my-3 p-10 rounded-xl w-full min:h-full max:h-[50vh] overflow-auto bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
          {
            userObj && userObj.data ? userObj.data?.map((item) => {
              return (
                <div className='text-[14px] p-5 bg-gray-50 border'>
                  <p className='text-slate-600 font-semibold'>{item.last_active.split("T")[0]} - {displayTimeOfPost(item.last_active)}</p>
                  <p className='text-slate-600'>{item.description}</p>
                </div>
              )
            }):<p className='font-semibold text-slate-600'>No Activity</p>
          }
        </div>
      </div>
    </div>
  )
}

export default ActiveUser
