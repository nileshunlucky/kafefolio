import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Login from './Pages/Login'
import Template from './Pages/Template'
import Plans from './Pages/Plans'
import NotFound from './Pages/NotFound'
import Admin from './Pages/Admin'
import Themes from './Pages/Themes'
import Settings from './Pages/Settings'
import Account from './Pages/Account'
import PrivateRoute from './Components/PrivateRoute'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import Portfolio from './Pages/Portfolio.jsx'
import Analytics from './Pages/Analytics.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Links from './Pages/Links.jsx'
import About from './Pages/About.jsx'
import Contact from './Pages/Contact.jsx'
import Service from './Pages/Service.jsx'
import Profile from './Pages/Profile.jsx'
import Upgrade from './Pages/Upgrade.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/template",
    element: <Template />,
  },
  {
    path: "/plans",
    element: <Plans />,
  },
  {
    path: "/:username",
    element: <Profile />,
    children: [
      {
        path: "",
        element: <Portfolio />,
      },
      {
        path: "links",
        element: <Links />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "service",
        element: <Service />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ]
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/admin",
        element: <Admin />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "template",
            element: <Template />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "account",
            element: <Account />,
          },
          {
            path: "upgrade",
            element: <Upgrade />,
          },
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
