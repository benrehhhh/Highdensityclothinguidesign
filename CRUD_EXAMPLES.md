# CRUD Operations Examples

This document provides examples to test all CRUD operations in the High Density Clothing application.

## Product Management CRUD Examples

### Create Product Example
```javascript
// Test Data
const newProduct = {
  name: "Test Product",
  category: "Unisex",
  price: "999",
  stock: "50",
  sizes: ["S", "M", "L"],
  colors: ["Black", "White"],
  description: "Test product for CRUD verification",
  materials: "Cotton",
  care: "Machine washable",
  image: "/api/placeholder/300/300",
  status: "Active"
};

// Steps to Test:
1. Go to Admin → Product Management
2. Click "Add Product"
3. Fill in all fields with the test data above
4. Click "Add Product"
5. Verify product appears in the list
```

### Update Product Example
```javascript
// Update Steps:
1. Find the created product in the list
2. Click the edit button
3. Change price to "1299"
4. Click "Update Product"
5. Verify the price changed in the list
```

### Delete Product Example
```javascript
// Delete Steps:
1. Find the product to delete
2. Click the delete button
3. Confirm deletion
4. Verify product is removed from the list
```

## Discount Management CRUD Examples

### Create Discount Example
```javascript
const newDiscount = {
  code: "TEST50",
  type: "Coupon",
  value: "50",
  valueType: "Percentage",
  startDate: "2026-05-10",
  endDate: "2026-12-31",
  minPurchase: "1000",
  maxUses: "100"
};

// Steps to Test:
1. Go to Admin → Discount Management
2. Click "Add Discount"
3. Fill in the test data above
4. Click "Create Discount"
5. Verify discount appears in the list
```

### Update Discount Example
```javascript
// Update Steps:
1. Find the created discount
2. Click the edit button
3. Change value to "25"
4. Click "Update Discount"
5. Verify the value changed
```

### Deactivate Discount Example
```javascript
// Deactivate Steps:
1. Find the discount to deactivate
2. Click the toggle status button
3. Verify status changes from Active to Inactive
```

## Customer Management CRUD Examples

### View Customer Data
```javascript
// Steps to Test:
1. Go to Admin → Customer Management
2. Verify customer data loads from localStorage
3. Check customer statistics (Total, VIP, New, Revenue)
4. Use search to find specific customers
```

### Update Customer Example
```javascript
// Update Steps:
1. Click on a customer to view details
2. Add notes about the customer
3. Click "Update Customer"
4. Verify notes are saved
```

## Inventory Management CRUD Examples

### Update Stock Example
```javascript
// Steps to Test:
1. Go to Admin → Inventory Management
2. Find a product to update
3. Click "Update Stock"
4. Enter new stock quantity (e.g., 100)
5. Click "Update Stock"
6. Verify stock level changed
```

## Order Management Examples

### Create Order (Checkout)
```javascript
// Steps to Test:
1. Add products to cart from catalog
2. Go to checkout
3. Fill in shipping information
4. Select payment method
5. Click "Place Order"
6. Verify order appears in order history
```

### Track Order Example
```javascript
// Steps to Test:
1. After placing an order, go to Track Order page
2. Verify the order appears with correct details
3. Check tracking timeline shows proper status
4. Verify order items are displayed correctly
```

## Wishlist Management Examples

### Add to Wishlist
```javascript
// Steps to Test:
1. Go to Catalog page
2. Find a product and click the heart icon
3. Verify product appears in wishlist
4. Check wishlist count updates
```

### Remove from Wishlist
```javascript
// Steps to Test:
1. Go to Wishlist page
2. Find a product to remove
3. Click the remove button (X)
4. Verify product is removed from wishlist
5. Check wishlist count updates
```

## Notification Management Examples

### View Notifications
```javascript
// Steps to Test:
1. Go to Notifications page
2. Verify notifications load properly
3. Check unread count badge
4. Filter notifications by type
```

### Mark as Read
```javascript
// Steps to Test:
1. Find an unread notification
2. Click the notification to mark as read
3. Verify unread count decreases
4. Check notification styling changes
```

## Reports Page Examples

### Generate Reports
```javascript
// Steps to Test:
1. Go to Admin → Reports
2. Verify all charts load without errors
3. Check sales trend chart displays data
4. Verify order volume chart shows bars
5. Check status breakdown pie chart
6. Verify top products and customers lists
```

## Data Verification Checklist

### After Testing CRUD Operations:
- [ ] Products persist after page refresh
- [ ] Discounts show correct active/inactive status
- [ ] Customer data loads from registered users
- [ ] Inventory updates reflect across all pages
- [ ] Orders appear in tracking immediately after checkout
- [ ] Wishlist items sync between catalog and wishlist page
- [ ] Notifications update read/unread status properly
- [ ] Reports generate with actual data from localStorage

### Browser Console Checks:
- [ ] No JavaScript errors
- [ ] All API calls resolve successfully
- [ ] LocalStorage updates correctly
- [ ] Toast notifications appear for all actions

## Test Data Reset

To reset all test data:
```javascript
// Clear localStorage
localStorage.clear();
// Refresh the page to reinitialize with default data
```

These examples provide comprehensive testing for all CRUD operations in the application.
