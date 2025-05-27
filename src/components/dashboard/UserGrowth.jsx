'use client'

// React Imports
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { API_URL } from '@/configs/url'
import { toast } from 'react-toastify'

// ApexCharts Import (client-side only)
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })

const UserGrowth = () => {
  const [series, setSeries] = useState([
    {
      name: 'Users',
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ])
  const [isLoading, setIsLoading] = useState(true)
  const theme = useTheme()

  const options = {
    chart: {
      id: 'user-growth-weekly',
      toolbar: { show: false },
      parentHeightOffset: 0
    },
    tooltip: {
      theme: 'dark',
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `
          <div style="
            padding: 8px 12px;
            background-color: ${theme.palette.background.paper};
            color: ${theme.palette.text.disabled};
            border-radius: 6px;
            font-family: ${theme.typography.fontFamily};
            font-size: 13px;
          ">
            <strong>${w.globals.labels[dataPointIndex]}</strong>: ${series[seriesIndex][dataPointIndex]} users
          </div>
        `
      }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
        formatter: val => `${val}`,
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: val => `${val}`,
      style: {
        fontSize: theme.typography.body2.fontSize,
        fontWeight: 500
      }
    },
    colors: [
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)',
      'var(--mui-palette-primary-lightOpacity)'
    ],
    grid: {
      show: false,
      padding: {
        top: -10,
        bottom: -8,
        left: -4
      }
    }
  }

  const fetchUserGrowth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/user/growth`)
      console.log("Fetched user growth data:", res.data)

      if (Array.isArray(res.data) && res.data.length === 7) {
        setSeries([{ name: 'Users', data: res.data }])
      } else {
        toast.warning("Unexpected data format from user growth API.")
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserGrowth()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader title='User Growth' subheader='Weekly Overview' />
      <CardContent>
        <ApexCharts options={options} series={series} type='bar' height={300} />
      </CardContent>
    </Card>
  )
}

export default UserGrowth
