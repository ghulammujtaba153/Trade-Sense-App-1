'use client'


import { API_URL } from '@/configs/url';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Modal,
  Avatar
} from '@mui/material';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import PageLoader from '@/components/loaders/PageLoader';

const WelcomePage = () => {
    const [data, setData] = useState({
        title: "",
        description: "",
        features: [{
            title: "",
            description: "",
            icons: "",
        }],
        showIcons: false,
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await axios.post(`${API_URL}/api/file/upload`, formData);
            return res.data.s3Url;
        } catch (error) {
            toast.error('File upload failed');
            return null;
        }
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/welcome`);
            setData(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await axios.post(`${API_URL}/api/welcome`, data);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setSubmitting(false);
        }
    }

    const addFeature = () => {
        setData(prev => ({
            ...prev,
            features: [...prev.features, { title: "", description: "", icons: "" }]
        }));
    };

    const removeFeature = (index) => {
        setData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const updateFeature = (index, field, value) => {
        setData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => 
                i === index ? { ...feature, [field]: value } : feature
            )
        }));
    };

    const handleIconUpload = async (index, e) => {
        const iconPath = await handleFileUpload(e);
        if (iconPath) {
            updateFeature(index, 'icons', iconPath);
        }
    };

    const handlePreviewImage = (imageUrl) => {
        setPreviewImage(imageUrl);
        setPreviewOpen(true);
    };

    const closePreview = () => {
        setPreviewOpen(false);
        setPreviewImage(null);
    };

    if (loading) return <PageLoader />;

    return (
        <Box p={3} sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                    Welcome Page Configuration
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>

            {/* Main Content Form */}
            <Grid container spacing={3}>
                {/* Title and Description */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                            Main Content
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Page Title"
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                    variant="outlined"
                                    size="small"
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Page Description"
                                    value={data.description}
                                    onChange={(e) => setData({ ...data, description: e.target.value })}
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Features Section */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
                                Features
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={addFeature}
                                size="small"
                            >
                                Add Feature
                            </Button>
                        </Box>

                        {data.features.map((feature, index) => (
                            <Card key={index} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                            Feature {index + 1}
                                        </Typography>
                                        <IconButton
                                            onClick={() => removeFeature(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Feature Title"
                                                value={feature.title}
                                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Feature Description"
                                                value={feature.description}
                                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                        
                                        <Grid item xs={12}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleIconUpload(index, e)}
                                                    style={{ display: 'none' }}
                                                    id={`icon-upload-${index}`}
                                                />
                                                <label htmlFor={`icon-upload-${index}`}>
                                                    <Button
                                                        variant="outlined"
                                                        component="span"
                                                        startIcon={<CloudUploadIcon />}
                                                        size="small"
                                                    >
                                                        Upload Icon
                                                    </Button>
                                                </label>
                                                {feature.icons && (
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Avatar
                                                            src={feature.icons}
                                                            sx={{ width: 40, height: 40, cursor: 'pointer' }}
                                                            onClick={() => handlePreviewImage(feature.icons)}
                                                        />
                                                        {/* <IconButton
                                                            size="small"
                                                            onClick={() => handlePreviewImage(feature.icons)}
                                                            color="primary"
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton> */}
                                                        <Chip
                                                            label="Icon uploaded"
                                                            color="success"
                                                            size="small"
                                                            onDelete={() => updateFeature(index, 'icons', '')}
                                                        />
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>

                {/* Show Icons Toggle */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={data.showIcons}
                                    onChange={(e) => setData({ ...data, showIcons: e.target.checked })}
                                    color="primary"
                                />
                            }
                            label="Show Icons"
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            Toggle to show/hide feature icons on the welcome page
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" mt={3} pt={2} sx={{ borderTop: 1, borderColor: 'divider' }}>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={fetchData}
                    disabled={submitting}
                >
                    Refresh
                </Button>
            </Box>

            {/* Image Preview Modal */}
            <Modal
                open={previewOpen}
                onClose={closePreview}
                aria-labelledby="image-preview-modal"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                }}
            >
                <Paper
                    sx={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        outline: 'none'
                    }}
                >
                    <IconButton
                        onClick={closePreview}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.7)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '90vh',
                            objectFit: 'contain'
                        }}
                    />
                </Paper>
            </Modal>
        </Box>
    );
};

export default WelcomePage;