export type ChatInfo = {
  chatId: string
  receiver: string
  lastMessage: string
  timestamp: string
}

export type MessageInfo = {
  id?: string
  key?: string
  email: string
  timestamp?: string
  message: string
}

export type FriendInfo = {
  avatarUrl: string
  name: string
  email: string
  signature?: string
  gender: string
}
