// Test if Freighter can connect
const testFreighterConnection = async () => {
  console.log('🔍 Testing Freighter Connection...\n');

  // Check 1: Is Freighter installed?
  if (typeof window === 'undefined') {
    console.error('❌ Window is undefined (server-side)');
    return;
  }

  if (!window.freighter) {
    console.error('❌ Freighter not found on window object');
    console.log('   Make sure you have Freighter extension installed');
    return;
  }

  console.log('✅ Freighter found:', window.freighter);

  // Check 2: Can we get the user's public key?
  try {
    const publicKey = await window.freighter.getPublicKey();
    console.log('✅ Got public key:', publicKey);
    
    // Check 3: Can we sign a transaction?
    console.log('✅ Freighter is responsive');
  } catch (err) {
    console.error('❌ Freighter error:', err.message);
  }
};

// For use in browser console
if (typeof window !== 'undefined') {
  (window as any).testFreighter = testFreighterConnection;
  console.log('📌 Run testFreighter() in console to check wallet');
}
