# Leadership Development Plan Generator

A comprehensive platform for generating personalized leadership development plans using AI-powered assessments and analysis.

## 🚀 Features

- AI-powered leadership assessment
- Personalized development plan generation
- Multi-rater feedback system
- Role-based responsibility classification
- Interactive assessment interface
- Administrative dashboard
- Consultant profile management
- Subscription management

## 🛠️ Technical Stack

- **Frontend**: Next.js
- **Backend**: Node.js with Next.js API Routes
- **Database**: Prisma ORM
- **AI Integration**: OpenAI GPT-4
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm/yarn
- PostgreSQL database
- OpenAI API key
- Next.js 13+

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/RaheesAhmed/development-plan-generator.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NODE_ENV=
JWT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
OPENAI_VECTOR_STORE_ID=
DATABASE_URL=
DIRECT_URL=
DB_PASSWORD=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
DEBUG=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
MONGO_URI=
```

## 🗄️ Database Setup

1. Initialize Prisma:

```bash
npx prisma init
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Push database schema:

```bash
npx prisma db push
```

4. Run migrations:

```bash
npx prisma migrate dev
```

## 🔐 Authentication Setup

Generate a secure NEXTAUTH_SECRET using one of these methods:

1. Using OpenSSL:

```bash
openssl rand -base64 32
```

2. Using Node.js:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

3. Browser console (development only):

```javascript
crypto.randomBytes(32).toString("hex");
```

## 🌐 API Routes

### Assessment Routes

#### `/api/assessment/classify`

- **Method**: POST
- **Purpose**: Classify employee responsibility level
- **Request Body Example**:

```json
{
  "name": "John Doe",
  "industry": "IT",
  "companySize": "600",
  "department": "Finance",
  "jobTitle": "Financial Analyst",
  "directReports": "5",
  "decisionLevel": "Strategic",
  "typicalProject": "Project description",
  "levelsToCEO": "2",
  "managesBudget": true
}
```

#### `/api/assessment/questions`

- **Method**: GET
- **Purpose**: Retrieve assessment questions

#### `/api/assessment/questions/[level]`

- **Method**: GET
- **Purpose**: Get level-specific questions

### Administrative Routes

#### `/api/admin/users`

- **Method**: GET
- **Purpose**: Retrieve all users (admin only)

#### `/api/admin/consultants`

- **Method**: GET
- **Purpose**: Manage consultant profiles

#### `/api/admin/subscriptions`

- **Method**: GET
- **Purpose**: Manage user subscriptions

### Development Plan Routes

#### `/api/development-plan/recommendations`

- **Method**: POST
- **Purpose**: Generate development recommendations

## 👥 User Roles

- **Admin**: Full system access
- **Consultant**: Client management and plan generation
- **User**: Assessment and plan viewing

## 🔄 Development Workflow

1. Create feature branch
2. Implement changes
3. Run tests
4. Submit pull request
5. Code review
6. Merge to main

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📞 Support

For support, email raheesahmed256@gmail.com or create an issue in the repository.

---

Built with ❤️ by the Leadership Development Team
