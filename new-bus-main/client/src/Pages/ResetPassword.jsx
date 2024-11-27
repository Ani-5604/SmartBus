import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/resetPassword.module.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = async () => {
    const { email } = location.state || {};
    if (!email || password !== confirmPassword) {
      setNotification("Passwords do not match or email is missing.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8070/user/reset-password', {
        email,
        password,
      });
      if (response.data.code === 200) {
        navigate('/signin');
      } else {
        setNotification(response.data.message);
      }
    } catch (error) {
      setNotification("Error resetting password. Please try again.");
    }
  };

  return (
    <div className={styles.center}>
      <h1>Reset Password</h1>
      {notification && <p className={styles.notification}>{notification}</p>}
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={handlePasswordChange}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        className={styles.input}
      />
      <button onClick={handleResetPassword} className={styles.button}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;
