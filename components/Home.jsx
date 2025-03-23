import React from 'react'
import Navbar from "../components/Navbar"
const Home = () => {
    
  return (
    <div className='bg-zinc-800 min-h-screen'>

        <Navbar/>
        <div className="bg-zinc-800 h-100vh w-full flex justify-center items-center">
        <div className="text-white w-3/4 p-12">
          <h1 className="text-4xl mb-8">Welcome to VeroLens: The Deepfake Detection Platform</h1>
          <p className="text-lg mb-4">In a world where reality is a luxury, we help you uncover the truth.</p>
          <video width="100%" height="500"  controls>
            <source src="/fakeVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>    
        
    </div>    
  )
}

export default Home