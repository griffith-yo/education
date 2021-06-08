import { createContext } from 'react'

function noop() {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  username: null,
  privileges: '1',
  login: noop,
  logout: noop,
  isAuthenticated: false,
})
