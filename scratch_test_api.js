async function test() {
    console.log("Iniciando teste de conexão com a API de monitoramento...");
    try {
        // Node 22 has native global fetch
        const res = await fetch('http://192.168.3.178/api/monitoring/notifications');
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Resposta JSON obtida com sucesso:");
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.log("Erro usando fetch nativo:", err.message);
    }
}

test();
