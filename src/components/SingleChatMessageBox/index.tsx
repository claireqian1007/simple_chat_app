import React, { useEffect, useMemo, useState } from 'react'
import { MessageInfo } from '../../types/Chat'
import { Avatar } from 'antd'
import './index.scss'
import { useAuth } from '../../contexts/AuthContext'
import { UserInfo } from '../../types/User'

type Props = {
  messageInfo: MessageInfo
  receiverInfo: UserInfo
}
const SingleChatMessageBox: React.FC<Props> = ({ messageInfo, receiverInfo }) => {
  const { currentUserInfo } = useAuth()
  const [myAvatar, setMyAvatar] = useState(require('../../assets/defaultAvatar.jpg'))
  const [friendAvatar, setFriendAvatar] = useState(require('../../assets/defaultAvatar.jpg'))

  useEffect(() => {
    setMyAvatar(currentUserInfo.avatarUrl)
    setFriendAvatar(receiverInfo.avatarUrl)
  }, [currentUserInfo.avatarUrl, receiverInfo.avatarUrl])

  const opposite = useMemo(() => messageInfo.email !== currentUserInfo.email, [messageInfo, currentUserInfo])
  return (
    <div className={`single-chat-message-box ${opposite && 'opposite-chat-box'}`}>
      <Avatar src={<img src={opposite ? friendAvatar : myAvatar} alt="avatar" />} className="chat-avatar" />
      <div className="space" />
      <div className={`message-content ${opposite && 'opposite-message-content'}`}>{messageInfo.message}</div>
    </div>
  )
}
export default SingleChatMessageBox
