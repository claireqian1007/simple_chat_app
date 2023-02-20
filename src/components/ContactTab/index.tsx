import React from 'react'
import { Avatar } from 'antd'
import { FriendInfo } from '../../types/Chat'
import './index.scss'

type Props = {
  friendInfo: FriendInfo
  selectedFriendInfo: FriendInfo
  clickContactTab: Function
}
const ContactTab: React.FC<Props> = ({ friendInfo, selectedFriendInfo, clickContactTab }) => {
  return (
    <div
      data-testid={`contact-list-item-${friendInfo.email}`}
      className={`contacts-tab ${selectedFriendInfo?.email === friendInfo.email && 'selected-contact-tab'}`}
      onClick={() => clickContactTab(friendInfo)}
    >
      <Avatar src={<img loading="lazy" src={friendInfo?.avatarUrl} alt="avatar" />} className="avatar" />
      <div className="user-name">{friendInfo?.name}</div>
    </div>
  )
}
export default ContactTab
