'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'
import axios from 'axios'
import PlanModal from '@/components/plans/PlanModal'

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

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button variant="contained" color="primary" onClick={() => {
          setSelectedPlan(null)
          setIsModalOpen(true)
        }}>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>SubCategory</TableCell>
              <TableCell>Coupon Code</TableCell>
              <TableCell>Discount %</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.price}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{plan.category}</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>{plan.subCategory || '-'}</TableCell>
                <TableCell>{plan.couponCode || '-'}</TableCell>
                <TableCell>{plan.discountPercentage != null ? `${plan.discountPercentage}%` : '-'}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedPlan(plan)
                      setIsModalOpen(true)
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(plan._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">No plans found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default PlanPage
