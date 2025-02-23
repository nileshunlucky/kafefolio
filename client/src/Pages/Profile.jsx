import React, { useEffect, useState } from 'react';
import Nav from '../Components/Nav';
import { Outlet, useParams } from 'react-router-dom';
import Footer from '../Components/Footer';

const Profile = () => {
  const { username } = useParams(); // Get username from route parameters
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://kafefolio-server.onrender.com/api/user/${username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  if (!user) {
    return <div className="flex flex-col gap-2">
      <div className="w-full h-[72px] bg-zinc-300 animate-pulse"></div>
      <div className="w-full h-screen bg-zinc-300 animate-pulse"></div>
      <div className="w-full h-[60px] bg-zinc-300 animate-pulse"></div>
    </div>
  }

  return (
    <div>
      <Nav user={user} />
      <Outlet context={user} />
      <Footer />
    </div>
  );
};

export default Profile;