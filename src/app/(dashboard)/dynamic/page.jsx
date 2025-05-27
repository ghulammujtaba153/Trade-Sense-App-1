'use client'

import React, { useState } from 'react'
import { Tabs, Tab, Box, Paper } from '@mui/material'


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
        {tabIndex === 0 && <div>About</div>}
        {tabIndex === 1 && <div>FAQ</div>}
        {tabIndex === 2 && <div>Testimonials</div>}
        {tabIndex === 3 && <div>Terms & Conditions</div>}
      </Box>
    </Paper>
  )
}

export default Page
