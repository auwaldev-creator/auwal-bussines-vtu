import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const NINPrint = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setUser(data);
    };
    getData();
  }, []);

  const generatePDF = async () => {
    if (user.wallet_balance < 50) return alert("Please fund your account. Cost: ₦50");

    // 1. Deduct 50 Naira
    await supabase.from('profiles').update({ wallet_balance: user.wallet_balance - 50 }).eq('id', user.id);

    // 2. Generate PDF
    const doc = new jsPDF();
    
    // Draw Plastic Card Design
    doc.setFillColor(200, 255, 200); // Green Background
    doc.rect(20, 20, 85, 55, 'F'); // Card shape
    
    doc.setFontSize(10);
    doc.text("NIGERIA NATIONAL IDENTITY CARD", 25, 30);
    doc.setFontSize(8);
    doc.text(`NIN: ${formData.nin}`, 25, 40);
    doc.text(`Surname: ${formData.lastName}`, 25, 45);
    doc.text(`First Name: ${formData.firstName}`, 25, 50);
    doc.text(`DOB: ${formData.dob}`, 25, 55);
    
    doc.save(`${formData.firstName}_NIN_Plastic.pdf`);
    alert("Download Started! ₦50 Deducted.");
    navigate('/dashboard');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">Print Plastic NIN (₦50)</h2>
        <input placeholder="Enter NIN Number" onChange={(e)=>setFormData({...formData, nin: e.target.value})} className="border p-2 w-full mb-2" />
        <input placeholder="First Name" onChange={(e)=>setFormData({...formData, firstName: e.target.value})} className="border p-2 w-full mb-2" />
        <input placeholder="Last Name" onChange={(e)=>setFormData({...formData, lastName: e.target.value})} className="border p-2 w-full mb-2" />
        <input type="date" onChange={(e)=>setFormData({...formData, dob: e.target.value})} className="border p-2 w-full mb-4" />
        
        <div className="flex gap-2">
            <button onClick={() => navigate('/dashboard')} className="bg-gray-500 text-white p-2 rounded flex-1">Cancel</button>
            <button onClick={generatePDF} className="bg-green-600 text-white p-2 rounded flex-1">Pay & Download</button>
        </div>
      </div>
    </div>
  );
};

export default NINPrint;
