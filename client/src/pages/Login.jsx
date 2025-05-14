import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { persistor } from '../redux/store';

export default function Login() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [buttonKey, setButtonKey] = useState(0);

  // Clear persisted state on component mount
  useEffect(() => {
    const clearPersistedState = async () => {
      await persistor.purge();
      console.log('Persisted state cleared');
    };
    clearPersistedState();
  }, []);

  // Add useEffect to monitor loading state
  useEffect(() => {
    console.log('Current loading state:', loading);
    console.log('Current error state:', error);
  }, [loading, error]);

  // Reset loading state on component mount
  useEffect(() => {
    if (loading) {
      dispatch(signInFailure('Reset loading state'));
    }
  }, []);

  // Update button key when loading state changes
  useEffect(() => {
    setButtonKey(prev => prev + 1);
  }, [loading]);

  // SweetAlert2 Toast configuration
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return Toast.fire({
        icon: 'warning',
        title: 'Please fill all fields',
      });
    }

    console.log('Starting login process...');
    console.log('Current loading state before signInStart:', loading);
    dispatch(signInStart());
    console.log('Current loading state after signInStart:', loading);

    try {
      console.log('Making API request...');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('API Response:', data);

      if (!res.ok || data.success === false) {
        console.log('Login failed:', data.message);
        dispatch(signInFailure(data.message || 'Login failed'));
        console.log('Current loading state after signInFailure:', loading);
        return Toast.fire({
          icon: 'error',
          title: data.message || 'Login failed',
        });
      }

      console.log("Login successful, payload (API response):", data);
      dispatch(signInSuccess(data.user));
      console.log("Current loading state after signInSuccess:", loading);
      Toast.fire({
        icon: 'success',
        title: 'Account successfully logged in',
      });
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      dispatch(signInFailure('Unable to connect to the server. Please make sure the backend server is running.'));
      console.log('Current loading state after error:', loading);
      Toast.fire({
        icon: 'error',
        title: 'Unable to connect to the server. Please make sure the backend server is running.',
      });
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* Left: Branding / Info */}
        <div className="flex flex-col items-center text-center bg-white dark:bg-gray-700 shadow-md p-8 rounded-lg w-full md:w-1/2">
          <Link to="/" className="flex flex-col items-center gap-4">
            <img
              src="https://media-hosting.imagekit.io//ede03161e2da49d8/logo.png?Expires=1833770545&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TeutU~sf62gjBH6OthznEX0kRRgdotvnfqDIiC9uB5WoCO6IoTITWx9PDBSipxbBXwvLlGU-9Wy92tjnvyOWTGaHINnvI9dS9zr80fmRVIpf0rdhT8NKaYqODJ6o4n3R4Jzj53SMYg~uzbNvhaqo~8~6EqSp1qqbcWrVRKnKWfxHoKd~IduexgO16PUbBINr02nccScixmPKh49DMsg0CcVwoh8RlduzKjG~cYBHdTBBQDoibx3o3FOBeCL5LbIpNFNlPLFKFbVeWp9j5Cs67sWl6z3PNZlXZRB8XN335ztumsD4CxGNZ-ea7qSLnKsSCmrivEa9BY0wX68vzXpbBA__"
              className="h-28 w-28"
              alt="Logo"
            />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              SWAGATOM WORLD
            </span>
          </Link>
          <p className="mt-4 text-gray-600 text-lg dark:text-gray-300">
            Create an account and explore Swagatom World.
          </p>
          <p className="mt-4 text-gray-500 text-sm dark:text-gray-400">
            Sign up with your email and password or with Google.
          </p>
        </div>

        {/* Right: Form */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='**********'
                id='password'
                onChange={handleChange}
                required
              />
            </div>
            <Button
              key={buttonKey}
              gradientDuoTone='purpleToBlue'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/registration' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
