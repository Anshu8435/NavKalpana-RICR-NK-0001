import { useState } from "react";
import {BrowserRouter , Route , Routes} from "react-router-dom";
import Analatics from "./Component/Main/Analatics";
import "./App.css";
import VisitPage from "./Component/Visit/VisitPage";
import HomePage from "./Component/Home/HomePage";
import Registration from "./Component/Main/Registeration";
import Records from "./Component/Main/Records";
import Login from "./Component/Auth/Login";
import Signup from "./Component/Auth/Signup";
import Header from "./Component/Home/Header";
function App() {
  return <>
  
  <BrowserRouter>
  <Routes>
    <Route path = "/" element = {<VisitPage/>}/>
    <Route path = "/login" element = {<Login/>}/>
    <Route path = "/signup" element = {<Signup/>}/>
    <Route path = "/home" element = {<HomePage/>}/>
    <Route path = "/analitcs" element = {<Analatics/>}/>
    <Route path = "/records" element = {<Records/>}/>
    <Route path = "/register" element = {<Registration/>}/>
    


  </Routes>
  </BrowserRouter>
  
  </>;
}

export default App;

{
  /* <VisitPage></VisitPage> */
}
{
  /* <Analatics></Analatics> */
}
// <HomePage></HomePage>
{
  /* <Login></Login> */
}

{
  /* <Signup></Signup> */
}
{
  /* <Records></Records> */
}
{
  /* <Registration></Registration> */
}
