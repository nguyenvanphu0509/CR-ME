-- Flavor details ------------------------------------------------------------
-- Business content belongs to the backend. Presentation colors stay in React.
ALTER TABLE flavors
    ADD COLUMN tagline TEXT NOT NULL DEFAULT '',
    ADD COLUMN badge VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN texture_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN pairing TEXT NOT NULL DEFAULT '';

UPDATE flavors
SET
    tagline = 'Smooth, timeless & ultra-creamy',
    badge = 'Most Popular',
    ingredients = '["Fresh Organic Milk", "Tahitian Vanilla Pods", "Pure Cane Sugar", "Hand-Bunked Cream"]'::jsonb,
    allergens = '["Milk"]'::jsonb,
    texture_notes = '["Silky Smooth", "Velvety Melts", "Golden Crisp Finish"]'::jsonb,
    pairing = 'Pairs exquisitely with warm caramel waffle pieces.'
WHERE id = 'vanilla-gold';

UPDATE flavors
SET
    tagline = 'Rich, deep & irresistibly crunchy',
    badge = 'Decadent',
    ingredients = '["70% Single-Origin Cacao", "Artisanal Honeycomb", "Grass-Fed Milk", "Cocoa Butter"]'::jsonb,
    allergens = '["Milk"]'::jsonb,
    texture_notes = '["Dense Cocoa", "Satisfying Honeycomb Crunch", "Silky Aftertaste"]'::jsonb,
    pairing = 'Best paired with crushed roasted hazelnuts.'
WHERE id = 'dark-chocolate-crunch';

UPDATE flavors
SET
    tagline = 'Bright, tart & refreshingly sweet',
    badge = 'Fresh Release',
    ingredients = '["Wild Alpine Raspberries", "Sweet Cream", "White Chocolate Ribbons", "Fresh Lemon Zest"]'::jsonb,
    allergens = '["Milk"]'::jsonb,
    texture_notes = '["Bright Tartness", "Smooth Swirl", "Melts Gently"]'::jsonb,
    pairing = 'Perfect with fresh berry reduction.'
WHERE id = 'wild-raspberry-ribbon';

UPDATE flavors
SET
    tagline = 'Delicate, nutty & sophisticated',
    badge = 'Artisanal Craft',
    ingredients = '["Sicilian Pistachio Paste", "First-Harvest Matcha", "Almond Milk Base", "Toasted Pistachio Bits"]'::jsonb,
    allergens = '["Almond", "Pistachio"]'::jsonb,
    texture_notes = '["Creamy Nuttiness", "Subtle Tea Fragrance", "Smooth Velvet"]'::jsonb,
    pairing = 'Pairs deliciously with matcha biscuit crumble.'
WHERE id = 'pistachio-matcha';

-- Catalog: toppings, complete products and pickup stores -------------------
CREATE TABLE toppings (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT toppings_category_check
        CHECK (category IN ('Crunch', 'Sauce', 'Fruit', 'Specialty'))
);

CREATE TABLE products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE product_flavors (
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    flavor_id VARCHAR(100) NOT NULL REFERENCES flavors(id),
    PRIMARY KEY (product_id, flavor_id)
);

CREATE TABLE product_toppings (
    product_id VARCHAR(100) NOT NULL REFERENCES products(id),
    topping_id VARCHAR(100) NOT NULL REFERENCES toppings(id),
    PRIMARY KEY (product_id, topping_id)
);

CREATE TABLE stores (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    opening_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Customization -------------------------------------------------------------
-- A custom recipe is sent as JSON in a cart/order item. The size table owns
-- size availability and the base price added by the customization rules.
CREATE TABLE customization_sizes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    max_extra_flavors INTEGER NOT NULL CHECK (max_extra_flavors >= 0),
    max_toppings INTEGER NOT NULL CHECK (max_toppings >= 0),
    available BOOLEAN NOT NULL DEFAULT TRUE
);

-- Identity ------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(320) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (role IN ('CUSTOMER', 'ADMIN'))
);

-- Cart ----------------------------------------------------------------------
CREATE TABLE carts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    guest_token VARCHAR(255) UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT carts_owner_check CHECK (user_id IS NOT NULL OR guest_token IS NOT NULL),
    CONSTRAINT carts_status_check CHECK (status IN ('ACTIVE', 'CONVERTED', 'ABANDONED'))
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id),
    custom_selection JSONB,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_item_type_check
        CHECK ((product_id IS NOT NULL AND custom_selection IS NULL)
            OR (product_id IS NULL AND custom_selection IS NOT NULL))
);

-- Order ---------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id),
    store_id VARCHAR(100) NOT NULL REFERENCES stores(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT orders_status_check
        CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES products(id),
    item_name VARCHAR(255) NOT NULL,
    custom_selection JSONB,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
    CONSTRAINT order_item_type_check
        CHECK ((product_id IS NOT NULL AND custom_selection IS NULL)
            OR (product_id IS NULL AND custom_selection IS NOT NULL))
);

-- Foreign-key and lookup indexes -------------------------------------------
CREATE INDEX idx_toppings_available ON toppings (available);
CREATE INDEX idx_products_available ON products (available);
CREATE INDEX idx_stores_active ON stores (active);
CREATE INDEX idx_carts_user_id ON carts (user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_store_id ON orders (store_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
