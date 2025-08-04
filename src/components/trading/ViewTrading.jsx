import React from 'react';
import { Typography, Divider, Stack } from '@mui/material';

const ViewTrading = ({ data }) => {
  return (
    <Stack spacing={1}>
      <Typography variant="h6">Trade Details</Typography>
      <Divider />
      <Typography><strong>Date:</strong> {new Date(data.tradeDate).toLocaleDateString()}</Typography>
      <Typography><strong>Type:</strong> {data.tradeType}</Typography>
      <Typography><strong>Setup:</strong> {data.setupName}</Typography>
      <Typography><strong>Direction:</strong> {data.direction}</Typography>
      <Typography><strong>Entry Price:</strong> {data.entryPrice}</Typography>
      <Typography><strong>Exit Price:</strong> {data.exitPrice}</Typography>
      <Typography><strong>Quantity:</strong> {data.quantity}</Typography>
      <Typography><strong>Stop Loss:</strong> {data.stopLoss}</Typography>
      <Typography><strong>Take Profit Target:</strong> {data.takeProfitTarget}</Typography>
      <Typography><strong>Actual Exit Price:</strong> {data.actualExitPrice}</Typography>
      <Typography><strong>Emotional State:</strong> {data.emotionalState}</Typography>
      <Typography><strong>Notes:</strong> {data.notes}</Typography>
      <Typography><strong>Image:</strong> {data.image}</Typography>
      <Typography><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</Typography>
    </Stack>
  );
};

export default ViewTrading;
