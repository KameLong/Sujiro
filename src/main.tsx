import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {RecoilRoot} from "recoil";
import RecoilizeDebugger from 'recoilize';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <RecoilRoot>
        <RecoilizeDebugger/>
        <App />
    </RecoilRoot>
);