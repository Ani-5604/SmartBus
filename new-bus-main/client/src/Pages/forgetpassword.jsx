import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/forgetPassword.module.css';

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendOTP = async () => {
    if (!email) {
      setNotification("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8070/user/submit-otp', { email });
      if (response.data.code === 200) {
        navigate('/verify-otp', { state: { email } });
      } else {
        setNotification(response.data.message);
      }
    } catch (error) {
      setNotification("Error sending OTP. Please try again.");
    }
  };

  return (
    <div className={styles.center}>
      <h1>Forgot Password</h1>
      {notification && <p className={styles.notification}>{notification}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        className={styles.input}
      />
      <button onClick={handleSendOTP} className={styles.button}>Send OTP</button>
    </div>
  );
}

export default ForgetPassword;
