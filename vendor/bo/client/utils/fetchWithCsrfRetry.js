/**
 * Sends a request and retries once if the server returns a CSRF-related 403.
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
export async function fetchWithCsrfRetry(url, options = {}) {
    let response = await fetch(url, options)

    const isCsrfError =
        response.status === 403 && 
        (await response.clone().json().catch(() => ({})))?.error?.toLowerCase?.().includes("csrf")
    if (!isCsrfError) return response

    // Ask for a fresh CSRF token, then retry
    await fetch("/core/csrf")
    response = await fetch(url, options)

    return response
}