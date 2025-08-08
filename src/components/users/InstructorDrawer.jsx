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
  LinearProgress,
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
    role: 'editor',
    profilePic: '',
    description: '',
    links: {
      facebook: '',
      linkedin: '',
      twitter: '',
      instagram: '',  
      website: '',
    },
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      setData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        password: '',
        role: user.role || 'editor',
        profilePic: user.profilePic || '',
        description: user.description || '',
        links: {
          facebook: user.links?.facebook || '',
          linkedin: user.links?.linkedin || '',
          twitter: user.links?.twitter || '',
          instagram: user.links?.instagram || '',
          website: user.links?.website || ""
        },
      })
    } else {
      setData({
        name: '',
        phone: '',
        email: '',
        password: '',
        role: 'editor',
        profilePic: '',
        description: '',
        links: {
          facebook: '',
          linkedin: '',
          twitter: '',
          instagram: '',
          website: ""
        },
      })
    }
    setError('')
  }, [user, isEditMode, open])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith('links.')) {
      const key = name.split('.')[1]
      setData((prev) => ({
        ...prev,
        links: {
          ...prev.links,
          [key]: value,
        },
      }))
    } else {
      setData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/api/file/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.s3Url) {
        setData((prev) => ({ ...prev, profilePic: response.data.s3Url }))
        toast.success('Profile picture uploaded successfully!')
      }
    } catch (err) {
      console.error('File upload error', err)
      toast.error('Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    

    setLoading(true)
    setError('')

    try {
      if (isEditMode) {
        const payload = {
          name: data.name,
          phone: data.phone,
          email: data.email,
          role: data.role,
          description: data.description,
          profilePic: data.profilePic,
          links: data.links,
        }
        if (data.password.trim() !== '') {
          payload.password = data.password
        }

        await axios.put(`${API_URL}/api/auth/users/update/${user._id}`, payload)
        toast.success('User updated successfully')
      } else {
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
    <Drawer
      anchor="right"
      open={open}
      onClose={() => onClose(false)}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box
        sx={{
          width: 400,
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="presentation"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">{isEditMode ? 'Edit Instructor' : 'Add Instructor'}</Typography>
          <IconButton onClick={() => onClose(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TextField label="Name" name="name" value={data.name} onChange={handleChange} required />
          <TextField label="Phone" name="phone" value={data.phone} onChange={handleChange}  />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            required={!isEditMode}
            helperText={isEditMode ? "Leave empty if you don't want to change password" : ''}
          />

          <TextField
            label="Description"
            name="description"
            value={data.description}
            onChange={handleChange}
            multiline
            rows={3}
          />

          <Button variant="outlined" component="label" disabled={uploading}>
            {uploading ? 'Uploading...' : (data.profilePic ? 'Change Profile Picture' : 'Upload Profile Picture')}
            <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
          </Button>

          {uploading && (
            <Box sx={{ width: '100%', mt: 1 }}>
              <LinearProgress />
              <Typography variant="caption" display="block" align="center" sx={{ mt: 0.5 }}>
                Uploading profile picture...
              </Typography>
            </Box>
          )}

          {data.profilePic && (
            <Box mt={1} display="flex" justifyContent="center">
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Profile Picture Preview:</strong>
                </Typography>
                <img
                  src={data.profilePic}
                  alt="Profile"
                  style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '2px solid #ddd'
                  }}
                />
              </Box>
            </Box>
          )}

          <Typography variant="subtitle1" mt={2}>
            Links
          </Typography>

          <TextField
            label="Instagram"
            name="links.instagram"
            value={data.links.instagram}
            onChange={handleChange}
          />
          <TextField
            label="LinkedIn"
            name="links.linkedin"
            value={data.links.linkedin}
            onChange={handleChange}
          />
          <TextField
            label="twitter"
            name="links.twitter"
            value={data.links.twitter}
            onChange={handleChange}
          />

          <TextField
            label="facebook"
            name="links.facebook"
            value={data.links.facebook}
            onChange={handleChange}
          />

          <TextField
            label="Website"
            name="links.website"
            value={data.links.website}
            onChange={handleChange}
          />

          <Box mt="auto" display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => onClose(false)} disabled={loading || uploading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading || uploading}>
              {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Add'}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default InstructorDrawer
