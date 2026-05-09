import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { Activity } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <Activity size={28} />
            Insight Engine
          </div>
          {isAuthenticated && (
            <button 
              className="btn-primary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                setIsAuthenticated(false);
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          )}
        </nav>
        
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
