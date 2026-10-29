const API_URL = import.meta.env.VITE_API_URL || "";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { method = "GET", accessToken, body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Poslužitelj nije dostupan. Pokušajte ponovno kasnije.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // tijelo odgovora nije JSON (ili je prazno) -- u redu za neke pogreške
  }

  if (!response.ok) {
    const message = data?.detail || "Došlo je do pogreške na poslužitelju.";
    throw new ApiError(message, response.status);
  }

  return data;
}

export function getMe(accessToken) {
  return request("/api/me/", { accessToken });
}

export function updateBio(accessToken, bio) {
  return request("/api/me/", { method: "PATCH", accessToken, body: { bio } });
}
