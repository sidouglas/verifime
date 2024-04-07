import React from 'react';
import { Button, Container } from '@mui/material';

import type { AddItemButtonProps } from './types';

export const AddItemButton = ({ children, ...rest }: AddItemButtonProps) => {
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
        startIcon="➕"
        sx={{
          mb: 2,
        }}
        {...rest}
      >
        {children}
      </Button>
    </Container>
  );
};
