import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Phone, CreditCard, Zap, BookOpen } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    { name: 'Buy Airtime', icon: <Phone />, color: 'bg-green-100 text-green-600' },
    { name: 'Buy Data', icon: <Wifi />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Cable TV', icon: <Zap />, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Electricity', icon: <Zap />, color: 'bg-orange-100 text-orange-600' },
    { name: 'Exam Pins', icon: <BookOpen />, color: 'bg-purple-100 text-purple-600' },
    { name: 'NIN Print', icon: <CreditCard />, color: 'bg-teal-100 text-teal-600', link: '/nin-print' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/dashboard')} className="mr-4 text-xl font-bold">←</button>
        <h2 className="text-xl font-bold">All Services</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {services.map((item, index) => (
          <div 
            key={index} 
            onClick={() => item.link ? navigate(item.link) : alert(`${item.name} coming soon!`)}
            className={`${item.color} p-6 rounded-xl flex flex-col items-center justify-center h-32 shadow-sm active:scale-95 transition transform`}
          >
            <div className="mb-2">{item.icon}</div>
            <span className="font-semibold text-sm">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
