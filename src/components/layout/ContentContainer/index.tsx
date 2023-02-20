import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './index.scss'
const ContentContainer: React.FC = () => {
  return (
    <div className="content-container">
      <Outlet />
    </div>
  )
}

export default ContentContainer
