import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Activity } from 'lucide-react';

const ApplicationTracker = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/application/student', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setApplications(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchApps();
    }, [user]);

    const getStatusColor = (status) => {
        if (status === 'Selected') return 'bg-green-100 text-green-800 border-green-200';
        if (status === 'Rejected') return 'bg-red-100 text-red-800 border-red-200';
        return 'bg-blue-100 text-blue-800 border-blue-200';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>
            {applications.length === 0 ? (
                <p className="text-gray-500">You haven't applied to any companies yet.</p>
            ) : (
                <div className="grid gap-6">
                    {applications.map(app => (
                        <div key={app._id} className="bg-white shadow rounded-lg border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{app.companyId.name}</h3>
                                <p className="text-gray-600 font-medium">{app.companyId.role}</p>
                                <p className="text-xs text-gray-400 mt-2 flex items-center">
                                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            
                            <div className="flex flex-col md:items-end space-y-2">
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(app.status)}`}>
                                    Status: {app.status}
                                </span>
                                <span className="inline-flex items-center text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                                    <Activity className="w-4 h-4 mr-1"/> Round: {app.round}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ApplicationTracker;