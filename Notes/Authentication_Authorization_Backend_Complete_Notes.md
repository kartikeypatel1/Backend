# Authentication & Authorization for Backend Engineers

> Complete notes for understanding, handwritten revision, backend implementation, and interview preparation.

---

## Table of Contents

1. [Authentication and Authorization](#1-authentication-and-authorization)
2. [Why Authentication Is Needed](#2-why-authentication-is-needed)
3. [Authentication Factors](#3-authentication-factors)
4. [Password Authentication](#4-password-authentication)
5. [Password Hashing](#5-password-hashing)
6. [HTTP and Statelessness](#6-http-and-statelessness)
7. [Session-Based Authentication](#7-session-based-authentication)
8. [Cookies](#8-cookies)
9. [JWT](#9-jwt)
10. [Session vs JWT](#10-session-vs-jwt)
11. [Access Token and Refresh Token](#11-access-token-and-refresh-token)
12. [API Key Authentication](#12-api-key-authentication)
13. [OAuth 2.0](#13-oauth-20)
14. [OpenID Connect (OIDC)](#14-openid-connect-oidc)
15. [OAuth vs OIDC](#15-oauth-vs-oidc)
16. [RBAC](#16-rbac)
17. [Resource-Level Authorization](#17-resource-level-authorization)
18. [401 vs 403](#18-401-vs-403)
19. [CSRF](#19-csrf)
20. [XSS](#20-xss)
21. [Timing Attacks](#21-timing-attacks)
22. [Brute Force and Rate Limiting](#22-brute-force-and-rate-limiting)
23. [MFA](#23-mfa)
24. [Least Privilege](#24-least-privilege)
25. [Secure Backend Authentication Architecture](#25-secure-backend-authentication-architecture)
26. [Node.js / Express Backend Example](#26-nodejs--express-backend-example)
27. [Common Mistakes](#27-common-mistakes)
28. [Interview Questions and Answers](#28-interview-questions-and-answers)
29. [Scenario-Based Interview Questions](#29-scenario-based-interview-questions)
30. [Rapid Revision Sheet](#30-rapid-revision-sheet)
31. [2-Minute Interview Explanation](#31-2-minute-interview-explanation)
32. [Final Mental Model](#32-final-mental-model)

---

# 1. Authentication and Authorization

## Authentication (AuthN)

Authentication means **verifying the identity** of a user or service.

It answers:

> **Who are you?**

Example:

```text
Email + Password
       ↓
Backend verifies credentials
       ↓
User identified
```

Example from real life:

```text
Login to Instagram
→ Enter email/password
→ Server verifies
→ You are logged in
```

---

## Authorization (AuthZ)

Authorization means checking **what an authenticated user is allowed to do**.

It answers:

> **What can you do?**

Example:

```text
Admin → Can delete users
User  → Cannot delete users
```

---

## Easy Memory Trick

```text
Authentication → WHO?
Authorization  → WHAT?
```

---

# 2. Why Authentication Is Needed

Without authentication, a backend cannot reliably know which user is making a request.

Imagine:

```text
GET /profile
```

The backend needs to know:

```text
Which user's profile?
```

Authentication gives the server the user's identity.

Then authorization decides whether that identity has permission to access the requested resource.

Complete flow:

```text
Request
   ↓
Authentication
   ↓
Identify user
   ↓
Authorization
   ↓
Check permission
   ↓
Allow / Deny
```

---

# 3. Authentication Factors

Authentication can use different factors.

## 3.1 Something You Know

Examples:

- Password
- PIN
- Passphrase

```text
Password
PIN
```

---

## 3.2 Something You Have

Examples:

- Mobile phone
- OTP device
- Smart card
- Security key

```text
Phone
Security Key
OTP Device
```

---

## 3.3 Something You Are

Examples:

- Fingerprint
- Face
- Retina/iris characteristics

---

## MFA

**MFA = Multi-Factor Authentication**

It uses multiple different authentication factors.

Example:

```text
Password + Security Key
```

or:

```text
Password + OTP
```

Important:

Two passwords are still the same factor category because both are "something you know."

---

# 4. Password Authentication

Basic login flow:

```text
Client
  ↓
POST /login
  ↓
Email + Password
  ↓
Backend
  ↓
Find User
  ↓
Verify Password
  ↓
Create Session / Token
  ↓
Return Authentication Result
```

Example request:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

---

# 5. Password Hashing

## Never Store Plaintext Passwords

### Wrong

```text
email: user@example.com
password: hello123
```

If the database gets leaked, the password is immediately exposed.

### Correct

```text
Password
   ↓
Password Hashing
   ↓
Hash
   ↓
Database
```

Common password hashing algorithms:

- Argon2
- bcrypt
- scrypt

---

## Hashing

Hashing converts input into a derived value.

For passwords, use a **password-specific hashing algorithm**.

```text
Password
   ↓
Hashing Algorithm
   ↓
Password Hash
```

The normal application flow is:

```text
Login Password
      ↓
Password Verification Function
      ↓
Compare with Stored Hash
      ↓
Match / No Match
```

Do not write your own password hashing algorithm.

---

## Hashing vs Encryption

### Hashing

- Intended to be one-way
- Commonly used for passwords
- No normal "decrypt" operation

### Encryption

- Designed to be reversible
- Uses a key
- Used when the original data must later be recovered

Easy memory:

```text
Hashing   → Password
Encryption → Recoverable sensitive data
```

---

## Password Salting

A **salt** is random data incorporated by a password hashing algorithm.

Conceptually:

```text
Password + Random Salt
         ↓
      Hashing
         ↓
      Hash
```

Modern password-hashing libraries handle salt generation as part of their normal use.

Why salt?

If two users use the same password, proper salting prevents them from automatically having identical stored hashes.

---

# 6. HTTP and Statelessness

HTTP is generally **stateless**.

Stateless means:

> Each request is handled independently. The protocol itself does not automatically remember previous application state.

Example:

```text
Request 1 → POST /login
Request 2 → GET /profile
Request 3 → GET /orders
```

The server needs some authentication mechanism to associate future requests with a user.

Common mechanisms:

- Session + Cookie
- Access Token
- JWT
- OAuth/OIDC tokens

---

# 7. Session-Based Authentication

A session stores authentication state on the server.

## Basic Flow

```text
User
  ↓
Login
  ↓
Backend verifies credentials
  ↓
Create Session
  ↓
Store Session on Server
  ↓
Send Session ID to Browser
  ↓
Browser stores Session ID in Cookie
  ↓
Browser sends Cookie on future requests
  ↓
Backend finds Session
  ↓
User Identified
```

Example:

```text
Session ID = abc123xyz
```

The session ID acts as a reference to server-side authentication state.

---

## Session Storage

Sessions may be stored in:

- Memory
- Database
- Redis
- Another shared session store

For multiple backend instances, a shared store is often useful.

Example:

```text
              Load Balancer
                   ↓
       ┌───────────┼───────────┐
       ↓           ↓           ↓
   Server A     Server B     Server C
       └───────────┼───────────┘
                   ↓
                 Redis
                   ↓
                Sessions
```

---

## Session Advantages

- Easy to invalidate
- Easy logout
- Server has direct control
- Easy active-session tracking

## Session Disadvantages

- Requires server-side storage
- Requires session lookups
- Distributed deployments need shared state

---

# 8. Cookies

A cookie is data stored by a browser and sent with matching HTTP requests.

Server sends:

```http
Set-Cookie: session_id=abc123
```

Browser stores it.

Later requests may contain:

```http
Cookie: session_id=abc123
```

---

## Important Cookie Flags

### HttpOnly

```text
HttpOnly
```

JavaScript cannot directly read the cookie.

Useful for reducing token exposure to JavaScript in some XSS scenarios.

---

### Secure

```text
Secure
```

The browser sends the cookie only over HTTPS.

---

### SameSite

Controls cross-site cookie behavior.

Common values:

```text
Strict
Lax
None
```

SameSite is an important part of a CSRF defense strategy.

---

# 9. JWT

JWT = **JSON Web Token**

JWT is a compact token format that can contain claims and a digital signature.

Basic flow:

```text
Login
  ↓
Verify Credentials
  ↓
Create JWT
  ↓
Send JWT
  ↓
Client Sends JWT on Future Requests
  ↓
Backend Verifies JWT
  ↓
User Identified
```

---

## JWT Structure

JWT has three parts:

```text
HEADER.PAYLOAD.SIGNATURE
```

Example:

```text
xxxxx.yyyyy.zzzzz
```

---

## 9.1 Header

Contains token metadata.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

---

## 9.2 Payload

Contains claims.

Example:

```json
{
  "sub": "12345",
  "role": "user",
  "iat": 1720000000,
  "exp": 1720003600
}
```

Important claims:

| Claim | Meaning |
|---|---|
| `sub` | Subject, often user ID |
| `iat` | Issued At |
| `exp` | Expiration time |
| `iss` | Issuer |
| `aud` | Audience |

---

## 9.3 Signature

The signature allows the server to detect modification of the signed content.

Conceptually:

```text
Header + Payload
      ↓
Signing Key
      ↓
Signature
```

If the payload is changed:

```text
role = user
```

to:

```text
role = admin
```

the old signature will no longer validate.

---

## Is JWT Encrypted?

Normally:

> **No. A normal signed JWT is encoded and signed, not encrypted.**

Therefore, do not place secrets in the payload.

### Bad

```json
{
  "password": "mypassword123"
}
```

### Better

```json
{
  "sub": "12345",
  "role": "user",
  "exp": 1720003600
}
```

---

## JWT Signing Algorithms

### Symmetric

Example:

```text
HS256
```

The same shared secret is used for signing and verification.

```text
Secret
  ↓
Sign
  ↓
JWT
  ↓
Verify using same secret
```

### Asymmetric

Examples:

```text
RS256
ES256
```

Private key signs.

Public key verifies.

```text
Private Key → Sign
Public Key  → Verify
```

Asymmetric signing is useful when many services need to verify tokens without having the private signing key.

---

## JWT Advantages

- Compact
- Portable
- Useful for APIs
- Basic signature verification can be done without session lookup
- Works well in distributed systems

## JWT Disadvantages

- Stolen token can be used until expiry or invalidation
- Immediate revocation is harder
- Large payloads increase request size
- Claims can become stale
- Storage choice affects XSS/CSRF risk

---

# 10. Session vs JWT

| Session | JWT |
|---|---|
| Server stores authentication state | Token carries claims |
| Stateful | Commonly stateless |
| Easy revocation | Immediate revocation needs extra design |
| Requires server-side lookup | Basic verification can be local |
| Shared store may be required | Useful across services |
| Common in many web apps | Common in many APIs |

## Easy Memory

```text
Session → Server remembers you

JWT → Token carries signed claims
```

Important:

> JWT is not automatically "better" than sessions. Choose based on application architecture and security requirements.

---

# 11. Access Token and Refresh Token

## Access Token

Used to access protected APIs.

Usually:

- Short-lived
- Frequently sent
- Limited in scope/permissions

---

## Refresh Token

Used to obtain a new access token without making the user log in again.

Usually:

- Longer-lived
- More sensitive
- Stored and protected carefully

---

## Flow

```text
Login
  ↓
Access Token + Refresh Token
  ↓
Use Access Token
  ↓
Access Token Expires
  ↓
Send Refresh Token
  ↓
Authorization Server / Backend
  ↓
New Access Token
```

---

## Why Short-Lived Access Tokens?

If an access token is stolen:

```text
Stolen Token
    ↓
Short Expiry
    ↓
Smaller attack window
```

Short expiry reduces risk but does not solve token theft by itself.

---

# 12. API Key Authentication

An API key is a secret credential used to identify or authenticate an application/service.

Example:

```http
X-API-Key: abc123xyz
```

Common use cases:

- Server-to-server APIs
- External API access
- Machine-to-machine communication
- Internal services

## Advantages

- Simple
- Easy to implement

## Disadvantages

- Often long-lived
- Dangerous if leaked
- Requires secure storage
- Should be rotated/revoked when necessary

---

# 13. OAuth 2.0

OAuth 2.0 is mainly an **authorization framework**.

It solves this problem:

> How can one application access a user's resources without receiving the user's password?

### Bad Design

```text
App
 ↓
"Give me your Google password"
```

Problems:

- App receives the password
- Difficult to limit access
- Password cannot be safely delegated
- Revocation becomes harder

### OAuth Design

```text
User
  ↓
Authorization Server
  ↓
User authenticates
  ↓
User gives permission
  ↓
Access Token
  ↓
Client Application
  ↓
Resource Server
```

---

# 14. OAuth 2.0 Roles

## 1. Resource Owner

Usually the user who owns the data.

## 2. Client

The application requesting access.

## 3. Authorization Server

Authenticates the resource owner and issues tokens.

## 4. Resource Server

Hosts the protected resources/API.

Example:

```text
Resource Owner       → User
Client               → Travel App
Authorization Server → Google Authorization Server
Resource Server      → Google API
```

---

# 15. OAuth Scopes

A **scope** limits what the client is allowed to access.

Example:

```text
read:email
```

Another example:

```text
calendar.read
```

The idea is:

```text
Permission needed
      ↓
Request only that permission
      ↓
Least privilege
```

---

# 16. OAuth Authorization Code Flow

Basic flow:

```text
User
  ↓
Client
  ↓
Authorization Server
  ↓
Login + Consent
  ↓
Authorization Code
  ↓
Client
  ↓
Token Endpoint
  ↓
Access Token
  ↓
Resource Server
```

The authorization code is exchanged for tokens rather than exposing the user's password to the client application.

---

# 17. PKCE

PKCE = **Proof Key for Code Exchange**

PKCE strengthens the authorization code flow, especially for public clients.

Basic idea:

```text
Client creates:
code_verifier
      ↓
Creates code_challenge
      ↓
Authorization Request
      ↓
Authorization Server
      ↓
Authorization Code
      ↓
Client sends code + verifier
      ↓
Server verifies
      ↓
Token issued
```

Memory:

```text
PKCE → Protects authorization code exchange
```

---

# 18. Client Credentials Flow

Used for machine-to-machine communication.

```text
Service A
   ↓
Client Credentials
   ↓
Authorization Server
   ↓
Access Token
   ↓
Service B / API
```

Usually there is no end-user involved.

---

# 19. Device Authorization Flow

Useful for devices with limited input.

Examples:

- Smart TV
- Game console
- Streaming device

The user can authenticate using another device with a better input method.

---

# 20. Implicit Flow

The Implicit Flow was historically used by browser applications.

For modern applications, it is generally discouraged.

For new applications, Authorization Code Flow with PKCE is commonly preferred when applicable.

---

# 21. OpenID Connect (OIDC)

OIDC = **OpenID Connect**

OIDC adds an **identity/authentication layer** on top of OAuth 2.0.

OAuth asks:

```text
"What can this application access?"
```

OIDC asks:

```text
"Who is this user?"
```

OIDC provides an **ID Token**.

Example claims:

```json
{
  "sub": "123456",
  "name": "Kartikey",
  "email": "user@example.com"
}
```

---

# 22. OAuth vs OIDC

| OAuth 2.0 | OIDC |
|---|---|
| Authorization | Authentication + identity |
| Delegated access | User identity |
| Access token | ID token + OAuth tokens |
| "What can app access?" | "Who is the user?" |

Easy memory:

```text
OAuth → Access
OIDC  → Identity
```

---

# 23. RBAC

RBAC = **Role-Based Access Control**

It controls permissions using roles.

Example roles:

```text
User
Moderator
Admin
```

Permissions:

```text
READ
WRITE
DELETE
```

Example:

```text
User
 └── READ

Moderator
 ├── READ
 └── WRITE

Admin
 ├── READ
 ├── WRITE
 └── DELETE
```

Memory:

```text
Role → Permissions
```

---

# 24. Authorization Middleware

Typical backend request flow:

```text
Request
  ↓
Authentication Middleware
  ↓
Verify Session / Token
  ↓
Identify User
  ↓
Authorization Middleware
  ↓
Check Role / Permission
  ↓
Controller
  ↓
Service
  ↓
Database
```

Example:

```text
DELETE /api/users/123
```

Authentication asks:

```text
Who is requesting?
```

Authorization asks:

```text
Does this user have permission to delete users?
```

---

# 25. Resource-Level Authorization

Role checking alone is sometimes not enough.

Example:

```text
GET /orders/101
```

A logged-in user should not automatically be allowed to read every order.

Backend should check:

```text
Is order 101 owned by this user?
OR
Does this user have a permission allowing access?
```

Correct flow:

```text
Authenticate User
       ↓
Identify Resource
       ↓
Check Ownership / Permission
       ↓
Allow / Deny
```

This prevents many broken access-control problems.

---

# 26. IDOR / BOLA Concept

Suppose:

```text
GET /profile/101
```

works.

The attacker changes it to:

```text
GET /profile/102
```

If they can see another user's private profile without permission checking, the API has a broken object-level authorization problem.

The fix is not simply:

```text
"User is logged in"
```

The backend must also verify:

```text
Does this user have permission to access profile 102?
```

---

# 27. 401 vs 403

This is one of the most common interview questions.

## 401 Unauthorized

Authentication is missing or invalid.

Examples:

- No token
- Invalid token
- Expired token
- Invalid authentication credentials

Memory:

```text
401 → Authentication problem
```

Think:

> "Who are you?"

---

## 403 Forbidden

The request is understood and the user is authenticated, but the user is not permitted to perform the action.

Example:

```text
Normal User
    ↓
DELETE /admin/users/5
    ↓
403 Forbidden
```

Memory:

```text
403 → Authorization problem
```

Think:

> "I know who you are, but you cannot do this."

---

# 28. CSRF

CSRF = **Cross-Site Request Forgery**

The attack causes a user's browser to send an unwanted authenticated request to a vulnerable website.

Simplified example:

```text
User logged into Website A
        ↓
User visits malicious Website B
        ↓
Website B tricks browser into sending request to A
        ↓
Browser may attach authentication cookies
        ↓
Unwanted action happens
```

Possible defenses:

- SameSite cookies
- CSRF tokens
- Origin validation
- Referer validation where appropriate
- Do not use GET for state-changing operations

---

# 29. XSS

XSS = **Cross-Site Scripting**

An attacker gets malicious script executed in a user's browser in the application's security context.

Example idea:

```html
<script>maliciousCode()</script>
```

If unsafe input is inserted into a page, the script may execute.

### Defenses

- Output encoding
- Safe DOM APIs
- Input validation where appropriate
- Content Security Policy
- Avoid unsafe HTML injection
- Use HttpOnly cookies for suitable authentication designs

---

# 30. CSRF vs XSS

| XSS | CSRF |
|---|---|
| Attacker executes script | Attacker tricks browser into making request |
| Focus is script execution | Focus is unwanted authenticated action |
| Can steal tokens accessible to JS | Can abuse automatically attached credentials |
| Prevent with safe output/CSP/etc. | Prevent with SameSite/CSRF tokens/origin checks |

Easy memory:

```text
XSS  → Execute
CSRF → Request
```

---

# 31. Credential / Username Enumeration

Bad login responses:

```text
User not found
```

and:

```text
Incorrect password
```

This can reveal which email/username accounts exist.

Example:

```text
Attacker
   ↓
admin@example.com
   ↓
"Incorrect password"
   ↓
Attacker learns account exists
```

Better:

```text
Invalid email or password
```

The external error should not unnecessarily reveal which credential failed.

---

# 32. Timing Attacks

A timing attack uses measurable differences in execution time to infer information.

Example:

```text
Unknown user
    ↓
Quick failure
    ↓
20 ms
```

But:

```text
Known user
    ↓
Password verification
    ↓
200 ms
```

An attacker measures many requests and may infer whether an account exists.

---

## Protection

- Use established password verification libraries
- Avoid obvious timing differences between failure paths
- Use generic login errors
- Apply rate limiting
- Monitor suspicious login activity

Do not rely on arbitrary sleep/delay as the primary security control.

---

# 33. Brute Force Attack

A brute-force attacker tries many passwords.

Example:

```text
123456
password
password123
admin123
qwerty
...
```

### Protection

- Rate limiting
- MFA
- Strong authentication policies
- Account protection controls
- Monitoring
- Credential-stuffing detection

---

# 34. Rate Limiting

Rate limiting controls how many requests a client can make in a given time.

Example:

```text
5 login attempts / minute
```

Useful against:

- Brute force
- Credential stuffing
- Abuse
- Excessive API usage

In a distributed backend, shared systems such as Redis can be used to maintain counters.

---

# 35. MFA

MFA = **Multi-Factor Authentication**

Example:

```text
Password
+
Security Key
```

or:

```text
Password
+
OTP
```

Factors:

```text
Know → Password
Have → Phone / Security Key
Are  → Fingerprint / Face
```

---

# 36. Least Privilege

The **Principle of Least Privilege** means a user, service, or application should receive only the permissions required for its job.

Example:

```text
Payment Service
```

Needs:

```text
CREATE payment
READ payment
```

Does not need:

```text
DELETE users
CHANGE admin roles
```

Memory:

```text
Minimum permissions required
```

---

# 37. Secure Backend Authentication Architecture

A typical architecture:

```text
                       CLIENT
                          ↓
                       HTTPS
                          ↓
                    API Gateway
                          ↓
                Authentication Layer
                          ↓
               ┌──────────┴──────────┐
               ↓                     ↓
            Session              JWT / OIDC
               ↓                     ↓
               └──────────┬──────────┘
                          ↓
                    User Identity
                          ↓
                    Authorization
                          ↓
               Role / Permission Check
                          ↓
                  Resource Ownership
                          ↓
                     Controller
                          ↓
                       Service
                          ↓
                      Database
```

---

# 38. Node.js + Express Backend Example

The following examples show the typical structure. Real production systems should also include validation, HTTPS, secure secret management, rate limiting, logging, and error handling.

---

## 38.1 User Model

Conceptually:

```js
{
  id: "...",
  email: "user@example.com",
  passwordHash: "...",
  role: "user"
}
```

Never:

```js
{
  email: "user@example.com",
  password: "mypassword123"
}
```

---

## 38.2 Password Hashing with bcrypt

Installation:

```bash
npm install bcrypt jsonwebtoken cookie-parser
```

Hash password:

```js
const bcrypt = require("bcrypt");

const passwordHash = await bcrypt.hash(password, 12);
```

Verify password:

```js
const isValid = await bcrypt.compare(
  password,
  user.passwordHash
);
```

Important:

```text
bcrypt.hash()    → create stored password hash
bcrypt.compare() → verify login password
```

---

## 38.3 JWT Creation

```js
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  {
    sub: user.id,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "15m"
  }
);
```

Important:

- Keep secret in environment/secret management system
- Use an appropriate algorithm
- Keep access tokens short-lived where appropriate
- Do not put passwords in the token

---

## 38.4 JWT Authentication Middleware

```js
const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}
```

Flow:

```text
Request
  ↓
Read Authorization header
  ↓
Extract Bearer token
  ↓
Verify signature + claims
  ↓
Attach user identity to req.user
  ↓
next()
```

---

## 38.5 Role-Based Authorization Middleware

```js
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    next();
  };
}
```

Usage:

```js
app.delete(
  "/api/users/:id",
  authenticate,
  authorizeRoles("admin"),
  deleteUserController
);
```

Flow:

```text
Request
   ↓
authenticate
   ↓
Who is user?
   ↓
authorizeRoles("admin")
   ↓
Is user admin?
   ↓
Controller
```

---

## 38.6 Cookie-Based Session Concept

A session-based application may do:

```js
res.cookie("session_id", sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: "lax"
});
```

The server then uses the session ID to look up the session.

In production, configure cookie attributes according to the deployment and threat model.

---

# 39. Typical Backend Folder Structure

```text
src/
├── controllers/
│   └── auth.controller.js
│
├── middleware/
│   ├── authenticate.js
│   └── authorize.js
│
├── routes/
│   └── auth.routes.js
│
├── services/
│   └── auth.service.js
│
├── models/
│   └── user.model.js
│
├── utils/
│   ├── password.js
│   └── token.js
│
├── config/
│   └── env.js
│
└── app.js
```

Simple separation:

```text
Routes
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Database
```

---

# 40. Authentication Request Flow in Backend

Example:

```http
POST /api/auth/login
```

```text
Client
  ↓
Validate input
  ↓
Find user
  ↓
Verify password hash
  ↓
Create session/token
  ↓
Return authentication result
```

Protected request:

```http
GET /api/profile
Authorization: Bearer <token>
```

```text
Request
  ↓
Authentication middleware
  ↓
Verify token
  ↓
Set req.user
  ↓
Authorization check if needed
  ↓
Controller
  ↓
Database
```

---

# 41. Authentication Security Checklist

A secure backend should consider:

- HTTPS everywhere in production
- Password hashing with a suitable password-hashing algorithm
- Never store plaintext passwords
- Strong secret/key management
- Secure cookie configuration
- Short-lived access tokens where appropriate
- Safe refresh-token handling
- Rate limiting
- MFA for important accounts/actions where appropriate
- Generic authentication error messages
- Authorization checks on every protected resource
- Resource ownership checks
- Least privilege
- Secure logging and monitoring
- Secret/token rotation and revocation strategies
- Input validation
- Protection against XSS
- CSRF protections for cookie-based state-changing requests

---

# 42. Common Mistakes

## Mistake 1: Storing plaintext passwords

```text
password = "hello123"
```

Wrong.

Use password hashing.

---

## Mistake 2: Putting password in JWT

Wrong:

```json
{
  "sub": "123",
  "password": "hello123"
}
```

---

## Mistake 3: Trusting the client role

Bad idea:

```json
{
  "role": "admin"
}
```

sent from the client and blindly trusted.

The backend must derive/verify authorization information from trusted server-side state or validated tokens.

---

## Mistake 4: Only checking whether the user is logged in

This is insufficient for resource authorization.

```text
Logged in
   ↓
Access any order
```

Wrong.

Need:

```text
Logged in
   ↓
Check permission / ownership
   ↓
Allow
```

---

## Mistake 5: Returning detailed login errors

Avoid:

```text
User does not exist
```

and:

```text
Password wrong
```

Prefer:

```text
Invalid email or password
```

---

## Mistake 6: No rate limiting

Login endpoints are high-value attack targets.

---

## Mistake 7: Long-lived access tokens with no plan

A stolen token can remain usable for a long time.

---

## Mistake 8: Storing secrets in source code

Bad:

```js
const JWT_SECRET = "my-secret-123";
```

Prefer environment/secret management.

```js
process.env.JWT_SECRET
```

---

# 43. Interview Questions and Answers

## Beginner Level

### Q1. What is authentication?

**Answer:**

Authentication is the process of verifying the identity of a user or service. It answers the question, "Who are you?"

---

### Q2. What is authorization?

**Answer:**

Authorization determines what an authenticated user is allowed to access or perform. It answers, "What can you do?"

---

### Q3. Difference between authentication and authorization?

**Answer:**

Authentication verifies identity, while authorization checks permissions.

Example:

```text
Login → Authentication
Delete user → Authorization
```

---

### Q4. Why is HTTP stateless?

**Answer:**

HTTP does not automatically maintain application-level memory between requests. Each request is handled independently, so applications use mechanisms such as sessions or tokens to maintain authentication state.

---

### Q5. Why should passwords not be stored in plaintext?

**Answer:**

If the database is compromised, plaintext passwords are immediately exposed. Passwords should instead be stored using a dedicated password-hashing algorithm such as Argon2, bcrypt, or scrypt.

---

### Q6. What is password hashing?

**Answer:**

Password hashing transforms a password into a derived value that is stored instead of the original password. During login, the entered password is verified against the stored hash.

---

### Q7. What is a session?

**Answer:**

A session is server-side state associated with a session identifier. The browser usually sends that session identifier in a cookie, allowing the server to identify the logged-in user.

---

### Q8. What is a cookie?

**Answer:**

A cookie is browser-managed data that can be stored and automatically sent with matching HTTP requests.

---

### Q9. What is JWT?

**Answer:**

JWT is a compact token format containing claims and a signature. A backend can verify the signature and use the validated claims.

---

### Q10. What are the three parts of JWT?

**Answer:**

```text
Header
Payload
Signature
```

---

### Q11. Is JWT encrypted?

**Answer:**

A normal signed JWT is not encrypted. It is encoded and signed. Therefore sensitive secrets should not be placed in its payload.

---

### Q12. What is RBAC?

**Answer:**

RBAC stands for Role-Based Access Control. It assigns permissions to roles and then assigns users to those roles.

Example:

```text
Admin → CREATE + READ + UPDATE + DELETE
User  → READ
```

---

### Q13. What is 401?

**Answer:**

401 usually indicates that authentication is missing or invalid.

Examples:

- No token
- Invalid token
- Expired token

---

### Q14. What is 403?

**Answer:**

403 means the user is authenticated but is not allowed to perform the requested action.

---

### Q15. What is API key authentication?

**Answer:**

API key authentication uses a secret credential to identify or authenticate an application or service calling an API.

---

# 44. Intermediate Interview Questions

### Q16. Session vs JWT?

**Answer:**

A session stores authentication state on the server, while a JWT commonly carries signed claims in the token itself. Sessions make server-side invalidation straightforward. JWTs can simplify distributed verification but require additional design for immediate revocation.

---

### Q17. Why use Redis for sessions?

**Answer:**

Redis provides fast shared storage, which is useful when multiple backend instances need access to the same session state.

---

### Q18. What is HttpOnly?

**Answer:**

HttpOnly prevents client-side JavaScript from directly reading a cookie. It can reduce the impact of some XSS token-theft scenarios.

---

### Q19. What is the Secure cookie flag?

**Answer:**

Secure tells the browser to send the cookie only over HTTPS.

---

### Q20. What is SameSite?

**Answer:**

SameSite controls when cookies are sent in cross-site requests. It is an important part of a CSRF defense strategy.

---

### Q21. What is OAuth 2.0?

**Answer:**

OAuth 2.0 is an authorization framework that allows an application to obtain delegated access to protected resources without receiving the user's password.

---

### Q22. Why is OAuth useful?

**Answer:**

OAuth allows limited delegated access. The user can grant an application specific permissions without sharing the original account password.

---

### Q23. What are the four OAuth roles?

**Answer:**

1. Resource Owner
2. Client
3. Authorization Server
4. Resource Server

---

### Q24. What is a scope in OAuth?

**Answer:**

A scope defines what access the client is requesting, such as read-only access to a particular resource.

---

### Q25. OAuth vs OIDC?

**Answer:**

OAuth focuses on delegated authorization, while OIDC adds authentication and user identity on top of OAuth 2.0.

```text
OAuth → Access
OIDC → Identity
```

---

### Q26. What is PKCE?

**Answer:**

PKCE is a security extension for OAuth Authorization Code Flow that protects the exchange against certain authorization-code interception attacks.

---

### Q27. What is a refresh token?

**Answer:**

A refresh token is used to obtain a new access token without requiring the user to log in again.

---

### Q28. Why use short-lived access tokens?

**Answer:**

A shorter lifetime limits the period during which a stolen access token can be used.

---

### Q29. Why is JWT revocation difficult?

**Answer:**

A self-contained JWT can remain cryptographically valid until it expires. Immediate revocation therefore needs additional mechanisms such as a denylist, short token lifetimes, refresh-token rotation, or server-side session/reference-token designs.

---

### Q30. What is least privilege?

**Answer:**

Least privilege means giving a user, application, or service only the permissions it actually needs.

---

# 45. Advanced Interview Questions

### Q31. How would you design authentication for a production web app?

**Answer:**

I would choose the mechanism based on the application architecture. A secure cookie-based session can be a good fit for many traditional web applications. Distributed API architectures may use short-lived access tokens with a secure refresh strategy.

In either case I would include:

```text
HTTPS
+
Password hashing
+
Secure credentials storage
+
Rate limiting
+
Authorization checks
+
Resource ownership checks
+
Secure cookies/tokens
+
MFA where appropriate
+
Monitoring
```

---

### Q32. Why can a stolen JWT be dangerous?

**Answer:**

If an attacker obtains a valid access token, they may be able to impersonate the user until the token expires or is otherwise invalidated.

---

### Q33. How can you reduce the risk of stolen access tokens?

**Answer:**

Use:

- HTTPS
- Short-lived access tokens
- Secure token handling
- Refresh-token rotation where appropriate
- Revocation mechanisms where needed
- Monitoring
- Avoiding exposure through XSS

---

### Q34. What happens if the user's role changes but the old JWT still says admin?

**Answer:**

If authorization is based solely on a self-contained claim, the old token may continue to contain the old role until expiry or invalidation. This is why systems that require immediate role changes may use shorter token lifetimes, server-side permission checks, or another revocation strategy.

---

### Q35. Why should backend authorization not trust the frontend?

**Answer:**

The frontend is controlled by the client and can be modified. Security decisions must be enforced on the backend.

---

### Q36. What is resource-level authorization?

**Answer:**

It checks whether the current user is allowed to access a specific resource, not merely whether the user is logged in or has a broad role.

Example:

```text
GET /orders/123
```

Backend checks whether order 123 belongs to the user or whether the user has permission to access it.

---

### Q37. What is IDOR/BOLA?

**Answer:**

It is a broken object-level authorization problem where changing an object identifier lets a user access another user's resource without proper authorization checks.

---

### Q38. What is CSRF?

**Answer:**

CSRF is an attack where a malicious site causes a user's browser to send an unwanted authenticated request to another site.

---

### Q39. What is XSS?

**Answer:**

XSS occurs when attacker-controlled script is executed in the application's browser context.

---

### Q40. CSRF vs XSS?

**Answer:**

```text
XSS  → Attacker executes malicious script
CSRF → Attacker causes an unwanted authenticated request
```

---

### Q41. What is a timing attack?

**Answer:**

A timing attack uses differences in execution time to infer information about internal processing. Authentication systems should avoid obvious timing differences between different failure conditions and use established password verification functions.

---

### Q42. How would you secure a login endpoint?

**Answer:**

I would use:

- HTTPS
- Password hashing
- Rate limiting
- Generic failure messages
- MFA where appropriate
- Monitoring
- Secure session/token handling
- Input validation
- Protection against credential stuffing

---

### Q43. Why are generic login errors important?

**Answer:**

They reduce account enumeration by preventing the attacker from learning whether a username/email exists based on different error messages.

---

### Q44. What is credential stuffing?

**Answer:**

Credential stuffing uses username/password combinations leaked from other services to attempt logins on another service.

Protection includes:

- MFA
- Rate limiting
- Login monitoring
- Detection of suspicious patterns
- Strong credential policies

---

### Q45. What is the difference between authentication and authorization middleware?

**Answer:**

Authentication middleware establishes the identity of the requester.

Authorization middleware checks whether that identified requester has the required permission.

```text
Authentication → Identify user
Authorization  → Check permission
```

---

# 46. Scenario-Based Interview Questions

## Scenario 1: User accesses admin route

Request:

```http
GET /admin/dashboard
```

User is logged in but role is `user`.

### Answer

First authenticate the user.

Then authorization checks the role.

Because the user is authenticated but lacks admin permission:

```text
403 Forbidden
```

---

## Scenario 2: No token

Request:

```http
GET /api/profile
```

No authentication credential is provided.

### Answer

The backend cannot establish the user's identity.

Return:

```text
401 Unauthorized
```

---

## Scenario 3: Expired JWT

A client sends an expired access token.

### Answer

Token verification should fail.

Return an authentication error, typically:

```text
401 Unauthorized
```

If the system uses refresh tokens, the client may attempt to obtain a new access token through the refresh flow.

---

## Scenario 4: Stolen JWT

An attacker steals a valid JWT.

### Answer

The attacker may be able to impersonate the user until the token expires or is invalidated.

Possible controls:

- Short access-token lifetime
- HTTPS
- Secure storage/handling
- Refresh-token rotation
- Revocation mechanisms
- Monitoring

---

## Scenario 5: Two users have same password

Should they have the same password hash?

### Answer

With proper salted password hashing, their stored hashes should normally be different even if the passwords are identical.

---

## Scenario 6: User changes `/orders/101` to `/orders/102`

They can view another user's order.

### Answer

The backend has insufficient resource-level authorization.

It checked that the user was authenticated but failed to verify ownership or permission for the specific order.

---

## Scenario 7: Different login errors

Response A:

```text
Email does not exist
```

Response B:

```text
Wrong password
```

### Answer

This can enable account enumeration.

Better:

```text
Invalid email or password
```

---

## Scenario 8: Login endpoint has no rate limiting

### Answer

An attacker may automate many password guesses.

Add:

```text
Rate Limiting
+
Monitoring
+
MFA where appropriate
```

---

## Scenario 9: Frontend sends `role=admin`

### Answer

Never trust a role supplied by the client.

The backend must verify authorization from trusted server-side state or validated token claims.

---

## Scenario 10: User is authenticated but requests another user's private resource

### Answer

Authentication alone is not enough.

The backend must perform a resource-level authorization check.

```text
Authenticated?
     ↓
Has permission?
     ↓
Owns resource?
     ↓
Allow / Deny
```

---

# 47. Rapid Revision Sheet

```text
Authentication
→ Who are you?

Authorization
→ What can you do?

Password
→ Never store plaintext.

Password hashing
→ Use Argon2, bcrypt, scrypt.

Session
→ Server stores authentication state.

Cookie
→ Browser-managed data sent with requests.

HttpOnly
→ JavaScript cannot directly read the cookie.

Secure
→ Cookie sent only over HTTPS.

SameSite
→ Controls cross-site cookie behavior.

JWT
→ Signed token containing claims.

JWT parts
→ Header + Payload + Signature.

JWT encrypted?
→ Normally no.

Access Token
→ Used to access APIs.

Refresh Token
→ Used to obtain a new access token.

API Key
→ Application/service credential.

OAuth
→ Delegated authorization.

OIDC
→ Authentication/identity over OAuth.

PKCE
→ Protects authorization-code exchange.

RBAC
→ Role → Permissions.

401
→ Authentication missing/invalid.

403
→ Authenticated but forbidden.

CSRF
→ Unwanted authenticated request.

XSS
→ Attacker-controlled script execution.

Timing Attack
→ Uses timing differences to infer information.

Rate Limiting
→ Limit number of requests.

MFA
→ Multiple authentication factors.

Least Privilege
→ Give only required permissions.

IDOR/BOLA
→ Broken object-level authorization.
```

---

# 48. 2-Minute Interview Explanation

If an interviewer says:

> "Explain authentication and authorization."

Use this structure:

> Authentication is the process of verifying the identity of a user or service. Authorization happens after authentication and determines what that user is allowed to do.
>
> For example, during login, the backend verifies the user's password against a securely stored password hash. After successful authentication, the application can use a server-side session or a token such as a JWT to maintain authentication across requests.
>
> For protected routes, authentication middleware verifies the user's authentication state and identifies the user. Then authorization middleware checks roles, permissions, and sometimes resource ownership. For example, an admin may delete users, while a normal user may only read their own profile.
>
> For security, I would use HTTPS, password hashing such as Argon2 or bcrypt, secure cookies or token handling, rate limiting, MFA where appropriate, generic authentication errors, least privilege, and resource-level authorization checks.

---

# 49. How to Answer Session vs JWT in an Interview

A simple answer:

> A session stores authentication state on the server, usually referenced by a session ID stored in a cookie. JWT-based authentication commonly places signed claims inside the token, allowing basic verification without server-side session lookup. Sessions make revocation straightforward, while JWTs can be convenient for distributed APIs but need additional design for immediate revocation.

---

# 50. How to Answer OAuth vs OIDC

A simple answer:

> OAuth 2.0 is primarily an authorization framework for delegated access. OIDC builds an authentication and identity layer on top of OAuth 2.0. A simple way to remember it is OAuth answers "What can the application access?" while OIDC answers "Who is the user?"

---

# 51. How to Answer 401 vs 403

A simple answer:

> 401 means the request does not have valid authentication, such as a missing or invalid token. 403 means the user is authenticated but does not have permission to perform the requested action.

Memory:

```text
401 → Who are you?
403 → I know you, but you cannot do this.
```

---

# 52. How to Answer "How Would You Secure Authentication?"

Use this checklist:

```text
1. HTTPS
2. Secure password hashing
3. Strong secret/key management
4. Secure cookies/tokens
5. Rate limiting
6. Generic login errors
7. MFA where appropriate
8. Short-lived access tokens where appropriate
9. Refresh-token protection
10. Backend authorization
11. Resource ownership checks
12. Least privilege
13. Monitoring
14. Revocation strategy
```

---

# 53. Final Mental Model

```text
                         AUTH
                           |
              ┌────────────┴────────────┐
              |                         |
      Authentication              Authorization
              |                         |
           "WHO?"                    "WHAT?"
              |                         |
      ┌───────┼────────┐          ┌────┴────┐
      ↓       ↓        ↓          ↓         ↓
   Session   JWT      OIDC       RBAC    Permissions
      |       |        |          |
      └───────┴────────┘          |
              |                   |
         User Identity       Access Check
              |                   |
              └─────────┬─────────┘
                        ↓
                   Allow / Deny
                        |
                    Controller
                        |
                     Service
                        |
                    Database
```

---

# 54. The 10 Things to Memorize First

1. **Authentication = Who are you?**
2. **Authorization = What can you do?**
3. **Never store plaintext passwords.**
4. **Use password-specific hashing such as Argon2/bcrypt.**
5. **Session = server-side authentication state.**
6. **JWT = signed token containing claims.**
7. **OAuth = delegated authorization.**
8. **OIDC = authentication/identity over OAuth.**
9. **RBAC = roles mapped to permissions.**
10. **401 = authentication problem, 403 = authorization problem.**

---

# 55. Final Interview Memory Map

```text
Login
  ↓
Authentication
  ↓
Verify Password / Identity
  ↓
Session or Token
  ↓
Future Request
  ↓
Authentication Middleware
  ↓
Identify User
  ↓
Authorization Middleware
  ↓
Role / Permission
  ↓
Resource Ownership
  ↓
Allow / Deny
  ↓
Controller
  ↓
Service
  ↓
Database
```

## One-Line Summary

```text
Authentication proves who you are.
Authorization decides what you are allowed to do.
```
