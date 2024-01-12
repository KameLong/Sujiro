import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as signalR from "@microsoft/signalr";
import TimeTablePage from "./TimeTable/TimeTablePage";
import DiagramPage from "./Diagram/DiagramPage";
import {Route, Router, Routes } from 'react-router-dom';


function App() {
  return (
      <Routes>
        <Route path="/" element={<DiagramPage/>}>
        </Route>
        <Route path="/timetable" element={<TimeTablePage/>}>
        </Route>

      </Routes>
  );
}

export default App;
