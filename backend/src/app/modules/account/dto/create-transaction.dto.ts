export class CreateTransaction {
  accountNumber: string;
  cash: number;
  otp: string;
  description: string;
}

export class QueryAccount {
  accountNumber: string;
}
