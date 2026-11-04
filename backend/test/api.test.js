import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import app from '../src/app.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    // Bind to port 0 for ephemeral testing port
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
  setTimeout(() => process.exit(0), 100);
});

test('API Test Suite - Health, Routing, CORS, and Security Contracts', async (t) => {

  await t.test('TC01: GET /health returns 200 OK with healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.match(body.message, /CardioShield AI API is running/);
  });

  await t.test('TC02: OPTIONS CORS preflight allows Vercel domain', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://nav-kalpana-ricr-nk-0001.vercel.app',
        'Access-Control-Request-Method': 'POST',
      },
    });
    assert.strictEqual(res.status, 200);
    const allowOrigin = res.headers.get('access-control-allow-origin');
    assert.strictEqual(allowOrigin, 'https://nav-kalpana-ricr-nk-0001.vercel.app');
  });

  await t.test('TC03: POST /api/auth/register fails validation on missing fields with 400', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.match(body.message, /Validation failed/);
  });

  await t.test('TC04: POST /api/auth/login returns 401 on incorrect credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'doctor_not_found@hospital.org',
        password: 'NonExistentPassword123!',
      }),
    });
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await t.test('TC05: Protected route /api/predictions/reports rejects request without JWT with 401', async () => {
    const res = await fetch(`${baseUrl}/api/predictions/reports`);
    assert.strictEqual(res.status, 401);
    const body = await res.json();
    assert.strictEqual(body.success, false);
  });

  await t.test('TC06: Direct route alias /auth/login routes to auth controller without 404', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'doctor_alias@hospital.org',
        password: 'Password123!',
      }),
    });
    // Should NOT be 404
    assert.notStrictEqual(res.status, 404);
    assert.strictEqual(res.status, 401);
  });

});
