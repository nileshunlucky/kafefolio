import React from 'react'
import { Link } from 'react-router-dom'

const Plans = () => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-tl from-[#432818] to-[#99582a] text-[#ffe6a7]'>
      <p onClick={() => window.history.back()} className='text-[#ffe6a7] cursor-pointer absolute top-5 left-5 text-lg'>Close</p>
      <div className="md:w-2/3 w-full flex flex-col items-center justify-between gap-5 marginy">
        <h1 className="md:text-3xl text-2xl whitespace-nowrap font-medium text-center">Choose Your Plan</h1>
        <div className="flex justify-between items-center w-full padding10 text-sm md:text-xl">
          {/* Features */}
          <div className="border border-r-0 w-full text-center">
            <ul>
              <li className='padding10 bg-[#ffe6a7] text-[#432818] text-xl'>Features</li>
              <hr />
              <li className='padding10'>Monthly Price</li>
              <hr />
              <li className='whitespace-nowrap padding10'>Custom domain</li>
              <hr />
              <li className='padding10'>Blue Tick</li>
              <hr />
              <li className='whitespace-nowrap padding10'>Portfolio Images</li>
              <hr />
              <li className='padding10'>Links</li>
              <hr />
              <li className='padding10'>Custom Theme</li>
              <hr />
              <li className='whitespace-nowrap padding10'>Animation Template's</li>
              <hr />
              <li className='padding10'>Analytics</li>
              <hr />
              <li className='padding10'>Kafefolio WaterMark</li>
            </ul>
          </div>
          {/* Free */}
          <div className="border w-full text-center">
            <ul>
              <li className='padding10 bg-[#ffe6a7] text-[#432818] text-xl '>Free</li>
              <hr />
              <li className='padding10'>₹0</li>
              <hr />
              <li className='padding10'>No</li>
              <hr />
              <li className='padding10'>No</li>
              <hr />
              <li className='padding10'>5</li>
              <hr />
              <li className='padding10'>limited</li>
              <hr />
              <li className='padding10'>No</li>
              <hr />
              <li className='padding10'>Basic</li>
              <hr />
              <li className='padding10'>No</li>
              <hr />
              <li className='padding10'>Yes</li>
            </ul>
          </div>
          {/* Pro */}
          <div className="border w-full border-l-0 text-center">
            <ul>
              <li className='padding10 bg-[#ffe6a7] text-[#432818] text-xl'>Pro</li>
              <hr />
              <li className='padding10'>₹299</li>
              <hr />
              <li className='padding10'>Yes</li>
              <hr />
              <li className='padding10'>Yes</li>
              <hr /> 
              <li className='padding10'>15</li>
              <hr />
              <li className='padding10'>Unlimited</li>
              <hr />
              <li className='padding10'>Yes</li>
              <hr />
              <li className='padding10'>Advance</li>
              <hr />
              <li className='padding10'>Yes</li>
              <hr />
              <li className='padding10'>No</li>
            </ul>
          </div>
        </div>
        <Link to="/admin/upgrade"><button className='bg-[#ffe6a7] text-[#432818] w-full text-lg cursor-pointer whitespace-nowrap padding20 rounded-xl'>Claim your <span className='text-[#99582a] Pacifico'>Kafefolio</span></button></Link> 
      </div>
    </div>
  )
}

export default Plans
