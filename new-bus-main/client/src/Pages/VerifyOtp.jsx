import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Styles/verifyOtp.module.css';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOTP = async () => {
    const { email } = location.state || {};
    if (!otp || !email) {
      setNotification("Invalid OTP or email. Please try again.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8070/user/verify-otp', { email, otp });
      if (response.data.code === 200) {
        navigate('/reset-password', { state: { email } });
      } else {
        setNotification(response.data.message);
      }
    } catch (error) {
      setNotification("Error verifying OTP. Please try again.");
    }
  };

  return (
    <div className={styles.center}>
      <h1>Verify OTP</h1>
      {notification && <p className={styles.notification}>{notification}</p>}
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={handleOtpChange}
        className={styles.input}
      />
      <button onClick={handleVerifyOTP} className={styles.button}>Verify OTP</button>
    </div>
  );
}

export default VerifyOTP;
