'use client';
import { useCallback, useId, useMemo, useState } from 'react';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type dayjs from 'dayjs';

import { isObjectEmpty, uuid } from '@/utils/uuid';

import { ActionButton } from '../components/ActionButton';

import type { Currency } from '@/components/CurrencySelect';
import type { LineItemModel } from '@/components/Invoice';
import { Invoice } from '@/components/Invoice';
import type { InvoiceTotal } from '@/components/Invoice/LineItem';
import { JsonDialog } from '@/components/JsonDialog';
import { TotalsBox } from '@/components/TotalsBox';

export type Invoice = {
  currency: Currency;
  date: dayjs.Dayjs;
  id: string;
  lineTotals?: InvoiceTotal[];
  lines: LineItemModel[];
  total: number;
};

export type InvoiceActions = 'close' | 'export' | 'import' | 'open';

export default function Index() {
  const id = useId();
  const [state, setState] = useState<Record<string, Invoice | undefined>>({
    [id]: undefined,
  });
  const [modalOpenType, setModalOpenType] = useState<InvoiceActions>('close');
  const invoiceTotals = useMemo(() => {
    return Object.values(state)
      .map(value => {
        if (!value) return;
        const { currency, total } = value;
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
      if (!invoice?.lines) return;
      invoice.lines.forEach(line => {
        if (!isObjectEmpty(line)) {
          const { code } = line.currency;
          const amount = Number(line.amount);
          totals[code] = {
            amount: (totals[code]?.amount ?? 0) + amount,
            currency: line.currency,
          };
        }
      });
    });
    return Object.values(totals);
  }, [state]);

  const handleTotalChange = useCallback(
    (invoice: Invoice) => {
      const id = invoice.id;
      if (!id) return;
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

  const handleOnImport = useCallback((importState: Record<string, Invoice>) => {
    setState(importState);
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            aligns: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            my: 4,
          }}
        >
          <Typography component="h1" gutterBottom variant="h4">
            Multi Currency Invoice
          </Typography>
          {Object.entries(state).map(([id, invoice]) => (
            <Invoice
              key={id}
              invoice={{ id, ...invoice }}
              onTotalChange={handleTotalChange}
            />
          ))}
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
          {invoiceTotals.length ? (
            <TotalsBox invoiceTotals={invoiceTotals} lineTotals={lineTotals} />
          ) : null}
        </Box>
      </Container>
      <JsonDialog
        modalOpenType={modalOpenType}
        onImport={handleOnImport}
        setModalOpenType={setModalOpenType}
        state={state}
      />
    </>
  );
}
