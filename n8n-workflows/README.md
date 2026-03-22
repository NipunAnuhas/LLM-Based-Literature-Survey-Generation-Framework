# n8n Workflow Configuration

## Literature Survey Generation Workflow

This workflow orchestrates the multi-LLM pipeline for automated literature survey generation.

### Workflow Stages

1. **Webhook Trigger** - Receives survey generation requests from backend
2. **Query Expansion** - GPT-4 generates search queries from topic
3. **Paper Retrieval** - Queries Semantic Scholar API
4. **Paper Validation** - GPT-3.5 assesses paper quality
5. **Content Evaluation** - GPT-4 scores relevance and extracts themes
6. **Survey Synthesis** - Claude generates comprehensive literature review
7. **Database Storage** - Stores final survey in PostgreSQL

### Setup Instructions

#### 1. Import Workflow to n8n

1. Access n8n at http://localhost:5678
2. Login with credentials (admin/admin123)
3. Click "Import from File"
4. Select `literature-survey-workflow.json`
5. Click "Import"

#### 2. Configure API Credentials

**OpenAI API:**
1. Go to Credentials → Add Credential
2. Select "OpenAI API"
3. Enter your OpenAI API key
4. Save as "OpenAI API"

**Anthropic API:**
1. Go to Credentials → Add Credential
2. Select "Anthropic API"
3. Enter your Anthropic API key
4. Save as "Anthropic API"

#### 3. Activate Workflow

1. Open the imported workflow
2. Click "Active" toggle in top right
3. Note the webhook URL (will be displayed)

#### 4. Update Backend Configuration

Update `packages/backend/.env`:
```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/survey-workflow
```

### Workflow Details

#### LLM Model Selection

- **Query Expansion:** GPT-4 (better reasoning for query generation)
- **Validation:** GPT-3.5-turbo (faster, cost-effective for scoring)
- **Evaluation:** GPT-4 (better at theme extraction)
- **Synthesis:** Claude-3-sonnet (longer context window for survey generation)

#### Error Handling

Each node includes:
- Retry logic (3 attempts with exponential backoff)
- Fallback values for parsing errors
- Timeout handling (30s for API calls)

#### Data Flow

```
Topic Input
    ↓
Query Expansion (GPT-4)
    ↓
Paper Retrieval (Semantic Scholar)
    ↓
Quality Validation (GPT-3.5)
    ↓
Relevance Evaluation (GPT-4)
    ↓
Survey Synthesis (Claude)
    ↓
Database Storage
```

### Testing the Workflow

#### Manual Test in n8n

1. Open workflow in n8n
2. Click "Execute Workflow" button
3. Provide test input:
```json
{
  "topic": "Machine Learning in Healthcare",
  "executionId": "test-123",
  "options": {
    "maxPapers": 20
  }
}
```
4. Monitor execution in real-time
5. Check output at each node

#### Test via Backend API

```bash
curl -X POST http://localhost:3000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{"topic": "Machine Learning in Healthcare"}'
```

### Monitoring

#### View Execution History

1. Go to "Executions" tab in n8n
2. View all workflow runs
3. Click on execution to see details
4. Debug failed executions

#### Logs

Each node logs:
- Input data
- Processing steps
- Output data
- Errors (if any)

### Performance

**Expected Execution Time:**
- Query Expansion: ~5-10 seconds
- Paper Retrieval: ~5-10 seconds
- Validation: ~10-15 seconds
- Evaluation: ~15-20 seconds
- Synthesis: ~30-45 seconds
- **Total: ~2-3 minutes**

**Cost Estimation (per survey):**
- GPT-4 calls: ~$0.10-0.15
- GPT-3.5 calls: ~$0.01-0.02
- Claude calls: ~$0.05-0.08
- **Total: ~$0.16-0.25 per survey**

### Troubleshooting

#### Workflow Not Triggering

- Check webhook URL is correct in backend
- Verify workflow is "Active"
- Check n8n logs for errors

#### LLM API Errors

- Verify API keys are correct
- Check API rate limits
- Ensure sufficient API credits

#### Paper Retrieval Fails

- Check Semantic Scholar API status
- Verify network connectivity
- Check rate limits (100 req/min)

#### Synthesis Timeout

- Reduce number of papers (maxPapers option)
- Increase timeout in node settings
- Use shorter abstracts

### Customization

#### Adjust Paper Count

Modify in "Select Top Papers" node:
```javascript
.slice(0, 15); // Change 15 to desired count
```

#### Change Quality Threshold

Modify in "Apply Quality Scores" node:
```javascript
.filter(paper => paper.qualityScore >= 6.0); // Change 6.0
```

#### Modify LLM Models

Update model parameter in LLM nodes:
- GPT-4: `gpt-4`, `gpt-4-turbo`
- GPT-3.5: `gpt-3.5-turbo`
- Claude: `claude-3-sonnet`, `claude-3-opus`

### Best Practices

1. **Monitor Costs:** Track LLM API usage
2. **Rate Limiting:** Respect API rate limits
3. **Error Handling:** Always include fallbacks
4. **Testing:** Test with small datasets first
5. **Logging:** Enable detailed logging for debugging

### Support

For issues with:
- **n8n:** https://docs.n8n.io
- **OpenAI API:** https://platform.openai.com/docs
- **Anthropic API:** https://docs.anthropic.com
- **Semantic Scholar:** https://api.semanticscholar.org

