import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Building2, Calendar, CheckSquare } from 'lucide-react';

const CompanyListings = () => {
    const { user } = useContext(AuthContext);
    const [companies, setCompanies] = useState([]);
    const [appliedIds, setAppliedIds] = useState([]);

    useEffect(() => {
        const fetchDaata = async () => {
            try {
                const cmpRes = await axios.get('http://localhost:5000/api/company/all', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                
                const appRes = await axios.get('http://localhost:5000/api/application/student', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                setAppliedIds(appRes.data.map(app => app.companyId._id));
                
                // Filter eligible companies
                const eligible = cmpRes.data.filter(c => {
                    return user.cgpa >= c.minCGPA && c.allowedBranches.includes(user.branch);
                });
                setCompanies(eligible);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDaata();
    }, [user]);

    const handleApply = async (companyId) => {
        try {
            await axios.post('http://localhost:5000/api/application/apply', { companyId }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAppliedIds([...appliedIds, companyId]);
            alert('Successfully applied!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error applying');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Eligible Companies</h1>
            {companies.length === 0 ? (
                <p className="text-gray-500">No companies currently match your eligibility criteria.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {companies.map(company => (
                        <div key={company._id} className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 flex flex-col">
                            <div className="px-6 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex flex-items-center">
                                        <Building2 className="w-5 h-5 mr-2 text-blue-500"/>
                                        {company.name}
                                    </h3>
                                </div>
                                <p className="text-md text-gray-800 font-semibold mb-2">{company.role}</p>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>Min CGPA: <span className="font-medium text-gray-900">{company.minCGPA}</span></p>
                                    <p>Eligible Branches: <span className="font-medium text-gray-900">{company.allowedBranches.join(', ')}</span></p>
                                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Deadline: {new Date(company.deadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex-1 flex items-end">
                                {appliedIds.includes(company._id) ? (
                                    <button disabled className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 cursor-not-allowed">
                                        <CheckSquare className="w-4 h-4 mr-2"/> Applied
                                    </button>
                                ) : (
                                    <button onClick={() => handleApply(company._id)} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyListings;