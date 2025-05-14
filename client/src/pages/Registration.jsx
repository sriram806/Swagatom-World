import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function Registration() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  // Handle form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      return Toast.fire({
        icon: 'warning',
        title: 'Please fill all fields',
      });
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        return Toast.fire({
          icon: 'error',
          title: data.message || 'Registration failed',
        });
      }

      Toast.fire({
        icon: 'success',
        title: 'Account created successfully',
      });

      navigate('/login');

    } catch (error) {
      setLoading(false);
      Toast.fire({
        icon: 'error',
        title: 'Something went wrong',
      });
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10'>
        {/* Left Panel */}
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

        {/* Right Form */}
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
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
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/login' className='text-blue-500'>
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
