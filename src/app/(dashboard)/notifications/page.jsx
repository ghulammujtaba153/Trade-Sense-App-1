'use client'

import { Paper, Box, Grid } from '@mui/material'
import React from 'react'
import CreateNotification from '@/components/notifications/CreateNotification'
import NotificationHistory from '@/components/notifications/NotificationHistory'

const Page = () => {
  return (
    <Paper sx={{ p: 2 }}>

      <Grid container spacing={2}>
        {/* Right Column: Create Notification */}
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '100%', pl: { md: 2 } }}>
            <CreateNotification />
          </Box>
        </Grid>

        
        {/* Left Column: Notification History */}
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%', pr: { md: 2 } }}>
            <NotificationHistory />
          </Box>
        </Grid>

        
      </Grid>
    </Paper>
  )
}

export default Page
