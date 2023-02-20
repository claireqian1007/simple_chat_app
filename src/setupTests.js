// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
const mockAuthInfo = {
  uid: 'test-uid',
  email: 'test@email.com'
}

jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn()
  }
})
jest.mock('firebase/auth', () => {
  return {
    getAuth: () => ({
      onAuthStateChanged: (callback) => {
        callback(mockAuthInfo)
      }
    })
  }
})

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn()
    }
  }
