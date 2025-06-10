import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Drawer,
  Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'

const InstructorDrawer = ({ open, user, onClose, onSave }) => {
  const isEditMode = !!user

  const [data, setData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'editor'
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      setData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        password: '',          // password left empty initially
        role: user.role || 'editor'
      })
      setError('')
    } else {
      setData({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: 'editor'
      })
      setError('')
    }
  }, [user, isEditMode, open])

  const handleChange = e => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Validation: name, email, phone required always.
    // Password required only if adding new user
    if (!data.name || !data.email || !data.phone || (!isEditMode && !data.password)) {
      setError('Please fill all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isEditMode) {
        // Prepare payload: omit password if empty (means no change)
        const payload = {
          name: data.name,
          phone: data.phone,
          email: data.email,
          role: data.role
        }
        if (data.password.trim() !== '') {
          payload.password = data.password
        }

        await axios.put(`${API_URL}/api/auth/users/update/${user._id}`, payload)
        toast.success('User updated successfully')
      } else {
        // Add new user with all fields including password
        await axios.post(`${API_URL}/api/auth/register`, data)
        toast.success('User added successfully')
      }
      onSave()
      onClose(false)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Error saving user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={() => onClose(false)} sx={{
      '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }
    }}>
      <Box
        sx={{ width: 400, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
        role="presentation"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">{isEditMode ? 'Edit Instructor' : 'Add Instructor'}</Typography>
          <IconButton onClick={() => onClose(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            label="Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            type="email"
            required
          />

          <TextField
            label="Password"
            name="password"
            value={data.password}
            onChange={handleChange}
            type="password"
            required={!isEditMode} // required only when adding
            helperText={isEditMode ? "Leave empty if you don't want to change password" : ''}
          />

          <Box mt="auto" display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => onClose(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Add'}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default InstructorDrawer
