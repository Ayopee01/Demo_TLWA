import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Page from './Page.jsx'
import Page_About from './Page_About.jsx'
import Page_UserDetail from './Page_UserDetail.jsx'

import News from "./components/News.jsx";
import Editorial from "./components/Editorial.jsx";
import NewsDetail from "./components/NewsDetail.jsx";
import About from './components/About.jsx'
import UserDetail from './components/UserDetail.jsx';

import ReactDOM from 'react-dom/client';
//import router เชื่อมต่อหน้าอื่นๆ
import { createBrowserRouter, RouterProvider, } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "Page",
    element: <Page />,
  },
  {
    path: "/Page_About",
    element: <Page_About />,
  },
    {
  path: "/Page_UserDetail/:id", // ✅ ถูกต้อง!
    element: <Page_UserDetail />,
  },
  {
    path: "/News",  // /news
    element: <News />,
  },

  {
    path: "/Editorial",  // /editorial
    element: <Editorial />,
  },
  {
    path: "/NewsDetail",  // /editorial
    element: <NewsDetail />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
