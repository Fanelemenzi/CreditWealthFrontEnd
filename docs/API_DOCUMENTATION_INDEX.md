# ECHS API Documentation Index

## 📍 Location

All API documentation for frontend developers is located in:
```
creditScore/docs/api/
```

## 📚 Available Documentation

### 1. [README.md](./api/README.md)
**Start here!** Overview of all documentation with quick start guide.

### 2. [01_API_Integration_Guide.md](./api/01_API_Integration_Guide.md)
**Complete Technical Reference** (35+ pages)
- Full endpoint documentation
- Request/response examples
- Authentication flow
- Assessment session APIs
- Score calculation APIs
- Validation APIs
- Error handling
- React component examples

### 3. [02_Quick_Reference.md](./api/02_Quick_Reference.md)
**Cheat Sheet** (5 pages)
- Endpoints at a glance
- Common requests/responses
- Score bands and pillars
- Rate limits
- Error codes
- Pro tips

### 4. [03_Frontend_Setup_Guide.md](./api/03_Frontend_Setup_Guide.md)
**Configuration Instructions** (15+ pages)
- Where to set backend URL
- Project structure recommendations
- Axios client setup
- API service files
- Error handler
- Complete React examples
- Testing your connection

## 🚀 Quick Start for Frontend Developers

### Step 1: Read the README
Start with [docs/api/README.md](./api/README.md) for an overview.

### Step 2: Setup Your Frontend
Follow [03_Frontend_Setup_Guide.md](./api/03_Frontend_Setup_Guide.md) to configure:
1. Create `.env` file with backend URL
2. Setup Axios client
3. Create API service files
4. Test connection

### Step 3: Use the API
Reference [01_API_Integration_Guide.md](./api/01_API_Integration_Guide.md) for:
- Complete endpoint details
- Request/response formats
- Code examples

### Step 4: Keep Quick Reference Handy
Use [02_Quick_Reference.md](./api/02_Quick_Reference.md) as your cheat sheet while coding.

## 🎯 What You Can Build

With the ECHS backend API, you can build:

### User Features
✅ User signup/signin with phone numbers  
✅ JWT token authentication  
✅ Session management  

### Assessment Features
✅ Multi-section financial assessment  
✅ 30-day session persistence  
✅ Auto-save answers  
✅ Question navigation  
✅ Progress tracking  
✅ Real-time validation  

### Score Features
✅ Credit score calculation (300-850)  
✅ 9 financial pillar breakdown  
✅ Score bands (Poor to Excellent)  
✅ Validation flags and warnings  
✅ Historical tracking  

### Landing Page
✅ Testimonials  
✅ Metrics  
✅ Score information  
✅ Feature list  

## 📊 Backend Architecture

```
Backend (Django)
├── Authentication (/api/auth/)
│   ├── Signup
│   ├── Signin
│   ├── Logout
│   └── Token Refresh
│
├── Assessment Sessions (/api/assessment-sessions/)
│   ├── Create/Resume Session
│   ├── Save Answers
│   ├── Navigate Questions
│   ├── Mark Sections Complete
│   └── Submit Assessment
│
├── Score Calculation (/api/score-calculation/)
│   ├── Calculate Score
│   └── Get Latest Score
│
├── Validation (/api/assessments/)
│   ├── Validate Field
│   ├── Batch Validate
│   └── Get Field Schema
│
└── Landing Page (/api/landing/)
    └── Get Configuration
```

## 🔧 Configuration Required

### Backend Configuration (Already Done)
The backend is already configured with:
- ✅ CORS enabled for `localhost:3000`, `localhost:8080`
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Session management
- ✅ Data encryption

### Frontend Configuration (You Need to Do)
1. **Create `.env` file:**
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

2. **Install Axios:**
   ```bash
   npm install axios
   ```

3. **Follow the setup guide** in [03_Frontend_Setup_Guide.md](./api/03_Frontend_Setup_Guide.md)

## 🌐 API Base URLs

### Development
```
http://localhost:8000
```

### Production (When deployed)
```
https://api.yourdomain.com
```

## 🔑 Authentication Flow

```
1. User signs up → Receives JWT tokens
2. Store tokens in localStorage
3. Include token in all authenticated requests
4. Token auto-refreshes when expired
5. User logs out → Tokens cleared
```

## 📝 9 Financial Pillars

1. Financial Obligations (15%)
2. Income & Employment (15%)
3. Mobile Money (12%)
4. Assets (12%)
5. Savings & Banking (12%)
6. Expense Management (12%)
7. Household Profile (8%)
8. Financial Literacy (8%)
9. Business Profile (6%)

**Total Score:** 300-850

## ⚡ Rate Limits

| Endpoint | Limit |
|----------|-------|
| Signup | 5/hour per IP |
| Signin | 10/hour per IP |
| Field Validation | 30/min per user |
| Batch Validation | 10/min per user |

## 🚨 Important Notes

1. **Always include Authorization header** for authenticated endpoints:
   ```javascript
   headers: { 'Authorization': `Bearer ${accessToken}` }
   ```

2. **Handle 401 errors** - Implement automatic token refresh

3. **Validate before saving** - Use validation endpoints

4. **Auto-save frequently** - Don't wait for manual save

5. **Show progress** - Display `completion_percentage`

6. **Handle rate limits** - Debounce validation requests

## 📞 Getting Help

1. **Check documentation first:**
   - README.md (overview)
   - Full guide (detailed reference)
   - Quick reference (cheat sheet)
   - Setup guide (configuration)

2. **Test your connection:**
   ```bash
   curl http://localhost:8000/health/
   ```

3. **Check backend logs:**
   ```bash
   tail -f echs.log
   ```

4. **Contact backend team** if issues persist

## 🧪 Testing Your Integration

### 1. Health Check
```bash
curl http://localhost:8000/health/
```

### 2. Signup Test
```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+26878123456",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "email": "test@example.com",
    "full_name": "Test User",
    "registration_channel": "web"
  }'
```

### 3. Get Active Session (requires token)
```bash
curl http://localhost:8000/api/assessment-sessions/active-session/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📖 Additional Resources

- [Backend README](../README.md)
- [API Endpoints Module](../api_endpoints/README.md)
- [Field Validation API](../FIELD_VALIDATION_API.md)
- [Authentication Implementation](../TASK_3_4_IMPLEMENTATION.md)

## 🎓 Learning Path

**For New Developers:**
1. Read [docs/api/README.md](./api/README.md)
2. Follow [03_Frontend_Setup_Guide.md](./api/03_Frontend_Setup_Guide.md)
3. Build a simple login page
4. Test authentication flow
5. Build assessment form
6. Implement score display

**For Experienced Developers:**
1. Skim [02_Quick_Reference.md](./api/02_Quick_Reference.md)
2. Review [01_API_Integration_Guide.md](./api/01_API_Integration_Guide.md) as needed
3. Implement your frontend architecture
4. Reference docs when needed

## 📦 What's Included in Each File

### README.md (5 min read)
- Overview of all documentation
- Quick start guide
- Available features
- Common endpoints
- Error handling basics

### 01_API_Integration_Guide.md (30-45 min read)
- Complete endpoint documentation
- All request/response formats
- Authentication flow examples
- Error handling patterns
- Full React component examples
- CORS configuration
- Security best practices

### 02_Quick_Reference.md (2 min read)
- Endpoints table
- Request/response snippets
- Score bands and pillars
- Rate limits
- Error codes
- Pro tips

### 03_Frontend_Setup_Guide.md (15-20 min + implementation)
- Step-by-step configuration
- File structure recommendations
- Axios client with interceptors
- API service files (auth, assessment, score)
- Error handler utility
- Complete React examples
- Connection testing

## ✅ Documentation Checklist

Before starting development, ensure you:
- [ ] Read the README overview
- [ ] Understand authentication flow
- [ ] Know where to set backend URL
- [ ] Have Axios installed
- [ ] Created API client with interceptors
- [ ] Understand rate limits
- [ ] Know how to handle errors
- [ ] Tested backend connection

## 🎯 Common Use Cases

### User Signs Up
```javascript
POST /api/auth/signup/
→ Store tokens
→ Redirect to assessment
```

### User Takes Assessment
```javascript
GET /api/assessment-sessions/active-session/
→ Display form
→ POST save_answer/ on each input
→ Show completion_percentage
→ POST mark_completed/ when done
```

### User Views Score
```javascript
POST /api/score-calculation/calculate/
→ Display composite_score
→ Show pillar_breakdown
→ Display validation_flags
→ Show recommendations
```

## 💡 Pro Tips

1. **Cache landing page data** - It rarely changes
2. **Debounce validation** - Wait 500ms after user stops typing
3. **Show loading states** - Better UX during API calls
4. **Handle offline** - Show friendly message when network fails
5. **Log errors** - Help with debugging in production
6. **Use error boundaries** - Catch React errors gracefully
7. **Test with bad data** - See how validation works
8. **Monitor rate limits** - Track how close you are to limits

---

**Ready to start? Begin with [docs/api/README.md](./api/README.md)! 🚀**
