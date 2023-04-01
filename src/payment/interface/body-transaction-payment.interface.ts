export type BodyTransactionPayment = {
    amount_in_cents: number,
    currency: string,
    customer_email: string,
    reference: string,
    payment_source_id: number,
    payment_method?: {
      installments: number
    }
  };