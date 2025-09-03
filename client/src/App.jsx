// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Developer from './pages/Developer';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import Guides from './pages/Guides';
import FAQ from './pages/FAQ';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useContext, useState } from "react";
import { ThemeProvider } from './context/ThemeProvider';
import About from './pages/About';
import ResetPassword from "./pages/ResetPassword";





function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Listen for storage changes (for logout from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Always show navbar but pass authentication status */}
        <Navbar setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
        
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Dashboard /> : <Home />
            }
          />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/developer" element={<Developer />} />
          <Route
            path="/stats"
            element={
              isAuthenticated ? <Stats /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
            }
          />
        </Routes>
        <ToastContainer />
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
