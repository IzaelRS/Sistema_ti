(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const fe="/api",E={async get(e){const t=await fetch(`${fe}${e}`);if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async post(e,t){const n=await fetch(`${fe}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(e,t){const n=await fetch(`${fe}${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(e){const t=await fetch(`${fe}${e}`,{method:"DELETE"});if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async upload(e,t){const n=await fetch(`${fe}${e}`,{method:"POST",body:t});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let de=null;const _={init(){const e=localStorage.getItem("user");if(e)try{return de=JSON.parse(e),!0}catch{return this.logout(),!1}return!1},getUser(){return de},isAdmin(){return de&&de.role==="Administrador"},async login(e,t){try{const n=await E.post("/login",{email:e,password:t});return de=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){de=null,localStorage.removeItem("user")}},l={show(e){const t=document.getElementById(e);t&&t.classList.remove("hidden")},hide(e){const t=document.getElementById(e);t&&t.classList.add("hidden")},toggle(e,t){const n=document.getElementById(e);n&&n.classList.toggle("hidden",t)},setText(e,t){const n=document.getElementById(e);n&&(n.innerText=t)},setValue(e,t){const n=document.getElementById(e);n&&(n.value=t)},getValue(e){const t=document.getElementById(e);return t?t.value:null},on(e,t,n){const o=document.getElementById(e);o&&o.addEventListener(t,n)}},nt={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const e=window.innerWidth<=768;this.particleCount=e?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let t=0;t<this.particleCount;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const e=document.getElementById("account-section");e&&(this.canvas.width=e.clientWidth,this.canvas.height=e.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let e=0;e<this.particles.length;e++){const t=this.particles[e];t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.canvas.width)&&(t.vx*=-1),(t.y<0||t.y>this.canvas.height)&&(t.vy*=-1),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=e+1;n<this.particles.length;n++){const o=this.particles[n],a=t.x-o.x,s=t.y-o.y,i=Math.sqrt(a*a+s*s);if(i<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const r=1-i/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${r*.4})`,this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let he=[];const Je={async fetch(){try{he=await E.get("/users"),this.render(he)}catch(e){console.error("Error fetching Users:",e)}},getUsers(){return he},render(e){const t=document.getElementById("user-table-body");t&&(t.innerHTML=e.map(n=>{const o=n.role==="Administrador",a=_.isAdmin()?`
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
            </tr>`}).join(""))},openEditModal(e){const t=he.find(n=>n.id===e);t&&(l.setText("modal-user-title","Editar Usuário"),l.setValue("user-id-form",t.id),l.setValue("user-name-form",t.name),l.setValue("user-email-form",t.email),l.setValue("user-password-form",""),l.setValue("user-role-form",t.role),l.show("modal-user"))},async save(e){e.preventDefault();const t=l.getValue("user-id-form"),n={name:l.getValue("user-name-form"),email:l.getValue("user-email-form"),password:l.getValue("user-password-form"),role:l.getValue("user-role-form")};try{t?await E.put(`/users/${t}`,n):await E.post("/users",n),l.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(t?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(e){if(confirm("Deseja excluir este usuário?"))try{await E.delete(`/users/${e}`),this.fetch()}catch(t){alert("Erro ao excluir: "+t.message)}},search(e){const t=he.filter(n=>n.name.toLowerCase().includes(e)||n.email.toLowerCase().includes(e));this.render(t)}};let Ce=[],oe="Geral",A=1;const ye=10;let ot=[];const ee={async fetch(){try{A=1,Ce=await E.get("/documents"),this.filterAndRender()}catch(e){console.error("Error fetching Documents:",e)}},setActiveTab(e){oe=e,A=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(t=>{const n=t.textContent.trim().toLowerCase();t.classList.toggle("active",n===e.toLowerCase())}),this.filterAndRender()},filterAndRender(){const e=document.querySelector(".docs-header");if(oe.toLowerCase()==="dashboard")e&&(e.style.display="none"),l.hide("doc-list-container"),l.show("doc-dashboard-container"),this.renderDashboard();else{e&&(e.style.display="flex"),l.show("doc-list-container"),l.hide("doc-dashboard-container");const t=Ce.filter(n=>(n.category||"Geral").toLowerCase()===oe.toLowerCase());this.render(t)}},calculateRemainingTime(e){if(!e||e==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const t=new Date;t.setHours(0,0,0,0);const n=new Date(e+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-t.getTime(),a=Math.ceil(o/(1e3*60*60*24));if(a<0){const s=Math.abs(a);let i=`Expirado há ${s} dia(s)`;return s>=30&&(i=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:i,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:a}}else{if(a===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:a};if(a<=30)return{text:`Expira em ${a} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:a};{const s=Math.floor(a/30);let i=`Expira em ${s} mês(es)`;if(s>=12){const r=Math.floor(s/12),c=s%12;i=`Expira em ${r} ano(s)${c>0?` e ${c} mês(es)`:""}`}return{text:i,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:a}}}},renderDashboard(){const e=document.getElementById("doc-dashboard-tbody");if(!e)return;const t=Ce.filter(g=>{const h=(g.category||"").toLowerCase();return h==="contratos"||h==="termo de uso"});let n=0,o=0,a=0,s=0;t.forEach(g=>{const h=(g.category||"").toLowerCase(),y=this.calculateRemainingTime(g.end_date);y.status==="expired"?s++:y.status==="critical"?(a++,h==="contratos"&&n++,h==="termo de uso"&&o++):(h==="contratos"&&n++,h==="termo de uso"&&o++)}),l.setText("doc-kpi-active-contracts",n),l.setText("doc-kpi-active-terms",o),l.setText("doc-kpi-warning-docs",a),l.setText("doc-kpi-expired-docs",s);const i=document.getElementById("doc-dash-search"),r=document.getElementById("doc-dash-filter-category"),c=document.getElementById("doc-dash-filter-status"),u=i?i.value.toLowerCase().trim():"",d=r?r.value:"Todos",p=c?c.value:"Todos";let m=t.filter(g=>{if(u&&!g.original_name.toLowerCase().includes(u)||d!=="Todos"&&(g.category||"").toLowerCase()!==d.toLowerCase())return!1;const h=this.calculateRemainingTime(g.end_date);return!(p!=="Todos"&&(p==="Ativos"&&(h.status==="expired"||h.status==="critical")||p==="Expirando"&&h.status!=="critical"||p==="Expirados"&&h.status!=="expired"||p==="Indeterminado"&&h.status!=="indefinite"))});if(m.sort((g,h)=>{const y=this.calculateRemainingTime(g.end_date),T=this.calculateRemainingTime(h.end_date),$={expired:1,critical:2,active:3,indefinite:4},B=$[y.status]||5,j=$[T.status]||5;return B!==j?B-j:y.days-T.days}),m.length===0){e.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const f=window.auth&&window.auth.isAdmin();e.innerHTML=m.map(g=>{const h=g.mimetype==="application/pdf"?"📕":"🖼️",y=g.start_date?new Date(g.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",T=g.end_date?g.end_date==="Indefinido"?"Indefinido":new Date(g.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",$=this.calculateRemainingTime(g.end_date),B=f?`<button class="btn-delete" onclick="window.DocsHandler.delete(${g.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
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
                    <td>${T}</td>
                    <td>
                        <span class="badge" style="background: ${$.color}; color: ${$.textColor}; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                            ${$.text}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <a href="${g.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                Ver
                            </a>
                            ${B}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(e){const t=document.getElementById("doc-list-body");if(!t)return;const n=document.getElementById("doc-list-thead"),o=oe.toLowerCase()==="contratos"||oe.toLowerCase()==="termo de uso",a=window.auth&&window.auth.isAdmin(),s=a?"":'class="role-hidden"';ot=e;const i=e.length,r=Math.ceil(i/ye);A>r&&(A=Math.max(1,r)),A<1&&(A=1);const c=(A-1)*ye,u=e.slice(c,c+ye);if(n&&(o?n.innerHTML=`
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
            `,this.renderPaginationControls("doc-pagination",0,0);return}t.innerHTML=u.map(d=>{const p=d.mimetype==="application/pdf"?"📕":"🖼️",m=(d.size/1024).toFixed(1)+" KB",f=d.created_at?new Date(d.created_at).toLocaleDateString("pt-BR"):"-",g=d.mimetype==="application/pdf"?"PDF":"Imagem",h=a?`<button class="btn-delete" onclick="window.DocsHandler.delete(${d.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",y=d.start_date?new Date(d.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",T=d.end_date?d.end_date==="Indefinido"?"Indefinido":new Date(d.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-";return o?`
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${p}</span>
                                <span title="${d.original_name}">${d.original_name}</span>
                            </span>
                        </td>
                        <td>${m}</td>
                        <td>${g}</td>
                        <td>${y}</td>
                        <td>${T}</td>
                        <td>${f}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${d.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
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
                                <span>${p}</span>
                                <span title="${d.original_name}">${d.original_name}</span>
                            </span>
                        </td>
                        <td>${m}</td>
                        <td>${g}</td>
                        <td>${f}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${d.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${h}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",r,i)},async handleUpload(e){e.preventDefault();const t=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!t.files.length){alert("Selecione um arquivo.");return}const a=new FormData,s=n?n.value:"Geral";a.append("category",s),a.append("customName",o?o.value:""),a.append("document",t.files[0]);const i=s.toLowerCase();if(i==="contratos"||i==="termo de uso"){const r=document.getElementById("doc-start-date"),c=document.getElementById("doc-end-date"),u=document.getElementById("doc-indefinite");r&&r.value&&a.append("startDate",r.value),u&&u.checked?a.append("endDate","Indefinido"):c&&c.value&&a.append("endDate",c.value)}try{await E.upload("/documents",a),l.hide("modal-upload"),document.getElementById("doc-form").reset();const r=document.getElementById("doc-dates-container");r&&(r.style.display="none");const c=document.getElementById("doc-end-date");c&&(c.disabled=!1),l.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(r){console.error(r),alert("Erro ao subir arquivo.")}},async delete(e){if(confirm("Deletar este documento?"))try{await E.delete(`/documents/${e}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(e){if(oe.toLowerCase()==="dashboard")this.renderDashboard();else{A=1;const t=Ce.filter(n=>(n.category||"Geral").toLowerCase()===oe.toLowerCase()&&n.original_name.toLowerCase().includes(e));this.render(t)}},changePage(e){A=e,this.render(ot)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${A===1?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${A-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=A-1&&c<=A+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===A?"active":""}" 
                            onclick="window.DocsHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${A===t?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${A+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(A-1)*ye+1,r=Math.min(A*ye,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let Z=[],w={summaries:[]},at=null,I=null,Fe="list",ve=null,Q=null,it=null,H=1;const be=10;let ke=[];const O={getPendingProcId(){return at},async fetch(){try{H=1,Z=await E.get("/procedures"),this.renderTable(Z)}catch(e){console.error("Error fetching FAQs:",e)}},getFaqs(){return Z},setListingMode(e){Fe=e,H=1,this.renderTable(ke.length?ke:Z)},renderTable(e){const t=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!t||!n||!o)return;ke=e;const a=e.length,s=Math.ceil(a/be);H>s&&(H=Math.max(1,s)),H<1&&(H=1);const i=(H-1)*be,r=e.slice(i,i+be);Fe==="list"?(l.show("list-table-container"),l.hide("list-cards-container"),r.length===0?o.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            Nenhum procedimento encontrado.
                        </td>
                    </tr>
                `:o.innerHTML=r.map(u=>{const d=_.isAdmin()?`
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
                        ${d}
                    </tr>`}).join("")):(l.hide("list-table-container"),l.show("list-cards-container"),r.length===0?n.innerHTML=`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum procedimento encontrado.
                    </div>
                `:n.innerHTML=r.map(u=>{const d=_.isAdmin()?`
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
                        ${d}
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,a),(Fe==="list"?o:n).addEventListener("click",function(d){const p=d.target.closest('[data-action="edit"], [data-action="delete"]');if(p){d.stopPropagation(),d.preventDefault();const f=Number(p.dataset.id);p.dataset.action==="edit"?O.openEditModal(f):p.dataset.action==="delete"&&O.deleteProcedure(f);return}const m=d.target.closest('[data-action="open"]');if(m){const f=Number(m.dataset.id);O.openDetail(f)}})},openDetail(e){const t=Z.find(o=>o.id===e);if(!t)return;l.setText("detail-title",t.name||t.title||"Sem título"),l.setValue("proc-id",t.id);try{let o=t.content?JSON.parse(t.content):[];Array.isArray(o)?w={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?w=o:w={summaries:[]}}catch{w={summaries:[]}}w.summaries.length>0?I=w.summaries[0].id:I=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(e){const t=Z.find(n=>n.id===e);t&&(l.setText("modal-form-title","Editar Procedimento"),l.setValue("proc-id",t.id),l.setValue("proc-name",t.name||t.title||""),l.setValue("proc-responsible",t.responsible||""),l.setValue("proc-group",t.group_name||""),l.setValue("proc-note",t.note||""),l.setValue("proc-content",t.content||""),l.setValue("proc-color",t.color||"#4F46E5"),l.show("modal-form"))},async saveMeta(e){e&&e.preventDefault();const t=l.getValue("proc-id"),n={name:l.getValue("proc-name").toUpperCase(),responsible:l.getValue("proc-responsible").toUpperCase(),group_name:l.getValue("proc-group"),note:l.getValue("proc-note"),content:l.getValue("proc-content"),color:l.getValue("proc-color")};try{const o=t?`/procedures/${t}`:"/procedures";at=(t?await E.put(o,n):await E.post(o,n)).id,l.hide("modal-form"),document.getElementById("faq-form").reset(),l.setValue("proc-responsible","TI"),l.setValue("proc-group","Geral"),await this.fetch(),l.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(e){if(confirm("Deseja excluir este procedimento?"))try{await E.delete(`/procedures/${e}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(e){const t=document.querySelector(".procedure-sidebar");e?(l.hide("procedure-view-container"),l.hide("procedure-view-sidebar"),l.show("procedure-edit-wrapper"),l.show("procedure-edit-sidebar"),l.hide("btn-floating-edit"),t&&t.classList.add("glass","has-border"),w.summaries.length>0?w.summaries.find(n=>n.id===I)||(I=w.summaries[0].id):I=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(l.show("procedure-view-container"),l.show("procedure-view-sidebar"),l.hide("procedure-edit-wrapper"),l.hide("procedure-edit-sidebar"),l.show("btn-floating-edit"),t&&t.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const e=document.getElementById("procedure-view-container"),t=document.getElementById("procedure-view-index");if(!e||!t)return;if(w.summaries.length===0){e.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',t.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";w.summaries.forEach((a,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${a.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${a.title}</li>`,n+=`<div id="sum-view-${a.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(w.summaries.length>1||a.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${a.title}</h4>`),a.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const i=a.sections.map((r,c)=>{let u="";if(r.type==="TEXTO")u=`<div class="gh-content"><div class="gh-text-view">${r.data||"Sem conteúdo."}</div></div>`;else if(r.type==="FAQ")u='<div class="gh-faq-list">'+(r.data||[]).map((m,f)=>`
                         <div class="gh-accordion" id="gh-faq-${a.id}-${c}-${f}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${a.id}-${c}-${f}')">
                                   <div class="gh-accordion-title">${m.q||"Pergunta sem título"}</div>
                                   <span class="gh-accordion-icon">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                   </span>
                              </div>
                              <div class="gh-accordion-content gh-text-view">${m.a||"Sem resposta."}</div>
                         </div>
                     `).join("")+"</div>";else if(r.type==="DOCUMENTO"&&r.data&&r.data.path){const p=r.data.mimetype&&r.data.mimetype.startsWith("image/"),m=r.data.mimetype==="application/pdf";let f="";p?f=`<div class="doc-embed-container"><img src="${r.data.path}" alt="${r.data.name}" class="doc-embed-image" /></div>`:m?f=`<div class="doc-embed-container" style="display: block;"><iframe src="${r.data.path}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="doc-embed-pdf" title="${r.data.name}"></iframe></div>`:f='<div class="doc-embed-container" style="padding: 20px; text-align: center; color: var(--text-muted);"><p>Visualização não disponível para este formato.</p></div>',u=`
                        <div class="gh-doc-container">
                            ${f}
                            <div class="doc-actions" style="margin-top: 15px; text-align: center;">
                                <a href="${r.data.path}" target="_blank" class="btn-secondary-small" style="display: inline-block;">
                                    Abrir/Download Original (${r.data.name})
                                </a>
                            </div>
                        </div>`}let d="var(--text-muted)";return r.type==="DOCUMENTO"?d="#10B981":r.type==="FAQ"?d="#FBBF24":r.type==="TEXTO"&&(d="#3B82F6"),`
                     <div class="gh-box">
                         <div class="gh-header" style="display: flex; align-items: center; gap: 10px;">
                             <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${d};"></span>
                             <h3>${r.title}</h3>
                         </div>
                         ${u}
                     </div>
                 `}).join("");n+=i,n+="</div>"}),t.innerHTML=o,e.innerHTML=n},filterProcedureContent(e){e=e.toLowerCase();const t=document.getElementById("procedure-view-container");if(!t)return;t.querySelectorAll(".gh-box").forEach(o=>{const a=o.querySelector(".gh-faq-list");let s=!1;const i=o.querySelector(".gh-header"),r=i?i.textContent.toLowerCase().includes(e):!1;a&&a.querySelectorAll(".gh-accordion").forEach(d=>{const p=d.textContent.toLowerCase();r||p.includes(e)?(d.classList.remove("hidden"),s=!0):d.classList.add("hidden")});const c=o.textContent.toLowerCase();r||c.includes(e)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const e=document.getElementById("procedure-edit-index"),t=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!e)return;e.innerHTML=w.summaries.map((a,s)=>`
             <li class="sidebar-index-item ${a.id===I?"active":""} editable-section style-none"
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
            `).join("");const o=w.summaries.find(a=>a.id===I);o?(n.textContent=o.title,n.style.color="var(--text-main)",t.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",t.classList.add("hidden"))},selectSummary(e){I=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(e,t){const n=w.summaries.find(a=>a.id===e);n&&(n.title=t||"Sem título"),this.renderProcedureBuilderSidebar();const o=w.summaries.find(a=>a.id===I);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const e="sum_"+Date.now();w.summaries.push({id:e,title:`Sumário ${w.summaries.length+1}`,sections:[]}),I=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(e){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(w.summaries=w.summaries.filter(t=>t.id!==e),I===e&&(I=w.summaries.length>0?w.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const e=document.getElementById("procedure-edit-container");if(!e)return;if(!I){e.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const t=w.summaries.find(o=>o.id===I);if(!t)return;const n=t.sections;if(n.length===0){e.innerHTML=`<p class="empty-state">Nenhum campo em "${t.title}". Clique em "+ Novo Container" para começar.</p>`;return}e.innerHTML=n.map((o,a)=>`
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
             </div>`).join("")},handleSumDragStart(e,t){ve="summary",Q=t,e.dataTransfer.effectAllowed="move",setTimeout(()=>{e.target&&e.target.classList.add("dragging")},0)},handleSumDrop(e,t){if(e.preventDefault(),ve!=="summary"||Q===null||Q===t)return;const n=w.summaries.splice(Q,1)[0];w.summaries.splice(t,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(e,t,n){ve="container",Q=t,it=n,e.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=e.target.nodeType===1?e.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect="move"},handleSecDrop(e,t,n){if(e.preventDefault(),ve!=="container"||Q===null||it!==n)return;const o=w.summaries.find(s=>s.id===n);if(!o||Q===t)return;const a=o.sections.splice(Q,1)[0];o.sections.splice(t,0,a),this.renderProcedureBuilder()},handleDragEnd(e){document.querySelectorAll(".editable-section.dragging").forEach(t=>t.classList.remove("dragging")),e&&e.target&&e.target.setAttribute&&e.target.setAttribute("draggable","false"),ve=null,Q=null},updateSectionTitle(e,t){const n=w.summaries.find(o=>o.id===I);n&&(n.sections[e].title=t)},updateSectionData(e,t){const n=w.summaries.find(o=>o.id===I);n&&(n.sections[e].data=t)},removeSection(e){const t=w.summaries.find(n=>n.id===I);t&&t.sections.splice(e,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(e){const t=w.summaries.find(n=>n.id===I);t&&(t.sections[e].data=t.sections[e].data||[],t.sections[e].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(e,t,n,o){const a=w.summaries.find(s=>s.id===I);a&&(a.sections[e].data[t][n]=o)},removeFaqItem(e,t){const n=w.summaries.find(o=>o.id===I);n&&n.sections[e].data.splice(t,1),this.renderProcedureBuilder()},addSection(e,t){if(!I){alert("Selecione primeiro um sumário na barra lateral.");return}const n=w.summaries.find(o=>o.id===I);n&&(n.sections.push({id:Date.now(),title:e,type:t,data:t==="FAQ"?[]:t==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(e,t){t.dataTransfer.files&&t.dataTransfer.files.length>0&&await this.uploadSectionFile(e,t.dataTransfer.files[0])},async handleSectionFileUpload(e,t){const n=t.files[0];n&&await this.uploadSectionFile(e,n)},async uploadSectionFile(e,t){const n=new FormData;n.append("file",t);try{const o=await E.upload("/upload",n),a=w.summaries.find(s=>s.id===I);a&&(a.sections[e].data={name:t.name,path:o.path,mimetype:t.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const e=parseInt(l.getValue("proc-id"));if(!e)return;const n={...Z.find(o=>o.id===e),content:JSON.stringify(w)};try{await E.put(`/procedures/${e}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(e),this.fetch()}catch{alert("Erro ao salvar")}},search(e){H=1;const t=Z.filter(n=>(n.name||n.title||"").toLowerCase().includes(e)||(n.responsible||"").toLowerCase().includes(e)||(n.group_name||"").toLowerCase().includes(e));this.renderTable(t)},changePage(e){H=e,this.renderTable(ke)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${H===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${H-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=H-1&&c<=H+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===H?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${H===t?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${H+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(H-1)*be+1,r=Math.min(H*be,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};window.toggleGhAccordion=function(e){const t=document.getElementById(e);t&&t.classList.toggle("open")};let R=[],ue="list",ae="month",x=new Date,V=1;const we=10;let st=[];const P={async fetch(){try{V=1,R=await E.get("/accounts"),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(e){console.error("Falha ao obter contas",e)}},populateCompanyFilter(){const e=document.getElementById("dash-filter-company-dynamic-options");if(e){const t=new Set;e.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{t.add(a.value)});const n=[...new Set(R.map(a=>a.company_name).filter(Boolean))].sort((a,s)=>a.localeCompare(s));let o="";n.forEach(a=>{const s=t.has(a)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${a}" ${s}> <span>${a}</span></label>`}),e.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(e){if(!document.getElementById(`${e}-container`))return;const n=document.getElementById(`${e}-trigger`),o=document.getElementById(`${e}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",r=>{r.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(c=>{c!==o&&c.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const a=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(r=>r.value!=="Todos"),i=()=>{const r=s.filter(u=>u.checked).map(u=>u.value),c=n.querySelector(".trigger-label");a.checked||s.length>0&&r.length===s.length?(a.checked=!0,c&&(c.innerText="Todos")):r.length===0?c&&(c.innerText="Nenhum"):r.length===1?c&&(c.innerText=r[0]):c&&(c.innerText=`${r.length} selecionados`)};a&&!a.dataset.listenerBound&&(a.addEventListener("change",()=>{s.forEach(r=>{r.checked=a.checked}),i(),this.renderDashboard()}),a.dataset.listenerBound="true"),s.forEach(r=>{r.dataset.listenerBound||(r.addEventListener("change",()=>{s.every(u=>u.checked)?a.checked=!0:a.checked=!1,i(),this.renderDashboard()}),r.dataset.listenerBound="true")}),i()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",e=>{e.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(t=>{t.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(e){const t=document.getElementById(`${e}-dropdown`);if(!t)return["Todos"];const n=t.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(e=>{const t=document.getElementById(`${e}-dropdown`);if(t){t.querySelectorAll('input[type="checkbox"]').forEach(a=>{a.checked=a.value==="Todos"});const o=document.getElementById(`${e}-trigger`);if(o){const a=o.querySelector(".trigger-label");a&&(a.innerText="Todos")}}})},getAccounts(){return R},setAccountsViewMode(e){ue=e,this.handleSearch()},setCalendarSubView(e){ae=e,this.handleSearch()},shiftCalendarDate(e){ae==="day"?x.setDate(x.getDate()+e):ae==="month"?x.setMonth(x.getMonth()+e):ae==="year"&&x.setFullYear(x.getFullYear()+e),l.setValue("filter-day",x.getDate()),l.setValue("filter-month",x.getMonth()),l.setValue("filter-year",x.getFullYear()),this.handleSearch()},handleFilterChange(e=!1){if(e){const t=l.getValue("filter-cal-year")?parseInt(l.getValue("filter-cal-year")):x.getFullYear(),n=l.getValue("filter-cal-month")?parseInt(l.getValue("filter-cal-month")):x.getMonth();x=new Date(t,n,1)}else{const t=l.getValue("filter-year")?parseInt(l.getValue("filter-year")):x.getFullYear(),n=l.getValue("filter-month")?parseInt(l.getValue("filter-month")):x.getMonth(),o=l.getValue("filter-day")?parseInt(l.getValue("filter-day")):x.getDate();x=new Date(t,n,o)}l.setValue("filter-month",x.getMonth()),l.setValue("filter-year",x.getFullYear()),this.handleSearch()},handleSearch(){const e=(l.getValue("accounts-search")||"").toLowerCase();let t=R.filter(n=>n.company_name.toLowerCase().includes(e)||n.description&&n.description.toLowerCase().includes(e));if(ue==="list"){V=1;const n=l.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),a=o?o.checked:!1,s=x.getFullYear(),i=x.getMonth(),r=x.getDate();t=t.filter(c=>{if(n&&c.status!==n)return!1;if(!a||!c.due_date)return!0;const[u,d,p]=c.due_date.split("-"),m=parseInt(u,10),f=parseInt(d,10)-1,g=parseInt(p,10);return c.type==="Único"?m===s&&f===i&&g===r:c.type==="Recorrente"?g===r:!0}),this.renderAccountsList(t)}else ue==="notificacoes"?this.renderNotifications():ue==="dashboard"?this.renderDashboard():this.renderCalendarWrapper(t)},checkAccountAlerts(){let e=!1;const t=new Date;t.setHours(0,0,0,0),R.forEach(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a==="on"&&s==="pendente"&&o.due_date){const[i,r,c]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(c,10));u.setHours(0,0,0,0),u.getTime()<=t.getTime()&&(e=!0)}});const n=document.getElementById("icon-alert-bell");n&&(e?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const e=document.getElementById("accounts-notifications-body");if(!e)return;e.innerHTML="";const t=new Date;t.setHours(0,0,0,0);let n=R.filter(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a!=="on"||s!=="pendente"||!o.due_date)return!1;const[i,r,c]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(c,10));return u.setHours(0,0,0,0),u.getTime()<=t.getTime()});if(n.length===0){e.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const a=document.createElement("tr");let s="Sem Data";if(o.due_date){const r=o.due_date.split("-");r.length===3&&(s=`${r[2]}/${r[1]}/${r[0]}`)}const i=_.isAdmin()?`
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
            `,e.appendChild(a)})},renderAccountsList(e){const t=document.getElementById("accounts-table-body");if(!t)return;t.innerHTML="",this.renderSidebarMiniCalendar(),st=e;const n=e.length,o=Math.ceil(n/we);V>o&&(V=Math.max(1,o)),V<1&&(V=1);const a=(V-1)*we,s=e.slice(a,a+we);if(s.length===0){t.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(i=>{const r=document.createElement("tr");let c="Sem Data";if(i.due_date){const p=i.due_date.split("-");p.length===3&&(c=`${p[2]}/${p[1]}/${p[0]}`)}const u=i.status==="Off",d=_.isAdmin()?`
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
                <td>${c}</td>
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
                        ${d}
                    </div>
                </td>
            `,t.appendChild(r)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(ue!=="dashboard")return;this.initDashboardMultiselects();const e=l.getValue("dash-filter-start"),t=l.getValue("dash-filter-end"),n=l.getValue("dash-filter-type")||"Todos",o=l.getValue("dash-filter-status")||"Todos",a=l.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),i=this.getMultiselectValues("dash-filter-company");let r=e?new Date(e+"T00:00:00"):null,c=t?new Date(t+"T23:59:59"):null;if(!r&&!c){const v=new Date;r=new Date(v.getFullYear(),v.getMonth(),1,0,0,0),c=new Date(v.getFullYear(),v.getMonth()+1,0,23,59,59)}else r?c||(c=new Date(2100,11,31)):r=new Date(2e3,0,1);let u=0,d=0,p=new Set,m=new Set,f=0,g=0,h=0,y="-",T=0,$=0,B={},j={},F={};R.forEach(v=>{if(!v.due_date||n!=="Todos"&&v.type!==n||o!=="Todos"&&v.status!==o||a!=="Todos"&&v.payment_status!==a)return;if(!s.includes("Todos")){if(s.length===0)return;const D=v.category||"Outros";if(!s.includes(D))return}if(!i.includes("Todos")&&(i.length===0||!i.includes(v.company_name)))return;let M=0,z=new Date(r);z.setHours(0,0,0,0);let q=new Date(c);q.setHours(0,0,0,0);let U=3650;for(;z<=q&&U>0;){if(this.isEventOnDate(v,z.getFullYear(),z.getMonth(),z.getDate())){M++;const D=`${z.getFullYear()}-${String(z.getMonth()+1).padStart(2,"0")}`;F[D]||(F[D]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const Y=parseFloat(v.value||0);F[D].total+=Y,v.payment_status==="Pago"&&(F[D].pago+=Y),v.payment_status==="Pendente"&&(F[D].pendente+=Y),v.type==="Recorrente"&&(F[D].fixo+=Y),v.type==="Único"&&(F[D].variavel+=Y)}z.setDate(z.getDate()+1),U--}if(M>0){const D=parseFloat(v.value||0)*M;u+=D,d+=M,p.add(v.category||"Outros"),m.add(v.company_name),v.payment_status==="Pago"&&(f+=D),v.payment_status==="Pendente"&&(g+=D),v.type==="Recorrente"&&(T+=D),v.type==="Único"&&($+=D),D>h&&(h=D,y=v.company_name);const Y=v.category||"Outros";j[Y]=(j[Y]||0)+D;const ce=v.company_name||"Sem Empresa";B[ce]=(B[ce]||0)+D}}),l.setText("dash-metric-valor","R$ "+u.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-contas",d.toString()),l.setText("dash-metric-tipos",p.size.toString()),l.setText("dash-metric-empresas",m.size.toString()),l.setText("dash-metric-pago","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-pendente","R$ "+g.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-maior-valor","R$ "+h.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-maior-nome",y),l.setText("dash-metric-fixo","R$ "+T.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-variavel","R$ "+$.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const b=l.getValue("dash-sort-empresas")||"desc",C=l.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",B,b),this.renderTierList("dash-list-categorias",j,C),this.renderTimeChart(F)},renderTimeChart(e){window.timeChartInstance&&window.timeChartInstance.destroy();const t=document.getElementById("chart-dashboard-time");if(!t)return;const n=Object.keys(e).sort(),o=n.map(d=>{const[p,m]=d.split("-");return`${m}/${p}`}),a=n.map(d=>e[d].total),s=n.map(d=>e[d].pago),i=n.map(d=>e[d].pendente),r=n.map(d=>e[d].fixo),c=n.map(d=>e[d].variavel),u={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:a,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:i,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:r,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:c,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(d){let p=d.dataset.label||"";return p&&(p+=": "),d.parsed.y!==null&&(p+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(d.parsed.y)),p}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(d,p,m){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(d)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(t.getContext("2d"),u)},renderTierList(e,t,n){const o=document.getElementById(e);if(!o)return;const a=Object.entries(t);if(a.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}a.sort((r,c)=>n==="asc"?r[1]-c[1]:c[1]-r[1]);const s=a.slice(0,10);let i="";s.forEach(([r,c],u)=>{const d=u===0&&n==="desc",p=d?"🏆 ":u+1+". ";i+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${d?"bold":"normal"}; color: ${d?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${r}">
                        ${p}${r}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${c.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=i},renderCharts(e){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const t=document.getElementById("chart-category");if(t){const o={labels:Object.keys(e),datasets:[{data:Object.values(e),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(t.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],a=[];let s=new Date;for(let i=-5;i<=6;i++){let r=new Date(s.getFullYear(),s.getMonth()+i,1);o.push(r.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let c=0;R.forEach(u=>{if(!u.due_date||u.status==="Off")return;const[d,p]=u.due_date.split("-"),m=new Date(parseInt(d),parseInt(p)-1,1);(u.type==="Recorrente"&&r.getTime()>=m.getTime()||u.type==="Único"&&r.getFullYear()===parseInt(d)&&r.getMonth()===parseInt(p)-1)&&(c+=parseFloat(u.value||0))}),a.push(c)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:a,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(e){const t={},n=[];return e.forEach(o=>{if(o.type==="Único")n.push(o);else if(!t[o.company_name])t[o.company_name]=o;else{const a=new Date(t[o.company_name].due_date||0);new Date(o.due_date||0)>a&&(t[o.company_name]=o)}}),[...n,...Object.values(t)]},isEventOnDate(e,t,n,o){if(!e.due_date)return!1;const[a,s,i]=e.due_date.split("-"),r=parseInt(a,10),c=parseInt(s,10)-1,u=parseInt(i,10);if(e.type==="Único")return t===r&&n===c&&o===u;if(e.type==="Recorrente"){const d=new Date(r,c,u).setHours(0,0,0,0);if(new Date(t,n,o).setHours(0,0,0,0)<d)return!1;const m=e.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(m)){const f=(t-r)*12+(n-c),g=new Date(t,n+1,0).getDate(),h=Math.min(u,g);if(o!==h||f<0)return!1;if(m==="1 mes")return!0;if(m==="3 meses")return f%3===0;if(m==="6 meses")return f%6===0;if(m==="1 ano")return n===c}else{const f=Date.UTC(r,c,u),g=Date.UTC(t,n,o),h=Math.round((g-f)/(1e3*60*60*24));if(m==="1 dia")return!0;if(m==="7 dias")return h%7===0;if(m==="15 dias")return h%15===0}}return!1},renderCalendarWrapper(e){const t=x.getFullYear(),n=x.getMonth(),o=x.getDate();ae==="month"?this.renderCalendarMonth(e,t,n):ae==="year"?this.renderCalendarYear(e,t):ae==="day"&&this.renderCalendarDay(e,t,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const e=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],t=x.getFullYear(),n=x.getMonth(),o=x.getDate(),a=new Date(t,n,1).getDay(),s=new Date(t,n+1,0).getDate(),i=new Date,r=i.getFullYear(),c=i.getMonth(),u=i.getDate(),d=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let p="";d.forEach((g,h)=>{p+=`<option value="${h}" ${h===n?"selected":""}>${g}</option>`});let m="";for(let g=r-5;g<=r+5;g++)m+=`<option value="${g}" ${g===t?"selected":""}>${g}</option>`;let f=`
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.parentElement.children[1].value, this.value)">
                    ${p}
                </select>
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.value, this.parentElement.children[0].value)">
                    ${m}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button class="btn-primary" style="width: 100%; padding: 4px 0; justify-content: center; font-size: 0.85rem;" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${r}, ${c}, ${u})">Hoje</button>
            </div>
            <div class="smc-header">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div class="smc-grid">
        `;for(let g=0;g<a;g++)f+='<div class="smc-day empty"></div>';for(let g=1;g<=s;g++)f+=`<div class="smc-day ${g===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${t}, ${n}, ${g})">${g}</div>`;f+="</div>",e.forEach(g=>{g&&(g.innerHTML=f)})},changeMiniCalendarMonthYear(e,t){let n=x.getDate();const o=new Date(e,parseInt(t)+1,0).getDate();n>o&&(n=o),x=new Date(e,t,n);try{l.setValue("filter-cal-year",e),l.setValue("filter-cal-month",t)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(e,t,n){x=new Date(e,t,n);try{l.setValue("filter-cal-year",e),l.setValue("filter-cal-month",t)}catch{}if(ue==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(e,t,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];l.setText("calendar-date-display",`${o[n]} ${t}`);const a=document.getElementById("calendar-month-grid");a.innerHTML="";const s=new Date(t,n,1).getDay(),i=new Date(t,n+1,0).getDate(),r=new Date,c=r.getFullYear()===t&&r.getMonth()===n;new Date(r.getFullYear(),r.getMonth(),1);for(let d=0;d<s;d++)a.innerHTML+='<div class="calendar-day empty"></div>';for(let d=1;d<=i;d++){const p=c&&r.getDate()===d?"today":"";a.innerHTML+=`<div class="calendar-day ${p}" id="cal-day-cell-${d}">
                <div class="calendar-date">${d}</div>
                <div class="calendar-events" id="cal-events-${d}"></div>
            </div>`}this.getLatestRecorrenteAccounts(e).forEach(d=>{if(!d.due_date)return;const p=new Date(t,n,1),m=new Date(r.getFullYear(),r.getMonth(),1);let f=!0;if(d.status==="Off"&&p.getTime()>=m.getTime()&&(f=!1),!!f){for(let g=1;g<=i;g++)if(this.isEventOnDate(d,t,n,g)){const h=document.getElementById(`cal-events-${g}`);if(h){const y=`${t}-${String(n+1).padStart(2,"0")}-${String(g).padStart(2,"0")}`;let T=d.payment_status==="Pago"?"event-paid":d.payment_status==="Pendente"?"event-pending":"event-canceled";d.type==="Recorrente"&&y!==d.due_date&&(T="event-pending");const $=document.createElement("div");$.className=`event-pill event-${d.type.toLowerCase()} ${T}`,$.title=d.company_name,$.innerText=d.company_name,$.onclick=B=>{this.openDedicatedPage(d.id,y)},h.appendChild($)}}}})},renderCalendarDay(e,t,n,o){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];l.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${a[n]} de ${t}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const i=new Date(t,n,o),r=new Date;r.setHours(0,0,0,0),i.setHours(0,0,0,0);let c=0;this.getLatestRecorrenteAccounts(e).forEach(d=>{let p=!0;if(d.status==="Off"&&i.getTime()>=r.getTime()&&(p=!1),!!p&&this.isEventOnDate(d,t,n,o)){c++;const m=`${t}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let f=d.payment_status==="Pago"?"#4ade80":d.payment_status==="Pendente"?"#facc15":"#ef4444";d.type==="Recorrente"&&m!==d.due_date&&(f="#facc15"),s.innerHTML+=`
                    <div class="day-event-row ${d.type.toLowerCase()}">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${f}; margin-top: 5px;"></div>
                        <div class="day-evt-info">
                            <h4>${d.company_name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8">(${d.type} - ${d.category||"Outros"})</span></h4>
                            <p style="font-weight: bold; color: var(--text-main); margin: 4px 0;">R$ ${parseFloat(d.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                            <p>${d.description||"Nenhuma descrição detalhada."}</p>
                        </div>
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${d.id}, '${m}')" title="Detalhes">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                `}}),c===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(e,t){l.setText("calendar-date-display",`Ano de ${t}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],a=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const i=new Date(t,s,1);let r=0,c=0,u=0;this.getLatestRecorrenteAccounts(e).forEach(m=>{let f=!0;if(m.status==="Off"&&i.getTime()>=a.getTime()&&(f=!1),!f)return;const g=new Date(t,s+1,0).getDate();for(let h=1;h<=g;h++)this.isEventOnDate(m,t,s,h)&&(r++,m.type==="Recorrente"?c++:u++)});const p=r>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${p}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${r}</strong></p>
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${c}</p>`:""}
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${u}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(e){x.setMonth(e),l.setValue("filter-month",e),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(e=null){document.getElementById("account-form").reset();const t=document.getElementById("account-type");if(t.onchange=()=>{t.value==="Recorrente"?l.show("account-frequency-group"):l.hide("account-frequency-group")},e){l.setText("account-modal-title","Editar Conta");const n=R.find(o=>o.id===e);n&&(l.setValue("account-id",n.id),l.setValue("account-company",n.company_name),l.setValue("account-type",n.type),l.setValue("account-category",n.category||"Outros"),l.setValue("account-frequency",n.frequency||"1 mes"),l.setValue("account-value",parseFloat(n.value||0).toFixed(2)),l.setValue("account-status",n.status),l.setValue("account-payment-status",n.payment_status||"Pendente"),l.setValue("account-due-date",n.due_date||""),l.setValue("account-description",n.description||""),l.setValue("account-observation",n.observation||""),t.onchange())}else l.setText("account-modal-title","Nova Conta"),l.setValue("account-id",""),t.onchange();l.show("account-modal-form")},openDedicatedPage(e,t=null){const n=R.find(m=>m.id===e);if(!n)return;let o=R.filter(m=>m.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((m,f)=>new Date(f.due_date||0)-new Date(m.due_date||0)),l.hide("accounts-section"),l.show("dedicated-account-page"),l.setText("ded-acc-company",n.company_name);let a=0,s=0,i=0;const r=new Date;r.setHours(0,0,0,0),this.currentCompanyHistory.forEach(m=>{const f=parseFloat(m.value||0);if(m.payment_status==="Pago")a+=f,i++;else if(m.payment_status==="Pendente"&&m.due_date){const[g,h,y]=m.due_date.split("-"),T=new Date(parseInt(g,10),parseInt(h,10)-1,parseInt(y,10));T.setHours(0,0,0,0),T.getTime()<r.getTime()&&(s+=f)}});const c=a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),u=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});l.setText("ded-acc-total-paid","R$ "+c),l.setText("ded-acc-total-pending","R$ "+u),l.setText("ded-acc-total-count",i.toString());const d=document.getElementById("ded-acc-status-badge");n.status==="On"?d.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':d.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,t);const p=document.getElementById("btn-ded-add-history");p&&(p.onclick=()=>{this.openAccountModal(),setTimeout(()=>{l.setValue("account-company",n.company_name),l.setValue("account-type",n.type),l.setValue("account-category",n.category)},100)},_.isAdmin()||(p.style.display="none"))},injectCurrentMonthProjections(e){const t=new Date,n=t.getFullYear(),o=t.getMonth(),a=new Date(n,o+1,0).getDate();let s=null;if(e.forEach(c=>{c.type==="Recorrente"&&(s?new Date(c.due_date||0)>new Date(s.due_date||0)&&(s=c):s=c)}),!s)return e;const i=[...e],r=new Set(e.map(c=>c.due_date));for(let c=1;c<=a;c++)if(this.isEventOnDate(s,n,o,c)){const u=`${n}-${String(o+1).padStart(2,"0")}-${String(c).padStart(2,"0")}`;r.has(u)||i.push({...s,is_projection:!0,due_date:u,payment_status:"Pendente",unique_key:s.id+"_"+u})}return i.forEach(c=>{c.unique_key||(c.unique_key=c.id.toString())}),i},renderDedicatedHistoryList(){const e=document.getElementById("ded-acc-history-list");if(e){if(e.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){e.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(t=>{let n="Sem Data";if(t.due_date){const i=t.due_date.split("-");i.length===3&&(n=`${i[2]}/${i[1]}/${i[0]}`)}const o=parseFloat(t.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let a="#eab308";t.payment_status==="Pago"?a="#4ade80":t.payment_status==="Cancelado"&&(a="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==t.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===t.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(t.id,t.is_projection?t.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${a}22; color: ${a}; font-size: 0.75rem;">${t.payment_status||"Pendente"}</span>
                </div>
            `,e.appendChild(s)})}},selectHistoryItem(e,t=null){this.currentSelectedHistoryKey=t?e+"_"+t:e.toString(),this.renderDedicatedHistoryList();let n=null;if(t&&(n=this.currentCompanyHistory.find(r=>r.id===e&&r.due_date===t&&r.is_projection)),n||(n=this.currentCompanyHistory.find(r=>r.id===e&&!r.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){l.show("ded-acc-details-empty"),l.hide("ded-acc-details-content");return}l.hide("ded-acc-details-empty"),l.show("ded-acc-details-content");let o="DD/MM/YYYY";const a=t||n.due_date;if(a){const r=a.split("-");r.length===3&&(o=`${r[2]}/${r[1]}/${r[0]}`)}l.setText("ded-acc-det-date",o),l.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),l.setValue("ded-acc-det-date-input",a||""),l.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),l.setValue("ded-acc-det-account-status-input",n.status||"On"),l.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(l.show("ded-acc-det-freq-group"),l.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):l.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const r={...n,value:l.getValue("ded-acc-det-val-input"),due_date:l.getValue("ded-acc-det-date-input"),payment_status:l.getValue("ded-acc-det-status-input"),status:l.getValue("ded-acc-det-account-status-input"),observation:l.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?l.getValue("ded-acc-det-freq-input"):"1 mes"};try{await E.put(`/accounts/${n.id}`,r),alert("Fatura atualizada com sucesso!"),await this.fetch(),this.currentCompanyHistory=R.filter(c=>c.company_name===n.company_name).sort((c,u)=>new Date(u.due_date||0)-new Date(c.due_date||0)),this.openDedicatedPage(n.id)}catch{alert("Erro ao atualizar fatura.")}},_.isAdmin()||(s.style.display="none"));const i=document.getElementById("btn-ded-delete-account");i&&(i.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await E.delete(`/accounts/${n.id}`),await this.fetch();const r=R.filter(c=>c.company_name===n.company_name);r.length>0?this.openDedicatedPage(r[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},_.isAdmin()||(i.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(e){document.getElementById("ded-acc-file-input");const t=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),e.attachment_path){l.hide("ded-acc-upload-area"),l.show("ded-acc-preview-area");const n=e.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),a=e.attachment_path.split("/").pop()||"documento";l.setText("ded-acc-preview-name",a);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async r=>{r.preventDefault();const c=s.innerText;s.innerText="Carregando...";try{const u=await fetch(e.attachment_path);if(!u.ok)throw new Error("Doc não encontrado");const d=await u.blob(),p=window.URL.createObjectURL(d);window.open(p,"_blank")}catch(u){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",u)}finally{s.innerText=c}},n?(o.innerHTML="",o.style.backgroundImage=`url('${e.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const i=document.getElementById("btn-ded-remove-attachment");i.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await E.put(`/accounts/${e.id}`,{...e,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=R.filter(r=>r.company_name===e.company_name).sort((r,c)=>new Date(c.due_date||0)-new Date(r.due_date||0)),this.selectHistoryItem(e.id)}catch{alert("Erro ao remover anexo")}},_.isAdmin()||(i.style.display="none")}else{if(l.show("ded-acc-upload-area"),l.hide("ded-acc-preview-area"),_.isAdmin())t.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,t.style.cursor="pointer";else{t.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',t.style.cursor="default";return}t.onclick=s=>{const i=document.getElementById("ded-acc-file-input");i&&s.target!==i&&i.click()},t.addEventListener("dragover",s=>{s.preventDefault(),t.style.borderColor="var(--accent)",t.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{t.style.borderColor="rgba(255,255,255,0.2)",t.style.background="rgba(0,0,0,0.1)"};t.addEventListener("dragleave",()=>{n()});const o=async s=>{if(!s)return;t.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const i=new FormData;i.append("file",s);try{const r=await fetch("/api/upload",{method:"POST",body:i}),c=await r.json();r.ok?(await E.put(`/accounts/${e.id}`,{...e,attachment_path:c.path}),await this.fetch(),this.currentCompanyHistory=R.filter(u=>u.company_name===e.company_name).sort((u,d)=>new Date(d.due_date||0)-new Date(u.due_date||0)),this.selectHistoryItem(e.id)):(alert(c.error||"Erro no upload"),this.selectHistoryItem(e.id))}catch(r){alert("Falha na comunicação: "+r.message),console.error("Upload Error:",r),this.selectHistoryItem(e.id)}};t.addEventListener("drop",async s=>{if(s.preventDefault(),n(),s.dataTransfer.files.length>0){const i=s.dataTransfer.files[0];await o(i)}});const a=document.getElementById("ded-acc-file-input");a&&(a.onclick=s=>{s.stopPropagation()},a.onchange=async s=>{const i=s.target.files[0];await o(i)})}},async save(e){e.preventDefault();const t=l.getValue("account-id"),n={company_name:l.getValue("account-company"),type:l.getValue("account-type"),category:l.getValue("account-category"),value:l.getValue("account-value"),status:l.getValue("account-status"),payment_status:l.getValue("account-payment-status"),due_date:l.getValue("account-due-date"),description:l.getValue("account-description"),observation:l.getValue("account-observation"),frequency:l.getValue("account-type")==="Recorrente"?l.getValue("account-frequency"):"1 mes"};try{const o=t?`/accounts/${t}`:"/accounts";t?await E.put(o,n):await E.post(o,n),l.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(e){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await E.delete(`/accounts/${e}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(e){V=e,this.renderAccountsList(st)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${V===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${V-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=V-1&&c<=V+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===V?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${V===t?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${V+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(V-1)*we+1,r=Math.min(V*we,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let re=[],J={},te=null,Ve=null,Oe=null,N=[],Ae=[],Ge={},W={},ge,Qe,He,Pe,ct,_e;const dt={init(){ge=document.getElementById("timeline-event-form"),Qe=document.getElementById("view-visualizacao"),He=document.getElementById("view-attention"),Pe=document.getElementById("view-anexo"),ct=document.getElementById("view-relatorio"),_e=document.getElementById("view-config"),window.timelineHandler=dt,window.applyFilters=wt,window.clearFilters=xt,window.toggleFilters=Et,window.handleDelete=bt,window.resetForm=Ze,window.toggleAccordion=mt,window.handleFormSubmit=lt,window.editEvent=Xe,window.deleteTopic=Ct,window.deleteSubtopic=kt,window.handleTrackDragStart=Bt,window.handleTrackDragOver=St,window.handleTrackDragEnd=Mt;const e=document.getElementById("timeline-topic-form");e&&e.addEventListener("submit",It);const t=document.getElementById("timeline-subtopic-form");t&&t.addEventListener("submit",Dt);const n=document.getElementById("topico");n&&n.addEventListener("change",u=>{Ke(u.target.value)});const o=document.getElementById("em-ocorrencia");o&&o.addEventListener("change",u=>{const d=document.getElementById("fim"),p=document.getElementById("inicio");if(u.target.checked){if(!p.value){const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),p.value=m.toISOString().slice(0,16)}d.required=!1}else{const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),d.value=m.toISOString().slice(0,16),d.required=!0}});const a=document.getElementById("auto-refresh-toggle");a&&a.addEventListener("change",u=>{ut(u.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(u=>{u.addEventListener("click",d=>{const p=d.currentTarget.getAttribute("data-timeline-tab");De(p)})}),ge&&ge.addEventListener("submit",lt);const s=document.getElementById("rep-filter-start"),i=document.getElementById("rep-filter-end"),r=document.getElementById("rep-filter-topic"),c=document.getElementById("rep-filter-subtopic");s&&s.addEventListener("change",()=>$e()),i&&i.addEventListener("change",()=>$e()),r&&r.addEventListener("change",u=>{Lt(u.target.value),$e()}),c&&c.addEventListener("change",()=>$e()),window.addEventListener("SectionChange",u=>{u.detail&&u.detail.section==="timeline"&&le().then(()=>{X(),rt()})}),le().then(()=>{X(),rt()})}};window.addEventListener("focus",()=>{Qe&&X()});function Ke(e,t=null){const n=document.getElementById("sub-topico");if(!n)return;const o=e?e.toLowerCase().trim():"";if(!o||!W[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',W[o].forEach(a=>{const s=document.createElement("option");s.value=a.toLowerCase(),s.textContent=a,t&&s.value===t.toLowerCase()&&(s.selected=!0),n.appendChild(s)}),t||(n.selectedIndex=1),n.classList.add("has-options")}async function le(){try{const e=await fetch("/api/timeline/config");if(!e.ok)throw new Error("Falha ao buscar configurações");const t=await e.json();N=t.topics||[],Ae=t.subtopics||[],Ge={},W={},N.forEach(o=>{Ge[o.id]=o.color,W[o.id]=[]}),Ae.forEach(o=>{const a=o.topic_id;W[a]&&W[a].push(o.name)}),vt();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&gt()}catch(e){console.error("Error loading config:",e)}}function vt(){const e=document.getElementById("topico");if(e){const o=e.value;e.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',N.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,e.appendChild(s)}),e.value=o}const t=document.getElementById("rep-filter-topic");if(t){const o=t.value;t.innerHTML='<option value="Todos">Todos</option>',N.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,t.appendChild(s)}),o&&[...t.options].some(a=>a.value===o)?t.value=o:t.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',N.forEach(o=>{const a=document.createElement("option");a.value=o.id,a.textContent=o.name,n.appendChild(a)}))}function X(){fetch("/api/timeline/events").then(e=>{if(!e.ok)throw new Error("Failed to fetch");return e.json()}).then(e=>{re=e,et(),He&&He.classList.contains("active")&&pt()}).catch(e=>{console.error("Error loading events:",e)})}function rt(){const e=document.getElementById("timeline-tab-anexo"),t=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())e&&e.classList.remove("role-hidden"),t&&t.classList.remove("role-hidden");else{e&&e.classList.add("role-hidden"),t&&t.classList.add("role-hidden");const o=Pe&&Pe.classList.contains("active"),a=_e&&_e.classList.contains("active");(o||a)&&De("visualizacao")}}function De(e){const t={visualizacao:{section:Qe,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:He,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:Pe,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:ct,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:_e,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(t).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),t[e]&&(t[e].section&&t[e].section.classList.add("active"),t[e].button&&t[e].button.classList.add("active")),e==="visualizacao"?(X(),xe(!0)):e==="attention"?(pt(),xe(!0)):e==="relatorio"?($e(),xe(!1)):(e==="config"&&gt(),xe(!1))}function xe(e){const t=document.getElementById("floating-refresh-control");if(t)if(e){t.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!te&&ut(!0)}else t.classList.add("hidden"),te&&(clearInterval(te),te=null)}function ut(e){te&&(clearInterval(te),te=null),e&&(X(),te=setInterval(X,6e4))}function lt(e){e.preventDefault();const t=ge.querySelector('button[type="submit"]');t&&(t.textContent="Salvando...",t.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async a=>{const s=await a.text();if(!a.ok)throw new Error(`Server error (${a.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),Ze(),De("visualizacao")}).catch(a=>{console.error("Error saving event:",a),alert("Erro ao salvar evento: "+a.message)}).finally(()=>{t&&(t.textContent="Salvar Evento",t.disabled=!1)})}function Xe(e){const t=re.find(s=>s.id===e);if(!t)return;document.getElementById("event-id").value=t.id,document.getElementById("nome").value=t.nome;const n=Te(t.topico);document.getElementById("topico").value=n,Ke(n,t.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=t.em_ocorrencia==1||t.em_ocorrencia==="true"||!t.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=t.inicio,document.getElementById("fim").value=t.fim||"",document.getElementById("descricao").value=t.descricao||"",document.getElementById("anotacao").value=t.anotacao||"",document.getElementById("cor").value=t.cor||"#000000",De("anexo");const a=document.getElementById("btn-delete");a&&(a.style.display="block")}function Ze(){ge&&ge.reset();const e=document.getElementById("event-id");e&&(e.value=""),Ke("");const t=document.getElementById("fim");t&&(t.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function bt(){const e=document.getElementById("event-id").value;e&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Failed to delete");return t.json()}).then(()=>{alert("Evento excluído!"),Ze(),De("visualizacao")}).catch(t=>{console.error("Error deleting:",t),alert("Erro ao excluir: "+t.message)})}function wt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`),a=t&&t.value?new Date(t.value).getTime():null,s=n&&n.value?new Date(n.value).getTime():null,i=o?o.value:"";J[e]={start:a,end:s,subTopic:i},et()}function xt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`);t&&(t.value=""),n&&(n.value=""),o&&(o.value=""),J[e]=null,et()}function Et(e){const t=document.getElementById(`filters-panel-${e}`),n=document.getElementById(`btn-toggle-${e}`);t&&n&&(t.classList.toggle("hidden"),n.classList.toggle("active"))}function mt(e){const t=document.getElementById(e);t&&t.classList.toggle("active")}function et(){const e=document.getElementById("timeline-tracks-container");if(!e)return;const t=Array.from(e.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId),n=N.map(a=>a.id);if(t.length!==n.length||!n.every(a=>t.includes(a))){e.innerHTML="";const a=window.auth&&window.auth.isAdmin(),s=a?'style="cursor: grab;"':"";N.forEach(i=>{const r=`
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
            `;e.insertAdjacentHTML("beforeend",r);const c=document.getElementById(`filter-sub-topic-${i.id}`);c&&W[i.id]&&W[i.id].forEach(u=>{const d=document.createElement("option");d.value=u.toLowerCase(),d.textContent=u,c.appendChild(d)})})}N.forEach(a=>{const s=document.getElementById(`track-${a.id}`),i=document.getElementById(`min-date-${a.id}`),r=document.getElementById(`max-date-${a.id}`);s&&(s.innerHTML=""),i&&(i.textContent=""),r&&(r.textContent="")}),re.length!==0&&N.forEach(a=>{const s=a.id,i=re.filter(y=>Te(y.topico)===s);let r=i;J[s]&&J[s].subTopic&&(r=i.filter(y=>(y.sub_topico?y.sub_topico.toLowerCase():"")===J[s].subTopic.toLowerCase()));const c=J[s]&&J[s].start?J[s].start:new Date("2026-01-01T00:00:00").getTime(),u=J[s]&&J[s].end?J[s].end:Date.now();$t(s,r,c,u);const d=c,p=u,m=p-d,f=document.getElementById(`min-date-${s}`),g=document.getElementById(`max-date-${s}`);f&&(f.textContent=new Date(d).toLocaleDateString()+" "+new Date(d).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),g&&(g.textContent=new Date(p).toLocaleDateString()+" "+new Date(p).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const h=document.getElementById(`track-${s}`);h&&r.forEach(y=>{const T=new Date(y.inicio).getTime(),$=y.fim?new Date(y.fim).getTime():Date.now();if($<d||T>p)return;const B=Math.max(T,d),j=Math.min($,p),F=(B-d)/m*100,b=(j-B)/m*100;if(b<=0)return;const C=document.createElement("div");C.className="timeline-bar",C.style.left=`${F}%`,C.style.width=`${b}%`,C.style.color=y.cor&&y.cor!=="#000000"?y.cor:Ge[s]||"#6b7280";const v=document.createElement("div");v.className="timeline-bar-visual",C.appendChild(v);const M=document.createElement("div");M.className="timeline-identifier-point";const z=new Date(y.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),q=y.fim?new Date(y.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",U=a.name,D=y.sub_topico?y.sub_topico.charAt(0).toUpperCase()+y.sub_topico.slice(1):"-";M.setAttribute("data-tooltip",`Tópico: ${U}
Eventos: ${D}
Início: ${z} - Fim: ${q}
Descrição: ${y.descricao||"-"}`),!y.fim&&M.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(M.style.cursor="pointer",M.onclick=ce=>{ce.stopPropagation(),Xe(y.id)}):M.style.cursor="default",C.appendChild(M),h.appendChild(C)})})}function Te(e){return e?e.toLowerCase().trim():""}function $t(e,t,n,o){const a=document.getElementById(`sla-${e}`);if(!a)return;const s=o-n;if(s<=0){a.textContent="N/A";return}const r=t.filter(m=>{const f=new Date(m.inicio).getTime();return(m.fim?new Date(m.fim).getTime():Date.now())>n&&f<o}).map(m=>({start:Math.max(new Date(m.inicio).getTime(),n),end:Math.min(m.fim?new Date(m.fim).getTime():Date.now(),o)}));r.sort((m,f)=>m.start-f.start);const c=[];if(r.length>0){let m=r[0];for(let f=1;f<r.length;f++){const g=r[f];g.start<m.end?m.end=Math.max(m.end,g.end):(c.push(m),m=g)}c.push(m)}let u=0;c.forEach(m=>{u+=m.end-m.start});const d=(s-u)/s*100;let p="#10b981";d<50?p="#ef4444":d<90&&(p="#f97316"),a.style.color=p,a.textContent=d.toFixed(4)+"%"}function pt(){const e=document.getElementById("attention-topics-container");if(!e)return;e.innerHTML="";const t=re.filter(n=>!n.fim);N.forEach(n=>{const o=n.id,a=t.filter(h=>Te(h.topico)===o),s=document.createElement("div");s.className=a.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const i=document.createElement("div");i.className="accordion-header",i.onclick=()=>mt(`attn-acc-${o}`);const r=document.createElement("div");r.className="accordion-title-group";const c=document.createElement("div");c.className="topic-indicator",c.style.backgroundColor=n.color;const u=document.createElement("h3");u.textContent=n.name;const d=document.createElement("span");d.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",d.textContent=`${a.length}`,r.appendChild(c),r.appendChild(u),r.appendChild(d);const p=document.createElement("span");p.className="accordion-chevron",p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',i.appendChild(r),i.appendChild(p);const m=document.createElement("div");m.className="accordion-content";const f=document.createElement("div");f.className="accordion-body";const g=document.createElement("div");if(g.className="attention-carousel",a.length===0){const h=document.createElement("div");h.className="empty-state",h.textContent="Nenhum evento em andamento.",g.appendChild(h)}else a.forEach(h=>{const y=document.createElement("div");y.className="attention-card",y.style.borderLeftColor=h.cor&&h.cor!=="#000000"?h.cor:n.color;const T=document.createElement("h3");T.textContent=h.nome;const $=document.createElement("div");$.className="sub-topic",$.textContent=h.sub_topico||"-";const B=document.createElement("div");B.className="card-detail",B.innerHTML=`<strong>Início:</strong> ${new Date(h.inicio).toLocaleString()}`;const j=Date.now()-new Date(h.inicio).getTime(),F=document.createElement("div");F.className="card-duration",F.innerHTML=`<strong>Tempo:</strong> <span>${Tt(j)}</span>`;const b=document.createElement("div");b.className="card-description",b.textContent=h.descricao||"-",y.appendChild(T),y.appendChild($),y.appendChild(B),y.appendChild(F),y.appendChild(b),window.auth&&window.auth.isAdmin()?(y.style.cursor="pointer",y.onclick=()=>Xe(h.id)):y.style.cursor="default",g.appendChild(y)});f.appendChild(g),m.appendChild(f),s.appendChild(i),s.appendChild(m),e.appendChild(s)})}function Tt(e){if(e<0)return"0s";const t=Math.floor(e/1e3),n=Math.floor(t/60),o=Math.floor(n/60),a=Math.floor(o/24),s=[];return a>0&&s.push(`${a}d`),(o%24>0||a>0)&&s.push(`${o%24}h`),(n%60>0||o>0)&&s.push(`${n%60}m`),s.push(`${t%60}s`),s.join(" ")}function Lt(e){const t=document.getElementById("rep-filter-subtopic");if(!t)return;t.innerHTML='<option value="Todos">Todos</option>';const n=e?e.toLowerCase().trim():"";n&&W[n]&&W[n].forEach(o=>{const a=document.createElement("option");a.value=o.toLowerCase(),a.textContent=o,t.appendChild(a)})}function $e(){let e=re;const t=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,a=document.getElementById("rep-filter-subtopic")?.value;if(t){const b=new Date(t+"T00:00:00").getTime();e=e.filter(C=>new Date(C.inicio).getTime()>=b)}if(n){const b=new Date(n+"T23:59:59").getTime();e=e.filter(C=>new Date(C.inicio).getTime()<=b)}o&&o!=="Todos"&&(e=e.filter(b=>Te(b.topico)===o.toLowerCase())),a&&a!=="Todos"&&(e=e.filter(b=>b.sub_topico&&b.sub_topico.toLowerCase()===a.toLowerCase()));const s=document.getElementById("rep-kpi-total"),i=document.getElementById("rep-kpi-active"),r=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=e.length);const c=e.filter(b=>b.em_ocorrencia==1||b.em_ocorrencia==="true"||!b.fim);i&&(i.textContent=c.length);const u=e.filter(b=>b.fim);let d="0h 0m";if(u.length>0){const C=u.reduce((q,U)=>q+(new Date(U.fim).getTime()-new Date(U.inicio).getTime()),0)/u.length,v=Math.floor(C/6e4),M=Math.floor(v/60),z=v%60;d=`${M}h ${z}m`}if(r&&(r.textContent=d),!window.Chart){console.warn("Chart.js is not loaded.");return}const p=N,m=t?new Date(t+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),f=n?new Date(n+"T23:59:59").getTime():Date.now(),g=p.map(b=>b.name),h=p.map(b=>{const C=b.id,v=re.filter(k=>Te(k.topico)===C),M=f-m;if(M<=0)return 100;const q=v.filter(k=>{const G=new Date(k.inicio).getTime();return(k.fim?new Date(k.fim).getTime():Date.now())>m&&G<f}).map(k=>({start:Math.max(new Date(k.inicio).getTime(),m),end:Math.min(k.fim?new Date(k.fim).getTime():Date.now(),f)}));q.sort((k,G)=>k.start-G.start);const U=[];if(q.length>0){let k=q[0];for(let G=1;G<q.length;G++){const ne=q[G];ne.start<k.end?k.end=Math.max(k.end,ne.end):(U.push(k),k=ne)}U.push(k)}const Y=(k=>{let G=0;return k.forEach(ne=>{G+=ne.end-ne.start}),G})(U),ce=(M-Y)/M*100;return parseFloat(ce.toFixed(4))}),y=p.map(b=>b.color||"#6b7280"),T=document.getElementById("chart-rep-sla");T&&(Ve&&Ve.destroy(),Ve=new window.Chart(T,{type:"bar",data:{labels:g,datasets:[{label:"Disponibilidade %",data:h,backgroundColor:y,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...h)-5),max:100,ticks:{callback:b=>b+"%"}}}}}));const $={};e.forEach(b=>{const C=b.sub_topico?b.sub_topico.charAt(0).toUpperCase()+b.sub_topico.slice(1).toLowerCase():"Não especificado";$[C]=($[C]||0)+1});const B=Object.keys($),j=Object.values($),F=document.getElementById("chart-rep-qty");F&&(Oe&&Oe.destroy(),Oe=new window.Chart(F,{type:"doughnut",data:{labels:B.length>0?B:["Nenhum evento"],datasets:[{data:j.length>0?j:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function It(e){e.preventDefault();const t=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!t||!n||!o)return;const a={id:t.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!a.id){alert("Por favor, defina um ID para o tópico.");return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>{alert("Tópico salvo com sucesso!"),t.value="",n.value="",o.value="#3b82f6",le().then(()=>{X()})}).catch(s=>{console.error(s),alert("Erro: "+s.message)})}function Dt(e){e.preventDefault();const t=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!t||!n)return;const o={topic_id:t.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento.");return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(a=>{if(!a.ok)throw new Error("Erro ao adicionar evento");return a.json()}).then(()=>{alert("Evento adicionado!"),n.value="",le()}).catch(a=>{console.error(a),alert("Erro: "+a.message)})}function Ct(e){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir tópico");return t.json()}).then(()=>{alert("Tópico excluído!"),le().then(()=>{X()})}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function kt(e){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir evento");return t.json()}).then(()=>{alert("Evento excluído!"),le()}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function gt(){const e=document.getElementById("config-topics-list");e&&(e.innerHTML="",N.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':N.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(o)}));const t=document.getElementById("config-subtopics-list");t&&(t.innerHTML="",Ae.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':Ae.forEach(n=>{const o=N.find(r=>r.id===n.topic_id),a=o?o.name:n.topic_id,s=o?o.color:"#6b7280",i=document.createElement("div");i.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",i.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${a}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(i)}))}function Bt(e,t){e.currentTarget.classList.add("dragging"),e.dataTransfer.effectAllowed="move"}function St(e){e.preventDefault();const t=document.querySelector(".timeline-container.dragging");if(!t)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const a=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const i=s.getBoundingClientRect();return e.clientY<=i.top+i.height/2});a?n.insertBefore(t,a):n.appendChild(t)}function Mt(e){const t=document.querySelector(".timeline-container.dragging");t&&t.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(a=>{a.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId);At(o)}function At(e){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:e})}).then(t=>{if(!t.ok)throw new Error("Erro ao salvar nova ordenação");return t.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),le().then(()=>{X()})}).catch(t=>{console.error(t),alert("Erro ao salvar ordenação: "+t.message)})}let me=[],Re=[],ze=[],Ne=[],L="extensions",S=1,pe=100,je=[];const Ee={setActiveTab(e){L=e,S=1;const t=document.getElementById("telephony-search");t&&(t.value="",e==="extensions"?t.placeholder="Pesquisar ramais por número, nome ou usuário...":e==="queues"?t.placeholder="Pesquisar filas por número ou nome...":e==="blf"?t.placeholder="Pesquisar BLF por nome...":e==="users"&&(t.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(s=>{s.id===`tab-telephony-${e}`?s.classList.add("active"):s.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(s=>{s.id===`telephony-view-${e==="users"?"users":e==="queues"?"queues":e}`?s.classList.remove("hidden"):s.classList.add("hidden")});const a=this.getActiveDataList();this.render(a)},getActiveDataList(){return L==="extensions"?me:L==="queues"?Re:L==="blf"?ze:L==="users"?Ne:[]},async fetch(){const e=this.getActiveTableBody();e&&(e.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(S=1,L==="extensions")me=await E.get("/telephony/extensions"),this.render(me);else if(L==="queues")Re=await E.get("/telephony/queues"),this.render(Re);else if(L==="blf"){if(me.length===0)try{me=await E.get("/telephony/extensions")}catch(t){console.warn("Could not pre-fetch extensions for BLF mapping:",t)}ze=await E.get("/telephony/blfs"),this.render(ze)}else L==="users"&&(Ne=await E.get("/telephony/users"),this.render(Ne))}catch(t){console.error(`Error fetching telephony ${L}:`,t),e&&(e.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${t.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return L==="extensions"?document.getElementById("telephony-table-body"):L==="queues"?document.getElementById("telephony-queues-table-body"):L==="blf"?document.getElementById("telephony-blf-table-body"):L==="users"?document.getElementById("telephony-users-table-body"):null},render(e){const t=this.getActiveTableBody();if(!t)return;je=e;const n=e.length,o=Math.ceil(n/pe);S>o&&(S=Math.max(1,o)),S<1&&(S=1);const a=(S-1)*pe,s=e.slice(a,a+pe);if(s.length===0){const i=L==="extensions"?7:L==="queues"?6:L==="blf"?4:5;t.innerHTML=`
                <tr>
                    <td colspan="${i}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}L==="extensions"?this.renderExtensionsList(t,s):L==="queues"?this.renderQueuesList(t,s):L==="blf"?this.renderBlfsList(t,s):L==="users"&&this.renderUsersList(t,s),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.ddr||"-",i=n.Username||"-",r=n.Secret||"",c=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",u=n.observacao||"-",d=r.replace(/'/g,"\\'");return`
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
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleSecret(${n.id}, '${d}')" title="Mostrar/Ocultar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg id="secret-icon-${n.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${c}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${u}">${u}</td>
                </tr>
            `}).join("")},renderQueuesList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.Estrategia||"-",i=n.TimeoutAgente?`${n.TimeoutAgente}s`:"-",r=n.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',c=n.membros?n.membros.length:0,u=n.membros&&n.membros.length>0?n.membros.map(d=>`
                    <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span style="font-size: 0.85rem; font-weight: 500;">${d.extensao_numero} - ${d.extensao_nome}</span>
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
                            <span>${c} membros</span>
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
            `}).join("")},renderBlfsList(e,t){e.innerHTML=t.map(n=>{const o=n.id,a=n.Nome||"-",s=n.quantidade_extensoes||0,i=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",r=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(c=>{const u=me.find(m=>m.id===c||m.extensao_id===c),d=u?u.exten:`ID ${c}`,p=u?u.nome:"Não encontrado";return`
                        <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span style="font-size: 0.85rem; font-weight: 500;">${d} - ${p}</span>
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
            `}).join("")},toggleQueueRow(e){const t=document.getElementById(`queue-details-${e}`),n=document.getElementById(`queue-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(e){const t=document.getElementById(`blf-details-${e}`),n=document.getElementById(`blf-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(e){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(e){S=1;const n=this.getActiveDataList().filter(o=>L==="extensions"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Username||"").toLowerCase().includes(e)||(o.ddr||"").toLowerCase().includes(e)||(o.observacao||"").toLowerCase().includes(e):L==="queues"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Estrategia||"").toLowerCase().includes(e):L==="blf"?(o.Nome||"").toLowerCase().includes(e):L==="users"?(o.username||"").toLowerCase().includes(e)||(o.email||"").toLowerCase().includes(e)||(o.Tipo||"").toLowerCase().includes(e):!1);this.render(n)},changePage(e){S=e,this.render(je)},setPageSize(e){pe=parseInt(e,10),S=1,this.render(je)},toggleSecret(e,t){const n=document.getElementById(`secret-txt-${e}`),o=document.getElementById(`secret-icon-${e}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=t,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${S===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${S-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=S-1&&c<=S+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===S?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${S===t?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${S+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(S-1)*pe+1,r=Math.min(S*pe,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let Be=[],qe="",Ue="",Se=null,Ye="alerts",K=[];const tt={init(){try{const r=localStorage.getItem("monitoring_disabled_services");K=r?JSON.parse(r):[]}catch(r){console.error("Erro ao ler localStorage:",r),K=[]}const e=document.getElementById("tab-monitoring-alerts");e&&e.addEventListener("click",()=>this.setActiveTab("alerts"));const t=document.getElementById("tab-monitoring-disabled");t&&t.addEventListener("click",()=>this.setActiveTab("disabled"));const n=document.getElementById("tab-monitoring-events");n&&n.addEventListener("click",()=>this.setActiveTab("events"));const o=document.getElementById("monitoring-search-input");o&&o.addEventListener("input",r=>{qe=r.target.value.toLowerCase(),this.render()});const a=document.getElementById("monitoring-events-search-input");a&&a.addEventListener("input",r=>{Ue=r.target.value.toLowerCase(),this.render()});const s=document.getElementById("btn-refresh-monitoring");s&&s.addEventListener("click",()=>{this.fetch()});const i=document.getElementById("monitoring-auto-refresh");i&&(i.addEventListener("change",r=>{this.toggleAutoRefresh(r.target.checked)}),this.toggleAutoRefresh(i.checked)),window.monitoringHandler=this},setActiveTab(e){Ye=e;const t=document.getElementById("tab-monitoring-alerts"),n=document.getElementById("tab-monitoring-disabled"),o=document.getElementById("tab-monitoring-events");t&&n&&o&&(t.classList.toggle("active",e==="alerts"),n.classList.toggle("active",e==="disabled"),o.classList.toggle("active",e==="events"));const a=document.getElementById("monitoring-tab-content-alerts"),s=document.getElementById("monitoring-tab-content-disabled"),i=document.getElementById("monitoring-tab-content-events");a&&s&&i&&(a.classList.toggle("hidden",e!=="alerts"),a.classList.toggle("active",e==="alerts"),s.classList.toggle("hidden",e!=="disabled"),s.classList.toggle("active",e==="disabled"),i.classList.toggle("hidden",e!=="events"),i.classList.toggle("active",e==="events")),this.render()},toggleService(e,t){t?K=K.filter(n=>n!==e):K.includes(e)||K.push(e),localStorage.setItem("monitoring_disabled_services",JSON.stringify(K)),this.render()},toggleAutoRefresh(e){Se&&(clearInterval(Se),Se=null),e&&(Se=setInterval(()=>{const t=document.querySelector(".nav-btn.active");t&&t.dataset.section==="monitoring"&&this.fetch()},3e4))},async fetch(){try{const e=await E.get("/monitoring/notifications");let t=[],n=!1;Array.isArray(e)?(t=e,this.updateApiStatus(!0,"API Online (OLIJUS)")):e&&Array.isArray(e.notifications)?(t=e.notifications,n=e.status==="offline",this.updateApiStatus(!n,n?"API Offline (Contingência)":"API Online (OLIJUS)")):e&&Array.isArray(e.data)?(t=e.data,this.updateApiStatus(!0,"API Online (OLIJUS)")):this.updateApiStatus(!1,"Resposta Inválida");const o=new Date;o.setDate(o.getDate()-30),Be=t.map(a=>this.parseNotification(a)).filter(a=>new Date(a.created_at)>=o),this.render()}catch(e){console.error("Erro ao buscar notificações de monitoramento:",e),this.updateApiStatus(!1,"Erro de Conexão");const t=document.getElementById("monitoring-alerts-grid");t&&Be.length===0&&(t.innerHTML=`
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.1); border-radius: var(--border-radius);">
                        <h4 style="color: #ef4444; margin-bottom: 5px;">Erro ao Carregar Monitoramento</h4>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Não foi possível estabelecer contato com a API. Detalhes: ${e.message}</p>
                    </div>
                `)}},parseNotification(e){let t="info";const n=(e.message||"").toUpperCase();n.includes("RESTAURADO")||n.includes("RESTAURADA")||n.includes("RESOLVIDO")||n.includes("RESOLVIDA")?t="success":n.includes("FALHA")||n.includes("DOWN")||n.includes("ERROR")||n.includes("DESCONECTADO")||n.includes("CRITICAL")?t="critical":n.includes("WARNING")||n.includes("ALERTA")||n.includes("AVISO")||n.includes("INSTABILIDADE")?t="warning":(n.includes("SUCESSO")||n.includes("ADICIONADO")||n.includes("NOVO")||n.includes("DECOLAGEM"))&&(t="success");let o="";const a=(e.message||"").match(/\((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)/)||(e.message||"").match(/\(([^)]+)\)/);a&&(o=a[1].trim());let s="Notificação",i=e.message||"";if(e.message){const r=e.message.split(`
`).map(c=>c.trim()).filter(c=>c.length>0);r.length>0&&(s=r[0],r.length>1?i=r.slice(1).join(`
`):(i=r[0],s.length>45&&(s=e.type==="new_device"?"Novo Dispositivo":"Alerta de Monitoramento",i=r[0])))}return{id:e.id||Math.random().toString(),title:s,description:i,severity:t,source:"OLIJUS",ip:o,created_at:e.timestamp||e.created_at||new Date().toISOString()}},updateApiStatus(e,t){const n=document.getElementById("monitoring-api-status");if(n){n.className=`api-status-badge ${e?"online":"offline"}`;const o=n.querySelector(".status-text");o&&(o.textContent=t)}},getProcessedServices(){const e={};return Be.forEach(t=>{let n="",o="";const a=(t.description||"").match(/O serviço ([^\(]+)\s*(?:\(([^)]+)\))?/i)||(t.title||"").match(/O serviço ([^\(]+)\s*(?:\(([^)]+)\))?/i),s=(t.description||"").match(/dispositivo ([^\(]+)\s*(?:\(([^)]+)\))?/i);if(a?(n=a[1].trim(),o=a[2]?a[2].trim():""):s?(n=s[1].trim(),o=s[2]?s[2].trim():""):n=t.title,n=n.replace(/[🚀🛰️🛸🌟🛸]/g,"").trim(),!n)return;const i=n.toLowerCase(),r=t.severity==="critical"||t.severity==="warning";e[i]?(new Date(t.created_at)>new Date(e[i].lastUpdated)&&(e[i].status=r?"offline":"online",e[i].lastUpdated=t.created_at),o&&!e[i].ip&&(e[i].ip=o)):e[i]={name:n,ip:o,status:r?"offline":"online",lastUpdated:t.created_at}}),Object.values(e)},render(){const e=this.getProcessedServices();let t=e.filter(a=>!K.includes(a.name));const n=e.filter(a=>K.includes(a.name)),o=JSON.parse(localStorage.getItem("monitoring_services_order")||"[]");o.length>0&&t.sort((a,s)=>{let i=o.indexOf(a.name),r=o.indexOf(s.name);return i===-1&&(i=999),r===-1&&(r=999),i-r}),this.updateKPIs(t),Ye==="alerts"?this.renderActiveServices(t):Ye==="disabled"?this.renderDisabledServices(n):this.renderEvents()},renderActiveServices(e){const t=document.getElementById("monitoring-alerts-grid");if(!t)return;const n=e.filter(o=>!qe||o.name.toLowerCase().includes(qe));if(n.length===0){t.innerHTML=`
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                    Nenhum serviço ativo encontrado.
                </div>
            `;return}t.innerHTML=n.map(o=>{const a=o.status==="offline"?"warning":"success",s=o.status==="offline"?"Offline":"Online";return`
                <div class="notification-card ${a}" draggable="true" data-service="${o.name}" style="padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 10px; cursor: grab;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; pointer-events: none;">
                        <div>
                            <h3 class="notification-title" style="font-size: 1.05rem; font-weight: 600; color: var(--text-main); line-height: 1.4;">${o.name}</h3>
                            ${o.ip?`<span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace; display: block; margin-top: 4px;">IP: ${o.ip}</span>`:""}
                        </div>
                        <span class="severity-badge ${a}" style="font-size: 0.75rem; padding: 3px 8px;">${s}</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 8px; margin-top: 4px;">
                        <button class="btn" style="padding: 4px 10px; font-size: 0.8rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #fca5a5; border-radius: 6px; cursor: pointer; transition: all 0.2s;"
                                onclick="window.monitoringHandler.toggleService('${o.name}', false)">
                            Desativar
                        </button>
                    </div>
                </div>
            `}).join(""),this.setupDragAndDrop(t)},setupDragAndDrop(e){e.querySelectorAll('.notification-card[draggable="true"]').forEach(n=>{n.addEventListener("dragstart",o=>{n.classList.add("dragging"),o.dataTransfer.effectAllowed="move"}),n.addEventListener("dragend",()=>{n.classList.remove("dragging");const a=Array.from(e.querySelectorAll(".notification-card[data-service]")).map(s=>s.dataset.service);localStorage.setItem("monitoring_services_order",JSON.stringify(a))})}),e.dataset.dragOverAttached||(e.addEventListener("dragover",n=>{n.preventDefault();const o=e.querySelector(".dragging");if(!o)return;const a=Ht(e,n.clientY,n.clientX);a==null?e.appendChild(o):e.insertBefore(o,a)}),e.dataset.dragOverAttached="true")},renderDisabledServices(e){const t=document.getElementById("monitoring-disabled-grid");if(t){if(e.length===0){t.innerHTML=`
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                    Nenhum serviço desativado.
                </div>
            `;return}t.innerHTML=e.map(n=>`
                <div class="notification-card info" style="padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 10px; opacity: 0.75;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                        <h3 class="notification-title" style="font-size: 1.05rem; font-weight: 600; color: var(--text-muted); line-height: 1.4; text-decoration: line-through;">${n.name}</h3>
                        <span class="severity-badge info" style="font-size: 0.75rem; padding: 3px 8px; background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1);">Desativado</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 8px; margin-top: 4px;">
                        <button class="btn" style="padding: 4px 10px; font-size: 0.8rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #6ee7b7; border-radius: 6px; cursor: pointer; transition: all 0.2s;"
                                onclick="window.monitoringHandler.toggleService('${n.name}', true)">
                            Ativar
                        </button>
                    </div>
                </div>
            `).join("")}},renderEvents(){const e=document.getElementById("monitoring-events-grid");if(!e)return;const t=Be.filter(n=>!Ue||(n.title||"").toLowerCase().includes(Ue));if(t.length===0){e.innerHTML=`
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                    Nenhum evento encontrado no histórico com os filtros atuais.
                </div>
            `;return}e.innerHTML=t.map(n=>{const o=n.created_at?new Date(n.created_at).toLocaleString("pt-BR"):"Sem data",a=n.severity||"info";let s="Info";return a==="critical"?s="Crítico":a==="warning"?s="Alerta":a==="success"&&(s="Sucesso"),`
                <div class="notification-card ${a}" style="padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; width: 100%;">
                        <div>
                            <h3 class="notification-title" style="font-size: 1rem; font-weight: 600; line-height: 1.4; margin: 0; word-break: break-word; color: var(--text-main);">${n.title}</h3>
                            ${n.ip?`<span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace; display: block; margin-top: 4px;">IP: ${n.ip}</span>`:""}
                        </div>
                        <span class="severity-badge ${a}" style="font-size: 0.7rem; padding: 3px 8px;">${s}</span>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: flex-end; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 8px; margin-top: 2px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">
                            ${o}
                        </span>
                    </div>
                </div>
            `}).join("")},updateKPIs(e){let t=e.length,n=e.filter(r=>r.status==="offline").length,o=e.filter(r=>r.status==="online").length;const a=document.getElementById("monitor-kpi-total"),s=document.getElementById("monitor-kpi-warning"),i=document.getElementById("monitor-kpi-info");a&&(a.textContent=t),s&&(s.textContent=n),i&&(i.textContent=o)}};function Ht(e,t,n){return[...e.querySelectorAll('.notification-card[draggable="true"]:not(.dragging)')].reduce((a,s)=>{const i=s.getBoundingClientRect(),r=i.left+i.width/2,c=i.top+i.height/2,u=Math.pow(n-r,2)+Math.pow(t-c,2);return u<a.distance?{distance:u,element:s}:a},{distance:Number.POSITIVE_INFINITY}).element}let ie="list";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=_,Pt(),_t(),Ft(),dt.init(),tt.init(),_.init()?(console.log("Sessão restaurada:",_.getUser().email),ht()):ft()});let We,se,Le,Ie;function Pt(){We=document.querySelectorAll(".nav-btn"),se=document.getElementById("btn-new-item"),Le=document.getElementById("login-section"),Ie=document.getElementById("app-container")}function ft(){Le&&Le.classList.remove("hidden"),Ie&&Ie.classList.add("hidden"),document.body.style.overflow="hidden"}function _t(){const e=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=e-5;o<=e+5;o++){const a=document.createElement("option");a.value=o,a.textContent=o,o===e&&(a.selected=!0),n.appendChild(a)}})}function ht(){if(Le&&Le.classList.add("hidden"),Ie&&Ie.classList.remove("hidden"),document.body.style.overflow="",ie="list",Me(),O.fetch(),ee.fetch(),Je.fetch(),P.fetch(),window.auth){const e=document.getElementById("timeline-tab-anexo");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"));const t=document.getElementById("timeline-tab-config");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"))}}function Me(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section","monitoring-section"].forEach(e=>{l.hide(e)}),se&&se.classList.add("hidden"),nt.stop(),ie){case"account":case"profile":l.show("account-section"),l.setText("section-title","Minha Conta"),setTimeout(()=>nt.start(),100);break;case"list":l.show("list-section"),l.setText("section-title","Listagem Geral"),_.isAdmin()&&se&&se.classList.remove("hidden");break;case"docs":l.show("docs-section"),l.setText("section-title","Documentação");break;case"detail":l.show("detail-section"),l.setText("section-title","Procedimento");break;case"users":l.show("users-section"),l.setText("section-title","Gestão de Usuários");break;case"accounts":l.show("accounts-section"),l.setText("section-title","Gestão de Contas"),P.handleSearch();break;case"timeline":l.show("timeline-section"),l.setText("section-title","Timeline");break;case"telephony":l.show("telephony-section"),l.setText("section-title","Telefonia");break;case"monitoring":l.show("monitoring-section"),l.setText("section-title","Monitoramento"),tt.fetch();break}yt()}function yt(){const e=_.isAdmin();l.toggle("nav-users",!e),l.toggle("nav-accounts",!e),se&&se.classList.toggle("role-hidden",!e);const t=document.getElementById("btn-floating-edit");t&&t.classList.toggle("role-hidden",!e),document.querySelectorAll(".btn-actions-container").forEach(i=>{i.classList.toggle("role-hidden",!e)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(i=>{const r=document.getElementById(i);r&&r.classList.toggle("role-hidden",!e)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!e);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!e);const a=document.getElementById("btn-new-doc");a&&a.classList.toggle("role-hidden",!e);const s=_.getUser();if(s){let i=s.name;(i.toLowerCase().startsWith("usuário ")||i.toLowerCase().startsWith("usuario "))&&(i=i.substring(8)),l.setText("profile-name-display",i),l.setText("profile-role-display",s.role);let r=i.substring(0,2).toUpperCase();const c=i.trim().split(/\s+/);c.length>1&&(r=(c[0][0]+c[c.length-1][0]).toUpperCase()),l.setText("profile-avatar-initials",r)}}function Ft(){const e=document.getElementById("sidebar"),t=document.getElementById("sidebar-toggle");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("collapsed")}),We.forEach(i=>{i.addEventListener("click",()=>{if(We.forEach(r=>r.classList.remove("active")),i.classList.add("active"),ie=i.dataset.section,Me(),window.innerWidth<=768){e.classList.remove("open");const r=document.getElementById("sidebar-overlay");r&&r.classList.remove("active")}})}),window.addEventListener("SectionChange",i=>{ie=i.detail.section,Me()}),l.on("login-form","submit",async i=>{i.preventDefault();const r=document.getElementById("login-btn"),c=document.getElementById("login-error");r&&(r.disabled=!0);const u=await _.login(l.getValue("login-email"),l.getValue("login-password"));r&&(r.disabled=!1),u.success?ht():c&&(c.innerText=u.error,c.classList.remove("hidden"))}),l.on("btn-logout","click",()=>{const i=document.getElementById("auto-refresh-toggle");i&&i.checked&&(i.checked=!1,i.dispatchEvent(new Event("change"))),_.logout(),ft()}),document.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{const r=i.closest(".modal");r&&r.classList.add("hidden")})}),window.UsersHandler=Je,window.DocsHandler=ee,window.ProceduresHandler=O,window.AccountsHandler=P,window.TelephonyHandler=Ee,window.monitoringHandler=tt,["extensions","queues","blf","users"].forEach(i=>{l.on(`tab-telephony-${i}`,"click",()=>Ee.setActiveTab(i))}),l.on("telephony-search","input",i=>Ee.search(i.target.value.toLowerCase())),l.on("telephony-page-size","change",i=>Ee.setPageSize(i.target.value)),l.on("telephony-reload-btn","click",()=>{const i=document.getElementById("telephony-search");i&&(i.value=""),Ee.fetch()}),l.on("accounts-search","input",()=>P.handleSearch()),l.on("filter-status","change",()=>P.handleSearch()),l.on("filter-date-toggle","change",i=>{const r=document.getElementById("sidebar-mini-calendar-list");r&&(r.style.opacity=i.target.checked?"1":"0.4",r.style.pointerEvents=i.target.checked?"auto":"none"),P.handleSearch()}),l.on("filter-cal-month","change",()=>P.handleFilterChange(!0)),l.on("filter-cal-year","change",()=>P.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(i=>{l.on(i,"change",()=>{ie==="accounts"&&P.renderDashboard()})}),l.on("btn-dash-clear-dates","click",()=>{l.setValue("dash-filter-start",""),l.setValue("dash-filter-end",""),l.setValue("dash-filter-type","Todos"),l.setValue("dash-filter-status","Todos"),l.setValue("dash-filter-payment","Todos"),P.resetMultiselects(),l.setValue("dash-sort-empresas","desc"),l.setValue("dash-sort-categorias","desc"),ie==="accounts"&&P.renderDashboard()}),l.on("user-form","submit",i=>Je.save(i)),l.on("doc-form","submit",i=>ee.handleUpload(i)),l.on("account-form","submit",i=>P.save(i)),l.on("faq-form","submit",i=>O.saveMeta(i));const n=document.getElementById("proc-color-palette"),o=document.getElementById("proc-color");n&&o&&(n.addEventListener("click",i=>{const r=i.target.closest(".color-swatch");if(r)if(r.id==="color-custom-swatch")o.click();else{const c=r.dataset.color;c&&(o.value=c,n.querySelectorAll(".color-swatch").forEach(u=>u.classList.remove("active")),r.classList.add("active"))}}),o.addEventListener("input",i=>{const r=document.getElementById("color-custom-swatch");r&&(r.style.background=i.target.value,n.querySelectorAll(".color-swatch").forEach(c=>c.classList.remove("active")),r.classList.add("active"))})),l.on("btn-new-item","click",()=>{if(l.setText("modal-form-title","Novo Procedimento"),l.setValue("proc-id",""),l.setValue("proc-content","[]"),n){n.querySelectorAll(".color-swatch").forEach(r=>r.classList.remove("active"));const i=n.querySelector('[data-color="#4F46E5"]');i&&i.classList.add("active")}o&&(o.value="#4F46E5"),l.show("modal-form")}),l.on("btn-new-account","click",()=>P.openAccountModal()),l.on("btn-new-account-cal","click",()=>P.openAccountModal()),l.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),l.setValue("user-id-form",""),l.show("modal-user")}),l.on("list-search","input",i=>{O.search(i.target.value.toLowerCase())}),l.on("doc-search","input",i=>{ee.search(i.target.value.toLowerCase())}),l.on("doc-dash-search","input",()=>{ee.renderDashboard()}),l.on("doc-dash-filter-category","change",()=>{ee.renderDashboard()}),l.on("doc-dash-filter-status","change",()=>{ee.renderDashboard()}),l.on("btn-new-doc","click",()=>{l.show("modal-upload")}),["geral","contratos","termo-de-uso","dashboard"].forEach(i=>{l.on(`tab-doc-${i}`,"click",()=>{let r;i==="termo-de-uso"?r="Termo de Uso":i==="dashboard"?r="dashboard":r=i,ee.setActiveTab(r)})}),l.on("doc-category","change",i=>{const r=i.target.value.toLowerCase(),c=document.getElementById("doc-dates-container");c&&(c.style.display=r==="contratos"||r==="termo de uso"?"grid":"none")}),l.on("doc-indefinite","change",i=>{const r=document.getElementById("doc-end-date");r&&(r.disabled=i.target.checked,i.target.checked&&(r.value=""))});const a=document.getElementById("drop-zone"),s=document.getElementById("doc-file");a&&s&&(a.addEventListener("click",i=>{i.target!==s&&s.click()}),s.addEventListener("click",i=>{i.stopPropagation()}),s.addEventListener("change",i=>{i.target.files.length>0&&l.setText("file-name-display",i.target.files[0].name)}),a.addEventListener("dragover",i=>{i.preventDefault(),a.classList.add("dragover")}),a.addEventListener("dragleave",()=>{a.classList.remove("dragover")}),a.addEventListener("drop",i=>{i.preventDefault(),a.classList.remove("dragover"),i.dataTransfer.files.length>0&&(s.files=i.dataTransfer.files,l.setText("file-name-display",i.dataTransfer.files[0].name))})),l.on("toggle-list","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),O.setListingMode("list")}),l.on("toggle-cards","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),O.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes"].forEach(i=>{l.on(`tab-acc-${i}`,"click",r=>{document.querySelectorAll(".acc-tab-btn").forEach(m=>m.classList.remove("active")),r.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(m=>{m.classList.add("hidden"),m.classList.remove("active")});const c=document.getElementById("accounts-dashboard-view");c&&(c.classList.add("hidden"),c.classList.remove("active"));const u=i==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${i}`,d=document.getElementById(u);d&&(d.classList.remove("hidden"),d.classList.add("active"));const p=document.getElementById("calendar-view-toggle-container");p&&(i==="calendario"?(p.classList.remove("hidden"),p.style.display="flex"):(p.classList.add("hidden"),p.style.display="none")),P.setAccountsViewMode(i==="calendario"?"calendar":i==="dashboard"?"dashboard":i==="notificacoes"?"notificacoes":"list")})}),["day","month","year"].forEach(i=>{l.on(`toggle-accounts-cal-${i}`,"click",r=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(c=>c.classList.remove("active")),r.currentTarget.classList.add("active"),["day","month","year"].forEach(c=>{document.getElementById(`cal-${c}-view-container`).classList.toggle("hidden-cal-view",c!==i)}),P.setCalendarSubView(i)})}),l.on("btn-prev-date-nav","click",()=>P.shiftCalendarDate(-1)),l.on("btn-next-date-nav","click",()=>P.shiftCalendarDate(1)),l.on("btn-back-to-accounts","click",()=>{l.hide("dedicated-account-page"),l.show("accounts-section"),yt()}),l.on("btn-back-to-list","click",()=>{const i=document.getElementById("procedure-edit-wrapper");i&&!i.classList.contains("hidden")?O.toggleEditMode(!1):(ie="list",Me())}),l.on("btn-floating-edit","click",()=>O.toggleEditMode(!0)),l.on("btn-cancel-edit","click",()=>O.toggleEditMode(!1)),l.on("btn-save-procedure","click",()=>O.handleSaveProcedure()),l.on("confirm-yes","click",()=>{l.hide("modal-confirm"),O.openDetail(O.getPendingProcId())}),l.on("confirm-no","click",()=>{l.hide("modal-confirm")}),l.on("procedure-search","input",i=>{O.filterProcedureContent(i.target.value)}),l.on("btn-add-block","click",()=>{const i=document.getElementById("section-title-input"),r=document.getElementById("section-type-input");i&&(i.value=""),r&&(r.value="TEXTO"),l.show("modal-add-section")}),l.on("btn-confirm-add-section","click",()=>{const i=l.getValue("section-title-input"),r=l.getValue("section-type-input");if(!i)return alert("Por favor, informe o título da seção.");O.addSection(i,r),l.hide("modal-add-section")})}
