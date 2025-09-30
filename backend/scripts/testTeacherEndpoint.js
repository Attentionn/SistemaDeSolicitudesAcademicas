const http = require('http');

function testTeacherEndpoint() {
  console.log('🔍 Probando endpoint /api/requests/teacher directamente...\n');

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/requests/teacher',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    console.log(`📡 Headers:`, res.headers);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('\n📋 Respuesta del endpoint:');
        console.log('=====================================');
        console.log(JSON.stringify(jsonData, null, 2));
        
        if (jsonData.length > 0) {
          const request = jsonData[0];
          console.log('\n🧪 Verificación de campos:');
          console.log(`request.motivo: "${request.motivo}" (${typeof request.motivo})`);
          console.log(`request.description: "${request.description}" (${typeof request.description})`);
          console.log(`request.motivo && = ${!!request.motivo}`);
          console.log(`request.description && = ${!!request.description}`);
        }
        
      } catch (error) {
        console.error('❌ Error parsing JSON:', error.message);
        console.log('Raw data:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error:', error.message);
  });

  req.end();
}

testTeacherEndpoint();
