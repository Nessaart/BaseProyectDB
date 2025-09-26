-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS login_db;
USE login_db;

-- 2. Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,    -- identificador único
  username VARCHAR(50) NOT NULL UNIQUE, -- nombre de usuario
  password_enc VARCHAR(255) NOT NULL,   -- contraseña encriptada
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insertar usuarios de prueba (contraseñas ya encriptadas)
-- Recuerda: el usuario escribe normal, pero tu JS aplica customEncrypt antes de guardar
INSERT INTO usuarios (username, password_enc) VALUES
('juan23', 's0l1 123'),       -- contraseña original: hola123
('laura_b', 'k011dz iwk'),    -- contraseña original: password
('maria99', 'zn1tl 2025'),    -- contraseña original: amigo2025
('admin', 'illg'),            -- contraseña original: root
('test_user', 'kofyz');       -- contraseña original: prueba

-- 4. Validación de login (ejemplo con usuario "juan23" y contraseña "hola123")
-- El sistema en JS convierte "hola123" -> "s0l1 123"
-- Aquí se valida comparando contra lo guardado en la tabla
SELECT * 
FROM usuarios
WHERE username = 'juan23'
  AND password_enc = 's0l1 123';
