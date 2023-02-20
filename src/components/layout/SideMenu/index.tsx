import { ContactsOutlined, MessageOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { useAuth } from '../../../contexts/AuthContext'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './index.scss'
import { SideTabNav } from '../../../types/SideMenu'

const SideMenu: React.FC = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [avatar, setAvatar] = useState(require('../../../assets/defaultAvatar.jpg'))
  const selectedTab = useMemo(() => pathname?.match(/(?<=\/)([a-z]*)/g)?.[0], [pathname])
  const { currentUserInfo, profileUpdated } = useAuth()

  useEffect(() => {
    if (currentUserInfo?.avatarUrl) {
      setAvatar(currentUserInfo?.avatarUrl)
    }
  }, [currentUserInfo?.avatarUrl])
  if (profileUpdated) {
    return (
      <div className="sidebar-container">
        <Avatar
          src={<img src={avatar} alt="myAvatar" />}
          className="user-avatar"
          onClick={() => navigate(`/${SideTabNav.PROFILE}`)}
        />

        <div
          className={`sidebar-tab ${selectedTab === SideTabNav.CHAT && 'selected-tab'}`}
          onClick={() => navigate(`/${SideTabNav.CHAT}`)}
        >
          <MessageOutlined style={{ fontSize: '30px' }} />
        </div>
        <div
          className={`sidebar-tab ${selectedTab === SideTabNav.CONTACTS && 'selected-tab'}`}
          onClick={() => navigate(`/${SideTabNav.CONTACTS}`)}
        >
          <ContactsOutlined style={{ fontSize: '30px' }} />
        </div>
        <div
          className={`sidebar-tab ${selectedTab === SideTabNav.ADD_NEW_CONTACT && 'selected-tab'}`}
          onClick={() => navigate(`/${SideTabNav.ADD_NEW_CONTACT}`)}
        >
          <PlusCircleOutlined style={{ fontSize: '30px' }} />
        </div>

        <div
          className={`sidebar-tab setting-tab ${selectedTab === SideTabNav.SETTING && 'selected-tab'}`}
          onClick={() => navigate(`/${SideTabNav.SETTING}`)}
        >
          <SettingOutlined style={{ fontSize: '30px' }} />
        </div>
      </div>
    )
  } else {
    return <></>
  }
}

export default SideMenu
