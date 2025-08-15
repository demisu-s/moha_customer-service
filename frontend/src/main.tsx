import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import App from './App';
import { UserProvider } from "./context/UserContext";
import { DeviceProvider } from './context/DeviceContext';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <UserProvider>
        <DeviceProvider>
          {/* Wrap the App component with UserProvider and DeviceProvider */}
    <App />
        </DeviceProvider>
        </UserProvider>

  </React.StrictMode>
)
 