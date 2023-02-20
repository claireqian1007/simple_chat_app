/* eslint-disable camelcase */
import { User } from '@firebase/auth-types'
import short from 'short-uuid'
import { child, equalTo, getDatabase, onValue, orderByChild, push, query, ref, remove, set } from 'firebase/database'
import { UserInfo } from '../types/User'
import { getUserProfileById } from './Users'
import { removeMessagesByChatId } from './Chats'
const db = getDatabase()

export function getUsers() {
  return fetch('data/users.json')
}

export async function getUserProfileByEmailBFF(email: string) {
  const res = await getUsers()
  const userList = await res.json()
  const { users } = userList
  const matchedResult = users.find((item: User) => item.email === email)
  if (matchedResult) {
    return getUserProfileById(matchedResult.localId)
  } else {
    throw Error('No user found')
  }
}

export async function addUserByEmailBFF(email: string, currentUserInfo: UserInfo) {
  const matchedUser = (await getUserProfileByEmailBFF(email)) as unknown as UserInfo
  if (matchedUser) {
    const { userId } = matchedUser
    if (userId === currentUserInfo.userId) {
      throw Error('Please do not add yourself')
    }
    const postListRef = ref(db, `contacts/${userId}`)
    const postMyListRef = ref(db, `contacts/${currentUserInfo.userId}`)
    const newPostRef = push(postListRef)
    set(newPostRef, {
      email: currentUserInfo.email
    })
    const newMyPostRef = push(postMyListRef)
    set(newMyPostRef, {
      email: matchedUser.email
    })
  }
}

export async function removeUserByEmailBFF(email: string, currentUserInfo: UserInfo) {
  const matchedUser = (await getUserProfileByEmailBFF(email)) as unknown as UserInfo
  if (matchedUser) {
    const { userId } = matchedUser
    const friendChatListRef = ref(db, `contacts/${userId}`)
    const myChatListRef = ref(db, `contacts/${currentUserInfo.userId}`)
    const friendQuery = query(friendChatListRef, orderByChild('email'), equalTo(currentUserInfo.email))
    const myQuery = query(myChatListRef, orderByChild('email'), equalTo(email))
    onValue(
      friendQuery,
      (snapshot) => {
        snapshot.forEach((item) => {
          item.key && remove(child(friendChatListRef, item.key))
        })
      },
      {
        onlyOnce: true
      }
    )
    onValue(
      myQuery,
      (snapshot) => {
        snapshot.forEach((item) => {
          item.key && remove(child(myChatListRef, item.key))
        })
      },
      {
        onlyOnce: true
      }
    )
  }
}

export async function addChatByEmailBFF(
  user_1: UserInfo, // my userInfo
  email_2: string // receivers email
) {
  const matchedUser = (await getUserProfileByEmailBFF(email_2)) as unknown as UserInfo
  if (matchedUser) {
    const { userId, email } = matchedUser
    if (userId === user_1.userId) {
      throw Error('Please do not chat to yourself')
    }
    const postListRef = ref(db, `chat-list/${userId}`)
    const postMyListRef = ref(db, `chat-list/${user_1.userId}`)
    const newPostRef = push(postListRef)
    const chatId = short.generate()
    const chatInfo = {
      lastMessage: '',
      chatId,
      timestamp: new Date().valueOf()
    }
    // add chatroom to receiver's chat list
    await set(newPostRef, {
      receiver: user_1.email,
      ...chatInfo
    })
    // add chatroom to my chat list
    const newMyPostRef = push(postMyListRef)
    await set(newMyPostRef, {
      receiver: email,
      ...chatInfo
    })
    return chatId
  }
}

export async function removeChatByEmailBFF(
  user_1: UserInfo, // my userInfo
  email_2: string // receivers email
) {
  const matchedUser = (await getUserProfileByEmailBFF(email_2)) as unknown as UserInfo
  if (matchedUser) {
    const friendChatListRef = ref(db, `chat-list/${matchedUser.userId}`)
    const myChatListRef = ref(db, `chat-list/${user_1.userId}`)
    const friendQuery = query(friendChatListRef, orderByChild('receiver'), equalTo(user_1.email))
    const myQuery = query(myChatListRef, orderByChild('receiver'), equalTo(email_2))
    let chatId: string
    // remove chatroom to receiver's chat list
    onValue(
      friendQuery,
      (snapshot) => {
        snapshot.forEach((item) => {
          item.key && remove(child(friendChatListRef, item.key))
        })
      },
      {
        onlyOnce: true
      }
    )
    // remove chatroom to my chat list
    onValue(
      myQuery,
      async (snapshot) => {
        snapshot.forEach((item) => {
          if (item.key) {
            remove(child(myChatListRef, item.key))
            chatId = snapshot.val()[item.key].chatId
          }
        })
        await removeMessagesByChatId(chatId) // also delete messages under the chat
      },
      {
        onlyOnce: true
      }
    )
  }
}
