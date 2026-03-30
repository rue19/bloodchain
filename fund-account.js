#!/usr/bin/env node
const https = require('https');

const address = 'GCHOKIJQTAAFY3N3SBWIH5V6AHKKXNHUE3QD6SNMEXMYU5WFWINPT6CE';

console.log('🚀 Funding testnet account:', address);

// Step 1: Fund via Friendbot
const friendbotUrl = `https://friendbot.stellar.org/?addr=${address}`;

https.get(friendbotUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('\n✅ Friendbot Response:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log(data);
    }
    
    // Step 2: Check balance after 2 seconds
    setTimeout(() => {
      checkBalance();
    }, 2000);
  });
}).on('error', (e) => {
  console.error('Friendbot error:', e.message);
});

function checkBalance() {
  console.log('\n⏳ Checking balance...');
  const horizonUrl = `https://horizon-testnet.stellar.org/accounts/${address}`;
  
  https.get(horizonUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const account = JSON.parse(data);
        if (account.balances) {
          console.log('✅ Account Balance:');
          account.balances.forEach(b => {
            console.log(`  ${b.asset_type}: ${b.balance}`);
          });
          console.log('\n✨ Account is funded and ready!');
          console.log(`📍 Public Key: ${address}`);
        }
      } catch (e) {
        console.error('Error parsing response:', e.message);
      }
    });
  }).on('error', (e) => {
    console.error('Horizon error:', e.message);
  });
}
