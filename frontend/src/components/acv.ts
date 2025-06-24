export interface ACVData {
  fiscal_quarter: string;
  customer_type: "Existing Customer" | "New Customer";
  acv: number;
  count: number;
}
