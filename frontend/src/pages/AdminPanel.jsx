import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [companies, setCompanies] = useState([]);
    const [applications, setApplications] = useState([]);
    const [newCompany, setNewCompany] = useState({ name: '', role: '', minCGPA: 0, allowedBranches: '', deadline: '' });
    const [activeTab, setActiveTab] = useState('companies'); // 'companies' or 'applications'

    const fetchCompanies = async () => {
        const { data } = await axios.get('https://smart-placement-tracker-4yap.onrender.com/api/company/all', {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setCompanies(data);
    };

    const fetchApplications = async () => {
        const { data } = await axios.get('https://smart-placement-tracker-4yap.onrender.com/api/application/all', {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(data);
    };

    useEffect(() => {
        fetchCompanies();
        fetchApplications();
    }, []);

    const addCompany = async (e) => {
        e.preventDefault();
        try {
            const branches = newCompany.allowedBranches.split(',').map(b => b.trim());
            await axios.post('https://smart-placement-tracker-4yap.onrender.com/api/company/add', 
                { ...newCompany, allowedBranches: branches },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            fetchCompanies();
            setNewCompany({ name: '', role: '', minCGPA: 0, allowedBranches: '', deadline: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const updateAppStatus = async (appId, status, round) => {
        try {
            await axios.put('https://smart-placement-tracker-4yap.onrender.com/api/application/update-status', 
                { applicationId: appId, status, round },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            fetchApplications();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCompany = async (id) => {
        if(window.confirm('Delete this company?')) {
            try {
                await axios.delete(`https://smart-placement-tracker-4yap.onrender.com/api/company/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                fetchCompanies();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">TPO Admin Panel</h1>
            <div className="flex space-x-4 mb-6 border-b">
                <button 
                    className={`pb-2 px-4 ${activeTab === 'companies' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
                    onClick={() => setActiveTab('companies')}>Manage Companies</button>
                <button 
                    className={`pb-2 px-4 ${activeTab === 'applications' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
                    onClick={() => setActiveTab('applications')}>Manage Applications</button>
            </div>

            {activeTab === 'companies' && (
                <div>
                    <form className="bg-white p-6 rounded-lg shadow mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6" onSubmit={addCompany}>
                        <input className="border p-2 rounded" required placeholder="Company Name" value={newCompany.name} onChange={e=>setNewCompany({...newCompany, name: e.target.value})}/>
                        <input className="border p-2 rounded" required placeholder="Role" value={newCompany.role} onChange={e=>setNewCompany({...newCompany, role: e.target.value})}/>
                        <input className="border p-2 rounded" type="number" step="0.1" required placeholder="Min CGPA" value={newCompany.minCGPA} onChange={e=>setNewCompany({...newCompany, minCGPA: parseFloat(e.target.value)})}/>
                        <input className="border p-2 rounded" required placeholder="Branches (CSE,ECE)" value={newCompany.allowedBranches} onChange={e=>setNewCompany({...newCompany, allowedBranches: e.target.value})}/>
                        <input className="border p-2 rounded" type="date" required value={newCompany.deadline} onChange={e=>setNewCompany({...newCompany, deadline: e.target.value})}/>
                        <button className="bg-blue-600 text-white rounded p-2 flex justify-center items-center hover:bg-blue-700">
                            <PlusCircle className="mr-2"/> Add
                        </button>
                    </form>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {companies.map(c => (
                                <li key={c._id} className="px-6 py-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{c.name} - {c.role}</h3>
                                        <p className="text-sm text-gray-500">CGPA &gt;= {c.minCGPA} | {c.allowedBranches.join(', ')} | Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => deleteCompany(c._id)} className="text-red-500 hover:text-red-700"><Trash2/></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="bg-white shadow overflow-x-auto sm:rounded-md p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Round</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map(app => (
                                <tr key={app._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.studentId?.name || 'Unknown'} ({app.studentId?.cgpa})</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.companyId?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'Selected' ? 'bg-green-100 text-green-800' : app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.round}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <select onChange={(e) => updateAppStatus(app._id, e.target.value, app.round)} className="border p-1 rounded text-xs" value={app.status}>
                                            <option>Applied</option>
                                            <option>Round 1</option>
                                            <option>Round 2</option>
                                            <option>HR Round</option>
                                            <option>Selected</option>
                                            <option>Rejected</option>
                                        </select>
                                        <input type="text" placeholder="Update Round" defaultValue={app.round} onBlur={(e) => updateAppStatus(app._id, app.status, e.target.value)} className="border p-1 rounded text-xs w-24"/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;