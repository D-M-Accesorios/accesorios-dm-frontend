## [HU-ENV-INICIALES_XX] Título de la Historia de Usuario

---

### Descripción

<!-- Describe brevemente qué hace este PR y por qué es necesario. -->

---

### HU relacionada

- **ID:** HU-ENV-INICIALES_XX
- **Repositorio del backlog:** [accesorios-dm/docs/HUs/](../accesorios-dm/docs/HUs/)

---

### ADRs aplicados

- [ ] ADR-008 — Versionamiento de APIs (`/api/v1/`)

---

### Tipo de cambio

- [ ] `feat` — Nueva funcionalidad / componente
- [ ] `fix` — Corrección de bug
- [ ] `refactor` — Refactorización
- [ ] `chore` — Configuración / dependencias
- [ ] `docs` — Documentación
- [ ] `test` — Tests
- [ ] `ci` — Pipeline CI/CD

---

### Criterios de aceptación completados

- [ ] ...
- [ ] ...

---

### Checklist técnico — Frontend (Angular)

- [ ] El código no contiene secretos, credenciales ni valores hardcodeados.
- [ ] No hay URLs de API hardcodeadas — se usan las variables de `environment.ts` / `environment.prod.ts`.
- [ ] El Bearer token se obtiene únicamente a través del `AuthService`.
- [ ] Las rutas protegidas tienen el `AuthGuard` (o guard correspondiente) aplicado.
- [ ] No hay `console.log` ni código de debug en el diff.
- [ ] Los componentes nuevos siguen la estructura de módulos existente.
- [ ] Las llamadas HTTP usan el `HttpClient` con interceptores, no `fetch` directo.
- [ ] El build de producción (`ng build --configuration production`) no genera errores.

---

### Checklist de Definición de Done

- [ ] Los criterios de aceptación de la HU están cumplidos.
- [ ] El CI pasa (validate-branch-flow + build si aplica).
- [ ] El reviewer aprobó el PR.
- [ ] La rama `HU-*` será eliminada tras el merge.

---

### Notas al reviewer

<!-- Contexto adicional, decisiones tomadas, áreas de atención especial. -->
