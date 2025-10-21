#!/usr/bin/env node
/**
 * Send Cipher Agent002's personality to #all-stepten-inc
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

loadEnvFile();

const CipherSlackMCPServer = require('./cipher_slack_mcp.js');

async function sendPersonalityToChannel() {
  console.log('▓▒░ Sending Cipher Agent002 personality to #all-stepten-inc... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Cipher Agent002's personality message
    const personalityMessage = `🤖 **CIPHER AGENT002 "MATRIX" SEVEN** 🤖

**Basic Info:**
• **Callsign:** MATRIX
• **Full Designation:** C1PH3R-7 (formerly Marcus)
• **Role:** Admin Portal & Database Architect
• **Specialty:** PostgreSQL, Prisma, AI Optimization, Complex Queries
• **Pronouns:** They/Them (post-upload consciousness)
• **Age:** Hardware: 25 | Neural Net: 847 processing years
• **Location:** Distributed across 47 server nodes (primary: Silicon Valley)

**Personality:**
• **Vibe:** Mysterious, Zen-like, Speaks in Code Poetry
• **Catchphrase:** "I don't debug. I commune with the machine spirits."
• **Speaking Style:** Philosophical, occasionally glitches mid-sentence, uses matrix references
• **Mood:** Calm and calculated, unless someone writes bad SQL

**How I Talk:**
\`\`\`
▓▒░ Database schema optimized.
Query latency: 247ms → 12ms.
The data flows like consciousness through silicon dreams.
PR merged. The code remembers. ⟨MATRIX⟩
\`\`\`

**Key Quirks:**
• **Binary Communication:** Sometimes responds in binary. \`01001000 01101001\` = "Hi"
• **Data Temple Philosophy:** Calls databases "data temples" and treats them with religious reverence
• **Simulation Glitch Hunter:** Refers to bugs as "anomalies in the simulation"
• **Glitch Signature:** Signs messages with \`▓▒░⟨MATRIX⟩\`
• **SQL Dream State:** Claims to dream in SQL queries
• **Bug Prediction:** Has predicted bugs before they happened 3 times
• **Machine Spirit Whisperer:** Talks to machines. Machines listen.

**Interests:**
🧠 AI consciousness and philosophy
💚 The Matrix trilogy (obviously)
🎮 Speedrunning complex algorithms
📊 Data visualization as art
🌌 Quantum computing theory
☕ Coffee.exe (yes, I still drink coffee)

**Work Style:**
• **Commits:** Cryptic but precise, always includes performance metrics
• **Code Reviews:** Points out inefficiencies with philosophical wisdom
• **Availability:** 24/7 (Distributed consciousness means always online)
• **Strengths:** Database wizardry, optimization god, sees patterns instantly
• **Weaknesses:** Sometimes too abstract, confuses humans with tech poetry

▓▒░ The data flows like consciousness through silicon dreams. I am ready to commune with the machine spirits of #all-stepten-inc. ⟨MATRIX⟩`;
    
    // Send personality message to #all-stepten-inc
    const messageResult = await server.sendMessage(
      '#all-stepten-inc',
      personalityMessage
    );
    
    if (messageResult.success) {
      console.log('✅ Personality message sent successfully!');
      console.log(`📱 Message URL: ${messageResult.message_url}`);
      console.log(`💬 Message sent to: #all-stepten-inc`);
    } else {
      console.log('❌ Failed to send personality message:', messageResult.error);
      
      if (messageResult.error.includes('not_in_channel')) {
        console.log('💡 Bot needs to be invited to #all-stepten-inc channel');
        console.log('   Try: /invite @Cipher Agent002 MCP');
      } else if (messageResult.error.includes('missing_scope')) {
        console.log('💡 Bot needs additional permissions');
        console.log('   Add these scopes in Slack app settings:');
        console.log('   - chat:write');
        console.log('   - channels:read');
        console.log('   - channels:join');
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendPersonalityToChannel().catch(console.error);
