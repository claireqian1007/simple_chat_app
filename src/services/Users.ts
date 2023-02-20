/* eslint-disable camelcase */
import { child, equalTo, get, getDatabase, onValue, orderByChild, query, ref, set } from 'firebase/database'
import { UserInfo } from '../types/User'
import { getUserProfileByEmailBFF, addUserByEmailBFF, removeUserByEmailBFF } from './BffMockService'
const db = getDatabase()
const dbRef = ref(db)
/*
/users
*/
export async function updateUserProfile(user: UserInfo) {
  const { userId } = user
  console.log(userId, user)
  set(ref(db, `users/${userId}`), { ...user })
}

export async function getUserProfileById(userId: string) {
  return get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      throw Error('No user found')
    }
  })
}

export function getUserProfileByEmail(email: string) {
  // does not have Uid
  return getUserProfileByEmailBFF(email)
}

export async function addUserByEmail(email: string, currentUserInfo: UserInfo) {
  // does not have Uid
  await addUserByEmailBFF(email, currentUserInfo)
}

export async function removeUserByEmail(email: string, currentUserInfo: UserInfo) {
  // does not have Uid
  await removeUserByEmailBFF(email, currentUserInfo)
}

export async function validateIfContactExistedByEmail(email_2: string, user_1: UserInfo, callback: Function) {
  const { userId } = user_1
  const chatContainEmail = query(ref(db, `contacts/${userId}`), orderByChild('email'), equalTo(email_2))
  onValue(
    chatContainEmail,
    async (snapshot) => {
      await callback(snapshot)
    },
    {
      onlyOnce: true
    }
  )
}
