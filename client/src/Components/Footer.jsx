import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Footer = () => {
  const [user, setUser] = useState(null);
  const year = new Date().getFullYear();
  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://kafefolio-server.onrender.com/api/user/${username}`);
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

  return (
    <>
      {
        !user?.isPro && (
          <footer className='flex justify-center items-center padding10'
            style={{ backgroundColor: user?.portfolio.theme.color, color: user?.portfolio.theme.backgroundColor }}>
            <p style={{ fontFamily: user?.portfolio.theme.font }}>Powered by
              <span onClick={() => window.open('https://kafefolio.vercel.app/', '_blank')} className='Pacifico font-extralight'> Kafefolio</span> © {year}
            </p>
          </footer>
        )
      }
    </>
  )
}

export default Footer
