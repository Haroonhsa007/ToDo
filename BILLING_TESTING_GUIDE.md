# Billing System Testing Guide

This guide will help you test the Polar.sh billing integration in your ToDo application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup Steps](#setup-steps)
3. [Backend Testing](#backend-testing)
4. [Frontend Testing](#frontend-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- **Polar.sh Account**: Sign up at [https://polar.sh](https://polar.sh)
- **Test Payment Methods**: Polar provides test cards for sandbox testing

### Required Software
- Python 3.8+
- Node.js 16+
- MySQL 5.7+ or 8.0+
- Git

---

## Setup Steps

### 1. Install Polar SDK

```bash
cd backend
pip install polar-sdk
```

### 2. Configure Polar Credentials

Get your credentials from Polar.sh dashboard:

1. **API Access Token**:
   - Go to Settings > API Keys
   - Create a new API key (sandbox mode)
   - Copy the token (starts with `polar_sandbox_...`)

2. **Webhook Secret**:
   - Go to Settings > Webhooks
   - Create webhook endpoint: `http://localhost:8000/webhooks/polar/`
   - Copy the secret (starts with `whsec_...`)

3. **Organization ID**:
   - Find in your Polar dashboard URL
   - Format: `org_...`

### 3. Update Configuration

Edit `backend/dev.json`:

```json
{
    "DEBUG": true,
    "SECRET_KEY": "your-secret-key",
    "ALLOWED_HOSTS": ["*"],
    "DATABASES": {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": "todolist",
            "USER": "todolist",
            "PASSWORD": "todolist1234",
            "HOST": "localhost",
            "PORT": "3309",
            "OPTIONS": {}
        }
    },
    "POLAR_ACCESS_TOKEN": "polar_sandbox_YOUR_TOKEN",
    "POLAR_WEBHOOK_SECRET": "whsec_YOUR_SECRET",
    "POLAR_SERVER_URL": "https://sandbox-api.polar.sh",
    "POLAR_ORGANIZATION_ID": "org_YOUR_ORG_ID"
}
```

### 4. Run Migrations

```bash
cd backend
python manage.py makemigrations billing
python manage.py migrate
```

### 5. Create Superuser (if not already created)

```bash
python manage.py createsuperuser
```

---

## Backend Testing

### Test 1: Server Startup
```bash
cd backend
python manage.py runserver
```

**Expected Result**: Server starts without errors on `http://localhost:8000`

### Test 2: Admin Panel Access

1. Navigate to: `http://localhost:8000/admin/`
2. Login with superuser credentials
3. Check for "Billing" section in admin panel

**Expected Result**:
- Billing section visible
- Shows: Polar Products, Polar Prices, Subscriptions, Polar Customers, Webhook Events

### Test 3: Create a Product

1. Go to **Billing > Polar Products**
2. Click **Add Polar Product**
3. Fill in:
   - Name: `Premium Plan`
   - Description: `Access to all features`
   - Product Type: `Individual`
   - Is Recurring: ✅ Checked
4. Add inline price:
   - Price Amount: `999` (in cents = $9.99)
   - Price Currency: `USD`
   - Type: `Recurring`
   - Recurring Interval: `month`
5. Click **Save**

**Expected Result**:
- Product saved successfully
- Sync Status shows "Synced to Polar" (green badge)
- Polar ID populated
- Price also synced

**Check in Polar Dashboard**:
- Login to Polar.sh
- Go to Products
- Verify "Premium Plan" appears with $9.99/month price

### Test 4: Manual Sync Action

1. Create another product without auto-sync (if it fails)
2. Select the product in list
3. Choose Action: **Sync selected products to Polar**
4. Click **Go**

**Expected Result**: Success message showing products synced

### Test 5: API Endpoints

Test using curl or Postman:

#### Get Products (Public)
```bash
curl http://localhost:8000/api/v1/billing/products/
```

**Expected**: List of synced products with prices

#### Get Subscription Status (Authenticated)
```bash
# First login to get token
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Then check subscription status
curl http://localhost:8000/api/v1/billing/subscriptions/status/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected**: JSON with `has_active_subscription: false`

---

## Frontend Testing

### Test 1: Frontend Startup

```bash
cd frontend
npm install
npm run dev
```

**Expected Result**: Frontend starts on `http://localhost:5173`

### Test 2: Navigation

1. Login to the application
2. Check sidebar menu

**Expected Result**:
- "Subscription" menu item visible
- Icon: Card/Membership icon

### Test 3: Settings Page

1. Navigate to **Settings**
2. Check for subscription cards

**Expected Result**:
- "My Subscriptions" card visible
- "Subscription Plans" card visible
- Cards are clickable

### Test 4: Pricing Page

1. Click **Settings > Subscription Plans**
2. Or navigate to `/pricing`

**Expected Result**:
- Page shows "Subscription Plans" header
- Displays products from backend
- Each product shows:
  - Name and description
  - Price (formatted: $9.99/month)
  - "Subscribe Now" button
  - Product type badge

### Test 5: My Subscriptions Page

1. Navigate to `/my-subscriptions`

**Expected Result**:
- Shows "My Subscriptions" header
- Message: "You don't have any subscriptions yet"
- "Browse Plans" button visible

---

## End-to-End Testing

### Complete Subscription Flow

#### 1. Browse Plans
1. Login to frontend
2. Go to **Settings > Subscription Plans**
3. Verify products are loaded

#### 2. Create Checkout
1. Click **Subscribe Now** on a plan
2. Frontend creates checkout session

**Expected**:
- Redirect to Polar checkout page
- Checkout URL format: `https://polar.sh/checkout/...`

#### 3. Complete Payment (Sandbox)

On Polar checkout page:
1. Use test card: `4242 4242 4242 4242`
2. Expiry: Any future date
3. CVC: Any 3 digits
4. Complete payment

**Expected**:
- Payment succeeds
- Redirect back to success URL

#### 4. Verify Subscription

1. Polar sends webhook to your backend
2. Backend processes webhook
3. Updates subscription status

**Check**:
1. **Backend Admin**:
   - Go to **Billing > Subscriptions**
   - Verify subscription shows "Active" status
   - Check current period dates

2. **Frontend**:
   - Go to **My Subscriptions**
   - Verify subscription appears
   - Shows:
     - Product name
     - Price
     - Status: Active
     - Current period end date

#### 5. Cancel Subscription

1. On **My Subscriptions** page
2. Click **Cancel Subscription**
3. Confirm cancellation

**Expected**:
- Success message
- Status changes to "Canceled"
- Shows cancellation date
- Access remains until period end

---

## Webhook Testing

### Test Webhook Receipt

1. Go to **Backend Admin > Billing > Webhook Events**
2. Check for received events

**Expected Events**:
- `checkout.created`
- `checkout.updated`
- `subscription.created`
- `subscription.active`
- `order.created`

### Test Webhook Processing

Each webhook should show:
- Event ID
- Event Type
- Processed: ✅ Yes
- Processed At: Timestamp
- No processing errors

**If Errors**:
- Check `Processing Error` field
- Review backend logs
- Verify webhook secret is correct

---

## Troubleshooting

### Issue: Products Not Syncing

**Symptoms**: Sync status shows "Sync Failed"

**Solutions**:
1. Check `dev.json` has correct `POLAR_ACCESS_TOKEN`
2. Verify token starts with `polar_sandbox_` for sandbox
3. Check sync error message in admin
4. Verify `POLAR_ORGANIZATION_ID` is correct
5. Check backend logs for detailed errors

### Issue: Webhooks Not Received

**Symptoms**: No webhook events in admin

**Solutions**:
1. Verify webhook URL in Polar dashboard
2. For localhost testing, use ngrok:
   ```bash
   ngrok http 8000
   ```
   Update webhook URL to ngrok URL
3. Check `POLAR_WEBHOOK_SECRET` matches Polar dashboard
4. Verify webhook endpoint is accessible: `http://localhost:8000/webhooks/polar/`

### Issue: Checkout Redirect Fails

**Symptoms**: Error creating checkout

**Solutions**:
1. Verify product and price are synced (have `polar_id`)
2. Check user has PolarCustomer record
3. Review browser console for errors
4. Check backend logs for API errors

### Issue: Frontend Shows No Products

**Symptoms**: Pricing page empty

**Solutions**:
1. Verify backend is running
2. Check API endpoint: `http://localhost:8000/api/v1/billing/products/`
3. Verify products are synced in admin
4. Check `is_archived` is False
5. Check browser console for CORS errors

### Issue: Authentication Errors

**Symptoms**: 401 Unauthorized errors

**Solutions**:
1. Verify JWT token is valid
2. Check token in localStorage
3. Refresh page to get new token
4. Verify `Authorization: Bearer TOKEN` header is sent

---

## Test Checklist

Use this checklist to verify all functionality:

### Backend
- [ ] Server starts without errors
- [ ] Admin panel accessible
- [ ] Can create products
- [ ] Products auto-sync to Polar
- [ ] Manual sync works
- [ ] Prices sync correctly
- [ ] API endpoints return data
- [ ] Webhooks are received
- [ ] Webhook events are processed

### Frontend
- [ ] Frontend starts without errors
- [ ] Subscription menu visible in sidebar
- [ ] Settings shows subscription cards
- [ ] Pricing page loads products
- [ ] Products display correctly
- [ ] Subscribe button works
- [ ] Redirects to Polar checkout
- [ ] My Subscriptions page works
- [ ] Can cancel subscriptions

### Integration
- [ ] Complete checkout flow works
- [ ] Webhook updates subscription status
- [ ] Subscription shows in frontend
- [ ] Subscription details are accurate
- [ ] Cancel subscription works
- [ ] Status updates properly

---

## Production Checklist

Before deploying to production:

### Configuration
- [ ] Change `POLAR_ACCESS_TOKEN` to production token (starts with `polar_`)
- [ ] Update `POLAR_SERVER_URL` to `https://api.polar.sh`
- [ ] Update webhook URL to production domain
- [ ] Set `DEBUG: false` in prod.json
- [ ] Use strong `SECRET_KEY`

### Security
- [ ] Webhook signature verification enabled
- [ ] HTTPS enabled for webhook endpoint
- [ ] API tokens stored securely (environment variables)
- [ ] CORS configured for production domain only
- [ ] Rate limiting implemented

### Testing
- [ ] Test with real payment methods
- [ ] Verify tax calculations
- [ ] Test subscription lifecycle
- [ ] Test cancellation flow
- [ ] Test webhook reliability
- [ ] Load test checkout flow

---

## Support

### Logs
Check these logs for debugging:
- **Backend**: `python manage.py runserver` output
- **Webhook Events**: Admin > Billing > Webhook Events
- **Browser Console**: DevTools > Console
- **Network**: DevTools > Network tab

### Documentation
- [Polar.sh Documentation](https://docs.polar.sh)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)

### Contact
For issues specific to this integration, check:
- Backend logs for API errors
- Frontend console for client errors
- Polar dashboard for webhook delivery status
