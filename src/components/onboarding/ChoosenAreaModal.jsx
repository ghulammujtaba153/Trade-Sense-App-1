"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  IconButton,
  Box,
  LinearProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "@/configs/url";
import { toast } from "react-toastify";
import upload from "@/utils/upload";

const ChoosenAreaModal = ({ open, onClose, fetchQuestions, editingData }) => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setQuestion(editingData.text || "");
      setImage(editingData.image || "");
      setImagePreview(editingData.image || "");
    } else {
      setQuestion("");
      setImage("");
      setImagePreview("");
      setImageFile(null);
    }
  }, [editingData]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    try {
      setImageLoading(true);
      toast.info("Uploading image...");

      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
      setImageFile(selectedFile);

      // Upload image
      const uploadedUrl = await upload(selectedFile);
      setImage(uploadedUrl);
      
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error("Image upload failed");
      setImagePreview("");
      setImageFile(null);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: "chosen-area",
        text: question,
        image: image, // Include the image URL in the payload
      };

      const token = localStorage.getItem("token");

      if (editingData) {
        await axios.put(
          `${API_URL}/api/onboarding/questionnaire/${editingData._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API_URL}/api/onboarding/questionnaire`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Added successfully");
      }

      fetchQuestions();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editingData ? "Edit Chosen Area" : "Add Chosen Area"}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Enter Chosen Area Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              fullWidth
              required
            />

            <Button variant="outlined" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {imageLoading && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
                <Box textAlign="center" fontSize={12} mt={0.5}>
                  Uploading image...
                </Box>
              </Box>
            )}

            {imagePreview && (
              <Box sx={{ textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }} 
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={imageLoading}>
            {editingData ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChoosenAreaModal;
