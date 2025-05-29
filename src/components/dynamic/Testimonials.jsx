'use client'
import { API_URL } from '@/configs/url'
import upload from '@/utils/upload'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  Paper,
  Rating
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material'
import TestimonialModal from './TestimonialModal'

const Testimonials = () => {
  const [data, setData] = useState({ title: '', description: '', image: '' })
  const [testimonials, setTestimonials] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingId, setExistingId] = useState(null)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState({
    name: '',
    designation: '',
    image: '',
    rating: 5,
    description: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/testimonials`)
      if (res.data) {
        setData({
          title: res.data.title || '',
          description: res.data.description || '',
          image: res.data.image || '',
        })
        setTestimonials(res.data.testimonials || [])
        setExistingId(res.data._id)
      }
    } catch (err) {
      toast.error('Failed to fetch data')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const imageUrl = await upload(file)
      setData(prev => ({ ...prev, image: imageUrl }))
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleTestimonialImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const imageUrl = await upload(file)
      setCurrentTestimonial(prev => ({ ...prev, image: imageUrl }))
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const openAddModal = () => {
    setCurrentTestimonial({
      name: '',
      designation: '',
      image: '',
      rating: 5,
      description: ''
    })
    setIsEditing(false)
    setModalOpen(true)
  }

  const openEditModal = (index) => {
    setCurrentTestimonial({ ...testimonials[index] })
    setIsEditing(true)
    setEditingIndex(index)
    setModalOpen(true)
  }

  const handleSubmitTestimonial = async () => {
    try {
      if (isEditing) {
        // Update existing testimonial
        const res = await axios.put(`${API_URL}/api/testimonials/${editingIndex}`, currentTestimonial)
        const updatedTestimonials = [...testimonials]
        updatedTestimonials[editingIndex] = currentTestimonial
        setTestimonials(updatedTestimonials)
        toast.success('Testimonial updated successfully')
      } else {
        // Add new testimonial
        const res = await axios.post(`${API_URL}/api/testimonials/user`, currentTestimonial)
        fetchData()
        setTestimonials(prev => [...prev, res.data])
        toast.success('Testimonial added successfully')
      }
      setModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save testimonial')
    }
  }

  const handleDeleteTestimonial = async (index) => {
    try {
      await axios.delete(`${API_URL}/api/testimonials/${index}`)
      setTestimonials(prev => prev.filter((_, i) => i !== index))
      toast.success('Testimonial deleted successfully')
    } catch (error) {
      toast.error('Failed to delete testimonial')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = { ...data, testimonials }
      await axios.post(`${API_URL}/api/testimonials`, { ...payload, _id: existingId })
      toast.success('Saved successfully')
      fetchData()
    } catch (error) {
      toast.error('Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box maxWidth="lg" mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h4" gutterBottom textAlign="center">Manage Testimonials</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* Left Side: Testimonials Section Form */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>Testimonials Section</Typography>

              <TextField
                fullWidth
                label="Title"
                name="title"
                value={data.title}
                onChange={handleChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={data.description}
                onChange={handleChange}
                required
                margin="normal"
              />

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={uploadingImage}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Main Image'}
                <input hidden type="file" accept="image/*" onChange={handleMainImageUpload} />
              </Button>
              {data.image && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img src={data.image} alt="main" style={{ maxHeight: 150, borderRadius: 8 }} />
                </Box>
              )}

              <Button
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                fullWidth
                onClick={openAddModal}
                sx={{ mb: 2 }}
              >
                Add New Testimonial
              </Button>
            </Paper>
          </Grid>

          {/* Right Side: Testimonials List */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', overflowY: 'auto', maxHeight: 700 }}>
              <Typography variant="h5" gutterBottom>
                Testimonials List ({testimonials.length})
              </Typography>

              {testimonials.length === 0 && (
                <Typography>No testimonials added yet.</Typography>
              )}

              {testimonials.map((t, i) => (
                <Card
                  key={i}
                  variant="outlined"
                  sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1 }}
                >
                  <Box
                    component="img"
                    src={t.image}
                    alt={t.name}
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      mr: 2,
                      flexShrink: 0
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{t.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.designation}
                    </Typography>
                    <Rating value={t.rating} readOnly size="small" />
                    <Typography variant="body2" mt={1}>{t.description}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => openEditModal(i)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTestimonial(i)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Paper>
          </Grid>

          {/* Submit Button full width below */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? 'Saving...' : 'Save All'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <TestimonialModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        formData={currentTestimonial}
        setFormData={setCurrentTestimonial}
        onSubmit={handleSubmitTestimonial}
        uploadingImage={uploadingImage}
        handleImageUpload={handleTestimonialImageUpload}
        isEditing={isEditing}
      />
    </Box>
  )
}

export default Testimonials