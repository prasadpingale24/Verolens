import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='shadow-md bg-slate-50 h-16 rounded-lg'>
      <div className='flex justify-between items-center p-4 '>
        <div className='flex gap-2 items-center'>
        <i class="ri-speak-ai-fill text-2xl"></i>
          <h2 className='text-2xl font-bold '>VeroLens</h2>
        </div>
        <div className='flex justify-between gap-4'>
          <Link to="/" className='text-bold '>Home</Link>
          <Link to="/About" className='text-bold '>About</Link>
          <Link to="/Video" className='text-bold '>Video</Link>
          <Link to="/Voice" className='text-bold '>Voice</Link>
          <Link to="/Stream" className='text-bold '>Stream</Link>
          <Link to="/Contact" className='text-bold '>Contact</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar