import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import './styles/App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/"      element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: '2px solid #0d0d0d',
            boxShadow: '4px 4px 0 #0d0d0d',
            borderRadius: '6px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
          },
        }}
      />
    </BrowserRouter>
  );
}
