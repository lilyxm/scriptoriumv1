import { useState } from "react";
import { useRouter } from "next/router";

export default function ExecuteCode() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("");
    const [stdin, setStdin] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/code/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, language, stdin }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage(`Execution successful! Output:\n${data.output}`);
        } else {
            setMessage(data.error);
        }
    };

    return (
        <div>
            <h1>Execute Code</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Code:</label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Language:</label>
                    <input
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Stdin:</label>
                    <textarea
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                    />
                </div>
                <button type="submit">Execute</button>
            </form>
            {message && <pre>{message}</pre>}
        </div>
    );
}
