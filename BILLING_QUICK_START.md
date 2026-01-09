# Billing Quick Start Guide

Get your billing system up and running in 5 minutes!

## 🚀 Quick Setup (5 Steps)

### Step 1: Install Polar SDK
```bash
cd backend
pip install polar-sdk
```

### Step 2: Run Migrations
```bash
python manage.py makemigrations billing
python manage.py migrate
```

### Step 3: Start Backend
```bash
python manage.py runserver
# Server runs on http://localhost:8000
```

### Step 4: Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 5: Access Admin Panel
1. Go to: `http://localhost:8000/admin/`
2. Login with superuser credentials
3. Navigate to **Billing > Polar Products**

✅ **You're ready!** The billing system is now active.

---

## 📋 Basic Usage (Without Polar.sh)

You can use the billing system WITHOUT Polar.sh configuration for testing:

### Create Test Product
1. **Admin Panel** → **Billing** → **Polar Products**
2. Click **Add Polar Product**
3. Fill in:
   - Name: `Basic Plan`
   - Description: `Basic features`
   - Price Amount: `500` (= $5.00)
4. Click **Save**

**Note**: Without Polar credentials, it will show "Sync Failed" - this is normal!

### View in Frontend
1. Login to app at `http://localhost:5173`
2. Go to **Settings** → **Subscription Plans**
3. See your products listed (even without Polar sync)

---

## 🎯 Complete Setup (With Polar.sh)

To enable actual subscriptions and payments:

### 1. Create Polar Account
- Sign up at: [https://polar.sh](https://polar.sh)
- Use **Sandbox Mode** for testing

### 2. Get Credentials

**API Token**:
- Settings > API Keys > Create New
- Copy token (starts with `polar_sandbox_...`)

**Webhook Secret**:
- Settings > Webhooks > Add Endpoint
- URL: `http://localhost:8000/webhooks/polar/`
- Copy secret (starts with `whsec_...`)

**Organization ID**:
- Find in dashboard URL: `polar.sh/YOUR_ORG_ID`

### 3. Update Configuration

Edit `backend/dev.json`:
```json
{
    ...existing config...,
    "POLAR_ACCESS_TOKEN": "polar_sandbox_YOUR_TOKEN",
    "POLAR_WEBHOOK_SECRET": "whsec_YOUR_SECRET",
    "POLAR_SERVER_URL": "https://sandbox-api.polar.sh",
    "POLAR_ORGANIZATION_ID": "org_YOUR_ORG_ID"
}
```

### 4. Restart Backend
```bash
# Stop server (Ctrl+C)
python manage.py runserver
```

### 5. Create Product Again
1. **Admin Panel** → **Billing** → **Polar Products**
2. Add product with price
3. **Sync Status** should show **"Synced to Polar"** ✅

### 6. Test Checkout
1. Frontend → **Settings** → **Subscription Plans**
2. Click **Subscribe Now**
3. Redirects to Polar checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete payment
6. Check **My Subscriptions** to see active subscription

---

## 🔗 Navigation

### Sidebar Menu
- **Subscription** → My active subscriptions

### Settings Page
- **My Subscriptions** → Manage subscriptions
- **Subscription Plans** → Browse available plans

---

## ✨ Features Available

### Without Polar Configuration
✅ Create products in admin
✅ View products in frontend
✅ UI/UX testing
❌ Cannot create checkouts
❌ Cannot process payments
❌ No webhook events

### With Polar Configuration
✅ Everything above, PLUS:
✅ Create real checkouts
✅ Process payments (test mode)
✅ Receive webhooks
✅ Auto-sync to Polar
✅ Full subscription management

---

## 🐛 Common Issues

### "Polar SDK not configured"
**Solution**: This is normal without credentials. Add Polar credentials to `dev.json` or continue testing UI without actual payments.

### "Module 'polar_sdk' not found"
**Solution**:
```bash
pip install polar-sdk
```

### Products not syncing
**Solution**: Check `dev.json` has correct `POLAR_ACCESS_TOKEN` and restart server.

### Webhooks not received
**Solution**: For localhost, use ngrok:
```bash
ngrok http 8000
# Use ngrok URL in Polar webhook settings
```

---

## 📚 Next Steps

- **Full Testing**: See [BILLING_TESTING_GUIDE.md](./BILLING_TESTING_GUIDE.md)
- **API Documentation**: See [backend/README.md](./backend/README.md)
- **Polar Docs**: [https://docs.polar.sh](https://docs.polar.sh)

---

## 🎉 That's It!

Your billing system is ready to use. Start with basic testing (no Polar), then add Polar credentials when ready for real payments.

**Happy Coding!** 🚀
