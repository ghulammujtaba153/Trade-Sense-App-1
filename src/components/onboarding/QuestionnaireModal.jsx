"use client";

import React, { useEffect, useState } from "react";
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
  Switch,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import upload from "@/utils/upload";
import axios from "axios";
import { API_URL } from "@/configs/url";
import { toast } from "react-toastify";

const QuestionnaireModal = ({ open, onClose, fetchQuestions, editingData }) => {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [imagesEnabled, setImagesEnabled] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setTitle(editingData.title || "");
      setSubTitle(editingData.subTitle || "");
      setImagesEnabled(editingData.images ?? true);
      setQuestions(editingData.questions || []);
    } else {
      setTitle("");
      setSubTitle("");
      setImagesEnabled(true);
      setQuestions([]);
    }
  }, [editingData]);

  const handleQuestionChange = (index, key, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [key]: value } : q))
    );
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;
    try {
      const url = await upload(file);
      handleQuestionChange(index, "image", url);
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", image: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subTitle || questions.length === 0) {
      return toast.error("Please fill all required fields and add at least one question.");
    }

    setLoading(true);
    const payload = {
      title,
      subTitle,
      images: imagesEnabled,
      questions,
    };

    const token = localStorage.getItem("token");

    try {
      if (editingData) {
        await axios.put(`${API_URL}/api/onboarding/questionnaire/${editingData._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Questionnaire updated");
      } else {
        await axios.post(`${API_URL}/api/onboarding/questionnaire`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Questionnaire created");
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editingData ? "Edit Questionnaire" : "Add Questionnaire"}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Subtitle"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              fullWidth
              required
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Enable Image:</Typography>
              <Switch checked={imagesEnabled} onChange={() => setImagesEnabled(!imagesEnabled)} />
            </Stack>

            <Typography variant="h6">Questions</Typography>
            {questions.map((question, index) => (
              <Stack key={index} spacing={1} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2 }}>
                <TextField
                  label={`Question ${index + 1}`}
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, "text", e.target.value)}
                  required
                  fullWidth
                />
                
                  <>
                    <Button component="label" variant="outlined">
                      {question.image ? "Change Image" : "Upload Image"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0], index)}
                      />
                    </Button>
                    {question.image && (
                      <img
                        src={question.image}
                        alt={`Question ${index + 1}`}
                        style={{ maxHeight: 150, objectFit: "contain", borderRadius: 8 }}
                      />
                    )}
                  </>
                
                <Button color="error" onClick={() => handleRemoveQuestion(index)}>
                  Remove Question
                </Button>
              </Stack>
            ))}

            <Button onClick={handleAddQuestion} variant="outlined">
              Add Question
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : editingData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default QuestionnaireModal;
