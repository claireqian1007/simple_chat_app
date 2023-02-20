import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Alert } from 'antd'

const ErrorNotification: React.FC = () => {
  const { error, setError } = useAuth()

  return error ? (
    <Alert
      style={{
        maxWidth: '300px',
        position: 'fixed',
        left: 'calc(50vw - 125px)',
        top: '20px',
        zIndex: 99
      }}
      message={error}
      type="error"
      showIcon
      closable
      onClose={() => setError('')}
    />
  ) : (
    <></>
  )
}

export default ErrorNotification
