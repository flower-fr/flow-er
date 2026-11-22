# Authentication

All requests to the Core API require a JWT bearer token.

## Credentials

Clients are identified by a `client_id` / `client_secret` pair. For the time being, these credentials are issued and exchanged out of band (outside the platform). Keep the `client_secret` confidential: it must never appear in URLs, request bodies, or client-side code.

## Obtaining a token

Request a JWT by calling the token route with your credentials in HTTP Basic authentication (`client_id` as the username, `client_secret` as the password):

```
GET /api/token
Authorization: Basic base64(client_id:client_secret)
```

The response contains the JWT to use for subsequent API calls.

## Using the token

Every request to the API must carry the token in the `Authorization` header as a Bearer token:

```
GET /core/v1/invoices
Authorization: Bearer <token>
```

A request without a token, or with an invalid or expired token, is rejected with `401 Unauthorized`. Obtain a new token by calling `/api/token` again.

---

# Generic GET Requests

All read-only resources of the Core API follow a single generic route. Replace `:entity` with the resource name (e.g. `invoice`, `user`, `product`).

```
GET /api/v1/:entity
```

The response is always a JSON array of objects, one object per matching record. An empty result set is returned as `[]`, never as an error.

## Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `columns` | string | Yes      | Fields to return. Comma-separated. |
| `where`   | string | No       | Filter expression. Defaults to no filtering. |
| `order`   | string | No       | Sort specification. Defaults to the entity's natural order. |
| `limit`   | string | No       | Maximum number of records to return. Defaults to 100. |

```
GET /core/v1/invoices?columns=id,date,total&where=status:active|total:>=,1000&order=-date&limit=50
```

## `columns`

A comma-separated list of field names. Only the listed fields appear in the returned objects. Unknown field names produce a `400 Bad Request` error.

```
?columns=id,name,date
```

## `where`

The `where` parameter filters the result set. It is a pipe-separated (`|`) list of conditions. Each condition has the form `field:value`, where the value itself is a comma-separated list whose first item is either a literal value (meaning equality) or an operator.

The pipe separator is a logical `AND`: all conditions must match.

```
where=date:2026-11-20|status:new,active|name:like,abc
```

### Operators

| Operator    | Condition syntax            | SQL equivalent                       | Example |
|-------------|-----------------------------|--------------------------------------|---------|
| (none)      | `field:value`               | `field = 'value'`                    | `date:2026-11-20` |
| `in`        | `field:v1,v2,...`           | `field IN ('v1', 'v2', ...)`         | `status:new,active` |
| `like`      | `field:like,substring`      | `field LIKE '%substring%'`           | `name:like,abc` |
| `>=`        | `field:>=,value`            | `field >= value`                     | `amount:>=,1000` |
| `<=`        | `field:<=,value`            | `field <= value`                     | `amount:<=,500` |
| `>`         | `field:>,value`             | `field > value`                      | `amount:>,0` |
| `<`         | `field:<,value`             | `field < value`                      | `amount:<,100` |
| `=`         | `field:=,value`             | `field = value`                      | `status:=,new` |
| `!=`        | `field:!=,value`            | `field != value`                     | `status:!=,archived` |
| `ni`        | `field:ni,v1,v2,...`        | `field NOT IN ('v1', 'v2', ...)`     | `status:ni,gone,archived` |
| `null`      | `field:null`                | `field IS NULL`                      | `time:null` |
| `not_null`  | `field:not_null`            | `field IS NOT NULL`                  | `time:not_null` |
| `between`   | `field:between,min,max`    | `field BETWEEN min AND max`          | `age:between,20,30` |

Notes:

- A bare comma-separated list without an operator is an implicit `IN`: `status:new,active` matches either value.
- `!=` is a plain `NOT EQUALS`.
- `null` and `not_null` take no value part.
- Values containing commas or pipes must be percent-encoded in the URL.

### Examples

```
where=date:2026-11-20
```
Records whose date is exactly 2026-11-20.

```
where=status:new,active
```
Records with status `new` or `active`.

```
where=name:like,abc
```
Records whose name contains `abc`.

```
where=amount:>=,1000
```
Records with amount greater than or equal to 1000.

```
where=status:ni,gone,archived
```
Records whose status is neither `gone` nor `archived`.

```
where=time:null
```
Records whose time is null.

```
where=age:between,20,30
```
Records with age between 20 and 30, inclusive.

```
where=status:active|amount:>=,1000|name:like,smith
```
Combined filter: status equals `active` AND amount is at least 1000 AND name contains `smith`.

## `order`

A comma-separated list of fields. Direction is `asc` (default) or `desc` is the field name is preceded by the minus (-) sign.

```
order=-date,name
```

Records are sorted by date (newest first), then by name for identical dates.

## `limit`

A positive integer bounding the number of returned records.

```
limit=50
```

A `limit` of `0` or a non-integer value produces a `400 Bad Request` error. When `limit` exceeds the server-side maximum page size, the server's value applies.

## Errors

| Status | Meaning |
|--------|---------|
| `400 Bad Request`  | Malformed filter, unknown column, or invalid `limit`. |
| `404 Not Found`  | Unknown `:entity`. |

## Full Example

```
GET /core/v1/invoice?columns=id,customer,total&where=status:active,total:>=,500|paid_at:null&order=total:desc&limit=20
```

Returns at most 20 active, unpaid invoices of at least 500, sorted by total (highest first), each with only the `id`, `customer` and `total` fields.