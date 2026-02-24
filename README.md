# @sdkwork/app-sdk

Professional TypeScript SDK for SDKWork Platform. Supports both Node.js and browser environments.

## Installation

```bash
npm install @sdkwork/app-sdk

# or
yarn add @sdkwork/app-sdk

# or
pnpm add @sdkwork/app-sdk
```

## Quick Start

### Using API Key (Server-side)

```typescript
import { createClient } from '@sdkwork/app-sdk';

const client = createClient({
  baseUrl: 'https://api.sdkwork.com',
  apiKey: 'your-api-key',
});
```

### Using Auth Token (Client-side)

```typescript
import { createClient } from '@sdkwork/app-sdk';

const client = createClient({
  baseUrl: 'https://api.sdkwork.com',
});

// Login and set auth token
const loginResponse = await client.auth.login({
  username: 'user@example.com',
  password: 'password123',
});
client.setAuthToken(loginResponse.accessToken);
```

## Modules

| Module | Description |
|--------|-------------|
| `auth` | Authentication - login, register, logout |
| `user` | User management - profile, settings |
| `chat` | AI Chat - sessions, messages, streaming |
| `payment` | Payment - create, query, methods |
| `order` | Orders - create, list, manage |
| `upload` | File upload - single, chunk, presigned |
| `model` | AI Models - list, search, pricing |
| `generation` | Content Generation - image, video, audio |
| `product` | Products - list, detail, SKUs |
| `vip` | VIP Membership - levels, benefits |

## API Reference

### Authentication

```typescript
// Login
const loginResponse = await client.auth.login({
  username: 'user@example.com',
  password: 'password123',
});
client.setAuthToken(loginResponse.accessToken);

// Register
const userInfo = await client.auth.register({
  username: 'newuser',
  password: 'password123',
  email: 'newuser@example.com',
});

// Logout
client.clearAuthToken();
```

### User

```typescript
// Get profile
const profile = await client.user.getProfile();

// Update profile
const updated = await client.user.updateProfile({
  nickname: 'New Nickname',
  bio: 'Hello World',
});

// Upload avatar
const result = await client.user.uploadAvatar(file);

// Change password
await client.user.changePassword({
  oldPassword: 'old',
  newPassword: 'new',
  confirmPassword: 'new',
});
```

### Chat

```typescript
// Create session
const session = await client.chat.createSession({
  modelId: 'gpt-4',
  systemPrompt: 'You are a helpful assistant.',
});

// Send message
const message = await client.chat.sendMessage(session.id, {
  content: 'Hello, AI!',
});

// Stream message
await client.chat.sendMessageStream(session.id, { content: 'Hello!' }, (chunk) => {
  console.log('Chunk:', chunk);
});

// Get history
const messages = await client.chat.getMessageHistory(session.id, { page: 1, size: 20 });

// Export conversation
const exportResult = await client.chat.exportConversation(session.id, {
  format: 'markdown',
});
```

### Payment

```typescript
// Get payment methods
const methods = await client.payment.listMethods('APP');

// Create payment
const payment = await client.payment.create({
  orderId: '123456',
  paymentProvider: 'WECHAT_PAY',
  productType: 'miniapp',
});

// Query status
const status = await client.payment.getStatus(payment.paymentId);

// Close payment
await client.payment.close(payment.paymentId);
```

### Order

```typescript
// List orders
const orders = await client.order.list({ status: 'PENDING', page: 1, size: 20 });

// Get statistics
const stats = await client.order.getStatistics();

// Create order
const order = await client.order.create({
  orderType: 'RECHARGE',
  productId: 'product-123',
  quantity: 1,
});

// Pay order
const paymentParams = await client.order.pay(order.id, {
  paymentMethod: 'WECHAT_PAY',
});

// Cancel order
await client.order.cancel(order.id, { reason: 'Changed mind' });
```

### Upload

```typescript
// Upload single file
const file = await client.upload.uploadFile(fileObject, 'image');

// Upload multiple files
const files = await client.upload.uploadFiles([file1, file2], 'document');

// Chunk upload for large files
const init = await client.upload.initChunkUpload({
  fileName: 'large-file.zip',
  fileSize: 100000000,
  totalChunks: 10,
});

for (let i = 0; i < init.totalChunks; i++) {
  await client.upload.uploadChunk(init.uploadId, i, chunkBlob);
}

const result = await client.upload.mergeChunks(init.uploadId);

// Get presigned URL
const presigned = await client.upload.getPresignedUrl({
  objectKey: 'path/to/file.jpg',
  method: 'PUT',
});

// Get storage usage
const usage = await client.upload.getStorageUsage();
```

### Model

```typescript
// Get active models
const models = await client.model.getActiveModels('chat', 1, 20);

// Get model detail
const model = await client.model.getByModel('gpt-4');

// Search models
const results = await client.model.search({
  keyword: 'gpt',
  modelType: 'chat',
});

// Get pricing
const price = await client.model.getPrice('gpt-4');

// Get statistics
const stats = await client.model.getStatistics();
```

### Generation

```typescript
// Generate image
const imageTask = await client.generation.createImage({
  prompt: 'A beautiful sunset over mountains',
  model: 'dall-e-3',
  width: 1024,
  height: 1024,
});

// Check task status
const status = await client.generation.getImageTask(imageTask.id);

// Generate video
const videoTask = await client.generation.createVideo({
  prompt: 'A cat playing piano',
  duration: 10,
});

// Generate music
const musicTask = await client.generation.createMusic({
  prompt: 'Upbeat electronic music',
  genre: 'electronic',
  duration: 60,
});
```

### Product

```typescript
// List products
const products = await client.product.list({ page: 1, size: 20 });

// Get product detail
const product = await client.product.getById('product-123');

// Get SKUs
const skus = await client.product.getSkus('product-123');

// Search products
const results = await client.product.search('keyword', 1, 20);

// Check stock
const inStock = await client.product.checkStock('product-123', 5);
```

### VIP

```typescript
// Get VIP info
const vipInfo = await client.vip.getInfo();

// Get levels
const levels = await client.vip.getLevels();

// Get benefits
const benefits = await client.vip.getBenefits(1);

// Get status
const status = await client.vip.getStatus();
```

## Error Handling

```typescript
import { SdkworkError, AuthenticationError, NetworkError } from '@sdkwork/app-sdk';

try {
  await client.user.getProfile();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log('Please login again');
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
  } else if (error instanceof SdkworkError) {
    console.log('SDK error:', error.code, error.message);
  }
}
```

## Configuration

```typescript
interface SdkworkConfig {
  baseUrl: string;           // API base URL (required)
  apiKey?: string;           // API key for server-side auth
  authToken?: string;        // User auth token (set via setAuthToken)
  tenantId?: string;         // Tenant ID for multi-tenant
  timeout?: number;          // Request timeout in ms (default: 30000)
  headers?: Record<string, string>; // Custom headers
}
```

## Client Methods

| Method | Description |
|--------|-------------|
| `setApiKey(key)` | Set API key |
| `setAuthToken(token)` | Set auth token after login |
| `clearAuthToken()` | Clear auth token (logout) |
| `setUserId(id)` | Set user ID |

## Browser Support

- Chrome >= 80
- Firefox >= 75
- Safari >= 14
- Edge >= 80

## Node.js Support

- Node.js >= 18.0.0

## License

MIT
