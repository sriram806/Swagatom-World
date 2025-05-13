import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const searchTermFromUrl = new URLSearchParams(location.search).get('searchTerm');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      if (res.ok) dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  return (
    <Navbar className={`border-b-2 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'}`}>
      <Link to='/' className='flex items-center self-center whitespace-nowrap text-lg sm:text-2xl font-bold dark:text-white'>
        <img src="https://media-hosting.imagekit.io//ede03161e2da49d8/logo.png?Expires=1833770545&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TeutU~sf62gjBH6OthznEX0kRRgdotvnfqDIiC9uB5WoCO6IoTITWx9PDBSipxbBXwvLlGU-9Wy92tjnvyOWTGaHINnvI9dS9zr80fmRVIpf0rdhT8NKaYqODJ6o4n3R4Jzj53SMYg~uzbNvhaqo~8~6EqSp1qqbcWrVRKnKWfxHoKd~IduexgO16PUbBINr02nccScixmPKh49DMsg0CcVwoh8RlduzKjG~cYBHdTBBQDoibx3o3FOBeCL5LbIpNFNlPLFKFbVeWp9j5Cs67sWl6z3PNZlXZRB8XN335ztumsD4CxGNZ-ea7qSLnKsSCmrivEa9BY0wX68vzXpbBA__" className="h-10 w-10" alt="Logo" />
        <span className="ml-2 hidden md:flex text-2xl font-bold text-black dark:text-white">SWAGATOM WORLD</span>
      </Link>

      <form onSubmit={handleSubmit} className='hidden md:flex items-center'>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='w-72 shadow-md'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className='flex gap-3 md:order-2 items-center'>
        <Button className='w-10 h-10' color='gray' pill onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? <FaSun className='text-yellow-500' /> : <FaMoon className='text-gray-300' />}
        </Button>

        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture} rounded className='w-10 h-10' />}>
            <Dropdown.Header>
              <span className='block text-sm font-medium'>@{currentUser.username}</span>
              <span className='block text-xs text-gray-500'>{currentUser.email}</span>
            </Dropdown.Header>
            <Dropdown.Item as={Link} to='/dashboard?tab=profile'>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>Sign In</Button>
          </Link>
        )}

        <Navbar.Toggle className='md:hidden' />
      </div>

      <Navbar.Collapse>
        {['/', '/about', '/projects'].map((route) => (
          <Navbar.Link key={route} active={location.pathname === route} as={'div'}>
            <Link to={route}>{route.replace('/', '') || 'Home'}</Link>
          </Navbar.Link>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
