import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import UndoRedoContext from "./Hooks/UndoRedoHook";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
      <BrowserRouter>
          <UndoRedoContext>
                <App />
          </UndoRedoContext>
      </BrowserRouter>
 // </React.StrictMode>
);

