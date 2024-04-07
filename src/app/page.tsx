'use client';
import { useCallback, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type dayjs from 'dayjs';

import { isObjectEmpty, uuid } from '@/utils/uuid';

import { AddItemButton } from '@/components/AddItemButton';
import type { Currency } from '@/components/CurrencySelect';
import { Invoice } from '@/components/Invoice';
import type {
  InvoiceTotal,
  LineItemModel,
} from '@/components/Invoice/LineItem';
import { TotalsBox } from '@/components/TotalsBox';

export type Invoice = {
  currency: Currency;
  date: dayjs.Dayjs;
  lineItems: LineItemModel[];
  lineTotals?: InvoiceTotal[];
  total: number;
};

const DEFAULT_ID = uuid();
const DEFAULT_INVOICE = { [DEFAULT_ID]: {} } as Record<string, Invoice>;

export default function Home() {
  const [state, setState] = useState<Record<string, Invoice>>(DEFAULT_INVOICE);
  const invoiceTotals = useMemo(() => {
    return Object.values(state)
      .map(({ currency, total }) => {
        if (!currency || !total) return;
        return {
          amount: total,
          currency,
        };
      })
      .filter(Boolean) as InvoiceTotal[];
  }, [state]);

  const lineTotals = useMemo(() => {
    const totals: Record<
      Currency['code'],
      { amount: number; currency: Currency }
    > = {};
    Object.values(state).forEach(invoice => {
      if (!invoice?.lineItems) return;
      invoice.lineItems.forEach(lineItem => {
        if (!isObjectEmpty(lineItem)) {
          const { code } = lineItem.currency;
          const amount = Number(lineItem.amount);
          totals[code] = {
            amount: (totals[code]?.amount ?? 0) + amount,
            currency: lineItem.currency,
          };
        }
      });
    });
    return Object.values(totals);
  }, [state]);

  const handleTotalChange = useCallback(
    (id: string, invoice: Invoice) => {
      setState(prevState => ({
        ...prevState,
        [id]: {
          ...(prevState ? prevState[id] : null),
          ...invoice,
        },
      }));
    },
    [setState],
  );

  const handleAddInvoice = useCallback(() => {
    const id = uuid();
    setState(prevState => ({
      ...prevState,
      [id]: {} as Invoice,
    }));
  }, [setState]);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          my: 4,
        }}
      >
        <Typography component="h1" gutterBottom variant="h4">
          Multi Currency Invoice
        </Typography>
        {Object.keys(state).map(id => (
          <Invoice key={id} id={id} onTotalChange={handleTotalChange} />
        ))}
        <AddItemButton onClick={handleAddInvoice}>Add Invoice</AddItemButton>
        {invoiceTotals.length ? (
          <TotalsBox invoiceTotals={invoiceTotals} lineTotals={lineTotals} />
        ) : null}
      </Box>
    </Container>
  );
}
