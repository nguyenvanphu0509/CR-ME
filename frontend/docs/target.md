# overrall 

creme/
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── eslint.config.js
│   ├── .prettierignore
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/creme/
│   │   │   │       ├── auth/
│   │   │   │       ├── product/
│   │   │   │       ├── flavor/
│   │   │   │       ├── topping/
│   │   │   │       ├── icecream/
│   │   │   │       ├── cart/
│   │   │   │       ├── order/
│   │   │   │       └── inventory/
│   │   │   │
│   │   │   └── resources/
│   │   │       └── db/migration/
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
├── e2e/
│   └── playwright/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .pre-commit-config.yaml
├── .gitignore
├── docker-compose.yml
└── README.md

## stack 

React 19
TypeScript
Vite
Tailwind
Lenis

Java
Spring Boot
Spring Security
JPA/Hibernate
PostgreSQL
Flyway
OpenAPI/Swagger
REST API
Validation



## Testing:
JUnit
Mockito
Testcontainers
Playwright

## Dev/DevOps:
Git
GitHub
Docker
Docker Compose
GitHub Actions
ESLint
Prettier
pre-commit
detect-secrets

# Phase 2:
Redis
RabbitMQ
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
## sumary 
| **Concept** | **Role in the System** | **Interrelationship** |
|---|---|---|
| **Concurrency** | Execution environment foundation | Delivers performance gains, but is the direct cause of race conditions. |
| **Race Condition** | Problem / emerging risk | Arises when concurrency exists without a mechanism to control access to shared resources. |
| **Transaction** | Logical unit of work | Guarantees integrity (ACID) for a sequence of operations when multiple threads write data at once. |
| **Database Locking** | Technical tool / solution | The key mechanism for controlling concurrency and eliminating race conditions within transactions. |

## try to do paymant by QR code or bank
- can do after 

## work flow 
1. Spring Boot
       ↓
2. REST API
       ↓
3. PostgreSQL
       ↓
4. JPA / Hibernate
       ↓
5. Product / Flavor / Topping
       ↓
6. Custom Ice Cream
       ↓
7. Cart
       ↓
8. Order
       ↓
9. Spring Security + JWT
       ↓
11. Flyway
       ↓
12. Unit + Integration Test
       ↓
13. Playwright
       ↓
14. GitHub Actions
       ↓
15. Redis
       ↓
16. RabbitMQ


Why PostgreSQL?
Why Redis?
Why RabbitMQ?
Why Docker?
Why JWT?
Why Flyway?
Why Testcontainers?
Why modular monolith instead of microservices?
What happens when two customers order the last Brownie simultaneously?