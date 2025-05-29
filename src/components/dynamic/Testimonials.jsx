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
  Rating
} from '@mui/material'
import { CloudUpload as CloudUploadIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'

const Testimonials = () => {
  const [data, setData] = useState({ title: '', description: '', image: '' })
  const [testimonials, setTestimonials] = useState([])
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    designation: '',
    image: '',
    rating: 5,
    description: ''
  })
  const [showTestimonialForm, setShowTestimonialForm] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingId, setExistingId] = useState(null)
  const [editIndex, setEditIndex] = useState(null)

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

  const handleTestimonialChange = (e) => {
    const { name, value } = e.target
    setTestimonialForm(prev => ({ ...prev, [name]: value }))
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
      setTestimonialForm(prev => ({ ...prev, image: imageUrl }))
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const addOrUpdateTestimonial = () => {
    const { name, designation, image, rating, description } = testimonialForm
    if (!name || !designation || !image || !rating || !description) {
      return toast.error('Fill out all testimonial fields')
    }

    if (editIndex !== null) {
      const updated = [...testimonials]
      updated[editIndex] = { ...testimonialForm }
      setTestimonials(updated)
      setEditIndex(null)
    } else {
      setTestimonials(prev => [...prev, { ...testimonialForm, createdAt: new Date() }])
    }

    setTestimonialForm({ name: '', designation: '', image: '', rating: 5, description: '' })
    setShowTestimonialForm(false)
  }

  const editTestimonial = (index) => {
    const selected = testimonials[index]
    setTestimonialForm({ ...selected })
    setEditIndex(index)
    setShowTestimonialForm(true)
  }

  const removeTestimonial = (index) => {
    setTestimonials(prev => prev.filter((_, i) => i !== index))
    if (editIndex === index) {
      setEditIndex(null)
      setTestimonialForm({ name: '', designation: '', image: '', rating: 5, description: '' })
      setShowTestimonialForm(false)
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
    <Box maxWidth="md" mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" gutterBottom>Testimonials Section</Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <TextField fullWidth label="Title" name="title" value={data.title} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth multiline rows={3}
              label="Description" name="description"
              value={data.description} onChange={handleChange} required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={uploadingImage}
              fullWidth
            >
              {uploadingImage ? 'Uploading...' : 'Upload Main Image'}
              <input hidden type="file" accept="image/*" onChange={handleMainImageUpload} />
            </Button>
            {data.image && <img src={data.image} alt="main" style={{ height: 100, marginTop: 10 }} />}
          </Grid>

          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              variant="text"
              onClick={() => {
                setTestimonialForm({ name: '', designation: '', image: '', rating: 5, description: '' })
                setEditIndex(null)
                setShowTestimonialForm(prev => !prev)
              }}
            >
              {showTestimonialForm ? 'Cancel' : 'Add Testimonial'}
            </Button>
          </Grid>

          {showTestimonialForm && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" name="name" value={testimonialForm.name} onChange={handleTestimonialChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Designation" name="designation" value={testimonialForm.designation} onChange={handleTestimonialChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" name="description" multiline rows={3} value={testimonialForm.description} onChange={handleTestimonialChange} />
              </Grid>
              <Grid item xs={12}>
                <Rating name="rating" value={testimonialForm.rating} onChange={(e, newValue) => setTestimonialForm(prev => ({ ...prev, rating: newValue }))} />
              </Grid>
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingImage}
                  fullWidth
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Person Image'}
                  <input hidden type="file" accept="image/*" onChange={handleTestimonialImageUpload} />
                </Button>
                {testimonialForm.image && <img src={testimonialForm.image} alt="testimonial" style={{ height: 80, marginTop: 10 }} />}
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="success" onClick={addOrUpdateTestimonial}>
                  {editIndex !== null ? 'Update Testimonial' : 'Add to List'}
                </Button>
              </Grid>
            </>
          )}

          {/* List of testimonials */}
          {testimonials.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1">Added Testimonials:</Typography>
              {testimonials.map((t, i) => (
                <Card key={i} variant="outlined" sx={{ my: 1 }}>
                  <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">{t.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{t.designation}</Typography>
                    </Box>
                    <Box>
                      <IconButton onClick={() => editTestimonial(i)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => removeTestimonial(i)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Section'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default Testimonials
