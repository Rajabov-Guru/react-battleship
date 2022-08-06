import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import MainPage from "./components/MainPage";


function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path={'/:key'} element={<MainPage/>}/>
              <Route path={'/*'} element={<Navigate to={`/${(+new Date()).toString()}`}/>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
