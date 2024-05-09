import { useSelector } from 'react-redux';
import './App.css';
import Auth from './components/auth/Auth';
import { Routes, Route } from 'react-router-dom';

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  console.log('isLoggedIn', isLoggedIn);
  return (
    <div>
      <Routes>
        <Route exact path="/login" element={<Auth path="login" />} />
        <Route exact path="/signup" element={<Auth path="signup" />} />
      </Routes>
    </div>
  );
}

export default App;
