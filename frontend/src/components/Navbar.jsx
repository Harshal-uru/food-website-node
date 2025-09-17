import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Food Donation App</Link>
      <div>
        {user ? (
          <>
            <Link to="/food-donations" className="mr-4 hover:text-green-200 transition-colors">Food Donations</Link>
            <Link to="/ngo-registration" className="mr-4 hover:text-green-200 transition-colors">NGO Registration</Link>
            <Link to="/tasks" className="mr-4 hover:text-green-200 transition-colors">CRUD</Link>
            <Link to="/profile" className="mr-4 hover:text-green-200 transition-colors">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:text-green-200 transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
