"use client"

import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import { API_URL } from "@/configs/url";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Chip,
  Paper,
  Stack,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import GroupIcon from '@mui/icons-material/Group';
import { Autocomplete } from "@mui/material";

const mockRoles = [
  { id: 'admin', name: 'Admin' },
  { id: 'editor', name: 'Editor' },
  { id: 'user', name: 'User' }
];

export default function CreateNotification() {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetType: "all",
    sendType: "now",
    sendAt: new Date().toISOString().slice(0, 16),
  });
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/users`);
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const validateForm = () => {
    if (!formData.title || formData.title.length < 2 || formData.title.length > 100) {
      return "Title must be between 2 and 100 characters.";
    }
    if (!formData.message || formData.message.length < 5 || formData.message.length > 500) {
      return "Message must be between 5 and 500 characters.";
    }
    if (formData.targetType === "specific" && selectedUsers.length === 0) {
      return "Please select at least one user.";
    }
    if (formData.targetType === "roles" && selectedRoles.length === 0) {
      return "Please select at least one role.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const notificationData = {
        ...formData,
        recipients: formData.targetType === "specific" ? selectedUsers.map((user) => user._id) : [],
        targetRoles: formData.targetType === "roles" ? selectedRoles : [],
        status: formData.sendType === "now" ? "sent" : "scheduled",
      };

      await axios.post(`${API_URL}/api/notifications/create`, notificationData);
      toast.success("Notification created successfully!");

      setFormData({
        title: "",
        message: "",
        targetType: "all",
        sendType: "now",
        sendAt: new Date().toISOString().slice(0, 16),
      });
      setSelectedUsers([]);
      setSelectedRoles([]);
    } catch (error) {
      toast.error("There was an error creating your notification.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user]
    );
  };

  const handleSelectRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} p={4} borderRadius={2} boxShadow={2}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>Create New Notification</Typography>

      <Stack spacing={3}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
        />

        <TextField
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          multiline
          rows={4}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Recipient Type</InputLabel>
          <Select
            name="targetType"
            value={formData.targetType}
            label="Recipient Type"
            onChange={handleInputChange}
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="specific">Specific Users</MenuItem>
            <MenuItem value="roles">By User Role</MenuItem>
          </Select>
        </FormControl>

       {formData.targetType === "specific" && (
  <Autocomplete
    multiple
    options={users}
    getOptionLabel={(option) => `${option.name} (${option.email})`}
    filterSelectedOptions
    value={selectedUsers}
    onChange={(event, newValue) => setSelectedUsers(newValue)}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Select Users"
        placeholder="Search and select users"
        fullWidth
      />
    )}
    renderTags={(tagValue, getTagProps) =>
      tagValue.map((option, index) => (
        <Chip
          label={option.name}
          {...getTagProps({ index })}
          key={option._id}
        />
      ))
    }
  />
)}

        {formData.targetType === "roles" && (
          <Box>
            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
              {selectedRoles.map(roleId => {
                const role = mockRoles.find(r => r.id === roleId);
                return (
                  <Chip
                    key={roleId}
                    label={role?.name || roleId}
                    onDelete={() => setSelectedRoles(prev => prev.filter(id => id !== roleId))}
                    color="success"
                  />
                );
              })}
            </Stack>

            {mockRoles.map((role) => (
              <Box key={role.id} display="flex" alignItems="center">
                <Checkbox
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleSelectRole(role.id)}
                />
                <Typography>{role.name}</Typography>
              </Box>
            ))}
          </Box>
        )}

        <FormControl fullWidth>
          <InputLabel>Send Type</InputLabel>
          <Select
            name="sendType"
            value={formData.sendType}
            label="Send Type"
            onChange={handleInputChange}
          >
            <MenuItem value="now">Send Immediately</MenuItem>
            <MenuItem value="scheduled">Schedule for Later</MenuItem>
          </Select>
        </FormControl>

        {formData.sendType === "scheduled" && (
          <TextField
            type="datetime-local"
            name="sendAt"
            label="Send At"
            value={formData.sendAt}
            onChange={handleInputChange}
            fullWidth
          />
        )}

        <Button type="submit" variant="contained" color="primary">Create Notification</Button>
      </Stack>
    </Box>
  );
}
