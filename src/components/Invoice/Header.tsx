import { memo } from 'react';
import { Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type dayjs from 'dayjs';

import { type Currency, CurrencySelect } from '../CurrencySelect';

import { TODAY } from '@/constants';

type HeaderProps = {
  baseCurrency: Currency;
  id: string;
  invoiceDate: dayjs.Dayjs | null;
  onCurrencyChange: (currency: Currency) => void;
  onSetInvoiceDate: (newDate: dayjs.Dayjs | null) => void;
  total: number;
};

const Header = ({
  baseCurrency,
  id,
  invoiceDate,
  onCurrencyChange,
  onSetInvoiceDate,
  total,
}: HeaderProps) => {
  console.log('Header rendered', id);
  return (
    <>
      <Box
        sx={{
          alignContent: 'center',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: 'repeat(3, 1fr)',
          justifyContent: 'center',
          width: 1,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Invoice Date"
            maxDate={TODAY}
            onChange={onSetInvoiceDate}
            value={invoiceDate}
          />
        </LocalizationProvider>
        <CurrencySelect
          id={`${id}-currency`}
          onChange={onCurrencyChange}
          value={baseCurrency.code}
        />
        <p>Total: {total.toFixed(2)}</p>
      </Box>
    </>
  );
};

export const MemoHeader = memo(Header, (before, after) => {
  return (
    before.baseCurrency.code === after.baseCurrency.code &&
    before.invoiceDate?.valueOf() === after.invoiceDate?.valueOf() &&
    before.total === after.total
  );
});
