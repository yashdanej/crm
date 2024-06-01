import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../../../utils/Utils';

const ActiveUser = () => {
  const [userObj, setUserObj] = useState([]);
  const location = useLocation();
  console.log("location", location);
  const userId = location.pathname.split("/")[2];
  useEffect(() => {
    api(`/util/user_activity/${userId}`, "get", false, false, true)
    .then((res) => {
      console.log("res from ActiveUser", res.data);
      setUserObj(res.data);
    })
    .catch((err) => {
      console.log("err from ActiveUser", err);
    });
  }, []);
  return (
    <div className='m-6'>
      <div className='w-1/3'>
        <div className='flex items-center gap-7'>
          <img src="/images/unknown.jpg" width={50} height={50} className='rounded-full' alt="" /> <span className='font-bold text-xl text-slate-800'>{userObj && userObj.user && userObj?.user[0]?.full_name}</span>
        </div>
        <div className='my-3 font-semibold text-slate-800 rounded-xl p-10 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
          <p>- Last Active : </p>
          <p className='text-blue-500 underline cursor-pointer'>{userObj && userObj.user && userObj.user[0]?.email}</p>
        </div>
      </div>
    </div>
  )
}

export default ActiveUser
