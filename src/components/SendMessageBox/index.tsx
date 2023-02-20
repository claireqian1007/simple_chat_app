import './index.scss'
import React, { useState } from 'react'
import TextArea from 'antd/es/input/TextArea'
import { Button } from 'antd'

type Props = {
  handleMessageSend: Function
}
const SendMessageBox: React.FC<Props> = ({ handleMessageSend }) => {
  const [message, setMessage] = useState<string>('')

  return (
    <div className="chat-input-container">
      <TextArea
        className="input-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        bordered={false}
        style={{ height: 95, resize: 'none', marginTop: '4px', color: 'var(--color)' }}
        placeholder={'Type a message...'}
        onPressEnter={() => {
          handleMessageSend(message)
          setMessage('')
        }}
      />
      <Button
        type="primary"
        className="send-button"
        onClick={() => {
          handleMessageSend(message)
          setMessage('')
        }}
      >
        Send
      </Button>
    </div>
  )
}

export default SendMessageBox
