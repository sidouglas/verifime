import React from 'react';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';

import type { ActionButtonProps } from './types';

export const ActionButton = ({ children, sx, ...rest }: ActionButtonProps) => {
  return (
    <Button
      color="primary"
      startIcon={<Add />}
      sx={{
        display: 'flex',
        maxHeight: 40,
        textTransform: 'none',
        ...sx,
      }}
      variant="contained"
      {...rest}
    >
      {children}
    </Button>
  );
};
