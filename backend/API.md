# HostelHub REST API Specification

**Base URL:** `http://localhost:5000/api/v1` (or deployed URL)  
**Authentication Scheme:** Bearer JWT Token via `Authorization: Bearer <access_token>`

---

## 1. System Health

### `GET /health`
Returns system status, service health, and server uptime.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "HostelHub API is running",
  "data": {
    "status": "UP",
    "uptime": 124.52,
    "timestamp": "2026-08-22T14:40:00.000Z",
    "service": "HostelHub API",
    "version": "1.0.0"
  }
}
```

---

## 2. Authentication (`/auth`)

### `POST /auth/register`
Register a new student account and create public profile.

**Request Body:**
```json
{
  "email": "kartik@hostel4.edu",
  "password": "SecretPassword123!",
  "full_name": "Kartik Sharma",
  "branch": "Computer Science",
  "year": 2,
  "hostel": "Hostel 4",
  "room_number": "B-204"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "c1f7a4e2-...",
      "auth_user_id": "9b1deb4d-...",
      "email": "kartik@hostel4.edu",
      "full_name": "Kartik Sharma",
      "role": "STUDENT"
    },
    "session": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "...",
      "expires_in": 3600
    }
  }
}
```

### `POST /auth/login`
Authenticate with email and password.

**Request Body:**
```json
{
  "email": "kartik@hostel4.edu",
  "password": "SecretPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "c1f7a4e2-...",
      "email": "kartik@hostel4.edu",
      "full_name": "Kartik Sharma",
      "role": "STUDENT",
      "avatar_url": null
    },
    "session": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "..."
    }
  }
}
```

### `GET /auth/me` *(Auth Required)*
Get current authenticated user profile.

---

## 3. User & Profiles (`/users`)

### `GET /users/me` *(Auth Required)*
Get full profile of the logged-in student including total uploads and study stats.

### `PATCH /users/me` *(Auth Required)*
Update student profile information (bio, room number, branch, avatar).

### `GET /users/me/uploads` *(Auth Required)*
Get paginated list of resources uploaded by the logged-in student.
*Query params:* `?page=1&limit=20`

### `GET /users/me/bookmarks` *(Auth Required)*
Get paginated list of bookmarked materials for quick access.
*Query params:* `?page=1&limit=20`

---

## 4. Resources (`/resources`)

### `GET /resources`
Browse study materials with multi-criteria filtering and sorting.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |
| `subject` | string | - | Subject code filter (e.g. `COA`, `DSA`) |
| `unit` | number | - | Unit number (1 to 10) |
| `type` | string | - | `NOTES`, `PYQ`, `IMPORTANT_QUESTIONS`, `VIDEO`, `IMAGE`, `OTHER` |
| `sort` | string | `latest` | `latest`, `popular`, `downloads`, `views` |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Resources retrieved",
  "data": [
    {
      "id": "e4b2d184-...",
      "title": "COA Unit 2 Complete Notes",
      "description": "Instruction cycle and addressing modes.",
      "unit": 2,
      "resource_type": "NOTES",
      "file_name": "coa_unit2.pdf",
      "file_size": 2516582,
      "mime_type": "application/pdf",
      "file_url": "https://.../resources/pdf/...",
      "download_count": 124,
      "view_count": 290,
      "subject": { "id": "...", "name": "Computer Organization", "code": "COA" },
      "uploaded_by_profile": { "id": "...", "full_name": "Rahul K.", "avatar_url": null },
      "tags": ["CT1", "Unit2", "Important"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### `GET /resources/search`
Full-text search across resource titles, descriptions, and subject codes.
*Query params:* `?q=coa+pipelining&subject=COA&unit=2&page=1`

### `POST /resources` *(Auth Required)*
Create database metadata record for an uploaded file.

**Request Body:**
```json
{
  "title": "Data Structures PYQ 2023 Solved",
  "description": "Solved midterm questions with step-by-step tree traversal diagrams.",
  "subject_id": "f5a892b1-...",
  "unit": 3,
  "resource_type": "PYQ",
  "file_name": "dsa_pyq_2023.pdf",
  "file_path": "resources/pdf/dsa_pyq_2023.pdf",
  "file_url": "https://.../storage/...",
  "file_size": 1845120,
  "mime_type": "application/pdf",
  "tags": ["DSA", "PYQ", "Trees"]
}
```

### `GET /resources/:id`
Get single resource details and increment view count.

### `PATCH /resources/:id` *(Auth Required: Owner or Admin)*
Update resource title, description, or tags.

### `DELETE /resources/:id` *(Auth Required: Owner, Moderator, or Admin)*
Delete resource database record and delete file from Supabase storage.

### `GET /resources/:id/download`
Generate a temporary signed download URL and increment the download counter.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Download authorization granted",
  "data": {
    "downloadUrl": "https://.../storage/v1/object/sign/...?token=...",
    "fileName": "dsa_pyq_2023.pdf",
    "fileSize": 1845120,
    "mimeType": "application/pdf"
  }
}
```

### `POST /resources/:id/bookmark` *(Auth Required)*
Save resource to student's bookmarks.

### `DELETE /resources/:id/bookmark` *(Auth Required)*
Remove resource from student's bookmarks.

---

## 5. Uploads & Storage (`/uploads`)

### `POST /uploads/signed-url` *(Auth Required)*
Generate a Supabase Storage signed upload URL to upload large files directly from the client.

**Request Body:**
```json
{
  "fileName": "unit2_cheatsheet.pdf",
  "fileType": "application/pdf",
  "fileSize": 2048500,
  "category": "pdf"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Upload authorization generated",
  "data": {
    "signedUrl": "https://.../storage/v1/object/upload/sign/...",
    "token": "...",
    "path": "resources/pdf/9a2b...-unit2_cheatsheet.pdf",
    "fileUrl": "https://.../resources/pdf/9a2b...-unit2_cheatsheet.pdf",
    "category": "pdf"
  }
}
```

### `POST /uploads/direct` *(Auth Required)*
Upload a file via multipart form-data (`file` field) directly through the Express server.

---

## 6. Comments & Discussions (`/comments` & `/resources/:id/comments`)

### `GET /resources/:id/comments`
List comments and questions on a study resource.

### `POST /resources/:id/comments` *(Auth Required)*
Post a question or comment on a resource.

### `PATCH /comments/:id` *(Auth Required: Owner or Admin)*
Edit comment content.

### `DELETE /comments/:id` *(Auth Required: Owner, Moderator, or Admin)*
Delete comment.

---

## 7. Class Tests & CT Zone (`/cts`)

### `GET /cts/upcoming`
Get all upcoming CTs with countdown days left (`days_left`, `time_left_label`, `is_urgent`).

### `GET /cts/:id/resources`
Get preparation materials (Notes, PYQs, Videos, Important Questions) grouped specifically for this CT.

### `POST /cts` *(Auth Required: Moderator or Admin)*
Create a new Class Test schedule entry.

---

## 8. Announcements (`/announcements`)

### `GET /announcements`
List published official hostel announcements.

### `POST /announcements` *(Auth Required: Moderator or Admin)*
Broadcast an official announcement (`NORMAL`, `IMPORTANT`, `URGENT`).

---

## 9. Unified Dashboard (`/dashboard`)

### `GET /dashboard`
Single roundtrip query returning homepage sections:
- `upcomingCTs`: Array of upcoming exams with countdowns
- `latestResources`: Recent uploads with tags and authors
- `popularResources`: Top downloaded materials
- `announcements`: Active broadcasts
- `stats`: Total resources, downloads, and users count
