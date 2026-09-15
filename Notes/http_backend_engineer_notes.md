# Detailed Notes on 5. Understanding HTTP for Backend Engineers

## 1. Core Principles of HTTP

**HTTP (Hypertext Transfer Protocol)** is an application-layer protocol
(Layer 7 in the OSI model) used by clients and servers to communicate.

It is built on two fundamental ideas:

### Statelessness

-   The server retains no memory of past interactions.
-   Every request is self-contained.
-   Each request must include the necessary information, such as
    authentication tokens or cookies.
-   **Benefits:**
    -   Simplifies server architecture.
    -   Improves scalability.
    -   A server does not need to maintain user state.
    -   A server crash does not destroy the client's state.

### Client-Server Model

-   Communication is initiated by the **client**.
-   The client, such as a web browser, sends a request.
-   The server receives the request, processes it, and sends a response.
-   The server waits for requests from clients.

------------------------------------------------------------------------

## 2. Transport Protocol & HTTP Versions

HTTP relies on a transport protocol. Traditionally, this has been **TCP
(Transmission Control Protocol)**.

HTTP has evolved over time to improve connection handling and
performance.

### HTTP/1.0

-   Usually opened a new TCP connection for every request and response.
-   This caused extra connection overhead.
-   It was inefficient for modern websites.

### HTTP/1.1

-   Introduced **persistent connections (keep-alive)** as the default.
-   Multiple requests could reuse the same TCP connection.
-   This reduced connection overhead and improved performance.

### HTTP/2

Introduced several major improvements:

-   **Multiplexing:** Multiple requests and responses can travel
    concurrently over one connection.
-   **Binary framing:** Data is transferred using a binary framing layer
    instead of HTTP/1.x's textual message format.
-   **Header compression:** Reduces the size of repeated headers.
-   **Server Push:** Allowed servers to proactively send resources,
    although this feature is now deprecated/removed in many
    implementations.

### HTTP/3

-   Uses **QUIC** instead of TCP.
-   QUIC is built over **UDP**.
-   Provides faster connection establishment.
-   Handles packet loss more efficiently.
-   Avoids TCP-level head-of-line blocking between independent streams.

### Easy Revision

``` text
HTTP/1.0 → New connection for requests
HTTP/1.1 → Persistent connections
HTTP/2   → Multiplexing + binary framing + header compression
HTTP/3   → QUIC over UDP
```

------------------------------------------------------------------------

## 3. Anatomy of HTTP Messages

HTTP communication happens through structured messages.

### Request Message

A request goes from:

``` text
Client → Server
```

A request contains:

-   Request method, such as `GET` or `POST`
-   Request target / URL
-   HTTP version
-   Headers
-   Blank line
-   Optional request body

Example:

``` http
POST /users HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "Kartikey"
}
```

### Response Message

A response goes from:

``` text
Server → Client
```

A response contains:

-   HTTP version
-   Status code, such as `200`
-   Reason phrase, such as `OK`
-   Headers
-   Blank line
-   Response body

Example:

``` http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Success"
}
```

------------------------------------------------------------------------

## 4. HTTP Headers

**Headers are key-value pairs containing metadata about an HTTP request
or response.**

They provide extra information that helps control how the request or
response should be handled.

### Request Headers

Sent by the client to provide information about the request.

Examples:

-   `User-Agent` → Identifies the client/browser.
-   `Authorization` → Sends authentication credentials or tokens.
-   `Accept` → Tells the server which response format the client
    prefers.

### General Headers

Can apply to requests and responses.

Examples:

-   `Date`
-   `Connection`
-   `Cache-Control`

### Representation Headers

Describe the representation/body being transferred.

Examples:

-   `Content-Type` → Describes the data format, such as JSON or HTML.
-   `Content-Length` → Describes the size of the content in bytes.
-   `Content-Encoding` → Describes compression, such as gzip.

### Security Headers

Help protect applications from attacks.

Examples:

-   `Strict-Transport-Security` → Forces browsers to use HTTPS.
-   `Content-Security-Policy` → Controls which resources a page can load
    and helps reduce XSS risk.
-   `Set-Cookie` → Instructs the browser to store a cookie; cookie
    attributes such as `HttpOnly` can prevent JavaScript from reading
    it.

### Easy Revision

``` text
Headers = Extra information / metadata

Request Headers   → Client → Server
Response Headers  → Server → Client
```

------------------------------------------------------------------------

## 5. HTTP Methods and Idempotency

HTTP methods describe the **intent** of a request.

### GET

-   Used to fetch/read data.
-   Should not modify the resource.

``` http
GET /users
```

### POST

-   Used to submit data.
-   Commonly used to create a new resource.
-   Usually contains a request body.

``` http
POST /users
```

### PUT

-   Completely replaces an existing resource with the provided
    representation.

``` http
PUT /users/1
```

### PATCH

-   Partially updates an existing resource.

``` http
PATCH /users/1
```

### DELETE

-   Removes a resource.

``` http
DELETE /users/1
```

### OPTIONS

-   Asks what operations or communication options are supported.
-   Commonly used by browsers for **CORS preflight requests**.

``` http
OPTIONS /users
```

------------------------------------------------------------------------

## Idempotency

**Idempotent means repeating the same request produces the same final
server state as making it once.**

### Idempotent Methods

Common examples:

-   `GET`
-   `PUT`
-   `DELETE`

Example:

``` text
PUT name = Kartikey

1 request  → name = Kartikey
10 requests → name = Kartikey
```

The final state is the same.

### Non-Idempotent Method

`POST` is generally non-idempotent.

Example:

``` text
POST /orders
```

Sending it multiple times may create multiple orders:

``` text
1 request  → Order 1
2 requests → Order 1 + Order 2
```

### Important Note

`PATCH` can be **idempotent or non-idempotent**, depending on the
operation.

### Easy Revision

``` text
Idempotent     → Same final state after repeating
Non-idempotent → Repeating can change the final state
```

------------------------------------------------------------------------

## 6. Cross-Origin Resource Sharing (CORS)

**CORS = Cross-Origin Resource Sharing**

CORS is a **browser security mechanism** that controls whether a web
page can access resources from a different origin.

### Same-Origin Policy

Browsers enforce the **Same-Origin Policy**, which restricts web pages
from freely accessing resources from another origin.

An origin is made of:

``` text
Protocol + Domain + Port
```

For example:

``` text
http://localhost:3000
http://localhost:5000
```

These are different origins because the ports are different.

### Simple Requests

For a simple cross-origin request:

-   The browser automatically sends an `Origin` header.
-   The server can allow the origin using:

``` http
Access-Control-Allow-Origin: http://localhost:3000
```

-   If the required CORS permission is missing, the browser prevents the
    web page from reading the response.

### Preflight Requests

Some cross-origin requests require a **preflight request**.

Preflight is an `OPTIONS` request sent before the actual request.

It can be triggered by things such as:

-   Certain non-simple methods, such as `PUT`, `PATCH`, or `DELETE`.
-   Certain request headers, such as `Authorization`.
-   Certain content types, such as `application/json`.

Flow:

``` text
Browser
   |
   | OPTIONS /users
   | "Can I send this request?"
   ↓
Server
   |
   | CORS response headers
   ↓
Browser
   |
   | Actual request
   ↓
Server
```

The server can specify:

``` http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

If the preflight succeeds, the browser sends the actual request.

### Easy Revision

``` text
CORS       → Controls cross-origin browser requests
OPTIONS    → Commonly used for CORS preflight
Preflight  → Browser asks permission before actual request
```

------------------------------------------------------------------------

## 7. Standardized Status Codes

HTTP status codes are three-digit numbers that tell the client the
result of a request.

### 1xx - Informational

The request is being processed or more information is needed.

Example:

-   `100 Continue` → Client can continue sending the request body.

### 2xx - Success

The request was successful.

-   `200 OK` → Request succeeded.
-   `201 Created` → A resource was successfully created.
-   `204 No Content` → Request succeeded, but there is no response body.

### 3xx - Redirection

The client needs to use another location or can use cached information.

-   `301 Moved Permanently` → Resource has permanently moved.
-   `302 Found` → Temporary redirect.
-   `304 Not Modified` → Cached version can be used.

### 4xx - Client Errors

There is a problem with the request or the client's permissions.

-   `400 Bad Request` → Invalid request/data.
-   `401 Unauthorized` → Authentication is missing or invalid.
-   `403 Forbidden` → Client is authenticated but does not have
    permission.
-   `404 Not Found` → Resource was not found.
-   `405 Method Not Allowed` → HTTP method is not allowed for the
    resource.
-   `409 Conflict` → Request conflicts with the current state, such as a
    duplicate username.
-   `429 Too Many Requests` → Rate limit has been exceeded.

### 5xx - Server Errors

The server or an upstream service failed to process the request.

-   `500 Internal Server Error` → Unexpected server-side error.
-   `501 Not Implemented` → Server does not support the requested
    functionality.
-   `502 Bad Gateway` → Gateway/proxy received an invalid response from
    an upstream server.
-   `503 Service Unavailable` → Server is temporarily unavailable.
-   `504 Gateway Timeout` → Gateway/proxy did not receive a response
    from the upstream server in time.

### Easy Revision

``` text
1xx → Information
2xx → Success
3xx → Redirection
4xx → Client Error
5xx → Server Error
```

------------------------------------------------------------------------

## 8. HTTP Caching

**Caching = Reusing a previously downloaded response instead of
downloading it again.**

Benefits:

-   Faster response time.
-   Less bandwidth usage.
-   Less server load.

### Common Cache Headers

#### Cache-Control

Controls caching behavior.

``` http
Cache-Control: max-age=3600
```

Means the response can be considered fresh for 3600 seconds.

#### ETag

A value that identifies a particular version of a representation.

``` http
ETag: "abc123"
```

#### Last-Modified

Tells when the resource was last modified.

``` http
Last-Modified: Tue, 15 Sep 2026 10:00:00 GMT
```

### Conditional Requests

The browser can later send:

``` http
If-None-Match: "abc123"
```

or:

``` http
If-Modified-Since: Tue, 15 Sep 2026 10:00:00 GMT
```

If the resource has not changed:

``` http
304 Not Modified
```

The browser uses its cached copy.

If the resource has changed:

``` http
200 OK
```

The server sends the new representation.

### Easy Revision

``` text
Cache-Control → How long/how to cache
ETag          → Which version?
Last-Modified → When was it changed?
304           → Nothing changed, use cache
```

------------------------------------------------------------------------

## 9. Content Negotiation and Compression

**Content negotiation** allows the client and server to agree on the
best representation of a resource.

### Important Request Headers

#### Accept

Tells the server which response format the client prefers.

``` http
Accept: application/json
```

#### Accept-Language

Tells the server the preferred language.

``` http
Accept-Language: en
```

#### Accept-Encoding

Tells the server which compression formats the client supports.

``` http
Accept-Encoding: gzip
```

### Compression

The server can compress a response before sending it.

Example:

``` text
Large JSON
   ↓
gzip compression
   ↓
Smaller response
   ↓
Less network bandwidth
```

Compression is especially useful for large text-based responses such as
JSON, HTML, CSS, and JavaScript.

### Easy Revision

``` text
Accept          → What format do I want?
Accept-Language → What language do I want?
Accept-Encoding → What compression can I handle?
```

------------------------------------------------------------------------

## 10. Handling Large Data Transfers

### Large Client Uploads

For uploading files such as images and videos, clients commonly use:

``` text
multipart/form-data
```

Example:

``` http
Content-Type: multipart/form-data; boundary=----XYZ
```

The **boundary** separates different parts of the multipart request.

A multipart request can contain:

-   Text fields
-   Files
-   Multiple files

### Large Server Downloads

Large files can be sent using **streaming** so the client receives data
progressively instead of waiting for the entire file.

For some streaming use cases, servers can use:

``` http
Content-Type: text/event-stream
```

However, `text/event-stream` is specifically for **Server-Sent Events
(SSE)**, not a general-purpose file-download mechanism.

For ordinary large file downloads, HTTP response streaming and
mechanisms such as `Content-Length`, `Transfer-Encoding`, or **Range
requests** may be used.

### Easy Revision

``` text
File Upload   → multipart/form-data
Large Response → Stream data in chunks
SSE           → text/event-stream
```

------------------------------------------------------------------------

## 11. Security (SSL/TLS & HTTPS)

### TLS

**TLS = Transport Layer Security**

-   Modern protocol used to secure network communication.
-   Encrypts data in transit.
-   Helps prevent eavesdropping and tampering.
-   Uses digital certificates to help verify the server's identity.

### SSL

**SSL is the older predecessor to TLS.**

Modern systems should use TLS rather than obsolete SSL versions.

### HTTPS

**HTTPS = HTTP over TLS**

In simple terms:

``` text
HTTP
  +
TLS security
  =
HTTPS
```

HTTPS provides:

-   **Encryption** → Others cannot easily read the data in transit.
-   **Integrity** → Helps detect tampering.
-   **Authentication** → Certificates help verify the server's identity.

### Easy Revision

``` text
TLS       → Secures the connection
HTTPS     → HTTP running over TLS
Certificate → Helps verify server identity
```

------------------------------------------------------------------------

# Final HTTP Revision Sheet

``` text
HTTP
│
├── Stateless
│   └── Every request contains required information
│
├── Client-Server
│   └── Client requests, server responds
│
├── Versions
│   ├── HTTP/1.0 → New connection commonly per request
│   ├── HTTP/1.1 → Persistent connections
│   ├── HTTP/2   → Multiplexing + binary framing
│   └── HTTP/3   → QUIC over UDP
│
├── Methods
│   ├── GET    → Read
│   ├── POST   → Create/submit
│   ├── PUT    → Replace
│   ├── PATCH  → Partial update
│   ├── DELETE → Delete
│   └── OPTIONS → Ask capabilities / CORS preflight
│
├── Status Codes
│   ├── 1xx → Information
│   ├── 2xx → Success
│   ├── 3xx → Redirection
│   ├── 4xx → Client error
│   └── 5xx → Server error
│
├── CORS
│   └── Controls cross-origin browser requests
│
├── Caching
│   ├── Cache-Control
│   ├── ETag
│   ├── Last-Modified
│   └── 304 Not Modified
│
├── Negotiation
│   ├── Accept
│   ├── Accept-Language
│   └── Accept-Encoding
│
└── Security
    ├── TLS
    └── HTTPS
```
