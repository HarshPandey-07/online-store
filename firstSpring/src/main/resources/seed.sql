-- =====================================
-- INITIAL DATA FOR E-COMMERCE PROJECT
-- =====================================

-- Insert default roles
INSERT INTO role (name)
VALUES
    ('ROLE_USER'), -- ROLE_ prefix is used for the Spring Security roles
    ('ROLE_ADMIN')
ON DUPLICATE KEY UPDATE name = VALUES(name);


-- Insert default product categories
INSERT INTO category (name)
VALUES
    ('Electronics'),
    ('Clothing'),
    ('Books'),
    ('Home & Kitchen'),
    ('Sports')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample product
INSERT INTO product (description, name, price, stock, category_id)
VALUES
	('Java Developer Guide', 'Java 101', 250.0, 25, 3),
	('Automation king', 'Python merchandise', 550.0, 25, 2)
