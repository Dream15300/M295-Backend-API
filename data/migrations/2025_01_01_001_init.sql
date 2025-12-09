PRAGMA foreign_keys = ON;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('employee', 'admin')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Time Entries
CREATE TABLE IF NOT EXISTS time_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    timestamp DATETIME NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
    comment TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_time_entries_user_id
    ON time_entries(user_id);

CREATE INDEX IF NOT EXISTS idx_time_entries_timestamp
    ON time_entries(timestamp);

-- Absences
CREATE TABLE IF NOT EXISTS absences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Vacation', 'Sick', 'Flex')),
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_absences_user_id
    ON absences(user_id);

CREATE INDEX IF NOT EXISTS idx_absences_status
    ON absences(status);

-- Absence Documents
CREATE TABLE IF NOT EXISTS absence_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    absence_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (absence_id) REFERENCES absences(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_absence_documents_absence_id
    ON absence_documents(absence_id);

-- Change Logs
CREATE TABLE IF NOT EXISTS change_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    changed_table TEXT NOT NULL,
    changed_record_id INTEGER NOT NULL,
    changed_by INTEGER NOT NULL,
    change_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    change_type TEXT NOT NULL CHECK (change_type IN ('Insert', 'Update', 'Delete')),
    details TEXT,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_change_logs_table_record
    ON change_logs(changed_table, changed_record_id);

CREATE INDEX IF NOT EXISTS idx_change_logs_changed_by
    ON change_logs(changed_by);
