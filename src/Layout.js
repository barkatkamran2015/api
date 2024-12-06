import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer'; // Adjust the path if necessary

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;
  
  // Check if the current path should hide the footer
  const hideFooter = [
    '/login',
    '/register',
    '/editor/fun',
    '/editor/postpage',
    '/editor/yummy',
    `/edit/${path.split('/')[2]}` // Hide footer for edit pages
  ].includes(path);

  return (
    <main>
      <Header />
      <Outlet />
      {!hideFooter && <Footer />} {/* Conditionally render Footer */}
    </main>
  );
}
