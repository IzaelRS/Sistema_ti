"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ssh2_1 = require("ssh2");
const host = process.env.NAS_SSH_HOST || "cronos.local";
const user = process.env.NAS_SSH_USER || "sshd";
const password = process.env.NAS_SSH_PASS || "Master@1945";
console.log(`Connecting to ${host} as ${user}...`);
const conn = new ssh2_1.Client();
conn.on("ready", () => {
    console.log("SSH connection ready!");
    // Command to test
    const cmd = `
    echo "=== MEMORY ==="
    free -m 2>/dev/null || cat /proc/meminfo 2>/dev/null
    
    echo "=== CPU & NETWORK ==="
    read -r _ usr nic sys idl io irq sirq stl g1 g2 < /proc/stat
    rx1=\$(awk '{if (NR>2) sum+=\$2} END {print sum}' /proc/net/dev 2>/dev/null || cat /proc/net/dev | awk '{if (NR>2) sum+=\$2} END {print sum}')
    tx1=\$(awk '{if (NR>2) sum+=\$10} END {print sum}' /proc/net/dev 2>/dev/null || cat /proc/net/dev | awk '{if (NR>2) sum+=\$10} END {print sum}')
    prev_idle=\$((idl + io))
    prev_total=\$((usr + nic + sys + idl + io + irq + sirq + stl))
    
    sleep 0.5
    
    read -r _ usr nic sys idl io irq sirq stl g1 g2 < /proc/stat
    rx2=\$(awk '{if (NR>2) sum+=\$2} END {print sum}' /proc/net/dev 2>/dev/null || cat /proc/net/dev | awk '{if (NR>2) sum+=\$2} END {print sum}')
    tx2=\$(awk '{if (NR>2) sum+=\$10} END {print sum}' /proc/net/dev 2>/dev/null || cat /proc/net/dev | awk '{if (NR>2) sum+=\$10} END {print sum}')
    curr_idle=\$((idl + io))
    curr_total=\$((usr + nic + sys + idl + io + irq + sirq + stl))
    
    total_diff=\$((curr_total - prev_total))
    if [ "\$total_diff" -gt 0 ]; then
        cpu_pct=\$(( (total_diff - (curr_idle - prev_idle)) * 100 / total_diff ))
    else
        cpu_pct=0
    fi
    
    rx_kbs=\$(( (rx2 - rx1) * 2 / 1024 ))
    tx_kbs=\$(( (tx2 - tx1) * 2 / 1024 ))
    
    echo "CPU_PCT: \$cpu_pct"
    echo "RX_KBS: \$rx_kbs"
    echo "TX_KBS: \$tx_kbs"
    `;
    conn.exec(cmd, (err, stream) => {
        if (err)
            throw err;
        let stdout = "";
        stream.on("data", (data) => {
            stdout += data.toString();
        });
        stream.stderr.on("data", (data) => {
            console.error("STDERR:", data.toString());
        });
        stream.on("close", () => {
            console.log("=== STDOUT ===");
            console.log(stdout);
            conn.end();
        });
    });
}).on("error", (err) => {
    console.error("Connection error:", err);
}).connect({
    host: host,
    port: 22,
    username: user,
    password: password,
    readyTimeout: 10000
});
