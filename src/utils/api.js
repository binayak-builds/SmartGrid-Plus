const API_BASE = 'http://localhost:5000/api'

function getToken() { return localStorage.getItem('smartgrid_token') }
function setToken(token) { localStorage.setItem('smartgrid_token', token) }
function clearToken() { localStorage.removeItem('smartgrid_token') }

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) { const err = new Error(data.error || 'Request failed'); err.status = res.status; throw err }
  return data
}

// ──────────── AUTHENTICATION APIs ────────────
export async function apiLogin(username, password) {
  const data = await request('/login', { method: 'POST', body: JSON.stringify({ username, password }) })
  setToken(data.token)
  return data
}

export async function apiSignup(userData) {
  return await request('/signup', { method: 'POST', body: JSON.stringify(userData) })
}

export async function apiGetMe() {
  return await request('/me')
}

export function apiLogout() { clearToken() }
export function isLoggedIn() { return !!getToken() }

// ──────────── USER PROFILE APIs ────────────
export async function apiGetProfile(meter_no) {
  return await request(`/profile/${meter_no}`)
}

export async function apiGetMeter(meter_no) {
  return await request(`/meter/${meter_no}`)
}

export async function apiUpdateProfile(meter_no, profile) {
  return await request(`/customer/update/${meter_no}`, {
    method: 'PUT',
    body: JSON.stringify(profile)
  })
}

// ──────────── DASHBOARD APIs ────────────
export async function apiGetDashboard(meter_no) {
  return await request(`/dashboard/${meter_no}`)
}

// ──────────── ANALYTICS APIs ────────────
export async function apiGetAnalytics() {
  return await request('/analytics')
}

export async function apiGetUsageStats() {
  return await request('/analytics')
}

// ──────────── USAGE GRAPH API ────────────
export async function apiGetUsage(meter_no) {
  return await request(`/usage/${meter_no}`)
}

// ──────────── BILLING APIs ────────────
export async function apiGetBills(meter_no) {
  return await request(`/bills/${meter_no}`)
}

export async function apiGetUnpaidBills() {
  return await request('/unpaid')
}

export async function apiGetHighUsageBills() {
  return await request('/high-usage')
}

// ──────────── PAYMENT APIs ────────────
export async function apiPayBill(bill_id, amount) {
  return await request(`/pay/${bill_id}`, { method: 'POST', body: JSON.stringify({ amount }) })
}

// ──────────── ALERTS APIs ────────────
export async function apiGetAlerts(meter_no) {
  return await request(`/alerts/${meter_no}`)
}

export async function apiGetAdminAutomation() {
  return await request('/admin/automation')
}

export async function apiGetAutomation(meter_no) {
  return await request(`/automation/${meter_no}`)
}

export async function apiToggleRule(rule_id) {
  return await request(`/automation/${rule_id}/toggle`, { method: 'PUT' })
}

// ──────────── ENERGY / METER APIs ────────────
export async function apiGetEnergy(meter_no) {
  return await request(`/energy/${meter_no}`)
}

// ──────────── ADMIN APIs ────────────
export async function apiGetAdminCustomers() {
  return await request('/admin/customers')
}

export async function apiGetAdminBills() {
  return await request('/admin/bills')
}

export async function apiGetAdminUnpaidCustomers() {
  return await request('/admin/unpaid-customers')
}

export async function apiGetPredictions() {
  return await request('/predictions')
}

export async function apiGetAdminAssets() {
  return await request('/admin/assets')
}

export async function apiGetAssetStats() {
  return await request('/admin/asset-stats')
}

export async function apiGetMeters() {
  return await request('/meter')
}

export async function apiGetPayments() {
  return await request('/payments/history')
}
