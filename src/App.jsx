import React  from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import UserRoute from "./Routeing/UserRoute.jsx";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./Routeing/Adminroute.jsx";

function App() {


  return (
    <div>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path="/*" element={<UserRoute/>}/> 
          <Route path="/admin/*" element={<AdminRoute/>}/>       
        </Routes>
      </Router>       
    </div>
    
  )
}

export default App
