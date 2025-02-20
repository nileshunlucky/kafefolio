import React from 'react'

const NotFound = () => {
  return (
    <div className='h-screen bg-gradient-to-tl from-[#432818] to-[#99582a] flex justify-center items-center text-center'>
      <div className="flex flex-col gap-5">
        <h1 className='text-9xl font-bold text-[#ffe6a7] whitespace-nowrap flex items-center'>4
          <img className='w-40' src="/coffee.png" alt="coffeebean" />
        4</h1>
        <p className='text-2xl font-semibold whitespace-nowrap text-[#432818]'><span>Ooops! </span><span className='text-[#ffe6a7] Pacifico font-extralight text-3xl'>Kafefolio</span> not found</p>

        <p onClick={() => window.history.back()} className='text-[#ffe6a7] cursor-pointer underline'>BACK HOME</p>
      </div>
    </div>
  )
}

export default NotFound
