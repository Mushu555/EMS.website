import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { id, token } = useParams();


  const resetPassword = async () => {
    try {
      const response = await axios.post(`http://localhost:3002/reset-password`, {
        id,
        token,
        password,
      });
  

      if (response.data.Status === 'Success') {
        navigate('/login');
      } else {
        // Handle other cases or errors
        console.log(response.data);
        console.error('Password reset failed');
        // You might want to redirect to the home page or handle errors differently
        //navigate('/home');
      }
    } catch (error) {
      console.error('Password reset failed with error:', error);
      // Handle the error, e.g., redirect to home page
      //navigate('/home');
    }
  };

  useEffect(() => {
    // Ensure that id and token are defined before making the request
    if (id && token) {
      console.log(id, token)
    }
  }, [id, token, navigate, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword();
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h4>Reset Password</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>New Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0" onClick={resetPassword}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
