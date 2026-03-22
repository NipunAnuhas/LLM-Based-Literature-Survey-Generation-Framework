# 🚀 DO THIS NOW - n8n Setup in 3 Minutes!

## ✅ What's Already Done:
- ✅ Code pushed to GitHub successfully!
- ✅ n8n is running
- ✅ Workflow is created
- ✅ You have the login credentials

## 🎯 What You Need to Do:

### STEP 1: Get Your API Key Ready
1. Open this file: `packages/backend/.env`
2. Find the line that says: `OPENAI_API_KEY=sk-proj-...`
3. Copy EVERYTHING after the `=` sign (the long text starting with `sk-proj-`)
4. Keep it ready - you'll paste it in n8n

### STEP 2: Open n8n
1. Open your browser
2. Type in address bar: `http://localhost:5678`
3. Press Enter
4. Login with:
   - Email: `admin@localhost.com`
   - Password: `LitSurvey2024!`

### STEP 3: Go to Credentials Page
1. Look at the LEFT side of the screen
2. You'll see icons in a vertical bar
3. Click the **KEY icon** 🔑 (looks like a key)
4. This opens the "Credentials" page

### STEP 4: Add OpenAI Credential
1. Click the **"Add Credential"** button (top right, blue button)
2. A search box appears
3. Type: `OpenAI`
4. Click on **"OpenAI"** when it appears

### STEP 5: Fill in the Form
You'll see a form with two fields:
1. **Name**: Type `OpenAI API`
2. **API Key**: Paste the key you copied from Step 1
3. Click **"Save"** button

### STEP 6: Go to Your Workflow
1. Click **"Workflows"** in the left sidebar (looks like a flowchart icon)
2. You should see: "Literature Survey Generation Workflow - Supervisor Design"
3. Click on it to open

### STEP 7: Connect Credentials to Nodes
You'll see orange nodes with `{}` icon. These need the credential:
1. **DOUBLE-CLICK** on "LLM 1 (Query Generation)"
2. A panel opens on the RIGHT side
3. Look for **"Credentials"** section (scroll down if needed)
4. Click the dropdown menu
5. Select **"OpenAI API"** (the one you just created)
6. Repeat for these nodes:
   - LLM 2 (Query Orchestration)
   - LLM 3 (High Quality Survey)
   - Prompt (Refine Survey)

### STEP 8: Activate the Workflow
1. Look at the TOP of the screen
2. Find the switch that says **"Inactive"**
3. Click it to turn it **"Active"** (turns green)

## 🎉 DONE!

Your n8n workflow is now fully set up and ready to use!

---

## 📸 Visual Hints:

### What the LEFT sidebar looks like:
```
┌─────┐
│  ≡  │ ← Menu
├─────┤
│ 📊 │ ← Workflows (click this in Step 6)
├─────┤
│ 🔑 │ ← Credentials (click this in Step 3)
├─────┤
│ ⚙️  │ ← Settings
└─────┘
```

### What the orange nodes look like:
```
┌──────────────────────┐
│   {}                 │ ← Orange icon
│   LLM 1 (Query      │
│   Generation)        │
└──────────────────────┘
```

### Where to find "Inactive" toggle:
```
Top of screen:
[Workflow Name]                    [Inactive ⭘] ← Click this!
```

---

## ❓ Troubleshooting:

### "I can't see the right panel when I click a node"
→ Try **DOUBLE-CLICKING** instead of single-clicking

### "I don't see the Credentials icon"
→ Look for a KEY icon (🔑) in the left sidebar

### "The workflow is not there"
→ Make sure you're logged in to n8n
→ Check if you're on the "Workflows" page

### "I can't find the .env file"
→ It's in: `packages/backend/.env`
→ Open it with Notepad or any text editor

---

## 🆘 Still Stuck?

Take a screenshot of what you see and I'll help you!

---

## ✅ After This is Done:

You can test your complete system:
1. Make sure backend is running: `npm run dev` in `packages/backend`
2. Make sure frontend is running: `npm run dev` in `packages/frontend`
3. Open http://localhost:5174
4. Enter a topic and generate a survey!

The system will now use the REAL n8n workflow with OpenAI!
