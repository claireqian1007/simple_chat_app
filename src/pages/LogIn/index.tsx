import React, { useState, useEffect } from 'react'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './index.scss'
import { useAuth } from '../../contexts/AuthContext'

const LogIn: React.FC = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { currentUser, login, setError, profileUpdated } = useAuth()

  // useEffect(() => {
  //   if (currentUser) {
  //     navigate('/chat')
  //   }
  // }, [currentUser, navigate])

  async function handleFormSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      await login(email, password)
      navigate('/profile')
    } catch (e) {
      setError('Failed to login')
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
        <Link to="/register" className="link">
          Do not have an account? Register
        </Link>
      </div>
      <Button type="primary" loading={loading} onClick={(e: any) => handleFormSubmit(e)}>
        Sign in
      </Button>
    </div>
  )
}

export default LogIn
