import React from 'react';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Grid } from '@mui/material';

import type { InvoiceControlsProps } from './types';

import { ActionButton } from '@/components/ActionButton';

export const InvoiceControls = ({
  handleAddInvoice,
  setModalOpenType,
}: InvoiceControlsProps) => {
  console.log('InvoiceControls');
  return (
    <Grid container spacing={2}>
      <Grid item>
        <ActionButton
          onClick={() => setModalOpenType('import')}
          startIcon={<FileCopyIcon />}
        >
          Import
        </ActionButton>
      </Grid>
      <Grid item>
        <ActionButton
          onClick={() => setModalOpenType('export')}
          startIcon={<FileCopyIcon />}
        >
          Export
        </ActionButton>
      </Grid>
      <Grid item ml="auto">
        <ActionButton onClick={handleAddInvoice} sx={{ ml: 'auto' }}>
          Add Invoice
        </ActionButton>
      </Grid>
    </Grid>
  );
};

export const MemoedInvoiceControls = React.memo(
  InvoiceControls,
  (before, after) => {
    return before.handleAddInvoice === after.handleAddInvoice;
  },
);
