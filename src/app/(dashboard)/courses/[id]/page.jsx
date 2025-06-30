'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';
import PageLoader from '@/components/loaders/PageLoader';
import { Box, Typography } from '@mui/material';

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
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
              <Typography variant="subtitle1" fontWeight="bold">
                {module.title}
              </Typography>
              <Typography variant="body2">{module.description}</Typography>
              <Typography variant="body2">Duration: {module.duration}</Typography>
              {module.url && (
                <audio controls src={module.url} style={{ marginTop: 8, width: '100%' }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Page;
