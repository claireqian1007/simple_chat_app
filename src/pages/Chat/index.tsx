import React, { startTransition, useEffect, useState } from 'react'
import './index.scss'
import ChatTab from '../../components/ChatTab'
import ChatContent from '../../components/ChatContent'
import { ChatInfo } from '../../types/Chat'
import { onChatListChange } from '../../services/EventObservers'
import { useAuth } from '../../contexts/AuthContext'
import { DataSnapshot } from '@firebase/database'
import { UserInfo } from '../../types/User'
import { useLocation } from 'react-router-dom'

const Chat: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState('')
  const [activeChatList, setActiveChatList] = useState<ChatInfo[]>([] as ChatInfo[])
  const [selectedReceiverInfo, setSelectedReceiverInfo] = useState<UserInfo>({} as UserInfo)
  const { currentUser } = useAuth()
  const { state } = useLocation()

  const onOneChatSelected = (val: { chatId: string; receiverInfo: UserInfo }) => {
    setSelectedChatId(val.chatId)
    setSelectedReceiverInfo(val.receiverInfo)
  }
  const handleUpdatedChatList = (data: DataSnapshot) => {
    const chatListObj = data.val()
    const chatList: ChatInfo[] = []
    for (const item in chatListObj) {
      chatList.push(chatListObj[item])
    }
    startTransition(() => {
      chatList.sort((a, b) => +b.timestamp - +a.timestamp)
      // 默认顺序是时间更新晚的在后面
      setActiveChatList(chatList)
    })
  }
  useEffect(() => {
    const unsubscribe = onChatListChange(currentUser.uid, handleUpdatedChatList)
    return unsubscribe
  }, [currentUser.uid])

  useEffect(() => {
    if (state) {
      setSelectedChatId(state?.chatId)
      setSelectedReceiverInfo(state?.receiverInfo)
    }
  }, [state])

  return (
    <div className="chat-page">
      <div className="opened-chat-list">
        {activeChatList.map((chatInfo) => {
          return (
            <ChatTab
              selectedChatId={selectedChatId}
              clickChatTab={(v: { chatId: string; receiverInfo: UserInfo }) => onOneChatSelected(v)}
              chatInfo={chatInfo}
              key={chatInfo.chatId}
            />
          )
        })}
      </div>
      {selectedChatId ? (
        <ChatContent chatId={selectedChatId} receiverInfo={selectedReceiverInfo} />
      ) : (
        <h2>Select a chat to talk!</h2>
      )}
    </div>
  )
}

export default Chat
