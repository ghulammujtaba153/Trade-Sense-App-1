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
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { API_URL } from "@/configs/url";
import { toast } from "react-toastify";

const ChoosenAreaModal = ({ open, onClose, fetchQuestions, editingData }) => {
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (editingData) {
      setQuestion(editingData.text || "");
    } else {
      setQuestion("");
    }
  }, [editingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: "chosen-area",
        text: question,
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editingData ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChoosenAreaModal;
