'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_URL } from '@/configs/url'

// Dynamically import ApexCharts (client-side only)
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const RatingsGraph = () => {
  const [series, setSeries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme()

  
  useEffect(() => {
  const fetchRatings = async () => {
    console.log("fetching api")
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/ratings`)
      console.log(res.data)
      const ratingObject = res?.data?.ratings || {}
      const ratingCounts = [1, 2, 3, 4, 5].map(key => ratingObject[key] || 0)

      setSeries([
        {
          name: 'Ratings Count',
          data: ratingCounts
        }
      ])

      console.log("fetched ratings", ratingCounts)
    } catch (error) {
      toast.error( 'Failed to fetch ratings')
    } finally {
      setIsLoading(false)
    }
  }

  fetchRatings()
}, [])



  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%'
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    tooltip: {
      theme: 'dark',
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return `
          <div style="
            padding: 8px 12px;
            background-color: ${theme.palette.background.paper};
            color: ${theme.palette.text.disabled};
            border-radius: 6px;
            font-family: ${theme.typography.fontFamily};
            font-size: 13px;
          ">
            <strong>${w.globals.labels[dataPointIndex]}</strong>: ${series[seriesIndex][dataPointIndex]} reviews
          </div>
        `
      }
    },
    colors: ['#FF4560'],
    grid: {
      borderColor: 'var(--mui-palette-divider)'
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader title='Ratings Distribution' subheader='Ratings from 1 to 5 stars' />
      <CardContent>
        <ApexCharts options={options} series={series} type='bar' height={300} />
      </CardContent>
    </Card>
  )
}

export default RatingsGraph
