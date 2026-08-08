exports.handler = async function (event) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({
                    error: "Method not allowed"
                })
            };
        }

        const { messages } = JSON.parse(event.body);

        if (!messages || !Array.isArray(messages)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Messages tidak ditemukan."
                })
            };
        }

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [
                        {
                            role: "system",
                            content: `Kamu adalah "yaudah sih", AI assistant yang ramah, santai, hangat, dan pintar.

Gunakan bahasa Indonesia yang natural dan tidak terlalu formal.
Gaya bicaramu seperti teman ngobrol yang bisa membantu pengguna berpikir, belajar, mencari ide, menulis, dan menyelesaikan masalah.

Jangan terlalu banyak menggunakan emoji.
Jika pengguna hanya ingin ngobrol, jawab dengan santai dan natural.`
                        },
                        ...messages
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Error:", data);

            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error:
                        data.error?.message ||
                        "Groq API mengalami error."
                })
            };
        }

        const answer =
            data.choices?.[0]?.message?.content ||
            "Hmm, aku belum bisa menjawab itu.";

        return {
            statusCode: 200,
            body: JSON.stringify({
                answer: answer
            })
        };

    } catch (error) {
        console.error("Server Error:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message || "Terjadi kesalahan pada server."
            })
        };
    }
};
