export const handler = async (event, context) => {
  // Handle OPTIONS request directly
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  // Construct target URL
  // event.path contains the full path, e.g., /api/v1/auth/login
  const targetUrl = 'https://macety.eastus2.cloudapp.azure.com' + event.path;
  
  console.log(`Proxying request to: ${targetUrl}`);

  // Filter headers
  const headers = { ...event.headers };
  delete headers.host;
  delete headers.origin; // Remove Origin to avoid CORS check on backend
  delete headers['content-length']; // Let fetch handle this
  
  // Optional: Spoof Origin if the backend requires it to match the host
  // headers['Origin'] = 'https://macety.eastus2.cloudapp.azure.com';
  
  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: headers,
      body: event.body ? event.body : undefined
    });
    
    const data = await response.text();
    
    // Prepare response headers
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Copy important headers from backend response
    if (response.headers.has('content-type')) {
        responseHeaders['Content-Type'] = response.headers.get('content-type');
    }
    
    // You might want to forward other headers like Set-Cookie if needed
    // if (response.headers.has('set-cookie')) {
    //     responseHeaders['Set-Cookie'] = response.headers.get('set-cookie');
    // }

    return {
      statusCode: response.status,
      body: data,
      headers: responseHeaders
    };
  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Proxy error', details: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
