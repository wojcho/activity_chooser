import ApiError from "./api-error";

export default class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async get<T>(path: string): Promise<T> {
    return this.request<T>(path, {
      method: "GET",
    });
  }

  protected async post<T>(
    path: string,
    body?: unknown,
  ): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private async request<T>(
    path: string,
    init: RequestInit,
  ): Promise<T> {
    const response = await fetch(
      `${this.baseUrl}${path}`,
      {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init.headers,
        },
      },
    );

    const json = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        json.error ?? "Unknown error",
      );
    }

    return json as T;
  }
}

