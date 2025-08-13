# 🎓 Live Courses Backend

A backend service for managing live courses with:
- **JWT Authentication**
- **Course Management**
- **Secure File Uploads (AWS S3)**
- **Payment Integration (Stripe)**
- **Live Streaming (Mux)**
- **Paid Student Access Control**

---

## 🚀 Tech Stack
- **Node.js** + **TypeScript**
- **Express.js**
- **TypeORM** (PostgreSQL)
- **Stripe** (Payments)
- **AWS S3** (Course materials storage)
- **Mux** (Live streaming)
- **JWT** (Authentication)

---

## 📂 Folder Structure
```
src/
├── controllers/      # API request handlers
├── routes/           # Express route definitions
├── services/         # Business logic
├── repositories/     # TypeORM repositories
├── entities/         # Database entities
├── middleware/       # Auth & role checks
├── utils/            # Helpers
├── validators/       # Zod validation schemas
└── enums/            # Enums for models
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and update values:

```env
# Database
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
DB_SSL=true

# Server
PORT=3000
JWT_SECRET=supersecret
APP_BASE_URL=http://localhost:3001

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Mux
MUX_TOKEN_ID=xxx
MUX_TOKEN_SECRET=xxx

# AWS S3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=my-course-materials-uploads
```

---

## 🛠 Installation & Setup

1. **Clone the repo**
```bash
git clone https://github.com/umairnaeem12/live_courses.git
cd live_courses
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your real keys.

4. **Run database migrations**
```bash
npm run migrate:run
```

5. **Start the development server**
```bash
npm run dev
```

---

## 💳 Payment Flow (Stripe)
1. Create a checkout session for a specific course.
2. On successful payment, Stripe calls the webhook.
3. Webhook verifies payment and grants course access.

---

## 📚 API Endpoints

### **Auth**
- `POST /auth/register`
- `POST /auth/login`

### **Courses**
- `POST /courses` (Instructor only)
- `GET /courses/:id` (Paid students only)

### **Payments**
- `POST /payments/checkout-session`
- `POST /stripe/webhook`

### **Streaming**
- `POST /courses/:id/stream` (Instructor)
- `GET /courses/:id/stream/playback` (Paid students)

---

## 🧪 Testing
- Use **Postman** or **Thunder Client** to test endpoints.
- For payment, use [Stripe test cards](https://stripe.com/docs/testing#international-cards).

---

## 📝 License
MIT
