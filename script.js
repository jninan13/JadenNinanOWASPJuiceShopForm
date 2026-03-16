document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("message");

    // Client-side validation
    if (email === "" || password === "") {
        message.innerText = "Fields cannot be empty";
        message.style.color = "red";
        return;
    }

    if (!email.includes("@")) {
        message.innerText = "Invalid email format";
        message.style.color = "red";
        return;
    }

    if (password.length < 8) {
        message.innerText = "Password must be at least 8 characters";
        message.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        message.innerText = data.message;
        message.style.color = data.success ? "green" : "red";
    } catch (error) {
        message.innerText = "Server error";
        message.style.color = "red";
    }
});