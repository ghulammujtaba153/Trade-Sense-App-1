'use client'
import React from 'react'
import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import Link from 'next/link'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'

const plans = [
  {
    id: 1,
    title: 'Basic Plan',
    price: '$10',
    category: 'Health',
    subCategory: 'Fitness',
    discount: '10%'
  },
  {
    id: 2,
    title: 'Premium Plan',
    price: '$25',
    category: 'Education',
    subCategory: 'Courses',
    discount: '15%'
  },
  {
    id: 3,
    title: 'Pro Plan',
    price: '$50',
    category: 'Business',
    subCategory: 'Consulting',
    discount: '20%'
  }
]

const PlanPage = () => {
  return (
    <Card sx={{ p: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h6'>Plans</Typography>
        <Link href='/plans/add-plan'>
          <Button variant='contained' color='primary'>
            Add Plan
          </Button>
        </Link>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sub Category</TableCell>
              <TableCell>Coupon Discount</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map(plan => (
              <TableRow key={plan.id}>
                <TableCell>{plan.title}</TableCell>
                <TableCell>{plan.price}</TableCell>
                <TableCell>{plan.category}</TableCell>
                <TableCell>{plan.subCategory}</TableCell>
                <TableCell>{plan.discount}</TableCell>
                <TableCell align='right'>
                  <IconButton color='primary' href={`/plans/view/${plan.id}`}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color='warning' href={`/plans/edit/${plan.id}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color='error' onClick={() => alert(`Delete plan ${plan.id}`)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default PlanPage
