CREATE TABLE flavors (
	id VARCHAR(100) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	category VARCHAR(50) NOT NULL,
	available BOOLEAN NOT NULL DEFAULT TRUE,
	CONSTRAINT flavors_category_check CHECK (category IN ('Signature', 'Seasonal', 'Dairy-Free'))
);

INSERT INTO flavors (id, name, description, category, available) VALUES
	('vanilla-gold', 'Tahitian Vanilla Soft Serve', 'Pure Tahitian vanilla bean soft serve churned slowly with fresh organic cream, served with dark chocolate waffle bites.', 'Signature', TRUE),
	('dark-chocolate-crunch', '70% Cocoa Honeycomb Crunch', 'Decadent dark chocolate soft serve folded with crisp honeycomb pieces and enrobed in dark cacao drizzle.', 'Signature', TRUE),
	('wild-raspberry-ribbon', 'Wild Raspberry Cream', 'Hand-picked wild raspberry swirl ribboned through vanilla bean cream with white chocolate curls.', 'Seasonal', TRUE),
	('pistachio-matcha', 'Pistachio Matcha Soft Swirl', 'Ceremonial grade Uji matcha combined with Sicilian roasted pistachio cream for an unforgettable earthy richness.', 'Dairy-Free', TRUE);
