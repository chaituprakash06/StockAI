// types/database.ts

export type Company = {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  
  export type Shareholder = {
    id: string;
    company_id: string;
    name: string;
    shares: number;
    percentage: number;
    created_at: string;
    updated_at: string;
  };
  
  export type Safe = {
    id: string;
    company_id: string;
    investor_name: string;
    amount: number;
    valuation_cap: number | null;
    discount_rate: number | null;
    type: string;
    date: string;
    created_at: string;
    updated_at: string;
  };
  
  export type Round = {
    id: string;
    company_id: string;
    name: string;
    amount: number | null;
    valuation: number | null;
    investor_name: string | null;
    include_safes: boolean;
    created_at: string;
    updated_at: string;
  };