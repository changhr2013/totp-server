# 浏览器兼容性配置

本TOTP演示项目已针对主流浏览器进行了优化配置。

## 支持的浏览器版本

### 桌面浏览器
- **Chrome** 60+
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+
- **Opera** 47+

### 移动端浏览器
- **Chrome Mobile** 60+
- **Firefox Mobile** 55+
- **Safari Mobile** 12+
- **Samsung Internet** 8.0+

## 兼容性特性

### ✅ 已支持的功能
- **ES2017+语法** - 现代JavaScript特性
- **CSS Grid/Flexbox** - 现代布局系统
- **Web Crypto API** - 用于安全的随机数生成
- **localStorage** - 本地数据存储
- **Clipboard API** - 复制功能
- **Promise/async-await** - 异步操作
- **Fetch API** - 网络请求

### ⚠️ 需要支持的特性
- **Web Crypto API** - TOTP密钥生成必需
- **localStorage** - 用户数据存储必需
- **ES6+语法** - 现代JavaScript必需

## 降级处理

### 不支持的浏览器
如果用户浏览器不支持Web Crypto API，应用会显示友好的错误提示：
- 建议使用现代浏览器
- 提供替代方案说明

### Polyfills
对于需要支持旧浏览器的场景，可以启用以下polyfills：
- `core-js` - ES6+语法支持
- `regenerator-runtime` - async/await支持

## 测试建议

### 测试环境
建议在以下环境测试：
- Chrome 60+ (Windows/macOS/Linux)
- Firefox 55+ (Windows/macOS/Linux)
- Safari 12+ (macOS/iOS)
- Edge 79+ (Windows)

### 移动端测试
- iOS Safari 12+
- Android Chrome 60+
- Samsung Internet 8+

## 配置说明

### TypeScript目标
- `target: "es2017"` - 支持async/await
- `lib: ["dom", "dom.iterable", "es2017", "es2018"]` - 包含现代DOM API

### PostCSS配置
自动添加浏览器前缀，支持：
- 市场份额 > 1%
- 最近2个版本
- Firefox ESR
- 排除IE 11

### 构建优化
- 自动代码分割
- 现代浏览器优化
- 移除控制台日志（生产环境）

## 性能考虑

### 包大小优化
- 静态导出减少运行时依赖
- 按需加载组件
- 压缩和优化CSS/JS

### 加载策略
- 关键CSS内联
- 字体预加载
- 图片优化

## 故障排除

### 常见问题
1. **Web Crypto API不可用** - 检查HTTPS环境
2. **localStorage被禁用** - 提示用户启用或更换浏览器
3. **样式不兼容** - 确认浏览器支持CSS Grid/Flexbox

### 调试工具
- 使用浏览器开发者工具
- 检查控制台错误
- 验证网络请求