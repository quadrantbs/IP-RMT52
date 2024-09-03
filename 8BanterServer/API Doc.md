# API Documentation

## **User Endpoints**

### 1. **Register User**

- **Endpoint**: `POST /users/register`
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "string" // Optional
  }
  ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "id": "string",
      "username": "string",
      "email": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Validation error message"
    }
    ```

### 2. **Login User**

- **Endpoint**: `POST /users/login`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "token": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Email and password are required"
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "error": "Invalid email/password"
    }
    ```

### 3. **Get All Users**

- **Endpoint**: `GET /users`
- **Headers**:
  - **Authorization**: `Bearer <token>`
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "username": "string",
        "email": "string"
      }
    ]
    ```
  - **403 Forbidden**:
    ```json
    {
      "error": "Access denied"
    }
    ```

## **Meme Endpoints**

### 1. **Get All Memes**

- **Endpoint**: `GET /memes`
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "title": "string",
        "imageUrl": "string",
        "tags": "array of tags",
        "userId": "string"
      }
    ]
    ```

### 2. **Get Meme By ID**

- **Endpoint**: `GET /memes/:id`
- **Parameters**:
  - **id**: Meme ID
- **Responses**:
  - **200 OK**:
    ```json
    {
      "id": "string",
      "title": "string",
      "imageUrl": "string",
      "tags": "array of tags",
      "userId": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Meme not found"
    }
    ```

### 3. **Get Memes By Tag**

- **Endpoint**: `GET /memes/tag/:tag`
- **Parameters**:
  - **tag**: Tag name
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "title": "string",
        "imageUrl": "string",
        "tags": "array of tags",
        "userId": "string"
      }
    ]
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Tag not found"
    }
    ```

### 4. **Create Meme**

- **Endpoint**: `POST /memes`
- **Request Body**:
  ```json
  {
    "title": "string",
    "imageUrl": "string",
    "tags": "array of tags",
    "userId": "string"
  }
  ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "id": "string",
      "title": "string",
      "imageUrl": "string",
      "tags": "array of tags",
      "userId": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Validation error message"
    }
    ```

### 5. **Update Meme**

- **Endpoint**: `PUT /memes/:id`
- **Parameters**:
  - **id**: Meme ID
- **Request Body**:
  ```json
  {
    "title": "string",
    "imageUrl": "string",
    "tags": "array of tags"
  }
  ```
- **Responses**:
  - **200 OK**:
    ```json
    {
      "id": "string",
      "title": "string",
      "imageUrl": "string",
      "tags": "array of tags",
      "userId": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Meme not found"
    }
    ```

### 6. **Delete Meme**

- **Endpoint**: `DELETE /memes/:id`
- **Parameters**:
  - **id**: Meme ID
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Meme deleted successfully"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Meme not found"
    }
    ```

## **Comment Endpoints**

### 1. **Add Comment**

- **Endpoint**: `POST /memes/:id/comments`
- **Parameters**:
  - **id**: Meme ID
- **Request Body**:
  ```json
  {
    "text": "string"
  }
  ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "id": "string",
      "text": "string",
      "memeId": "string",
      "userId": "string"
    }
    ```
  - **400 Bad Request**:
    ```json
    {
      "error": "Comment cannot be empty"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Meme not found"
    }
    ```

### 2. **Get Comments By Meme ID**

- **Endpoint**: `GET /memes/:id/comments`
- **Parameters**:
  - **id**: Meme ID
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "text": "string",
        "memeId": "string",
        "userId": "string",
        "User": {
          "id": "string",
          "username": "string"
        }
      }
    ]
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "No comments found for this meme"
    }
    ```

### 3. **Delete Comment**

- **Endpoint**: `DELETE /memes/:id/comments/:commentId`
- **Parameters**:
  - **id**: Meme ID
  - **commentId**: Comment ID
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Comment deleted successfully"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Comment not found"
    }
    ```

## **Like Endpoints**

### 1. **Add Like**

- **Endpoint**: `POST /memes/:id/likes`
- **Parameters**:
  - **id**: Meme ID
- **Responses**:
  - **201 Created**:
    ```json
    {
      "id": "string",
      "memeId": "string",
      "userId": "string"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Meme not found"
    }
    ```
  - **409 Conflict**:
    ```json
    {
      "error": "You already liked this meme"
    }
    ```

### 2. **Remove Like**

- **Endpoint**: `DELETE /memes/:id/likes`
- **Parameters**:
  - **id**: Meme ID
- **Responses**:
  - **200 OK**:
    ```json
    {
      "message": "Like removed successfully"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "error": "Like not found"
    }
    ```

## **Tag Endpoints**

### 1. **Get All Tags**

- **Endpoint**: `GET /tags`
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string"
      },
      ...
    ]
    ```

### 2. **Create Tag**

- **Endpoint**: `POST /tags`
- **Request Body**:
  ```json
  {
    "name": "string"
  }
  ```
- **Responses**:
  - **201 Created**:
    ```json
    {
      "id": "string",
      "name": "string"
    }
    ```

## **Template Endpoints**

### 1. **Get Meme Templates**
- **Endpoint**: `GET /templates`
- **Responses**:
  - **200 OK**:
    ```json
    [
      {
        "id": "string",
        "name": "string",
        "example": "string",
        "url": "string"
      },
      ...
    ]
    ```

## **Global Error Handling**

### Common Error Responses:

- **400 Bad Request**:
  ```json
  {
    "error": "Validation error messages"
  }
  ```
- **401 Unauthorized**:
  ```json
  {
    "error": "Unauthorized access"
  }
  ```
- **403 Forbidden**:
  ```json
  {
    "error": "Access denied"
  }
  ```
- **404 Not Found**:
  ```json
  {
    "error": "Resource not found"
  }
  ```
- **500 Internal Server Error**:
  ```json
  {
    "error": "An unexpected error occurred"
  }
  ```
