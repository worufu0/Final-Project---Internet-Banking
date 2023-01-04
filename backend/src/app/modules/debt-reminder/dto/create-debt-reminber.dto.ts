export class CreateDebtReminber {
  accountNumber: string;
  cash: number;
  description: string;
}

export class PayDebt {
  debtId: string;
  otp: string;
}
