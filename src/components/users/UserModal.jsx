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
    goals: [],
    choosenArea: [],
    questionnaireAnswers: {}
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [questionnaire, setQuestionnaire] = useState([])
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
          password: '', // Optionally disable password field for editing user
          role: user.role || 'user',
          ageRange: user.ageRange || '18-24',
          gender: user.gender || 'male',
          goals: user.goals || [],
          choosenArea: user.choosenArea || [],
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
          goals: [],
          choosenArea: [],
          questionnaireAnswers: {}
        })
      }
    }
  }, [isOpen, user])

  const fetchQuestionnaire = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/onboarding/questionnaire`)
      setQuestionnaire(res.data)
    } catch (error) {
      console.error('Failed to fetch questionnaire:', error)
    }
  }

  const handleCheckboxChange = (field, value) => {
    setData(prev => {
      const currentValues = [...prev[field]]
      const index = currentValues.indexOf(value)

      if (index === -1) {
        currentValues.push(value)
      } else {
        currentValues.splice(index, 1)
      }

      return {
        ...prev,
        [field]: currentValues
      }
    })
  }

  const handleQuestionnaire = (questionId, option) => {
    setData(prev => {
      const currentAnswers = prev.questionnaireAnswers[questionId] || []
      const index = currentAnswers.indexOf(option)

      const updatedAnswers = [...currentAnswers]
      if (index === -1) {
        updatedAnswers.push(option)
      } else {
        updatedAnswers.splice(index, 1)
      }

      return {
        ...prev,
        questionnaireAnswers: {
          ...prev.questionnaireAnswers,
          [questionId]: updatedAnswers
        }
      }
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
    setActiveTab(newValue)
  }

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby='user-modal-title' closeAfterTransition>
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
          <Tab label='Goals' />
          <Tab label='Areas' />
          <Tab label='Questionnaire' />
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

        {/* Goals Tab */}
        {activeTab === 1 && (
          <Box>
            {goalOption.map(goal => (
              <FormControlLabel
                key={goal}
                control={
                  <Checkbox checked={data.goals.includes(goal)} onChange={() => handleCheckboxChange('goals', goal)} />
                }
                label={goal.charAt(0).toUpperCase() + goal.slice(1)}
              />
            ))}
          </Box>
        )}

        {/* Areas Tab */}
        {activeTab === 2 && (
          <Box>
            {areasOption.map(area => (
              <FormControlLabel
                key={area}
                control={
                  <Checkbox
                    checked={data.choosenArea.includes(area)}
                    onChange={() => handleCheckboxChange('choosenArea', area)}
                  />
                }
                label={area.charAt(0).toUpperCase() + area.slice(1)}
              />
            ))}
          </Box>
        )}

        {/* Questionnaire Tab */}
        {activeTab === 3 && (
          <Box>
            {questionnaire.length === 0 && <Typography>No questionnaire found.</Typography>}
            {questionnaire.map(item => (
              <Box key={item._id} mb={2}>
                <Typography variant='subtitle1' gutterBottom>
                  {item.question}
                </Typography>
                {item.options.map(option => {
                  const selectedAnswers = data.questionnaireAnswers[item._id] || []
                  const checked = selectedAnswers.includes(option)

                  return (
                    <FormControlLabel
                      key={option}
                      control={<Checkbox checked={checked} onChange={() => handleQuestionnaire(item._id, option)} />}
                      label={option}
                    />
                  )
                })}
              </Box>
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
