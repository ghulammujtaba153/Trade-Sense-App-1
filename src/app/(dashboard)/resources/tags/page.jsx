"use client";

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddTagModal from '@components/resources/AddTagModal';
import { API_URL } from '@/configs/url';

import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TagsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTag = async (tagName) => {
    try {
      await axios.post(`${API_URL}/api/tags`, { name: tagName });
      fetchTags();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(`${API_URL}/api/tags/${tagId}`);
      fetchTags();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tags`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const filteredTags = data.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={3}
        
      >
        <Typography variant="h5" fontWeight="bold">
          Tags Management
        </Typography>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          
        >
          + Add Tag
        </Button>
      </Box>

      {/* Search */}
      <Box px={4} py={2}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Tags Table */}
      <Box px={4} py={2}>
        {filteredTags.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>#</strong></TableCell>
                  <TableCell><strong>Tag Name</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTags.map((tag, index) => (
                  <TableRow key={tag._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDeleteTag(tag._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography textAlign="center" color="text.secondary">
            No tags found.
          </Typography>
        )}
      </Box>

      {/* Add Modal */}
      <AddTagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTag}
      />
    </Box>
  );
};

export default TagsManagement;
