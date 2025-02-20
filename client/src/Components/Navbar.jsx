import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [open, setOpen] = useState(false)

    return (
        <header className='flex justify-center items-center'>
            <nav className='flex md:justify-between justify-around items-center fixed top-10 h-[10%] bg-[#ffe6a7] rounded-full w-[90%]
            padding20'>
                <div className="flex items-center gap-7">
                    <Link to="/">
                        <div className="flex items-center cursor-pointer">
                            <img className='w-12' src="/kafefolio.png" alt="logo" />
                            <h1 className='text-2xl Pacifico'>Kafefolio</h1>
                        </div>
                    </Link>


                    <ul className='md:flex hidden items-center gap-5 text-lg'>
                        <Link to="/about-us"><li>About</li></Link>
                        <Link to="/plans"><li>Plans</li></Link>
                    </ul>
                </div>

                <ul className='md:flex hidden items-center gap-5'>
                    <Link to="/login"><li>Log in</li></Link>
                    <Link to="/login"><li>Sign up free</li></Link>
                </ul>

                <div className="md:hidden">
                    {
                        open ? <i onClick={() => setOpen(!open)} className="fa-solid fa-x text-2xl cursor-pointer " /> : <i onClick={() => setOpen(!open)} className="fa-solid fa-bars text-2xl cursor-pointer " />
                    }
                </div>

                <div className="absolute top-20 bg-[#ffe6a7] rounded-3xl w-full my-5">
                    {
                        open && (
                            <ul className='md:hidden flex flex-col items-center gap-5 text-xl padding20'>
                                <Link to="/about-us"><li>About</li></Link>
                                <Link to="/plans"><li>Plans</li></Link>
                                <Link to="/login"><li>Log in</li></Link>
                                <Link to="/login"><li>Sign up free</li></Link>
                            </ul>
                        )
                    }
                </div>
            </nav>
        </header>
    )
}

export default Navbar
