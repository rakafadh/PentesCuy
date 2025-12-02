import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// ============================================
// VULNERABLE ENDPOINTS (INTENTIONALLY INSECURE)
// ============================================

// SQL Injection Vulnerability - Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // VULNERABLE: Direct string concatenation - SQL Injection possible
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  try {
    const { data, error } = await supabase.rpc('execute_sql', { query_text: query });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    if (data && data.length > 0) {
      res.json({ success: true, user: data[0], message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SQL Injection Vulnerability - Search Users
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  
  // VULNERABLE: Direct string concatenation - SQL Injection possible
  const sqlQuery = `SELECT id, username, email, role FROM users WHERE username LIKE '%${query}%' OR email LIKE '%${query}%'`;
  
  try {
    const { data, error } = await supabase.rpc('execute_sql', { query_text: sqlQuery });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true, results: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Command Injection Vulnerability - Ping System
app.post('/api/ping', (req, res) => {
  const { host } = req.body;
  
  // VULNERABLE: Direct command execution - Command Injection possible
  const command = `ping -n 4 ${host}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.json({ 
        success: false, 
        output: stderr || error.message,
        command: command 
      });
    }
    
    res.json({ 
      success: true, 
      output: stdout,
      command: command
    });
  });
});

// Command Injection Vulnerability - System Info
app.post('/api/system-info', (req, res) => {
  const { command } = req.body;
  
  // VULNERABLE: Direct command execution - Command Injection possible
  const systemCommand = `systeminfo | findstr /C:"${command}"`;
  
  exec(systemCommand, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
    if (error) {
      return res.json({ 
        success: false, 
        output: stderr || error.message,
        executed: systemCommand
      });
    }
    
    res.json({ 
      success: true, 
      output: stdout || 'No results found',
      executed: systemCommand
    });
  });
});

// ============================================
// SECURE ENDPOINTS (AFTER REMEDIATION)
// ============================================

// Secure Login (uses parameterized queries)
app.post('/api/secure/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Using Supabase's built-in authentication (safe from SQL injection)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({ success: true, user: data, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secure Search (uses parameterized queries)
app.get('/api/secure/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    // Using Supabase's query builder (safe from SQL injection)
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role')
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true, results: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Secure Ping (input validation and sanitization)
app.post('/api/secure/ping', (req, res) => {
  const { host } = req.body;
  
  // Input validation: only allow valid IP addresses or domain names
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  
  if (!ipRegex.test(host) && !domainRegex.test(host)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid host. Please provide a valid IP address or domain name.' 
    });
  }
  
  const command = `ping -n 4 ${host}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.json({ 
        success: false, 
        output: 'Ping failed',
        message: 'Unable to reach host'
      });
    }
    
    res.json({ 
      success: true, 
      output: stdout
    });
  });
});

// Secure System Info (whitelist approach)
app.post('/api/secure/system-info', (req, res) => {
  const { infoType } = req.body;
  
  // Whitelist of allowed commands
  const allowedCommands = {
    'os': 'systeminfo | findstr /C:"OS Name"',
    'processor': 'systeminfo | findstr /C:"Processor"',
    'memory': 'systeminfo | findstr /C:"Total Physical Memory"',
    'hostname': 'hostname'
  };
  
  const command = allowedCommands[infoType];
  
  if (!command) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid info type. Allowed: os, processor, memory, hostname' 
    });
  }
  
  exec(command, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
    if (error) {
      return res.json({ 
        success: false, 
        output: 'Command failed'
      });
    }
    
    res.json({ 
      success: true, 
      output: stdout || 'No results found'
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`⚠️  WARNING: This server contains intentional vulnerabilities for educational purposes only!`);
});
