# imgart 用户体系 & 管理员后台设计方案

## 📅 日期：2026-03-25

---

## 一、积分规则

| 行为 | 积分变化 | 说明 |
|------|---------|------|
| 新用户注册 | +100 | 首次注册赠送 |
| 邀请好友注册 | +20 | 双方各获得20积分 |
| 每日首次登录 | +5 | 每日一次 |
| 生成图片 | -2 | 每次生成消耗 |
| VIP月费 | +500/月 | 开通VIP赠送 |

**积分永久有效，不过期。**

---

## 二、VIP会员定价

| 套餐 | 价格 | 积分 | 有效期 | 权益 |
|------|------|------|--------|------|
| 体验版 | ¥9.9 | 100积分 | 7天 | 无专属权益 |
| 月卡 | ¥29 | 500积分 | 30天 | 专属风格+8折生成 |
| 季卡 | ¥79 | 1500积分 | 90天 | 专属风格+7折生成 |
| 年卡 | ¥299 | 8000积分 | 365天 | 全功能+6折生成 |

**VIP权益：**
- 生成图片享受折扣（6-8折）
- 专属艺术风格（普通用户不可用）
- 优先排队生成
- 专属客服支持

---

## 三、数据库设计

### 3.1 User 表扩展

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  role          UserRole  @default(FREE)
  credits       Int       @default(100)     // 当前积分
  totalCredits  Int       @default(100)     // 历史获得积分
  totalUsage    Int       @default(0)       // 历史使用次数
  vipExpireAt   DateTime?                   // VIP到期时间
  inviteCode    String    @unique           // 用户的邀请码
  invitedBy     String?                     // 邀请人ID
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?

  generations   Generation[]
  creditLogs    CreditLog[]
}

enum UserRole {
  FREE
  VIP
  ADMIN
}
```

### 3.2 CreditLog 表

```prisma
model CreditLog {
  id        String     @id @default(cuid())
  userId    String
  type      CreditType
  amount    Int
  balance   Int
  remark    String?
  createdAt DateTime   @default(now())

  user User @relation(fields: [userId], references: [id])
}

enum CreditType {
  REGISTER          // 注册赠送
  INVITE            // 邀请好友
  LOGIN_DAILY       // 每日登录
  PURCHASE          // 充值购买
  GENERATE          // 生成图片
  VIP_GIFT          // VIP赠送
  ADMIN_ADJUST      // 管理员调整
}
```

### 3.3 VIPOrder 表

```prisma
model VIPOrder {
  id          String      @id @default(cuid())
  userId      String
  package     VIPPackage  @default(MONTHLY)
  amount      Int         // 实付金额(分)
  status      OrderStatus @default(PENDING)
  tradeNo     String?     // 支付流水号
  expireAt     DateTime    // VIP到期时间
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user User @relation(fields: [userId], references: [id])
}

enum VIPPackage {
  TRIAL    // 体验版 9.9
  MONTHLY  // 月卡 29
  QUARTER  // 季卡 79
  YEARLY   // 年卡 299
}

enum OrderStatus {
  PENDING   // 待支付
  PAID      // 已支付
  CANCELLED // 已取消
  REFUNDED  // 已退款
}
```

---

## 四、页面结构

### 4.1 用户端

```
/user-center
├── /user-center            # 首页-概览
├── /user-center/profile     # 个人资料
├── /user-center/usage       # 使用记录
├── /user-center/credits     # 积分明细
├── /user-center/invite      # 邀请好友
├── /user-center/membership  # 会员升级
└── /user-center/orders      # 订单记录
```

### 4.2 管理端

```
/admin
├── /admin                   # 数据概览
├── /admin/users             # 用户管理
├── /admin/orders            # 订单管理
├── /admin/credits           # 积分管理(手动调整)
└── /admin/settings          # 系统设置
```

---

## 五、API 设计

### 5.1 用户相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/user/me | 获取当前用户信息 |
| PATCH | /api/user/me | 更新个人资料 |
| GET | /api/user/credits | 获取积分记录 |
| GET | /api/user/invite | 获取邀请码和邀请列表 |

### 5.2 VIP相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/vip/packages | 获取VIP套餐列表 |
| POST | /api/vip/orders | 创建VIP订单 |
| POST | /api/vip/webhook | 支付回调 |
| GET | /api/vip/orders | 获取订单列表 |

### 5.3 管理后台API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/users | 用户列表(分页) |
| GET | /api/admin/users/:id | 用户详情 |
| PATCH | /api/admin/users/:id/credits | 调整用户积分 |
| GET | /api/admin/orders | 订单列表 |
| PATCH | /api/admin/orders/:id | 订单操作 |

---

## 六、管理后台界面设计

### 6.1 首页概览

```
┌─────────────────────────────────────────────────────────┐
│ 🖥️ imgart 管理后台                        [admin@imgart] │
├─────────────────────────────────────────────────────────┤
│  📊 今日数据                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 新用户   │ │ 活跃用户 │ │ 新订单   │ │ 今日收入  │  │
│  │   128    │ │   1,247  │ │    45    │ │  ¥1,890  │  │
│  │  ↑12%    │ │  ↑8%     │ │  ↑23%    │ │  ↑15%    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  📋 最近订单                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 用户        套餐      金额   状态    时间        │   │
│  │ zhang***   月卡      ¥29    已支付  2分钟前    │   │
│  │ li***      季卡      ¥79    待支付  5分钟前    │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6.2 用户管理页面

```
┌─────────────────────────────────────────────────────────┐
│ 👥 用户管理                               [搜索] [筛选] │
├─────────────────────────────────────────────────────────┤
│  筛选: [全部] [FREE] [VIP] [今日] [本周]                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑ │ 用户       邮箱        积分  角色  注册时间  │   │
│  │───│───────────│────────────│────│────│──────────│   │
│  │ ☑ │ 张三       z***@g.com  85   VIP  2026-03-20 │   │
│  │ ☑ │ 李四       li***@.com  23   FREE 2026-03-22 │   │
│  │ ☑ │ 王五       wa***@.com  156  VIP  2026-03-18 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [批量操作 ▼]  [导出CSV]              第1页/共50页 ◀▶ │
└─────────────────────────────────────────────────────────┘
```

### 6.3 用户详情弹窗

```
┌─────────────────────────────────────────────────┐
│  👤 用户详情                            [关闭] ✕ │
├─────────────────────────────────────────────────┤
│  头像: 🧑‍💻  昵称: 张三                         │
│  邮箱: zhangsan@gmail.com                       │
│  角色: ⭐ VIP         VIP到期: 2026-04-25       │
│  邀请码: ABCD1234    邀请人数: 5人              │
├─────────────────────────────────────────────────┤
│  📊 积分信息                                    │
│  当前积分: 85    历史获得: 620    使用次数: 267  │
├─────────────────────────────────────────────────┤
│  ⚡ 积分操作                                    │
│  [增加积分: ___ ] [减少积分: ___ ] [备注: ___ ] │
│                         [确认调整]              │
├─────────────────────────────────────────────────┤
│  📋 积分记录 (最近10条)                         │
│  2026-03-25 生成图片      -2      剩余: 85     │
│  2026-03-25 每日登录      +5      剩余: 87     │
│  2026-03-24 VIP月卡      +500     剩余: 82     │
└─────────────────────────────────────────────────┘
```

---

## 七、实施计划

### Phase 1：基础用户体系 (1-2天)
- [ ] 扩展 Prisma Schema
- [ ] 创建积分系统 API
- [ ] 实现每日登录送积分
- [ ] 实现生成图片扣积分

### Phase 2：邀请机制 (0.5天)
- [ ] 生成用户邀请码
- [ ] 邀请注册 API
- [ ] 积分发放逻辑

### Phase 3：VIP系统 (1-2天)
- [ ] VIP套餐页面
- [ ] 订单系统
- [ ] 支付集成（微信/支付宝）

### Phase 4：管理后台 (1-2天)
- [ ] Admin 认证中间件
- [ ] 用户管理页面
- [ ] 积分管理功能
- [ ] 订单管理页面

### Phase 5：UI/UX 优化 (0.5天)
- [ ] 用户中心设计
- [ ] 管理员界面美化

**预计总工期：5-7天**

---

## 八、技术要点

1. **邀请码生成**：6位随机字母，校验唯一性
2. **积分扣减**：需要事务保证原子性
3. **VIP判断**：`user.role === 'VIP' && user.vipExpireAt > now()`
4. **管理后台权限**：`session.user.role === 'ADMIN'`
5. **支付回调**：需要签名校验防止伪造
