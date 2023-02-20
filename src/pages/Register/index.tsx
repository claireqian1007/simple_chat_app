import React, { useState, useEffect } from 'react'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'
import './index.scss'
const Register: React.FC = () => {
  const navigate = useNavigate()

  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { currentUser, register, setError } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate('/profile')
    }
  }, [currentUser, navigate])

  async function handleFormSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      await register(email, password)
      navigate('/profile')
    } catch (e) {
      setError('Failed to register')
    }

    setLoading(false)
  }

  // 暂时还没做输入内容检测

  return (
    <div className="login-container">
      <div>
        <Input placeholder="input email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input.Password
          placeholder="input password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input.Password
          placeholder="input password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button type="primary" loading={loading} onClick={(e: any) => handleFormSubmit(e)}>
        Sign up
      </Button>
    </div>
  )
}

export default Register
