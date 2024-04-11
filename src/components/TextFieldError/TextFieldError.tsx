import { FormHelperText } from '@mui/material';

import type { TextFieldErrorProps } from './types';

export const TextFieldError = ({ error }: TextFieldErrorProps) => {
  const hasError = error !== '';
  return hasError ? (
    <FormHelperText error sx={{ bottom: 1, position: 'absolute' }}>
      {error}
    </FormHelperText>
  ) : null;
};
