"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "@/configs/url";
import GoalModal from "@/components/onboarding/GoalModal";
import ChoosenAreaModal from "@/components/onboarding/ChoosenAreaModal";
import PageLoader from "@/components/loaders/PageLoader";

const Page = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionType, setQuestionType] = useState(null); // 'goals' | 'chosen-area'
  const [showModal, setShowModal] = useState(false);

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

  const handleDeleteQuestion = async (id) => {

    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/onboarding/questionnaire/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (q) => {
    setEditingQuestion(q);
    setQuestionType(q.type);
    setShowModal(true);
  };

  const renderSection = (type, title, modalType) => {
    const filtered = questions.filter((q) => q.type === type);
    return (
      <Box mb={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{title}</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setEditingQuestion(null);
              setQuestionType(modalType);
              setShowModal(true);
            }}
          >
            + Add {title}
          </Button>
        </Stack>

        <Stack spacing={2}>
          {filtered.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No {title.toLowerCase()} added yet.
            </Typography>
          )}

          {filtered.map((q) => (
            <Card key={q._id} sx={{ display: "flex", alignItems: "center", p: 1 }}>
              {q.image && (
                <CardMedia
                  component="img"
                  image={q.image}
                  alt={q.text}
                  sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 2, mr: 2 }}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="body1">{q.text}</Typography>
              </CardContent>
              <Stack direction="row" spacing={1} mr={2}>
                <IconButton color="primary" onClick={() => handleEditClick(q)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteQuestion(q._id)}>
                  <Delete />
                </IconButton>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Box p={3} sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Onboarding Questionnaire
      </Typography>

      {isLoading && !questions.length ? (
        <Box textAlign="center" py={5}>
          <PageLoader />
        </Box>
      ) : (
        <>
          {renderSection("goals", "Goals", "goals")}
          {renderSection("chosen-area", "Chosen Areas", "chosen-area")}
        </>
      )}

      {showModal && questionType === "goals" && (
        <GoalModal
          open={showModal}
          onClose={() => setShowModal(false)}
          fetchQuestions={fetchQuestions}
          editingData={editingQuestion}
        />
      )}

      {showModal && questionType === "chosen-area" && (
        <ChoosenAreaModal
          open={showModal}
          onClose={() => setShowModal(false)}
          fetchQuestions={fetchQuestions}
          editingData={editingQuestion}
        />
      )}
    </Box>
  );
};

export default Page;
