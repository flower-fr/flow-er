Flow-ER V1 security
==========

CSRF
----
The POST routes *core/v1*, *core/transaction*, *core/tag*, *core/smtp* and the DELETE route *core/v1* are protected against cross site request forgery (CSRF)
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