import { scan } from 'react-scan'; 
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';

if (process.env.NODE_ENV === 'development') {
  scan({ enabled: true, log: true });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const store = configureStore({ reducer: rootReducer, devTools: true });

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
