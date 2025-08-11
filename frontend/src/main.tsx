import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import App from './App';
import { UserProvider } from "./context/UserContext";



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <UserProvider>
    <App />
        </UserProvider>

  </React.StrictMode>
)
 