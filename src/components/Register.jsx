import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '', firstName: '', lastName: '', nin: '', address: '', password: '', pin: ''
  });
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const nextStep = () => setStep(step + 1);

  const handleRegister = async () => {
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${formData.phone}@auwalvtu.com`, // Fake email using phone
      password: formData.password,
    });

    if (authError) return alert(authError.message);

    // 2. Save Profile
    const { error: profileError } = await supabase.from('profiles').insert([{
      id: authData.user.id,
      phone: formData.phone,
      first_name: formData.firstName,
      last_name: formData.lastName,
      nin_number: formData.nin,
      address: formData.address,
      transaction_pin: formData.pin,
      account_number: formData.phone, // Phone as Account Num
      email: `${formData.phone}@auwalvtu.com`
    }]);

    if (!profileError) nextStep(); // Go to step 8
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Step {step}/8</h2>
        
        {step === 1 && (
          <div>
            <label>Phone Verification</label>
            <input name="phone" placeholder="08012345678" onChange={handleChange} className="w-full p-3 border rounded mb-4" />
            <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded">Verify Phone</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label>Personal Details</label>
            <input name="firstName" placeholder="First Name" onChange={handleChange} className="w-full p-3 border rounded mb-2" />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} className="w-full p-3 border rounded mb-4" />
            <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded">Next</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>NIN/BVN Verification</label>
            <input name="nin" placeholder="Enter 11 Digit NIN/BVN" onChange={handleChange} className="w-full p-3 border rounded mb-4" />
            <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded">Verify</button>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <label>Face Verification</label>
            <div className="mb-4 rounded-lg overflow-hidden border-2 border-blue-500">
               <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
            </div>
            <button onClick={nextStep} className="w-full bg-green-600 text-white p-3 rounded">Capture & Verify</button>
          </div>
        )}

        {/* Ka cika sauran matakan (Address, Password, PIN) anan kamar na sama */}
        {step === 5 && (
            <div>
                 <label>Residential Address</label>
                 <textarea name="address" onChange={handleChange} className="w-full p-3 border rounded mb-4"></textarea>
                 <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded">Next</button>
            </div>
        )}
        
        {step === 6 && (
            <div>
                 <label>Create Password</label>
                 <input type="password" name="password" onChange={handleChange} className="w-full p-3 border rounded mb-4" />
                 <button onClick={nextStep} className="w-full bg-blue-600 text-white p-3 rounded">Set Password</button>
            </div>
        )}

        {step === 7 && (
            <div>
                 <label>Transaction PIN (4 Digits)</label>
                 <input maxLength={4} name="pin" onChange={handleChange} className="w-full p-3 border rounded mb-4 text-center text-2xl tracking-widest" />
                 <button onClick={handleRegister} className="w-full bg-green-600 text-white p-3 rounded">Finish Registration</button>
            </div>
        )}

        {step === 8 && (
          <div className="text-center">
            <h1 className="text-3xl">🎉</h1>
            <h3 className="text-xl font-bold mt-2">Registration Successful!</h3>
            <p className="text-gray-600 mt-2">Welcome, {formData.firstName}.</p>
            <button onClick={() => navigate('/login')} className="w-full bg-blue-600 text-white p-3 rounded mt-4">Go to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
