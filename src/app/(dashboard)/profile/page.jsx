'use client'

import React from 'react'
import {
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  InputLabel
} from '@mui/material'

const ProfilePage = () => {
  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 6,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3}>
        Profile
      </Typography>

      <Stack spacing={3}>
        <TextField label="Name" variant="outlined" fullWidth />
        <TextField label="Email" type="email" variant="outlined" fullWidth />
        <TextField label="Password" type="password" variant="outlined" fullWidth />


        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </Stack>
    </Box>
  )
}

export default ProfilePage
