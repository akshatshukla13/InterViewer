# Judge0 Code Executor (Node.js)

A simple Node.js backend to compile and execute code using the [Judge0 API](https://judge0.com/).

---

## Features

- Serve a static homepage (`index.html`)
- Accept code and language via API
- Execute code remotely using Judge0
- Supports multiple languages via `language_id` mapping
- Organized routing using `express.Router`

---

## 🔧 Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API Key

Create a `.env` file in the project root:

```env
RAPID_API_KEY_JUDGE0=your_rapidapi_key_here
```

---

## 🚀 Usage

### Start the server

```bash
node your-server-file.js
```

The router handles:
- `GET /` → Serves the homepage
- `GET /api` → Redirects to homepage (`/`)
- `POST /api` → Accepts code and language, sends to Judge0, and returns result

---

## 📥 POST /api

### Request Body

```json
{
  "code": "print('Hello')",
  "language": "python"
}
```

### Language Mapping

| Language   | ID |
| ---------- | -- |
| javascript | 63 |
| python     | 71 |
| java       | 62 |
| cpp        | 54 |
| c          | 50 |
| ruby       | 72 |
| go         | 60 |
| php        | 68 |
| swift      | 83 |
| kotlin     | 78 |

### Response

```json
{
  "output": "Hello\n"
}

// OR, in case of error:
{
  "error": "Unsupported language"
}
```

---

## 🛠 Functions Breakdown

### `getHomePage(req, res)`
Serves the `index.html` page from `public/` directory.

### `executeCode(req, res)`
- Maps language to Judge0 ID
- Sends code to Judge0
- Returns execution output

---

## ❗ Notes

- Uses `dotenv` to load API keys
- Uses `node-fetch` for HTTP requests
- Uses `express.Router` to organize routes cleanly
- `index.html` should be placed inside the `public/` directory

---

## License

MIT or your preferred license.

