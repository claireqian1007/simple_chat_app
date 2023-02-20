import { Routes, Route } from 'react-router-dom'

import Register from './pages/Register'
import Login from './pages/LogIn'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Contacts from './pages/Contacts'
import Setting from './pages/Setting'
import SideMenu from './components/layout/SideMenu'
import ErrorMessage from './components/ErrorMessage'
import { useAuth } from './contexts/AuthContext'
import ContentContainer from './components/layout/ContentContainer'
import AddContact from './pages/AddContact'
import WithPrivateRoute from './components/layout/ProtectedRoute'

function App() {
  const { currentUser } = useAuth()
  return (
    <>
      <ErrorMessage />
      {currentUser ? (
        <>
          <SideMenu />
          <Routes>
            <Route path="/" element={<ContentContainer />}>
              <Route path="/setting" element={<Setting />} />
              <Route
                path="/chat"
                element={
                  <WithPrivateRoute>
                    <Chat />
                  </WithPrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <WithPrivateRoute>
                    <Profile />
                  </WithPrivateRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <WithPrivateRoute>
                    <Contacts />
                  </WithPrivateRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <WithPrivateRoute>
                    <AddContact />
                  </WithPrivateRoute>
                }
              />
            </Route>
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  )
}

export default App
