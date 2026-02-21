# reward-back

Backend de `reward`, proyecto dedicado a recompilar las recompensas de **Clash Royale**.

## Stack

| Tecnología | Descripción |
|------------|-------------|
| [TypeScript](https://www.typescriptlang.org) | Lenguaje de programación |
| [Hono](https://hono.dev) | Backend framework |
| [Zod](https://zod.dev) | Validador de esquemas |
| [Drizzle](https://orm.drizzle.team) | ORM |
| [Turso](https://app.turso.tech) | Base de datos SQLite en la nube |
| [Cloudflare KV](https://developers.cloudflare.com/kv) | Base de datos key-value |

> Linter y formatter: [Biome](https://biomejs.dev/es)

## Interfaz general

Todas las respuestas siguen esta estructura, variando solo el campo `response` según el endpoint:

```ts
type ApiResponse<T = null> = {
  status: "ok" | "failed";
  msg: string | null;
  token: string | null;
  response: T | null;
};
```

Por ejemplo, para `GET /api/reward`:

```ts
ApiResponse<{ totalPages: number; data: Reward[] }>

// Se traduce a:
{
  status: "ok",
  msg: null,
  token: null,
  response: {
    totalPages: 3,
    data: [...]
  }
}
```

## Endpoints

### `GET /api/reward`
Obtiene todos los rewards paginados.

| Query Param | Tipo   | Default |
|-------------|--------|---------|
| `limit`     | number | 6       |
| `page`      | number | 1       |

```ts
ApiResponse<{ totalPages: number; data: Reward[] }>
```

---

### `POST /api/reward` 🔒 admin
Crea uno o varios rewards.

```ts
// Body
Array<{
  icon?: string; // url
  bg?: string;
  link: string;  // url
}>

ApiResponse<{ data: { id: number }[] }>
```

---

### `DELETE /api/reward/:id` 🔒 admin
Elimina un reward por ID.

```ts
ApiResponse<{ data: { id: number } }>
```

---

### `PATCH /api/reward/:id/toggle` 🔒 admin
Activa o desactiva un reward.

```ts
ApiResponse<{ data: { id: number; active: boolean } }>
```

---

### `PUT /api/reward/:id` 🔒 admin
Actualiza un reward por ID.

```ts
// Body
{
  icon?: string; // url
  bg?: string;
  link?: string; // url
}

ApiResponse<{ data: { id: number } }>
```

---

## Errores

| Código | Descripción                              |
|--------|------------------------------------------|
| 400    | ID inválido o body no pasa validación    |
| 401    | No autenticado o token inválido          |
| 403    | Sin permisos para este recurso           |
| 404    | Reward no encontrado                     |
| 500    | Error en el servidor                     |