# 1. Ý tưởng tổng thể

Ví dụ brand của bạn là một thương hiệu kem thủ công cao cấp:

**Crème** — artisanal ice cream made your way.

Khách vào website và có 2 lựa chọn chính:

```
                HOME
                 │
        ┌────────┴────────┐
        ↓                 ↓
     EXPLORE           CREATE
   OUR FLAVORS      YOUR ICE CREAM
        │                 │
        ↓                 ↓
  Chọn kem có sẵn     Tự customize
                          │
                          ↓
                         CART
                          │
                          ↓
                        ORDER
```

Biến trải nghiệm khám phá và tự tạo kem thành một quá trình mua hàng.

```
Discover
   ↓
Customize
   ↓
Visualize
   ↓
Add to cart
   ↓
Order
```

---

# 2. Chức năng quan trọng nhất: Build Your Ice Cream

Đây sẽ là **core feature** của website.

Khách click:

**CREATE YOUR ICE CREAM**

Sau đó đi qua từng bước.

## Step 1 — Choose your base

Ví dụ:

```
Choose your base

○ Milk
○ Dark Chocolate
○ Matcha
○ Yogurt
○ Coconut
```

## Step 2 — Choose flavors

```
Choose your flavors

□ Tahitian Vanilla
□ Belgian Chocolate
□ Strawberry
□ Pistachio
□ Salted Caramel
□ Mango
```

Có thể giới hạn:

```
Choose up to 2 flavors
```

## Step 3 — Choose toppings

```
Add toppings

□ Brownie
□ Cookie crumble
□ Roasted almond
□ Chocolate chips
□ Caramel sauce
□ Fresh strawberry
```

Mỗi topping có thể cộng thêm tiền:

```
Brownie        +$1
Pistachio      +$1.5
Caramel        +$0.5
```

## Step 4 — Choose size

```
Small       $5
Regular     $7
Large       $9
```

## Step 5 — See your creation

Đây mới là phần thú vị.

Website hiển thị:

```
       🍨

   Your Ice Cream

Vanilla
+ Chocolate
+ Brownie
+ Caramel

Total: $9.50
```

Và khi user thay đổi flavor/topping: price tự động update.

---
## Order: (this one can remind you about number money that company obtain in 1 a company of some it guy)
PENDING
   ↓
CONFIRMED
   ↓
PREPARING
   ↓
READY
   ↓
DELIVERED

## some technique in backend 
Concurrency
Transaction
Race condition
Database locking

## try to do paymant by QR code or bank
- can do after 

# 3. Có nên cho khách "tạo bất kỳ loại kem nào" không?

Mình **không khuyên** cho tự do hoàn toàn.

Ví dụ user có thể chọn:

```
Vanilla
+ Chocolate
+ Matcha
+ Strawberry
+ Mango
+ 15 toppings
```

Backend sẽ rất khó kiểm soát.

Thay vào đó dùng **rules**:

```
Base: 1
Flavor: max 2
Toppings: max 3
Sauce: max 1
```

Ví dụ:

```
Ice Cream
├── Base: 1
├── Flavors: 1–2
├── Toppings: 0–3
└── Sauce: 0–1
```

Đây chính là chỗ backend trở nên thú vị.

Backend phải validate:

- Is this combination allowed?
- Is this flavor available?
- Is topping still in stock?
- How much does this configuration cost?

Ngoài custom ice cream, bạn vẫn nên có **kem signature**.

---

# Các tính năng khác

## User account — Saved Ice Creams

Ví dụ khách lần đầu tạo kem mà mình yêu thích, sau đó sẽ có chế độ lưu loại kem đó để lần sau khách có thể mua lại mà không mất công create lại từ đầu.

## Order tracking

Order tracking hoặc order or book a table.

## Admin and inventory

Should have admin and inventory.

## Flavor pairing

Another feature: flavor pairing.

Nếu user chọn: Dark Chocolate, website gợi ý:

```
Pistachio      ★★★★★
Sea Salt       ★★★★★
Caramel        ★★★★☆
```

> If you like **Pistachio**, you might enjoy **Roasted Almond**.


---

# Website pages

```
/
├── Home
├── /menu
├── /menu/:id
├── /create
├── /cart
├── /checkout
├── /orders
├── /orders/:id
├── /account
├── /favorites
│
└── /admin
    ├── /orders
    ├── /products
    ├── /flavors
    ├── /inventory
    └── /customers
```

---

# Phase 1 — MVP

Làm cho website **có thể bán kem**:

```
Home
 ↓
Menu
 ↓
Product
 ↓
Build Your Ice Cream
 ↓
Cart
 ↓
Checkout
 ↓
Order
```

Backend:

```
React
 ↓
Spring Boot
 ↓
PostgreSQL
```

Có:

- Authentication
- Product
- Custom ice cream
- Cart
- Order
- Database

**Đây là phiên bản đầu tiên phải hoàn thành.**

---

# Phase 2 — Real business features

Thêm:

- Order tracking
- Inventory
- Admin dashboard
- Saved creations
- Order history
- Address
- Coupon
- Reviews

---

# Phase 3 — Premium experience

Lúc này mới làm những thứ "wow":

- Flavor pairing
- Recommendations
- Animations
- 3D ice cream preview
- Personalized suggestions
- Seasonal flavors
- Loyalty points

---

# 12. Backend của bạn sẽ có gì?

Nếu bạn đang học Java thì đây là project rất tốt để áp dụng Java backend.

Ví dụ:

```
Frontend
React
   ↓
REST API
   ↓
Spring Boot
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

**Các entity:**

- User
- Product
- Flavor
- Topping
- IceCream
- Cart
- CartItem
- Order
- OrderItem
- Address
- Payment

**Các service:**

- UserService
- ProductService
- IceCreamService
- CartService
- OrderService
- PaymentService
- InventoryService

**Các controller:**

- UserController
- ProductController
- IceCreamController
- CartController
- OrderController

Đây chính là lúc bạn sẽ thấy OOP mà chúng ta vừa nói đến thực tế như thế nào.