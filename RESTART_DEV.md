# Restart Dev Server - Complete Fix

## Current Issue
Some webpack chunks are returning 404 errors. This happens when the dev server cache gets corrupted.

## Complete Fix Steps

### 1. Stop All Node Processes
```powershell
# Kill all Node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### 2. Clear All Caches
```powershell
cd "C:\Users\anton\OneDrive\Documents\Istanbul Trip App"
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### 3. Check Port 3001
If you're using port 3001 (not default 3000), make sure nothing else is using it:
```powershell
netstat -ano | findstr :3001
```

### 4. Restart Dev Server
```powershell
npm run dev
```

If you need to use port 3001 specifically:
```powershell
npm run dev -- -p 3001
```

Or add to package.json:
```json
"dev": "next dev -p 3001"
```

## Alternative: Use Default Port
If port 3001 is causing issues, try the default port 3000:
```powershell
npm run dev
```
Then access at http://localhost:3000

## If Still Having Issues

1. **Check for port conflicts:**
   ```powershell
   netstat -ano | findstr :3001
   netstat -ano | findstr :3000
   ```

2. **Try a clean reinstall:**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   npm install
   npm run dev
   ```

3. **Check Windows Firewall/Antivirus** - They might be blocking file watching

## Expected Behavior After Fix
- All chunks should load with 200 OK
- No 404 errors in console
- Hot reload should work properly
- CSS should load correctly

