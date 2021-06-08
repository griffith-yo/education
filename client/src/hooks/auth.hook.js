import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [privileges, setPrivileges] = useState(null)

  const login = useCallback((jwtToken, id, username, privileges) => {
    setToken(jwtToken)
    setUserId(id)
    setUsername(username)
    setPrivileges(privileges)

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
        username,
        privileges,
      })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setUsername(null)
    setPrivileges(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId, data.username, data.privileges)
    }
    setReady(true)
  }, [login])

  return { login, logout, token, userId, ready, username, privileges }
}
