// Component Imports 
import App from './App.jsx'
import store from './Redux/store.js';

//CSS imports
import './index.css'

//Library Imports
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store} > 
  <BrowserRouter>
        <App/>
        <Toaster/>
  </BrowserRouter>
  </Provider>  
  
);
