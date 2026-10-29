
const API_URL = import.meta.env.VITE_API_URL


async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export function analyzeSource(source, filename) {
  return request("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, filename })
  });
}

export function getAnalyses() {
  return request("/api/analyses");
}
