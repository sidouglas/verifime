import { useState } from 'react';
import { FormControl, TextField } from '@mui/material';

import { TextFieldError } from '../TextFieldError';

import type { DescriptionInputProps } from './types';

import { useDebounce } from '@/hooks/useDebounce';

export const DescriptionInput = ({
  description = '',
  error,
  hasError,
  id,
  onUpdate,
}: DescriptionInputProps) => {
  const [value, setValue] = useState(description);

  const debouncedRequest = useDebounce(() => {
    onUpdate({ description: value.trim(), id });
  });

  const handleChange = (value: string) => {
    setValue(value);
    debouncedRequest();
  };

  return (
    <FormControl fullWidth>
      <TextField
        error={hasError}
        id={`description-${id}`}
        label="Description"
        onChange={event => handleChange(event.target.value)}
        sx={{
          flexGrow: 1,
        }}
        type="text"
        value={value}
      />
      <TextFieldError error={error} />
    </FormControl>
  );
};
