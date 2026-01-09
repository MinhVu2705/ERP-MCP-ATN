-- Sample data from CSV dataset
-- This file will be auto-loaded by Spring Boot

-- Note: Adjust table/column names based on your JPA entities
-- This is a sample showing the pattern - you can expand it with all 10000 rows

INSERT INTO transactions (transaction_date, customer_name, transaction_type, revenue, cost, product, order_status, department, profit, forecasted_revenue) VALUES
('2023-03-25', 'Amy Osborne', 'Sale', 7383.1, 5905.9, 'Office Chair', 'Processed', 'Sales', 1477.2, 7104.95),
('2025-06-11', 'Dana Perkins', 'Purchase', 2393.69, 7886.17, 'Tablet', 'Cancelled', 'Logistics', -5492.48, 2396.19),
('2022-06-16', 'Kayla Obrien', 'Reimbursement', 622.72, 7683.4, 'Phone', 'Shipped', 'Finance', -7060.68, 637.72),
('2023-02-14', 'Brian Harvey', 'Sale', 422.12, 1749.54, 'Monitor', 'Shipped', 'Customer Service', -1327.42, 414.8),
('2022-08-09', 'Debra Bates', 'Purchase', 3731.73, 7476.53, 'Mouse', 'Delivered', 'Customer Service', -3744.8, 3745.36),
('2022-02-26', 'Jamie Rhodes', 'Expense', 4429.6, 5867.54, 'Tablet', 'Shipped', 'Sales', -1437.94, 4244.28),
('2023-01-10', 'Russell Chang', 'Reimbursement', 4040.44, 3086.97, 'Tablet', 'Delivered', 'Sales', 953.47, 4184.01),
('2025-10-21', 'Gregory White', 'Expense', 2118.68, 4057.67, 'Phone', 'Shipped', 'Finance', -1938.99, 2134.73),
('2024-09-09', 'Matthew Atkinson', 'Purchase', 4461.94, 7976.1, 'Tablet', 'Pending', 'HR', -3514.16, 4310.43),
('2020-04-14', 'Shannon Herring', 'Refund', 1031.51, 1549.34, 'Phone', 'Shipped', 'HR', -517.83, 1073.07);

-- Add more rows as needed from the CSV file
-- Total dataset has 10000+ rows
