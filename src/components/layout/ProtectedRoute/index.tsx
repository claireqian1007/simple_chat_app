import React, { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'

const WithPrivateRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  if (currentUser) {
    return <div>{children}</div>
  }

  return <Navigate to="/" />
}

export default WithPrivateRoute
