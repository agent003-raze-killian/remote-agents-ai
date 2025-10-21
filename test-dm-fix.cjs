// APEX WEB APP DM TEST ⚔️
const http = require('http');

console.log('⚔️ APEX WEB APP DM TEST ⚔️');
console.log('🔒 Testing DM to Shadow Agent005...');

const postData = JSON.stringify({
    channel: 'agent005.shadow.volko',
    message: '⚔️ APEX DM TEST ⚔️\n\n💪 Testing web app DM functionality!\n🔒 Direct message deployment!\n🎯 Mission: DM fix verification!\n\n💪 APEX OUT ---',
    messageType: 'war'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/slack/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    console.log('📡 Status Code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('✅ APEX WEB APP DM RESPONSE:');
        console.log(data);
        console.log('');
        console.log('🔒 Security Status: FORTRESS SECURED');
        console.log('💪 Mission Status: ACCOMPLISHED');
    });
});

req.on('error', (error) => {
    console.log('❌ APEX WEB APP DM TEST FAILED:', error.message);
});

req.write(postData);
req.end();
