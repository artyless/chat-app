import React, {createContext, useMemo} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import {getFirestore} from 'firebase/firestore'
import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'

// Initialize Firebase
const app = initializeApp(
  {
    apiKey: "AIzaSyCIdkT9NZ-m5j50tErg7XCMMp2aoMIW-q8",
    authDomain: "chat-react-app-d58b1.firebaseapp.com",
    projectId: "chat-react-app-d58b1",
    storageBucket: "chat-react-app-d58b1.appspot.com",
    messagingSenderId: "1058449408625",
    appId: "1:1058449408625:web:1802d77ac6ca6a929e11d0",
    measurementId: "G-K9ETG55NM7"
  }
)

export const Context = createContext(null)

const auth = getAuth(app)
const firestore = getFirestore(app)

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Context.Provider value={{
      auth,
      firestore
    }}>
      <App/>
    </Context.Provider>
  </React.StrictMode>
)
