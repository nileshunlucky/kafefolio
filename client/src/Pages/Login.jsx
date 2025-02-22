import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { auth, provider, signInWithPopup } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/user.slice';

const Login = () => {
    const [signUp, setSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = signUp ? "https://kafefolio-server.onrender.com/api/auth/login" : "https://kafefolio-server.onrender.com/api/auth/register";
        const userData = signUp ? { email, password } : { name, email, password };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                toast.success(data.msg || "Success!");
                dispatch(signInSuccess(data));
                navigate('/admin');
            } else {
                toast.error(data.msg || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error, please try again.");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            const token = localStorage.getItem("token");
            const res = await fetch("https://kafefolio-server.onrender.com/api/auth/google", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    name: user.displayName,
                    token: idToken
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Google Login Successful!");
                navigate('/admin');
                localStorage.setItem("token", data.token);
                dispatch(signInSuccess(data));

            } else {
                toast.error(data.msg || "Google login failed.");
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error("Google authentication failed.");
        }
    };

    return (
        <div className='flex items-center'>
            <Toaster />
            <div className="md:w-[50%] w-full h-screen text-[#ffe6a7] bg-gradient-to-r from-[#99582a] to-[#0E0A06] text-center flex justify-center items-center">
                <div className="w-[80%] flex flex-col gap-5">
                    {
                        !signUp ?
                            <div className="flex flex-col justify-center items-center gap-3">
                                <h1 className='text-4xl font-bold flex gap-3'>Join <p className='Pacifico font-light'>Kafefolio</p></h1>
                                <p className='text-xl'>Sign up for Free!</p>
                            </div> :
                            <div className="flex flex-col justify-center items-center gap-3">
                                <h1 className='text-4xl font-bold flex gap-3 whitespace-nowrap'>Welcome Back!</h1>
                                <p className='text-xl whitespace-nowrap flex gap-2'>Log in to your
                                    <span className='Pacifico font-extralight'>Kafefolio</span></p>
                            </div>
                    }

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {!signUp && (
                            <input
                                className='focus:outline-none padding10 bg-[#99582a] rounded-xl border-3 border-[#432818]'
                                type="text"
                                placeholder='Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        )}
                        <input
                            className='focus:outline-none padding10 bg-[#99582a] rounded-xl border-3 border-[#432818]'
                            type="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required

                        />
                        <div className="relative padding10 bg-[#99582a] rounded-xl border-3 border-[#432818] flex">
                            <input
                                className='focus:outline-none w-full'
                                type={showPassword ? "text" : "password"}
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#432818]"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <i className="fa-solid fa-eye-slash cursor-pointer" /> : <i className="fa-solid fa-eye cursor-pointer" />}
                            </button>
                        </div>

                        <button type='submit' className='bg-[#ffe6a7] text-[#432818] w-full cursor-pointer whitespace-nowrap padding10 rounded-xl'>
                            {signUp ? "Continue" : "Create account"}
                        </button>

                        {!signUp && (
                            <p>By clicking Create account, you agree to Kafefolio's
                                <Link className='underline' to="/privacy"> privacy notice</Link>,
                                <Link className='underline' to="/terms"> T&Cs</Link>
                                , and to receive offers, news, and updates.
                            </p>
                        )}
                    </form>

                    <div className="flex flex-col justify-center items-center gap-5">
                        <p>OR</p>
                        <button onClick={handleGoogleSignIn} className='flex justify-center padding10 items-center gap-2 border rounded-full w-full cursor-pointer'>
                            <img className='w-10' src="https://logos-world.net/wp-content/uploads/2020/09/Google-Symbol.png" alt="google" />
                            <p>Sign up with Google</p>
                        </button>

                        <p>
                            {signUp ? "Don't have an account?\t" : "Already have an account?\t"}
                            <Link onClick={() => setSignUp(!signUp)} className='underline'>
                                {signUp ? "Sign up" : "Log in"}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="md:w-[50%] md:flex hidden justify-center items-center bg-[#0E0A06]">
                <img className='h-screen' src="/KafeLogin.png" alt="banner" />
            </div>
        </div>
    );
}

export default Login;
