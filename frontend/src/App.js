
import './App.css';
import React from 'react';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import {LoginPage} from "./Routes.js";
import {SignupPage} from "./Routes.js";
import {ActivationPage} from "./Routes.js";
import {HomePage} from "./Routes.js";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/sign-up" element={<SignupPage/>} />
        <Route path="/activation/:activation_token" element={<ActivationPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
