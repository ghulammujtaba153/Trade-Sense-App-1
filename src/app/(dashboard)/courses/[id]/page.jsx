'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';
import PageLoader from '@/components/loaders/PageLoader';
import { Box, Typography } from '@mui/material';
import EditModule from '@/components/courses/EditModule';

import { ArrowBack, EditRounded, DeleteRounded } from '@mui/icons-material';

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const router = useRouter();

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/${id}`);
      setData(res.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditModule = (module) => {
    setSelectedModule(module);
    setIsEditOpen(true);
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await axios.delete(`${API_URL}/api/modules/${moduleId}`);
        toast.success('Module deleted successfully');
        fetch(); // Refresh the data to show updated modules
      } catch (error) {
        console.error('Failed to delete module:', error);
        toast.error(error.response?.data?.message || 'Failed to delete module');
      }
    }
  };

  const handleModuleUpdated = () => {
    fetch(); // Refresh the data to show updated module
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedModule(null);
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <ArrowBack onClick={() => router.back()} className='cursor-pointer' />

        <Box>
          <img
            src={data.thumbnail}
            alt={data.title}
            style={{ width: '100%', maxWidth: '400px', borderRadius: 8 }}
          />
        </Box>

        <Box>
          <Typography variant="h4">{data.title}</Typography>
          <Typography variant="body1">{data.description}</Typography>
          <Typography variant="body1">Price: {data.price}</Typography>
          <Typography variant="body1">Duration: {data.duration}</Typography>
          <Typography variant="body1">
            Created At: {new Date(data.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">Premium: {data.isPremium ? 'Yes' : 'No'}</Typography>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" mb={2}>
            Course Modules
          </Typography>

          {data.courseModules?.map((module, index) => (
            <Box
              key={index}
              p={2}
              mb={2}
              boxShadow={1}
              
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {module.title}
                </Typography>
                <Box display="flex" gap={1}>
                  <EditRounded 
                    onClick={() => handleEditModule(module)} 
                    className='cursor-pointer'
                    sx={{ color: 'primary.main', '&:hover': { color: 'primary.dark' } }}
                  />
                  <DeleteRounded 
                    onClick={() => handleDeleteModule(module._id)} 
                    className='cursor-pointer'
                    sx={{ color: 'error.main', '&:hover': { color: 'error.dark' } }}
                  />
                </Box>
              </Box>
              <Typography variant="body2">{module.description}</Typography>
              <Typography variant="body2">Duration: {module.duration}</Typography>
              {module.url && (
  <div style={{ marginTop: 8 }}>
    <audio controls src={module.url} style={{ width: '100%' }} />
    <div style={{ marginTop: 4, textAlign: 'right' }}>
      <a href={module.url} download target="_blank" rel="noopener noreferrer">
        ⋮ Download
      </a>
    </div>
  </div>
)}

            </Box>
          ))}
        </Box>
      </Box>
      
      {/* Edit Module Dialog */}
      <EditModule 
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        data={selectedModule}
        onModuleUpdated={handleModuleUpdated}
      />
    </div>
  );
};

export default Page;
