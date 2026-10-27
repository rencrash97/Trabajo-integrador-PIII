-- Active: 1779922585504@@127.0.0.1@3306@coworking
CREATE DATABASE coworking;

USE coworking;

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    mail VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_alta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_usuario_rol CHECK (
        rol IN (
            'cliente',
            'admin',
            'super_admin'
        )
    )
);

CREATE TABLE Espacio (
    id_espacio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    capacidad INT NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    precio_por_turno DECIMAL(10, 2) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_espacio_capacidad CHECK (capacidad > 0),
    CONSTRAINT chk_espacio_precio CHECK (precio_por_turno >= 0)
);

CREATE TABLE Turno (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    CONSTRAINT chk_turno_horario CHECK (hora_inicio < hora_fin)
);

CREATE TABLE Reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_espacio INT NOT NULL,
    id_turno INT NOT NULL,
    fecha DATE NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_espacio_reserva_activa INT GENERATED ALWAYS AS (
        CASE
            WHEN estado = 'cancelada' THEN NULL
            ELSE id_espacio
        END
    ) STORED,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario),
    CONSTRAINT fk_reserva_espacio FOREIGN KEY (id_espacio) REFERENCES Espacio (id_espacio),
    CONSTRAINT fk_reserva_turno FOREIGN KEY (id_turno) REFERENCES Turno (id_turno),
    CONSTRAINT chk_reserva_estado CHECK (
        estado IN (
            'pendiente',
            'confirmada',
            'cancelada'
        )
    ),
    CONSTRAINT chk_reserva_precio CHECK (precio >= 0),
    CONSTRAINT uq_reserva_no_cancelada UNIQUE (
        id_espacio_reserva_activa,
        fecha,
        id_turno
    )
    -- no puede haber dos reservas no canceladas para el mismo espacio, fecha y turno.
);