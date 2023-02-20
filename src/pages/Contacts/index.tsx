import React, { useEffect, useState, startTransition, useCallback } from 'react'
import { Input, Tooltip, Button, Spin } from 'antd'
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons'
import { FriendInfo } from '../../types/Chat'
import ContactTab from '../../components/ContactTab'
import ContactPersonalInfo from '../../components/ContactPersonalInfo'
import './index.scss'
import { onContractListChange } from '../../services/EventObservers'
import { useAuth } from '../../contexts/AuthContext'
import { getUserProfileByEmail } from '../../services/Users'
import { UserInfo } from '../../types/User'
import { DataSnapshot } from '@firebase/database'

const Contacts: React.FC = () => {
  const [selectedFriendInfo, setSelectedFriendInfo] = useState<FriendInfo>({} as FriendInfo)
  const [contactList, setContactList] = useState<FriendInfo[]>([] as FriendInfo[])
  const [loading, setLoading] = useState<boolean>(true)
  const { currentUser, setError } = useAuth()

  const handleContractEmailList = useCallback(
    (snapshot: DataSnapshot) => {
      const task = async () => {
        const promiseList: Promise<void>[] = []
        snapshot.forEach((childSnapshot: any) => {
          const childData = childSnapshot.val()
          promiseList.push(getUserProfileByEmail(childData.email))
        })
        try {
          const contactsList = (await Promise.all(promiseList)) as unknown as UserInfo[]
          const friendInfoList = contactsList.map(
            ({ email, avatarUrl, nickName, signature, gender }) =>
              ({
                email,
                avatarUrl,
                name: nickName,
                signature,
                gender
              } as FriendInfo)
          )
          startTransition(() => {
            setContactList(friendInfoList)
          })
        } catch (e: any) {
          setError(e.message || 'get contact list error')
        }
        setLoading(false)
      }
      task()
    },
    [setError]
  )

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onContractListChange(currentUser.uid, handleContractEmailList)
    return unsubscribe
  }, [currentUser.uid, handleContractEmailList])

  return (
    <div data-testid="contact-container" className="contacts-page">
      <div className="contacts-list">
        <div className="search-contact-container">
          <Input
            placeholder="Add new contacts"
            prefix={<UserOutlined className="site-form-item-icon" />}
            suffix={
              <Tooltip title="TBD">
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
          <Button type="primary" className="search-button">
            Search
          </Button>
        </div>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <div className="contacts-container">
            {contactList.map((friendInfo) => {
              return (
                <ContactTab
                  clickContactTab={(v: FriendInfo) => setSelectedFriendInfo(v)}
                  selectedFriendInfo={selectedFriendInfo}
                  friendInfo={friendInfo}
                  key={friendInfo.email}
                />
              )
            })}
          </div>
        )}
      </div>
      <div className="contacts-detail">
        {JSON.stringify(selectedFriendInfo) !== '{}' && (
          <ContactPersonalInfo
            data-testid="contact-info-card"
            selectedFriendInfo={selectedFriendInfo}
            resetSelectedInfo={(v: any) => setSelectedFriendInfo(v)}
          />
        )}
      </div>
    </div>
  )
}
export default Contacts
