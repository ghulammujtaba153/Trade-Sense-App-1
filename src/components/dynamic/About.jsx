'use client'

import React, { useState, useEffect } from 'react'
import { Box, TextField, Typography, Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'
import upload from '@/utils/upload'

const About = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    primaryImage: '',
    secondaryImage: ''
  })

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [existingId, setExistingId] = useState(null)

  const fetchAbout = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/about`)
      if (res.data) {
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          primaryImage: res.data.primaryImage || '',
          secondaryImage: res.data.secondaryImage || ''
        })
        setExistingId(res.data._id)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load About data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const url = await upload(file)
      setFormData((prev) => ({
        ...prev,
        [fieldName]: url
      }))
      toast.success(`${fieldName} uploaded successfully`)
    } catch (err) {
      console.error(err)
      toast.error(`Upload failed for ${fieldName}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await axios.post(`${API_URL}/api/about`, {
        ...formData,
        _id: existingId
      })

      toast.success('About section saved successfully!')
      fetchAbout()
    } catch (error) {
      console.error(error)
      toast.error('Error saving About section')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        About Section
      </Typography>

      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <ImageUploader
            label="Primary Image"
            fieldName="primaryImage"
            value={formData.primaryImage}
            onChange={handleImageUpload}
          />

          <ImageUploader
            label="Secondary Image"
            fieldName="secondaryImage"
            value={formData.secondaryImage}
            onChange={handleImageUpload}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ mt: 2 }}
            fullWidth
          >
            {submitting ? <Loading size={20} /> : existingId ? 'Update' : 'Submit'}
          </Button>
        </form>
      )}
    </Box>
  )
}

export default About

// Inline Loading Component
const Loading = ({ size = 40 }) => (
  <Box display="flex" justifyContent="center" alignItems="center" py={2}>
    <CircularProgress size={size} />
  </Box>
)

// Inline ImageUploader Component
const ImageUploader = ({ label, fieldName, value, onChange }) => (
  <Box mt={2}>
    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
      {label}
    </Typography>

    {value && (
      <Box mb={1}>
        <img
          src={value}
          alt={label}
          style={{ width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8 }}
        />
      </Box>
    )}

    <Button variant="outlined" component="label">
      Upload {label}
      <input hidden accept="image/*" type="file" onChange={(e) => onChange(e, fieldName)} />
    </Button>
  </Box>
)
