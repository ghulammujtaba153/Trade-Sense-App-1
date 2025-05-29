'use client'

import React, { useState } from 'react'
import { Tabs, Tab, Box, Paper } from '@mui/material'
import About from '@/components/dynamic/About'
import FAQs from '@/components/dynamic/FAQs'
import Testimonials from '@/components/dynamic/Testimonials'
import Terms from '@/components/dynamic/Terms'


const Page = () => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Tabs value={tabIndex} onChange={handleChange} aria-label="Content Tabs">
        <Tab label="About" />
        <Tab label="FAQ" />
        <Tab label="Testimonials" />
        <Tab label="Terms & Conditions" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <About/>}
        {tabIndex === 1 && <FAQs/>}
        {tabIndex === 2 && <Testimonials/>}
        {tabIndex === 3 && <Terms/>}
      </Box>
    </Paper>
  )
}

export default Page
