-- seed für admin
INSERT INTO users (email, password_hash, role) VALUES
-- admin:
('admin@example.com', 
'$2a$12$kAlZOwpb5p1TOWsy2GFOleUJvemNDWX5idEVV80/1Q5ykzU6pZlQ2', 
'admin'),

-- Normaler User
('user1@example.com',
'$2a$12$kAlZOwpb5p1TOWsy2GFOleUJvemNDWX5idEVV80/1Q5ykzU6pZlQ2',
'user');
