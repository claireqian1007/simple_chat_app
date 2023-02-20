import React, { useState } from 'react'
import { Button, Input } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import { addUserByEmail, validateIfContactExistedByEmail } from '../../services/Users'
import { useNavigate } from 'react-router-dom'
import { DataSnapshot } from 'firebase/database'
import './index.scss'
const AddContact: React.FC = () => {
  const [addLoading, setAddLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const { currentUserInfo, setError } = useAuth()
  const navigate = useNavigate()

  const handleExistedContactValidationResult = async (matchedData: DataSnapshot) => {
    if (matchedData.val()) {
      setError('The user has existed in your contacts')
    } else {
      try {
        await addUserByEmail(email, currentUserInfo)
        navigate('/contacts')
      } catch (e: any) {
        setError(e.message || 'Add contact fail')
      }
    }
    setAddLoading(false)
  }
  const onClickAdd = async () => {
    setAddLoading(true)
    try {
      setError('')
      await validateIfContactExistedByEmail(email, currentUserInfo, handleExistedContactValidationResult)
    } catch (e: any) {
      setError(e.message || 'Add contact fail')
    }
  }
  return (
    <div className="add-contact-container">
      <Input.Group compact>
        <Input
          className="add-contact-input"
          placeholder={'Input email to add a new contact'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="primary" loading={addLoading} onClick={() => onClickAdd()}>
          Add
        </Button>
      </Input.Group>
    </div>
  )
}

export default AddContact
