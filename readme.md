# Junior Technical School — Full Stack Project

## What was fixed (Auth Removal Update)

### Root problems resolved:
1. **401 Unauthorized** — All routes were protected by Clerk auth middleware. Removed Clerk entirely.
2. **404 errors** — Admission API had a hardcoded `onrender.com` URL. Changed to relative `/api/admission`.
3. **Form field mismatch** — Admission form sent `name/email/phone/course/message` but model expected `name/selectedClass/dob/parentName/contact/address`. Admission model updated to accept both sets of fields.
4. **ClerkProvider crash** — `index.js` wrapped app in `<ClerkProvider>`. Removed.
5. **Navbar Clerk crash** — Navbar used `SignedIn`, `SignedOut`, `UserButton` from Clerk. Replaced with simple links.

### Admin access (no auth):
Gallery, Events, and AdmissionDashboard now have a **🔒 Admin** button.
- Default password: `admin123`
- Change it by setting `REACT_APP_ADMIN_PASS=yourpassword` in `frontend/.env`
- Admin state persists in `localStorage` per page

---

## Setup & Run

### Backend
```bash
cd backend
npm install
npm run dev        # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start          # runs on http://localhost:3000
```

Make sure the `backend/uploads/` folder exists (auto-created on first upload).

### Pages
| Route | Description |
|---|---|
| `/` | Home |
| `/about` | About school |
| `/admissions` | Submit admission form |
| `/dashboard` | View all admissions (Admin toggle) |
| `/events` | Events & circulars (Admin toggle for add/delete) |
| `/gallery` | Photo gallery (Admin toggle for add/delete) |
| `/contact` | Contact form |
| `/inbox` | View contact messages |

### Environment Variables

**backend/.env**
```
MONGO_URI=your_mongodb_uri
PORT=5000
```

**frontend/.env**
```
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_ADMIN_PASS=admin123
```
