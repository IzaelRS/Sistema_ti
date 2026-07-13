(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();const Le="/api",k={async get(n){const t=await fetch(`${Le}${n}`);if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.error||`HTTP error! status: ${t.status}`)}return await t.json()},async post(n,t){const e=await fetch(`${Le}${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok){const o=await e.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${e.status}`)}return await e.json()},async put(n,t){const e=await fetch(`${Le}${n}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok){const o=await e.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${e.status}`)}return await e.json()},async delete(n){const t=await fetch(`${Le}${n}`,{method:"DELETE"});if(!t.ok){const e=await t.json().catch(()=>({}));throw new Error(e.error||`HTTP error! status: ${t.status}`)}return await t.json()},async upload(n,t){const e=await fetch(`${Le}${n}`,{method:"POST",body:t});if(!e.ok){const o=await e.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${e.status}`)}return await e.json()}};let Ee=null;const K={init(){const n=localStorage.getItem("user");if(n)try{return Ee=JSON.parse(n),!0}catch{return this.logout(),!1}return!1},getUser(){return Ee},isAdmin(){return Ee&&Ee.role==="Administrador"},async login(n,t){try{const e=await k.post("/login",{email:n,password:t});return Ee=e,localStorage.setItem("user",JSON.stringify(e)),{success:!0,user:e}}catch(e){return{success:!1,error:e.message}}},logout(){Ee=null,localStorage.removeItem("user")}},c={show(n){const t=document.getElementById(n);t&&t.classList.remove("hidden")},hide(n){const t=document.getElementById(n);t&&t.classList.add("hidden")},toggle(n,t){const e=document.getElementById(n);e&&e.classList.toggle("hidden",t)},setText(n,t){const e=document.getElementById(n);e&&(e.innerText=t)},setValue(n,t){const e=document.getElementById(n);e&&(e.value=t)},getValue(n){const t=document.getElementById(n);return t?t.value:null},on(n,t,e){const o=document.getElementById(n);o&&o.addEventListener(t,e)}},Tt={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const n=window.innerWidth<=768;this.particleCount=n?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let t=0;t<this.particleCount;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const n=document.getElementById("account-section");n&&(this.canvas.width=n.clientWidth,this.canvas.height=n.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let n=0;n<this.particles.length;n++){const t=this.particles[n];t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.canvas.width)&&(t.vx*=-1),(t.y<0||t.y>this.canvas.height)&&(t.vy*=-1),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let e=n+1;e<this.particles.length;e++){const o=this.particles[e],i=t.x-o.x,s=t.y-o.y,a=Math.sqrt(i*i+s*s);if(a<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const r=1-a/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${r*.4})`,this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let Se=[];const vt={async fetch(){try{Se=await k.get("/users"),this.render(Se)}catch(n){console.error("Error fetching Users:",n)}},getUsers(){return Se},render(n){const t=document.getElementById("user-table-body");t&&(t.innerHTML=n.map(e=>{const o=e.role==="Administrador",i=K.isAdmin()?`
                <td onclick="event.stopPropagation()">
                    <div class="btn-actions-container">
                        <button class="btn-icon" onclick="window.UsersHandler.openEditModal(${e.id})" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="btn-icon delete" onclick="window.UsersHandler.delete(${e.id})" title="Excluir" ${o?'disabled style="opacity:0.3;cursor:not-allowed"':""}>
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>`:"";return`
            <tr>
                <td><strong>${e.name}</strong></td>
                <td>${e.email}</td>
                <td><span class="badge" style="background: ${e.role==="Administrador"?"var(--accent)":"rgba(255,255,255,0.1)"}">${e.role}</span></td>
                ${i}
            </tr>`}).join(""))},openEditModal(n){const t=Se.find(e=>e.id===n);t&&(c.setText("modal-user-title","Editar Usuário"),c.setValue("user-id-form",t.id),c.setValue("user-name-form",t.name),c.setValue("user-email-form",t.email),c.setValue("user-password-form",""),c.setValue("user-role-form",t.role),c.show("modal-user"))},async save(n){n.preventDefault();const t=c.getValue("user-id-form"),e={name:c.getValue("user-name-form"),email:c.getValue("user-email-form"),password:c.getValue("user-password-form"),role:c.getValue("user-role-form")};try{t?await k.put(`/users/${t}`,e):await k.post("/users",e),c.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(t?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(n){if(confirm("Deseja excluir este usuário?"))try{await k.delete(`/users/${n}`),this.fetch()}catch(t){alert("Erro ao excluir: "+t.message)}},search(n){const t=Se.filter(e=>e.name.toLowerCase().includes(n)||e.email.toLowerCase().includes(n));this.render(t)}};let Ue=[],fe="Geral",W=1;const Ae=10;let Lt=[];const ge={async fetch(){try{W=1,Ue=await k.get("/documents"),this.filterAndRender()}catch(n){console.error("Error fetching Documents:",n)}},setActiveTab(n){fe=n,W=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(t=>{const e=t.textContent.trim().toLowerCase();t.classList.toggle("active",e===n.toLowerCase())}),this.filterAndRender()},filterAndRender(){const n=document.querySelector(".docs-header");if(fe.toLowerCase()==="dashboard")n&&(n.style.display="none"),c.hide("doc-list-container"),c.show("doc-dashboard-container"),this.renderDashboard();else{n&&(n.style.display="flex"),c.show("doc-list-container"),c.hide("doc-dashboard-container");const t=Ue.filter(e=>(e.category||"Geral").toLowerCase()===fe.toLowerCase());this.render(t)}},calculateRemainingTime(n){if(!n||n==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const t=new Date;t.setHours(0,0,0,0);const e=new Date(n+"T00:00:00");e.setHours(0,0,0,0);const o=e.getTime()-t.getTime(),i=Math.ceil(o/(1e3*60*60*24));if(i<0){const s=Math.abs(i);let a=`Expirado há ${s} dia(s)`;return s>=30&&(a=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:a,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:i}}else{if(i===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:i};if(i<=30)return{text:`Expira em ${i} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:i};{const s=Math.floor(i/30);let a=`Expira em ${s} mês(es)`;if(s>=12){const r=Math.floor(s/12),l=s%12;a=`Expira em ${r} ano(s)${l>0?` e ${l} mês(es)`:""}`}return{text:a,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:i}}}},renderDashboard(){const n=document.getElementById("doc-dashboard-tbody");if(!n)return;const t=Ue.filter(m=>{const h=(m.category||"").toLowerCase();return h==="contratos"||h==="termo de uso"});let e=0,o=0,i=0,s=0;t.forEach(m=>{const h=(m.category||"").toLowerCase(),v=this.calculateRemainingTime(m.end_date);v.status==="expired"?s++:v.status==="critical"?(i++,h==="contratos"&&e++,h==="termo de uso"&&o++):(h==="contratos"&&e++,h==="termo de uso"&&o++)}),c.setText("doc-kpi-active-contracts",e),c.setText("doc-kpi-active-terms",o),c.setText("doc-kpi-warning-docs",i),c.setText("doc-kpi-expired-docs",s);const a=document.getElementById("doc-dash-search"),r=document.getElementById("doc-dash-filter-category"),l=document.getElementById("doc-dash-filter-status"),d=a?a.value.toLowerCase().trim():"",u=r?r.value:"Todos",g=l?l.value:"Todos";let p=t.filter(m=>{if(d&&!m.original_name.toLowerCase().includes(d)||u!=="Todos"&&(m.category||"").toLowerCase()!==u.toLowerCase())return!1;const h=this.calculateRemainingTime(m.end_date);return!(g!=="Todos"&&(g==="Ativos"&&(h.status==="expired"||h.status==="critical")||g==="Expirando"&&h.status!=="critical"||g==="Expirados"&&h.status!=="expired"||g==="Indeterminado"&&h.status!=="indefinite"))});if(p.sort((m,h)=>{const v=this.calculateRemainingTime(m.end_date),I=this.calculateRemainingTime(h.end_date),B={expired:1,critical:2,active:3,indefinite:4},E=B[v.status]||5,w=B[I.status]||5;return E!==w?E-w:v.days-I.days}),p.length===0){n.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const f=window.auth&&window.auth.isAdmin();n.innerHTML=p.map(m=>{const h=m.mimetype==="application/pdf"?"📕":"🖼️",v=m.start_date?new Date(m.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",I=m.end_date?m.end_date==="Indefinido"?"Indefinido":new Date(m.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",B=this.calculateRemainingTime(m.end_date),E=f?`<button class="btn-delete" onclick="window.DocsHandler.delete(${m.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
                <tr>
                    <td>
                        <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                            <span>${h}</span>
                            <span title="${m.original_name}">${m.original_name}</span>
                        </span>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.75rem;">
                            ${m.category}
                        </span>
                    </td>
                    <td>${v}</td>
                    <td>${I}</td>
                    <td>
                        <span class="badge" style="background: ${B.color}; color: ${B.textColor}; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                            ${B.text}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <a href="${m.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                Ver
                            </a>
                            ${E}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(n){const t=document.getElementById("doc-list-body");if(!t)return;const e=document.getElementById("doc-list-thead"),o=fe.toLowerCase()==="contratos"||fe.toLowerCase()==="termo de uso",i=window.auth&&window.auth.isAdmin(),s=i?"":'class="role-hidden"';Lt=n;const a=n.length,r=Math.ceil(a/Ae);W>r&&(W=Math.max(1,r)),W<1&&(W=1);const l=(W-1)*Ae,d=n.slice(l,l+Ae);if(e&&(o?e.innerHTML=`
                    <tr>
                        <th>Nome</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Cadastro</th>
                        <th id="th-doc-actions" ${s}>Ações</th>
                    </tr>
                `:e.innerHTML=`
                    <tr>
                        <th>Nome</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th id="th-doc-actions" ${s}>Ações</th>
                    </tr>
                `),d.length===0){t.innerHTML=`
                <tr>
                    <td colspan="${o?7:5}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `,this.renderPaginationControls("doc-pagination",0,0);return}t.innerHTML=d.map(u=>{const g=u.mimetype==="application/pdf"?"📕":"🖼️",p=(u.size/1024).toFixed(1)+" KB",f=u.created_at?new Date(u.created_at).toLocaleDateString("pt-BR"):"-",m=u.mimetype==="application/pdf"?"PDF":"Imagem",h=i?`<button class="btn-delete" onclick="window.DocsHandler.delete(${u.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",v=u.start_date?new Date(u.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",I=u.end_date?u.end_date==="Indefinido"?"Indefinido":new Date(u.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-";return o?`
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${g}</span>
                                <span title="${u.original_name}">${u.original_name}</span>
                            </span>
                        </td>
                        <td>${p}</td>
                        <td>${m}</td>
                        <td>${v}</td>
                        <td>${I}</td>
                        <td>${f}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${u.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
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
                                <span>${g}</span>
                                <span title="${u.original_name}">${u.original_name}</span>
                            </span>
                        </td>
                        <td>${p}</td>
                        <td>${m}</td>
                        <td>${f}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${u.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${h}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",r,a)},async handleUpload(n){n.preventDefault();const t=document.getElementById("doc-file"),e=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!t.files.length){alert("Selecione um arquivo.");return}const i=new FormData,s=e?e.value:"Geral";i.append("category",s),i.append("customName",o?o.value:""),i.append("document",t.files[0]);const a=s.toLowerCase();if(a==="contratos"||a==="termo de uso"){const r=document.getElementById("doc-start-date"),l=document.getElementById("doc-end-date"),d=document.getElementById("doc-indefinite");r&&r.value&&i.append("startDate",r.value),d&&d.checked?i.append("endDate","Indefinido"):l&&l.value&&i.append("endDate",l.value)}try{await k.upload("/documents",i),c.hide("modal-upload"),document.getElementById("doc-form").reset();const r=document.getElementById("doc-dates-container");r&&(r.style.display="none");const l=document.getElementById("doc-end-date");l&&(l.disabled=!1),c.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(r){console.error(r),alert("Erro ao subir arquivo.")}},async delete(n){if(confirm("Deletar este documento?"))try{await k.delete(`/documents/${n}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(n){if(fe.toLowerCase()==="dashboard")this.renderDashboard();else{W=1;const t=Ue.filter(e=>(e.category||"Geral").toLowerCase()===fe.toLowerCase()&&e.original_name.toLowerCase().includes(n));this.render(t)}},changePage(n){W=n,this.render(Lt)},renderPaginationControls(n,t,e){const o=document.getElementById(n);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
            <button class="pagination-btn" 
                    ${W===1?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${W-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=W-1&&l<=W+1)&&(s&&l-s>1&&(i+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),i+=`
                    <button class="pagination-btn ${l===W?"active":""}" 
                            onclick="window.DocsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);i+=`
            <button class="pagination-btn" 
                    ${W===t?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${W+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const a=(W-1)*Ae+1,r=Math.min(W*Ae,e);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${e}
            </span>
        `,o.innerHTML=i}};let pe=[],M={summaries:[]},St=null,j=null,st="list",De=null,de=null,At=null,J=1;const Me=10;let Ge=[];const X={getPendingProcId(){return St},async fetch(){try{J=1,pe=await k.get("/procedures"),this.renderTable(pe)}catch(n){console.error("Error fetching FAQs:",n)}},getFaqs(){return pe},setListingMode(n){st=n,J=1,this.renderTable(Ge.length?Ge:pe)},renderTable(n){const t=document.getElementById("list-table-container"),e=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!t||!e||!o)return;Ge=n;const i=n.length,s=Math.ceil(i/Me);J>s&&(J=Math.max(1,s)),J<1&&(J=1);const a=(J-1)*Me,r=n.slice(a,a+Me);st==="list"?(c.show("list-table-container"),c.hide("list-cards-container"),r.length===0?o.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            Nenhum procedimento encontrado.
                        </td>
                    </tr>
                `:o.innerHTML=r.map(d=>{const u=K.isAdmin()?`
                        <td>
                            <div class="btn-actions-container">
                                <button class="btn-icon edit" data-action="edit" data-id="${d.id}" title="Editar">
                                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                </button>
                                <button class="btn-icon delete" data-action="delete" data-id="${d.id}" title="Deletar">
                                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </td>`:"";return`
                    <tr data-action="open" data-id="${d.id}" class="draggable-row">
                        <td style="border-left: 5px solid ${d.color||"#4F46E5"}"><strong>${d.name||d.title||"Sem título"}</strong></td>
                        <td>${d.responsible||"N/A"}</td>
                        <td><span class="badge" style="background: var(--accent); color: var(--bg-dark);">${d.group_name||"N/A"}</span></td>
                        <td>${d.note||"-"}</td>
                        ${u}
                    </tr>`}).join("")):(c.hide("list-table-container"),c.show("list-cards-container"),r.length===0?e.innerHTML=`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum procedimento encontrado.
                    </div>
                `:e.innerHTML=r.map(d=>{const u=K.isAdmin()?`
                        <div class="card-footer">
                            <div class="btn-actions-container">
                                <button class="btn-icon edit" data-action="edit" data-id="${d.id}" title="Editar">
                                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                </button>
                                <button class="btn-icon delete" data-action="delete" data-id="${d.id}" title="Deletar">
                                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </div>`:"";return`
                    <div class="card draggable-card" data-action="open" data-id="${d.id}" style="border-top: 5px solid ${d.color||"#4F46E5"}">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <span class="badge" style="background: var(--accent); color: var(--bg-dark);">${d.group_name||"N/A"}</span>
                            </div>
                            <h3>${d.name||d.title||"Sem título"}</h3>
                            <div class="card-details" style="border: none; padding: 0;">
                                <div style="margin-bottom: 5px;"><strong>Responsável:</strong> ${d.responsible||"N/A"}</div>
                                ${d.note?`<div><strong>Nota:</strong> ${d.note}</div>`:""}
                            </div>
                        </div>
                        ${u}
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,i),(st==="list"?o:e).addEventListener("click",function(u){const g=u.target.closest('[data-action="edit"], [data-action="delete"]');if(g){u.stopPropagation(),u.preventDefault();const f=Number(g.dataset.id);g.dataset.action==="edit"?X.openEditModal(f):g.dataset.action==="delete"&&X.deleteProcedure(f);return}const p=u.target.closest('[data-action="open"]');if(p){const f=Number(p.dataset.id);X.openDetail(f)}})},openDetail(n){const t=pe.find(o=>o.id===n);if(!t)return;c.setText("detail-title",t.name||t.title||"Sem título"),c.setValue("proc-id",t.id);try{let o=t.content?JSON.parse(t.content):[];Array.isArray(o)?M={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?M=o:M={summaries:[]}}catch{M={summaries:[]}}M.summaries.length>0?j=M.summaries[0].id:j=null,this.toggleEditMode(!1),this.renderProcedureView();const e=document.getElementById("procedure-search");e&&(e.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(n){const t=pe.find(e=>e.id===n);t&&(c.setText("modal-form-title","Editar Procedimento"),c.setValue("proc-id",t.id),c.setValue("proc-name",t.name||t.title||""),c.setValue("proc-responsible",t.responsible||""),c.setValue("proc-group",t.group_name||""),c.setValue("proc-note",t.note||""),c.setValue("proc-content",t.content||""),c.setValue("proc-color",t.color||"#4F46E5"),c.show("modal-form"))},async saveMeta(n){n&&n.preventDefault();const t=c.getValue("proc-id"),e={name:c.getValue("proc-name").toUpperCase(),responsible:c.getValue("proc-responsible").toUpperCase(),group_name:c.getValue("proc-group"),note:c.getValue("proc-note"),content:c.getValue("proc-content"),color:c.getValue("proc-color")};try{const o=t?`/procedures/${t}`:"/procedures";St=(t?await k.put(o,e):await k.post(o,e)).id,c.hide("modal-form"),document.getElementById("faq-form").reset(),c.setValue("proc-responsible","TI"),c.setValue("proc-group","Geral"),await this.fetch(),c.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(n){if(confirm("Deseja excluir este procedimento?"))try{await k.delete(`/procedures/${n}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(n){const t=document.querySelector(".procedure-sidebar");n?(c.hide("procedure-view-container"),c.hide("procedure-view-sidebar"),c.show("procedure-edit-wrapper"),c.show("procedure-edit-sidebar"),c.hide("btn-floating-edit"),t&&t.classList.add("glass","has-border"),M.summaries.length>0?M.summaries.find(e=>e.id===j)||(j=M.summaries[0].id):j=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(c.show("procedure-view-container"),c.show("procedure-view-sidebar"),c.hide("procedure-edit-wrapper"),c.hide("procedure-edit-sidebar"),c.show("btn-floating-edit"),t&&t.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const n=document.getElementById("procedure-view-container"),t=document.getElementById("procedure-view-index");if(!n||!t)return;if(M.summaries.length===0){n.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',t.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let e="",o="";M.summaries.forEach((i,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${i.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${i.title}</li>`,e+=`<div id="sum-view-${i.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(M.summaries.length>1||i.title!=="Sumário 1")&&(e+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${i.title}</h4>`),i.sections.length===0&&(e+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const a=i.sections.map((r,l)=>{let d="";if(r.type==="TEXTO")d=`<div class="gh-content"><div class="gh-text-view">${r.data||"Sem conteúdo."}</div></div>`;else if(r.type==="FAQ")d='<div class="gh-faq-list">'+(r.data||[]).map((p,f)=>`
                         <div class="gh-accordion" id="gh-faq-${i.id}-${l}-${f}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${i.id}-${l}-${f}')">
                                   <div class="gh-accordion-title">${p.q||"Pergunta sem título"}</div>
                                   <span class="gh-accordion-icon">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                   </span>
                              </div>
                              <div class="gh-accordion-content gh-text-view">${p.a||"Sem resposta."}</div>
                         </div>
                     `).join("")+"</div>";else if(r.type==="DOCUMENTO"&&r.data&&r.data.path){const g=r.data.mimetype&&r.data.mimetype.startsWith("image/"),p=r.data.mimetype==="application/pdf";let f="";g?f=`<div class="doc-embed-container"><img src="${r.data.path}" alt="${r.data.name}" class="doc-embed-image" /></div>`:p?f=`<div class="doc-embed-container" style="display: block;"><iframe src="${r.data.path}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="doc-embed-pdf" title="${r.data.name}"></iframe></div>`:f='<div class="doc-embed-container" style="padding: 20px; text-align: center; color: var(--text-muted);"><p>Visualização não disponível para este formato.</p></div>',d=`
                        <div class="gh-doc-container">
                            ${f}
                            <div class="doc-actions" style="margin-top: 15px; text-align: center;">
                                <a href="${r.data.path}" target="_blank" class="btn-secondary-small" style="display: inline-block;">
                                    Abrir/Download Original (${r.data.name})
                                </a>
                            </div>
                        </div>`}let u="var(--text-muted)";return r.type==="DOCUMENTO"?u="#10B981":r.type==="FAQ"?u="#FBBF24":r.type==="TEXTO"&&(u="#3B82F6"),`
                     <div class="gh-box">
                         <div class="gh-header" style="display: flex; align-items: center; gap: 10px;">
                             <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${u};"></span>
                             <h3>${r.title}</h3>
                         </div>
                         ${d}
                     </div>
                 `}).join("");e+=a,e+="</div>"}),t.innerHTML=o,n.innerHTML=e},filterProcedureContent(n){n=n.toLowerCase();const t=document.getElementById("procedure-view-container");if(!t)return;t.querySelectorAll(".gh-box").forEach(o=>{const i=o.querySelector(".gh-faq-list");let s=!1;const a=o.querySelector(".gh-header"),r=a?a.textContent.toLowerCase().includes(n):!1;i&&i.querySelectorAll(".gh-accordion").forEach(u=>{const g=u.textContent.toLowerCase();r||g.includes(n)?(u.classList.remove("hidden"),s=!0):u.classList.add("hidden")});const l=o.textContent.toLowerCase();r||l.includes(n)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const n=document.getElementById("procedure-edit-index"),t=document.getElementById("btn-add-block"),e=document.getElementById("current-summary-name");if(!n)return;n.innerHTML=M.summaries.map((i,s)=>`
             <li class="sidebar-index-item ${i.id===j?"active":""} editable-section style-none"
                 draggable="true" 
                 ondragstart="window.ProceduresHandler.handleSumDragStart(event, ${s})"
                 ondragover="window.ProceduresHandler.handleDragOver(event)"
                 ondrop="window.ProceduresHandler.handleSumDrop(event, ${s})"
                 ondragend="window.ProceduresHandler.handleDragEnd(event)"
                 onclick="window.ProceduresHandler.selectSummary('${i.id}')">
                 
                 <div style="display: flex; align-items: center; width: 100%;">
                     <span class="drag-handle" title="Arraste para mover" style="cursor: grab; margin-right: 8px;">
                         <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                     </span>
                     <input type="text" value="${i.title}" 
                            onclick="event.stopPropagation()"
                            onblur="window.ProceduresHandler.updateSummaryTitle('${i.id}', this.value)" 
                            placeholder="Nome do sumário">
                 </div>
                 <button class="btn-delete-section" style="margin-left: 5px; padding: 2px;"
                         onclick="event.stopPropagation(); window.ProceduresHandler.removeSummary('${i.id}')" title="Remover Sumário">
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
             </li>
            `).join("");const o=M.summaries.find(i=>i.id===j);o?(e.textContent=o.title,e.style.color="var(--text-main)",t.classList.remove("hidden")):(e.textContent="Nenhum sumário selecionado",e.style.color="var(--accent)",t.classList.add("hidden"))},selectSummary(n){j=n,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(n,t){const e=M.summaries.find(i=>i.id===n);e&&(e.title=t||"Sem título"),this.renderProcedureBuilderSidebar();const o=M.summaries.find(i=>i.id===j);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const n="sum_"+Date.now();M.summaries.push({id:n,title:`Sumário ${M.summaries.length+1}`,sections:[]}),j=n,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(n){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(M.summaries=M.summaries.filter(t=>t.id!==n),j===n&&(j=M.summaries.length>0?M.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const n=document.getElementById("procedure-edit-container");if(!n)return;if(!j){n.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const t=M.summaries.find(o=>o.id===j);if(!t)return;const e=t.sections;if(e.length===0){n.innerHTML=`<p class="empty-state">Nenhum campo em "${t.title}". Clique em "+ Novo Container" para começar.</p>`;return}n.innerHTML=e.map((o,i)=>`
             <div class="section-container glass editable-section" 
                  draggable="false" 
                  ondragstart="window.ProceduresHandler.handleSecDragStart(event, ${i}, '${t.id}')"
                  ondragover="window.ProceduresHandler.handleDragOver(event)"
                  ondrop="window.ProceduresHandler.handleSecDrop(event, ${i}, '${t.id}')"
                  ondragend="window.ProceduresHandler.handleDragEnd(event)">
                 <div class="section-header">
                     <span class="drag-handle" title="Segure para arrastar" style="cursor: grab; margin-right: 15px; color: var(--text-muted); display: flex;"
                           onmousedown="this.closest('.editable-section').setAttribute('draggable', 'true')"
                           onmouseup="this.closest('.editable-section').setAttribute('draggable', 'false')"
                           onmouseleave="this.closest('.editable-section').setAttribute('draggable', 'false')">
                         <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                     </span>
                     <input type="text" class="section-title-input" value="${o.title}" onblur="window.ProceduresHandler.updateSectionTitle(${i}, this.value)" placeholder="Título da Seção">
                     <span class="badge-type">${o.type}</span>
                     <button class="btn-delete-icon" onclick="window.ProceduresHandler.removeSection(${i})">&times;</button>
                 </div>
                 <div class="section-content" style="padding: 15px;">
                      <!-- Editor simplified for extraction -->
                      ${o.type==="TEXTO"?`
                      <div class="rte-container">
                          ${window.ProceduresHandler.getRteToolbarHTML()}
                          <div class="proc-textarea-edit" contenteditable="true" placeholder="Comece a digitar o conteúdo da seção..." 
                               oninput="window.ProceduresHandler.updateSectionData(${i}, this.innerHTML)" 
                               onblur="window.ProceduresHandler.updateSectionData(${i}, this.innerHTML)">${o.data||""}</div>
                      </div>
                      `:""}
                      ${o.type==="DOCUMENTO"?o.data?`<div class="doc-uploaded-state">
                              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                              <a href="${o.data.path}" target="_blank" class="doc-link">${o.data.name}</a> 
                              <button class="btn-remove-doc" onclick="window.ProceduresHandler.updateSectionData(${i}, null)" title="Remover Documento">Remover</button>
                          </div>`:`<div class="doc-dropzone" 
                                ondragover="event.preventDefault(); this.classList.add('dragover');" 
                                ondragleave="this.classList.remove('dragover');" 
                                ondrop="event.preventDefault(); this.classList.remove('dragover'); window.ProceduresHandler.handleSectionFileDrop(${i}, event);"
                                onclick="this.querySelector('input[type=file]').click();">
                              <input type="file" style="display: none;" onchange="window.ProceduresHandler.handleSectionFileUpload(${i}, this)">
                              <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" stroke-width="1.5" fill="none" style="margin-bottom: 15px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              <p><strong>Clique para selecionar</strong> ou arraste o arquivo aqui</p>
                              <span style="font-size: 0.85rem; color: var(--text-muted); margin-top: 5px;">Suporta PDF, Imagens (PNG, JPG)</span>
                          </div>`:""}
                      ${o.type==="FAQ"?`
                      <div class="faq-items">
                          ${(o.data||[]).map((s,a)=>`
                              <div class="faq-pair">
                                  <button class="btn-remove-faq" onclick="window.ProceduresHandler.removeFaqItem(${i}, ${a})" title="Remover Pergunta">&times;</button>
                                  <input type="text" placeholder="Pergunta" value="${s.q}" onchange="window.ProceduresHandler.updateFaqItem(${i}, ${a}, 'q', this.value)">
                                  
                                  <div class="rte-container" style="margin-top: 10px;">
                                      ${window.ProceduresHandler.getRteToolbarHTML()}
                                      <div class="proc-textarea-edit" style="min-height: 80px;" contenteditable="true" placeholder="Resposta da FAQ..."
                                           oninput="window.ProceduresHandler.updateFaqItem(${i}, ${a}, 'a', this.innerHTML)" 
                                           onblur="window.ProceduresHandler.updateFaqItem(${i}, ${a}, 'a', this.innerHTML)">${s.a||""}</div>
                                  </div>
                              </div>
                          `).join("")}
                          <button class="btn-secondary-small" style="align-self: flex-start; margin-top: 10px;" onclick="window.ProceduresHandler.addFaqItem(${i})">+ Adicionar Pergunta</button>
                      </div>
                      `:""}
                 </div>
             </div>`).join("")},handleSumDragStart(n,t){De="summary",de=t,n.dataTransfer.effectAllowed="move",setTimeout(()=>{n.target&&n.target.classList.add("dragging")},0)},handleSumDrop(n,t){if(n.preventDefault(),De!=="summary"||de===null||de===t)return;const e=M.summaries.splice(de,1)[0];M.summaries.splice(t,0,e),this.renderProcedureBuilderSidebar()},handleSecDragStart(n,t,e){De="container",de=t,At=e,n.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=n.target.nodeType===1?n.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(n){n.preventDefault(),n.dataTransfer.dropEffect="move"},handleSecDrop(n,t,e){if(n.preventDefault(),De!=="container"||de===null||At!==e)return;const o=M.summaries.find(s=>s.id===e);if(!o||de===t)return;const i=o.sections.splice(de,1)[0];o.sections.splice(t,0,i),this.renderProcedureBuilder()},handleDragEnd(n){document.querySelectorAll(".editable-section.dragging").forEach(t=>t.classList.remove("dragging")),n&&n.target&&n.target.setAttribute&&n.target.setAttribute("draggable","false"),De=null,de=null},updateSectionTitle(n,t){const e=M.summaries.find(o=>o.id===j);e&&(e.sections[n].title=t)},updateSectionData(n,t){const e=M.summaries.find(o=>o.id===j);e&&(e.sections[n].data=t)},removeSection(n){const t=M.summaries.find(e=>e.id===j);t&&t.sections.splice(n,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(n){const t=M.summaries.find(e=>e.id===j);t&&(t.sections[n].data=t.sections[n].data||[],t.sections[n].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(n,t,e,o){const i=M.summaries.find(s=>s.id===j);i&&(i.sections[n].data[t][e]=o)},removeFaqItem(n,t){const e=M.summaries.find(o=>o.id===j);e&&e.sections[n].data.splice(t,1),this.renderProcedureBuilder()},addSection(n,t){if(!j){alert("Selecione primeiro um sumário na barra lateral.");return}const e=M.summaries.find(o=>o.id===j);e&&(e.sections.push({id:Date.now(),title:n,type:t,data:t==="FAQ"?[]:t==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(n,t){t.dataTransfer.files&&t.dataTransfer.files.length>0&&await this.uploadSectionFile(n,t.dataTransfer.files[0])},async handleSectionFileUpload(n,t){const e=t.files[0];e&&await this.uploadSectionFile(n,e)},async uploadSectionFile(n,t){const e=new FormData;e.append("file",t);try{const o=await k.upload("/upload",e),i=M.summaries.find(s=>s.id===j);i&&(i.sections[n].data={name:t.name,path:o.path,mimetype:t.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const n=parseInt(c.getValue("proc-id"));if(!n)return;const e={...pe.find(o=>o.id===n),content:JSON.stringify(M)};try{await k.put(`/procedures/${n}`,e),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(n),this.fetch()}catch{alert("Erro ao salvar")}},search(n){J=1;const t=pe.filter(e=>(e.name||e.title||"").toLowerCase().includes(n)||(e.responsible||"").toLowerCase().includes(n)||(e.group_name||"").toLowerCase().includes(n));this.renderTable(t)},changePage(n){J=n,this.renderTable(Ge)},renderPaginationControls(n,t,e){const o=document.getElementById(n);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
            <button class="pagination-btn" 
                    ${J===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${J-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=J-1&&l<=J+1)&&(s&&l-s>1&&(i+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),i+=`
                    <button class="pagination-btn ${l===J?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);i+=`
            <button class="pagination-btn" 
                    ${J===t?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${J+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const a=(J-1)*Me+1,r=Math.min(J*Me,e);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${e}
            </span>
        `,o.innerHTML=i}};window.toggleGhAccordion=function(n){const t=document.getElementById(n);t&&t.classList.toggle("open")};let te=[],$e="list",he="month",H=new Date,Z=1;const He=10;let Dt=[];const Q={async fetch(){try{Z=1,te=await k.get("/accounts"),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(n){console.error("Falha ao obter contas",n)}},populateCompanyFilter(){const n=document.getElementById("dash-filter-company-dynamic-options");if(n){const t=new Set;n.querySelectorAll('input[type="checkbox"]:checked').forEach(i=>{t.add(i.value)});const e=[...new Set(te.map(i=>i.company_name).filter(Boolean))].sort((i,s)=>i.localeCompare(s));let o="";e.forEach(i=>{const s=t.has(i)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${i}" ${s}> <span>${i}</span></label>`}),n.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(n){if(!document.getElementById(`${n}-container`))return;const e=document.getElementById(`${n}-trigger`),o=document.getElementById(`${n}-dropdown`);if(!e||!o)return;e.dataset.listenerBound||(e.addEventListener("click",r=>{r.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(l=>{l!==o&&l.classList.add("hidden")}),o.classList.toggle("hidden")}),e.dataset.listenerBound="true");const i=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(r=>r.value!=="Todos"),a=()=>{const r=s.filter(d=>d.checked).map(d=>d.value),l=e.querySelector(".trigger-label");i.checked||s.length>0&&r.length===s.length?(i.checked=!0,l&&(l.innerText="Todos")):r.length===0?l&&(l.innerText="Nenhum"):r.length===1?l&&(l.innerText=r[0]):l&&(l.innerText=`${r.length} selecionados`)};i&&!i.dataset.listenerBound&&(i.addEventListener("change",()=>{s.forEach(r=>{r.checked=i.checked}),a(),this.renderDashboard()}),i.dataset.listenerBound="true"),s.forEach(r=>{r.dataset.listenerBound||(r.addEventListener("change",()=>{s.every(d=>d.checked)?i.checked=!0:i.checked=!1,a(),this.renderDashboard()}),r.dataset.listenerBound="true")}),a()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",n=>{n.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(t=>{t.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(n){const t=document.getElementById(`${n}-dropdown`);if(!t)return["Todos"];const e=t.querySelector('input[value="Todos"]');return e&&e.checked?["Todos"]:Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(n=>{const t=document.getElementById(`${n}-dropdown`);if(t){t.querySelectorAll('input[type="checkbox"]').forEach(i=>{i.checked=i.value==="Todos"});const o=document.getElementById(`${n}-trigger`);if(o){const i=o.querySelector(".trigger-label");i&&(i.innerText="Todos")}}})},getAccounts(){return te},setAccountsViewMode(n){$e=n,this.handleSearch()},setCalendarSubView(n){he=n,this.handleSearch()},shiftCalendarDate(n){he==="day"?H.setDate(H.getDate()+n):he==="month"?H.setMonth(H.getMonth()+n):he==="year"&&H.setFullYear(H.getFullYear()+n),c.setValue("filter-day",H.getDate()),c.setValue("filter-month",H.getMonth()),c.setValue("filter-year",H.getFullYear()),this.handleSearch()},handleFilterChange(n=!1){if(n){const t=c.getValue("filter-cal-year")?parseInt(c.getValue("filter-cal-year")):H.getFullYear(),e=c.getValue("filter-cal-month")?parseInt(c.getValue("filter-cal-month")):H.getMonth();H=new Date(t,e,1)}else{const t=c.getValue("filter-year")?parseInt(c.getValue("filter-year")):H.getFullYear(),e=c.getValue("filter-month")?parseInt(c.getValue("filter-month")):H.getMonth(),o=c.getValue("filter-day")?parseInt(c.getValue("filter-day")):H.getDate();H=new Date(t,e,o)}c.setValue("filter-month",H.getMonth()),c.setValue("filter-year",H.getFullYear()),this.handleSearch()},handleSearch(){const n=(c.getValue("accounts-search")||"").toLowerCase();let t=te.filter(e=>e.company_name.toLowerCase().includes(n)||e.description&&e.description.toLowerCase().includes(n));if($e==="list"){Z=1;const e=c.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),i=o?o.checked:!1,s=H.getFullYear(),a=H.getMonth(),r=H.getDate();t=t.filter(l=>{if(e&&l.status!==e)return!1;if(!i||!l.due_date)return!0;const[d,u,g]=l.due_date.split("-"),p=parseInt(d,10),f=parseInt(u,10)-1,m=parseInt(g,10);return l.type==="Único"?p===s&&f===a&&m===r:l.type==="Recorrente"?m===r:!0}),this.renderAccountsList(t)}else $e==="notificacoes"?this.renderNotifications():$e==="dashboard"?this.renderDashboard():this.renderCalendarWrapper(t)},checkAccountAlerts(){let n=!1;const t=new Date;t.setHours(0,0,0,0),te.forEach(o=>{const i=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(i==="on"&&s==="pendente"&&o.due_date){const[a,r,l]=o.due_date.split("-");let d=new Date(parseInt(a,10),parseInt(r,10)-1,parseInt(l,10));d.setHours(0,0,0,0),d.getTime()<=t.getTime()&&(n=!0)}});const e=document.getElementById("icon-alert-bell");e&&(n?e.classList.add("alert-pulse"):e.classList.remove("alert-pulse"))},renderNotifications(){const n=document.getElementById("accounts-notifications-body");if(!n)return;n.innerHTML="";const t=new Date;t.setHours(0,0,0,0);let e=te.filter(o=>{const i=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(i!=="on"||s!=="pendente"||!o.due_date)return!1;const[a,r,l]=o.due_date.split("-");let d=new Date(parseInt(a,10),parseInt(r,10)-1,parseInt(l,10));return d.setHours(0,0,0,0),d.getTime()<=t.getTime()});if(e.length===0){n.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}e.forEach(o=>{const i=document.createElement("tr");let s="Sem Data";if(o.due_date){const r=o.due_date.split("-");r.length===3&&(s=`${r[2]}/${r[1]}/${r[0]}`)}const a=K.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${o.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
            `:"";i.innerHTML=`
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
                        ${a}
                    </div>
                </td>
            `,n.appendChild(i)})},renderAccountsList(n){const t=document.getElementById("accounts-table-body");if(!t)return;t.innerHTML="",this.renderSidebarMiniCalendar(),Dt=n;const e=n.length,o=Math.ceil(e/He);Z>o&&(Z=Math.max(1,o)),Z<1&&(Z=1);const i=(Z-1)*He,s=n.slice(i,i+He);if(s.length===0){t.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(a=>{const r=document.createElement("tr");let l="Sem Data";if(a.due_date){const g=a.due_date.split("-");g.length===3&&(l=`${g[2]}/${g[1]}/${g[0]}`)}const d=a.status==="Off",u=K.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${a.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon" onclick="window.AccountsHandler.delete(${a.id})" title="Excluir" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `:"";r.innerHTML=`
                <td>
                    <strong>${a.company_name}</strong>
                    <div style="margin-top: 4px;">
                        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd; font-size: 0.7rem; padding: 2px 6px;">
                            ${a.category||"Outros"}
                        </span>
                    </div>
                </td>
                <td>
                    <span class="badge" style="background:${a.type==="Recorrente"?"rgba(79, 70, 229, 0.2)":"rgba(234, 179, 8, 0.2)"}; color:${a.type==="Recorrente"?"#818cf8":"#eab308"}">
                        ${a.type}
                    </span>
                </td>
                <td>${l}</td>
                <td>
                    <strong>R$ ${parseFloat(a.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                </td>
                <td>
                    <span class="badge" style="background:${d?"rgba(239, 68, 68, 0.2)":"rgba(34, 197, 94, 0.2)"}; color:${d?"#f87171":"#4ade80"}">
                        ${a.status}
                    </span>
                </td>
                <td>
                    <span class="badge" style="background:${a.payment_status==="Pago"?"rgba(34, 197, 94, 0.2)":a.payment_status==="Pendente"?"rgba(234, 179, 8, 0.2)":"rgba(239, 68, 68, 0.2)"}; color:${a.payment_status==="Pago"?"#4ade80":a.payment_status==="Pendente"?"#eab308":"#f87171"}">
                        ${a.payment_status||"Pendente"}
                    </span>
                </td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${a.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${u}
                    </div>
                </td>
            `,t.appendChild(r)}),this.renderPaginationControls("accounts-list-pagination",o,e),this.renderDashboard()},renderDashboard(){if($e!=="dashboard")return;this.initDashboardMultiselects();const n=c.getValue("dash-filter-start"),t=c.getValue("dash-filter-end"),e=c.getValue("dash-filter-type")||"Todos",o=c.getValue("dash-filter-status")||"Todos",i=c.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),a=this.getMultiselectValues("dash-filter-company");let r=n?new Date(n+"T00:00:00"):null,l=t?new Date(t+"T23:59:59"):null;if(!r&&!l){const b=new Date;r=new Date(b.getFullYear(),b.getMonth(),1,0,0,0),l=new Date(b.getFullYear(),b.getMonth()+1,0,23,59,59)}else r?l||(l=new Date(2100,11,31)):r=new Date(2e3,0,1);let d=0,u=0,g=new Set,p=new Set,f=0,m=0,h=0,v="-",I=0,B=0,E={},w={},$={};te.forEach(b=>{if(!b.due_date||e!=="Todos"&&b.type!==e||o!=="Todos"&&b.status!==o||i!=="Todos"&&b.payment_status!==i)return;if(!s.includes("Todos")){if(s.length===0)return;const D=b.category||"Outros";if(!s.includes(D))return}if(!a.includes("Todos")&&(a.length===0||!a.includes(b.company_name)))return;let S=0,_=new Date(r);_.setHours(0,0,0,0);let O=new Date(l);O.setHours(0,0,0,0);let U=3650;for(;_<=O&&U>0;){if(this.isEventOnDate(b,_.getFullYear(),_.getMonth(),_.getDate())){S++;const D=`${_.getFullYear()}-${String(_.getMonth()+1).padStart(2,"0")}`;$[D]||($[D]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const V=parseFloat(b.value||0);$[D].total+=V,b.payment_status==="Pago"&&($[D].pago+=V),b.payment_status==="Pendente"&&($[D].pendente+=V),b.type==="Recorrente"&&($[D].fixo+=V),b.type==="Único"&&($[D].variavel+=V)}_.setDate(_.getDate()+1),U--}if(S>0){const D=parseFloat(b.value||0)*S;d+=D,u+=S,g.add(b.category||"Outros"),p.add(b.company_name),b.payment_status==="Pago"&&(f+=D),b.payment_status==="Pendente"&&(m+=D),b.type==="Recorrente"&&(I+=D),b.type==="Único"&&(B+=D),D>h&&(h=D,v=b.company_name);const V=b.category||"Outros";w[V]=(w[V]||0)+D;const P=b.company_name||"Sem Empresa";E[P]=(E[P]||0)+D}}),c.setText("dash-metric-valor","R$ "+d.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-contas",u.toString()),c.setText("dash-metric-tipos",g.size.toString()),c.setText("dash-metric-empresas",p.size.toString()),c.setText("dash-metric-pago","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-pendente","R$ "+m.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-maior-valor","R$ "+h.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-maior-nome",v),c.setText("dash-metric-fixo","R$ "+I.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-variavel","R$ "+B.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const x=c.getValue("dash-sort-empresas")||"desc",A=c.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",E,x),this.renderTierList("dash-list-categorias",w,A),this.renderTimeChart($)},renderTimeChart(n){window.timeChartInstance&&window.timeChartInstance.destroy();const t=document.getElementById("chart-dashboard-time");if(!t)return;const e=Object.keys(n).sort(),o=e.map(u=>{const[g,p]=u.split("-");return`${p}/${g}`}),i=e.map(u=>n[u].total),s=e.map(u=>n[u].pago),a=e.map(u=>n[u].pendente),r=e.map(u=>n[u].fixo),l=e.map(u=>n[u].variavel),d={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:i,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:a,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:r,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:l,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(u){let g=u.dataset.label||"";return g&&(g+=": "),u.parsed.y!==null&&(g+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(u.parsed.y)),g}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(u,g,p){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(u)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(t.getContext("2d"),d)},renderTierList(n,t,e){const o=document.getElementById(n);if(!o)return;const i=Object.entries(t);if(i.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}i.sort((r,l)=>e==="asc"?r[1]-l[1]:l[1]-r[1]);const s=i.slice(0,10);let a="";s.forEach(([r,l],d)=>{const u=d===0&&e==="desc",g=u?"🏆 ":d+1+". ";a+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${u?"bold":"normal"}; color: ${u?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${r}">
                        ${g}${r}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=a},renderCharts(n){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const t=document.getElementById("chart-category");if(t){const o={labels:Object.keys(n),datasets:[{data:Object.values(n),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(t.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const e=document.getElementById("chart-forecast");if(e){const o=[],i=[];let s=new Date;for(let a=-5;a<=6;a++){let r=new Date(s.getFullYear(),s.getMonth()+a,1);o.push(r.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let l=0;te.forEach(d=>{if(!d.due_date||d.status==="Off")return;const[u,g]=d.due_date.split("-"),p=new Date(parseInt(u),parseInt(g)-1,1);(d.type==="Recorrente"&&r.getTime()>=p.getTime()||d.type==="Único"&&r.getFullYear()===parseInt(u)&&r.getMonth()===parseInt(g)-1)&&(l+=parseFloat(d.value||0))}),i.push(l)}window.forecastChartInstance=new Chart(e.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:i,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(n){const t={},e=[];return n.forEach(o=>{if(o.type==="Único")e.push(o);else if(!t[o.company_name])t[o.company_name]=o;else{const i=new Date(t[o.company_name].due_date||0);new Date(o.due_date||0)>i&&(t[o.company_name]=o)}}),[...e,...Object.values(t)]},isEventOnDate(n,t,e,o){if(!n.due_date)return!1;const[i,s,a]=n.due_date.split("-"),r=parseInt(i,10),l=parseInt(s,10)-1,d=parseInt(a,10);if(n.type==="Único")return t===r&&e===l&&o===d;if(n.type==="Recorrente"){const u=new Date(r,l,d).setHours(0,0,0,0);if(new Date(t,e,o).setHours(0,0,0,0)<u)return!1;const p=n.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(p)){const f=(t-r)*12+(e-l),m=new Date(t,e+1,0).getDate(),h=Math.min(d,m);if(o!==h||f<0)return!1;if(p==="1 mes")return!0;if(p==="3 meses")return f%3===0;if(p==="6 meses")return f%6===0;if(p==="1 ano")return e===l}else{const f=Date.UTC(r,l,d),m=Date.UTC(t,e,o),h=Math.round((m-f)/(1e3*60*60*24));if(p==="1 dia")return!0;if(p==="7 dias")return h%7===0;if(p==="15 dias")return h%15===0}}return!1},renderCalendarWrapper(n){const t=H.getFullYear(),e=H.getMonth(),o=H.getDate();he==="month"?this.renderCalendarMonth(n,t,e):he==="year"?this.renderCalendarYear(n,t):he==="day"&&this.renderCalendarDay(n,t,e,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const n=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],t=H.getFullYear(),e=H.getMonth(),o=H.getDate(),i=new Date(t,e,1).getDay(),s=new Date(t,e+1,0).getDate(),a=new Date,r=a.getFullYear(),l=a.getMonth(),d=a.getDate(),u=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let g="";u.forEach((m,h)=>{g+=`<option value="${h}" ${h===e?"selected":""}>${m}</option>`});let p="";for(let m=r-5;m<=r+5;m++)p+=`<option value="${m}" ${m===t?"selected":""}>${m}</option>`;let f=`
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.parentElement.children[1].value, this.value)">
                    ${g}
                </select>
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.value, this.parentElement.children[0].value)">
                    ${p}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button class="btn-primary" style="width: 100%; padding: 4px 0; justify-content: center; font-size: 0.85rem;" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${r}, ${l}, ${d})">Hoje</button>
            </div>
            <div class="smc-header">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div class="smc-grid">
        `;for(let m=0;m<i;m++)f+='<div class="smc-day empty"></div>';for(let m=1;m<=s;m++)f+=`<div class="smc-day ${m===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${t}, ${e}, ${m})">${m}</div>`;f+="</div>",n.forEach(m=>{m&&(m.innerHTML=f)})},changeMiniCalendarMonthYear(n,t){let e=H.getDate();const o=new Date(n,parseInt(t)+1,0).getDate();e>o&&(e=o),H=new Date(n,t,e);try{c.setValue("filter-cal-year",n),c.setValue("filter-cal-month",t)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(n,t,e){H=new Date(n,t,e);try{c.setValue("filter-cal-year",n),c.setValue("filter-cal-month",t)}catch{}if($e==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(n,t,e){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];c.setText("calendar-date-display",`${o[e]} ${t}`);const i=document.getElementById("calendar-month-grid");i.innerHTML="";const s=new Date(t,e,1).getDay(),a=new Date(t,e+1,0).getDate(),r=new Date,l=r.getFullYear()===t&&r.getMonth()===e;new Date(r.getFullYear(),r.getMonth(),1);for(let u=0;u<s;u++)i.innerHTML+='<div class="calendar-day empty"></div>';for(let u=1;u<=a;u++){const g=l&&r.getDate()===u?"today":"";i.innerHTML+=`<div class="calendar-day ${g}" id="cal-day-cell-${u}">
                <div class="calendar-date">${u}</div>
                <div class="calendar-events" id="cal-events-${u}"></div>
            </div>`}this.getLatestRecorrenteAccounts(n).forEach(u=>{if(!u.due_date)return;const g=new Date(t,e,1),p=new Date(r.getFullYear(),r.getMonth(),1);let f=!0;if(u.status==="Off"&&g.getTime()>=p.getTime()&&(f=!1),!!f){for(let m=1;m<=a;m++)if(this.isEventOnDate(u,t,e,m)){const h=document.getElementById(`cal-events-${m}`);if(h){const v=`${t}-${String(e+1).padStart(2,"0")}-${String(m).padStart(2,"0")}`;let I=u.payment_status==="Pago"?"event-paid":u.payment_status==="Pendente"?"event-pending":"event-canceled";u.type==="Recorrente"&&v!==u.due_date&&(I="event-pending");const B=document.createElement("div");B.className=`event-pill event-${u.type.toLowerCase()} ${I}`,B.title=u.company_name,B.innerText=u.company_name,B.onclick=E=>{this.openDedicatedPage(u.id,v)},h.appendChild(B)}}}})},renderCalendarDay(n,t,e,o){const i=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];c.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${i[e]} de ${t}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const a=new Date(t,e,o),r=new Date;r.setHours(0,0,0,0),a.setHours(0,0,0,0);let l=0;this.getLatestRecorrenteAccounts(n).forEach(u=>{let g=!0;if(u.status==="Off"&&a.getTime()>=r.getTime()&&(g=!1),!!g&&this.isEventOnDate(u,t,e,o)){l++;const p=`${t}-${String(e+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let f=u.payment_status==="Pago"?"#4ade80":u.payment_status==="Pendente"?"#facc15":"#ef4444";u.type==="Recorrente"&&p!==u.due_date&&(f="#facc15"),s.innerHTML+=`
                    <div class="day-event-row ${u.type.toLowerCase()}">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${f}; margin-top: 5px;"></div>
                        <div class="day-evt-info">
                            <h4>${u.company_name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8">(${u.type} - ${u.category||"Outros"})</span></h4>
                            <p style="font-weight: bold; color: var(--text-main); margin: 4px 0;">R$ ${parseFloat(u.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                            <p>${u.description||"Nenhuma descrição detalhada."}</p>
                        </div>
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${u.id}, '${p}')" title="Detalhes">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                `}}),l===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(n,t){c.setText("calendar-date-display",`Ano de ${t}`);const e=document.getElementById("calendar-year-grid");e.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],i=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const a=new Date(t,s,1);let r=0,l=0,d=0;this.getLatestRecorrenteAccounts(n).forEach(p=>{let f=!0;if(p.status==="Off"&&a.getTime()>=i.getTime()&&(f=!1),!f)return;const m=new Date(t,s+1,0).getDate();for(let h=1;h<=m;h++)this.isEventOnDate(p,t,s,h)&&(r++,p.type==="Recorrente"?l++:d++)});const g=r>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";e.innerHTML+=`
               <div class="year-month-card" style="${g}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${r}</strong></p>
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${l}</p>`:""}
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${d}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(n){H.setMonth(n),c.setValue("filter-month",n),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(n=null){document.getElementById("account-form").reset();const t=document.getElementById("account-type");if(t.onchange=()=>{t.value==="Recorrente"?c.show("account-frequency-group"):c.hide("account-frequency-group")},n){c.setText("account-modal-title","Editar Conta");const e=te.find(o=>o.id===n);e&&(c.setValue("account-id",e.id),c.setValue("account-company",e.company_name),c.setValue("account-type",e.type),c.setValue("account-category",e.category||"Outros"),c.setValue("account-frequency",e.frequency||"1 mes"),c.setValue("account-value",parseFloat(e.value||0).toFixed(2)),c.setValue("account-status",e.status),c.setValue("account-payment-status",e.payment_status||"Pendente"),c.setValue("account-due-date",e.due_date||""),c.setValue("account-description",e.description||""),c.setValue("account-observation",e.observation||""),t.onchange())}else c.setText("account-modal-title","Nova Conta"),c.setValue("account-id",""),t.onchange();c.show("account-modal-form")},openDedicatedPage(n,t=null){const e=te.find(p=>p.id===n);if(!e)return;let o=te.filter(p=>p.company_name===e.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((p,f)=>new Date(f.due_date||0)-new Date(p.due_date||0)),c.hide("accounts-section"),c.show("dedicated-account-page"),c.setText("ded-acc-company",e.company_name);let i=0,s=0,a=0;const r=new Date;r.setHours(0,0,0,0),this.currentCompanyHistory.forEach(p=>{const f=parseFloat(p.value||0);if(p.payment_status==="Pago")i+=f,a++;else if(p.payment_status==="Pendente"&&p.due_date){const[m,h,v]=p.due_date.split("-"),I=new Date(parseInt(m,10),parseInt(h,10)-1,parseInt(v,10));I.setHours(0,0,0,0),I.getTime()<r.getTime()&&(s+=f)}});const l=i.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),d=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});c.setText("ded-acc-total-paid","R$ "+l),c.setText("ded-acc-total-pending","R$ "+d),c.setText("ded-acc-total-count",a.toString());const u=document.getElementById("ded-acc-status-badge");e.status==="On"?u.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':u.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(e.id,t);const g=document.getElementById("btn-ded-add-history");g&&(g.onclick=()=>{this.openAccountModal(),setTimeout(()=>{c.setValue("account-company",e.company_name),c.setValue("account-type",e.type),c.setValue("account-category",e.category)},100)},K.isAdmin()||(g.style.display="none"))},injectCurrentMonthProjections(n){const t=new Date,e=t.getFullYear(),o=t.getMonth(),i=new Date(e,o+1,0).getDate();let s=null;if(n.forEach(l=>{l.type==="Recorrente"&&(s?new Date(l.due_date||0)>new Date(s.due_date||0)&&(s=l):s=l)}),!s)return n;const a=[...n],r=new Set(n.map(l=>l.due_date));for(let l=1;l<=i;l++)if(this.isEventOnDate(s,e,o,l)){const d=`${e}-${String(o+1).padStart(2,"0")}-${String(l).padStart(2,"0")}`;r.has(d)||a.push({...s,is_projection:!0,due_date:d,payment_status:"Pendente",unique_key:s.id+"_"+d})}return a.forEach(l=>{l.unique_key||(l.unique_key=l.id.toString())}),a},renderDedicatedHistoryList(){const n=document.getElementById("ded-acc-history-list");if(n){if(n.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){n.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(t=>{let e="Sem Data";if(t.due_date){const a=t.due_date.split("-");a.length===3&&(e=`${a[2]}/${a[1]}/${a[0]}`)}const o=parseFloat(t.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let i="#eab308";t.payment_status==="Pago"?i="#4ade80":t.payment_status==="Cancelado"&&(i="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==t.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===t.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(t.id,t.is_projection?t.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${e}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${i}22; color: ${i}; font-size: 0.75rem;">${t.payment_status||"Pendente"}</span>
                </div>
            `,n.appendChild(s)})}},selectHistoryItem(n,t=null){this.currentSelectedHistoryKey=t?n+"_"+t:n.toString(),this.renderDedicatedHistoryList();let e=null;if(t&&(e=this.currentCompanyHistory.find(r=>r.id===n&&r.due_date===t&&r.is_projection)),e||(e=this.currentCompanyHistory.find(r=>r.id===n&&!r.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!e){c.show("ded-acc-details-empty"),c.hide("ded-acc-details-content");return}c.hide("ded-acc-details-empty"),c.show("ded-acc-details-content");let o="DD/MM/YYYY";const i=t||e.due_date;if(i){const r=i.split("-");r.length===3&&(o=`${r[2]}/${r[1]}/${r[0]}`)}c.setText("ded-acc-det-date",o),c.setValue("ded-acc-det-val-input",parseFloat(e.value||0).toFixed(2)),c.setValue("ded-acc-det-date-input",i||""),c.setValue("ded-acc-det-status-input",e.payment_status||"Pendente"),c.setValue("ded-acc-det-account-status-input",e.status||"On"),c.setValue("ded-acc-det-obs-input",e.observation||""),e.type==="Recorrente"?(c.show("ded-acc-det-freq-group"),c.setValue("ded-acc-det-freq-input",e.frequency||"1 mes")):c.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const r={...e,value:c.getValue("ded-acc-det-val-input"),due_date:c.getValue("ded-acc-det-date-input"),payment_status:c.getValue("ded-acc-det-status-input"),status:c.getValue("ded-acc-det-account-status-input"),observation:c.getValue("ded-acc-det-obs-input"),frequency:e.type==="Recorrente"?c.getValue("ded-acc-det-freq-input"):"1 mes"};try{await k.put(`/accounts/${e.id}`,r),alert("Fatura atualizada com sucesso!"),await this.fetch(),this.currentCompanyHistory=te.filter(l=>l.company_name===e.company_name).sort((l,d)=>new Date(d.due_date||0)-new Date(l.due_date||0)),this.openDedicatedPage(e.id)}catch{alert("Erro ao atualizar fatura.")}},K.isAdmin()||(s.style.display="none"));const a=document.getElementById("btn-ded-delete-account");a&&(a.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await k.delete(`/accounts/${e.id}`),await this.fetch();const r=te.filter(l=>l.company_name===e.company_name);r.length>0?this.openDedicatedPage(r[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},K.isAdmin()||(a.style.display="none")),this.renderAttachmentArea(e)},renderAttachmentArea(n){document.getElementById("ded-acc-file-input");const t=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),n.attachment_path){c.hide("ded-acc-upload-area"),c.show("ded-acc-preview-area");const e=n.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),i=n.attachment_path.split("/").pop()||"documento";c.setText("ded-acc-preview-name",i);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async r=>{r.preventDefault();const l=s.innerText;s.innerText="Carregando...";try{const d=await fetch(n.attachment_path);if(!d.ok)throw new Error("Doc não encontrado");const u=await d.blob(),g=window.URL.createObjectURL(u);window.open(g,"_blank")}catch(d){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",d)}finally{s.innerText=l}},e?(o.innerHTML="",o.style.backgroundImage=`url('${n.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const a=document.getElementById("btn-ded-remove-attachment");a.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await k.put(`/accounts/${n.id}`,{...n,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=te.filter(r=>r.company_name===n.company_name).sort((r,l)=>new Date(l.due_date||0)-new Date(r.due_date||0)),this.selectHistoryItem(n.id)}catch{alert("Erro ao remover anexo")}},K.isAdmin()||(a.style.display="none")}else{if(c.show("ded-acc-upload-area"),c.hide("ded-acc-preview-area"),K.isAdmin())t.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,t.style.cursor="pointer";else{t.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',t.style.cursor="default";return}t.onclick=s=>{const a=document.getElementById("ded-acc-file-input");a&&s.target!==a&&a.click()},t.addEventListener("dragover",s=>{s.preventDefault(),t.style.borderColor="var(--accent)",t.style.background="rgba(255, 255, 255, 0.05)"});const e=()=>{t.style.borderColor="rgba(255,255,255,0.2)",t.style.background="rgba(0,0,0,0.1)"};t.addEventListener("dragleave",()=>{e()});const o=async s=>{if(!s)return;t.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const a=new FormData;a.append("file",s);try{const r=await fetch("/api/upload",{method:"POST",body:a}),l=await r.json();r.ok?(await k.put(`/accounts/${n.id}`,{...n,attachment_path:l.path}),await this.fetch(),this.currentCompanyHistory=te.filter(d=>d.company_name===n.company_name).sort((d,u)=>new Date(u.due_date||0)-new Date(d.due_date||0)),this.selectHistoryItem(n.id)):(alert(l.error||"Erro no upload"),this.selectHistoryItem(n.id))}catch(r){alert("Falha na comunicação: "+r.message),console.error("Upload Error:",r),this.selectHistoryItem(n.id)}};t.addEventListener("drop",async s=>{if(s.preventDefault(),e(),s.dataTransfer.files.length>0){const a=s.dataTransfer.files[0];await o(a)}});const i=document.getElementById("ded-acc-file-input");i&&(i.onclick=s=>{s.stopPropagation()},i.onchange=async s=>{const a=s.target.files[0];await o(a)})}},async save(n){n.preventDefault();const t=c.getValue("account-id"),e={company_name:c.getValue("account-company"),type:c.getValue("account-type"),category:c.getValue("account-category"),value:c.getValue("account-value"),status:c.getValue("account-status"),payment_status:c.getValue("account-payment-status"),due_date:c.getValue("account-due-date"),description:c.getValue("account-description"),observation:c.getValue("account-observation"),frequency:c.getValue("account-type")==="Recorrente"?c.getValue("account-frequency"):"1 mes"};try{const o=t?`/accounts/${t}`:"/accounts";t?await k.put(o,e):await k.post(o,e),c.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(n){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await k.delete(`/accounts/${n}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(n){Z=n,this.renderAccountsList(Dt)},renderPaginationControls(n,t,e){const o=document.getElementById(n);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
            <button class="pagination-btn" 
                    ${Z===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${Z-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=Z-1&&l<=Z+1)&&(s&&l-s>1&&(i+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),i+=`
                    <button class="pagination-btn ${l===Z?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);i+=`
            <button class="pagination-btn" 
                    ${Z===t?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${Z+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const a=(Z-1)*He+1,r=Math.min(Z*He,e);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${e}
            </span>
        `,o.innerHTML=i}};let xe=[],re={},me=null,rt=null,lt=null,dt=!1,Re=!1,_e=!1,oe=[],nt=[],bt={},le={},Ce,wt,ot,it,Ot,at;const Vt={init(){Ce=document.getElementById("timeline-event-form"),wt=document.getElementById("view-visualizacao"),ot=document.getElementById("view-attention"),it=document.getElementById("view-anexo"),Ot=document.getElementById("view-relatorio"),at=document.getElementById("view-config"),window.timelineHandler=Vt,window.applyFilters=Zt,window.clearFilters=Xt,window.toggleFilters=en,window.handleDelete=Kt,window.resetForm=kt,window.toggleAccordion=jt,window.handleFormSubmit=Ht,window.editEvent=$t,window.deleteTopic=rn,window.deleteSubtopic=ln,window.handleTrackDragStart=dn,window.handleTrackDragOver=cn,window.handleTrackDragEnd=un;const n=document.getElementById("timeline-topic-form");n&&(n.onsubmit=an);const t=document.getElementById("timeline-subtopic-form");t&&(t.onsubmit=sn);const e=document.getElementById("topico");e&&(e.onchange=d=>{Et(d.target.value)});const o=document.getElementById("em-ocorrencia");o&&(o.onchange=d=>{const u=document.getElementById("fim"),g=document.getElementById("inicio");if(d.target.checked){if(!g.value){const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),g.value=p.toISOString().slice(0,16)}u.required=!1}else{const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),u.value=p.toISOString().slice(0,16),u.required=!0}});const i=document.getElementById("auto-refresh-toggle");i&&(i.onchange=d=>{qt(d.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(d=>{d.onclick=u=>{const g=u.currentTarget.getAttribute("data-timeline-tab");je(g)}}),Ce&&(Ce.onsubmit=Ht);const s=document.getElementById("rep-filter-start"),a=document.getElementById("rep-filter-end"),r=document.getElementById("rep-filter-topic"),l=document.getElementById("rep-filter-subtopic");s&&(s.onchange=()=>Fe()),a&&(a.onchange=()=>Fe()),r&&(r.onchange=d=>{on(d.target.value),Fe()}),l&&(l.onchange=()=>Fe()),window._timelineSectionChangeHandler&&window.removeEventListener("SectionChange",window._timelineSectionChangeHandler),window._timelineSectionChangeHandler=d=>{d.detail&&d.detail.section==="timeline"&&we().then(()=>{ue(),Mt()})},window.addEventListener("SectionChange",window._timelineSectionChangeHandler),we().then(()=>{ue(),Mt()})}};window._timelineFocusHandler&&window.removeEventListener("focus",window._timelineFocusHandler);window._timelineFocusHandler=()=>{wt&&ue()};window.addEventListener("focus",window._timelineFocusHandler);function Et(n,t=null){const e=document.getElementById("sub-topico");if(!e)return;const o=n?n.toLowerCase().trim():"";if(!o||!le[o]){e.innerHTML='<option value="">Selecione o tópico primeiro...</option>',e.classList.remove("has-options");return}e.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',le[o].forEach(i=>{const s=document.createElement("option");s.value=i.toLowerCase(),s.textContent=i,t&&s.value===t.toLowerCase()&&(s.selected=!0),e.appendChild(s)}),t||(e.selectedIndex=1),e.classList.add("has-options")}async function we(){try{const n=await fetch("/api/timeline/config");if(!n.ok)throw new Error("Falha ao buscar configurações");const t=await n.json();oe=t.topics||[],nt=t.subtopics||[],bt={},le={},oe.forEach(o=>{bt[o.id]=o.color,le[o.id]=[]}),nt.forEach(o=>{const i=o.topic_id;le[i]&&le[i].push(o.name)}),Qt();const e=document.getElementById("view-config");e&&e.classList.contains("active")&&Gt()}catch(n){console.error("Error loading config:",n)}}function Qt(){const n=document.getElementById("topico");if(n){const o=n.value;n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',oe.forEach(i=>{const s=document.createElement("option");s.value=i.id,s.textContent=i.name,n.appendChild(s)}),n.value=o}const t=document.getElementById("rep-filter-topic");if(t){const o=t.value;t.innerHTML='<option value="Todos">Todos</option>',oe.forEach(i=>{const s=document.createElement("option");s.value=i.id,s.textContent=i.name,t.appendChild(s)}),o&&[...t.options].some(i=>i.value===o)?t.value=o:t.value="Todos"}const e=document.getElementById("subtopic-topic-id");e&&(e.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',oe.forEach(o=>{const i=document.createElement("option");i.value=o.id,i.textContent=o.name,e.appendChild(i)}))}function ue(){fetch("/api/timeline/events").then(n=>{if(!n.ok)throw new Error("Failed to fetch");return n.json()}).then(n=>{xe=n,It(),ot&&ot.classList.contains("active")&&Ut()}).catch(n=>{console.error("Error loading events:",n)})}function Mt(){const n=document.getElementById("timeline-tab-anexo"),t=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())n&&n.classList.remove("role-hidden"),t&&t.classList.remove("role-hidden");else{n&&n.classList.add("role-hidden"),t&&t.classList.add("role-hidden");const o=it&&it.classList.contains("active"),i=at&&at.classList.contains("active");(o||i)&&je("visualizacao")}}function je(n){const t={visualizacao:{section:wt,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:ot,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:it,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:Ot,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:at,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(t).forEach(e=>{e.section&&e.section.classList.remove("active"),e.button&&e.button.classList.remove("active")}),t[n]&&(t[n].section&&t[n].section.classList.add("active"),t[n].button&&t[n].button.classList.add("active")),n==="visualizacao"?(ue(),Pe(!0)):n==="attention"?(Ut(),Pe(!0)):n==="relatorio"?(Fe(),Pe(!1)):(n==="config"&&Gt(),Pe(!1))}function Pe(n){const t=document.getElementById("floating-refresh-control");if(t)if(n){t.classList.remove("hidden");const e=document.getElementById("auto-refresh-toggle");e&&e.checked&&!me&&qt(!0)}else t.classList.add("hidden"),me&&(clearInterval(me),me=null)}function qt(n){me&&(clearInterval(me),me=null),n&&(ue(),me=setInterval(ue,6e4))}function Ht(n){if(n.preventDefault(),dt){console.warn("[Timeline] O salvamento já está em andamento. Ignorando envio duplicado.");return}dt=!0;const t=Ce.querySelector('button[type="submit"]');t&&(t.textContent="Salvando...",t.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async i=>{const s=await i.text();if(!i.ok)throw new Error(`Server error (${i.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),kt(),je("visualizacao")}).catch(i=>{console.error("Error saving event:",i),alert("Erro ao salvar evento: "+i.message)}).finally(()=>{t&&(t.textContent="Salvar Evento",t.disabled=!1),dt=!1})}function $t(n){const t=xe.find(s=>s.id===n);if(!t)return;document.getElementById("event-id").value=t.id,document.getElementById("nome").value=t.nome;const e=Oe(t.topico);document.getElementById("topico").value=e,Et(e,t.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=t.em_ocorrencia==1||t.em_ocorrencia==="true"||!t.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=t.inicio,document.getElementById("fim").value=t.fim||"",document.getElementById("descricao").value=t.descricao||"",document.getElementById("anotacao").value=t.anotacao||"",document.getElementById("cor").value=t.cor||"#000000",je("anexo");const i=document.getElementById("btn-delete");i&&(i.style.display="block")}function kt(){Ce&&Ce.reset();const n=document.getElementById("event-id");n&&(n.value=""),Et("");const t=document.getElementById("fim");t&&(t.required=!0);const e=document.getElementById("cor");e&&(e.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function Kt(){const n=document.getElementById("event-id").value;n&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${n}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Failed to delete");return t.json()}).then(()=>{alert("Evento excluído!"),kt(),je("visualizacao")}).catch(t=>{console.error("Error deleting:",t),alert("Erro ao excluir: "+t.message)})}function Zt(n){const t=document.getElementById(`filter-start-${n}`),e=document.getElementById(`filter-end-${n}`),o=document.getElementById(`filter-sub-topic-${n}`),i=t&&t.value?new Date(t.value).getTime():null,s=e&&e.value?new Date(e.value).getTime():null,a=o?o.value:"";re[n]={start:i,end:s,subTopic:a},It()}function Xt(n){const t=document.getElementById(`filter-start-${n}`),e=document.getElementById(`filter-end-${n}`),o=document.getElementById(`filter-sub-topic-${n}`);t&&(t.value=""),e&&(e.value=""),o&&(o.value=""),re[n]=null,It()}function en(n){const t=document.getElementById(`filters-panel-${n}`),e=document.getElementById(`btn-toggle-${n}`);t&&e&&(t.classList.toggle("hidden"),e.classList.toggle("active"))}function jt(n){const t=document.getElementById(n);t&&t.classList.toggle("active")}function It(){const n=document.getElementById("timeline-tracks-container");if(!n)return;const t=Array.from(n.querySelectorAll(".timeline-container")).map(i=>i.dataset.topicId),e=oe.map(i=>i.id);if(t.length!==e.length||!e.every(i=>t.includes(i))){n.innerHTML="";const i=window.auth&&window.auth.isAdmin(),s=i?'style="cursor: grab;"':"";oe.forEach(a=>{const r=`
                <div class="timeline-container" data-topic-id="${a.id}" draggable="false"
                     ondragstart="window.handleTrackDragStart(event, '${a.id}')"
                     ondragover="window.handleTrackDragOver(event)"
                     ondragend="window.handleTrackDragEnd(event)">
                    <div class="topic-header" ${s}
                         ${i?`
                         onmousedown="this.closest('.timeline-container').setAttribute('draggable', 'true')"
                         onmouseup="this.closest('.timeline-container').setAttribute('draggable', 'false')"
                         onmouseleave="this.closest('.timeline-container').setAttribute('draggable', 'false')"`:""}>
                        <div class="topic-indicator" style="background-color: ${a.color};"></div>
                        <h2>${a.name}</h2>
                        <div class="sla-container">SLA: <span id="sla-${a.id}">100%</span></div>
                    </div>
                    <div class="timeline-filters-wrapper">
                        <button class="filters-toggle" onclick="toggleFilters('${a.id}')" id="btn-toggle-${a.id}">
                            <span class="hamburger-icon">☰</span>
                            <span>Filtros</span>
                            <span class="toggle-arrow">▼</span>
                        </button>
                        <div class="timeline-filters hidden" id="filters-panel-${a.id}">
                            <div class="filter-group">
                                <label for="filter-start-${a.id}">De:</label>
                                <input type="datetime-local" id="filter-start-${a.id}" min="2026-01-01T00:00" onchange="applyFilters('${a.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-end-${a.id}">Até:</label>
                                <input type="datetime-local" id="filter-end-${a.id}" min="2026-01-01T00:00" onchange="applyFilters('${a.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-sub-topic-${a.id}">Eventos:</label>
                                <select id="filter-sub-topic-${a.id}" onchange="applyFilters('${a.id}')">
                                    <option value="">Todos</option>
                                </select>
                            </div>
                            <button class="btn-clear-filter" onclick="clearFilters('${a.id}')" title="Limpar Filtro">×</button>
                        </div>
                    </div>
                    <div class="timeline-helper-dates">
                        <span id="min-date-${a.id}"></span>
                        <span id="max-date-${a.id}"></span>
                    </div>
                    <div class="timeline-track-container">
                        <div class="timeline-track" id="track-${a.id}"></div>
                    </div>
                </div>
            `;n.insertAdjacentHTML("beforeend",r);const l=document.getElementById(`filter-sub-topic-${a.id}`);l&&le[a.id]&&le[a.id].forEach(d=>{const u=document.createElement("option");u.value=d.toLowerCase(),u.textContent=d,l.appendChild(u)})})}oe.forEach(i=>{const s=document.getElementById(`track-${i.id}`),a=document.getElementById(`min-date-${i.id}`),r=document.getElementById(`max-date-${i.id}`);s&&(s.innerHTML=""),a&&(a.textContent=""),r&&(r.textContent="")}),xe.length!==0&&oe.forEach(i=>{const s=i.id,a=xe.filter(v=>Oe(v.topico)===s);let r=a;re[s]&&re[s].subTopic&&(r=a.filter(v=>(v.sub_topico?v.sub_topico.toLowerCase():"")===re[s].subTopic.toLowerCase()));const l=re[s]&&re[s].start?re[s].start:new Date("2026-01-01T00:00:00").getTime(),d=re[s]&&re[s].end?re[s].end:Date.now();tn(s,r,l,d);const u=l,g=d,p=g-u,f=document.getElementById(`min-date-${s}`),m=document.getElementById(`max-date-${s}`);f&&(f.textContent=new Date(u).toLocaleDateString()+" "+new Date(u).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),m&&(m.textContent=new Date(g).toLocaleDateString()+" "+new Date(g).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const h=document.getElementById(`track-${s}`);h&&r.forEach(v=>{const I=new Date(v.inicio).getTime(),B=v.fim?new Date(v.fim).getTime():Date.now();if(B<u||I>g)return;const E=Math.max(I,u),w=Math.min(B,g),$=(E-u)/p*100,x=(w-E)/p*100;if(x<=0)return;const A=document.createElement("div");A.className="timeline-bar",A.style.left=`${$}%`,A.style.width=`${x}%`,A.style.color=v.cor&&v.cor!=="#000000"?v.cor:bt[s]||"#6b7280";const b=document.createElement("div");b.className="timeline-bar-visual",A.appendChild(b);const S=document.createElement("div");S.className="timeline-identifier-point";const _=new Date(v.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),O=v.fim?new Date(v.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",U=i.name,D=v.sub_topico?v.sub_topico.charAt(0).toUpperCase()+v.sub_topico.slice(1):"-";S.setAttribute("data-tooltip",`Tópico: ${U}
Eventos: ${D}
Início: ${_} - Fim: ${O}
Descrição: ${v.descricao||"-"}`),!v.fim&&S.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(S.style.cursor="pointer",S.onclick=P=>{P.stopPropagation(),$t(v.id)}):S.style.cursor="default",A.appendChild(S),h.appendChild(A)})})}function Oe(n){return n?n.toLowerCase().trim():""}function tn(n,t,e,o){const i=document.getElementById(`sla-${n}`);if(!i)return;const s=o-e;if(s<=0){i.textContent="N/A";return}const r=t.filter(p=>{const f=new Date(p.inicio).getTime();return(p.fim?new Date(p.fim).getTime():Date.now())>e&&f<o}).map(p=>({start:Math.max(new Date(p.inicio).getTime(),e),end:Math.min(p.fim?new Date(p.fim).getTime():Date.now(),o)}));r.sort((p,f)=>p.start-f.start);const l=[];if(r.length>0){let p=r[0];for(let f=1;f<r.length;f++){const m=r[f];m.start<p.end?p.end=Math.max(p.end,m.end):(l.push(p),p=m)}l.push(p)}let d=0;l.forEach(p=>{d+=p.end-p.start});const u=(s-d)/s*100;let g="#10b981";u<50?g="#ef4444":u<90&&(g="#f97316"),i.style.color=g,i.textContent=u.toFixed(4)+"%"}function Ut(){const n=document.getElementById("attention-topics-container");if(!n)return;n.innerHTML="";const t=xe.filter(e=>!e.fim);oe.forEach(e=>{const o=e.id,i=t.filter(h=>Oe(h.topico)===o),s=document.createElement("div");s.className=i.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const a=document.createElement("div");a.className="accordion-header",a.onclick=()=>jt(`attn-acc-${o}`);const r=document.createElement("div");r.className="accordion-title-group";const l=document.createElement("div");l.className="topic-indicator",l.style.backgroundColor=e.color;const d=document.createElement("h3");d.textContent=e.name;const u=document.createElement("span");u.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",u.textContent=`${i.length}`,r.appendChild(l),r.appendChild(d),r.appendChild(u);const g=document.createElement("span");g.className="accordion-chevron",g.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',a.appendChild(r),a.appendChild(g);const p=document.createElement("div");p.className="accordion-content";const f=document.createElement("div");f.className="accordion-body";const m=document.createElement("div");if(m.className="attention-carousel",i.length===0){const h=document.createElement("div");h.className="empty-state",h.textContent="Nenhum evento em andamento.",m.appendChild(h)}else i.forEach(h=>{const v=document.createElement("div");v.className="attention-card",v.style.borderLeftColor=h.cor&&h.cor!=="#000000"?h.cor:e.color;const I=document.createElement("h3");I.textContent=h.nome;const B=document.createElement("div");B.className="sub-topic",B.textContent=h.sub_topico||"-";const E=document.createElement("div");E.className="card-detail",E.innerHTML=`<strong>Início:</strong> ${new Date(h.inicio).toLocaleString()}`;const w=Date.now()-new Date(h.inicio).getTime(),$=document.createElement("div");$.className="card-duration",$.innerHTML=`<strong>Tempo:</strong> <span>${nn(w)}</span>`;const x=document.createElement("div");x.className="card-description",x.textContent=h.descricao||"-",v.appendChild(I),v.appendChild(B),v.appendChild(E),v.appendChild($),v.appendChild(x),window.auth&&window.auth.isAdmin()?(v.style.cursor="pointer",v.onclick=()=>$t(h.id)):v.style.cursor="default",m.appendChild(v)});f.appendChild(m),p.appendChild(f),s.appendChild(a),s.appendChild(p),n.appendChild(s)})}function nn(n){if(n<0)return"0s";const t=Math.floor(n/1e3),e=Math.floor(t/60),o=Math.floor(e/60),i=Math.floor(o/24),s=[];return i>0&&s.push(`${i}d`),(o%24>0||i>0)&&s.push(`${o%24}h`),(e%60>0||o>0)&&s.push(`${e%60}m`),s.push(`${t%60}s`),s.join(" ")}function on(n){const t=document.getElementById("rep-filter-subtopic");if(!t)return;t.innerHTML='<option value="Todos">Todos</option>';const e=n?n.toLowerCase().trim():"";e&&le[e]&&le[e].forEach(o=>{const i=document.createElement("option");i.value=o.toLowerCase(),i.textContent=o,t.appendChild(i)})}function Fe(){let n=xe;const t=document.getElementById("rep-filter-start")?.value,e=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,i=document.getElementById("rep-filter-subtopic")?.value;if(t){const x=new Date(t+"T00:00:00").getTime();n=n.filter(A=>new Date(A.inicio).getTime()>=x)}if(e){const x=new Date(e+"T23:59:59").getTime();n=n.filter(A=>new Date(A.inicio).getTime()<=x)}o&&o!=="Todos"&&(n=n.filter(x=>Oe(x.topico)===o.toLowerCase())),i&&i!=="Todos"&&(n=n.filter(x=>x.sub_topico&&x.sub_topico.toLowerCase()===i.toLowerCase()));const s=document.getElementById("rep-kpi-total"),a=document.getElementById("rep-kpi-active"),r=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=n.length);const l=n.filter(x=>x.em_ocorrencia==1||x.em_ocorrencia==="true"||!x.fim);a&&(a.textContent=l.length);const d=n.filter(x=>x.fim);let u="0h 0m";if(d.length>0){const A=d.reduce((O,U)=>O+(new Date(U.fim).getTime()-new Date(U.inicio).getTime()),0)/d.length,b=Math.floor(A/6e4),S=Math.floor(b/60),_=b%60;u=`${S}h ${_}m`}if(r&&(r.textContent=u),!window.Chart){console.warn("Chart.js is not loaded.");return}const g=oe,p=t?new Date(t+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),f=e?new Date(e+"T23:59:59").getTime():Date.now(),m=g.map(x=>x.name),h=g.map(x=>{const A=x.id,b=xe.filter(y=>Oe(y.topico)===A),S=f-p;if(S<=0)return 100;const O=b.filter(y=>{const C=new Date(y.inicio).getTime();return(y.fim?new Date(y.fim).getTime():Date.now())>p&&C<f}).map(y=>({start:Math.max(new Date(y.inicio).getTime(),p),end:Math.min(y.fim?new Date(y.fim).getTime():Date.now(),f)}));O.sort((y,C)=>y.start-C.start);const U=[];if(O.length>0){let y=O[0];for(let C=1;C<O.length;C++){const L=O[C];L.start<y.end?y.end=Math.max(y.end,L.end):(U.push(y),y=L)}U.push(y)}const V=(y=>{let C=0;return y.forEach(L=>{C+=L.end-L.start}),C})(U),P=(S-V)/S*100;return parseFloat(P.toFixed(4))}),v=g.map(x=>x.color||"#6b7280"),I=document.getElementById("chart-rep-sla");I&&(rt&&rt.destroy(),rt=new window.Chart(I,{type:"bar",data:{labels:m,datasets:[{label:"Disponibilidade %",data:h,backgroundColor:v,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...h)-5),max:100,ticks:{callback:x=>x+"%"}}}}}));const B={};n.forEach(x=>{const A=x.sub_topico?x.sub_topico.charAt(0).toUpperCase()+x.sub_topico.slice(1).toLowerCase():"Não especificado";B[A]=(B[A]||0)+1});const E=Object.keys(B),w=Object.values(B),$=document.getElementById("chart-rep-qty");$&&(lt&&lt.destroy(),lt=new window.Chart($,{type:"doughnut",data:{labels:E.length>0?E:["Nenhum evento"],datasets:[{data:w.length>0?w:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function an(n){if(n.preventDefault(),Re)return;Re=!0;const t=document.getElementById("topic-id"),e=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!t||!e||!o){Re=!1;return}const i={id:t.value.trim().toLowerCase(),name:e.value.trim(),color:o.value};if(!i.id){alert("Por favor, defina um ID para o tópico."),Re=!1;return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>(alert("Tópico salvo com sucesso!"),t.value="",e.value="",o.value="#3b82f6",we().then(()=>{ue()}))).catch(s=>{console.error(s),alert("Erro: "+s.message)}).finally(()=>{Re=!1})}function sn(n){if(n.preventDefault(),_e)return;_e=!0;const t=document.getElementById("subtopic-topic-id"),e=document.getElementById("subtopic-name");if(!t||!e){_e=!1;return}const o={topic_id:t.value,name:e.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento."),_e=!1;return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(i=>{if(!i.ok)throw new Error("Erro ao adicionar evento");return i.json()}).then(()=>(alert("Evento adicionado!"),e.value="",we())).catch(i=>{console.error(i),alert("Erro: "+i.message)}).finally(()=>{_e=!1})}function rn(n){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${n}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir tópico");return t.json()}).then(()=>{alert("Tópico excluído!"),we().then(()=>{ue()})}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function ln(n){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${n}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir evento");return t.json()}).then(()=>{alert("Evento excluído!"),we()}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function Gt(){const n=document.getElementById("config-topics-list");n&&(n.innerHTML="",oe.length===0?n.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':oe.forEach(e=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${e.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${e.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${e.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${e.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,n.appendChild(o)}));const t=document.getElementById("config-subtopics-list");t&&(t.innerHTML="",nt.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':nt.forEach(e=>{const o=oe.find(r=>r.id===e.topic_id),i=o?o.name:e.topic_id,s=o?o.color:"#6b7280",a=document.createElement("div");a.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",a.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${e.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${i}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${e.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(a)}))}function dn(n,t){n.currentTarget.classList.add("dragging"),n.dataTransfer.effectAllowed="move"}function cn(n){n.preventDefault();const t=document.querySelector(".timeline-container.dragging");if(!t)return;const e=document.getElementById("timeline-tracks-container");if(!e)return;const i=[...e.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const a=s.getBoundingClientRect();return n.clientY<=a.top+a.height/2});i?e.insertBefore(t,i):e.appendChild(t)}function un(n){const t=document.querySelector(".timeline-container.dragging");t&&t.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(i=>{i.setAttribute("draggable","false")});const e=document.getElementById("timeline-tracks-container");if(!e)return;const o=Array.from(e.querySelectorAll(".timeline-container")).map(i=>i.dataset.topicId);pn(o)}function pn(n){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:n})}).then(t=>{if(!t.ok)throw new Error("Erro ao salvar nova ordenação");return t.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),we().then(()=>{ue()})}).catch(t=>{console.error(t),alert("Erro ao salvar ordenação: "+t.message)})}let ce=[],ye=[],ct=[],ut=[],q="extensions",Y=1,ke=100,pt=[];const Be={setActiveTab(n){q=n,Y=1;const t=document.getElementById("telephony-search");t&&(t.value="",n==="extensions"?t.placeholder="Pesquisar ramais por número, nome ou usuário...":n==="queues"?t.placeholder="Pesquisar filas por número ou nome...":n==="blf"?t.placeholder="Pesquisar BLF por nome...":n==="users"&&(t.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(a=>{a.id===`tab-telephony-${n}`?a.classList.add("active"):a.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(a=>{a.id===`telephony-view-${n}`?a.classList.remove("hidden"):a.classList.add("hidden")});const i=document.querySelector("#telephony-section .search-bar"),s=document.getElementById("telephony-pagination");if(i&&(i.style.display=n==="history"?"none":"flex"),s&&(s.style.display=n==="history"?"none":"block"),n==="history")this.fetchAndRenderHistory();else{const a=this.getActiveDataList();this.render(a)}},getActiveDataList(){return q==="extensions"?ce:q==="queues"?ye:q==="blf"?ct:q==="users"?ut:[]},async fetch(){const n=this.getActiveTableBody();n&&(n.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(Y=1,q==="extensions")ce=await k.get("/telephony/extensions"),this.render(ce);else if(q==="queues")ye=await k.get("/telephony/queues"),this.render(ye);else if(q==="blf"){const t=[];if(ce.length===0&&t.push(k.get("/telephony/extensions").then(e=>{ce=e}).catch(e=>console.warn("Could not pre-fetch extensions:",e))),ye.length===0&&t.push(k.get("/telephony/queues").then(e=>{ye=e}).catch(e=>console.warn("Could not pre-fetch queues:",e))),t.length>0)try{await Promise.all(t)}catch(e){console.warn("Could not pre-fetch extensions/queues for BLF mapping:",e)}ct=await k.get("/telephony/blfs"),this.render(ct)}else q==="users"?(ut=await k.get("/telephony/users"),this.render(ut)):q==="history"&&await this.fetchAndRenderHistory()}catch(t){console.error(`Error fetching telephony ${q}:`,t),n&&(n.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${t.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return q==="extensions"?document.getElementById("telephony-table-body"):q==="queues"?document.getElementById("telephony-queues-table-body"):q==="blf"?document.getElementById("telephony-blf-table-body"):q==="users"?document.getElementById("telephony-users-table-body"):null},render(n){const t=this.getActiveTableBody();if(!t)return;pt=n;const e=n.length,o=Math.ceil(e/ke);Y>o&&(Y=Math.max(1,o)),Y<1&&(Y=1);const i=(Y-1)*ke,s=n.slice(i,i+ke);if(s.length===0){const a=q==="extensions"?9:q==="queues"?6:q==="blf"?4:5;t.innerHTML=`
                <tr>
                    <td colspan="${a}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}q==="extensions"?this.renderExtensionsList(t,s):q==="queues"?this.renderQueuesList(t,s):q==="blf"?this.renderBlfsList(t,s):q==="users"&&this.renderUsersList(t,s),this.renderPaginationControls("telephony-pagination",o,e)},renderExtensionsList(n,t){n.innerHTML=t.map(e=>{const o=e.exten||"-",i=e.nome||"-",s=e.local_username||"",a=e.local_department||"",r=e.ddr||"-",l=e.Username||"-",d=e.Secret||"",u=e.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${e.regra_saida_nome}</span>`:"-",g=e.observacao||"-",p=d.replace(/'/g,"\\'");return`
                <tr>
                    <td>
                        <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>${o}</span>
                        </span>
                    </td>
                    <td>${i}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" class="form-control glass" 
                                   style="width: 130px; padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--text-main);" 
                                   value="${s}" 
                                   placeholder="Usuário..." 
                                   onchange="window.TelephonyHandler.updateLocalUsername('${o}', this.value)">
                            <button class="btn-icon" 
                                    style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 6px; color: var(--text-muted); cursor: pointer;"
                                    onclick="window.TelephonyHandler.showExtensionHistory('${o}')"
                                    title="Ver histórico de alterações do ramal ${o}">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>
                        <input type="text" class="form-control glass" 
                               style="width: 120px; padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--text-main);" 
                               value="${a}" 
                               placeholder="Depto..." 
                               onchange="window.TelephonyHandler.updateDepartment('${o}', this.value)">
                    </td>
                    <td>${r}</td>
                    <td><strong style="color: var(--accent);">${l}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 140px;">
                            <span id="secret-txt-${e.id}" style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleSecret(${e.id}, '${p}')" title="Mostrar/Ocultar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg id="secret-icon-${e.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${u}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${g}">${g}</td>
                </tr>
            `}).join("")},renderQueuesList(n,t){n.innerHTML=t.map(e=>{const o=e.exten||"-",i=e.nome||"-",s=e.Estrategia||"-",a=e.TimeoutAgente?`${e.TimeoutAgente}s`:"-",r=e.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',l=e.membros?e.membros.length:0,d=e.membros&&e.membros.length>0?e.membros.map(u=>`
                    <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span style="font-size: 0.85rem; font-weight: 500;">${u.extensao_numero} - ${u.extensao_nome}</span>
                    </div>
                  `).join(""):'<div style="color: var(--text-muted); font-size: 0.85rem;">Nenhum ramal membro nesta fila.</div>';return`
                <tr onclick="window.TelephonyHandler.toggleQueueRow(${e.id})" style="cursor: pointer;" title="Clique para ver os ramais membros">
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
                    <td><strong>${i}</strong></td>
                    <td style="text-transform: capitalize;">${s}</td>
                    <td>${a}</td>
                    <td>${r}</td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${l} membros</span>
                            <svg id="queue-arrow-${e.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                </tr>
                <tr id="queue-details-${e.id}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="6" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Membros Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${d}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderBlfsList(n,t){n.innerHTML=t.map(e=>{const o=e.id,i=e.Nome||"-",s=e.quantidade_extensoes||0,a=e.DataCriacao?new Date(e.DataCriacao).toLocaleString("pt-BR"):"-",r=e.extensoes_ids&&e.extensoes_ids.length>0?e.extensoes_ids.map(l=>{let d=ce.find(g=>g.extensao_id===l),u=ye.find(g=>g.extensao_id===l);if(!d&&!u&&(d=ce.find(g=>g.id===l),d||(u=ye.find(g=>g.id===l))),d){const g=d.exten||`ID ${l}`,p=d.nome||"Sem nome";return`
                            <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500;">${g} - ${p} <small style="color: var(--text-muted); font-size: 0.75rem;">(Ramal)</small></span>
                            </div>
                        `}else if(u){const g=u.exten||`Fila ${l}`,p=u.nome||"Sem nome";return`
                            <div style="background: rgba(16,185,129,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(16,185,129,0.15); display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: #10b981;">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500; color: #6ee7b7;">${g} - ${p} <small style="color: #a7f3d0; font-size: 0.75rem; opacity: 0.8;">(Fila)</small></span>
                            </div>
                        `}else return`
                            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px; opacity: 0.6;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--text-muted);">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">ID ${l} - Não encontrado</span>
                            </div>
                        `}).join(""):'<div style="color: var(--text-muted); font-size: 0.85rem;">Nenhum ramal/fila vinculado neste BLF.</div>';return`
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
                    <td><strong>${i}</strong></td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${s} ramais</span>
                            <svg id="blf-arrow-${o}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                    <td style="color: var(--text-muted);">${a}</td>
                </tr>
                <tr id="blf-details-${o}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="4" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${r}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderUsersList(n,t){n.innerHTML=t.map(e=>{const o=e.username||"-",i=e.email||"-",s=e.Tipo||"-",a=e.is_active?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Ativo</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Inativo</span>';return`
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
                    <td>${i}</td>
                    <td style="text-transform: capitalize; font-weight: 600; color: var(--accent);">${s}</td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; max-width: 140px;">
                            <span style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleUserSecret(${e.id})" title="Mostrar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${a}</td>
                </tr>
            `}).join("")},toggleQueueRow(n){const t=document.getElementById(`queue-details-${n}`),e=document.getElementById(`queue-arrow-${n}`);t&&(t.classList.toggle("hidden"),e&&(t.classList.contains("hidden")?e.style.transform="rotate(0deg)":e.style.transform="rotate(180deg)"))},toggleBlfRow(n){const t=document.getElementById(`blf-details-${n}`),e=document.getElementById(`blf-arrow-${n}`);t&&(t.classList.toggle("hidden"),e&&(t.classList.contains("hidden")?e.style.transform="rotate(0deg)":e.style.transform="rotate(180deg)"))},toggleUserSecret(n){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(n){Y=1;const e=this.getActiveDataList().filter(o=>q==="extensions"?(o.exten||"").toLowerCase().includes(n)||(o.nome||"").toLowerCase().includes(n)||(o.local_username||"").toLowerCase().includes(n)||(o.local_department||"").toLowerCase().includes(n)||(o.Username||"").toLowerCase().includes(n)||(o.ddr||"").toLowerCase().includes(n)||(o.observacao||"").toLowerCase().includes(n):q==="queues"?(o.exten||"").toLowerCase().includes(n)||(o.nome||"").toLowerCase().includes(n)||(o.Estrategia||"").toLowerCase().includes(n):q==="blf"?(o.Nome||"").toLowerCase().includes(n):q==="users"?(o.username||"").toLowerCase().includes(n)||(o.email||"").toLowerCase().includes(n)||(o.Tipo||"").toLowerCase().includes(n):!1);this.render(e)},changePage(n){Y=n,this.render(pt)},setPageSize(n){ke=parseInt(n,10),Y=1,this.render(pt)},async updateLocalUsername(n,t){try{console.log(`[TELEFONIA] Atualizando nome de usuário local do ramal ${n} para: ${t}`);const e=window.auth&&window.auth.getUser()?window.auth.getUser().name:"Sistema",o=await k.post("/telephony/extensions/username",{exten:n,username:t,changed_by:e});if(o.success){const i=ce.find(s=>s.exten===n);i&&(i.local_username=t),console.log(`[TELEFONIA] Nome de usuário local atualizado para ${n}`)}else alert("Erro ao salvar nome de usuário: "+(o.error||"Erro desconhecido"))}catch(e){console.error("Erro ao atualizar nome de usuário local:",e),alert("Erro de rede ao salvar nome de usuário: "+e.message)}},async updateDepartment(n,t){try{console.log(`[TELEFONIA] Atualizando departamento do ramal ${n} para: ${t}`);const e=window.auth&&window.auth.getUser()?window.auth.getUser().name:"Sistema",o=await k.post("/telephony/extensions/department",{exten:n,department:t,changed_by:e});if(o.success){const i=ce.find(s=>s.exten===n);i&&(i.local_department=t),console.log(`[TELEFONIA] Departamento local atualizado para ${n}`)}else alert("Erro ao salvar departamento: "+(o.error||"Erro desconhecido"))}catch(e){console.error("Erro ao atualizar departamento local:",e),alert("Erro de rede ao salvar departamento: "+e.message)}},showExtensionHistory(n){const t=document.getElementById("telephony-history-start"),e=document.getElementById("telephony-history-end");t&&(t.value=""),e&&(e.value="");const o=document.getElementById("telephony-history-exten");o&&(o.value=n);const i=document.getElementById("telephony-history-username");i&&(i.value=""),this.setActiveTab("history")},toggleSecret(n,t){const e=document.getElementById(`secret-txt-${n}`),o=document.getElementById(`secret-icon-${n}`);!e||!o||(e.textContent==="••••••••"?(e.textContent=t,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(e.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(n,t,e){const o=document.getElementById(n);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
            <button class="pagination-btn" 
                    ${Y===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${Y-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=Y-1&&l<=Y+1)&&(s&&l-s>1&&(i+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),i+=`
                    <button class="pagination-btn ${l===Y?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);i+=`
            <button class="pagination-btn" 
                    ${Y===t?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${Y+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const a=(Y-1)*ke+1,r=Math.min(Y*ke,e);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${e}
            </span>
        `,o.innerHTML=i},init(){console.log("📞 [TELEFONIA] Inicializando telephonyHandler...");const n=document.getElementById("telephony-history-start"),t=document.getElementById("telephony-history-end");n&&(n.value=""),t&&(t.value=""),["telephony-history-start","telephony-history-end"].forEach(o=>{const i=document.getElementById(o);i&&i.addEventListener("change",()=>this.fetchAndRenderHistory())}),["telephony-history-exten","telephony-history-username"].forEach(o=>{const i=document.getElementById(o);i&&i.addEventListener("input",()=>this.fetchAndRenderHistory())});const e=document.getElementById("btn-clear-telephony-history-filters");e&&e.addEventListener("click",()=>{n&&(n.value=""),t&&(t.value="");const o=document.getElementById("telephony-history-exten"),i=document.getElementById("telephony-history-username");o&&(o.value=""),i&&(i.value=""),this.fetchAndRenderHistory()})},async fetchAndRenderHistory(){const n=document.getElementById("telephony-history-timeline-container");n&&(n.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Carregando histórico...
                </div>
            `);try{const t=document.getElementById("telephony-history-start")?.value||"",e=document.getElementById("telephony-history-end")?.value||"",o=document.getElementById("telephony-history-exten")?.value||"",i=document.getElementById("telephony-history-username")?.value||"",s=new URLSearchParams({startDate:t,endDate:e,exten:o,username:i}),a=await k.get("/telephony/extensions/history?"+s.toString());this.renderHistoryTimeline(a)}catch(t){console.error("Error fetching extension history:",t),n&&(n.innerHTML=`
                    <div style="text-align: center; padding: 3rem; color: #ef4444; width: 100%;">
                        Erro ao carregar histórico: ${t.message||"Erro desconhecido"}
                    </div>
                `)}},renderHistoryTimeline(n){const t=document.getElementById("telephony-history-timeline-container");if(t){if(!n||n.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Nenhum registro de histórico encontrado para os filtros selecionados.
                </div>
            `;return}t.innerHTML=n.map(e=>{const o=new Date(e.changed_at).toLocaleString("pt-BR"),i=e.exten||"-",s=e.changed_by||"Sistema";let a="";if(e.new_username!==void 0&&e.new_username!==null&&e.old_username!==e.new_username){const r=e.old_username||"<i>(Vazio)</i>",l=e.new_username||"<i>(Removido)</i>";a=`
                     Nome de usuário alterado:
                     <span style="text-decoration: line-through; color: var(--text-muted); margin: 0 6px;">${r}</span>
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="vertical-align: middle; margin-right: 6px; color: var(--success, #10b981);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                     <strong style="color: var(--success, #10b981);">${l}</strong>
                `}else if(e.new_department!==void 0&&e.new_department!==null&&e.old_department!==e.new_department){const r=e.old_department||"<i>(Vazio)</i>",l=e.new_department||"<i>(Removido)</i>";a=`
                     Departamento alterado:
                     <span style="text-decoration: line-through; color: var(--text-muted); margin: 0 6px;">${r}</span>
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="vertical-align: middle; margin-right: 6px; color: var(--success, #10b981);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                     <strong style="color: var(--success, #10b981);">${l}</strong>
                `}else a="Alteração registrada no ramal.";return`
                <div class="timeline-item" style="position: relative; padding-bottom: 10px;">
                    <!-- Bullet point indicating event -->
                    <span style="position: absolute; left: -26px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent, #4F46E5); border: 2px solid var(--text-main, #ffffff); box-shadow: 0 0 8px var(--accent);"></span>
                    
                    <div class="glass" style="padding: 15px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.02);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 10px;">
                            <span style="font-weight: bold; color: var(--accent); font-size: 0.95rem;">
                                Ramal ${i}
                            </span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">
                                ${o}
                            </span>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 8px;">
                             ${a}
                         </div>
                         <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
                             <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                             <span>Alterado por: <strong>${s}</strong></span>
                         </div>
                    </div>
                </div>
            `}).join("")}}},gt=30;let Rt="",_t="all",mt="",ft="",ie=1,ze=0,G="alerts",ne="switches",R=null,ht=[],Pt=[],zt=[],Nt=[],Ft=[],ae=[],Ye=null,We=null,Je=null,Qe=null,Ke=null,Ze=null,Xe=null,yt={},Ne=null,et=null,Ie=!1;const Bt={init(){console.log("📊 [MONITORING] Initializing monitoringHandler...");const n=document.getElementById("tab-monitoring-alerts");n&&n.addEventListener("click",()=>this.setActiveTab("alerts"));const t=document.getElementById("tab-monitoring-events");t&&t.addEventListener("click",()=>this.setActiveTab("events"));const e=document.getElementById("tab-monitoring-apis");e&&e.addEventListener("click",()=>this.setActiveTab("apis"));const o=document.getElementById("tab-monitoring-gnew");o&&o.addEventListener("click",()=>this.setActiveTab("gnew"));const i=document.getElementById("tab-monitoring-infra");i&&i.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Infraestrutura tab"),this.setActiveTab("infra")});const s=document.getElementById("tab-monitoring-network");s&&s.addEventListener("click",()=>this.setActiveTab("network"));const a=document.getElementById("tab-infra-switches");a&&a.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Switches subtab"),this.setInfraTab("switches")});const r=document.getElementById("tab-infra-routers");r&&r.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Routers subtab"),this.setInfraTab("routers")});const l=document.getElementById("tab-infra-nas");l&&l.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on NAS subtab"),this.setInfraTab("nas")});const d=document.getElementById("tab-infra-cameras");d&&d.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Cameras subtab"),this.setInfraTab("cameras")});const u=document.getElementById("tab-infra-servers");u&&u.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Servers subtab"),this.setInfraTab("servers")});const g=document.getElementById("btn-refresh-switches-status");g&&g.addEventListener("click",()=>this.fetchAndRenderSwitchesStatus(!0));const p=document.getElementById("btn-refresh-routers-status");p&&p.addEventListener("click",()=>this.fetchAndRenderRoutersStatus(!0));const f=document.getElementById("btn-refresh-nas-status");f&&f.addEventListener("click",()=>this.fetchAndRenderNasStatus(!0));const m=document.getElementById("btn-refresh-cameras-status");m&&m.addEventListener("click",()=>this.fetchAndRenderCamerasStatus(!0));const h=document.getElementById("btn-refresh-servers-status");h&&h.addEventListener("click",()=>this.fetchAndRenderServersStatus(!0));const v=document.getElementById("servers-search");v&&v.addEventListener("input",()=>{this.renderServersAccordion(ae)});const I=document.getElementById("btn-toggle-server-filters");I&&I.addEventListener("click",()=>{const T=I.closest(".server-filters-accordion");T&&T.classList.toggle("active")}),["filter-type-physical","filter-type-virtual","filter-platform-win2019","filter-platform-win2025","filter-platform-linux","filter-activity-online","filter-activity-offline"].forEach(T=>{const se=document.getElementById(T);se&&se.addEventListener("change",()=>{this.renderServersAccordion(ae)})});const E=document.getElementById("monitoring-events-search-input");E&&E.addEventListener("input",T=>{Rt=T.target.value.toLowerCase(),ie=1,this.fetchAndRenderEventHistory()});const w=document.getElementById("monitoring-search-input");w&&w.addEventListener("input",()=>{this.renderGnewServicesStatus()});const $=document.getElementById("monitoring-events-severity-filter");$&&$.addEventListener("change",T=>{_t=T.target.value,ie=1,this.fetchAndRenderEventHistory()});const x=document.getElementById("monitoring-events-date-start"),A=document.getElementById("monitoring-events-date-end");x&&x.addEventListener("change",T=>{mt=T.target.value,ie=1,this.fetchAndRenderEventHistory()}),A&&A.addEventListener("change",T=>{ft=T.target.value,ie=1,this.fetchAndRenderEventHistory()});const b=document.getElementById("btn-clear-event-date-filter");b&&b.addEventListener("click",()=>{mt="",ft="",ie=1,x&&(x.value=""),A&&(A.value=""),this.fetchAndRenderEventHistory()});const S=document.getElementById("btn-clear-event-history");S&&S.addEventListener("click",()=>this.clearEventHistoryByPeriod());const _=document.getElementById("btn-delete-all-event-history");_&&_.addEventListener("click",()=>this.clearEventHistory());const O=document.getElementById("btn-refresh-monitoring");O&&O.addEventListener("click",()=>this.fetchDiagnostics());const U=document.getElementById("gnew-disk-accordion-header");U&&U.addEventListener("click",()=>{const T=document.getElementById("gnew-disk-accordion-content"),se=document.getElementById("gnew-disk-chevron");T&&se&&(T.style.maxHeight==="0px"?(T.style.maxHeight="1000px",se.style.transform="rotate(0deg)"):(T.style.maxHeight="0px",se.style.transform="rotate(-90deg)"))});const D=document.getElementById("btn-refresh-gnew-disk");D&&D.addEventListener("click",T=>{T.stopPropagation(),this.fetchDiagnostics()});const V=document.getElementById("btn-refresh-gnew-services");V&&V.addEventListener("click",async()=>{const T=V,se=T.querySelector("svg");if(!T.disabled){T.disabled=!0,T.style.opacity="0.6",T.style.cursor="not-allowed",se&&(se.style.animation="spin 0.8s linear infinite");try{await this.fetchDiagnostics()}finally{T.disabled=!1,T.style.opacity="",T.style.cursor="pointer",se&&(se.style.animation="")}}});const P=document.getElementById("btn-refresh-apis-status");P&&P.addEventListener("click",()=>this.fetchAndRenderApisStatus());const y=document.getElementById("monitoring-auto-refresh");y&&(y.addEventListener("change",T=>{T.target.checked?this._startAutoRefresh():this._stopAutoRefresh()}),y.checked&&this._startAutoRefresh());const C=document.getElementById("switches-auto-refresh");C&&(C.addEventListener("change",T=>{T.target.checked?this._startSwitchesAutoRefresh():this._stopSwitchesAutoRefresh()}),C.checked&&this._startSwitchesAutoRefresh());const L=document.getElementById("routers-auto-refresh");L&&(L.addEventListener("change",T=>{T.target.checked?this._startRoutersAutoRefresh():this._stopRoutersAutoRefresh()}),L.checked&&this._startRoutersAutoRefresh());const z=document.getElementById("nas-auto-refresh");z&&(z.addEventListener("change",T=>{T.target.checked?this._startNasAutoRefresh():this._stopNasAutoRefresh()}),z.checked&&this._startNasAutoRefresh());const N=document.getElementById("cameras-auto-refresh");N&&(N.addEventListener("change",T=>{T.target.checked?this._startCamerasAutoRefresh():this._stopCamerasAutoRefresh()}),N.checked&&this._startCamerasAutoRefresh());const F=document.getElementById("servers-auto-refresh");F&&(F.addEventListener("change",T=>{T.target.checked?this._startServersAutoRefresh():this._stopServersAutoRefresh()}),F.checked&&this._startServersAutoRefresh());const ee=document.getElementById("btn-refresh-network-status");ee&&ee.addEventListener("click",()=>this.fetchAndRenderNetworkStatus(!0));const Te=document.getElementById("network-auto-refresh");Te&&(Te.addEventListener("change",T=>{T.target.checked?this._startNetworkAutoRefresh():this._stopNetworkAutoRefresh()}),Te.checked&&this._startNetworkAutoRefresh());const Ct=document.getElementById("network-traffic-enable");Ct&&Ct.addEventListener("change",T=>{T.target.checked?this._startTrafficPolling():this._stopTrafficPolling()}),window.monitoringHandler=this},_startAutoRefresh(){this._stopAutoRefresh(),Ye=setInterval(()=>{(G==="alerts"||G==="gnew")&&this.fetchDiagnostics()},3e4)},_stopAutoRefresh(){Ye&&(clearInterval(Ye),Ye=null)},_startSwitchesAutoRefresh(){this._stopSwitchesAutoRefresh(),We=setInterval(()=>{G==="infra"&&ne==="switches"&&this.fetchAndRenderSwitchesStatus(!1,!0)},6e4)},_stopSwitchesAutoRefresh(){We&&(clearInterval(We),We=null)},_startNetworkAutoRefresh(){this._stopNetworkAutoRefresh(),Xe=setInterval(()=>{G==="network"&&this.fetchAndRenderNetworkStatus(!1)},3e4)},_stopNetworkAutoRefresh(){Xe&&(clearInterval(Xe),Xe=null)},_startRoutersAutoRefresh(){this._stopRoutersAutoRefresh(),Je=setInterval(()=>{G==="infra"&&ne==="routers"&&this.fetchAndRenderRoutersStatus(!1,!0)},6e4)},_stopRoutersAutoRefresh(){Je&&(clearInterval(Je),Je=null)},_startNasAutoRefresh(){this._stopNasAutoRefresh(),Qe=setInterval(()=>{G==="infra"&&ne==="nas"&&this.fetchAndRenderNasStatus(!1,!0)},6e4)},_stopNasAutoRefresh(){Qe&&(clearInterval(Qe),Qe=null)},_startCamerasAutoRefresh(){this._stopCamerasAutoRefresh(),Ke=setInterval(()=>{G==="infra"&&ne==="cameras"&&this.fetchAndRenderCamerasStatus(!1,!0)},6e4)},_stopCamerasAutoRefresh(){Ke&&(clearInterval(Ke),Ke=null)},_startServersAutoRefresh(){this._stopServersAutoRefresh(),Ze=setInterval(()=>{G==="infra"&&ne==="servers"&&this.fetchAndRenderServersStatus(!1,!0)},6e4)},_stopServersAutoRefresh(){Ze&&(clearInterval(Ze),Ze=null)},fetch(){this.setActiveTab("alerts"),this.fetchDiagnostics()},setActiveTab(n){G=n;const t=document.getElementById("tab-monitoring-alerts"),e=document.getElementById("tab-monitoring-events"),o=document.getElementById("tab-monitoring-apis"),i=document.getElementById("tab-monitoring-gnew"),s=document.getElementById("tab-monitoring-infra"),a=document.getElementById("tab-monitoring-network");t&&t.classList.toggle("active",n==="alerts"),e&&e.classList.toggle("active",n==="events"),o&&o.classList.toggle("active",n==="apis"),i&&i.classList.toggle("active",n==="gnew"),s&&s.classList.toggle("active",n==="infra"),a&&a.classList.toggle("active",n==="network");const r=document.getElementById("monitoring-tab-content-alerts"),l=document.getElementById("monitoring-tab-content-events"),d=document.getElementById("monitoring-tab-content-apis"),u=document.getElementById("monitoring-tab-content-gnew"),g=document.getElementById("monitoring-tab-content-infra"),p=document.getElementById("monitoring-tab-content-network");r&&(r.classList.toggle("hidden",n!=="alerts"),r.classList.toggle("active",n==="alerts")),l&&(l.classList.toggle("hidden",n!=="events"),l.classList.toggle("active",n==="events")),d&&(d.classList.toggle("hidden",n!=="apis"),d.classList.toggle("active",n==="apis")),u&&(u.classList.toggle("hidden",n!=="gnew"),u.classList.toggle("active",n==="gnew")),g&&(g.classList.toggle("hidden",n!=="infra"),g.classList.toggle("active",n==="infra")),p&&(p.classList.toggle("hidden",n!=="network"),p.classList.toggle("active",n==="network")),n==="gnew"?(this.fetchDiagnostics(),this._stopTrafficPolling()):n==="events"?(ie=1,this.fetchAndRenderEventHistory(),this._stopTrafficPolling()):n==="apis"?(this.fetchAndRenderApisStatus(),this._stopTrafficPolling()):n==="infra"?(this.setInfraTab(ne),this._stopTrafficPolling()):n==="network"?(this.fetchAndRenderNetworkStatus(),this._startTrafficPolling()):(this.renderGnewServicesStatus(),this._stopTrafficPolling())},setInfraTab(n){console.log("📊 [MONITORING] setInfraTab called with:",n),ne=n;const t=document.getElementById("tab-infra-switches"),e=document.getElementById("tab-infra-routers"),o=document.getElementById("tab-infra-nas"),i=document.getElementById("tab-infra-cameras"),s=document.getElementById("tab-infra-servers");t&&t.classList.toggle("active",n==="switches"),e&&e.classList.toggle("active",n==="routers"),o&&o.classList.toggle("active",n==="nas"),i&&i.classList.toggle("active",n==="cameras"),s&&s.classList.toggle("active",n==="servers");const a=document.getElementById("infra-tab-content-switches"),r=document.getElementById("infra-tab-content-routers"),l=document.getElementById("infra-tab-content-nas"),d=document.getElementById("infra-tab-content-cameras"),u=document.getElementById("infra-tab-content-servers");a&&(a.classList.toggle("hidden",n!=="switches"),a.classList.toggle("active",n==="switches")),r&&(r.classList.toggle("hidden",n!=="routers"),r.classList.toggle("active",n==="routers")),l&&(l.classList.toggle("hidden",n!=="nas"),l.classList.toggle("active",n==="nas")),d&&(d.classList.toggle("hidden",n!=="cameras"),d.classList.toggle("active",n==="cameras")),u&&(u.classList.toggle("hidden",n!=="servers"),u.classList.toggle("active",n==="servers")),n==="switches"?this.fetchAndRenderSwitchesStatus():n==="routers"?this.fetchAndRenderRoutersStatus():n==="nas"?this.fetchAndRenderNasStatus():n==="cameras"?this.fetchAndRenderCamerasStatus():n==="servers"&&this.fetchAndRenderServersStatus()},render(){G==="alerts"?this.renderGnewServicesStatus():G==="events"?this.fetchAndRenderEventHistory():G==="apis"?this.fetchAndRenderApisStatus():G==="infra"&&(ne==="switches"?this.fetchAndRenderSwitchesStatus():ne==="routers"?this.fetchAndRenderRoutersStatus():ne==="nas"?this.fetchAndRenderNasStatus():ne==="cameras"?this.fetchAndRenderCamerasStatus():ne==="servers"&&this.fetchAndRenderServersStatus())},renderGnewServicesStatus(){const n=document.getElementById("monitoring-alerts-grid");if(!n)return;n.style.display="flex",n.style.flexDirection="column",n.style.gap="0";const t=R&&R.servicos&&Array.isArray(R.servicos.servicos)?R.servicos.servicos:[],e=ht||[],o=Pt||[],i=zt||[],s=Nt||[],a=Ft||[],r=ae||[];if(t.length===0&&e.length===0&&o.length===0&&i.length===0&&s.length===0&&a.length===0&&r.length===0){n.innerHTML=`
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">Nenhum dado de monitoramento disponível.</p>
                    <p style="font-size: 0.85rem;">Aguardando carga dos serviços do PABX, das APIs integradas ou da infraestrutura...</p>
                </div>
            `;return}const l=t.length+e.length+o.length+i.length+s.length+a.length+r.length,d=t.filter(y=>y.status!=="active"&&y.status_label!=="ativo").length,u=e.filter(y=>!y.online||y.status==="warning").length,g=o.filter(y=>!y.online).length,p=i.filter(y=>!y.online).length,f=s.filter(y=>!y.online).length,m=a.filter(y=>!y.online).length,h=r.filter(y=>!y.online).length,v=d+u+g+p+f+m+h,I=l-v,B=document.getElementById("monitor-kpi-total"),E=document.getElementById("monitor-kpi-warning"),w=document.getElementById("monitor-kpi-info");B&&(B.textContent=l),E&&(E.textContent=v),w&&(w.textContent=I);const $=document.getElementById("monitoring-search-input"),x=$?$.value.toLowerCase().trim():"";let A=t,b=e,S=o,_=i,O=s,U=a,D=r;x&&(A=t.filter(y=>y.nome.toLowerCase().includes(x)),b=e.filter(y=>y.name.toLowerCase().includes(x)||y.description.toLowerCase().includes(x)),S=o.filter(y=>y.name.toLowerCase().includes(x)||y.ip.toLowerCase().includes(x)),_=i.filter(y=>y.name.toLowerCase().includes(x)||y.ip.toLowerCase().includes(x)),O=s.filter(y=>y.name.toLowerCase().includes(x)||y.ip.toLowerCase().includes(x)),U=a.filter(y=>y.name.toLowerCase().includes(x)||y.ip.toLowerCase().includes(x)),D=r.filter(y=>y.name.toLowerCase().includes(x)||y.ip.toLowerCase().includes(x)));let V=`
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Serviço / API / Infraestrutura</span>
                    <span class="monitor-list-col-status">Status</span>
                </div>
        `,P=0;A.forEach(y=>{const C=y.status==="active"||y.status_label==="ativo",L=C?"#10b981":"#ef4444",z=C?"Online":y.status_label||y.status||"Offline",N=C?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",F=C?"#6ee7b7":"#fca5a5",ee=C?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)",Te=P%2===0?"transparent":"rgba(255,255,255,0.015)";P++,V+=`
                <div class="monitor-list-row" style="background: ${Te};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${L};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem;">[Serviço PABX] ${y.nome}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${N}; color:${F}; border-color:${ee};">${z}</span>
                    </div>
                </div>`}),b.forEach(y=>{let C="#10b981",L="Online",z="rgba(16,185,129,0.12)",N="#6ee7b7",F="rgba(16,185,129,0.3)";y.status==="warning"?(C="#f59e0b",L="Alerta",z="rgba(245,158,11,0.12)",N="#fde047",F="rgba(245,158,11,0.3)"):(y.status==="offline"||!y.online)&&(C="#ef4444",L="Offline",z="rgba(239,68,68,0.12)",N="#fca5a5",F="rgba(239,68,68,0.3)");const ee=P%2===0?"transparent":"rgba(255,255,255,0.015)";P++,V+=`
                <div class="monitor-list-row" style="background: ${ee};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:var(--accent);">[API] ${y.name}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${z}; color:${N}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),S.forEach(y=>{let C="#10b981",L="Online",z="rgba(16,185,129,0.12)",N="#6ee7b7",F="rgba(16,185,129,0.3)";y.online===null?(C="#94a3b8",L="Aguardando...",z="rgba(255, 255, 255, 0.05)",N="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):y.online||(C="#ef4444",L="Offline",z="rgba(239,68,68,0.12)",N="#fca5a5",F="rgba(239,68,68,0.3)");const ee=P%2===0?"transparent":"rgba(255,255,255,0.015)";P++,V+=`
                <div class="monitor-list-row" style="background: ${ee};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#38bdf8;">[Switch] ${y.name} (${y.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${z}; color:${N}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),_.forEach(y=>{let C="#10b981",L="Online",z="rgba(16,185,129,0.12)",N="#6ee7b7",F="rgba(16,185,129,0.3)";y.online===null?(C="#94a3b8",L="Aguardando...",z="rgba(255, 255, 255, 0.05)",N="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):y.online||(C="#ef4444",L="Offline",z="rgba(239,68,68,0.12)",N="#fca5a5",F="rgba(239,68,68,0.3)");const ee=P%2===0?"transparent":"rgba(255,255,255,0.015)";P++,V+=`
                <div class="monitor-list-row" style="background: ${ee};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f43f5e;">[Roteador] ${y.name} (${y.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${z}; color:${N}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),O.forEach(y=>{let C="#10b981",L="Online",z="rgba(16, 185, 129, 0.12)",N="#6ee7b7",F="rgba(16, 185, 129, 0.3)";y.online===null?(C="#94a3b8",L="Aguardando...",z="rgba(255, 255, 255, 0.05)",N="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):y.online||(C="#ef4444",L="Offline",z="rgba(239, 68, 68, 0.12)",N="#fca5a5",F="rgba(239, 68, 68, 0.3)");const ee=P%2===0?"transparent":"rgba(255,255,255,0.015)";P++,V+=`
                <div class="monitor-list-row" style="background: ${ee};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f97316;">[NAS] ${y.name} (${y.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${z}; color:${N}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),U.forEach(y=>{let C="#10b981",L="Online",z="rgba(16, 185, 129, 0.12)",N="#6ee7b7",F="rgba(16, 185, 129, 0.3)";y.online===null?(C="#94a3b8",L="Aguardando...",z="rgba(255, 255, 255, 0.05)",N="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):y.online||(C="#ef4444",L="Offline",z="rgba(239, 68, 68, 0.12)",N="#fca5a5",F="rgba(239, 68, 68, 0.3)");const ee=P%2===0?"transparent":"rgba(255,255,255,0.015)";P++,V+=`
                <div class="monitor-list-row" style="background: ${ee};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#10b981;">[Câmera] ${y.name} (${y.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${z}; color:${N}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),D.forEach(y=>{let C="#10b981",L="Online",z="rgba(16, 185, 129, 0.12)",N="#6ee7b7",F="rgba(16, 185, 129, 0.3)";y.online===null?(C="#94a3b8",L="Aguardando...",z="rgba(255, 255, 255, 0.05)",N="var(--text-muted)",F="rgba(255, 255, 255, 0.1)"):y.online||(C="#ef4444",L="Offline",z="rgba(239, 68, 68, 0.12)",N="#fca5a5",F="rgba(239, 68, 68, 0.3)");const ee=P%2===0?"transparent":"rgba(255,255,255,0.015)";P++,V+=`
                <div class="monitor-list-row" style="background: ${ee};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#6366f1;">[Servidor] ${y.name} (${y.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${z}; color:${N}; border-color:${F};">${L}</span>
                    </div>
                </div>`}),V+="</div>",n.innerHTML=V},async fetchAndRenderEventHistory(){const n=document.getElementById("monitoring-events-grid");if(n){n.innerHTML=`
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div class="event-history-loading">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite; margin-bottom: 0.75rem; opacity: 0.5;">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <p style="font-size: 0.9rem;">Carregando histórico...</p>
                </div>
            </div>`;try{const t=new URLSearchParams({page:ie,limit:gt,search:Rt||"",severity:_t||"all",startDate:mt||"",endDate:ft||""}),e=await k.get(`/monitoring/events?${t.toString()}`),o=e.events||[];ze=e.total||0;const i=e.totalPages||1;ie>i&&(ie=i);const s=document.getElementById("event-history-count");s&&(s.textContent=ze>0?ze:"",s.style.display=ze>0?"inline-flex":"none"),this.renderEvents(o),this.renderPagination(ze,i)}catch(t){console.error("Erro ao buscar histórico de eventos:",t),n.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p style="font-size: 0.9rem; color: #fca5a5;">Erro ao carregar o histórico de eventos.</p>
                    <p style="font-size: 0.8rem; margin-top: 4px;">${t.message}</p>
                </div>`}}},renderPagination(n,t){const e=document.getElementById("event-history-pagination");if(!e)return;if(t<=1){e.innerHTML="";return}const o=ie,i=(o-1)*gt+1,s=Math.min(o*gt,n),a=[],r=2;let l=Math.max(1,o-r),d=Math.min(t,o+r);l>1&&(a.push('<button class="eh-page-btn" data-page="1">1</button>'),l>2&&a.push('<span class="eh-page-ellipsis">…</span>'));for(let u=l;u<=d;u++)a.push(`<button class="eh-page-btn${u===o?" active":""}" data-page="${u}">${u}</button>`);d<t&&(d<t-1&&a.push('<span class="eh-page-ellipsis">…</span>'),a.push(`<button class="eh-page-btn" data-page="${t}">${t}</button>`)),e.innerHTML=`
            <div class="eh-pagination">
                <span class="eh-page-info">Exibindo <strong>${i}–${s}</strong> de <strong>${n}</strong> eventos</span>
                <div class="eh-page-controls">
                    <button class="eh-page-btn eh-page-nav" data-page="${o-1}" ${o<=1?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    ${a.join("")}
                    <button class="eh-page-btn eh-page-nav" data-page="${o+1}" ${o>=t?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>`,e.querySelectorAll(".eh-page-btn[data-page]").forEach(u=>{u.addEventListener("click",()=>{const g=parseInt(u.dataset.page,10);if(!isNaN(g)&&g>=1&&g<=t&&g!==ie){ie=g,this.fetchAndRenderEventHistory();const p=document.getElementById("monitoring-events-grid");p&&p.scrollIntoView({behavior:"smooth",block:"start"})}})})},renderEvents(n){const t=document.getElementById("monitoring-events-grid");if(!t)return;t.style.display="flex",t.style.flexDirection="column",t.style.gap="0";const e=n||[];if(e.length===0){t.innerHTML=`
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
                </div>`;return}const o={};e.forEach(s=>{const a=s.created_at?new Date(s.created_at).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"Data desconhecida";o[a]||(o[a]=[]),o[a].push(s)});const i=Object.entries(o).map(([s,a])=>{const r=a.map(l=>{const d=l.severity||"info";let u="Info",g="#3b82f6",p="rgba(59,130,246,0.12)",f="#93c5fd",m="rgba(59,130,246,0.3)",h="#3b82f6";d==="critical"?(u="Crítico",g="#ef4444",h="#ef4444",p="rgba(239,68,68,0.12)",f="#fca5a5",m="rgba(239,68,68,0.3)"):d==="warning"?(u="Alerta",g="#f59e0b",h="#f59e0b",p="rgba(245,158,11,0.12)",f="#fde047",m="rgba(245,158,11,0.3)"):d==="success"&&(u="Ok",g="#10b981",h="#10b981",p="rgba(16,185,129,0.12)",f="#6ee7b7",m="rgba(16,185,129,0.3)");const v=l.created_at?new Date(l.created_at):null,I=v?v.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"-",B=v?this._relativeTime(v):"",E=l.value_pct!=null?`${l.value_pct}%`:null;return`
                    <div class="event-history-row" style="border-left: 3px solid ${h};">
                        <div class="event-history-row-left">
                            <span class="monitor-dot" style="background: ${g}; flex-shrink: 0;"></span>
                            <div class="event-history-row-info">
                                <span class="event-history-row-title">${l.title}</span>
                                ${l.description?`<span class="event-history-row-desc">${l.description}</span>`:""}
                            </div>
                        </div>
                        <div class="event-history-row-meta">
                            ${E?`<span class="event-history-row-value">${E}</span>`:""}
                            <span class="monitor-badge" style="background:${p}; color:${f}; border-color:${m}; flex-shrink: 0;">${u}</span>
                            <div class="event-history-row-time">
                                <span class="event-time-clock">${I}</span>
                                ${B?`<span class="event-time-rel">${B}</span>`:""}
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
                </div>`}).join("");t.innerHTML=`<div class="event-history-list">${i}</div>`},_relativeTime(n){const e=new Date-n,o=Math.floor(e/6e4),i=Math.floor(o/60),s=Math.floor(i/24);return e<6e4?"agora mesmo":o<60?`${o}min atrás`:i<24?`${i}h atrás`:s===1?"ontem":`${s} dias atrás`},updateKPIs(n,t){const e=n-t,o=document.getElementById("monitor-kpi-total"),i=document.getElementById("monitor-kpi-warning"),s=document.getElementById("monitor-kpi-info");o&&(o.textContent=n),i&&(i.textContent=t),s&&(s.textContent=e)},async fetchDiagnostics(){try{const[n,t,e,o,i,s,a]=await Promise.all([k.get("/monitoring/diagnostico?t="+Date.now()),k.get("/monitoring/apis-status?t="+Date.now()),k.get("/monitoring/switches?t="+Date.now()),k.get("/monitoring/routers?t="+Date.now()),k.get("/monitoring/nas?t="+Date.now()),k.get("/monitoring/cameras?t="+Date.now()),k.get("/monitoring/servers?t="+Date.now())]),r=n&&n.status==="online";if(this.updateGnewApiStatus(r,r?"Gnew Online":"Gnew Offline (Contingência)",n?n.message:""),n&&n.data)R=n.data,this.renderGnewDiagnostics();else throw new Error("Dados inválidos na resposta da API.");t&&t.success&&Array.isArray(t.apis)&&(ht=t.apis),e&&e.success&&Array.isArray(e.switches)&&(Pt=e.switches),o&&o.success&&Array.isArray(o.routers)&&(zt=o.routers),i&&i.success&&Array.isArray(i.nas)&&(Nt=i.nas),s&&s.success&&Array.isArray(s.cameras)&&(Ft=s.cameras),a&&a.success&&Array.isArray(a.servers)&&(ae=a.servers),G==="alerts"&&this.renderGnewServicesStatus()}catch(n){console.error("Erro ao buscar dados de monitoramento:",n),this.updateGnewApiStatus(!1,"Erro de Conexão",n.message)}},updateGnewApiStatus(n,t,e){const o=document.getElementById("gnew-api-status-badge"),i=document.getElementById("gnew-api-message");if(o){o.className=`api-status-badge ${n?"online":"offline"}`,o.style.background=n?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",o.style.color=n?"#6ee7b7":"#fca5a5",o.style.borderColor=n?"#10b981":"#ef4444";const s=o.querySelector(".status-text");s&&(s.textContent=t)}i&&e&&(i.textContent=e)},parseMemoryOutput(n){try{const e=n.split(`
`).find(o=>o.trim().startsWith("Mem:"));if(e){const o=e.trim().split(/\s+/);if(o.length>=3){const i=o[1],s=o[2],a=d=>{const u=parseFloat(d);return d.toLowerCase().includes("g")?u*1024:d.toLowerCase().includes("m")?u:d.toLowerCase().includes("k")?u/1024:u},r=a(i),l=a(s);if(!isNaN(r)&&!isNaN(l)&&r>0)return{percentage:Math.round(l/r*100),detail:`${s} em uso de ${i} total`}}}}catch(t){console.warn("Erro ao fazer parse da memória:",t)}return{percentage:0,detail:"Erro no parse"}},parseDiskOutput(n){try{const e=n.split(`
`).find(o=>o.trim().endsWith(" /"));if(e){const o=e.trim().split(/\s+/);if(o.length>=5){const i=o[1],s=o[2],a=o[4].replace("%",""),r=parseInt(a,10);if(!isNaN(r))return{percentage:r,detail:`${s} em uso de ${i} (Montagem em /)`}}}}catch(t){console.warn("Erro ao fazer parse do disco:",t)}return{percentage:0,detail:"Erro no parse"}},renderGnewDiagnostics(){if(!R)return;if(R.memoria){let e={percentage:0,detail:"Dados de memória indisponíveis"};if(R.memoria.output)e=this.parseMemoryOutput(R.memoria.output);else if(typeof R.memoria.percent<"u"){const a=(R.memoria.total_mb/1024).toFixed(1),r=(R.memoria.used_mb/1024).toFixed(1);e={percentage:Math.round(R.memoria.percent),detail:`${r}GB em uso de ${a}GB total`}}const o=document.getElementById("gnew-kpi-mem-text"),i=document.getElementById("gnew-kpi-mem-bar"),s=document.getElementById("gnew-kpi-mem-detail");o&&(o.textContent=`${e.percentage}%`),i&&(i.style.width=`${e.percentage}%`),s&&(s.textContent=e.detail)}if(R.disco){let e={percentage:0,detail:"Dados de disco indisponíveis"};if(R.disco.output)e=this.parseDiskOutput(R.disco.output);else if(Array.isArray(R.disco)){const a=R.disco.find(r=>r.mountpoint==="/");a&&(e={percentage:Math.round(a.percent),detail:`${a.used_gb.toFixed(1)}GB em uso de ${a.total_gb.toFixed(1)}GB (Montagem em /)`})}const o=document.getElementById("gnew-kpi-disk-text"),i=document.getElementById("gnew-kpi-disk-bar"),s=document.getElementById("gnew-kpi-disk-detail");o&&(o.textContent=`${e.percentage}%`),i&&(i.style.width=`${e.percentage}%`),s&&(s.textContent=e.detail)}const n=document.getElementById("gnew-disk-table-body");if(n){let e=[];if(R.disco)if(R.disco.output)try{const o=R.disco.output.trim().split(`
`);for(let i=1;i<o.length;i++){const s=o[i].trim().split(/\s+/);s.length>=6&&e.push({mountpoint:s[5],total:s[1],used:s[2],free:s[3],percent:parseInt(s[4].replace("%",""),10)||0})}}catch(o){console.warn("Erro ao fazer parse da tabela de disco offline:",o)}else Array.isArray(R.disco)&&(e=R.disco.map(o=>({mountpoint:o.mountpoint,total:typeof o.total_gb=="number"?`${o.total_gb.toFixed(2)} GB`:o.total_gb||"0 GB",used:typeof o.used_gb=="number"?`${o.used_gb.toFixed(2)} GB`:o.used_gb||"0 GB",free:typeof o.free_gb=="number"?`${o.free_gb.toFixed(2)} GB`:o.free_gb||"0 GB",percent:typeof o.percent=="number"?Math.round(o.percent):parseInt(o.percent,10)||0})));e.length>0?n.innerHTML=e.map(o=>{const i=o.percent;return`
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                            <td style="padding: 12px; font-weight: 500; color: var(--text-main); font-family: monospace;">${o.mountpoint}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${o.total}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${o.used}</td>
                            <td style="padding: 12px; text-align: right; color: var(--text-muted); font-family: monospace;">${o.free}</td>
                            <td style="padding: 12px; text-align: right; font-family: monospace;">
                                <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;">
                                    <div style="width: 100px; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; border: 1px solid var(--glass-border); flex-shrink: 0;">
                                        <div style="width: ${i}%; height: 100%; background: #2563eb; border-radius: 3px;"></div>
                                    </div>
                                    <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-main); min-width: 40px; text-align: right;">${i}%</span>
                                </div>
                            </td>
                        </tr>
                    `}).join(""):n.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                            Nenhum ponto de montagem de disco encontrado.
                        </td>
                    </tr>
                `}if(R.servicos&&R.servicos.timestamp)try{const o=new Date(R.servicos.timestamp).toLocaleString("pt-BR"),i=document.getElementById("gnew-services-timestamp");i&&(i.textContent=`Última verificação: ${o}`)}catch(e){console.warn("Erro ao formatar timestamp dos serviços:",e)}const t=document.getElementById("gnew-services-list");if(t){let e=[];R.servicos&&Array.isArray(R.servicos.servicos)&&(e=R.servicos.servicos),e.length>0?(t.innerHTML=e.map(i=>{const s=i.status==="active"||i.status_label==="ativo",a=s?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",r=s?"#6ee7b7":"#fca5a5",l=s?"#10b981":"#ef4444",d=s?"#10b981":"#ef4444";return`
                        <div class="service-card" style="border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; background: rgba(255, 255, 255, 0.01); display: flex; flex-direction: column; overflow: hidden; transition: all 0.2s;">
                            <!-- Service Info Row -->
                            <div class="service-header-row" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; user-select: none; transition: background 0.2s;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <!-- Chevron arrow -->
                                    <svg class="service-chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" style="transition: transform 0.2s ease; transform: rotate(0deg); color: var(--text-muted); flex-shrink: 0;">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                    <span style="font-weight: 500; font-size: 0.9rem; color: var(--text-main); font-family: monospace;">${i.nome}</span>
                                </div>
                                <!-- Status Badge -->
                                <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid ${l}; background: ${a}; color: ${r};">
                                    <span style="width: 6px; height: 6px; border-radius: 50%; background-color: ${d};"></span>
                                    <span>${i.status_label||i.status}</span>
                                </div>
                            </div>
                            <!-- Log Area (Collapsible) -->
                            <div class="service-log-content" style="max-height: 0; overflow: hidden; transition: all 0.3s ease-in-out; background: rgba(0, 0, 0, 0.2); border-top: 1px solid transparent;">
                                <pre style="margin: 0; padding: 12px; font-family: monospace; font-size: 0.75rem; color: #a3a3a3; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${i.log||"Sem logs de sistema disponíveis."}</pre>
                            </div>
                        </div>
                    `}).join(""),t.querySelectorAll(".service-header-row").forEach(i=>{i.addEventListener("click",()=>{const s=i.closest(".service-card"),a=s.querySelector(".service-log-content"),r=s.querySelector(".service-chevron");a.style.maxHeight==="300px"?(a.style.maxHeight="0px",a.style.borderTopColor="transparent",r.style.transform="rotate(0deg)"):(a.style.maxHeight="300px",a.style.borderTopColor="rgba(255, 255, 255, 0.05)",r.style.transform="rotate(90deg)")})})):t.innerHTML=`
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                        Nenhum serviço encontrado no servidor.
                    </div>
                `}if(R.ipExterno){const e=document.getElementById("gnew-kpi-ip-text");e&&(e.textContent=R.ipExterno.ip||"Não detectado")}},async clearEventHistoryByPeriod(){const n=document.getElementById("btn-clear-event-history"),t=prompt(`Limpar histórico de eventos por período:

Digite a quantidade de dias que deseja MANTER no histórico (ex: 7, 30, 90, 365).
Todos os eventos mais antigos que esse período serão apagados permanentemente do banco.

Quantidade de dias a MANTER:`,"30");if(t===null)return;const e=parseInt(t.trim(),10);if(isNaN(e)||e<0){alert("Por favor, digite um número inteiro de dias válido (ex: 30).");return}try{n&&(n.disabled=!0,n.textContent="Limpando..."),await fetch(`/api/monitoring/events?days=${e}`,{method:"DELETE"}),await this.fetchAndRenderEventHistory(),alert(`Limpeza realizada! Eventos com mais de ${e} dias foram excluídos.`)}catch(o){console.error("Erro ao limpar histórico por período:",o),alert("Erro ao limpar o histórico. Tente novamente.")}finally{n&&(n.disabled=!1,n.textContent="Limpar Histórico")}},async clearEventHistory(){const n=document.getElementById("btn-delete-all-event-history");if(confirm("Tem certeza que deseja apagar permanentemente todo o histórico de eventos? Esta ação não pode ser desfeita."))try{n&&(n.disabled=!0,n.textContent="Apagando..."),await fetch("/api/monitoring/events",{method:"DELETE"}),await this.fetchAndRenderEventHistory();const t=document.getElementById("event-history-count");t&&(t.style.display="none")}catch(t){console.error("Erro ao apagar histórico:",t),alert("Erro ao apagar o histórico. Tente novamente.")}finally{n&&(n.disabled=!1,n.textContent="Apagar Tudo")}},async fetchAndRenderApisStatus(){const n=document.getElementById("monitoring-apis-grid");if(!n)return;n.innerHTML=`
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 12px; color: var(--text-muted);">
                <div class="api-loading-spinner" style="width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="font-size: 0.9rem;">Verificando integridade das APIs...</span>
            </div>
        `;const t=document.getElementById("btn-refresh-apis-status");let e=null;t&&(e=t.querySelector("svg"),t.disabled=!0,t.style.opacity="0.6",t.style.cursor="not-allowed",e&&(e.style.animation="spin 0.8s linear infinite"));try{const o=await k.get("/monitoring/apis-status?refresh=true&t="+Date.now());if(o&&o.success&&Array.isArray(o.apis))ht=o.apis,G==="alerts"&&this.renderGnewServicesStatus(),this.renderApisGrid(o.apis);else throw new Error("Resposta inválida do servidor.")}catch(o){console.error("Erro ao buscar status das APIs:",o),n.innerHTML=`
                <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                    <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status das APIs</p>
                    <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${o.message}</p>
                </div>
            `}finally{t&&(t.disabled=!1,t.style.opacity="",t.style.cursor="pointer",e&&(e.style.animation=""))}},renderApisGrid(n){const t=document.getElementById("monitoring-apis-grid");if(t){if(n.length===0){t.innerHTML=`
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted);">
                    Nenhuma API cadastrada.
                </div>
            `;return}t.innerHTML=n.map(e=>{let o="online",i="rgba(16, 185, 129, 0.1)",s="#6ee7b7",a="#10b981",r="Online";e.status==="warning"?(o="warning",i="rgba(245, 158, 11, 0.1)",s="#fde047",a="#f59e0b",r="Alerta"):(e.status==="offline"||!e.online)&&(o="offline",i="rgba(239, 68, 68, 0.1)",s="#fca5a5",a="#ef4444",r="Offline");const l=e.latency<500?"#6ee7b7":e.latency<2e3?"#fde047":"#fca5a5";return`
                <div class="api-status-card glass" data-api-id="${e.id}">
                    <div class="api-card-header">
                        <div class="api-info-meta">
                            <span class="api-type-tag">${e.type}</span>
                            <h4 class="api-name">${e.name}</h4>
                        </div>
                        <span class="api-badge ${o}" style="background: ${i}; color: ${s}; border: 1px solid ${a};">
                            <span class="status-dot"></span>
                            ${r}
                        </span>
                    </div>
                    <div class="api-card-body">
                        <p class="api-desc">${e.description}</p>
                        <div class="api-url-wrapper">
                            <span class="api-url-label">Endpoint:</span>
                            <code class="api-url-code" title="${e.url}">${e.url}</code>
                        </div>
                    </div>
                    <div class="api-card-footer">
                        <div class="api-stat">
                            <span class="stat-label">Latência:</span>
                            <span class="stat-value" style="color: ${l}">${e.latency}ms</span>
                        </div>
                        <div class="api-stat" style="max-width: 60%;">
                            <span class="stat-label">Detalhe:</span>
                            <span class="stat-value detail-value" title="${e.message||"-"}">${e.message||"-"}</span>
                        </div>
                    </div>
                </div>
            `}).join("")}},async fetchAndRenderNetworkStatus(n=!1){const t=document.getElementById("btn-refresh-network-status");let e=null;t&&(e=t.querySelector("svg"),t.disabled=!0,t.style.opacity="0.6",t.style.cursor="not-allowed",e&&(e.style.animation="spin 0.8s linear infinite"));try{const o=`/monitoring/pfsense${n?"?refresh=true":""}`,i=await k.get(o);if(i&&i.success&&i.data){const s=i.data,a=document.getElementById("network-source-badge"),r=document.getElementById("network-simulation-badge");r&&(s.isSimulated?(a&&(a.style.display="none"),s.isSimulated==="mock"?(r.style.display="inline-block",r.textContent="⚠️ Modo Simulação (PFSENSE_MOCK=true)",r.style.background="rgba(245, 158, 11, 0.12)",r.style.color="#fde047",r.style.border="1px solid rgba(245, 158, 11, 0.3)"):(r.style.display="inline-block",r.textContent="🔴 pfSense Inacessível — Dados Estimados",r.style.background="rgba(239, 68, 68, 0.10)",r.style.color="#fca5a5",r.style.border="1px solid rgba(239, 68, 68, 0.25)")):(r.style.display="none",a&&(a.style.display="inline-block",a.textContent="🛡️ pfSense API",a.style.background="rgba(16, 185, 129, 0.1)",a.style.color="#6ee7b7",a.style.border="1px solid rgba(16, 185, 129, 0.25)")));const l=document.getElementById("network-kpi-cpu-text"),d=document.getElementById("network-kpi-cpu-bar"),u=document.getElementById("network-kpi-load-average");l&&(l.textContent=`${s.cpu_usage}%`),d&&(d.style.width=`${s.cpu_usage}%`),u&&(u.textContent=`Load Average: ${s.load_average}`);const g=document.getElementById("network-kpi-mem-text"),p=document.getElementById("network-kpi-mem-bar");g&&(g.textContent=`${s.memory_usage}%`),p&&(p.style.width=`${s.memory_usage}%`);const f=document.getElementById("network-kpi-uptime-text");f&&(f.textContent=s.uptime||"Desconhecido");const m=document.getElementById("network-kpi-main-cable"),h=document.getElementById("network-kpi-main-wifi");m&&(m.textContent=s.main_cable_link||"Sem Conexão"),h&&(h.textContent=s.main_wifi_link||"Sem Conexão"),this.renderNetworkGateways(s.gateways),this.renderNetworkInterfaces(s.interfaces),this.renderNetworkDns(s.dns_servers)}else throw new Error(i.error||"Falha ao processar dados do pfSense.")}catch(o){console.error("Erro ao buscar status da rede pfSense:",o);const i=document.getElementById("network-source-badge");i&&(i.style.display="none");const s=document.getElementById("network-simulation-badge");s&&(s.style.display="inline-block",s.textContent="🔴 pfSense Inacessível — Sem Conexão",s.style.background="rgba(239, 68, 68, 0.10)",s.style.color="#fca5a5",s.style.border="1px solid rgba(239, 68, 68, 0.25)");const a=document.getElementById("network-kpi-cpu-text"),r=document.getElementById("network-kpi-cpu-bar"),l=document.getElementById("network-kpi-load-average");a&&(a.textContent="Erro"),r&&(r.style.width="0%"),l&&(l.textContent="Falha na conexão");const d=document.getElementById("network-kpi-mem-text"),u=document.getElementById("network-kpi-mem-bar");d&&(d.textContent="Erro"),u&&(u.style.width="0%");const g=document.getElementById("network-kpi-uptime-text");g&&(g.textContent="Indisponível (Sem conexão)");const p=document.getElementById("network-gateways-container");p&&(p.innerHTML=`
                    <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                        <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status dos Gateways</p>
                        <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${o.message}</p>
                    </div>
                `);const f=document.getElementById("network-interfaces-tbody");f&&(f.innerHTML=`
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 2rem; color: #fca5a5;">
                            Erro ao carregar interfaces: ${o.message}
                        </td>
                    </tr>
                `);const m=document.getElementById("network-dns-container");m&&(m.innerHTML=`
                    <div style="color: #fca5a5; font-size: 0.85rem; text-align: center; padding: 1rem;">
                        Erro ao carregar DNS
                    </div>
                `)}finally{t&&(t.disabled=!1,t.style.opacity="",t.style.cursor="pointer",e&&(e.style.animation=""))}},renderNetworkGateways(n){const t=document.getElementById("network-gateways-container");if(t){if(!n||n.length===0){t.innerHTML=`
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic; background: var(--card-bg); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    Nenhum gateway detectado.
                </div>
            `;return}t.innerHTML=n.map(e=>{let o="online",i="#10b981",s="background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border: 1px solid #10b981;";const a=e.status.toLowerCase().includes("online");e.status.toLowerCase().includes("warning")||e.status.toLowerCase().includes("loss")||e.status.toLowerCase().includes("high")?(o="warning",i="#f59e0b",s="background: rgba(245, 158, 11, 0.1); color: #fde047; border: 1px solid #f59e0b;"):a||(o="offline",i="#ef4444",s="background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid #ef4444;");const l=parseFloat(e.loss)||0,d=l>5?"#fca5a5":l>0?"#fde047":"var(--text-main)";return`
                <div class="kpi-card" style="display: flex; flex-direction: column; gap: 12px; padding: 1.25rem; border-left: 4px solid ${i}; position: relative; background: var(--card-bg); border-radius: var(--border-radius); border-top: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${e.name}</span>
                        <span class="api-badge ${o}" style="${s} display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            <span class="status-dot"></span>
                            ${e.status}
                        </span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">IP: ${e.ip}</div>
                    <div style="display: flex; gap: 15px; margin-top: 5px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.02); border-radius: 6px; padding: 8px; border: 1px solid rgba(255,255,255,0.04);">
                            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Latência (RTT)</div>
                            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); font-family: monospace;">${e.rtt}</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.02); border-radius: 6px; padding: 8px; border: 1px solid rgba(255,255,255,0.04);">
                            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Perda</div>
                            <div style="font-size: 0.95rem; font-weight: 700; color: ${d}; font-family: monospace;">${e.loss}</div>
                        </div>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); text-align: right; margin-top: 2px;">RTTsd: ${e.rttsd}</div>
                </div>
            `}).join("")}},renderNetworkInterfaces(n){const t=document.getElementById("network-interfaces-tbody");if(t){if(!n||n.length===0){t.innerHTML=`
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                        Nenhuma interface de rede detectada.
                    </td>
                </tr>
            `;return}t.innerHTML=n.map(e=>{const o=e.status==="up",i=o?"online":"offline",s=o?"background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border: 1px solid #10b981;":"background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid #ef4444;",a=o?"UP":"DOWN";return`
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${e.name} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; font-family: monospace;">(${e.interface})</span></td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${e.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.speed}</td>
                    <td style="padding: 12px; text-align: right;">
                        <span class="api-badge ${i}" style="${s} display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            <span class="status-dot"></span>
                            ${a}
                        </span>
                    </td>
                </tr>
            `}).join("")}},renderNetworkDns(n){const t=document.getElementById("network-dns-container");if(t){if(!n||n.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 1rem; color: var(--text-muted); font-style: italic;">
                    Nenhum servidor DNS listado.
                </div>
            `;return}t.innerHTML=n.map(e=>`
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent); flex-shrink: 0;">
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="2" x2="12" y2="22"></line>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                    </svg>
                    <span style="font-family: monospace; font-size: 0.9rem; color: var(--text-main); font-weight: 600;">${e}</span>
                </div>
            `).join("")}},async fetchAndRenderSwitchesStatus(n=!1,t=!1){const e=document.getElementById("switches-auto-refresh"),o=t||e&&e.checked,i=document.getElementById("monitoring-switches-tbody");if(!i)return;const s=document.getElementById("btn-refresh-switches-status");let a=null;s&&(a=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",a&&(a.style.animation="spin 0.8s linear infinite"));try{if(o){const r=await k.get(`/monitoring/switches?ping=false&refresh=${n}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.switches)){this.renderSwitchesTable(r.switches),r.switches.forEach(l=>{const d=document.getElementById(`switch-row-${l.id}`);if(d){const u=d.querySelector(".switch-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ie=!0;for(const l of r.switches){if(G!=="infra")break;const d=document.getElementById(`switch-row-${l.id}`);if(d){const u=d.querySelector(".switch-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const u=await k.get(`/monitoring/switches/${l.id}/ping?t=${Date.now()}`);if(u&&u.success&&u.switch){const g=u.switch,p=document.getElementById(`switch-row-${g.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",m="#6ee7b7",h="rgba(16, 185, 129, 0.3)",v="Online";g.online||(f="rgba(239, 68, 68, 0.12)",m="#fca5a5",h="rgba(239, 68, 68, 0.3)",v="Offline");const I=g.latency<50?"#6ee7b7":g.latency<150?"#fde047":"#fca5a5",B=g.online?`${g.latency}ms`:"-",E=p.querySelector(".monitor-badge");E&&(E.style.background=f,E.style.color=m,E.style.borderColor=h,E.textContent=v);const w=p.querySelector(".switch-latency");w&&(w.style.color=I,w.textContent=B);const $=p.querySelector(".switch-sync-indicator");$&&($.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{$.querySelector("polyline")&&($.innerHTML="")},3e3))}}}catch(u){console.error(`Erro ao pingar switch ${l.name}:`,u);const g=document.getElementById(`switch-row-${l.id}`);if(g){const p=g.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=g.querySelector(".switch-sync-indicator");f&&(f.innerHTML="")}}}Ie=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/switches?refresh=${n}&t=${Date.now()}`,l=await k.get(r);if(l&&l.success&&Array.isArray(l.switches))this.renderSwitchesTable(l.switches);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos switches:",r),i.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos switches</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",a&&(a.style.animation=""))}},renderSwitchesTable(n){const t=document.getElementById("monitoring-switches-tbody");if(t){if(n.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum switch encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=n.map(e=>{let o="rgba(16, 185, 129, 0.12)",i="#6ee7b7",s="rgba(16, 185, 129, 0.3)",a="Online";e.online===null?(o="rgba(255, 255, 255, 0.05)",i="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",a="Aguardando..."):e.online||(o="rgba(239, 68, 68, 0.12)",i="#fca5a5",s="rgba(239, 68, 68, 0.3)",a="Offline");const r=e.online?e.latency<50?"#6ee7b7":e.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=e.online?`${e.latency}ms`:"-";return`
                <tr id="switch-row-${e.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${e.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">
                        ${e.ip}
                        <span title="Dados cadastrais importados do Lansweeper" style="background: rgba(59, 130, 246, 0.08); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.2); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; margin-left: 6px; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📦 Lansweeper</span>
                    </td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.model||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${i}; border-color:${s};">${a}</span>
                            <span title="Status verificado via Ping ICMP Real" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📡 Ping ICMP</span>
                            <span class="switch-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="switch-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join("")}},async fetchAndRenderRoutersStatus(n=!1,t=!1){console.log("📊 [MONITORING] fetchAndRenderRoutersStatus called. forceRefresh:",n,"sequential:",t);const e=document.getElementById("routers-auto-refresh"),o=t||e&&e.checked,i=document.getElementById("monitoring-routers-tbody");if(!i){console.error("📊 [MONITORING] Element #monitoring-routers-tbody not found in DOM!");return}const s=document.getElementById("btn-refresh-routers-status");let a=null;s&&(a=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",a&&(a.style.animation="spin 0.8s linear infinite"));try{if(console.log("📊 [MONITORING] Fetching routers, sequential mode:",o),o){const r=await k.get(`/monitoring/routers?ping=false&refresh=${n}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.routers)){this.renderRoutersTable(r.routers),r.routers.forEach(l=>{const d=document.getElementById(`router-row-${l.id}`);if(d){const u=d.querySelector(".router-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ie=!0;for(const l of r.routers){if(G!=="infra"||ne!=="routers")break;const d=document.getElementById(`router-row-${l.id}`);if(d){const u=d.querySelector(".router-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const u=await k.get(`/monitoring/routers/${l.id}/ping?t=${Date.now()}`);if(u&&u.success&&u.router){const g=u.router,p=document.getElementById(`router-row-${g.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",m="#6ee7b7",h="rgba(16, 185, 129, 0.3)",v="Online";g.online||(f="rgba(239, 68, 68, 0.12)",m="#fca5a5",h="rgba(239, 68, 68, 0.3)",v="Offline");const I=g.latency<50?"#6ee7b7":g.latency<150?"#fde047":"#fca5a5",B=g.online?`${g.latency}ms`:"-",E=p.querySelector(".monitor-badge");E&&(E.style.background=f,E.style.color=m,E.style.borderColor=h,E.textContent=v);const w=p.querySelector(".router-latency");w&&(w.style.color=I,w.textContent=B);const $=p.querySelector(".router-sync-indicator");$&&($.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{$.querySelector("polyline")&&($.innerHTML="")},3e3))}}}catch(u){console.error(`Erro ao pingar roteador ${l.name}:`,u);const g=document.getElementById(`router-row-${l.id}`);if(g){const p=g.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=g.querySelector(".router-sync-indicator");f&&(f.innerHTML="")}}}Ie=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/routers?refresh=${n}&t=${Date.now()}`,l=await k.get(r);if(l&&l.success&&Array.isArray(l.routers))this.renderRoutersTable(l.routers);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos roteadores:",r),i.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos roteadores</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",a&&(a.style.animation=""))}},renderRoutersTable(n){const t=document.getElementById("monitoring-routers-tbody");if(t){if(n.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum roteador encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=n.map(e=>{let o="rgba(16, 185, 129, 0.12)",i="#6ee7b7",s="rgba(16, 185, 129, 0.3)",a="Online";e.online===null?(o="rgba(255, 255, 255, 0.05)",i="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",a="Aguardando..."):e.online||(o="rgba(239, 68, 68, 0.12)",i="#fca5a5",s="rgba(239, 68, 68, 0.3)",a="Offline");const r=e.online?e.latency<50?"#6ee7b7":e.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=e.online?`${e.latency}ms`:"-";return`
                <tr id="router-row-${e.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${e.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">
                        ${e.ip}
                        <span title="Dados cadastrais importados do Lansweeper" style="background: rgba(59, 130, 246, 0.08); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.2); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; margin-left: 6px; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📦 Lansweeper</span>
                    </td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.model||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${i}; border-color:${s};">${a}</span>
                            <span title="Status verificado via Ping ICMP Real" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📡 Ping ICMP</span>
                            <span class="router-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="router-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join("")}},async fetchAndRenderNasStatus(n=!1,t=!1){console.log("📊 [MONITORING] fetchAndRenderNasStatus called. forceRefresh:",n,"sequential:",t);const e=document.getElementById("nas-auto-refresh"),o=t||e&&e.checked,i=document.getElementById("monitoring-nas-tbody");if(!i){console.error("📊 [MONITORING] Element #monitoring-nas-tbody not found in DOM!");return}const s=document.getElementById("btn-refresh-nas-status");let a=null;s&&(a=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",a&&(a.style.animation="spin 0.8s linear infinite"));try{if(console.log("📊 [MONITORING] Fetching NAS devices, sequential mode:",o),o){const r=await k.get(`/monitoring/nas?ping=false&refresh=${n}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.nas)){this.renderNasTable(r.nas),r.nas.forEach(l=>{const d=document.getElementById(`nas-row-${l.id}`);if(d){const u=d.querySelector(".nas-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ie=!0;for(const l of r.nas){if(G!=="infra"||ne!=="nas")break;const d=document.getElementById(`nas-row-${l.id}`);if(d){const u=d.querySelector(".nas-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const u=await k.get(`/monitoring/nas/${l.id}/ping?t=${Date.now()}`);if(u&&u.success&&u.nas){const g=u.nas,p=document.getElementById(`nas-row-${g.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",m="#6ee7b7",h="rgba(16, 185, 129, 0.3)",v="Online";g.online||(f="rgba(239, 68, 68, 0.12)",m="#fca5a5",h="rgba(239, 68, 68, 0.3)",v="Offline");const I=g.latency<50?"#6ee7b7":g.latency<150?"#fde047":"#fca5a5",B=g.online?`${g.latency}ms`:"-",E=p.querySelector(".monitor-badge");E&&(E.style.background=f,E.style.color=m,E.style.borderColor=h,E.textContent=v);const w=p.querySelector(".nas-latency");w&&(w.style.color=I,w.textContent=B);const $=p.querySelector(".nas-sync-indicator");$&&($.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{$.querySelector("polyline")&&($.innerHTML="")},3e3))}}}catch(u){console.error(`Erro ao pingar NAS ${l.name}:`,u);const g=document.getElementById(`nas-row-${l.id}`);if(g){const p=g.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=g.querySelector(".nas-sync-indicator");f&&(f.innerHTML="")}}}Ie=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/nas?refresh=${n}&t=${Date.now()}`,l=await k.get(r);if(l&&l.success&&Array.isArray(l.nas))this.renderNasTable(l.nas);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos dispositivos NAS:",r),i.innerHTML=`
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos dispositivos NAS</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",a&&(a.style.animation=""))}},renderNasTable(n){const t=document.getElementById("monitoring-nas-tbody");if(t){if(n.length===0){t.innerHTML=`
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum dispositivo NAS encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=n.map(e=>{let o="rgba(16, 185, 129, 0.12)",i="#6ee7b7",s="rgba(16, 185, 129, 0.3)",a="Online";e.online===null?(o="rgba(255, 255, 255, 0.05)",i="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",a="Aguardando..."):e.online||(o="rgba(239, 68, 68, 0.12)",i="#fca5a5",s="rgba(239, 68, 68, 0.3)",a="Offline");const r=e.online?e.latency<50?"#6ee7b7":e.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=e.online?`${e.latency}ms`:"-";return`
                <tr id="nas-row-${e.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s; cursor: pointer;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${e.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">
                        ${e.ip}
                        <span title="Dados cadastrais importados do Lansweeper" style="background: rgba(59, 130, 246, 0.08); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.2); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; margin-left: 6px; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📦 Lansweeper</span>
                    </td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.manufacturer||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.model||"-"}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted); font-size: 0.8rem;">${e.mac||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${e.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${i}; border-color:${s};">${a}</span>
                            <span title="Status verificado via Ping ICMP Real" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1px 5px; border-radius: 4px; font-size: 0.6rem; font-weight: 500; font-family: sans-serif; vertical-align: middle; display: inline-block; white-space: nowrap;">📡 Ping ICMP</span>
                            <span class="nas-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="nas-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join(""),n.forEach(e=>{const o=document.getElementById(`nas-row-${e.id}`);o&&o.addEventListener("click",i=>{i.target.closest("button")||i.target.closest("a")||i.target.closest("input")||this.toggleNasDetails(e.id)})})}},async toggleNasDetails(n){console.log("📊 [MONITORING] Toggling details for NAS ID:",n);const t=document.getElementById(`nas-details-row-${n}`);if(t){t.remove();return}document.querySelectorAll(".nas-details-row").forEach(s=>s.remove());const o=document.getElementById(`nas-row-${n}`);if(!o)return;const i=document.createElement("tr");i.id=`nas-details-row-${n}`,i.className="nas-details-row",i.innerHTML=`
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
        `,o.parentNode.insertBefore(i,o.nextSibling);try{const s=await k.get(`/monitoring/nas/${n}/storage?t=${Date.now()}`);if(s&&s.success&&s.storage){const a=s.storage,r=a.volume,l=a.dataSource||"estimated",d=l==="lansweeper"?'<span title="Dados reais via Lansweeper" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">🟢 Lansweeper</span>':l==="synology_dsm"?'<span title="Dados reais via Synology DSM API" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">🟢 Synology DSM</span>':l==="wd_nas_ssh"?'<span title="Dados reais via SSH (Apenas Leitura)" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">🟢 WD My Cloud</span>':'<span title="Dados estimados (não configurado)" style="display:inline-flex;align-items:center;gap:4px;background:rgba(245,158,11,0.08);color:#fde047;border:1px solid rgba(245,158,11,0.2);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;">⚡ Estimado</span>',u=Math.round(r.used_gb/r.total_gb*100),g=(r.total_gb/1e3).toFixed(1)+" TB",p=(r.used_gb/1e3).toFixed(1)+" TB",f=(r.free_gb/1e3).toFixed(1)+" TB",m=a.cpu_usage,h=a.ram_total_gb,v=a.ram_used_gb,I=a.ram_usage_pct,B=a.network_rx_kbs,E=a.network_tx_kbs,w=m!=null||I!=null;let $="";if(w){const b=m<60?"#10b981":m<85?"#f59e0b":"#ef4444",S=m<60?"#6ee7b7":m<85?"#fde047":"#fca5a5",_=I<60?"#10b981":I<85?"#f59e0b":"#ef4444",O=I<60?"#6ee7b7":I<85?"#fde047":"#fca5a5",U=D=>D==null?"0 KB/s":D>=1024?`${(D/1024).toFixed(1)} MB/s`:`${D} KB/s`;$=`
                        <!-- PERFORMANCE SECTION: CPU, RAM and Network Activity -->
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Desempenho em Tempo Real</span>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
                                
                                <!-- CPU Card -->
                                <div style="background: rgba(168, 85, 247, 0.04); border: 1px solid rgba(168, 85, 247, 0.12); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#a78bfa" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em;">CPU</span>
                                        </div>
                                        <span style="font-size: 0.85rem; font-weight: 700; color: ${S};">${m}%</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${m}%; height: 100%; background: ${b}; border-radius: 3px;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">Uso do Processador</span>
                                </div>

                                <!-- RAM Card -->
                                <div style="background: rgba(16, 185, 129, 0.04); border: 1px solid rgba(16, 185, 129, 0.12); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#6ee7b7" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #6ee7b7; text-transform: uppercase; letter-spacing: 0.05em;">Memória RAM</span>
                                        </div>
                                        <span style="font-size: 0.85rem; font-weight: 700; color: ${O};">${I}%</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255, 255, 255, 0.05); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${I}%; height: 100%; background: ${_}; border-radius: 3px;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">${v?`${v} GB`:"-"} de ${h?`${h} GB`:"-"} em uso</span>
                                </div>

                                <!-- Network Card -->
                                <div style="background: rgba(59, 130, 246, 0.04); border: 1px solid rgba(59, 130, 246, 0.12); border-radius: 8px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; gap: 7px;">
                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="#93c5fd" stroke-width="2" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                        <span style="font-size: 0.75rem; font-weight: 600; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em;">Atividade de Rede</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px; height: 16px;">
                                        <div style="display: flex; align-items: center; gap: 4px;">
                                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="#6ee7b7" stroke-width="2.5" fill="none" style="transform: rotate(45deg);"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                            <span style="font-size: 0.72rem; color: var(--text-muted);">Down:</span>
                                            <span style="font-size: 0.8rem; font-weight: 700; color: #6ee7b7; font-family: monospace;">${U(B)}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 4px;">
                                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="#fca5a5" stroke-width="2.5" fill="none" style="transform: rotate(225deg);"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                            <span style="font-size: 0.72rem; color: var(--text-muted);">Up:</span>
                                            <span style="font-size: 0.8rem; font-weight: 700; color: #fca5a5; font-family: monospace;">${U(E)}</span>
                                        </div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted);">Tráfego ativo de rede</span>
                                </div>

                            </div>
                        </div>
                    `}else $=`
                        <!-- PERFORMANCE SECTION: Indisponível -->
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Desempenho em Tempo Real</span>
                            <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
                                ⚠️ Métricas de CPU, RAM e Rede em tempo real não estão disponíveis para esta origem de dados.
                            </div>
                        </div>
                    `;const x=a.bays.map(b=>{const S=b.led==="green"?"#10b981":"#ef4444",_=b.led==="green"?"0 0 8px #10b981":"0 0 8px #ef4444";return`
                        <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                            <!-- HDD Icon with LED -->
                            <div style="position: relative; width: 32px; height: 44px; background: #2a2b2f; border: 2px solid #3d3e42; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 4px 2px; flex-shrink: 0;">
                                <div style="width: 5px; height: 5px; background: ${S}; border-radius: 50%; box-shadow: ${_};"></div>
                                <div style="display: flex; flex-direction: column; gap: 2px; width: 80%;">
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                </div>
                                <span style="font-size: 0.52rem; color: var(--text-muted); font-weight: 700; text-align: center;">BAY ${b.slot}</span>
                            </div>
                            <!-- HDD Details -->
                            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
                                <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.disk_model}">${b.disk_model}</span>
                                <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">S/N: ${b.serial}</span>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
                                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent);">${b.capacity}</span>
                                    <span style="font-size: 0.68rem; color: var(--text-muted); background: rgba(255,255,255,0.03); padding: 1px 4px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.05);">${b.temp}</span>
                                </div>
                            </div>
                        </div>
                    `}).join(""),A=a.shares.map(b=>{const S=Math.round(b.used_gb/b.total_gb*100),_=(b.total_gb/1e3).toFixed(1)+" TB",O=(b.used_gb/1e3).toFixed(1)+" TB";return`
                        <div class="nas-share-item" style="display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); font-size: 0.82rem; transition: background 0.2s;">
                            <!-- Folder Icon and Name -->
                            <div style="flex: 2; display: flex; align-items: center; gap: 12px; min-width: 0; padding-right: 10px;">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#f59e0b" stroke-width="2" fill="#f59e0b" fill-opacity="0.2" style="flex-shrink: 0;">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <div style="display: flex; flex-direction: column; min-width: 0;">
                                    <span style="font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${b.name}</span>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.description}">${b.description}</span>
                                </div>
                            </div>
                            
                            <!-- Path -->
                            <div style="flex: 3; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; word-break: break-all; padding-right: 15px;">
                                ${b.path}
                            </div>
                            
                            <!-- Usage -->
                            <div style="flex: 2; display: flex; flex-direction: column; gap: 4px; padding-right: 20px;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted);">
                                    <span>${O} / ${_}</span>
                                    <span>${S}%</span>
                                </div>
                                <div style="width: 100%; height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${S}%; height: 100%; background: #f59e0b; border-radius: 2px;"></div>
                                </div>
                            </div>
                            
                            <!-- Permissions -->
                            <div style="flex: 2; min-width: 0;">
                                <span style="background: rgba(245, 158, 11, 0.08); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.2); padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 500; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.user_group}">
                                    ${b.user_group}
                                </span>
                            </div>
                        </div>
                    `}).join("");i.innerHTML=`
                    <td colspan="8" style="padding: 24px 28px; background: rgba(255, 255, 255, 0.015); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                        <div style="display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.25s ease-out; text-align: left;">
                            
                            <!-- TOP: RAID and Volume Capacity Overview -->
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
                                <div style="display: flex; flex-direction: column; gap: 6px;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Volume de Armazenamento</span>
                                        ${d}
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span style="font-size: 1.3rem; font-weight: 700; color: var(--text-main);">${r.raid_level}</span>
                                        <span class="monitor-badge" style="background: rgba(16, 185, 129, 0.12); color: #6ee7b7; border-color: rgba(16, 185, 129, 0.3); padding: 2px 8px; font-size: 0.75rem;">Status: ${r.status}</span>
                                    </div>
                                    <span style="font-size: 0.8rem; color: var(--text-muted);">Sistema de arquivos: <strong style="color: var(--text-main); font-family: monospace;">${r.filesystem}</strong></span>
                                </div>
                                
                                <!-- Overall Space Gauge -->
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; min-width: 250px; flex-grow: 1; max-width: 400px;">
                                    <div style="display: flex; justify-content: space-between; width: 100%; font-size: 0.82rem;">
                                        <span style="color: var(--text-muted);">Espaço Utilizado: <strong style="color: var(--text-main);">${p}</strong></span>
                                        <span style="color: var(--text-muted);">Disponível: <strong style="color: var(--text-main);">${f}</strong></span>
                                    </div>
                                    <!-- Progress Bar -->
                                    <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); display: flex;">
                                        <div style="width: ${u}%; height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 4px;"></div>
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">Capacidade Total: <strong>${g}</strong> (Ocupação: ${u}%)</span>
                                </div>
                            </div>

                            <!-- REAL-TIME PERFORMANCE STATS -->
                            ${$}

                            <!-- MIDDLE: Physical Hard Drive Bays (WD Style) -->
                            <div style="display: flex; flex-direction: column; gap: 10px;">
                                <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Gavetas de Discos Físicos (Bays)</span>
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
                                    ${x}
                                </div>
                            </div>

                            <!-- BOTTOM: Shared Folders -->
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
                                        ${A}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </td>
                `}else throw new Error(s.error||s.message||"Dados inválidos recebidos do servidor.")}catch(s){console.error("Erro ao expandir NAS storage:",s),i.innerHTML=`
                <td colspan="8" style="padding: 16px; text-align: center; color: #fca5a5; background: rgba(239, 68, 68, 0.07); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    Erro ao carregar detalhes de storage: ${s.message}
                </td>
            `}},async fetchAndRenderCamerasStatus(n=!1,t=!1){console.log('📹 [MONITORING] Cameras tab is disabled ("Em breve")'),this.renderCamerasTable([])},renderCamerasTable(n){const t=document.getElementById("infra-tab-content-cameras");t&&(t.innerHTML=`
                <div class="glass" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; text-align: center; border-radius: var(--border-radius); border: 1px solid var(--glass-border); background: var(--card-bg); margin-top: 1rem;">
                    <div style="font-size: 3.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.4)); animation: pulse 2s infinite;">📹</div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 600; color: var(--text-main);">Monitoramento de Câmeras</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 400px; margin: 0 auto 1.5rem auto;">O monitoramento e verificação de status das câmeras de segurança está sendo reformulado e estará disponível em breve.</p>
                    <span class="server-virt-badge virtual" style="font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;">⚡ Em Breve</span>
                </div>
            `)},async fetchAndRenderServersStatus(n=!1,t=!1){console.log("⚡ [MONITORING] fetchAndRenderServersStatus called. forceRefresh:",n,"sequential:",t);const e=document.getElementById("servers-auto-refresh"),o=t||e&&e.checked,i=document.getElementById("monitoring-servers-accordion");if(!i){console.error("❌ [MONITORING] Element #monitoring-servers-accordion not found in DOM!");return}const s=document.getElementById("btn-refresh-servers-status");if(s){s.disabled=!0;const a=s.querySelector(".refresh-icon");a&&(a.style.animation="spin 1s linear infinite")}try{if(o){console.log("⚡ [MONITORING] Fetching servers, sequential mode:",o);const a=await k.get(`/monitoring/servers?ping=false&refresh=${n}&t=${Date.now()}`);if(a&&a.success&&Array.isArray(a.servers)){ae=a.servers,this.renderServersAccordion(a.servers);for(const r of a.servers){if(G!=="infra"||ne!=="servers")break;const l=i.querySelector(`[data-server-id="${r.id}"]`);if(l){const d=l.querySelector(".server-status-dot");d&&(d.style.color="#94a3b8",d.style.backgroundColor="#94a3b8",d.style.boxShadow="0 0 8px #94a3b8",d.style.animation="pulse-gray 1.5s infinite")}try{const d=await k.get(`/monitoring/servers/${r.id}/ping?t=${Date.now()}`);if(d&&d.success&&d.server){const u=ae.findIndex(g=>g.id===r.id);u!==-1&&(ae[u]=d.server),this.renderServersAccordion(ae)}}catch(d){console.error(`Erro ao pingar servidor individual ${r.name}:`,d)}}}}else{console.log("⚡ [MONITORING] Fetching all servers with parallel pings...");const a=`/monitoring/servers?refresh=${n}&t=${Date.now()}`,r=await k.get(a);r&&r.success&&Array.isArray(r.servers)&&(ae=r.servers,this.renderServersAccordion(r.servers))}}catch(a){console.error("Erro ao buscar status dos servidores:",a),i.innerHTML=`
                <div style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: var(--border-radius);">
                    Erro ao carregar dados dos servidores: ${a.message||a}
                </div>
            `}finally{if(s){s.disabled=!1;const a=s.querySelector(".refresh-icon");a&&(a.style.animation="")}}},renderServersAccordion(n){const t=document.getElementById("monitoring-servers-accordion");if(!t)return;const e=document.getElementById("servers-search"),o=e?e.value.toLowerCase().trim():"",i=["filter-type-physical","filter-type-virtual","filter-platform-win2019","filter-platform-win2025","filter-platform-linux","filter-activity-online","filter-activity-offline"];let s=0;i.forEach(d=>{const u=document.getElementById(d);u&&u.checked&&s++});const a=document.getElementById("server-filters-active-count");a&&(s>0?(a.textContent=s,a.style.display="inline-flex"):a.style.display="none");const r=n.filter(d=>{if(o&&!(d.name.toLowerCase().includes(o)||d.ip.toLowerCase().includes(o)||(d.os||"").toLowerCase().includes(o)||(d.model||"").toLowerCase().includes(o)))return!1;const u=document.getElementById("filter-type-physical"),g=document.getElementById("filter-type-virtual"),p=[];if(u&&u.checked&&p.push("physical"),g&&g.checked&&p.push("virtual"),p.length>0){const w=!!d.is_virtualized;if(p.includes("physical")&&w||p.includes("virtual")&&!w)return!1}const f=document.getElementById("filter-platform-win2019"),m=document.getElementById("filter-platform-win2025"),h=document.getElementById("filter-platform-linux"),v=[];if(f&&f.checked&&v.push("win2019"),m&&m.checked&&v.push("win2025"),h&&h.checked&&v.push("linux"),v.length>0){const w=(d.os||"").toLowerCase();let $=!1;if(v.includes("win2019")&&w.includes("win")&&w.includes("2019")&&($=!0),v.includes("win2025")&&w.includes("win")&&(w.includes("2025")||w.includes("2022"))&&($=!0),v.includes("linux")&&(w.includes("linux")||w.includes("ubuntu")||w.includes("debian")||w.includes("centos")||w.includes("redhat"))&&($=!0),!$)return!1}const I=document.getElementById("filter-activity-online"),B=document.getElementById("filter-activity-offline"),E=[];if(I&&I.checked&&E.push("online"),B&&B.checked&&E.push("offline"),E.length>0){const w=d.online===!0;if(E.includes("online")&&!w||E.includes("offline")&&w)return!1}return!0});if(r.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: var(--border-radius);">
                    ${o?"Nenhum servidor corresponde à busca.":"Nenhum servidor cadastrado."}
                </div>
            `;return}const l=Array.from(t.querySelectorAll(".server-accordion-item.active")).map(d=>d.getAttribute("data-item-id"));t.innerHTML=r.map(d=>{const g=l.includes(d.id.toString())?"active":"";let p="online",f="Online";d.online===null?(p="offline",f="Aguardando verificação..."):d.online?f="Operando normalmente":(p="offline",f="Offline (Sem resposta)");const m=d.os.toLowerCase();let h="other",v="💻";m.includes("win")?(h="windows",v="🪟"):(m.includes("linux")||m.includes("ubuntu")||m.includes("debian")||m.includes("centos")||m.includes("redhat"))&&(h="linux",v="🐧");const I=d.online?`${d.latency}ms`:"-",B=d.online?d.latency<20?"#6ee7b7":d.latency<80?"#fde047":"#fca5a5":"var(--text-muted)",E=P=>{const y=P<60?"#10b981":P<85?"#f59e0b":"#ef4444",C=P<60?"#6ee7b7":P<85?"#fde047":"#fca5a5";return{color:y,textColor:C}},w=d.cpu_usage!=null?d.cpu_usage:null,$=d.ram_usage!=null?d.ram_usage:null,x=d.disk_usage!=null?d.disk_usage:null,A=w!=null?E(w):{color:"rgba(255,255,255,0.1)",textColor:"var(--text-muted)"},b=$!=null?E($):{color:"rgba(255,255,255,0.1)",textColor:"var(--text-muted)"},S=x!=null?E(x):{color:"rgba(255,255,255,0.1)",textColor:"var(--text-muted)"},_=d.cpu||d.memory||d.storage,O=d.metricsSource||"none",U=O==="zabbix"?'<span title="Métricas em tempo real via Zabbix" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.10);color:#6ee7b7;border:1px solid rgba(16,185,129,0.25);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">📊 Zabbix</span>':'<span title="Dispositivo sem monitoramento Zabbix ativo" style="display:inline-flex;align-items:center;gap:4px;background:rgba(255,255,255,0.05);color:var(--text-muted);border:1px solid rgba(255,255,255,0.1);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">⚪ Sem dados</span>',D=d.online?'<span title="Conectividade verificada via Ping ICMP Real" style="display:inline-flex;align-items:center;gap:4px;background:rgba(59,130,246,0.08);color:#93c5fd;border:1px solid rgba(59,130,246,0.2);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">📡 Ping ICMP</span>':'<span title="Sem resposta de Ping ICMP" style="display:inline-flex;align-items:center;gap:4px;background:rgba(239,68,68,0.08);color:#fca5a5;border:1px solid rgba(239,68,68,0.2);padding:2px 7px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;flex-shrink:0;">📡 ICMP Offline</span>',V=_&&O==="zabbix"&&d.online;return`
                <div class="server-accordion-item ${g}" data-item-id="${d.id}">
                    <div class="server-accordion-header" data-server-id="${d.id}">
                        <div class="server-header-left">
                            <span class="server-status-dot ${p}" title="${f}"></span>
                            <span class="server-title">${d.name}</span>
                            <span class="server-ip-badge">${d.ip}</span>
                            <span class="server-os-badge ${h}">${v} ${d.os}</span>
                            ${d.is_virtualized!=null?d.is_virtualized?`<span title="${d.virtualization_type||"Máquina Virtual"}" style="display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,0.12);color:#d8b4fe;border:1px solid rgba(168,85,247,0.3);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;white-space:nowrap;flex-shrink:0;">
                                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="8" height="8" rx="1"></rect><rect x="14" y="2" width="8" height="8" rx="1"></rect><rect x="2" y="14" width="8" height="8" rx="1"></rect><rect x="14" y="14" width="8" height="8" rx="1"></rect></svg>
                                    ${d.virtualization_type||"Virtual"}
                                  </span>`:`<span title="Servidor Físico" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.09);color:#6ee7b7;border:1px solid rgba(16,185,129,0.2);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;white-space:nowrap;flex-shrink:0;">
                                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                    Físico
                                  </span>`:""}
                            ${_?U:""}
                            ${D}
                        </div>
                        <div class="server-header-right">
                            ${V?`
                            <div style="display: flex; align-items: center; gap: 10px; margin-right: 10px;">
                                <div title="CPU: ${w}% (via Zabbix)" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${A.textColor}" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${A.textColor};">${w}%</span>
                                </div>
                                <div title="RAM: ${$}% (via Zabbix)" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${b.textColor}" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line><line x1="6" y1="4" x2="6" y2="7"></line><line x1="10" y1="4" x2="10" y2="7"></line><line x1="14" y1="4" x2="14" y2="7"></line><line x1="18" y1="4" x2="18" y2="7"></line></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${b.textColor};">${$}%</span>
                                </div>
                                <div title="Disco: ${x}% (via Zabbix)" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${S.textColor}" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${S.textColor};">${x}%</span>
                                </div>
                            </div>`:""}
                            <span class="server-latency" style="color: ${B}; font-weight: 500;">${I}</span>
                            <svg class="server-chevron" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="server-accordion-body">
                        <div class="server-accordion-content">

                            ${_?`
                            <!-- ── Hardware Metrics ─────────────────────────────── -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">

                                <!-- CPU -->
                                ${d.cpu?`
                                <div title="Fonte: ${O==="zabbix"?"Zabbix":"Sem Monitoramento"}" style="background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#a78bfa" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em;">CPU</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${A.textColor};">${w!=null?`${w}%`:"-"}</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${w??0}%; height: 100%; background: ${A.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${d.cpu}">${d.cpu}</span>
                                </div>`:""}

                                <!-- RAM -->
                                ${d.memory?`
                                <div title="Fonte: ${O==="zabbix"?"Zabbix":"Sem Monitoramento"}" style="background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#38bdf8" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line><line x1="6" y1="4" x2="6" y2="7"></line><line x1="10" y1="4" x2="10" y2="7"></line><line x1="14" y1="4" x2="14" y2="7"></line><line x1="18" y1="4" x2="18" y2="7"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">Memória</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${b.textColor};">${$!=null?`${$}%`:"-"}</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${$??0}%; height: 100%; background: ${b.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${d.memory}</span>
                                </div>`:""}

                                <!-- Storage -->
                                ${d.storage?`
                                <div title="Fonte: ${O==="zabbix"?"Zabbix":"Sem Monitoramento"}" style="background: rgba(251,146,60,0.06); border: 1px solid rgba(251,146,60,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fb923c" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #fb923c; text-transform: uppercase; letter-spacing: 0.05em;">Armazenamento</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${S.textColor};">${x!=null?`${x}%`:"-"}</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${x??0}%; height: 100%; background: ${S.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${d.storage}">${d.storage}</span>
                                </div>`:""}

                            </div>
                            `:""}

                            <!-- Virtualization Badge -->
                            ${d.is_virtualized!=null?`
                            <div style="margin-bottom: 16px;">
                                ${d.is_virtualized?`<span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(168,85,247,0.1); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.3); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="8" height="8" rx="1"></rect><rect x="14" y="2" width="8" height="8" rx="1"></rect><rect x="2" y="14" width="8" height="8" rx="1"></rect><rect x="14" y="14" width="8" height="8" rx="1"></rect></svg>
                                        ${d.virtualization_type||"Máquina Virtual"}
                                      </span>`:`<span style="display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.08); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">
                                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                        Servidor Físico
                                      </span>`}
                            </div>
                            `:""}

                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 6px;">
                                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Especificações do Equipamento</span>
                                <span title="Dados cadastrais importados do Lansweeper" style="display:inline-flex;align-items:center;gap:4px;background:rgba(59,130,246,0.08);color:#93c5fd;border:1px solid rgba(59,130,246,0.2);padding:2px 8px;border-radius:20px;font-size:0.65rem;font-weight:600;white-space:nowrap;">📦 Lansweeper</span>
                            </div>

                            <div class="server-details-grid">
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Descrição</span>
                                    <span class="server-detail-value">${d.description||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Domínio</span>
                                    <span class="server-detail-value">${d.domain||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Usuário Contato</span>
                                    <span class="server-detail-value">${d.user} (${d.userDomain})</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Fabricante</span>
                                    <span class="server-detail-value">${d.manufacturer||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Modelo</span>
                                    <span class="server-detail-value">${d.model||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Número de Série</span>
                                    <span class="server-detail-value code-font">${d.serialNumber||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Localização</span>
                                    <span class="server-detail-value">${d.location||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Primeiro Visto</span>
                                    <span class="server-detail-value">${d.firstSeen||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Último Visto</span>
                                    <span class="server-detail-value">${d.lastSeen||"-"}</span>
                                </div>
                                <div class="server-detail-item">
                                    <span class="server-detail-label">Último Ativo</span>
                                    <span class="server-detail-value">${d.lastActive||"-"}</span>
                                </div>
                            </div>
                            <div class="server-actions-row">
                                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); window.monitoringHandler.pingSingleServer('${d.id}', this)" style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; padding: 4px 10px; height: 28px;">
                                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="ping-icon">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <path d="M20.49 15a9 9 0 0 1-12.42-3.36L1 14"></path>
                                    </svg>
                                    <span>Pingar agora</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `}).join(""),t.querySelectorAll(".server-accordion-header").forEach(d=>{d.addEventListener("click",u=>{const g=d.closest(".server-accordion-item"),p=g.classList.contains("active");g.classList.toggle("active",!p)})})},async pingSingleServer(n,t){if(console.log(`⚡ [MONITORING] pingSingleServer called for server ${n}`),!t)return;t.disabled=!0;const e=t.querySelector("span"),o=e.textContent;e.textContent="Verificando...";const i=t.querySelector(".ping-icon");i&&(i.style.animation="spin 1s linear infinite");try{const s=await k.get(`/monitoring/servers/${n}/ping?t=${Date.now()}`);if(s&&s.success&&s.server){const a=ae.findIndex(r=>r.id===n);a!==-1&&(ae[a]=s.server),this.renderServersAccordion(ae)}}catch(s){console.error("Erro ao pingar servidor individual:",s)}finally{t&&(t.disabled=!1,e&&(e.textContent=o),i&&(i.style.animation=""))}},_startTrafficPolling(){this._stopTrafficPolling();const n=document.getElementById("network-traffic-enable"),t=document.getElementById("network-charts-container");if(n&&!n.checked){t&&(t.style.opacity="0.35",t.style.pointerEvents="none"),["lan","wan","opt1","opt2"].forEach(o=>{const i=document.getElementById(`traffic-text-${o}`);i&&(i.textContent="Tráfego pausado")});return}G==="network"&&(t&&(t.style.opacity="1",t.style.pointerEvents="auto"),this.initTrafficCharts(),console.log("📈 [MONITORING] Iniciando polling de tráfego do pfSense..."),Ne=null,this.fetchAndRenderTraffic(),et=setInterval(()=>{const e=document.getElementById("network-traffic-enable");G==="network"&&(!e||e.checked)?this.fetchAndRenderTraffic():this._stopTrafficPolling()},3e3))},_stopTrafficPolling(){et&&(clearInterval(et),et=null,console.log("📈 [MONITORING] Polling de tráfego parado."));const n=document.getElementById("network-traffic-enable");if(!n||!n.checked){const t=document.getElementById("network-charts-container");t&&(t.style.opacity="0.35",t.style.pointerEvents="none"),["lan","wan","opt1","opt2"].forEach(o=>{const i=document.getElementById(`traffic-text-${o}`);i&&(i.textContent="Tráfego pausado")})}},initTrafficCharts(){if(!window.Chart){console.warn("Chart.js is not loaded.");return}["lan","wan","opt1","opt2"].forEach(e=>{const o=document.getElementById(`chart-traffic-${e}`);if(!o||yt[e])return;const i=o.getContext("2d"),s=20,a=Array(s).fill(""),r=Array(s).fill(0);yt[e]=new window.Chart(i,{type:"line",data:{labels:a,datasets:[{label:"Download (In)",data:[...r],borderColor:"#10b981",backgroundColor:"rgba(16, 185, 129, 0.05)",fill:!0,tension:.4,borderWidth:2,pointRadius:0},{label:"Upload (Out)",data:[...r],borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.05)",fill:!0,tension:.4,borderWidth:2,pointRadius:0}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{mode:"index",intersect:!1,callbacks:{label:function(l){let d=l.dataset.label||"";return d&&(d+=": "),l.parsed.y!==null&&(d+=t(l.parsed.y)),d}}}},scales:{x:{display:!1},y:{grid:{color:"rgba(255, 255, 255, 0.05)"},ticks:{color:"rgba(255, 255, 255, 0.5)",font:{size:9,family:"monospace"},callback:function(l){return t(l)}}}}}})});function t(e){return e>=1e6?(e/1e6).toFixed(1)+" Mbps":e>=1e3?(e/1e3).toFixed(1)+" Kbps":e.toFixed(0)+" bps"}},async fetchAndRenderTraffic(){try{const t=await k.get("/monitoring/pfsense/traffic");if(t&&t.success&&t.traffic){const e=t.traffic,o=document.getElementById("traffic-simulation-badge");if(o&&(o.style.display=e.isSimulated?"inline-block":"none"),Ne){const i=e.wan.timestamp-Ne.wan.timestamp;i>0&&["lan","wan","opt1","opt2"].forEach(a=>{const r=e[a],l=Ne[a];if(r&&l){const d=r.inBytes-l.inBytes,u=r.outBytes-l.outBytes,g=d>=0?Math.floor(d*8/i):0,p=u>=0?Math.floor(u*8/i):0,f=document.getElementById(`traffic-text-${a}`);f&&(f.textContent=`In: ${n(g)} | Out: ${n(p)}`);const m=yt[a];if(m){const h=m.data.datasets[0].data,v=m.data.datasets[1].data;h.shift(),h.push(g),v.shift(),v.push(p),m.update("none")}}})}Ne=e}}catch(t){console.error("Erro ao buscar tráfego de rede pfSense:",t)}function n(t){return t>=1e6?(t/1e6).toFixed(2)+" Mbps":t>=1e3?(t/1e3).toFixed(1)+" Kbps":t+" bps"}}};let ve="list";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=K,gn(),mn(),fn(),Vt.init(),Bt.init(),Be.init(),K.init()?(console.log("Sessão restaurada:",K.getUser().email),Wt()):Yt()});let xt,be,Ve,qe;function gn(){xt=document.querySelectorAll(".nav-btn"),be=document.getElementById("btn-new-item"),Ve=document.getElementById("login-section"),qe=document.getElementById("app-container")}function Yt(){Ve&&Ve.classList.remove("hidden"),qe&&qe.classList.add("hidden"),document.body.style.overflow="hidden"}function mn(){const n=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(e=>{if(e&&e.options.length<=1)for(let o=n-5;o<=n+5;o++){const i=document.createElement("option");i.value=o,i.textContent=o,o===n&&(i.selected=!0),e.appendChild(i)}})}function Wt(){if(Ve&&Ve.classList.add("hidden"),qe&&qe.classList.remove("hidden"),document.body.style.overflow="",ve="list",tt(),X.fetch(),ge.fetch(),vt.fetch(),Q.fetch(),window.auth){const n=document.getElementById("timeline-tab-anexo");n&&(window.auth.isAdmin()?n.classList.remove("role-hidden"):n.classList.add("role-hidden"));const t=document.getElementById("timeline-tab-config");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"))}}function tt(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section","monitoring-section"].forEach(n=>{c.hide(n)}),be&&be.classList.add("hidden"),Tt.stop(),ve){case"account":case"profile":c.show("account-section"),c.setText("section-title","Minha Conta"),setTimeout(()=>Tt.start(),100);break;case"list":c.show("list-section"),c.setText("section-title","Listagem Geral"),K.isAdmin()&&be&&be.classList.remove("hidden");break;case"docs":c.show("docs-section"),c.setText("section-title","Documentação");break;case"detail":c.show("detail-section"),c.setText("section-title","Procedimento");break;case"users":c.show("users-section"),c.setText("section-title","Gestão de Usuários");break;case"accounts":c.show("accounts-section"),c.setText("section-title","Gestão de Contas"),Q.handleSearch();break;case"timeline":c.show("timeline-section"),c.setText("section-title","Timeline");break;case"telephony":c.show("telephony-section"),c.setText("section-title","Telefonia");break;case"monitoring":c.show("monitoring-section"),c.setText("section-title","Monitoramento"),Bt.fetch();break}Jt()}function Jt(){const n=K.isAdmin();c.toggle("nav-users",!n),c.toggle("nav-accounts",!n),be&&be.classList.toggle("role-hidden",!n);const t=document.getElementById("btn-floating-edit");t&&t.classList.toggle("role-hidden",!n),document.querySelectorAll(".btn-actions-container").forEach(a=>{a.classList.toggle("role-hidden",!n)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(a=>{const r=document.getElementById(a);r&&r.classList.toggle("role-hidden",!n)});const e=document.getElementById("btn-new-user");e&&e.classList.toggle("role-hidden",!n);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!n);const i=document.getElementById("btn-new-doc");i&&i.classList.toggle("role-hidden",!n);const s=K.getUser();if(s){let a=s.name;(a.toLowerCase().startsWith("usuário ")||a.toLowerCase().startsWith("usuario "))&&(a=a.substring(8)),c.setText("profile-name-display",a),c.setText("profile-role-display",s.role);let r=a.substring(0,2).toUpperCase();const l=a.trim().split(/\s+/);l.length>1&&(r=(l[0][0]+l[l.length-1][0]).toUpperCase()),c.setText("profile-avatar-initials",r)}}function fn(){const n=document.getElementById("sidebar"),t=document.getElementById("sidebar-toggle");t&&n&&t.addEventListener("click",()=>{n.classList.toggle("collapsed")}),xt.forEach(a=>{a.addEventListener("click",()=>{if(xt.forEach(r=>r.classList.remove("active")),a.classList.add("active"),ve=a.dataset.section,tt(),window.innerWidth<=768){n.classList.remove("open");const r=document.getElementById("sidebar-overlay");r&&r.classList.remove("active")}})}),window.addEventListener("SectionChange",a=>{ve=a.detail.section,tt()}),c.on("login-form","submit",async a=>{a.preventDefault();const r=document.getElementById("login-btn"),l=document.getElementById("login-error");r&&(r.disabled=!0);const d=await K.login(c.getValue("login-email"),c.getValue("login-password"));r&&(r.disabled=!1),d.success?Wt():l&&(l.innerText=d.error,l.classList.remove("hidden"))}),c.on("btn-logout","click",()=>{const a=document.getElementById("auto-refresh-toggle");a&&a.checked&&(a.checked=!1,a.dispatchEvent(new Event("change"))),K.logout(),Yt()}),document.querySelectorAll(".close-modal").forEach(a=>{a.addEventListener("click",()=>{const r=a.closest(".modal");r&&r.classList.add("hidden")})}),window.UsersHandler=vt,window.DocsHandler=ge,window.ProceduresHandler=X,window.AccountsHandler=Q,window.TelephonyHandler=Be,window.monitoringHandler=Bt,["extensions","queues","blf","users","history"].forEach(a=>{c.on(`tab-telephony-${a}`,"click",()=>Be.setActiveTab(a))}),c.on("telephony-search","input",a=>Be.search(a.target.value.toLowerCase())),c.on("telephony-page-size","change",a=>Be.setPageSize(a.target.value)),c.on("telephony-reload-btn","click",()=>{const a=document.getElementById("telephony-search");a&&(a.value=""),Be.fetch()}),c.on("accounts-search","input",()=>Q.handleSearch()),c.on("filter-status","change",()=>Q.handleSearch()),c.on("filter-date-toggle","change",a=>{const r=document.getElementById("sidebar-mini-calendar-list");r&&(r.style.opacity=a.target.checked?"1":"0.4",r.style.pointerEvents=a.target.checked?"auto":"none"),Q.handleSearch()}),c.on("filter-cal-month","change",()=>Q.handleFilterChange(!0)),c.on("filter-cal-year","change",()=>Q.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(a=>{c.on(a,"change",()=>{ve==="accounts"&&Q.renderDashboard()})}),c.on("btn-dash-clear-dates","click",()=>{c.setValue("dash-filter-start",""),c.setValue("dash-filter-end",""),c.setValue("dash-filter-type","Todos"),c.setValue("dash-filter-status","Todos"),c.setValue("dash-filter-payment","Todos"),Q.resetMultiselects(),c.setValue("dash-sort-empresas","desc"),c.setValue("dash-sort-categorias","desc"),ve==="accounts"&&Q.renderDashboard()}),c.on("user-form","submit",a=>vt.save(a)),c.on("doc-form","submit",a=>ge.handleUpload(a)),c.on("account-form","submit",a=>Q.save(a)),c.on("faq-form","submit",a=>X.saveMeta(a));const e=document.getElementById("proc-color-palette"),o=document.getElementById("proc-color");e&&o&&(e.addEventListener("click",a=>{const r=a.target.closest(".color-swatch");if(r)if(r.id==="color-custom-swatch")o.click();else{const l=r.dataset.color;l&&(o.value=l,e.querySelectorAll(".color-swatch").forEach(d=>d.classList.remove("active")),r.classList.add("active"))}}),o.addEventListener("input",a=>{const r=document.getElementById("color-custom-swatch");r&&(r.style.background=a.target.value,e.querySelectorAll(".color-swatch").forEach(l=>l.classList.remove("active")),r.classList.add("active"))})),c.on("btn-new-item","click",()=>{if(c.setText("modal-form-title","Novo Procedimento"),c.setValue("proc-id",""),c.setValue("proc-content","[]"),e){e.querySelectorAll(".color-swatch").forEach(r=>r.classList.remove("active"));const a=e.querySelector('[data-color="#4F46E5"]');a&&a.classList.add("active")}o&&(o.value="#4F46E5"),c.show("modal-form")}),c.on("btn-new-account","click",()=>Q.openAccountModal()),c.on("btn-new-account-cal","click",()=>Q.openAccountModal()),c.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),c.setValue("user-id-form",""),c.show("modal-user")}),c.on("list-search","input",a=>{X.search(a.target.value.toLowerCase())}),c.on("doc-search","input",a=>{ge.search(a.target.value.toLowerCase())}),c.on("doc-dash-search","input",()=>{ge.renderDashboard()}),c.on("doc-dash-filter-category","change",()=>{ge.renderDashboard()}),c.on("doc-dash-filter-status","change",()=>{ge.renderDashboard()}),c.on("btn-new-doc","click",()=>{c.show("modal-upload")}),["geral","contratos","termo-de-uso","dashboard"].forEach(a=>{c.on(`tab-doc-${a}`,"click",()=>{let r;a==="termo-de-uso"?r="Termo de Uso":a==="dashboard"?r="dashboard":r=a,ge.setActiveTab(r)})}),c.on("doc-category","change",a=>{const r=a.target.value.toLowerCase(),l=document.getElementById("doc-dates-container");l&&(l.style.display=r==="contratos"||r==="termo de uso"?"grid":"none")}),c.on("doc-indefinite","change",a=>{const r=document.getElementById("doc-end-date");r&&(r.disabled=a.target.checked,a.target.checked&&(r.value=""))});const i=document.getElementById("drop-zone"),s=document.getElementById("doc-file");i&&s&&(i.addEventListener("click",a=>{a.target!==s&&s.click()}),s.addEventListener("click",a=>{a.stopPropagation()}),s.addEventListener("change",a=>{a.target.files.length>0&&c.setText("file-name-display",a.target.files[0].name)}),i.addEventListener("dragover",a=>{a.preventDefault(),i.classList.add("dragover")}),i.addEventListener("dragleave",()=>{i.classList.remove("dragover")}),i.addEventListener("drop",a=>{a.preventDefault(),i.classList.remove("dragover"),a.dataTransfer.files.length>0&&(s.files=a.dataTransfer.files,c.setText("file-name-display",a.dataTransfer.files[0].name))})),c.on("toggle-list","click",a=>{a.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),X.setListingMode("list")}),c.on("toggle-cards","click",a=>{a.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),X.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes"].forEach(a=>{c.on(`tab-acc-${a}`,"click",r=>{document.querySelectorAll(".acc-tab-btn").forEach(p=>p.classList.remove("active")),r.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(p=>{p.classList.add("hidden"),p.classList.remove("active")});const l=document.getElementById("accounts-dashboard-view");l&&(l.classList.add("hidden"),l.classList.remove("active"));const d=a==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${a}`,u=document.getElementById(d);u&&(u.classList.remove("hidden"),u.classList.add("active"));const g=document.getElementById("calendar-view-toggle-container");g&&(a==="calendario"?(g.classList.remove("hidden"),g.style.display="flex"):(g.classList.add("hidden"),g.style.display="none")),Q.setAccountsViewMode(a==="calendario"?"calendar":a==="dashboard"?"dashboard":a==="notificacoes"?"notificacoes":"list")})}),["day","month","year"].forEach(a=>{c.on(`toggle-accounts-cal-${a}`,"click",r=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(l=>l.classList.remove("active")),r.currentTarget.classList.add("active"),["day","month","year"].forEach(l=>{document.getElementById(`cal-${l}-view-container`).classList.toggle("hidden-cal-view",l!==a)}),Q.setCalendarSubView(a)})}),c.on("btn-prev-date-nav","click",()=>Q.shiftCalendarDate(-1)),c.on("btn-next-date-nav","click",()=>Q.shiftCalendarDate(1)),c.on("btn-back-to-accounts","click",()=>{c.hide("dedicated-account-page"),c.show("accounts-section"),Jt()}),c.on("btn-back-to-list","click",()=>{const a=document.getElementById("procedure-edit-wrapper");a&&!a.classList.contains("hidden")?X.toggleEditMode(!1):(ve="list",tt())}),c.on("btn-floating-edit","click",()=>X.toggleEditMode(!0)),c.on("btn-cancel-edit","click",()=>X.toggleEditMode(!1)),c.on("btn-save-procedure","click",()=>X.handleSaveProcedure()),c.on("confirm-yes","click",()=>{c.hide("modal-confirm"),X.openDetail(X.getPendingProcId())}),c.on("confirm-no","click",()=>{c.hide("modal-confirm")}),c.on("procedure-search","input",a=>{X.filterProcedureContent(a.target.value)}),c.on("btn-add-block","click",()=>{const a=document.getElementById("section-title-input"),r=document.getElementById("section-type-input");a&&(a.value=""),r&&(r.value="TEXTO"),c.show("modal-add-section")}),c.on("btn-confirm-add-section","click",()=>{const a=c.getValue("section-title-input"),r=c.getValue("section-type-input");if(!a)return alert("Por favor, informe o título da seção.");X.addSection(a,r),c.hide("modal-add-section")})}
