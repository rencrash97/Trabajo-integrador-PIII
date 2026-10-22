CREATE TABLE `Usuario` (
    `id_usuario` integer PRIMARY KEY AUTO_INCREMENT,
    `nombre` varchar(255) NOT NULL,
    `apellido` varchar(255) NOT NULL,
    `mail` varchar(255) UNIQUE NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `rol` varchar(255) NOT NULL CHECK (
        rol in (
            'cliente',
            'admin',
            'super_admin'
        )
    ),
    `activo` bool NOT NULL,
    `fecha_alta` datetime NOT NULL
);

CREATE TABLE `Espacio` (
    `id_espacio` int PRIMARY KEY AUTO_INCREMENT,
    `nombre` varchar(255) NOT NULL,
    `descripcion` text,
    `capacidad` integer NOT NULL,
    `ubicacion` varchar(255) NOT NULL,
    `precio_por_turno` decimal NOT NULL,
    `activo` bool NOT NULL
);

CREATE TABLE `Turno` (
    `id_turno` int PRIMARY KEY AUTO_INCREMENT,
    `nombre` varchar(255) NOT NULL,
    `hora_inicio` time NOT NULL,
    `hora_fin` time NOT NULL
);

CREATE TABLE `Reserva` (
    `id_reserva` int PRIMARY KEY AUTO_INCREMENT,
    `id_usuario` int NOT NULL,
    `id_espacio` int NOT NULL,
    `id_turno` int NOT NULL,
    `fecha` date NOT NULL,
    `precio` decimal NOT NULL,
    `estado` varchar(255) NOT NULL CHECK (
        estado in (
            'pendiente',
            'confirmada',
            'cancelada'
        )
    ),
    `fecha_creacion` datetime NOT NULL
);

CREATE UNIQUE INDEX `Reserva_index_0` ON `Reserva` (
    `id_espacio`,
    `fecha`,
    `id_turno`
);

ALTER TABLE `Reserva`
ADD FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`);

ALTER TABLE `Reserva`
ADD FOREIGN KEY (`id_espacio`) REFERENCES `Espacio` (`id_espacio`);

ALTER TABLE `Reserva`
ADD FOREIGN KEY (`id_turno`) REFERENCES `Turno` (`id_turno`);