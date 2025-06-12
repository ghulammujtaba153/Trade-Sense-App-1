"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/configs/url";
import {
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import PageLoader from "../loaders/PageLoader";

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notifications/history`);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notification history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <CheckIcon color="success" fontSize="small" />;
      case "scheduled":
        return <AccessTimeIcon color="primary" fontSize="small" />;
      case "failed":
        return <ErrorIcon color="error" fontSize="small" />;
      default:
        return null;
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  };

  const handleDeleteNotification = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/api/notifications/${id}`);
      toast.success(res.data.message);
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete notification");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      !dateFilter ||
      new Date(n.sendAt).toDateString() === new Date(dateFilter).toDateString();
    return matchesSearch && matchesDate;
  });

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    // {
    //   field: "message",
    //   headerName: "Message",
    //   flex: 2,
    // },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          {getStatusIcon(params.value)}
          {params.value}
        </Box>
      ),
    },
    {
      field: "sendAt",
      headerName: "Sent At",
      flex: 1.5,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
    {
      field: "recipients",
      headerName: "Recipients",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon fontSize="small" color="action" />
          {params.value?.length || 0}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1} alignItems="center" justifyContent="center">
  <Tooltip
    title="View Details"
    slotProps={{
      popper: {
        className: 'capitalize',
      },
      tooltip: {
        sx: {
          backgroundColor: 'var(--mui-palette-background-paper)',
          color: 'var(--mui-palette-text-primary)',
          fontSize: '0.875rem',
          padding: '0.5rem 0.75rem',
        },
      },
    }}
  >
    <IconButton color="primary" onClick={() => handleViewDetails(params.row)}>
      <VisibilityIcon />
    </IconButton>
  </Tooltip>

  <Tooltip
    title="Delete"
    slotProps={{
      popper: {
        className: 'capitalize',
      },
      tooltip: {
        sx: {
          backgroundColor: 'var(--mui-palette-background-paper)',
          color: 'var(--mui-palette-text-primary)',
          fontSize: '0.875rem',
          padding: '0.5rem 0.75rem',
        },
      },
    }}
  >
    <IconButton color="error" onClick={() => handleDeleteNotification(params.row._id)}>
      <DeleteIcon />
    </IconButton>
  </Tooltip>
</Box>

      ),
    },
  ];

  if (loading)
    return (
      <PageLoader/>
    );

  return (
    <Box p={4} component={Paper} elevation={3}>
      <Typography variant="h5" fontWeight={600} mb={4}>
        Notification History
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
        />
        <TextField
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </Box>

      {/* DataGrid Table */}
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Box sx={{ minWidth: '900px' }}>
        <DataGrid
          rows={filteredNotifications.map((n) => ({ ...n, id: n._id }))}
          columns={columns}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25]}
          pagination
          disableSelectionOnClick
          getRowHeight={() => "auto"}
          sx={{
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center", 
              textAlign: "center",
              padding: "6px"
            },
            "& .MuiDataGrid-columnHeader": {
              textAlign: "center",
              justifyContent: "center",
            },
          }}
        />
      </Box>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedNotification?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>Message</Typography>
          <Typography paragraph>{selectedNotification?.message}</Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Status</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {getStatusIcon(selectedNotification?.status)}
                <Typography>{selectedNotification?.status}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Sent At</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography>{new Date(selectedNotification?.sendAt).toLocaleString()}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Recipients</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" color="action" />
                <Typography>{selectedNotification?.recipients?.length || 0}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">Target Roles</Typography>
              <Typography>{selectedNotification?.targetRoles?.join(", ") || selectedNotification?.targetType}</Typography>
            </Grid>
          </Grid>

          {selectedNotification?.logs?.length > 0 && (
            <Box mt={3}>
              <Typography variant="subtitle2" gutterBottom>Delivery Logs</Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {selectedNotification.logs.map((log, idx) => (
                  <li key={idx}>
                    <Typography>
                      <strong>{log.userId?.name || "Unknown user"}:</strong>{" "}
                      Delivered: {log.delivered ? "Yes" : "No"} | Seen: {log.seen ? "Yes" : "No"} | Seen At:{" "}
                      {log.seenAt ? new Date(log.seenAt).toLocaleString() : "-"}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NotificationHistory;
