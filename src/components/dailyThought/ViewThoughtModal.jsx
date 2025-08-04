import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ViewThoughtModal = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Daily Thought Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {data.description}
        </Typography>

        <div style={{ margin: "16px 0" }}>
          <Typography variant="subtitle2">Image:</Typography>
          <img
            src={data.image}
            alt="Thought"
            style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }}
          />
        </div>

        <div style={{ margin: "16px 0" }}>
          <Typography variant="subtitle2">Audio:</Typography>
          <audio controls src={data.audio} style={{ width: "100%" }} />
        </div>

        {data.instructor && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <strong>Instructor:</strong> {data.instructor?.name || data.instructor}
          </Typography>
        )}
        
        {data.duration && (
          <Typography variant="body2" color="text.secondary">
            <strong>Duration:</strong> {data.duration} seconds
          </Typography>
        )}
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Created: {new Date(data.createdAt).toLocaleDateString()}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewThoughtModal;
