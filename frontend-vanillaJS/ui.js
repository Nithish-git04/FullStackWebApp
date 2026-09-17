export function showError(containerId, message = "Something wrong bruvv ToT. Open the console and check..") {

    const container = document.querySelector(containerId);
    container.innerHTML = "";
    
    const errMsg = document.createElement('p');
    errMsg.textContent = message;
    container.appendChild(errMsg);
}

export function showLoading(divId, message = "Loading..") {
    
    const container = document.querySelector(divId);
    container.innerHTML = "";

    const loadPara = document.createElement('p');
    loadPara.textContent = message;

    container.appendChild(loadPara);
}