// import {NavLink} from 'react-router-dom'
import React, {useContext, useMemo, useState} from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import {Context} from '../index'
import {styled, alpha} from '@mui/material/styles'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  MenuItem,
  Menu,
  Button,
  Grid,
  Avatar,
  Autocomplete,
  TextField,
  Stack
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import {collection, doc, onSnapshot, orderBy, query, serverTimestamp, addDoc, getDoc, setDoc} from 'firebase/firestore'

const Search = styled('div')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

const Navbar = () => {
  const {auth, firestore} = useContext(Context)
  const [user] = useAuthState(auth)

  const [users, setUsers] = useState('')
  const [name, setName] = useState('')
  // const [invitations, setInvitations] = useState(0)

  useMemo(() => onSnapshot(collection(firestore, 'users'), data => {
    setUsers(data)
  }), [firestore])

  // useMemo(() => onSnapshot(collection(firestore, 'users', user.uid, 'invitations'), data => {
  //   setInvitations(data.docs.length)
  // }), [firestore, user.uid])

  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon/>
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon/>
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle/>
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  // const inviteFriend = () => {
  //   addDoc(collection(firestore, 'users', name, 'invitations'), {
  //     uid: user.uid,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //     createdAt: serverTimestamp()
  //   }).then()
  // }

  const inviteFriend = async () => {
    // TODO batch
    const chatIdUser = await addDoc(collection(firestore, 'users', name, 'chats'), {
      uid: user.uid,
      displayName: user.displayName
    })

    const chatIdOwn = await addDoc(collection(firestore, 'users', user.uid, 'chats'), {
      uid: name,
      displayName: 'testName', // TODO displayName
      chatID: chatIdUser.id
    }).then()

    await setDoc(doc(firestore, 'users', name, 'chats', chatIdUser.id), {
      chatID: chatIdOwn.id
    }, {merge: true}).then()
  }

  // <Button onClick={() => auth.signOut()}>Logout</Button>
  return (
    <Box sx={{flexGrow: 1}} style={{position: 'absolute', left: 0, right: 0, top: 0}}>
      <AppBar position="sticky">
        <Toolbar>
          {user ?
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{display: {xs: 'none', sm: 'block'}}}
              >
                Chat App
              </Typography>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon/>
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search user…"
                  inputProps={{'aria-label': 'search'}}
                  onChange={e => setName(e.target.value)}
                  disabled
                />
              </Search>
              {/*{*/}
              {/*  users &&*/}
              {/*  <Stack ml={3} spacing={2} sx={{ width: 250 }}>*/}
              {/*    <Autocomplete*/}
              {/*      freeSolo*/}
              {/*      options={users.docs.map((doc) => doc.data().displayName)}*/}
              {/*      renderInput={params => (*/}
              {/*        <TextField*/}
              {/*          {...params}*/}
              {/*          label='Users...'*/}
              {/*          onChange={e => setName(e.target.value)}*/}
              {/*        />*/}
              {/*      )}*/}
              {/*    />*/}
              {/*  </Stack>*/}
              {/*}*/}
              <Button
                color='info'
                variant='contained'
                onClick={inviteFriend}
                disabled
              >Invite</Button>
              {/*{*/}
              {/*  users && users.docs.map((doc, index) =>*/}
              {/*    <div key={index} style={{*/}
              {/*      margin: 10,*/}
              {/*      padding: 5,*/}
              {/*      marginLeft: user.uid === doc.data().uid ? 'auto' : 10,*/}
              {/*      width: 'fit-content'*/}
              {/*    }}>*/}
              {/*      <Grid container>*/}
              {/*        <Avatar src={doc.data().photoURL}/>*/}
              {/*        <div style={{position: 'relative', top: 10, marginLeft: 5}}>{doc.data().displayName}</div>*/}
              {/*      </Grid>*/}
              {/*    </div>*/}
              {/*  )*/}
              {/*}*/}

              <Box sx={{flexGrow: 1}}/>
              <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                {/*<IconButton size="large" aria-label="show 4 new mails" color="inherit">*/}
                {/*  <Badge badgeContent={4} color="error">*/}
                {/*    <MailIcon/>*/}
                {/*  </Badge>*/}
                {/*</IconButton>*/}
                {/*<IconButton*/}
                {/*  size="large"*/}
                {/*  color="inherit"*/}
                {/*>*/}
                {/*  <Badge badgeContent={invitations} color="error">*/}
                {/*    <NotificationsIcon/>*/}
                {/*  </Badge>*/}
                {/*</IconButton>*/}
              {/*  <IconButton*/}
              {/*    size="large"*/}
              {/*    edge="end"*/}
              {/*    aria-label="account of current user"*/}
              {/*    aria-controls={menuId}*/}
              {/*    aria-haspopup="true"*/}
              {/*    // onClick={handleProfileMenuOpen}*/}
              {/*    onClick={() => auth.signOut()}*/}
              {/*    color="inherit"*/}
              {/*  >*/}
              {/*    <AccountCircle/>*/}
              {/*  </IconButton>*/}
              {/*</Box>*/}
              {/*<Box sx={{display: {xs: 'flex', md: 'none'}}}>*/}
              {/*  <IconButton*/}
              {/*    size="large"*/}
              {/*    aria-label="show more"*/}
              {/*    aria-controls={mobileMenuId}*/}
              {/*    aria-haspopup="true"*/}
              {/*    onClick={handleMobileMenuOpen}*/}
              {/*    color="inherit"*/}
              {/*  >*/}
              {/*    <MoreIcon/>*/}
              {/*  </IconButton>*/}
              </Box>
              <Grid ml={3}>
                <Button onClick={() => auth.signOut()} variant='contained' color='error'>Logout</Button>
              </Grid>
            </>
            :
            <Box style={{margin: 'auto'}}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{display: {xs: 'none', sm: 'block'}}}
              >
                Chat App
              </Typography>
            </Box>
          }
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}

export default Navbar
