# Kế hoạch kiến trúc Flavor và luồng đặt hàng

Tài liệu này tập hợp các quyết định thiết kế cho catalog flavor, frontend, customization, cart, order và identity.

## 1. Mục tiêu

Backend là nguồn dữ liệu chuẩn cho toàn bộ dữ liệu nghiệp vụ của flavor. Frontend chỉ giữ dữ liệu thương hiệu và presentation như màu sắc, animation, hình ảnh và layout.

Luồng tổng thể:

```text
Catalog → Customization → Cart → Order
              ↑
          Identity
```

## 2. Mô hình domain

```text
Flavor  = thành phần hương vị
Topping = thành phần thêm
Product = món hoàn chỉnh trong menu
Store   = nơi bán hoặc nhận món
```

### Catalog

Catalog cung cấp dữ liệu khách có thể xem trước khi đặt hàng:

- `flavor/`: vanilla, chocolate, matcha.
- `topping/`: cookie, hạnh nhân, caramel.
- `product/`: món hoàn chỉnh như Chocolate Sundae hoặc Matcha Cookie Cup.
- `store/`: cửa hàng, địa chỉ, giờ mở cửa và trạng thái hoạt động.

`Flavor` là một lựa chọn hoặc thành phần. `Product` là món hoàn chỉnh có thể gồm flavor, topping, size và giá riêng.

## 3. Dữ liệu Flavor

### Field thuộc backend

`Flavor` nên quản lý các field sau:

```text
id
name
tagline
description
category
available
badge
ingredients: List<String>
allergens: List<String>
textureNotes: List<String>
pairing: String
```

Ví dụ JSON:

```json
{
  "id": "vanilla-gold",
  "name": "Tahitian Vanilla Soft Serve",
  "tagline": "Smooth, timeless & ultra-creamy",
  "description": "Pure Tahitian vanilla bean soft serve...",
  "category": "Signature",
  "available": true,
  "badge": "Most Popular",
  "ingredients": [
    "Fresh Organic Milk",
    "Tahitian Vanilla Pods"
  ],
  "allergens": [
    "Milk"
  ],
  "textureNotes": [
    "Silky Smooth",
    "Velvety Melts"
  ],
  "pairing": "Pairs exquisitely with warm caramel waffle pieces."
}
```

### Field chỉ thuộc frontend

Các field sau không cần nằm trong entity hoặc database:

```text
primaryColor
accentColor
animation metadata
image metadata
layout metadata
font and visual effects
```

`primaryColor` và `accentColor` là presentation data, không phải business data. Giữ chúng ở frontend giúp backend không phụ thuộc vào giao diện.

## 4. Cách lưu danh sách String

Java nên dùng:

```java
private List<String> ingredients;
private List<String> allergens;
private List<String> textureNotes;
```

PostgreSQL nên dùng `JSONB`, không dùng chuỗi phân cách bằng dấu phẩy:

```sql
ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
texture_notes JSONB NOT NULL DEFAULT '[]'::jsonb
```

Lợi ích:

- Java nhận trực tiếp thành `List<String>`.
- API trả JSON tự nhiên.
- Không cần tự tách chuỗi bằng dấu phẩy.
- Không bị lỗi nếu một phần tử chứa dấu phẩy.
- Dễ thêm hoặc xóa phần tử.

Entity cần mapping JSON của Hibernate, ví dụ:

```java
@JdbcTypeCode(SqlTypes.JSON)
@Column(columnDefinition = "jsonb", nullable = false)
private List<String> ingredients;
```

Áp dụng tương tự cho `allergens` và `textureNotes`.

## 5. Quyết định về pairing

`pairing` nên thuộc `Flavor` vì nó là thông tin mô tả flavor, tương tự `description` hoặc `textureNotes`:

```text
Vanilla:
Pairs well with caramel and waffle bites.
```

`Customization` không sở hữu dữ liệu pairing. Nó chỉ sử dụng pairing để hiển thị gợi ý trong lúc khách lựa chọn.

Nếu sau này cần pairing có cấu trúc hơn, có thể thêm:

```text
flavor_topping_pairings
- flavor_id
- topping_id
- priority
- recommendation_text
```

MVP chưa cần bảng này. Trước mắt dùng `pairing: String` là đủ.

## 6. Migration V2

Không sửa migration `V1` nếu migration đó đã được chạy. Tạo file:

```text
backend/src/main/resources/db/migration/V2__expand_flavor_details.sql
```

Nội dung dự kiến:

```sql
ALTER TABLE flavors
    ADD COLUMN tagline TEXT NOT NULL DEFAULT '',
    ADD COLUMN badge VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN texture_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN pairing TEXT NOT NULL DEFAULT '';
```

Sau đó cập nhật dữ liệu cho từng flavor:

```sql
UPDATE flavors
SET
    tagline = 'Smooth, timeless & ultra-creamy',
    badge = 'Most Popular',
    ingredients = '["Fresh Organic Milk", "Tahitian Vanilla Pods"]'::jsonb,
    allergens = '["Milk"]'::jsonb,
    texture_notes = '["Silky Smooth", "Velvety Melts"]'::jsonb,
    pairing = 'Pairs exquisitely with warm caramel waffle pieces.'
WHERE id = 'vanilla-gold';
```

Không thêm `primaryColor` hoặc `accentColor` vào migration.

## 7. Backend Flavor flow

Luồng đọc flavor:

```text
PostgreSQL
    ↓
Flavor entity
    ↓
FlavorRepository
    ↓
FlavorService
    ↓
FlavorResponse DTO
    ↓
FlavorController
    ↓
GET /api/flavors
```

Các file chính:

### `Flavor.java`

- Thêm `tagline` và `pairing`.
- Đổi `ingredients`, `allergens`, `textureNotes` thành `List<String>`.
- Xóa `primaryColor` và `accentColor`.
- Cập nhật constructor và getter.

### `FlavorResponse.java`

Response gồm:

```text
id
name
tagline
description
category
available
badge
ingredients
allergens
textureNotes
pairing
```

Không trả màu frontend.

### `FlavorService.java`

Map đầy đủ field từ entity sang DTO.

### `FlavorController.java`

Giữ endpoint public:

```text
GET /api/flavors
```

## 8. Dọn duplicate class

Hiện các thư mục khác đang chứa bản sao `Flavor` nhưng vẫn khai báo package `com.creme.catalog.flavor`. Đây là nguyên nhân Maven báo `duplicate class`.

Các bản sao trong các thư mục sau cần được xóa hoặc thay bằng class đúng module:

```text
cart/
product/
store/
topping/
customization/
identity/
order/
```

Chỉ giữ implementation flavor chính ở:

```text
catalog/flavor/
```

Không copy `Flavor` sang các module khác. Khi module mới cần dữ liệu flavor, module đó gọi public query service của catalog.

## 9. Frontend contract

### `ApiFlavor`

Frontend mở rộng type:

```ts
export interface ApiFlavor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Signature' | 'Seasonal' | 'Dairy-Free';
  available: boolean;
  badge: string;
  ingredients: string[];
  allergens: string[];
  textureNotes: string[];
  pairing: string;
}
```

### Presentation metadata

Không giữ bản sao đầy đủ trong `FLAVOR_LIST`. Tách thành metadata presentation:

```ts
export const FLAVOR_PRESENTATION = {
  'vanilla-gold': {
    primaryColor: brand.foreground,
    accentColor: brand.primary,
  },
  'dark-chocolate-crunch': {
    primaryColor: brand.chocolate,
    accentColor: brand.primary,
  },
};
```

Frontend chỉ giữ:

```text
id
primaryColor
accentColor
image
animation metadata
```

Không giữ lại trong `brand.ts` các field đã thuộc backend như `name`, `description`, `tagline`, `ingredients` hoặc `textureNotes`.

### `toProductFlavor()`

Hàm này ghép:

```text
API flavor
  + frontend presentation theo id
  = ProductFlavor dùng để render
```

Nếu backend thêm flavor mới chưa có presentation metadata, nên dùng màu fallback thay vì throw error làm hỏng toàn bộ menu.

## 10. Customization

Customization xử lý lựa chọn custom của khách:

```text
Base: Vanilla
Extra flavors: Chocolate, Strawberry
Toppings: Oreo, Caramel
Size: Large
```

Trách nhiệm:

- Kiểm tra base flavor tồn tại và còn bán.
- Kiểm tra extra flavors.
- Kiểm tra topping còn bán.
- Kiểm tra giới hạn, ví dụ tối đa 2 extra flavors và 3 toppings.
- Tính giá quote.
- Sử dụng `pairing` để đưa ra gợi ý.
- Đại diện cho custom recipe.

Customization không lưu order cuối cùng.

### Ranh giới module

Không làm:

```text
CustomizationService → FlavorRepository
CustomizationService → Flavor entity
```

Nên làm:

```text
CustomizationService
        ↓
FlavorCatalogQuery
        ↓
Catalog FlavorService
        ↓
FlavorRepository
```

Ví dụ public interface:

```java
public interface FlavorCatalogQuery {
    FlavorInfo findAvailableFlavor(String flavorId);
}
```

Customization chỉ biết DTO hoặc interface công khai, không biết entity nội bộ của catalog.

### Luồng quote

```text
Frontend gửi flavorId, toppingIds, size
        ↓
CustomizationController
        ↓
CustomizationService
        ↓
Catalog query service kiểm tra flavor/topping
        ↓
Customization kiểm tra giới hạn
        ↓
Customization tính giá
        ↓
QuoteResponse
```

## 11. Cart

Cart là danh sách tạm thời trước checkout:

```text
1 × Matcha Cookie Cup
1 × Custom Vanilla Ice Cream
```

Trách nhiệm:

- Thêm item.
- Xóa item.
- Đổi quantity.
- Lưu custom selection hiện tại.
- Tính subtotal tạm thời.
- Gọi lại quote khi item thay đổi.

Cart không phải order. Cart có thể bị sửa hoặc bỏ qua.

## 12. Order

Order được tạo khi khách xác nhận checkout.

Trách nhiệm:

- Validate cart lần cuối.
- Kiểm tra availability hiện tại.
- Lấy giá hiện tại từ catalog/customization.
- Tính lại tổng tiền ở backend.
- Lưu order và order items trong transaction.
- Lưu snapshot tên, lựa chọn và unit price.
- Quản lý trạng thái.

Trạng thái ví dụ:

```text
PENDING → CONFIRMED → PREPARING → READY → COMPLETED
```

Frontend không được gửi `totalPrice` để backend tin tưởng. Frontend chỉ gửi IDs, size và quantity.

## 13. Identity

Identity xử lý người đang thực hiện request:

- Đăng ký và đăng nhập.
- Xác định customer hiện tại.
- Quản lý role `CUSTOMER` và `ADMIN`.
- Bảo vệ cart và order của từng user.
- Cho phép admin quản lý catalog và cập nhật order.

Quyền truy cập dự kiến:

```text
Public:
  xem flavors, toppings, products, stores

Customer:
  xem và sửa cart của mình
  tạo order
  xem order của mình

Admin:
  quản lý catalog
  cập nhật trạng thái order
```

Cần quyết định chính sách guest checkout. Nếu hỗ trợ guest, cart cần gắn với session hoặc cart token. Nếu bắt đăng nhập, cart gắn với user ID.

## 14. Quan hệ module

```text
Catalog
  ├── Flavor
  ├── Topping
  ├── Product
  └── Store

Customization
  ├── nhận flavorId/toppingId
  ├── gọi Catalog query service
  ├── validate selection
  └── calculate quote

Cart
  ├── lưu item khách đang chọn
  ├── lưu custom selection
  └── gọi lại quote khi cần

Order
  ├── validate cart lần cuối
  ├── lấy giá hiện tại
  ├── lưu snapshot
  └── quản lý trạng thái đơn

Identity
  ├── xác định customer hiện tại
  ├── bảo vệ cart/order
  └── phân quyền CUSTOMER/ADMIN
```

## 15. Thứ tự triển khai

### Phase 0: Dọn backend

1. Xóa các file `Flavor` duplicate.
2. Giữ package chính `catalog.flavor`.
3. Compile backend để xác nhận hết lỗi duplicate class.

### Phase 1: Hoàn thiện database

1. Tạo `V2__expand_flavor_details.sql`.
2. Thêm `tagline`, `badge`, `pairing`.
3. Thêm các field JSONB.
4. Cập nhật dữ liệu cho từng flavor.
5. Không thêm màu frontend vào database.

### Phase 2: Hoàn thiện entity và API

1. Sửa `Flavor.java`.
2. Sửa `FlavorResponse`.
3. Sửa `FlavorService`.
4. Kiểm tra `GET /api/flavors`.
5. Viết test kiểm tra response JSON.

### Phase 3: Đồng bộ frontend

1. Mở rộng `ApiFlavor`.
2. Tách `FLAVOR_PRESENTATION` khỏi dữ liệu catalog.
3. Sửa `toProductFlavor()`.
4. Sửa `FlavorShowcase` và `FlavorModal`.
5. Kiểm tra loading, empty, error và flavor mới từ database.

### Phase 4: Xây customization

1. Tạo quote request.
2. Tạo `FlavorCatalogQuery`.
3. Validate base flavor.
4. Validate extra flavors.
5. Validate tối đa 3 toppings.
6. Tính giá ở backend.
7. Trả `QuoteResponse`.
8. Dùng `pairing` để hiển thị gợi ý.

### Phase 5: Cart và order

1. Cart nhận kết quả quote.
2. Cart lưu selection hiện tại.
3. Checkout gửi IDs, size và quantity.
4. Order kiểm tra lại catalog.
5. Order tính lại giá.
6. Order lưu snapshot flavor, topping và unit price.
7. Trả `orderCode` từ backend thay cho mã random frontend.

### Phase 6: Identity

1. Quyết định guest checkout hay bắt đăng nhập.
2. Nếu guest, dùng session hoặc cart token.
3. Nếu account, liên kết cart/order với user ID.
4. Chỉ admin được quản lý catalog và trạng thái order.

## 16. Kiểm thử cần có

### Backend

- Entity mapping với JSONB.
- Flyway chạy được từ V1 đến V2.
- `GET /api/flavors` trả đủ field.
- Flavor unavailable không xuất hiện trong public list.
- Quote từ chối flavor hoặc topping không tồn tại.
- Quote từ chối vượt quá giới hạn.
- Giá được tính ở backend.
- Order lưu snapshot và transaction đúng.
- Customer không xem được order của user khác.

### Frontend

- `ApiFlavor` khớp JSON backend.
- Loading, empty và error state hoạt động.
- Modal render được `ingredients`, `allergens`, `textureNotes` và `pairing`.
- Flavor mới từ backend không làm app crash nếu thiếu presentation metadata.
- Frontend không gửi hoặc quyết định `totalPrice`.

## 17. Quyết định cuối cùng

```text
Backend:
  toàn bộ dữ liệu flavor và nghiệp vụ

Frontend:
  màu sắc, animation, hình ảnh và presentation

Customization:
  gọi catalog qua public query service
  không gọi trực tiếp FlavorRepository

Pairing:
  thuộc Flavor
  được Customization sử dụng để gợi ý

ingredients:
  List<String> → JSONB

textureNotes:
  List<String> → JSONB

allergens:
  List<String> → JSONB

primaryColor/accentColor:
  xóa khỏi backend, giữ ở frontend
```

Thứ tự quan trọng nhất:

```text
dọn duplicate class
→ V2 migration
→ entity/API
→ frontend
→ customization
→ cart/order
→ identity
```

### Ai work

# Work Summary

## Done

- Cleaned up all duplicate `Flavor` classes that were causing duplicate class errors.
- Standardized `Flavor`:
  - The backend manages `tagline`, `badge` and `pairing`.
  - `ingredients`, `allergens` and `textureNotes` use `List<String>` and PostgreSQL JSONB.
  - Removed the `primaryColor` and `accentColor` colors from the backend.
- Completed the API:
  - `GET /api/flavors`
  - `GET /api/toppings`
  - `GET /api/products`
  - `GET /api/stores`
  - `POST /api/custom-ice-creams/quote`
  - `GET/POST/DELETE /api/cart/**`
  - `POST /api/orders`
  - `POST /api/identity/register`
- Added entity, repository, service, DTO and controller for:
  - Flavor
  - Topping
  - Product
  - Store
  - Customization size
  - Cart
  - Order
  - Identity user
- Customization now:
  - Checks flavor/topping availability.
  - Limits to a maximum of 2 extra flavors and 3 toppings.
  - Calculates the price from the database.
- Order now:
  - Takes its data from the cart.
  - Recalculates the price on the backend.
  - Stores a snapshot of items, quantity and unit price.
  - Generates `orderCode` on the backend.
- Frontend now:
  - Uses flavor data from the API.
  - Uses topping/store data from the API.
  - Removed the random order code.
  - Sends the real cart and order to the backend.
  - Keeps colors/icons/animation on the frontend.
- Added migrations:
  - `V2__expand_catalog_and_order_schema.sql`
  - `V3__seed_catalog_reference_data.sql`

## Validation

- Backend compile: successful.
- Frontend build: successful.
- Scoped frontend lint: successful.
- Full frontend lint still has pre-existing errors in `StoryCanvasSection.tsx`.
- Backend tests could not run yet because PostgreSQL reported:

After configuring `DB_PASSWORD` correctly, run:
cd backend
DB_PASSWORD=your_password ./mvnw test

## Current limitations

Identity currently has registration and password hashing only. Login/session/JWT and a dedicated cart page are not implemented yet. Guest checkout already works through `X-Guest-Token`.


## some note
JSON and JSONB
→ JSONB là lựa chọn phổ biến hơn trong thực tế vì query nhanh và index được.
JSONB: Khi cần query, filter, index thường xuyên → dùng 90% trường hợp

JSON: Khi chỉ lưu trữ nguyên bản, ít query, cần giữ format gốc (log, config, audit trail)

### some operator in PostgreSQL
Toán tử	Ý nghĩa
->	Lấy value dạng JSON
->>	Lấy value dạng text
#>	Lấy nested theo path (JSON)
#>>	Lấy nested theo path (text)
@>	Chứa (containment)
<@	Được chứa bởi
?	Có key/array element
?|	Có ít nhất 1 trong các key
?&	Có tất cả các key nay la toan tu sql ha, hay sao day


Đoạn identity/checkout nghĩa là gì?
- Identity: phần quản lý tài khoản.
- Registration: đã có API tạo tài khoản.
- Password hashing: mật khẩu được biến thành chuỗi băm bằng BCrypt trước khi lưu, thay vì lưu nguyên mật khẩu.
- Login: chưa có luồng đăng nhập bằng tài khoản vừa tạo.
- Session/JWT: cơ chế giúp server nhớ và xác nhận “người này đã đăng nhập”; phần này chưa triển khai.
- Trang cart riêng: chưa có trang để khách mở giỏ hàng, xem và chỉnh các món. Backend đã có API giỏ hàng.
Khách chưa đăng nhập vẫn có luồng đặt hàng: trình duyệt tạo một mã khách và gửi kèm request trong X-Guest-Token. Backend dùng mã đó để tìm đúng giỏ hàng.
Ví dụ: bạn chọn kem → frontend thêm kem vào giỏ của mã khách đó → gửi thông tin đặt hàng → backend tạo đơn. Đây là đặt hàng, chưa đồng nghĩa với việc đã tích hợp thanh toán online.
