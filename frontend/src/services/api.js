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

export function getTree(accessToken) {
  return request("/api/workspace/tree/", { accessToken });
}

export function createFolder(accessToken, naziv, roditelj) {
  return request("/api/workspace/folders/", {
    method: "POST",
    accessToken,
    body: { naziv, roditelj },
  });
}

// --- radna okolina: datoteke (api-radna-okolina.js) ---

async function posalji(path, { method = "GET", accessToken, formData } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
  } catch {
    throw new ApiError("Poslužitelj nije dostupan. Pokušajte ponovno kasnije.");
  }
  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new ApiError(data?.detail || "Došlo je do pogreške na poslužitelju.", response.status);
  }
  return response;
}

export async function uploadFile(accessToken, datoteka, roditelj = null, naziv = datoteka.name) {
  const formData = new FormData();
  formData.append("datoteka", datoteka, naziv);
  if (roditelj != null) formData.append("roditelj", roditelj);
  const response = await posalji("/api/workspace/files/", { method: "POST", accessToken, formData });
  return response.json();
}

export async function downloadFile(accessToken, id, ciljniFormat) {
  const upit = ciljniFormat ? `?ciljni_format=${ciljniFormat}` : "";
  const response = await posalji(`/api/workspace/files/${id}/download/${upit}`, { accessToken });
  return response.blob();
}

export async function overwriteFile(accessToken, id, datoteka, naziv = "obradeno.wav") {
  const formData = new FormData();
  formData.append("datoteka", datoteka, naziv);
  const response = await posalji(`/api/workspace/files/${id}/content/`, { method: "PUT", accessToken, formData });
  return response.json();
}

export function getFileUrl(accessToken, id) {
  return request(`/api/workspace/files/${id}/url/`, { accessToken });
}

export function spremiNaRacunalo(blob, imeDatoteke) {
  const adresa = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = adresa;
  a.download = imeDatoteke;
  a.click();
  setTimeout(() => URL.revokeObjectURL(adresa), 1000);
}

// promjene: { naziv } za preimenovanje, { roditelj } za premještanje (null = korijen)
export function updateNode(accessToken, id, promjene) {
  return request(`/api/workspace/nodes/${id}/`, { method: "PATCH", accessToken, body: promjene });
}

// briše datoteku ili mapu sa svim sadržajem
export function deleteNode(accessToken, id) {
  return request(`/api/workspace/nodes/${id}/`, { method: "DELETE", accessToken });
}
