# Express Auth + File Upload API

A Node.js Express API with the following features:

- ✅ User registration and login with hashed passwords (bcrypt)
- ✅ JWT-based authentication with Access & Refresh tokens
- ✅ Role-based access control (`admin`, `user`, etc.)
- ✅ File uploads with Multer middleware
- ✅ SHA256-based file deduplication (same file is not stored again)
- ✅ File type/size validation using Zod
- ✅ Modular folder structure using TypeScript
- ✅ Centralized API response handling

---

## 📁 Project Structure
## App scretes
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

