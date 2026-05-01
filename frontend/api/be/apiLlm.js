

const LLM_API_URL = import.meta.env.VITE_API_LLM_URL

export async function generate_str(prompt, max_token) {
    const response = await fetch(`${LLM_API_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-skip-browser-warning": "true"
        },
        body: JSON.stringify({
            message: prompt 
        })
    })
    
    if (!response.ok) {
        console.error("Connection Error from FE to BE")
        return;
    }
    
    const data = await response.json()
    console.log("Prompt: ", prompt)
    console.log(data)
    return data
}