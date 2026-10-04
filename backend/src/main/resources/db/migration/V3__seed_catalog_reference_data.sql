INSERT INTO toppings (id, name, category, description, price, available) VALUES
    ('waffle-bites', 'Crisp Waffle Bites', 'Crunch', 'Freshly baked butter waffle cone pieces with dark chocolate coating.', 1.00, TRUE),
    ('honeycomb', 'Honeycomb Crisp', 'Crunch', 'Light, airy caramel honeycomb brittle dusted with sea salt.', 1.00, TRUE),
    ('raspberry-sauce', 'Wild Raspberry Drizzle', 'Sauce', 'Slow-simmered wild berry reduction with a punchy sweet-tart balance.', 0.50, TRUE),
    ('dark-cacao', '70% Cocoa Shell', 'Sauce', 'Warm single-origin cocoa drizzle that sets into a satisfying crisp shell.', 0.75, TRUE),
    ('color-sprinkles', 'Artisanal Sprinkles', 'Specialty', 'Naturally dyed vibrant sugar confetti made in small batches.', 0.50, TRUE),
    ('pistachio-bits', 'Crushed Pistachio', 'Fruit', 'Lightly toasted Bronte pistachios crushed to perfection.', 1.50, TRUE);

INSERT INTO customization_sizes (id, name, price, max_extra_flavors, max_toppings, available) VALUES
    ('small', 'Small', 5.00, 0, 3, TRUE),
    ('regular', 'Regular', 7.00, 1, 3, TRUE),
    ('large', 'Large', 9.00, 2, 3, TRUE);

INSERT INTO stores (id, name, address, phone, opening_hours, active) VALUES
    ('store-1', 'Crema SoHo Flagship', '452 Broome St, New York, NY 10013', '(212) 555-0198', '{"daily":"11:00 AM - 11:00 PM"}'::jsonb, TRUE),
    ('store-2', 'Crema Venice Beach', '1301 Abbot Kinney Blvd, Venice, CA 90291', '(310) 555-0142', '{"daily":"12:00 PM - 10:30 PM"}'::jsonb, TRUE);

INSERT INTO products (id, name, description, category, price, available) VALUES
    ('chocolate-sundae', 'Chocolate Sundae', 'Dark chocolate soft serve with honeycomb crunch and cocoa shell.', 'Signature', 8.50, TRUE),
    ('matcha-cookie-cup', 'Matcha Cookie Cup', 'Pistachio matcha soft serve with crisp waffle bites.', 'Signature', 8.00, TRUE);

INSERT INTO product_flavors (product_id, flavor_id) VALUES
    ('chocolate-sundae', 'dark-chocolate-crunch'),
    ('matcha-cookie-cup', 'pistachio-matcha');

INSERT INTO product_toppings (product_id, topping_id) VALUES
    ('chocolate-sundae', 'honeycomb'),
    ('chocolate-sundae', 'dark-cacao'),
    ('matcha-cookie-cup', 'waffle-bites');
