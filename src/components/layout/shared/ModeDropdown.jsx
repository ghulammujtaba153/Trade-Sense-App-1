'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

const ModeDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  // Refs
  const anchorRef = useRef(null)

  // Hooks
  const { settings, updateSettings } = useSettings()

  const handleClose = () => {
    setOpen(false)
    setTooltipOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleModeSwitch = mode => {
    handleClose()

    if (settings.mode !== mode) {
      updateSettings({ mode: mode })
    }
  }

  const getModeIcon = () => {
    if (settings.mode === 'system') {
      return 'tabler-device-laptop'
    } else if (settings.mode === 'dark') {
      return 'tabler-moon-stars'
    } else {
      return 'tabler-sun'
    }
  }

  return (
    <>
      <Tooltip
        title={settings.mode + ' Mode'}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen ? true : false}
        slotProps={{ 
          popper: { 
            className: 'capitalize',
            sx: {
              '& .MuiTooltip-tooltip': {
                backgroundColor: 'var(--mui-palette-background-paper)',
                color: 'var(--mui-palette-text-primary)',
                fontSize: '0.875rem',
                padding: '0.5rem 0.75rem'
              }
            }
          } 
        }}
      >
        <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
          <i className={getModeIcon()} />
        </IconButton>
      </Tooltip>

      
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  <MenuItem
                    className='gap-3'
                    onClick={() => handleModeSwitch('light')}
                    selected={settings.mode === 'light'}
                  >
                    <i className='tabler-sun' />
                    Light
                  </MenuItem>
                  <MenuItem
                    className='gap-3'
                    onClick={() => handleModeSwitch('dark')}
                    selected={settings.mode === 'dark'}
                  >
                    <i className='tabler-moon-stars' />
                    Dark
                  </MenuItem>
                  <MenuItem
                    className='gap-3'
                    onClick={() => handleModeSwitch('system')}
                    selected={settings.mode === 'system'}
                  >
                    <i className='tabler-device-laptop' />
                    System
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default ModeDropdown
