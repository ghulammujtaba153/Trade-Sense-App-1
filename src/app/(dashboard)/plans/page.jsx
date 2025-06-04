'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Paper,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'
import axios from 'axios'
import PlanModal from '@/components/plans/PlanModal'
import { DataGrid } from '@mui/x-data-grid'  // Import DataGrid
import PageLoader from '@/components/loaders/PageLoader'

const categories = [
  { value: 'membership', label: 'Membership' },
  { value: 'plans', label: 'Plans' },
  { value: 'coupon', label: 'Coupon' }
]

const subCategories = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

const PlanPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [data, setData] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [subCategoryFilter, setSubCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/plans`)
      setData(res.data)
    } catch (error) {
      console.error('Error fetching plans:', error)
      toast.error('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/plans/${id}`)
      handleSuccess()
    } catch (error) {
      console.error('Error deleting plan:', error)
      toast.error('Failed to delete plan')
    }
  }

  const handleSuccess = () => {
    toast.success('Operation completed successfully')
    fetchPlans()
  }

  const filteredData = data.filter(plan => {
    const matchCategory = categoryFilter ? plan.category === categoryFilter : true
    const matchSubCategory = subCategoryFilter ? plan.subCategory === subCategoryFilter : true
    return matchCategory && matchSubCategory
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  // Define DataGrid columns
  const columns = [
    { field: 'name', headerName: 'Title', flex: 1, minWidth: 150 },
    { field: 'price', headerName: 'Price', width: 100 },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 130,
      valueFormatter: (params) => params?.charAt(0).toUpperCase() + params?.slice(1) || '-'
    },
    { 
      field: 'subCategory', 
      headerName: 'SubCategory', 
      width: 130,
      valueFormatter: (params) => params ? params.charAt(0).toUpperCase() + params.slice(1) : '-'
    },
    { field: 'couponCode', headerName: 'Coupon Code', width: 130, valueGetter: (params) => params || '-' },
    { 
      field: 'discountPercentage', 
      headerName: 'Discount %', 
      width: 110,
      valueFormatter: (params) => params != null ? `${params}%` : '-'
    },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedPlan(params.row)
              setIsModalOpen(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ]


  if(loading) return <PageLoader/> 


  return (
    <Box p={3} sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedPlan(null)
            setIsModalOpen(true)
          }}
        >
          Add New Plan
        </Button>

        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setSubCategoryFilter('')
              }}
              label="Category"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(categoryFilter === 'membership' || categoryFilter === 'plans') && (
            <FormControl size="small">
              <InputLabel>SubCategory</InputLabel>
              <Select
                value={subCategoryFilter}
                onChange={(e) => setSubCategoryFilter(e.target.value)}
                label="SubCategory"
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="">All SubCategories</MenuItem>
                {subCategories.map(sub => (
                  <MenuItem key={sub.value} value={sub.value}>
                    {sub.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planData={selectedPlan}
        onSuccess={handleSuccess}
      />

      {/* <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: '900px' }}> */}

      <Paper style={{ width: '100%' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          loading={loading}
          disableSelectionOnClick
          autoHeight={false}
          // Remove excess padding below rows by fixing height or autoHeight false
          // You can adjust height as you want
        />
      </Paper>
      {/* </Box>
      </Box> */}
    </Box>
  )
}

export default PlanPage
