import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Moon, Sun, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/login');
    
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(data);
    setDarkMode(data.is_dark_mode);
  };

  // Mock Service (Simulating API)
  const handlePurchase = async (type) => {
    const amount = prompt(`Enter amount for ${type}:`);
    if (!amount || amount > profile.wallet_balance) return alert("Insufficient Funds!");
    
    setLoading(true);
    
    // 1. Simulate Network Delay (Mock API)
    setTimeout(async () => {
      // 2. Deduct Money
      const newBalance = profile.wallet_balance - amount;
      
      const { error } = await supabase.from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', profile.id);

      if (!error) {
         // 3. Save Transaction
         await supabase.from('transactions').insert([{
           user_id: profile.id, type, amount, status: 'successful', 
           reference_id: 'TXN-' + Math.floor(Math.random() * 1000000)
         }]);
         
         alert(`${type} Purchase Successful! Transaction ID Generated.`);
         fetchProfile(); // Refresh balance
      } else {
         alert("Transaction Failed");
      }
      setLoading(false);
    }, 2000); // 2 Seconds delay
  };

  const handleTransfer = async () => {
     const receiverPhone = prompt("Enter Receiver Phone:");
     const amount = parseFloat(prompt("Enter Amount:"));
     
     if(amount > profile.wallet_balance) return alert("Insufficient Funds");

     setLoading(true);
     
     // Check if receiver exists
     const { data: receiver } = await supabase.from('profiles').select('*').eq('phone', receiverPhone).single();
     
     if(!receiver) { setLoading(false); return alert("User not found!"); }

     // Deduct from Sender
     await supabase.from('profiles').update({ wallet_balance: profile.wallet_balance - amount }).eq('id', profile.id);
     
     // Add to Receiver
     await supabase.from('profiles').update({ wallet_balance: receiver.wallet_balance + amount }).eq('id', receiver.id);

     // Log Transaction
     await supabase.from('transactions').insert([
        { user_id: profile.id, type: 'transfer_sent', amount, status: 'successful', description: `To ${receiverPhone}` },
        { user_id: receiver.id, type: 'transfer_received', amount, status: 'successful', description: `From ${profile.phone}` }
     ]);

     alert("Transfer Successful!");
     fetchProfile();
     setLoading(false);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Header */}
      <div className="p-4 flex justify-between items-center shadow-sm">
        <h2 className="font-bold text-xl">Auwal VTU</h2>
        <div className="flex gap-4">
            <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun /> : <Moon />}</button>
            <button onClick={() => { supabase.auth.signOut(); navigate('/'); }}><LogOut /></button>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="m-4 p-6 bg-blue-600 rounded-2xl text-white shadow-lg">
        <p className="text-sm opacity-80">Wallet Balance</p>
        <div className="flex items-center gap-2 mt-1">
            <h1 className="text-3xl font-bold">
                {balanceVisible ? `₦${profile.wallet_balance.toLocaleString()}` : '****'}
            </h1>
            <button onClick={() => setBalanceVisible(!balanceVisible)}>
                {balanceVisible ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
        </div>
        <div className="mt-4 p-2 bg-blue-700 rounded-lg flex justify-between text-xs">
            <span>Acc No: {profile.account_number}</span>
            <span>Bank: Muryar VTU</span>
        </div>
        <div className="mt-4 flex gap-2">
            <button onClick={() => alert("Please contact Admin to fund wallet")} className="flex-1 bg-white text-blue-600 py-2 rounded-lg font-bold">Add Money</button>
            <button onClick={() => {
                const amt = prompt("Enter Request Amount:");
                if(amt) supabase.from('payment_requests').insert([{ user_id: profile.id, amount: amt }]);
            }} className="flex-1 bg-blue-500 py-2 rounded-lg font-bold">Request Money</button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {['Airtime', 'Data', 'Exam Pin', 'BVN Print', 'Electricity'].map((service) => (
            <button key={service} onClick={() => handlePurchase(service)} disabled={loading} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center h-24">
                <span className="font-bold text-sm">{service}</span>
            </button>
        ))}
        {/* Special Button for NIN */}
        <button onClick={() => navigate('/nin-print')} className="bg-purple-100 dark:bg-purple-900 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center h-24">
            <span className="font-bold text-sm text-purple-700 dark:text-purple-200">NIN Slip</span>
        </button>
        <button onClick={handleTransfer} className="bg-green-100 dark:bg-green-900 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center h-24">
            <span className="font-bold text-sm text-green-700 dark:text-green-200">Transfer</span>
        </button>
      </div>

    </div>
  );
};

export default Dashboard;
