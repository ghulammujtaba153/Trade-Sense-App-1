// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Custom Component Imports
// import CustomChip from '@/components/CustomChip' // Adjust this path to your actual component

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/home' icon={<i className='tabler-smart-home' />}>
          Home
        </MenuItem>

        <SubMenu
          label="User"
          icon={<i className='tabler-users' />}
          // suffix={<CustomChip label='5' size='small' color='error' round='true' />}
        >
          <MenuItem href='/users/admins'>Admin</MenuItem>
          <MenuItem href='/users/instructors'>Instructor</MenuItem>
          <MenuItem href='/users'>User</MenuItem>
        </SubMenu>


        <SubMenu
          label="Courses & Instructor"
          icon={<i className='tabler-book' />}
          // suffix={<CustomChip label='5' size='small' color='error' round='true' />}
        >
          <MenuItem href='/courses'>Courses</MenuItem>
          <MenuItem href='/courses/instructor'>Instructor</MenuItem>
          
        </SubMenu>

        
        <MenuItem href='/plans' icon={<i className='tabler-currency-dollar' />}>
          Plans
        </MenuItem>

        <SubMenu
          label="Discovery Resources"
          icon={<i className='tabler-brain' />}
          // suffix={<CustomChip label='5' size='small' color='error' round='true' />}
        >
          <MenuItem href='/resources'>Resources</MenuItem>
          <MenuItem href='/resources/pillars'>Pillars</MenuItem>
          <MenuItem href='/resources/content'>Content Permissions</MenuItem>
          <MenuItem href='/resources/tags'>Tag Management</MenuItem>
          
        </SubMenu>
        {/* <MenuItem href='/resources' icon={<i className='tabler-brain' />}>
          Mindfulness Content
        </MenuItem> */}
        <MenuItem href='/onboarding' icon={<i className='tabler-clipboard-list' />}>
          Onboarding Questionnaire
        </MenuItem>
        <MenuItem href='/accountability' icon={<i className='tabler-checklist' />}>
          Trading Hub
        </MenuItem>
        <MenuItem href='/notifications' icon={<i className='tabler-bell' />}>
          Push Notification
        </MenuItem>
        <MenuItem href='/dynamic' icon={<i className='tabler-file-text' />}>
          Dynamic Pages
        </MenuItem>

        <MenuItem href='/issues' icon={<i className='tabler-currency-dollar' />}>
          Issues Report
        </MenuItem>

        
          <MenuItem href="/affiliate-requests" icon={<i className='tabler-currency-dollar' />}>
            Affiliate Requests
          </MenuItem>

        
        {/* <MenuItem href='/appConfig' icon={<i className='tabler-currency-dollar' />}>
          App Config
        </MenuItem> */}

      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
