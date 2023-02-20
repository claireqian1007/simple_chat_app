import React, { useState } from 'react'
import { Avatar, Button, Modal } from 'antd'
import './index.scss'
import { createNewChat, removeChatByEmail, validateIfChatExistedByEmail } from '../../services/Chats'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { DataSnapshot } from '@firebase/database'
import { ChatInfo, FriendInfo } from '../../types/Chat'
import { removeUserByEmail } from '../../services/Users'

type Props = {
  selectedFriendInfo: FriendInfo
  resetSelectedInfo: Function
}
const ContactPersonalInfo: React.FC<Props> = ({ selectedFriendInfo, resetSelectedInfo }) => {
  const { currentUserInfo, setError } = useAuth()
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const navigate = useNavigate()

  const handleChatExistenceResult = async (matchedData: DataSnapshot) => {
    if (matchedData.val()) {
      // means chat has existed
      const existedChat = Object.values(matchedData.val())[0] as ChatInfo
      navigate('/chat', { state: { chatId: existedChat.chatId, receiverInfo: selectedFriendInfo } })
      // 跳转去对应的detail页面继续聊天
    } else {
      try {
        const createdChatId = await createNewChat(currentUserInfo, selectedFriendInfo.email)
        // 成功后到chat列表高亮该用户，并打开聊天对话框
        navigate('/chat', { state: { chatId: createdChatId, receiverInfo: selectedFriendInfo } })
      } catch (e: any) {
        setError(e.message)
      }
    }
  }
  const onClickSendMessage = async (e: any) => {
    try {
      await validateIfChatExistedByEmail(currentUserInfo, selectedFriendInfo.email, handleChatExistenceResult)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const onClickDeleteContact = async (e: any) => {
    setConfirmLoading(true)
    try {
      await removeUserByEmail(selectedFriendInfo.email, currentUserInfo)
      await removeChatByEmail(selectedFriendInfo.email, currentUserInfo)
      setConfirmLoading(false)
      setOpen(false)
      resetSelectedInfo({})
    } catch (e: any) {
      setError(e.message || 'Delete Contact Fail')
    }
  }

  return (
    <div className="contact-personal-info-container">
      <div className="header-part">
        <div className="user-name">{selectedFriendInfo?.name}</div>
        <Avatar src={<img loading="lazy" src={selectedFriendInfo?.avatarUrl} alt="avatar" />} className="avatar" />
      </div>
      <div className="info-part">
        <div className="detail-info-container">
          <div className="info-tag">Signature</div>
          <div className="info-content">{selectedFriendInfo?.signature}</div>
        </div>
        <div className="detail-info-container">
          <div className="info-tag">Gender</div>
          <div className="info-content">{selectedFriendInfo.gender}</div>
        </div>
        <div className="detail-info-container">
          <div className="info-tag">Email</div>
          <div className="info-content" data-testid="contact-info-email">
            {selectedFriendInfo?.email}
          </div>
        </div>
      </div>
      <Button type="primary" className="send-message-button" onClick={(e) => onClickSendMessage(e)}>
        Send Message
      </Button>
      <Button
        data-testid="delete-contact-button"
        type="primary"
        className="send-message-button"
        onClick={() => setOpen(true)}
      >
        Delete Contact
      </Button>
      <Modal
        data-testid="delete-confirm-modal"
        title="Confirm"
        open={open}
        onOk={onClickDeleteContact}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <p>Chat history related to this contact will also be deleted, are your sure to delete</p>
      </Modal>
    </div>
  )
}
export default ContactPersonalInfo
