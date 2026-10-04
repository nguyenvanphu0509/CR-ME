# Ice Cream List Flow: PostgreSQL -> Spring Boot -> React

## Notes on keeping FLAVOR_LIST and using Flyway

For now I'm keeping `FLAVOR_LIST` to reuse the existing design. In the long run, if you want the database to be the single source of truth, you need to extend the `flavors` table with columns such as `tagline`, `badge`, `primary_color` and `accent_color`, then update the entity, DTO, migration and frontend type accordingly.

The more complete approach is to move all displayable data into the database and the backend DTO. The frontend then only needs:

```ts
return response.json() as Promise<ProductFlavor[]>;
```

At that point `FLAVOR_LIST` can be deleted.

**Why do we need migrations and Flyway to update the database?**

In theory, you could write one complete SQL file and edit that file directly. The problem is that the project's database already exists and contains data, so editing the original file doesn't tell the current database how it needs to change. If you edit it and run it again, you get `table "users" already exists`.

- Migration = the history of changes to the database schema.
- Flyway = the tool that tracks and applies that history.

---

This document explains the first flow of the project:

```text
PostgreSQL
    |
    | Flyway runs migration V1
    v
flavors table
    |
    | JPA/Hibernate reads the table through a Repository
    v
Flavor entity
    |
    | Service filters and converts to DTO
    v
GET /api/flavors
    |
    | Frontend fetches through the Vite proxy
    v
FlavorShowcase displays the list
```

## 1. Migration: create the table and sample data

File: `backend/src/main/resources/db/migration/V1__create_flavors.sql`

```sql
CREATE TABLE flavors (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE
);
```

Flyway manages database changes in version order. File names follow this pattern:

```text
V<sequence-number>__<description>.sql
```

For this file:

- `V1`: the first migration.
- `create_flavors`: a short description.
- The part after `__` is a description, not the table name.

When Spring Boot starts, Flyway:

1. Connects to PostgreSQL.
2. Creates Flyway's migration history table if it doesn't exist.
3. Runs `V1__create_flavors.sql` if it has never run before.
4. Records that `V1` has been run.

After that, Hibernate with `spring.jpa.hibernate.ddl-auto=validate` compares the Java entities against the real tables. Hibernate only validates; it does not create tables itself.

The migration also inserts 4 rows of sample data. The `available` column indicates whether a flavor is currently on sale. The service currently returns only rows where `available = true`.

## 2. Entity: mapping the SQL table to Java

File: `backend/src/main/java/com/creme/catalog/flavor/domain/Flavor.java`

```java
@Entity
@Table(name = "flavors")
public class Flavor {
```

- `@Entity`: tells JPA this class is an object stored in the database.
- `@Table(name = "flavors")`: maps the `Flavor` class to the `flavors` table.
- `@Id`: marks the primary key. Here `id` is a string, for example `vanilla-gold`.
- `@Column(...)`: configures the column, its length, and whether it may be null.

The Java fields correspond to the SQL columns:

| Java | SQL | Meaning |
|---|---|---|
| `String id` | `VARCHAR(100)` | Unique flavor code |
| `String name` | `VARCHAR(255)` | Display name |
| `String description` | `TEXT` | Description |
| `String category` | `VARCHAR(50)` | Flavor group |
| `boolean available` | `BOOLEAN` | Whether it's on sale |

The no-argument constructor is `protected` because JPA needs it to create objects when reading from the database. The constructor with parameters is convenient for Java code that needs to create a new `Flavor`.

Getters let other classes read the data. The entity has no setters yet because this API only reads the list so far.

## 3. Repository: the bridge to the database

File: `backend/src/main/java/com/creme/catalog/flavor/persistence/FlavorRepository.java`

```java
public interface FlavorRepository extends JpaRepository<Flavor, String> {
    List<Flavor> findByAvailableTrue();
}
```

`JpaRepository<Flavor, String>` means:

- It works with the `Flavor` entity.
- The primary key of `Flavor` is of type `String`.
- Spring Data JPA automatically creates the implementation when the application starts.

Spring Data creates this query from the method name, so the database filters unavailable rows rather than loading every flavor first. We also get these standard methods from `JpaRepository`:

- `findByAvailableTrue()`: fetch flavors whose `available` column is true.
- `findAll()`: fetch all flavors.
- `findById(id)`: fetch one flavor by id.
- `save(flavor)`: insert or update.
- `deleteById(id)`: delete by id.

We don't need to write `SELECT * FROM flavors` ourselves for this basic read flow.

## 4. Service: where business logic lives

File: `backend/src/main/java/com/creme/catalog/flavor/application/FlavorService.java`

```java
@Service
public class FlavorService {
```

`@Service` registers the class with Spring so that Spring creates it and injects it into the controller.

The `getAvailableFlavors()` method does 3 things:

```java
flavorRepository.findByAvailableTrue()
    .map(flavor -> new FlavorResponse(...))
    .toList();
```

1. The repository asks PostgreSQL for available flavors.
2. `map` converts entities into DTOs.
3. `toList` builds the result list.

`@Transactional(readOnly = true)` declares this a read-only transaction. It suits a list endpoint and makes it clear the service doesn't modify the database.

The controller doesn't read the repository directly. If we later need rules like sorting, searching, pagination or status checks, we put them in the service.

## 5. DTO: the JSON format returned to clients

File: `backend/src/main/java/com/creme/catalog/flavor/api/FlavorResponse.java`

```java
public record FlavorResponse(
    String id,
    String name,
    String description,
    String category,
    boolean available) {
}
```
record in java: is special type of class used to hold data - particularly suitable for objects intended simply to transport data from one place to another.
A DTO is an object used for communicating through the API. Here we use a Java `record`, which suits read-only objects.

Why not return the entity directly?

- The entity is an internal detail of the database.
- A DTO lets you choose exactly which fields are exposed.
- Later, the entity can gain internal fields without changing the API.
- A DTO separates the database model from the API contract.

One returned JSON element looks like this:

```json
{
  "id": "vanilla-gold",
  "name": "Tahitian Vanilla Soft Serve",
  "description": "Pure Tahitian vanilla bean soft serve...",
  "category": "Signature",
  "available": true
}
```

## 6. Controller: receiving HTTP requests

File: `backend/src/main/java/com/creme/catalog/flavor/api/FlavorController.java`

```java
@RestController
@RequestMapping("/api/flavors")
public class FlavorController {

    @GetMapping
    public List<FlavorResponse> getFlavors() {
        return flavorService.getAvailableFlavors();
    }
}
```

- `@RestController`: the returned value is converted to JSON by Spring.
- `@RequestMapping("/api/flavors")`: the endpoint prefix.
- `@GetMapping`: this method handles HTTP GET at the prefix.
- Combined, they form `GET /api/flavors`.

When the browser calls the endpoint:

```text
GET http://localhost:8080/api/flavors
```

Spring processes it through this chain:

```text
FlavorController
    -> FlavorService
    -> FlavorRepository
    -> Hibernate
    -> PostgreSQL
```

The result then travels back, and Spring serializes the `List<FlavorResponse>` into a JSON array.

## 7. Security: allowing a public endpoint

File: `backend/src/main/java/com/creme/security/SecurityConfig.java`

Because the project includes `spring-boot-starter-security`, many URLs will require login unless configured otherwise.

This line allows public access:

```java
.requestMatchers("/api/flavors").permitAll()
```

And:

```java
.anyRequest().authenticated()
```

means all other endpoints still require login until we add specific rules for them.

The Swagger and OpenAPI configuration is also made public so the API docs can be opened during development.

## 8. Frontend data types

File: `frontend/src/features/catalog/types.ts`

```ts
export interface ApiFlavor {
  id: string;
  name: string;
  description: string;
  category: 'Signature' | 'Seasonal' | 'Dairy-Free';
  available: boolean;
}
```

This interface describes the JSON the frontend expects from the backend. TypeScript helps catch code that uses the wrong field name or data type.

This is the API model, which differs from `ProductFlavor` in `frontend/src/config/brand.ts`. `ProductFlavor` also carries UI-related metadata such as colors, badge, tagline and ingredients.

## 9. Frontend calling the API

File: `frontend/src/features/catalog/api/flavors.ts`

The `getFlavors()` function uses the shared API helper at `frontend/src/api/client.ts`:

```ts
return requestJson<ApiFlavor[]>('/api/flavors');
```

- `requestJson` sends the HTTP request and parses JSON.
- For a non-success response, it throws an error so the component can show an error state.

The `toProductFlavor()` function is an adapter. The backend returns only the necessary business fields, while the frontend temporarily takes display metadata from the old `FLAVOR_LIST` and overrides `name`, `description` and `category` with the values from the API.

This means the name and description on each card now come through the database and backend. Design details such as colors and ingredients remain local metadata until we extend the database schema.

## 10. FlavorShowcase: the three request states

File: `frontend/src/features/catalog/FlavorShowcase.tsx`

The component's main state:

```ts
const [flavors, setFlavors] = useState<ProductFlavor[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Loading state

Initially `isLoading = true`, and the UI shows:

```text
Loading the ice cream list...
```

### Success state

`useEffect` calls `getFlavors()` when the component mounts. If the request succeeds:

1. Filter flavors with `available = true`.
2. Convert each API flavor through `toProductFlavor`.
3. Save the result into `flavors`.
4. Set `isLoading = false`.
5. Render the cards.

### Error state

If the fetch fails, `catch` stores the message in `error`. The UI shows the message and a `Retry` button.

When `Retry` is clicked, the component increments `retryCount`. Because `retryCount` is in the `useEffect` dependency array, the request is made again.

The `isCancelled` variable prevents state updates after the component has unmounted, for example when the user leaves the page while the request is still running.

## 11. Vite proxy

File: `frontend/vite.config.ts`

```ts
proxy: {
  '/api': 'http://localhost:8080',
}
```

The frontend runs at `localhost:3000` and the backend at `localhost:8080`. The frontend only needs to call a relative URL:

```text
/api/flavors
```

Vite forwards the request to:

```text
http://localhost:8080/api/flavors
```

Thanks to the proxy, during local development the frontend doesn't need to call the backend URL directly, and CORS doesn't need to be opened for this flow.

This proxy only applies to the Vite dev server. In production, the web server or a reverse proxy must be configured similarly, or the frontend must use the production API URL.

## 12. How to run and verify each step

### Step 1: prepare the database

Make sure the `creme` database exists and PostgreSQL is running. Set the credentials in the backend terminal:

```bash
cd backend
export DB_USERNAME=postgres
export DB_PASSWORD='your-postgresql-password'
```

### Step 2: run the backend

```bash
./mvnw spring-boot:run
```

When the backend starts:

- Flyway runs migration V1.
- Hibernate validates the entity against the `flavors` table.
- Spring exposes the `GET /api/flavors` endpoint.

### Step 3: test the backend on its own

Open another terminal:

```bash
curl http://localhost:8080/api/flavors
```

If successful, the result is a JSON array of the available flavors.

If you hit errors:

- Database connection error: check PostgreSQL, the database, username and password.
- Flyway error: check the SQL migration.
- Hibernate validation error: compare the columns in the migration with the fields and annotations in `Flavor`.
- HTTP 401/403: check `SecurityConfig`.

### Step 4: run the frontend

```bash
cd frontend
npm run dev
```

Open the Vite address, usually `http://localhost:3000`. Open DevTools > Network and find the request:

```text
GET /api/flavors
```

If the request succeeds, the cards in `FlavorShowcase` will display data from the API.

## 13. Current limitations

The flavor flow now goes through the database, backend and frontend, but some other parts still use local sample data:

- `ToppingBuilder` still reads `TOPPINGS_LIST` from `brand.ts`.
- `OrderModal` still generates a random order code and doesn't yet call `POST /api/orders`.
- `ProductFlavor` still keeps local UI metadata such as colors, badge and ingredients.

A sensible next step is to create a toppings table and `GET /api/toppings`, then replace `TOPPINGS_LIST` in `ToppingBuilder` with API data using the same pattern.

---

## Summary of the files

- **V1__create_flavors.sql**: creates the `flavors` table and inserts 4 sample rows. Flyway runs this file automatically when the backend starts.
- **Flavor.java**: maps the SQL table to a Java class using `@Entity`.
- **FlavorRepository.java**: reads data through JPA; `JpaRepository` provides `findAll()`, `findById()`, `save()` and more out of the box.
- **FlavorService.java**: holds the business logic, filters flavors with `available = true`, then converts them to DTOs.
- **FlavorResponse.java**: defines the JSON format returned by the API, avoiding returning the database entity directly.
- **FlavorController.java**: defines the `GET /api/flavors` endpoint.
- **SecurityConfig.java**: allows public access to the flavors API and Swagger.
- **api.ts**: defines the frontend's JSON data types.
- **flavors.ts**: calls the API with `fetch()` and converts API data into the format the current UI needs.
- **FlavorShowcase.tsx**: calls the API when the component mounts and shows loading, error, retry, or the successful list.
- **vite.config.ts**: forwards `/api` from the frontend at `localhost:3000` to the backend at `localhost:8080`.

**Overall flow:**

PostgreSQL -> Flyway migration -> Entity -> Repository -> Service -> DTO -> Controller -> `GET /api/flavors` -> Vite proxy -> `fetch` -> `FlavorShowcase`

The document also includes instructions for running the backend and frontend, checking with curl, and common errors for people new to Spring.
