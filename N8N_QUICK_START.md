# n8n Quick Start - Do This Now!

## Step 1: Open n8n
1. Open your browser
2. Go to: **http://localhost:5678**
3. Login with:
   - Email: `admin@localhost.com`
   - Password: `LitSurvey2024!`

## Step 2: You Should See Your Workflow
The workflow "Literature Survey Generation Workflow - Supervisor Design" should already be there.

## Step 3: Add OpenAI API Key

### Method A: Through Credentials Page (EASIEST!)
1. Look at the LEFT sidebar in n8n
2. Click the **KEY icon** (🔑) - this is "Credentials"
3. Click **"Add Credential"** button (top right corner)
4. In the search box, type: **OpenAI**
5. Click on **"OpenAI"** from the list
6. Fill in:
   - **Name**: OpenAI API
   - **API Key**: Open `packages/backend/.env` file and copy the OPENAI_API_KEY value
7. Click **"Save"**

### Method B: Through Workflow Nodes
1. Click on **"Workflows"** in left sidebar
2. Open your workflow
3. **DOUBLE-CLICK** (not single click!) on the orange node "LLM 1 (Query Generation)"
4. A panel appears on the RIGHT side
5. Scroll down to find **"Credentials"** section
6. Click the dropdown and select **"Create New"**
7. Fill in:
   - **Name**: OpenAI API
   - **API Key**: Get from `packages/backend/.env` file
8. Click **"Save"**
9. Repeat for other orange nodes:
   - LLM 2 (Query Orchestration)
   - LLM 3 (High Quality Survey)
   - Prompt (Refine Survey)

## Step 4: Activate the Workflow
1. Look at the TOP of the screen
2. Find the toggle that says **"Inactive"**
3. Click it to turn it **"Active"** (should turn green)

## Step 5: Done!
Your n8n workflow is now ready to use!

---

## If You Get Stuck:

### Can't see the right panel when clicking nodes?
- Try **DOUBLE-CLICKING** instead of single-clicking
- Make sure you're clicking on the orange `{}` nodes

### Can't find the Credentials page?
- Look for the KEY icon (🔑) in the left sidebar
- It's usually the 3rd or 4th icon from the top

### Still stuck?
Take a screenshot and I'll help you!

---

## Your OpenAI API Key Location:
File: `packages/backend/.env`
Line: `OPENAI_API_KEY=...`

Copy the entire value after the `=` sign.
