# ✅ Pre-Presentation Checklist

Gunakan checklist ini sebelum presentasi/demo proyek akhir!

## 📋 Environment Setup

- [ ] Node.js & npm terinstall
- [ ] Project folder sudah di-extract/clone
- [ ] Dependencies sudah di-install (`npm install`)
- [ ] `.env` file sudah dikonfigurasi dengan credentials Supabase
- [ ] Port 3001 dan 5173 tidak digunakan aplikasi lain

## 🗄️ Database Setup

- [ ] Supabase project sudah dibuat
- [ ] Table `users` sudah dibuat
- [ ] Sample data (5 users) sudah di-insert
- [ ] Function `execute_sql` sudah dibuat
- [ ] Row Level Security sudah di-disable
- [ ] GRANT permissions sudah dijalankan
- [ ] Test query di SQL Editor berhasil

Verify dengan query:
```sql
SELECT * FROM users;
-- Harus return 5 users
```

## 🚀 Application Running

- [ ] Backend server berjalan (`npm run server`)
- [ ] Frontend dev server berjalan (`npm run dev`)
- [ ] Browser terbuka di http://localhost:5173
- [ ] Homepage load dengan benar
- [ ] No error di browser console
- [ ] No error di backend terminal

## 🧪 Functionality Test

### SQL Injection - Login
- [ ] Vulnerable mode: `' OR '1'='1` berhasil login ✅
- [ ] Secure mode: `' OR '1'='1` gagal login ❌
- [ ] Normal login: `admin` / `admin123` berhasil

### SQL Injection - Search
- [ ] Vulnerable mode: `' UNION SELECT id, username, email, password FROM users--` expose passwords ✅
- [ ] Secure mode: Same payload tidak leak data ❌
- [ ] Normal search: `john` menampilkan user john_doe

### Command Injection - Ping
- [ ] Vulnerable mode: `google.com & whoami` execute command ✅
- [ ] Secure mode: `google.com & whoami` validation error ❌
- [ ] Normal ping: `google.com` atau `8.8.8.8` berjalan normal

### Command Injection - System Info
- [ ] Vulnerable mode: `" & dir & echo "` list directory ✅
- [ ] Secure mode: Dropdown selection only (no injection) ❌

## 🎨 UI/UX Check

- [ ] Toggle Vulnerable/Secure mode berfungsi
- [ ] All navigation links bekerja
- [ ] Login modal muncul dengan benar
- [ ] Output terminal readable (formatting OK)
- [ ] Responsive di different screen sizes
- [ ] Colors & icons display correctly
- [ ] Hints/tips terlihat jelas

## 📄 Documentation Ready

- [ ] README.md terbuka dan ready untuk ditampilkan
- [ ] PENETRATION_TESTING_GUIDE.md siap sebagai reference
- [ ] SUPABASE_SETUP.md untuk demo setup database
- [ ] Screenshots/screen recordings ready (optional)

## 🎤 Presentation Preparation

### Demo Script Order:

1. **Introduction (1 min)**
   - [ ] Jelaskan tujuan project
   - [ ] Mention tech stack (React, Express, Supabase)
   - [ ] Show homepage briefly

2. **Enumeration (2 min)**
   - [ ] Show network tab di DevTools
   - [ ] Identify API endpoints
   - [ ] Explain vulnerable code locations

3. **Exploitation - SQL Injection (3 min)**
   - [ ] Demo login bypass: `' OR '1'='1`
   - [ ] Demo password extraction via search
   - [ ] Show database results in output
   - [ ] Explain impact

4. **Exploitation - Command Injection (3 min)**
   - [ ] Demo ping with `& whoami`
   - [ ] Demo system info with `& dir`
   - [ ] Show command execution results
   - [ ] Explain RCE impact

5. **Remediation (2 min)**
   - [ ] Show secure code examples
   - [ ] Explain parameterized queries
   - [ ] Explain input validation
   - [ ] Show whitelist approach

6. **Proof (2 min)**
   - [ ] Toggle to Secure Mode
   - [ ] Re-test SQL injection payloads → Fail ❌
   - [ ] Re-test command injection → Blocked ❌
   - [ ] Show comparison table

7. **Q&A (2 min)**
   - [ ] Ready untuk questions
   - [ ] Documentation as reference

## 💡 Backup Plans

### If Backend Fails:
- [ ] Have screenshots/recordings ready
- [ ] Can show code walkthroughs
- [ ] Documentation explains everything

### If Supabase Down:
- [ ] Show SQL queries yang sudah prepared
- [ ] Explain expected results
- [ ] Use mock data if needed

### If Frontend Issues:
- [ ] Can test endpoints dengan `curl` atau Postman
- [ ] Show API responses directly
- [ ] Explain UI functionality

## 📊 Key Points to Emphasize

- [ ] **Original work** - Built from scratch, not DVWA
- [ ] **Two vulnerabilities** - SQL & Command Injection
- [ ] **Complete workflow** - Target → Enumeration → Exploitation → Remediation → Proof
- [ ] **Educational value** - Shows both vulnerable & secure implementations
- [ ] **Modern tech stack** - React 19, Vite 7, Tailwind CSS
- [ ] **Well documented** - 4 comprehensive markdown files

## 🔥 Common Questions Preparation

**Q: Mengapa tidak pakai library ORM seperti Prisma?**
A: Untuk demo vulnerability, kami sengaja menggunakan raw SQL agar vulnerable. Secure mode menggunakan Supabase query builder yang aman.

**Q: Apakah bisa di-deploy ke production?**
A: Tidak, ini purely educational. Production memerlukan many more security measures.

**Q: Kenapa pilih Supabase?**
A: Mudah setup, gratis, PostgreSQL-based, dan support raw SQL execution untuk demo vulnerability.

**Q: Apa perbedaan Vulnerable vs Secure mode?**
A: Vulnerable menggunakan string concatenation, Secure menggunakan parameterized queries dan input validation.

**Q: Tools apa yang bisa digunakan untuk test?**
A: Browser DevTools, Burp Suite, SQLmap, manual payloads via UI.

## 🎯 Success Criteria

✅ Application berjalan tanpa error  
✅ All vulnerabilities dapat didemonstrasikan  
✅ Secure mode memblock semua attacks  
✅ Explanation clear dan concise  
✅ Questions dijawab dengan confident  
✅ Documentation support demo  

## 📸 Optional: Media Preparation

- [ ] Screenshot homepage (Vulnerable mode)
- [ ] Screenshot homepage (Secure mode)
- [ ] Screenshot SQL injection success
- [ ] Screenshot command injection output
- [ ] Screenshot secure mode blocking attack
- [ ] Recording full demo (backup)
- [ ] Architecture diagram (optional)

## ⚡ Quick Test Commands

### Test Backend Health:
```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok","message":"Server is running"}
```

### Test SQL Injection:
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"' OR '1'='1\",\"password\":\"anything\"}"
```

### Test Command Injection:
```bash
curl -X POST http://localhost:3001/api/ping \
  -H "Content-Type: application/json" \
  -d "{\"host\":\"google.com & whoami\"}"
```

## 🏁 Final Check

**30 minutes before presentation:**
- [ ] Restart both servers
- [ ] Clear browser cache
- [ ] Close unnecessary tabs/apps
- [ ] Test all features once more
- [ ] Have documentation open in tabs
- [ ] Water bottle ready 😊

**5 minutes before:**
- [ ] Deep breath
- [ ] Application running smoothly
- [ ] Confident and ready!

---

## 🎉 You're Ready!

Jika semua checklist ✅, Anda siap untuk presentasi!

**Good luck! 🚀**

Remember: 
- Stay calm
- Explain clearly
- Show passion for cybersecurity
- Have fun! This is YOUR work!

---

**Last Updated**: Before presentation  
**Status**: Ready to demo 🎯
