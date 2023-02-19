import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import DialogProvider from './context/DialogProvider.jsx'
import GlobalDataStoreContext from './context/GlobalDataStoreContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalDataStoreContext>
      <DialogProvider>
        <App />
      </DialogProvider>
    </GlobalDataStoreContext>
  </React.StrictMode>
);