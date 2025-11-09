

-- Base de datos: `bd_convocadocente`

-- Estructura de tabla para la tabla `docentes`

CREATE TABLE `docentes` (
  `id` int NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dni` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv_archivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ruta del archivo CV (uploads/cv/)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `docentes`
--

INSERT INTO `docentes` (`id`, `user_id`, `nombres`, `apellidos`, `dni`, `fecha_nacimiento`, `genero`, `pais`, `direccion`, `telefono`, `cv_archivo`) VALUES
(1, 11, 'Pedro Luis', 'Sánchez Rojas', '78451620', '1992-10-20', 'Masculino', 'Bolivia', 'calle 12 av las Gaviotas', '978562341', 'juan curriculm.pdf'),
(2, 15, 'Clendi poma', '', NULL, NULL, '', 'Perú', '', '', NULL);


-- Estructura de tabla para la tabla `docente_cursos_interes`
--

CREATE TABLE `docente_cursos_interes` (
  `id` int NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `plan_estudio_curso_id` int NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `postulacion_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `docente_cursos_interes`
--

INSERT INTO `docente_cursos_interes` (`id`, `user_id`, `plan_estudio_curso_id`, `fecha_registro`, `postulacion_id`) VALUES
(1, 11, 3, '2025-11-08 22:53:38', 1),
(2, 11, 1, '2025-11-08 22:53:38', 1);


-- Estructura de tabla para la tabla `docente_horarios`
--

CREATE TABLE `docente_horarios` (
  `id` int NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `dia_semana` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `postulacion_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `docente_horarios`
--

INSERT INTO `docente_horarios` (`id`, `user_id`, `dia_semana`, `hora_inicio`, `hora_fin`, `postulacion_id`) VALUES
(1, 11, 'Lunes', '08:20:00', '20:00:00', 1),
(2, 11, 'Miércoles', '13:30:00', '22:40:00', 1);

-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `c_codfac` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `c_codesp` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomesp` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`c_codfac`, `c_codesp`, `nomesp`) VALUES
('S', 'S1', 'ENFERMERÍA'),
('S', 'S2', 'FARMACIA Y BIOQUÍMICA');


-- Estructura de tabla para la tabla `experiencias_laborales`
--

CREATE TABLE `experiencias_laborales` (
  `id` int NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `pais` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sector` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `empresa` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre de la empresa u organización',
  `ruc` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'RUC de la empresa (opcional)',
  `cargo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Cargo desempeñado',
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `actual` tinyint(1) DEFAULT '0' COMMENT '1=Actualmente trabajando aquí',
  `sin_experiencia` tinyint(1) DEFAULT '0' COMMENT '1=El docente declara no tener experiencia laboral',
  `constancia_archivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ruta del archivo de la constancia (uploads/experiencia/)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `experiencias_laborales`
--

INSERT INTO `experiencias_laborales` (`id`, `user_id`, `pais`, `sector`, `empresa`, `ruc`, `cargo`, `fecha_inicio`, `fecha_fin`, `actual`, `sin_experiencia`, `constancia_archivo`) VALUES
(1, 11, 'Ecuador', 'Público', 'Colegio Jesus ', NULL, 'Orientación Vocacional', '2021-02-20', '2021-05-30', 0, 0, NULL),
(2, 11, 'Peru', 'Público', 'Hospital Divino', '22000000000', 'Abogado permanente', '2023-09-23', '2023-11-08', 0, 0, 'mi contancia.pdf'),
(3, 11, 'Peru', 'Privado', 'Universidad Cesar Vallejo', NULL, 'Docente', '2024-10-25', NULL, 1, 0, NULL);

-- Estructura de tabla para la tabla `facultades`
--

CREATE TABLE `facultades` (
  `c_codfac` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fac` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `facultades`
--

INSERT INTO `facultades` (`c_codfac`, `nom_fac`) VALUES
('S', 'CIENCIAS DE LA SALUD');

-- Estructura de tabla para la tabla `formaciones_academicas`
--

CREATE TABLE `formaciones_academicas` (
  `id` int NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `nivel_formacion` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `programa_academico` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pais` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_obtencion` date DEFAULT NULL,
  `documento_archivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ruta del archivo del documento (uploads/formacion/)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `formaciones_academicas`
--

INSERT INTO `formaciones_academicas` (`id`, `user_id`, `nivel_formacion`, `programa_academico`, `institucion`, `pais`, `fecha_obtencion`, `documento_archivo`) VALUES
(1, 11, 'Técnico Superior', 'Contabilidad', 'SISE', 'Peru', '2020-02-20', 'titulo tecnico .pdf'),
(2, 11, 'Licenciatura', 'Derecho', 'Nortbert Winnner', 'Chile', '2023-08-15', 'pedro derecho.pdf'),
(3, 11, 'Maestría', 'salud publica', 'Adversidad del Norte', 'Espeña', '2024-12-19', 'mi maestria.pdf');

-- Estructura de tabla para la tabla `plan_estudio_curso`
--

CREATE TABLE `plan_estudio_curso` (
  `id` int NOT NULL,
  `n_codplan` int NOT NULL,
  `c_codfac` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_codesp` char(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_codcur` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `c_nomcur` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `n_ciclo` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '0' COMMENT '0=Inactivo, 1=Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `plan_estudio_curso`
--

INSERT INTO `plan_estudio_curso` (`id`, `n_codplan`, `c_codfac`, `c_codesp`, `c_codcur`, `c_nomcur`, `n_ciclo`, `estado`) VALUES
(1, 2023, 'S', 'S1', 'COUD002', 'Matemáticas', NULL, 1),
(3, 2023, 'S', 'S1', 'ESG0201', 'LIDERAZGO', NULL, 1),
(4, 2025, 'S', 'S2', 'SESG3013', 'MÉTODOS DE ESTUDIO', NULL, 1),
(5, 2025, 'S', 'S2', 'SCTS3022', 'QUÍMICA GENERAL', NULL, 1);


-- Estructura de tabla para la tabla `postulaciones_cursos_especialidad`
--

CREATE TABLE `postulaciones_cursos_especialidad` (
  `id` int NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `c_codfac` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `c_codesp` char(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('PENDIENTE','EVALUANDO','APROBADO','RECHAZADO') COLLATE utf8mb4_unicode_ci DEFAULT 'PENDIENTE',
  `comentario_evaluacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `evaluador_user_id` bigint UNSIGNED DEFAULT NULL,
  `fecha_postulacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `postulaciones_cursos_especialidad`
--

INSERT INTO `postulaciones_cursos_especialidad` (`id`, `user_id`, `c_codfac`, `c_codesp`, `estado`, `comentario_evaluacion`, `evaluador_user_id`, `fecha_postulacion`) VALUES
(1, 11, 'S', 'S1', 'PENDIENTE', NULL, 10, '2025-11-08 22:53:38');

-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(1, 'Administrador', NULL, 1),
(2, 'Decano', NULL, 1),
(3, 'Director', NULL, 1);

-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint UNSIGNED NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_login` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `estado` tinyint NOT NULL DEFAULT '1' COMMENT '1=Activo , 0=Inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `google_id`, `email_verified_at`, `password`, `remember_token`, `first_login`, `created_at`, `updated_at`, `last_login`, `estado`) VALUES
(1, 'REVILLA', 'linder.revilla@uma.edu.pe', NULL, NULL, '$2a$12$RK2j2vNhN4zvRip3HpX6yOl4N1SW9mMxjCBTVPcOxIfSxTSzNxjHe', NULL, 1, '2025-11-03 21:03:45', '2025-11-08 19:41:44', '2025-11-08 19:41:44', 1),
(10, 'James Pérez lima', 'james.perezlima@gmail.com', NULL, NULL, NULL, NULL, 1, '2025-11-03 22:11:22', '2025-11-08 00:07:53', '2025-11-08 00:07:53', 1),
(11, 'Pedro', 'pedro.rojas@uma.edu.pe', NULL, NULL, '$2a$12$xgF3ypsrC4OFa5oa7jIgi.VE36Ru23pV2mouMUNuaIEFBEHqoP7vG', NULL, 1, '2025-11-04 03:21:34', '2025-11-08 22:29:02', '2025-11-08 22:29:02', 1),
(12, 'JUAN TOBAR', 'juan.tovar@uma.edu.pe', NULL, NULL, '$2a$12$xgF3ypsrC4OFa5oa7jIgi.VE36Ru23pV2mouMUNuaIEFBEHqoP7vG', NULL, 1, '2025-11-06 00:23:02', '2025-11-08 00:03:18', '2025-11-08 00:03:18', 1),
(15, 'Clendi poma', 'clendipoma@gmail.com', NULL, NULL, '$2a$12$Vuz5i5gA7qWgO2glIIdsG.gkXvVlenqstlDZM9QP5C.mDTG8K0Ks6', NULL, 1, '2025-11-08 22:56:42', '2025-11-08 22:57:11', '2025-11-08 22:57:11', 1);

-- Estructura de tabla para la tabla `usuario_especialidad`
--

CREATE TABLE `usuario_especialidad` (
  `user_id` bigint UNSIGNED NOT NULL,
  `c_codfac` char(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `c_codesp` char(2) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario_especialidad`
--

INSERT INTO `usuario_especialidad` (`user_id`, `c_codfac`, `c_codesp`) VALUES
(10, 'S', 'S1'),
(12, 'S', 'S2');


-- Estructura de tabla para la tabla `usuario_facultad`
--

CREATE TABLE `usuario_facultad` (
  `user_id` bigint UNSIGNED NOT NULL,
  `c_codfac` char(3) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario_facultad`
--

INSERT INTO `usuario_facultad` (`user_id`, `c_codfac`) VALUES
(10, 'S'),
(12, 'S');


-- Estructura de tabla para la tabla `usuario_roles`
--

CREATE TABLE `usuario_roles` (
  `user_id` bigint UNSIGNED NOT NULL,
  `role_id` int NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario_roles`
--

INSERT INTO `usuario_roles` (`user_id`, `role_id`, `fecha_asignacion`) VALUES
(1, 1, '2025-10-31 05:16:38'),
(10, 3, '2025-11-03 23:49:51'),
(12, 3, '2025-11-06 00:24:35');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `docente_cursos_interes`
--
ALTER TABLE `docente_cursos_interes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_estudio_curso_id` (`plan_estudio_curso_id`),
  ADD KEY `fk_postulacion` (`postulacion_id`);

--
-- Indices de la tabla `docente_horarios`
--
ALTER TABLE `docente_horarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `docente_horarios_ibfk_1` (`user_id`),
  ADD KEY `docente_horarios_ibfk_2` (`postulacion_id`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`c_codfac`,`c_codesp`);

--
-- Indices de la tabla `experiencias_laborales`
--
ALTER TABLE `experiencias_laborales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `facultades`
--
ALTER TABLE `facultades`
  ADD PRIMARY KEY (`c_codfac`);

--
-- Indices de la tabla `formaciones_academicas`
--
ALTER TABLE `formaciones_academicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `plan_estudio_curso`
--
ALTER TABLE `plan_estudio_curso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `c_codfac` (`c_codfac`,`c_codesp`);

--
-- Indices de la tabla `postulaciones_cursos_especialidad`
--
ALTER TABLE `postulaciones_cursos_especialidad`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unica_postulacion` (`user_id`,`c_codfac`,`c_codesp`),
  ADD KEY `c_codfac` (`c_codfac`,`c_codesp`),
  ADD KEY `fk_evaluador_usuario` (`evaluador_user_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `usuario_especialidad`
--
ALTER TABLE `usuario_especialidad`
  ADD PRIMARY KEY (`user_id`,`c_codfac`,`c_codesp`),
  ADD KEY `c_codfac` (`c_codfac`,`c_codesp`);

--
-- Indices de la tabla `usuario_facultad`
--
ALTER TABLE `usuario_facultad`
  ADD PRIMARY KEY (`user_id`,`c_codfac`),
  ADD KEY `c_codfac` (`c_codfac`);

--
-- Indices de la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `docentes`
--
ALTER TABLE `docentes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `docente_cursos_interes`
--
ALTER TABLE `docente_cursos_interes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `docente_horarios`
--
ALTER TABLE `docente_horarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `experiencias_laborales`
--
ALTER TABLE `experiencias_laborales`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `formaciones_academicas`
--
ALTER TABLE `formaciones_academicas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `plan_estudio_curso`
--
ALTER TABLE `plan_estudio_curso`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `postulaciones_cursos_especialidad`
--
ALTER TABLE `postulaciones_cursos_especialidad`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD CONSTRAINT `docentes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `docente_cursos_interes`
--
ALTER TABLE `docente_cursos_interes`
  ADD CONSTRAINT `docente_cursos_interes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `docente_cursos_interes_ibfk_2` FOREIGN KEY (`plan_estudio_curso_id`) REFERENCES `plan_estudio_curso` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_postulacion` FOREIGN KEY (`postulacion_id`) REFERENCES `postulaciones_cursos_especialidad` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `docente_horarios`
--
ALTER TABLE `docente_horarios`
  ADD CONSTRAINT `docente_horarios_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `docente_horarios_ibfk_2` FOREIGN KEY (`postulacion_id`) REFERENCES `postulaciones_cursos_especialidad` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD CONSTRAINT `especialidades_ibfk_1` FOREIGN KEY (`c_codfac`) REFERENCES `facultades` (`c_codfac`) ON DELETE CASCADE;

--
-- Filtros para la tabla `experiencias_laborales`
--
ALTER TABLE `experiencias_laborales`
  ADD CONSTRAINT `experiencias_laborales_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `formaciones_academicas`
--
ALTER TABLE `formaciones_academicas`
  ADD CONSTRAINT `formaciones_academicas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `plan_estudio_curso`
--
ALTER TABLE `plan_estudio_curso`
  ADD CONSTRAINT `plan_estudio_curso_ibfk_1` FOREIGN KEY (`c_codfac`,`c_codesp`) REFERENCES `especialidades` (`c_codfac`, `c_codesp`) ON DELETE CASCADE;

--
-- Filtros para la tabla `postulaciones_cursos_especialidad`
--
ALTER TABLE `postulaciones_cursos_especialidad`
  ADD CONSTRAINT `fk_evaluador_usuario` FOREIGN KEY (`evaluador_user_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `postulaciones_cursos_especialidad_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `postulaciones_cursos_especialidad_ibfk_2` FOREIGN KEY (`c_codfac`,`c_codesp`) REFERENCES `especialidades` (`c_codfac`, `c_codesp`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_especialidad`
--
ALTER TABLE `usuario_especialidad`
  ADD CONSTRAINT `usuario_especialidad_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_especialidad_ibfk_2` FOREIGN KEY (`c_codfac`,`c_codesp`) REFERENCES `especialidades` (`c_codfac`, `c_codesp`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_facultad`
--
ALTER TABLE `usuario_facultad`
  ADD CONSTRAINT `usuario_facultad_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_facultad_ibfk_2` FOREIGN KEY (`c_codfac`) REFERENCES `facultades` (`c_codfac`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario_roles`
--
ALTER TABLE `usuario_roles`
  ADD CONSTRAINT `usuario_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuario_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT;
COMMIT;

