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
import ActiveUser from './components/dashboard/activityLog/ActivityUser';
import CustomField from './components/dashboard/setup/customField/CustomField';
import CustomFieldAdd from './components/dashboard/setup/customField/CustomFieldAdd';
import Dev from './pages/dashboard/Dev';
import SuperAdmin from './pages/dashboard/SuperAdmin';
import EmployeesAdd from './components/dashboard/setup/employees/EmployeesAdd';
import Employees from './components/dashboard/setup/employees/Employees';
import { getAssigned, getCountries } from './store/slices/LeadSlices';
import Customer from './components/customer/Customer';
import CustomerAdd from './components/customer/CustomerAdd';
import Designation from './components/dashboard/setup/designation/Designation';
import Group from './components/dashboard/setup/group/Group';
import Currency from './components/dashboard/setup/currency/Currency';
import MasterType from './components/dashboard/setup/master_type/MasterType';
import SubMaster from './components/dashboard/setup/sub_master/SubMaster';
import ItStatus from './components/dashboard/setup/it_status/ItStatus';
import Appoinment from './components/dashboard/dash/Appoinment';
import ViewContact from './components/customer/view/ViewContact';

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
      if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
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

  // activity log
  useEffect(() => {
    api("/util/last_active", "patch", false, false)
    .then((res) => {
      console.log("res", res);
    })
    .catch((err) => {
      console.log("err in activity log");
    });
    // users
    api("/lead/getusers", "get", false, false, true)
    .then((res) => {
        dispatch(getAssigned(res.data.data));
    })
    .catch((err) => {
        console.log("error in fetchAssigned", err);
    })
    // coutries
    api("/lead/getcountries", "get", false, false, true)
    .then((res) => {
        dispatch(getCountries(res.data.data));
    })
    .catch((err) => {
        console.log('err in countries', err);
    })
  });

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
        <Route
          path='/developer/*'
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <Routes>
                <Route exact path="company" element={<Dashboard><Dev /></Dashboard>} />
                <Route exact path="super_admin" element={<Dashboard><SuperAdmin /></Dashboard>} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route exact path="/admin/dashboard" element={<Dashboard><Appoinment /></Dashboard>} />
        <Route exact path="/admin/leads" element={<Dashboard><Lead /></Dashboard>} />
        <Route path="activity_log/:userid" element={<Dashboard><ActiveUser /></Dashboard>} />
        <Route path="/admin/customer" element={<Dashboard><Customer /></Dashboard>} />
        <Route path="/admin/customer/view" element={<Dashboard><ViewContact /></Dashboard>} />
        <Route path="/admin/customer/:path" element={<Dashboard><CustomerAdd /></Dashboard>} />
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
                <Route path="designation" element={<Dashboard><Designation /></Dashboard>} />
                <Route path="group" element={<Dashboard><Group /></Dashboard>} />
                <Route path="currency" element={<Dashboard><Currency /></Dashboard>} />
                <Route path="it_status" element={<Dashboard><ItStatus /></Dashboard>} />
                <Route path="master_type" element={<Dashboard><MasterType /></Dashboard>} />
                <Route path="sub_master" element={<Dashboard><SubMaster /></Dashboard>} />
                <Route path="custom_field" element={<Dashboard><CustomField /></Dashboard>} />
                <Route path="custom_field/add" element={<Dashboard><CustomFieldAdd /></Dashboard>} />
                <Route path="/employees" element={<Dashboard><Employees /></Dashboard>} />
                <Route path="/employee/add" element={<Dashboard><EmployeesAdd /></Dashboard>} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
