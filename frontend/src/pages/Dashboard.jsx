import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Award, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
        <p className="mt-2 text-gray-600">This is your Smart Placement Tracker dashboard.</p>
        
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <BookOpen className="text-blue-500 w-8 h-8 mr-3"/>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
              </div>
            </div>
          </div>
          <div className="bg-green-50 overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <Award className="text-green-500 w-8 h-8 mr-3"/>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Processing</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center">
              <CheckCircle className="text-purple-500 w-8 h-8 mr-3"/>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">Offers Received</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;