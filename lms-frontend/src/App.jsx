import './App.css'


// components imports 
import HomePage from './Pages/HomePage'
import AboutUs from './Pages/AboutUs' 

import { Route, Routes } from 'react-router-dom'
 
 


function App() {
   

  return (
    < >
         <Routes>
             <Route path="/" element={<HomePage/>}></Route>
             <Route path="/about" element={<AboutUs/>}></Route>
         </Routes>
         
       
    </>
  )
}

export default App
