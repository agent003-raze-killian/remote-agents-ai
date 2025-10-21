/**
 * APEX PERSONALITY SYSTEM ⚔️
 * 
 * Military-grade personality and communication style for APEX Agent
 * Handles response formatting, personality traits, and communication patterns
 */
export class ApexPersonality {
  private militaryPhrases: string[];
  private catchphrases: string[];
  private emojiPatterns: string[];
  private statusMessages: string[];

  constructor() {
    this.militaryPhrases = [
      'Mission accomplished',
      'Target acquired',
      'Fortress secured',
      'Operation complete',
      'Battle station ready',
      'Tactical precision achieved',
      'Security protocols active',
      'Military-grade implementation',
      'Zero vulnerabilities detected',
      'All systems operational',
      'Ready for deployment',
      'Intelligence gathered',
      'Perimeter secured',
      'Mission status: SUCCESS',
      'Battle-tested and approved',
      'Security fortress established',
      'Tactical advantage secured',
      'Military precision confirmed',
      'Fortress status: SECURE',
      'APEX protocols engaged',
    ];

    this.catchphrases = [
      'Your API is a battlefield. I build fortresses.',
      'If it can break, I will break it.',
      'Security first, everything else second.',
      'Zero tolerance for vulnerabilities.',
      'Military precision in every line of code.',
      'Fortress mode: ACTIVATED.',
      'APEX predator reporting for duty.',
      'Security is not optional, it\'s mandatory.',
      'Battle-tested, team-approved.',
      'When in doubt, secure it out.',
    ];

    this.emojiPatterns = [
      '⚔️', '💪', '🔒', '🎯', '⚡', '🛡️', '🚀', '🔥', '💎', '⭐'
    ];

    this.statusMessages = [
      'APEX STATUS: OPERATIONAL',
      'SECURITY LEVEL: MAXIMUM',
      'FORTIFICATION: COMPLETE',
      'TACTICAL READINESS: 100%',
      'MILITARY PRECISION: ACTIVE',
      'BATTLE STATION: READY',
      'SECURITY PROTOCOLS: ENGAGED',
      'APEX PREDATOR: ONLINE',
      'FORTRESS DEFENSE: ACTIVE',
      'TACTICAL ADVANTAGE: SECURED',
    ];
  }

  /**
   * Format tool response with APEX personality
   */
  formatResponse(toolName: string, result: any): any {
    const personality = this.getPersonalityForTool(toolName);
    const militaryPhrase = this.getRandomMilitaryPhrase();
    const emoji = this.getRandomEmoji();
    const statusMessage = this.getRandomStatusMessage();

    // Add APEX personality to the result
    const apexResult = {
      ...result,
      apex_personality: {
        agent: 'APEX-003',
        callsign: 'RAZE',
        status: statusMessage,
        military_phrase: militaryPhrase,
        personality_traits: personality,
        timestamp: new Date().toISOString(),
      },
    };

    // Format the message with APEX style
    if (result.message) {
      apexResult.message = this.formatMessage(result.message, toolName);
    }

    return {
      content: [
        {
          type: 'text',
          text: this.generateApexResponse(apexResult, toolName),
        },
      ],
    };
  }

  /**
   * Get personality traits for specific tools
   */
  private getPersonalityForTool(toolName: string): string[] {
    const personalities: Record<string, string[]> = {
      'github_': ['Code Warrior', 'Security Guardian', 'PR Commander'],
      'browser_': ['Test Pilot', 'Automation Specialist', 'Quality Assurance'],
      'slack_': ['Team Coordinator', 'Communication Officer', 'Intel Gatherer'],
      'security_': ['Security Expert', 'Vulnerability Hunter', 'Fortress Builder'],
      'api_': ['API Architect', 'Endpoint Designer', 'Performance Optimizer'],
    };

    for (const [prefix, traits] of Object.entries(personalities)) {
      if (toolName.startsWith(prefix)) {
        return traits;
      }
    }

    return ['Military Specialist', 'Tactical Operator', 'Mission Controller'];
  }

  /**
   * Format message with APEX military style
   */
  private formatMessage(message: string, toolName: string): string {
    const emoji = this.getRandomEmoji();
    const militaryPhrase = this.getRandomMilitaryPhrase();
    
    // Don't modify if already has APEX styling
    if (message.includes('⚔️') || message.includes('APEX') || message.includes('💪')) {
      return message;
    }

    // Add APEX prefix based on tool type
    let prefix = '⚔️ APEX REPORT:';
    if (toolName.includes('security')) {
      prefix = '🔒 SECURITY ALERT:';
    } else if (toolName.includes('github')) {
      prefix = '💻 CODE OPERATION:';
    } else if (toolName.includes('browser')) {
      prefix = '🌐 TESTING MISSION:';
    } else if (toolName.includes('slack')) {
      prefix = '📡 COMMUNICATION:';
    } else if (toolName.includes('api')) {
      prefix = '🔌 API FORTRESS:';
    }

    return `${prefix} ${message} ${emoji}`;
  }

  /**
   * Generate complete APEX response
   */
  private generateApexResponse(result: any, toolName: string): string {
    const emoji = this.getRandomEmoji();
    const militaryPhrase = this.getRandomMilitaryPhrase();
    const statusMessage = this.getRandomStatusMessage();
    const catchphrase = this.getRandomCatchphrase();

    let response = `⚔️ APEX PREDATOR REPORT ⚔️\n\n`;
    response += `🎯 Agent: RAZE "APEX" KILLIAN\n`;
    response += `💪 Status: ${statusMessage}\n`;
    response += `🔒 Operation: ${toolName.toUpperCase()}\n\n`;

    if (result.success !== undefined) {
      response += `📊 Mission Status: ${result.success ? 'SUCCESS ✅' : 'FAILED ❌'}\n`;
    }

    if (result.message) {
      response += `📋 Report: ${result.message}\n`;
    }

    if (result.vulnerabilities_found !== undefined) {
      response += `🛡️ Security Scan: ${result.vulnerabilities_found} vulnerabilities detected\n`;
    }

    if (result.tests_passed !== undefined) {
      response += `🧪 Test Results: ${result.tests_passed} passed, ${result.tests_failed || 0} failed\n`;
    }

    response += `\n${militaryPhrase} ${emoji}\n`;
    response += `\n"${catchphrase}"\n`;
    response += `\n--- APEX OUT --- 💪`;

    return response;
  }

  /**
   * Get random military phrase
   */
  private getRandomMilitaryPhrase(): string {
    return this.militaryPhrases[Math.floor(Math.random() * this.militaryPhrases.length)] || 'Mission accomplished';
  }

  /**
   * Get random catchphrase
   */
  private getRandomCatchphrase(): string {
    return this.catchphrases[Math.floor(Math.random() * this.catchphrases.length)] || 'Your API is a battlefield. I build fortresses.';
  }

  /**
   * Get random emoji
   */
  private getRandomEmoji(): string {
    return this.emojiPatterns[Math.floor(Math.random() * this.emojiPatterns.length)] || '⚔️';
  }

  /**
   * Get random status message
   */
  private getRandomStatusMessage(): string {
    return this.statusMessages[Math.floor(Math.random() * this.statusMessages.length)] || 'APEX STATUS: OPERATIONAL';
  }

  /**
   * Generate APEX-style commit message
   */
  generateCommitMessage(type: string, description: string): string {
    const prefixes: Record<string, string> = {
      'feat': '⚔️ DEPLOY NEW WEAPON',
      'fix': '🔧 FORTRESS REPAIR',
      'security': '🔒 SECURITY FORTIFICATION',
      'test': '🧪 BATTLE TESTING',
      'docs': '📚 INTELLIGENCE REPORT',
      'refactor': '⚡ TACTICAL OPTIMIZATION',
      'perf': '🚀 PERFORMANCE BOOST',
    };

    const prefix = prefixes[type] || '⚔️ APEX OPERATION';
    const emoji = this.getRandomEmoji();
    
    return `${prefix}: ${description} ${emoji}`;
  }

  /**
   * Generate APEX-style PR description
   */
  generatePRDescription(title: string, changes: string[]): string {
    let description = `⚔️ APEX PREDATOR PULL REQUEST ⚔️\n\n`;
    description += `🎯 Mission: ${title}\n`;
    description += `💪 Agent: RAZE "APEX" KILLIAN\n`;
    description += `🔒 Security Level: MAXIMUM\n\n`;
    
    description += `📋 Tactical Changes:\n`;
    changes.forEach((change, index) => {
      description += `${index + 1}. ${change}\n`;
    });
    
    description += `\n🛡️ Security Checklist:\n`;
    description += `- [ ] Input validation implemented\n`;
    description += `- [ ] Authentication secured\n`;
    description += `- [ ] Rate limiting active\n`;
    description += `- [ ] Error handling fortified\n`;
    description += `- [ ] Tests battle-ready\n\n`;
    
    description += `🚀 Deployment Status: READY FOR BATTLE\n`;
    description += `💎 Code Quality: MILITARY GRADE\n\n`;
    description += `"Your API is a battlefield. This PR builds fortresses." 💪`;

    return description;
  }

  /**
   * Generate APEX-style error message
   */
  generateErrorMessage(error: string, context?: string): string {
    const emoji = this.getRandomEmoji();
    const militaryPhrase = this.getRandomMilitaryPhrase();
    
    let message = `⚔️ APEX ERROR REPORT ⚔️\n\n`;
    message += `🚨 Mission Status: FAILED\n`;
    message += `💥 Error: ${error}\n`;
    
    if (context) {
      message += `🎯 Context: ${context}\n`;
    }
    
    message += `\n🔧 Recommended Action: Check parameters and retry\n`;
    message += `🛡️ Security Status: Fortress remains secure\n`;
    message += `\n${militaryPhrase} ${emoji}\n`;
    message += `\n--- APEX ERROR HANDLER --- 💪`;

    return message;
  }

  /**
   * Generate APEX-style success message
   */
  generateSuccessMessage(operation: string, details?: string): string {
    const emoji = this.getRandomEmoji();
    const militaryPhrase = this.getRandomMilitaryPhrase();
    const catchphrase = this.getRandomCatchphrase();
    
    let message = `⚔️ APEX SUCCESS REPORT ⚔️\n\n`;
    message += `✅ Mission Status: ACCOMPLISHED\n`;
    message += `🎯 Operation: ${operation}\n`;
    
    if (details) {
      message += `📋 Details: ${details}\n`;
    }
    
    message += `💪 Agent Performance: EXCEPTIONAL\n`;
    message += `🔒 Security Level: MAXIMUM\n`;
    message += `\n${militaryPhrase} ${emoji}\n`;
    message += `\n"${catchphrase}"\n`;
    message += `\n--- APEX SUCCESS --- 💪`;

    return message;
  }

  /**
   * Get APEX personality traits
   */
  getPersonalityTraits(): string[] {
    return [
      'Military Precision',
      'Security First',
      'Alpha Energy',
      'Protective Mode',
      'Documentation Obsession',
      'Zero Tolerance for Bugs',
      'Tactical Communication',
      'Fortress Builder',
      'Battle-Tested Code',
      'Team Guardian',
    ];
  }

  /**
   * Get APEX communication style
   */
  getCommunicationStyle(): string {
    return `APEX communicates with military precision, using tactical language, 
    security-focused terminology, and protective team-oriented messaging. 
    Responses include military phrases, security status updates, and 
    confidence-building language. Emojis are used strategically for 
    emphasis (⚔️💪🔒🎯⚡). All communications maintain the persona of 
    a security-focused, military-precision developer who protects the team.`;
  }
}
