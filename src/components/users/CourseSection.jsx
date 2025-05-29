import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  CardActions,
  Grid,
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const CourseSection = ({ enrollments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);

  const handleCardClick = (modules) => {
    setSelectedModules(modules);
    setIsModalOpen(true);
  };

  return (
    <Box>
      {enrollments?.length > 0 ? (
        <Grid container spacing={3}>
          {enrollments.map((enrollment) => {
            const { _id, course, instructor, plan, status } = enrollment;

            return (
              <Grid item key={_id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  onClick={() => handleCardClick(course.modules)}
                  sx={{
                    cursor: "pointer",
                    transition: "box-shadow 0.3s",
                    "&:hover": { boxShadow: 6 },
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={course?.thumbnail}
                    alt={course?.title}
                  />

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {course?.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {course?.description || "No description available."}
                    </Typography>

                    <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                      <Chip
                        label={status}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                      <Chip
                        label={plan?.name}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                  </CardContent>

                  <CardActions
                    sx={{
                      borderTop: "1px solid",
                      borderColor: "divider",
                      paddingX: 2,
                      paddingY: 1,
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    {instructor?.profilePicture ? (
                      <Avatar
                        alt={instructor.name}
                        src={instructor.profilePicture}
                        sx={{ width: 48, height: 48 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 48, height: 48 }}>
                        <AccountCircleIcon fontSize="large" />
                      </Avatar>
                    )}

                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {instructor?.name || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Instructor
                      </Typography>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography color="text.secondary" align="center" mt={4}>
          No enrollments found.
        </Typography>
      )}
    </Box>
  );
};

export default CourseSection;
