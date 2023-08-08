# Test Technique API Documentation

## Installation instructions

### Prerequisites

Before you begin, make sure you have the following software installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Clone the Repository

Open your terminal and run the following command to clone the repository to your local machine:

```bash
git clone https://github.com/vinaigre1/apitest.git
```

### Install dependencies

Navigate to the cloned repository and install the project dependencies using npm:

```bash
cd apitest
npm install
```

### Run the API

You can now run the API using the following command:

```bash
npm start
```

## Base URL

```
http:/localhost:3000/
```

## Authentication

The API allows you to authenticate as a user and access different resources. (e.g. Some products are visible only when connected, while others are not visible.)

To authenticate, you must provide an access token in the request headers:

```
Authorization: Bearer <access_token>
```

The access token can be requested by using the `POST /token` route.

## Endpoints

## Products

Returns a list of products.

- **Endpoint:** `GET /products`
- **Parameters:**
  - `category` (optional): The ID of the category of products.
  - `limit` (optional): The number of rows returned.
  - `from` (optional): How many rows to skip in the result. Requires `limit` to be set.
  - `sort` (optional): The column used for sorting. Can sort by `id`, `label`, `description`, `price`, `category_id`. Defaults to `id`.
  - `asc` (optional): Sorts by descending order if `false` or `0`, otherwise sorts by ascending order.
- **Response data example:**

```json
[
  {
    "id": 2,
    "label": "2 x Titre Unitaire",
    "description": "Pack aller-retour.\nTitres permettant de voyager sur l'ensemble du réseau.\nCorrespondances illimitées dans l'heure suivant la première validation.",
    "price": 250,
    "category_id": 1,
    "thumbnail_url": "https://picsum.photos/256/256"
  }
]
```

### Categories

Returns a list of categories.

- **Endpoint:** `GET /categories`
- **Parameters:**
  - `limit` (optional): The number of rows returned.
  - `from` (optional): How many rows to skip in the result. Requires `limit` to be set.
  - `sort` (optional): The column used for sorting. Can sort by `id`, `index`, `label`, `description`. Defaults to `id`.
  - `asc` (optional): Sorts by descending order if `false` or `0`, otherwise sorts by ascending order.
- **Response data example:**

```json
[
  {
    "id": 1,
    "index": 1,
    "label": "Titres Unitaires",
    "description": "Correspondances illimitées dans l'heure suivant la première validation."
  }
]
```

### Cart

Authentication required

Returns the cart of the authenticated user.

- **Endpoint:** `GET /cart`
- **Response data example:**

```json
[
  {
    "id": 4,
    "product_id": 4,
    "quantity": 3
  }
]
```

### Add to Cart

Authentication required

Adds a product to the cart of the authenticated user.

Updates the quantity if the product is already present in the cart, or removes it if the new quantity is 0.

- **Endpoint:** `POST /cart/add`
- **Parameters:**
  - `limit` (optional): The number of rows returned.
  - `from` (optional): How many rows to skip in the result. Requires `limit` to be set.
  - `sort` (optional): The column used for sorting. Can sort by `id`, `index`, `label`, `description`. Defaults to `id`.
  - `asc` (optional): Sorts by descending order if `false` or `0`, otherwise sorts by ascending order.

### JSON Web Token

- **Endpoint:** `POST /token`
- **Parameters:**
  - `email` (required): The email of the user you want to authenticate.
  - `password` (required): The plain text password of the user you want to authenticate.
- **Response data example:**

```json
{
  "token": "thisisasamplejwttoken"
}
```

## Request and Response Formats

For GET requests, the parameters must be in the query.

For POST requests, send data in JSON format in the request body. You will need to add the `Content-type` header as follows:

```
Content-type: application/json
```

All responses will be in JSON format with the following structure:

```json
{
  "success": true, // false if an error appears
  "data": {}, // The data format depends on the requested route
  "errors": [], // Array of strings
  "warnings": [] // Array of strings
}
```

### Example Request using curl

```bash
curl
  -X POST
  -d "{\"product\":4,\"quantity\":3}"
  -H "Content-type: application/json"
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6IlZpbmNlbnQiLCJlbWFpbCI6InZpbmNlbnRAYWlyd2ViLmZyIiwiaWF0IjoxNjkxNDI0MjEzfQ.FWKtlOOdOZau8xGVmCfyGVUIQ8aBnWDD56_l_sMSzN4" http://localhost:3000/cart/add
```

### Example Response

```json
{
  "data": null,
  "success": true,
  "warnings": [],
  "errors": []
}
```

## Error and Warning Handling

In case of errors or warnings, the API will add a message in the `errors` or `warnings` property and return an appropriate status code.

### Example Error Response

```json
{
  "success": false,
  "data": null,
  "warnings": [],
  "errors": ["Invalid user"]
}
```
