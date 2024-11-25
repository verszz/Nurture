import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/user.action';

const AutoLogout = ({ children }) => {
  const navigate = useNavigate();
  let logoutTimer;

  // Fungsi untuk logout
  const handleLogout = () => {
    logout(); // Panggil fungsi logout
    navigate('/'); // Redirect ke halaman login
  };

  // Fungsi untuk reset timer
  const resetLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer); // Reset timer jika ada
    logoutTimer = setTimeout(handleLogout, 5 * 60 * 1000); // 5 menit
  };

  useEffect(() => {
    // Tambahkan event listener untuk mendeteksi aktivitas pengguna
    const events = ['click', 'mousemove', 'keypress'];
    events.forEach((event) =>
      window.addEventListener(event, resetLogoutTimer)
    );

    // Set timer pertama kali
    resetLogoutTimer();

    // Cleanup saat komponen di-unmount
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetLogoutTimer)
      );
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  return <>{children}</>; // Render child components
};

export default AutoLogout;
