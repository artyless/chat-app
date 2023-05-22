import React, {useContext, useMemo, useState} from 'react'
import {Context} from '../index'
import {ChatIDContext} from '../App'
import {useAuthState} from 'react-firebase-hooks/auth'
import {Avatar, Button, Grid, TextField} from '@mui/material'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query,
  setDoc
} from 'firebase/firestore'
import Loader from './Loader'

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

const Chat = () => {
  const {auth, firestore} = useContext(Context)
  const {chatInfo} = useContext(ChatIDContext)
  const [user] = useAuthState(auth)
  const [value, setValue] = useState('')

  //const [messages, loading] = useCollectionData(query(collection(firestore, 'messages'), orderBy('createdAt')))
  //const [users] = useCollectionData(query(collection(firestore, 'users')))

  const [messages, setMessages] = useState('')

  // useMemo(() => onSnapshot(query(collection(firestore, 'commonMessages'), orderBy('createdAt')), data => {
  //   setMessages(data)
  //   let l = document.getElementsByClassName('scroll-down').length
  //   document.getElementsByClassName('scroll-down')[l - 1].scrollIntoView()
  // }), [firestore])

  useMemo(() => onSnapshot(query(collection(firestore, 'users', user.uid, 'chats', chatInfo.id, 'messages'), orderBy('createdAt')), data => {
    setMessages(data)

    let l = document.getElementsByClassName('scroll-down').length
    try {
      document.getElementsByClassName('scroll-down')[l - 1].scrollIntoView()
    } catch (e) {
      console.log('Error: scroll-down undefined')
    }
  }), [firestore, user.uid, chatInfo.id])

  const sendMessage = async (e) => {
    if (value && (e.button === 0 || e.key === 'Enter')) {
      try {
        // TODO batch
        await addDoc(collection(firestore, 'users', user.uid, 'chats', chatInfo.id, 'messages'), {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          text: value,
          createdAt: serverTimestamp()
        })
        await addDoc(collection(firestore, 'users', chatInfo.uid, 'chats', chatInfo.chatID, 'messages'), {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          text: value,
          createdAt: serverTimestamp()
        })

        await setDoc(doc(firestore, 'users', user.uid, 'chats', chatInfo.id), {
          lastMessage: value
        }, {merge: true})
        await setDoc(doc(firestore, 'users', chatInfo.uid, 'chats', chatInfo.chatID), {
          lastMessage: value
        }, {merge: true})
      } catch (e) {
        console.error("Error adding document: ", e)
      }
      let l = document.getElementsByClassName('scroll-down').length
      document.getElementsByClassName('scroll-down')[l - 1].scrollIntoView()
      //document.getElementById('scroll-down').scroll(0, 1000)
      setValue('')
    }
  }

  const deleteMessage = async (message) => {
    try {
      // await deleteDoc(doc(firestore, 'commonMessages', message.id))
      await deleteDoc(doc(firestore, 'users', user.uid, 'chats', chatInfo.id, 'messages', message.id))
      // await deleteDoc(doc(firestore, 'users', chatInfo.uid, 'chats', chatInfo.chatID, 'messages', message.id))
    } catch (e) {
      console.error("Error deleting document: ", e)
    }
  }

  // if (loading) {
  //   return <Loader/>
  // }

  if (!messages) {
    return <Loader/>
  }

  function tsToDate(ts) {
    return ts ? ts.toDate().toString().split('GMT')[0] : 'now'
  }

  return (
    <Grid container
          style={{height: window.innerHeight - 120}}
          justifyContent='center'
    >
      <div style={{
        width: '80%',
        height: '70vh',
        overflowY: 'auto',
        border: '1px solid rgba(1, 1, 1, .2)',
        borderRadius: 10
      }}>
        {messages && messages.docs.map((doc, index) =>
          <div className='scroll-down' key={index} style={{
            margin: 10,
            padding: 5,
            marginLeft: user.uid === doc.data().uid ? 'auto' : 10,
            width: 'fit-content'
          }}>
            <Grid container>
              <Avatar src={doc.data().photoURL}/>
              <div style={{position: 'relative', top: 10, marginLeft: 5}}>{doc.data().displayName}</div>
            </Grid>
            <div style={{marginTop: 5}}>{doc.data().text}</div>
            <div style={{opacity: 0.5, fontSize: 12}}>{tsToDate(doc.data().createdAt)}</div>
            {
              user.uid === doc.data().uid && doc.data().createdAt - 63785572000 > 0 ? // TODO exactly 24H
                <IconButton size='small' color='error' aria-label='delete' onClick={() => deleteMessage(doc)}>
                  <DeleteIcon fontSize='small'/>
                </IconButton>
                :
                null
            }
          </div>
        )}
      </div>
      <Grid
        container
        direction='column'
        alignItems='flex-end'
        style={{width: '80%'}}
      >
        <TextField
          fullWidth
          maxRows={2}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyPress={e => sendMessage(e)}

        />
        <Button onClick={sendMessage} endIcon={<SendIcon/>}>Send</Button>
      </Grid>
    </Grid>
  )
}

export default Chat
