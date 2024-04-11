import type { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

import type { Invoice, InvoiceActions } from '@/app/Invoice';

export type JsonDialogProps = {
  modalOpenType: InvoiceActions;
  onImport: (state: Record<string, Invoice>) => void;
  setModalOpenType: Dispatch<SetStateAction<InvoiceActions>>;
  state: Record<string, Invoice | undefined>;
};

export const zodJsonImportExport = z.object({
  invoices: z.array(
    z.object({
      currency: z.string(),
      date: z.string(),
      lines: z.array(
        z.object({
          amount: z.number(),
          currency: z.string(),
          description: z.string(),
        }),
      ),
    }),
  ),
});

export type JsonImportExport = Prettify<z.infer<typeof zodJsonImportExport>>;
