export function showError(containerId, message = "Something wrong bruvv ToT. Open the console and check..") {

    const container = document.querySelector(containerId);
    container.innerHTML = "";
    
    const errMsg = document.createElement('p');
    errMsg.textContent = message;
    errMsg.style.color = "#b00020";
    container.appendChild(errMsg);
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

export function showLoading(divId, message = "Loading..") {
    
    const container = document.querySelector(divId);
    container.innerHTML = "";

    const loadPara = document.createElement('p');
    loadPara.textContent = message;
    loadPara.style.color = "#777";
    loadPara.style.fontStyle = "italic";

    container.appendChild(loadPara);
}