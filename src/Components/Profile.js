import React, {useContext, useState} from 'react'
import {Avatar, Button, Grid, Input, TextField, IconButton} from '@mui/material'
import '../assets/styles/profile.css'
import {PhotoCamera} from '@mui/icons-material'
import {Context} from '../index'
import {useAuthState} from 'react-firebase-hooks/auth'
import {updateProfile} from 'firebase/auth'
import {doc, setDoc} from 'firebase/firestore'

const Profile = () => {
  const {auth, firestore} = useContext(Context)
  const [user] = useAuthState(auth)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')

  const changeNameHandler = value => {
    setName(value)
  }

  const changeUsernameHandler = value => {
    setUsername(value)
  }

  const changeDisplayName = () => {
    updateProfile(user, {
      displayName: name
    }).then(() => {
      setDoc(doc(firestore, 'users', user.uid), {
        displayName: name,
      }, {merge: true}).then()
    })
  }

  const changeUsername = () => {
    // updateProfile(user, {
    //
    // }).then(() => {
    //   setDoc(doc(firestore, 'users', user.uid), {
    //     username: username,
    //   }, {merge: true}).then()
    // })
  }
  console.log(user)

  return (
    <Grid container
          className='profile-container'
          justifyContent='center'
          sx={{border: {xs: '1px solid rgba(1, 1, 1, 0)', md: '1px solid rgba(1, 1, 1, .2)'}}}
    >
      <label htmlFor='icon-button-file' style={{display: 'flex'}}>
        <Avatar className='profile-avatar-upload' src={user.photoURL}/>
        <Input accept='image/*' id='icon-button-file' type='file' style={{display: 'none'}}/>
      </label>
      <Grid justifyContent='center'>
        <TextField id="standard-basic" label="Name" variant="standard" defaultValue={user.displayName} onChange={e => changeNameHandler(e.target.value)}/>
        <Button onClick={changeDisplayName}>change</Button>
        <TextField id="standard-basic" label="Username" variant="standard" onChange={e => changeUsernameHandler(e.target.value)}/>
        <Button onClick={changeUsername}>change</Button>
      </Grid>
    </Grid>
  )
}

export default Profile
