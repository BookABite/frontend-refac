type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface RequestOptions {
    path: string
    method: HttpMethod
    body?: any
    headers?: Record<string, string>
    params?: Record<string, string>
}

interface ApiResponse<T = any> {
    data: T | null
    error: string | null
    status: number
}

export class ApiBookaBite {
    private static readonly BASE_URL = 'https://bookabite-back-prod.vercel.app/api'

    /**
     * Executa uma requisição à API do BookaBite
     * @param options Opções da requisição
     * @returns Resposta formatada da API
     */
    static async request<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
        try {
            // Prepara URL com query params se existirem
            let url = `${this.BASE_URL}${options.path}`

            if (options.params) {
                const queryParams = new URLSearchParams()
                Object.entries(options.params).forEach(([key, value]) => {
                    queryParams.append(key, value)
                })
                url += `?${queryParams.toString()}`
            }

            // Prepara os headers
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers,
            }

            // Configura a requisição
            const requestOptions: RequestInit = {
                method: options.method,
                headers,
            }

            // Adiciona o body se não for GET
            if (options.method !== 'GET' && options.body) {
                requestOptions.body = JSON.stringify(options.body)
            }

            // Executa a requisição
            const response = await fetch(url, requestOptions)
            const data = await response.json()

            // Processa a resposta
            if (!response.ok) {
                console.error('API request failed:', data)
                return {
                    data: null,
                    error: data.error || 'Falha na requisição',
                    status: response.status,
                }
            }

            return {
                data,
                error: null,
                status: response.status,
            }
        } catch (error) {
            console.error('Request error:', error)
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                status: 500,
            }
        }
    }
}

// Exporta também métodos convenientes para cada tipo de requisição
export const apiBookaBite = {
    get: <T = any>(path: string, params?: Record<string, string>) =>
        ApiBookaBite.request<T>({ path, method: 'GET', params }),

    post: <T = any>(path: string, body?: any) =>
        ApiBookaBite.request<T>({ path, method: 'POST', body }),

    put: <T = any>(path: string, body?: any) =>
        ApiBookaBite.request<T>({ path, method: 'PUT', body }),

    delete: <T = any>(path: string) => ApiBookaBite.request<T>({ path, method: 'DELETE' }),

    patch: <T = any>(path: string, body?: any) =>
        ApiBookaBite.request<T>({ path, method: 'PATCH', body }),
}

export default apiBookaBite
