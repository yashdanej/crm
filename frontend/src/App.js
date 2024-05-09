import './App.css';
import Auth from './components/auth/Auth';
import { Routes, Route } from 'react-router-dom';

function App() {
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
