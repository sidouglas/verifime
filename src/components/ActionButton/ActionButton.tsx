import React from 'react';
import { Add } from '@mui/icons-material';
import { Button, Container } from '@mui/material';

import type { ActionButtonProps } from './types';

export const ActionButton = ({ children, sx, ...rest }: ActionButtonProps) => {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}
    >
      <Button
        color="primary"
        startIcon={<Add />}
        sx={{
          mb: 2,
          textTransform: 'none',
          ...sx,
        }}
        variant="contained"
        {...rest}
      >
        {children}
      </Button>
    </Container>
  );
};
