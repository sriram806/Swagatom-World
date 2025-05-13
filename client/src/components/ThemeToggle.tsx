import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleTheme } from '../redux/theme/themeSlice';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <FaSun className="w-5 h-5 text-yellow-500" />
      ) : (
        <FaMoon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}