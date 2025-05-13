import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RootState } from './redux/store';
import Header from './components/Header';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

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
        <Toaster position="top-center" />
        <Header />
        <main className="container mx-auto px-4 pt-20">
          <Routes>
            <Route path="/" element={<h1 className="text-4xl font-bold text-center mt-10">Welcome to Swagatom</h1>} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}