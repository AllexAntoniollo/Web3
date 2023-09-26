import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './app/App'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from './app/routes/Home';
import CreateWallet from './app/routes/CreateWallet';
import RecoverWallet from './app/routes/RecoverWallet';
import Balance from './app/routes/Balance';
import SendTx from './app/routes/SendTx';
import GetTx from './app/routes/GetTx'

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
      path: "/RecoverWallet",
      element: <RecoverWallet />
    },
    {
      path: "/Balance",
      element: <Balance />
    },
    {
      path: "/SendTx",
      element: <SendTx />
    },
    {
      path: "/GetTx",
      element: <GetTx />
    }
  ], 

  },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
