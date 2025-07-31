"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '@/configs/url';


const MembershipModal = ({ isOpen, onClose, planData, onSuccess }) => {
    const [data, setData] = useState({
        name: '',
        price: 0,
        description: '',
        category: 'membership',
        subCategory: 'monthly',
        couponCode: '',
        discountPercentage: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const categories = [
        { value: 'membership', label: 'Membership' },
        
    ];

    const subCategories = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
    ];

    useEffect(() => {
        if (planData) {
            setData({
                name: planData.name || '',
                price: planData.price || 0,
                description: planData.description || '',
                category: planData.category || 'membership',
                subCategory: planData.subCategory || 'monthly',
                couponCode: planData.couponCode || '',
                discountPercentage: planData.discountPercentage || '',
            });
            setIsEditMode(true);
        } else {
            resetForm();
        }
    }, [planData]);

    const resetForm = () => {
        setData({
            name: '',
            price: 0,
            description: '',
            category: 'membership',
            subCategory: 'monthly',
            couponCode: '',
            discountPercentage: '',
        });
        setIsEditMode(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: ['price', 'discountPercentage'].includes(name)
                ? parseFloat(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEditMode) {
                await axios.put(`${API_URL}/api/plans/${planData._id}`, data);
                toast.success('Plan updated successfully');
            } else {
                await axios.post(`${API_URL}/api/plans`, data);
                toast.success('Plan created successfully');
            }
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Operation failed');
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isEditMode ? 'Edit Plan' : 'Add New Plan'}
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Typography color="error" mb={2}>
                        {error}
                    </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Plan Name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={data.price}
                        onChange={handleChange}
                        required
                        fullWidth
                        inputProps={{ min: 0, step: 0.01 }}
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={data.category}
                            onChange={handleChange}
                            label="Category"
                            contentEditable={false}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {data.category !== 'coupon' && (
                        <FormControl fullWidth required>
                            <InputLabel>Sub Category</InputLabel>
                            <Select
                                name="subCategory"
                                value={data.subCategory}
                                onChange={handleChange}
                                label="Sub Category"
                            >
                                {subCategories.map((sub) => (
                                    <MenuItem key={sub.value} value={sub.value}>
                                        {sub.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {data.category === 'coupon' && (
                        <>
                            <TextField
                                label="Coupon Code"
                                name="couponCode"
                                value={data.couponCode}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Discount Percentage"
                                name="discountPercentage"
                                type="number"
                                value={data.discountPercentage}
                                onChange={handleChange}
                                required
                                fullWidth
                                inputProps={{ min: 0, max: 100, step: 0.01 }}
                            />
                        </>
                    )}

                    <TextField
                        label="Description"
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        required
                        fullWidth
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit} disabled={loading} variant="contained" color="primary">
                    {loading ? 'Saving...' : isEditMode ? 'Update Plan' : 'Create Plan'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MembershipModal;
