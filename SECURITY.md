Flow-ER V1 security
==========

Data Access Control Lists or ACL (flCore)
-------------------------------

Flow-er provides a general support to control access on data depending on a profile's roles. Each module that defines a data model in *config/model* should associate an acl file in *config/model/acl*. For example, *flCore* defines the place data entity with some properties in *config/model/account.js* :

```js
entities: {
    place: { table: "place" }
},
properties: {
    id: { entity: "place", column: "id" },
    status: { entity: "place", column: "status", audit: true },
    identifier: { entity: "place", column: "identifier", audit: true },
    name: { entity: "place", column: "name", audit: true },
    ...
    visibility: { entity: "place", column: "visibility", audit: true },
    touched_at: { entity: "place", column: "touched_at", type: "datetime" },
    touched_by: { entity: "place", column: "touched_by", type: "int" }
},
```

The associate acl file *config/model/acl/acl_account.js* lists the authorized types of request (GET, POST, DELETE) and for each type the authorized properties:

```js
get: {
    properties: {
        "id": {},
        "identifier": {},
        "name": {},
        ...
        "touched_at": {},
        "touched_by": {},
    }
},
post: {
    properties: {
        "name": {},
    }
},
delete: {},
```

Note that by convention the properties are listed in alphabetical order in acl while in logical order in model, which helps for a human to check if a given property is authorized or not.

If the value associate to an acl entry is an empty object, the access is allowed regardless the roles given to the user profile.

CSRF (flCore)
----

The POST routes *core/v1*, *core/transaction*, *core/file*, *core/smtp* and the DELETE route *core/v1* are protected against cross site request forgery (CSRF).
Each request attempt should contain the "csrf" JWT token as a secure session cookie. The request is executed only if the csrf token is not expired otherwise the request throws a 403 error.

Prior to attemp a POST or DELETE request, the client has to obtain from the backend a fresh csrf token. The GET route *core/csrf* is especially designed for this goal. It create the secure csrf token and adds it to the session. A secure token uses this set of parameters:

```js
httpOnly: true,
secure: true, 
sameSite: "strict",
path: "/", 
maxAge: config.csrfExpirationTime
```

(see *loginPostV2* in *vendor/user/server/loginPost.js* for an example of accessToken set as a secure session cookie)