// lib/mock-data.ts

import { Company, User } from "./interface";



// 🏢 Companies
export const mockCompanies: Company[] = [
  {
    name: 'Spectrum MFB',
    email: 'info@spectrummfb.com',
    phone: '+234 701 234 5678',
    account_no: '1234567890',
    address: '32 Adeola Odeku, Lagos',
    rcn: 'RC123456',
    tin: 'TIN001122',
    daily_transfer_limit: "600000",
    single_transfer_limit: "200000"
  },
  {
    name: 'Tech Solutions Ltd',
    email: 'contact@techsolutions.com',
    phone: '+234 802 987 6543',
    address: '45 Ikoyi Crescent, Lagos',
    account_no: '0987654321',
    rcn: 'RC223344',
    tin: 'TIN334455',
    daily_transfer_limit: "800000",
    single_transfer_limit: "300000"
  }
]



export const adminProfile = [
  {
    id: "admin-001",
    name: "John Divine",
    email: "divinejohn65@gmail.com",
    role: "maker", // Admin 1
    phone: "+234 803 555 9921",
  },
  {
    id: "admin-002",
    name: "Grace Chima",
    email: "grace.chima@engitech.com",
    role: "authorizer", // Admin 2
    phone: "+234 812 456 7789",
  },
];

// 📊 Metrics for dashboard
export const mockMetrics = {
  totalAdmins: adminProfile.length,
  totalCompanies: mockCompanies.length
}



export const admins = [
  {
    id: "admin-001",
    name: "John Divine",
    email: "john.divine@engitech.com",
    role: "maker", // Admin 1
    phone: "+234 803 555 9921",
    status: "active",
  },
  {
    id: "admin-002",
    name: "Grace Chima",
    email: "grace.chima@engitech.com",
    role: "authorizer", // Admin 2
    phone: "+234 812 456 7789",
    status: "active",
  },
];

export const pendingActions = [
  {
    id: 'action-001',
    type: 'company_onboarding',
    description: 'New company onboarding: Global Tech Corp',
    initiatedBy: 'admin-001', // Admin 1 (maker)
    createdAt: '2025-10-15T10:00:00Z',
    status: 'pending',
    approvedBy: undefined,
    approvedAt: undefined,
    approverComment: '',
    payload: {
      company: {
        id: 'comp-003',
        name: 'Global Tech Corp',
        email: 'contact@globaltech.com',
        phone: '+234 705 123 4567',
        address: '15 Victoria Island, Lagos',
        rcn: 'RC334455',
        tin: 'TIN556677',
        createdAt: '2025-10-15T10:00:00Z'
      },
      users: [
        {
          name: 'Alice Johnson',
          email: 'alice@globaltech.com',
          role: 'maker'
        }
      ]
    }
  },
  {
    id: 'action-002',
    type: 'mandate_update',
    description: 'Mandate update: Add new user to Tech Solutions Ltd',
    initiatedBy: 'admin-001',
    createdAt: '2025-10-16T14:30:00Z',
    status: 'pending',
    approvedBy: undefined,
    approvedAt: undefined,
    approverComment: '',
    payload: {
      companyId: 'comp-002',
      action: 'add_user',
      user: {
        name: 'Bob Wilson',
        email: 'bob@techsolutions.com',
        role: 'authorizer'
      }
    }
  },
  {
    id: 'action-003',
    type: 'account_unlock',
    description: 'Account unlock request for user-004',
    initiatedBy: 'admin-001',
    createdAt: '2025-10-17T09:15:00Z',
    status: 'pending',
    approvedBy: undefined,
    approvedAt: undefined,
    approverComment: '',
    payload: {
      userId: 'user-004',
      reason: 'Multiple failed login attempts'
    }
  }
];