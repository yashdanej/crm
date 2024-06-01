import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import SnackbarWithDecorators, { api, changeText } from '../../utils/Utils';
import { login } from '../../store/slices/UserSlice';
import Cookies from 'js-cookie';

const Auth = ({path}) => {
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    user_password: ""
  });
  const [snackAlert, setSnackAlert] = useState(false); // popup success or error
  const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
      text: '',
      color: ''
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onAuthClick = (e, call) => {
    e.preventDefault();
    if(user.email.trim() === "" || user.user_password.trim() === "" || call === "signup" && user.full_name.trim() === ""){
      setSnackbarProperty(prevState => ({
        ...prevState,
        text: "All fields are required",
        color: "danger"
      }));
      setSnackAlert(true);
      return;
    }
    let body;
    const pathname = call==="login"?"/login":"/signup";
    call==="login"?
    body={email: user.email, user_password: user.user_password}:
    body=user
    api(pathname, "post", body)
    .then((res) => {
      console.log("res.data", res.data);
      if(res.data.message === "User signed up successfully"){
        navigate("/login");
      }else if(res.data.message === "Email already exists"){
        setSnackbarProperty(prevState => ({
          ...prevState,
          text: res.data.message,
          color: "danger"
        }));
        setSnackAlert(true);
      }else if(res.data.user){
        dispatch(login());
        Cookies.set('access_token', res.data.token, { expires: 7 });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        // adding in activity log
        api("/util/activity_log", "post", {description: "User Logged in"}, false, true)
        .then((res) => {
          console.log("res from logging in", res);
        })
        .catch((err) => {
          console.log("err in logging in");
        });

        navigate('/admin/leads');
        console.log("json parse", JSON.parse(localStorage.getItem("user")));
      }else{
        console.log('res', res);
        setSnackbarProperty(prevState => ({
          ...prevState,
          text: res.data.message,
          color: "danger"
        }));
        setSnackAlert(true);
      }
    }).catch((e) => {
      console.log(e);
    })
  }
  return (
    <div className='min-h-[100%] h-[100vh] bg-slate-200 flex items-center'>
       {
      snackAlert?
      <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color} />
      :null
      }
      <div className="container flex flex-col mx-auto max-w-[500px] bg-white rounded-2xl">
           <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
      <div className="flex items-center justify-center w-full p-12">
        <div className="flex items-center">
          <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
            <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">{path==="login"?"Sign In":"Sign Up"}</h3>
            <p className="mb-4 text-grey-700">Enter your {path==="signup" && "fullname, "}email and password</p>
            {
              path==="signup" && (
                <>
                  <label for="email" className="mb-2 text-sm text-start text-grey-900">Fullname*</label>
                  <input id="full_name" name="full_name" onChange={(e) => changeText(e, setUser, user)} type="text" placeholder="Enter your fullname" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
                </>
              )
            }
            <label for="email" className="mb-2 text-sm text-start text-grey-900">Email*</label>
            <input id="email" type="email" name="email" onChange={(e) => changeText(e, setUser, user)} placeholder="mail@loopple.com" className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            <label for="password" className="mb-2 text-sm text-start text-grey-900">Password*</label>
            <input id="password" type="password" name="user_password" onChange={(e) => changeText(e, setUser, user)}placeholder="Enter a password" className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"/>
            <div className="flex flex-row justify-between mb-8">
              <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                <input type="checkbox" value="" className="sr-only peer"/>
                <div
                  className="w-5 h-5 bg-white border-2 rounded-sm border-grey-500 peer peer-checked:border-0 peer-checked:bg-purple-blue-500">
                  <img className="" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png" alt="tick"/>
                </div>
                <span className="ml-3 text-sm font-normal text-grey-900">Keep me logged in</span>
              </label>
              <a href="javascript:void(0)" className="mr-4 text-sm font-medium text-purple-blue-500">Forget password?</a>
            </div>
            <button onClick={(e) => {path==="login"?onAuthClick(e, "login"):onAuthClick(e, "signup")}} className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500">{path==="login"?"Sign In":"Sign Up"}</button>
            <p className="text-sm leading-relaxed text-grey-900">Not registered yet? <a href="javascript:void(0)" className="font-bold text-grey-700"><Link to={path==="login"?"/signup":"/login"}>{path==="login"?"Create an account":"Already have an account"}</Link></a></p>
          </form>
        </div>
      </div>
    </div>
        </div>
    </div>
  )
}

export default Auth;
