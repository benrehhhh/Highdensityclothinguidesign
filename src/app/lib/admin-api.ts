// LocalStorage-based Admin API
export const adminApi = {
  getDashboardSummary: async () => {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const customers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    return {
      ordersToday: orders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length,
      pendingDeliveries: orders.filter(o => o.status === 'Processing').length,
      lowStockAlerts: products.filter(p => p.stock <= 5).length,
      monthlySales: orders
        .filter(o => new Date(o.date).getMonth() === new Date().getMonth())
        .reduce((sum, o) => sum + o.total, 0)
    };
  },
  
  getOrders: async () => {
    return JSON.parse(localStorage.getItem('userOrders') || '[]');
  },

  updateOrderStatus: async (id: string | number, status: string) => {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const orderIndex = orders.findIndex(o => String(o.id) === String(id));
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      localStorage.setItem('userOrders', JSON.stringify(orders));
    }
    return orders[orderIndex];
  },
  
  getProducts: async () => {
    return JSON.parse(localStorage.getItem('products') || '[]');
  },
  
  createProduct: async (payload: any) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const newProduct = {
      ...payload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
  },
  
  updateProduct: async (id: string | number, payload: any) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productIndex = products.findIndex(p => String(p.id) === String(id));
    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...payload };
      localStorage.setItem('products', JSON.stringify(products));
      return products[productIndex];
    }
    throw new Error('Product not found');
  },
  
  deleteProduct: async (id: string | number) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const filteredProducts = products.filter(p => String(p.id) !== String(id));
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    return true;
  },
  
  getInventory: async () => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return products.map(p => ({
      id: p.id,
      name: p.name,
      stock: p.stock || 0,
      reorder_point: 5,
      price: p.price,
      category: p.category,
      image: p.image || ''
    }));
  },
  
  updateInventory: async (id: string | number, stock: number) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productIndex = products.findIndex(p => String(p.id) === String(id));
    if (productIndex !== -1) {
      products[productIndex].stock = stock;
      localStorage.setItem('products', JSON.stringify(products));
      return products[productIndex];
    }
    throw new Error('Product not found');
  },
  
  getCustomers: async () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    return registeredUsers.map((user: any) => {
      const userOrders = orders.filter(o => o.customer?.email === user.email);
      return {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        orders_count: userOrders.length,
        total_spent: userOrders.reduce((sum, o) => sum + o.total, 0),
        last_order: userOrders.length > 0 ? userOrders[userOrders.length - 1].date : null,
        notes: user.notes || ''
      };
    });
  },
  
  updateCustomer: async (id: string | number, payload: any) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex((u: any) => String(u.id) === String(id));
    if (userIndex !== -1) {
      registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...payload };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      return registeredUsers[userIndex];
    }
    throw new Error('Customer not found');
  },
  
  getDiscounts: async () => {
    return JSON.parse(localStorage.getItem('discounts') || '[]');
  },
  
  createDiscount: async (payload: any) => {
    const discounts = JSON.parse(localStorage.getItem('discounts') || '[]');
    const newDiscount = {
      ...payload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    discounts.push(newDiscount);
    localStorage.setItem('discounts', JSON.stringify(discounts));
    return newDiscount;
  },
  
  updateDiscount: async (id: string | number, payload: any) => {
    const discounts = JSON.parse(localStorage.getItem('discounts') || '[]');
    const discountIndex = discounts.findIndex((d: any) => String(d.id) === String(id));
    if (discountIndex !== -1) {
      discounts[discountIndex] = { ...discounts[discountIndex], ...payload };
      localStorage.setItem('discounts', JSON.stringify(discounts));
      return discounts[discountIndex];
    }
    throw new Error('Discount not found');
  },
  
  deleteDiscount: async (id: string | number) => {
    const discounts = JSON.parse(localStorage.getItem('discounts') || '[]');
    const filteredDiscounts = discounts.filter((d: any) => String(d.id) !== String(id));
    localStorage.setItem('discounts', JSON.stringify(filteredDiscounts));
    return true;
  },
  
  getDelivery: async () => {
    return JSON.parse(localStorage.getItem('deliveries') || '[]');
  },
  
  updateDelivery: async (id: string | number, payload: any) => {
    const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
    const deliveryIndex = deliveries.findIndex((d: any) => String(d.id) === String(id));
    if (deliveryIndex !== -1) {
      deliveries[deliveryIndex] = { ...deliveries[deliveryIndex], ...payload };
      localStorage.setItem('deliveries', JSON.stringify(deliveries));
      return deliveries[deliveryIndex];
    }
    throw new Error('Delivery not found');
  },

  createDelivery: async (payload: any) => {
    const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
    const newDelivery = {
      id: Date.now().toString(),
      order_id: payload.orderId,
      customer: payload.customer,
      address: payload.address,
      items: payload.items,
      tracking_number: payload.trackingNumber || '',
      status: 'Order Placed',
      placed_date: payload.placedDate || new Date().toISOString(),
      estimated_delivery: payload.estimatedDelivery || '',
      courier: payload.courier || undefined,
      rider_name: payload.riderName || undefined,
      rider_contact: payload.riderContact || undefined
    };
    deliveries.push(newDelivery);
    localStorage.setItem('deliveries', JSON.stringify(deliveries));
    return newDelivery;
  },

  deleteDelivery: async (id: string | number) => {
    const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
    const filteredDeliveries = deliveries.filter((d: any) => String(d.id) !== String(id));
    localStorage.setItem('deliveries', JSON.stringify(filteredDeliveries));
    return true;
  },
  
  getReportOverview: async () => {
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const discounts = JSON.parse(localStorage.getItem('discounts') || '[]');
    
    return {
      kpis: {
        revenue: orders.reduce((sum: number, o: any) => sum + o.total, 0),
        orders: orders.length,
        delivered: orders.filter((o: any) => o.status === 'Delivered').length,
        processing: orders.filter((o: any) => o.status === 'Processing').length
      },
      salesData: [
        { month: 'Jan', revenue: 45000, orders: 85 },
        { month: 'Feb', revenue: 52000, orders: 98 },
        { month: 'Mar', revenue: 48000, orders: 90 },
        { month: 'Apr', revenue: 61000, orders: 115 },
        { month: 'May', revenue: 55000, orders: 105 },
        { month: 'Jun', revenue: 67000, orders: 128 }
      ],
      statusBreakdown: [
        { name: 'Delivered', value: 45, color: '#059669' },
        { name: 'Processing', value: 25, color: '#B7885E' },
        { name: 'Pending', value: 20, color: '#D97706' },
        { name: 'Out for Delivery', value: 10, color: '#7C3AED' }
      ],
      topProducts: products.slice(0, 5).map((p: any) => ({
        name: p.name,
        quantity: p.stock || 0,
        revenue: p.price * (p.stock || 0)
      }))
    };
  },
  
  updateDeliveryStatus: async (id: string | number, status: string) => {
    const deliveries = JSON.parse(localStorage.getItem('deliveries') || '[]');
    const deliveryIndex = deliveries.findIndex((d: any) => String(d.id) === String(id));
    if (deliveryIndex !== -1) {
      deliveries[deliveryIndex].status = status;
      localStorage.setItem('deliveries', JSON.stringify(deliveries));
      return deliveries[deliveryIndex];
    }
    throw new Error('Delivery not found');
  }
};
