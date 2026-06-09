async function test() {
    const username = 'master';
    const password = 'sara1998';
    const baseUrl = 'https://gnew.drmonitora.com.br/api/v2';

    console.log("Autenticando...");
    let token = '';
    try {
        const tokenRes = await fetch(`${baseUrl}/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const tokenData = await tokenRes.json();
        token = tokenData.token;
        console.log("Token obtido:", token);
    } catch (e) {
        console.error("Erro ao obter token:", e);
        return;
    }

    const endpoints = [
        '/servidores/1/servicos/'
    ];

    for (const ep of endpoints) {
        console.log(`\n--- Testando endpoint: ${ep} ---`);
        try {
            const res = await fetch(`${baseUrl}${ep}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            console.log("Status:", res.status);
            const data = await res.json();
            console.log(JSON.stringify(data).substring(0, 1000));
        } catch (e) {
            console.error(`Erro ao testar ${ep}:`, e.message);
        }
    }
}

test();
