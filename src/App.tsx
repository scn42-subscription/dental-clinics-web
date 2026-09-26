/**
 * App shell: routes, header, footer, sample chat assistant and toast host.
 */
import { Route, Routes } from 'react-router-dom'

import Chatbot from '@/components/Chatbot'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/sonner'
import Home from '@/pages/Home'
import Privacy from '@/pages/Privacy'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <Chatbot />
      <Toaster position="top-center" />
    </>
  )
}
