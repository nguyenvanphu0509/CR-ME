# Các dependency và cấu hình Maven của backend

Tài liệu này giải thích các dependency và phần cấu hình chính trong [`pom.xml`](../pom.xml), cùng vai trò của Flyway trong project hiện tại.

## Maven và Spring Boot

### Spring Boot parent `spring-boot-starter-parent`

Project kế thừa cấu hình Maven chuẩn của Spring Boot phiên bản `4.1.1`. Parent quản lý nhiều phiên bản thư viện tương thích, cấu hình build mặc định và cách chạy test. Vì vậy phần lớn dependency không cần khai báo phiên bản riêng.

### Thuộc tính `java.version`

`<java.version>21</java.version>` cho Spring Boot/Maven biết project dùng Java 21 để biên dịch.

## Dependency chạy ứng dụng

| Dependency | Chức năng trong project |
| --- | --- |
| `spring-boot-starter-data-jpa` | Tích hợp Spring Data JPA và Hibernate để ánh xạ Java entity sang bảng database, truy vấn và lưu dữ liệu. Cấu hình hiện tại dùng `spring.jpa.hibernate.ddl-auto=validate`: Hibernate kiểm tra schema phù hợp với entity, chứ không tự tạo/cập nhật schema. |
| `spring-boot-starter-flyway` | Tích hợp Flyway với Spring Boot. Khi ứng dụng khởi động, Flyway có thể chạy các migration SQL để tạo hoặc thay đổi schema theo thứ tự phiên bản. |
| `flyway-database-postgresql` | Cung cấp hỗ trợ database-specific của Flyway cho PostgreSQL. Đây là phần bổ sung cho Flyway để nhận diện và làm việc với PostgreSQL. |
| `spring-boot-starter-security` | Thêm Spring Security để bảo vệ API và cấu hình xác thực/phân quyền. Có dependency này không đồng nghĩa project đã hoàn tất đăng nhập hay JWT; cần cấu hình security và viết phần xử lý tương ứng. |
| `spring-boot-starter-validation` | Hỗ trợ kiểm tra dữ liệu đầu vào bằng Jakarta Bean Validation, chẳng hạn các annotation như `@NotNull`, `@NotBlank`, `@Email`, kết hợp với validation trong controller. |
| `spring-boot-starter-webmvc` | Tạo ứng dụng web/API theo mô hình Spring MVC, nhận HTTP request và trả response qua controller. |
| `springdoc-openapi-starter-webmvc-ui` phiên bản `3.1.0` | Tạo tài liệu API theo OpenAPI và giao diện Swagger UI cho các endpoint MVC, giúp xem và thử API. |
| `postgresql` với scope `runtime` | JDBC driver để ứng dụng Java kết nối PostgreSQL lúc chạy. `runtime` nghĩa là driver cần khi chạy ứng dụng, không cần để biên dịch mã nguồn chính. |
| `lombok` với `optional=true` | Annotation processor có thể sinh mã Java như getter, setter, constructor trong lúc biên dịch. `optional=true` đánh dấu đây là dependency tùy chọn đối với project khác phụ thuộc vào backend. IDE cần cấu hình hỗ trợ Lombok để hiển thị mã sinh thuận tiện. |

Các `spring-boot-starter-*` thường kéo theo nhiều thư viện nhỏ hơn (transitive dependencies). Bảng trên mô tả vai trò của các dependency được khai báo trực tiếp trong `pom.xml`.

## Dependency chỉ dùng khi test

Những dependency dưới đây có `<scope>test</scope>`, nên chỉ có trên classpath khi Maven chạy test; chúng không phải thư viện chạy backend production.

| Dependency | Chức năng |
| --- | --- |
| `spring-boot-starter-data-jpa-test` | Hỗ trợ kiểm thử phần persistence/JPA, bao gồm các tiện ích test liên quan đến Spring Data. |
| `spring-boot-starter-flyway-test` | Hỗ trợ kiểm thử tích hợp Flyway trong Spring Boot. |
| `spring-boot-starter-security-test` | Cung cấp tiện ích kiểm thử bảo mật Spring, như mô phỏng người dùng hoặc xác thực trong test. |
| `spring-boot-starter-validation-test` | Hỗ trợ kiểm thử phần validation trong ứng dụng Spring. |
| `spring-boot-starter-webmvc-test` | Cung cấp tiện ích kiểm thử controller và HTTP/MVC, ví dụ kiểm thử request-response. |

## Plugin build

`spring-boot-maven-plugin` tích hợp Spring Boot với Maven, bao gồm chạy ứng dụng bằng `./mvnw spring-boot:run` và đóng gói ứng dụng theo định dạng có thể chạy được.

## Flyway là gì và làm gì ở project này?

Flyway là công cụ **quản lý phiên bản cấu trúc database** (schema migration). Thay vì để mỗi máy tự tạo bảng theo cách khác nhau, nhóm phát triển lưu các thay đổi schema thành file SQL có thứ tự, thường đặt ở:

```text
backend/src/main/resources/db/migration/
```

Ví dụ tên file migration:

```text
V1__create_products.sql
V2__create_flavors.sql
```

Khi Spring Boot khởi động, Flyway đọc các migration chưa chạy, thực thi chúng trên database đã cấu hình và lưu lịch sử vào bảng `flyway_schema_history`. Migration đã áp dụng thường được xem là lịch sử dùng chung; khi cần thay đổi tiếp, nên tạo migration phiên bản mới thay vì sửa file cũ đã chạy ở các môi trường khác.

Project hiện bật Flyway bằng `spring.flyway.enabled=true` và có driver PostgreSQL. Tuy nhiên, hiện chưa có file migration trong `src/main/resources/db/migration/`, nên Flyway chưa có script để tạo/cập nhật bảng. Nếu database `creme` chưa có bảng, Flyway tự nó cũng không biết phải tạo bảng nào. Đồng thời `spring.jpa.hibernate.ddl-auto=validate` yêu cầu Hibernate kiểm tra các bảng cần thiết cho entity; cấu hình này không tạo bảng thay Flyway.

Nói ngắn gọn: **Flyway thay đổi schema theo các file migration; JPA/Hibernate làm việc với dữ liệu qua entity; `ddl-auto=validate` chỉ kiểm tra schema.**

## Kết nối database và password

Trong [`application.properties`](../src/main/resources/application.properties), URL hiện trỏ tới `localhost:5432/creme`. Username lấy từ biến môi trường `DB_USERNAME`, mặc định là `postgres`; password lấy từ `DB_PASSWORD`. Spring Boot đọc cấu hình này để tạo kết nối JDBC, còn PostgreSQL xác thực tài khoản/mật khẩu.

Không nên đưa password thật vào `pom.xml` hoặc file cấu hình được commit lên Git. Giữ placeholder trong `application.properties`, rồi cung cấp `DB_PASSWORD` qua môi trường khi chạy ứng dụng hoặc test. `application.properties` được Spring Boot tự đọc; file `.env` thì không được Spring Boot tự đọc nếu chưa có bước nạp/công cụ hỗ trợ riêng.

## Lệnh hữu ích

Từ thư mục `backend`:

```bash
./mvnw spring-boot:run  # chạy ứng dụng
./mvnw test             # chạy test
./mvnw clean test       # xóa kết quả build cũ rồi chạy test
```
