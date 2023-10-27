import {$fetch, FetchError, type FetchOptions} from 'ofetch'

const CSRF_COOKIE = "XSRF-TOKEN"
const CSRF_HEADER = "X-XSRF-TOKEN"

// could not import these types from ofetch, so copied them here
interface ResponseMap {
    blob: Blob
    text: string
    arrayBuffer: ArrayBuffer
}

type ResponseType = keyof ResponseMap | "json"
// end of copied types

export type LarafetchOptions<R extends ResponseType> = FetchOptions<R> & {
    redirectIfNotAuthenticated?: boolean
    redirectIfNotVerified?: boolean
    useApiMiddleware?: boolean
    pick?: string[]
}

export async function $larafetch<T, R extends ResponseType = "json">(
    path: RequestInfo,
    {
        redirectIfNotAuthenticated = true,
        redirectIfNotVerified = true,
        useApiMiddleware = true,
        ...options
    }: LarafetchOptions<R> = {}
) {
    const {frontendUrl, apiVersion} = useRuntimeConfig().public
    const backendUrl = useApiMiddleware ? `${frontendUrl}/api/${apiVersion}` : `${frontendUrl}/web/`
    const router = useRouter()

    let token = useCookie(CSRF_COOKIE).value

    // on client initiate a csrf request and get it from the cookie set by laravel
    if (
        process.client &&
        ["post", "delete", "put", "patch"].includes(
            options?.method?.toLowerCase() ?? ""
        )
    ) {
        await initCsrf()
        token = useCookie('XSRF-TOKEN')?.value
    }

    let headers: any = {
        accept: "application/json",
        ...options?.headers,
        ...(token && {[CSRF_HEADER]: token}),
    }

    if (process.server) {
        headers = {
            ...headers,
            ...useRequestHeaders(["cookie"]),
            referer: frontendUrl,
        }
    }

    try {
        return await $fetch<T, R>(path, {
            baseURL: backendUrl,
            ...options,
            headers,
            credentials: "include",
        })
    } catch (error) {
        if (!(error instanceof FetchError)) throw error

        // when any of the following redirects occur and the final throw is not caught then nuxt SSR will log the following error:
        // [unhandledRejection] Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

        const status = error.response?.status ?? -1

        if (redirectIfNotAuthenticated && [401, 419].includes(status)) {
            await router.push("/auth/signin")
        }

        if (redirectIfNotVerified && [409].includes(status)) {
            await router.push("/verify-email")
        }

        if ([500].includes(status)) {
            console.error("[Error]", error.data?.message, error.data)
        }

        throw error
    }
}

async function initCsrf() {
    const {frontendUrl} = useRuntimeConfig().public
    const backendUrl = `${frontendUrl}`

    await $fetch("/csrf", {
        baseURL: frontendUrl,
    })
}