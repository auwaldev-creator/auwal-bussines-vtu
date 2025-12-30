import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [requestAmount, setRequestAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(user) {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            setUser(data);
        }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleRequestMoney = async () => {
    if (!requestAmount) return;
    const { error } = await supabase.from('payment_requests').insert([
        { user_id: user.id, amount: requestAmount, status: 'pending' }
    ]);
    if (error) alert("Error requesting money");
    else {
        alert("Request Sent to Admin Successfully!");
        setRequestAmount('');
    }
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/dashboard')} className="mr-4 font-bold">Back</button>
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.first_name[0]}
            </div>
            <div>
                <h3 className="font-bold">{user.first_name} {user.last_name}</h3>
                <p className="text-sm text-gray-500">{user.phone}</p>
            </div>
        </div>
      </div>

      {/* Request Money Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <h3 className="font-bold mb-2 text-blue-600">Request Funding</h3>
        <p className="text-xs text-gray-500 mb-2">Ask Admin to fund your wallet</p>
        <div className="flex gap-2">
            <input 
                type="number" 
                placeholder="Amount (e.g 5000)" 
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button onClick={handleRequestMoney} className="bg-blue-600 text-white px-4 rounded font-bold">Send</button>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center" onClick={() => alert('Change Password logic here')}>
            <span>Change Password</span>
            <span className="text-gray-400">›</span>
        </div>
        <div className="p-4 border-b flex justify-between items-center" onClick={() => alert('Change PIN logic here')}>
            <span>Change Transaction PIN</span>
            <span className="text-gray-400">›</span>
        </div>
        <div className="p-4 text-red-600 font-bold flex justify-between items-center" onClick={handleLogout}>
            <span>Log Out</span>
            <span>⎋</span>
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8">Auwal VTU v1.0.0</p>
    </div>
  );
};

export default Settings;
