# Educational AI Chatbot - Student Interface

# Educational AI Chatbot - Student Interface

## Configuration

The chatbot connects to the Express API server to fetch Supabase credentials.

### Development (Local)

The default `config.js` is set for local development:
```javascript
API_URL: 'http://localhost:3000'
```

Just run the Express API server locally and it works!

### Production (Deployed)

When deploying, update `config.js` with your deployed API URL:

1. Deploy Express API server first (Heroku, Railway, Render, etc.)
2. Get the API URL (e.g., `https://your-api.herokuapp.com`)
3. Edit `config.js`:
   ```javascript
   API_URL: 'https://your-api.herokuapp.com'  // ← Change this!
   ```
4. Deploy the chatbot

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Student Login Flow

### How It Works

1. **Student clicks "Login to Save Progress"**
2. **Enters UUID** provided by teacher
3. **Enters PIN/OTP** (if required by configuration)
4. **Gets Supabase config** from secure Express server
5. **Config saved to localStorage** for auto-login next time
6. **Connected!** Progress is now saved to Supabase

### Auto-Login

- Once logged in, config is saved in browser localStorage
- Next visit: Automatically connects without asking for UUID/PIN
- Click "Logout" to disconnect and clear saved config

### Security

- Students never see Firestore data directly
- All config fetching goes through Express server
- Server validates UUID + PIN before returning config
- Each configuration can have different access types:
  - **No PIN**: Public access
  - **Fixed PIN**: Requires 6-digit PIN
  - **OTP**: One-time password (expires after use)

## For Teachers

Teachers create configurations at: `http://localhost:8080`

Each configuration gets a unique UUID that students use to login.

## Files

- `index.html` - Main chatbot interface
- `auth-ui.js` - Login modal and UUID/PIN flow
- `supabase-client.js` - Supabase connection manager
- `auth-helper.js` - Login button UI updates
- `main.js` - Main chatbot logic

## API Endpoint

**POST** `http://localhost:3000/api/config/get`

Request:
```json
{
  "uuid": "config-uuid-here",
  "pin": "123456"  // optional, depends on access type
}
```

Response:
```json
{
  "success": true,
  "config": {
    "url": "https://xxx.supabase.co",
    "anonKey": "eyJhbGc...",
    "projectId": "xxx"
  },
  "name": "Class 10A - 2024"
}
```
