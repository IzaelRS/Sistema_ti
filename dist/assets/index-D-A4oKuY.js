(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const we="/api",$={async get(e){const t=await fetch(`${we}${e}`);if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async post(e,t){const n=await fetch(`${we}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(e,t){const n=await fetch(`${we}${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(e){const t=await fetch(`${we}${e}`,{method:"DELETE"});if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async upload(e,t){const n=await fetch(`${we}${e}`,{method:"POST",body:t});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let me=null;const j={init(){const e=localStorage.getItem("user");if(e)try{return me=JSON.parse(e),!0}catch{return this.logout(),!1}return!1},getUser(){return me},isAdmin(){return me&&me.role==="Administrador"},async login(e,t){try{const n=await $.post("/login",{email:e,password:t});return me=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){me=null,localStorage.removeItem("user")}},d={show(e){const t=document.getElementById(e);t&&t.classList.remove("hidden")},hide(e){const t=document.getElementById(e);t&&t.classList.add("hidden")},toggle(e,t){const n=document.getElementById(e);n&&n.classList.toggle("hidden",t)},setText(e,t){const n=document.getElementById(e);n&&(n.innerText=t)},setValue(e,t){const n=document.getElementById(e);n&&(n.value=t)},getValue(e){const t=document.getElementById(e);return t?t.value:null},on(e,t,n){const o=document.getElementById(e);o&&o.addEventListener(t,n)}},ft={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const e=window.innerWidth<=768;this.particleCount=e?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let t=0;t<this.particleCount;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const e=document.getElementById("account-section");e&&(this.canvas.width=e.clientWidth,this.canvas.height=e.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let e=0;e<this.particles.length;e++){const t=this.particles[e];t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.canvas.width)&&(t.vx*=-1),(t.y<0||t.y>this.canvas.height)&&(t.vy*=-1),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=e+1;n<this.particles.length;n++){const o=this.particles[n],a=t.x-o.x,s=t.y-o.y,i=Math.sqrt(a*a+s*s);if(i<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const r=1-i/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${r*.4})`,this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let xe=[];const st={async fetch(){try{xe=await $.get("/users"),this.render(xe)}catch(e){console.error("Error fetching Users:",e)}},getUsers(){return xe},render(e){const t=document.getElementById("user-table-body");t&&(t.innerHTML=e.map(n=>{const o=n.role==="Administrador",a=j.isAdmin()?`
                <td onclick="event.stopPropagation()">
                    <div class="btn-actions-container">
                        <button class="btn-icon" onclick="window.UsersHandler.openEditModal(${n.id})" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="btn-icon delete" onclick="window.UsersHandler.delete(${n.id})" title="Excluir" ${o?'disabled style="opacity:0.3;cursor:not-allowed"':""}>
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>`:"";return`
            <tr>
                <td><strong>${n.name}</strong></td>
                <td>${n.email}</td>
                <td><span class="badge" style="background: ${n.role==="Administrador"?"var(--accent)":"rgba(255,255,255,0.1)"}">${n.role}</span></td>
                ${a}
            </tr>`}).join(""))},openEditModal(e){const t=xe.find(n=>n.id===e);t&&(d.setText("modal-user-title","Editar Usuário"),d.setValue("user-id-form",t.id),d.setValue("user-name-form",t.name),d.setValue("user-email-form",t.email),d.setValue("user-password-form",""),d.setValue("user-role-form",t.role),d.show("modal-user"))},async save(e){e.preventDefault();const t=d.getValue("user-id-form"),n={name:d.getValue("user-name-form"),email:d.getValue("user-email-form"),password:d.getValue("user-password-form"),role:d.getValue("user-role-form")};try{t?await $.put(`/users/${t}`,n):await $.post("/users",n),d.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(t?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(e){if(confirm("Deseja excluir este usuário?"))try{await $.delete(`/users/${e}`),this.fetch()}catch(t){alert("Erro ao excluir: "+t.message)}},search(e){const t=xe.filter(n=>n.name.toLowerCase().includes(e)||n.email.toLowerCase().includes(e));this.render(t)}};let Pe=[],re="Geral",z=1;const Ee=10;let ht=[];const ae={async fetch(){try{z=1,Pe=await $.get("/documents"),this.filterAndRender()}catch(e){console.error("Error fetching Documents:",e)}},setActiveTab(e){re=e,z=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(t=>{const n=t.textContent.trim().toLowerCase();t.classList.toggle("active",n===e.toLowerCase())}),this.filterAndRender()},filterAndRender(){const e=document.querySelector(".docs-header");if(re.toLowerCase()==="dashboard")e&&(e.style.display="none"),d.hide("doc-list-container"),d.show("doc-dashboard-container"),this.renderDashboard();else{e&&(e.style.display="flex"),d.show("doc-list-container"),d.hide("doc-dashboard-container");const t=Pe.filter(n=>(n.category||"Geral").toLowerCase()===re.toLowerCase());this.render(t)}},calculateRemainingTime(e){if(!e||e==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const t=new Date;t.setHours(0,0,0,0);const n=new Date(e+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-t.getTime(),a=Math.ceil(o/(1e3*60*60*24));if(a<0){const s=Math.abs(a);let i=`Expirado há ${s} dia(s)`;return s>=30&&(i=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:i,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:a}}else{if(a===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:a};if(a<=30)return{text:`Expira em ${a} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:a};{const s=Math.floor(a/30);let i=`Expira em ${s} mês(es)`;if(s>=12){const r=Math.floor(s/12),l=s%12;i=`Expira em ${r} ano(s)${l>0?` e ${l} mês(es)`:""}`}return{text:i,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:a}}}},renderDashboard(){const e=document.getElementById("doc-dashboard-tbody");if(!e)return;const t=Pe.filter(g=>{const h=(g.category||"").toLowerCase();return h==="contratos"||h==="termo de uso"});let n=0,o=0,a=0,s=0;t.forEach(g=>{const h=(g.category||"").toLowerCase(),y=this.calculateRemainingTime(g.end_date);y.status==="expired"?s++:y.status==="critical"?(a++,h==="contratos"&&n++,h==="termo de uso"&&o++):(h==="contratos"&&n++,h==="termo de uso"&&o++)}),d.setText("doc-kpi-active-contracts",n),d.setText("doc-kpi-active-terms",o),d.setText("doc-kpi-warning-docs",a),d.setText("doc-kpi-expired-docs",s);const i=document.getElementById("doc-dash-search"),r=document.getElementById("doc-dash-filter-category"),l=document.getElementById("doc-dash-filter-status"),u=i?i.value.toLowerCase().trim():"",c=r?r.value:"Todos",m=l?l.value:"Todos";let p=t.filter(g=>{if(u&&!g.original_name.toLowerCase().includes(u)||c!=="Todos"&&(g.category||"").toLowerCase()!==c.toLowerCase())return!1;const h=this.calculateRemainingTime(g.end_date);return!(m!=="Todos"&&(m==="Ativos"&&(h.status==="expired"||h.status==="critical")||m==="Expirando"&&h.status!=="critical"||m==="Expirados"&&h.status!=="expired"||m==="Indeterminado"&&h.status!=="indefinite"))});if(p.sort((g,h)=>{const y=this.calculateRemainingTime(g.end_date),I=this.calculateRemainingTime(h.end_date),w={expired:1,critical:2,active:3,indefinite:4},E=w[y.status]||5,D=w[I.status]||5;return E!==D?E-D:y.days-I.days}),p.length===0){e.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const f=window.auth&&window.auth.isAdmin();e.innerHTML=p.map(g=>{const h=g.mimetype==="application/pdf"?"📕":"🖼️",y=g.start_date?new Date(g.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",I=g.end_date?g.end_date==="Indefinido"?"Indefinido":new Date(g.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",w=this.calculateRemainingTime(g.end_date),E=f?`<button class="btn-delete" onclick="window.DocsHandler.delete(${g.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
                <tr>
                    <td>
                        <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                            <span>${h}</span>
                            <span title="${g.original_name}">${g.original_name}</span>
                        </span>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.75rem;">
                            ${g.category}
                        </span>
                    </td>
                    <td>${y}</td>
                    <td>${I}</td>
                    <td>
                        <span class="badge" style="background: ${w.color}; color: ${w.textColor}; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                            ${w.text}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <a href="${g.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                Ver
                            </a>
                            ${E}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(e){const t=document.getElementById("doc-list-body");if(!t)return;const n=document.getElementById("doc-list-thead"),o=re.toLowerCase()==="contratos"||re.toLowerCase()==="termo de uso",a=window.auth&&window.auth.isAdmin(),s=a?"":'class="role-hidden"';ht=e;const i=e.length,r=Math.ceil(i/Ee);z>r&&(z=Math.max(1,r)),z<1&&(z=1);const l=(z-1)*Ee,u=e.slice(l,l+Ee);if(n&&(o?n.innerHTML=`
                    <tr>
                        <th>Nome</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Cadastro</th>
                        <th id="th-doc-actions" ${s}>Ações</th>
                    </tr>
                `:n.innerHTML=`
                    <tr>
                        <th>Nome</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th id="th-doc-actions" ${s}>Ações</th>
                    </tr>
                `),u.length===0){t.innerHTML=`
                <tr>
                    <td colspan="${o?7:5}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `,this.renderPaginationControls("doc-pagination",0,0);return}t.innerHTML=u.map(c=>{const m=c.mimetype==="application/pdf"?"📕":"🖼️",p=(c.size/1024).toFixed(1)+" KB",f=c.created_at?new Date(c.created_at).toLocaleDateString("pt-BR"):"-",g=c.mimetype==="application/pdf"?"PDF":"Imagem",h=a?`<button class="btn-delete" onclick="window.DocsHandler.delete(${c.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",y=c.start_date?new Date(c.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",I=c.end_date?c.end_date==="Indefinido"?"Indefinido":new Date(c.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-";return o?`
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${m}</span>
                                <span title="${c.original_name}">${c.original_name}</span>
                            </span>
                        </td>
                        <td>${p}</td>
                        <td>${g}</td>
                        <td>${y}</td>
                        <td>${I}</td>
                        <td>${f}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${c.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${h}
                            </div>
                        </td>
                    </tr>
                `:`
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${m}</span>
                                <span title="${c.original_name}">${c.original_name}</span>
                            </span>
                        </td>
                        <td>${p}</td>
                        <td>${g}</td>
                        <td>${f}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${c.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${h}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",r,i)},async handleUpload(e){e.preventDefault();const t=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!t.files.length){alert("Selecione um arquivo.");return}const a=new FormData,s=n?n.value:"Geral";a.append("category",s),a.append("customName",o?o.value:""),a.append("document",t.files[0]);const i=s.toLowerCase();if(i==="contratos"||i==="termo de uso"){const r=document.getElementById("doc-start-date"),l=document.getElementById("doc-end-date"),u=document.getElementById("doc-indefinite");r&&r.value&&a.append("startDate",r.value),u&&u.checked?a.append("endDate","Indefinido"):l&&l.value&&a.append("endDate",l.value)}try{await $.upload("/documents",a),d.hide("modal-upload"),document.getElementById("doc-form").reset();const r=document.getElementById("doc-dates-container");r&&(r.style.display="none");const l=document.getElementById("doc-end-date");l&&(l.disabled=!1),d.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(r){console.error(r),alert("Erro ao subir arquivo.")}},async delete(e){if(confirm("Deletar este documento?"))try{await $.delete(`/documents/${e}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(e){if(re.toLowerCase()==="dashboard")this.renderDashboard();else{z=1;const t=Pe.filter(n=>(n.category||"Geral").toLowerCase()===re.toLowerCase()&&n.original_name.toLowerCase().includes(e));this.render(t)}},changePage(e){z=e,this.render(ht)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${z===1?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${z-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=z-1&&l<=z+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===z?"active":""}" 
                            onclick="window.DocsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${z===t?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${z+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(z-1)*Ee+1,r=Math.min(z*Ee,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let oe=[],C={summaries:[]},yt=null,N=null,Qe="list",$e=null,te=null,vt=null,O=1;const ke=10;let Fe=[];const U={getPendingProcId(){return yt},async fetch(){try{O=1,oe=await $.get("/procedures"),this.renderTable(oe)}catch(e){console.error("Error fetching FAQs:",e)}},getFaqs(){return oe},setListingMode(e){Qe=e,O=1,this.renderTable(Fe.length?Fe:oe)},renderTable(e){const t=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!t||!n||!o)return;Fe=e;const a=e.length,s=Math.ceil(a/ke);O>s&&(O=Math.max(1,s)),O<1&&(O=1);const i=(O-1)*ke,r=e.slice(i,i+ke);Qe==="list"?(d.show("list-table-container"),d.hide("list-cards-container"),r.length===0?o.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            Nenhum procedimento encontrado.
                        </td>
                    </tr>
                `:o.innerHTML=r.map(u=>{const c=j.isAdmin()?`
                        <td>
                            <div class="btn-actions-container">
                                <button class="btn-icon edit" data-action="edit" data-id="${u.id}" title="Editar">
                                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                </button>
                                <button class="btn-icon delete" data-action="delete" data-id="${u.id}" title="Deletar">
                                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </td>`:"";return`
                    <tr data-action="open" data-id="${u.id}" class="draggable-row">
                        <td style="border-left: 5px solid ${u.color||"#4F46E5"}"><strong>${u.name||u.title||"Sem título"}</strong></td>
                        <td>${u.responsible||"N/A"}</td>
                        <td><span class="badge" style="background: var(--accent); color: var(--bg-dark);">${u.group_name||"N/A"}</span></td>
                        <td>${u.note||"-"}</td>
                        ${c}
                    </tr>`}).join("")):(d.hide("list-table-container"),d.show("list-cards-container"),r.length===0?n.innerHTML=`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum procedimento encontrado.
                    </div>
                `:n.innerHTML=r.map(u=>{const c=j.isAdmin()?`
                        <div class="card-footer">
                            <div class="btn-actions-container">
                                <button class="btn-icon edit" data-action="edit" data-id="${u.id}" title="Editar">
                                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                </button>
                                <button class="btn-icon delete" data-action="delete" data-id="${u.id}" title="Deletar">
                                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </div>`:"";return`
                    <div class="card draggable-card" data-action="open" data-id="${u.id}" style="border-top: 5px solid ${u.color||"#4F46E5"}">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <span class="badge" style="background: var(--accent); color: var(--bg-dark);">${u.group_name||"N/A"}</span>
                            </div>
                            <h3>${u.name||u.title||"Sem título"}</h3>
                            <div class="card-details" style="border: none; padding: 0;">
                                <div style="margin-bottom: 5px;"><strong>Responsável:</strong> ${u.responsible||"N/A"}</div>
                                ${u.note?`<div><strong>Nota:</strong> ${u.note}</div>`:""}
                            </div>
                        </div>
                        ${c}
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,a),(Qe==="list"?o:n).addEventListener("click",function(c){const m=c.target.closest('[data-action="edit"], [data-action="delete"]');if(m){c.stopPropagation(),c.preventDefault();const f=Number(m.dataset.id);m.dataset.action==="edit"?U.openEditModal(f):m.dataset.action==="delete"&&U.deleteProcedure(f);return}const p=c.target.closest('[data-action="open"]');if(p){const f=Number(p.dataset.id);U.openDetail(f)}})},openDetail(e){const t=oe.find(o=>o.id===e);if(!t)return;d.setText("detail-title",t.name||t.title||"Sem título"),d.setValue("proc-id",t.id);try{let o=t.content?JSON.parse(t.content):[];Array.isArray(o)?C={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?C=o:C={summaries:[]}}catch{C={summaries:[]}}C.summaries.length>0?N=C.summaries[0].id:N=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(e){const t=oe.find(n=>n.id===e);t&&(d.setText("modal-form-title","Editar Procedimento"),d.setValue("proc-id",t.id),d.setValue("proc-name",t.name||t.title||""),d.setValue("proc-responsible",t.responsible||""),d.setValue("proc-group",t.group_name||""),d.setValue("proc-note",t.note||""),d.setValue("proc-content",t.content||""),d.setValue("proc-color",t.color||"#4F46E5"),d.show("modal-form"))},async saveMeta(e){e&&e.preventDefault();const t=d.getValue("proc-id"),n={name:d.getValue("proc-name").toUpperCase(),responsible:d.getValue("proc-responsible").toUpperCase(),group_name:d.getValue("proc-group"),note:d.getValue("proc-note"),content:d.getValue("proc-content"),color:d.getValue("proc-color")};try{const o=t?`/procedures/${t}`:"/procedures";yt=(t?await $.put(o,n):await $.post(o,n)).id,d.hide("modal-form"),document.getElementById("faq-form").reset(),d.setValue("proc-responsible","TI"),d.setValue("proc-group","Geral"),await this.fetch(),d.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(e){if(confirm("Deseja excluir este procedimento?"))try{await $.delete(`/procedures/${e}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(e){const t=document.querySelector(".procedure-sidebar");e?(d.hide("procedure-view-container"),d.hide("procedure-view-sidebar"),d.show("procedure-edit-wrapper"),d.show("procedure-edit-sidebar"),d.hide("btn-floating-edit"),t&&t.classList.add("glass","has-border"),C.summaries.length>0?C.summaries.find(n=>n.id===N)||(N=C.summaries[0].id):N=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(d.show("procedure-view-container"),d.show("procedure-view-sidebar"),d.hide("procedure-edit-wrapper"),d.hide("procedure-edit-sidebar"),d.show("btn-floating-edit"),t&&t.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const e=document.getElementById("procedure-view-container"),t=document.getElementById("procedure-view-index");if(!e||!t)return;if(C.summaries.length===0){e.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',t.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";C.summaries.forEach((a,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${a.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${a.title}</li>`,n+=`<div id="sum-view-${a.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(C.summaries.length>1||a.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${a.title}</h4>`),a.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const i=a.sections.map((r,l)=>{let u="";if(r.type==="TEXTO")u=`<div class="gh-content"><div class="gh-text-view">${r.data||"Sem conteúdo."}</div></div>`;else if(r.type==="FAQ")u='<div class="gh-faq-list">'+(r.data||[]).map((p,f)=>`
                         <div class="gh-accordion" id="gh-faq-${a.id}-${l}-${f}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${a.id}-${l}-${f}')">
                                   <div class="gh-accordion-title">${p.q||"Pergunta sem título"}</div>
                                   <span class="gh-accordion-icon">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                   </span>
                              </div>
                              <div class="gh-accordion-content gh-text-view">${p.a||"Sem resposta."}</div>
                         </div>
                     `).join("")+"</div>";else if(r.type==="DOCUMENTO"&&r.data&&r.data.path){const m=r.data.mimetype&&r.data.mimetype.startsWith("image/"),p=r.data.mimetype==="application/pdf";let f="";m?f=`<div class="doc-embed-container"><img src="${r.data.path}" alt="${r.data.name}" class="doc-embed-image" /></div>`:p?f=`<div class="doc-embed-container" style="display: block;"><iframe src="${r.data.path}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="doc-embed-pdf" title="${r.data.name}"></iframe></div>`:f='<div class="doc-embed-container" style="padding: 20px; text-align: center; color: var(--text-muted);"><p>Visualização não disponível para este formato.</p></div>',u=`
                        <div class="gh-doc-container">
                            ${f}
                            <div class="doc-actions" style="margin-top: 15px; text-align: center;">
                                <a href="${r.data.path}" target="_blank" class="btn-secondary-small" style="display: inline-block;">
                                    Abrir/Download Original (${r.data.name})
                                </a>
                            </div>
                        </div>`}let c="var(--text-muted)";return r.type==="DOCUMENTO"?c="#10B981":r.type==="FAQ"?c="#FBBF24":r.type==="TEXTO"&&(c="#3B82F6"),`
                     <div class="gh-box">
                         <div class="gh-header" style="display: flex; align-items: center; gap: 10px;">
                             <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${c};"></span>
                             <h3>${r.title}</h3>
                         </div>
                         ${u}
                     </div>
                 `}).join("");n+=i,n+="</div>"}),t.innerHTML=o,e.innerHTML=n},filterProcedureContent(e){e=e.toLowerCase();const t=document.getElementById("procedure-view-container");if(!t)return;t.querySelectorAll(".gh-box").forEach(o=>{const a=o.querySelector(".gh-faq-list");let s=!1;const i=o.querySelector(".gh-header"),r=i?i.textContent.toLowerCase().includes(e):!1;a&&a.querySelectorAll(".gh-accordion").forEach(c=>{const m=c.textContent.toLowerCase();r||m.includes(e)?(c.classList.remove("hidden"),s=!0):c.classList.add("hidden")});const l=o.textContent.toLowerCase();r||l.includes(e)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const e=document.getElementById("procedure-edit-index"),t=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!e)return;e.innerHTML=C.summaries.map((a,s)=>`
             <li class="sidebar-index-item ${a.id===N?"active":""} editable-section style-none"
                 draggable="true" 
                 ondragstart="window.ProceduresHandler.handleSumDragStart(event, ${s})"
                 ondragover="window.ProceduresHandler.handleDragOver(event)"
                 ondrop="window.ProceduresHandler.handleSumDrop(event, ${s})"
                 ondragend="window.ProceduresHandler.handleDragEnd(event)"
                 onclick="window.ProceduresHandler.selectSummary('${a.id}')">
                 
                 <div style="display: flex; align-items: center; width: 100%;">
                     <span class="drag-handle" title="Arraste para mover" style="cursor: grab; margin-right: 8px;">
                         <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                     </span>
                     <input type="text" value="${a.title}" 
                            onclick="event.stopPropagation()"
                            onblur="window.ProceduresHandler.updateSummaryTitle('${a.id}', this.value)" 
                            placeholder="Nome do sumário">
                 </div>
                 <button class="btn-delete-section" style="margin-left: 5px; padding: 2px;"
                         onclick="event.stopPropagation(); window.ProceduresHandler.removeSummary('${a.id}')" title="Remover Sumário">
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
             </li>
            `).join("");const o=C.summaries.find(a=>a.id===N);o?(n.textContent=o.title,n.style.color="var(--text-main)",t.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",t.classList.add("hidden"))},selectSummary(e){N=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(e,t){const n=C.summaries.find(a=>a.id===e);n&&(n.title=t||"Sem título"),this.renderProcedureBuilderSidebar();const o=C.summaries.find(a=>a.id===N);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const e="sum_"+Date.now();C.summaries.push({id:e,title:`Sumário ${C.summaries.length+1}`,sections:[]}),N=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(e){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(C.summaries=C.summaries.filter(t=>t.id!==e),N===e&&(N=C.summaries.length>0?C.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const e=document.getElementById("procedure-edit-container");if(!e)return;if(!N){e.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const t=C.summaries.find(o=>o.id===N);if(!t)return;const n=t.sections;if(n.length===0){e.innerHTML=`<p class="empty-state">Nenhum campo em "${t.title}". Clique em "+ Novo Container" para começar.</p>`;return}e.innerHTML=n.map((o,a)=>`
             <div class="section-container glass editable-section" 
                  draggable="false" 
                  ondragstart="window.ProceduresHandler.handleSecDragStart(event, ${a}, '${t.id}')"
                  ondragover="window.ProceduresHandler.handleDragOver(event)"
                  ondrop="window.ProceduresHandler.handleSecDrop(event, ${a}, '${t.id}')"
                  ondragend="window.ProceduresHandler.handleDragEnd(event)">
                 <div class="section-header">
                     <span class="drag-handle" title="Segure para arrastar" style="cursor: grab; margin-right: 15px; color: var(--text-muted); display: flex;"
                           onmousedown="this.closest('.editable-section').setAttribute('draggable', 'true')"
                           onmouseup="this.closest('.editable-section').setAttribute('draggable', 'false')"
                           onmouseleave="this.closest('.editable-section').setAttribute('draggable', 'false')">
                         <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                     </span>
                     <input type="text" class="section-title-input" value="${o.title}" onblur="window.ProceduresHandler.updateSectionTitle(${a}, this.value)" placeholder="Título da Seção">
                     <span class="badge-type">${o.type}</span>
                     <button class="btn-delete-icon" onclick="window.ProceduresHandler.removeSection(${a})">&times;</button>
                 </div>
                 <div class="section-content" style="padding: 15px;">
                      <!-- Editor simplified for extraction -->
                      ${o.type==="TEXTO"?`
                      <div class="rte-container">
                          ${window.ProceduresHandler.getRteToolbarHTML()}
                          <div class="proc-textarea-edit" contenteditable="true" placeholder="Comece a digitar o conteúdo da seção..." 
                               oninput="window.ProceduresHandler.updateSectionData(${a}, this.innerHTML)" 
                               onblur="window.ProceduresHandler.updateSectionData(${a}, this.innerHTML)">${o.data||""}</div>
                      </div>
                      `:""}
                      ${o.type==="DOCUMENTO"?o.data?`<div class="doc-uploaded-state">
                              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                              <a href="${o.data.path}" target="_blank" class="doc-link">${o.data.name}</a> 
                              <button class="btn-remove-doc" onclick="window.ProceduresHandler.updateSectionData(${a}, null)" title="Remover Documento">Remover</button>
                          </div>`:`<div class="doc-dropzone" 
                                ondragover="event.preventDefault(); this.classList.add('dragover');" 
                                ondragleave="this.classList.remove('dragover');" 
                                ondrop="event.preventDefault(); this.classList.remove('dragover'); window.ProceduresHandler.handleSectionFileDrop(${a}, event);"
                                onclick="this.querySelector('input[type=file]').click();">
                              <input type="file" style="display: none;" onchange="window.ProceduresHandler.handleSectionFileUpload(${a}, this)">
                              <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" style="margin-bottom: 15px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <p><strong>Clique para selecionar</strong> ou arraste o arquivo aqui</p>
                              <span style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px;">Suporta PDF, Imagens (PNG, JPG)</span>
                          </div>`:""}
                      ${o.type==="FAQ"?`
                      <div class="faq-items">
                          ${(o.data||[]).map((s,i)=>`
                              <div class="faq-pair">
                                  <button class="btn-remove-faq" onclick="window.ProceduresHandler.removeFaqItem(${a}, ${i})" title="Remover Pergunta">&times;</button>
                                  <input type="text" placeholder="Pergunta" value="${s.q}" onchange="window.ProceduresHandler.updateFaqItem(${a}, ${i}, 'q', this.value)">
                                  
                                  <div class="rte-container" style="margin-top: 10px;">
                                      ${window.ProceduresHandler.getRteToolbarHTML()}
                                      <div class="proc-textarea-edit" style="min-height: 80px;" contenteditable="true" placeholder="Resposta da FAQ..."
                                           oninput="window.ProceduresHandler.updateFaqItem(${a}, ${i}, 'a', this.innerHTML)" 
                                           onblur="window.ProceduresHandler.updateFaqItem(${a}, ${i}, 'a', this.innerHTML)">${s.a||""}</div>
                                  </div>
                              </div>
                          `).join("")}
                          <button class="btn-secondary-small" style="align-self: flex-start; margin-top: 10px;" onclick="window.ProceduresHandler.addFaqItem(${a})">+ Adicionar Pergunta</button>
                      </div>
                      `:""}
                 </div>
             </div>`).join("")},handleSumDragStart(e,t){$e="summary",te=t,e.dataTransfer.effectAllowed="move",setTimeout(()=>{e.target&&e.target.classList.add("dragging")},0)},handleSumDrop(e,t){if(e.preventDefault(),$e!=="summary"||te===null||te===t)return;const n=C.summaries.splice(te,1)[0];C.summaries.splice(t,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(e,t,n){$e="container",te=t,vt=n,e.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=e.target.nodeType===1?e.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect="move"},handleSecDrop(e,t,n){if(e.preventDefault(),$e!=="container"||te===null||vt!==n)return;const o=C.summaries.find(s=>s.id===n);if(!o||te===t)return;const a=o.sections.splice(te,1)[0];o.sections.splice(t,0,a),this.renderProcedureBuilder()},handleDragEnd(e){document.querySelectorAll(".editable-section.dragging").forEach(t=>t.classList.remove("dragging")),e&&e.target&&e.target.setAttribute&&e.target.setAttribute("draggable","false"),$e=null,te=null},updateSectionTitle(e,t){const n=C.summaries.find(o=>o.id===N);n&&(n.sections[e].title=t)},updateSectionData(e,t){const n=C.summaries.find(o=>o.id===N);n&&(n.sections[e].data=t)},removeSection(e){const t=C.summaries.find(n=>n.id===N);t&&t.sections.splice(e,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
            <div class="rte-toolbar" onmousedown="if(!['SELECT', 'OPTION', 'INPUT'].includes(event.target.tagName)) event.preventDefault();">
                <select class="rte-select" onchange="document.execCommand('formatBlock', false, this.value); this.selectedIndex=0;" title="Formato">
                    <option value="">Formato</option>
                    <option value="H1">Título 1</option>
                    <option value="H2">Título 2</option>
                    <option value="H3">Título 3</option>
                    <option value="P">Parágrafo</option>
                </select>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('bold', false, null)" title="Negrito">
                    <svg viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('italic', false, null)" title="Itálico">
                    <svg viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('underline', false, null)" title="Sublinhado">
                     <svg viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                </button>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('justifyLeft', false, null)" title="Alinhar à Esquerda">
                    <svg viewBox="0 0 24 24"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('justifyCenter', false, null)" title="Centralizar">
                    <svg viewBox="0 0 24 24"><line x1="21" y1="6" x2="3" y2="6"/><line x1="19" y1="12" x2="5" y2="12"/><line x1="17" y1="18" x2="7" y2="18"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('justifyRight', false, null)" title="Alinhar à Direita">
                    <svg viewBox="0 0 24 24"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
                </button>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('insertUnorderedList', false, null)" title="Marcadores">
                    <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
                <button type="button" class="rte-btn" onclick="document.execCommand('insertOrderedList', false, null)" title="Numeração">
                    <svg viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
                </button>
                <span class="rte-separator"></span>
                <div style="display: flex; align-items: center; gap: 4px;" title="Cor do Texto">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                    <input type="color" class="rte-color-picker" value="#ffffff" oninput="document.execCommand('foreColor', false, this.value)">
                </div>
                <div style="display: flex; align-items: center; gap: 4px;" title="Cor de Fundo">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <input type="color" class="rte-color-picker" value="#000000" oninput="document.execCommand('hiliteColor', false, this.value)">
                </div>
                <span class="rte-separator"></span>
                <button type="button" class="rte-btn" onclick="document.execCommand('insertHorizontalRule', false, null)" title="Espaçador">
                    <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/></svg>
                </button>
            </div>
        `},addFaqItem(e){const t=C.summaries.find(n=>n.id===N);t&&(t.sections[e].data=t.sections[e].data||[],t.sections[e].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(e,t,n,o){const a=C.summaries.find(s=>s.id===N);a&&(a.sections[e].data[t][n]=o)},removeFaqItem(e,t){const n=C.summaries.find(o=>o.id===N);n&&n.sections[e].data.splice(t,1),this.renderProcedureBuilder()},addSection(e,t){if(!N){alert("Selecione primeiro um sumário na barra lateral.");return}const n=C.summaries.find(o=>o.id===N);n&&(n.sections.push({id:Date.now(),title:e,type:t,data:t==="FAQ"?[]:t==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(e,t){t.dataTransfer.files&&t.dataTransfer.files.length>0&&await this.uploadSectionFile(e,t.dataTransfer.files[0])},async handleSectionFileUpload(e,t){const n=t.files[0];n&&await this.uploadSectionFile(e,n)},async uploadSectionFile(e,t){const n=new FormData;n.append("file",t);try{const o=await $.upload("/upload",n),a=C.summaries.find(s=>s.id===N);a&&(a.sections[e].data={name:t.name,path:o.path,mimetype:t.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const e=parseInt(d.getValue("proc-id"));if(!e)return;const n={...oe.find(o=>o.id===e),content:JSON.stringify(C)};try{await $.put(`/procedures/${e}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(e),this.fetch()}catch{alert("Erro ao salvar")}},search(e){O=1;const t=oe.filter(n=>(n.name||n.title||"").toLowerCase().includes(e)||(n.responsible||"").toLowerCase().includes(e)||(n.group_name||"").toLowerCase().includes(e));this.renderTable(t)},changePage(e){O=e,this.renderTable(Fe)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${O===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${O-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=O-1&&l<=O+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===O?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${O===t?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${O+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(O-1)*ke+1,r=Math.min(O*ke,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};window.toggleGhAccordion=function(e){const t=document.getElementById(e);t&&t.classList.toggle("open")};let Y=[],ge="list",le="month",A=new Date,G=1;const Ie=10;let bt=[];const q={async fetch(){try{G=1,Y=await $.get("/accounts"),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(e){console.error("Falha ao obter contas",e)}},populateCompanyFilter(){const e=document.getElementById("dash-filter-company-dynamic-options");if(e){const t=new Set;e.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{t.add(a.value)});const n=[...new Set(Y.map(a=>a.company_name).filter(Boolean))].sort((a,s)=>a.localeCompare(s));let o="";n.forEach(a=>{const s=t.has(a)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${a}" ${s}> <span>${a}</span></label>`}),e.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(e){if(!document.getElementById(`${e}-container`))return;const n=document.getElementById(`${e}-trigger`),o=document.getElementById(`${e}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",r=>{r.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(l=>{l!==o&&l.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const a=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(r=>r.value!=="Todos"),i=()=>{const r=s.filter(u=>u.checked).map(u=>u.value),l=n.querySelector(".trigger-label");a.checked||s.length>0&&r.length===s.length?(a.checked=!0,l&&(l.innerText="Todos")):r.length===0?l&&(l.innerText="Nenhum"):r.length===1?l&&(l.innerText=r[0]):l&&(l.innerText=`${r.length} selecionados`)};a&&!a.dataset.listenerBound&&(a.addEventListener("change",()=>{s.forEach(r=>{r.checked=a.checked}),i(),this.renderDashboard()}),a.dataset.listenerBound="true"),s.forEach(r=>{r.dataset.listenerBound||(r.addEventListener("change",()=>{s.every(u=>u.checked)?a.checked=!0:a.checked=!1,i(),this.renderDashboard()}),r.dataset.listenerBound="true")}),i()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",e=>{e.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(t=>{t.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(e){const t=document.getElementById(`${e}-dropdown`);if(!t)return["Todos"];const n=t.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(e=>{const t=document.getElementById(`${e}-dropdown`);if(t){t.querySelectorAll('input[type="checkbox"]').forEach(a=>{a.checked=a.value==="Todos"});const o=document.getElementById(`${e}-trigger`);if(o){const a=o.querySelector(".trigger-label");a&&(a.innerText="Todos")}}})},getAccounts(){return Y},setAccountsViewMode(e){ge=e,this.handleSearch()},setCalendarSubView(e){le=e,this.handleSearch()},shiftCalendarDate(e){le==="day"?A.setDate(A.getDate()+e):le==="month"?A.setMonth(A.getMonth()+e):le==="year"&&A.setFullYear(A.getFullYear()+e),d.setValue("filter-day",A.getDate()),d.setValue("filter-month",A.getMonth()),d.setValue("filter-year",A.getFullYear()),this.handleSearch()},handleFilterChange(e=!1){if(e){const t=d.getValue("filter-cal-year")?parseInt(d.getValue("filter-cal-year")):A.getFullYear(),n=d.getValue("filter-cal-month")?parseInt(d.getValue("filter-cal-month")):A.getMonth();A=new Date(t,n,1)}else{const t=d.getValue("filter-year")?parseInt(d.getValue("filter-year")):A.getFullYear(),n=d.getValue("filter-month")?parseInt(d.getValue("filter-month")):A.getMonth(),o=d.getValue("filter-day")?parseInt(d.getValue("filter-day")):A.getDate();A=new Date(t,n,o)}d.setValue("filter-month",A.getMonth()),d.setValue("filter-year",A.getFullYear()),this.handleSearch()},handleSearch(){const e=(d.getValue("accounts-search")||"").toLowerCase();let t=Y.filter(n=>n.company_name.toLowerCase().includes(e)||n.description&&n.description.toLowerCase().includes(e));if(ge==="list"){G=1;const n=d.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),a=o?o.checked:!1,s=A.getFullYear(),i=A.getMonth(),r=A.getDate();t=t.filter(l=>{if(n&&l.status!==n)return!1;if(!a||!l.due_date)return!0;const[u,c,m]=l.due_date.split("-"),p=parseInt(u,10),f=parseInt(c,10)-1,g=parseInt(m,10);return l.type==="Único"?p===s&&f===i&&g===r:l.type==="Recorrente"?g===r:!0}),this.renderAccountsList(t)}else ge==="notificacoes"?this.renderNotifications():ge==="dashboard"?this.renderDashboard():this.renderCalendarWrapper(t)},checkAccountAlerts(){let e=!1;const t=new Date;t.setHours(0,0,0,0),Y.forEach(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a==="on"&&s==="pendente"&&o.due_date){const[i,r,l]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(l,10));u.setHours(0,0,0,0),u.getTime()<=t.getTime()&&(e=!0)}});const n=document.getElementById("icon-alert-bell");n&&(e?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const e=document.getElementById("accounts-notifications-body");if(!e)return;e.innerHTML="";const t=new Date;t.setHours(0,0,0,0);let n=Y.filter(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a!=="on"||s!=="pendente"||!o.due_date)return!1;const[i,r,l]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(l,10));return u.setHours(0,0,0,0),u.getTime()<=t.getTime()});if(n.length===0){e.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const a=document.createElement("tr");let s="Sem Data";if(o.due_date){const r=o.due_date.split("-");r.length===3&&(s=`${r[2]}/${r[1]}/${r[0]}`)}const i=j.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${o.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
            `:"";a.innerHTML=`
                <td>
                    <strong>${o.company_name}</strong>
                    <div style="margin-top: 4px;">
                        <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; font-size: 0.7rem; padding: 2px 6px;">
                            URGENTE
                        </span>
                    </div>
                </td>
                <td><span class="badge" style="background:${o.type==="Recorrente"?"rgba(79, 70, 229, 0.2)":"rgba(234, 179, 8, 0.2)"}; color:${o.type==="Recorrente"?"#818cf8":"#eab308"}">${o.type}</span></td>
                <td style="color: #ef4444; font-weight: bold;">${s}</td>
                <td><strong>R$ ${parseFloat(o.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></td>
                <td><span class="badge" style="background:rgba(234, 179, 8, 0.2); color:#eab308">${o.payment_status}</span></td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${o.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${i}
                    </div>
                </td>
            `,e.appendChild(a)})},renderAccountsList(e){const t=document.getElementById("accounts-table-body");if(!t)return;t.innerHTML="",this.renderSidebarMiniCalendar(),bt=e;const n=e.length,o=Math.ceil(n/Ie);G>o&&(G=Math.max(1,o)),G<1&&(G=1);const a=(G-1)*Ie,s=e.slice(a,a+Ie);if(s.length===0){t.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(i=>{const r=document.createElement("tr");let l="Sem Data";if(i.due_date){const m=i.due_date.split("-");m.length===3&&(l=`${m[2]}/${m[1]}/${m[0]}`)}const u=i.status==="Off",c=j.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${i.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon" onclick="window.AccountsHandler.delete(${i.id})" title="Excluir" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `:"";r.innerHTML=`
                <td>
                    <strong>${i.company_name}</strong>
                    <div style="margin-top: 4px;">
                        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd; font-size: 0.7rem; padding: 2px 6px;">
                            ${i.category||"Outros"}
                        </span>
                    </div>
                </td>
                <td>
                    <span class="badge" style="background:${i.type==="Recorrente"?"rgba(79, 70, 229, 0.2)":"rgba(234, 179, 8, 0.2)"}; color:${i.type==="Recorrente"?"#818cf8":"#eab308"}">
                        ${i.type}
                    </span>
                </td>
                <td>${l}</td>
                <td>
                    <strong>R$ ${parseFloat(i.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                </td>
                <td>
                    <span class="badge" style="background:${u?"rgba(239, 68, 68, 0.2)":"rgba(34, 197, 94, 0.2)"}; color:${u?"#f87171":"#4ade80"}">
                        ${i.status}
                    </span>
                </td>
                <td>
                    <span class="badge" style="background:${i.payment_status==="Pago"?"rgba(34, 197, 94, 0.2)":i.payment_status==="Pendente"?"rgba(234, 179, 8, 0.2)":"rgba(239, 68, 68, 0.2)"}; color:${i.payment_status==="Pago"?"#4ade80":i.payment_status==="Pendente"?"#eab308":"#f87171"}">
                        ${i.payment_status||"Pendente"}
                    </span>
                </td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${i.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${c}
                    </div>
                </td>
            `,t.appendChild(r)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(ge!=="dashboard")return;this.initDashboardMultiselects();const e=d.getValue("dash-filter-start"),t=d.getValue("dash-filter-end"),n=d.getValue("dash-filter-type")||"Todos",o=d.getValue("dash-filter-status")||"Todos",a=d.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),i=this.getMultiselectValues("dash-filter-company");let r=e?new Date(e+"T00:00:00"):null,l=t?new Date(t+"T23:59:59"):null;if(!r&&!l){const x=new Date;r=new Date(x.getFullYear(),x.getMonth(),1,0,0,0),l=new Date(x.getFullYear(),x.getMonth()+1,0,23,59,59)}else r?l||(l=new Date(2100,11,31)):r=new Date(2e3,0,1);let u=0,c=0,m=new Set,p=new Set,f=0,g=0,h=0,y="-",I=0,w=0,E={},D={},B={};Y.forEach(x=>{if(!x.due_date||n!=="Todos"&&x.type!==n||o!=="Todos"&&x.status!==o||a!=="Todos"&&x.payment_status!==a)return;if(!s.includes("Todos")){if(s.length===0)return;const T=x.category||"Outros";if(!s.includes(T))return}if(!i.includes("Todos")&&(i.length===0||!i.includes(x.company_name)))return;let S=0,v=new Date(r);v.setHours(0,0,0,0);let b=new Date(l);b.setHours(0,0,0,0);let L=3650;for(;v<=b&&L>0;){if(this.isEventOnDate(x,v.getFullYear(),v.getMonth(),v.getDate())){S++;const T=`${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}`;B[T]||(B[T]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const _=parseFloat(x.value||0);B[T].total+=_,x.payment_status==="Pago"&&(B[T].pago+=_),x.payment_status==="Pendente"&&(B[T].pendente+=_),x.type==="Recorrente"&&(B[T].fixo+=_),x.type==="Único"&&(B[T].variavel+=_)}v.setDate(v.getDate()+1),L--}if(S>0){const T=parseFloat(x.value||0)*S;u+=T,c+=S,m.add(x.category||"Outros"),p.add(x.company_name),x.payment_status==="Pago"&&(f+=T),x.payment_status==="Pendente"&&(g+=T),x.type==="Recorrente"&&(I+=T),x.type==="Único"&&(w+=T),T>h&&(h=T,y=x.company_name);const _=x.category||"Outros";D[_]=(D[_]||0)+T;const F=x.company_name||"Sem Empresa";E[F]=(E[F]||0)+T}}),d.setText("dash-metric-valor","R$ "+u.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-contas",c.toString()),d.setText("dash-metric-tipos",m.size.toString()),d.setText("dash-metric-empresas",p.size.toString()),d.setText("dash-metric-pago","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-pendente","R$ "+g.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-maior-valor","R$ "+h.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-maior-nome",y),d.setText("dash-metric-fixo","R$ "+I.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-variavel","R$ "+w.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const k=d.getValue("dash-sort-empresas")||"desc",R=d.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",E,k),this.renderTierList("dash-list-categorias",D,R),this.renderTimeChart(B)},renderTimeChart(e){window.timeChartInstance&&window.timeChartInstance.destroy();const t=document.getElementById("chart-dashboard-time");if(!t)return;const n=Object.keys(e).sort(),o=n.map(c=>{const[m,p]=c.split("-");return`${p}/${m}`}),a=n.map(c=>e[c].total),s=n.map(c=>e[c].pago),i=n.map(c=>e[c].pendente),r=n.map(c=>e[c].fixo),l=n.map(c=>e[c].variavel),u={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:a,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:i,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:r,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:l,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(c){let m=c.dataset.label||"";return m&&(m+=": "),c.parsed.y!==null&&(m+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(c.parsed.y)),m}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(c,m,p){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(c)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(t.getContext("2d"),u)},renderTierList(e,t,n){const o=document.getElementById(e);if(!o)return;const a=Object.entries(t);if(a.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}a.sort((r,l)=>n==="asc"?r[1]-l[1]:l[1]-r[1]);const s=a.slice(0,10);let i="";s.forEach(([r,l],u)=>{const c=u===0&&n==="desc",m=c?"🏆 ":u+1+". ";i+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${c?"bold":"normal"}; color: ${c?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${r}">
                        ${m}${r}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=i},renderCharts(e){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const t=document.getElementById("chart-category");if(t){const o={labels:Object.keys(e),datasets:[{data:Object.values(e),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(t.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],a=[];let s=new Date;for(let i=-5;i<=6;i++){let r=new Date(s.getFullYear(),s.getMonth()+i,1);o.push(r.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let l=0;Y.forEach(u=>{if(!u.due_date||u.status==="Off")return;const[c,m]=u.due_date.split("-"),p=new Date(parseInt(c),parseInt(m)-1,1);(u.type==="Recorrente"&&r.getTime()>=p.getTime()||u.type==="Único"&&r.getFullYear()===parseInt(c)&&r.getMonth()===parseInt(m)-1)&&(l+=parseFloat(u.value||0))}),a.push(l)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:a,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(e){const t={},n=[];return e.forEach(o=>{if(o.type==="Único")n.push(o);else if(!t[o.company_name])t[o.company_name]=o;else{const a=new Date(t[o.company_name].due_date||0);new Date(o.due_date||0)>a&&(t[o.company_name]=o)}}),[...n,...Object.values(t)]},isEventOnDate(e,t,n,o){if(!e.due_date)return!1;const[a,s,i]=e.due_date.split("-"),r=parseInt(a,10),l=parseInt(s,10)-1,u=parseInt(i,10);if(e.type==="Único")return t===r&&n===l&&o===u;if(e.type==="Recorrente"){const c=new Date(r,l,u).setHours(0,0,0,0);if(new Date(t,n,o).setHours(0,0,0,0)<c)return!1;const p=e.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(p)){const f=(t-r)*12+(n-l),g=new Date(t,n+1,0).getDate(),h=Math.min(u,g);if(o!==h||f<0)return!1;if(p==="1 mes")return!0;if(p==="3 meses")return f%3===0;if(p==="6 meses")return f%6===0;if(p==="1 ano")return n===l}else{const f=Date.UTC(r,l,u),g=Date.UTC(t,n,o),h=Math.round((g-f)/(1e3*60*60*24));if(p==="1 dia")return!0;if(p==="7 dias")return h%7===0;if(p==="15 dias")return h%15===0}}return!1},renderCalendarWrapper(e){const t=A.getFullYear(),n=A.getMonth(),o=A.getDate();le==="month"?this.renderCalendarMonth(e,t,n):le==="year"?this.renderCalendarYear(e,t):le==="day"&&this.renderCalendarDay(e,t,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const e=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],t=A.getFullYear(),n=A.getMonth(),o=A.getDate(),a=new Date(t,n,1).getDay(),s=new Date(t,n+1,0).getDate(),i=new Date,r=i.getFullYear(),l=i.getMonth(),u=i.getDate(),c=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let m="";c.forEach((g,h)=>{m+=`<option value="${h}" ${h===n?"selected":""}>${g}</option>`});let p="";for(let g=r-5;g<=r+5;g++)p+=`<option value="${g}" ${g===t?"selected":""}>${g}</option>`;let f=`
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.parentElement.children[1].value, this.value)">
                    ${m}
                </select>
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.value, this.parentElement.children[0].value)">
                    ${p}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button class="btn-primary" style="width: 100%; padding: 4px 0; justify-content: center; font-size: 0.85rem;" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${r}, ${l}, ${u})">Hoje</button>
            </div>
            <div class="smc-header">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div class="smc-grid">
        `;for(let g=0;g<a;g++)f+='<div class="smc-day empty"></div>';for(let g=1;g<=s;g++)f+=`<div class="smc-day ${g===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${t}, ${n}, ${g})">${g}</div>`;f+="</div>",e.forEach(g=>{g&&(g.innerHTML=f)})},changeMiniCalendarMonthYear(e,t){let n=A.getDate();const o=new Date(e,parseInt(t)+1,0).getDate();n>o&&(n=o),A=new Date(e,t,n);try{d.setValue("filter-cal-year",e),d.setValue("filter-cal-month",t)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(e,t,n){A=new Date(e,t,n);try{d.setValue("filter-cal-year",e),d.setValue("filter-cal-month",t)}catch{}if(ge==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(e,t,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];d.setText("calendar-date-display",`${o[n]} ${t}`);const a=document.getElementById("calendar-month-grid");a.innerHTML="";const s=new Date(t,n,1).getDay(),i=new Date(t,n+1,0).getDate(),r=new Date,l=r.getFullYear()===t&&r.getMonth()===n;new Date(r.getFullYear(),r.getMonth(),1);for(let c=0;c<s;c++)a.innerHTML+='<div class="calendar-day empty"></div>';for(let c=1;c<=i;c++){const m=l&&r.getDate()===c?"today":"";a.innerHTML+=`<div class="calendar-day ${m}" id="cal-day-cell-${c}">
                <div class="calendar-date">${c}</div>
                <div class="calendar-events" id="cal-events-${c}"></div>
            </div>`}this.getLatestRecorrenteAccounts(e).forEach(c=>{if(!c.due_date)return;const m=new Date(t,n,1),p=new Date(r.getFullYear(),r.getMonth(),1);let f=!0;if(c.status==="Off"&&m.getTime()>=p.getTime()&&(f=!1),!!f){for(let g=1;g<=i;g++)if(this.isEventOnDate(c,t,n,g)){const h=document.getElementById(`cal-events-${g}`);if(h){const y=`${t}-${String(n+1).padStart(2,"0")}-${String(g).padStart(2,"0")}`;let I=c.payment_status==="Pago"?"event-paid":c.payment_status==="Pendente"?"event-pending":"event-canceled";c.type==="Recorrente"&&y!==c.due_date&&(I="event-pending");const w=document.createElement("div");w.className=`event-pill event-${c.type.toLowerCase()} ${I}`,w.title=c.company_name,w.innerText=c.company_name,w.onclick=E=>{this.openDedicatedPage(c.id,y)},h.appendChild(w)}}}})},renderCalendarDay(e,t,n,o){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];d.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${a[n]} de ${t}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const i=new Date(t,n,o),r=new Date;r.setHours(0,0,0,0),i.setHours(0,0,0,0);let l=0;this.getLatestRecorrenteAccounts(e).forEach(c=>{let m=!0;if(c.status==="Off"&&i.getTime()>=r.getTime()&&(m=!1),!!m&&this.isEventOnDate(c,t,n,o)){l++;const p=`${t}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let f=c.payment_status==="Pago"?"#4ade80":c.payment_status==="Pendente"?"#facc15":"#ef4444";c.type==="Recorrente"&&p!==c.due_date&&(f="#facc15"),s.innerHTML+=`
                    <div class="day-event-row ${c.type.toLowerCase()}">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${f}; margin-top: 5px;"></div>
                        <div class="day-evt-info">
                            <h4>${c.company_name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8">(${c.type} - ${c.category||"Outros"})</span></h4>
                            <p style="font-weight: bold; color: var(--text-main); margin: 4px 0;">R$ ${parseFloat(c.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                            <p>${c.description||"Nenhuma descrição detalhada."}</p>
                        </div>
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${c.id}, '${p}')" title="Detalhes">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                `}}),l===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(e,t){d.setText("calendar-date-display",`Ano de ${t}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],a=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const i=new Date(t,s,1);let r=0,l=0,u=0;this.getLatestRecorrenteAccounts(e).forEach(p=>{let f=!0;if(p.status==="Off"&&i.getTime()>=a.getTime()&&(f=!1),!f)return;const g=new Date(t,s+1,0).getDate();for(let h=1;h<=g;h++)this.isEventOnDate(p,t,s,h)&&(r++,p.type==="Recorrente"?l++:u++)});const m=r>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${m}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${r}</strong></p>
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${l}</p>`:""}
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${u}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(e){A.setMonth(e),d.setValue("filter-month",e),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(e=null){document.getElementById("account-form").reset();const t=document.getElementById("account-type");if(t.onchange=()=>{t.value==="Recorrente"?d.show("account-frequency-group"):d.hide("account-frequency-group")},e){d.setText("account-modal-title","Editar Conta");const n=Y.find(o=>o.id===e);n&&(d.setValue("account-id",n.id),d.setValue("account-company",n.company_name),d.setValue("account-type",n.type),d.setValue("account-category",n.category||"Outros"),d.setValue("account-frequency",n.frequency||"1 mes"),d.setValue("account-value",parseFloat(n.value||0).toFixed(2)),d.setValue("account-status",n.status),d.setValue("account-payment-status",n.payment_status||"Pendente"),d.setValue("account-due-date",n.due_date||""),d.setValue("account-description",n.description||""),d.setValue("account-observation",n.observation||""),t.onchange())}else d.setText("account-modal-title","Nova Conta"),d.setValue("account-id",""),t.onchange();d.show("account-modal-form")},openDedicatedPage(e,t=null){const n=Y.find(p=>p.id===e);if(!n)return;let o=Y.filter(p=>p.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((p,f)=>new Date(f.due_date||0)-new Date(p.due_date||0)),d.hide("accounts-section"),d.show("dedicated-account-page"),d.setText("ded-acc-company",n.company_name);let a=0,s=0,i=0;const r=new Date;r.setHours(0,0,0,0),this.currentCompanyHistory.forEach(p=>{const f=parseFloat(p.value||0);if(p.payment_status==="Pago")a+=f,i++;else if(p.payment_status==="Pendente"&&p.due_date){const[g,h,y]=p.due_date.split("-"),I=new Date(parseInt(g,10),parseInt(h,10)-1,parseInt(y,10));I.setHours(0,0,0,0),I.getTime()<r.getTime()&&(s+=f)}});const l=a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),u=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});d.setText("ded-acc-total-paid","R$ "+l),d.setText("ded-acc-total-pending","R$ "+u),d.setText("ded-acc-total-count",i.toString());const c=document.getElementById("ded-acc-status-badge");n.status==="On"?c.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':c.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,t);const m=document.getElementById("btn-ded-add-history");m&&(m.onclick=()=>{this.openAccountModal(),setTimeout(()=>{d.setValue("account-company",n.company_name),d.setValue("account-type",n.type),d.setValue("account-category",n.category)},100)},j.isAdmin()||(m.style.display="none"))},injectCurrentMonthProjections(e){const t=new Date,n=t.getFullYear(),o=t.getMonth(),a=new Date(n,o+1,0).getDate();let s=null;if(e.forEach(l=>{l.type==="Recorrente"&&(s?new Date(l.due_date||0)>new Date(s.due_date||0)&&(s=l):s=l)}),!s)return e;const i=[...e],r=new Set(e.map(l=>l.due_date));for(let l=1;l<=a;l++)if(this.isEventOnDate(s,n,o,l)){const u=`${n}-${String(o+1).padStart(2,"0")}-${String(l).padStart(2,"0")}`;r.has(u)||i.push({...s,is_projection:!0,due_date:u,payment_status:"Pendente",unique_key:s.id+"_"+u})}return i.forEach(l=>{l.unique_key||(l.unique_key=l.id.toString())}),i},renderDedicatedHistoryList(){const e=document.getElementById("ded-acc-history-list");if(e){if(e.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){e.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(t=>{let n="Sem Data";if(t.due_date){const i=t.due_date.split("-");i.length===3&&(n=`${i[2]}/${i[1]}/${i[0]}`)}const o=parseFloat(t.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let a="#eab308";t.payment_status==="Pago"?a="#4ade80":t.payment_status==="Cancelado"&&(a="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==t.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===t.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(t.id,t.is_projection?t.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${a}22; color: ${a}; font-size: 0.75rem;">${t.payment_status||"Pendente"}</span>
                </div>
            `,e.appendChild(s)})}},selectHistoryItem(e,t=null){this.currentSelectedHistoryKey=t?e+"_"+t:e.toString(),this.renderDedicatedHistoryList();let n=null;if(t&&(n=this.currentCompanyHistory.find(r=>r.id===e&&r.due_date===t&&r.is_projection)),n||(n=this.currentCompanyHistory.find(r=>r.id===e&&!r.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){d.show("ded-acc-details-empty"),d.hide("ded-acc-details-content");return}d.hide("ded-acc-details-empty"),d.show("ded-acc-details-content");let o="DD/MM/YYYY";const a=t||n.due_date;if(a){const r=a.split("-");r.length===3&&(o=`${r[2]}/${r[1]}/${r[0]}`)}d.setText("ded-acc-det-date",o),d.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),d.setValue("ded-acc-det-date-input",a||""),d.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),d.setValue("ded-acc-det-account-status-input",n.status||"On"),d.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(d.show("ded-acc-det-freq-group"),d.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):d.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const r={...n,value:d.getValue("ded-acc-det-val-input"),due_date:d.getValue("ded-acc-det-date-input"),payment_status:d.getValue("ded-acc-det-status-input"),status:d.getValue("ded-acc-det-account-status-input"),observation:d.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?d.getValue("ded-acc-det-freq-input"):"1 mes"};try{await $.put(`/accounts/${n.id}`,r),alert("Fatura atualizada com sucesso!"),await this.fetch(),this.currentCompanyHistory=Y.filter(l=>l.company_name===n.company_name).sort((l,u)=>new Date(u.due_date||0)-new Date(l.due_date||0)),this.openDedicatedPage(n.id)}catch{alert("Erro ao atualizar fatura.")}},j.isAdmin()||(s.style.display="none"));const i=document.getElementById("btn-ded-delete-account");i&&(i.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await $.delete(`/accounts/${n.id}`),await this.fetch();const r=Y.filter(l=>l.company_name===n.company_name);r.length>0?this.openDedicatedPage(r[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},j.isAdmin()||(i.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(e){document.getElementById("ded-acc-file-input");const t=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),e.attachment_path){d.hide("ded-acc-upload-area"),d.show("ded-acc-preview-area");const n=e.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),a=e.attachment_path.split("/").pop()||"documento";d.setText("ded-acc-preview-name",a);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async r=>{r.preventDefault();const l=s.innerText;s.innerText="Carregando...";try{const u=await fetch(e.attachment_path);if(!u.ok)throw new Error("Doc não encontrado");const c=await u.blob(),m=window.URL.createObjectURL(c);window.open(m,"_blank")}catch(u){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",u)}finally{s.innerText=l}},n?(o.innerHTML="",o.style.backgroundImage=`url('${e.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const i=document.getElementById("btn-ded-remove-attachment");i.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await $.put(`/accounts/${e.id}`,{...e,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=Y.filter(r=>r.company_name===e.company_name).sort((r,l)=>new Date(l.due_date||0)-new Date(r.due_date||0)),this.selectHistoryItem(e.id)}catch{alert("Erro ao remover anexo")}},j.isAdmin()||(i.style.display="none")}else{if(d.show("ded-acc-upload-area"),d.hide("ded-acc-preview-area"),j.isAdmin())t.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,t.style.cursor="pointer";else{t.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',t.style.cursor="default";return}t.onclick=s=>{const i=document.getElementById("ded-acc-file-input");i&&s.target!==i&&i.click()},t.addEventListener("dragover",s=>{s.preventDefault(),t.style.borderColor="var(--accent)",t.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{t.style.borderColor="rgba(255,255,255,0.2)",t.style.background="rgba(0,0,0,0.1)"};t.addEventListener("dragleave",()=>{n()});const o=async s=>{if(!s)return;t.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const i=new FormData;i.append("file",s);try{const r=await fetch("/api/upload",{method:"POST",body:i}),l=await r.json();r.ok?(await $.put(`/accounts/${e.id}`,{...e,attachment_path:l.path}),await this.fetch(),this.currentCompanyHistory=Y.filter(u=>u.company_name===e.company_name).sort((u,c)=>new Date(c.due_date||0)-new Date(u.due_date||0)),this.selectHistoryItem(e.id)):(alert(l.error||"Erro no upload"),this.selectHistoryItem(e.id))}catch(r){alert("Falha na comunicação: "+r.message),console.error("Upload Error:",r),this.selectHistoryItem(e.id)}};t.addEventListener("drop",async s=>{if(s.preventDefault(),n(),s.dataTransfer.files.length>0){const i=s.dataTransfer.files[0];await o(i)}});const a=document.getElementById("ded-acc-file-input");a&&(a.onclick=s=>{s.stopPropagation()},a.onchange=async s=>{const i=s.target.files[0];await o(i)})}},async save(e){e.preventDefault();const t=d.getValue("account-id"),n={company_name:d.getValue("account-company"),type:d.getValue("account-type"),category:d.getValue("account-category"),value:d.getValue("account-value"),status:d.getValue("account-status"),payment_status:d.getValue("account-payment-status"),due_date:d.getValue("account-due-date"),description:d.getValue("account-description"),observation:d.getValue("account-observation"),frequency:d.getValue("account-type")==="Recorrente"?d.getValue("account-frequency"):"1 mes"};try{const o=t?`/accounts/${t}`:"/accounts";t?await $.put(o,n):await $.post(o,n),d.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(e){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await $.delete(`/accounts/${e}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(e){G=e,this.renderAccountsList(bt)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${G===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${G-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=G-1&&l<=G+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===G?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${G===t?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${G+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(G-1)*Ie+1,r=Math.min(G*Ie,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let ue=[],X={},ie=null,Ke=null,Xe=null,Ze=!1,Te=!1,Be=!1,W=[],Ue=[],rt={},ee={},be,dt,Ye,Je,It,We;const Tt={init(){be=document.getElementById("timeline-event-form"),dt=document.getElementById("view-visualizacao"),Ye=document.getElementById("view-attention"),Je=document.getElementById("view-anexo"),It=document.getElementById("view-relatorio"),We=document.getElementById("view-config"),window.timelineHandler=Tt,window.applyFilters=Rt,window.clearFilters=Pt,window.toggleFilters=Ft,window.handleDelete=_t,window.resetForm=pt,window.toggleAccordion=Lt,window.handleFormSubmit=xt,window.editEvent=ut,window.deleteTopic=jt,window.deleteSubtopic=Gt,window.handleTrackDragStart=Ut,window.handleTrackDragOver=Yt,window.handleTrackDragEnd=Jt;const e=document.getElementById("timeline-topic-form");e&&(e.onsubmit=Ot);const t=document.getElementById("timeline-subtopic-form");t&&(t.onsubmit=qt);const n=document.getElementById("topico");n&&(n.onchange=u=>{ct(u.target.value)});const o=document.getElementById("em-ocorrencia");o&&(o.onchange=u=>{const c=document.getElementById("fim"),m=document.getElementById("inicio");if(u.target.checked){if(!m.value){const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),m.value=p.toISOString().slice(0,16)}c.required=!1}else{const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),c.value=p.toISOString().slice(0,16),c.required=!0}});const a=document.getElementById("auto-refresh-toggle");a&&(a.onchange=u=>{Bt(u.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(u=>{u.onclick=c=>{const m=c.currentTarget.getAttribute("data-timeline-tab");Re(m)}}),be&&(be.onsubmit=xt);const s=document.getElementById("rep-filter-start"),i=document.getElementById("rep-filter-end"),r=document.getElementById("rep-filter-topic"),l=document.getElementById("rep-filter-subtopic");s&&(s.onchange=()=>Ae()),i&&(i.onchange=()=>Ae()),r&&(r.onchange=u=>{zt(u.target.value),Ae()}),l&&(l.onchange=()=>Ae()),window._timelineSectionChangeHandler&&window.removeEventListener("SectionChange",window._timelineSectionChangeHandler),window._timelineSectionChangeHandler=u=>{u.detail&&u.detail.section==="timeline"&&pe().then(()=>{ne(),wt()})},window.addEventListener("SectionChange",window._timelineSectionChangeHandler),pe().then(()=>{ne(),wt()})}};window._timelineFocusHandler&&window.removeEventListener("focus",window._timelineFocusHandler);window._timelineFocusHandler=()=>{dt&&ne()};window.addEventListener("focus",window._timelineFocusHandler);function ct(e,t=null){const n=document.getElementById("sub-topico");if(!n)return;const o=e?e.toLowerCase().trim():"";if(!o||!ee[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',ee[o].forEach(a=>{const s=document.createElement("option");s.value=a.toLowerCase(),s.textContent=a,t&&s.value===t.toLowerCase()&&(s.selected=!0),n.appendChild(s)}),t||(n.selectedIndex=1),n.classList.add("has-options")}async function pe(){try{const e=await fetch("/api/timeline/config");if(!e.ok)throw new Error("Falha ao buscar configurações");const t=await e.json();W=t.topics||[],Ue=t.subtopics||[],rt={},ee={},W.forEach(o=>{rt[o.id]=o.color,ee[o.id]=[]}),Ue.forEach(o=>{const a=o.topic_id;ee[a]&&ee[a].push(o.name)}),Ht();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&St()}catch(e){console.error("Error loading config:",e)}}function Ht(){const e=document.getElementById("topico");if(e){const o=e.value;e.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',W.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,e.appendChild(s)}),e.value=o}const t=document.getElementById("rep-filter-topic");if(t){const o=t.value;t.innerHTML='<option value="Todos">Todos</option>',W.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,t.appendChild(s)}),o&&[...t.options].some(a=>a.value===o)?t.value=o:t.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',W.forEach(o=>{const a=document.createElement("option");a.value=o.id,a.textContent=o.name,n.appendChild(a)}))}function ne(){fetch("/api/timeline/events").then(e=>{if(!e.ok)throw new Error("Failed to fetch");return e.json()}).then(e=>{ue=e,mt(),Ye&&Ye.classList.contains("active")&&Ct()}).catch(e=>{console.error("Error loading events:",e)})}function wt(){const e=document.getElementById("timeline-tab-anexo"),t=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())e&&e.classList.remove("role-hidden"),t&&t.classList.remove("role-hidden");else{e&&e.classList.add("role-hidden"),t&&t.classList.add("role-hidden");const o=Je&&Je.classList.contains("active"),a=We&&We.classList.contains("active");(o||a)&&Re("visualizacao")}}function Re(e){const t={visualizacao:{section:dt,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:Ye,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:Je,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:It,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:We,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(t).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),t[e]&&(t[e].section&&t[e].section.classList.add("active"),t[e].button&&t[e].button.classList.add("active")),e==="visualizacao"?(ne(),Le(!0)):e==="attention"?(Ct(),Le(!0)):e==="relatorio"?(Ae(),Le(!1)):(e==="config"&&St(),Le(!1))}function Le(e){const t=document.getElementById("floating-refresh-control");if(t)if(e){t.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!ie&&Bt(!0)}else t.classList.add("hidden"),ie&&(clearInterval(ie),ie=null)}function Bt(e){ie&&(clearInterval(ie),ie=null),e&&(ne(),ie=setInterval(ne,6e4))}function xt(e){if(e.preventDefault(),Ze){console.warn("[Timeline] O salvamento já está em andamento. Ignorando envio duplicado.");return}Ze=!0;const t=be.querySelector('button[type="submit"]');t&&(t.textContent="Salvando...",t.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async a=>{const s=await a.text();if(!a.ok)throw new Error(`Server error (${a.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),pt(),Re("visualizacao")}).catch(a=>{console.error("Error saving event:",a),alert("Erro ao salvar evento: "+a.message)}).finally(()=>{t&&(t.textContent="Salvar Evento",t.disabled=!1),Ze=!1})}function ut(e){const t=ue.find(s=>s.id===e);if(!t)return;document.getElementById("event-id").value=t.id,document.getElementById("nome").value=t.nome;const n=Me(t.topico);document.getElementById("topico").value=n,ct(n,t.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=t.em_ocorrencia==1||t.em_ocorrencia==="true"||!t.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=t.inicio,document.getElementById("fim").value=t.fim||"",document.getElementById("descricao").value=t.descricao||"",document.getElementById("anotacao").value=t.anotacao||"",document.getElementById("cor").value=t.cor||"#000000",Re("anexo");const a=document.getElementById("btn-delete");a&&(a.style.display="block")}function pt(){be&&be.reset();const e=document.getElementById("event-id");e&&(e.value=""),ct("");const t=document.getElementById("fim");t&&(t.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function _t(){const e=document.getElementById("event-id").value;e&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Failed to delete");return t.json()}).then(()=>{alert("Evento excluído!"),pt(),Re("visualizacao")}).catch(t=>{console.error("Error deleting:",t),alert("Erro ao excluir: "+t.message)})}function Rt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`),a=t&&t.value?new Date(t.value).getTime():null,s=n&&n.value?new Date(n.value).getTime():null,i=o?o.value:"";X[e]={start:a,end:s,subTopic:i},mt()}function Pt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`);t&&(t.value=""),n&&(n.value=""),o&&(o.value=""),X[e]=null,mt()}function Ft(e){const t=document.getElementById(`filters-panel-${e}`),n=document.getElementById(`btn-toggle-${e}`);t&&n&&(t.classList.toggle("hidden"),n.classList.toggle("active"))}function Lt(e){const t=document.getElementById(e);t&&t.classList.toggle("active")}function mt(){const e=document.getElementById("timeline-tracks-container");if(!e)return;const t=Array.from(e.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId),n=W.map(a=>a.id);if(t.length!==n.length||!n.every(a=>t.includes(a))){e.innerHTML="";const a=window.auth&&window.auth.isAdmin(),s=a?'style="cursor: grab;"':"";W.forEach(i=>{const r=`
                <div class="timeline-container" data-topic-id="${i.id}" draggable="false"
                     ondragstart="window.handleTrackDragStart(event, '${i.id}')"
                     ondragover="window.handleTrackDragOver(event)"
                     ondragend="window.handleTrackDragEnd(event)">
                    <div class="topic-header" ${s}
                         ${a?`
                         onmousedown="this.closest('.timeline-container').setAttribute('draggable', 'true')"
                         onmouseup="this.closest('.timeline-container').setAttribute('draggable', 'false')"
                         onmouseleave="this.closest('.timeline-container').setAttribute('draggable', 'false')"`:""}>
                        <div class="topic-indicator" style="background-color: ${i.color};"></div>
                        <h2>${i.name}</h2>
                        <div class="sla-container">SLA: <span id="sla-${i.id}">100%</span></div>
                    </div>
                    <div class="timeline-filters-wrapper">
                        <button class="filters-toggle" onclick="toggleFilters('${i.id}')" id="btn-toggle-${i.id}">
                            <span class="hamburger-icon">☰</span>
                            <span>Filtros</span>
                            <span class="toggle-arrow">▼</span>
                        </button>
                        <div class="timeline-filters hidden" id="filters-panel-${i.id}">
                            <div class="filter-group">
                                <label for="filter-start-${i.id}">De:</label>
                                <input type="datetime-local" id="filter-start-${i.id}" min="2026-01-01T00:00" onchange="applyFilters('${i.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-end-${i.id}">Até:</label>
                                <input type="datetime-local" id="filter-end-${i.id}" min="2026-01-01T00:00" onchange="applyFilters('${i.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-sub-topic-${i.id}">Eventos:</label>
                                <select id="filter-sub-topic-${i.id}" onchange="applyFilters('${i.id}')">
                                    <option value="">Todos</option>
                                </select>
                            </div>
                            <button class="btn-clear-filter" onclick="clearFilters('${i.id}')" title="Limpar Filtro">×</button>
                        </div>
                    </div>
                    <div class="timeline-helper-dates">
                        <span id="min-date-${i.id}"></span>
                        <span id="max-date-${i.id}"></span>
                    </div>
                    <div class="timeline-track-container">
                        <div class="timeline-track" id="track-${i.id}"></div>
                    </div>
                </div>
            `;e.insertAdjacentHTML("beforeend",r);const l=document.getElementById(`filter-sub-topic-${i.id}`);l&&ee[i.id]&&ee[i.id].forEach(u=>{const c=document.createElement("option");c.value=u.toLowerCase(),c.textContent=u,l.appendChild(c)})})}W.forEach(a=>{const s=document.getElementById(`track-${a.id}`),i=document.getElementById(`min-date-${a.id}`),r=document.getElementById(`max-date-${a.id}`);s&&(s.innerHTML=""),i&&(i.textContent=""),r&&(r.textContent="")}),ue.length!==0&&W.forEach(a=>{const s=a.id,i=ue.filter(y=>Me(y.topico)===s);let r=i;X[s]&&X[s].subTopic&&(r=i.filter(y=>(y.sub_topico?y.sub_topico.toLowerCase():"")===X[s].subTopic.toLowerCase()));const l=X[s]&&X[s].start?X[s].start:new Date("2026-01-01T00:00:00").getTime(),u=X[s]&&X[s].end?X[s].end:Date.now();Nt(s,r,l,u);const c=l,m=u,p=m-c,f=document.getElementById(`min-date-${s}`),g=document.getElementById(`max-date-${s}`);f&&(f.textContent=new Date(c).toLocaleDateString()+" "+new Date(c).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),g&&(g.textContent=new Date(m).toLocaleDateString()+" "+new Date(m).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const h=document.getElementById(`track-${s}`);h&&r.forEach(y=>{const I=new Date(y.inicio).getTime(),w=y.fim?new Date(y.fim).getTime():Date.now();if(w<c||I>m)return;const E=Math.max(I,c),D=Math.min(w,m),B=(E-c)/p*100,k=(D-E)/p*100;if(k<=0)return;const R=document.createElement("div");R.className="timeline-bar",R.style.left=`${B}%`,R.style.width=`${k}%`,R.style.color=y.cor&&y.cor!=="#000000"?y.cor:rt[s]||"#6b7280";const x=document.createElement("div");x.className="timeline-bar-visual",R.appendChild(x);const S=document.createElement("div");S.className="timeline-identifier-point";const v=new Date(y.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),b=y.fim?new Date(y.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",L=a.name,T=y.sub_topico?y.sub_topico.charAt(0).toUpperCase()+y.sub_topico.slice(1):"-";S.setAttribute("data-tooltip",`Tópico: ${L}
Eventos: ${T}
Início: ${v} - Fim: ${b}
Descrição: ${y.descricao||"-"}`),!y.fim&&S.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(S.style.cursor="pointer",S.onclick=F=>{F.stopPropagation(),ut(y.id)}):S.style.cursor="default",R.appendChild(S),h.appendChild(R)})})}function Me(e){return e?e.toLowerCase().trim():""}function Nt(e,t,n,o){const a=document.getElementById(`sla-${e}`);if(!a)return;const s=o-n;if(s<=0){a.textContent="N/A";return}const r=t.filter(p=>{const f=new Date(p.inicio).getTime();return(p.fim?new Date(p.fim).getTime():Date.now())>n&&f<o}).map(p=>({start:Math.max(new Date(p.inicio).getTime(),n),end:Math.min(p.fim?new Date(p.fim).getTime():Date.now(),o)}));r.sort((p,f)=>p.start-f.start);const l=[];if(r.length>0){let p=r[0];for(let f=1;f<r.length;f++){const g=r[f];g.start<p.end?p.end=Math.max(p.end,g.end):(l.push(p),p=g)}l.push(p)}let u=0;l.forEach(p=>{u+=p.end-p.start});const c=(s-u)/s*100;let m="#10b981";c<50?m="#ef4444":c<90&&(m="#f97316"),a.style.color=m,a.textContent=c.toFixed(4)+"%"}function Ct(){const e=document.getElementById("attention-topics-container");if(!e)return;e.innerHTML="";const t=ue.filter(n=>!n.fim);W.forEach(n=>{const o=n.id,a=t.filter(h=>Me(h.topico)===o),s=document.createElement("div");s.className=a.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const i=document.createElement("div");i.className="accordion-header",i.onclick=()=>Lt(`attn-acc-${o}`);const r=document.createElement("div");r.className="accordion-title-group";const l=document.createElement("div");l.className="topic-indicator",l.style.backgroundColor=n.color;const u=document.createElement("h3");u.textContent=n.name;const c=document.createElement("span");c.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",c.textContent=`${a.length}`,r.appendChild(l),r.appendChild(u),r.appendChild(c);const m=document.createElement("span");m.className="accordion-chevron",m.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',i.appendChild(r),i.appendChild(m);const p=document.createElement("div");p.className="accordion-content";const f=document.createElement("div");f.className="accordion-body";const g=document.createElement("div");if(g.className="attention-carousel",a.length===0){const h=document.createElement("div");h.className="empty-state",h.textContent="Nenhum evento em andamento.",g.appendChild(h)}else a.forEach(h=>{const y=document.createElement("div");y.className="attention-card",y.style.borderLeftColor=h.cor&&h.cor!=="#000000"?h.cor:n.color;const I=document.createElement("h3");I.textContent=h.nome;const w=document.createElement("div");w.className="sub-topic",w.textContent=h.sub_topico||"-";const E=document.createElement("div");E.className="card-detail",E.innerHTML=`<strong>Início:</strong> ${new Date(h.inicio).toLocaleString()}`;const D=Date.now()-new Date(h.inicio).getTime(),B=document.createElement("div");B.className="card-duration",B.innerHTML=`<strong>Tempo:</strong> <span>${Vt(D)}</span>`;const k=document.createElement("div");k.className="card-description",k.textContent=h.descricao||"-",y.appendChild(I),y.appendChild(w),y.appendChild(E),y.appendChild(B),y.appendChild(k),window.auth&&window.auth.isAdmin()?(y.style.cursor="pointer",y.onclick=()=>ut(h.id)):y.style.cursor="default",g.appendChild(y)});f.appendChild(g),p.appendChild(f),s.appendChild(i),s.appendChild(p),e.appendChild(s)})}function Vt(e){if(e<0)return"0s";const t=Math.floor(e/1e3),n=Math.floor(t/60),o=Math.floor(n/60),a=Math.floor(o/24),s=[];return a>0&&s.push(`${a}d`),(o%24>0||a>0)&&s.push(`${o%24}h`),(n%60>0||o>0)&&s.push(`${n%60}m`),s.push(`${t%60}s`),s.join(" ")}function zt(e){const t=document.getElementById("rep-filter-subtopic");if(!t)return;t.innerHTML='<option value="Todos">Todos</option>';const n=e?e.toLowerCase().trim():"";n&&ee[n]&&ee[n].forEach(o=>{const a=document.createElement("option");a.value=o.toLowerCase(),a.textContent=o,t.appendChild(a)})}function Ae(){let e=ue;const t=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,a=document.getElementById("rep-filter-subtopic")?.value;if(t){const k=new Date(t+"T00:00:00").getTime();e=e.filter(R=>new Date(R.inicio).getTime()>=k)}if(n){const k=new Date(n+"T23:59:59").getTime();e=e.filter(R=>new Date(R.inicio).getTime()<=k)}o&&o!=="Todos"&&(e=e.filter(k=>Me(k.topico)===o.toLowerCase())),a&&a!=="Todos"&&(e=e.filter(k=>k.sub_topico&&k.sub_topico.toLowerCase()===a.toLowerCase()));const s=document.getElementById("rep-kpi-total"),i=document.getElementById("rep-kpi-active"),r=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=e.length);const l=e.filter(k=>k.em_ocorrencia==1||k.em_ocorrencia==="true"||!k.fim);i&&(i.textContent=l.length);const u=e.filter(k=>k.fim);let c="0h 0m";if(u.length>0){const R=u.reduce((b,L)=>b+(new Date(L.fim).getTime()-new Date(L.inicio).getTime()),0)/u.length,x=Math.floor(R/6e4),S=Math.floor(x/60),v=x%60;c=`${S}h ${v}m`}if(r&&(r.textContent=c),!window.Chart){console.warn("Chart.js is not loaded.");return}const m=W,p=t?new Date(t+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),f=n?new Date(n+"T23:59:59").getTime():Date.now(),g=m.map(k=>k.name),h=m.map(k=>{const R=k.id,x=ue.filter(H=>Me(H.topico)===R),S=f-p;if(S<=0)return 100;const b=x.filter(H=>{const Q=new Date(H.inicio).getTime();return(H.fim?new Date(H.fim).getTime():Date.now())>p&&Q<f}).map(H=>({start:Math.max(new Date(H.inicio).getTime(),p),end:Math.min(H.fim?new Date(H.fim).getTime():Date.now(),f)}));b.sort((H,Q)=>H.start-Q.start);const L=[];if(b.length>0){let H=b[0];for(let Q=1;Q<b.length;Q++){const se=b[Q];se.start<H.end?H.end=Math.max(H.end,se.end):(L.push(H),H=se)}L.push(H)}const _=(H=>{let Q=0;return H.forEach(se=>{Q+=se.end-se.start}),Q})(L),F=(S-_)/S*100;return parseFloat(F.toFixed(4))}),y=m.map(k=>k.color||"#6b7280"),I=document.getElementById("chart-rep-sla");I&&(Ke&&Ke.destroy(),Ke=new window.Chart(I,{type:"bar",data:{labels:g,datasets:[{label:"Disponibilidade %",data:h,backgroundColor:y,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...h)-5),max:100,ticks:{callback:k=>k+"%"}}}}}));const w={};e.forEach(k=>{const R=k.sub_topico?k.sub_topico.charAt(0).toUpperCase()+k.sub_topico.slice(1).toLowerCase():"Não especificado";w[R]=(w[R]||0)+1});const E=Object.keys(w),D=Object.values(w),B=document.getElementById("chart-rep-qty");B&&(Xe&&Xe.destroy(),Xe=new window.Chart(B,{type:"doughnut",data:{labels:E.length>0?E:["Nenhum evento"],datasets:[{data:D.length>0?D:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function Ot(e){if(e.preventDefault(),Te)return;Te=!0;const t=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!t||!n||!o){Te=!1;return}const a={id:t.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!a.id){alert("Por favor, defina um ID para o tópico."),Te=!1;return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>(alert("Tópico salvo com sucesso!"),t.value="",n.value="",o.value="#3b82f6",pe().then(()=>{ne()}))).catch(s=>{console.error(s),alert("Erro: "+s.message)}).finally(()=>{Te=!1})}function qt(e){if(e.preventDefault(),Be)return;Be=!0;const t=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!t||!n){Be=!1;return}const o={topic_id:t.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento."),Be=!1;return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(a=>{if(!a.ok)throw new Error("Erro ao adicionar evento");return a.json()}).then(()=>(alert("Evento adicionado!"),n.value="",pe())).catch(a=>{console.error(a),alert("Erro: "+a.message)}).finally(()=>{Be=!1})}function jt(e){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir tópico");return t.json()}).then(()=>{alert("Tópico excluído!"),pe().then(()=>{ne()})}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function Gt(e){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir evento");return t.json()}).then(()=>{alert("Evento excluído!"),pe()}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function St(){const e=document.getElementById("config-topics-list");e&&(e.innerHTML="",W.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':W.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(o)}));const t=document.getElementById("config-subtopics-list");t&&(t.innerHTML="",Ue.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':Ue.forEach(n=>{const o=W.find(r=>r.id===n.topic_id),a=o?o.name:n.topic_id,s=o?o.color:"#6b7280",i=document.createElement("div");i.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",i.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${a}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(i)}))}function Ut(e,t){e.currentTarget.classList.add("dragging"),e.dataTransfer.effectAllowed="move"}function Yt(e){e.preventDefault();const t=document.querySelector(".timeline-container.dragging");if(!t)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const a=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const i=s.getBoundingClientRect();return e.clientY<=i.top+i.height/2});a?n.insertBefore(t,a):n.appendChild(t)}function Jt(e){const t=document.querySelector(".timeline-container.dragging");t&&t.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(a=>{a.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId);Wt(o)}function Wt(e){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:e})}).then(t=>{if(!t.ok)throw new Error("Erro ao salvar nova ordenação");return t.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),pe().then(()=>{ne()})}).catch(t=>{console.error(t),alert("Erro ao salvar ordenação: "+t.message)})}let fe=[],et=[],tt=[],nt=[],P="extensions",V=1,he=100,ot=[];const Ce={setActiveTab(e){P=e,V=1;const t=document.getElementById("telephony-search");t&&(t.value="",e==="extensions"?t.placeholder="Pesquisar ramais por número, nome ou usuário...":e==="queues"?t.placeholder="Pesquisar filas por número ou nome...":e==="blf"?t.placeholder="Pesquisar BLF por nome...":e==="users"&&(t.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(s=>{s.id===`tab-telephony-${e}`?s.classList.add("active"):s.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(s=>{s.id===`telephony-view-${e==="users"?"users":e==="queues"?"queues":e}`?s.classList.remove("hidden"):s.classList.add("hidden")});const a=this.getActiveDataList();this.render(a)},getActiveDataList(){return P==="extensions"?fe:P==="queues"?et:P==="blf"?tt:P==="users"?nt:[]},async fetch(){const e=this.getActiveTableBody();e&&(e.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(V=1,P==="extensions")fe=await $.get("/telephony/extensions"),this.render(fe);else if(P==="queues")et=await $.get("/telephony/queues"),this.render(et);else if(P==="blf"){if(fe.length===0)try{fe=await $.get("/telephony/extensions")}catch(t){console.warn("Could not pre-fetch extensions for BLF mapping:",t)}tt=await $.get("/telephony/blfs"),this.render(tt)}else P==="users"&&(nt=await $.get("/telephony/users"),this.render(nt))}catch(t){console.error(`Error fetching telephony ${P}:`,t),e&&(e.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${t.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return P==="extensions"?document.getElementById("telephony-table-body"):P==="queues"?document.getElementById("telephony-queues-table-body"):P==="blf"?document.getElementById("telephony-blf-table-body"):P==="users"?document.getElementById("telephony-users-table-body"):null},render(e){const t=this.getActiveTableBody();if(!t)return;ot=e;const n=e.length,o=Math.ceil(n/he);V>o&&(V=Math.max(1,o)),V<1&&(V=1);const a=(V-1)*he,s=e.slice(a,a+he);if(s.length===0){const i=P==="extensions"?7:P==="queues"?6:P==="blf"?4:5;t.innerHTML=`
                <tr>
                    <td colspan="${i}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}P==="extensions"?this.renderExtensionsList(t,s):P==="queues"?this.renderQueuesList(t,s):P==="blf"?this.renderBlfsList(t,s):P==="users"&&this.renderUsersList(t,s),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.ddr||"-",i=n.Username||"-",r=n.Secret||"",l=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",u=n.observacao||"-",c=r.replace(/'/g,"\\'");return`
                <tr>
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>${o}</span>
                        </span>
                    </td>
                    <td>${a}</td>
                    <td>${s}</td>
                    <td><strong style="color: var(--accent);">${i}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 140px;">
                            <span id="secret-txt-${n.id}" style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleSecret(${n.id}, '${c}')" title="Mostrar/Ocultar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg id="secret-icon-${n.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${l}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${u}">${u}</td>
                </tr>
            `}).join("")},renderQueuesList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.Estrategia||"-",i=n.TimeoutAgente?`${n.TimeoutAgente}s`:"-",r=n.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',l=n.membros?n.membros.length:0,u=n.membros&&n.membros.length>0?n.membros.map(c=>`
                    <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span style="font-size: 0.85rem; font-weight: 500;">${c.extensao_numero} - ${c.extensao_nome}</span>
                    </div>
                  `).join(""):'<div style="color: var(--text-muted); font-size: 0.85rem;">Nenhum ramal membro nesta fila.</div>';return`
                <tr onclick="window.TelephonyHandler.toggleQueueRow(${n.id})" style="cursor: pointer;" title="Clique para ver os ramais membros">
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--primary);">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>${o}</span>
                        </span>
                    </td>
                    <td><strong>${a}</strong></td>
                    <td style="text-transform: capitalize;">${s}</td>
                    <td>${i}</td>
                    <td>${r}</td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${l} membros</span>
                            <svg id="queue-arrow-${n.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                </tr>
                <tr id="queue-details-${n.id}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="6" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Membros Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${u}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderBlfsList(e,t){e.innerHTML=t.map(n=>{const o=n.id,a=n.Nome||"-",s=n.quantidade_extensoes||0,i=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",r=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(l=>{const u=fe.find(p=>p.id===l||p.extensao_id===l),c=u?u.exten:`ID ${l}`,m=u?u.nome:"Não encontrado";return`
                        <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span style="font-size: 0.85rem; font-weight: 500;">${c} - ${m}</span>
                        </div>
                    `}).join(""):'<div style="color: var(--text-muted); font-size: 0.85rem;">Nenhum ramal vinculado neste BLF.</div>';return`
                <tr onclick="window.TelephonyHandler.toggleBlfRow(${o})" style="cursor: pointer;" title="Clique para ver os ramais vinculados">
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--primary);">
                                <rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect>
                                <circle cx="8" cy="8" r="2"></circle>
                                <circle cx="16" cy="8" r="2"></circle>
                                <circle cx="8" cy="16" r="2"></circle>
                                <circle cx="16" cy="16" r="2"></circle>
                            </svg>
                            <span>${o}</span>
                        </span>
                    </td>
                    <td><strong>${a}</strong></td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${s} ramais</span>
                            <svg id="blf-arrow-${o}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                    <td style="color: var(--text-muted);">${i}</td>
                </tr>
                <tr id="blf-details-${o}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="4" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${r}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderUsersList(e,t){e.innerHTML=t.map(n=>{const o=n.username||"-",a=n.email||"-",s=n.Tipo||"-",i=n.is_active?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Ativo</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Inativo</span>';return`
                <tr>
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--primary);">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>${o}</span>
                        </span>
                    </td>
                    <td>${a}</td>
                    <td style="text-transform: capitalize; font-weight: 600; color: var(--accent);">${s}</td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; max-width: 140px;">
                            <span style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleUserSecret(${n.id})" title="Mostrar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${i}</td>
                </tr>
            `}).join("")},toggleQueueRow(e){const t=document.getElementById(`queue-details-${e}`),n=document.getElementById(`queue-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(e){const t=document.getElementById(`blf-details-${e}`),n=document.getElementById(`blf-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(e){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(e){V=1;const n=this.getActiveDataList().filter(o=>P==="extensions"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Username||"").toLowerCase().includes(e)||(o.ddr||"").toLowerCase().includes(e)||(o.observacao||"").toLowerCase().includes(e):P==="queues"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Estrategia||"").toLowerCase().includes(e):P==="blf"?(o.Nome||"").toLowerCase().includes(e):P==="users"?(o.username||"").toLowerCase().includes(e)||(o.email||"").toLowerCase().includes(e)||(o.Tipo||"").toLowerCase().includes(e):!1);this.render(n)},changePage(e){V=e,this.render(ot)},setPageSize(e){he=parseInt(e,10),V=1,this.render(ot)},toggleSecret(e,t){const n=document.getElementById(`secret-txt-${e}`),o=document.getElementById(`secret-icon-${e}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=t,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${V===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${V-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=V-1&&l<=V+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===V?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${V===t?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${V+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(V-1)*he+1,r=Math.min(V*he,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}},Se=30;let De="",at="all",Ne="",Ve="",K=1,ye=0,J="alerts",Z="switches",M=null,it=[],Et=[],$t=[],kt=[],ze=null,Oe=null,qe=null,je=null,ve=!1;const gt={init(){console.log("📊 [MONITORING] Initializing monitoringHandler...");const e=document.getElementById("tab-monitoring-alerts");e&&e.addEventListener("click",()=>this.setActiveTab("alerts"));const t=document.getElementById("tab-monitoring-events");t&&t.addEventListener("click",()=>this.setActiveTab("events"));const n=document.getElementById("tab-monitoring-apis");n&&n.addEventListener("click",()=>this.setActiveTab("apis"));const o=document.getElementById("tab-monitoring-gnew");o&&o.addEventListener("click",()=>this.setActiveTab("gnew"));const a=document.getElementById("tab-monitoring-infra");a&&a.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Infraestrutura tab"),this.setActiveTab("infra")});const s=document.getElementById("tab-infra-switches");s&&s.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Switches subtab"),this.setInfraTab("switches")});const i=document.getElementById("tab-infra-routers");i&&i.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Routers subtab"),this.setInfraTab("routers")});const r=document.getElementById("tab-infra-nas");r&&r.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on NAS subtab"),this.setInfraTab("nas")});const l=document.getElementById("btn-refresh-switches-status");l&&l.addEventListener("click",()=>this.fetchAndRenderSwitchesStatus(!0));const u=document.getElementById("btn-refresh-routers-status");u&&u.addEventListener("click",()=>this.fetchAndRenderRoutersStatus(!0));const c=document.getElementById("btn-refresh-nas-status");c&&c.addEventListener("click",()=>this.fetchAndRenderNasStatus(!0));const m=document.getElementById("monitoring-events-search-input");m&&m.addEventListener("input",b=>{De=b.target.value.toLowerCase(),K=1,this.fetchAndRenderEventHistory()});const p=document.getElementById("monitoring-search-input");p&&p.addEventListener("input",()=>{this.renderGnewServicesStatus()});const f=document.getElementById("monitoring-events-severity-filter");f&&f.addEventListener("change",b=>{at=b.target.value,K=1,this.fetchAndRenderEventHistory()});const g=document.getElementById("monitoring-events-date-start"),h=document.getElementById("monitoring-events-date-end");g&&g.addEventListener("change",b=>{Ne=b.target.value,K=1,this.fetchAndRenderEventHistory()}),h&&h.addEventListener("change",b=>{Ve=b.target.value,K=1,this.fetchAndRenderEventHistory()});const y=document.getElementById("btn-clear-event-date-filter");y&&y.addEventListener("click",()=>{Ne="",Ve="",K=1,g&&(g.value=""),h&&(h.value=""),this.fetchAndRenderEventHistory()});const I=document.getElementById("btn-clear-event-history");I&&I.addEventListener("click",()=>this.clearEventHistory());const w=document.getElementById("btn-refresh-monitoring");w&&w.addEventListener("click",()=>this.fetchDiagnostics());const E=document.getElementById("gnew-disk-accordion-header");E&&E.addEventListener("click",()=>{const b=document.getElementById("gnew-disk-accordion-content"),L=document.getElementById("gnew-disk-chevron");b&&L&&(b.style.maxHeight==="0px"?(b.style.maxHeight="1000px",L.style.transform="rotate(0deg)"):(b.style.maxHeight="0px",L.style.transform="rotate(-90deg)"))});const D=document.getElementById("btn-refresh-gnew-disk");D&&D.addEventListener("click",b=>{b.stopPropagation(),this.fetchDiagnostics()});const B=document.getElementById("btn-refresh-gnew-services");B&&B.addEventListener("click",async()=>{const b=B,L=b.querySelector("svg");if(!b.disabled){b.disabled=!0,b.style.opacity="0.6",b.style.cursor="not-allowed",L&&(L.style.animation="spin 0.8s linear infinite");try{await this.fetchDiagnostics()}finally{b.disabled=!1,b.style.opacity="",b.style.cursor="pointer",L&&(L.style.animation="")}}});const k=document.getElementById("btn-refresh-apis-status");k&&k.addEventListener("click",()=>this.fetchAndRenderApisStatus());const R=document.getElementById("monitoring-auto-refresh");R&&(R.addEventListener("change",b=>{b.target.checked?this._startAutoRefresh():this._stopAutoRefresh()}),R.checked&&this._startAutoRefresh());const x=document.getElementById("switches-auto-refresh");x&&(x.addEventListener("change",b=>{b.target.checked?this._startSwitchesAutoRefresh():this._stopSwitchesAutoRefresh()}),x.checked&&this._startSwitchesAutoRefresh());const S=document.getElementById("routers-auto-refresh");S&&(S.addEventListener("change",b=>{b.target.checked?this._startRoutersAutoRefresh():this._stopRoutersAutoRefresh()}),S.checked&&this._startRoutersAutoRefresh());const v=document.getElementById("nas-auto-refresh");v&&(v.addEventListener("change",b=>{b.target.checked?this._startNasAutoRefresh():this._stopNasAutoRefresh()}),v.checked&&this._startNasAutoRefresh()),window.monitoringHandler=this},_startAutoRefresh(){this._stopAutoRefresh(),ze=setInterval(()=>{(J==="alerts"||J==="gnew")&&this.fetchDiagnostics()},3e4)},_stopAutoRefresh(){ze&&(clearInterval(ze),ze=null)},_startSwitchesAutoRefresh(){this._stopSwitchesAutoRefresh(),Oe=setInterval(()=>{J==="infra"&&Z==="switches"&&this.fetchAndRenderSwitchesStatus(!1,!0)},6e4)},_stopSwitchesAutoRefresh(){Oe&&(clearInterval(Oe),Oe=null)},_startRoutersAutoRefresh(){this._stopRoutersAutoRefresh(),qe=setInterval(()=>{J==="infra"&&Z==="routers"&&this.fetchAndRenderRoutersStatus(!1,!0)},6e4)},_stopRoutersAutoRefresh(){qe&&(clearInterval(qe),qe=null)},_startNasAutoRefresh(){this._stopNasAutoRefresh(),je=setInterval(()=>{J==="infra"&&Z==="nas"&&this.fetchAndRenderNasStatus(!1,!0)},6e4)},_stopNasAutoRefresh(){je&&(clearInterval(je),je=null)},fetch(){this.setActiveTab("alerts"),this.fetchDiagnostics()},setActiveTab(e){J=e;const t=document.getElementById("tab-monitoring-alerts"),n=document.getElementById("tab-monitoring-events"),o=document.getElementById("tab-monitoring-apis"),a=document.getElementById("tab-monitoring-gnew"),s=document.getElementById("tab-monitoring-infra");t&&t.classList.toggle("active",e==="alerts"),n&&n.classList.toggle("active",e==="events"),o&&o.classList.toggle("active",e==="apis"),a&&a.classList.toggle("active",e==="gnew"),s&&s.classList.toggle("active",e==="infra");const i=document.getElementById("monitoring-tab-content-alerts"),r=document.getElementById("monitoring-tab-content-events"),l=document.getElementById("monitoring-tab-content-apis"),u=document.getElementById("monitoring-tab-content-gnew"),c=document.getElementById("monitoring-tab-content-infra");i&&(i.classList.toggle("hidden",e!=="alerts"),i.classList.toggle("active",e==="alerts")),r&&(r.classList.toggle("hidden",e!=="events"),r.classList.toggle("active",e==="events")),l&&(l.classList.toggle("hidden",e!=="apis"),l.classList.toggle("active",e==="apis")),u&&(u.classList.toggle("hidden",e!=="gnew"),u.classList.toggle("active",e==="gnew")),c&&(c.classList.toggle("hidden",e!=="infra"),c.classList.toggle("active",e==="infra")),e==="gnew"?this.fetchDiagnostics():e==="events"?(K=1,this.fetchAndRenderEventHistory()):e==="apis"?this.fetchAndRenderApisStatus():e==="infra"?this.setInfraTab(Z):this.renderGnewServicesStatus()},setInfraTab(e){console.log("📊 [MONITORING] setInfraTab called with:",e),Z=e;const t=document.getElementById("tab-infra-switches"),n=document.getElementById("tab-infra-routers"),o=document.getElementById("tab-infra-nas");t&&t.classList.toggle("active",e==="switches"),n&&n.classList.toggle("active",e==="routers"),o&&o.classList.toggle("active",e==="nas");const a=document.getElementById("infra-tab-content-switches"),s=document.getElementById("infra-tab-content-routers"),i=document.getElementById("infra-tab-content-nas");a&&(a.classList.toggle("hidden",e!=="switches"),a.classList.toggle("active",e==="switches")),s&&(s.classList.toggle("hidden",e!=="routers"),s.classList.toggle("active",e==="routers")),i&&(i.classList.toggle("hidden",e!=="nas"),i.classList.toggle("active",e==="nas")),e==="switches"?this.fetchAndRenderSwitchesStatus():e==="routers"?this.fetchAndRenderRoutersStatus():e==="nas"&&this.fetchAndRenderNasStatus()},render(){J==="alerts"?this.renderGnewServicesStatus():J==="events"?this.fetchAndRenderEventHistory():J==="apis"?this.fetchAndRenderApisStatus():J==="infra"&&(Z==="switches"?this.fetchAndRenderSwitchesStatus():Z==="routers"?this.fetchAndRenderRoutersStatus():Z==="nas"&&this.fetchAndRenderNasStatus())},renderGnewServicesStatus(){const e=document.getElementById("monitoring-alerts-grid");if(!e)return;e.style.display="flex",e.style.flexDirection="column",e.style.gap="0";const t=M&&M.servicos&&Array.isArray(M.servicos.servicos)?M.servicos.servicos:[],n=it||[],o=Et||[],a=$t||[],s=kt||[];if(t.length===0&&n.length===0&&o.length===0&&a.length===0&&s.length===0){e.innerHTML=`
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">Nenhum dado de monitoramento disponível.</p>
                    <p style="font-size: 0.85rem;">Aguardando carga dos serviços do PABX, das APIs integradas ou da infraestrutura...</p>
                </div>
            `;return}const i=t.length+n.length+o.length+a.length+s.length,r=t.filter(v=>v.status!=="active"&&v.status_label!=="ativo").length,l=n.filter(v=>!v.online||v.status==="warning").length,u=o.filter(v=>!v.online).length,c=a.filter(v=>!v.online).length,m=s.filter(v=>!v.online).length,p=r+l+u+c+m,f=i-p,g=document.getElementById("monitor-kpi-total"),h=document.getElementById("monitor-kpi-warning"),y=document.getElementById("monitor-kpi-info");g&&(g.textContent=i),h&&(h.textContent=p),y&&(y.textContent=f);const I=document.getElementById("monitoring-search-input"),w=I?I.value.toLowerCase().trim():"";let E=t,D=n,B=o,k=a,R=s;w&&(E=t.filter(v=>v.nome.toLowerCase().includes(w)),D=n.filter(v=>v.name.toLowerCase().includes(w)||v.description.toLowerCase().includes(w)),B=o.filter(v=>v.name.toLowerCase().includes(w)||v.ip.toLowerCase().includes(w)),k=a.filter(v=>v.name.toLowerCase().includes(w)||v.ip.toLowerCase().includes(w)),R=s.filter(v=>v.name.toLowerCase().includes(w)||v.ip.toLowerCase().includes(w)));let x=`
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Serviço / API / Infraestrutura</span>
                    <span class="monitor-list-col-status">Status</span>
                </div>
        `,S=0;E.forEach(v=>{const b=v.status==="active"||v.status_label==="ativo",L=b?"#10b981":"#ef4444",T=b?"Online":v.status_label||v.status||"Offline",_=b?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",F=b?"#6ee7b7":"#fca5a5",H=b?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)",Q=S%2===0?"transparent":"rgba(255,255,255,0.015)";S++,x+=`
                <div class="monitor-list-row" style="background: ${Q};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${L};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem;">[Serviço PABX] ${v.nome}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${_}; color:${F}; border-color:${H};">${T}</span>
                    </div>
                </div>`}),D.forEach(v=>{let b="#10b981",L="Online",T="rgba(16,185,129,0.12)",_="#6ee7b7",F="rgba(16,185,129,0.3)";v.status==="warning"?(b="#f59e0b",L="Alerta",T="rgba(245,158,11,0.12)",_="#fde047",F="rgba(245,158,11,0.3)"):(v.status==="offline"||!v.online)&&(b="#ef4444",L="Offline",T="rgba(239,68,68,0.12)",_="#fca5a5",F="rgba(239,68,68,0.3)");const H=S%2===0?"transparent":"rgba(255,255,255,0.015)";S++,x+=`
                <div class="monitor-list-row" style="background: ${H};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${b};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:var(--accent);">[API] ${v.name}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${T}; color:${_}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),B.forEach(v=>{let b="#10b981",L="Online",T="rgba(16,185,129,0.12)",_="#6ee7b7",F="rgba(16,185,129,0.3)";v.online===null?(b="#94a3b8",L="Aguardando...",T="rgba(255, 255, 255, 0.05)",_="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):v.online||(b="#ef4444",L="Offline",T="rgba(239,68,68,0.12)",_="#fca5a5",F="rgba(239,68,68,0.3)");const H=S%2===0?"transparent":"rgba(255,255,255,0.015)";S++,x+=`
                <div class="monitor-list-row" style="background: ${H};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${b};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#38bdf8;">[Switch] ${v.name} (${v.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${T}; color:${_}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),k.forEach(v=>{let b="#10b981",L="Online",T="rgba(16,185,129,0.12)",_="#6ee7b7",F="rgba(16,185,129,0.3)";v.online===null?(b="#94a3b8",L="Aguardando...",T="rgba(255, 255, 255, 0.05)",_="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):v.online||(b="#ef4444",L="Offline",T="rgba(239,68,68,0.12)",_="#fca5a5",F="rgba(239,68,68,0.3)");const H=S%2===0?"transparent":"rgba(255,255,255,0.015)";S++,x+=`
                <div class="monitor-list-row" style="background: ${H};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${b};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f43f5e;">[Roteador] ${v.name} (${v.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${T}; color:${_}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),R.forEach(v=>{let b="#10b981",L="Online",T="rgba(16,185,129,0.12)",_="#6ee7b7",F="rgba(16,185,129,0.3)";v.online===null?(b="#94a3b8",L="Aguardando...",T="rgba(255, 255, 255, 0.05)",_="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):v.online||(b="#ef4444",L="Offline",T="rgba(239,68,68,0.12)",_="#fca5a5",F="rgba(239,68,68,0.3)");const H=S%2===0?"transparent":"rgba(255,255,255,0.015)";S++,x+=`
                <div class="monitor-list-row" style="background: ${H};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${b};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f97316;">[NAS] ${v.name} (${v.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${T}; color:${_}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),x+="</div>",e.innerHTML=x},async fetchAndRenderEventHistory(){const e=document.getElementById("monitoring-events-grid");if(e){e.innerHTML=`
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div class="event-history-loading">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite; margin-bottom: 0.75rem; opacity: 0.5;">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <p style="font-size: 0.9rem;">Carregando histórico...</p>
                </div>
            </div>`;try{let t=await $.get("/monitoring/events?limit=1000");if(De&&(t=t.filter(i=>(i.title||"").toLowerCase().includes(De)||(i.description||"").toLowerCase().includes(De)||(i.source||"").toLowerCase().includes(De))),at!=="all"&&(t=t.filter(i=>i.severity===at)),Ne){const i=new Date(Ne+"T00:00:00").getTime();t=t.filter(r=>r.created_at?new Date(r.created_at).getTime()>=i:!1)}if(Ve){const i=new Date(Ve+"T23:59:59").getTime();t=t.filter(r=>r.created_at?new Date(r.created_at).getTime()<=i:!1)}ye=t.length;const n=Math.max(1,Math.ceil(ye/Se));K>n&&(K=n);const o=document.getElementById("event-history-count");o&&(o.textContent=ye>0?ye:"",o.style.display=ye>0?"inline-flex":"none");const a=(K-1)*Se,s=t.slice(a,a+Se);this.renderEvents(s),this.renderPagination(ye,n)}catch(t){console.error("Erro ao buscar histórico de eventos:",t),e.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p style="font-size: 0.9rem; color: #fca5a5;">Erro ao carregar o histórico de eventos.</p>
                    <p style="font-size: 0.8rem; margin-top: 4px;">${t.message}</p>
                </div>`}}},renderPagination(e,t){const n=document.getElementById("event-history-pagination");if(!n)return;if(t<=1){n.innerHTML="";return}const o=K,a=(o-1)*Se+1,s=Math.min(o*Se,e),i=[],r=2;let l=Math.max(1,o-r),u=Math.min(t,o+r);l>1&&(i.push('<button class="eh-page-btn" data-page="1">1</button>'),l>2&&i.push('<span class="eh-page-ellipsis">…</span>'));for(let c=l;c<=u;c++)i.push(`<button class="eh-page-btn${c===o?" active":""}" data-page="${c}">${c}</button>`);u<t&&(u<t-1&&i.push('<span class="eh-page-ellipsis">…</span>'),i.push(`<button class="eh-page-btn" data-page="${t}">${t}</button>`)),n.innerHTML=`
            <div class="eh-pagination">
                <span class="eh-page-info">Exibindo <strong>${a}–${s}</strong> de <strong>${e}</strong> eventos</span>
                <div class="eh-page-controls">
                    <button class="eh-page-btn eh-page-nav" data-page="${o-1}" ${o<=1?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    ${i.join("")}
                    <button class="eh-page-btn eh-page-nav" data-page="${o+1}" ${o>=t?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>`,n.querySelectorAll(".eh-page-btn[data-page]").forEach(c=>{c.addEventListener("click",()=>{const m=parseInt(c.dataset.page,10);if(!isNaN(m)&&m>=1&&m<=t&&m!==K){K=m,this.fetchAndRenderEventHistory();const p=document.getElementById("monitoring-events-grid");p&&p.scrollIntoView({behavior:"smooth",block:"start"})}})})},renderEvents(e){const t=document.getElementById("monitoring-events-grid");if(!t)return;t.style.display="flex",t.style.flexDirection="column",t.style.gap="0";const n=e||[];if(n.length===0){t.innerHTML=`
                <div class="event-history-empty">
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="1.5" fill="none" style="opacity: 0.2; margin-bottom: 1rem;">
                        <path d="M18 20V10"></path>
                        <path d="M12 20V4"></path>
                        <path d="M6 20v-6"></path>
                    </svg>
                    <p style="font-size: 0.95rem; font-weight: 500; margin: 0 0 4px;">Nenhum evento registrado</p>
                    <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0;">
                        Alertas de disco, RAM e serviços offline são registrados automaticamente aqui.
                    </p>
                </div>`;return}const o={};n.forEach(s=>{const i=s.created_at?new Date(s.created_at).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"Data desconhecida";o[i]||(o[i]=[]),o[i].push(s)});const a=Object.entries(o).map(([s,i])=>{const r=i.map(l=>{const u=l.severity||"info";let c="Info",m="#3b82f6",p="rgba(59,130,246,0.12)",f="#93c5fd",g="rgba(59,130,246,0.3)",h="#3b82f6";u==="critical"?(c="Crítico",m="#ef4444",h="#ef4444",p="rgba(239,68,68,0.12)",f="#fca5a5",g="rgba(239,68,68,0.3)"):u==="warning"?(c="Alerta",m="#f59e0b",h="#f59e0b",p="rgba(245,158,11,0.12)",f="#fde047",g="rgba(245,158,11,0.3)"):u==="success"&&(c="Ok",m="#10b981",h="#10b981",p="rgba(16,185,129,0.12)",f="#6ee7b7",g="rgba(16,185,129,0.3)");const y=l.created_at?new Date(l.created_at):null,I=y?y.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"-",w=y?this._relativeTime(y):"",E=l.value_pct!=null?`${l.value_pct}%`:null;return`
                    <div class="event-history-row" style="border-left: 3px solid ${h};">
                        <div class="event-history-row-left">
                            <span class="monitor-dot" style="background: ${m}; flex-shrink: 0;"></span>
                            <div class="event-history-row-info">
                                <span class="event-history-row-title">${l.title}</span>
                                ${l.description?`<span class="event-history-row-desc">${l.description}</span>`:""}
                            </div>
                        </div>
                        <div class="event-history-row-meta">
                            ${E?`<span class="event-history-row-value">${E}</span>`:""}
                            <span class="monitor-badge" style="background:${p}; color:${f}; border-color:${g}; flex-shrink: 0;">${c}</span>
                            <div class="event-history-row-time">
                                <span class="event-time-clock">${I}</span>
                                ${w?`<span class="event-time-rel">${w}</span>`:""}
                            </div>
                        </div>
                    </div>`}).join("");return`
                <div class="event-history-date-group">
                    <div class="event-history-date-header">
                        <span class="event-history-date-line"></span>
                        <span class="event-history-date-label">${s}</span>
                        <span class="event-history-date-line"></span>
                    </div>
                    ${r}
                </div>`}).join("");t.innerHTML=`<div class="event-history-list">${a}</div>`},_relativeTime(e){const n=new Date-e,o=Math.floor(n/6e4),a=Math.floor(o/60),s=Math.floor(a/24);return n<6e4?"agora mesmo":o<60?`${o}min atrás`:a<24?`${a}h atrás`:s===1?"ontem":`${s} dias atrás`},updateKPIs(e,t){const n=e-t,o=document.getElementById("monitor-kpi-total"),a=document.getElementById("monitor-kpi-warning"),s=document.getElementById("monitor-kpi-info");o&&(o.textContent=e),a&&(a.textContent=t),s&&(s.textContent=n)},async fetchDiagnostics(){try{const[e,t,n,o,a]=await Promise.all([$.get("/monitoring/diagnostico?t="+Date.now()),$.get("/monitoring/apis-status?t="+Date.now()),$.get("/monitoring/switches?t="+Date.now()),$.get("/monitoring/routers?t="+Date.now()),$.get("/monitoring/nas?t="+Date.now())]),s=e&&e.status==="online";if(this.updateGnewApiStatus(s,s?"Gnew Online":"Gnew Offline (Contingência)",e?e.message:""),e&&e.data)M=e.data,this.renderGnewDiagnostics();else throw new Error("Dados inválidos na resposta da API.");t&&t.success&&Array.isArray(t.apis)&&(it=t.apis),n&&n.success&&Array.isArray(n.switches)&&(Et=n.switches),o&&o.success&&Array.isArray(o.routers)&&($t=o.routers),a&&a.success&&Array.isArray(a.nas)&&(kt=a.nas),J==="alerts"&&this.renderGnewServicesStatus()}catch(e){console.error("Erro ao buscar dados de monitoramento:",e),this.updateGnewApiStatus(!1,"Erro de Conexão",e.message)}},updateGnewApiStatus(e,t,n){const o=document.getElementById("gnew-api-status-badge"),a=document.getElementById("gnew-api-message");if(o){o.className=`api-status-badge ${e?"online":"offline"}`,o.style.background=e?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",o.style.color=e?"#6ee7b7":"#fca5a5",o.style.borderColor=e?"#10b981":"#ef4444";const s=o.querySelector(".status-text");s&&(s.textContent=t)}a&&n&&(a.textContent=n)},parseMemoryOutput(e){try{const n=e.split(`
`).find(o=>o.trim().startsWith("Mem:"));if(n){const o=n.trim().split(/\s+/);if(o.length>=3){const a=o[1],s=o[2],i=u=>{const c=parseFloat(u);return u.toLowerCase().includes("g")?c*1024:u.toLowerCase().includes("m")?c:u.toLowerCase().includes("k")?c/1024:c},r=i(a),l=i(s);if(!isNaN(r)&&!isNaN(l)&&r>0)return{percentage:Math.round(l/r*100),detail:`${s} em uso de ${a} total`}}}}catch(t){console.warn("Erro ao fazer parse da memória:",t)}return{percentage:0,detail:"Erro no parse"}},parseDiskOutput(e){try{const n=e.split(`
`).find(o=>o.trim().endsWith(" /"));if(n){const o=n.trim().split(/\s+/);if(o.length>=5){const a=o[1],s=o[2],i=o[4].replace("%",""),r=parseInt(i,10);if(!isNaN(r))return{percentage:r,detail:`${s} em uso de ${a} (Montagem em /)`}}}}catch(t){console.warn("Erro ao fazer parse do disco:",t)}return{percentage:0,detail:"Erro no parse"}},renderGnewDiagnostics(){if(!M)return;if(M.memoria){let n={percentage:0,detail:"Dados de memória indisponíveis"};if(M.memoria.output)n=this.parseMemoryOutput(M.memoria.output);else if(typeof M.memoria.percent<"u"){const i=(M.memoria.total_mb/1024).toFixed(1),r=(M.memoria.used_mb/1024).toFixed(1);n={percentage:Math.round(M.memoria.percent),detail:`${r}GB em uso de ${i}GB total`}}const o=document.getElementById("gnew-kpi-mem-text"),a=document.getElementById("gnew-kpi-mem-bar"),s=document.getElementById("gnew-kpi-mem-detail");o&&(o.textContent=`${n.percentage}%`),a&&(a.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}if(M.disco){let n={percentage:0,detail:"Dados de disco indisponíveis"};if(M.disco.output)n=this.parseDiskOutput(M.disco.output);else if(Array.isArray(M.disco)){const i=M.disco.find(r=>r.mountpoint==="/");i&&(n={percentage:Math.round(i.percent),detail:`${i.used_gb.toFixed(1)}GB em uso de ${i.total_gb.toFixed(1)}GB (Montagem em /)`})}const o=document.getElementById("gnew-kpi-disk-text"),a=document.getElementById("gnew-kpi-disk-bar"),s=document.getElementById("gnew-kpi-disk-detail");o&&(o.textContent=`${n.percentage}%`),a&&(a.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}const e=document.getElementById("gnew-disk-table-body");if(e){let n=[];if(M.disco)if(M.disco.output)try{const o=M.disco.output.trim().split(`
`);for(let a=1;a<o.length;a++){const s=o[a].trim().split(/\s+/);s.length>=6&&n.push({mountpoint:s[5],total:s[1],used:s[2],free:s[3],percent:parseInt(s[4].replace("%",""),10)||0})}}catch(o){console.warn("Erro ao fazer parse da tabela de disco offline:",o)}else Array.isArray(M.disco)&&(n=M.disco.map(o=>({mountpoint:o.mountpoint,total:typeof o.total_gb=="number"?`${o.total_gb.toFixed(2)} GB`:o.total_gb||"0 GB",used:typeof o.used_gb=="number"?`${o.used_gb.toFixed(2)} GB`:o.used_gb||"0 GB",free:typeof o.free_gb=="number"?`${o.free_gb.toFixed(2)} GB`:o.free_gb||"0 GB",percent:typeof o.percent=="number"?Math.round(o.percent):parseInt(o.percent,10)||0})));n.length>0?e.innerHTML=n.map(o=>{const a=o.percent;return`
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                            <td style="padding: 12px; font-weight: 500; color: var(--text-main); font-family: monospace;">${o.mountpoint}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${o.total}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${o.used}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${o.free}</td>
                            <td style="padding: 12px; text-align: right; font-family: monospace;">
                                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
                                    <div style="width: 100px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; border: 1px solid var(--glass-border); flex-shrink: 0;">
                                        <div style="width: ${a}%; height: 100%; background: #2563eb; border-radius: 3px;"></div>
                                    </div>
                                    <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-main); min-width: 40px; text-align: right;">${a}%</span>
                                </div>
                            </td>
                        </tr>
                    `}).join(""):e.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                            Nenhum ponto de montagem de disco encontrado.
                        </td>
                    </tr>
                `}if(M.servicos&&M.servicos.timestamp)try{const o=new Date(M.servicos.timestamp).toLocaleString("pt-BR"),a=document.getElementById("gnew-services-timestamp");a&&(a.textContent=`Última verificação: ${o}`)}catch(n){console.warn("Erro ao formatar timestamp dos serviços:",n)}const t=document.getElementById("gnew-services-list");if(t){let n=[];M.servicos&&Array.isArray(M.servicos.servicos)&&(n=M.servicos.servicos),n.length>0?(t.innerHTML=n.map(a=>{const s=a.status==="active"||a.status_label==="ativo",i=s?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",r=s?"#6ee7b7":"#fca5a5",l=s?"#10b981":"#ef4444",u=s?"#10b981":"#ef4444";return`
                        <div class="service-card" style="border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; background: rgba(255, 255, 255, 0.01); display: flex; flex-direction: column; overflow: hidden; transition: all 0.2s;">
                            <!-- Service Info Row -->
                            <div class="service-header-row" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; user-select: none; transition: background 0.2s;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <!-- Chevron arrow -->
                                    <svg class="service-chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" style="transition: transform 0.2s ease; transform: rotate(0deg); color: var(--text-muted); flex-shrink: 0;">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                    <span style="font-weight: 500; font-size: 0.9rem; color: var(--text-main); font-family: monospace;">${a.nome}</span>
                                </div>
                                <!-- Status Badge -->
                                <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid ${l}; background: ${i}; color: ${r};">
                                    <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${u};"></span>
                                    <span>${a.status_label||a.status}</span>
                                </div>
                            </div>
                            <!-- Log Area (Collapsible) -->
                            <div class="service-log-content" style="max-height: 0; overflow: hidden; transition: all 0.3s ease-in-out; background: rgba(0, 0, 0, 0.2); border-top: 1px solid transparent;">
                                <pre style="margin: 0; padding: 12px; font-family: monospace; font-size: 0.75rem; color: #a3a3a3; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${a.log||"Sem logs de sistema disponíveis."}</pre>
                            </div>
                        </div>
                    `}).join(""),t.querySelectorAll(".service-header-row").forEach(a=>{a.addEventListener("click",()=>{const s=a.closest(".service-card"),i=s.querySelector(".service-log-content"),r=s.querySelector(".service-chevron");i.style.maxHeight==="300px"?(i.style.maxHeight="0px",i.style.borderTopColor="transparent",r.style.transform="rotate(0deg)"):(i.style.maxHeight="300px",i.style.borderTopColor="rgba(255, 255, 255, 0.05)",r.style.transform="rotate(90deg)")})})):t.innerHTML=`
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                        Nenhum serviço encontrado no servidor.
                    </div>
                `}if(M.ipExterno){const n=document.getElementById("gnew-kpi-ip-text");n&&(n.textContent=M.ipExterno.ip||"Não detectado")}},async clearEventHistory(){const e=document.getElementById("btn-clear-event-history");if(confirm("Tem certeza que deseja limpar todo o histórico de eventos? Esta ação não pode ser desfeita."))try{e&&(e.disabled=!0,e.textContent="Limpando..."),await fetch("/api/monitoring/events",{method:"DELETE"}),await this.fetchAndRenderEventHistory();const t=document.getElementById("event-history-count");t&&(t.style.display="none")}catch(t){console.error("Erro ao limpar histórico:",t),alert("Erro ao limpar o histórico. Tente novamente.")}finally{e&&(e.disabled=!1,e.textContent="Limpar Histórico")}},async fetchAndRenderApisStatus(){const e=document.getElementById("monitoring-apis-grid");if(!e)return;e.innerHTML=`
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 12px; color: var(--text-muted);">
                <div class="api-loading-spinner" style="width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="font-size: 0.9rem;">Verificando integridade das APIs...</span>
            </div>
        `;const t=document.getElementById("btn-refresh-apis-status");let n=null;t&&(n=t.querySelector("svg"),t.disabled=!0,t.style.opacity="0.6",t.style.cursor="not-allowed",n&&(n.style.animation="spin 0.8s linear infinite"));try{const o=await $.get("/monitoring/apis-status?refresh=true&t="+Date.now());if(o&&o.success&&Array.isArray(o.apis))it=o.apis,J==="alerts"&&this.renderGnewServicesStatus(),this.renderApisGrid(o.apis);else throw new Error("Resposta inválida do servidor.")}catch(o){console.error("Erro ao buscar status das APIs:",o),e.innerHTML=`
                <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                    <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status das APIs</p>
                    <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${o.message}</p>
                </div>
            `}finally{t&&(t.disabled=!1,t.style.opacity="",t.style.cursor="pointer",n&&(n.style.animation=""))}},renderApisGrid(e){const t=document.getElementById("monitoring-apis-grid");if(t){if(e.length===0){t.innerHTML=`
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted);">
                    Nenhuma API cadastrada.
                </div>
            `;return}t.innerHTML=e.map(n=>{let o="online",a="rgba(16, 185, 129, 0.1)",s="#6ee7b7",i="#10b981",r="Online";n.status==="warning"?(o="warning",a="rgba(245, 158, 11, 0.1)",s="#fde047",i="#f59e0b",r="Alerta"):(n.status==="offline"||!n.online)&&(o="offline",a="rgba(239, 68, 68, 0.1)",s="#fca5a5",i="#ef4444",r="Offline");const l=n.latency<500?"#6ee7b7":n.latency<2e3?"#fde047":"#fca5a5";return`
                <div class="api-status-card glass" data-api-id="${n.id}">
                    <div class="api-card-header">
                        <div class="api-info-meta">
                            <span class="api-type-tag">${n.type}</span>
                            <h4 class="api-name">${n.name}</h4>
                        </div>
                        <span class="api-badge ${o}" style="background: ${a}; color: ${s}; border: 1px solid ${i};">
                            <span class="status-dot"></span>
                            ${r}
                        </span>
                    </div>
                    <div class="api-card-body">
                        <p class="api-desc">${n.description}</p>
                        <div class="api-url-wrapper">
                            <span class="api-url-label">Endpoint:</span>
                            <code class="api-url-code" title="${n.url}">${n.url}</code>
                        </div>
                    </div>
                    <div class="api-card-footer">
                        <div class="api-stat">
                            <span class="stat-label">Latência:</span>
                            <span class="stat-value" style="color: ${l}">${n.latency}ms</span>
                        </div>
                        <div class="api-stat" style="max-width: 60%;">
                            <span class="stat-label">Detalhe:</span>
                            <span class="stat-value detail-value" title="${n.message||"-"}">${n.message||"-"}</span>
                        </div>
                    </div>
                </div>
            `}).join("")}},async fetchAndRenderSwitchesStatus(e=!1,t=!1){const n=document.getElementById("switches-auto-refresh"),o=t||n&&n.checked,a=document.getElementById("monitoring-switches-tbody");if(!a)return;const s=document.getElementById("btn-refresh-switches-status");let i=null;s&&(i=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",i&&(i.style.animation="spin 0.8s linear infinite"));try{if(o){const r=await $.get(`/monitoring/switches?ping=false&refresh=${e}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.switches)){this.renderSwitchesTable(r.switches),r.switches.forEach(l=>{const u=document.getElementById(`switch-row-${l.id}`);if(u){const c=u.querySelector(".switch-sync-indicator");c&&(c.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),ve=!0;for(const l of r.switches){if(J!=="infra")break;const u=document.getElementById(`switch-row-${l.id}`);if(u){const c=u.querySelector(".switch-sync-indicator");c&&(c.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const c=await $.get(`/monitoring/switches/${l.id}/ping?t=${Date.now()}`);if(c&&c.success&&c.switch){const m=c.switch,p=document.getElementById(`switch-row-${m.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",g="#6ee7b7",h="rgba(16, 185, 129, 0.3)",y="Online";m.online||(f="rgba(239, 68, 68, 0.12)",g="#fca5a5",h="rgba(239, 68, 68, 0.3)",y="Offline");const I=m.latency<50?"#6ee7b7":m.latency<150?"#fde047":"#fca5a5",w=m.online?`${m.latency}ms`:"-",E=p.querySelector(".monitor-badge");E&&(E.style.background=f,E.style.color=g,E.style.borderColor=h,E.textContent=y);const D=p.querySelector(".switch-latency");D&&(D.style.color=I,D.textContent=w);const B=p.querySelector(".switch-sync-indicator");B&&(B.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{B.querySelector("polyline")&&(B.innerHTML="")},3e3))}}}catch(c){console.error(`Erro ao pingar switch ${l.name}:`,c);const m=document.getElementById(`switch-row-${l.id}`);if(m){const p=m.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=m.querySelector(".switch-sync-indicator");f&&(f.innerHTML="")}}}ve=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/switches?refresh=${e}&t=${Date.now()}`,l=await $.get(r);if(l&&l.success&&Array.isArray(l.switches))this.renderSwitchesTable(l.switches);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos switches:",r),a.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos switches</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",i&&(i.style.animation=""))}},renderSwitchesTable(e){const t=document.getElementById("monitoring-switches-tbody");if(t){if(e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum switch encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=e.map(n=>{let o="rgba(16, 185, 129, 0.12)",a="#6ee7b7",s="rgba(16, 185, 129, 0.3)",i="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",a="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",i="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",a="#fca5a5",s="rgba(239, 68, 68, 0.3)",i="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
                <tr id="switch-row-${n.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${n.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.model||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${a}; border-color:${s};">${i}</span>
                            <span class="switch-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="switch-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join("")}},async fetchAndRenderRoutersStatus(e=!1,t=!1){console.log("📊 [MONITORING] fetchAndRenderRoutersStatus called. forceRefresh:",e,"sequential:",t);const n=document.getElementById("routers-auto-refresh"),o=t||n&&n.checked,a=document.getElementById("monitoring-routers-tbody");if(!a){console.error("📊 [MONITORING] Element #monitoring-routers-tbody not found in DOM!");return}const s=document.getElementById("btn-refresh-routers-status");let i=null;s&&(i=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",i&&(i.style.animation="spin 0.8s linear infinite"));try{if(console.log("📊 [MONITORING] Fetching routers, sequential mode:",o),o){const r=await $.get(`/monitoring/routers?ping=false&refresh=${e}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.routers)){this.renderRoutersTable(r.routers),r.routers.forEach(l=>{const u=document.getElementById(`router-row-${l.id}`);if(u){const c=u.querySelector(".router-sync-indicator");c&&(c.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),ve=!0;for(const l of r.routers){if(J!=="infra"||Z!=="routers")break;const u=document.getElementById(`router-row-${l.id}`);if(u){const c=u.querySelector(".router-sync-indicator");c&&(c.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const c=await $.get(`/monitoring/routers/${l.id}/ping?t=${Date.now()}`);if(c&&c.success&&c.router){const m=c.router,p=document.getElementById(`router-row-${m.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",g="#6ee7b7",h="rgba(16, 185, 129, 0.3)",y="Online";m.online||(f="rgba(239, 68, 68, 0.12)",g="#fca5a5",h="rgba(239, 68, 68, 0.3)",y="Offline");const I=m.latency<50?"#6ee7b7":m.latency<150?"#fde047":"#fca5a5",w=m.online?`${m.latency}ms`:"-",E=p.querySelector(".monitor-badge");E&&(E.style.background=f,E.style.color=g,E.style.borderColor=h,E.textContent=y);const D=p.querySelector(".router-latency");D&&(D.style.color=I,D.textContent=w);const B=p.querySelector(".router-sync-indicator");B&&(B.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{B.querySelector("polyline")&&(B.innerHTML="")},3e3))}}}catch(c){console.error(`Erro ao pingar roteador ${l.name}:`,c);const m=document.getElementById(`router-row-${l.id}`);if(m){const p=m.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=m.querySelector(".router-sync-indicator");f&&(f.innerHTML="")}}}ve=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/routers?refresh=${e}&t=${Date.now()}`,l=await $.get(r);if(l&&l.success&&Array.isArray(l.routers))this.renderRoutersTable(l.routers);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos roteadores:",r),a.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos roteadores</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",i&&(i.style.animation=""))}},renderRoutersTable(e){const t=document.getElementById("monitoring-routers-tbody");if(t){if(e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum roteador encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=e.map(n=>{let o="rgba(16, 185, 129, 0.12)",a="#6ee7b7",s="rgba(16, 185, 129, 0.3)",i="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",a="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",i="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",a="#fca5a5",s="rgba(239, 68, 68, 0.3)",i="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
                <tr id="router-row-${n.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${n.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.model||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${a}; border-color:${s};">${i}</span>
                            <span class="router-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="router-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join("")}},async fetchAndRenderNasStatus(e=!1,t=!1){console.log("📊 [MONITORING] fetchAndRenderNasStatus called. forceRefresh:",e,"sequential:",t);const n=document.getElementById("nas-auto-refresh"),o=t||n&&n.checked,a=document.getElementById("monitoring-nas-tbody");if(!a){console.error("📊 [MONITORING] Element #monitoring-nas-tbody not found in DOM!");return}const s=document.getElementById("btn-refresh-nas-status");let i=null;s&&(i=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",i&&(i.style.animation="spin 0.8s linear infinite"));try{if(console.log("📊 [MONITORING] Fetching NAS devices, sequential mode:",o),o){const r=await $.get(`/monitoring/nas?ping=false&refresh=${e}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.nas)){this.renderNasTable(r.nas),r.nas.forEach(l=>{const u=document.getElementById(`nas-row-${l.id}`);if(u){const c=u.querySelector(".nas-sync-indicator");c&&(c.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),ve=!0;for(const l of r.nas){if(J!=="infra"||Z!=="nas")break;const u=document.getElementById(`nas-row-${l.id}`);if(u){const c=u.querySelector(".nas-sync-indicator");c&&(c.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const c=await $.get(`/monitoring/nas/${l.id}/ping?t=${Date.now()}`);if(c&&c.success&&c.nas){const m=c.nas,p=document.getElementById(`nas-row-${m.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",g="#6ee7b7",h="rgba(16, 185, 129, 0.3)",y="Online";m.online||(f="rgba(239, 68, 68, 0.12)",g="#fca5a5",h="rgba(239, 68, 68, 0.3)",y="Offline");const I=m.latency<50?"#6ee7b7":m.latency<150?"#fde047":"#fca5a5",w=m.online?`${m.latency}ms`:"-",E=p.querySelector(".monitor-badge");E&&(E.style.background=f,E.style.color=g,E.style.borderColor=h,E.textContent=y);const D=p.querySelector(".nas-latency");D&&(D.style.color=I,D.textContent=w);const B=p.querySelector(".nas-sync-indicator");B&&(B.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{B.querySelector("polyline")&&(B.innerHTML="")},3e3))}}}catch(c){console.error(`Erro ao pingar NAS ${l.name}:`,c);const m=document.getElementById(`nas-row-${l.id}`);if(m){const p=m.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=m.querySelector(".nas-sync-indicator");f&&(f.innerHTML="")}}}ve=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/nas?refresh=${e}&t=${Date.now()}`,l=await $.get(r);if(l&&l.success&&Array.isArray(l.nas))this.renderNasTable(l.nas);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos dispositivos NAS:",r),a.innerHTML=`
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos dispositivos NAS</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",i&&(i.style.animation=""))}},renderNasTable(e){const t=document.getElementById("monitoring-nas-tbody");if(t){if(e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum dispositivo NAS encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=e.map(n=>{let o="rgba(16, 185, 129, 0.12)",a="#6ee7b7",s="rgba(16, 185, 129, 0.3)",i="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",a="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",i="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",a="#fca5a5",s="rgba(239, 68, 68, 0.3)",i="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
                <tr id="nas-row-${n.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s; cursor: pointer;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${n.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.manufacturer||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.model||"-"}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted); font-size: 0.8rem;">${n.mac||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${a}; border-color:${s};">${i}</span>
                            <span class="nas-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="nas-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join(""),e.forEach(n=>{const o=document.getElementById(`nas-row-${n.id}`);o&&o.addEventListener("click",a=>{a.target.closest("button")||a.target.closest("a")||a.target.closest("input")||this.toggleNasDetails(n.id)})})}},async toggleNasDetails(e){console.log("📊 [MONITORING] Toggling details for NAS ID:",e);const t=document.getElementById(`nas-details-row-${e}`);if(t){t.remove();return}document.querySelectorAll(".nas-details-row").forEach(s=>s.remove());const o=document.getElementById(`nas-row-${e}`);if(!o)return;const a=document.createElement("tr");a.id=`nas-details-row-${e}`,a.className="nas-details-row",a.innerHTML=`
            <td colspan="8" style="padding: 24px; text-align: center; background: rgba(255,255,255,0.01); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--accent);">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    <span style="font-weight: 500; font-size: 0.9rem;">Buscando detalhes de storage e compartilhamentos...</span>
                </div>
            </td>
        `,o.parentNode.insertBefore(a,o.nextSibling);try{const s=await $.get(`/monitoring/nas/${e}/storage?t=${Date.now()}`);if(s&&s.success&&s.storage){const i=s.storage,r=i.volume,l=Math.round(r.used_gb/r.total_gb*100),u=(r.total_gb/1e3).toFixed(1)+" TB",c=(r.used_gb/1e3).toFixed(1)+" TB",m=(r.free_gb/1e3).toFixed(1)+" TB",p=i.bays.map(g=>{const h=g.led==="green"?"#10b981":"#ef4444",y=g.led==="green"?"0 0 8px #10b981":"0 0 8px #ef4444";return`
                        <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                            <!-- HDD Icon with LED -->
                            <div style="position: relative; width: 32px; height: 44px; background: #2a2b2f; border: 2px solid #3d3e42; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 4px 2px; flex-shrink: 0;">
                                <div style="width: 5px; height: 5px; background: ${h}; border-radius: 50%; box-shadow: ${y};"></div>
                                <div style="display: flex; flex-direction: column; gap: 2px; width: 80%;">
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                </div>
                                <span style="font-size: 0.52rem; color: var(--text-muted); font-weight: 700; text-align: center;">BAY ${g.slot}</span>
                            </div>
                            <!-- HDD Details -->
                            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
                                <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${g.disk_model}">${g.disk_model}</span>
                                <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">S/N: ${g.serial}</span>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
                                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent);">${g.capacity}</span>
                                    <span style="font-size: 0.68rem; color: var(--text-muted); background: rgba(255,255,255,0.03); padding: 1px 4px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.05);">${g.temp}</span>
                                </div>
                            </div>
                        </div>
                    `}).join(""),f=i.shares.map(g=>{const h=Math.round(g.used_gb/g.total_gb*100),y=(g.total_gb/1e3).toFixed(1)+" TB",I=(g.used_gb/1e3).toFixed(1)+" TB";return`
                        <div class="nas-share-item" style="display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); font-size: 0.82rem; transition: background 0.2s;">
                            <!-- Folder Icon and Name -->
                            <div style="flex: 2; display: flex; align-items: center; gap: 12px; min-width: 0; padding-right: 10px;">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#f59e0b" stroke-width="2" fill="#f59e0b" fill-opacity="0.2" style="flex-shrink: 0;">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <div style="display: flex; flex-direction: column; min-width: 0;">
                                    <span style="font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${g.name}</span>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${g.description}">${g.description}</span>
                                </div>
                            </div>
                            
                            <!-- Path -->
                            <div style="flex: 3; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; word-break: break-all; padding-right: 15px;">
                                ${g.path}
                            </div>
                            
                            <!-- Usage -->
                            <div style="flex: 2; display: flex; flex-direction: column; gap: 4px; padding-right: 20px;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted);">
                                    <span>${I} / ${y}</span>
                                    <span>${h}%</span>
                                </div>
                                <div style="width: 100%; height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${h}%; height: 100%; background: #f59e0b; border-radius: 2px;"></div>
                                </div>
                            </div>
                            
                            <!-- Permissions -->
                            <div style="flex: 2; min-width: 0;">
                                <span style="background: rgba(245, 158, 11, 0.08); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.2); padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 500; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${g.user_group}">
                                    ${g.user_group}
                                </span>
                            </div>
                        </div>
                    `}).join("");a.innerHTML=`
                    <td colspan="8" style="padding: 24px 28px; background: rgba(255, 255, 255, 0.015); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <div style="display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.25s ease-out; text-align: left;">
                            
                            <!-- TOP: RAID and Volume Capacity Overview -->
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
                                <div style="display: flex; flex-direction: column; gap: 6px;">
                                    <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Volume de Armazenamento</span>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: 1.3rem; font-weight: 700; color: var(--text-main);">${r.raid_level}</span>
                                        <span class="monitor-badge" style="background: rgba(16, 185, 129, 0.12); color: #6ee7b7; border-color: rgba(16, 185, 129, 0.3); padding: 2px 8px; font-size: 0.75rem;">Status: ${r.status}</span>
                                    </div>
                                    <span style="font-size: 0.8rem; color: var(--text-muted);">Sistema de arquivos: <strong style="color: var(--text-main); font-family: monospace;">${r.filesystem}</strong></span>
                                </div>
                                
                                <!-- Overall Space Gauge -->
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; min-width: 250px; flex-grow: 1; max-width: 400px;">
                                    <div style="display: flex; justify-content: space-between; width: 100%; font-size: 0.82rem;">
                                        <span style="color: var(--text-muted);">Espaço Utilizado: <strong style="color: var(--text-main);">${c}</strong></span>
                                        <span style="color: var(--text-muted);">Disponível: <strong style="color: var(--text-main);">${m}</strong></span>
                                    </div>
                                    <!-- Progress Bar -->
                                    <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); display: flex;">
                                        <div style="width: ${l}%; height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 4px;"></div>
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">Capacidade Total: <strong>${u}</strong> (Ocupação: ${l}%)</span>
                                </div>
                            </div>

                            <!-- MIDDLE: Physical Hard Drive Bays (WD Style) -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Gavetas de Discos Físicos (Bays)</span>
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
                                    ${p}
                                </div>
                            </div>

                            <!-- BOTTOM: Dropbox-style Shared Folders / Compartilhamentos -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Pastas Compartilhadas (Pastas de Rede)</span>
                                <div style="display: flex; flex-direction: column; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; overflow: hidden; background: rgba(0, 0, 0, 0.15);">
                                    <!-- Header -->
                                    <div style="display: flex; align-items: center; padding: 10px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.02); font-weight: 600; font-size: 0.78rem; color: var(--text-muted);">
                                        <div style="flex: 2;">Nome da Pasta</div>
                                        <div style="flex: 3;">Caminho de Rede</div>
                                        <div style="flex: 2;">Ocupação</div>
                                        <div style="flex: 2;">Grupo de Acesso</div>
                                    </div>
                                    <!-- Rows -->
                                    <div style="display: flex; flex-direction: column;">
                                        ${f}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </td>
                `}else throw new Error("Dados inválidos recebidos do servidor.")}catch(s){console.error("Erro ao expandir NAS storage:",s),a.innerHTML=`
                <td colspan="8" style="padding: 16px; text-align: center; color: #fca5a5; background: rgba(239, 68, 68, 0.07); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    Erro ao carregar detalhes de storage: ${s.message}
                </td>
            `}}};let de="list";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=j,Qt(),Kt(),Xt(),Tt.init(),gt.init(),j.init()?(console.log("Sessão restaurada:",j.getUser().email),At()):Dt()});let lt,ce,He,_e;function Qt(){lt=document.querySelectorAll(".nav-btn"),ce=document.getElementById("btn-new-item"),He=document.getElementById("login-section"),_e=document.getElementById("app-container")}function Dt(){He&&He.classList.remove("hidden"),_e&&_e.classList.add("hidden"),document.body.style.overflow="hidden"}function Kt(){const e=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=e-5;o<=e+5;o++){const a=document.createElement("option");a.value=o,a.textContent=o,o===e&&(a.selected=!0),n.appendChild(a)}})}function At(){if(He&&He.classList.add("hidden"),_e&&_e.classList.remove("hidden"),document.body.style.overflow="",de="list",Ge(),U.fetch(),ae.fetch(),st.fetch(),q.fetch(),window.auth){const e=document.getElementById("timeline-tab-anexo");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"));const t=document.getElementById("timeline-tab-config");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"))}}function Ge(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section","monitoring-section"].forEach(e=>{d.hide(e)}),ce&&ce.classList.add("hidden"),ft.stop(),de){case"account":case"profile":d.show("account-section"),d.setText("section-title","Minha Conta"),setTimeout(()=>ft.start(),100);break;case"list":d.show("list-section"),d.setText("section-title","Listagem Geral"),j.isAdmin()&&ce&&ce.classList.remove("hidden");break;case"docs":d.show("docs-section"),d.setText("section-title","Documentação");break;case"detail":d.show("detail-section"),d.setText("section-title","Procedimento");break;case"users":d.show("users-section"),d.setText("section-title","Gestão de Usuários");break;case"accounts":d.show("accounts-section"),d.setText("section-title","Gestão de Contas"),q.handleSearch();break;case"timeline":d.show("timeline-section"),d.setText("section-title","Timeline");break;case"telephony":d.show("telephony-section"),d.setText("section-title","Telefonia");break;case"monitoring":d.show("monitoring-section"),d.setText("section-title","Monitoramento"),gt.fetch();break}Mt()}function Mt(){const e=j.isAdmin();d.toggle("nav-users",!e),d.toggle("nav-accounts",!e),ce&&ce.classList.toggle("role-hidden",!e);const t=document.getElementById("btn-floating-edit");t&&t.classList.toggle("role-hidden",!e),document.querySelectorAll(".btn-actions-container").forEach(i=>{i.classList.toggle("role-hidden",!e)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(i=>{const r=document.getElementById(i);r&&r.classList.toggle("role-hidden",!e)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!e);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!e);const a=document.getElementById("btn-new-doc");a&&a.classList.toggle("role-hidden",!e);const s=j.getUser();if(s){let i=s.name;(i.toLowerCase().startsWith("usuário ")||i.toLowerCase().startsWith("usuario "))&&(i=i.substring(8)),d.setText("profile-name-display",i),d.setText("profile-role-display",s.role);let r=i.substring(0,2).toUpperCase();const l=i.trim().split(/\s+/);l.length>1&&(r=(l[0][0]+l[l.length-1][0]).toUpperCase()),d.setText("profile-avatar-initials",r)}}function Xt(){const e=document.getElementById("sidebar"),t=document.getElementById("sidebar-toggle");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("collapsed")}),lt.forEach(i=>{i.addEventListener("click",()=>{if(lt.forEach(r=>r.classList.remove("active")),i.classList.add("active"),de=i.dataset.section,Ge(),window.innerWidth<=768){e.classList.remove("open");const r=document.getElementById("sidebar-overlay");r&&r.classList.remove("active")}})}),window.addEventListener("SectionChange",i=>{de=i.detail.section,Ge()}),d.on("login-form","submit",async i=>{i.preventDefault();const r=document.getElementById("login-btn"),l=document.getElementById("login-error");r&&(r.disabled=!0);const u=await j.login(d.getValue("login-email"),d.getValue("login-password"));r&&(r.disabled=!1),u.success?At():l&&(l.innerText=u.error,l.classList.remove("hidden"))}),d.on("btn-logout","click",()=>{const i=document.getElementById("auto-refresh-toggle");i&&i.checked&&(i.checked=!1,i.dispatchEvent(new Event("change"))),j.logout(),Dt()}),document.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{const r=i.closest(".modal");r&&r.classList.add("hidden")})}),window.UsersHandler=st,window.DocsHandler=ae,window.ProceduresHandler=U,window.AccountsHandler=q,window.TelephonyHandler=Ce,window.monitoringHandler=gt,["extensions","queues","blf","users"].forEach(i=>{d.on(`tab-telephony-${i}`,"click",()=>Ce.setActiveTab(i))}),d.on("telephony-search","input",i=>Ce.search(i.target.value.toLowerCase())),d.on("telephony-page-size","change",i=>Ce.setPageSize(i.target.value)),d.on("telephony-reload-btn","click",()=>{const i=document.getElementById("telephony-search");i&&(i.value=""),Ce.fetch()}),d.on("accounts-search","input",()=>q.handleSearch()),d.on("filter-status","change",()=>q.handleSearch()),d.on("filter-date-toggle","change",i=>{const r=document.getElementById("sidebar-mini-calendar-list");r&&(r.style.opacity=i.target.checked?"1":"0.4",r.style.pointerEvents=i.target.checked?"auto":"none"),q.handleSearch()}),d.on("filter-cal-month","change",()=>q.handleFilterChange(!0)),d.on("filter-cal-year","change",()=>q.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(i=>{d.on(i,"change",()=>{de==="accounts"&&q.renderDashboard()})}),d.on("btn-dash-clear-dates","click",()=>{d.setValue("dash-filter-start",""),d.setValue("dash-filter-end",""),d.setValue("dash-filter-type","Todos"),d.setValue("dash-filter-status","Todos"),d.setValue("dash-filter-payment","Todos"),q.resetMultiselects(),d.setValue("dash-sort-empresas","desc"),d.setValue("dash-sort-categorias","desc"),de==="accounts"&&q.renderDashboard()}),d.on("user-form","submit",i=>st.save(i)),d.on("doc-form","submit",i=>ae.handleUpload(i)),d.on("account-form","submit",i=>q.save(i)),d.on("faq-form","submit",i=>U.saveMeta(i));const n=document.getElementById("proc-color-palette"),o=document.getElementById("proc-color");n&&o&&(n.addEventListener("click",i=>{const r=i.target.closest(".color-swatch");if(r)if(r.id==="color-custom-swatch")o.click();else{const l=r.dataset.color;l&&(o.value=l,n.querySelectorAll(".color-swatch").forEach(u=>u.classList.remove("active")),r.classList.add("active"))}}),o.addEventListener("input",i=>{const r=document.getElementById("color-custom-swatch");r&&(r.style.background=i.target.value,n.querySelectorAll(".color-swatch").forEach(l=>l.classList.remove("active")),r.classList.add("active"))})),d.on("btn-new-item","click",()=>{if(d.setText("modal-form-title","Novo Procedimento"),d.setValue("proc-id",""),d.setValue("proc-content","[]"),n){n.querySelectorAll(".color-swatch").forEach(r=>r.classList.remove("active"));const i=n.querySelector('[data-color="#4F46E5"]');i&&i.classList.add("active")}o&&(o.value="#4F46E5"),d.show("modal-form")}),d.on("btn-new-account","click",()=>q.openAccountModal()),d.on("btn-new-account-cal","click",()=>q.openAccountModal()),d.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),d.setValue("user-id-form",""),d.show("modal-user")}),d.on("list-search","input",i=>{U.search(i.target.value.toLowerCase())}),d.on("doc-search","input",i=>{ae.search(i.target.value.toLowerCase())}),d.on("doc-dash-search","input",()=>{ae.renderDashboard()}),d.on("doc-dash-filter-category","change",()=>{ae.renderDashboard()}),d.on("doc-dash-filter-status","change",()=>{ae.renderDashboard()}),d.on("btn-new-doc","click",()=>{d.show("modal-upload")}),["geral","contratos","termo-de-uso","dashboard"].forEach(i=>{d.on(`tab-doc-${i}`,"click",()=>{let r;i==="termo-de-uso"?r="Termo de Uso":i==="dashboard"?r="dashboard":r=i,ae.setActiveTab(r)})}),d.on("doc-category","change",i=>{const r=i.target.value.toLowerCase(),l=document.getElementById("doc-dates-container");l&&(l.style.display=r==="contratos"||r==="termo de uso"?"grid":"none")}),d.on("doc-indefinite","change",i=>{const r=document.getElementById("doc-end-date");r&&(r.disabled=i.target.checked,i.target.checked&&(r.value=""))});const a=document.getElementById("drop-zone"),s=document.getElementById("doc-file");a&&s&&(a.addEventListener("click",i=>{i.target!==s&&s.click()}),s.addEventListener("click",i=>{i.stopPropagation()}),s.addEventListener("change",i=>{i.target.files.length>0&&d.setText("file-name-display",i.target.files[0].name)}),a.addEventListener("dragover",i=>{i.preventDefault(),a.classList.add("dragover")}),a.addEventListener("dragleave",()=>{a.classList.remove("dragover")}),a.addEventListener("drop",i=>{i.preventDefault(),a.classList.remove("dragover"),i.dataTransfer.files.length>0&&(s.files=i.dataTransfer.files,d.setText("file-name-display",i.dataTransfer.files[0].name))})),d.on("toggle-list","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),U.setListingMode("list")}),d.on("toggle-cards","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),U.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes"].forEach(i=>{d.on(`tab-acc-${i}`,"click",r=>{document.querySelectorAll(".acc-tab-btn").forEach(p=>p.classList.remove("active")),r.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(p=>{p.classList.add("hidden"),p.classList.remove("active")});const l=document.getElementById("accounts-dashboard-view");l&&(l.classList.add("hidden"),l.classList.remove("active"));const u=i==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${i}`,c=document.getElementById(u);c&&(c.classList.remove("hidden"),c.classList.add("active"));const m=document.getElementById("calendar-view-toggle-container");m&&(i==="calendario"?(m.classList.remove("hidden"),m.style.display="flex"):(m.classList.add("hidden"),m.style.display="none")),q.setAccountsViewMode(i==="calendario"?"calendar":i==="dashboard"?"dashboard":i==="notificacoes"?"notificacoes":"list")})}),["day","month","year"].forEach(i=>{d.on(`toggle-accounts-cal-${i}`,"click",r=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(l=>l.classList.remove("active")),r.currentTarget.classList.add("active"),["day","month","year"].forEach(l=>{document.getElementById(`cal-${l}-view-container`).classList.toggle("hidden-cal-view",l!==i)}),q.setCalendarSubView(i)})}),d.on("btn-prev-date-nav","click",()=>q.shiftCalendarDate(-1)),d.on("btn-next-date-nav","click",()=>q.shiftCalendarDate(1)),d.on("btn-back-to-accounts","click",()=>{d.hide("dedicated-account-page"),d.show("accounts-section"),Mt()}),d.on("btn-back-to-list","click",()=>{const i=document.getElementById("procedure-edit-wrapper");i&&!i.classList.contains("hidden")?U.toggleEditMode(!1):(de="list",Ge())}),d.on("btn-floating-edit","click",()=>U.toggleEditMode(!0)),d.on("btn-cancel-edit","click",()=>U.toggleEditMode(!1)),d.on("btn-save-procedure","click",()=>U.handleSaveProcedure()),d.on("confirm-yes","click",()=>{d.hide("modal-confirm"),U.openDetail(U.getPendingProcId())}),d.on("confirm-no","click",()=>{d.hide("modal-confirm")}),d.on("procedure-search","input",i=>{U.filterProcedureContent(i.target.value)}),d.on("btn-add-block","click",()=>{const i=document.getElementById("section-title-input"),r=document.getElementById("section-type-input");i&&(i.value=""),r&&(r.value="TEXTO"),d.show("modal-add-section")}),d.on("btn-confirm-add-section","click",()=>{const i=d.getValue("section-title-input"),r=d.getValue("section-type-input");if(!i)return alert("Por favor, informe o título da seção.");U.addSection(i,r),d.hide("modal-add-section")})}
