// Test n8n Connection Script
const axios = require('axios');

const N8N_URL = 'http://localhost:5678';
const WEBHOOK_URL = 'http://localhost:5678/webhook/survey-workflow';

async function testN8nConnection() {
  console.log('🔍 Testing n8n Connection...\n');

  // Test 1: Check if n8n is accessible
  console.log('Test 1: Checking if n8n is running...');
  try {
    const response = await axios.get(N8N_URL, { timeout: 5000 });
    console.log('✅ n8n is running and accessible at', N8N_URL);
  } catch (error) {
    console.log('❌ n8n is not accessible:', error.message);
    console.log('   Make sure Docker is running: docker-compose up');
    return;
  }

  // Test 2: Try to trigger webhook (will fail if workflow not imported/active)
  console.log('\nTest 2: Testing webhook trigger...');
  try {
    const testData = {
      topic: 'Artificial Intelligence in Healthcare',
      executionId: 'test-' + Date.now(),
      options: {
        maxPapers: 10
      }
    };

    console.log('Sending test request to webhook...');
    const response = await axios.post(WEBHOOK_URL, testData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    console.log('✅ Webhook triggered successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Could not connect to webhook');
      console.log('   This is normal if workflow is not imported yet');
    } else if (error.response?.status === 404) {
      console.log('⚠️  Webhook endpoint not found (404)');
      console.log('   You need to:');
      console.log('   1. Import the workflow in n8n');
      console.log('   2. Activate the workflow');
      console.log('   3. Make sure webhook path is "survey-workflow"');
    } else {
      console.log('⚠️  Webhook response:', error.message);
      console.log('   Status:', error.response?.status);
      console.log('   This might be normal - check n8n executions tab');
    }
  }

  console.log('\n📋 Summary:');
  console.log('- n8n URL:', N8N_URL);
  console.log('- Webhook URL:', WEBHOOK_URL);
  console.log('- Login: admin / admin123');
  console.log('\n📖 Next steps: See N8N_SETUP_GUIDE.md');
}

// Run the test
testN8nConnection().catch(console.error);
