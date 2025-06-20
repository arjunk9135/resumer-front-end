

export const customFetch = async (
  url,
  {
    method = "GET",
    body,
    headers = {},
    stringifyBody = true,
    includeAuth = true,
    credentials = false,
    responseType = "json",
    timeout = 8000,
    token = null, // 👈 Accept token explicitly
    ...otherOptions
  } = {}
) => {
  const defaultHeaders = {
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(includeAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
console.log('token',token)
  let processedBody = body;
  if (body && typeof body === "object" && stringifyBody && !(body instanceof FormData)) {
    processedBody = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      // headers: {} || defaultHeaders,
      headers: {},
      body: processedBody,
      credentials: credentials ? "include" : "omit",
      signal: controller.signal,
      ...otherOptions,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      throw errorData;
    }

    switch (responseType) {
      case "json":
        return await response.json();
      case "text":
        return await response.text();
      case "blob":
        return await response.blob();
      case "arrayBuffer":
        return await response.arrayBuffer();
      case "formData":
        return await response.formData();
      default:
        return response;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw { message: "Request timeout", isTimeout: true };
    }
    throw error;
  }
};

