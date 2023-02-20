/* eslint-disable camelcase */
import {
  child,
  endAt,
  equalTo,
  getDatabase,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  startAt,
  update
} from 'firebase/database'
import { MessageInfo } from '../types/Chat'
import { UserInfo } from '../types/User'
import { addChatByEmailBFF, removeChatByEmailBFF } from './BffMockService'
import { getUserProfileByEmail } from './Users'
const db = getDatabase()

export async function createNewChat(user_1: UserInfo, email_2: string) {
  return addChatByEmailBFF(user_1, email_2)
}

export async function validateIfChatExistedByEmail(user_1: UserInfo, email_2: string, callback: Function) {
  const { userId } = user_1
  const chatContainEmailQuery = query(ref(db, `chat-list/${userId}`), orderByChild('receiver'), equalTo(email_2))
  onValue(
    chatContainEmailQuery,
    (snapshot) => {
      callback(snapshot)
    },
    {
      onlyOnce: true
    }
  )
}

export async function updateLastMsgInChat(lastMsg: string, chatId: string, userId_1: string, email_2: string) {
  const personalChatListRef = ref(db, `chat-list/${userId_1}`)
  const myChatQuery = query(personalChatListRef, orderByChild('chatId'), equalTo(chatId))
  onValue(
    myChatQuery,
    (snapshot) => {
      snapshot.forEach((item) => {
        if (item.key) {
          update(child(personalChatListRef, item.key), {
            lastMessage: lastMsg,
            timestamp: new Date().valueOf()
          })
        }
      })
    },
    {
      onlyOnce: true
    }
  )
  const receiverInfo = await getUserProfileByEmail(email_2)
  const receiverChatListRef = ref(db, `chat-list/${receiverInfo.userId}`)
  const receiverChatQuery = query(receiverChatListRef, orderByChild('chatId'), equalTo(chatId))
  onValue(
    receiverChatQuery,
    (snapshot) => {
      snapshot.forEach((item) => {
        if (item.key) {
          update(child(receiverChatListRef, item.key), {
            lastMessage: lastMsg,
            timestamp: new Date().valueOf()
          })
        }
      })
    },
    {
      onlyOnce: true
    }
  )
}

export async function sendMessageByChatId(chatId: string, messageObj: MessageInfo, userId_1: string, email_2: string) {
  const messageListRef = ref(db, `messages/${chatId}`)
  const newMessageRef = push(messageListRef)
  const fullMessageObj = {
    ...messageObj,
    timestamp: new Date().valueOf()
  }
  set(newMessageRef, fullMessageObj)
  await updateLastMsgInChat(fullMessageObj.message, chatId, userId_1, email_2)
}

export async function getMessageWithinTimeRange(
  chatId: string,
  timestamp1: string,
  timestamp2: string,
  callback: Function
) {
  const messageRef = query(
    ref(db, 'messages/' + chatId),
    orderByChild('timestamp'),
    startAt(timestamp1),
    endAt(timestamp2)
  ) // default to take latest 50 messages
  onValue(
    messageRef,
    (snapshot) => {
      callback(snapshot)
    },
    {
      onlyOnce: true
    }
  )
}

export async function removeMessagesByChatId(chatId: string) {
  remove(ref(db, 'messages/' + chatId))
}

export async function removeChatByEmail(email: string, currentUserInfo: UserInfo) {
  // does not have Uid
  await removeChatByEmailBFF(currentUserInfo, email)
}
