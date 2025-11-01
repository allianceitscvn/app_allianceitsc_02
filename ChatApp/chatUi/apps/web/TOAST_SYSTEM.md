# Toast Notifications System

## Overview

This project uses `react-hot-toast` for displaying beautiful toast notifications throughout the application. The system includes automatic error handling for API responses and manual toast triggering.

## Features

✅ **Automatic API Error Handling** - All API errors display toast notifications automatically  
✅ **Multiple Toast Types** - success, error, warning, info, loading, custom  
✅ **Promise Toasts** - Show loading, success, and error states for async operations  
✅ **Centralized Error Parsing** - Handles backend error format: `{ error: "...", message: "..." }`  
✅ **Global Configuration** - Consistent styling and positioning across the app  
✅ **Type-Safe** - Full TypeScript support  

## Installation

Already installed! The package `react-hot-toast` is included in dependencies.

## Usage

### Import Toast Utilities

```typescript
import Toast from '@/lib/toast';
// or
import { Toast, handleApiError, handleApiSuccess } from '@/lib/toast';
```

### Basic Toast Types

#### Success Toast
```typescript
Toast.success('User created successfully!');
Toast.success('Message sent', { duration: 3000 });
```

#### Error Toast
```typescript
Toast.error('Failed to save data');
Toast.error('Network error', { duration: 6000 });
```

#### Warning Toast
```typescript
Toast.warning('This action cannot be undone');
```

#### Info Toast
```typescript
Toast.info('New messages available');
```

#### Loading Toast
```typescript
const toastId = Toast.loading('Processing...');
// Later dismiss it:
Toast.dismiss(toastId);
```

### Promise Toasts

Automatically show loading, success, and error states:

```typescript
Toast.promise(
  apiClient.post('/api/users', userData),
  {
    loading: 'Creating user...',
    success: 'User created successfully!',
    error: 'Failed to create user',
  }
);

// With dynamic messages
Toast.promise(
  fetchUserData(),
  {
    loading: 'Loading...',
    success: (data) => `Loaded ${data.length} users`,
    error: (err) => `Error: ${err.message}`,
  }
);
```

### Custom Toast

```typescript
Toast.custom('Custom message', {
  icon: '🎉',
  style: {
    background: '#333',
    color: '#fff',
  },
  duration: 5000,
});
```

### Dismissing Toasts

```typescript
// Dismiss specific toast
const toastId = Toast.success('Done!');
Toast.dismiss(toastId);

// Dismiss all toasts
Toast.dismissAll();
```

## Automatic API Error Handling

### How It Works

The API client automatically intercepts all error responses and displays toast notifications:

```typescript
// In your code - no need to manually handle errors
try {
  await apiClient.post('/api/users', data);
} catch (error) {
  // Toast is automatically shown with the error message
  // Error format: { error: "NotFoundException", message: "User not found" }
}
```

### Backend Error Format

The system expects errors in this format:
```json
{
  "error": "NotFoundException",
  "message": "User not found"
}
```

The `message` field is extracted and displayed in the toast.

### Error Handling Function

For manual error handling:

```typescript
import { handleApiError } from '@/lib/toast';

try {
  await someApiCall();
} catch (error) {
  const errorMessage = handleApiError(error, 'Default message');
  // Toast is shown automatically and error message is returned
}
```

### Success Handling Function

For manual success toasts:

```typescript
import { handleApiSuccess } from '@/lib/toast';

const data = await apiClient.get('/api/users');
handleApiSuccess('Users loaded successfully', data);
```

## Examples in the Codebase

### 1. Authentication (useAuthStore.ts)

```typescript
login: async (username: string) => {
  try {
    const tokens = await authApi.generateToken(username);
    // ... store tokens
    Toast.success(`Welcome back, ${username}!`);
  } catch (error) {
    // Error toast is already shown by API client
    throw error;
  }
},

logout: async () => {
  await authApi.logout();
  Toast.info('You have been logged out successfully');
}
```

### 2. API Client Error Interceptor (client.ts)

```typescript
// Automatically handles all API errors
this.client.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Parse error response
    if (error.response?.data?.message) {
      handleApiError(error, error.response.data.message);
    }
    return Promise.reject(error);
  }
);
```

### 3. Manual Usage in Components

```typescript
import Toast from '@/lib/toast';

function MyComponent() {
  const handleSave = async () => {
    try {
      await apiClient.post('/api/data', formData);
      Toast.success('Data saved successfully!');
      // API errors are handled automatically
    } catch (error) {
      // Already handled by interceptor
    }
  };

  const handleDelete = () => {
    Toast.warning('Are you sure?');
  };

  return (
    <button onClick={handleSave}>Save</button>
  );
}
```

## Configuration

### Global Toast Settings

Located in `__root.tsx`:

```typescript
<Toaster 
  position="top-right"
  toastOptions={{
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    },
    error: {
      duration: 5000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  }}
/>
```

### Toast Positions

Available positions:
- `'top-left'`
- `'top-center'`
- `'top-right'` (default)
- `'bottom-left'`
- `'bottom-center'`
- `'bottom-right'`

### Custom Styling Per Toast

```typescript
Toast.success('Saved!', {
  style: {
    background: 'green',
    color: 'white',
  },
  icon: '✔️',
  duration: 2000,
  position: 'bottom-center',
});
```

## Toast Types Reference

| Function | Icon | Color | Duration | Use Case |
|----------|------|-------|----------|----------|
| `Toast.success()` | ✅ | Green (#10b981) | 3s | Successful operations |
| `Toast.error()` | ❌ | Red (#ef4444) | 5s | Errors and failures |
| `Toast.warning()` | ⚠️ | Orange (#f59e0b) | 4s | Warnings and cautions |
| `Toast.info()` | ℹ️ | Blue (#3b82f6) | 4s | Informational messages |
| `Toast.loading()` | 🔄 | Gray | ∞ | Loading states |
| `Toast.custom()` | Custom | Custom | Custom | Custom messages |
| `Toast.promise()` | Auto | Auto | Auto | Async operations |

## Advanced Features

### Updating Toasts

```typescript
const loadingToast = Toast.loading('Processing...');

// Later, update it to success
Toast.dismiss(loadingToast);
Toast.success('Done!');
```

### Conditional Toasts

```typescript
if (data.length === 0) {
  Toast.warning('No data found');
} else {
  Toast.success(`Found ${data.length} items`);
}
```

### Multiple Toasts

```typescript
Toast.success('Profile updated');
Toast.info('Email verification sent');
// Both toasts will stack
```

## Best Practices

### ✅ DO

- Use `Toast.success()` for successful operations
- Use `Toast.error()` for failures (but API errors are automatic)
- Use `Toast.info()` for neutral information
- Use `Toast.warning()` before destructive actions
- Keep messages short and clear
- Use promise toasts for async operations

### ❌ DON'T

- Don't manually show toasts for API errors (already automatic)
- Don't use toasts for critical confirmations (use modals)
- Don't show too many toasts at once
- Don't use very long messages (truncate if needed)

## Troubleshooting

### Toast Not Showing

1. Check that `<Toaster />` is added to `__root.tsx`
2. Verify the toast function is called correctly
3. Check browser console for errors

### Duplicate Toasts

The API interceptor automatically shows error toasts, so don't manually show them again:

```typescript
// ❌ Bad - shows toast twice
try {
  await apiClient.post('/api/data', data);
} catch (error) {
  Toast.error('Failed'); // Don't do this!
}

// ✅ Good - error toast is automatic
try {
  await apiClient.post('/api/data', data);
  Toast.success('Saved!'); // Only show success
} catch (error) {
  // Error already handled
}
```

### Styling Issues

If toasts look wrong, check:
1. Tailwind CSS is properly configured
2. Global toast options in `__root.tsx`
3. No conflicting CSS rules

## API Reference

### Toast Object

```typescript
Toast.success(message: string, options?: ToastOptions): string
Toast.error(message: string, options?: ToastOptions): string
Toast.warning(message: string, options?: ToastOptions): string
Toast.info(message: string, options?: ToastOptions): string
Toast.loading(message: string, options?: ToastOptions): string
Toast.custom(message: string, options?: ToastOptions): string
Toast.promise<T>(promise: Promise<T>, messages: PromiseMessages, options?: ToastOptions): Promise<T>
Toast.dismiss(toastId?: string): void
Toast.dismissAll(): void
Toast.remove(toastId?: string): void
```

### Helper Functions

```typescript
handleApiError(error: any, defaultMessage?: string): string
handleApiSuccess(message: string, data?: any): any
```

### ToastOptions Interface

```typescript
interface ToastOptions {
  id?: string;
  icon?: React.ReactNode;
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: React.CSSProperties;
  className?: string;
  iconTheme?: {
    primary: string;
    secondary: string;
  };
  ariaProps?: React.AriaAttributes;
}
```

## Resources

- [react-hot-toast Documentation](https://react-hot-toast.com/)
- [GitHub Repository](https://github.com/timolins/react-hot-toast)

## Summary

The toast system is fully configured and ready to use:

1. ✅ `react-hot-toast` installed
2. ✅ Toast utilities created in `src/lib/toast.ts`
3. ✅ Toaster component added to `__root.tsx`
4. ✅ API client configured to show error toasts automatically
5. ✅ Auth store integrated with success/info toasts
6. ✅ Backend error format supported: `{ error: "...", message: "..." }`

Just import `Toast` and use it anywhere in your app!
