import assert from 'node:assert/strict';
import { getMongoUri, getEmailPassword } from '../src/config/env.js';
import { verifyTransporter } from '../src/config/email.js';

process.env.MONGO_URI = '';
process.env.MONGODB_URI = 'mongodb://localhost:27017/cardioshield';
process.env.EMAIL_PASSWORD = '';
process.env.EMAIL_PASS = 'test-email-secret';
process.env.EMAIL_USER = '';

assert.equal(getMongoUri(), 'mongodb://localhost:27017/cardioshield');
assert.equal(getEmailPassword(), 'test-email-secret');
assert.equal(await verifyTransporter(), false);

console.log('env resolution ok');
