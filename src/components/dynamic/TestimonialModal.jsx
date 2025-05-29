'use client'
import {
  Box, Button, Dialog, DialogTitle, DialogContent, TextField, Rating
} from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/configs/url'

const TestimonialModal = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  uploadingImage,
  handleImageUpload,
  isEditing
}) => {
    const [data,setData]= useState(formData)
    const [loading, setLoading] = useState(false)

    const handleUpdate= async ()=>{
        try {
            setLoading(true)
            const res = await axios.put(`${API_URL}/api/testimonial/${index}`,data)
            toast.success('Testimonial updated successfully')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }


    const handleSave= async ()=>{
        try {
            setLoading(true)
            const res = await axios.put(`${API_URL}/api/testimonial/user`,data)
            toast.success('Testimonial updated successfully')
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Designation"
            name="designation"
            value={formData.designation}
            onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            multiline rows={3}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
          />
          <Rating
            name="rating"
            value={formData.rating}
            onChange={(e, value) => setFormData(prev => ({ ...prev, rating: value }))}
          />
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            disabled={uploadingImage}
          >
            {uploadingImage ? 'Uploading...' : 'Upload Image'}
            <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
          </Button>
          {formData.image && <img src={formData.image} alt="testimonial" style={{ height: 80 }} />}

          <Button variant="contained" color="primary" onClick={onSubmit}>
            {isEditing ? 'Update Testimonial' : 'Add Testimonial'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default TestimonialModal
