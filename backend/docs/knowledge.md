# create backend 
spring initialize
# how to run backend 
./mvnw spring-boot:run
or 
mvn spring-boot:run

API dự kiến chạy tại:
http://localhost:8080

Swagger thường ở:

http://localhost:8080/swagger-ui.html

Thứ tự phát triển nên dùng
Frontend hiện tại
    ↓
PostgreSQL + local
    ↓
Product / Flavor / Topping API
    ↓
Custom Ice Cream API
    ↓
Cart API
    ↓
Order API
    ↓
JWT Authentication
    ↓
Inventory + Transaction + Locking
    ↓
JUnit + Testcontainers
    ↓
Playwright E2E
    ↓
GitHub Actions
    ↓
Redis / RabbitMQ

# 5. Tạo migration Flyway đầu tiên

Đặt file tại:


Migration đầu tiên nên tạo:

products
flavors
toppings
product_toppings
Không nên để Hibernate tự tạo database bằng ddl-auto=create. Flyway sẽ quản lý toàn bộ thay đổi schema.

# application.properties là nơi lưu cấu hình cho Spring Boot
mỗi lần chạy terminal mới thì phải chạy lại lệnh :
```bash
export DB_USERNAME=postgres
read -s "DB_PASSWORD?Nhập mật khẩu PostgreSQL: "
echo
export DB_PASSWORD
```
để kết nối database. Rồi sau đó mới chạy backend

## techinique backend 
***Database locking***
- Database locking is a data synchronization mechanism provided by a database management system (DBMS) to prevent concurrent transactions from modifying or reading the same record simultaneously, which could lead to data inconsistency.
- Preventing Race Conditions: Avoids scenarios where two or more threads simultaneously read stale data and overwrite each other's results (Lost Update).

- Ensuring ACID Properties: Provides the necessary isolation levels for transactions, eliminating issues such as Dirty Reads, Non-repeatable Reads, and Phantom Reads.

- Protecting Data Integrity: Ensures business data (wallet balances, inventory levels, order statuses) remains absolutely accurate.
**Concurrency**
Concept: Concurrency is a system's ability to execute or process multiple tasks or requests within the same timeframe without waiting for a preceding task to complete fully. In backend systems, this is typically implemented via multi-threading, multi-processing, or asynchronous I/O (event loops).

Purpose:

Optimize hardware resources (CPU, RAM, I/O bandwidth).

Increase throughput and reduce latency when serving thousands of concurrent users.

Mechanism: Instead of sequential processing (where Request B waits for Request A to finish), the system shares CPU time slices or utilizes I/O wait times (e.g., waiting for databases or network operations) to handle other requests.

Applicable project types:

Most modern backend systems (REST APIs, gRPC, Microservices).

Real-time applications: Chat (WebSockets), video streaming, game servers, and gateways handling millions of connections.
**Transaction**
Transaction
Concept: Transaction is a set of one or more data read/write operations grouped into a single unit of work. Either the entire operation succeeds, or no operation is applied.

Purpose: Protect data integrity and consistency despite power outages, server crashes or mid-process application errors.

Mechanism of action (ACID Principle):

A (Atomicity - Atom): "All or nothing". If one step fails, the ROLLBACK system returns to its original state.

C (Consistency): Data must always satisfy integrity constraints (Foreign Key, Check, Unique) before and after the transaction.

I (Isolation): Transactions running in parallel cannot see each other's uncommitted intermediate data (depending on the level of Isolation: Read Uncommitted, Read Committed, Repeatable Read, Serializable).

D (Durability): Once COMMIT is made, data is written to the drive and is not lost even if it crashes.

Application for project type:

Finance, banking: Money transfer (minus wallet A and add wallet B must both succeed or fail).

E-commerce: Create orders (deduct inventory, create invoices, deduct vouchers, record payment log).

**Race Condition**
Definition: A race condition is a software bug that occurs when two or more threads or processes access and manipulate a shared resource (such as memory, a database, or a file) simultaneously, and the final outcome depends on the unpredictable execution order of those threads.

Purpose (Identification & Prevention):

A race condition is a risk that must be eliminated, not a feature.

The goal of a backend engineer is to identify unsafe "Check-then-Act" or "Read-Modify-Write" patterns and implement appropriate solutions.
## sumary 
| **Concept** | **Role in the System** | **Interrelationship** |
|---|---|---|
| **Concurrency** | Execution environment foundation | Delivers performance gains, but is the direct cause of race conditions. |
| **Race Condition** | Problem / emerging risk | Arises when concurrency exists without a mechanism to control access to shared resources. |
| **Transaction** | Logical unit of work | Guarantees integrity (ACID) for a sequence of operations when multiple threads write data at once. |
| **Database Locking** | Technical tool / solution | The key mechanism for controlling concurrency and eliminating race conditions within transactions. |