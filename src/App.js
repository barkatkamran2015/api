import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./Footer"; // Import the Footer component
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import SignIn from "./Authen/SignIn";
import SignUp from "./Authen/SignUp";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminPanel from "./Admin/AdminPanel";
import PostEditor from "./Admin/PostEditor";
import Blog from "./components/Blog";
import Recipe from "./components/Recipe";
import ProductsReview from "./components/ProductsReview";
import { auth } from "./Admin/firebaseConfig";

// Protected Route component to handle authentication checks
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div id="app-layout" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Navbar remains persistent across routes */}
        <Navbar />
        
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/products-review" element={<ProductsReview />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Protected Routes */}
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminpanel"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posteditor"
              element={
                <ProtectedRoute>
                  <PostEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* Footer displayed on all pages */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
