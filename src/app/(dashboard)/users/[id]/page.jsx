'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Box,
  Stack
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import UserDetailSection from '@/components/users/UserDetailSection'
import { API_URL } from '@/configs/url'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PageLoader from '@/components/loaders/PageLoader'
import { toast } from 'react-toastify'

const UserDetail = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [affiliate, setAffiliate] = useState({
    visited: 0,
    enrolled: 0
  })
  const [journal , setJournal] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, enrollmentsRes, affiliateRes, jornalRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/users/${id}`),
          axios.get(`${API_URL}/api/enrollments/${id}`),
          axios.get(`${API_URL}/api/affiliate/${id}`),
          axios.get(`${API_URL}/api/trading-form/graph/${id}`)
        ])
        setUser(userRes.data.user)
        setEnrollments(enrollmentsRes.data)
        setAffiliate(affiliateRes.data)
        setJournal(jornalRes.data)
      } catch (error) {
        toast.error('Error fetching data:')
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [id])

  if (!user) {
    return <PageLoader />
  }

  return (
    <Container maxWidth='xl' sx={{ mt: 4, mb: 4 }}>
      {/* Back Button */}
      <Link href='/users' sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </Link>

      <Grid container spacing={4}>
        {/* Left Panel */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              User Details
            </Typography>
            <UserDetailSection enrollments={enrollments} />
          </Paper>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display='flex' flexDirection='column' alignItems='center' textAlign='center' mb={3}>
              {user.profilePic ? (
                <Avatar src={user.profilePic} sx={{ width: 100, height: 100 }} />
              ) : (
                <AccountCircleIcon sx={{ fontSize: 100, color: 'gray' }} />
              )}
              <Typography variant='h6' mt={2}>
                {user.name}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {user.email}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {user.phone || 'No phone provided'}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {[
                ['Age Range', user.ageRange],
                ['Gender', user.gender],
                ['Experience Level', user.experienceLevel],
                [
                  'Status',
                  <Chip label={user.status} color={user.status === 'active' ? 'success' : 'warning'} size='small' />
                ]
              ].map(([label, value], i) => (
                <Grid item xs={6} key={i}>
                  <Typography variant='caption' color='textSecondary'>
                    {label}
                  </Typography>
                  <Typography variant='body2'>{value}</Typography>
                </Grid>
              ))}
            </Grid>

            {/* Goals */}
            {user.goals?.length > 0 && (
              <Box mt={4}>
                <Typography variant='subtitle2' gutterBottom>
                  Goals
                </Typography>
                <Stack direction='row' flexWrap='wrap' gap={1}>
                  {user.goals.map((goal, i) => (
                    <Chip key={i} label={goal} color='success' size='small' />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Choosen Area */}
            {user.choosenArea?.length > 0 && (
              <Box mt={3}>
                <Typography variant='subtitle2' gutterBottom>
                  Interest Areas
                </Typography>
                <Stack direction='row' flexWrap='wrap' gap={1}>
                  {user.choosenArea.map((area, i) => (
                    <Chip key={i} label={area} color='primary' size='small' />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Questionnaire Answers */}
            {/* {user.questionnaireAnswers && Object.keys(user.questionnaireAnswers).length > 0 && (
              <Box mt={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Onboarding
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {Object.entries(user.questionnaireAnswers).map(([questionId, answers], i) => (
                    <Chip key={i} label={answers.join(', ')} variant="outlined" size="small" />
                  ))}
                </Stack>
              </Box>
            )} */}

            <br />

            <Box mt={4}>
              <Typography variant='subtitle2' gutterBottom>
                Affiliate Records
              </Typography>

              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  padding: 2,
                  maxWidth: 400,
                  
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='body1' fontWeight={500}>
                      Visitors
                    </Typography>
                    <Typography>{affiliate.visited}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant='body1' fontWeight={500}>
                      Enrolled
                    </Typography>
                    <Typography>{affiliate.enrolled}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant='body1' fontWeight={500}>
                      Commission
                    </Typography>
                    <Typography>{affiliate.money}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant='body1' fontWeight={500}>
                      Conversion
                    </Typography>
                    <Typography>{affiliate.visited > 0 ? ((affiliate.enrolled / affiliate.visited) * 100).toFixed(2) : 0}</Typography>
                  </Grid>

                </Grid>
              </Box>
            </Box>



            {/* graph here */}


            <Box>

            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserDetail
