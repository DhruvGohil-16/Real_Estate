import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import { PieChart } from 'react-minimal-pie-chart';
import MyFooter from '../components/MyFooter';
import AgentHeader from '../components/AgentHeader';

export default function AgentDashboard() {
  
  const [counts,setCounts] = useState([]);
  const { currentUser} = useSelector((state) => state.user);
  const [data,setData] = useState([]);
  const colors = ['#E38627', '#C13C37', '#6A2135', '#FF5733'];
  
  const fetchCounts = async () => {
    try {
        const response = await fetch(`/api/agent/totalReqCount/${currentUser._id}`);
        const Data = await response.json();
        
        if (Data.success === true){
          console.log(Data);
          setCounts(Data.data);
          const newData = Object.entries(Data.data).map(([label, value], index) => ({
            value,
            color: colors[index % colors.length],
            label
          }));
          setData(newData);
        }

    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
      window.scrollTo(0,0);
      fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 bg-gradient-to-b from-gray-300 to-transparent">
      <AgentHeader/>

      <div className="container mx-auto px-4 py-8 m-3 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          <div className='flex flex-col gap-4'>
            <div className="col-span-1 md:col-span-1 h-fit bg-white shadow-lg p-4 rounded-md ">
              <h1 className="text-lg font-semibold text-gray-800 mb-4">Agent Dashboard</h1>
              <ul className="space-y-2">
                <li>
                  <Link to="/agent-dashboard" className="text-blue-500 hover:text-blue-700">Home</Link>
                </li>
                <li>
                  <Link to="/properties" className="text-blue-500 hover:text-blue-700">Properties</Link>
                </li>
                <li>
                  <Link to="/agent-profile" className="text-blue-500 hover:text-blue-700">Profile</Link>
                </li>
              </ul>
            </div>
              <div className='bg-white p-4 flex flex-col'>
                <div className='text-lg font-semibold text-gray-800 mb-4'>Listing History</div>
                <PieChart
                  data={data}
                  label={({ dataEntry }) => `${dataEntry.value} (${dataEntry.label})`}
                  labelStyle={{
                    fontSize: '5px',
                    fontFamily: 'serif',
                    fill: 'white',
                  }}
                  style={{ width: '100%', height: '300px' }}
                />
              </div>
          </div>

          <div className="col-span-2 md:col-span-2 bg-white shadow-lg p-6 rounded-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {currentUser.name}!</h2>
            <p className="text-gray-600 mb-6">
              Welcome to the Dr. Estate Agent Dashboard! As a valued member of our team, you have access to a range of tools and resources to streamline your real estate activities and provide exceptional service to your clients.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h3>
                <p className="text-gray-600">
                  Manage your profile details, including contact information, profile picture, and bio, to ensure your clients have accurate and up-to-date information about you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Listings</h3>
                <p className="text-gray-600">
                  View and manage your property listings, including details such as property descriptions, photos, pricing, and status updates.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Leads and Clients</h3>
                <p className="text-gray-600">
                  Keep track of your leads and clients, follow up on inquiries, schedule appointments, and manage communication to provide personalized service and build strong relationships.
                </p>
              </div>
              
            </div>
          </div>

        </div>
      </div>
      <MyFooter/>
    </div>
  );
}

