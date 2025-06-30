'use client';

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Stack,
  Card,
  CardMedia,
  Tooltip,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { API_URL } from "@/configs/url";
import QuestionnaireModal from "@/components/onboarding/QuestionnaireModal";
import PageLoader from "@/components/loaders/PageLoader";

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
};

const Page = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
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
        <PageLoader />
      ) : questionnaires.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No questionnaires added yet.
        </Typography>
      ) : (
        <>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="questionnaire tabs"
            sx={{ mb: 2 }}
          >
            {questionnaires.map((q, i) => (
              <Tab label={q.title || `Untitled ${i + 1}`} key={q._id} />
            ))}
          </Tabs>

          {questionnaires.map((q, i) => (
            <TabPanel value={tabIndex} index={i} key={q._id}>
              <Card sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6">{q.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {q.subTitle}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit" slotProps={{
              popper: {
                className: 'capitalize',
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    color: 'var(--mui-palette-text-primary)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }
                }
              }
            }}>
                      <IconButton onClick={() => handleEdit(q)} color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" slotProps={{
              popper: {
                className: 'capitalize',
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    color: 'var(--mui-palette-text-primary)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }
                }
              }
            }}>
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
                      // sx={{ border: "1px solid #ddd", p: 1, borderRadius: 2 }}
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
            </TabPanel>
          ))}
        </>
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
