# Complete n8n API Key Setup Guide - Step by Step

## Your OpenAI API Key:
```
[Get your API key from packages/backend/.env file - OPENAI_API_KEY value]
```

---

## Method 1: Through n8n Interface (Visual Guide)

### Step 1: Open the Workflow
1. Go to http://localhost:5678
2. You should see your "Literature Survey Generation Workflow - Supervisor Design"
3. The workflow should be open with all the nodes visible

### Step 2: Click on an LLM Node
Look for nodes with an **orange `{}` icon**. These are:
- "LLM 1 (Query Generation)"
- "LLM 2 (Query Orchestration)"
- "LLM 3 (High Quality Survey)"
- "Prompt (Refine Survey)"

**Try DOUBLE-CLICKING** on "LLM 1 (Query Generation)"

### Step 3: What You Should See
After double-clicking, a panel should appear on the RIGHT SIDE of your screen showing:
- Node name at the top
- Various settings fields
- A "Credentials" section

### Step 4: In the Credentials Section
1. Look for a dropdown that says "Select Credential" or shows a warning
2. Click on that dropdown
3. Select "Create New Credential" or click the "+" button

### Step 5: Fill in the Credential Form
A form will appear asking for:
- **Name**: Type "OpenAI API" (or any name you want)
- **API Key**: Paste the key from your .env file
- Click **"Save"** or **"Create"**

### Step 6: Apply to All Nodes
Once saved, go to each of the other orange LLM nodes and:
1. Double-click the node
2. In the Credentials dropdown, select the "OpenAI API" credential you just created
3. The warning should disappear

### Step 7: Activate the Workflow
1. Look at the top of the screen
2. Find the toggle switch that says "Inactive"
3. Click it to turn it to "Active" (should turn green)

---

## Method 2: Alternative - Use n8n's Credentials Page

### Step 1: Go to Credentials Page
1. In n8n, look at the LEFT SIDEBAR
2. Click on the **"Credentials"** icon (looks like a key 🔑)
3. This opens the credentials management page

### Step 2: Create New Credential
1. Click **"Add Credential"** button (top right)
2. Search for "OpenAI"
3. Select "OpenAI" from the list

### Step 3: Fill in the Form
1. **Name**: "OpenAI API"
2. **API Key**: Paste your key from packages/backend/.env
3. Click **"Save"**

### Step 4: Go Back to Workflow
1. Click "Workflows" in the left sidebar
2. Open your workflow
3. Double-click each orange LLM node
4. In the Credentials dropdown, select "OpenAI API"

---

## Method 3: If Nothing Works - Try This

If you still can't add the credentials, take a screenshot of:
1. The n8n interface with the workflow open
2. What happens when you double-click an orange node

Then I can give you more specific instructions based on what you're seeing!

---

## Troubleshooting

### Problem: Can't see the right panel when clicking nodes
**Solution**: Try these:
- Double-click instead of single-click
- Click directly on the node icon (the orange `{}`)
- Try clicking on a different node
- Refresh the page and try again

### Problem: No "Credentials" section visible
**Solution**: 
- Scroll down in the right panel
- Make sure you clicked on an orange LLM node (not a gray code node)
- The credentials section is usually near the bottom of the settings

### Problem: Can't find "Create New Credential"
**Solution**:
- Look for a dropdown menu in the Credentials section
- Look for a "+" button
- Try the Method 2 approach (Credentials page in sidebar)

---

## After Setup is Complete

Once you've added the API key to all LLM nodes:

1. ✅ Toggle the workflow to "Active"
2. ✅ Test it by running your application
3. ✅ The workflow should now work with real OpenAI API calls!

---

## Need More Help?

If you're still stuck, please:
1. Take a screenshot of the n8n interface
2. Show me what you see when you click on a node
3. I'll give you exact instructions based on your screen!
