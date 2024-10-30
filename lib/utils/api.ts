interface FetchOptions extends RequestInit {
  data?: any;
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const { data, ...fetchOptions } = options;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    ...fetchOptions,
  };

  if (data) {
    defaultOptions.body = JSON.stringify(data);
  }

  const response = await fetch(url, defaultOptions);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "An error occurred");
  }

  return result;
}
