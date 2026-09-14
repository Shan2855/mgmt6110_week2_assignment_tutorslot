// Vercel serverless function route: /api/health.js
// Safely reports TutorSlot service status and verifies upstream provider availability

const PROVIDER_URL = 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast';

function sendJson(res, statusCode, data) {
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

export default async function handler(_req, res) {
  let providerAnswered = false;
  let upstreamStatus = 'unreachable';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Actively check if upstream weather provider answers
    const response = await fetch(PROVIDER_URL, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TutorSlot-SMU-HealthCheck/1.0',
      },
    });

    clearTimeout(timeoutId);
    upstreamStatus = response.status;
    providerAnswered = true;
  } catch (_err) {
    providerAnswered = false;
    upstreamStatus = 'unreachable';
  }

  let serviceStatus = 'unavailable';
  let httpStatusCode = 503;

  if (providerAnswered) {
    if (typeof upstreamStatus === 'number' && upstreamStatus >= 200 && upstreamStatus <= 299) {
      serviceStatus = 'ok';
      httpStatusCode = 200;
    } else {
      serviceStatus = 'degraded';
      httpStatusCode = 503;
    }
  } else {
    serviceStatus = 'unavailable';
    httpStatusCode = 503;
  }

  const healthReport = {
    service: 'TutorSlot',
    status: serviceStatus,
    keyConfigured: 'not-required',
    weatherProvider: 'National Environment Agency, Singapore (data.gov.sg)',
    providerAnswered,
    upstreamStatus,
    timestamp: new Date().toISOString(),
  };

  return sendJson(res, httpStatusCode, healthReport);
}
