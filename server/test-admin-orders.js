const fetch = require('node-fetch');

async function testAdminOrders() {
  try {
    // Step 1: Login as admin
    console.log('Step 1: Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@cherishindia.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.message);
    }

    const token = loginData.data.token;
    console.log('✅ Login successful, got token');

    // Step 2: Fetch orders with admin token
    console.log('\nStep 2: Fetching orders...');
    const ordersResponse = await fetch('http://localhost:5000/api/orders/admin/all?limit=50', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const ordersData = await ordersResponse.json();
    console.log('Orders response:', JSON.stringify(ordersData, null, 2));

    if (ordersData.success) {
      console.log(`✅ Successfully fetched ${ordersData.data.orders.length} orders`);
      ordersData.data.orders.forEach((order, index) => {
        console.log(`Order ${index + 1}: ${order.orderNumber} - Status: ${order.status} - Total: ₹${order.total}`);
      });
    } else {
      console.log('❌ Failed to fetch orders:', ordersData.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAdminOrders();