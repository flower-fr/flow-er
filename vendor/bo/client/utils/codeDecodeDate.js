const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

function codeDate(dateStr) {
    // "2026-11-01" -> nombre de jours depuis le 2000-01-01
    const [y, m, d] = dateStr.split("-").map(Number)
    const days = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(2000, 0, 1)) / 86400000)
    // base 62 sur 6 caractères (62^6 ≈ 5,7e10 > 36500 jours sur 100 ans)
    let n = days, out = ""
    for (let i = 0; i < 6; i++) { out = B62[n % 62] + out; n = Math.floor(n / 62) }
    return out
}

function decodeDate(hash) {
    let n = 0
    for (const c of hash) n = n * 62 + B62.indexOf(c)
    const ms = Date.UTC(2000, 0, 1) + n * 86400000
    const dt = new Date(ms)
    const p = x => String(x).padStart(2, "0")
    return dt.getUTCFullYear() + "-" + p(dt.getUTCMonth() + 1) + "-" + p(dt.getUTCDate())
}

export { codeDate, decodeDate }