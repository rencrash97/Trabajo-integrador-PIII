-- Datos ficticios para probar el sistema de reservas de coworking.

-- Limpiar en orden por las claves foráneas.
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Reserva;

TRUNCATE TABLE Turno;

TRUNCATE TABLE Espacio;

TRUNCATE TABLE Usuario;

SET FOREIGN_KEY_CHECKS = 1;

-- Usuarios: 1 super-admin, 1 admin y varios clientes.
INSERT INTO
    Usuario (
        id_usuario,
        nombre,
        apellido,
        mail,
        password_hash,
        rol,
        activo,
        fecha_alta
    )
VALUES (
        1,
        'Sofía',
        'Gómez',
        'sofia.admin@cowork.test',
        '$2b$10$hash_ficticio_superadmin',
        'super_admin',
        TRUE,
        '2026-01-10 09:00:00'
    ),
    (
        2,
        'Martín',
        'Pérez',
        'martin.admin@cowork.test',
        '$2b$10$hash_ficticio_admin',
        'admin',
        TRUE,
        '2026-01-12 10:30:00'
    ),
    (
        3,
        'Lucía',
        'Fernández',
        'lucia@cowork.test',
        '$2b$10$hash_ficticio_lucia',
        'cliente',
        TRUE,
        '2026-02-01 11:00:00'
    ),
    (
        4,
        'Tomás',
        'Rodríguez',
        'tomas@cowork.test',
        '$2b$10$hash_ficticio_tomas',
        'cliente',
        TRUE,
        '2026-02-05 12:00:00'
    ),
    (
        5,
        'Valentina',
        'López',
        'valentina@cowork.test',
        '$2b$10$hash_ficticio_valentina',
        'cliente',
        TRUE,
        '2026-03-15 08:45:00'
    ),
    (
        6,
        'Bruno',
        'Díaz',
        'bruno@cowork.test',
        '$2b$10$hash_ficticio_bruno',
        'cliente',
        FALSE,
        '2026-04-20 14:00:00'
    );

-- Espacios con distintos tipos, capacidades y precios.
INSERT INTO
    Espacio (
        id_espacio,
        nombre,
        descripcion,
        capacidad,
        ubicacion,
        precio_por_turno,
        activo
    )
VALUES (
        1,
        'Sala Norte',
        'Sala de reuniones con pantalla y pizarra',
        8,
        'Pasaje El Ombú 2351',
        18000.00,
        TRUE
    ),
    (
        2,
        'Sala Sur',
        'Sala pequeña para reuniones',
        4,
        'Av. Del Ceibo 3145',
        12000.00,
        TRUE
    ),
    (
        3,
        'Oficina Privada A',
        'Oficina cerrada para trabajo individual o de equipo',
        3,
        'Bulevar Las Calandrias 1630',
        22000.00,
        TRUE
    ),
    (
        4,
        'Escritorio Compartido 01',
        'Puesto individual en área compartida',
        1,
        'Bulevar Las Calandrias 1630',
        5000.00,
        TRUE
    ),
    (
        5,
        'Sala en Mantenimiento',
        'Espacio temporalmente fuera de servicio',
        10,
        'Bulevar Las Calandrias 1630',
        20000.00,
        FALSE
    );

-- Turnos fijos del día. Los intervalos son contiguos y no se superponen.
INSERT INTO
    Turno (
        id_turno,
        nombre,
        hora_inicio,
        hora_fin
    )
VALUES (
        1,
        'Mañana',
        '08:00:00',
        '11:30:00'
    ),
    (
        2,
        'Mediodía',
        '11:30:00',
        '15:00:00'
    ),
    (
        3,
        'Tarde',
        '15:00:00',
        '18:30:00'
    ),
    (
        4,
        'Noche',
        '18:30:00',
        '22:00:00'
    );

-- Reservas pasadas y futuras, varios usuarios, espacios y estados.
-- No repetir espacio + fecha + turno debido al índice UNIQUE actual.
INSERT INTO
    Reserva (
        id_reserva,
        id_usuario,
        id_espacio,
        id_turno,
        fecha,
        precio,
        estado,
        fecha_creacion
    )
VALUES (
        1,
        3,
        1,
        1,
        '2026-10-12',
        18000.00,
        'confirmada',
        '2026-10-05 10:15:00'
    ),
    (
        2,
        4,
        2,
        2,
        '2026-10-12',
        12000.00,
        'confirmada',
        '2026-10-06 14:20:00'
    ),
    (
        3,
        5,
        3,
        3,
        '2026-10-13',
        22000.00,
        'cancelada',
        '2026-10-08 09:30:00'
    ),
    (
        4,
        3,
        4,
        1,
        '2026-10-16',
        5000.00,
        'confirmada',
        '2026-10-10 16:00:00'
    ),
    (
        5,
        4,
        1,
        2,
        '2026-10-16',
        18000.00,
        'pendiente',
        '2026-10-11 11:45:00'
    ),
    (
        6,
        5,
        2,
        3,
        '2026-10-16',
        12000.00,
        'confirmada',
        '2026-10-12 13:10:00'
    ),
    (
        7,
        3,
        3,
        4,
        '2026-10-17',
        22000.00,
        'pendiente',
        '2026-10-13 08:25:00'
    ),
    (
        8,
        4,
        4,
        2,
        '2026-10-17',
        5000.00,
        'cancelada',
        '2026-10-13 12:40:00'
    ),
    (
        9,
        5,
        1,
        3,
        '2026-10-18',
        18000.00,
        'confirmada',
        '2026-10-14 17:15:00'
    ),
    (
        10,
        3,
        2,
        4,
        '2026-10-18',
        12000.00,
        'confirmada',
        '2026-10-14 18:05:00'
    ),
    (
        11,
        4,
        1,
        1,
        '2026-10-20',
        18000.00,
        'pendiente',
        '2026-10-15 09:10:00'
    ),
    (
        12,
        5,
        3,
        2,
        '2026-10-20',
        22000.00,
        'confirmada',
        '2026-10-15 09:25:00'
    );