# Polynexus Content Management Backend - Architecture & Specsheet

This document summarizes the dynamic content models used throughout the Polynexus frontend application. It serves as a blueprint for backend engineers to design database tables, schemas, and REST/GraphQL APIs to power a content management panel.

---

## 1. Content Types & Data Models

### 1.1. Service Model (`Services.tsx`)
This model represents the core architecture modules displayed in the **Our Core Services** grid section and their detailed specs in the pop-up modal.

*   **Endpoint**: `/api/services`
*   **Database Table / Collection**: `services`

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `String` (ID) | URL-safe slug or primary key (e.g. `design`, `governance`) | Required, Unique |
| `icon` | `String` | Reference identifier for Lucide react icon (e.g. `Zap`, `Database`, `Shield`, `Layers`) | Required |
| `title` | `String` | Display title of the service module | Required, Max 100 chars |
| `shortDesc` | `Text` | Short description displayed directly in the grid card | Required, Max 250 chars |
| `fullDesc` | `Text` | In-depth description shown inside the engineering modal specsheet | Required |
| `features` | `Array[String]` | List of key integration pillars / bullet points in the modal | Minimum 1 feature |
| `specs` | `Object` (JSON) | Key-value pairs representing engineering benchmark specs (e.g. `{"Speed": "100% Core Performance"}`) | Required |

#### JSON Schema Example
```json
{
  "id": "design",
  "icon": "Zap",
  "title": "Adaptive Design Systems",
  "shortDesc": "Architecting flexible, component-based user interfaces that evolve with your business logic and brand identity.",
  "fullDesc": "Build unified component ecosystems, flexible UI architecture, and automated design token deployment pipelines that scale across mobile, web, and enterprise surfaces seamlessly.",
  "features": [
    "Automated component assembly pipelines",
    "Adaptive styling token generation",
    "Comprehensive cross-platform layout APIs"
  ],
  "specs": {
    "Framework": "React / Tailwind v4",
    "Speed": "100% Core Performance",
    "Accessibility": "WCAG AA Compliant"
  }
}
```

---

### 1.2. Project Model (`Projects.tsx` & `Hero.tsx`)
Represents the portfolio implementations showcased in the **Proof of Performance** grid as well as the interactive browser mockups featured in the **Hero** section viewport.

*   **Endpoint**: `/api/projects`
*   **Database Table / Collection**: `projects`

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `title` | `String` | Project title (e.g. `Cognitive Query API`) | Required, Max 100 chars |
| `category` | `Enum` (String) | Project taxonomy filter: `'ai'`, `'devtools'`, or `'infra'` | Required |
| `desc` | `Text` | Detailed description of the business/technical solution | Required |
| `metric` | `String` | High-impact metric value (e.g. `0.15ms`, `100%`, `48Tbps`) | Required |
| `metricLabel` | `String` | Label explaining the metric value (e.g. `Vector Resolution`) | Required |
| `icon` | `String` | Lucide icon reference name (e.g. `Cpu`, `Database`, `Globe`, `FolderGit`) | Required |
| `tech` | `Array[String]` | Array of technologies used (e.g. `["Rust", "gRPC", "Linux Kernel"]`) | Required |
| `image` | `String` (URL) | URL path to the dashboard mockup screenshot image | Required, Valid URL |
| `file` | `String` | Shell file label shown in the Hero mockup header (e.g. `cognitive-query-api.sh`) | Required for Hero projects |

#### JSON Schema Example
```json
{
  "title": "Cognitive Query API",
  "category": "ai",
  "desc": "Re-routing standard query sequences into vectorized semantic indexing structures at the edge.",
  "metric": "0.15ms",
  "metricLabel": "Vector Resolution",
  "icon": "Cpu",
  "tech": ["WebAssembly", "Rust", "OpenAI API"],
  "image": "https://cdn.polynexus.com/assets/cognitive_query.png",
  "file": "cognitive-query-api.sh"
}
```

---

### 1.3. Testimonial Model (`Testimonials.tsx`)
Represents customer trust reviews displayed in the slideshow carousel.

*   **Endpoint**: `/api/testimonials`
*   **Database Table / Collection**: `testimonials`

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `name` | `String` | Reviewer's full name | Required |
| `role` | `String` | Job title (e.g. `VP of Platform Engineering`) | Required |
| `company` | `String` | Company name (e.g. `NovusAI`) | Required |
| `content` | `Text` | Testimonial narrative content text | Required, Max 500 chars |
| `rating` | `Integer` | Numerical rating score (typically `5`) | Required, range 1-5 |
| `avatar` | `String` (URL) | Reviewer's profile photo URL | Required, Valid URL |

---

### 1.4. FAQ Model (`FAQ.tsx`)
Represents the frequently asked questions accordion items.

*   **Endpoint**: `/api/faqs`
*   **Database Table / Collection**: `faqs`

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `question` | `String` | Frequently asked question string | Required |
| `answer` | `Text` | Detailed markdown/text answer block | Required |

---

### 1.5. Blog Post Model (`Blog.tsx`)
Represents articles and reports listed in the **Polynexus Journal** search grid.

*   **Endpoint**: `/api/blog/posts`
*   **Database Table / Collection**: `blog_posts`

| Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- |
| `title` | `String` | Article headline | Required, Unique |
| `category` | `String` | Category label (e.g. `Engineering`, `Data Science`, `Research`) | Required |
| `date` | `String` / `Date` | Publication date formatted string | Required |
| `readTime` | `String` | Estimated reading duration (e.g. `6 min read`) | Required |
| `summary` | `Text` | Brief text abstract shown on the grid card | Required, Max 300 chars |
| `imageUrl` | `String` (URL) | Post teaser header image URL | Required, Valid URL |

---

### 1.6. System Contact Info Model (`ContactForm.tsx`)
Represents global contact details displayed in the contact panel. Instead of a database table, this is typically stored in a unified `settings` table as dynamic system configurations.

*   **Endpoint**: `/api/settings/contact`
*   **Database Table / Collection**: `settings`

| Field | Type | Current Value |
| :--- | :--- | :--- |
| `email` | `String` | `info@polynexus.com` |
| `phone` | `String` | `+91 9226318818` |
| `address` | `String` | `Nagpur, Maharashtra` |
| `est_response` | `String` | `EST RESPONSE TIME: < 15 MINUTES` |

---

## 2. API Endpoints Blueprint

To enable full admin control over this content, the backend should expose standard REST CRUD (Create, Read, Update, Delete) routes with authentication validation layers (JWT) for admin dashboard access.

### Public Client Routes (Read-Only)
*   `GET /api/services` - Fetches all core architecture services.
*   `GET /api/projects` - Fetches all projects (all categories).
*   `GET /api/testimonials` - Fetches all client testimonials.
*   `GET /api/faqs` - Fetches the FAQ checklist.
*   `GET /api/blog/posts` - Fetches blog posts (supports `?search=` filter query).
*   `GET /api/settings/contact` - Fetches the global coordinates.

### Admin Content Operations (Protected - Requires Auth Header)
*   `POST /api/:content_type` - Creates a new item (e.g. `projects`, `blog/posts`).
*   `PUT /api/:content_type/:id` - Updates an existing record attributes.
*   `DELETE /api/:content_type/:id` - Deletes a record by identifier.
*   `POST /api/settings/contact` - Updates global system coordinates details.
