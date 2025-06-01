import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={ user ? <Dashboard /> : <Navigate to="/auth" /> } />
        <Route path='*' element={<Navigate to={"/"} /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
