  import { useState, useContext } from 'react';
  import { AuthContext } from '../context/AuthContext';
  import { useNavigate, Link } from 'react-router-dom';

  const Register = () => {
  const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  role: 'student',
  branch: '',
  cgpa: '',
  skills: ''
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
  e.preventDefault();

  
  try {
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);

    await register({
      ...formData,
      skills: skillsArray
    });

    navigate('/');
  } catch (err) {
    setError(
      err.response?.data?.message ||
      'Registration failed'
    );
  }

  };

  return ( <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"> <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg"> <div> <h2 className="text-center text-3xl font-extrabold text-gray-900">
  Student Registration </h2> </div>
      {error && (
        <p className="mt-4 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      <form
        className="mt-8 space-y-4"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          required
          autoComplete="name"
          placeholder="Full Name"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
        />

        <input
          type="email"
          required
          autoComplete="email"
          placeholder="Email Address"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
        />

        <input
          type="password"
          required
          autoComplete="new-password"
          placeholder="Password"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value
            })
          }
        />

        <select
          required
          value={formData.branch}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) =>
            setFormData({
              ...formData,
              branch: e.target.value
            })
          }
        >
          <option value="">Select Branch</option>
          <option value="CSE">
            Computer Science Engineering (CSE)
          </option>
          <option value="CSM">
            Computer Science & Machine Learning (CSM)
          </option>
          <option value="CSD">
            Computer Science & Data Science (CSD)
          </option>
          <option value="CSC">
            Computer Science & Cyber Security (CSC)
          </option>
          <option value="IT">
            Information Technology (IT)
          </option>
          <option value="ECE">
            Electronics & Communication Engineering (ECE)
          </option>
          <option value="EEE">
            Electrical & Electronics Engineering (EEE)
          </option>
          <option value="MECH">
            Mechanical Engineering
          </option>
          <option value="CIVIL">
            Civil Engineering
          </option>
          <option value="AI&DS">
            Artificial Intelligence & Data Science
          </option>
        </select>

        <input
          type="number"
          required
          min="0"
          max="10"
          step="0.01"
          placeholder="CGPA"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) =>
            setFormData({
              ...formData,
              cgpa: parseFloat(e.target.value)
            })
          }
        />

        <select
    required
    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
    value={formData.primaryLanguage}
    onChange={(e) =>
      setFormData({
        ...formData,
        primaryLanguage: e.target.value,
      })
    }
  >
    <option value="">Select Primary Language</option>
    <option value="Java">Java</option>
    <option value="Python">Python</option>
    <option value="JavaScript">JavaScript</option>
    <option value="C">C</option>
    <option value="C++">C++</option>
    <option value="Go">Go</option>
  </select>

  <select
    required
    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
    value={formData.secondaryLanguage}
    onChange={(e) =>
      setFormData({
        ...formData,
        secondaryLanguage: e.target.value,
      })
    }
  >
    <option value="">Select Secondary Language</option>
    <option value="Java">Java</option>
    <option value="Python">Python</option>
    <option value="JavaScript">JavaScript</option>
    <option value="C">C</option>
    <option value="C++">C++</option>
    <option value="Go">Go</option>
  </select>

  <select
    required
    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
    value={formData.domain}
    onChange={(e) =>
      setFormData({
        ...formData,
        domain: e.target.value,
      })
    }
  >
    <option value="">Select Preferred Domain</option>
    <option value="Web Development">Web Development</option>
    <option value="Frontend Development">Frontend Development</option>
    <option value="Backend Development">Backend Development</option>
    <option value="Full Stack Development">Full Stack Development</option>
    <option value="AI/ML">AI / Machine Learning</option>
    <option value="Data Science">Data Science</option>
    <option value="Cyber Security">Cyber Security</option>
    <option value="Cloud Computing">Cloud Computing</option>
    <option value="DevOps">DevOps</option>
    <option value="Mobile App Development">Mobile App Development</option>
    <option value="Blockchain">Blockchain</option>
  </select>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link
          to="/login"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  </div>

  );
  };

  export default Register;
