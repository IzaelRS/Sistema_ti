"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const url_1 = require("url");
const agent = new https_1.default.Agent({
    rejectUnauthorized: false
});
const PFSENSE_URL = "https://192.168.0.2:90";
const USERNAME = "tv";
const PASSWORD = "tv1945";
function makeGet(urlStr, cookie = "") {
    return new Promise((resolve, reject) => {
        const parsedUrl = new url_1.URL(urlStr);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: "GET",
            agent: agent,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Cookie": cookie
            }
        };
        https_1.default.get(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                resolve({ html: data, headers: res.headers });
            });
        }).on("error", reject);
    });
}
function makePost(urlStr, body, cookie = "") {
    return new Promise((resolve, reject) => {
        const parsedUrl = new url_1.URL(urlStr);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: "POST",
            agent: agent,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(body),
                "Cookie": cookie
            }
        };
        const req = https_1.default.request(options, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                resolve({ html: data, headers: res.headers, statusCode: res.statusCode });
            });
        });
        req.on("error", reject);
        req.write(body);
        req.end();
    });
}
async function run() {
    try {
        console.log("1. Buscando página de login...");
        const initialRes = await makeGet(PFSENSE_URL);
        const setCookieHeaders = initialRes.headers["set-cookie"] || [];
        const initialCookie = setCookieHeaders.map(c => c.split(";")[0]).join("; ");
        const csrfMatch = initialRes.html.match(/name='__csrf_magic' value="([^"]*)"/);
        if (!csrfMatch) {
            console.error("Não foi possível encontrar __csrf_magic na página de login.");
            return;
        }
        const csrfToken = csrfMatch[1];
        console.log("2. Enviando POST de login...");
        const loginParams = new url_1.URLSearchParams();
        loginParams.append("__csrf_magic", csrfToken);
        loginParams.append("usernamefld", USERNAME);
        loginParams.append("passwordfld", PASSWORD);
        loginParams.append("login", "Sign In");
        const postRes = await makePost(PFSENSE_URL + "/index.php", loginParams.toString(), initialCookie);
        const loginCookiesHeaders = postRes.headers["set-cookie"] || [];
        const authCookie = loginCookiesHeaders.length > 0
            ? loginCookiesHeaders.map(c => c.split(";")[0]).join("; ")
            : initialCookie;
        console.log("3. Buscando getstats.php...");
        // getstats.php requer parâmetros para retornar estatísticas completas, ou pode ser um POST.
        // Vamos tentar enviar com ajax=ajax e skipitems como no index.html.
        const statsParams = new url_1.URLSearchParams();
        statsParams.append("ajax", "ajax");
        statsParams.append("skipitems[]", "user");
        statsParams.append("skipitems[]", "system");
        const statsRes1 = await makePost(PFSENSE_URL + "/getstats.php", statsParams.toString(), authCookie);
        console.log("Stats (POST ajax):", statsRes1.html);
        const statsRes2 = await makeGet(PFSENSE_URL + "/getstats.php", authCookie);
        console.log("Stats (GET):", statsRes2.html);
    }
    catch (e) {
        console.error("Erro na execução:", e);
    }
}
run();
