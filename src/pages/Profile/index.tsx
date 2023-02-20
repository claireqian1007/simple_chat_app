import { Button, Form, Input, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { getUsers } from '../../services/BffMockService'
import { updateUserProfile } from '../../services/Users'
import { generateAvatar } from '../../utils/generateAvatars'
import './index.scss'

const { Option } = Select

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
}

getUsers()

type FormData = {
  nickName: string
  avatar: string
  signature?: string
  gender: string
}
const Profile: React.FC = () => {
  const [form] = Form.useForm()
  const [avatars, setAvatars] = useState<string[]>([])
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number>(-1)
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const { currentUser, setError, currentUserInfo, profileUpdated } = useAuth()
  const navigate = useNavigate()
  const { TextArea } = Input

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true)
    }, 3000) // make sure could load user profile info as form default value if existed
  }, [])

  useEffect(() => {
    console.log(currentUserInfo, profileUpdated)
    const fetchData = () => {
      const res = generateAvatar()
      if (currentUserInfo?.avatarUrl) {
        const avatarListWithOrigin = res.slice()
        avatarListWithOrigin.splice(0, 1, currentUserInfo.avatarUrl)
        setAvatars(avatarListWithOrigin)
      } else {
        setAvatars(res)
      }
    }
    fetchData()
  }, [currentUserInfo])

  const handleFormSubmit = async (values: FormData) => {
    const { uid, email } = currentUser
    const { nickName, avatar, signature, gender } = values
    try {
      setError('')
      setLoading(true)
      await updateUserProfile({
        userId: uid,
        nickName,
        email: email || '',
        avatarUrl: avatar,
        signature,
        gender
      })
      navigate('/chat')
    } catch (e) {
      setError('Failed to update profile')
    }
    setLoading(false)
  }
  // TBD: 没有任何改动时候不许submit
  return (
    <>
      <div className="form-container">
        {!showForm ? (
          <Spin size="large" />
        ) : (
          <Form
            {...layout}
            form={form}
            name="profile-form"
            onFinish={handleFormSubmit}
            style={{ maxWidth: 600 }}
            initialValues={{
              ...currentUserInfo
            }}
          >
            <Form.Item name="avatar" label="Pick an avatar" rules={[{ required: true }]}>
              <div className="avatars-container">
                {avatars.map((avatar, index) => (
                  <div key={index} className="avatar-image-container">
                    <img
                      alt="gallery"
                      className={`
                      avatar-style
                      ${index === selectedAvatarIndex && 'selected-avatar-style'}
                    `}
                      src={avatar}
                      onClick={() => {
                        setSelectedAvatarIndex(index)
                        form.setFieldValue('avatar', avatars[index])
                      }}
                    />
                  </div>
                ))}
              </div>
            </Form.Item>
            <Form.Item name="nickName" label="NickName" rules={[{ required: true }]}>
              <Input className="input-field" onChange={(e) => form.setFieldValue('nickName', e.currentTarget.value)} />
            </Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select
                className="input-field"
                placeholder="Select your gender"
                onSelect={(value) => form.setFieldValue('gender', value)}
                dropdownStyle={{ background: '#daf2df' }}
              >
                <Option value="male">male</Option>
                <Option value="female">female</Option>
                <Option value="other">other</Option>
              </Select>
            </Form.Item>
            <Form.Item name="signature" label="Signature" rules={[{ required: false }]}>
              <TextArea
                className="input-field"
                rows={4}
                onChange={(e) => form.setFieldValue('signature', e.currentTarget.value)}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button className="submit-btn" type="primary" htmlType="submit" disabled={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </>
  )
}

export default Profile
