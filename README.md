# Spectrum MFB Admin Dashboard

A modern, responsive admin dashboard for Spectrum Microfinance Bank built with Next.js 15, TypeScript, and Tailwind CSS. This application provides comprehensive management tools for administrators to oversee companies, users, and banking operations.

## 🚀 Features

### 🏢 Company Management
- **Create & Onboard Companies**: Register new corporate entities with complete business details
- **View Company Profiles**: Access detailed company information including registration numbers, tax IDs, and contact details
- **Account Configuration**: Set up daily and single transfer limits for corporate accounts
- **Company Search & Filtering**: Efficiently locate companies with advanced search capabilities

### 👥 User Management
- **Multi-Role User Creation**: Create users with different roles (initiator, reviewer, approver)
- **Corporate User Onboarding**: Onboard multiple users per company with role-based permissions
- **User Profile Management**: View and manage user details, contact information, and role assignments
- **Advanced User Filtering**: Filter users by company, role, status, and other criteria

### 🔐 Authentication & Security
- **Two-Factor Authentication**: Secure login with OTP verification via email
- **Role-Based Access Control**: Different access levels for admin1 and admin2 roles
- **JWT Token Management**: Secure token-based authentication with automatic refresh
- **Session Management**: Persistent sessions with secure cookie storage

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Overview of key metrics and performance indicators
- **Transaction Monitoring**: Track and analyze financial transactions
- **Visual Charts**: Interactive charts for data visualization using Recharts
- **Quick Actions**: Rapid access to frequently used features

### 💰 Payment & Approvals
- **Payment Approval Workflow**: Review and approve pending transactions
- **Multi-level Authorization**: Support for maker-checker approval processes
- **Transaction History**: Comprehensive audit trail for all financial activities
- **Approval Status Tracking**: Real-time status updates for pending approvals

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router and Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible UI component library
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management and caching
- **Axios** - HTTP client for API communication
- **Context API** - Global state management for authentication

### UI Components & Styling
- **Lucide React** - Modern icon library
- **Class Variance Authority** - Component variants management
- **Tailwind Merge** - Utility class merging
- **Sonner** - Toast notifications
- **Recharts** - Data visualization and charts

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Turbopack** - Fast bundler for development

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- Access to the Spectrum API gateway
- Valid API keys for authentication

## 🚦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/div-j/spectrum_mfb-admin.git
cd spectrum_mfb/front_end
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_ADMIN_API_KEY=your_api_key_here
NEXT_PUBLIC_API_BASE_URL=https://gateway.spectrumpay.com.ng:4010
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
front_end/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard routes
│   │   ├── dashboard/            # Main dashboard
│   │   │   ├── approvals/        # Payment approvals
│   │   │   ├── clients/          # Company management
│   │   │   ├── users/            # User management
│   │   │   └── components/       # Dashboard components
│   │   └── components/           # Admin-specific components
│   ├── auth/                     # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── signup/               # Registration page
│   │   └── forgot-password/      # Password recovery
│   ├── components/               # Global components
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── ui/                       # UI primitives
│   ├── charts/                   # Chart components
│   └── shared/                   # Shared components
├── hooks/                        # Custom React hooks
│   ├── useUsers.ts               # User management logic
│   ├── useCompany.ts             # Company management logic
│   └── useAuth.ts                # Authentication logic
├── lib/                          # Utilities and configurations
│   ├── axios.ts                  # HTTP client setup
│   ├── interface.ts              # TypeScript interfaces
│   ├── utils.ts                  # Helper functions
│   └── mock-data.ts              # Development data
├── providers/                    # React context providers
│   ├── auth-provider.tsx         # Authentication context
│   └── query-provider.tsx        # React Query setup
└── public/                       # Static assets
    ├── assets/                   # Images and media
    ├── icons/                    # Icon files
    └── logos/                    # Brand assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis

## 🌐 API Integration

The application integrates with the Spectrum API gateway through configured endpoints:

### Base URL
```
https://gateway.spectrumpay.com.ng:4010
```

### Key Endpoints
- **Authentication**: `/api/v1/admin/login`, `/api/v1/admin/authentication`
- **Companies**: `/api/v1/admin/companies`, `/api/v1/admin/register/company`
- **Users**: `/api/v1/admin/users`, `/api/v1/admin/register/corporate`
- **Approvals**: `/api/v1/admin/approvals`

### Authentication Flow
1. Admin login with email/password
2. OTP sent to registered email
3. OTP verification returns JWT token
4. Token stored in secure cookies
5. Token included in all API requests

## 🔐 Authentication & Authorization

### User Roles
- **admin1**: Full administrative access
- **admin2**: Limited administrative access
- **maker**: Transaction initiation permissions
- **authorizer**: Transaction approval permissions

### Security Features
- JWT token-based authentication
- Secure HTTP-only cookies
- Automatic token refresh
- Role-based route protection
- OTP verification for enhanced security

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: ARIA-compliant components
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback

## 🚀 Performance Optimizations

- **Server-Side Rendering**: Fast initial page loads
- **Code Splitting**: Automatic bundle optimization
- **Image Optimization**: Next.js image optimization
- **Caching**: React Query for efficient data caching
- **Turbopack**: Fast development builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## 🔄 Version History

- **v0.1.0** - Initial release with core functionality
- **v0.1.1** - Enhanced authentication and security
- **v0.1.2** - Improved UI/UX and performance optimizations

## 🌟 Acknowledgments

- Spectrum Microfinance Bank for project requirements
- React and Next.js communities for excellent documentation
- Radix UI team for accessible components
- All contributors and maintainers

---

Built with ❤️ by the Spectrum MFB Development Team