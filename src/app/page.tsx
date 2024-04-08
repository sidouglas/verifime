'use client';
import { useCallback, useId, useMemo, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import dayjs from 'dayjs';

import { isObjectEmpty, uuid } from '@/utils/uuid';

import { ActionButton } from '../components/ActionButton';

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

type InvoiceActions = 'close' | 'export' | 'import' | 'open';

type ExportState = {
  invoices: {
    currency: string;
    date: string;
    lines: { amount: number; currency: string; description: string }[];
  }[];
};

export default function Index() {
  const id = useId();
  const [state, setState] = useState<Record<string, Invoice>>({
    [id]: {},
  } as Record<string, Invoice>);
  window.state = state;
  const [modalOpenType, setModalOpenType] = useState<InvoiceActions>('close');
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

  const stateToExportJson: ExportState | null = useMemo(() => {
    if (modalOpenType === 'close' || !state) return null;
    return {
      invoices: Object.values(state).map(invoice => {
        return {
          currency: invoice.currency.code,
          date: dayjs(invoice.date).format('YYYY-MM-DD'),
          lines: invoice.lineItems.map(line => {
            return {
              amount: Number(line.amount),
              currency: line.currency.code,
              description: line.description,
            };
          }),
        };
      }),
    };
  }, [state, modalOpenType]);

  const exportJSON = useMemo(() => {
    return modalOpenType === 'export'
      ? JSON.stringify(stateToExportJson, null, 2)
      : '';
  }, [stateToExportJson, modalOpenType]);

  return (
    <>
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
          <ActionButton onClick={handleAddInvoice}>Add Invoice</ActionButton>
          <ActionButton
            onClick={() => setModalOpenType('import')}
            startIcon={<FileCopyIcon />}
          >
            Import
          </ActionButton>
          <ActionButton
            onClick={() => setModalOpenType('export')}
            startIcon={<FileCopyIcon />}
          >
            Export
          </ActionButton>
          {invoiceTotals.length ? (
            <TotalsBox invoiceTotals={invoiceTotals} lineTotals={lineTotals} />
          ) : null}
        </Box>
      </Container>
      <FocusTrap open={modalOpenType !== 'close'}>
        <Dialog
          fullWidth
          onClose={console.log}
          open={modalOpenType !== 'close'}
        >
          <DialogTitle>Import / Export</DialogTitle>
          <DialogContent>
            <Box component="form" noValidate padding="2">
              <Input
                aria-label="Demo input"
                fullWidth
                maxRows={24}
                minRows={8}
                multiline
                placeholder="Invoice JSON here"
                value={exportJSON}
              />
            </Box>
            <ActionButton
              onClick={() => setModalOpenType('close')}
              startIcon={<DoneIcon />}
            >
              Done
            </ActionButton>
          </DialogContent>
        </Dialog>
      </FocusTrap>
    </>
  );
}
