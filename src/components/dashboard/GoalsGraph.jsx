'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardHeader, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// ApexCharts dynamic import (client-only)
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const goalsData = {
  2023: {
    created: [12, 18, 25, 20, 30, 40, 50, 45, 35, 25, 15, 10],
    completed: [10, 15, 20, 18, 25, 35, 45, 40, 30, 20, 12, 8],
    pending: [2, 3, 5, 2, 5, 5, 5, 5, 5, 5, 3, 2]
  },
  2024: {
    created: [20, 25, 30, 35, 40, 50, 55, 60, 50, 45, 30, 25],
    completed: [15, 20, 25, 30, 35, 45, 50, 55, 45, 40, 25, 20],
    pending: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  }
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function GoalsGraph() {
  const theme = useTheme()
  const [year, setYear] = useState(2024)

  const { created, completed, pending, stats } = useMemo(() => {
    const yData = goalsData[year] || {
      created: new Array(12).fill(0),
      completed: new Array(12).fill(0),
      pending: new Array(12).fill(0)
    }
    
    return {
      created: yData.created,
      completed: yData.completed,
      pending: yData.pending,
      stats: {
        totalCreated: yData.created.reduce((a, b) => a + b, 0),
        totalCompleted: yData.completed.reduce((a, b) => a + b, 0),
        totalPending: yData.pending.reduce((a, b) => a + b, 0),
        completionRate: Math.round((yData.completed.reduce((a, b) => a + b, 0) / yData.created.reduce((a, b) => a + b, 0)) * 100) || 0
      }
    }
  }, [year])

  const options = useMemo(() => ({
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: { 
        show: false 
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px',
        }
      },
      axisBorder: { 
        show: true, 
        color: theme.palette.divider 
      },
      axisTicks: { 
        show: true, 
        color: theme.palette.divider 
      }
    },
    yaxis: {
      title: {
        text: 'Number of Goals',
        style: {
          color: theme.palette.text.secondary
        }
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      },
      min: 0
    },
    fill: {
      opacity: 1,
      colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main]
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme.palette.text.primary,
        useSeriesColors: false
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        }
      },
      shared: true,
      intersect: false,
      theme: theme.palette.mode
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '70%'
          }
        }
      }
    }]
  }), [theme, year])

  const series = [
    { name: 'Created', data: created },
    { name: 'Completed', data: completed },
    { name: 'Pending', data: pending }
  ]

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        title="Goals Overview"
        subheader={`Year: ${year}`}
        action={
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={year}
              label="Year"
              onChange={e => setYear(Number(e.target.value))}
            >
              {Object.keys(goalsData).map(y => (
                <MenuItem key={y} value={Number(y)}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />
      <CardContent sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ApexCharts 
            options={options} 
            series={series} 
            type="bar" 
            height={350} 
            width="100%"
          />
        </Box>
        <Box sx={{ minWidth: 220 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Yearly Stats
          </Typography>
          <Typography><strong>Created:</strong> {stats.totalCreated}</Typography>
          <Typography><strong>Completed:</strong> {stats.totalCompleted}</Typography>
          <Typography><strong>Pending:</strong> {stats.totalPending}</Typography>
          <Typography mt={1}><strong>Completion Rate:</strong> {stats.completionRate}%</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}