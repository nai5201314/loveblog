import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';  
import './index.css';
import { SpinProvider } from './stores/spinStore.jsx';
import GlobalSpin from './components/GlobalSpin/GlobalSpin.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider   >

        <SpinProvider>
          <GlobalSpin>
            <App />
          </GlobalSpin>
        </SpinProvider>
    </ConfigProvider>
  </StrictMode>,
)
