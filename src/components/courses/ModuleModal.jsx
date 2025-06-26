'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'
import PageLoader from '../loaders/PageLoader'

const ModuleModal = ({ isOpen, onClose, data, onSuccess }) => {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchModules = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/modules/${data._id}`)
      setModules(response.data || [])
    } catch (error) {
      console.error('Failed to fetch modules:', error)
      toast.error('Failed to fetch modules')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteModule = async id => {
    setLoading(true)
    try {
      const res = await axios.delete(`${API_URL}/api/modules/${id}`)
      toast.success(res.data.message)
      await fetchModules()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete module')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data?._id) fetchModules()
  }, [data._id])

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Modules</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        {loading ? (
          <PageLoader />
        ) : modules.length === 0 ? (
          <Typography variant='body2' color='text.secondary'>
            No modules found.
          </Typography>
        ) : (
          modules.map(module => (
            <Paper
              key={module._id}
              sx={{
                p: 2,
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              elevation={2}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h6'>{module.title}</Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                      {module.description}
                    </Typography>
                  </Box>
                  {module.image && (
                    <img
                      src={module.image}
                      alt={module.title}
                      style={{
                        width: '60px',
                        maxHeight: 60,
                        objectFit: 'contain',
                        borderRadius: 8,
                        marginBottom: 8
                      }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    boxShadow: 1,
                    width: '100%',
                    mt: 1
                  }}
                >
                  <audio
                    controls
                    style={{
                      width: '100%',
                      outline: 'none'
                    }}
                  >
                    <source src={module.url} />
                    Your browser does not support the audio element.
                  </audio>
                </Box>
              </Box>
              <IconButton onClick={() => handleDeleteModule(module._id)} color='error'>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='inherit'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModuleModal
