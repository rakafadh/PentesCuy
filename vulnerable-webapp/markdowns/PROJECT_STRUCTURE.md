# 📦 PentesCuy - Project Overview & File Structure

## 🎯 Project Summary

**PentesCuy** adalah vulnerable web application untuk pembelajaran penetration testing yang mencakup:
- ✅ SQL Injection (Login & User Search)
- ✅ Command Injection (Ping & System Info)
- ✅ Secure Mode untuk comparison
- ✅ Modern UI dengan React + Tailwind CSS
- ✅ Documentation lengkap untuk pentest workflow

---

## 📂 Complete File Structure

```
vulnerable-webapp/
│
├── 📄 README.md                          # Main documentation & overview
├── 📄 PENETRATION_TESTING_GUIDE.md      # Complete pentest guide (Enumeration → Proof)
├── 📄 SUPABASE_SETUP.md                 # Database setup instructions
├── 📄 QUICKSTART.md                     # 5-minute quick start guide
│
├── 🔧 Configuration Files
│   ├── package.json                      # Dependencies & scripts
│   ├── .env                              # Environment variables (PRIVATE!)
│   ├── .env.example                      # Environment template
│   ├── tailwind.config.js                # Tailwind CSS configuration
│   ├── postcss.config.js                 # PostCSS configuration
│   ├── vite.config.js                    # Vite build tool config
│   ├── eslint.config.js                  # ESLint configuration
│   └── .gitignore                        # Git ignore rules
│
├── 🖥️ Backend
│   └── server.js                         # Express API server
│       ├── Vulnerable endpoints (/api/*)
│       ├── Secure endpoints (/api/secure/*)
│       └── SQL & Command injection vulnerabilities
│
├── 🎨 Frontend (src/)
│   ├── main.jsx                          # React entry point
│   ├── App.jsx                           # Main app component & routing
│   ├── index.css                         # Tailwind imports
│   │
│   ├── components/
│   │   ├── Login.jsx                     # Login form (SQL Injection demo)
│   │   ├── UserSearch.jsx                # User search (SQL Injection demo)
│   │   └── SystemTools.jsx               # Ping & System Info (Command Injection)
│   │
│   └── lib/
│       ├── api.js                        # Axios API client
│       └── supabaseClient.js             # Supabase configuration
│
├── 🌐 Public Assets
│   └── public/
│       └── vite.svg                      # Vite logo
│
└── 📦 Dependencies
    └── node_modules/                     # Installed packages (not committed)
```

---

## 🔑 Key Files Explained

### Documentation Files

| File | Purpose | For Who |
|------|---------|---------|
| **README.md** | Main project documentation, setup guide | Everyone |
| **PENETRATION_TESTING_GUIDE.md** | Step-by-step pentest methodology | Students/Testers |
| **SUPABASE_SETUP.md** | Database configuration & SQL queries | Developers |
| **QUICKSTART.md** | 5-minute setup guide | Quick starters |

### Backend Files

| File | Purpose | Contains |
|------|---------|----------|
| **server.js** | Express API server | All endpoints (vulnerable & secure) |

**Endpoints:**
```
Vulnerable:
- POST /api/login
- GET  /api/search?query=
- POST /api/ping
- POST /api/system-info

Secure:
- POST /api/secure/login
- GET  /api/secure/search?query=
- POST /api/secure/ping
- POST /api/secure/system-info
```

### Frontend Components

| Component | Route/Feature | Vulnerability |
|-----------|---------------|---------------|
| **App.jsx** | Main layout, navigation, mode toggle | - |
| **Login.jsx** | Login form | SQL Injection |
| **UserSearch.jsx** | Search users | SQL Injection |
| **SystemTools.jsx** | Ping & System Info | Command Injection |

### Configuration Files

| File | Purpose |
|------|---------|
| **package.json** | NPM dependencies & scripts |
| **.env** | Environment variables (Supabase credentials) |
| **tailwind.config.js** | Tailwind CSS customization |
| **vite.config.js** | Vite bundler settings |

---

## 🚀 Available NPM Scripts

```bash
npm run dev        # Start frontend dev server (port 5173)
npm run server     # Start backend API server (port 3001)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🔐 Environment Variables

Required in `.env` file:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
PORT=3001
```

**⚠️ NEVER commit .env file to Git!**

---

## 📦 Dependencies Overview

### Frontend Dependencies
```json
{
  "react": "^19.2.0",                    // UI library
  "react-dom": "^19.2.0",                // React DOM renderer
  "axios": "^1.13.2",                    // HTTP client
  "@supabase/supabase-js": "^2.86.0",    // Supabase client
  "lucide-react": "^0.555.0",            // Icon library
  "react-router-dom": "^7.9.6"           // Routing (optional)
}
```

### Backend Dependencies
```json
{
  "express": "^5.1.0",                   // Web framework
  "cors": "^2.8.5",                      // CORS middleware
  "body-parser": "^2.2.1",               // Parse request bodies
  "dotenv": "^17.2.3"                    // Environment variables
}
```

### Dev Dependencies
```json
{
  "vite": "^7.2.6",                      // Build tool
  "tailwindcss": "^3.x",                 // CSS framework
  "autoprefixer": "^10.x",               // CSS post-processor
  "postcss": "^8.x",                     // CSS transformer
  "eslint": "^9.x"                       // Code linter
}
```

---

## 🗄️ Database Schema

### Table: `users`

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Function: `execute_sql` (Vulnerable!)

```sql
CREATE OR REPLACE FUNCTION execute_sql(query_text TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query_text || ') t' INTO result;
    RETURN COALESCE(result, '[]'::json);
END;
$$;
```

**⚠️ This function is intentionally vulnerable for educational purposes!**

---

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: 
  - Primary: Purple/Pink gradient
  - Success: Green (Secure mode)
  - Danger: Red (Vulnerable mode)
  - Warning: Yellow (hints/tips)

### Components
- Modern card-based layout
- Responsive design (mobile-friendly)
- Toggle button untuk switch mode
- Syntax-highlighted output
- Real-time feedback
- Helpful hints untuk testing

### Icons (Lucide React)
- Shield - Secure features
- ShieldAlert - Vulnerable features
- Terminal - Command tools
- Users - User management
- Activity - Network tools
- Home - Homepage

---

## 🧪 Testing Workflow

### 1. Vulnerable Mode Testing

**SQL Injection:**
```
Login:
  Input: ' OR '1'='1
  Expected: Bypass authentication ✅

Search:
  Input: ' UNION SELECT id, username, email, password FROM users--
  Expected: Expose all passwords ✅
```

**Command Injection:**
```
Ping:
  Input: google.com & whoami
  Expected: Execute whoami command ✅

System Info:
  Input: " & dir & echo "
  Expected: List directory contents ✅
```

### 2. Secure Mode Testing

**SQL Injection:**
```
Login:
  Input: ' OR '1'='1
  Expected: Authentication fails ❌

Search:
  Input: ' UNION SELECT...
  Expected: No data leaked ❌
```

**Command Injection:**
```
Ping:
  Input: google.com & whoami
  Expected: Validation error ❌

System Info:
  Input: " & dir & echo "
  Expected: Whitelist restriction ❌
```

---

## 📊 Project Statistics

- **Total Files**: 20+ files
- **Lines of Code**: 2000+ lines
- **Components**: 4 React components
- **API Endpoints**: 8 endpoints (4 vulnerable, 4 secure)
- **Documentation**: 4 comprehensive markdown files
- **Vulnerabilities**: 2 types (SQL Injection, Command Injection)
- **Protection Methods**: 4+ security measures

---

## 🎓 Educational Value

### Skills Learned:
1. **Web Development**: React, Express, Supabase
2. **Security Testing**: Penetration testing methodology
3. **Vulnerability Research**: SQL & Command Injection
4. **Secure Coding**: Input validation, parameterized queries
5. **Documentation**: Technical writing, guides

### Real-World Applications:
- Understanding common web vulnerabilities
- Identifying security weaknesses in code
- Implementing security best practices
- Learning ethical hacking techniques
- Building secure applications

---

## ⚠️ Security Warnings

**DO NOT:**
- ❌ Deploy to production
- ❌ Expose to public internet
- ❌ Use with real/sensitive data
- ❌ Test on systems you don't own

**DO:**
- ✅ Use only in local environment
- ✅ Test in isolated network
- ✅ Learn and practice ethically
- ✅ Apply knowledge to build secure systems

---

## 🔄 Project Lifecycle

```
1. Target Creation    → Build vulnerable app
2. Enumeration        → Discover vulnerabilities
3. Exploitation       → Demonstrate attacks
4. Remediation        → Implement fixes
5. Proof              → Verify protection
```

**Status**: ✅ All phases completed and documented

---

## 📞 Support & Resources

### Documentation:
- [README.md](./README.md) - Main guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup
- [PENETRATION_TESTING_GUIDE.md](./PENETRATION_TESTING_GUIDE.md) - Full pentest guide
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup

### External Resources:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Documentation](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

## ✅ Project Completion Checklist

- [x] Frontend application (React + Vite + Tailwind)
- [x] Backend API server (Express)
- [x] Database setup (Supabase)
- [x] SQL Injection vulnerabilities
- [x] Command Injection vulnerabilities
- [x] Secure implementations
- [x] Mode toggle functionality
- [x] Modern UI/UX design
- [x] Complete documentation
- [x] Penetration testing guide
- [x] Setup instructions
- [x] Testing payloads
- [x] Remediation examples

**Status**: 🎉 **100% COMPLETE**

---

## 🏆 Project Achievements

✅ Memenuhi semua requirements proyek akhir  
✅ Implementasi 2 vulnerability types  
✅ Bukan copy dari DVWA atau source lain  
✅ Simple tapi functional (2+ halaman)  
✅ Dokumentasi lengkap dengan 2 MD files  
✅ Follow alur penetration testing  
✅ Target creation → Proof  
✅ Tampilan modern dan menarik  

---

**Created with ❤️ for educational purposes**

*Learn. Practice. Build Secure.*
