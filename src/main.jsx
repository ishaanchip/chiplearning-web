import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { Provider } from "./components/ui/provider"
import { system } from "./theme"
import './index.css';
import App from './App';



//able to preserve state of rendered data (no need to fetch API over and over again)
const queryClient = new QueryClient()

// importing Clerk API key & its ref
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
import { ClerkProvider } from '@clerk/clerk-react'




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </ClerkProvider>
 </React.StrictMode>
);
