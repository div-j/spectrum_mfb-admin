# Spectrum MFB - Dual Interface Banking Application Build Plan

## 🏗️ Project Overview

Building **two separate frontends** for Spectrum MFB:
1. **Admin Portal** (Internal Use Only) - Biometric authentication
2. **Customer App** (External, Cloud-Based) - Entrust soft token authentication

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15** (App Router) ✅ Already set up
- **TypeScript** ✅ Already configured
- **Tailwind CSS** ✅ Already configured

### UI Components & Styling
- **ShadCN/UI** - Component library with Radix UI primitives
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first styling

### State Management
- **Zustand** - Lightweight state management
- **TanStack Query** (React Query) - Server state management
- **TanStack Table** - Data tables for admin portal
- **TanStack Form** - Type-safe form handling

### Authentication & Security
- **@simplewebauthn/browser** - Biometric authentication (Admin)
- **NextAuth.js** or custom JWT - Session management
- **Entrust SDK Integration** - OTP/Token verification (Customer)

### Additional Dependencies
- **Zod** - Schema validation
- **Date-fns** - Date manipulation
- **jsPDF** - PDF generation for Proof of Payment
- **html2canvas** - Receipt capture
- **React Hook Form** - Form management (if not using TanStack Form)

---

## 📁 Project Structure

```
front_end/
├── app/
│   ├── (admin)/                      # Admin Portal Route Group
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Admin Dashboard
│   │   │   ├── corporate/
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx      # Corporate Registration
│   │   │   │   └── manage/
│   │   │   │       └── page.tsx      # Manage Corporate Entities
│   │   │   ├── users/
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx      # Create Corporate Users
│   │   │   │   └── manage/
│   │   │   │       └── page.tsx      # Manage Users & Roles
│   │   │   └── settings/
│   │   │       └── page.tsx          # Admin Settings
│   │   ├── login/
│   │   │   └── page.tsx              # Biometric Login
│   │   └── layout.tsx                # Admin Layout
│   ├── (customer)/                   # Customer App Route Group
│   │   ├── customer/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Customer Dashboard
│   │   │   ├── transactions/
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx      # Initiate Payment
│   │   │   │   ├── approve/
│   │   │   │   │   └── page.tsx      # Approve Transactions
│   │   │   │   ├── history/
│   │   │   │   │   └── page.tsx      # Transaction History
│   │   │   │   └── proof-of-payment/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx  # View/Download POP
│   │   │   └── profile/
│   │   │       └── page.tsx          # User Profile
│   │   ├── login/
│   │   │   └── page.tsx              # Customer Login + OTP
│   │   └── layout.tsx                # Customer Layout
│   ├── api/                          # API Routes
│   │   ├── auth/
│   │   │   ├── biometric/
│   │   │   │   └── route.ts          # Biometric auth API
│   │   │   ├── token/
│   │   │   │   └── route.ts          # Token verification API
│   │   │   └── session/
│   │   │       └── route.ts          # Session management
│   │   ├── admin/
│   │   │   ├── corporate/
│   │   │   │   └── route.ts          # Corporate CRUD
│   │   │   └── users/
│   │   │       └── route.ts          # User management
│   │   ├── customer/
│   │   │   ├── transactions/
│   │   │   │   └── route.ts          # Transaction operations
│   │   │   └── approvals/
│   │   │       └── route.ts          # Approval workflow
│   │   └── proof-of-payment/
│   │       └── route.ts              # POP generation
│   ├── components/
│   │   ├── ui/                       # ShadCN UI Components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── biometric-login.tsx
│   │   │   ├── corporate-form.tsx
│   │   │   ├── user-role-matrix.tsx
│   │   │   └── admin-sidebar.tsx
│   │   ├── customer/                 # Customer-specific components
│   │   │   ├── token-input.tsx
│   │   │   ├── transaction-form.tsx
│   │   │   ├── approval-workflow.tsx
│   │   │   └── proof-of-payment.tsx
│   │   ├── shared/                   # Shared components
│   │   │   ├── navigation.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── error-boundary.tsx
│   │   │   └── layout-wrapper.tsx
│   │   └── providers/
│   │       ├── query-provider.tsx    # TanStack Query Provider
│   │       ├── auth-provider.tsx     # Auth Context
│   │       └── theme-provider.tsx    # Theme Provider
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── biometric.ts          # Biometric auth utilities
│   │   │   ├── token.ts              # Token verification
│   │   │   └── session.ts            # Session management
│   │   ├── api/
│   │   │   ├── client.ts             # API client setup
│   │   │   ├── admin.ts              # Admin API calls
│   │   │   └── customer.ts           # Customer API calls
│   │   ├── stores/                   # Zustand stores
│   │   │   ├── auth-store.ts         # Authentication state
│   │   │   ├── admin-store.ts        # Admin-specific state
│   │   │   └── customer-store.ts     # Customer-specific state
│   │   ├── utils.ts                  # Utility functions
│   │   ├── validations.ts            # Zod schemas
│   │   ├── constants.ts              # App constants
│   │   └── pdf-generator.ts          # POP PDF generation
│   ├── types/
│   │   ├── auth.ts                   # Auth-related types
│   │   ├── admin.ts                  # Admin domain types
│   │   ├── customer.ts               # Customer domain types
│   │   └── api.ts                    # API response types
│   ├── hooks/                        # Custom hooks
│   │   ├── use-biometric.ts          # Biometric auth hook
│   │   ├── use-token.ts              # Token verification hook
│   │   ├── use-transactions.ts       # Transaction management
│   │   └── use-approvals.ts          # Approval workflow
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Landing page
├── public/
│   ├── logos/
│   │   ├── spectrum-logo.svg
│   │   └── stamp.png                 # Digital stamp for POP
│   └── icons/
├── components.json                   # ShadCN configuration
└── ...config files
```

---

## 🔧 Installation & Setup

### 1. Install Core Dependencies

```bash
# ShadCN UI Setup
npx shadcn@latest init

# State Management
npm install zustand

# TanStack Ecosystem
npm install @tanstack/react-query @tanstack/react-table @tanstack/react-form
npm install @tanstack/query-devtools

# Form Handling & Validation
npm install react-hook-form @hookform/resolvers zod

# Authentication
npm install @simplewebauthn/browser next-auth
npm install @auth/prisma-adapter # if using Prisma

# UI & Styling
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge

# PDF Generation
npm install jspdf html2canvas

# Date Handling
npm install date-fns

# Development
npm install -D @types/node
```

### 2. ShadCN Components to Install

```bash
# Essential UI Components
npx shadcn@latest add button card input form label
npx shadcn@latest add table dialog sheet badge
npx shadcn@latest add select checkbox radio-group
npx shadcn@latest add dropdown-menu navigation-menu
npx shadcn@latest add toast alert-dialog tabs
npx shadcn@latest add avatar progress separator
npx shadcn@latest add calendar date-picker
```

---

## 🏛️ State Management Architecture (Zustand)

### Auth Store
```typescript
// lib/stores/auth-store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authType: 'biometric' | 'token' | null;
  login: (user: User, type: 'biometric' | 'token') => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        authType: null,
        login: (user, type) => set({ user, isAuthenticated: true, authType: type }),
        logout: () => set({ user: null, isAuthenticated: false, authType: null }),
        updateUser: (userData) => set((state) => ({ 
          user: state.user ? { ...state.user, ...userData } : null 
        })),
      }),
      { name: 'auth-storage' }
    )
  )
);
```

### Admin Store
```typescript
// lib/stores/admin-store.ts
interface AdminState {
  corporateEntities: CorporateEntity[];
  selectedEntity: CorporateEntity | null;
  users: CorporateUser[];
  setCorporateEntities: (entities: CorporateEntity[]) => void;
  selectEntity: (entity: CorporateEntity | null) => void;
  addUser: (user: CorporateUser) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
}
```

### Customer Store
```typescript
// lib/stores/customer-store.ts
interface CustomerState {
  transactions: Transaction[];
  pendingApprovals: Transaction[];
  currentTransaction: Transaction | null;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
}
```

---

## 🔐 Authentication Implementation

### Biometric Authentication (Admin Portal)

```typescript
// lib/auth/biometric.ts
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

export class BiometricAuth {
  static async register(username: string) {
    const registrationResponse = await fetch('/api/auth/biometric/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    
    const options = await registrationResponse.json();
    return await startRegistration(options);
  }

  static async authenticate() {
    const authResponse = await fetch('/api/auth/biometric/authenticate');
    const options = await authResponse.json();
    return await startAuthentication(options);
  }
}
```

### Token Authentication (Customer App)

```typescript
// lib/auth/token.ts
export class TokenAuth {
  static async verifyToken(username: string, password: string, token: string) {
    const response = await fetch('/api/auth/token/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, token }),
    });
    
    return await response.json();
  }

  static async requestToken(username: string) {
    const response = await fetch('/api/auth/token/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    
    return await response.json();
  }
}
```

---

## 📊 Data Management (TanStack Query)

### Query Provider Setup
```typescript
// components/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Custom Hooks for Data Fetching

```typescript
// hooks/use-transactions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetch('/api/customer/transactions').then(res => res.json()),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (transaction: CreateTransactionData) =>
      fetch('/api/customer/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}
```

---

## 🎨 UI Components Architecture

### Admin Portal Components

```typescript
// components/admin/corporate-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { corporateEntitySchema } from '@/lib/validations';

export function CorporateRegistrationForm() {
  const form = useForm<CorporateEntityFormData>({
    resolver: zodResolver(corporateEntitySchema),
  });

  const onSubmit = (data: CorporateEntityFormData) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

### Customer Portal Components

```typescript
// components/customer/transaction-form.tsx
'use client';

import { useState } from 'react';
import { useCreateTransaction } from '@/hooks/use-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function TransactionInitiationForm() {
  const createTransaction = useCreateTransaction();
  
  const handleSubmit = (data: TransactionData) => {
    createTransaction.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initiate Payment</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Transaction form */}
      </CardContent>
    </Card>
  );
}
```

---

## 🔄 Transaction Workflow Implementation

### Approval Chain System

```typescript
// lib/workflow/approval-chain.ts
export class ApprovalChain {
  private static readonly WORKFLOW_STEPS = [
    { role: 'initiator', action: 'create', required: true },
    { role: 'verifier', action: 'review', required: true },
    { role: 'authorizer', action: 'approve', required: true },
  ];

  static getNextApprover(transaction: Transaction): UserRole | null {
    const completedSteps = transaction.approvalChain.length;
    const nextStep = this.WORKFLOW_STEPS[completedSteps];
    return nextStep ? nextStep.role : null;
  }

  static canUserApprove(user: User, transaction: Transaction): boolean {
    const nextApprover = this.getNextApprover(transaction);
    return nextApprover === user.role && user.id !== transaction.createdBy;
  }
}
```

---

## 📄 Proof of Payment System

### PDF Generation

```typescript
// lib/pdf-generator.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class POPGenerator {
  static async generatePDF(transaction: Transaction): Promise<string> {
    const doc = new jsPDF();
    
    // Add Spectrum MFB header
    doc.setFontSize(20);
    doc.text('Spectrum Microfinance Bank', 20, 30);
    
    // Add transaction details
    doc.setFontSize(12);
    doc.text(`Transaction ID: ${transaction.id}`, 20, 60);
    doc.text(`Amount: ₦${transaction.amount.toLocaleString()}`, 20, 80);
    doc.text(`Date: ${transaction.executedAt?.toLocaleDateString()}`, 20, 100);
    
    // Add digital stamp
    const stampImg = await this.loadImage('/logos/stamp.png');
    doc.addImage(stampImg, 'PNG', 150, 120, 40, 40);
    
    return doc.output('dataurlstring');
  }

  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  }
}
```

---

## 🛡️ Security Considerations

### Route Protection

```typescript
// lib/auth/route-guards.ts
export function withAdminAuth<T extends any[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const session = await getSession();
    
    if (!session || session.user.type !== 'admin') {
      return new Response('Unauthorized', { status: 401 });
    }
    
    return handler(...args);
  };
}

export function withCustomerAuth<T extends any[]>(
  handler: (...args: T) => Promise<Response>
) {
  return async (...args: T): Promise<Response> => {
    const session = await getSession();
    
    if (!session || session.user.type !== 'customer') {
      return new Response('Unauthorized', { status: 401 });
    }
    
    return handler(...args);
  };
}
```

---

## 🎯 Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Install and configure all dependencies
- [ ] Set up ShadCN components
- [ ] Configure TanStack Query and Zustand
- [ ] Create base layouts and routing structure
- [ ] Implement authentication scaffolding

### Phase 2: Admin Portal (Week 3-4)
- [ ] Biometric authentication implementation
- [ ] Corporate registration forms with validation
- [ ] User management interface with role assignment
- [ ] Admin dashboard with data tables (TanStack Table)
- [ ] Transaction limit configuration

### Phase 3: Customer App (Week 5-6)
- [ ] Entrust token integration and login flow
- [ ] Transaction initiation forms
- [ ] Approval workflow interface
- [ ] Transaction history and status tracking
- [ ] User dashboard and profile management

### Phase 4: Advanced Features (Week 7-8)
- [ ] Proof of Payment generation and PDF export
- [ ] Real-time notifications for approvals
- [ ] Advanced filtering and search (TanStack Table)
- [ ] Audit trail and logging
- [ ] Mobile responsiveness optimization

### Phase 5: Testing & Deployment (Week 9-10)
- [ ] Unit and integration testing
- [ ] Security audit and penetration testing
- [ ] Performance optimization
- [ ] Production deployment
- [ ] User acceptance testing

---

## 📚 Key Files to Create First

1. **Configuration Files**
   - `components.json` (ShadCN config)
   - `lib/utils.ts` (Utility functions)
   - `lib/validations.ts` (Zod schemas)

2. **Store Setup**
   - `lib/stores/auth-store.ts`
   - `lib/stores/admin-store.ts`
   - `lib/stores/customer-store.ts`

3. **Provider Setup**
   - `components/providers/query-provider.tsx`
   - `components/providers/auth-provider.tsx`

4. **Base Components**
   - Install essential ShadCN components
   - Create custom wrapper components

5. **Authentication**
   - `lib/auth/biometric.ts`
   - `lib/auth/token.ts`
   - `components/admin/biometric-login.tsx`
   - `components/customer/token-input.tsx`

---

This comprehensive plan leverages the power of **ShadCN** for consistent UI components, **TanStack** ecosystem for robust data management and tables, and **Zustand** for lightweight state management. The architecture ensures scalability, maintainability, and security for both admin and customer interfaces.