import { Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from '#pages/Signup.tsx'
import Signin from "#pages/Signin.tsx"
import Dashboard from "#pages/Dashboard.tsx"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={
            <Suspense fallback="loading...">
              <Signup />
            </Suspense>}
          />
          <Route path="/signin" element={
            <Suspense fallback="loading...">
              <Signin />
            </Suspense>}
          />
          <Route path="/dashboard" element={
            <Suspense fallback="loading...">
              <Dashboard />
            </Suspense>}
          />
         {/* <Route path="/send" element={<Suspense fallback="loading..."><SendMoney /></Suspense>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
