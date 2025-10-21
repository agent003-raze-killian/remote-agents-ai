#!/usr/bin/env node

/**
 * 🕵️ Shadow Agent005 Slack MCP Test Suite
 * "If it can break, I will break it."
 */

import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class ShadowAgent005TestSuite {
  constructor() {
    this.slack = null;
    this.testResults = [];
  }

  async initialize() {
    console.log('⚫ Shadow Agent005 Test Suite Initializing...');
    
    if (!process.env.SLACK_BOT_TOKEN) {
      throw new Error('SLACK_BOT_TOKEN environment variable not set');
    }

    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    
    try {
      const authTest = await this.slack.auth.test();
      console.log(`⚫ Connected to Slack as: ${authTest.user}`);
      console.log(`⚫ Team: ${authTest.team}`);
      return true;
    } catch (error) {
      throw new Error(`Failed to connect to Slack: ${error.message}`);
    }
  }

  async runTest(testName, testFunction) {
    console.log(`\n🕳️ Running test: ${testName}`);
    try {
      const result = await testFunction();
      this.testResults.push({ test: testName, status: 'PASS', result });
      console.log(`✅ ${testName}: PASSED`);
      return result;
    } catch (error) {
      this.testResults.push({ test: testName, status: 'FAIL', error: error.message });
      console.log(`❌ ${testName}: FAILED - ${error.message}`);
      return null;
    }
  }

  async testSlackConnection() {
    return await this.runTest('Slack Connection', async () => {
      const authTest = await this.slack.auth.test();
      return {
        user: authTest.user,
        team: authTest.team,
        bot_id: authTest.bot_id
      };
    });
  }

  async testChannelListing() {
    return await this.runTest('Channel Listing', async () => {
      const result = await this.slack.conversations.list({
        types: 'public_channel,private_channel',
        limit: 10
      });
      return {
        channelCount: result.channels.length,
        channels: result.channels.map(c => ({
          name: c.name,
          id: c.id,
          is_private: c.is_private
        }))
      };
    });
  }

  async testMessageSending() {
    return await this.runTest('Message Sending', async () => {
      // Find a test channel (preferably #general or similar)
      const channels = await this.slack.conversations.list({
        types: 'public_channel',
        limit: 20
      });
      
      const testChannel = channels.channels.find(c => 
        c.name === 'general' || c.name === 'test' || c.name === 'random'
      );

      if (!testChannel) {
        throw new Error('No suitable test channel found');
      }

      const testMessage = '⚫ Shadow Agent005 test message. If you see this, the MCP is working. Do better.';
      
      const result = await this.slack.chat.postMessage({
        channel: testChannel.id,
        text: testMessage
      });

      return {
        channel: testChannel.name,
        messageTs: result.ts,
        message: testMessage
      };
    });
  }

  async testPermissions() {
    return await this.runTest('Bot Permissions', async () => {
      const authTest = await this.slack.auth.test();
      const scopes = authTest.response_metadata?.scopes || [];
      
      const requiredScopes = [
        'chat:write',
        'channels:read',
        'groups:read',
        'im:read',
        'im:write'
      ];

      const missingScopes = requiredScopes.filter(scope => !scopes.includes(scope));
      
      if (missingScopes.length > 0) {
        throw new Error(`Missing required scopes: ${missingScopes.join(', ')}`);
      }

      return {
        scopes: scopes,
        hasRequiredScopes: missingScopes.length === 0
      };
    });
  }

  async testChannelHistory() {
    return await this.runTest('Channel History Access', async () => {
      const channels = await this.slack.conversations.list({
        types: 'public_channel',
        limit: 20
      });

      if (channels.channels.length === 0) {
        throw new Error('No channels available for history test');
      }

      // Find a channel the bot is actually in (like general, test, or random)
      const testChannel = channels.channels.find(c => 
        c.name === 'general' || c.name === 'test' || c.name === 'random'
      ) || channels.channels[0];
      
      // First check if bot is in the channel by trying to get channel info
      try {
        const channelInfo = await this.slack.conversations.info({
          channel: testChannel.id
        });
        
        if (!channelInfo.channel.is_member) {
          throw new Error(`Bot not in channel ${testChannel.name}. Add bot to channel or reinstall app to activate channels:history scope.`);
        }
      } catch (error) {
        if (error.message.includes('not_in_channel')) {
          throw new Error(`Bot not in channel ${testChannel.name}. Add bot to channel or reinstall app to activate channels:history scope.`);
        }
        throw error;
      }
      
      const history = await this.slack.conversations.history({
        channel: testChannel.id,
        limit: 5
      });

      return {
        channel: testChannel.name,
        messageCount: history.messages.length,
        hasHistory: history.messages.length > 0
      };
    });
  }

  async runAllTests() {
    console.log('🕵️ Shadow Agent005 MCP Test Suite Starting...');
    console.log('⚫ "If it can break, I will break it."\n');

    try {
      await this.initialize();

      await this.testSlackConnection();
      await this.testPermissions();
      await this.testChannelListing();
      await this.testChannelHistory();
      await this.testMessageSending();

      this.printResults();
    } catch (error) {
      console.error('⚫ Test suite failed to initialize:', error.message);
      process.exit(1);
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('⚫ SHADOW AGENT005 TEST RESULTS');
    console.log('='.repeat(60));

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;

    console.log(`\n📊 Summary:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n🕳️ Failed Tests:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`   ❌ ${r.test}: ${r.error}`));
    }

    if (passed === this.testResults.length) {
      console.log('\n🎉 All tests passed! Shadow Agent005 is ready for deployment.');
      console.log('⚫ "Paranoia validated. Trust but verify."');
    } else {
      console.log('\n⚠️ Some tests failed. Review and fix before deployment.');
      console.log('⚫ "Edge cases detected. Do better."');
    }

    console.log('\n' + '='.repeat(60));
  }
}

// Run the test suite
const testSuite = new ShadowAgent005TestSuite();
testSuite.runAllTests().catch(console.error);

