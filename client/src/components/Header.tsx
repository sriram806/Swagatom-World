import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { signOut } from '../redux/auth/authSlice';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

export default function Header() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut());
      toast.success('Signed out successfully');
    } catch (error) {
      // Error is handled in the thunk
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-sm z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-800 dark:text-purple-400">
          Swagatom
        </Link>
        
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <Link 
                to="/profile" 
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/sign-in" 
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/sign-up"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}