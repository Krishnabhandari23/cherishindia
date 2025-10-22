# 🔑 GitHub Personal Access Token Setup

## Why You Need This

GitHub no longer accepts passwords for Git operations. You need a Personal Access Token (PAT) instead.

## Step-by-Step Token Creation

### 1. Go to GitHub Settings
- Click your profile picture (top right)
- Click **"Settings"**

### 2. Navigate to Developer Settings
- Scroll down in left sidebar
- Click **"Developer settings"**
- Click **"Personal access tokens"**
- Click **"Tokens (classic)"**

### 3. Generate New Token
- Click **"Generate new token"**
- Click **"Generate new token (classic)"**

### 4. Configure Your Token
Fill out the form:
- **Note**: `Cherish India E-commerce deployment`
- **Expiration**: `90 days` (or your preference)
- **Select scopes**: 
  - ✅ Check **`repo`** (this gives full repository access)
  - ✅ Check **`workflow`** (if you plan to use GitHub Actions)

### 5. Generate and Copy Token
- Click **"Generate token"**
- **⚠️ CRITICAL**: Copy the token immediately and save it somewhere safe
- You will **NEVER** see this token again once you leave the page

## Using Your Token

### When Git Asks for Credentials:
- **Username**: `krishnabhandari23`
- **Password**: **[Paste your Personal Access Token here]**

### Your Commands Should Now Work:
```bash
cd F:\cherishindia
git push -u origin main
```

## Save Your Token Securely

**Option 1: Use Git Credential Manager (Recommended)**
```bash
git config --global credential.helper manager-core
```
This will save your credentials securely for future use.

**Option 2: Store in a secure password manager**
- Save the token in your password manager
- Label it clearly: "GitHub PAT - Cherish India Project"

## Troubleshooting

### If you get "remote: Invalid username or password":
- Double-check you're using the token as the password, not your GitHub password
- Make sure the token has `repo` scope checked
- Verify the token hasn't expired

### If you lost your token:
- Go back to GitHub → Settings → Developer settings → Personal access tokens
- Delete the old token
- Create a new one following the same steps

## Security Best Practices

1. **Never share your token** - treat it like a password
2. **Set appropriate expiration** - don't make it permanent unless necessary
3. **Use minimum required scopes** - only check what you need
4. **Regenerate if compromised** - create a new one if you suspect it's been exposed

---

## Quick Reference

**Your Repository URL**: `https://github.com/Krishnabhandari23/cherishindia.git`

**Next Steps After Creating Token**:
1. Create the token following steps above
2. Copy the token
3. Run: `git push -u origin main`
4. Enter `Krishnabhandari23` as username
5. Paste your token as password
6. Your code will upload to GitHub! 🎉

**After successful upload, you can deploy to Render following the DEPLOYMENT_GUIDE.md**