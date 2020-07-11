import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { Drawer, Icon } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import ImageIcon from '@material-ui/icons/Image'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import { useSelector } from 'react-redux'

import { SidebarNav } from './components'

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
  },
  root: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(1, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
}))

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props
  const classes = useStyles()

  const pages = [
    {
      title: 'List',
      href: '/module/',
      roles: ['admin', 'developer'],
      icon: <Icon fontSize="small" className="fas fa-list-ul" />
    },
    {
      title: 'Create',
      href: '/module/create',
      roles: ['admin', 'developer'],
      icon: <AddCircleIcon />
    },
    {
      title: 'Experiments',
      href: '/module/experiment',
      roles: ['admin', 'developer', 'user'],
      icon: <Icon fontSize="small" className="fas fa-vial" />
    },
    // {
    //   title: 'Dashboard',
    //   href: '/dashboard',
    //   icon: <DashboardIcon />
    // },
    // {
    //   title: 'Users',
    //   href: '/users',
    //   icon: <PeopleIcon />
    // },
    // {
    //   title: 'Products',
    //   href: '/products',
    //   icon: <ShoppingBasketIcon />
    // },
    // {
    //   title: 'Authentication',
    //   href: '/sign-in',
    //   icon: <LockOpenIcon />
    // },
    // {
    //   title: 'Typography',
    //   href: '/typography',
    //   icon: <TextFieldsIcon />
    // },
    // {
    //   title: 'Icons',
    //   href: '/icons',
    //   icon: <ImageIcon />
    // },
    // {
    //   title: 'Account',
    //   href: '/account',
    //   icon: <AccountBoxIcon />
    // },
    // {
    //   title: 'Settings',
    //   href: '/settings',
    //   icon: <SettingsIcon />
    // }
  ]

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        {/* <Profile /> */}
        <RouterLink to="/">
          <img
            alt="Logo"
            // width="200"
            src="/images/logos/logo--white.svg"
          />
        </RouterLink>
        <div className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  )
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
}

export default Sidebar
