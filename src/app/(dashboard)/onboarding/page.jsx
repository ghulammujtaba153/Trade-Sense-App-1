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
  Tooltip,
  Divider,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "@/configs/url";
import QuestionnaireModal from "@/components/onboarding/QuestionnaireModal";
import PageLoader from "@/components/loaders/PageLoader";

const Page = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchQuestionnaires = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/onboarding/questionnaire`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setQuestionnaires(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch questionnaires");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/onboarding/questionnaire/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setQuestionnaires((prev) => prev.filter((q) => q._id !== id));
      toast.success("Questionnaire deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (q) => {
    setEditingData(q);
    setShowModal(true);
  };

  return (
    <Box p={3} sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Onboarding Questionnaires
      </Typography>

      <Box mb={3}>
        <Button variant="contained" onClick={() => { setEditingData(null); setShowModal(true); }}>
          + Add Questionnaire
        </Button>
      </Box>

      {isLoading && !questionnaires.length ? (
        <Box textAlign="center" py={5}>
          <PageLoader />
        </Box>
      ) : (
        <Stack spacing={3}>
          {questionnaires.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No questionnaires added yet.
            </Typography>
          )}

          {questionnaires.map((q) => (
            <Card key={q._id} sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">{q.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {q.subTitle}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(q)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(q._id)} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                {q.questions.map((question, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ border: "1px solid #ddd", p: 1, borderRadius: 2 }}
                  >
                    {q.images && question.image && (
                      <CardMedia
                        component="img"
                        image={question.image}
                        alt={`Q-${index + 1}`}
                        sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }}
                      />
                    )}
                    <Typography>{question.text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      {showModal && (
        <QuestionnaireModal
          open={showModal}
          onClose={() => setShowModal(false)}
          fetchQuestions={fetchQuestionnaires}
          editingData={editingData}
        />
      )}
    </Box>
  );
};

export default Page;
