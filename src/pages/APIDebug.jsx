import React, { useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

const API_BASE = 'http://localhost:3001';

export default function APIDebug() {
  const [token, setToken] = useState('');
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState(null);
  const [stories, setStories] = useState(null);
  const [moments, setMoments] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const loadToken = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session?.tokens?.idToken?.toString();
        setToken(idToken || '');
      } catch (e) {
        setStatus('Not signed in. Please sign in first.');
      }
    };
    loadToken();
  }, []);

  const authHeader = () => (token ? { Authorization: 'Bearer ' + token } : {});

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      setStatus(`Health: ${JSON.stringify(data)}`);
    } catch (e) {
      setStatus(`Health error: ${e.message}`);
    }
  };

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/me`, { headers: authHeader() });
      const data = await res.json();
      setMe(data);
    } catch (e) {
      setStatus(`/api/me error: ${e.message}`);
    }
  };

  const bootstrapUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/bootstrap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader(),
        },
      });
      const data = await res.json();
      setStatus(`Bootstrap: ${JSON.stringify(data)}`);
    } catch (e) {
      setStatus(`Bootstrap error: ${e.message}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users?limit=50`, { headers: authHeader() });
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setStatus(`/api/users error: ${e.message}`);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stories?limit=50`, { headers: authHeader() });
      const data = await res.json();
      setStories(data);
    } catch (e) {
      setStatus(`/api/stories error: ${e.message}`);
    }
  };

  const fetchMoments = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/moments?limit=50`, { headers: authHeader() });
      const data = await res.json();
      setMoments(data);
    } catch (e) {
      setStatus(`/api/moments error: ${e.message}`);
    }
  };

  const copyToken = async () => {
    try {
      if (token) {
        await navigator.clipboard.writeText(token);
        setStatus('ID token copied to clipboard');
      }
    } catch (e) {
      setStatus('Failed to copy token');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">API Debug</h1>
      <p className="text-sm text-gray-600 mb-4">Use these buttons to fetch data from the local API server using your Cognito token.</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={fetchHealth}>Check Health</button>
        <button className="px-3 py-2 bg-blue-200 rounded" onClick={fetchMe} disabled={!token}>Get /api/me</button>
        <button className="px-3 py-2 bg-green-200 rounded" onClick={bootstrapUser} disabled={!token}>Bootstrap User</button>
        <button className="px-3 py-2 bg-purple-200 rounded" onClick={fetchUsers} disabled={!token}>List Users</button>
        <button className="px-3 py-2 bg-yellow-200 rounded" onClick={fetchStories} disabled={!token}>List Stories</button>
        <button className="px-3 py-2 bg-pink-200 rounded" onClick={fetchMoments} disabled={!token}>List Moments</button>
        <button className="px-3 py-2 bg-gray-300 rounded" onClick={copyToken} disabled={!token}>Copy ID Token</button>
      </div>

      <div className="mb-2 text-sm">{status}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <pre className="bg-black text-green-200 p-3 rounded overflow-auto max-h-80"><code>{JSON.stringify(me, null, 2)}</code></pre>
        <pre className="bg-black text-green-200 p-3 rounded overflow-auto max-h-80"><code>{JSON.stringify(users, null, 2)}</code></pre>
        <pre className="bg-black text-green-200 p-3 rounded overflow-auto max-h-80"><code>{JSON.stringify(stories, null, 2)}</code></pre>
        <pre className="bg-black text-green-200 p-3 rounded overflow-auto max-h-80"><code>{JSON.stringify(moments, null, 2)}</code></pre>
      </div>
    </div>
  );
}

