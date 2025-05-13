import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className="flex flex-col items-center text-center bg-white dark:bg-gray-700 shadow-md  p-8 rounded-lg w-full md:w-1/2">
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
          <p className="mt-4 text-gray-500 text-sm dark:text-gray-500">
            Sign up with your email and password or with Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
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
                placeholder='**********'
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
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont Have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
