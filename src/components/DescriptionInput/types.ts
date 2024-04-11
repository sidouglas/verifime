import type { PartialLineItemModel } from '../Invoice/LineItem/types';

export type DescriptionInputProps = {
  description: string;
  error: string | undefined;
  hasError: boolean;
  id: string;
  onUpdate: (data: PartialLineItemModel) => void;
};
