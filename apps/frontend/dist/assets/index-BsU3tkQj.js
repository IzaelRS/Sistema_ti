(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();const Ce="/api",E={async get(e){const t=await fetch(`${Ce}${e}`);if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async post(e,t){const n=await fetch(`${Ce}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(e,t){const n=await fetch(`${Ce}${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(e){const t=await fetch(`${Ce}${e}`,{method:"DELETE"});if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async upload(e,t){const n=await fetch(`${Ce}${e}`,{method:"POST",body:t});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let xe=null;const K={init(){const e=localStorage.getItem("user");if(e)try{return xe=JSON.parse(e),!0}catch{return this.logout(),!1}return!1},getUser(){return xe},isAdmin(){return xe&&xe.role==="Administrador"},async login(e,t){try{const n=await E.post("/login",{email:e,password:t});return xe=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){xe=null,localStorage.removeItem("user")}},c={show(e){const t=document.getElementById(e);t&&t.classList.remove("hidden")},hide(e){const t=document.getElementById(e);t&&t.classList.add("hidden")},toggle(e,t){const n=document.getElementById(e);n&&n.classList.toggle("hidden",t)},setText(e,t){const n=document.getElementById(e);n&&(n.innerText=t)},setValue(e,t){const n=document.getElementById(e);n&&(n.value=t)},getValue(e){const t=document.getElementById(e);return t?t.value:null},on(e,t,n){const o=document.getElementById(e);o&&o.addEventListener(t,n)}},It={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const e=window.innerWidth<=768;this.particleCount=e?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let t=0;t<this.particleCount;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const e=document.getElementById("account-section");e&&(this.canvas.width=e.clientWidth,this.canvas.height=e.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let e=0;e<this.particles.length;e++){const t=this.particles[e];t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.canvas.width)&&(t.vx*=-1),(t.y<0||t.y>this.canvas.height)&&(t.vy*=-1),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=e+1;n<this.particles.length;n++){const o=this.particles[n],i=t.x-o.x,s=t.y-o.y,a=Math.sqrt(i*i+s*s);if(a<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const r=1-a/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${r*.4})`,this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let Le=[];const ht={async fetch(){try{Le=await E.get("/users"),this.render(Le)}catch(e){console.error("Error fetching Users:",e)}},getUsers(){return Le},render(e){const t=document.getElementById("user-table-body");t&&(t.innerHTML=e.map(n=>{const o=n.role==="Administrador",i=K.isAdmin()?`
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
                ${i}
            </tr>`}).join(""))},openEditModal(e){const t=Le.find(n=>n.id===e);t&&(c.setText("modal-user-title","Editar Usuário"),c.setValue("user-id-form",t.id),c.setValue("user-name-form",t.name),c.setValue("user-email-form",t.email),c.setValue("user-password-form",""),c.setValue("user-role-form",t.role),c.show("modal-user"))},async save(e){e.preventDefault();const t=c.getValue("user-id-form"),n={name:c.getValue("user-name-form"),email:c.getValue("user-email-form"),password:c.getValue("user-password-form"),role:c.getValue("user-role-form")};try{t?await E.put(`/users/${t}`,n):await E.post("/users",n),c.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(t?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(e){if(confirm("Deseja excluir este usuário?"))try{await E.delete(`/users/${e}`),this.fetch()}catch(t){alert("Erro ao excluir: "+t.message)}},search(e){const t=Le.filter(n=>n.name.toLowerCase().includes(e)||n.email.toLowerCase().includes(e));this.render(t)}};let je=[],me="Geral",W=1;const Te=10;let Bt=[];const pe={async fetch(){try{W=1,je=await E.get("/documents"),this.filterAndRender()}catch(e){console.error("Error fetching Documents:",e)}},setActiveTab(e){me=e,W=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(t=>{const n=t.textContent.trim().toLowerCase();t.classList.toggle("active",n===e.toLowerCase())}),this.filterAndRender()},filterAndRender(){const e=document.querySelector(".docs-header");if(me.toLowerCase()==="dashboard")e&&(e.style.display="none"),c.hide("doc-list-container"),c.show("doc-dashboard-container"),this.renderDashboard();else{e&&(e.style.display="flex"),c.show("doc-list-container"),c.hide("doc-dashboard-container");const t=je.filter(n=>(n.category||"Geral").toLowerCase()===me.toLowerCase());this.render(t)}},calculateRemainingTime(e){if(!e||e==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const t=new Date;t.setHours(0,0,0,0);const n=new Date(e+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-t.getTime(),i=Math.ceil(o/(1e3*60*60*24));if(i<0){const s=Math.abs(i);let a=`Expirado há ${s} dia(s)`;return s>=30&&(a=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:a,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:i}}else{if(i===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:i};if(i<=30)return{text:`Expira em ${i} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:i};{const s=Math.floor(i/30);let a=`Expira em ${s} mês(es)`;if(s>=12){const r=Math.floor(s/12),l=s%12;a=`Expira em ${r} ano(s)${l>0?` e ${l} mês(es)`:""}`}return{text:a,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:i}}}},renderDashboard(){const e=document.getElementById("doc-dashboard-tbody");if(!e)return;const t=je.filter(m=>{const y=(m.category||"").toLowerCase();return y==="contratos"||y==="termo de uso"});let n=0,o=0,i=0,s=0;t.forEach(m=>{const y=(m.category||"").toLowerCase(),v=this.calculateRemainingTime(m.end_date);v.status==="expired"?s++:v.status==="critical"?(i++,y==="contratos"&&n++,y==="termo de uso"&&o++):(y==="contratos"&&n++,y==="termo de uso"&&o++)}),c.setText("doc-kpi-active-contracts",n),c.setText("doc-kpi-active-terms",o),c.setText("doc-kpi-warning-docs",i),c.setText("doc-kpi-expired-docs",s);const a=document.getElementById("doc-dash-search"),r=document.getElementById("doc-dash-filter-category"),l=document.getElementById("doc-dash-filter-status"),d=a?a.value.toLowerCase().trim():"",u=r?r.value:"Todos",g=l?l.value:"Todos";let p=t.filter(m=>{if(d&&!m.original_name.toLowerCase().includes(d)||u!=="Todos"&&(m.category||"").toLowerCase()!==u.toLowerCase())return!1;const y=this.calculateRemainingTime(m.end_date);return!(g!=="Todos"&&(g==="Ativos"&&(y.status==="expired"||y.status==="critical")||g==="Expirando"&&y.status!=="critical"||g==="Expirados"&&y.status!=="expired"||g==="Indeterminado"&&y.status!=="indefinite"))});if(p.sort((m,y)=>{const v=this.calculateRemainingTime(m.end_date),I=this.calculateRemainingTime(y.end_date),B={expired:1,critical:2,active:3,indefinite:4},x=B[v.status]||5,w=B[I.status]||5;return x!==w?x-w:v.days-I.days}),p.length===0){e.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const f=window.auth&&window.auth.isAdmin();e.innerHTML=p.map(m=>{const y=m.mimetype==="application/pdf"?"📕":"🖼️",v=m.start_date?new Date(m.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",I=m.end_date?m.end_date==="Indefinido"?"Indefinido":new Date(m.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",B=this.calculateRemainingTime(m.end_date),x=f?`<button class="btn-delete" onclick="window.DocsHandler.delete(${m.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
                <tr>
                    <td>
                        <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                            <span>${y}</span>
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
                            ${x}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(e){const t=document.getElementById("doc-list-body");if(!t)return;const n=document.getElementById("doc-list-thead"),o=me.toLowerCase()==="contratos"||me.toLowerCase()==="termo de uso",i=window.auth&&window.auth.isAdmin(),s=i?"":'class="role-hidden"';Bt=e;const a=e.length,r=Math.ceil(a/Te);W>r&&(W=Math.max(1,r)),W<1&&(W=1);const l=(W-1)*Te,d=e.slice(l,l+Te);if(n&&(o?n.innerHTML=`
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
                `),d.length===0){t.innerHTML=`
                <tr>
                    <td colspan="${o?7:5}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `,this.renderPaginationControls("doc-pagination",0,0);return}t.innerHTML=d.map(u=>{const g=u.mimetype==="application/pdf"?"📕":"🖼️",p=(u.size/1024).toFixed(1)+" KB",f=u.created_at?new Date(u.created_at).toLocaleDateString("pt-BR"):"-",m=u.mimetype==="application/pdf"?"PDF":"Imagem",y=i?`<button class="btn-delete" onclick="window.DocsHandler.delete(${u.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",v=u.start_date?new Date(u.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",I=u.end_date?u.end_date==="Indefinido"?"Indefinido":new Date(u.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-";return o?`
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
                                ${y}
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
                                ${y}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",r,a)},async handleUpload(e){e.preventDefault();const t=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!t.files.length){alert("Selecione um arquivo.");return}const i=new FormData,s=n?n.value:"Geral";i.append("category",s),i.append("customName",o?o.value:""),i.append("document",t.files[0]);const a=s.toLowerCase();if(a==="contratos"||a==="termo de uso"){const r=document.getElementById("doc-start-date"),l=document.getElementById("doc-end-date"),d=document.getElementById("doc-indefinite");r&&r.value&&i.append("startDate",r.value),d&&d.checked?i.append("endDate","Indefinido"):l&&l.value&&i.append("endDate",l.value)}try{await E.upload("/documents",i),c.hide("modal-upload"),document.getElementById("doc-form").reset();const r=document.getElementById("doc-dates-container");r&&(r.style.display="none");const l=document.getElementById("doc-end-date");l&&(l.disabled=!1),c.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(r){console.error(r),alert("Erro ao subir arquivo.")}},async delete(e){if(confirm("Deletar este documento?"))try{await E.delete(`/documents/${e}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(e){if(me.toLowerCase()==="dashboard")this.renderDashboard();else{W=1;const t=je.filter(n=>(n.category||"Geral").toLowerCase()===me.toLowerCase()&&n.original_name.toLowerCase().includes(e));this.render(t)}},changePage(e){W=e,this.render(Bt)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
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
        `;const a=(W-1)*Te+1,r=Math.min(W*Te,n);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${n}
            </span>
        `,o.innerHTML=i}};let ue=[],S={summaries:[]},Ct=null,j=null,st="list",Se=null,de=null,Lt=null,J=1;const De=10;let Ge=[];const ee={getPendingProcId(){return Ct},async fetch(){try{J=1,ue=await E.get("/procedures"),this.renderTable(ue)}catch(e){console.error("Error fetching FAQs:",e)}},getFaqs(){return ue},setListingMode(e){st=e,J=1,this.renderTable(Ge.length?Ge:ue)},renderTable(e){const t=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!t||!n||!o)return;Ge=e;const i=e.length,s=Math.ceil(i/De);J>s&&(J=Math.max(1,s)),J<1&&(J=1);const a=(J-1)*De,r=e.slice(a,a+De);st==="list"?(c.show("list-table-container"),c.hide("list-cards-container"),r.length===0?o.innerHTML=`
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
                    </tr>`}).join("")):(c.hide("list-table-container"),c.show("list-cards-container"),r.length===0?n.innerHTML=`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum procedimento encontrado.
                    </div>
                `:n.innerHTML=r.map(d=>{const u=K.isAdmin()?`
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
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,i),(st==="list"?o:n).addEventListener("click",function(u){const g=u.target.closest('[data-action="edit"], [data-action="delete"]');if(g){u.stopPropagation(),u.preventDefault();const f=Number(g.dataset.id);g.dataset.action==="edit"?ee.openEditModal(f):g.dataset.action==="delete"&&ee.deleteProcedure(f);return}const p=u.target.closest('[data-action="open"]');if(p){const f=Number(p.dataset.id);ee.openDetail(f)}})},openDetail(e){const t=ue.find(o=>o.id===e);if(!t)return;c.setText("detail-title",t.name||t.title||"Sem título"),c.setValue("proc-id",t.id);try{let o=t.content?JSON.parse(t.content):[];Array.isArray(o)?S={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?S=o:S={summaries:[]}}catch{S={summaries:[]}}S.summaries.length>0?j=S.summaries[0].id:j=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(e){const t=ue.find(n=>n.id===e);t&&(c.setText("modal-form-title","Editar Procedimento"),c.setValue("proc-id",t.id),c.setValue("proc-name",t.name||t.title||""),c.setValue("proc-responsible",t.responsible||""),c.setValue("proc-group",t.group_name||""),c.setValue("proc-note",t.note||""),c.setValue("proc-content",t.content||""),c.setValue("proc-color",t.color||"#4F46E5"),c.show("modal-form"))},async saveMeta(e){e&&e.preventDefault();const t=c.getValue("proc-id"),n={name:c.getValue("proc-name").toUpperCase(),responsible:c.getValue("proc-responsible").toUpperCase(),group_name:c.getValue("proc-group"),note:c.getValue("proc-note"),content:c.getValue("proc-content"),color:c.getValue("proc-color")};try{const o=t?`/procedures/${t}`:"/procedures";Ct=(t?await E.put(o,n):await E.post(o,n)).id,c.hide("modal-form"),document.getElementById("faq-form").reset(),c.setValue("proc-responsible","TI"),c.setValue("proc-group","Geral"),await this.fetch(),c.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(e){if(confirm("Deseja excluir este procedimento?"))try{await E.delete(`/procedures/${e}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(e){const t=document.querySelector(".procedure-sidebar");e?(c.hide("procedure-view-container"),c.hide("procedure-view-sidebar"),c.show("procedure-edit-wrapper"),c.show("procedure-edit-sidebar"),c.hide("btn-floating-edit"),t&&t.classList.add("glass","has-border"),S.summaries.length>0?S.summaries.find(n=>n.id===j)||(j=S.summaries[0].id):j=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(c.show("procedure-view-container"),c.show("procedure-view-sidebar"),c.hide("procedure-edit-wrapper"),c.hide("procedure-edit-sidebar"),c.show("btn-floating-edit"),t&&t.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const e=document.getElementById("procedure-view-container"),t=document.getElementById("procedure-view-index");if(!e||!t)return;if(S.summaries.length===0){e.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',t.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";S.summaries.forEach((i,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${i.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${i.title}</li>`,n+=`<div id="sum-view-${i.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(S.summaries.length>1||i.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${i.title}</h4>`),i.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const a=i.sections.map((r,l)=>{let d="";if(r.type==="TEXTO")d=`<div class="gh-content"><div class="gh-text-view">${r.data||"Sem conteúdo."}</div></div>`;else if(r.type==="FAQ")d='<div class="gh-faq-list">'+(r.data||[]).map((p,f)=>`
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
                 `}).join("");n+=a,n+="</div>"}),t.innerHTML=o,e.innerHTML=n},filterProcedureContent(e){e=e.toLowerCase();const t=document.getElementById("procedure-view-container");if(!t)return;t.querySelectorAll(".gh-box").forEach(o=>{const i=o.querySelector(".gh-faq-list");let s=!1;const a=o.querySelector(".gh-header"),r=a?a.textContent.toLowerCase().includes(e):!1;i&&i.querySelectorAll(".gh-accordion").forEach(u=>{const g=u.textContent.toLowerCase();r||g.includes(e)?(u.classList.remove("hidden"),s=!0):u.classList.add("hidden")});const l=o.textContent.toLowerCase();r||l.includes(e)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const e=document.getElementById("procedure-edit-index"),t=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!e)return;e.innerHTML=S.summaries.map((i,s)=>`
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
            `).join("");const o=S.summaries.find(i=>i.id===j);o?(n.textContent=o.title,n.style.color="var(--text-main)",t.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",t.classList.add("hidden"))},selectSummary(e){j=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(e,t){const n=S.summaries.find(i=>i.id===e);n&&(n.title=t||"Sem título"),this.renderProcedureBuilderSidebar();const o=S.summaries.find(i=>i.id===j);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const e="sum_"+Date.now();S.summaries.push({id:e,title:`Sumário ${S.summaries.length+1}`,sections:[]}),j=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(e){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(S.summaries=S.summaries.filter(t=>t.id!==e),j===e&&(j=S.summaries.length>0?S.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const e=document.getElementById("procedure-edit-container");if(!e)return;if(!j){e.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const t=S.summaries.find(o=>o.id===j);if(!t)return;const n=t.sections;if(n.length===0){e.innerHTML=`<p class="empty-state">Nenhum campo em "${t.title}". Clique em "+ Novo Container" para começar.</p>`;return}e.innerHTML=n.map((o,i)=>`
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
             </div>`).join("")},handleSumDragStart(e,t){Se="summary",de=t,e.dataTransfer.effectAllowed="move",setTimeout(()=>{e.target&&e.target.classList.add("dragging")},0)},handleSumDrop(e,t){if(e.preventDefault(),Se!=="summary"||de===null||de===t)return;const n=S.summaries.splice(de,1)[0];S.summaries.splice(t,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(e,t,n){Se="container",de=t,Lt=n,e.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=e.target.nodeType===1?e.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect="move"},handleSecDrop(e,t,n){if(e.preventDefault(),Se!=="container"||de===null||Lt!==n)return;const o=S.summaries.find(s=>s.id===n);if(!o||de===t)return;const i=o.sections.splice(de,1)[0];o.sections.splice(t,0,i),this.renderProcedureBuilder()},handleDragEnd(e){document.querySelectorAll(".editable-section.dragging").forEach(t=>t.classList.remove("dragging")),e&&e.target&&e.target.setAttribute&&e.target.setAttribute("draggable","false"),Se=null,de=null},updateSectionTitle(e,t){const n=S.summaries.find(o=>o.id===j);n&&(n.sections[e].title=t)},updateSectionData(e,t){const n=S.summaries.find(o=>o.id===j);n&&(n.sections[e].data=t)},removeSection(e){const t=S.summaries.find(n=>n.id===j);t&&t.sections.splice(e,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(e){const t=S.summaries.find(n=>n.id===j);t&&(t.sections[e].data=t.sections[e].data||[],t.sections[e].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(e,t,n,o){const i=S.summaries.find(s=>s.id===j);i&&(i.sections[e].data[t][n]=o)},removeFaqItem(e,t){const n=S.summaries.find(o=>o.id===j);n&&n.sections[e].data.splice(t,1),this.renderProcedureBuilder()},addSection(e,t){if(!j){alert("Selecione primeiro um sumário na barra lateral.");return}const n=S.summaries.find(o=>o.id===j);n&&(n.sections.push({id:Date.now(),title:e,type:t,data:t==="FAQ"?[]:t==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(e,t){t.dataTransfer.files&&t.dataTransfer.files.length>0&&await this.uploadSectionFile(e,t.dataTransfer.files[0])},async handleSectionFileUpload(e,t){const n=t.files[0];n&&await this.uploadSectionFile(e,n)},async uploadSectionFile(e,t){const n=new FormData;n.append("file",t);try{const o=await E.upload("/upload",n),i=S.summaries.find(s=>s.id===j);i&&(i.sections[e].data={name:t.name,path:o.path,mimetype:t.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const e=parseInt(c.getValue("proc-id"));if(!e)return;const n={...ue.find(o=>o.id===e),content:JSON.stringify(S)};try{await E.put(`/procedures/${e}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(e),this.fetch()}catch{alert("Erro ao salvar")}},search(e){J=1;const t=ue.filter(n=>(n.name||n.title||"").toLowerCase().includes(e)||(n.responsible||"").toLowerCase().includes(e)||(n.group_name||"").toLowerCase().includes(e));this.renderTable(t)},changePage(e){J=e,this.renderTable(Ge)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
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
        `;const a=(J-1)*De+1,r=Math.min(J*De,n);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${n}
            </span>
        `,o.innerHTML=i}};window.toggleGhAccordion=function(e){const t=document.getElementById(e);t&&t.classList.toggle("open")};let te=[],we="list",fe="month",M=new Date,Z=1;const Ae=10;let Tt=[];const Q={async fetch(){try{Z=1,te=await E.get("/accounts"),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(e){console.error("Falha ao obter contas",e)}},populateCompanyFilter(){const e=document.getElementById("dash-filter-company-dynamic-options");if(e){const t=new Set;e.querySelectorAll('input[type="checkbox"]:checked').forEach(i=>{t.add(i.value)});const n=[...new Set(te.map(i=>i.company_name).filter(Boolean))].sort((i,s)=>i.localeCompare(s));let o="";n.forEach(i=>{const s=t.has(i)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${i}" ${s}> <span>${i}</span></label>`}),e.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(e){if(!document.getElementById(`${e}-container`))return;const n=document.getElementById(`${e}-trigger`),o=document.getElementById(`${e}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",r=>{r.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(l=>{l!==o&&l.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const i=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(r=>r.value!=="Todos"),a=()=>{const r=s.filter(d=>d.checked).map(d=>d.value),l=n.querySelector(".trigger-label");i.checked||s.length>0&&r.length===s.length?(i.checked=!0,l&&(l.innerText="Todos")):r.length===0?l&&(l.innerText="Nenhum"):r.length===1?l&&(l.innerText=r[0]):l&&(l.innerText=`${r.length} selecionados`)};i&&!i.dataset.listenerBound&&(i.addEventListener("change",()=>{s.forEach(r=>{r.checked=i.checked}),a(),this.renderDashboard()}),i.dataset.listenerBound="true"),s.forEach(r=>{r.dataset.listenerBound||(r.addEventListener("change",()=>{s.every(d=>d.checked)?i.checked=!0:i.checked=!1,a(),this.renderDashboard()}),r.dataset.listenerBound="true")}),a()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",e=>{e.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(t=>{t.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(e){const t=document.getElementById(`${e}-dropdown`);if(!t)return["Todos"];const n=t.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(e=>{const t=document.getElementById(`${e}-dropdown`);if(t){t.querySelectorAll('input[type="checkbox"]').forEach(i=>{i.checked=i.value==="Todos"});const o=document.getElementById(`${e}-trigger`);if(o){const i=o.querySelector(".trigger-label");i&&(i.innerText="Todos")}}})},getAccounts(){return te},setAccountsViewMode(e){we=e,this.handleSearch()},setCalendarSubView(e){fe=e,this.handleSearch()},shiftCalendarDate(e){fe==="day"?M.setDate(M.getDate()+e):fe==="month"?M.setMonth(M.getMonth()+e):fe==="year"&&M.setFullYear(M.getFullYear()+e),c.setValue("filter-day",M.getDate()),c.setValue("filter-month",M.getMonth()),c.setValue("filter-year",M.getFullYear()),this.handleSearch()},handleFilterChange(e=!1){if(e){const t=c.getValue("filter-cal-year")?parseInt(c.getValue("filter-cal-year")):M.getFullYear(),n=c.getValue("filter-cal-month")?parseInt(c.getValue("filter-cal-month")):M.getMonth();M=new Date(t,n,1)}else{const t=c.getValue("filter-year")?parseInt(c.getValue("filter-year")):M.getFullYear(),n=c.getValue("filter-month")?parseInt(c.getValue("filter-month")):M.getMonth(),o=c.getValue("filter-day")?parseInt(c.getValue("filter-day")):M.getDate();M=new Date(t,n,o)}c.setValue("filter-month",M.getMonth()),c.setValue("filter-year",M.getFullYear()),this.handleSearch()},handleSearch(){const e=(c.getValue("accounts-search")||"").toLowerCase();let t=te.filter(n=>n.company_name.toLowerCase().includes(e)||n.description&&n.description.toLowerCase().includes(e));if(we==="list"){Z=1;const n=c.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),i=o?o.checked:!1,s=M.getFullYear(),a=M.getMonth(),r=M.getDate();t=t.filter(l=>{if(n&&l.status!==n)return!1;if(!i||!l.due_date)return!0;const[d,u,g]=l.due_date.split("-"),p=parseInt(d,10),f=parseInt(u,10)-1,m=parseInt(g,10);return l.type==="Único"?p===s&&f===a&&m===r:l.type==="Recorrente"?m===r:!0}),this.renderAccountsList(t)}else we==="notificacoes"?this.renderNotifications():we==="dashboard"?this.renderDashboard():this.renderCalendarWrapper(t)},checkAccountAlerts(){let e=!1;const t=new Date;t.setHours(0,0,0,0),te.forEach(o=>{const i=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(i==="on"&&s==="pendente"&&o.due_date){const[a,r,l]=o.due_date.split("-");let d=new Date(parseInt(a,10),parseInt(r,10)-1,parseInt(l,10));d.setHours(0,0,0,0),d.getTime()<=t.getTime()&&(e=!0)}});const n=document.getElementById("icon-alert-bell");n&&(e?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const e=document.getElementById("accounts-notifications-body");if(!e)return;e.innerHTML="";const t=new Date;t.setHours(0,0,0,0);let n=te.filter(o=>{const i=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(i!=="on"||s!=="pendente"||!o.due_date)return!1;const[a,r,l]=o.due_date.split("-");let d=new Date(parseInt(a,10),parseInt(r,10)-1,parseInt(l,10));return d.setHours(0,0,0,0),d.getTime()<=t.getTime()});if(n.length===0){e.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const i=document.createElement("tr");let s="Sem Data";if(o.due_date){const r=o.due_date.split("-");r.length===3&&(s=`${r[2]}/${r[1]}/${r[0]}`)}const a=K.isAdmin()?`
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
            `,e.appendChild(i)})},renderAccountsList(e){const t=document.getElementById("accounts-table-body");if(!t)return;t.innerHTML="",this.renderSidebarMiniCalendar(),Tt=e;const n=e.length,o=Math.ceil(n/Ae);Z>o&&(Z=Math.max(1,o)),Z<1&&(Z=1);const i=(Z-1)*Ae,s=e.slice(i,i+Ae);if(s.length===0){t.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(a=>{const r=document.createElement("tr");let l="Sem Data";if(a.due_date){const g=a.due_date.split("-");g.length===3&&(l=`${g[2]}/${g[1]}/${g[0]}`)}const d=a.status==="Off",u=K.isAdmin()?`
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
            `,t.appendChild(r)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(we!=="dashboard")return;this.initDashboardMultiselects();const e=c.getValue("dash-filter-start"),t=c.getValue("dash-filter-end"),n=c.getValue("dash-filter-type")||"Todos",o=c.getValue("dash-filter-status")||"Todos",i=c.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),a=this.getMultiselectValues("dash-filter-company");let r=e?new Date(e+"T00:00:00"):null,l=t?new Date(t+"T23:59:59"):null;if(!r&&!l){const k=new Date;r=new Date(k.getFullYear(),k.getMonth(),1,0,0,0),l=new Date(k.getFullYear(),k.getMonth()+1,0,23,59,59)}else r?l||(l=new Date(2100,11,31)):r=new Date(2e3,0,1);let d=0,u=0,g=new Set,p=new Set,f=0,m=0,y=0,v="-",I=0,B=0,x={},w={},$={};te.forEach(k=>{if(!k.due_date||n!=="Todos"&&k.type!==n||o!=="Todos"&&k.status!==o||i!=="Todos"&&k.payment_status!==i)return;if(!s.includes("Todos")){if(s.length===0)return;const A=k.category||"Outros";if(!s.includes(A))return}if(!a.includes("Todos")&&(a.length===0||!a.includes(k.company_name)))return;let R=0,V=new Date(r);V.setHours(0,0,0,0);let q=new Date(l);q.setHours(0,0,0,0);let G=3650;for(;V<=q&&G>0;){if(this.isEventOnDate(k,V.getFullYear(),V.getMonth(),V.getDate())){R++;const A=`${V.getFullYear()}-${String(V.getMonth()+1).padStart(2,"0")}`;$[A]||($[A]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const O=parseFloat(k.value||0);$[A].total+=O,k.payment_status==="Pago"&&($[A].pago+=O),k.payment_status==="Pendente"&&($[A].pendente+=O),k.type==="Recorrente"&&($[A].fixo+=O),k.type==="Único"&&($[A].variavel+=O)}V.setDate(V.getDate()+1),G--}if(R>0){const A=parseFloat(k.value||0)*R;d+=A,u+=R,g.add(k.category||"Outros"),p.add(k.company_name),k.payment_status==="Pago"&&(f+=A),k.payment_status==="Pendente"&&(m+=A),k.type==="Recorrente"&&(I+=A),k.type==="Único"&&(B+=A),A>y&&(y=A,v=k.company_name);const O=k.category||"Outros";w[O]=(w[O]||0)+A;const z=k.company_name||"Sem Empresa";x[z]=(x[z]||0)+A}}),c.setText("dash-metric-valor","R$ "+d.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-contas",u.toString()),c.setText("dash-metric-tipos",g.size.toString()),c.setText("dash-metric-empresas",p.size.toString()),c.setText("dash-metric-pago","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-pendente","R$ "+m.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-maior-valor","R$ "+y.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-maior-nome",v),c.setText("dash-metric-fixo","R$ "+I.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-variavel","R$ "+B.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const b=c.getValue("dash-sort-empresas")||"desc",D=c.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",x,b),this.renderTierList("dash-list-categorias",w,D),this.renderTimeChart($)},renderTimeChart(e){window.timeChartInstance&&window.timeChartInstance.destroy();const t=document.getElementById("chart-dashboard-time");if(!t)return;const n=Object.keys(e).sort(),o=n.map(u=>{const[g,p]=u.split("-");return`${p}/${g}`}),i=n.map(u=>e[u].total),s=n.map(u=>e[u].pago),a=n.map(u=>e[u].pendente),r=n.map(u=>e[u].fixo),l=n.map(u=>e[u].variavel),d={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:i,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:a,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:r,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:l,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(u){let g=u.dataset.label||"";return g&&(g+=": "),u.parsed.y!==null&&(g+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(u.parsed.y)),g}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(u,g,p){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(u)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(t.getContext("2d"),d)},renderTierList(e,t,n){const o=document.getElementById(e);if(!o)return;const i=Object.entries(t);if(i.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}i.sort((r,l)=>n==="asc"?r[1]-l[1]:l[1]-r[1]);const s=i.slice(0,10);let a="";s.forEach(([r,l],d)=>{const u=d===0&&n==="desc",g=u?"🏆 ":d+1+". ";a+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${u?"bold":"normal"}; color: ${u?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${r}">
                        ${g}${r}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=a},renderCharts(e){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const t=document.getElementById("chart-category");if(t){const o={labels:Object.keys(e),datasets:[{data:Object.values(e),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(t.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],i=[];let s=new Date;for(let a=-5;a<=6;a++){let r=new Date(s.getFullYear(),s.getMonth()+a,1);o.push(r.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let l=0;te.forEach(d=>{if(!d.due_date||d.status==="Off")return;const[u,g]=d.due_date.split("-"),p=new Date(parseInt(u),parseInt(g)-1,1);(d.type==="Recorrente"&&r.getTime()>=p.getTime()||d.type==="Único"&&r.getFullYear()===parseInt(u)&&r.getMonth()===parseInt(g)-1)&&(l+=parseFloat(d.value||0))}),i.push(l)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:i,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(e){const t={},n=[];return e.forEach(o=>{if(o.type==="Único")n.push(o);else if(!t[o.company_name])t[o.company_name]=o;else{const i=new Date(t[o.company_name].due_date||0);new Date(o.due_date||0)>i&&(t[o.company_name]=o)}}),[...n,...Object.values(t)]},isEventOnDate(e,t,n,o){if(!e.due_date)return!1;const[i,s,a]=e.due_date.split("-"),r=parseInt(i,10),l=parseInt(s,10)-1,d=parseInt(a,10);if(e.type==="Único")return t===r&&n===l&&o===d;if(e.type==="Recorrente"){const u=new Date(r,l,d).setHours(0,0,0,0);if(new Date(t,n,o).setHours(0,0,0,0)<u)return!1;const p=e.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(p)){const f=(t-r)*12+(n-l),m=new Date(t,n+1,0).getDate(),y=Math.min(d,m);if(o!==y||f<0)return!1;if(p==="1 mes")return!0;if(p==="3 meses")return f%3===0;if(p==="6 meses")return f%6===0;if(p==="1 ano")return n===l}else{const f=Date.UTC(r,l,d),m=Date.UTC(t,n,o),y=Math.round((m-f)/(1e3*60*60*24));if(p==="1 dia")return!0;if(p==="7 dias")return y%7===0;if(p==="15 dias")return y%15===0}}return!1},renderCalendarWrapper(e){const t=M.getFullYear(),n=M.getMonth(),o=M.getDate();fe==="month"?this.renderCalendarMonth(e,t,n):fe==="year"?this.renderCalendarYear(e,t):fe==="day"&&this.renderCalendarDay(e,t,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const e=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],t=M.getFullYear(),n=M.getMonth(),o=M.getDate(),i=new Date(t,n,1).getDay(),s=new Date(t,n+1,0).getDate(),a=new Date,r=a.getFullYear(),l=a.getMonth(),d=a.getDate(),u=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let g="";u.forEach((m,y)=>{g+=`<option value="${y}" ${y===n?"selected":""}>${m}</option>`});let p="";for(let m=r-5;m<=r+5;m++)p+=`<option value="${m}" ${m===t?"selected":""}>${m}</option>`;let f=`
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
        `;for(let m=0;m<i;m++)f+='<div class="smc-day empty"></div>';for(let m=1;m<=s;m++)f+=`<div class="smc-day ${m===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${t}, ${n}, ${m})">${m}</div>`;f+="</div>",e.forEach(m=>{m&&(m.innerHTML=f)})},changeMiniCalendarMonthYear(e,t){let n=M.getDate();const o=new Date(e,parseInt(t)+1,0).getDate();n>o&&(n=o),M=new Date(e,t,n);try{c.setValue("filter-cal-year",e),c.setValue("filter-cal-month",t)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(e,t,n){M=new Date(e,t,n);try{c.setValue("filter-cal-year",e),c.setValue("filter-cal-month",t)}catch{}if(we==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(e,t,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];c.setText("calendar-date-display",`${o[n]} ${t}`);const i=document.getElementById("calendar-month-grid");i.innerHTML="";const s=new Date(t,n,1).getDay(),a=new Date(t,n+1,0).getDate(),r=new Date,l=r.getFullYear()===t&&r.getMonth()===n;new Date(r.getFullYear(),r.getMonth(),1);for(let u=0;u<s;u++)i.innerHTML+='<div class="calendar-day empty"></div>';for(let u=1;u<=a;u++){const g=l&&r.getDate()===u?"today":"";i.innerHTML+=`<div class="calendar-day ${g}" id="cal-day-cell-${u}">
                <div class="calendar-date">${u}</div>
                <div class="calendar-events" id="cal-events-${u}"></div>
            </div>`}this.getLatestRecorrenteAccounts(e).forEach(u=>{if(!u.due_date)return;const g=new Date(t,n,1),p=new Date(r.getFullYear(),r.getMonth(),1);let f=!0;if(u.status==="Off"&&g.getTime()>=p.getTime()&&(f=!1),!!f){for(let m=1;m<=a;m++)if(this.isEventOnDate(u,t,n,m)){const y=document.getElementById(`cal-events-${m}`);if(y){const v=`${t}-${String(n+1).padStart(2,"0")}-${String(m).padStart(2,"0")}`;let I=u.payment_status==="Pago"?"event-paid":u.payment_status==="Pendente"?"event-pending":"event-canceled";u.type==="Recorrente"&&v!==u.due_date&&(I="event-pending");const B=document.createElement("div");B.className=`event-pill event-${u.type.toLowerCase()} ${I}`,B.title=u.company_name,B.innerText=u.company_name,B.onclick=x=>{this.openDedicatedPage(u.id,v)},y.appendChild(B)}}}})},renderCalendarDay(e,t,n,o){const i=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];c.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${i[n]} de ${t}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const a=new Date(t,n,o),r=new Date;r.setHours(0,0,0,0),a.setHours(0,0,0,0);let l=0;this.getLatestRecorrenteAccounts(e).forEach(u=>{let g=!0;if(u.status==="Off"&&a.getTime()>=r.getTime()&&(g=!1),!!g&&this.isEventOnDate(u,t,n,o)){l++;const p=`${t}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let f=u.payment_status==="Pago"?"#4ade80":u.payment_status==="Pendente"?"#facc15":"#ef4444";u.type==="Recorrente"&&p!==u.due_date&&(f="#facc15"),s.innerHTML+=`
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
                `}}),l===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(e,t){c.setText("calendar-date-display",`Ano de ${t}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],i=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const a=new Date(t,s,1);let r=0,l=0,d=0;this.getLatestRecorrenteAccounts(e).forEach(p=>{let f=!0;if(p.status==="Off"&&a.getTime()>=i.getTime()&&(f=!1),!f)return;const m=new Date(t,s+1,0).getDate();for(let y=1;y<=m;y++)this.isEventOnDate(p,t,s,y)&&(r++,p.type==="Recorrente"?l++:d++)});const g=r>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${g}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${r}</strong></p>
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${l}</p>`:""}
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${d}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(e){M.setMonth(e),c.setValue("filter-month",e),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(e=null){document.getElementById("account-form").reset();const t=document.getElementById("account-type");if(t.onchange=()=>{t.value==="Recorrente"?c.show("account-frequency-group"):c.hide("account-frequency-group")},e){c.setText("account-modal-title","Editar Conta");const n=te.find(o=>o.id===e);n&&(c.setValue("account-id",n.id),c.setValue("account-company",n.company_name),c.setValue("account-type",n.type),c.setValue("account-category",n.category||"Outros"),c.setValue("account-frequency",n.frequency||"1 mes"),c.setValue("account-value",parseFloat(n.value||0).toFixed(2)),c.setValue("account-status",n.status),c.setValue("account-payment-status",n.payment_status||"Pendente"),c.setValue("account-due-date",n.due_date||""),c.setValue("account-description",n.description||""),c.setValue("account-observation",n.observation||""),t.onchange())}else c.setText("account-modal-title","Nova Conta"),c.setValue("account-id",""),t.onchange();c.show("account-modal-form")},openDedicatedPage(e,t=null){const n=te.find(p=>p.id===e);if(!n)return;let o=te.filter(p=>p.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((p,f)=>new Date(f.due_date||0)-new Date(p.due_date||0)),c.hide("accounts-section"),c.show("dedicated-account-page"),c.setText("ded-acc-company",n.company_name);let i=0,s=0,a=0;const r=new Date;r.setHours(0,0,0,0),this.currentCompanyHistory.forEach(p=>{const f=parseFloat(p.value||0);if(p.payment_status==="Pago")i+=f,a++;else if(p.payment_status==="Pendente"&&p.due_date){const[m,y,v]=p.due_date.split("-"),I=new Date(parseInt(m,10),parseInt(y,10)-1,parseInt(v,10));I.setHours(0,0,0,0),I.getTime()<r.getTime()&&(s+=f)}});const l=i.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),d=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});c.setText("ded-acc-total-paid","R$ "+l),c.setText("ded-acc-total-pending","R$ "+d),c.setText("ded-acc-total-count",a.toString());const u=document.getElementById("ded-acc-status-badge");n.status==="On"?u.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':u.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,t);const g=document.getElementById("btn-ded-add-history");g&&(g.onclick=()=>{this.openAccountModal(),setTimeout(()=>{c.setValue("account-company",n.company_name),c.setValue("account-type",n.type),c.setValue("account-category",n.category)},100)},K.isAdmin()||(g.style.display="none"))},injectCurrentMonthProjections(e){const t=new Date,n=t.getFullYear(),o=t.getMonth(),i=new Date(n,o+1,0).getDate();let s=null;if(e.forEach(l=>{l.type==="Recorrente"&&(s?new Date(l.due_date||0)>new Date(s.due_date||0)&&(s=l):s=l)}),!s)return e;const a=[...e],r=new Set(e.map(l=>l.due_date));for(let l=1;l<=i;l++)if(this.isEventOnDate(s,n,o,l)){const d=`${n}-${String(o+1).padStart(2,"0")}-${String(l).padStart(2,"0")}`;r.has(d)||a.push({...s,is_projection:!0,due_date:d,payment_status:"Pendente",unique_key:s.id+"_"+d})}return a.forEach(l=>{l.unique_key||(l.unique_key=l.id.toString())}),a},renderDedicatedHistoryList(){const e=document.getElementById("ded-acc-history-list");if(e){if(e.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){e.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(t=>{let n="Sem Data";if(t.due_date){const a=t.due_date.split("-");a.length===3&&(n=`${a[2]}/${a[1]}/${a[0]}`)}const o=parseFloat(t.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let i="#eab308";t.payment_status==="Pago"?i="#4ade80":t.payment_status==="Cancelado"&&(i="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==t.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===t.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(t.id,t.is_projection?t.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${i}22; color: ${i}; font-size: 0.75rem;">${t.payment_status||"Pendente"}</span>
                </div>
            `,e.appendChild(s)})}},selectHistoryItem(e,t=null){this.currentSelectedHistoryKey=t?e+"_"+t:e.toString(),this.renderDedicatedHistoryList();let n=null;if(t&&(n=this.currentCompanyHistory.find(r=>r.id===e&&r.due_date===t&&r.is_projection)),n||(n=this.currentCompanyHistory.find(r=>r.id===e&&!r.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){c.show("ded-acc-details-empty"),c.hide("ded-acc-details-content");return}c.hide("ded-acc-details-empty"),c.show("ded-acc-details-content");let o="DD/MM/YYYY";const i=t||n.due_date;if(i){const r=i.split("-");r.length===3&&(o=`${r[2]}/${r[1]}/${r[0]}`)}c.setText("ded-acc-det-date",o),c.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),c.setValue("ded-acc-det-date-input",i||""),c.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),c.setValue("ded-acc-det-account-status-input",n.status||"On"),c.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(c.show("ded-acc-det-freq-group"),c.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):c.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const r={...n,value:c.getValue("ded-acc-det-val-input"),due_date:c.getValue("ded-acc-det-date-input"),payment_status:c.getValue("ded-acc-det-status-input"),status:c.getValue("ded-acc-det-account-status-input"),observation:c.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?c.getValue("ded-acc-det-freq-input"):"1 mes"};try{await E.put(`/accounts/${n.id}`,r),alert("Fatura atualizada com sucesso!"),await this.fetch(),this.currentCompanyHistory=te.filter(l=>l.company_name===n.company_name).sort((l,d)=>new Date(d.due_date||0)-new Date(l.due_date||0)),this.openDedicatedPage(n.id)}catch{alert("Erro ao atualizar fatura.")}},K.isAdmin()||(s.style.display="none"));const a=document.getElementById("btn-ded-delete-account");a&&(a.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await E.delete(`/accounts/${n.id}`),await this.fetch();const r=te.filter(l=>l.company_name===n.company_name);r.length>0?this.openDedicatedPage(r[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},K.isAdmin()||(a.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(e){document.getElementById("ded-acc-file-input");const t=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),e.attachment_path){c.hide("ded-acc-upload-area"),c.show("ded-acc-preview-area");const n=e.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),i=e.attachment_path.split("/").pop()||"documento";c.setText("ded-acc-preview-name",i);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async r=>{r.preventDefault();const l=s.innerText;s.innerText="Carregando...";try{const d=await fetch(e.attachment_path);if(!d.ok)throw new Error("Doc não encontrado");const u=await d.blob(),g=window.URL.createObjectURL(u);window.open(g,"_blank")}catch(d){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",d)}finally{s.innerText=l}},n?(o.innerHTML="",o.style.backgroundImage=`url('${e.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const a=document.getElementById("btn-ded-remove-attachment");a.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await E.put(`/accounts/${e.id}`,{...e,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=te.filter(r=>r.company_name===e.company_name).sort((r,l)=>new Date(l.due_date||0)-new Date(r.due_date||0)),this.selectHistoryItem(e.id)}catch{alert("Erro ao remover anexo")}},K.isAdmin()||(a.style.display="none")}else{if(c.show("ded-acc-upload-area"),c.hide("ded-acc-preview-area"),K.isAdmin())t.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,t.style.cursor="pointer";else{t.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',t.style.cursor="default";return}t.onclick=s=>{const a=document.getElementById("ded-acc-file-input");a&&s.target!==a&&a.click()},t.addEventListener("dragover",s=>{s.preventDefault(),t.style.borderColor="var(--accent)",t.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{t.style.borderColor="rgba(255,255,255,0.2)",t.style.background="rgba(0,0,0,0.1)"};t.addEventListener("dragleave",()=>{n()});const o=async s=>{if(!s)return;t.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const a=new FormData;a.append("file",s);try{const r=await fetch("/api/upload",{method:"POST",body:a}),l=await r.json();r.ok?(await E.put(`/accounts/${e.id}`,{...e,attachment_path:l.path}),await this.fetch(),this.currentCompanyHistory=te.filter(d=>d.company_name===e.company_name).sort((d,u)=>new Date(u.due_date||0)-new Date(d.due_date||0)),this.selectHistoryItem(e.id)):(alert(l.error||"Erro no upload"),this.selectHistoryItem(e.id))}catch(r){alert("Falha na comunicação: "+r.message),console.error("Upload Error:",r),this.selectHistoryItem(e.id)}};t.addEventListener("drop",async s=>{if(s.preventDefault(),n(),s.dataTransfer.files.length>0){const a=s.dataTransfer.files[0];await o(a)}});const i=document.getElementById("ded-acc-file-input");i&&(i.onclick=s=>{s.stopPropagation()},i.onchange=async s=>{const a=s.target.files[0];await o(a)})}},async save(e){e.preventDefault();const t=c.getValue("account-id"),n={company_name:c.getValue("account-company"),type:c.getValue("account-type"),category:c.getValue("account-category"),value:c.getValue("account-value"),status:c.getValue("account-status"),payment_status:c.getValue("account-payment-status"),due_date:c.getValue("account-due-date"),description:c.getValue("account-description"),observation:c.getValue("account-observation"),frequency:c.getValue("account-type")==="Recorrente"?c.getValue("account-frequency"):"1 mes"};try{const o=t?`/accounts/${t}`:"/accounts";t?await E.put(o,n):await E.post(o,n),c.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(e){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await E.delete(`/accounts/${e}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(e){Z=e,this.renderAccountsList(Tt)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
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
        `;const a=(Z-1)*Ae+1,r=Math.min(Z*Ae,n);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${n}
            </span>
        `,o.innerHTML=i}};let ve=[],re={},ge=null,rt=null,lt=null,dt=!1,Me=!1,He=!1,oe=[],nt=[],yt={},le={},Be,bt,ot,it,_t,at;const Pt={init(){Be=document.getElementById("timeline-event-form"),bt=document.getElementById("view-visualizacao"),ot=document.getElementById("view-attention"),it=document.getElementById("view-anexo"),_t=document.getElementById("view-relatorio"),at=document.getElementById("view-config"),window.timelineHandler=Pt,window.applyFilters=Yt,window.clearFilters=Wt,window.toggleFilters=Jt,window.handleDelete=Ut,window.resetForm=Et,window.toggleAccordion=zt,window.handleFormSubmit=Dt,window.editEvent=wt,window.deleteTopic=tn,window.deleteSubtopic=nn,window.handleTrackDragStart=on,window.handleTrackDragOver=an,window.handleTrackDragEnd=sn;const e=document.getElementById("timeline-topic-form");e&&(e.onsubmit=Zt);const t=document.getElementById("timeline-subtopic-form");t&&(t.onsubmit=en);const n=document.getElementById("topico");n&&(n.onchange=d=>{xt(d.target.value)});const o=document.getElementById("em-ocorrencia");o&&(o.onchange=d=>{const u=document.getElementById("fim"),g=document.getElementById("inicio");if(d.target.checked){if(!g.value){const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),g.value=p.toISOString().slice(0,16)}u.required=!1}else{const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),u.value=p.toISOString().slice(0,16),u.required=!0}});const i=document.getElementById("auto-refresh-toggle");i&&(i.onchange=d=>{Nt(d.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(d=>{d.onclick=u=>{const g=u.currentTarget.getAttribute("data-timeline-tab");qe(g)}}),Be&&(Be.onsubmit=Dt);const s=document.getElementById("rep-filter-start"),a=document.getElementById("rep-filter-end"),r=document.getElementById("rep-filter-topic"),l=document.getElementById("rep-filter-subtopic");s&&(s.onchange=()=>ze()),a&&(a.onchange=()=>ze()),r&&(r.onchange=d=>{Xt(d.target.value),ze()}),l&&(l.onchange=()=>ze()),window._timelineSectionChangeHandler&&window.removeEventListener("SectionChange",window._timelineSectionChangeHandler),window._timelineSectionChangeHandler=d=>{d.detail&&d.detail.section==="timeline"&&be().then(()=>{ce(),St()})},window.addEventListener("SectionChange",window._timelineSectionChangeHandler),be().then(()=>{ce(),St()})}};window._timelineFocusHandler&&window.removeEventListener("focus",window._timelineFocusHandler);window._timelineFocusHandler=()=>{bt&&ce()};window.addEventListener("focus",window._timelineFocusHandler);function xt(e,t=null){const n=document.getElementById("sub-topico");if(!n)return;const o=e?e.toLowerCase().trim():"";if(!o||!le[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',le[o].forEach(i=>{const s=document.createElement("option");s.value=i.toLowerCase(),s.textContent=i,t&&s.value===t.toLowerCase()&&(s.selected=!0),n.appendChild(s)}),t||(n.selectedIndex=1),n.classList.add("has-options")}async function be(){try{const e=await fetch("/api/timeline/config");if(!e.ok)throw new Error("Falha ao buscar configurações");const t=await e.json();oe=t.topics||[],nt=t.subtopics||[],yt={},le={},oe.forEach(o=>{yt[o.id]=o.color,le[o.id]=[]}),nt.forEach(o=>{const i=o.topic_id;le[i]&&le[i].push(o.name)}),Gt();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&Ot()}catch(e){console.error("Error loading config:",e)}}function Gt(){const e=document.getElementById("topico");if(e){const o=e.value;e.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',oe.forEach(i=>{const s=document.createElement("option");s.value=i.id,s.textContent=i.name,e.appendChild(s)}),e.value=o}const t=document.getElementById("rep-filter-topic");if(t){const o=t.value;t.innerHTML='<option value="Todos">Todos</option>',oe.forEach(i=>{const s=document.createElement("option");s.value=i.id,s.textContent=i.name,t.appendChild(s)}),o&&[...t.options].some(i=>i.value===o)?t.value=o:t.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',oe.forEach(o=>{const i=document.createElement("option");i.value=o.id,i.textContent=o.name,n.appendChild(i)}))}function ce(){fetch("/api/timeline/events").then(e=>{if(!e.ok)throw new Error("Failed to fetch");return e.json()}).then(e=>{ve=e,$t(),ot&&ot.classList.contains("active")&&Ft()}).catch(e=>{console.error("Error loading events:",e)})}function St(){const e=document.getElementById("timeline-tab-anexo"),t=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())e&&e.classList.remove("role-hidden"),t&&t.classList.remove("role-hidden");else{e&&e.classList.add("role-hidden"),t&&t.classList.add("role-hidden");const o=it&&it.classList.contains("active"),i=at&&at.classList.contains("active");(o||i)&&qe("visualizacao")}}function qe(e){const t={visualizacao:{section:bt,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:ot,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:it,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:_t,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:at,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(t).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),t[e]&&(t[e].section&&t[e].section.classList.add("active"),t[e].button&&t[e].button.classList.add("active")),e==="visualizacao"?(ce(),Re(!0)):e==="attention"?(Ft(),Re(!0)):e==="relatorio"?(ze(),Re(!1)):(e==="config"&&Ot(),Re(!1))}function Re(e){const t=document.getElementById("floating-refresh-control");if(t)if(e){t.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!ge&&Nt(!0)}else t.classList.add("hidden"),ge&&(clearInterval(ge),ge=null)}function Nt(e){ge&&(clearInterval(ge),ge=null),e&&(ce(),ge=setInterval(ce,6e4))}function Dt(e){if(e.preventDefault(),dt){console.warn("[Timeline] O salvamento já está em andamento. Ignorando envio duplicado.");return}dt=!0;const t=Be.querySelector('button[type="submit"]');t&&(t.textContent="Salvando...",t.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async i=>{const s=await i.text();if(!i.ok)throw new Error(`Server error (${i.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),Et(),qe("visualizacao")}).catch(i=>{console.error("Error saving event:",i),alert("Erro ao salvar evento: "+i.message)}).finally(()=>{t&&(t.textContent="Salvar Evento",t.disabled=!1),dt=!1})}function wt(e){const t=ve.find(s=>s.id===e);if(!t)return;document.getElementById("event-id").value=t.id,document.getElementById("nome").value=t.nome;const n=Fe(t.topico);document.getElementById("topico").value=n,xt(n,t.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=t.em_ocorrencia==1||t.em_ocorrencia==="true"||!t.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=t.inicio,document.getElementById("fim").value=t.fim||"",document.getElementById("descricao").value=t.descricao||"",document.getElementById("anotacao").value=t.anotacao||"",document.getElementById("cor").value=t.cor||"#000000",qe("anexo");const i=document.getElementById("btn-delete");i&&(i.style.display="block")}function Et(){Be&&Be.reset();const e=document.getElementById("event-id");e&&(e.value=""),xt("");const t=document.getElementById("fim");t&&(t.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function Ut(){const e=document.getElementById("event-id").value;e&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Failed to delete");return t.json()}).then(()=>{alert("Evento excluído!"),Et(),qe("visualizacao")}).catch(t=>{console.error("Error deleting:",t),alert("Erro ao excluir: "+t.message)})}function Yt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`),i=t&&t.value?new Date(t.value).getTime():null,s=n&&n.value?new Date(n.value).getTime():null,a=o?o.value:"";re[e]={start:i,end:s,subTopic:a},$t()}function Wt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`);t&&(t.value=""),n&&(n.value=""),o&&(o.value=""),re[e]=null,$t()}function Jt(e){const t=document.getElementById(`filters-panel-${e}`),n=document.getElementById(`btn-toggle-${e}`);t&&n&&(t.classList.toggle("hidden"),n.classList.toggle("active"))}function zt(e){const t=document.getElementById(e);t&&t.classList.toggle("active")}function $t(){const e=document.getElementById("timeline-tracks-container");if(!e)return;const t=Array.from(e.querySelectorAll(".timeline-container")).map(i=>i.dataset.topicId),n=oe.map(i=>i.id);if(t.length!==n.length||!n.every(i=>t.includes(i))){e.innerHTML="";const i=window.auth&&window.auth.isAdmin(),s=i?'style="cursor: grab;"':"";oe.forEach(a=>{const r=`
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
            `;e.insertAdjacentHTML("beforeend",r);const l=document.getElementById(`filter-sub-topic-${a.id}`);l&&le[a.id]&&le[a.id].forEach(d=>{const u=document.createElement("option");u.value=d.toLowerCase(),u.textContent=d,l.appendChild(u)})})}oe.forEach(i=>{const s=document.getElementById(`track-${i.id}`),a=document.getElementById(`min-date-${i.id}`),r=document.getElementById(`max-date-${i.id}`);s&&(s.innerHTML=""),a&&(a.textContent=""),r&&(r.textContent="")}),ve.length!==0&&oe.forEach(i=>{const s=i.id,a=ve.filter(v=>Fe(v.topico)===s);let r=a;re[s]&&re[s].subTopic&&(r=a.filter(v=>(v.sub_topico?v.sub_topico.toLowerCase():"")===re[s].subTopic.toLowerCase()));const l=re[s]&&re[s].start?re[s].start:new Date("2026-01-01T00:00:00").getTime(),d=re[s]&&re[s].end?re[s].end:Date.now();Qt(s,r,l,d);const u=l,g=d,p=g-u,f=document.getElementById(`min-date-${s}`),m=document.getElementById(`max-date-${s}`);f&&(f.textContent=new Date(u).toLocaleDateString()+" "+new Date(u).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),m&&(m.textContent=new Date(g).toLocaleDateString()+" "+new Date(g).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const y=document.getElementById(`track-${s}`);y&&r.forEach(v=>{const I=new Date(v.inicio).getTime(),B=v.fim?new Date(v.fim).getTime():Date.now();if(B<u||I>g)return;const x=Math.max(I,u),w=Math.min(B,g),$=(x-u)/p*100,b=(w-x)/p*100;if(b<=0)return;const D=document.createElement("div");D.className="timeline-bar",D.style.left=`${$}%`,D.style.width=`${b}%`,D.style.color=v.cor&&v.cor!=="#000000"?v.cor:yt[s]||"#6b7280";const k=document.createElement("div");k.className="timeline-bar-visual",D.appendChild(k);const R=document.createElement("div");R.className="timeline-identifier-point";const V=new Date(v.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),q=v.fim?new Date(v.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",G=i.name,A=v.sub_topico?v.sub_topico.charAt(0).toUpperCase()+v.sub_topico.slice(1):"-";R.setAttribute("data-tooltip",`Tópico: ${G}
Eventos: ${A}
Início: ${V} - Fim: ${q}
Descrição: ${v.descricao||"-"}`),!v.fim&&R.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(R.style.cursor="pointer",R.onclick=z=>{z.stopPropagation(),wt(v.id)}):R.style.cursor="default",D.appendChild(R),y.appendChild(D)})})}function Fe(e){return e?e.toLowerCase().trim():""}function Qt(e,t,n,o){const i=document.getElementById(`sla-${e}`);if(!i)return;const s=o-n;if(s<=0){i.textContent="N/A";return}const r=t.filter(p=>{const f=new Date(p.inicio).getTime();return(p.fim?new Date(p.fim).getTime():Date.now())>n&&f<o}).map(p=>({start:Math.max(new Date(p.inicio).getTime(),n),end:Math.min(p.fim?new Date(p.fim).getTime():Date.now(),o)}));r.sort((p,f)=>p.start-f.start);const l=[];if(r.length>0){let p=r[0];for(let f=1;f<r.length;f++){const m=r[f];m.start<p.end?p.end=Math.max(p.end,m.end):(l.push(p),p=m)}l.push(p)}let d=0;l.forEach(p=>{d+=p.end-p.start});const u=(s-d)/s*100;let g="#10b981";u<50?g="#ef4444":u<90&&(g="#f97316"),i.style.color=g,i.textContent=u.toFixed(4)+"%"}function Ft(){const e=document.getElementById("attention-topics-container");if(!e)return;e.innerHTML="";const t=ve.filter(n=>!n.fim);oe.forEach(n=>{const o=n.id,i=t.filter(y=>Fe(y.topico)===o),s=document.createElement("div");s.className=i.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const a=document.createElement("div");a.className="accordion-header",a.onclick=()=>zt(`attn-acc-${o}`);const r=document.createElement("div");r.className="accordion-title-group";const l=document.createElement("div");l.className="topic-indicator",l.style.backgroundColor=n.color;const d=document.createElement("h3");d.textContent=n.name;const u=document.createElement("span");u.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",u.textContent=`${i.length}`,r.appendChild(l),r.appendChild(d),r.appendChild(u);const g=document.createElement("span");g.className="accordion-chevron",g.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',a.appendChild(r),a.appendChild(g);const p=document.createElement("div");p.className="accordion-content";const f=document.createElement("div");f.className="accordion-body";const m=document.createElement("div");if(m.className="attention-carousel",i.length===0){const y=document.createElement("div");y.className="empty-state",y.textContent="Nenhum evento em andamento.",m.appendChild(y)}else i.forEach(y=>{const v=document.createElement("div");v.className="attention-card",v.style.borderLeftColor=y.cor&&y.cor!=="#000000"?y.cor:n.color;const I=document.createElement("h3");I.textContent=y.nome;const B=document.createElement("div");B.className="sub-topic",B.textContent=y.sub_topico||"-";const x=document.createElement("div");x.className="card-detail",x.innerHTML=`<strong>Início:</strong> ${new Date(y.inicio).toLocaleString()}`;const w=Date.now()-new Date(y.inicio).getTime(),$=document.createElement("div");$.className="card-duration",$.innerHTML=`<strong>Tempo:</strong> <span>${Kt(w)}</span>`;const b=document.createElement("div");b.className="card-description",b.textContent=y.descricao||"-",v.appendChild(I),v.appendChild(B),v.appendChild(x),v.appendChild($),v.appendChild(b),window.auth&&window.auth.isAdmin()?(v.style.cursor="pointer",v.onclick=()=>wt(y.id)):v.style.cursor="default",m.appendChild(v)});f.appendChild(m),p.appendChild(f),s.appendChild(a),s.appendChild(p),e.appendChild(s)})}function Kt(e){if(e<0)return"0s";const t=Math.floor(e/1e3),n=Math.floor(t/60),o=Math.floor(n/60),i=Math.floor(o/24),s=[];return i>0&&s.push(`${i}d`),(o%24>0||i>0)&&s.push(`${o%24}h`),(n%60>0||o>0)&&s.push(`${n%60}m`),s.push(`${t%60}s`),s.join(" ")}function Xt(e){const t=document.getElementById("rep-filter-subtopic");if(!t)return;t.innerHTML='<option value="Todos">Todos</option>';const n=e?e.toLowerCase().trim():"";n&&le[n]&&le[n].forEach(o=>{const i=document.createElement("option");i.value=o.toLowerCase(),i.textContent=o,t.appendChild(i)})}function ze(){let e=ve;const t=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,i=document.getElementById("rep-filter-subtopic")?.value;if(t){const b=new Date(t+"T00:00:00").getTime();e=e.filter(D=>new Date(D.inicio).getTime()>=b)}if(n){const b=new Date(n+"T23:59:59").getTime();e=e.filter(D=>new Date(D.inicio).getTime()<=b)}o&&o!=="Todos"&&(e=e.filter(b=>Fe(b.topico)===o.toLowerCase())),i&&i!=="Todos"&&(e=e.filter(b=>b.sub_topico&&b.sub_topico.toLowerCase()===i.toLowerCase()));const s=document.getElementById("rep-kpi-total"),a=document.getElementById("rep-kpi-active"),r=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=e.length);const l=e.filter(b=>b.em_ocorrencia==1||b.em_ocorrencia==="true"||!b.fim);a&&(a.textContent=l.length);const d=e.filter(b=>b.fim);let u="0h 0m";if(d.length>0){const D=d.reduce((q,G)=>q+(new Date(G.fim).getTime()-new Date(G.inicio).getTime()),0)/d.length,k=Math.floor(D/6e4),R=Math.floor(k/60),V=k%60;u=`${R}h ${V}m`}if(r&&(r.textContent=u),!window.Chart){console.warn("Chart.js is not loaded.");return}const g=oe,p=t?new Date(t+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),f=n?new Date(n+"T23:59:59").getTime():Date.now(),m=g.map(b=>b.name),y=g.map(b=>{const D=b.id,k=ve.filter(h=>Fe(h.topico)===D),R=f-p;if(R<=0)return 100;const q=k.filter(h=>{const C=new Date(h.inicio).getTime();return(h.fim?new Date(h.fim).getTime():Date.now())>p&&C<f}).map(h=>({start:Math.max(new Date(h.inicio).getTime(),p),end:Math.min(h.fim?new Date(h.fim).getTime():Date.now(),f)}));q.sort((h,C)=>h.start-C.start);const G=[];if(q.length>0){let h=q[0];for(let C=1;C<q.length;C++){const T=q[C];T.start<h.end?h.end=Math.max(h.end,T.end):(G.push(h),h=T)}G.push(h)}const O=(h=>{let C=0;return h.forEach(T=>{C+=T.end-T.start}),C})(G),z=(R-O)/R*100;return parseFloat(z.toFixed(4))}),v=g.map(b=>b.color||"#6b7280"),I=document.getElementById("chart-rep-sla");I&&(rt&&rt.destroy(),rt=new window.Chart(I,{type:"bar",data:{labels:m,datasets:[{label:"Disponibilidade %",data:y,backgroundColor:v,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...y)-5),max:100,ticks:{callback:b=>b+"%"}}}}}));const B={};e.forEach(b=>{const D=b.sub_topico?b.sub_topico.charAt(0).toUpperCase()+b.sub_topico.slice(1).toLowerCase():"Não especificado";B[D]=(B[D]||0)+1});const x=Object.keys(B),w=Object.values(B),$=document.getElementById("chart-rep-qty");$&&(lt&&lt.destroy(),lt=new window.Chart($,{type:"doughnut",data:{labels:x.length>0?x:["Nenhum evento"],datasets:[{data:w.length>0?w:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function Zt(e){if(e.preventDefault(),Me)return;Me=!0;const t=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!t||!n||!o){Me=!1;return}const i={id:t.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!i.id){alert("Por favor, defina um ID para o tópico."),Me=!1;return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>(alert("Tópico salvo com sucesso!"),t.value="",n.value="",o.value="#3b82f6",be().then(()=>{ce()}))).catch(s=>{console.error(s),alert("Erro: "+s.message)}).finally(()=>{Me=!1})}function en(e){if(e.preventDefault(),He)return;He=!0;const t=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!t||!n){He=!1;return}const o={topic_id:t.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento."),He=!1;return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(i=>{if(!i.ok)throw new Error("Erro ao adicionar evento");return i.json()}).then(()=>(alert("Evento adicionado!"),n.value="",be())).catch(i=>{console.error(i),alert("Erro: "+i.message)}).finally(()=>{He=!1})}function tn(e){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir tópico");return t.json()}).then(()=>{alert("Tópico excluído!"),be().then(()=>{ce()})}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function nn(e){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir evento");return t.json()}).then(()=>{alert("Evento excluído!"),be()}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function Ot(){const e=document.getElementById("config-topics-list");e&&(e.innerHTML="",oe.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':oe.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(o)}));const t=document.getElementById("config-subtopics-list");t&&(t.innerHTML="",nt.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':nt.forEach(n=>{const o=oe.find(r=>r.id===n.topic_id),i=o?o.name:n.topic_id,s=o?o.color:"#6b7280",a=document.createElement("div");a.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",a.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${i}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(a)}))}function on(e,t){e.currentTarget.classList.add("dragging"),e.dataTransfer.effectAllowed="move"}function an(e){e.preventDefault();const t=document.querySelector(".timeline-container.dragging");if(!t)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const i=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const a=s.getBoundingClientRect();return e.clientY<=a.top+a.height/2});i?n.insertBefore(t,i):n.appendChild(t)}function sn(e){const t=document.querySelector(".timeline-container.dragging");t&&t.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(i=>{i.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(i=>i.dataset.topicId);rn(o)}function rn(e){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:e})}).then(t=>{if(!t.ok)throw new Error("Erro ao salvar nova ordenação");return t.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),be().then(()=>{ce()})}).catch(t=>{console.error(t),alert("Erro ao salvar ordenação: "+t.message)})}let Ee=[],ct=[],ut=[],pt=[],F="extensions",U=1,$e=100,gt=[];const _e={setActiveTab(e){F=e,U=1;const t=document.getElementById("telephony-search");t&&(t.value="",e==="extensions"?t.placeholder="Pesquisar ramais por número, nome ou usuário...":e==="queues"?t.placeholder="Pesquisar filas por número ou nome...":e==="blf"?t.placeholder="Pesquisar BLF por nome...":e==="users"&&(t.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(s=>{s.id===`tab-telephony-${e}`?s.classList.add("active"):s.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(s=>{s.id===`telephony-view-${e==="users"?"users":e==="queues"?"queues":e}`?s.classList.remove("hidden"):s.classList.add("hidden")});const i=this.getActiveDataList();this.render(i)},getActiveDataList(){return F==="extensions"?Ee:F==="queues"?ct:F==="blf"?ut:F==="users"?pt:[]},async fetch(){const e=this.getActiveTableBody();e&&(e.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(U=1,F==="extensions")Ee=await E.get("/telephony/extensions"),this.render(Ee);else if(F==="queues")ct=await E.get("/telephony/queues"),this.render(ct);else if(F==="blf"){if(Ee.length===0)try{Ee=await E.get("/telephony/extensions")}catch(t){console.warn("Could not pre-fetch extensions for BLF mapping:",t)}ut=await E.get("/telephony/blfs"),this.render(ut)}else F==="users"&&(pt=await E.get("/telephony/users"),this.render(pt))}catch(t){console.error(`Error fetching telephony ${F}:`,t),e&&(e.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${t.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return F==="extensions"?document.getElementById("telephony-table-body"):F==="queues"?document.getElementById("telephony-queues-table-body"):F==="blf"?document.getElementById("telephony-blf-table-body"):F==="users"?document.getElementById("telephony-users-table-body"):null},render(e){const t=this.getActiveTableBody();if(!t)return;gt=e;const n=e.length,o=Math.ceil(n/$e);U>o&&(U=Math.max(1,o)),U<1&&(U=1);const i=(U-1)*$e,s=e.slice(i,i+$e);if(s.length===0){const a=F==="extensions"?7:F==="queues"?6:F==="blf"?4:5;t.innerHTML=`
                <tr>
                    <td colspan="${a}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}F==="extensions"?this.renderExtensionsList(t,s):F==="queues"?this.renderQueuesList(t,s):F==="blf"?this.renderBlfsList(t,s):F==="users"&&this.renderUsersList(t,s),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",i=n.nome||"-",s=n.ddr||"-",a=n.Username||"-",r=n.Secret||"",l=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",d=n.observacao||"-",u=r.replace(/'/g,"\\'");return`
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
                    <td>${s}</td>
                    <td><strong style="color: var(--accent);">${a}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 140px;">
                            <span id="secret-txt-${n.id}" style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleSecret(${n.id}, '${u}')" title="Mostrar/Ocultar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg id="secret-icon-${n.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${l}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${d}">${d}</td>
                </tr>
            `}).join("")},renderQueuesList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",i=n.nome||"-",s=n.Estrategia||"-",a=n.TimeoutAgente?`${n.TimeoutAgente}s`:"-",r=n.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',l=n.membros?n.membros.length:0,d=n.membros&&n.membros.length>0?n.membros.map(u=>`
                    <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span style="font-size: 0.85rem; font-weight: 500;">${u.extensao_numero} - ${u.extensao_nome}</span>
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
                    <td><strong>${i}</strong></td>
                    <td style="text-transform: capitalize;">${s}</td>
                    <td>${a}</td>
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
                            ${d}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderBlfsList(e,t){e.innerHTML=t.map(n=>{const o=n.id,i=n.Nome||"-",s=n.quantidade_extensoes||0,a=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",r=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(l=>{const d=Ee.find(p=>p.id===l||p.extensao_id===l),u=d?d.exten:`ID ${l}`,g=d?d.nome:"Não encontrado";return`
                        <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span style="font-size: 0.85rem; font-weight: 500;">${u} - ${g}</span>
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
            `}).join("")},renderUsersList(e,t){e.innerHTML=t.map(n=>{const o=n.username||"-",i=n.email||"-",s=n.Tipo||"-",a=n.is_active?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Ativo</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Inativo</span>';return`
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
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleUserSecret(${n.id})" title="Mostrar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${a}</td>
                </tr>
            `}).join("")},toggleQueueRow(e){const t=document.getElementById(`queue-details-${e}`),n=document.getElementById(`queue-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(e){const t=document.getElementById(`blf-details-${e}`),n=document.getElementById(`blf-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(e){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(e){U=1;const n=this.getActiveDataList().filter(o=>F==="extensions"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Username||"").toLowerCase().includes(e)||(o.ddr||"").toLowerCase().includes(e)||(o.observacao||"").toLowerCase().includes(e):F==="queues"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Estrategia||"").toLowerCase().includes(e):F==="blf"?(o.Nome||"").toLowerCase().includes(e):F==="users"?(o.username||"").toLowerCase().includes(e)||(o.email||"").toLowerCase().includes(e)||(o.Tipo||"").toLowerCase().includes(e):!1);this.render(n)},changePage(e){U=e,this.render(gt)},setPageSize(e){$e=parseInt(e,10),U=1,this.render(gt)},toggleSecret(e,t){const n=document.getElementById(`secret-txt-${e}`),o=document.getElementById(`secret-icon-${e}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=t,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let i="";i+=`
            <button class="pagination-btn" 
                    ${U===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${U-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=U-1&&l<=U+1)&&(s&&l-s>1&&(i+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),i+=`
                    <button class="pagination-btn ${l===U?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);i+=`
            <button class="pagination-btn" 
                    ${U===t?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${U+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const a=(U-1)*$e+1,r=Math.min(U*$e,n);i+=`
            <span class="pagination-info">
                Exibindo ${a}-${r} de ${n}
            </span>
        `,o.innerHTML=i}},Pe=30;let Ne="",mt="all",Ue="",Ye="",ie=1,ke=0,Y="alerts",ne="switches",H=null,ft=[],At=[],Mt=[],Ht=[],Rt=[],ae=[],We=null,Je=null,Qe=null,Ke=null,Xe=null,Ze=null,et=null,Ie=!1;const kt={init(){console.log("📊 [MONITORING] Initializing monitoringHandler...");const e=document.getElementById("tab-monitoring-alerts");e&&e.addEventListener("click",()=>this.setActiveTab("alerts"));const t=document.getElementById("tab-monitoring-events");t&&t.addEventListener("click",()=>this.setActiveTab("events"));const n=document.getElementById("tab-monitoring-apis");n&&n.addEventListener("click",()=>this.setActiveTab("apis"));const o=document.getElementById("tab-monitoring-gnew");o&&o.addEventListener("click",()=>this.setActiveTab("gnew"));const i=document.getElementById("tab-monitoring-infra");i&&i.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Infraestrutura tab"),this.setActiveTab("infra")});const s=document.getElementById("tab-monitoring-network");s&&s.addEventListener("click",()=>this.setActiveTab("network"));const a=document.getElementById("tab-infra-switches");a&&a.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Switches subtab"),this.setInfraTab("switches")});const r=document.getElementById("tab-infra-routers");r&&r.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Routers subtab"),this.setInfraTab("routers")});const l=document.getElementById("tab-infra-nas");l&&l.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on NAS subtab"),this.setInfraTab("nas")});const d=document.getElementById("tab-infra-cameras");d&&d.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Cameras subtab"),this.setInfraTab("cameras")});const u=document.getElementById("tab-infra-servers");u&&u.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Servers subtab"),this.setInfraTab("servers")});const g=document.getElementById("btn-refresh-switches-status");g&&g.addEventListener("click",()=>this.fetchAndRenderSwitchesStatus(!0));const p=document.getElementById("btn-refresh-routers-status");p&&p.addEventListener("click",()=>this.fetchAndRenderRoutersStatus(!0));const f=document.getElementById("btn-refresh-nas-status");f&&f.addEventListener("click",()=>this.fetchAndRenderNasStatus(!0));const m=document.getElementById("btn-refresh-cameras-status");m&&m.addEventListener("click",()=>this.fetchAndRenderCamerasStatus(!0));const y=document.getElementById("btn-refresh-servers-status");y&&y.addEventListener("click",()=>this.fetchAndRenderServersStatus(!0));const v=document.getElementById("servers-search");v&&v.addEventListener("input",()=>{this.renderServersAccordion(ae)});const I=document.getElementById("btn-toggle-server-filters");I&&I.addEventListener("click",()=>{const L=I.closest(".server-filters-accordion");L&&L.classList.toggle("active")}),["filter-type-physical","filter-type-virtual","filter-platform-win2019","filter-platform-win2025","filter-platform-linux","filter-activity-online","filter-activity-offline"].forEach(L=>{const se=document.getElementById(L);se&&se.addEventListener("change",()=>{this.renderServersAccordion(ae)})});const x=document.getElementById("monitoring-events-search-input");x&&x.addEventListener("input",L=>{Ne=L.target.value.toLowerCase(),ie=1,this.fetchAndRenderEventHistory()});const w=document.getElementById("monitoring-search-input");w&&w.addEventListener("input",()=>{this.renderGnewServicesStatus()});const $=document.getElementById("monitoring-events-severity-filter");$&&$.addEventListener("change",L=>{mt=L.target.value,ie=1,this.fetchAndRenderEventHistory()});const b=document.getElementById("monitoring-events-date-start"),D=document.getElementById("monitoring-events-date-end");b&&b.addEventListener("change",L=>{Ue=L.target.value,ie=1,this.fetchAndRenderEventHistory()}),D&&D.addEventListener("change",L=>{Ye=L.target.value,ie=1,this.fetchAndRenderEventHistory()});const k=document.getElementById("btn-clear-event-date-filter");k&&k.addEventListener("click",()=>{Ue="",Ye="",ie=1,b&&(b.value=""),D&&(D.value=""),this.fetchAndRenderEventHistory()});const R=document.getElementById("btn-clear-event-history");R&&R.addEventListener("click",()=>this.clearEventHistory());const V=document.getElementById("btn-refresh-monitoring");V&&V.addEventListener("click",()=>this.fetchDiagnostics());const q=document.getElementById("gnew-disk-accordion-header");q&&q.addEventListener("click",()=>{const L=document.getElementById("gnew-disk-accordion-content"),se=document.getElementById("gnew-disk-chevron");L&&se&&(L.style.maxHeight==="0px"?(L.style.maxHeight="1000px",se.style.transform="rotate(0deg)"):(L.style.maxHeight="0px",se.style.transform="rotate(-90deg)"))});const G=document.getElementById("btn-refresh-gnew-disk");G&&G.addEventListener("click",L=>{L.stopPropagation(),this.fetchDiagnostics()});const A=document.getElementById("btn-refresh-gnew-services");A&&A.addEventListener("click",async()=>{const L=A,se=L.querySelector("svg");if(!L.disabled){L.disabled=!0,L.style.opacity="0.6",L.style.cursor="not-allowed",se&&(se.style.animation="spin 0.8s linear infinite");try{await this.fetchDiagnostics()}finally{L.disabled=!1,L.style.opacity="",L.style.cursor="pointer",se&&(se.style.animation="")}}});const O=document.getElementById("btn-refresh-apis-status");O&&O.addEventListener("click",()=>this.fetchAndRenderApisStatus());const z=document.getElementById("monitoring-auto-refresh");z&&(z.addEventListener("change",L=>{L.target.checked?this._startAutoRefresh():this._stopAutoRefresh()}),z.checked&&this._startAutoRefresh());const h=document.getElementById("switches-auto-refresh");h&&(h.addEventListener("change",L=>{L.target.checked?this._startSwitchesAutoRefresh():this._stopSwitchesAutoRefresh()}),h.checked&&this._startSwitchesAutoRefresh());const C=document.getElementById("routers-auto-refresh");C&&(C.addEventListener("change",L=>{L.target.checked?this._startRoutersAutoRefresh():this._stopRoutersAutoRefresh()}),C.checked&&this._startRoutersAutoRefresh());const T=document.getElementById("nas-auto-refresh");T&&(T.addEventListener("change",L=>{L.target.checked?this._startNasAutoRefresh():this._stopNasAutoRefresh()}),T.checked&&this._startNasAutoRefresh());const _=document.getElementById("cameras-auto-refresh");_&&(_.addEventListener("change",L=>{L.target.checked?this._startCamerasAutoRefresh():this._stopCamerasAutoRefresh()}),_.checked&&this._startCamerasAutoRefresh());const P=document.getElementById("servers-auto-refresh");P&&(P.addEventListener("change",L=>{L.target.checked?this._startServersAutoRefresh():this._stopServersAutoRefresh()}),P.checked&&this._startServersAutoRefresh());const N=document.getElementById("btn-refresh-network-status");N&&N.addEventListener("click",()=>this.fetchAndRenderNetworkStatus(!0));const X=document.getElementById("network-auto-refresh");X&&(X.addEventListener("change",L=>{L.target.checked?this._startNetworkAutoRefresh():this._stopNetworkAutoRefresh()}),X.checked&&this._startNetworkAutoRefresh()),window.monitoringHandler=this},_startAutoRefresh(){this._stopAutoRefresh(),We=setInterval(()=>{(Y==="alerts"||Y==="gnew")&&this.fetchDiagnostics()},3e4)},_stopAutoRefresh(){We&&(clearInterval(We),We=null)},_startSwitchesAutoRefresh(){this._stopSwitchesAutoRefresh(),Je=setInterval(()=>{Y==="infra"&&ne==="switches"&&this.fetchAndRenderSwitchesStatus(!1,!0)},6e4)},_stopSwitchesAutoRefresh(){Je&&(clearInterval(Je),Je=null)},_startNetworkAutoRefresh(){this._stopNetworkAutoRefresh(),et=setInterval(()=>{Y==="network"&&this.fetchAndRenderNetworkStatus(!1)},3e4)},_stopNetworkAutoRefresh(){et&&(clearInterval(et),et=null)},_startRoutersAutoRefresh(){this._stopRoutersAutoRefresh(),Qe=setInterval(()=>{Y==="infra"&&ne==="routers"&&this.fetchAndRenderRoutersStatus(!1,!0)},6e4)},_stopRoutersAutoRefresh(){Qe&&(clearInterval(Qe),Qe=null)},_startNasAutoRefresh(){this._stopNasAutoRefresh(),Ke=setInterval(()=>{Y==="infra"&&ne==="nas"&&this.fetchAndRenderNasStatus(!1,!0)},6e4)},_stopNasAutoRefresh(){Ke&&(clearInterval(Ke),Ke=null)},_startCamerasAutoRefresh(){this._stopCamerasAutoRefresh(),Xe=setInterval(()=>{Y==="infra"&&ne==="cameras"&&this.fetchAndRenderCamerasStatus(!1,!0)},6e4)},_stopCamerasAutoRefresh(){Xe&&(clearInterval(Xe),Xe=null)},_startServersAutoRefresh(){this._stopServersAutoRefresh(),Ze=setInterval(()=>{Y==="infra"&&ne==="servers"&&this.fetchAndRenderServersStatus(!1,!0)},6e4)},_stopServersAutoRefresh(){Ze&&(clearInterval(Ze),Ze=null)},fetch(){this.setActiveTab("alerts"),this.fetchDiagnostics()},setActiveTab(e){Y=e;const t=document.getElementById("tab-monitoring-alerts"),n=document.getElementById("tab-monitoring-events"),o=document.getElementById("tab-monitoring-apis"),i=document.getElementById("tab-monitoring-gnew"),s=document.getElementById("tab-monitoring-infra"),a=document.getElementById("tab-monitoring-network");t&&t.classList.toggle("active",e==="alerts"),n&&n.classList.toggle("active",e==="events"),o&&o.classList.toggle("active",e==="apis"),i&&i.classList.toggle("active",e==="gnew"),s&&s.classList.toggle("active",e==="infra"),a&&a.classList.toggle("active",e==="network");const r=document.getElementById("monitoring-tab-content-alerts"),l=document.getElementById("monitoring-tab-content-events"),d=document.getElementById("monitoring-tab-content-apis"),u=document.getElementById("monitoring-tab-content-gnew"),g=document.getElementById("monitoring-tab-content-infra"),p=document.getElementById("monitoring-tab-content-network");r&&(r.classList.toggle("hidden",e!=="alerts"),r.classList.toggle("active",e==="alerts")),l&&(l.classList.toggle("hidden",e!=="events"),l.classList.toggle("active",e==="events")),d&&(d.classList.toggle("hidden",e!=="apis"),d.classList.toggle("active",e==="apis")),u&&(u.classList.toggle("hidden",e!=="gnew"),u.classList.toggle("active",e==="gnew")),g&&(g.classList.toggle("hidden",e!=="infra"),g.classList.toggle("active",e==="infra")),p&&(p.classList.toggle("hidden",e!=="network"),p.classList.toggle("active",e==="network")),e==="gnew"?this.fetchDiagnostics():e==="events"?(ie=1,this.fetchAndRenderEventHistory()):e==="apis"?this.fetchAndRenderApisStatus():e==="infra"?this.setInfraTab(ne):e==="network"?this.fetchAndRenderNetworkStatus():this.renderGnewServicesStatus()},setInfraTab(e){console.log("📊 [MONITORING] setInfraTab called with:",e),ne=e;const t=document.getElementById("tab-infra-switches"),n=document.getElementById("tab-infra-routers"),o=document.getElementById("tab-infra-nas"),i=document.getElementById("tab-infra-cameras"),s=document.getElementById("tab-infra-servers");t&&t.classList.toggle("active",e==="switches"),n&&n.classList.toggle("active",e==="routers"),o&&o.classList.toggle("active",e==="nas"),i&&i.classList.toggle("active",e==="cameras"),s&&s.classList.toggle("active",e==="servers");const a=document.getElementById("infra-tab-content-switches"),r=document.getElementById("infra-tab-content-routers"),l=document.getElementById("infra-tab-content-nas"),d=document.getElementById("infra-tab-content-cameras"),u=document.getElementById("infra-tab-content-servers");a&&(a.classList.toggle("hidden",e!=="switches"),a.classList.toggle("active",e==="switches")),r&&(r.classList.toggle("hidden",e!=="routers"),r.classList.toggle("active",e==="routers")),l&&(l.classList.toggle("hidden",e!=="nas"),l.classList.toggle("active",e==="nas")),d&&(d.classList.toggle("hidden",e!=="cameras"),d.classList.toggle("active",e==="cameras")),u&&(u.classList.toggle("hidden",e!=="servers"),u.classList.toggle("active",e==="servers")),e==="switches"?this.fetchAndRenderSwitchesStatus():e==="routers"?this.fetchAndRenderRoutersStatus():e==="nas"?this.fetchAndRenderNasStatus():e==="cameras"?this.fetchAndRenderCamerasStatus():e==="servers"&&this.fetchAndRenderServersStatus()},render(){Y==="alerts"?this.renderGnewServicesStatus():Y==="events"?this.fetchAndRenderEventHistory():Y==="apis"?this.fetchAndRenderApisStatus():Y==="infra"&&(ne==="switches"?this.fetchAndRenderSwitchesStatus():ne==="routers"?this.fetchAndRenderRoutersStatus():ne==="nas"?this.fetchAndRenderNasStatus():ne==="cameras"?this.fetchAndRenderCamerasStatus():ne==="servers"&&this.fetchAndRenderServersStatus())},renderGnewServicesStatus(){const e=document.getElementById("monitoring-alerts-grid");if(!e)return;e.style.display="flex",e.style.flexDirection="column",e.style.gap="0";const t=H&&H.servicos&&Array.isArray(H.servicos.servicos)?H.servicos.servicos:[],n=ft||[],o=At||[],i=Mt||[],s=Ht||[],a=Rt||[],r=ae||[];if(t.length===0&&n.length===0&&o.length===0&&i.length===0&&s.length===0&&a.length===0&&r.length===0){e.innerHTML=`
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">Nenhum dado de monitoramento disponível.</p>
                    <p style="font-size: 0.85rem;">Aguardando carga dos serviços do PABX, das APIs integradas ou da infraestrutura...</p>
                </div>
            `;return}const l=t.length+n.length+o.length+i.length+s.length+a.length+r.length,d=t.filter(h=>h.status!=="active"&&h.status_label!=="ativo").length,u=n.filter(h=>!h.online||h.status==="warning").length,g=o.filter(h=>!h.online).length,p=i.filter(h=>!h.online).length,f=s.filter(h=>!h.online).length,m=a.filter(h=>!h.online).length,y=r.filter(h=>!h.online).length,v=d+u+g+p+f+m+y,I=l-v,B=document.getElementById("monitor-kpi-total"),x=document.getElementById("monitor-kpi-warning"),w=document.getElementById("monitor-kpi-info");B&&(B.textContent=l),x&&(x.textContent=v),w&&(w.textContent=I);const $=document.getElementById("monitoring-search-input"),b=$?$.value.toLowerCase().trim():"";let D=t,k=n,R=o,V=i,q=s,G=a,A=r;b&&(D=t.filter(h=>h.nome.toLowerCase().includes(b)),k=n.filter(h=>h.name.toLowerCase().includes(b)||h.description.toLowerCase().includes(b)),R=o.filter(h=>h.name.toLowerCase().includes(b)||h.ip.toLowerCase().includes(b)),V=i.filter(h=>h.name.toLowerCase().includes(b)||h.ip.toLowerCase().includes(b)),q=s.filter(h=>h.name.toLowerCase().includes(b)||h.ip.toLowerCase().includes(b)),G=a.filter(h=>h.name.toLowerCase().includes(b)||h.ip.toLowerCase().includes(b)),A=r.filter(h=>h.name.toLowerCase().includes(b)||h.ip.toLowerCase().includes(b)));let O=`
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Serviço / API / Infraestrutura</span>
                    <span class="monitor-list-col-status">Status</span>
                </div>
        `,z=0;D.forEach(h=>{const C=h.status==="active"||h.status_label==="ativo",T=C?"#10b981":"#ef4444",_=C?"Online":h.status_label||h.status||"Offline",P=C?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",N=C?"#6ee7b7":"#fca5a5",X=C?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)",L=z%2===0?"transparent":"rgba(255,255,255,0.015)";z++,O+=`
                <div class="monitor-list-row" style="background: ${L};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${T};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem;">[Serviço PABX] ${h.nome}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${P}; color:${N}; border-color:${X};">${_}</span>
                    </div>
                </div>`}),k.forEach(h=>{let C="#10b981",T="Online",_="rgba(16,185,129,0.12)",P="#6ee7b7",N="rgba(16,185,129,0.3)";h.status==="warning"?(C="#f59e0b",T="Alerta",_="rgba(245,158,11,0.12)",P="#fde047",N="rgba(245,158,11,0.3)"):(h.status==="offline"||!h.online)&&(C="#ef4444",T="Offline",_="rgba(239,68,68,0.12)",P="#fca5a5",N="rgba(239,68,68,0.3)");const X=z%2===0?"transparent":"rgba(255,255,255,0.015)";z++,O+=`
                <div class="monitor-list-row" style="background: ${X};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:var(--accent);">[API] ${h.name}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${_}; color:${P}; border-color:${N};">${T}</span>
                    </div>
                </div>`}),R.forEach(h=>{let C="#10b981",T="Online",_="rgba(16,185,129,0.12)",P="#6ee7b7",N="rgba(16,185,129,0.3)";h.online===null?(C="#94a3b8",T="Aguardando...",_="rgba(255, 255, 255, 0.05)",P="var(--text-muted)",N="rgba(255, 255, 255, 0.1)"):h.online||(C="#ef4444",T="Offline",_="rgba(239,68,68,0.12)",P="#fca5a5",N="rgba(239,68,68,0.3)");const X=z%2===0?"transparent":"rgba(255,255,255,0.015)";z++,O+=`
                <div class="monitor-list-row" style="background: ${X};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#38bdf8;">[Switch] ${h.name} (${h.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${_}; color:${P}; border-color:${N};">${T}</span>
                    </div>
                </div>`}),V.forEach(h=>{let C="#10b981",T="Online",_="rgba(16,185,129,0.12)",P="#6ee7b7",N="rgba(16,185,129,0.3)";h.online===null?(C="#94a3b8",T="Aguardando...",_="rgba(255, 255, 255, 0.05)",P="var(--text-muted)",N="rgba(255, 255, 255, 0.1)"):h.online||(C="#ef4444",T="Offline",_="rgba(239,68,68,0.12)",P="#fca5a5",N="rgba(239,68,68,0.3)");const X=z%2===0?"transparent":"rgba(255,255,255,0.015)";z++,O+=`
                <div class="monitor-list-row" style="background: ${X};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f43f5e;">[Roteador] ${h.name} (${h.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${_}; color:${P}; border-color:${N};">${T}</span>
                    </div>
                </div>`}),q.forEach(h=>{let C="#10b981",T="Online",_="rgba(16, 185, 129, 0.12)",P="#6ee7b7",N="rgba(16, 185, 129, 0.3)";h.online===null?(C="#94a3b8",T="Aguardando...",_="rgba(255, 255, 255, 0.05)",P="var(--text-muted)",N="rgba(255, 255, 255, 0.1)"):h.online||(C="#ef4444",T="Offline",_="rgba(239, 68, 68, 0.12)",P="#fca5a5",N="rgba(239, 68, 68, 0.3)");const X=z%2===0?"transparent":"rgba(255,255,255,0.015)";z++,O+=`
                <div class="monitor-list-row" style="background: ${X};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f97316;">[NAS] ${h.name} (${h.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${_}; color:${P}; border-color:${N};">${T}</span>
                    </div>
                </div>`}),G.forEach(h=>{let C="#10b981",T="Online",_="rgba(16, 185, 129, 0.12)",P="#6ee7b7",N="rgba(16, 185, 129, 0.3)";h.online===null?(C="#94a3b8",T="Aguardando...",_="rgba(255, 255, 255, 0.05)",P="var(--text-muted)",N="rgba(255, 255, 255, 0.1)"):h.online||(C="#ef4444",T="Offline",_="rgba(239, 68, 68, 0.12)",P="#fca5a5",N="rgba(239, 68, 68, 0.3)");const X=z%2===0?"transparent":"rgba(255,255,255,0.015)";z++,O+=`
                <div class="monitor-list-row" style="background: ${X};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#10b981;">[Câmera] ${h.name} (${h.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${_}; color:${P}; border-color:${N};">${T}</span>
                    </div>
                </div>`}),A.forEach(h=>{let C="#10b981",T="Online",_="rgba(16, 185, 129, 0.12)",P="#6ee7b7",N="rgba(16, 185, 129, 0.3)";h.online===null?(C="#94a3b8",T="Aguardando...",_="rgba(255, 255, 255, 0.05)",P="var(--text-muted)",N="rgba(255, 255, 255, 0.1)"):h.online||(C="#ef4444",T="Offline",_="rgba(239, 68, 68, 0.12)",P="#fca5a5",N="rgba(239, 68, 68, 0.3)");const X=z%2===0?"transparent":"rgba(255,255,255,0.015)";z++,O+=`
                <div class="monitor-list-row" style="background: ${X};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${C};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#6366f1;">[Servidor] ${h.name} (${h.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${_}; color:${P}; border-color:${N};">${T}</span>
                    </div>
                </div>`}),O+="</div>",e.innerHTML=O},async fetchAndRenderEventHistory(){const e=document.getElementById("monitoring-events-grid");if(e){e.innerHTML=`
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div class="event-history-loading">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite; margin-bottom: 0.75rem; opacity: 0.5;">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <p style="font-size: 0.9rem;">Carregando histórico...</p>
                </div>
            </div>`;try{let t=await E.get("/monitoring/events?limit=1000");if(Ne&&(t=t.filter(a=>(a.title||"").toLowerCase().includes(Ne)||(a.description||"").toLowerCase().includes(Ne)||(a.source||"").toLowerCase().includes(Ne))),mt!=="all"&&(t=t.filter(a=>a.severity===mt)),Ue){const a=new Date(Ue+"T00:00:00").getTime();t=t.filter(r=>r.created_at?new Date(r.created_at).getTime()>=a:!1)}if(Ye){const a=new Date(Ye+"T23:59:59").getTime();t=t.filter(r=>r.created_at?new Date(r.created_at).getTime()<=a:!1)}ke=t.length;const n=Math.max(1,Math.ceil(ke/Pe));ie>n&&(ie=n);const o=document.getElementById("event-history-count");o&&(o.textContent=ke>0?ke:"",o.style.display=ke>0?"inline-flex":"none");const i=(ie-1)*Pe,s=t.slice(i,i+Pe);this.renderEvents(s),this.renderPagination(ke,n)}catch(t){console.error("Erro ao buscar histórico de eventos:",t),e.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p style="font-size: 0.9rem; color: #fca5a5;">Erro ao carregar o histórico de eventos.</p>
                    <p style="font-size: 0.8rem; margin-top: 4px;">${t.message}</p>
                </div>`}}},renderPagination(e,t){const n=document.getElementById("event-history-pagination");if(!n)return;if(t<=1){n.innerHTML="";return}const o=ie,i=(o-1)*Pe+1,s=Math.min(o*Pe,e),a=[],r=2;let l=Math.max(1,o-r),d=Math.min(t,o+r);l>1&&(a.push('<button class="eh-page-btn" data-page="1">1</button>'),l>2&&a.push('<span class="eh-page-ellipsis">…</span>'));for(let u=l;u<=d;u++)a.push(`<button class="eh-page-btn${u===o?" active":""}" data-page="${u}">${u}</button>`);d<t&&(d<t-1&&a.push('<span class="eh-page-ellipsis">…</span>'),a.push(`<button class="eh-page-btn" data-page="${t}">${t}</button>`)),n.innerHTML=`
            <div class="eh-pagination">
                <span class="eh-page-info">Exibindo <strong>${i}–${s}</strong> de <strong>${e}</strong> eventos</span>
                <div class="eh-page-controls">
                    <button class="eh-page-btn eh-page-nav" data-page="${o-1}" ${o<=1?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    ${a.join("")}
                    <button class="eh-page-btn eh-page-nav" data-page="${o+1}" ${o>=t?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>`,n.querySelectorAll(".eh-page-btn[data-page]").forEach(u=>{u.addEventListener("click",()=>{const g=parseInt(u.dataset.page,10);if(!isNaN(g)&&g>=1&&g<=t&&g!==ie){ie=g,this.fetchAndRenderEventHistory();const p=document.getElementById("monitoring-events-grid");p&&p.scrollIntoView({behavior:"smooth",block:"start"})}})})},renderEvents(e){const t=document.getElementById("monitoring-events-grid");if(!t)return;t.style.display="flex",t.style.flexDirection="column",t.style.gap="0";const n=e||[];if(n.length===0){t.innerHTML=`
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
                </div>`;return}const o={};n.forEach(s=>{const a=s.created_at?new Date(s.created_at).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"Data desconhecida";o[a]||(o[a]=[]),o[a].push(s)});const i=Object.entries(o).map(([s,a])=>{const r=a.map(l=>{const d=l.severity||"info";let u="Info",g="#3b82f6",p="rgba(59,130,246,0.12)",f="#93c5fd",m="rgba(59,130,246,0.3)",y="#3b82f6";d==="critical"?(u="Crítico",g="#ef4444",y="#ef4444",p="rgba(239,68,68,0.12)",f="#fca5a5",m="rgba(239,68,68,0.3)"):d==="warning"?(u="Alerta",g="#f59e0b",y="#f59e0b",p="rgba(245,158,11,0.12)",f="#fde047",m="rgba(245,158,11,0.3)"):d==="success"&&(u="Ok",g="#10b981",y="#10b981",p="rgba(16,185,129,0.12)",f="#6ee7b7",m="rgba(16,185,129,0.3)");const v=l.created_at?new Date(l.created_at):null,I=v?v.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"-",B=v?this._relativeTime(v):"",x=l.value_pct!=null?`${l.value_pct}%`:null;return`
                    <div class="event-history-row" style="border-left: 3px solid ${y};">
                        <div class="event-history-row-left">
                            <span class="monitor-dot" style="background: ${g}; flex-shrink: 0;"></span>
                            <div class="event-history-row-info">
                                <span class="event-history-row-title">${l.title}</span>
                                ${l.description?`<span class="event-history-row-desc">${l.description}</span>`:""}
                            </div>
                        </div>
                        <div class="event-history-row-meta">
                            ${x?`<span class="event-history-row-value">${x}</span>`:""}
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
                </div>`}).join("");t.innerHTML=`<div class="event-history-list">${i}</div>`},_relativeTime(e){const n=new Date-e,o=Math.floor(n/6e4),i=Math.floor(o/60),s=Math.floor(i/24);return n<6e4?"agora mesmo":o<60?`${o}min atrás`:i<24?`${i}h atrás`:s===1?"ontem":`${s} dias atrás`},updateKPIs(e,t){const n=e-t,o=document.getElementById("monitor-kpi-total"),i=document.getElementById("monitor-kpi-warning"),s=document.getElementById("monitor-kpi-info");o&&(o.textContent=e),i&&(i.textContent=t),s&&(s.textContent=n)},async fetchDiagnostics(){try{const[e,t,n,o,i,s,a]=await Promise.all([E.get("/monitoring/diagnostico?t="+Date.now()),E.get("/monitoring/apis-status?t="+Date.now()),E.get("/monitoring/switches?t="+Date.now()),E.get("/monitoring/routers?t="+Date.now()),E.get("/monitoring/nas?t="+Date.now()),E.get("/monitoring/cameras?t="+Date.now()),E.get("/monitoring/servers?t="+Date.now())]),r=e&&e.status==="online";if(this.updateGnewApiStatus(r,r?"Gnew Online":"Gnew Offline (Contingência)",e?e.message:""),e&&e.data)H=e.data,this.renderGnewDiagnostics();else throw new Error("Dados inválidos na resposta da API.");t&&t.success&&Array.isArray(t.apis)&&(ft=t.apis),n&&n.success&&Array.isArray(n.switches)&&(At=n.switches),o&&o.success&&Array.isArray(o.routers)&&(Mt=o.routers),i&&i.success&&Array.isArray(i.nas)&&(Ht=i.nas),s&&s.success&&Array.isArray(s.cameras)&&(Rt=s.cameras),a&&a.success&&Array.isArray(a.servers)&&(ae=a.servers),Y==="alerts"&&this.renderGnewServicesStatus()}catch(e){console.error("Erro ao buscar dados de monitoramento:",e),this.updateGnewApiStatus(!1,"Erro de Conexão",e.message)}},updateGnewApiStatus(e,t,n){const o=document.getElementById("gnew-api-status-badge"),i=document.getElementById("gnew-api-message");if(o){o.className=`api-status-badge ${e?"online":"offline"}`,o.style.background=e?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",o.style.color=e?"#6ee7b7":"#fca5a5",o.style.borderColor=e?"#10b981":"#ef4444";const s=o.querySelector(".status-text");s&&(s.textContent=t)}i&&n&&(i.textContent=n)},parseMemoryOutput(e){try{const n=e.split(`
`).find(o=>o.trim().startsWith("Mem:"));if(n){const o=n.trim().split(/\s+/);if(o.length>=3){const i=o[1],s=o[2],a=d=>{const u=parseFloat(d);return d.toLowerCase().includes("g")?u*1024:d.toLowerCase().includes("m")?u:d.toLowerCase().includes("k")?u/1024:u},r=a(i),l=a(s);if(!isNaN(r)&&!isNaN(l)&&r>0)return{percentage:Math.round(l/r*100),detail:`${s} em uso de ${i} total`}}}}catch(t){console.warn("Erro ao fazer parse da memória:",t)}return{percentage:0,detail:"Erro no parse"}},parseDiskOutput(e){try{const n=e.split(`
`).find(o=>o.trim().endsWith(" /"));if(n){const o=n.trim().split(/\s+/);if(o.length>=5){const i=o[1],s=o[2],a=o[4].replace("%",""),r=parseInt(a,10);if(!isNaN(r))return{percentage:r,detail:`${s} em uso de ${i} (Montagem em /)`}}}}catch(t){console.warn("Erro ao fazer parse do disco:",t)}return{percentage:0,detail:"Erro no parse"}},renderGnewDiagnostics(){if(!H)return;if(H.memoria){let n={percentage:0,detail:"Dados de memória indisponíveis"};if(H.memoria.output)n=this.parseMemoryOutput(H.memoria.output);else if(typeof H.memoria.percent<"u"){const a=(H.memoria.total_mb/1024).toFixed(1),r=(H.memoria.used_mb/1024).toFixed(1);n={percentage:Math.round(H.memoria.percent),detail:`${r}GB em uso de ${a}GB total`}}const o=document.getElementById("gnew-kpi-mem-text"),i=document.getElementById("gnew-kpi-mem-bar"),s=document.getElementById("gnew-kpi-mem-detail");o&&(o.textContent=`${n.percentage}%`),i&&(i.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}if(H.disco){let n={percentage:0,detail:"Dados de disco indisponíveis"};if(H.disco.output)n=this.parseDiskOutput(H.disco.output);else if(Array.isArray(H.disco)){const a=H.disco.find(r=>r.mountpoint==="/");a&&(n={percentage:Math.round(a.percent),detail:`${a.used_gb.toFixed(1)}GB em uso de ${a.total_gb.toFixed(1)}GB (Montagem em /)`})}const o=document.getElementById("gnew-kpi-disk-text"),i=document.getElementById("gnew-kpi-disk-bar"),s=document.getElementById("gnew-kpi-disk-detail");o&&(o.textContent=`${n.percentage}%`),i&&(i.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}const e=document.getElementById("gnew-disk-table-body");if(e){let n=[];if(H.disco)if(H.disco.output)try{const o=H.disco.output.trim().split(`
`);for(let i=1;i<o.length;i++){const s=o[i].trim().split(/\s+/);s.length>=6&&n.push({mountpoint:s[5],total:s[1],used:s[2],free:s[3],percent:parseInt(s[4].replace("%",""),10)||0})}}catch(o){console.warn("Erro ao fazer parse da tabela de disco offline:",o)}else Array.isArray(H.disco)&&(n=H.disco.map(o=>({mountpoint:o.mountpoint,total:typeof o.total_gb=="number"?`${o.total_gb.toFixed(2)} GB`:o.total_gb||"0 GB",used:typeof o.used_gb=="number"?`${o.used_gb.toFixed(2)} GB`:o.used_gb||"0 GB",free:typeof o.free_gb=="number"?`${o.free_gb.toFixed(2)} GB`:o.free_gb||"0 GB",percent:typeof o.percent=="number"?Math.round(o.percent):parseInt(o.percent,10)||0})));n.length>0?e.innerHTML=n.map(o=>{const i=o.percent;return`
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
                    `}).join(""):e.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                            Nenhum ponto de montagem de disco encontrado.
                        </td>
                    </tr>
                `}if(H.servicos&&H.servicos.timestamp)try{const o=new Date(H.servicos.timestamp).toLocaleString("pt-BR"),i=document.getElementById("gnew-services-timestamp");i&&(i.textContent=`Última verificação: ${o}`)}catch(n){console.warn("Erro ao formatar timestamp dos serviços:",n)}const t=document.getElementById("gnew-services-list");if(t){let n=[];H.servicos&&Array.isArray(H.servicos.servicos)&&(n=H.servicos.servicos),n.length>0?(t.innerHTML=n.map(i=>{const s=i.status==="active"||i.status_label==="ativo",a=s?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",r=s?"#6ee7b7":"#fca5a5",l=s?"#10b981":"#ef4444",d=s?"#10b981":"#ef4444";return`
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
                `}if(H.ipExterno){const n=document.getElementById("gnew-kpi-ip-text");n&&(n.textContent=H.ipExterno.ip||"Não detectado")}},async clearEventHistory(){const e=document.getElementById("btn-clear-event-history");if(confirm("Tem certeza que deseja limpar todo o histórico de eventos? Esta ação não pode ser desfeita."))try{e&&(e.disabled=!0,e.textContent="Limpando..."),await fetch("/api/monitoring/events",{method:"DELETE"}),await this.fetchAndRenderEventHistory();const t=document.getElementById("event-history-count");t&&(t.style.display="none")}catch(t){console.error("Erro ao limpar histórico:",t),alert("Erro ao limpar o histórico. Tente novamente.")}finally{e&&(e.disabled=!1,e.textContent="Limpar Histórico")}},async fetchAndRenderApisStatus(){const e=document.getElementById("monitoring-apis-grid");if(!e)return;e.innerHTML=`
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 12px; color: var(--text-muted);">
                <div class="api-loading-spinner" style="width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="font-size: 0.9rem;">Verificando integridade das APIs...</span>
            </div>
        `;const t=document.getElementById("btn-refresh-apis-status");let n=null;t&&(n=t.querySelector("svg"),t.disabled=!0,t.style.opacity="0.6",t.style.cursor="not-allowed",n&&(n.style.animation="spin 0.8s linear infinite"));try{const o=await E.get("/monitoring/apis-status?refresh=true&t="+Date.now());if(o&&o.success&&Array.isArray(o.apis))ft=o.apis,Y==="alerts"&&this.renderGnewServicesStatus(),this.renderApisGrid(o.apis);else throw new Error("Resposta inválida do servidor.")}catch(o){console.error("Erro ao buscar status das APIs:",o),e.innerHTML=`
                <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                    <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status das APIs</p>
                    <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${o.message}</p>
                </div>
            `}finally{t&&(t.disabled=!1,t.style.opacity="",t.style.cursor="pointer",n&&(n.style.animation=""))}},renderApisGrid(e){const t=document.getElementById("monitoring-apis-grid");if(t){if(e.length===0){t.innerHTML=`
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted);">
                    Nenhuma API cadastrada.
                </div>
            `;return}t.innerHTML=e.map(n=>{let o="online",i="rgba(16, 185, 129, 0.1)",s="#6ee7b7",a="#10b981",r="Online";n.status==="warning"?(o="warning",i="rgba(245, 158, 11, 0.1)",s="#fde047",a="#f59e0b",r="Alerta"):(n.status==="offline"||!n.online)&&(o="offline",i="rgba(239, 68, 68, 0.1)",s="#fca5a5",a="#ef4444",r="Offline");const l=n.latency<500?"#6ee7b7":n.latency<2e3?"#fde047":"#fca5a5";return`
                <div class="api-status-card glass" data-api-id="${n.id}">
                    <div class="api-card-header">
                        <div class="api-info-meta">
                            <span class="api-type-tag">${n.type}</span>
                            <h4 class="api-name">${n.name}</h4>
                        </div>
                        <span class="api-badge ${o}" style="background: ${i}; color: ${s}; border: 1px solid ${a};">
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
            `}).join("")}},async fetchAndRenderNetworkStatus(e=!1){const t=document.getElementById("btn-refresh-network-status");let n=null;t&&(n=t.querySelector("svg"),t.disabled=!0,t.style.opacity="0.6",t.style.cursor="not-allowed",n&&(n.style.animation="spin 0.8s linear infinite"));try{const o=`/monitoring/pfsense${e?"?refresh=true":""}`,i=await E.get(o);if(i&&i.success&&i.data){const s=i.data,a=document.getElementById("network-kpi-cpu-text"),r=document.getElementById("network-kpi-cpu-bar"),l=document.getElementById("network-kpi-load-average");a&&(a.textContent=`${s.cpu_usage}%`),r&&(r.style.width=`${s.cpu_usage}%`),l&&(l.textContent=`Load Average: ${s.load_average}`);const d=document.getElementById("network-kpi-mem-text"),u=document.getElementById("network-kpi-mem-bar");d&&(d.textContent=`${s.memory_usage}%`),u&&(u.style.width=`${s.memory_usage}%`);const g=document.getElementById("network-kpi-uptime-text");g&&(g.textContent=s.uptime||"Desconhecido"),this.renderNetworkGateways(s.gateways),this.renderNetworkInterfaces(s.interfaces),this.renderNetworkDns(s.dns_servers)}else throw new Error(i.error||"Falha ao processar dados do pfSense.")}catch(o){console.error("Erro ao buscar status da rede pfSense:",o);const i=document.getElementById("network-gateways-container");i&&(i.innerHTML=`
                    <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                        <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status dos Gateways</p>
                        <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${o.message}</p>
                    </div>
                `);const s=document.getElementById("network-interfaces-tbody");s&&(s.innerHTML=`
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 2rem; color: #fca5a5;">
                            Erro ao carregar interfaces: ${o.message}
                        </td>
                    </tr>
                `);const a=document.getElementById("network-dns-container");a&&(a.innerHTML=`
                    <div style="color: #fca5a5; font-size: 0.85rem; text-align: center; padding: 1rem;">
                        Erro ao carregar DNS
                    </div>
                `)}finally{t&&(t.disabled=!1,t.style.opacity="",t.style.cursor="pointer",n&&(n.style.animation=""))}},renderNetworkGateways(e){const t=document.getElementById("network-gateways-container");if(t){if(!e||e.length===0){t.innerHTML=`
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic; background: var(--card-bg); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    Nenhum gateway detectado.
                </div>
            `;return}t.innerHTML=e.map(n=>{let o="online",i="#10b981",s="background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border: 1px solid #10b981;";const a=n.status.toLowerCase().includes("online");n.status.toLowerCase().includes("warning")||n.status.toLowerCase().includes("loss")||n.status.toLowerCase().includes("high")?(o="warning",i="#f59e0b",s="background: rgba(245, 158, 11, 0.1); color: #fde047; border: 1px solid #f59e0b;"):a||(o="offline",i="#ef4444",s="background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid #ef4444;");const l=parseFloat(n.loss)||0,d=l>5?"#fca5a5":l>0?"#fde047":"var(--text-main)";return`
                <div class="kpi-card" style="display: flex; flex-direction: column; gap: 12px; padding: 1.25rem; border-left: 4px solid ${i}; position: relative; background: var(--card-bg); border-radius: var(--border-radius); border-top: 1px solid var(--glass-border); border-right: 1px solid var(--glass-border); border-bottom: 1px solid var(--glass-border);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; font-size: 1rem; color: var(--text-main);">${n.name}</span>
                        <span class="api-badge ${o}" style="${s} display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            <span class="status-dot"></span>
                            ${n.status}
                        </span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">IP: ${n.ip}</div>
                    <div style="display: flex; gap: 15px; margin-top: 5px;">
                        <div style="flex: 1; background: rgba(255,255,255,0.02); border-radius: 6px; padding: 8px; border: 1px solid rgba(255,255,255,0.04);">
                            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Latência (RTT)</div>
                            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); font-family: monospace;">${n.rtt}</div>
                        </div>
                        <div style="flex: 1; background: rgba(255,255,255,0.02); border-radius: 6px; padding: 8px; border: 1px solid rgba(255,255,255,0.04);">
                            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Perda</div>
                            <div style="font-size: 0.95rem; font-weight: 700; color: ${d}; font-family: monospace;">${n.loss}</div>
                        </div>
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); text-align: right; margin-top: 2px;">RTTsd: ${n.rttsd}</div>
                </div>
            `}).join("")}},renderNetworkInterfaces(e){const t=document.getElementById("network-interfaces-tbody");if(t){if(!e||e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                        Nenhuma interface de rede detectada.
                    </td>
                </tr>
            `;return}t.innerHTML=e.map(n=>{const o=n.status==="up",i=o?"online":"offline",s=o?"background: rgba(16, 185, 129, 0.1); color: #6ee7b7; border: 1px solid #10b981;":"background: rgba(239, 68, 68, 0.1); color: #fca5a5; border: 1px solid #ef4444;",a=o?"UP":"DOWN";return`
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; font-family: monospace;">(${n.interface})</span></td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${n.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.speed}</td>
                    <td style="padding: 12px; text-align: right;">
                        <span class="api-badge ${i}" style="${s} display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                            <span class="status-dot"></span>
                            ${a}
                        </span>
                    </td>
                </tr>
            `}).join("")}},renderNetworkDns(e){const t=document.getElementById("network-dns-container");if(t){if(!e||e.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 1rem; color: var(--text-muted); font-style: italic;">
                    Nenhum servidor DNS listado.
                </div>
            `;return}t.innerHTML=e.map(n=>`
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent); flex-shrink: 0;">
                        <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="2" x2="12" y2="22"></line>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                    </svg>
                    <span style="font-family: monospace; font-size: 0.9rem; color: var(--text-main); font-weight: 600;">${n}</span>
                </div>
            `).join("")}},async fetchAndRenderSwitchesStatus(e=!1,t=!1){const n=document.getElementById("switches-auto-refresh"),o=t||n&&n.checked,i=document.getElementById("monitoring-switches-tbody");if(!i)return;const s=document.getElementById("btn-refresh-switches-status");let a=null;s&&(a=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",a&&(a.style.animation="spin 0.8s linear infinite"));try{if(o){const r=await E.get(`/monitoring/switches?ping=false&refresh=${e}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.switches)){this.renderSwitchesTable(r.switches),r.switches.forEach(l=>{const d=document.getElementById(`switch-row-${l.id}`);if(d){const u=d.querySelector(".switch-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ie=!0;for(const l of r.switches){if(Y!=="infra")break;const d=document.getElementById(`switch-row-${l.id}`);if(d){const u=d.querySelector(".switch-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const u=await E.get(`/monitoring/switches/${l.id}/ping?t=${Date.now()}`);if(u&&u.success&&u.switch){const g=u.switch,p=document.getElementById(`switch-row-${g.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",m="#6ee7b7",y="rgba(16, 185, 129, 0.3)",v="Online";g.online||(f="rgba(239, 68, 68, 0.12)",m="#fca5a5",y="rgba(239, 68, 68, 0.3)",v="Offline");const I=g.latency<50?"#6ee7b7":g.latency<150?"#fde047":"#fca5a5",B=g.online?`${g.latency}ms`:"-",x=p.querySelector(".monitor-badge");x&&(x.style.background=f,x.style.color=m,x.style.borderColor=y,x.textContent=v);const w=p.querySelector(".switch-latency");w&&(w.style.color=I,w.textContent=B);const $=p.querySelector(".switch-sync-indicator");$&&($.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{$.querySelector("polyline")&&($.innerHTML="")},3e3))}}}catch(u){console.error(`Erro ao pingar switch ${l.name}:`,u);const g=document.getElementById(`switch-row-${l.id}`);if(g){const p=g.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=g.querySelector(".switch-sync-indicator");f&&(f.innerHTML="")}}}Ie=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/switches?refresh=${e}&t=${Date.now()}`,l=await E.get(r);if(l&&l.success&&Array.isArray(l.switches))this.renderSwitchesTable(l.switches);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos switches:",r),i.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos switches</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",a&&(a.style.animation=""))}},renderSwitchesTable(e){const t=document.getElementById("monitoring-switches-tbody");if(t){if(e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum switch encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=e.map(n=>{let o="rgba(16, 185, 129, 0.12)",i="#6ee7b7",s="rgba(16, 185, 129, 0.3)",a="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",i="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",a="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",i="#fca5a5",s="rgba(239, 68, 68, 0.3)",a="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
                <tr id="switch-row-${n.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${n.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.model||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${i}; border-color:${s};">${a}</span>
                            <span class="switch-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="switch-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join("")}},async fetchAndRenderRoutersStatus(e=!1,t=!1){console.log("📊 [MONITORING] fetchAndRenderRoutersStatus called. forceRefresh:",e,"sequential:",t);const n=document.getElementById("routers-auto-refresh"),o=t||n&&n.checked,i=document.getElementById("monitoring-routers-tbody");if(!i){console.error("📊 [MONITORING] Element #monitoring-routers-tbody not found in DOM!");return}const s=document.getElementById("btn-refresh-routers-status");let a=null;s&&(a=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",a&&(a.style.animation="spin 0.8s linear infinite"));try{if(console.log("📊 [MONITORING] Fetching routers, sequential mode:",o),o){const r=await E.get(`/monitoring/routers?ping=false&refresh=${e}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.routers)){this.renderRoutersTable(r.routers),r.routers.forEach(l=>{const d=document.getElementById(`router-row-${l.id}`);if(d){const u=d.querySelector(".router-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ie=!0;for(const l of r.routers){if(Y!=="infra"||ne!=="routers")break;const d=document.getElementById(`router-row-${l.id}`);if(d){const u=d.querySelector(".router-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const u=await E.get(`/monitoring/routers/${l.id}/ping?t=${Date.now()}`);if(u&&u.success&&u.router){const g=u.router,p=document.getElementById(`router-row-${g.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",m="#6ee7b7",y="rgba(16, 185, 129, 0.3)",v="Online";g.online||(f="rgba(239, 68, 68, 0.12)",m="#fca5a5",y="rgba(239, 68, 68, 0.3)",v="Offline");const I=g.latency<50?"#6ee7b7":g.latency<150?"#fde047":"#fca5a5",B=g.online?`${g.latency}ms`:"-",x=p.querySelector(".monitor-badge");x&&(x.style.background=f,x.style.color=m,x.style.borderColor=y,x.textContent=v);const w=p.querySelector(".router-latency");w&&(w.style.color=I,w.textContent=B);const $=p.querySelector(".router-sync-indicator");$&&($.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{$.querySelector("polyline")&&($.innerHTML="")},3e3))}}}catch(u){console.error(`Erro ao pingar roteador ${l.name}:`,u);const g=document.getElementById(`router-row-${l.id}`);if(g){const p=g.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=g.querySelector(".router-sync-indicator");f&&(f.innerHTML="")}}}Ie=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/routers?refresh=${e}&t=${Date.now()}`,l=await E.get(r);if(l&&l.success&&Array.isArray(l.routers))this.renderRoutersTable(l.routers);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos roteadores:",r),i.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos roteadores</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",a&&(a.style.animation=""))}},renderRoutersTable(e){const t=document.getElementById("monitoring-routers-tbody");if(t){if(e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum roteador encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=e.map(n=>{let o="rgba(16, 185, 129, 0.12)",i="#6ee7b7",s="rgba(16, 185, 129, 0.3)",a="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",i="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",a="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",i="#fca5a5",s="rgba(239, 68, 68, 0.3)",a="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
                <tr id="router-row-${n.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${n.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.model||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${i}; border-color:${s};">${a}</span>
                            <span class="router-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="router-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join("")}},async fetchAndRenderNasStatus(e=!1,t=!1){console.log("📊 [MONITORING] fetchAndRenderNasStatus called. forceRefresh:",e,"sequential:",t);const n=document.getElementById("nas-auto-refresh"),o=t||n&&n.checked,i=document.getElementById("monitoring-nas-tbody");if(!i){console.error("📊 [MONITORING] Element #monitoring-nas-tbody not found in DOM!");return}const s=document.getElementById("btn-refresh-nas-status");let a=null;s&&(a=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",a&&(a.style.animation="spin 0.8s linear infinite"));try{if(console.log("📊 [MONITORING] Fetching NAS devices, sequential mode:",o),o){const r=await E.get(`/monitoring/nas?ping=false&refresh=${e}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.nas)){this.renderNasTable(r.nas),r.nas.forEach(l=>{const d=document.getElementById(`nas-row-${l.id}`);if(d){const u=d.querySelector(".nas-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ie=!0;for(const l of r.nas){if(Y!=="infra"||ne!=="nas")break;const d=document.getElementById(`nas-row-${l.id}`);if(d){const u=d.querySelector(".nas-sync-indicator");u&&(u.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const u=await E.get(`/monitoring/nas/${l.id}/ping?t=${Date.now()}`);if(u&&u.success&&u.nas){const g=u.nas,p=document.getElementById(`nas-row-${g.id}`);if(p){let f="rgba(16, 185, 129, 0.12)",m="#6ee7b7",y="rgba(16, 185, 129, 0.3)",v="Online";g.online||(f="rgba(239, 68, 68, 0.12)",m="#fca5a5",y="rgba(239, 68, 68, 0.3)",v="Offline");const I=g.latency<50?"#6ee7b7":g.latency<150?"#fde047":"#fca5a5",B=g.online?`${g.latency}ms`:"-",x=p.querySelector(".monitor-badge");x&&(x.style.background=f,x.style.color=m,x.style.borderColor=y,x.textContent=v);const w=p.querySelector(".nas-latency");w&&(w.style.color=I,w.textContent=B);const $=p.querySelector(".nas-sync-indicator");$&&($.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{$.querySelector("polyline")&&($.innerHTML="")},3e3))}}}catch(u){console.error(`Erro ao pingar NAS ${l.name}:`,u);const g=document.getElementById(`nas-row-${l.id}`);if(g){const p=g.querySelector(".monitor-badge");p&&(p.style.background="rgba(239, 68, 68, 0.12)",p.style.color="#fca5a5",p.style.borderColor="rgba(239, 68, 68, 0.3)",p.textContent="Erro");const f=g.querySelector(".nas-sync-indicator");f&&(f.innerHTML="")}}}Ie=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/nas?refresh=${e}&t=${Date.now()}`,l=await E.get(r);if(l&&l.success&&Array.isArray(l.nas))this.renderNasTable(l.nas);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos dispositivos NAS:",r),i.innerHTML=`
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos dispositivos NAS</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",a&&(a.style.animation=""))}},renderNasTable(e){const t=document.getElementById("monitoring-nas-tbody");if(t){if(e.length===0){t.innerHTML=`
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum dispositivo NAS encontrado.
                    </td>
                </tr>
            `;return}t.innerHTML=e.map(n=>{let o="rgba(16, 185, 129, 0.12)",i="#6ee7b7",s="rgba(16, 185, 129, 0.3)",a="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",i="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",a="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",i="#fca5a5",s="rgba(239, 68, 68, 0.3)",a="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
                <tr id="nas-row-${n.id}" style="border-bottom: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s; cursor: pointer;">
                    <td style="padding: 12px; font-weight: 600; color: var(--text-main);">${n.name}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted);">${n.ip}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.manufacturer||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.model||"-"}</td>
                    <td style="padding: 12px; font-family: monospace; color: var(--text-muted); font-size: 0.8rem;">${n.mac||"-"}</td>
                    <td style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">${n.location||"-"}</td>
                    <td style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="monitor-badge" style="background:${o}; color:${i}; border-color:${s};">${a}</span>
                            <span class="nas-sync-indicator" style="display: inline-flex; align-items: center;"></span>
                        </div>
                    </td>
                    <td class="nas-latency" style="padding: 12px; text-align: right; font-weight: 500; font-family: monospace; color: ${r};">${l}</td>
                </tr>
            `}).join(""),e.forEach(n=>{const o=document.getElementById(`nas-row-${n.id}`);o&&o.addEventListener("click",i=>{i.target.closest("button")||i.target.closest("a")||i.target.closest("input")||this.toggleNasDetails(n.id)})})}},async toggleNasDetails(e){console.log("📊 [MONITORING] Toggling details for NAS ID:",e);const t=document.getElementById(`nas-details-row-${e}`);if(t){t.remove();return}document.querySelectorAll(".nas-details-row").forEach(s=>s.remove());const o=document.getElementById(`nas-row-${e}`);if(!o)return;const i=document.createElement("tr");i.id=`nas-details-row-${e}`,i.className="nas-details-row",i.innerHTML=`
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
        `,o.parentNode.insertBefore(i,o.nextSibling);try{const s=await E.get(`/monitoring/nas/${e}/storage?t=${Date.now()}`);if(s&&s.success&&s.storage){const a=s.storage,r=a.volume,l=Math.round(r.used_gb/r.total_gb*100),d=(r.total_gb/1e3).toFixed(1)+" TB",u=(r.used_gb/1e3).toFixed(1)+" TB",g=(r.free_gb/1e3).toFixed(1)+" TB",p=a.bays.map(m=>{const y=m.led==="green"?"#10b981":"#ef4444",v=m.led==="green"?"0 0 8px #10b981":"0 0 8px #ef4444";return`
                        <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                            <!-- HDD Icon with LED -->
                            <div style="position: relative; width: 32px; height: 44px; background: #2a2b2f; border: 2px solid #3d3e42; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 4px 2px; flex-shrink: 0;">
                                <div style="width: 5px; height: 5px; background: ${y}; border-radius: 50%; box-shadow: ${v};"></div>
                                <div style="display: flex; flex-direction: column; gap: 2px; width: 80%;">
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                    <div style="height: 1px; background: rgba(255,255,255,0.15);"></div>
                                </div>
                                <span style="font-size: 0.52rem; color: var(--text-muted); font-weight: 700; text-align: center;">BAY ${m.slot}</span>
                            </div>
                            <!-- HDD Details -->
                            <div style="display: flex; flex-direction: column; gap: 3px; min-width: 0;">
                                <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${m.disk_model}">${m.disk_model}</span>
                                <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">S/N: ${m.serial}</span>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 2px;">
                                    <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent);">${m.capacity}</span>
                                    <span style="font-size: 0.68rem; color: var(--text-muted); background: rgba(255,255,255,0.03); padding: 1px 4px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.05);">${m.temp}</span>
                                </div>
                            </div>
                        </div>
                    `}).join(""),f=a.shares.map(m=>{const y=Math.round(m.used_gb/m.total_gb*100),v=(m.total_gb/1e3).toFixed(1)+" TB",I=(m.used_gb/1e3).toFixed(1)+" TB";return`
                        <div class="nas-share-item" style="display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.03); font-size: 0.82rem; transition: background 0.2s;">
                            <!-- Folder Icon and Name -->
                            <div style="flex: 2; display: flex; align-items: center; gap: 12px; min-width: 0; padding-right: 10px;">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#f59e0b" stroke-width="2" fill="#f59e0b" fill-opacity="0.2" style="flex-shrink: 0;">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <div style="display: flex; flex-direction: column; min-width: 0;">
                                    <span style="font-weight: 600; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.name}</span>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${m.description}">${m.description}</span>
                                </div>
                            </div>
                            
                            <!-- Path -->
                            <div style="flex: 3; color: var(--text-muted); font-family: monospace; font-size: 0.75rem; word-break: break-all; padding-right: 15px;">
                                ${m.path}
                            </div>
                            
                            <!-- Usage -->
                            <div style="flex: 2; display: flex; flex-direction: column; gap: 4px; padding-right: 20px;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--text-muted);">
                                    <span>${I} / ${v}</span>
                                    <span>${y}%</span>
                                </div>
                                <div style="width: 100%; height: 4px; background: rgba(255, 255, 255, 0.05); border-radius: 2px; overflow: hidden;">
                                    <div style="width: ${y}%; height: 100%; background: #f59e0b; border-radius: 2px;"></div>
                                </div>
                            </div>
                            
                            <!-- Permissions -->
                            <div style="flex: 2; min-width: 0;">
                                <span style="background: rgba(245, 158, 11, 0.08); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.2); padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 500; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${m.user_group}">
                                    ${m.user_group}
                                </span>
                            </div>
                        </div>
                    `}).join("");i.innerHTML=`
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
                                        <span style="color: var(--text-muted);">Espaço Utilizado: <strong style="color: var(--text-main);">${u}</strong></span>
                                        <span style="color: var(--text-muted);">Disponível: <strong style="color: var(--text-main);">${g}</strong></span>
                                    </div>
                                    <!-- Progress Bar -->
                                    <div style="width: 100%; height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.08); display: flex;">
                                        <div style="width: ${l}%; height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 4px;"></div>
                                    </div>
                                    <span style="font-size: 0.75rem; color: var(--text-muted);">Capacidade Total: <strong>${d}</strong> (Ocupação: ${l}%)</span>
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
                `}else throw new Error("Dados inválidos recebidos do servidor.")}catch(s){console.error("Erro ao expandir NAS storage:",s),i.innerHTML=`
                <td colspan="8" style="padding: 16px; text-align: center; color: #fca5a5; background: rgba(239, 68, 68, 0.07); border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                    Erro ao carregar detalhes de storage: ${s.message}
                </td>
            `}},async fetchAndRenderCamerasStatus(e=!1,t=!1){console.log('📹 [MONITORING] Cameras tab is disabled ("Em breve")'),this.renderCamerasTable([])},renderCamerasTable(e){const t=document.getElementById("infra-tab-content-cameras");t&&(t.innerHTML=`
                <div class="glass" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; text-align: center; border-radius: var(--border-radius); border: 1px solid var(--glass-border); background: var(--card-bg); margin-top: 1rem;">
                    <div style="font-size: 3.5rem; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.4)); animation: pulse 2s infinite;">📹</div>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 600; color: var(--text-main);">Monitoramento de Câmeras</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 400px; margin: 0 auto 1.5rem auto;">O monitoramento e verificação de status das câmeras de segurança está sendo reformulado e estará disponível em breve.</p>
                    <span class="server-virt-badge virtual" style="font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;">⚡ Em Breve</span>
                </div>
            `)},async fetchAndRenderServersStatus(e=!1,t=!1){console.log("⚡ [MONITORING] fetchAndRenderServersStatus called. forceRefresh:",e,"sequential:",t);const n=document.getElementById("servers-auto-refresh"),o=t||n&&n.checked,i=document.getElementById("monitoring-servers-accordion");if(!i){console.error("❌ [MONITORING] Element #monitoring-servers-accordion not found in DOM!");return}const s=document.getElementById("btn-refresh-servers-status");if(s){s.disabled=!0;const a=s.querySelector(".refresh-icon");a&&(a.style.animation="spin 1s linear infinite")}try{if(o){console.log("⚡ [MONITORING] Fetching servers, sequential mode:",o);const a=await E.get(`/monitoring/servers?ping=false&refresh=${e}&t=${Date.now()}`);if(a&&a.success&&Array.isArray(a.servers)){ae=a.servers,this.renderServersAccordion(a.servers);for(const r of a.servers){if(Y!=="infra"||ne!=="servers")break;const l=i.querySelector(`[data-server-id="${r.id}"]`);if(l){const d=l.querySelector(".server-status-dot");d&&(d.style.color="#94a3b8",d.style.backgroundColor="#94a3b8",d.style.boxShadow="0 0 8px #94a3b8",d.style.animation="pulse-gray 1.5s infinite")}try{const d=await E.get(`/monitoring/servers/${r.id}/ping?t=${Date.now()}`);if(d&&d.success&&d.server){const u=ae.findIndex(g=>g.id===r.id);u!==-1&&(ae[u]=d.server),this.renderServersAccordion(ae)}}catch(d){console.error(`Erro ao pingar servidor individual ${r.name}:`,d)}}}}else{console.log("⚡ [MONITORING] Fetching all servers with parallel pings...");const a=`/monitoring/servers?refresh=${e}&t=${Date.now()}`,r=await E.get(a);r&&r.success&&Array.isArray(r.servers)&&(ae=r.servers,this.renderServersAccordion(r.servers))}}catch(a){console.error("Erro ao buscar status dos servidores:",a),i.innerHTML=`
                <div style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); border-radius: var(--border-radius);">
                    Erro ao carregar dados dos servidores: ${a.message||a}
                </div>
            `}finally{if(s){s.disabled=!1;const a=s.querySelector(".refresh-icon");a&&(a.style.animation="")}}},renderServersAccordion(e){const t=document.getElementById("monitoring-servers-accordion");if(!t)return;const n=document.getElementById("servers-search"),o=n?n.value.toLowerCase().trim():"",i=["filter-type-physical","filter-type-virtual","filter-platform-win2019","filter-platform-win2025","filter-platform-linux","filter-activity-online","filter-activity-offline"];let s=0;i.forEach(d=>{const u=document.getElementById(d);u&&u.checked&&s++});const a=document.getElementById("server-filters-active-count");a&&(s>0?(a.textContent=s,a.style.display="inline-flex"):a.style.display="none");const r=e.filter(d=>{if(o&&!(d.name.toLowerCase().includes(o)||d.ip.toLowerCase().includes(o)||(d.os||"").toLowerCase().includes(o)||(d.model||"").toLowerCase().includes(o)))return!1;const u=document.getElementById("filter-type-physical"),g=document.getElementById("filter-type-virtual"),p=[];if(u&&u.checked&&p.push("physical"),g&&g.checked&&p.push("virtual"),p.length>0){const w=!!d.is_virtualized;if(p.includes("physical")&&w||p.includes("virtual")&&!w)return!1}const f=document.getElementById("filter-platform-win2019"),m=document.getElementById("filter-platform-win2025"),y=document.getElementById("filter-platform-linux"),v=[];if(f&&f.checked&&v.push("win2019"),m&&m.checked&&v.push("win2025"),y&&y.checked&&v.push("linux"),v.length>0){const w=(d.os||"").toLowerCase();let $=!1;if(v.includes("win2019")&&w.includes("win")&&w.includes("2019")&&($=!0),v.includes("win2025")&&w.includes("win")&&(w.includes("2025")||w.includes("2022"))&&($=!0),v.includes("linux")&&(w.includes("linux")||w.includes("ubuntu")||w.includes("debian")||w.includes("centos")||w.includes("redhat"))&&($=!0),!$)return!1}const I=document.getElementById("filter-activity-online"),B=document.getElementById("filter-activity-offline"),x=[];if(I&&I.checked&&x.push("online"),B&&B.checked&&x.push("offline"),x.length>0){const w=d.online===!0;if(x.includes("online")&&!w||x.includes("offline")&&w)return!1}return!0});if(r.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: var(--border-radius);">
                    ${o?"Nenhum servidor corresponde à busca.":"Nenhum servidor cadastrado."}
                </div>
            `;return}const l=Array.from(t.querySelectorAll(".server-accordion-item.active")).map(d=>d.getAttribute("data-item-id"));t.innerHTML=r.map(d=>{const g=l.includes(d.id.toString())?"active":"";let p="online",f="Online";d.online===null?(p="offline",f="Aguardando verificação..."):d.online?f="Operando normalmente":(p="offline",f="Offline (Sem resposta)");const m=d.os.toLowerCase();let y="other",v="💻";m.includes("win")?(y="windows",v="🪟"):(m.includes("linux")||m.includes("ubuntu")||m.includes("debian")||m.includes("centos")||m.includes("redhat"))&&(y="linux",v="🐧");const I=d.online?`${d.latency}ms`:"-",B=d.online?d.latency<20?"#6ee7b7":d.latency<80?"#fde047":"#fca5a5":"var(--text-muted)",x=q=>{const G=q<60?"#10b981":q<85?"#f59e0b":"#ef4444",A=q<60?"#6ee7b7":q<85?"#fde047":"#fca5a5";return{color:G,textColor:A}},w=d.cpu_usage!=null?d.cpu_usage:0,$=d.ram_usage!=null?d.ram_usage:0,b=d.disk_usage!=null?d.disk_usage:0,D=x(w),k=x($),R=x(b),V=d.cpu||d.memory||d.storage;return`
                <div class="server-accordion-item ${g}" data-item-id="${d.id}">
                    <div class="server-accordion-header" data-server-id="${d.id}">
                        <div class="server-header-left">
                            <span class="server-status-dot ${p}" title="${f}"></span>
                            <span class="server-title">${d.name}</span>
                            <span class="server-ip-badge">${d.ip}</span>
                            <span class="server-os-badge ${y}">${v} ${d.os}</span>
                            ${d.is_virtualized!=null?d.is_virtualized?`<span title="${d.virtualization_type||"Máquina Virtual"}" style="display:inline-flex;align-items:center;gap:4px;background:rgba(168,85,247,0.12);color:#d8b4fe;border:1px solid rgba(168,85,247,0.3);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;white-space:nowrap;flex-shrink:0;">
                                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="8" height="8" rx="1"></rect><rect x="14" y="2" width="8" height="8" rx="1"></rect><rect x="2" y="14" width="8" height="8" rx="1"></rect><rect x="14" y="14" width="8" height="8" rx="1"></rect></svg>
                                    ${d.virtualization_type||"Virtual"}
                                  </span>`:`<span title="Servidor Físico" style="display:inline-flex;align-items:center;gap:4px;background:rgba(16,185,129,0.09);color:#6ee7b7;border:1px solid rgba(16,185,129,0.2);padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:600;white-space:nowrap;flex-shrink:0;">
                                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                                    Físico
                                  </span>`:""}
                        </div>
                        <div class="server-header-right">
                            ${V&&d.online?`
                            <div style="display: flex; align-items: center; gap: 10px; margin-right: 10px;">
                                <div title="CPU: ${w}%" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${D.textColor}" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${D.textColor};">${w}%</span>
                                </div>
                                <div title="RAM: ${$}%" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${k.textColor}" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line><line x1="6" y1="4" x2="6" y2="7"></line><line x1="10" y1="4" x2="10" y2="7"></line><line x1="14" y1="4" x2="14" y2="7"></line><line x1="18" y1="4" x2="18" y2="7"></line></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${k.textColor};">${$}%</span>
                                </div>
                                <div title="Disco: ${b}%" style="display: flex; align-items: center; gap: 5px;">
                                    <svg viewBox="0 0 24 24" width="11" height="11" stroke="${R.textColor}" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                                    <span style="font-size: 0.72rem; font-weight: 600; color: ${R.textColor};">${b}%</span>
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

                            ${V?`
                            <!-- ── Hardware Metrics ─────────────────────────────── -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px;">

                                <!-- CPU -->
                                ${d.cpu?`
                                <div style="background: rgba(168,85,247,0.06); border: 1px solid rgba(168,85,247,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#a78bfa" stroke-width="2" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 0.05em;">CPU</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${D.textColor};">${w}%</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${w}%; height: 100%; background: ${D.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${d.cpu}">${d.cpu}</span>
                                </div>`:""}

                                <!-- RAM -->
                                ${d.memory?`
                                <div style="background: rgba(56,189,248,0.06); border: 1px solid rgba(56,189,248,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#38bdf8" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="10" rx="1"></rect><line x1="6" y1="7" x2="6" y2="17"></line><line x1="10" y1="7" x2="10" y2="17"></line><line x1="14" y1="7" x2="14" y2="17"></line><line x1="18" y1="7" x2="18" y2="17"></line><line x1="6" y1="4" x2="6" y2="7"></line><line x1="10" y1="4" x2="10" y2="7"></line><line x1="14" y1="4" x2="14" y2="7"></line><line x1="18" y1="4" x2="18" y2="7"></line></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">Memória</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${k.textColor};">${$}%</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${$}%; height: 100%; background: ${k.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
                                    </div>
                                    <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">${d.memory}</span>
                                </div>`:""}

                                <!-- Storage -->
                                ${d.storage?`
                                <div style="background: rgba(251,146,60,0.06); border: 1px solid rgba(251,146,60,0.15); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
                                    <div style="display: flex; align-items: center; justify-content: space-between;">
                                        <div style="display: flex; align-items: center; gap: 7px;">
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#fb923c" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                                            <span style="font-size: 0.75rem; font-weight: 600; color: #fb923c; text-transform: uppercase; letter-spacing: 0.05em;">Armazenamento</span>
                                        </div>
                                        <span style="font-size: 0.88rem; font-weight: 700; color: ${R.textColor};">${b}%</span>
                                    </div>
                                    <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;">
                                        <div style="width: ${b}%; height: 100%; background: ${R.color}; border-radius: 3px; transition: width 0.6s ease;"></div>
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
            `}).join(""),t.querySelectorAll(".server-accordion-header").forEach(d=>{d.addEventListener("click",u=>{const g=d.closest(".server-accordion-item"),p=g.classList.contains("active");g.classList.toggle("active",!p)})})},async pingSingleServer(e,t){if(console.log(`⚡ [MONITORING] pingSingleServer called for server ${e}`),!t)return;t.disabled=!0;const n=t.querySelector("span"),o=n.textContent;n.textContent="Verificando...";const i=t.querySelector(".ping-icon");i&&(i.style.animation="spin 1s linear infinite");try{const s=await E.get(`/monitoring/servers/${e}/ping?t=${Date.now()}`);if(s&&s.success&&s.server){const a=ae.findIndex(r=>r.id===e);a!==-1&&(ae[a]=s.server),this.renderServersAccordion(ae)}}catch(s){console.error("Erro ao pingar servidor individual:",s)}finally{t&&(t.disabled=!1,n&&(n.textContent=o),i&&(i.style.animation=""))}}};let he="list";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=K,ln(),dn(),cn(),Pt.init(),kt.init(),K.init()?(console.log("Sessão restaurada:",K.getUser().email),qt()):Vt()});let vt,ye,Oe,Ve;function ln(){vt=document.querySelectorAll(".nav-btn"),ye=document.getElementById("btn-new-item"),Oe=document.getElementById("login-section"),Ve=document.getElementById("app-container")}function Vt(){Oe&&Oe.classList.remove("hidden"),Ve&&Ve.classList.add("hidden"),document.body.style.overflow="hidden"}function dn(){const e=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=e-5;o<=e+5;o++){const i=document.createElement("option");i.value=o,i.textContent=o,o===e&&(i.selected=!0),n.appendChild(i)}})}function qt(){if(Oe&&Oe.classList.add("hidden"),Ve&&Ve.classList.remove("hidden"),document.body.style.overflow="",he="list",tt(),ee.fetch(),pe.fetch(),ht.fetch(),Q.fetch(),window.auth){const e=document.getElementById("timeline-tab-anexo");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"));const t=document.getElementById("timeline-tab-config");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"))}}function tt(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section","monitoring-section"].forEach(e=>{c.hide(e)}),ye&&ye.classList.add("hidden"),It.stop(),he){case"account":case"profile":c.show("account-section"),c.setText("section-title","Minha Conta"),setTimeout(()=>It.start(),100);break;case"list":c.show("list-section"),c.setText("section-title","Listagem Geral"),K.isAdmin()&&ye&&ye.classList.remove("hidden");break;case"docs":c.show("docs-section"),c.setText("section-title","Documentação");break;case"detail":c.show("detail-section"),c.setText("section-title","Procedimento");break;case"users":c.show("users-section"),c.setText("section-title","Gestão de Usuários");break;case"accounts":c.show("accounts-section"),c.setText("section-title","Gestão de Contas"),Q.handleSearch();break;case"timeline":c.show("timeline-section"),c.setText("section-title","Timeline");break;case"telephony":c.show("telephony-section"),c.setText("section-title","Telefonia");break;case"monitoring":c.show("monitoring-section"),c.setText("section-title","Monitoramento"),kt.fetch();break}jt()}function jt(){const e=K.isAdmin();c.toggle("nav-users",!e),c.toggle("nav-accounts",!e),ye&&ye.classList.toggle("role-hidden",!e);const t=document.getElementById("btn-floating-edit");t&&t.classList.toggle("role-hidden",!e),document.querySelectorAll(".btn-actions-container").forEach(a=>{a.classList.toggle("role-hidden",!e)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(a=>{const r=document.getElementById(a);r&&r.classList.toggle("role-hidden",!e)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!e);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!e);const i=document.getElementById("btn-new-doc");i&&i.classList.toggle("role-hidden",!e);const s=K.getUser();if(s){let a=s.name;(a.toLowerCase().startsWith("usuário ")||a.toLowerCase().startsWith("usuario "))&&(a=a.substring(8)),c.setText("profile-name-display",a),c.setText("profile-role-display",s.role);let r=a.substring(0,2).toUpperCase();const l=a.trim().split(/\s+/);l.length>1&&(r=(l[0][0]+l[l.length-1][0]).toUpperCase()),c.setText("profile-avatar-initials",r)}}function cn(){const e=document.getElementById("sidebar"),t=document.getElementById("sidebar-toggle");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("collapsed")}),vt.forEach(a=>{a.addEventListener("click",()=>{if(vt.forEach(r=>r.classList.remove("active")),a.classList.add("active"),he=a.dataset.section,tt(),window.innerWidth<=768){e.classList.remove("open");const r=document.getElementById("sidebar-overlay");r&&r.classList.remove("active")}})}),window.addEventListener("SectionChange",a=>{he=a.detail.section,tt()}),c.on("login-form","submit",async a=>{a.preventDefault();const r=document.getElementById("login-btn"),l=document.getElementById("login-error");r&&(r.disabled=!0);const d=await K.login(c.getValue("login-email"),c.getValue("login-password"));r&&(r.disabled=!1),d.success?qt():l&&(l.innerText=d.error,l.classList.remove("hidden"))}),c.on("btn-logout","click",()=>{const a=document.getElementById("auto-refresh-toggle");a&&a.checked&&(a.checked=!1,a.dispatchEvent(new Event("change"))),K.logout(),Vt()}),document.querySelectorAll(".close-modal").forEach(a=>{a.addEventListener("click",()=>{const r=a.closest(".modal");r&&r.classList.add("hidden")})}),window.UsersHandler=ht,window.DocsHandler=pe,window.ProceduresHandler=ee,window.AccountsHandler=Q,window.TelephonyHandler=_e,window.monitoringHandler=kt,["extensions","queues","blf","users"].forEach(a=>{c.on(`tab-telephony-${a}`,"click",()=>_e.setActiveTab(a))}),c.on("telephony-search","input",a=>_e.search(a.target.value.toLowerCase())),c.on("telephony-page-size","change",a=>_e.setPageSize(a.target.value)),c.on("telephony-reload-btn","click",()=>{const a=document.getElementById("telephony-search");a&&(a.value=""),_e.fetch()}),c.on("accounts-search","input",()=>Q.handleSearch()),c.on("filter-status","change",()=>Q.handleSearch()),c.on("filter-date-toggle","change",a=>{const r=document.getElementById("sidebar-mini-calendar-list");r&&(r.style.opacity=a.target.checked?"1":"0.4",r.style.pointerEvents=a.target.checked?"auto":"none"),Q.handleSearch()}),c.on("filter-cal-month","change",()=>Q.handleFilterChange(!0)),c.on("filter-cal-year","change",()=>Q.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(a=>{c.on(a,"change",()=>{he==="accounts"&&Q.renderDashboard()})}),c.on("btn-dash-clear-dates","click",()=>{c.setValue("dash-filter-start",""),c.setValue("dash-filter-end",""),c.setValue("dash-filter-type","Todos"),c.setValue("dash-filter-status","Todos"),c.setValue("dash-filter-payment","Todos"),Q.resetMultiselects(),c.setValue("dash-sort-empresas","desc"),c.setValue("dash-sort-categorias","desc"),he==="accounts"&&Q.renderDashboard()}),c.on("user-form","submit",a=>ht.save(a)),c.on("doc-form","submit",a=>pe.handleUpload(a)),c.on("account-form","submit",a=>Q.save(a)),c.on("faq-form","submit",a=>ee.saveMeta(a));const n=document.getElementById("proc-color-palette"),o=document.getElementById("proc-color");n&&o&&(n.addEventListener("click",a=>{const r=a.target.closest(".color-swatch");if(r)if(r.id==="color-custom-swatch")o.click();else{const l=r.dataset.color;l&&(o.value=l,n.querySelectorAll(".color-swatch").forEach(d=>d.classList.remove("active")),r.classList.add("active"))}}),o.addEventListener("input",a=>{const r=document.getElementById("color-custom-swatch");r&&(r.style.background=a.target.value,n.querySelectorAll(".color-swatch").forEach(l=>l.classList.remove("active")),r.classList.add("active"))})),c.on("btn-new-item","click",()=>{if(c.setText("modal-form-title","Novo Procedimento"),c.setValue("proc-id",""),c.setValue("proc-content","[]"),n){n.querySelectorAll(".color-swatch").forEach(r=>r.classList.remove("active"));const a=n.querySelector('[data-color="#4F46E5"]');a&&a.classList.add("active")}o&&(o.value="#4F46E5"),c.show("modal-form")}),c.on("btn-new-account","click",()=>Q.openAccountModal()),c.on("btn-new-account-cal","click",()=>Q.openAccountModal()),c.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),c.setValue("user-id-form",""),c.show("modal-user")}),c.on("list-search","input",a=>{ee.search(a.target.value.toLowerCase())}),c.on("doc-search","input",a=>{pe.search(a.target.value.toLowerCase())}),c.on("doc-dash-search","input",()=>{pe.renderDashboard()}),c.on("doc-dash-filter-category","change",()=>{pe.renderDashboard()}),c.on("doc-dash-filter-status","change",()=>{pe.renderDashboard()}),c.on("btn-new-doc","click",()=>{c.show("modal-upload")}),["geral","contratos","termo-de-uso","dashboard"].forEach(a=>{c.on(`tab-doc-${a}`,"click",()=>{let r;a==="termo-de-uso"?r="Termo de Uso":a==="dashboard"?r="dashboard":r=a,pe.setActiveTab(r)})}),c.on("doc-category","change",a=>{const r=a.target.value.toLowerCase(),l=document.getElementById("doc-dates-container");l&&(l.style.display=r==="contratos"||r==="termo de uso"?"grid":"none")}),c.on("doc-indefinite","change",a=>{const r=document.getElementById("doc-end-date");r&&(r.disabled=a.target.checked,a.target.checked&&(r.value=""))});const i=document.getElementById("drop-zone"),s=document.getElementById("doc-file");i&&s&&(i.addEventListener("click",a=>{a.target!==s&&s.click()}),s.addEventListener("click",a=>{a.stopPropagation()}),s.addEventListener("change",a=>{a.target.files.length>0&&c.setText("file-name-display",a.target.files[0].name)}),i.addEventListener("dragover",a=>{a.preventDefault(),i.classList.add("dragover")}),i.addEventListener("dragleave",()=>{i.classList.remove("dragover")}),i.addEventListener("drop",a=>{a.preventDefault(),i.classList.remove("dragover"),a.dataTransfer.files.length>0&&(s.files=a.dataTransfer.files,c.setText("file-name-display",a.dataTransfer.files[0].name))})),c.on("toggle-list","click",a=>{a.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),ee.setListingMode("list")}),c.on("toggle-cards","click",a=>{a.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),ee.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes"].forEach(a=>{c.on(`tab-acc-${a}`,"click",r=>{document.querySelectorAll(".acc-tab-btn").forEach(p=>p.classList.remove("active")),r.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(p=>{p.classList.add("hidden"),p.classList.remove("active")});const l=document.getElementById("accounts-dashboard-view");l&&(l.classList.add("hidden"),l.classList.remove("active"));const d=a==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${a}`,u=document.getElementById(d);u&&(u.classList.remove("hidden"),u.classList.add("active"));const g=document.getElementById("calendar-view-toggle-container");g&&(a==="calendario"?(g.classList.remove("hidden"),g.style.display="flex"):(g.classList.add("hidden"),g.style.display="none")),Q.setAccountsViewMode(a==="calendario"?"calendar":a==="dashboard"?"dashboard":a==="notificacoes"?"notificacoes":"list")})}),["day","month","year"].forEach(a=>{c.on(`toggle-accounts-cal-${a}`,"click",r=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(l=>l.classList.remove("active")),r.currentTarget.classList.add("active"),["day","month","year"].forEach(l=>{document.getElementById(`cal-${l}-view-container`).classList.toggle("hidden-cal-view",l!==a)}),Q.setCalendarSubView(a)})}),c.on("btn-prev-date-nav","click",()=>Q.shiftCalendarDate(-1)),c.on("btn-next-date-nav","click",()=>Q.shiftCalendarDate(1)),c.on("btn-back-to-accounts","click",()=>{c.hide("dedicated-account-page"),c.show("accounts-section"),jt()}),c.on("btn-back-to-list","click",()=>{const a=document.getElementById("procedure-edit-wrapper");a&&!a.classList.contains("hidden")?ee.toggleEditMode(!1):(he="list",tt())}),c.on("btn-floating-edit","click",()=>ee.toggleEditMode(!0)),c.on("btn-cancel-edit","click",()=>ee.toggleEditMode(!1)),c.on("btn-save-procedure","click",()=>ee.handleSaveProcedure()),c.on("confirm-yes","click",()=>{c.hide("modal-confirm"),ee.openDetail(ee.getPendingProcId())}),c.on("confirm-no","click",()=>{c.hide("modal-confirm")}),c.on("procedure-search","input",a=>{ee.filterProcedureContent(a.target.value)}),c.on("btn-add-block","click",()=>{const a=document.getElementById("section-title-input"),r=document.getElementById("section-type-input");a&&(a.value=""),r&&(r.value="TEXTO"),c.show("modal-add-section")}),c.on("btn-confirm-add-section","click",()=>{const a=c.getValue("section-title-input"),r=c.getValue("section-type-input");if(!a)return alert("Por favor, informe o título da seção.");ee.addSection(a,r),c.hide("modal-add-section")})}
