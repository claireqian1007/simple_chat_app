import React, { startTransition, useCallback, useEffect, useRef, useState } from 'react'
import './index.scss'
import { Input, Button, Spin } from 'antd'
import SingleChatMessageBox from '../SingleChatMessageBox'
import { MessageInfo } from '../../types/Chat'
import { sendMessageByChatId } from '../../services/Chats'
import { useAuth } from '../../contexts/AuthContext'
import { UserInfo } from '../../types/User'
import { onChatMessageChange, onGetChatMessageList } from '../../services/EventObservers'
import { DataSnapshot } from 'firebase/database'
import SendMessageBox from '../SendMessageBox'
import ChatHistory from '../ChatHistory'

type Props = {
  chatId: string
  receiverInfo: UserInfo
}
const ChatContent: React.FC<Props> = ({ chatId, receiverInfo }) => {
  const { currentUserInfo, setError } = useAuth()
  const [chatHistory, setChatHistory] = useState<MessageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const chatHistoryRef = useRef<MessageInfo[]>()
  chatHistoryRef.current = chatHistory
  const onClickMessageButton = async (message: string) => {
    if (message) {
      if (currentUserInfo.email && receiverInfo.email) {
        try {
          setError('')
          await sendMessageByChatId(
            chatId,
            {
              email: currentUserInfo.email, // 标注此条消息本人发送
              message
            },
            currentUserInfo.userId,
            receiverInfo.email // 对方的email
          )
        } catch (e: any) {
          console.log(e.message || 'Fail to send message')
        }
      }
    } else {
      setError('empty message')
    }
  }

  const handleNewMessage = (data: DataSnapshot) => {
    if (chatHistoryRef.current) {
      const latestChatHistory = chatHistoryRef.current?.slice()
      latestChatHistory?.push({
        ...data.val(),
        id: data.key
      })
      setChatHistory(latestChatHistory)
    }
  }

  const handleLatestMessageList = (data: DataSnapshot) => {
    const snapshots = data.val()
    if (snapshots) {
      const messageList: MessageInfo[] = []
      for (const key in snapshots) {
        messageList.push({
          id: key,
          ...snapshots[key]
        })
      }
      setChatHistory(messageList)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    const unsubscribeGetMessageList = onGetChatMessageList(chatId, handleLatestMessageList)
    const unsubscribeChatMesChange = onChatMessageChange(chatId, handleNewMessage)
    return () => {
      unsubscribeGetMessageList()
      unsubscribeChatMesChange()
    }
  }, [chatId])

  return (
    <div className="chat-content-box">
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : (
        <ChatHistory chatHistory={chatHistory} receiverInfo={receiverInfo} />
      )}
      <SendMessageBox handleMessageSend={(v: string) => onClickMessageButton(v)} />
    </div>
  )
}
export default ChatContent
