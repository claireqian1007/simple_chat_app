import React, { startTransition, useCallback, useEffect, useState } from 'react'
import { ChatInfo } from '../../types/Chat'
import './index.scss'
import { Avatar } from 'antd'
import { getUserProfileByEmail } from '../../services/Users'
import { useAuth } from '../../contexts/AuthContext'
import { formatDateViaTimeDiff } from '../../utils/dateFormatter'
import { UserInfo } from '../../types/User'

type Props = {
  chatInfo: ChatInfo
  selectedChatId: string
  clickChatTab: Function
}
const ChatTab: React.FC<Props> = ({ chatInfo, selectedChatId, clickChatTab }) => {
  const [avatar, setAvatar] = useState(require('../../assets/defaultAvatar.jpg'))
  const [receiverInfo, setReceiverInfo] = useState({} as UserInfo)
  const { setError } = useAuth()

  const getUserInfoByReceiverEmail = useCallback(
    (email: string) => {
      const task = async () => {
        try {
          setError('')
          const receiverInfo = await getUserProfileByEmail(email)
          startTransition(() => {
            setAvatar(receiverInfo.avatarUrl)
            setReceiverInfo(receiverInfo)
          })
        } catch (e: any) {
          setError('Fail to get part of contacts info')
        }
      }
      task()
    },
    [setError]
  )

  useEffect(() => {
    getUserInfoByReceiverEmail(chatInfo.receiver)
  }, [chatInfo.receiver, getUserInfoByReceiverEmail])

  return (
    <div
      className={`single-chat-tab ${selectedChatId === chatInfo?.chatId && 'selected-chat-tab'}`}
      onClick={() =>
        clickChatTab({
          chatId: chatInfo?.chatId,
          receiverInfo
        })
      }
    >
      <Avatar src={<img src={avatar} alt="avatar" />} className="avatar" />
      <div className="chat-content-container">
        <div className="name-and-time-container">
          <div className="user-name">{receiverInfo?.nickName}</div>
          <div className="latest-message-time">{formatDateViaTimeDiff(chatInfo?.timestamp)}</div>
        </div>
        <div className="latest-message">{chatInfo?.lastMessage}</div>
      </div>
    </div>
  )
}
export default ChatTab
