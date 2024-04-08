import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, FormControl, FormHelperText, TextField } from '@mui/material';

import type { LineItemProps } from './types';

import { ActionButton } from '@/components/ActionButton';
import { CurrencyInput } from '@/components/CurrencyInput';
import { CurrencySelect } from '@/components/CurrencySelect';

export const LineItem = ({
  amount,
  currency,
  description,
  error,
  id,
  onRemove,
  onUpdate,
  sx,
}: LineItemProps) => {
  const hasError = error !== '';

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'minmax(0, 2fr) repeat(3, 1fr)',
        ...sx,
      }}
    >
      <FormControl fullWidth>
        <TextField
          error={hasError}
          id={`description-${id}`}
          label="Description"
          onChange={event => onUpdate({ description: event.target.value, id })}
          sx={{
            flexGrow: 1,
          }}
          type="text"
          value={description ?? ''}
        />
        {hasError ? <FormHelperText error>{error}</FormHelperText> : null}
      </FormControl>

      <CurrencyInput
        error={error}
        hasError={hasError}
        id={id}
        onAmountUpdate={(_, value) => onUpdate({ amount: value, id })}
        value={amount}
      />

      <CurrencySelect
        hasError={hasError}
        id={`currency-select-${id}`}
        label="From"
        onChange={currency => {
          onUpdate({ currency, id });
        }}
        value={currency.code}
      />

      <ActionButton
        onClick={() => {
          if (window.confirm('You sure you want to remove this line item?')) {
            onRemove(id);
          }
        }}
        startIcon={<DeleteIcon />}
        sx={{
          justifySelf: 'flex-end',
        }}
      >
        Remove
      </ActionButton>
    </Box>
  );
};
