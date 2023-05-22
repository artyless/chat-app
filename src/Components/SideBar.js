import React, {useContext, useMemo, useState} from 'react'
import {Grid, Box, Stack, Avatar} from '@mui/material'
import {Context} from '../index'
import {ChatIDContext} from '../App'
import {collection, onSnapshot, orderBy, query} from 'firebase/firestore'
import {useAuthState} from 'react-firebase-hooks/auth'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from './Loader'
import '../assets/styles/sideBar.css'

const SideBar = () => {
  const {auth, firestore} = useContext(Context)
  const {setChatInfo} = useContext(ChatIDContext)
  const [user] = useAuthState(auth)
  const [chats, setChats] = useState('')

  useMemo(() => onSnapshot(query(collection(firestore, 'users', user.uid, 'chats')), data => {
    setChats(data)
  }), [firestore, user.uid])

  if (!chats) {
    return <Loader/>
  }

  return (
    <Grid
          className='sideBar-container'
          sx={{border: {xs: '1px solid rgba(1, 1, 1, 0)', md: '1px solid rgba(1, 1, 1, .2)'},
          padding: {xs: 0, md: '20px'}}}
    >
      <Stack spacing={3}>
        <Box className='sideBar-element' sx={{display: {xs: 'none', md: 'flex'}}}>Common Chat</Box>
        {chats && chats.docs.map((doc, index) =>
          <div key={index} className='sideBar-element'>
            <div>
              <Grid container onClick={() => setChatInfo({id: doc.id, uid: doc.data().uid, chatID: doc.data().chatID})}>
                <Avatar src={doc.data().photoURL}/>
                <Box className='sideBar-displayName' sx={{
                  fontSize: {xs: '10px', md: '16px'},
                  marginLeft: {xs: 0, md: '10px'}
                }}>{doc.data().displayName}</Box>
              </Grid>
              <Box className='sideBar-lastMessage'
                   sx={{display: {xs: 'none', md: 'flex'}}}>{doc.data().lastMessage}</Box>
              {/*<div style={{opacity: 0.5, fontSize: 12}}>{tsToDate(doc.data().createdAt)}</div>*/}
            </div>
          </div>
        )}
      </Stack>
    </Grid>
  )
}

export default SideBar
