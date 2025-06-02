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
  CircularProgress,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import upload from "@/utils/upload";
import axios from "axios";
import { API_URL } from "@/configs/url";
import { toast } from "react-toastify";

const GoalModal = ({ open, onClose, fetchQuestions, editingData }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setTitle(editingData.text || "");
      setImage(editingData.image || "");
      setFile(null);
    } else {
      setTitle("");
      setFile(null);
      setImage("");
    }
  }, [editingData]);

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    setImageLoading(true);
    try {
      const uploadedUrl = await upload(selectedFile);
      setImage(uploadedUrl);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        text: title,
        type: "goals", // Adjust this according to your backend's expected type
        image: image,
      };

      const token = localStorage.getItem("token");

      if (editingData) {
        await axios.put(`${API_URL}/api/onboarding/questionnaire/${editingData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Goal updated");
      } else {
        await axios.post(`${API_URL}/api/onboarding/questionnaire`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Goal added");
      }

      fetchQuestions();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editingData ? "Edit Goal" : "Add Goal"}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Goal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <Button variant="outlined" component="label" disabled={imageLoading}>
              {image ? "Change Image" : "Upload Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const selected = e.target.files[0];
                  setFile(selected);
                  handleFileChange(selected);
                }}
              />
            </Button>

            {imageLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={20} />
                <Typography>Uploading image...</Typography>
              </Stack>
            ) : (
              image && (
                <img
                  src={image}
                  alt="Preview"
                  style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 8 }}
                />
              )
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || imageLoading}>
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : editingData ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GoalModal;
