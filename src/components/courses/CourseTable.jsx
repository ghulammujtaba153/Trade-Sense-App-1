'use client';

import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Button,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { API_URL } from '@/configs/url';

// Import your modals here
import CourseModal from './CourseModal';
import ModuleModal from './ModuleModal';
import AddCourseModule from './AddCourseModule';


const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuCourseId, setMenuCourseId] = useState(null);
  const [viewModuleModal, setViewModuleModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`);
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'instructor',
      headerName: 'Instructor',
      flex: 1,
      renderCell: (params) => params.row?.instructor?.email || 'N/A',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Typography
          variant="caption"
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor:
              params.value === 'published' ? 'green.100' : 'grey.100',
            color: params.value === 'published' ? 'green.800' : 'grey.800',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,  // Explicit width to make sure icons fit
      getActions: (params) => [
        <GridActionsCellItem
          key="add"
          icon={<AddIcon />}
          label="Add Module"
          onClick={() => {
            setSelectedCourse(params.row);
            setAddModuleModalOpen(true);
          }}
          showInMenu={false}
          color='success'
        />,
        <GridActionsCellItem
          key="view"
          icon={<VisibilityIcon />}
          label="View Modules"
          onClick={() => {
            setSelectedCourse(params.row);
            setViewModuleModal(true);
          }}
          showInMenu={false}
          color='warning'
        />,
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={() => {
            setSelectedCourse(params.row);
            setIsModalOpen(true);
          }}
          color='primary'
          showInMenu={false}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row._id)}
          showInMenu={false}
          color='error'
        />,
        
      ],
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Courses</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Add Course
        </Button>
      </Box>

      <DataGrid
        rows={courses}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': { py: 2 },
        }}
      />

      

      {/* Course edit/add modal */}
      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseData={selectedCourse}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
            fetchCourses();
          }}
        />
      )}

      {/* Module modal for viewing/editing modules */}
      {viewModuleModal && (
        <ModuleModal
          isOpen={viewModuleModal}
          onClose={() => {
            setViewModuleModal(false);
            setSelectedCourse(null);
          }}
          data={selectedCourse}
          onSuccess={() => {
            setViewModuleModal(false);
            setSelectedCourse(null);
            fetchCourses();
          }}
        />
      )}

      {/* AddCourseModule modal */}
      {addModuleModalOpen && (
        <AddCourseModule
          isOpen={addModuleModalOpen}
          onClose={() => {
            setAddModuleModalOpen(false);
            setSelectedCourse(null);
          }}
          data={selectedCourse}
          onSuccess={() => {
            setAddModuleModalOpen(false);
            setSelectedCourse(null);
            fetchCourses();
          }}
        />
      )}
    </Paper>
  );
};

export default CourseTable;
