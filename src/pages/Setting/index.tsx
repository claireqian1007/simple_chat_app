import React, { useEffect, useState } from 'react'
import { Button, Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const Setting: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const options = [
    { label: 'light', value: 'light' },
    { label: 'dark', value: 'dark' }
  ]

  const themeOnChange = ({ target: { value } }: RadioChangeEvent) => {
    setTheme(value)
  }

  return (
    <div className="setting-page">
      <div className="setting-page-title">Settings</div>
      <div className="settings-content-container">
        <div className="setting-option">
          <div className="option-title">profile</div>
          <Button type="primary" className="edit-profile-button" onClick={() => navigate('/profile')}>
            edit profile
          </Button>
        </div>
        <div className="setting-option">
          <div className="option-title">select theme</div>
          <Radio.Group
            className="theme-radio"
            options={options}
            defaultValue={theme}
            value={theme}
            onChange={themeOnChange}
          />
        </div>
        <Button type="primary" className="logout-button" onClick={() => logout()}>
          logout
        </Button>
      </div>
    </div>
  )
}
export default Setting
