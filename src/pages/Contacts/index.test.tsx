import React from 'react'
import Contacts from './index'
import { act, fireEvent, render, screen } from '@testing-library/react'
import renderWithProviders from '../../utils/test-utils'

const mockContactsList = [
  {
    val: () => ({
      email: 'email-1'
    })
  },
  {
    val: () => ({
      email: 'email-2'
    })
  },
  {
    val: () => ({
      email: 'email-3'
    })
  }
]

const mockContactInfo = {
  nickName: 'test',
  gender: 'male',
  signature: 'string',
  avatarUrl: 'string'
}

const mockCurrentUserInfo = {
  email: 'test@email.com',
  nickName: 'test',
  gender: 'male',
  signature: 'string',
  avatarUrl: 'string'
}
jest.mock('../../services/EventObservers', () => {
  return {
    onContractListChange: (uid: string, callback: Function) => {
      callback(mockContactsList)
      return () => {}
    },
    onUserProfileUpdate: (uid: string, callback: Function) => {
      callback(mockCurrentUserInfo)
      return () => {}
    }
  }
})
jest.mock('../../services/Users', () => {
  return {
    getUserProfileByEmail: (email: string) => {
      return new Promise((resolve, reject) => {
        resolve({
          ...mockContactInfo,
          userId: 'id-' + email,
          email
        })
      })
    },
    removeUserByEmail: (email: string) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('')
        }, 100)
      })
    }
  }
})
jest.mock('../../services/Chats', () => {
  return {
    validateIfChatExistedByEmail: (email: string) => {
      return new Promise((resolve, reject) => {
        // setTimeout(() => {
        resolve({
          ...mockContactInfo,
          userId: 'id-' + email,
          email
        })
        // }, 100)
      })
    },
    createNewChat: jest.fn().mockImplementation(() => 'testChatId'),
    removeChatByEmail: jest.fn()
  }
})

describe('Contacts page', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  test('render contact list correctly ', async () => {
    await act(async () => {
      renderWithProviders(<Contacts />)
    })
    expect(screen.getByTestId('contact-container')).toBeInTheDocument()
    expect(screen.getByTestId(`contact-list-item-${mockContactsList[0].val().email}`)).toBeInTheDocument()
  })
  test('render first contact detail correctly when selecting first contact from list ', async () => {
    await act(async () => {
      renderWithProviders(<Contacts />)
    })
    fireEvent.click(screen.getByTestId(`contact-list-item-${mockContactsList[0].val().email}`))
    expect(screen.getByTestId('contact-info-email')).toHaveTextContent(mockContactsList[0].val().email)
  })
  test('show delete confirm modal correctly when click delete button', async () => {
    await act(async () => {
      renderWithProviders(<Contacts />)
    })
    fireEvent.click(screen.getByTestId(`contact-list-item-${mockContactsList[0].val().email}`))
    fireEvent.click(screen.getByTestId(`delete-contact-button`))
    expect(screen.getByTestId('delete-confirm-modal')).toBeInTheDocument()
  })
})
