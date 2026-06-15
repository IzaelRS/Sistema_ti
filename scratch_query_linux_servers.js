const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim();
        env[key] = val;
    }
});

const lansweeperAgent = new https.Agent({
    rejectUnauthorized: false
});

function getLansweeperLoginParams(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: '/login.aspx',
            method: 'GET',
            agent: lansweeperAgent
        };

        https.get(options, (res) => {
            const cookies = res.headers['set-cookie'] || [];
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const viewstateMatch = data.match(/id="__VIEWSTATE" value="([^"]*)"/);
                const eventvalMatch = data.match(/id="__EVENTVALIDATION" value="([^"]*)"/);
                
                resolve({
                    cookies: cookies.map(c => c.split(';')[0]).join('; '),
                    viewstate: viewstateMatch ? viewstateMatch[1] : '',
                    eventval: eventvalMatch ? eventvalMatch[1] : ''
                });
            });
        }).on('error', reject);
    });
}

function loginLansweeper(url, username, password, initialCookies, viewstate, eventval) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const postData = querystring.stringify({
            '__VIEWSTATE': viewstate,
            '__EVENTVALIDATION': eventval,
            'NameTextBox': username,
            'PasswordTextBox': password,
            'LoginButton': 'Login'
        });

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: '/login.aspx',
            method: 'POST',
            agent: lansweeperAgent,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
                'Cookie': initialCookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        };

        const req = https.request(options, (res) => {
            const newCookies = res.headers['set-cookie'] || [];
            resolve([initialCookies, ...newCookies.map(c => c.split(';')[0])].join('; '));
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function fetchLansweeperCustomReport(url, cookies, reportName, queryParams) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: `/ReportJson.aspx?det=${reportName}&${queryParams}&top=500&page=1&cache=0`,
            method: 'POST',
            agent: lansweeperAgent,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length': 0,
                'Cookie': cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Erro HTTP ${res.statusCode} ao carregar JSON`));
                    return;
                }
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write('');
        req.end();
    });
}

async function run() {
    try {
        console.log('Logging in to Lansweeper...');
        const loginParams = await getLansweeperLoginParams(env.LANSWEEPER_URL);
        const cookies = await loginLansweeper(env.LANSWEEPER_URL, env.LANSWEEPER_USER, env.LANSWEEPER_PASS, loginParams.cookies, loginParams.viewstate, loginParams.eventval);
        
        const reportsToTry = [
            'web40repcomputerhardware',
            'web40repallassets',
            'web40rephardwaresummary',
            'web40repactiveassets',
            'web40repcomputermemory',
            'web50findallmem',
            'web40repdisks'
        ];

        for (const name of reportsToTry) {
            try {
                console.log(`Trying report "${name}"...`);
                const data = await fetchLansweeperCustomReport(env.LANSWEEPER_URL, cookies, name, '');
                if (data && data.AddedRows && data.AddedRows.length > 0) {
                    console.log(`  Success! Found ${data.AddedRows.length} rows. Columns:`, data.Columns);
                    console.log(`  Sample row:`, data.AddedRows[0]);
                } else {
                    console.log(`  No rows returned.`);
                }
            } catch (err) {
                console.log(`  Failed: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
