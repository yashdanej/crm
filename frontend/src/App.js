import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Auth from './components/auth/Auth';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import { useEffect } from 'react';
import Lead from './components/dashboard/lead/Lead';
import { logout } from './store/slices/UserSlice';
import Users from './components/dashboard/users/Users';
import { BACKEND } from './utils/Utils';
import io from 'socket.io-client';
import { getUserNotification, setupSocket } from './store/slices/Notification';
import addNotification from "react-push-notification";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log("location", location);
  console.log('isLoggedIn', isLoggedIn);
  useEffect(() => {
      !isLoggedIn && navigate("/login");
  }, [isLoggedIn]);
  // socket
  let getUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    const socketIo = io(BACKEND, {
      withCredentials: true,
    });
    socketIo.emit("setup", getUser);
    socketIo.on("connection", () => {
      console.log("connected socket");
    });
    dispatch(setupSocket(socketIo));
    return () => {
      socketIo.disconnect();
    }
  }, [dispatch, getUser]);
  
  return (
    <div>
      <Routes>
        <Route exact path="/login" element={<Auth path="login" />} />
        <Route exact path="/signup" element={<Auth path="signup" />} />
        <Route exact path="/superadmin/users" element={<Dashboard><Users /></Dashboard>} />
        <Route exact path="/admin/leads" element={<Dashboard><Lead /></Dashboard>} />
      </Routes>
    </div>
  );
} 

export default App;
