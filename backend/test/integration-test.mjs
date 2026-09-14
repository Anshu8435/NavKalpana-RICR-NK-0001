import assert from 'node:assert/strict';

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting CardioShield AI End-to-End Integration Tests...\n');

  // Test 1: Health check
  console.log('1. Testing Backend Health Check...');
  const healthRes = await fetch('http://localhost:5000/health');
  const healthData = await healthRes.json();
  assert.equal(healthRes.status, 200);
  assert.equal(healthData.success, true);
  console.log('✅ Backend Health OK:', healthData.message);

  // Test 2: User Registration
  const testEmail = `doctor_${Date.now()}@testhospital.org`;
  const testPassword = 'Password123!@#';
  const testName = 'Dr. Sharma';

  console.log(`\n2. Testing Doctor Registration with email: ${testEmail}...`);
  const regRes = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword,
    }),
  });
  const regData = await regRes.json();
  assert.equal(regRes.status, 201, `Registration failed: ${JSON.stringify(regData)}`);
  assert.equal(regData.success, true);
  console.log('✅ Registration OK:', regData.message);

  // Test 3: User Login
  console.log('\n3. Testing Doctor Login...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const loginData = await loginRes.json();
  assert.equal(loginRes.status, 200, `Login failed: ${JSON.stringify(loginData)}`);
  assert.equal(loginData.success, true);
  const token = loginData.token;
  assert.ok(token, 'Token must be present in login response');
  console.log('✅ Login OK! JWT Token received.');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Test 4: Profile Check
  console.log('\n4. Testing /api/auth/me Profile Check...');
  const profileRes = await fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders,
  });
  const profileData = await profileRes.json();
  assert.equal(profileRes.status, 200);
  assert.equal(profileData.user.email, testEmail);
  console.log('✅ Profile OK:', profileData.user.name, `(${profileData.user.email})`);

  // Test 5: ML Service Health via Backend
  console.log('\n5. Testing ML Service Health via /api/predictions/health...');
  const mlHealthRes = await fetch(`${API_BASE}/predictions/health`, {
    headers: authHeaders,
  });
  const mlHealthData = await mlHealthRes.json();
  assert.equal(mlHealthRes.status, 200);
  assert.equal(mlHealthData.success, true);
  console.log('✅ ML Service Connection OK:', mlHealthData.message);

  // Test 6: Create Cardiovascular Risk Prediction
  console.log('\n6. Testing /api/predictions (Submitting Patient Vitals)...');
  const patientVitals = {
    age: 55,
    gender: 1, // Male
    height: 172,
    weight: 85,
    ap_hi: 150, // Elevated
    ap_lo: 95,
    cholesterol: 2, // Above normal
    gluc: 1,
    smoke: 1,
    alco: 0,
    active: 0,
  };

  const predRes = await fetch(`${API_BASE}/predictions`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(patientVitals),
  });
  const predData = await predRes.json();
  assert.equal(predRes.status, 201, `Prediction failed: ${JSON.stringify(predData)}`);
  assert.equal(predData.success, true);
  const report = predData.data.report;
  const visit = predData.data.visit;
  const pred = visit.prediction;

  console.log('✅ Prediction Succeeded!');
  console.log(`   - Risk Probability: ${(pred.risk_probability * 100).toFixed(1)}%`);
  console.log(`   - Risk Category: ${pred.risk_category}`);
  console.log(`   - Top Risk Factors: ${pred.top_risk_factors.map(f => f.feature).join(', ')}`);
  console.log(`   - Recommendations Count: ${pred.recommendations.length}`);
  console.log(`   - Referral Suggestion: ${pred.referral?.urgency || 'None'}`);

  // Test 7: Fetch User Reports
  console.log('\n7. Testing /api/predictions/reports...');
  const reportsRes = await fetch(`${API_BASE}/predictions/reports`, {
    headers: authHeaders,
  });
  const reportsData = await reportsRes.json();
  assert.equal(reportsRes.status, 200);
  assert.equal(reportsData.success, true);
  assert.ok(reportsData.data.reports.length >= 1);
  console.log(`✅ Reports listing OK: ${reportsData.data.reports.length} report(s) found.`);

  // Test 8: Fetch Report by ID
  console.log(`\n8. Testing /api/predictions/reports/${report._id}...`);
  const singleReportRes = await fetch(`${API_BASE}/predictions/reports/${report._id}`, {
    headers: authHeaders,
  });
  const singleReportData = await singleReportRes.json();
  assert.equal(singleReportRes.status, 200);
  assert.equal(singleReportData.data._id, report._id);
  console.log('✅ Single Report Retrieval OK!');

  // Test 9: Fetch Statistics
  console.log('\n9. Testing /api/predictions/statistics...');
  const statsRes = await fetch(`${API_BASE}/predictions/statistics`, {
    headers: authHeaders,
  });
  const statsData = await statsRes.json();
  assert.equal(statsRes.status, 200);
  assert.equal(statsData.success, true);
  console.log('✅ Statistics Retrieval OK: Total Reports =', statsData.data.totalReports);

  console.log('\n🎉 ALL 9 INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉\n');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed with error:', err);
  process.exit(1);
});

