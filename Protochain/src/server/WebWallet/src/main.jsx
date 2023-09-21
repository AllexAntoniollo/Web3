import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from './routes/home.jsx';
import CreateWallet from './routes/CreateWallet.jsx';
import RecoverWallet from './routes/RecoverWallet.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: 
    [{
      path: "/",
      element: <Home />,
    },
    {
      path: "/CreateWallet",
      element: <CreateWallet />
    },
    {
      path: "RecoverWallet",
      element: <RecoverWallet />
    }
  ], 

  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
