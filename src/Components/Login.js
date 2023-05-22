import React, {useContext, useState} from 'react'
import {Box, Button, Container, Grid, TextField} from '@mui/material'
import {Context} from '../index'
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import {doc, setDoc, collection, serverTimestamp} from 'firebase/firestore'
import '../assets/styles/login.css'

const BEASTS = ['Coyote', 'Duck', 'Kraken', 'Fox', 'Hyena', 'Rhino', 'Pumpkin', 'Nyan Cat', 'Panda', 'Koala', 'Undefined']

const Login = () => {
  const {auth, firestore} = useContext(Context)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const changeHandler = event => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const register = () => {
    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user

        if (!user.displayName) {
          updateProfile(user, {
            displayName: BEASTS[(Math.random() * 10).toFixed()]
          }).then(() => {
            setDoc(doc(firestore, 'users', user.uid), {
              uid: user.uid,
              displayName: user.displayName,
              createdAt: serverTimestamp()
            }).then()
          }).catch((error) => {
            // An error occurred
            // ...
          })
        }

      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
      })
  }

  const loginWithEmail = () => {
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user

      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
      })
  }

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        // The signed-in user info.
        const user = result.user

        if (!user.displayName) {
          setDoc(doc(firestore, 'users', user.uid), {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp()
          }).then()
        }
      }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code
      const errorMessage = error.message
      // The email of the user's account used.
      const email = error.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
    })
  }

  return (
    <Container>
      <Grid container
            className='login-container'
            alignItems='center'
            justifyContent='center'
      >
        <Grid container
              alignItems='center'
              direction='column'
        >
          <Box pt={4} position='center'>
            <div>
              <TextField
                name='email'
                label='Email'
                variant='standard'
                type='email'
                value={form.email}
                onChange={changeHandler}
              />
            </div>
            <div>
              <TextField
                name='password'
                label='Password'
                variant='standard'
                type='password'
                value={form.password}
                onChange={changeHandler}
              />
            </div>
          </Box>
          <Box pt={2}>
            <Button onClick={loginWithEmail} color='success'>Login</Button>
            <Button onClick={register} color='error'>Register</Button>
          </Box>
          <div className='login-opacity'>or</div>
          <Box pb={5}>
            <Button onClick={loginWithGoogle}>Login with Google</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login
