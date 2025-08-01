'use client'

import { Paper, Box, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'
import CreateNotification from '@/components/notifications/CreateNotification'
import NotificationHistory from '@/components/notifications/NotificationHistory'

const Page = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/history`)
      setNotifications(response.data.notifications)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      toast.error('Failed to load notification history')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationCreated = () => {
    // Refresh notifications when a new one is created
    fetchNotifications()
  }

  const handleNotificationDeleted = () => {
    // Refresh notifications when one is deleted
    fetchNotifications()
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <Paper sx={{ p: 2 }}>

      <Typography variant='h5' gutterBottom >Manage Notifications</Typography>

      <Grid container spacing={2}>
        {/* Right Column: Create Notification */}
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '100%', pl: { md: 2 } }}>
            <CreateNotification onNotificationCreated={handleNotificationCreated} />
          </Box>
        </Grid>

        
        {/* Left Column: Notification History */}
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%', pr: { md: 2 } }}>
            <NotificationHistory 
              notifications={notifications}
              loading={loading}
              onNotificationDeleted={handleNotificationDeleted}
            />
          </Box>
        </Grid>

        
      </Grid>
    </Paper>
  )
}

export default Page
