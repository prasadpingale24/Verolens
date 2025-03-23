import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "../components/Home"
import Video from "../components/Video"
import Voice from "../components/Voice"
import About from "../components/About"
import Contact from "../components/Contact"
import Stream from "../components/Stream"
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/About' element={<About/>}/>
      <Route path='/Video' element={<Video/>}/>
      <Route path='/Voice' element={<Voice/>}/>
      <Route path='/Stream' element={<Stream/>}/>
      <Route path='/Contact' element={<Contact/>}/>
    </Routes>
  )
}

export default App