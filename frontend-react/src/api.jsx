async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
}

export function parseErrorDetail(detail, fallback = "Something went wrong. Please try again.") {
    if (!detail) return fallback;
    if (typeof detail === "string") return detail;

    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) => (item && typeof item === "object" ? item.msg : item))
            .filter(Boolean);
        return messages.length ? messages.join(" ") : fallback;
    }

    if (typeof detail === "object" && detail.msg) return detail.msg;

    return fallback;
}

export default apiFetch