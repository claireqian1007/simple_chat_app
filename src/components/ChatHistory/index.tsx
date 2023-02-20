import React, { useEffect, useRef } from 'react'
import { MessageInfo } from '../../types/Chat'
import { UserInfo } from '../../types/User'
import SingleChatMessageBox from '../SingleChatMessageBox'
import './index.scss'

type Props = {
  chatHistory: MessageInfo[]
  receiverInfo: UserInfo
}
const ChatHistory: React.FC<Props> = ({ chatHistory, receiverInfo }) => {
  const bottomDummyDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      bottomDummyDivRef.current?.scrollIntoView()
    }, 0) // setTimeout used to handle update when update history by onEnterPress event
  }, [chatHistory])

  return (
    <div className="chat-history-container">
      {chatHistory.map((message) => {
        return <SingleChatMessageBox receiverInfo={receiverInfo} messageInfo={message} key={message.id} />
      })}
      <div ref={bottomDummyDivRef}></div>
    </div>
  )
}

export default ChatHistory
