type UserData = {
    email: string,
    password: string
}

export type LoginCredentials = {
    email: string
    password: string
}

export type RegisterCredentials = {
    email: string
    password: string
    password_confirmation: string
}

export type ResetPasswordCredentials = {
    email: string
    password: string
    password_confirmation: string
    token: string
}

export type EmailVerificationUrl = {
    id: string
    hash: string
    expires: string
    signature: string
}

// Value is initialized in: ~/plugins/auth.ts
export const useUser = () => {
    return useState<UserData | undefined | null>("user", () => undefined)
}

export const useAuth = () => {
    const router = useRouter()

    const user = useUser()
    const isLoggedIn = computed(() => !!user.value)

    async function refresh() {
        try {
            user.value = await fetchCurrentUser()
        } catch {
            user.value = null
        }
    }

    async function login(credentials: LoginCredentials) {
        if (isLoggedIn.value) return

        await $larafetch("/auth/login", {useApiMiddleware: false, method: "post", body: credentials})
        await refresh()
    }

    async function register(credentials: RegisterCredentials) {
        await $larafetch("/auth/register", {useApiMiddleware: false, method: "post", body: credentials})
        await refresh()
    }

    async function verifyEmail(verificationUrl: EmailVerificationUrl) {
        await $larafetch(`/auth/email/verify/${verificationUrl.id}/${verificationUrl.hash}?expires=${verificationUrl.expires}&signature=${verificationUrl.signature}`, {
            useApiMiddleware: false,
            method: "get"
        })
        await refresh()
    }

    async function resendEmailVerification() {
        await $larafetch<{ status: string }>(
            "/auth/email/verification-notification",
            {
                useApiMiddleware: false,
                method: "post",
            }
        )
    }

    async function logout() {
        if (!isLoggedIn.value) return

        await $larafetch("/auth/logout", {useApiMiddleware: false, method: "post"})
        user.value = null

        await router.push("/")
    }

    async function forgotPassword(email: string) {
        return await $larafetch<{ status: string }>("/auth/forgot-password", {
            useApiMiddleware: false,
            method: "post",
            body: {email},
        })
    }

    async function resetPassword(credentials: ResetPasswordCredentials) {
        return await $larafetch<{ status: string }>("/auth/reset-password", {
            useApiMiddleware: false,
            method: "post",
            body: credentials,
        })
    }

    return {
        user,
        isLoggedIn,
        login,
        register,
        verifyEmail,
        resendEmailVerification,
        logout,
        forgotPassword,
        resetPassword,
        refresh,
    }
}

export const fetchCurrentUser = async () => {
    try {
        return await $larafetch<UserData>("/auth/me", {
            redirectIfNotAuthenticated: false,
        })
    } catch (error: any) {
        if ([401, 419].includes(error?.response?.status)) return null
        throw error
    }
}