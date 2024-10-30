interface IntegrationConfig {
  endpoint: string;
  authType: "oauth" | "apiKey";
  credentials: Record<string, string>;
}

export async function validateIntegrationConfig(config: IntegrationConfig) {
  try {
    // Validate endpoint
    const url = new URL(config.endpoint);
    if (!url.protocol.startsWith("https")) {
      return false;
    }

    // Validate auth configuration
    if (config.authType === "oauth") {
      if (!config.credentials.clientId || !config.credentials.clientSecret) {
        return false;
      }
    } else if (config.authType === "apiKey") {
      if (!config.credentials.apiKey) {
        return false;
      }
    }

    // Test connection
    const isConnected = await testConnection(config);
    return isConnected;
  } catch (error) {
    console.error("Error validating integration config:", error);
    return false;
  }
}

async function testConnection(config: IntegrationConfig) {
  try {
    const response = await fetch(config.endpoint, {
      method: "HEAD",
      headers: {
        Authorization: buildAuthHeader(config),
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

function buildAuthHeader(config: IntegrationConfig) {
  if (config.authType === "apiKey") {
    return `Bearer ${config.credentials.apiKey}`;
  }
  // Add OAuth token generation logic here
  return "";
}
