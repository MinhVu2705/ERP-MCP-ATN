-- Initialize ERP-MCP database

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS sales;

-- Revenue table
CREATE TABLE IF NOT EXISTS finance.revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month VARCHAR(10) NOT NULL,
    year INTEGER NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    expenses DECIMAL(15, 2),
    profit DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS inventory.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 0,
    unit_price DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS sales.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    total_amount DECIMAL(15, 2),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO finance.revenue (month, year, amount, expenses, profit) VALUES
    ('T1', 2024, 1800000000, 1200000000, 600000000),
    ('T2', 2024, 1900000000, 1300000000, 600000000),
    ('T3', 2024, 2100000000, 1400000000, 700000000),
    ('T4', 2024, 2000000000, 1300000000, 700000000),
    ('T5', 2024, 2300000000, 1500000000, 800000000),
    ('T6', 2024, 2500000000, 1600000000, 900000000),
    ('T7', 2024, 2400000000, 1500000000, 900000000),
    ('T8', 2024, 2600000000, 1700000000, 900000000),
    ('T9', 2024, 2100000000, 1400000000, 700000000)
ON CONFLICT DO NOTHING;

INSERT INTO inventory.products (product_id, product_name, description, quantity, min_quantity, unit_price) VALUES
    ('A', 'Sản phẩm A', 'Cảm biến nhiệt công nghiệp', 150, 50, 1500000),
    ('B', 'Sản phẩm B', 'Máy đo áp suất', 200, 80, 2000000),
    ('C', 'Sản phẩm C', 'Bộ điều khiển PLC', 100, 30, 5000000)
ON CONFLICT DO NOTHING;
