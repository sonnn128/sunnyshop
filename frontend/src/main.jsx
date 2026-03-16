import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nProvider } from './i18n';
import store from './store';
import App from './App';
import './index.css';
import './styles/index.css';
import { ConfigProvider, theme as antdTheme } from 'antd';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <I18nProvider>
            <ConfigProvider
              theme={{
                algorithm: antdTheme.darkAlgorithm,
                token: {
                  colorPrimary: '#2563eb',
                  colorBgBase: '#050814',
                  colorBgContainer: '#0b1020',
                  colorBorder: '#1f2937',
                  colorTextBase: '#e5e7eb',
                  colorTextSecondary: '#9ca3af',
                  borderRadius: 10,
                  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                },
              }}
            >
              <App />
            </ConfigProvider>
          </I18nProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);