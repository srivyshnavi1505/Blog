import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import { useEffect } from 'react'
import { useAuth } from '../store/authStore'
import Footer from './Footer'

function RootLayout() {

  const checkAuth = useAuth((state)=> state.checkAuth);
  const loading = useAuth((state)=> state.loading);

  useEffect(()=>{
    checkAuth();
  },[]
  );
 if (loading) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-400">Loading...</p>
    </div>
  );
}
  
  return (
   <div className="bg-zinc-950 min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default RootLayout