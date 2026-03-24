import { createRoot } from 'react-dom/client'
import './index.css'
import "./models/BottomSheet/BottomSheet.css";
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <ToastContainer
        position="bottom-center"
        autoClose={1400}
        hideProgressBar
        newestOnTop
        closeButton={false}
        pauseOnHover={false}
        draggable={false}
        limit={1}
        closeOnClick
        toastClassName="ko-short-toast"
        bodyClassName="ko-short-toast-body"
      />
    </AuthProvider>
  </BrowserRouter>,
)
