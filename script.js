const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const effects = document.getElementById("effects");


// =========================================
// KIRIM PESAN
// =========================================

 async function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) return;

    // Hilangkan welcome
    welcome.style.display = "none";

    // Tampilkan pesan user
    createMessage(text, "user");

    // Kosongkan input
    messageInput.value = "";

    messageInput.style.height = "auto";

    // Animasi kirim
    createRandomEffect();

    // Scroll
    scrollToBottom();

    // Tampilkan "yaudah sih lagi mikir..."
    showTyping();

    try {

        // Kirim pesan ke Netlify Function
        const response = await fetch(
            "/.netlify/functions/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    messages: [
                        {
                            role: "user",
                            content: text
                        }
                    ]

                })
            }
        );


        // Ambil hasil dari backend
        const data =
            await response.json();


        // Hilangkan typing
        hideTyping();


        // Kalau backend error
        if (!response.ok) {

            createMessage(
                "Aduh, ada masalah waktu menghubungkan aku ke server 😭",
                "ai"
            );

            console.error(
                "Server Error:",
                data
            );

            scrollToBottom();

            return;
        }


        // Tampilkan jawaban Groq
        createMessage(
            data.answer,
            "ai"
        );

        scrollToBottom();


    } catch (error) {

        hideTyping();

        console.error(
            "Connection Error:",
            error
        );

        createMessage(
            "Aku belum bisa terhubung ke server 😭 Coba lagi nanti ya.",
            "ai"
        );

        scrollToBottom();
    }
}


// =========================================
// BUAT PESAN
// =========================================

function createMessage(text, sender) {

    const row = document.createElement("div");

    row.classList.add(
        "message-row",
        sender
    );

    const avatar = document.createElement("div");

    avatar.classList.add(
        "message-avatar"
    );

    avatar.textContent =
        sender === "ai"
            ? "✦"
            : "♡";


    const content =
        document.createElement("div");

    content.classList.add(
        "message-content"
    );


    const name =
        document.createElement("div");

    name.classList.add(
        "message-name"
    );

    name.textContent =
        sender === "ai"
            ? "yaudah si"
            : "You";


    const bubble =
        document.createElement("div");

    bubble.classList.add(
        "message-bubble"
    );

    bubble.textContent = text;


    const time =
        document.createElement("div");

    time.classList.add(
        "message-time"
    );

    time.textContent =
        getCurrentTime();


    content.appendChild(name);

    content.appendChild(bubble);

    content.appendChild(time);

    row.appendChild(avatar);

    row.appendChild(content);

    messages.appendChild(row);
}


// =========================================
// TYPING INDICATOR
// =========================================

function showTyping() {

    const typing =
        document.createElement("div");

    typing.classList.add(
        "message-row",
        "ai",
        "typing-row"
    );

    typing.id =
        "typingIndicator";


    const avatar =
        document.createElement("div");

    avatar.classList.add(
        "message-avatar"
    );

    avatar.textContent = "✦";


    const content =
        document.createElement("div");

    content.classList.add(
        "message-content"
    );


    const name =
        document.createElement("div");

    name.classList.add(
        "message-name"
    );

    name.textContent =
        "yaudah si";


    const bubble =
        document.createElement("div");

    bubble.classList.add(
        "message-bubble",
        "typing-bubble"
    );


    bubble.innerHTML = `
        <span class="typing-text">
            yaudah si lagi mikir
        </span>

        <span class="typing-dots">
            <i></i>
            <i></i>
            <i></i>
        </span>
    `;


    content.appendChild(name);

    content.appendChild(bubble);

    typing.appendChild(avatar);

    typing.appendChild(content);

    messages.appendChild(typing);

    scrollToBottom();
}


// =========================================
// HILANGKAN TYPING
// =========================================

function hideTyping() {

    const typing =
        document.getElementById(
            "typingIndicator"
        );

    if (typing) {
        typing.remove();
    }
}


// =========================================
// WAKTU
// =========================================

function getCurrentTime() {

    const now =
        new Date();

    return now.toLocaleTimeString(
        "id-ID",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// =========================================
// ENTER
// =========================================

messageInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }

    }
);


// =========================================
// SEND BUTTON
// =========================================

sendButton.addEventListener(
    "click",
    sendMessage
);


// =========================================
// AUTO RESIZE
// =========================================

messageInput.addEventListener(
    "input",
    function() {

        this.style.height =
            "auto";

        this.style.height =
            this.scrollHeight + "px";
    }
);


// =========================================
// SUGGESTION
// =========================================

const suggestions =
    document.querySelectorAll(
        ".suggestion"
    );

suggestions.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                let text =
                    this.textContent
                        .replace("✨", "")
                        .replace("📊", "")
                        .replace("✍️", "")
                        .trim();

                messageInput.value =
                    text;

                messageInput.focus();
            }
        );

    }
);


// =========================================
// RANDOM EFFECT
// =========================================

function createRandomEffect() {

    const effectsList = [
        createPaperPlane,
        createLove,
        createSparkles,
        createFlowers
    ];

    const randomIndex =
        Math.floor(
            Math.random() *
            effectsList.length
        );

    effectsList[randomIndex]();
}


// =========================================
// ✈️ PESAWAT
// =========================================

function createPaperPlane() {

    const plane =
        document.createElement("div");

    plane.classList.add(
        "effect"
    );

    plane.textContent = "✈";

    plane.style.fontSize =
        "28px";

    plane.style.left =
        "calc(50% + 100px)";

    plane.style.bottom =
        "90px";

    plane.style.setProperty(
        "--x",
        "180px"
    );

    plane.style.setProperty(
        "--y",
        "-180px"
    );

    plane.style.setProperty(
        "--rotate",
        "15deg"
    );

    effects.appendChild(
        plane
    );

    setTimeout(
        () => plane.remove(),
        1300
    );
}


// =========================================
// 💗 LOVE
// =========================================

function createLove() {

    const hearts = [
        "♥",
        "♡",
        "❤"
    ];

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const heart =
            document.createElement("div");

        heart.classList.add(
            "effect"
        );

        heart.textContent =
            hearts[
                Math.floor(
                    Math.random() *
                    hearts.length
                )
            ];

        heart.style.fontSize =
            (
                12 +
                Math.random() * 15
            ) + "px";

        heart.style.left =
            (
                45 +
                Math.random() * 10
            ) + "%";

        heart.style.bottom =
            (
                70 +
                Math.random() * 40
            ) + "px";

        heart.style.setProperty(
            "--x",
            (
                -100 +
                Math.random() * 200
            ) + "px"
        );

        heart.style.setProperty(
            "--y",
            (
                -80 -
                Math.random() * 150
            ) + "px"
        );

        heart.style.setProperty(
            "--rotate",
            (
                -30 +
                Math.random() * 60
            ) + "deg"
        );

        effects.appendChild(
            heart
        );

        setTimeout(
            () => heart.remove(),
            1300
        );
    }
}


// =========================================
// ✨ SPARKLES
// =========================================

function createSparkles() {

    const symbols = [
        "✦",
        "✧",
        "⋆",
        "✶"
    ];

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const sparkle =
            document.createElement("div");

        sparkle.classList.add(
            "effect"
        );

        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        sparkle.style.fontSize =
            (
                10 +
                Math.random() * 15
            ) + "px";

        sparkle.style.left =
            (
                40 +
                Math.random() * 20
            ) + "%";

        sparkle.style.bottom =
            (
                70 +
                Math.random() * 30
            ) + "px";

        sparkle.style.setProperty(
            "--x",
            (
                -150 +
                Math.random() * 300
            ) + "px"
        );

        sparkle.style.setProperty(
            "--y",
            (
                -80 -
                Math.random() * 160
            ) + "px"
        );

        sparkle.style.setProperty(
            "--rotate",
            (
                -180 +
                Math.random() * 360
            ) + "deg"
        );

        effects.appendChild(
            sparkle
        );

        setTimeout(
            () => sparkle.remove(),
            1300
        );
    }
}


// =========================================
// 🌸 BUNGA
// =========================================

function createFlowers() {

    const flowers = [
        "✿",
        "❀",
        "✾",
        "❁"
    ];

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const flower =
            document.createElement("div");

        flower.classList.add(
            "effect"
        );

        flower.textContent =
            flowers[
                Math.floor(
                    Math.random() *
                    flowers.length
                )
            ];

        flower.style.fontSize =
            (
                14 +
                Math.random() * 12
            ) + "px";

        flower.style.left =
            (
                40 +
                Math.random() * 20
            ) + "%";

        flower.style.bottom =
            (
                70 +
                Math.random() * 30
            ) + "px";

        flower.style.setProperty(
            "--x",
            (
                -120 +
                Math.random() * 240
            ) + "px"
        );

        flower.style.setProperty(
            "--y",
            (
                -100 -
                Math.random() * 130
            ) + "px"
        );

        flower.style.setProperty(
            "--rotate",
            (
                -180 +
                Math.random() * 360
            ) + "deg"
        );

        effects.appendChild(
            flower
        );

        setTimeout(
            () => flower.remove(),
            1300
        );
    }
}


// =========================================
// SCROLL
// =========================================

function scrollToBottom() {

    messages.scrollTo({
        top:
            messages.scrollHeight,

        behavior:
            "smooth"
    });
}
// =========================================
// PWA SERVICE WORKER
// =========================================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(() => {

                    console.log(
                        "yaudah sih PWA aktif ✨"
                    );

                })
                .catch(error => {

                    console.error(
                        "Service Worker gagal:",
                        error
                    );

                });

        }
    );

}