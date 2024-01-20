CREATE KEYSPACE IF NOT EXISTS toronto_ks WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

USE KEYSPACE toronto_ks;

CREATE TABLE toronto_ks.file (
  id UUID PRIMARY KEY,
  owner TEXT,
  folder TEXT,
  name TEXT,
  size INT,
  type TEXT,
  data blob,
  is_public BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS file_name_idx ON toronto_ks.file (name);
CREATE INDEX IF NOT EXISTS file_type_idx ON toronto_ks.file (type);
