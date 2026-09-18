import React  from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import UserRoute from "./Routeing/UserRoute.jsx";
import { ToastContainer } from "react-toastify";
import AdminRoute from "./Routeing/Adminroute.jsx";
import PageLoader from "./components/PageLoader/PageLoader.jsx";

function App() {


  return (
    <div>
      <ToastContainer/>
      <Router>
        <PageLoader>
          <Routes>
            <Route path="/*" element={<UserRoute/>}/> 
            <Route path="/admin/*" element={<AdminRoute/>}/>       
          </Routes>
        </PageLoader>
      </Router>       
    </div>
    
  )
}

export default App
