# Fix Dev Server Issues

If you're experiencing 404 errors or hot reload issues, follow these steps:

## Quick Fix

1. **Stop the dev server** (Ctrl+C in the terminal)

2. **Clear the cache** (already done):
   ```powershell
   cd "C:\Users\anton\OneDrive\Documents\Istanbul Trip App"
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   ```

3. **Restart the dev server**:
   ```powershell
   npm run dev
   ```

## If Issues Persist

1. **Kill any processes on port 3001**:
   ```powershell
   netstat -ano | findstr :3001
   # Note the PID, then:
   taskkill /PID <PID> /F
   ```

2. **Clear all caches and restart**:
   ```powershell
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   npm run dev
   ```

3. **If still having issues, try a clean install**:
   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
   npm install
   npm run dev
   ```

## Common Causes

- Port conflict (another process using port 3001)
- Corrupted build cache
- File watcher issues (too many files)
- Antivirus interfering with file watching

