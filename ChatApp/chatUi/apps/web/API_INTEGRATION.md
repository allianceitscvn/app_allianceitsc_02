# API Integration Guide

## Overview

This project uses a custom Axios-based API client with automatic token management and request/response interceptors.

## Architecture

### Files Structure
```
src/lib/api/
├── client.ts      # Core Axios client with interceptors
├── auth.ts        # Authentication API endpoints
└── index.ts       # Public exports
```

## Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://localhost:7123
```

### 2. API Client Features

The `apiClient` provides:
- ✅ Automatic token attachment to all requests
- ✅ Token storage in localStorage
- ✅ Token expiration checking
- ✅ 401 error handling with auto-redirect to login
- ✅ Type-safe HTTP methods (GET, POST, PUT, DELETE, PATCH)

## Usage

### Authentication Flow

```typescript
import { authApi } from '@/lib/api';

// 1. Login - generates and stores tokens
const tokens = await authApi.generateToken('username');
// Returns: { accessToken, refreshToken, expiredAt }

// 2. Check authentication status
const isAuth = authApi.isAuthenticated();

// 3. Logout - clears tokens
await authApi.logout();
```

### Making API Calls

```typescript
import { apiClient } from '@/lib/api';

// GET request
const users = await apiClient.get('/api/users');

// POST request
const newUser = await apiClient.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const updated = await apiClient.put('/api/users/123', {
  name: 'Jane Doe'
});

// DELETE request
await apiClient.delete('/api/users/123');

// With custom config
const data = await apiClient.get('/api/users', {
  params: { page: 1, limit: 10 },
  headers: { 'X-Custom-Header': 'value' }
});
```

### Token Management

The client automatically:
1. Attaches the `Authorization: Bearer <token>` header to every request
2. Stores tokens in localStorage:
   - `accessToken`
   - `refreshToken`
   - `expiredAt`
3. Checks token expiration before requests
4. Redirects to `/login` on 401 errors

### Manual Token Operations

```typescript
import { apiClient } from '@/lib/api';

// Get current token
const token = apiClient.getToken();

// Check if token is expired
const isExpired = apiClient.isTokenExpired();

// Manually set tokens (not recommended, use authApi.generateToken instead)
apiClient.setToken('access', 'refresh', '2025-12-31T23:59:59Z');

// Clear all tokens
apiClient.clearTokens();
```

## API Endpoints

### Authentication

#### Generate Token
```typescript
POST /api/auth/generate-token
Body: { username: string }
Response: { accessToken: string, refreshToken: string, expiredAt: string }
```

#### Refresh Token (Optional - if backend supports)
```typescript
POST /api/auth/refresh-token
Body: { refreshToken: string }
Response: { accessToken: string, refreshToken: string, expiredAt: string }
```

## Integration with Zustand Store

The `useAuthStore` automatically:
- Calls `authApi.generateToken()` on login
- Stores tokens in both localStorage and Zustand state
- Persists user session across page refreshes
- Clears tokens on logout

```typescript
import { useAuthStore } from '@/stores/useAuthStore';

function MyComponent() {
  const { login, logout, currentUser, isLoading } = useAuthStore();
  
  const handleLogin = async () => {
    try {
      await login('username');
      // User is now authenticated, tokens are stored
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div>
      {currentUser ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Error Handling

### Automatic Error Handling

The client automatically handles:
- **401 Unauthorized**: Clears tokens and redirects to `/login`
- **Network errors**: Rejects promise with error details
- **Timeout**: 30-second default timeout

### Manual Error Handling

```typescript
try {
  const data = await apiClient.get('/api/users');
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
  } else {
    // Error in request setup
    console.error('Error:', error.message);
  }
}
```

## Advanced Usage

### Custom Headers for Specific Requests

```typescript
await apiClient.post('/api/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### Request Timeout

```typescript
await apiClient.get('/api/slow-endpoint', {
  timeout: 60000 // 60 seconds
});
```

### Access Raw Axios Instance

```typescript
const axiosInstance = apiClient.getInstance();
// Use for advanced Axios features
```

## Security Best Practices

1. ✅ Tokens are stored in localStorage (consider httpOnly cookies for production)
2. ✅ HTTPS is used for API communication
3. ✅ Tokens are automatically attached to requests
4. ✅ Expired tokens trigger re-authentication
5. ⚠️ Consider implementing token refresh flow for long-lived sessions

## Troubleshooting

### CORS Issues
If you encounter CORS errors with `https://localhost:7123`:
```javascript
// Backend should allow CORS from your frontend origin
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

### SSL Certificate Issues
For development with self-signed certificates:
```env
# In .env (development only)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### Token Not Attached
Check:
1. Token is stored: `localStorage.getItem('accessToken')`
2. Token is not expired: `apiClient.isTokenExpired()`
3. Request interceptor is working (check Network tab in DevTools)

## Future Enhancements

- [ ] Implement token refresh logic
- [ ] Add request retry mechanism
- [ ] Add request/response logging in development
- [ ] Implement request caching
- [ ] Add rate limiting handling
- [ ] Support multiple API base URLs
