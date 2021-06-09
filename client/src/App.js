import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Loader } from './components/Loader'
import { Footer } from './components/Footer'
import './styles/styles.scss'
import FooterInterval from './components/FooterInterval'

function App() {
  const { token, login, logout, userId, ready, username, privileges } =
    useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated, privileges)

  if (!ready) {
    return <Loader />
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        username,
        privileges,
        isAuthenticated,
      }}
    >
      <Router>
        {isAuthenticated && <Header />}
        <div className="container-fluid">
          <div className="row">
            {isAuthenticated && privileges !== '1' && <Sidebar />}
            {routes}
          </div>
        </div>
        <FooterInterval />
        <Footer />
      </Router>
    </AuthContext.Provider>
  )
}

export default App
