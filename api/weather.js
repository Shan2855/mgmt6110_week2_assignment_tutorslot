const PROVIDER_URL = 'https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast';

function sendJson(res, statusCode, data, headers = {}) {
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
  }
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(PROVIDER_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TutorSlot-SMU-Weather/1.0',
      },
    });

    clearTimeout(timeoutId);

    // Before reading response body, check response.ok
    if (!response.ok) {
      const status = response.status;
      const reason =
        status === 429
          ? 'Upstream weather service rate limit reached'
          : 'Upstream weather service returned HTTP ' + status;
      return sendJson(res, status, { error: reason, upstreamStatus: status });
    }

    const payload = await response.json();

    const items = payload?.data?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return sendJson(res, 502, {
        error: 'Malformed response structure from upstream weather service',
        upstreamStatus: 502,
      });
    }

    const firstItem = items[0];
    const updateTimestamp = firstItem.update_timestamp || firstItem.timestamp || '';
    const validPeriodText = firstItem.valid_period?.text || '';
    const forecasts = Array.isArray(firstItem.forecasts) ? firstItem.forecasts : [];

    // Extract where data.items[0].forecasts has area: "City"
    const cityForecastObj = forecasts.find(
      (f) => typeof f?.area === 'string' && f.area.trim().toLowerCase() === 'city'
    );

    const weatherData = {
      area: 'City',
      forecast:
        cityForecastObj && typeof cityForecastObj.forecast === 'string'
          ? cityForecastObj.forecast
          : null,
      validPeriod: String(validPeriodText),
      updatedAt: String(updateTimestamp),
    };

    return sendJson(res, 200, weatherData, {
      'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
    });
  } catch (_error) {
    return sendJson(res, 503, {
      error: 'Upstream weather provider network request failed',
      upstreamStatus: 503,
    });
  }
}
