'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'

const FAQModal = ({ open, type, data, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({ question: '', answer: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (type !== 'add' && data) {
      setFormData({
        question: data.question || '',
        answer: data.answer || ''
      })
    } else {
      setFormData({ question: '', answer: '' })
    }
  }, [type, data])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (type === 'add') {
        await axios.post(`${API_URL}/api/faq`, formData);
        toast.success('FAQ added successfully')
      } else if (type === 'edit' && data?._id) {
        await axios.put(`${API_URL}/api/faq/${data._id}`, formData);
        toast.success('FAQ updated successfully')
      }
      onRefresh()
      onClose()
    } catch (error) {
      toast.error('Error saving FAQ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {type === 'view' ? 'View FAQ' : type === 'edit' ? 'Edit FAQ' : 'Add FAQ'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          margin="normal"
          disabled={type === 'view'}
        />
        <TextField
          fullWidth
          label="Answer"
          name="answer"
          multiline
          rows={4}
          value={formData.answer}
          onChange={handleChange}
          margin="normal"
          disabled={type === 'view'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        {type !== 'view' && (
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default FAQModal
