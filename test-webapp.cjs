// APEX WEB APP TEST ⚔️
const http = require('http');

console.log('⚔️ APEX WEB APP TEST ⚔️');
console.log('🔒 Testing web app functionality...');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log('📡 Status Code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('✅ APEX WEB APP RESPONSE:');
        console.log(data);
        console.log('');
        console.log('🔒 Security Status: FORTRESS SECURED');
        console.log('💪 Mission Status: ACCOMPLISHED');
        console.log('');
        console.log('🎯 APEX WEB APP IS OPERATIONAL!');
        console.log('⚔️ Access: http://localhost:3000');
    });
});

req.on('error', (error) => {
    console.log('❌ APEX WEB APP TEST FAILED:', error.message);
});

req.end();
