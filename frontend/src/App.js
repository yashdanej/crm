import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Auth from './components/auth/Auth';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import { useEffect } from 'react';
import Lead from './components/dashboard/lead/Lead';
import { logout } from './store/slices/UserSlice';
import Users from './components/dashboard/users/Users';
import { BACKEND, api } from './utils/Utils';
import io from 'socket.io-client';
import { getUserNotification, setupSocket } from './store/slices/Notification';
import addNotification from "react-push-notification";
import Status from './components/dashboard/setup/status/Status';
import Sources from './components/dashboard/setup/sources/Sources';
import Agents from './components/dashboard/setup/agents/Agents';
import TypeOfWork from './components/dashboard/setup/typeofwork/TypeOfWork';
import ProfileOfClient from './components/dashboard/setup/ProfileOfClient.jsx/ProfileOfClient';
import { getProfileOfClient, getTypeOfWork } from './store/slices/SetupSlices';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log("location", location);
  console.log('isLoggedIn', isLoggedIn);

  useEffect(() => {
    const pathname = location.pathname;
    if (!isLoggedIn) {
      if (pathname !== "/login" && pathname !== "/signup") {
        navigate("/login");
      }
    } else {
      if (pathname === "/login" || pathname === "/signup") {
        navigate("/admin/leads");
      }
    }
  }, [isLoggedIn, navigate, location]);

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

  useEffect(() => {
    api("/lead/getalltypesofwork", "get", false, false, true)
      .then((res) => {
        dispatch(getTypeOfWork(res.data.data));
      })
      .catch((err) => {
        console.log("err in fetchTypeData");
      });
    api("/lead/getallprofileofclients", "get", false, false, true)
      .then((res) => {
        dispatch(getProfileOfClient(res.data.data));
      })
      .catch((err) => {
        console.log("err in fetchAgentsData");
      });
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route exact path="/login" element={<Auth path="login" />} />
        <Route exact path="/signup" element={<Auth path="signup" />} />
        <Route
          path='/superadmin/*'
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <Routes>
                <Route exact path="users" element={<Dashboard><Users /></Dashboard>} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route exact path="/admin/leads" element={<Dashboard><Lead /></Dashboard>} />
        <Route 
          path="/setup/*" 
          element={
            <ProtectedRoute allowedRoles={[2, 3]}>
              <Routes>
                <Route path="status" element={<Dashboard><Status /></Dashboard>} />
                <Route path="sources" element={<Dashboard><Sources /></Dashboard>} />
                <Route path="agents" element={<Dashboard><Agents /></Dashboard>} />
                <Route path="typeofwork" element={<Dashboard><TypeOfWork /></Dashboard>} />
                <Route path="profileofclient" element={<Dashboard><ProfileOfClient /></Dashboard>} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
