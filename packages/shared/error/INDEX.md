# 📚 Centralized Error Database - Complete Documentation

### Error Types Available

#### Authentication (`auth/index.ts`)

```typescript
• InvalidCredentialsError      // Wrong password/email
• UnauthorizedError            // Not logged in
• ForbiddenError               // No permissions
• TokenExpiredError            // JWT expired
• AccountLockedError           // Too many attempts
```

#### Database (`database/`)

```typescript
• DatabaseNotFoundError        // Record doesn't exist
• DatabaseConnectionError      // Can't reach database
• DatabaseQueryError           // SQL error
• DatabaseDuplicateError       // Unique constraint violation
```

#### Network (`network/index.ts`)

```typescript
• HttpError                    // Generic HTTP failure
• ParseError                   // JSON parse failed
• ExternalServiceError         // 3rd party API down
• TimeoutError                 // Request too slow
```

#### Validation (`validation/index.ts`)

```typescript
• ValidationError              // Invalid request body
• BadRequestError              // Malformed request
```

#### Configuration (`config/index.ts`)

```typescript
• ConfigValidationError        // Invalid env vars
• MissingConfigError           // Missing config
```

---

## 🔄 How Data Flows

```
┌─────────────────────┐
│ Backend throws      │
│ custom error        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Maps to HTTP        │
│ exception (401,404) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Frontend receives   │
│ HTTP response       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Converts to custom  │
│ error object        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Accesses metadata   │
│ for display         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Shows user-friendly │
│ message to user     │
└─────────────────────┘
```

---

## 📊 Error Code → HTTP Status Mapping

| HTTP Status | Meaning               | Error Codes                                                     |
| ----------- | --------------------- | --------------------------------------------------------------- |
| **400**     | Bad Request           | VALIDATION_FAILED, BAD_REQUEST                                  |
| **401**     | Unauthorized          | AUTH_INVALID_CREDENTIALS, AUTH_UNAUTHORIZED, AUTH_TOKEN_EXPIRED |
| **403**     | Forbidden             | AUTH_FORBIDDEN                                                  |
| **404**     | Not Found             | DB_NOT_FOUND                                                    |
| **409**     | Conflict              | DB_DUPLICATE_ENTRY                                              |
| **429**     | Too Many Requests     | AUTH_ACCOUNT_LOCKED                                             |
| **500**     | Internal Server Error | DB_QUERY_FAILED, CONFIG_INVALID                                 |
| **502**     | Bad Gateway           | PARSE_ERROR                                                     |
| **503**     | Service Unavailable   | DB_CONNECTION_FAILED, EXTERNAL_SERVICE_FAILED                   |
| **504**     | Gateway Timeout       | REQUEST_TIMEOUT                                                 |

---

## ✅ Best Practices

### DO ✅

- Always include `message` (for logging)
- Always provide `userMessage` in metadata
- Use specific error types (not generic)
- Include relevant context (IDs, values)
- Test error scenarios
- Log error codes for analytics

### DON'T ❌

- Show `message` to users (use `userMessage`)
- Throw generic `Error` class
- Skip required fields
- Expose sensitive data
- Use same error for multiple scenarios

---

## 🛠️ Common Patterns

### Pattern 1: Database Query

```typescript
async getUser(id: string) {
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new DatabaseNotFoundError({
      message: `User ${id} not found`,
      entityType: "User",
      entityId: id,
    });
  }

  return user;
}
```

### Pattern 2: External API Call

```typescript
async callExternalAPI(endpoint: string) {
  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new ExternalServiceError({
        message: `API error: ${response.status}`,
        serviceName: "ExternalAPI",
        statusCode: response.status,
      });
    }

    return response.json();
  } catch (err: any) {
    if (err instanceof TimeoutError) {
      throw err;
    }
    throw new ExternalServiceError({
      message: err.message,
      serviceName: "ExternalAPI",
    });
  }
}
```

### Pattern 3: Error Display (React)

```typescript
function useErrorDisplay(error: any) {
  return {
    message: error?.metadata?.userMessage || "An error occurred",
    code: error?.metadata?.code,
    isRetryable: [503, 504, 429].includes(error?.metadata?.httpStatus),
  };
}
```

---

## 🔧 Next Steps

### To Update Existing Code:

1. Replace old error throws with new ones
2. Update error catch handlers
3. Test error scenarios
4. Add error logging

### To Add New Errors:

1. Determine domain (auth, database, network, etc.)
2. Create error class in appropriate directory
3. Export from `index.ts` in that directory
4. Update main `packages/shared/index.ts`
5. Update this documentation

---

## 🚨 Error Monitoring

Track these in your monitoring service:

```typescript
{
  code: error.metadata.code,              // "AUTH_INVALID_CREDENTIALS"
  httpStatus: error.metadata.httpStatus,  // 401
  context: error.metadata.context,        // { attemptedEmail: "..." }
  timestamp: new Date(),
  userId?: currentUser?.id,
  endpoint?: req.path,
  method?: req.method,
}
```

---

## ✨ Key Features

✅ **Type-Safe**: TypeScript ensures correct error creation
✅ **Structured**: Every error has code, status, message, and context
✅ **User-Friendly**: Built-in messages safe for frontend display
✅ **Debuggable**: Unique codes for logging and monitoring
✅ **HTTP-Aware**: Automatic status code mapping
✅ **Extensible**: Easy to add new errors by domain
✅ **Documented**: Comprehensive guides and examples

---

**Happy error handling! 🎉**
