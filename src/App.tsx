import React, {useEffect} from 'react';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate, HashRouter} from "react-router-dom";
import MainPage from "./components/MainPage";


function App() {

  return (
      <HashRouter>
          <Routes>
              <Route path={'/:key'} element={<MainPage/>}/>
              <Route path={'/*'} element={<Navigate to={`/${(+new Date()).toString()}`}/>}/>
          </Routes>
      </HashRouter>
  );
}

export default App;
