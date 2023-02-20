# Simpifiled wechat app
It's an wechat-liked app, which enable user to communicate with each other easily. 

## Technologies
React, Ant-Design, SCSS, Firebase/Auth, Firebase/Realtime-Database, Typescript, Jest

## Main Functions
- [x] Login
- [x] Signup
- [x] Logout
- [x] Edit Personal Profile
- [x] Add Contacts
- [x] Delete Contacts
- [x] Check Contact's Personal Information
- [x] Create Chat With Contact (1 v 1)
- [x] Chat History List with Real-Time Update
- [x] Setting - Theme Trigger
- [ ] Setting - multi language
- [ ] Search Chat History
- [ ] Testing (in progreses)

## Work-around 
1. All users tokens are now stored as a .json file in local, mock the role of BE service, to get and change personanl data
2. ```BffMockService.ts``` file mock the action of BE service. The data operation inside it all need users' uid (treated as token). Seperate it for possible go on action in future
3. Communication between web and database currently are not set to be private, with the aim of making it convinient for local development. Can be changed to locked mode in the future once BFF ready.