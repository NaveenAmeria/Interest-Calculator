# 🔧 Fix PowerShell Error

## The Problem
PowerShell is blocking npm commands due to execution policy restrictions.

---

## ✅ Solution 1: Use CMD Instead (Easiest)

### Open CMD (not PowerShell):
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to project folder:
   ```cmd
   cd "c:\Users\Navee\Downloads\Interest Calculator - Unlox-20260130T143558Z-3-001\Interest Calculator - Unlox"
   ```
4. Run: `start-dev.bat`

**OR manually start each:**
```cmd
cd server
npm run dev
```
(Open new CMD window)
```cmd  
cd client
npm run dev
```

---

## ✅ Solution 2: Fix PowerShell (Permanent Fix)

Run this **once** in PowerShell as Administrator:

1. **Right-click** PowerShell → "Run as Administrator"
2. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Type `Y` to confirm
4. Close and reopen PowerShell
5. Now `npm` commands will work!

---

## ✅ Solution 3: Use the Batch File

Just **double-click** `start-dev.bat` from Windows Explorer - it uses CMD internally and avoids PowerShell completely!

---

## 🎯 Recommended: Solution 1 or 3

The easiest is to just use CMD or double-click the batch file.
