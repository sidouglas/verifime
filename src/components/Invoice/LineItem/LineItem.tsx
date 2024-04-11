import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';

import type { LineItemProps } from './types';

import { ActionButton } from '@/components/ActionButton';
import { CurrencyInput } from '@/components/CurrencyInput';
import { CurrencySelect } from '@/components/CurrencySelect';
import { DescriptionInput } from '@/components/DescriptionInput';

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
        justifyItems: 'center',
        mb: 2,
        ...sx,
      }}
    >
      <DescriptionInput
        description={description}
        error={error}
        hasError={hasError}
        id={id}
        onUpdate={onUpdate}
      />

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
        sx={{ alignSelf: 'center', marginLeft: 'auto' }}
      >
        Remove
      </ActionButton>
    </Box>
  );
};
