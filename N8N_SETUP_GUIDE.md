# n8n Setup Guide - Quick Start

## ✅ Current Status

- **n8n is running**: http://localhost:5678
- **Login credentials**: See N8N_CREDENTIALS.txt
- **OpenAI API Key**: Already configured in backend `.env`

---

## 🚀 Step-by-Step Setup (5 minutes)

### Step 1: Access n8n
1. Open your browser
2. Go to: **http://localhost:5678**
3. Login with credentials from N8N_CREDENTIALS.txt

### Step 2: Import the Workflow
1. In n8n, click **"Workflows"** in the left sidebar
2. Click **"Add Workflow"** button (top right)
3. Click the **three dots menu** (⋮) in the top right
4. Select **"Import from File"**
5. Browse to: `n8n-workflows/literature-survey-workflow-supervisor-design.json`
6. Click **"Import"**

### Step 3: Configure OpenAI API Credentials
1. In the imported workflow, you'll see red warning icons on some nodes
2. Click on the **"LLM 1 (Query Generation)"** node (the first OpenAI node)
3. In the right panel, find **"Credential to connect with"**
4. Click **"Create New Credential"**
5. Enter your OpenAI API key (get it from `packages/backend/.env` - OPENAI_API_KEY value)
6. Name it: **"OpenAI API"**
7. Click **"Save"**
8. The other OpenAI nodes will automatically use this credential

### Step 4: Activate the Workflow
1. Click the **"Inactive"** toggle in the top right
2. It should turn to **"Active"** (green)
3. The workflow is now ready to receive requests!

### Step 5: Get the Webhook URL
1. Click on the **"Webhook"** node (first node)
2. In the right panel, you'll see **"Production URL"**
3. Copy this URL (should be: `http://localhost:5678/webhook/survey-workflow`)
4. This is already configured in your backend!

---

## 🧪 Test the Integration

### Option 1: Test in n8n (Recommended First)
1. In n8n, click **"Test workflow"** button (top right)
2. Click on the **"Webhook"** node
3. Click **"Listen for test event"**
4. In a new terminal, run:
   ```bash
   curl -X POST http://localhost:5678/webhook-test/survey-workflow -H "Content-Type: application/json" -d "{\"topic\":\"Machine Learning\",\"executionId\":\"test-123\"}"
   ```
5. Watch the workflow execute in real-time!

### Option 2: Test via Your Application
1. Make sure your backend is running: `npm run dev` (in packages/backend)
2. Make sure your frontend is running: `npm run dev` (in packages/frontend)
3. Open http://localhost:5174
4. Enter a topic and click "Generate Survey"
5. The backend will trigger the n8n workflow!

---

## 🔧 Troubleshooting

### Workflow nodes show errors
- **Red icons**: Missing credentials - follow Step 3 above
- **Yellow warnings**: Normal for inactive workflows

### Webhook not triggering
- Make sure workflow is **Active** (green toggle)
- Check the webhook URL matches in backend `.env`
- Verify n8n is running: http://localhost:5678

### OpenAI API errors
- Check your API key is valid
- Verify you have credits in your OpenAI account
- Check rate limits: https://platform.openai.com/account/rate-limits

---

## 📊 Monitoring Workflow Executions

1. In n8n, click **"Executions"** in the left sidebar
2. You'll see all workflow runs
3. Click on any execution to see:
   - Input data
   - Output from each node
   - Execution time
   - Any errors

---

## 💰 Cost Estimation

With your OpenAI API key, each survey generation costs approximately:
- **GPT-4 calls**: ~$0.10-0.15
- **GPT-3.5 calls**: ~$0.01-0.02
- **Total per survey**: ~$0.11-0.17

---

## 🎯 Next Steps

1. ✅ Import workflow into n8n
2. ✅ Configure OpenAI credentials
3. ✅ Activate workflow
4. 🧪 Test with your application
5. 🎉 Present your working system!

---

## 🆘 Need Help?

If you encounter issues:
1. Check n8n logs in the Docker terminal
2. Check backend logs for connection errors
3. Verify all credentials are saved correctly
4. Make sure workflow is Active

**Quick Fix**: If n8n integration is causing issues during your presentation, your demo mode still works perfectly without n8n!
