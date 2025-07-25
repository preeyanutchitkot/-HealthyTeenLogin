
'use client';  // เพิ่มบรรทัดนี้ที่ด้านบน

import React, { useEffect, useState } from 'react';

const Login = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        // Initialize LIFF with your LIFF ID
        await liff.init({ liffId: "2007818160-G3byYdaA" });  // Replace with your actual LIFF ID

        // Check if the user is logged in, if not, start the login process
        if (!liff.isLoggedIn()) {
          liff.login();  // Trigger LINE login if not logged in
        } else {
          // If logged in, get the user's profile
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error initializing LIFF:", error);
      }
    };

    initLiff();
  }, []);

  return (
    <div>
      <h1>Welcome to Healthy Teen</h1>
      {!profile ? (
        <p>Logging in...</p>
      ) : (
        <div>
          <h2>Welcome, {profile.displayName}</h2>
          <img src={profile.pictureUrl} alt="Profile" />
          <p>User ID: {profile.userId}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
