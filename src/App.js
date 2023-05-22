import './App.css'
import {BrowserRouter} from 'react-router-dom'
import Navbar from './Components/Navbar'
import AppRouter from './Components/AppRouter'
import {createContext, useContext, useMemo, useState} from 'react'
import {Context} from './index'
import {useAuthState} from 'react-firebase-hooks/auth'
import Loader from './Components/Loader'
import SideBar from './Components/SideBar'
import Profile from './Components/Profile'
import {Grid} from '@mui/material'

export const ChatIDContext = createContext({
  id: '',
  uid: '',
  chatID: '',
  setChatInfo: () => {
  }
})

function App() {
  const {auth} = useContext(Context)
  const [user, loading, error] = useAuthState(auth)
  const [chatInfo, setChatInfo] = useState({
    id: ' ',
    uid: ' ',
    chatID: ' '
  })

  const valueID = useMemo(
    () => ({chatInfo, setChatInfo}), [chatInfo]
  )

  if (loading) {
    return <Loader/>
  }

  return (
    <ChatIDContext.Provider value={valueID}>
      <BrowserRouter>
        <Navbar/>
        {
          user ?
            <Grid container spacing={2} className='app-container'>
              <Grid item xs={0} sm={2} md={3}>
                <SideBar/>
              </Grid>
              <Grid item xs={12} sm={8} md={6}>
                <AppRouter/>
              </Grid>
              <Grid item xs={0} sm={2} md={3}>
                <Profile/>
              </Grid>
            </Grid>
            :
            <Grid className='app-container'>
              <AppRouter/>
            </Grid>
        }
        <div className='version'>v0.3.3</div>
      </BrowserRouter>
    </ChatIDContext.Provider>
  )
}

export default App
