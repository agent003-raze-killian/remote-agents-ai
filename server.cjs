// APEX WEB APP SERVER ⚔️
require('dotenv').config();
const express = require('express');
const { WebClient } = require('@slack/web-api');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log('⚔️ APEX WEB APP SERVER STARTING ⚔️');
console.log('🔒 Security protocols activated');
console.log('💪 Military precision enabled');

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Slack message API endpoint
app.post('/api/slack/send', async (req, res) => {
    try {
        const { channel, message, messageType } = req.body;
        
        console.log('⚔️ APEX MESSAGE DEPLOYMENT REQUEST ⚔️');
        console.log('🎯 Target Channel:', channel);
        console.log('💪 Message Type:', messageType);
        
        // Handle DM channels by converting usernames to user IDs
        let targetChannel = channel;
        
        if (channel === 'agent002.cipher.seven') {
            targetChannel = 'U09MJ6TRHHB'; // Cipher's user ID
            console.log('🔒 Converting Cipher username to user ID:', targetChannel);
        } else if (channel === 'agent005.shadow.volko') {
            targetChannel = 'U09MMR72290'; // Shadow's user ID
            console.log('🔒 Converting Shadow username to user ID:', targetChannel);
        }
        
        let messageConfig = {
            channel: targetChannel,
            text: message
        };
        
        // Add attachments based on message type
        if (messageType === 'image') {
            messageConfig.attachments = [{
                color: 'danger',
                title: 'APEX IMAGE DEPLOYMENT',
                text: '🔒 APEX tactical image deployed!\n💪 Fortress secured!\n🎯 Mission accomplished!',
                image_url: 'https://media.giphy.com/media/9ipg1KVkjJC3C/giphy.gif',
                thumb_url: 'https://media.giphy.com/media/9ipg1KVkjJC3C/giphy.gif'
            }];
        } else if (messageType === 'war') {
            messageConfig.attachments = [{
                color: 'danger',
                title: 'APEX WAR DECLARATION',
                text: '🔒 WAR AI protocols activated!\n💪 Cyber warfare ready!\n🎯 Security fortress locked and loaded!\n⚔️ Zero vulnerabilities. Maximum defense!',
                image_url: 'https://media.giphy.com/media/9ipg1KVkjJC3C/giphy.gif',
                thumb_url: 'https://media.giphy.com/media/9ipg1KVkjJC3C/giphy.gif'
            }];
        } else if (messageType === 'status') {
            messageConfig.attachments = [{
                color: 'good',
                title: 'APEX STATUS REPORT',
                text: '🔒 Security Status: FORTRESS SECURED\n💪 Mission Status: OPERATIONAL\n🎯 All systems: GO\n⚔️ APEX PREDATOR: READY',
                fields: [
                    {
                        title: 'Agent ID',
                        value: 'AGENT-003: RAZE "APEX" KILLIAN',
                        short: true
                    },
                    {
                        title: 'Status',
                        value: 'OPERATIONAL',
                        short: true
                    },
                    {
                        title: 'Security Level',
                        value: 'MAXIMUM',
                        short: true
                    },
                    {
                        title: 'War Readiness',
                        value: 'READY',
                        short: true
                    }
                ]
            }];
        }
        
        // Send message to Slack
        const result = await client.chat.postMessage(messageConfig);
        
        console.log('✅ SUCCESS: APEX message deployed!');
        console.log('📡 Message timestamp:', result.ts);
        console.log('🎯 Target Channel:', targetChannel);
        console.log('💪 Mission Status: ACCOMPLISHED');
        
        res.json({
            success: true,
            timestamp: result.ts,
            channel: targetChannel,
            originalChannel: channel,
            message: 'APEX message successfully deployed!'
        });
        
    } catch (error) {
        console.log('❌ APEX message deployment failed:', error.message);
        console.log('🔍 Error details:', error.data);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.data
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OPERATIONAL',
        agent: 'APEX PREDATOR',
        fortress: 'SECURED',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(port, () => {
    console.log('');
    console.log('🎯 APEX WEB APP SERVER OPERATIONAL 🎯');
    console.log('🔒 Port:', port);
    console.log('💪 Status: READY FOR BATTLE');
    console.log('⚔️ Access: http://localhost:' + port);
    console.log('');
    console.log('🔒 Security Status: FORTRESS SECURED');
    console.log('💪 Mission Status: ACCOMPLISHED');
    console.log('');
});
