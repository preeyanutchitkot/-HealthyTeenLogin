'use client';

import React from 'react';

const Login = () => {
  return (
    <div className="login-container">
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0fdf4; /* Light green background */
        }
      `}</style>
        <div>
        <img 
          src="/Logo.png" 
          alt="Healthy Teen Logo" 
          style={{ width: '120px', marginBottom: '20px' }} 
        />
        <h1>เข้าสู่ระบบ</h1>
         <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
    <input 
      type="text" 
      placeholder="Username" 
      style={{ padding: '8px', width: '200px', borderRadius: '6px', border: '1px solid #ccc' }} 
    />
    <input 
      type="password" 
      placeholder="Password" 
      style={{ padding: '8px', width: '200px', borderRadius: '6px', border: '1px solid #ccc' }} 
    />
    <button 
      type="submit" 
      style={{ padding: '8px 24px', borderRadius: '6px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer' }}
    >
      เข้าสู่ระบบ
    </button>
  </form>
      </div>
    </div>
  );
};

export default Login;
