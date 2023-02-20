import { getDatabase, limitToLast, onChildAdded, onValue, orderByChild, query, ref, startAt } from 'firebase/database'

const db = getDatabase()

export function onUserProfileUpdate(userId: string, callback: Function) {
  const myProfileRef = ref(db, 'users/' + userId)
  onValue(myProfileRef, (snapshot) => {
    callback(snapshot.val())
  })
}

export function onContractListChange(userId: string, callback: Function) {
  const contactsRef = query(ref(db, 'contacts/' + userId), orderByChild('email'))
  return onValue(contactsRef, (snapshot) => {
    callback(snapshot)
  })
}

export function onChatListChange(userId: string, callback: Function) {
  const chatsRef = query(ref(db, 'chat-list/' + userId), orderByChild('timestamp'))
  return onValue(chatsRef, (snapshot) => {
    callback(snapshot)
  })
}

export function onGetChatMessageList(chatId: string, callback: Function) {
  const messageQuery = query(ref(db, 'messages/' + chatId), limitToLast(50)) // default to take latest 50 messages
  return onValue(
    messageQuery,
    (snapshot) => {
      callback(snapshot)
    },
    {
      onlyOnce: true
    }
  )
}

export function onChatMessageChange(chatId: string, callback: Function) {
  // on new message is added to chat
  const messageRef = query(ref(db, 'messages/' + chatId), orderByChild('timestamp'), startAt(Date.now().valueOf()))
  return onChildAdded(messageRef, (data) => {
    callback(data)
  })
}
