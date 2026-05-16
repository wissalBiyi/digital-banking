export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  description: string;
}

export interface AccountDetails {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[];
}
