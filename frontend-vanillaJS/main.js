import { signIn, signUp } from "./auth.js";

async function main() {
    const lg = document.querySelector('#login');
    const sg = document.querySelector("#signup");

    sg.addEventListener("click", () => {
        const u_input = document.querySelector("#username");
        const username = u_input.value;
        const p_input = document.querySelector("#password");
        const password = p_input.value;

        signUp(username, password);
    });

    lg.addEventListener("click", () => {
        const u_input = document.querySelector("#username");
        const username = u_input.value;
        const p_input = document.querySelector("#password");
        const password = p_input.value;

        signIn(username, password);
    });
}

main();
