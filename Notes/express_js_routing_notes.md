# Routing in Express.js

## 1. What is Routing?

Routing is the process of deciding **which server-side code should handle a particular request**.

A route connects:

**HTTP Method + URL Path → Route Handler**

### Example

```js
app.get("/users", (req, res) => {
    res.json(["User 1", "User 2"]);
});
```

When the client sends:

```text
GET /users
```

Express finds the matching route and executes its handler.

### Simple Understanding

* **HTTP Method** = What do we want to do?
* **URL Path** = Where do we want to do it?
* **Handler** = What code should execute?

### Memory Trick

> **Method = WHAT**
> **Path = WHERE**
> **Handler = HOW**

---

# 2. HTTP Methods Used in Routing

HTTP methods tell the server what operation the client wants to perform.

| Method | Purpose               |
| ------ | --------------------- |
| GET    | Read / fetch data     |
| POST   | Create new data       |
| PUT    | Update existing data  |
| PATCH  | Partially update data |
| DELETE | Delete data           |

### Example

```js
app.get("/users", getUsers);

app.post("/users", createUser);

app.put("/users/:id", updateUser);

app.patch("/users/:id", updateUserPartially);

app.delete("/users/:id", deleteUser);
```

Notice that these can have the same path but different methods:

```text
GET  /users
POST /users
```

They are different routes because the HTTP methods are different.

---

# 3. Static Routes

A **static route** has a fixed URL path.

The path does not contain any variable value.

### Example

```text
/api/books
```

This path always remains the same.

### Express Example

```js
app.get("/api/books", (req, res) => {
    res.json({
        message: "All books"
    });
});
```

### Other Examples

```text
/users
/products
/api/books
/api/login
/api/orders
```

All of these are static routes.

### Why are they called Static?

Because the URL path is **fixed** and does not change.

### Memory Trick

> **Static Route = Fixed Path**

---

# 4. Dynamic Routes

A **dynamic route** contains a variable value inside the URL path.

Dynamic routes are useful when we want to work with a **specific resource**.

### Example

```text
/api/users/123
```

Here:

```text
/api/users/ → Fixed
123         → Dynamic
```

Instead of creating separate routes:

```text
/users/1
/users/2
/users/3
/users/4
```

we can create one dynamic route:

```text
/users/:id
```

### Express Example

```js
app.get("/api/users/:id", (req, res) => {

    const id = req.params.id;

    res.json({
        userId: id
    });

});
```

If the request is:

```text
GET /api/users/123
```

Then:

```js
req.params.id
```

contains:

```text
123
```

If the request is:

```text
GET /api/users/500
```

Then:

```js
req.params.id
```

contains:

```text
500
```

### General Syntax

```text
/resource/:parameter
```

Examples:

```text
/users/:id
/products/:productId
/orders/:orderId
```

### Memory Trick

> **Dynamic Route = Variable value inside the URL path**

---

# 5. Path Parameters

A **path parameter** is a dynamic value present inside the URL path.

It is generally used to identify a **specific resource**.

### Example

```text
/api/users/123
```

Here:

```text
123 = User ID
```

Route:

```text
/api/users/:id
```

Access it using:

```js
req.params.id
```

### Example

```js
app.get("/api/users/:id", (req, res) => {

    const id = req.params.id;

    res.json({
        userId: id
    });

});
```

Request:

```text
GET /api/users/123
```

Response:

```json
{
    "userId": "123"
}
```

### Multiple Path Parameters

A route can contain multiple parameters.

```text
/api/users/:userId/posts/:postId
```

Example request:

```text
/api/users/123/posts/456
```

Access:

```js
req.params.userId
req.params.postId
```

Values:

```text
userId = 123
postId = 456
```

### Remember

> `req.params` is used to access **path parameters**.

---

# 6. Query Parameters

**Query parameters** are used to send additional information to the server.

They are commonly used for:

* Searching
* Filtering
* Sorting
* Pagination
* Optional settings

Query parameters are written after the `?`.

### Example

```text
/api/books?page=2
```

Here:

```text
page = 2
```

is a query parameter.

---

# 7. Multiple Query Parameters

Multiple query parameters are separated using `&`.

### Example

```text
/api/books?page=2&limit=10&sort=price
```

Here:

```text
page  = 2
limit = 10
sort  = price
```

### Express Example

```js
app.get("/api/books", (req, res) => {

    console.log(req.query);

});
```

For this request:

```text
/api/books?page=2&limit=10
```

`req.query` will contain:

```js
{
    page: "2",
    limit: "10"
}
```

Individual values can be accessed using:

```js
req.query.page
req.query.limit
```

---

# 8. Uses of Query Parameters

## 8.1 Pagination

Pagination means dividing a large amount of data into smaller pages.

Example:

```text
/api/books?page=2
```

Means:

> Give me page 2 of the books.

Another example:

```text
/api/books?page=2&limit=10
```

Means:

> Give me 10 books from page 2.

---

## 8.2 Filtering

Example:

```text
/api/products?category=mobile
```

Means:

> Give me products from the mobile category.

---

## 8.3 Sorting

Example:

```text
/api/products?sort=price
```

Means:

> Sort the products according to price.

---

## 8.4 Searching

Example:

```text
/api/search?query=javascript
```

Means:

> Search for "javascript".

---

# 9. Path Parameters vs Query Parameters

This is an important interview topic.

## Path Parameter

Used to identify **which specific resource** we want.

Example:

```text
/api/users/123
```

Here:

```text
123 = User ID
```

Access using:

```js
req.params.id
```

---

## Query Parameter

Used to provide **additional information or options**.

Example:

```text
/api/users?page=2&limit=10
```

Access using:

```js
req.query.page
req.query.limit
```

### Comparison

| Path Parameter                          | Query Parameter             |
| --------------------------------------- | --------------------------- |
| Part of URL path                        | Comes after `?`             |
| Usually identifies a resource           | Provides additional options |
| `/users/123`                            | `/users?page=2`             |
| `req.params`                            | `req.query`                 |
| Usually important for resource identity | Usually optional            |

### Easy Memory Trick

> **Path = Which resource?**

> **Query = How do you want the data?**

### Example

```text
/users/123?page=2
```

Here:

```text
123     → Path Parameter
page=2  → Query Parameter
```

---

# 10. Nested Routes

A **nested route** is a route where one resource is related to another resource.

For example:

> A user can have many posts.

We can represent this relationship using:

```text
/api/users/123/posts/456
```

Breakdown:

```text
/api       → Static
/users     → Static
/123       → User ID
/posts     → Static
/456       → Post ID
```

The route can be written as:

```text
/api/users/:userId/posts/:postId
```

### Meaning

```text
/api/users/123/posts/456
```

means:

> Post 456 belonging to User 123.

### Express Example

```js
app.get(
    "/api/users/:userId/posts/:postId",
    (req, res) => {

        const userId = req.params.userId;
        const postId = req.params.postId;

        res.json({
            userId,
            postId
        });

    }
);
```

Request:

```text
GET /api/users/123/posts/456
```

Parameters:

```text
userId = 123
postId = 456
```

### Why Use Nested Routes?

Nested routes make relationships between resources clear.

Example:

```text
/users/123/posts
```

means:

> Posts belonging to user 123.

### Memory Trick

> **Nested Route = Related resources inside one URL**

---

# 11. API Versioning

**API versioning** is the practice of maintaining different versions of an API.

It is useful when we make changes to an API that could break existing clients.

### Example

```text
/api/v1/products
/api/v2/products
```

Here:

```text
v1 → Version 1
v2 → Version 2
```

Existing applications can continue using `v1`, while new applications can use `v2`.

---

# 12. Why is API Versioning Needed?

Suppose an old API returns:

```json
{
    "name": "Laptop"
}
```

Later, we change the field:

```json
{
    "productName": "Laptop"
}
```

Applications using the old field `name` may stop working.

Instead of changing the old API directly, we can create a new version.

```text
/api/v1/products
/api/v2/products
```

Now:

```text
v1 → Old response format
v2 → New response format
```

This allows existing clients to continue working.

### Memory Trick

> **API Versioning = Manage API changes without suddenly breaking old clients.**

---

# 13. API Versioning Flow

A typical flow can look like:

```text
v1
 ↓
New changes are required
 ↓
Create v2
 ↓
Clients migrate to v2
 ↓
v1 becomes deprecated
 ↓
v1 may eventually be removed
```

---

# 14. Deprecation

**Deprecation** means an old API is still available, but developers are advised to stop using it and move to a newer version.

Example:

```text
/api/v1/users
```

may become deprecated after:

```text
/api/v2/users
```

is introduced.

### Important

Deprecated does not always mean deleted.

It usually means:

> The old API still works, but developers should migrate to the newer API.

### Memory Trick

> **Deprecated = Still available, but should be replaced.**

---

# 15. Catch-All Routes

A **catch-all route** is a fallback route.

It handles a request when **no other route matches**.

Suppose our server has:

```text
GET /users
GET /products
GET /orders
```

But the client requests:

```text
GET /abc
```

If `/abc` does not exist, we can return:

```text
404 Route Not Found
```

### Express Example

A common Express fallback pattern is:

```js
app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});
```

### Important

The fallback handler should generally be placed **after all the actual routes**.

Example:

```js
app.get("/users", getUsers);

app.get("/products", getProducts);

app.post("/users", createUser);

// Fallback route
app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});
```

If no previous route matches, the fallback handler runs.

### Memory Trick

> **Catch-All = Last fallback for unknown routes**

---

# 16. Important Express Request Properties

Express provides useful properties through the `req` object.

There are three very important ones:

```text
req.params
req.query
req.body
```

---

## 16.1 req.params

Used for **path parameters**.

URL:

```text
/users/123
```

Route:

```text
/users/:id
```

Access:

```js
req.params.id
```

Value:

```text
123
```

---

## 16.2 req.query

Used for **query parameters**.

URL:

```text
/users?page=2
```

Access:

```js
req.query.page
```

Value:

```text
2
```

---

## 16.3 req.body

Used for data sent inside the **request body**.

Example:

```json
{
    "name": "Kartikey",
    "email": "kartikey@example.com"
}
```

Access:

```js
req.body.name
req.body.email
```

---

# 17. Params vs Query vs Body

| Type            | Example                  | Express      |
| --------------- | ------------------------ | ------------ |
| Path Parameter  | `/users/123`             | `req.params` |
| Query Parameter | `/users?page=2`          | `req.query`  |
| Request Body    | `{ "name": "Kartikey" }` | `req.body`   |

### Easy Memory Trick

```text
PARAMS → WHO / WHICH
QUERY  → HOW
BODY   → DATA
```

---

# 18. Complete Example

Suppose we have:

```text
POST /api/users/123?notify=true
```

Request body:

```json
{
    "name": "Kartikey",
    "email": "kartikey@example.com"
}
```

We have:

### Path Parameter

```text
123
```

Access:

```js
req.params.id
```

---

### Query Parameter

```text
notify=true
```

Access:

```js
req.query.notify
```

---

### Request Body

```json
{
    "name": "Kartikey",
    "email": "kartikey@example.com"
}
```

Access:

```js
req.body.name
req.body.email
```

So:

```text
123           → req.params
notify=true   → req.query
name/email    → req.body
```

---

# 19. Complete Routing Example

Imagine we are creating a Book API.

## Get All Books

```text
GET /api/books
```

This is a **static route**.

---

## Create a Book

```text
POST /api/books
```

This is also a **static route**.

---

## Get One Book

```text
GET /api/books/123
```

Dynamic route:

```text
/api/books/:id
```

Parameter:

```text
id = 123
```

---

## Get Books with Pagination

```text
GET /api/books?page=2&limit=10
```

Query parameters:

```text
page = 2
limit = 10
```

---

## Get a Specific User's Book

```text
GET /api/users/123/books/456
```

Nested route:

```text
/api/users/:userId/books/:bookId
```

Parameters:

```text
userId = 123
bookId = 456
```

---

## API Version 2

```text
GET /api/v2/books
```

Versioned route.

---

## Unknown Route

```text
GET /api/anything
```

If it doesn't exist:

```text
404 Route Not Found
```

---

# 20. How to Read an API URL

Whenever you see an API URL, break it into parts.

Example:

```text
GET /api/users/123/posts/456?page=2&limit=10
```

### Step 1: HTTP Method

```text
GET
```

Means:

> Fetch data.

---

### Step 2: Static Parts

```text
/api
/users
/posts
```

These are fixed parts.

---

### Step 3: Path Parameters

```text
123
456
```

They represent:

```text
userId = 123
postId = 456
```

---

### Step 4: Query Parameters

```text
?page=2&limit=10
```

They represent:

```text
page = 2
limit = 10
```

---

### Complete Breakdown

```text
GET
 ↓
HTTP Method

/api/users
 ↓
Static Path

/123
 ↓
Path Parameter

/posts
 ↓
Static Path

/456
 ↓
Path Parameter

?page=2&limit=10
 ↓
Query Parameters
```

In Express:

```js
req.params.userId
req.params.postId

req.query.page
req.query.limit
```

---

# 21. Static vs Dynamic Route

### Static

```text
/api/users
```

Fixed path.

### Dynamic

```text
/api/users/:id
```

Variable path.

Example:

```text
/api/users/123
/api/users/456
/api/users/789
```

All can be handled by:

```text
/api/users/:id
```

### Memory Trick

> Static = Same

> Dynamic = Changes

---

# 22. Path Parameter vs Query Parameter

### Path

```text
/users/123
```

Question:

> Which user?

Answer:

```text
123
```

So it is a **path parameter**.

---

### Query

```text
/users?page=2
```

Question:

> How should I get the users?

Answer:

```text
page=2
```

So it is a **query parameter**.

### Memory Trick

> **Path = Which resource?**

> **Query = Extra options?**

---

# 23. Nested Route Example

Consider:

```text
/api/users/10/posts/50/comments/5
```

Breakdown:

```text
/api       → Static
/users     → Static
10         → userId
/posts     → Static
50         → postId
/comments  → Static
5          → commentId
```

Route:

```text
/api/users/:userId/posts/:postId/comments/:commentId
```

This represents:

> Comment 5 of Post 50 belonging to User 10.

Nested routes can be useful when the relationship between resources is important.

---

# 24. Important Terms

## Route

A rule that maps a request to a handler.

```text
GET /users → handler
```

---

## Route Handler

The function that executes when a route matches.

```js
(req, res) => {
    res.json(...);
}
```

---

## Static Route

A route with a fixed path.

```text
/users
```

---

## Dynamic Route

A route containing variable values.

```text
/users/:id
```

---

## Path Parameter

The variable value inside the URL path.

```text
/users/123
```

`123` is the path parameter.

---

## Query Parameter

Additional key-value information after `?`.

```text
/users?page=2
```

---

## Nested Route

A route representing relationships between resources.

```text
/users/123/posts/456
```

---

## API Versioning

Using versions such as:

```text
/v1
/v2
```

to manage API changes.

---

## Deprecation

An old API is still available but should be replaced by a newer API.

---

## Catch-All Route

A fallback route for requests that don't match other routes.

```text
404 Route Not Found
```

---

# 25. Interview Questions and Short Answers

## Q1. What is routing?

Routing is the process of mapping an HTTP method and URL path to a specific server-side handler.

---

## Q2. What is a static route?

A static route has a fixed URL path.

Example:

```text
GET /users
```

---

## Q3. What is a dynamic route?

A dynamic route contains variable values in its URL path.

Example:

```text
GET /users/:id
```

---

## Q4. What is a path parameter?

A path parameter is a dynamic value inside the URL path used to identify a resource.

Example:

```text
/users/123
```

Access:

```js
req.params.id
```

---

## Q5. What is a query parameter?

A query parameter is additional information sent after `?`, commonly used for filtering, sorting, searching, and pagination.

Example:

```text
/users?page=2
```

Access:

```js
req.query.page
```

---

## Q6. What is the difference between `req.params` and `req.query`?

```text
req.params → Path parameters
req.query  → Query parameters
```

Example:

```text
/users/123?page=2
```

```text
123    → req.params
page=2 → req.query
```

---

## Q7. What is a nested route?

A nested route represents a relationship between resources.

Example:

```text
/users/123/posts/456
```

It represents Post 456 belonging to User 123.

---

## Q8. Why is API versioning used?

API versioning allows us to introduce changes without immediately breaking clients using the old API.

Example:

```text
/api/v1/users
/api/v2/users
```

---

## Q9. What is API deprecation?

Deprecation means an old API is still available but developers are advised to migrate to a newer API.

---

## Q10. What is a catch-all route?

A catch-all route is a fallback handler for requests that do not match any defined route.

It commonly returns:

```text
404 Route Not Found
```

---

# 26. Quick Revision Sheet

```text
ROUTING
Method + Path → Handler


STATIC ROUTE
Fixed path

Example:
GET /users


DYNAMIC ROUTE
Variable path

Example:
GET /users/:id


PATH PARAMETER
Identifies a resource

Example:
/users/123

Access:
req.params.id


QUERY PARAMETER
Extra information

Example:
/users?page=2

Access:
req.query.page


NESTED ROUTE
Related resources

Example:
/users/:userId/posts/:postId


API VERSIONING
Manage API changes

Example:
/api/v1/users
/api/v2/users


DEPRECATION
Old API still available,
but should be replaced.


CATCH-ALL
Fallback for unknown routes

Example:
404 Route Not Found
```

---

# 27. Most Important Things to Memorize

## Routing

```text
HTTP Method + URL Path → Handler
```

---

## Params

```text
/users/:id
```

```js
req.params.id
```

**Used to identify a resource.**

---

## Query

```text
/users?page=2
```

```js
req.query.page
```

**Used for filtering, sorting, searching, pagination, etc.**

---

## Body

```json
{
    "name": "Kartikey"
}
```

```js
req.body.name
```

**Used to send request data.**

---

## Final Memory Trick

```text
PARAMS → WHICH resource?
QUERY  → HOW to get it?
BODY   → WHAT data to send?
```

Example:

```text
POST /users/123?notify=true
```

Body:

```json
{
    "name": "Kartikey"
}
```

Therefore:

```text
123           → req.params
notify=true   → req.query
name=Kartikey → req.body
```

---

# 28. Final One-Minute Revision

```text
Routing
↓
Method + Path → Handler

Static
↓
Fixed URL

Dynamic
↓
Variable URL value

Path Parameter
↓
Resource identification
↓
req.params

Query Parameter
↓
Filtering / Sorting / Pagination / Search
↓
req.query

Nested Route
↓
Relationship between resources

Versioning
↓
v1 / v2
↓
Manage API changes

Deprecation
↓
Old API should be replaced

Catch-All
↓
Unknown route
↓
404
```

# 29. Golden Rule

> **Path parameters identify the resource, query parameters customize the request, and the request body carries data.**