# @sdkwork/app-sdk

> SDKwork App SDK - 专业级TypeScript SDK，支持双Token认证模式

## 📦 安装

```bash
npm install @sdkwork/app-sdk
# 或
yarn add @sdkwork/app-sdk
# 或
pnpm add @sdkwork/app-sdk
```

## 🚀 快速开始

### 双Token模式（默认）

创建客户端时设置`accessToken`，登录后设置`authToken`：

```typescript
import { createClient } from '@sdkwork/app-sdk';

// 创建客户端时设置accessToken
const client = createClient({
  baseUrl: 'https://api.sdkwork.com',
  accessToken: 'your-access-token',  // 创建时设置
});

// 登录后设置authToken
const loginResponse = await client.auth.login({
  username: 'user@example.com',
  password: 'password123',
});
client.setAuthToken(loginResponse.authToken);  // 登录后设置

// 请求头:
//   Access-Token: {accessToken}
//   Authorization: Bearer {authToken}
```

### APIKEY模式

```typescript
import { createClient } from '@sdkwork/app-sdk';

// 创建客户端时设置apiKey
const client = createClient({
  baseUrl: 'https://api.sdkwork.com',
  apiKey: 'your-api-key',  // 使用APIKEY模式
});

// 请求头: Authorization: Bearer {apiKey}
```

### 模式切换

```typescript
// 从双Token切换到APIKEY模式
client.setApiKey('new-api-key');  // 自动切换并清除tokens

// 从APIKEY切换到双Token模式
client.setAccessToken('access-token');  // 自动切换并清除apiKey
client.setAuthToken('auth-token');
```

## 📚 模块列表

| 模块 | 描述 |
|------|------|
| `auth` | 认证 - 登录、注册、登出 |
| `user` | 用户管理 - 个人资料、设置 |
| `chat` | AI聊天 - 会话、消息、流式输出 |
| `payment` | 支付 - 创建、查询、支付方式 |
| `order` | 订单 - 创建、列表、管理 |
| `upload` | 文件上传 - 单文件、分片、预签名 |
| `model` | AI模型 - 列表、搜索、定价 |
| `generation` | 内容生成 - 图片、视频、音频 |
| `product` | 商品 - 列表、详情、SKU |
| `vip` | VIP会员 - 等级、权益 |
| `address` | 地址管理 |
| `category` | 分类管理 |
| `notification` | 通知消息 |
| `favorite` | 收藏管理 |
| `feedback` | 反馈建议 |
| `cart` | 购物车 |
| `coupon` | 优惠券 |
| `search` | 全局搜索 |
| `history` | 历史记录 |
| `workspace` | 工作空间 |
| `prompt` | 提示词管理 |
| `project` | 项目管理 |
| `analytics` | 数据分析 |
| `settings` | 系统设置 |
| `assets` | 资源管理 |
| `social` | 社交功能 |

## 🔐 认证详解

### 双Token认证流程

```
1. 创建客户端 → 设置accessToken（设备标识/匿名token）
2. 用户登录 → 获取authToken（用户认证token）
3. 设置authToken → 完成认证
4. 请求API → 自动携带双Token
```

### Token说明

| Token | 设置时机 | 用途 | Header |
|-------|---------|------|--------|
| `accessToken` | 创建客户端时 | 设备标识/匿名访问 | `Access-Token` |
| `authToken` | 登录后 | 用户认证 | `Authorization: Bearer` |

### 认证API

```typescript
// 登录
const loginResponse = await client.auth.login({
  username: 'user@example.com',
  password: 'password123',
});
client.setAuthToken(loginResponse.authToken);

// 注册
const userInfo = await client.auth.register({
  username: 'newuser',
  password: 'password123',
  email: 'newuser@example.com',
});

// 登出
client.clearAuthToken();

// 检查认证状态
if (client.isAuthenticated()) {
  console.log('已登录');
}
```

## 📖 API参考

### 用户模块

```typescript
// 获取个人资料
const profile = await client.user.getProfile();

// 更新个人资料
const updated = await client.user.updateProfile({
  nickname: '新昵称',
  bio: '个人简介',
});

// 上传头像
const result = await client.user.uploadAvatar(file);

// 修改密码
await client.user.changePassword({
  oldPassword: '旧密码',
  newPassword: '新密码',
  confirmPassword: '确认密码',
});
```

### 聊天模块

```typescript
// 创建会话
const session = await client.chat.createSession({
  modelId: 'gpt-4',
  systemPrompt: '你是一个有帮助的助手。',
});

// 发送消息
const message = await client.chat.sendMessage(session.id, {
  content: '你好！',
});

// 流式消息
await client.chat.sendMessageStream(session.id, { content: '你好！' }, (chunk) => {
  console.log('收到:', chunk);
});

// 获取历史消息
const messages = await client.chat.getMessageHistory(session.id, { page: 1, size: 20 });

// 导出对话
const exportResult = await client.chat.exportConversation(session.id, {
  format: 'markdown',
});
```

### 支付模块

```typescript
// 获取支付方式
const methods = await client.payment.listMethods('APP');

// 创建支付
const payment = await client.payment.create({
  orderId: '123456',
  paymentProvider: 'WECHAT_PAY',
  productType: 'miniapp',
});

// 查询状态
const status = await client.payment.getStatus(payment.paymentId);

// 关闭支付
await client.payment.close(payment.paymentId);
```

### 订单模块

```typescript
// 订单列表
const orders = await client.order.list({ status: 'PENDING', page: 1, size: 20 });

// 订单统计
const stats = await client.order.getStatistics();

// 创建订单
const order = await client.order.create({
  orderType: 'RECHARGE',
  productId: 'product-123',
  quantity: 1,
});

// 支付订单
const paymentParams = await client.order.pay(order.id, {
  paymentMethod: 'WECHAT_PAY',
});

// 取消订单
await client.order.cancel(order.id, { reason: '取消原因' });
```

### 上传模块

```typescript
// 单文件上传
const file = await client.upload.uploadFile(fileObject, 'image');

// 多文件上传
const files = await client.upload.uploadFiles([file1, file2], 'document');

// 大文件分片上传
const init = await client.upload.initChunkUpload({
  fileName: 'large-file.zip',
  fileSize: 100000000,
  totalChunks: 10,
});

for (let i = 0; i < init.totalChunks; i++) {
  await client.upload.uploadChunk(init.uploadId, i, chunkBlob);
}

const result = await client.upload.mergeChunks(init.uploadId);

// 获取预签名URL
const presigned = await client.upload.getPresignedUrl({
  objectKey: 'path/to/file.jpg',
  method: 'PUT',
});

// 存储使用量
const usage = await client.upload.getStorageUsage();
```

### 模型模块

```typescript
// 获取活跃模型
const models = await client.model.getActiveModels('chat', 1, 20);

// 获取模型详情
const model = await client.model.getByModel('gpt-4');

// 搜索模型
const results = await client.model.search({
  keyword: 'gpt',
  modelType: 'chat',
});

// 获取定价
const price = await client.model.getPrice('gpt-4');

// 统计信息
const stats = await client.model.getStatistics();
```

### 生成模块

```typescript
// 生成图片
const imageTask = await client.generation.createImage({
  prompt: '美丽的日落',
  model: 'dall-e-3',
  width: 1024,
  height: 1024,
});

// 检查任务状态
const status = await client.generation.getImageTask(imageTask.id);

// 生成视频
const videoTask = await client.generation.createVideo({
  prompt: '猫咪弹钢琴',
  duration: 10,
});

// 生成音乐
const musicTask = await client.generation.createMusic({
  prompt: '欢快的电子音乐',
  genre: 'electronic',
  duration: 60,
});
```

## ⚠️ 错误处理

```typescript
import { 
  SdkworkError, 
  AuthenticationError, 
  NetworkError,
  TokenExpiredError 
} from '@sdkwork/app-sdk';

try {
  await client.user.getProfile();
} catch (error) {
  if (error instanceof TokenExpiredError) {
    // Token过期，需要重新登录
    console.log('Token已过期，请重新登录');
    client.clearAuthToken();
  } else if (error instanceof AuthenticationError) {
    // 认证失败
    console.log('认证失败:', error.message);
  } else if (error instanceof NetworkError) {
    // 网络错误
    console.log('网络错误:', error.message);
  } else if (error instanceof SdkworkError) {
    // SDK错误
    console.log('SDK错误:', error.code, error.message);
  }
}
```

## ⚙️ 配置选项

```typescript
interface SdkworkConfig {
  baseUrl: string;           // API基础URL（必填）
  accessToken?: string;      // 访问令牌（创建时设置）
  authToken?: string;        // 认证令牌（登录后设置）
  apiKey?: string;           // API密钥（APIKEY模式）
  tenantId?: string;         // 租户ID
  organizationId?: string;   // 组织ID
  platform?: string;         // 平台标识
  timeout?: number;          // 超时时间（默认30000ms）
  headers?: Record<string, string>; // 自定义请求头
}
```

## 🔧 客户端方法

| 方法 | 描述 |
|------|------|
| `setAccessToken(token)` | 设置访问令牌 |
| `setAuthToken(token)` | 设置认证令牌（登录后） |
| `setApiKey(key)` | 设置API密钥 |
| `setTokens(tokens)` | 批量设置Token |
| `clearAuthToken()` | 清除Token（登出） |
| `isAuthenticated()` | 检查是否已认证 |
| `hasAccessToken()` | 检查是否有访问令牌 |
| `hasAuthToken()` | 检查是否有认证令牌 |
| `getAuthMode()` | 获取当前认证模式 |
| `setAuthMode(mode)` | 设置认证模式 |

## 🌐 浏览器支持

- Chrome >= 80
- Firefox >= 75
- Safari >= 14
- Edge >= 80

## 📦 Node.js支持

- Node.js >= 18.0.0

## 📄 许可证

MIT
