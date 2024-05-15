import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Auth from './components/auth/Auth';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import { useEffect } from 'react';
import Lead from './components/dashboard/lead/Lead';
import { logout } from './store/slices/UserSlice';
import Users from './components/dashboard/users/Users';

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log('isLoggedIn', isLoggedIn);
  useEffect(() => {
    !isLoggedIn && navigate("/login");
  }, [isLoggedIn]);
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
