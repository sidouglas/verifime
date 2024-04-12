import type { Dispatch, SetStateAction } from 'react';

import type { InvoiceActions } from '@/app/page';

export type InvoiceControlsProps = {
  handleAddInvoice: () => void;
  setModalOpenType: Dispatch<SetStateAction<InvoiceActions>>;
};
