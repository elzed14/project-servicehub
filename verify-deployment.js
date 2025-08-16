// Script de vérification du déploiement ServiceHub
import https from 'https';

const SITE_URL = 'https://sparkling-praline-ddd170.netlify.app';

console.log('🔍 Vérification du déploiement ServiceHub...\n');

// Tests à effectuer
const tests = [
  {
    name: 'Page d\'accueil',
    path: '/',
    expected: 'ServiceHub'
  },
  {
    name: 'Redirections SPA',
    path: '/browse',
    expected: 'ServiceHub'
  }
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    }).on('error', (err) => {
      resolve({
        status: 0,
        error: err.message
      });
    });
  });
}

async function runTests() {
  console.log(`🌐 Site testé: ${SITE_URL}\n`);
  
  for (const test of tests) {
    const url = SITE_URL + test.path;
    console.log(`⏳ Test: ${test.name}...`);
    
    const result = await checkUrl(url);
    
    if (result.status === 200 && result.data.includes(test.expected)) {
      console.log(`✅ ${test.name}: OK`);
    } else if (result.status === 200) {
      console.log(`⚠️  ${test.name}: Chargé mais contenu inattendu`);
    } else {
      console.log(`❌ ${test.name}: Erreur ${result.status || 'Connexion'}`);
    }
  }
  
  console.log('\n🎉 Vérification terminée!');
  console.log(`\n🔗 Visitez votre site: ${SITE_URL}`);
}

runTests().catch(console.error);