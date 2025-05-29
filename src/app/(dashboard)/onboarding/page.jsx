"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Stack,
  Paper,
} from "@mui/material";
import { Delete, Edit, Add, Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { API_URL } from "@/configs/url";

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [questionInput, setQuestionInput] = useState("");
  const [optionsInput, setOptionsInput] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/onboarding/questionnaire`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setQuestions(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch questions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const resetForm = () => {
    setQuestionInput("");
    setOptionsInput([""]);
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleAddQuestion = async () => {
    if (!questionInput.trim() || optionsInput.some((o) => !o.trim())) {
      return toast.error("Question and all options are required");
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/onboarding/questionnaire`,
        { question: questionInput, options: optionsInput },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setQuestions((prev) => [...prev, res.data]);
      toast.success("Question added");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuestion = async (q) => {
    if (!questionInput.trim() || optionsInput.some((o) => !o.trim())) {
      return toast.error("Question and all options are required");
    }

    setIsLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/onboarding/questionnaire/${q._id}`,
        { question: questionInput, options: optionsInput },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setQuestions((prev) =>
        prev.map((question) => (question._id === q._id ? res.data : question))
      );
      toast.success("Question updated");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/onboarding/questionnaire/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdate = () => {
    if (editingId) {
      const target = questions.find((q) => q._id === editingId);
      handleEditQuestion(target);
    } else {
      handleAddQuestion();
    }
  };

  const handleOptionChange = (i, val) => {
    const updated = [...optionsInput];
    updated[i] = val;
    setOptionsInput(updated);
  };

  const columns = [
    {
      field: "question",
      headerName: "Question",
      flex: 1,
      renderCell: (params) => <Typography>{params.value}</Typography>,
    },
    {
      field: "options",
      headerName: "Options",
      flex: 1,
      renderCell: (params) =>
        params.value.map((opt, idx) => (
          <Typography key={idx} variant="body2">
            {idx + 1}. {opt}
          </Typography>
        )),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            disabled={isLoading}
            onClick={() => {
              const q = params.row;
              setEditingId(q._id);
              setQuestionInput(q.question);
              setOptionsInput(q.options);
              setShowAddForm(false);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            disabled={isLoading}
            onClick={() => handleDeleteQuestion(params.row._id)}
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box p={3} sx={{bgcolor:"background.paper", borderRadius: 2}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Onboarding Questionnaire
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled={isLoading || showAddForm}
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
            setQuestionInput("");
            setOptionsInput([""]);
          }}
        >
          Add Question
        </Button>
      </Stack>

      {(showAddForm || editingId !== null) && (
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <TextField
            fullWidth
            label="Question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          {optionsInput.map((opt, idx) => (
            <Stack direction="row" spacing={1} alignItems="center" key={idx} mb={2}>
              <TextField
                fullWidth
                label={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                disabled={isLoading}
              />
              {optionsInput.length > 1 && (
                <IconButton
                  onClick={() =>
                    setOptionsInput(optionsInput.filter((_, i) => i !== idx))
                  }
                  disabled={isLoading}
                >
                  <Close />
                </IconButton>
              )}
            </Stack>
          ))}
          <Button
            size="small"
            onClick={() => setOptionsInput([...optionsInput, ""])}
            disabled={isLoading}
          >
            + Add Option
          </Button>

          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              onClick={handleAddOrUpdate}
              disabled={isLoading}
            >
              {editingId ? "Update" : "Add"}
            </Button>
            <Button variant="outlined" onClick={resetForm} disabled={isLoading}>
              Cancel
            </Button>
          </Stack>
        </Paper>
      )}

      {isLoading && !questions.length ? (
        <Box textAlign="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          autoHeight
          rows={questions.map((q) => ({ ...q, id: q._id }))}
          columns={columns}
          disableRowSelectionOnClick
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      )}
    </Box>
  );
};

export default Page;
