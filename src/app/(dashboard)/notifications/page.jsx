"use client"

import { Paper, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import CreateNotification from '@/components/notifications/CreateNotification'
import NotificationHistory from '@/components/notifications/NotificationHistory'

const page = () => {
    const [tabIndex, setTabIndex] = useState(0)
    
      const handleChange = (event, newValue) => {
        setTabIndex(newValue)
      }
    

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={tabIndex} onChange={handleChange} aria-label="Content Tabs">
        <Tab label="Create Notification" />
        <Tab label="Notification History" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <CreateNotification/>}
        {tabIndex === 1 && <NotificationHistory/>}
        
      </Box>
    </Paper>
  )
}

export default page
