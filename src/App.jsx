import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import duka files din da muka kirkira
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Services from './components/Services';
import Settings from './components/Settings';
import NINPrint from './components/NINPrint';

// Login component mai sauki (Tunda bamuyi shi a baya ba)
import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${phone}@auwalvtu.com`,
      password: password,
    });
    if (error) alert("Login Failed: " + error.message);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
       <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <input placeholder="Phone Number" onChange={(e)=>setPhone(e.target.value)} className="w-full p-2 border mb-2 rounded"/>
          <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border mb-4 rounded"/>
          <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
       </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/nin-print" element={<NINPrint />} />
      </Routes>
    </Router>
  );
}

export default App;
