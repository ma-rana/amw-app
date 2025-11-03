import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GraphQLClient, gql } from 'graphql-request';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Amplify configuration from the frontend config
const amplifyConfigPath = path.resolve(__dirname, '../src/amplifyconfiguration.json');
let amplifyConfig = {};
try {
  const raw = fs.readFileSync(amplifyConfigPath, 'utf-8');
  amplifyConfig = JSON.parse(raw);
} catch (err) {
  console.error('Failed to read amplifyconfiguration.json:', err.message);
}

const GRAPHQL_META = amplifyConfig.API?.GraphQL || {};
const PRIMARY_URL = GRAPHQL_META.endpoint;
const SECONDARY_URL = amplifyConfig.aws_appsync_graphqlEndpoint;
const APPSYNC_URL = PRIMARY_URL || SECONDARY_URL;
let APPSYNC_API_KEY = (GRAPHQL_META.additionalAuthModes || [])
  .find(m => m.authMode === 'API_KEY')?.apiKey || amplifyConfig.aws_appsync_apiKey; // Server-side only
const REGION = amplifyConfig.aws_appsync_region || GRAPHQL_META.region || amplifyConfig.aws_project_region || 'ap-southeast-2';

if (!APPSYNC_URL) {
  console.warn('Missing AppSync URL. Check amplifyconfiguration.json.');
}

// Create a GraphQL client for each request, supporting Cognito JWT or API key
const getClientForUrl = (url, req) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return new GraphQLClient(url, {
      headers: {
        Authorization: auth.replace(/^Bearer\s+/i, ''),
      },
    });
  }
  return new GraphQLClient(url, {
    headers: {
      ...(APPSYNC_API_KEY ? { 'x-api-key': APPSYNC_API_KEY } : {}),
    },
  });
};

const requestWithFallback = async (query, variables, req) => {
  const urls = [PRIMARY_URL, SECONDARY_URL].filter(Boolean);
  let lastErr;
  for (const url of urls) {
    try {
      const data = await getClientForUrl(url, req).request(query, variables);
      return data;
    } catch (err) {
      lastErr = err;
      // If network fetch failed, try next URL; otherwise break.
      const msg = err?.message || '';
      if (!msg.includes('fetch failed')) {
        break;
      }
    }
  }
  throw lastErr;
};

// Minimal queries (adjust fields based on your schema)
const LIST_MOMENTS = gql`
  query ListMoments($limit: Int) {
    listMoments(limit: $limit) {
      items {
        id
        title
        description
        createdAt
        isPublic
        allowSharing
      }
    }
  }
`;

const GET_MOMENT = gql`
  query GetMoment($id: ID!) {
    getMoment(id: $id) {
      id
      title
      description
      createdAt
      isPublic
      allowSharing
    }
  }
`;

// Create User (for bootstrap)
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      lastName
      imageUrl
      createdAt
    }
  }
`;

// Create Story (for bootstrap)
const CREATE_STORY = gql`
  mutation CreateStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      id
      title
      imageUrl
      userId
      createdAt
    }
  }
`;

// Create Moment (for bootstrap)
const CREATE_MOMENT = gql`
  mutation CreateMoment($input: CreateMomentInput!) {
    createMoment(input: $input) {
      id
      title
      description
      userId
      storyId
      createdAt
    }
  }
`;

// Users
const LIST_USERS = gql`
  query ListUsers($limit: Int) {
    listUsers(limit: $limit) {
      items {
        id
        name
        lastName
        imageUrl
        createdAt
      }
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      lastName
      bio
      imageUrl
      createdAt
    }
  }
`;

// Stories
const LIST_STORIES = gql`
  query ListStories($limit: Int) {
    listStories(limit: $limit) {
      items {
        id
        title
        imageUrl
        userId
        createdAt
      }
    }
  }
`;

const GET_STORY = gql`
  query GetStory($id: ID!) {
    getStory(id: $id) {
      id
      title
      imageUrl
      userId
      createdAt
    }
  }
`;

const app = express();
app.use(cors({
  origin: [/^http:\/\/localhost:\d+$/],
}));
app.use(express.json());
// Prevent client/proxy caching; always fetch fresh data from AWS
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.get('/health', (req, res) => {
  res.json({ ok: true, region: REGION, appSyncPrimary: !!PRIMARY_URL, appSyncSecondary: !!SECONDARY_URL });
});

app.get('/api/moments', async (req, res) => {
  try {
    const data = await requestWithFallback(LIST_MOMENTS, { limit: 50 }, req);
    res.json({ items: data?.listMoments?.items || [] });
  } catch (err) {
    console.error('Error fetching moments:', err);
    res.status(500).json({ error: 'Failed to fetch moments', details: err?.response?.errors || err.message });
  }
});

app.get('/api/moments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await requestWithFallback(GET_MOMENT, { id }, req);
    const moment = data?.getMoment || null;
    if (!moment) return res.status(404).json({ error: 'Moment not found' });
    res.json(moment);
  } catch (err) {
    console.error('Error fetching moment:', err);
    res.status(500).json({ error: 'Failed to fetch moment', details: err?.response?.errors || err.message });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const data = await requestWithFallback(LIST_USERS, { limit }, req);
    res.json({ items: data?.listUsers?.items || [] });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users', details: err?.response?.errors || err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await requestWithFallback(GET_USER, { id }, req);
    const user = data?.getUser || null;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user', details: err?.response?.errors || err.message });
  }
});

// Current user profile from Cognito token
app.get('/api/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization Bearer token' });
    }
    const token = auth.replace(/^Bearer\s+/i, '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString('utf8'));
    const sub = payload?.sub;
    const email = payload?.email;
    const username = payload?.['cognito:username'] || email;
    if (!sub) return res.status(400).json({ error: 'Invalid token payload' });

    const data = await requestWithFallback(GET_USER, { id: sub }, req);
    const user = data?.getUser || null;
    if (!user) return res.status(404).json({ error: 'User record not found', hint: 'Consider calling /api/users/bootstrap to create one.' });
    res.json({ cognito: { sub, email, username }, profile: user });
  } catch (err) {
    console.error('Error fetching /me:', err);
    res.status(500).json({ error: 'Failed to fetch current user', details: err?.response?.errors || err.message });
  }
});

// Bootstrap a User record from Cognito token if missing
app.post('/api/users/bootstrap', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization Bearer token' });
    }
    const token = auth.replace(/^Bearer\s+/i, '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString('utf8'));
    const sub = payload?.sub;
    const email = payload?.email;
    const username = payload?.['cognito:username'] || email;
    if (!sub) return res.status(400).json({ error: 'Invalid token payload' });

    // Check existing
    const existing = await requestWithFallback(GET_USER, { id: sub }, req);
    if (existing?.getUser) {
      return res.json({ ok: true, created: false, user: existing.getUser });
    }

    // Create minimal user record with Cognito sub as id
    const input = {
      id: sub,
      name: username || 'User',
      lastName: '',
      imageUrl: '',
    };
    const created = await requestWithFallback(CREATE_USER, { input }, req);
    res.json({ ok: true, created: true, user: created?.createUser });
  } catch (err) {
    console.error('Error bootstrapping user:', err);
    res.status(500).json({ error: 'Failed to bootstrap user', details: err?.response?.errors || err.message });
  }
});

// Bootstrap a Story for the current user
app.post('/api/stories/bootstrap', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization Bearer token' });
    }
    const token = auth.replace(/^Bearer\s+/i, '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString('utf8'));
    const sub = payload?.sub;
    const email = payload?.email;
    const username = payload?.['cognito:username'] || email;
    if (!sub) return res.status(400).json({ error: 'Invalid token payload' });

    // Optional title from body
    const { title = 'My First Story', imageUrl = '' } = req.body || {};

    const input = {
      title,
      imageUrl,
      userId: sub,
    };

    const created = await requestWithFallback(CREATE_STORY, { input }, req);
    res.json({ ok: true, created: true, story: created?.createStory });
  } catch (err) {
    console.error('Error bootstrapping story:', err);
    res.status(500).json({ error: 'Failed to bootstrap story', details: err?.response?.errors || err.message });
  }
});

// Bootstrap a Moment for the current user (optionally linked to a story)
app.post('/api/moments/bootstrap', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Authorization Bearer token' });
    }
    const token = auth.replace(/^Bearer\s+/i, '');
    const payload = JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64').toString('utf8'));
    const sub = payload?.sub;
    const email = payload?.email;
    const username = payload?.['cognito:username'] || email;
    if (!sub) return res.status(400).json({ error: 'Invalid token payload' });

    // Optional fields from body; storyId is optional
    const {
      title = 'My First Moment',
      description = 'Sample moment created via API bootstrap',
      storyId = undefined,
    } = req.body || {};

    const input = {
      title,
      description,
      userId: sub,
      ...(storyId ? { storyId } : {}),
    };

    const created = await requestWithFallback(CREATE_MOMENT, { input }, req);
    res.json({ ok: true, created: true, moment: created?.createMoment });
  } catch (err) {
    console.error('Error bootstrapping moment:', err);
    res.status(500).json({ error: 'Failed to bootstrap moment', details: err?.response?.errors || err.message });
  }
});

// Stories endpoints
app.get('/api/stories', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
    const data = await requestWithFallback(LIST_STORIES, { limit }, req);
    res.json({ items: data?.listStories?.items || [] });
  } catch (err) {
    console.error('Error fetching stories:', err);
    res.status(500).json({ error: 'Failed to fetch stories', details: err?.response?.errors || err.message });
  }
});

app.get('/api/stories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await requestWithFallback(GET_STORY, { id }, req);
    const story = data?.getStory || null;
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    console.error('Error fetching story:', err);
    res.status(500).json({ error: 'Failed to fetch story', details: err?.response?.errors || err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AMW API server running on http://localhost:${PORT}`);
});
