'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'
import InputAdornment from '@mui/material/InputAdornment'

import {
  Box,
  Modal,
  Typography,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Grid,
  Alert
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'

const goalOption = ['be productive', 'be healthy', 'be creative', 'make more money']

const areasOption = ['health', 'nutrition', 'fitness', 'mindfulness', 'self-improvement']

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
  width: { xs: '90%', sm: 600, md: 800 }
}

const UserModal = ({ isOpen, onClose, user, onCustomerAdded }) => {
  const [data, setData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'user',
    ageRange: '18-24',
    gender: 'male',
    questionnaireAnswers: {} // key: tab _id, value: array of question _id
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [questionnaireData, setQuestionnaireData] = useState([])
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (isOpen) {
      fetchQuestionnaire()
      setActiveTab(0)

      if (user) {
        setData({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          password: '',
          role: user.role || 'user',
          ageRange: user.ageRange || '18-24',
          gender: user.gender || 'male',
          questionnaireAnswers: user.questionnaireAnswers || {}
        })
      } else {
        setData({
          name: '',
          phone: '',
          email: '',
          password: '',
          role: 'user',
          ageRange: '18-24',
          gender: 'male',
          questionnaireAnswers: {}
        })
      }
    }
  }, [isOpen, user])

  const fetchQuestionnaire = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/onboarding/questionnaire`)
      setQuestionnaireData(res.data)
    } catch (error) {
      console.error('Failed to fetch questionnaire:', error)
    }
  }

  const handleQuestionCheckboxChange = (tabId, questionId) => {
    setData(prev => {
      const prevAnswers = { ...prev.questionnaireAnswers }
      const current = prevAnswers[tabId] ? [...prevAnswers[tabId]] : []
      const idx = current.indexOf(questionId)
      if (idx === -1) {
        current.push(questionId)
      } else {
        current.splice(idx, 1)
      }
      prevAnswers[tabId] = current
      return { ...prev, questionnaireAnswers: prevAnswers }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let res
      if (user) {
        res = await axios.put(`${API_URL}/api/auth/users/update/${user._id}`, data)
        toast.success('Customer updated successfully!')
      } else {
        res = await axios.post(`${API_URL}/api/auth/register`, data)
        toast.success('Customer added successfully!')
      }

      onCustomerAdded(res.data)
      onClose()
    } catch (error) {
      console.error('Error:', error)
      setError(error.response?.data?.message || 'Operation failed')
      toast.error(error.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setError('')
    setActiveTab(newValue)
  }

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      aria-labelledby='user-modal-title' 
      closeAfterTransition
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }
      }}
    >
      <Box sx={style} component='form' onSubmit={handleSubmit}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={3}
          borderBottom={1}
          borderColor='divider'
          pb={1}
        >
          <Typography id='user-modal-title' variant='h6' component='h2'>
            {user ? 'Edit Customer' : 'Add New Customer'}
          </Typography>
          <IconButton onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label='user form tabs'
          variant='scrollable'
          scrollButtons='auto'
          sx={{ mb: 3 }}
        >
          <Tab label='Basic Info' />
          {questionnaireData.map((tab, idx) => (
            <Tab key={tab._id} label={tab.title} />
          ))}
        </Tabs>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Basic Info Tab */}
        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id='name'
                label='Name'
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                placeholder='Enter name'
                required
                variant='outlined'
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonIcon color='action' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <TextField
                id='phone'
                label='Phone'
                type='tel'
                value={data.phone}
                onChange={e => setData({ ...data, phone: e.target.value })}
                placeholder='Enter phone number'
                inputProps={{ minLength: 10, maxLength: 15 }}
                required
                variant='outlined'
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PhoneIcon color='action' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                id='email'
                label='Email'
                type='email'
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                placeholder='Enter email'
                required
                variant='outlined'
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EmailIcon color='action' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                id='password'
                label='Password'
                type='password'
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
                placeholder='Enter password'
                inputProps={{ minLength: 6 }}
                required={!user} // Require password only if creating user
                variant='outlined'
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon color='action' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='role-label'>Role</InputLabel>
                <Select
                  labelId='role-label'
                  id='role'
                  value={data.role}
                  label='Role'
                  disabled
                  onChange={e => setData({ ...data, role: e.target.value })}
                >
                  <MenuItem value='user'>User</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='super-admin'>Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Age Range */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='ageRange-label'>Age Range</InputLabel>
                <Select
                  labelId='ageRange-label'
                  id='ageRange'
                  value={data.ageRange}
                  label='Age Range'
                  onChange={e => setData({ ...data, ageRange: e.target.value })}
                >
                  <MenuItem value='18-24'>18-24</MenuItem>
                  <MenuItem value='25-34'>25-34</MenuItem>
                  <MenuItem value='35-44'>35-44</MenuItem>
                  <MenuItem value='45-54'>45-54</MenuItem>
                  <MenuItem value='55+'>55+</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='gender-label'>Gender</InputLabel>
                <Select
                  labelId='gender-label'
                  id='gender'
                  value={data.gender}
                  label='Gender'
                  onChange={e => setData({ ...data, gender: e.target.value })}
                >
                  <MenuItem value='male'>Male</MenuItem>
                  <MenuItem value='female'>Female</MenuItem>
                  <MenuItem value='other'>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {/* Dynamic Questionnaire Tabs */}
        {activeTab > 0 && questionnaireData[activeTab - 1] && (
          <Box>
            <Typography variant='subtitle1' sx={{ mb: 2 }}>{questionnaireData[activeTab - 1].subTitle}</Typography>
            {questionnaireData[activeTab - 1].questions.map(q => (
              <FormControlLabel
                key={q._id}
                control={
                  <Checkbox
                    checked={
                      (data.questionnaireAnswers[questionnaireData[activeTab - 1]._id] || []).includes(q._id)
                    }
                    onChange={() => handleQuestionCheckboxChange(questionnaireData[activeTab - 1]._id, q._id)}
                  />
                }
                label={
                  <Box display='flex' alignItems='center'>
                    {q.image && (
                      <img src={q.image} alt='' style={{ width: 40, height: 40, marginRight: 8, objectFit: 'cover', borderRadius: 4 }} />
                    )}
                    <span>{q.text}</span>
                  </Box>
                }
                sx={{ display: 'block', mb: 1 }}
              />
            ))}
          </Box>
        )}

        <Box mt={4} display='flex' justifyContent='flex-end'>
          <Button variant='contained' type='submit' disabled={loading} color='primary'>
            {user ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default UserModal