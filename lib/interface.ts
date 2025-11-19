
export interface Company {
  name: string
  email: string
  phone: string
  address: string
  rcn: string
  tin: string 
  account_no: string
  daily_transfer_limit: string
  single_transfer_limit: string
}


export interface CorporateUser {
  name: string
  email: string
  phone?: string
  roles: ('initiator' | 'reviewer' | 'approver')[]
}

// Full payload to create corporate account/users
export interface User {
  company_id: number          // corporate/company ID
  account_no: string          // corporate account number
  daily_transfer_limit?: string
  single_transfer_limit?: string
  users: CorporateUser[]     // array of users
}

// API response shape for individual users (matches gateway response)
export interface UserResponse {
  id: number
  name: string
  email: string
  phone_number?: string
  role?: string
  roles?: string[]
  company_name?: string
  company_phone?: string
  company_rcn?: string
  company_tin?: string
  // other optional fields from response
  [key: string]: any
}

export interface CompaniesResponse {
  companies: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface Admin{
    id: string
    name: string
    email: string
    role: 'maker' | 'authorizer' 
    phone: string
}

export interface adminProfile {
    id: string
    name: string
    email: string
    role: 'maker' | 'authorizer' 
    phone: string
}


export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface UsersResponse {
  status: string;
  data: {
    users: CorporateUser[];
    pagination: Pagination;
  };
}