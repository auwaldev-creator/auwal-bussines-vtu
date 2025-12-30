import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Moon, Sun, LogOut, Send, Smartphone, Wifi, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [balanceVisible, setBalanceVisible] = useState(true);
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
  };

  if (!profile) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div>
          <h1 className="text-lg font-bold text-blue-400 tracking-tighter uppercase">Auwal Business</h1>
          <p className="text-xs text-gray-400">Hello, {profile.first_name}</p>
        </div>
        <button onClick={() => { supabase.auth.signOut(); navigate('/'); }} className="p-2 bg-slate-800 rounded-full text-red-400"><LogOut size={20}/></button>
      </header>

      {/* Glass Wallet Card */}
      <div className="p-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-8 shadow-2xl">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <p className="text-blue-100/70 text-sm font-medium">Main Wallet Balance</p>
          <div className="flex items-center gap-3 mt-2">
            <h2 className="text-4xl font-black">
              {balanceVisible ? `₦${parseFloat(profile.wallet_balance).toLocaleString()}` : '••••••••'}
            </h2>
            <button onClick={() => setBalanceVisible(!balanceVisible)} className="p-1 text-blue-200">
              {balanceVisible ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>
          <div className="mt-8 flex justify-between items-end">
            <div>
              <p className="text-xs text-blue-200/60 uppercase">Account Number</p>
              <p className="font-mono text-lg">{profile.account_number}</p>
            </div>
            <button onClick={() => navigate('/settings')} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm backdrop-blur-sm font-bold">Add Money</button>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div className="px-6 grid grid-cols-4 gap-4">
        {[
          { label: 'Airtime', icon: <Smartphone/>, color: 'bg-green-500' },
          { label: 'Data', icon: <Wifi/>, color: 'bg-blue-500' },
          { label: 'Transfer', icon: <Send/>, color: 'bg-purple-500' },
          { label: 'NIN Slip', icon: <CreditCard/>, color: 'bg-orange-500', link: '/nin-print' },
        ].map((item, i) => (
          <button key={i} onClick={() => item.link && navigate(item.link)} className="flex flex-col items-center gap-2">
            <div className={`${item.color} p-4 rounded-2xl shadow-lg shadow-${item.color.split('-')[1]}-500/20`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold uppercase text-gray-400">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
