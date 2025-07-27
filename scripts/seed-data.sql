-- Seed data for FinTech Application

-- Insert sample users
INSERT INTO users (email, phone_number, password, first_name, last_name, is_verified) VALUES
('john.doe@example.com', '9876543210', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VQ2LGS8.5/5/5/5/5/5/5/5/5/5', 'John', 'Doe', TRUE),
('jane.smith@example.com', '9876543211', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VQ2LGS8.5/5/5/5/5/5/5/5/5/5', 'Jane', 'Smith', TRUE),
('mike.johnson@example.com', '9876543212', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VQ2LGS8.5/5/5/5/5/5/5/5/5/5', 'Mike', 'Johnson', TRUE),
('sarah.wilson@example.com', '9876543213', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VQ2LGS8.5/5/5/5/5/5/5/5/5/5', 'Sarah', 'Wilson', TRUE);

-- Insert wallets for users
INSERT INTO wallets (user_id, balance, wallet_number) VALUES
(1, 5000.00, 'WLT1234567890ABCD'),
(2, 3500.50, 'WLT1234567890EFGH'),
(3, 7200.25, 'WLT1234567890IJKL'),
(4, 2800.75, 'WLT1234567890MNOP');

-- Insert sample transactions
INSERT INTO transactions (transaction_id, sender_id, receiver_id, amount, type, status, description, created_at, completed_at) VALUES
('TXN1701234567890001', 1, 2, 500.00, 'WALLET_TO_WALLET', 'COMPLETED', 'Lunch payment', '2024-01-15 10:30:00', '2024-01-15 10:30:05'),
('TXN1701234567890002', 2, 3, 1200.00, 'WALLET_TO_WALLET', 'COMPLETED', 'Rent payment', '2024-01-16 14:20:00', '2024-01-16 14:20:03'),
('TXN1701234567890003', NULL, 1, 2000.00, 'ADD_MONEY', 'COMPLETED', 'Added money from bank', '2024-01-17 09:15:00', '2024-01-17 09:15:02'),
('TXN1701234567890004', 3, 4, 800.00, 'WALLET_TO_WALLET', 'COMPLETED', 'Birthday gift', '2024-01-18 16:45:00', '2024-01-18 16:45:01'),
('TXN1701234567890005', NULL, 2, 1500.00, 'ADD_MONEY', 'COMPLETED', 'Salary credit', '2024-01-19 11:00:00', '2024-01-19 11:00:01');

-- Insert sample bank accounts
INSERT INTO bank_accounts (user_id, account_number, ifsc_code, bank_name, account_holder_name, is_verified, is_primary) VALUES
(1, '1234567890123456', 'HDFC0001234', 'HDFC Bank', 'John Doe', TRUE, TRUE),
(2, '2345678901234567', 'ICIC0002345', 'ICICI Bank', 'Jane Smith', TRUE, TRUE),
(3, '3456789012345678', 'SBIN0003456', 'State Bank of India', 'Mike Johnson', TRUE, TRUE),
(4, '4567890123456789', 'AXIS0004567', 'Axis Bank', 'Sarah Wilson', TRUE, TRUE);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(1, 'Money Sent Successfully', 'You have successfully sent ₹500 to Jane Smith', 'TRANSACTION', TRUE),
(1, 'Money Added', '₹2000 has been added to your wallet from your bank account', 'TRANSACTION', FALSE),
(2, 'Money Received', 'You have received ₹500 from John Doe', 'TRANSACTION', TRUE),
(2, 'Money Received', 'You have received ₹1500 as salary credit', 'TRANSACTION', FALSE),
(3, 'Money Received', 'You have received ₹1200 from Jane Smith for rent payment', 'TRANSACTION', TRUE),
(4, 'Money Received', 'You have received ₹800 from Mike Johnson as birthday gift', 'TRANSACTION', FALSE);
