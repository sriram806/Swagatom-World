import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootState } from './redux/store';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
        <header className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-sm">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Swagatom</h1>
            <ThemeToggle />
          </nav>
        </header>
        <main className="container mx-auto px-4 pt-20">
          <Routes>
            <Route path="/" element={<h1>Welcome to Swagatom</h1>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}