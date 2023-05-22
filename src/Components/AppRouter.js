import React, {useContext} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import {CHAT_ROUTE, LOGIN_ROUTE} from '../utils/consts'
import {privateRoutes, publicRoutes} from '../routes'
import {Context} from '../index'
import {useAuthState} from 'react-firebase-hooks/auth'

const AppRouter = () => {
  const {auth} = useContext(Context)
  const [user] = useAuthState(auth)

  return user ?
    (
      <Routes>
        {privateRoutes.map(({path, Component}) => // Деструктуризация // А если несколько элементов в массиве?
          <Route key={path} path={path} element={Component}/>
        )}
        <Route
          path='*'
          element={<Navigate to={CHAT_ROUTE}/>}
        />
      </Routes>
    )
    :
    (
      <Routes>
        {publicRoutes.map(({path, Component}) =>
          <Route key={path} path={path} element={Component}/>
        )}
        <Route
          path='*'
          element={<Navigate to={LOGIN_ROUTE}/>}
        />
      </Routes>
    )
}

export default AppRouter
