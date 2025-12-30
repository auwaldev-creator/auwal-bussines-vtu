import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '', firstName: '', lastName: '', nin: '', address: '', password: '', pin: ''
  });
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  const nextStep = () => setStep(step + 1);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // 1. Create User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${formData.phone}@auwalvtu.com`,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Insert into Profiles Table (Corrected Columns)
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: authData.user.id,
        phone: formData.phone,
        first_name: formData.firstName,
        last_name: formData.lastName,
        nin_number: formData.nin,
        residential_address: formData.address,
        transaction_pin: formData.pin,
        account_number: formData.phone, // Phone as account number
        wallet_balance: 5000.00
      }]);

      if (profileError) throw profileError;
      
      setStep(8); // Success Step
    } catch (error) {
      alert("Registration Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <h2 className="text-xl font-bold mb-6 text-blue-400 text-center uppercase tracking-wider">Step {step} of 8</h2>
        
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Phone Verification</h3>
            <input name="phone" placeholder="Enter Phone Number" onChange={handleChange} className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600 focus:border-blue-500" />
            <button onClick={nextStep} className="w-full bg-blue-600 p-4 rounded-xl font-bold hover:bg-blue-500">Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <input name="firstName" placeholder="First Name" onChange={handleChange} className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600 focus:border-blue-500" />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600 focus:border-blue-500" />
            <button onClick={nextStep} className="w-full bg-blue-600 p-4 rounded-xl font-bold">Next</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identity Verification</h3>
            <p className="text-sm text-gray-400">Enter your 11-digit NIN or BVN for verification.</p>
            <input name="nin" placeholder="Enter NIN/BVN" onChange={handleChange} className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600 focus:border-blue-500" />
            <button onClick={nextStep} className="w-full bg-blue-600 p-4 rounded-xl font-bold">Verify Identity</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">Face Verification</h3>
            <div className="rounded-xl overflow-hidden border-2 border-blue-500 mx-auto w-full max-w-[250px]">
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" />
            </div>
            <button onClick={nextStep} className="w-full bg-green-600 p-4 rounded-xl font-bold">Capture & Continue</button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Residential Address</h3>
            <textarea name="address" placeholder="Enter Full Home Address" onChange={handleChange} className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600 h-32" />
            <button onClick={nextStep} className="w-full bg-blue-600 p-4 rounded-xl font-bold">Save Address</button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Security - Password</h3>
            <input type="password" name="password" placeholder="Create Secure Password" onChange={handleChange} className="w-full p-4 bg-slate-700 rounded-xl outline-none border border-slate-600" />
            <button onClick={nextStep} className="w-full bg-blue-600 p-4 rounded-xl font-bold">Set Password</button>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction PIN</h3>
            <p className="text-sm text-gray-400">Create a 4-digit PIN for all transactions.</p>
            <input type="password" maxLength={4} name="pin" placeholder="0 0 0 0" onChange={handleChange} className="w-full p-4 bg-slate-700 rounded-xl text-center text-3xl tracking-widest outline-none border border-slate-600" />
            <button onClick={handleRegister} disabled={loading} className="w-full bg-green-600 p-4 rounded-xl font-bold">
              {loading ? "Creating Account..." : "Finish Registration"}
            </button>
          </div>
        )}

        {step === 8 && (
          <div className="text-center space-y-6">
            <div className="text-6xl text-green-500">✔</div>
            <h2 className="text-2xl font-bold">Welcome, {formData.firstName}!</h2>
            <p className="text-gray-400">Your registration was successful. Enjoy our premium VTU services.</p>
            <button onClick={() => navigate('/login')} className="w-full bg-blue-600 p-4 rounded-xl font-bold">Proceed to Login</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
