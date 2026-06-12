(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const be="/api",I={async get(t){const e=await fetch(`${be}${t}`);if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${e.status}`)}return await e.json()},async post(t,e){const n=await fetch(`${be}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(t,e){const n=await fetch(`${be}${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(t){const e=await fetch(`${be}${t}`,{method:"DELETE"});if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${e.status}`)}return await e.json()},async upload(t,e){const n=await fetch(`${be}${t}`,{method:"POST",body:e});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let me=null;const q={init(){const t=localStorage.getItem("user");if(t)try{return me=JSON.parse(t),!0}catch{return this.logout(),!1}return!1},getUser(){return me},isAdmin(){return me&&me.role==="Administrador"},async login(t,e){try{const n=await I.post("/login",{email:t,password:e});return me=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){me=null,localStorage.removeItem("user")}},c={show(t){const e=document.getElementById(t);e&&e.classList.remove("hidden")},hide(t){const e=document.getElementById(t);e&&e.classList.add("hidden")},toggle(t,e){const n=document.getElementById(t);n&&n.classList.toggle("hidden",e)},setText(t,e){const n=document.getElementById(t);n&&(n.innerText=e)},setValue(t,e){const n=document.getElementById(t);n&&(n.value=e)},getValue(t){const e=document.getElementById(t);return e?e.value:null},on(t,e,n){const o=document.getElementById(t);o&&o.addEventListener(e,n)}},gt={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const t=window.innerWidth<=768;this.particleCount=t?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let e=0;e<this.particleCount;e++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const t=document.getElementById("account-section");t&&(this.canvas.width=t.clientWidth,this.canvas.height=t.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let t=0;t<this.particles.length;t++){const e=this.particles[t];e.x+=e.vx,e.y+=e.vy,(e.x<0||e.x>this.canvas.width)&&(e.vx*=-1),(e.y<0||e.y>this.canvas.height)&&(e.vy*=-1),this.ctx.beginPath(),this.ctx.arc(e.x,e.y,e.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=t+1;n<this.particles.length;n++){const o=this.particles[n],a=e.x-o.x,s=e.y-o.y,i=Math.sqrt(a*a+s*s);if(i<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const r=1-i/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${r*.4})`,this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let we=[];const it={async fetch(){try{we=await I.get("/users"),this.render(we)}catch(t){console.error("Error fetching Users:",t)}},getUsers(){return we},render(t){const e=document.getElementById("user-table-body");e&&(e.innerHTML=t.map(n=>{const o=n.role==="Administrador",a=q.isAdmin()?`
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
            </tr>`}).join(""))},openEditModal(t){const e=we.find(n=>n.id===t);e&&(c.setText("modal-user-title","Editar Usuário"),c.setValue("user-id-form",e.id),c.setValue("user-name-form",e.name),c.setValue("user-email-form",e.email),c.setValue("user-password-form",""),c.setValue("user-role-form",e.role),c.show("modal-user"))},async save(t){t.preventDefault();const e=c.getValue("user-id-form"),n={name:c.getValue("user-name-form"),email:c.getValue("user-email-form"),password:c.getValue("user-password-form"),role:c.getValue("user-role-form")};try{e?await I.put(`/users/${e}`,n):await I.post("/users",n),c.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(e?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(t){if(confirm("Deseja excluir este usuário?"))try{await I.delete(`/users/${t}`),this.fetch()}catch(e){alert("Erro ao excluir: "+e.message)}},search(t){const e=we.filter(n=>n.name.toLowerCase().includes(t)||n.email.toLowerCase().includes(t));this.render(e)}};let Pe=[],ie="Geral",V=1;const xe=10;let ft=[];const ne={async fetch(){try{V=1,Pe=await I.get("/documents"),this.filterAndRender()}catch(t){console.error("Error fetching Documents:",t)}},setActiveTab(t){ie=t,V=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(e=>{const n=e.textContent.trim().toLowerCase();e.classList.toggle("active",n===t.toLowerCase())}),this.filterAndRender()},filterAndRender(){const t=document.querySelector(".docs-header");if(ie.toLowerCase()==="dashboard")t&&(t.style.display="none"),c.hide("doc-list-container"),c.show("doc-dashboard-container"),this.renderDashboard();else{t&&(t.style.display="flex"),c.show("doc-list-container"),c.hide("doc-dashboard-container");const e=Pe.filter(n=>(n.category||"Geral").toLowerCase()===ie.toLowerCase());this.render(e)}},calculateRemainingTime(t){if(!t||t==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const e=new Date;e.setHours(0,0,0,0);const n=new Date(t+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-e.getTime(),a=Math.ceil(o/(1e3*60*60*24));if(a<0){const s=Math.abs(a);let i=`Expirado há ${s} dia(s)`;return s>=30&&(i=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:i,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:a}}else{if(a===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:a};if(a<=30)return{text:`Expira em ${a} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:a};{const s=Math.floor(a/30);let i=`Expira em ${s} mês(es)`;if(s>=12){const r=Math.floor(s/12),l=s%12;i=`Expira em ${r} ano(s)${l>0?` e ${l} mês(es)`:""}`}return{text:i,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:a}}}},renderDashboard(){const t=document.getElementById("doc-dashboard-tbody");if(!t)return;const e=Pe.filter(g=>{const y=(g.category||"").toLowerCase();return y==="contratos"||y==="termo de uso"});let n=0,o=0,a=0,s=0;e.forEach(g=>{const y=(g.category||"").toLowerCase(),v=this.calculateRemainingTime(g.end_date);v.status==="expired"?s++:v.status==="critical"?(a++,y==="contratos"&&n++,y==="termo de uso"&&o++):(y==="contratos"&&n++,y==="termo de uso"&&o++)}),c.setText("doc-kpi-active-contracts",n),c.setText("doc-kpi-active-terms",o),c.setText("doc-kpi-warning-docs",a),c.setText("doc-kpi-expired-docs",s);const i=document.getElementById("doc-dash-search"),r=document.getElementById("doc-dash-filter-category"),l=document.getElementById("doc-dash-filter-status"),u=i?i.value.toLowerCase().trim():"",d=r?r.value:"Todos",p=l?l.value:"Todos";let m=e.filter(g=>{if(u&&!g.original_name.toLowerCase().includes(u)||d!=="Todos"&&(g.category||"").toLowerCase()!==d.toLowerCase())return!1;const y=this.calculateRemainingTime(g.end_date);return!(p!=="Todos"&&(p==="Ativos"&&(y.status==="expired"||y.status==="critical")||p==="Expirando"&&y.status!=="critical"||p==="Expirados"&&y.status!=="expired"||p==="Indeterminado"&&y.status!=="indefinite"))});if(m.sort((g,y)=>{const v=this.calculateRemainingTime(g.end_date),L=this.calculateRemainingTime(y.end_date),$={expired:1,critical:2,active:3,indefinite:4},x=$[v.status]||5,M=$[L.status]||5;return x!==M?x-M:v.days-L.days}),m.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const f=window.auth&&window.auth.isAdmin();t.innerHTML=m.map(g=>{const y=g.mimetype==="application/pdf"?"📕":"🖼️",v=g.start_date?new Date(g.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",L=g.end_date?g.end_date==="Indefinido"?"Indefinido":new Date(g.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",$=this.calculateRemainingTime(g.end_date),x=f?`<button class="btn-delete" onclick="window.DocsHandler.delete(${g.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
                <tr>
                    <td>
                        <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                            <span>${y}</span>
                            <span title="${g.original_name}">${g.original_name}</span>
                        </span>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.75rem;">
                            ${g.category}
                        </span>
                    </td>
                    <td>${v}</td>
                    <td>${L}</td>
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
                            ${x}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(t){const e=document.getElementById("doc-list-body");if(!e)return;const n=document.getElementById("doc-list-thead"),o=ie.toLowerCase()==="contratos"||ie.toLowerCase()==="termo de uso",a=window.auth&&window.auth.isAdmin(),s=a?"":'class="role-hidden"';ft=t;const i=t.length,r=Math.ceil(i/xe);V>r&&(V=Math.max(1,r)),V<1&&(V=1);const l=(V-1)*xe,u=t.slice(l,l+xe);if(n&&(o?n.innerHTML=`
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
                `),u.length===0){e.innerHTML=`
                <tr>
                    <td colspan="${o?7:5}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `,this.renderPaginationControls("doc-pagination",0,0);return}e.innerHTML=u.map(d=>{const p=d.mimetype==="application/pdf"?"📕":"🖼️",m=(d.size/1024).toFixed(1)+" KB",f=d.created_at?new Date(d.created_at).toLocaleDateString("pt-BR"):"-",g=d.mimetype==="application/pdf"?"PDF":"Imagem",y=a?`<button class="btn-delete" onclick="window.DocsHandler.delete(${d.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",v=d.start_date?new Date(d.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",L=d.end_date?d.end_date==="Indefinido"?"Indefinido":new Date(d.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-";return o?`
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${p}</span>
                                <span title="${d.original_name}">${d.original_name}</span>
                            </span>
                        </td>
                        <td>${m}</td>
                        <td>${g}</td>
                        <td>${v}</td>
                        <td>${L}</td>
                        <td>${f}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${d.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
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
                                ${y}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",r,i)},async handleUpload(t){t.preventDefault();const e=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!e.files.length){alert("Selecione um arquivo.");return}const a=new FormData,s=n?n.value:"Geral";a.append("category",s),a.append("customName",o?o.value:""),a.append("document",e.files[0]);const i=s.toLowerCase();if(i==="contratos"||i==="termo de uso"){const r=document.getElementById("doc-start-date"),l=document.getElementById("doc-end-date"),u=document.getElementById("doc-indefinite");r&&r.value&&a.append("startDate",r.value),u&&u.checked?a.append("endDate","Indefinido"):l&&l.value&&a.append("endDate",l.value)}try{await I.upload("/documents",a),c.hide("modal-upload"),document.getElementById("doc-form").reset();const r=document.getElementById("doc-dates-container");r&&(r.style.display="none");const l=document.getElementById("doc-end-date");l&&(l.disabled=!1),c.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(r){console.error(r),alert("Erro ao subir arquivo.")}},async delete(t){if(confirm("Deletar este documento?"))try{await I.delete(`/documents/${t}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(t){if(ie.toLowerCase()==="dashboard")this.renderDashboard();else{V=1;const e=Pe.filter(n=>(n.category||"Geral").toLowerCase()===ie.toLowerCase()&&n.original_name.toLowerCase().includes(t));this.render(e)}},changePage(t){V=t,this.render(ft)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${V===1?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${V-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=e;l++)(l===1||l===e||l>=V-1&&l<=V+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===V?"active":""}" 
                            onclick="window.DocsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${V===e?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${V+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(V-1)*xe+1,r=Math.min(V*xe,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let te=[],k={summaries:[]},ht=null,P=null,We="list",Ee=null,Z=null,yt=null,O=1;const $e=10;let Re=[];const j={getPendingProcId(){return ht},async fetch(){try{O=1,te=await I.get("/procedures"),this.renderTable(te)}catch(t){console.error("Error fetching FAQs:",t)}},getFaqs(){return te},setListingMode(t){We=t,O=1,this.renderTable(Re.length?Re:te)},renderTable(t){const e=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!e||!n||!o)return;Re=t;const a=t.length,s=Math.ceil(a/$e);O>s&&(O=Math.max(1,s)),O<1&&(O=1);const i=(O-1)*$e,r=t.slice(i,i+$e);We==="list"?(c.show("list-table-container"),c.hide("list-cards-container"),r.length===0?o.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            Nenhum procedimento encontrado.
                        </td>
                    </tr>
                `:o.innerHTML=r.map(u=>{const d=q.isAdmin()?`
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
                    </tr>`}).join("")):(c.hide("list-table-container"),c.show("list-cards-container"),r.length===0?n.innerHTML=`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum procedimento encontrado.
                    </div>
                `:n.innerHTML=r.map(u=>{const d=q.isAdmin()?`
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
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,a),(We==="list"?o:n).addEventListener("click",function(d){const p=d.target.closest('[data-action="edit"], [data-action="delete"]');if(p){d.stopPropagation(),d.preventDefault();const f=Number(p.dataset.id);p.dataset.action==="edit"?j.openEditModal(f):p.dataset.action==="delete"&&j.deleteProcedure(f);return}const m=d.target.closest('[data-action="open"]');if(m){const f=Number(m.dataset.id);j.openDetail(f)}})},openDetail(t){const e=te.find(o=>o.id===t);if(!e)return;c.setText("detail-title",e.name||e.title||"Sem título"),c.setValue("proc-id",e.id);try{let o=e.content?JSON.parse(e.content):[];Array.isArray(o)?k={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?k=o:k={summaries:[]}}catch{k={summaries:[]}}k.summaries.length>0?P=k.summaries[0].id:P=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(t){const e=te.find(n=>n.id===t);e&&(c.setText("modal-form-title","Editar Procedimento"),c.setValue("proc-id",e.id),c.setValue("proc-name",e.name||e.title||""),c.setValue("proc-responsible",e.responsible||""),c.setValue("proc-group",e.group_name||""),c.setValue("proc-note",e.note||""),c.setValue("proc-content",e.content||""),c.setValue("proc-color",e.color||"#4F46E5"),c.show("modal-form"))},async saveMeta(t){t&&t.preventDefault();const e=c.getValue("proc-id"),n={name:c.getValue("proc-name").toUpperCase(),responsible:c.getValue("proc-responsible").toUpperCase(),group_name:c.getValue("proc-group"),note:c.getValue("proc-note"),content:c.getValue("proc-content"),color:c.getValue("proc-color")};try{const o=e?`/procedures/${e}`:"/procedures";ht=(e?await I.put(o,n):await I.post(o,n)).id,c.hide("modal-form"),document.getElementById("faq-form").reset(),c.setValue("proc-responsible","TI"),c.setValue("proc-group","Geral"),await this.fetch(),c.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(t){if(confirm("Deseja excluir este procedimento?"))try{await I.delete(`/procedures/${t}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(t){const e=document.querySelector(".procedure-sidebar");t?(c.hide("procedure-view-container"),c.hide("procedure-view-sidebar"),c.show("procedure-edit-wrapper"),c.show("procedure-edit-sidebar"),c.hide("btn-floating-edit"),e&&e.classList.add("glass","has-border"),k.summaries.length>0?k.summaries.find(n=>n.id===P)||(P=k.summaries[0].id):P=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(c.show("procedure-view-container"),c.show("procedure-view-sidebar"),c.hide("procedure-edit-wrapper"),c.hide("procedure-edit-sidebar"),c.show("btn-floating-edit"),e&&e.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const t=document.getElementById("procedure-view-container"),e=document.getElementById("procedure-view-index");if(!t||!e)return;if(k.summaries.length===0){t.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',e.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";k.summaries.forEach((a,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${a.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${a.title}</li>`,n+=`<div id="sum-view-${a.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(k.summaries.length>1||a.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${a.title}</h4>`),a.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const i=a.sections.map((r,l)=>{let u="";if(r.type==="TEXTO")u=`<div class="gh-content"><div class="gh-text-view">${r.data||"Sem conteúdo."}</div></div>`;else if(r.type==="FAQ")u='<div class="gh-faq-list">'+(r.data||[]).map((m,f)=>`
                         <div class="gh-accordion" id="gh-faq-${a.id}-${l}-${f}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${a.id}-${l}-${f}')">
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
                 `}).join("");n+=i,n+="</div>"}),e.innerHTML=o,t.innerHTML=n},filterProcedureContent(t){t=t.toLowerCase();const e=document.getElementById("procedure-view-container");if(!e)return;e.querySelectorAll(".gh-box").forEach(o=>{const a=o.querySelector(".gh-faq-list");let s=!1;const i=o.querySelector(".gh-header"),r=i?i.textContent.toLowerCase().includes(t):!1;a&&a.querySelectorAll(".gh-accordion").forEach(d=>{const p=d.textContent.toLowerCase();r||p.includes(t)?(d.classList.remove("hidden"),s=!0):d.classList.add("hidden")});const l=o.textContent.toLowerCase();r||l.includes(t)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const t=document.getElementById("procedure-edit-index"),e=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!t)return;t.innerHTML=k.summaries.map((a,s)=>`
             <li class="sidebar-index-item ${a.id===P?"active":""} editable-section style-none"
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
            `).join("");const o=k.summaries.find(a=>a.id===P);o?(n.textContent=o.title,n.style.color="var(--text-main)",e.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",e.classList.add("hidden"))},selectSummary(t){P=t,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(t,e){const n=k.summaries.find(a=>a.id===t);n&&(n.title=e||"Sem título"),this.renderProcedureBuilderSidebar();const o=k.summaries.find(a=>a.id===P);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const t="sum_"+Date.now();k.summaries.push({id:t,title:`Sumário ${k.summaries.length+1}`,sections:[]}),P=t,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(t){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(k.summaries=k.summaries.filter(e=>e.id!==t),P===t&&(P=k.summaries.length>0?k.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const t=document.getElementById("procedure-edit-container");if(!t)return;if(!P){t.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const e=k.summaries.find(o=>o.id===P);if(!e)return;const n=e.sections;if(n.length===0){t.innerHTML=`<p class="empty-state">Nenhum campo em "${e.title}". Clique em "+ Novo Container" para começar.</p>`;return}t.innerHTML=n.map((o,a)=>`
             <div class="section-container glass editable-section" 
                  draggable="false" 
                  ondragstart="window.ProceduresHandler.handleSecDragStart(event, ${a}, '${e.id}')"
                  ondragover="window.ProceduresHandler.handleDragOver(event)"
                  ondrop="window.ProceduresHandler.handleSecDrop(event, ${a}, '${e.id}')"
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
             </div>`).join("")},handleSumDragStart(t,e){Ee="summary",Z=e,t.dataTransfer.effectAllowed="move",setTimeout(()=>{t.target&&t.target.classList.add("dragging")},0)},handleSumDrop(t,e){if(t.preventDefault(),Ee!=="summary"||Z===null||Z===e)return;const n=k.summaries.splice(Z,1)[0];k.summaries.splice(e,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(t,e,n){Ee="container",Z=e,yt=n,t.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=t.target.nodeType===1?t.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(t){t.preventDefault(),t.dataTransfer.dropEffect="move"},handleSecDrop(t,e,n){if(t.preventDefault(),Ee!=="container"||Z===null||yt!==n)return;const o=k.summaries.find(s=>s.id===n);if(!o||Z===e)return;const a=o.sections.splice(Z,1)[0];o.sections.splice(e,0,a),this.renderProcedureBuilder()},handleDragEnd(t){document.querySelectorAll(".editable-section.dragging").forEach(e=>e.classList.remove("dragging")),t&&t.target&&t.target.setAttribute&&t.target.setAttribute("draggable","false"),Ee=null,Z=null},updateSectionTitle(t,e){const n=k.summaries.find(o=>o.id===P);n&&(n.sections[t].title=e)},updateSectionData(t,e){const n=k.summaries.find(o=>o.id===P);n&&(n.sections[t].data=e)},removeSection(t){const e=k.summaries.find(n=>n.id===P);e&&e.sections.splice(t,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(t){const e=k.summaries.find(n=>n.id===P);e&&(e.sections[t].data=e.sections[t].data||[],e.sections[t].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(t,e,n,o){const a=k.summaries.find(s=>s.id===P);a&&(a.sections[t].data[e][n]=o)},removeFaqItem(t,e){const n=k.summaries.find(o=>o.id===P);n&&n.sections[t].data.splice(e,1),this.renderProcedureBuilder()},addSection(t,e){if(!P){alert("Selecione primeiro um sumário na barra lateral.");return}const n=k.summaries.find(o=>o.id===P);n&&(n.sections.push({id:Date.now(),title:t,type:e,data:e==="FAQ"?[]:e==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(t,e){e.dataTransfer.files&&e.dataTransfer.files.length>0&&await this.uploadSectionFile(t,e.dataTransfer.files[0])},async handleSectionFileUpload(t,e){const n=e.files[0];n&&await this.uploadSectionFile(t,n)},async uploadSectionFile(t,e){const n=new FormData;n.append("file",e);try{const o=await I.upload("/upload",n),a=k.summaries.find(s=>s.id===P);a&&(a.sections[t].data={name:e.name,path:o.path,mimetype:e.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const t=parseInt(c.getValue("proc-id"));if(!t)return;const n={...te.find(o=>o.id===t),content:JSON.stringify(k)};try{await I.put(`/procedures/${t}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(t),this.fetch()}catch{alert("Erro ao salvar")}},search(t){O=1;const e=te.filter(n=>(n.name||n.title||"").toLowerCase().includes(t)||(n.responsible||"").toLowerCase().includes(t)||(n.group_name||"").toLowerCase().includes(t));this.renderTable(e)},changePage(t){O=t,this.renderTable(Re)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${O===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${O-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=e;l++)(l===1||l===e||l>=O-1&&l<=O+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===O?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${O===e?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${O+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(O-1)*$e+1,r=Math.min(O*$e,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};window.toggleGhAccordion=function(t){const e=document.getElementById(t);e&&e.classList.toggle("open")};let G=[],pe="list",se="month",B=new Date,N=1;const Ie=10;let vt=[];const z={async fetch(){try{N=1,G=await I.get("/accounts"),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(t){console.error("Falha ao obter contas",t)}},populateCompanyFilter(){const t=document.getElementById("dash-filter-company-dynamic-options");if(t){const e=new Set;t.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{e.add(a.value)});const n=[...new Set(G.map(a=>a.company_name).filter(Boolean))].sort((a,s)=>a.localeCompare(s));let o="";n.forEach(a=>{const s=e.has(a)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${a}" ${s}> <span>${a}</span></label>`}),t.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(t){if(!document.getElementById(`${t}-container`))return;const n=document.getElementById(`${t}-trigger`),o=document.getElementById(`${t}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",r=>{r.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(l=>{l!==o&&l.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const a=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(r=>r.value!=="Todos"),i=()=>{const r=s.filter(u=>u.checked).map(u=>u.value),l=n.querySelector(".trigger-label");a.checked||s.length>0&&r.length===s.length?(a.checked=!0,l&&(l.innerText="Todos")):r.length===0?l&&(l.innerText="Nenhum"):r.length===1?l&&(l.innerText=r[0]):l&&(l.innerText=`${r.length} selecionados`)};a&&!a.dataset.listenerBound&&(a.addEventListener("change",()=>{s.forEach(r=>{r.checked=a.checked}),i(),this.renderDashboard()}),a.dataset.listenerBound="true"),s.forEach(r=>{r.dataset.listenerBound||(r.addEventListener("change",()=>{s.every(u=>u.checked)?a.checked=!0:a.checked=!1,i(),this.renderDashboard()}),r.dataset.listenerBound="true")}),i()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",t=>{t.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(e=>{e.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(t){const e=document.getElementById(`${t}-dropdown`);if(!e)return["Todos"];const n=e.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(e.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(t=>{const e=document.getElementById(`${t}-dropdown`);if(e){e.querySelectorAll('input[type="checkbox"]').forEach(a=>{a.checked=a.value==="Todos"});const o=document.getElementById(`${t}-trigger`);if(o){const a=o.querySelector(".trigger-label");a&&(a.innerText="Todos")}}})},getAccounts(){return G},setAccountsViewMode(t){pe=t,this.handleSearch()},setCalendarSubView(t){se=t,this.handleSearch()},shiftCalendarDate(t){se==="day"?B.setDate(B.getDate()+t):se==="month"?B.setMonth(B.getMonth()+t):se==="year"&&B.setFullYear(B.getFullYear()+t),c.setValue("filter-day",B.getDate()),c.setValue("filter-month",B.getMonth()),c.setValue("filter-year",B.getFullYear()),this.handleSearch()},handleFilterChange(t=!1){if(t){const e=c.getValue("filter-cal-year")?parseInt(c.getValue("filter-cal-year")):B.getFullYear(),n=c.getValue("filter-cal-month")?parseInt(c.getValue("filter-cal-month")):B.getMonth();B=new Date(e,n,1)}else{const e=c.getValue("filter-year")?parseInt(c.getValue("filter-year")):B.getFullYear(),n=c.getValue("filter-month")?parseInt(c.getValue("filter-month")):B.getMonth(),o=c.getValue("filter-day")?parseInt(c.getValue("filter-day")):B.getDate();B=new Date(e,n,o)}c.setValue("filter-month",B.getMonth()),c.setValue("filter-year",B.getFullYear()),this.handleSearch()},handleSearch(){const t=(c.getValue("accounts-search")||"").toLowerCase();let e=G.filter(n=>n.company_name.toLowerCase().includes(t)||n.description&&n.description.toLowerCase().includes(t));if(pe==="list"){N=1;const n=c.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),a=o?o.checked:!1,s=B.getFullYear(),i=B.getMonth(),r=B.getDate();e=e.filter(l=>{if(n&&l.status!==n)return!1;if(!a||!l.due_date)return!0;const[u,d,p]=l.due_date.split("-"),m=parseInt(u,10),f=parseInt(d,10)-1,g=parseInt(p,10);return l.type==="Único"?m===s&&f===i&&g===r:l.type==="Recorrente"?g===r:!0}),this.renderAccountsList(e)}else pe==="notificacoes"?this.renderNotifications():pe==="dashboard"?this.renderDashboard():this.renderCalendarWrapper(e)},checkAccountAlerts(){let t=!1;const e=new Date;e.setHours(0,0,0,0),G.forEach(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a==="on"&&s==="pendente"&&o.due_date){const[i,r,l]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(l,10));u.setHours(0,0,0,0),u.getTime()<=e.getTime()&&(t=!0)}});const n=document.getElementById("icon-alert-bell");n&&(t?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const t=document.getElementById("accounts-notifications-body");if(!t)return;t.innerHTML="";const e=new Date;e.setHours(0,0,0,0);let n=G.filter(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a!=="on"||s!=="pendente"||!o.due_date)return!1;const[i,r,l]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(l,10));return u.setHours(0,0,0,0),u.getTime()<=e.getTime()});if(n.length===0){t.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const a=document.createElement("tr");let s="Sem Data";if(o.due_date){const r=o.due_date.split("-");r.length===3&&(s=`${r[2]}/${r[1]}/${r[0]}`)}const i=q.isAdmin()?`
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
            `,t.appendChild(a)})},renderAccountsList(t){const e=document.getElementById("accounts-table-body");if(!e)return;e.innerHTML="",this.renderSidebarMiniCalendar(),vt=t;const n=t.length,o=Math.ceil(n/Ie);N>o&&(N=Math.max(1,o)),N<1&&(N=1);const a=(N-1)*Ie,s=t.slice(a,a+Ie);if(s.length===0){e.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(i=>{const r=document.createElement("tr");let l="Sem Data";if(i.due_date){const p=i.due_date.split("-");p.length===3&&(l=`${p[2]}/${p[1]}/${p[0]}`)}const u=i.status==="Off",d=q.isAdmin()?`
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
                        ${d}
                    </div>
                </td>
            `,e.appendChild(r)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(pe!=="dashboard")return;this.initDashboardMultiselects();const t=c.getValue("dash-filter-start"),e=c.getValue("dash-filter-end"),n=c.getValue("dash-filter-type")||"Todos",o=c.getValue("dash-filter-status")||"Todos",a=c.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),i=this.getMultiselectValues("dash-filter-company");let r=t?new Date(t+"T00:00:00"):null,l=e?new Date(e+"T23:59:59"):null;if(!r&&!l){const h=new Date;r=new Date(h.getFullYear(),h.getMonth(),1,0,0,0),l=new Date(h.getFullYear(),h.getMonth()+1,0,23,59,59)}else r?l||(l=new Date(2100,11,31)):r=new Date(2e3,0,1);let u=0,d=0,p=new Set,m=new Set,f=0,g=0,y=0,v="-",L=0,$=0,x={},M={},T={};G.forEach(h=>{if(!h.due_date||n!=="Todos"&&h.type!==n||o!=="Todos"&&h.status!==o||a!=="Todos"&&h.payment_status!==a)return;if(!s.includes("Todos")){if(s.length===0)return;const S=h.category||"Outros";if(!s.includes(S))return}if(!i.includes("Todos")&&(i.length===0||!i.includes(h.company_name)))return;let E=0,D=new Date(r);D.setHours(0,0,0,0);let A=new Date(l);A.setHours(0,0,0,0);let H=3650;for(;D<=A&&H>0;){if(this.isEventOnDate(h,D.getFullYear(),D.getMonth(),D.getDate())){E++;const S=`${D.getFullYear()}-${String(D.getMonth()+1).padStart(2,"0")}`;T[S]||(T[S]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const Y=parseFloat(h.value||0);T[S].total+=Y,h.payment_status==="Pago"&&(T[S].pago+=Y),h.payment_status==="Pendente"&&(T[S].pendente+=Y),h.type==="Recorrente"&&(T[S].fixo+=Y),h.type==="Único"&&(T[S].variavel+=Y)}D.setDate(D.getDate()+1),H--}if(E>0){const S=parseFloat(h.value||0)*E;u+=S,d+=E,p.add(h.category||"Outros"),m.add(h.company_name),h.payment_status==="Pago"&&(f+=S),h.payment_status==="Pendente"&&(g+=S),h.type==="Recorrente"&&(L+=S),h.type==="Único"&&($+=S),S>y&&(y=S,v=h.company_name);const Y=h.category||"Outros";M[Y]=(M[Y]||0)+S;const ue=h.company_name||"Sem Empresa";x[ue]=(x[ue]||0)+S}}),c.setText("dash-metric-valor","R$ "+u.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-contas",d.toString()),c.setText("dash-metric-tipos",p.size.toString()),c.setText("dash-metric-empresas",m.size.toString()),c.setText("dash-metric-pago","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-pendente","R$ "+g.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-maior-valor","R$ "+y.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-maior-nome",v),c.setText("dash-metric-fixo","R$ "+L.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),c.setText("dash-metric-variavel","R$ "+$.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const w=c.getValue("dash-sort-empresas")||"desc",b=c.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",x,w),this.renderTierList("dash-list-categorias",M,b),this.renderTimeChart(T)},renderTimeChart(t){window.timeChartInstance&&window.timeChartInstance.destroy();const e=document.getElementById("chart-dashboard-time");if(!e)return;const n=Object.keys(t).sort(),o=n.map(d=>{const[p,m]=d.split("-");return`${m}/${p}`}),a=n.map(d=>t[d].total),s=n.map(d=>t[d].pago),i=n.map(d=>t[d].pendente),r=n.map(d=>t[d].fixo),l=n.map(d=>t[d].variavel),u={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:a,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:i,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:r,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:l,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(d){let p=d.dataset.label||"";return p&&(p+=": "),d.parsed.y!==null&&(p+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(d.parsed.y)),p}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(d,p,m){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(d)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(e.getContext("2d"),u)},renderTierList(t,e,n){const o=document.getElementById(t);if(!o)return;const a=Object.entries(e);if(a.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}a.sort((r,l)=>n==="asc"?r[1]-l[1]:l[1]-r[1]);const s=a.slice(0,10);let i="";s.forEach(([r,l],u)=>{const d=u===0&&n==="desc",p=d?"🏆 ":u+1+". ";i+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${d?"bold":"normal"}; color: ${d?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${r}">
                        ${p}${r}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=i},renderCharts(t){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const e=document.getElementById("chart-category");if(e){const o={labels:Object.keys(t),datasets:[{data:Object.values(t),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(e.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],a=[];let s=new Date;for(let i=-5;i<=6;i++){let r=new Date(s.getFullYear(),s.getMonth()+i,1);o.push(r.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let l=0;G.forEach(u=>{if(!u.due_date||u.status==="Off")return;const[d,p]=u.due_date.split("-"),m=new Date(parseInt(d),parseInt(p)-1,1);(u.type==="Recorrente"&&r.getTime()>=m.getTime()||u.type==="Único"&&r.getFullYear()===parseInt(d)&&r.getMonth()===parseInt(p)-1)&&(l+=parseFloat(u.value||0))}),a.push(l)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:a,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(t){const e={},n=[];return t.forEach(o=>{if(o.type==="Único")n.push(o);else if(!e[o.company_name])e[o.company_name]=o;else{const a=new Date(e[o.company_name].due_date||0);new Date(o.due_date||0)>a&&(e[o.company_name]=o)}}),[...n,...Object.values(e)]},isEventOnDate(t,e,n,o){if(!t.due_date)return!1;const[a,s,i]=t.due_date.split("-"),r=parseInt(a,10),l=parseInt(s,10)-1,u=parseInt(i,10);if(t.type==="Único")return e===r&&n===l&&o===u;if(t.type==="Recorrente"){const d=new Date(r,l,u).setHours(0,0,0,0);if(new Date(e,n,o).setHours(0,0,0,0)<d)return!1;const m=t.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(m)){const f=(e-r)*12+(n-l),g=new Date(e,n+1,0).getDate(),y=Math.min(u,g);if(o!==y||f<0)return!1;if(m==="1 mes")return!0;if(m==="3 meses")return f%3===0;if(m==="6 meses")return f%6===0;if(m==="1 ano")return n===l}else{const f=Date.UTC(r,l,u),g=Date.UTC(e,n,o),y=Math.round((g-f)/(1e3*60*60*24));if(m==="1 dia")return!0;if(m==="7 dias")return y%7===0;if(m==="15 dias")return y%15===0}}return!1},renderCalendarWrapper(t){const e=B.getFullYear(),n=B.getMonth(),o=B.getDate();se==="month"?this.renderCalendarMonth(t,e,n):se==="year"?this.renderCalendarYear(t,e):se==="day"&&this.renderCalendarDay(t,e,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const t=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],e=B.getFullYear(),n=B.getMonth(),o=B.getDate(),a=new Date(e,n,1).getDay(),s=new Date(e,n+1,0).getDate(),i=new Date,r=i.getFullYear(),l=i.getMonth(),u=i.getDate(),d=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let p="";d.forEach((g,y)=>{p+=`<option value="${y}" ${y===n?"selected":""}>${g}</option>`});let m="";for(let g=r-5;g<=r+5;g++)m+=`<option value="${g}" ${g===e?"selected":""}>${g}</option>`;let f=`
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.parentElement.children[1].value, this.value)">
                    ${p}
                </select>
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.value, this.parentElement.children[0].value)">
                    ${m}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button class="btn-primary" style="width: 100%; padding: 4px 0; justify-content: center; font-size: 0.85rem;" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${r}, ${l}, ${u})">Hoje</button>
            </div>
            <div class="smc-header">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div class="smc-grid">
        `;for(let g=0;g<a;g++)f+='<div class="smc-day empty"></div>';for(let g=1;g<=s;g++)f+=`<div class="smc-day ${g===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${e}, ${n}, ${g})">${g}</div>`;f+="</div>",t.forEach(g=>{g&&(g.innerHTML=f)})},changeMiniCalendarMonthYear(t,e){let n=B.getDate();const o=new Date(t,parseInt(e)+1,0).getDate();n>o&&(n=o),B=new Date(t,e,n);try{c.setValue("filter-cal-year",t),c.setValue("filter-cal-month",e)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(t,e,n){B=new Date(t,e,n);try{c.setValue("filter-cal-year",t),c.setValue("filter-cal-month",e)}catch{}if(pe==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(t,e,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];c.setText("calendar-date-display",`${o[n]} ${e}`);const a=document.getElementById("calendar-month-grid");a.innerHTML="";const s=new Date(e,n,1).getDay(),i=new Date(e,n+1,0).getDate(),r=new Date,l=r.getFullYear()===e&&r.getMonth()===n;new Date(r.getFullYear(),r.getMonth(),1);for(let d=0;d<s;d++)a.innerHTML+='<div class="calendar-day empty"></div>';for(let d=1;d<=i;d++){const p=l&&r.getDate()===d?"today":"";a.innerHTML+=`<div class="calendar-day ${p}" id="cal-day-cell-${d}">
                <div class="calendar-date">${d}</div>
                <div class="calendar-events" id="cal-events-${d}"></div>
            </div>`}this.getLatestRecorrenteAccounts(t).forEach(d=>{if(!d.due_date)return;const p=new Date(e,n,1),m=new Date(r.getFullYear(),r.getMonth(),1);let f=!0;if(d.status==="Off"&&p.getTime()>=m.getTime()&&(f=!1),!!f){for(let g=1;g<=i;g++)if(this.isEventOnDate(d,e,n,g)){const y=document.getElementById(`cal-events-${g}`);if(y){const v=`${e}-${String(n+1).padStart(2,"0")}-${String(g).padStart(2,"0")}`;let L=d.payment_status==="Pago"?"event-paid":d.payment_status==="Pendente"?"event-pending":"event-canceled";d.type==="Recorrente"&&v!==d.due_date&&(L="event-pending");const $=document.createElement("div");$.className=`event-pill event-${d.type.toLowerCase()} ${L}`,$.title=d.company_name,$.innerText=d.company_name,$.onclick=x=>{this.openDedicatedPage(d.id,v)},y.appendChild($)}}}})},renderCalendarDay(t,e,n,o){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];c.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${a[n]} de ${e}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const i=new Date(e,n,o),r=new Date;r.setHours(0,0,0,0),i.setHours(0,0,0,0);let l=0;this.getLatestRecorrenteAccounts(t).forEach(d=>{let p=!0;if(d.status==="Off"&&i.getTime()>=r.getTime()&&(p=!1),!!p&&this.isEventOnDate(d,e,n,o)){l++;const m=`${e}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let f=d.payment_status==="Pago"?"#4ade80":d.payment_status==="Pendente"?"#facc15":"#ef4444";d.type==="Recorrente"&&m!==d.due_date&&(f="#facc15"),s.innerHTML+=`
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
                `}}),l===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(t,e){c.setText("calendar-date-display",`Ano de ${e}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],a=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const i=new Date(e,s,1);let r=0,l=0,u=0;this.getLatestRecorrenteAccounts(t).forEach(m=>{let f=!0;if(m.status==="Off"&&i.getTime()>=a.getTime()&&(f=!1),!f)return;const g=new Date(e,s+1,0).getDate();for(let y=1;y<=g;y++)this.isEventOnDate(m,e,s,y)&&(r++,m.type==="Recorrente"?l++:u++)});const p=r>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${p}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${r}</strong></p>
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${l}</p>`:""}
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${u}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(t){B.setMonth(t),c.setValue("filter-month",t),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(t=null){document.getElementById("account-form").reset();const e=document.getElementById("account-type");if(e.onchange=()=>{e.value==="Recorrente"?c.show("account-frequency-group"):c.hide("account-frequency-group")},t){c.setText("account-modal-title","Editar Conta");const n=G.find(o=>o.id===t);n&&(c.setValue("account-id",n.id),c.setValue("account-company",n.company_name),c.setValue("account-type",n.type),c.setValue("account-category",n.category||"Outros"),c.setValue("account-frequency",n.frequency||"1 mes"),c.setValue("account-value",parseFloat(n.value||0).toFixed(2)),c.setValue("account-status",n.status),c.setValue("account-payment-status",n.payment_status||"Pendente"),c.setValue("account-due-date",n.due_date||""),c.setValue("account-description",n.description||""),c.setValue("account-observation",n.observation||""),e.onchange())}else c.setText("account-modal-title","Nova Conta"),c.setValue("account-id",""),e.onchange();c.show("account-modal-form")},openDedicatedPage(t,e=null){const n=G.find(m=>m.id===t);if(!n)return;let o=G.filter(m=>m.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((m,f)=>new Date(f.due_date||0)-new Date(m.due_date||0)),c.hide("accounts-section"),c.show("dedicated-account-page"),c.setText("ded-acc-company",n.company_name);let a=0,s=0,i=0;const r=new Date;r.setHours(0,0,0,0),this.currentCompanyHistory.forEach(m=>{const f=parseFloat(m.value||0);if(m.payment_status==="Pago")a+=f,i++;else if(m.payment_status==="Pendente"&&m.due_date){const[g,y,v]=m.due_date.split("-"),L=new Date(parseInt(g,10),parseInt(y,10)-1,parseInt(v,10));L.setHours(0,0,0,0),L.getTime()<r.getTime()&&(s+=f)}});const l=a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),u=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});c.setText("ded-acc-total-paid","R$ "+l),c.setText("ded-acc-total-pending","R$ "+u),c.setText("ded-acc-total-count",i.toString());const d=document.getElementById("ded-acc-status-badge");n.status==="On"?d.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':d.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,e);const p=document.getElementById("btn-ded-add-history");p&&(p.onclick=()=>{this.openAccountModal(),setTimeout(()=>{c.setValue("account-company",n.company_name),c.setValue("account-type",n.type),c.setValue("account-category",n.category)},100)},q.isAdmin()||(p.style.display="none"))},injectCurrentMonthProjections(t){const e=new Date,n=e.getFullYear(),o=e.getMonth(),a=new Date(n,o+1,0).getDate();let s=null;if(t.forEach(l=>{l.type==="Recorrente"&&(s?new Date(l.due_date||0)>new Date(s.due_date||0)&&(s=l):s=l)}),!s)return t;const i=[...t],r=new Set(t.map(l=>l.due_date));for(let l=1;l<=a;l++)if(this.isEventOnDate(s,n,o,l)){const u=`${n}-${String(o+1).padStart(2,"0")}-${String(l).padStart(2,"0")}`;r.has(u)||i.push({...s,is_projection:!0,due_date:u,payment_status:"Pendente",unique_key:s.id+"_"+u})}return i.forEach(l=>{l.unique_key||(l.unique_key=l.id.toString())}),i},renderDedicatedHistoryList(){const t=document.getElementById("ded-acc-history-list");if(t){if(t.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){t.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(e=>{let n="Sem Data";if(e.due_date){const i=e.due_date.split("-");i.length===3&&(n=`${i[2]}/${i[1]}/${i[0]}`)}const o=parseFloat(e.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let a="#eab308";e.payment_status==="Pago"?a="#4ade80":e.payment_status==="Cancelado"&&(a="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==e.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===e.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(e.id,e.is_projection?e.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${a}22; color: ${a}; font-size: 0.75rem;">${e.payment_status||"Pendente"}</span>
                </div>
            `,t.appendChild(s)})}},selectHistoryItem(t,e=null){this.currentSelectedHistoryKey=e?t+"_"+e:t.toString(),this.renderDedicatedHistoryList();let n=null;if(e&&(n=this.currentCompanyHistory.find(r=>r.id===t&&r.due_date===e&&r.is_projection)),n||(n=this.currentCompanyHistory.find(r=>r.id===t&&!r.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){c.show("ded-acc-details-empty"),c.hide("ded-acc-details-content");return}c.hide("ded-acc-details-empty"),c.show("ded-acc-details-content");let o="DD/MM/YYYY";const a=e||n.due_date;if(a){const r=a.split("-");r.length===3&&(o=`${r[2]}/${r[1]}/${r[0]}`)}c.setText("ded-acc-det-date",o),c.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),c.setValue("ded-acc-det-date-input",a||""),c.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),c.setValue("ded-acc-det-account-status-input",n.status||"On"),c.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(c.show("ded-acc-det-freq-group"),c.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):c.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const r={...n,value:c.getValue("ded-acc-det-val-input"),due_date:c.getValue("ded-acc-det-date-input"),payment_status:c.getValue("ded-acc-det-status-input"),status:c.getValue("ded-acc-det-account-status-input"),observation:c.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?c.getValue("ded-acc-det-freq-input"):"1 mes"};try{await I.put(`/accounts/${n.id}`,r),alert("Fatura atualizada com sucesso!"),await this.fetch(),this.currentCompanyHistory=G.filter(l=>l.company_name===n.company_name).sort((l,u)=>new Date(u.due_date||0)-new Date(l.due_date||0)),this.openDedicatedPage(n.id)}catch{alert("Erro ao atualizar fatura.")}},q.isAdmin()||(s.style.display="none"));const i=document.getElementById("btn-ded-delete-account");i&&(i.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await I.delete(`/accounts/${n.id}`),await this.fetch();const r=G.filter(l=>l.company_name===n.company_name);r.length>0?this.openDedicatedPage(r[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},q.isAdmin()||(i.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(t){document.getElementById("ded-acc-file-input");const e=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),t.attachment_path){c.hide("ded-acc-upload-area"),c.show("ded-acc-preview-area");const n=t.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),a=t.attachment_path.split("/").pop()||"documento";c.setText("ded-acc-preview-name",a);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async r=>{r.preventDefault();const l=s.innerText;s.innerText="Carregando...";try{const u=await fetch(t.attachment_path);if(!u.ok)throw new Error("Doc não encontrado");const d=await u.blob(),p=window.URL.createObjectURL(d);window.open(p,"_blank")}catch(u){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",u)}finally{s.innerText=l}},n?(o.innerHTML="",o.style.backgroundImage=`url('${t.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const i=document.getElementById("btn-ded-remove-attachment");i.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await I.put(`/accounts/${t.id}`,{...t,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=G.filter(r=>r.company_name===t.company_name).sort((r,l)=>new Date(l.due_date||0)-new Date(r.due_date||0)),this.selectHistoryItem(t.id)}catch{alert("Erro ao remover anexo")}},q.isAdmin()||(i.style.display="none")}else{if(c.show("ded-acc-upload-area"),c.hide("ded-acc-preview-area"),q.isAdmin())e.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,e.style.cursor="pointer";else{e.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',e.style.cursor="default";return}e.onclick=s=>{const i=document.getElementById("ded-acc-file-input");i&&s.target!==i&&i.click()},e.addEventListener("dragover",s=>{s.preventDefault(),e.style.borderColor="var(--accent)",e.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{e.style.borderColor="rgba(255,255,255,0.2)",e.style.background="rgba(0,0,0,0.1)"};e.addEventListener("dragleave",()=>{n()});const o=async s=>{if(!s)return;e.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const i=new FormData;i.append("file",s);try{const r=await fetch("/api/upload",{method:"POST",body:i}),l=await r.json();r.ok?(await I.put(`/accounts/${t.id}`,{...t,attachment_path:l.path}),await this.fetch(),this.currentCompanyHistory=G.filter(u=>u.company_name===t.company_name).sort((u,d)=>new Date(d.due_date||0)-new Date(u.due_date||0)),this.selectHistoryItem(t.id)):(alert(l.error||"Erro no upload"),this.selectHistoryItem(t.id))}catch(r){alert("Falha na comunicação: "+r.message),console.error("Upload Error:",r),this.selectHistoryItem(t.id)}};e.addEventListener("drop",async s=>{if(s.preventDefault(),n(),s.dataTransfer.files.length>0){const i=s.dataTransfer.files[0];await o(i)}});const a=document.getElementById("ded-acc-file-input");a&&(a.onclick=s=>{s.stopPropagation()},a.onchange=async s=>{const i=s.target.files[0];await o(i)})}},async save(t){t.preventDefault();const e=c.getValue("account-id"),n={company_name:c.getValue("account-company"),type:c.getValue("account-type"),category:c.getValue("account-category"),value:c.getValue("account-value"),status:c.getValue("account-status"),payment_status:c.getValue("account-payment-status"),due_date:c.getValue("account-due-date"),description:c.getValue("account-description"),observation:c.getValue("account-observation"),frequency:c.getValue("account-type")==="Recorrente"?c.getValue("account-frequency"):"1 mes"};try{const o=e?`/accounts/${e}`:"/accounts";e?await I.put(o,n):await I.post(o,n),c.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(t){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await I.delete(`/accounts/${t}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(t){N=t,this.renderAccountsList(vt)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${N===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${N-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=e;l++)(l===1||l===e||l>=N-1&&l<=N+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===N?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${N===e?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${N+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(N-1)*Ie+1,r=Math.min(N*Ie,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let ce=[],Q={},oe=null,Qe=null,Ke=null,Xe=!1,Te=!1,Le=!1,U=[],Ge=[],st={},X={},ve,lt,Ue,Ye,$t,Je;const It={init(){ve=document.getElementById("timeline-event-form"),lt=document.getElementById("view-visualizacao"),Ue=document.getElementById("view-attention"),Ye=document.getElementById("view-anexo"),$t=document.getElementById("view-relatorio"),Je=document.getElementById("view-config"),window.timelineHandler=It,window.applyFilters=Ht,window.clearFilters=_t,window.toggleFilters=Pt,window.handleDelete=At,window.resetForm=ut,window.toggleAccordion=Lt,window.handleFormSubmit=wt,window.editEvent=dt,window.deleteTopic=qt,window.deleteSubtopic=Nt,window.handleTrackDragStart=jt,window.handleTrackDragOver=Gt,window.handleTrackDragEnd=Ut;const t=document.getElementById("timeline-topic-form");t&&(t.onsubmit=Ot);const e=document.getElementById("timeline-subtopic-form");e&&(e.onsubmit=zt);const n=document.getElementById("topico");n&&(n.onchange=u=>{ct(u.target.value)});const o=document.getElementById("em-ocorrencia");o&&(o.onchange=u=>{const d=document.getElementById("fim"),p=document.getElementById("inicio");if(u.target.checked){if(!p.value){const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),p.value=m.toISOString().slice(0,16)}d.required=!1}else{const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),d.value=m.toISOString().slice(0,16),d.required=!0}});const a=document.getElementById("auto-refresh-toggle");a&&(a.onchange=u=>{Tt(u.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(u=>{u.onclick=d=>{const p=d.currentTarget.getAttribute("data-timeline-tab");_e(p)}}),ve&&(ve.onsubmit=wt);const s=document.getElementById("rep-filter-start"),i=document.getElementById("rep-filter-end"),r=document.getElementById("rep-filter-topic"),l=document.getElementById("rep-filter-subtopic");s&&(s.onchange=()=>De()),i&&(i.onchange=()=>De()),r&&(r.onchange=u=>{Vt(u.target.value),De()}),l&&(l.onchange=()=>De()),window._timelineSectionChangeHandler&&window.removeEventListener("SectionChange",window._timelineSectionChangeHandler),window._timelineSectionChangeHandler=u=>{u.detail&&u.detail.section==="timeline"&&de().then(()=>{ee(),bt()})},window.addEventListener("SectionChange",window._timelineSectionChangeHandler),de().then(()=>{ee(),bt()})}};window._timelineFocusHandler&&window.removeEventListener("focus",window._timelineFocusHandler);window._timelineFocusHandler=()=>{lt&&ee()};window.addEventListener("focus",window._timelineFocusHandler);function ct(t,e=null){const n=document.getElementById("sub-topico");if(!n)return;const o=t?t.toLowerCase().trim():"";if(!o||!X[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',X[o].forEach(a=>{const s=document.createElement("option");s.value=a.toLowerCase(),s.textContent=a,e&&s.value===e.toLowerCase()&&(s.selected=!0),n.appendChild(s)}),e||(n.selectedIndex=1),n.classList.add("has-options")}async function de(){try{const t=await fetch("/api/timeline/config");if(!t.ok)throw new Error("Falha ao buscar configurações");const e=await t.json();U=e.topics||[],Ge=e.subtopics||[],st={},X={},U.forEach(o=>{st[o.id]=o.color,X[o.id]=[]}),Ge.forEach(o=>{const a=o.topic_id;X[a]&&X[a].push(o.name)}),Mt();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&Bt()}catch(t){console.error("Error loading config:",t)}}function Mt(){const t=document.getElementById("topico");if(t){const o=t.value;t.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',U.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,t.appendChild(s)}),t.value=o}const e=document.getElementById("rep-filter-topic");if(e){const o=e.value;e.innerHTML='<option value="Todos">Todos</option>',U.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,e.appendChild(s)}),o&&[...e.options].some(a=>a.value===o)?e.value=o:e.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',U.forEach(o=>{const a=document.createElement("option");a.value=o.id,a.textContent=o.name,n.appendChild(a)}))}function ee(){fetch("/api/timeline/events").then(t=>{if(!t.ok)throw new Error("Failed to fetch");return t.json()}).then(t=>{ce=t,mt(),Ue&&Ue.classList.contains("active")&&kt()}).catch(t=>{console.error("Error loading events:",t)})}function bt(){const t=document.getElementById("timeline-tab-anexo"),e=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())t&&t.classList.remove("role-hidden"),e&&e.classList.remove("role-hidden");else{t&&t.classList.add("role-hidden"),e&&e.classList.add("role-hidden");const o=Ye&&Ye.classList.contains("active"),a=Je&&Je.classList.contains("active");(o||a)&&_e("visualizacao")}}function _e(t){const e={visualizacao:{section:lt,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:Ue,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:Ye,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:$t,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:Je,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(e).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),e[t]&&(e[t].section&&e[t].section.classList.add("active"),e[t].button&&e[t].button.classList.add("active")),t==="visualizacao"?(ee(),ke(!0)):t==="attention"?(kt(),ke(!0)):t==="relatorio"?(De(),ke(!1)):(t==="config"&&Bt(),ke(!1))}function ke(t){const e=document.getElementById("floating-refresh-control");if(e)if(t){e.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!oe&&Tt(!0)}else e.classList.add("hidden"),oe&&(clearInterval(oe),oe=null)}function Tt(t){oe&&(clearInterval(oe),oe=null),t&&(ee(),oe=setInterval(ee,6e4))}function wt(t){if(t.preventDefault(),Xe){console.warn("[Timeline] O salvamento já está em andamento. Ignorando envio duplicado.");return}Xe=!0;const e=ve.querySelector('button[type="submit"]');e&&(e.textContent="Salvando...",e.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async a=>{const s=await a.text();if(!a.ok)throw new Error(`Server error (${a.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),ut(),_e("visualizacao")}).catch(a=>{console.error("Error saving event:",a),alert("Erro ao salvar evento: "+a.message)}).finally(()=>{e&&(e.textContent="Salvar Evento",e.disabled=!1),Xe=!1})}function dt(t){const e=ce.find(s=>s.id===t);if(!e)return;document.getElementById("event-id").value=e.id,document.getElementById("nome").value=e.nome;const n=Me(e.topico);document.getElementById("topico").value=n,ct(n,e.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=e.em_ocorrencia==1||e.em_ocorrencia==="true"||!e.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=e.inicio,document.getElementById("fim").value=e.fim||"",document.getElementById("descricao").value=e.descricao||"",document.getElementById("anotacao").value=e.anotacao||"",document.getElementById("cor").value=e.cor||"#000000",_e("anexo");const a=document.getElementById("btn-delete");a&&(a.style.display="block")}function ut(){ve&&ve.reset();const t=document.getElementById("event-id");t&&(t.value=""),ct("");const e=document.getElementById("fim");e&&(e.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function At(){const t=document.getElementById("event-id").value;t&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Failed to delete");return e.json()}).then(()=>{alert("Evento excluído!"),ut(),_e("visualizacao")}).catch(e=>{console.error("Error deleting:",e),alert("Erro ao excluir: "+e.message)})}function Ht(t){const e=document.getElementById(`filter-start-${t}`),n=document.getElementById(`filter-end-${t}`),o=document.getElementById(`filter-sub-topic-${t}`),a=e&&e.value?new Date(e.value).getTime():null,s=n&&n.value?new Date(n.value).getTime():null,i=o?o.value:"";Q[t]={start:a,end:s,subTopic:i},mt()}function _t(t){const e=document.getElementById(`filter-start-${t}`),n=document.getElementById(`filter-end-${t}`),o=document.getElementById(`filter-sub-topic-${t}`);e&&(e.value=""),n&&(n.value=""),o&&(o.value=""),Q[t]=null,mt()}function Pt(t){const e=document.getElementById(`filters-panel-${t}`),n=document.getElementById(`btn-toggle-${t}`);e&&n&&(e.classList.toggle("hidden"),n.classList.toggle("active"))}function Lt(t){const e=document.getElementById(t);e&&e.classList.toggle("active")}function mt(){const t=document.getElementById("timeline-tracks-container");if(!t)return;const e=Array.from(t.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId),n=U.map(a=>a.id);if(e.length!==n.length||!n.every(a=>e.includes(a))){t.innerHTML="";const a=window.auth&&window.auth.isAdmin(),s=a?'style="cursor: grab;"':"";U.forEach(i=>{const r=`
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
            `;t.insertAdjacentHTML("beforeend",r);const l=document.getElementById(`filter-sub-topic-${i.id}`);l&&X[i.id]&&X[i.id].forEach(u=>{const d=document.createElement("option");d.value=u.toLowerCase(),d.textContent=u,l.appendChild(d)})})}U.forEach(a=>{const s=document.getElementById(`track-${a.id}`),i=document.getElementById(`min-date-${a.id}`),r=document.getElementById(`max-date-${a.id}`);s&&(s.innerHTML=""),i&&(i.textContent=""),r&&(r.textContent="")}),ce.length!==0&&U.forEach(a=>{const s=a.id,i=ce.filter(v=>Me(v.topico)===s);let r=i;Q[s]&&Q[s].subTopic&&(r=i.filter(v=>(v.sub_topico?v.sub_topico.toLowerCase():"")===Q[s].subTopic.toLowerCase()));const l=Q[s]&&Q[s].start?Q[s].start:new Date("2026-01-01T00:00:00").getTime(),u=Q[s]&&Q[s].end?Q[s].end:Date.now();Rt(s,r,l,u);const d=l,p=u,m=p-d,f=document.getElementById(`min-date-${s}`),g=document.getElementById(`max-date-${s}`);f&&(f.textContent=new Date(d).toLocaleDateString()+" "+new Date(d).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),g&&(g.textContent=new Date(p).toLocaleDateString()+" "+new Date(p).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const y=document.getElementById(`track-${s}`);y&&r.forEach(v=>{const L=new Date(v.inicio).getTime(),$=v.fim?new Date(v.fim).getTime():Date.now();if($<d||L>p)return;const x=Math.max(L,d),M=Math.min($,p),T=(x-d)/m*100,w=(M-x)/m*100;if(w<=0)return;const b=document.createElement("div");b.className="timeline-bar",b.style.left=`${T}%`,b.style.width=`${w}%`,b.style.color=v.cor&&v.cor!=="#000000"?v.cor:st[s]||"#6b7280";const h=document.createElement("div");h.className="timeline-bar-visual",b.appendChild(h);const E=document.createElement("div");E.className="timeline-identifier-point";const D=new Date(v.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),A=v.fim?new Date(v.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",H=a.name,S=v.sub_topico?v.sub_topico.charAt(0).toUpperCase()+v.sub_topico.slice(1):"-";E.setAttribute("data-tooltip",`Tópico: ${H}
Eventos: ${S}
Início: ${D} - Fim: ${A}
Descrição: ${v.descricao||"-"}`),!v.fim&&E.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(E.style.cursor="pointer",E.onclick=ue=>{ue.stopPropagation(),dt(v.id)}):E.style.cursor="default",b.appendChild(E),y.appendChild(b)})})}function Me(t){return t?t.toLowerCase().trim():""}function Rt(t,e,n,o){const a=document.getElementById(`sla-${t}`);if(!a)return;const s=o-n;if(s<=0){a.textContent="N/A";return}const r=e.filter(m=>{const f=new Date(m.inicio).getTime();return(m.fim?new Date(m.fim).getTime():Date.now())>n&&f<o}).map(m=>({start:Math.max(new Date(m.inicio).getTime(),n),end:Math.min(m.fim?new Date(m.fim).getTime():Date.now(),o)}));r.sort((m,f)=>m.start-f.start);const l=[];if(r.length>0){let m=r[0];for(let f=1;f<r.length;f++){const g=r[f];g.start<m.end?m.end=Math.max(m.end,g.end):(l.push(m),m=g)}l.push(m)}let u=0;l.forEach(m=>{u+=m.end-m.start});const d=(s-u)/s*100;let p="#10b981";d<50?p="#ef4444":d<90&&(p="#f97316"),a.style.color=p,a.textContent=d.toFixed(4)+"%"}function kt(){const t=document.getElementById("attention-topics-container");if(!t)return;t.innerHTML="";const e=ce.filter(n=>!n.fim);U.forEach(n=>{const o=n.id,a=e.filter(y=>Me(y.topico)===o),s=document.createElement("div");s.className=a.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const i=document.createElement("div");i.className="accordion-header",i.onclick=()=>Lt(`attn-acc-${o}`);const r=document.createElement("div");r.className="accordion-title-group";const l=document.createElement("div");l.className="topic-indicator",l.style.backgroundColor=n.color;const u=document.createElement("h3");u.textContent=n.name;const d=document.createElement("span");d.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",d.textContent=`${a.length}`,r.appendChild(l),r.appendChild(u),r.appendChild(d);const p=document.createElement("span");p.className="accordion-chevron",p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',i.appendChild(r),i.appendChild(p);const m=document.createElement("div");m.className="accordion-content";const f=document.createElement("div");f.className="accordion-body";const g=document.createElement("div");if(g.className="attention-carousel",a.length===0){const y=document.createElement("div");y.className="empty-state",y.textContent="Nenhum evento em andamento.",g.appendChild(y)}else a.forEach(y=>{const v=document.createElement("div");v.className="attention-card",v.style.borderLeftColor=y.cor&&y.cor!=="#000000"?y.cor:n.color;const L=document.createElement("h3");L.textContent=y.nome;const $=document.createElement("div");$.className="sub-topic",$.textContent=y.sub_topico||"-";const x=document.createElement("div");x.className="card-detail",x.innerHTML=`<strong>Início:</strong> ${new Date(y.inicio).toLocaleString()}`;const M=Date.now()-new Date(y.inicio).getTime(),T=document.createElement("div");T.className="card-duration",T.innerHTML=`<strong>Tempo:</strong> <span>${Ft(M)}</span>`;const w=document.createElement("div");w.className="card-description",w.textContent=y.descricao||"-",v.appendChild(L),v.appendChild($),v.appendChild(x),v.appendChild(T),v.appendChild(w),window.auth&&window.auth.isAdmin()?(v.style.cursor="pointer",v.onclick=()=>dt(y.id)):v.style.cursor="default",g.appendChild(v)});f.appendChild(g),m.appendChild(f),s.appendChild(i),s.appendChild(m),t.appendChild(s)})}function Ft(t){if(t<0)return"0s";const e=Math.floor(t/1e3),n=Math.floor(e/60),o=Math.floor(n/60),a=Math.floor(o/24),s=[];return a>0&&s.push(`${a}d`),(o%24>0||a>0)&&s.push(`${o%24}h`),(n%60>0||o>0)&&s.push(`${n%60}m`),s.push(`${e%60}s`),s.join(" ")}function Vt(t){const e=document.getElementById("rep-filter-subtopic");if(!e)return;e.innerHTML='<option value="Todos">Todos</option>';const n=t?t.toLowerCase().trim():"";n&&X[n]&&X[n].forEach(o=>{const a=document.createElement("option");a.value=o.toLowerCase(),a.textContent=o,e.appendChild(a)})}function De(){let t=ce;const e=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,a=document.getElementById("rep-filter-subtopic")?.value;if(e){const w=new Date(e+"T00:00:00").getTime();t=t.filter(b=>new Date(b.inicio).getTime()>=w)}if(n){const w=new Date(n+"T23:59:59").getTime();t=t.filter(b=>new Date(b.inicio).getTime()<=w)}o&&o!=="Todos"&&(t=t.filter(w=>Me(w.topico)===o.toLowerCase())),a&&a!=="Todos"&&(t=t.filter(w=>w.sub_topico&&w.sub_topico.toLowerCase()===a.toLowerCase()));const s=document.getElementById("rep-kpi-total"),i=document.getElementById("rep-kpi-active"),r=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=t.length);const l=t.filter(w=>w.em_ocorrencia==1||w.em_ocorrencia==="true"||!w.fim);i&&(i.textContent=l.length);const u=t.filter(w=>w.fim);let d="0h 0m";if(u.length>0){const b=u.reduce((A,H)=>A+(new Date(H.fim).getTime()-new Date(H.inicio).getTime()),0)/u.length,h=Math.floor(b/6e4),E=Math.floor(h/60),D=h%60;d=`${E}h ${D}m`}if(r&&(r.textContent=d),!window.Chart){console.warn("Chart.js is not loaded.");return}const p=U,m=e?new Date(e+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),f=n?new Date(n+"T23:59:59").getTime():Date.now(),g=p.map(w=>w.name),y=p.map(w=>{const b=w.id,h=ce.filter(R=>Me(R.topico)===b),E=f-m;if(E<=0)return 100;const A=h.filter(R=>{const K=new Date(R.inicio).getTime();return(R.fim?new Date(R.fim).getTime():Date.now())>m&&K<f}).map(R=>({start:Math.max(new Date(R.inicio).getTime(),m),end:Math.min(R.fim?new Date(R.fim).getTime():Date.now(),f)}));A.sort((R,K)=>R.start-K.start);const H=[];if(A.length>0){let R=A[0];for(let K=1;K<A.length;K++){const ae=A[K];ae.start<R.end?R.end=Math.max(R.end,ae.end):(H.push(R),R=ae)}H.push(R)}const Y=(R=>{let K=0;return R.forEach(ae=>{K+=ae.end-ae.start}),K})(H),ue=(E-Y)/E*100;return parseFloat(ue.toFixed(4))}),v=p.map(w=>w.color||"#6b7280"),L=document.getElementById("chart-rep-sla");L&&(Qe&&Qe.destroy(),Qe=new window.Chart(L,{type:"bar",data:{labels:g,datasets:[{label:"Disponibilidade %",data:y,backgroundColor:v,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...y)-5),max:100,ticks:{callback:w=>w+"%"}}}}}));const $={};t.forEach(w=>{const b=w.sub_topico?w.sub_topico.charAt(0).toUpperCase()+w.sub_topico.slice(1).toLowerCase():"Não especificado";$[b]=($[b]||0)+1});const x=Object.keys($),M=Object.values($),T=document.getElementById("chart-rep-qty");T&&(Ke&&Ke.destroy(),Ke=new window.Chart(T,{type:"doughnut",data:{labels:x.length>0?x:["Nenhum evento"],datasets:[{data:M.length>0?M:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function Ot(t){if(t.preventDefault(),Te)return;Te=!0;const e=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!e||!n||!o){Te=!1;return}const a={id:e.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!a.id){alert("Por favor, defina um ID para o tópico."),Te=!1;return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>(alert("Tópico salvo com sucesso!"),e.value="",n.value="",o.value="#3b82f6",de().then(()=>{ee()}))).catch(s=>{console.error(s),alert("Erro: "+s.message)}).finally(()=>{Te=!1})}function zt(t){if(t.preventDefault(),Le)return;Le=!0;const e=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!e||!n){Le=!1;return}const o={topic_id:e.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento."),Le=!1;return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(a=>{if(!a.ok)throw new Error("Erro ao adicionar evento");return a.json()}).then(()=>(alert("Evento adicionado!"),n.value="",de())).catch(a=>{console.error(a),alert("Erro: "+a.message)}).finally(()=>{Le=!1})}function qt(t){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Erro ao excluir tópico");return e.json()}).then(()=>{alert("Tópico excluído!"),de().then(()=>{ee()})}).catch(e=>{console.error(e),alert("Erro: "+e.message)})}function Nt(t){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Erro ao excluir evento");return e.json()}).then(()=>{alert("Evento excluído!"),de()}).catch(e=>{console.error(e),alert("Erro: "+e.message)})}function Bt(){const t=document.getElementById("config-topics-list");t&&(t.innerHTML="",U.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':U.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(o)}));const e=document.getElementById("config-subtopics-list");e&&(e.innerHTML="",Ge.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':Ge.forEach(n=>{const o=U.find(r=>r.id===n.topic_id),a=o?o.name:n.topic_id,s=o?o.color:"#6b7280",i=document.createElement("div");i.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",i.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${a}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(i)}))}function jt(t,e){t.currentTarget.classList.add("dragging"),t.dataTransfer.effectAllowed="move"}function Gt(t){t.preventDefault();const e=document.querySelector(".timeline-container.dragging");if(!e)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const a=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const i=s.getBoundingClientRect();return t.clientY<=i.top+i.height/2});a?n.insertBefore(e,a):n.appendChild(e)}function Ut(t){const e=document.querySelector(".timeline-container.dragging");e&&e.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(a=>{a.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId);Yt(o)}function Yt(t){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:t})}).then(e=>{if(!e.ok)throw new Error("Erro ao salvar nova ordenação");return e.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),de().then(()=>{ee()})}).catch(e=>{console.error(e),alert("Erro ao salvar ordenação: "+e.message)})}let ge=[],Ze=[],et=[],tt=[],_="extensions",F=1,fe=100,nt=[];const Be={setActiveTab(t){_=t,F=1;const e=document.getElementById("telephony-search");e&&(e.value="",t==="extensions"?e.placeholder="Pesquisar ramais por número, nome ou usuário...":t==="queues"?e.placeholder="Pesquisar filas por número ou nome...":t==="blf"?e.placeholder="Pesquisar BLF por nome...":t==="users"&&(e.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(s=>{s.id===`tab-telephony-${t}`?s.classList.add("active"):s.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(s=>{s.id===`telephony-view-${t==="users"?"users":t==="queues"?"queues":t}`?s.classList.remove("hidden"):s.classList.add("hidden")});const a=this.getActiveDataList();this.render(a)},getActiveDataList(){return _==="extensions"?ge:_==="queues"?Ze:_==="blf"?et:_==="users"?tt:[]},async fetch(){const t=this.getActiveTableBody();t&&(t.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(F=1,_==="extensions")ge=await I.get("/telephony/extensions"),this.render(ge);else if(_==="queues")Ze=await I.get("/telephony/queues"),this.render(Ze);else if(_==="blf"){if(ge.length===0)try{ge=await I.get("/telephony/extensions")}catch(e){console.warn("Could not pre-fetch extensions for BLF mapping:",e)}et=await I.get("/telephony/blfs"),this.render(et)}else _==="users"&&(tt=await I.get("/telephony/users"),this.render(tt))}catch(e){console.error(`Error fetching telephony ${_}:`,e),t&&(t.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${e.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return _==="extensions"?document.getElementById("telephony-table-body"):_==="queues"?document.getElementById("telephony-queues-table-body"):_==="blf"?document.getElementById("telephony-blf-table-body"):_==="users"?document.getElementById("telephony-users-table-body"):null},render(t){const e=this.getActiveTableBody();if(!e)return;nt=t;const n=t.length,o=Math.ceil(n/fe);F>o&&(F=Math.max(1,o)),F<1&&(F=1);const a=(F-1)*fe,s=t.slice(a,a+fe);if(s.length===0){const i=_==="extensions"?7:_==="queues"?6:_==="blf"?4:5;e.innerHTML=`
                <tr>
                    <td colspan="${i}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}_==="extensions"?this.renderExtensionsList(e,s):_==="queues"?this.renderQueuesList(e,s):_==="blf"?this.renderBlfsList(e,s):_==="users"&&this.renderUsersList(e,s),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(t,e){t.innerHTML=e.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.ddr||"-",i=n.Username||"-",r=n.Secret||"",l=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",u=n.observacao||"-",d=r.replace(/'/g,"\\'");return`
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
                    <td>${l}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${u}">${u}</td>
                </tr>
            `}).join("")},renderQueuesList(t,e){t.innerHTML=e.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.Estrategia||"-",i=n.TimeoutAgente?`${n.TimeoutAgente}s`:"-",r=n.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',l=n.membros?n.membros.length:0,u=n.membros&&n.membros.length>0?n.membros.map(d=>`
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
            `}).join("")},renderBlfsList(t,e){t.innerHTML=e.map(n=>{const o=n.id,a=n.Nome||"-",s=n.quantidade_extensoes||0,i=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",r=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(l=>{const u=ge.find(m=>m.id===l||m.extensao_id===l),d=u?u.exten:`ID ${l}`,p=u?u.nome:"Não encontrado";return`
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
            `}).join("")},renderUsersList(t,e){t.innerHTML=e.map(n=>{const o=n.username||"-",a=n.email||"-",s=n.Tipo||"-",i=n.is_active?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Ativo</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Inativo</span>';return`
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
            `}).join("")},toggleQueueRow(t){const e=document.getElementById(`queue-details-${t}`),n=document.getElementById(`queue-arrow-${t}`);e&&(e.classList.toggle("hidden"),n&&(e.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(t){const e=document.getElementById(`blf-details-${t}`),n=document.getElementById(`blf-arrow-${t}`);e&&(e.classList.toggle("hidden"),n&&(e.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(t){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(t){F=1;const n=this.getActiveDataList().filter(o=>_==="extensions"?(o.exten||"").toLowerCase().includes(t)||(o.nome||"").toLowerCase().includes(t)||(o.Username||"").toLowerCase().includes(t)||(o.ddr||"").toLowerCase().includes(t)||(o.observacao||"").toLowerCase().includes(t):_==="queues"?(o.exten||"").toLowerCase().includes(t)||(o.nome||"").toLowerCase().includes(t)||(o.Estrategia||"").toLowerCase().includes(t):_==="blf"?(o.Nome||"").toLowerCase().includes(t):_==="users"?(o.username||"").toLowerCase().includes(t)||(o.email||"").toLowerCase().includes(t)||(o.Tipo||"").toLowerCase().includes(t):!1);this.render(n)},changePage(t){F=t,this.render(nt)},setPageSize(t){fe=parseInt(t,10),F=1,this.render(nt)},toggleSecret(t,e){const n=document.getElementById(`secret-txt-${t}`),o=document.getElementById(`secret-icon-${t}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=e,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${F===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${F-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=e;l++)(l===1||l===e||l>=F-1&&l<=F+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===F?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${F===e?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${F+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(F-1)*fe+1,r=Math.min(F*fe,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}},Ce=30;let Se="",ot="all",Fe="",Ve="",W=1,he=0,J="alerts",ye="switches",C=null,at=[],xt=[],Et=[],Oe=null,ze=null,qe=null,Ne=!1;const pt={init(){console.log("📊 [MONITORING] Initializing monitoringHandler...");const t=document.getElementById("tab-monitoring-alerts");t&&t.addEventListener("click",()=>this.setActiveTab("alerts"));const e=document.getElementById("tab-monitoring-events");e&&e.addEventListener("click",()=>this.setActiveTab("events"));const n=document.getElementById("tab-monitoring-apis");n&&n.addEventListener("click",()=>this.setActiveTab("apis"));const o=document.getElementById("tab-monitoring-gnew");o&&o.addEventListener("click",()=>this.setActiveTab("gnew"));const a=document.getElementById("tab-monitoring-infra");a&&a.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Infraestrutura tab"),this.setActiveTab("infra")});const s=document.getElementById("tab-infra-switches");s&&s.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Switches subtab"),this.setInfraTab("switches")});const i=document.getElementById("tab-infra-routers");i&&i.addEventListener("click",()=>{console.log("📊 [MONITORING] Clicked on Routers subtab"),this.setInfraTab("routers")});const r=document.getElementById("btn-refresh-switches-status");r&&r.addEventListener("click",()=>this.fetchAndRenderSwitchesStatus(!0));const l=document.getElementById("btn-refresh-routers-status");l&&l.addEventListener("click",()=>this.fetchAndRenderRoutersStatus(!0));const u=document.getElementById("monitoring-events-search-input");u&&u.addEventListener("input",h=>{Se=h.target.value.toLowerCase(),W=1,this.fetchAndRenderEventHistory()});const d=document.getElementById("monitoring-search-input");d&&d.addEventListener("input",()=>{this.renderGnewServicesStatus()});const p=document.getElementById("monitoring-events-severity-filter");p&&p.addEventListener("change",h=>{ot=h.target.value,W=1,this.fetchAndRenderEventHistory()});const m=document.getElementById("monitoring-events-date-start"),f=document.getElementById("monitoring-events-date-end");m&&m.addEventListener("change",h=>{Fe=h.target.value,W=1,this.fetchAndRenderEventHistory()}),f&&f.addEventListener("change",h=>{Ve=h.target.value,W=1,this.fetchAndRenderEventHistory()});const g=document.getElementById("btn-clear-event-date-filter");g&&g.addEventListener("click",()=>{Fe="",Ve="",W=1,m&&(m.value=""),f&&(f.value=""),this.fetchAndRenderEventHistory()});const y=document.getElementById("btn-clear-event-history");y&&y.addEventListener("click",()=>this.clearEventHistory());const v=document.getElementById("btn-refresh-monitoring");v&&v.addEventListener("click",()=>this.fetchDiagnostics());const L=document.getElementById("gnew-disk-accordion-header");L&&L.addEventListener("click",()=>{const h=document.getElementById("gnew-disk-accordion-content"),E=document.getElementById("gnew-disk-chevron");h&&E&&(h.style.maxHeight==="0px"?(h.style.maxHeight="1000px",E.style.transform="rotate(0deg)"):(h.style.maxHeight="0px",E.style.transform="rotate(-90deg)"))});const $=document.getElementById("btn-refresh-gnew-disk");$&&$.addEventListener("click",h=>{h.stopPropagation(),this.fetchDiagnostics()});const x=document.getElementById("btn-refresh-gnew-services");x&&x.addEventListener("click",async()=>{const h=x,E=h.querySelector("svg");if(!h.disabled){h.disabled=!0,h.style.opacity="0.6",h.style.cursor="not-allowed",E&&(E.style.animation="spin 0.8s linear infinite");try{await this.fetchDiagnostics()}finally{h.disabled=!1,h.style.opacity="",h.style.cursor="pointer",E&&(E.style.animation="")}}});const M=document.getElementById("btn-refresh-apis-status");M&&M.addEventListener("click",()=>this.fetchAndRenderApisStatus());const T=document.getElementById("monitoring-auto-refresh");T&&(T.addEventListener("change",h=>{h.target.checked?this._startAutoRefresh():this._stopAutoRefresh()}),T.checked&&this._startAutoRefresh());const w=document.getElementById("switches-auto-refresh");w&&(w.addEventListener("change",h=>{h.target.checked?this._startSwitchesAutoRefresh():this._stopSwitchesAutoRefresh()}),w.checked&&this._startSwitchesAutoRefresh());const b=document.getElementById("routers-auto-refresh");b&&(b.addEventListener("change",h=>{h.target.checked?this._startRoutersAutoRefresh():this._stopRoutersAutoRefresh()}),b.checked&&this._startRoutersAutoRefresh()),window.monitoringHandler=this},_startAutoRefresh(){this._stopAutoRefresh(),Oe=setInterval(()=>{(J==="alerts"||J==="gnew")&&this.fetchDiagnostics()},3e4)},_stopAutoRefresh(){Oe&&(clearInterval(Oe),Oe=null)},_startSwitchesAutoRefresh(){this._stopSwitchesAutoRefresh(),ze=setInterval(()=>{J==="infra"&&ye==="switches"&&this.fetchAndRenderSwitchesStatus(!1,!0)},6e4)},_stopSwitchesAutoRefresh(){ze&&(clearInterval(ze),ze=null)},_startRoutersAutoRefresh(){this._stopRoutersAutoRefresh(),qe=setInterval(()=>{J==="infra"&&ye==="routers"&&this.fetchAndRenderRoutersStatus(!1,!0)},6e4)},_stopRoutersAutoRefresh(){qe&&(clearInterval(qe),qe=null)},fetch(){this.setActiveTab("alerts"),this.fetchDiagnostics()},setActiveTab(t){J=t;const e=document.getElementById("tab-monitoring-alerts"),n=document.getElementById("tab-monitoring-events"),o=document.getElementById("tab-monitoring-apis"),a=document.getElementById("tab-monitoring-gnew"),s=document.getElementById("tab-monitoring-infra");e&&e.classList.toggle("active",t==="alerts"),n&&n.classList.toggle("active",t==="events"),o&&o.classList.toggle("active",t==="apis"),a&&a.classList.toggle("active",t==="gnew"),s&&s.classList.toggle("active",t==="infra");const i=document.getElementById("monitoring-tab-content-alerts"),r=document.getElementById("monitoring-tab-content-events"),l=document.getElementById("monitoring-tab-content-apis"),u=document.getElementById("monitoring-tab-content-gnew"),d=document.getElementById("monitoring-tab-content-infra");i&&(i.classList.toggle("hidden",t!=="alerts"),i.classList.toggle("active",t==="alerts")),r&&(r.classList.toggle("hidden",t!=="events"),r.classList.toggle("active",t==="events")),l&&(l.classList.toggle("hidden",t!=="apis"),l.classList.toggle("active",t==="apis")),u&&(u.classList.toggle("hidden",t!=="gnew"),u.classList.toggle("active",t==="gnew")),d&&(d.classList.toggle("hidden",t!=="infra"),d.classList.toggle("active",t==="infra")),t==="gnew"?this.fetchDiagnostics():t==="events"?(W=1,this.fetchAndRenderEventHistory()):t==="apis"?this.fetchAndRenderApisStatus():t==="infra"?this.setInfraTab(ye):this.renderGnewServicesStatus()},setInfraTab(t){console.log("📊 [MONITORING] setInfraTab called with:",t),ye=t;const e=document.getElementById("tab-infra-switches"),n=document.getElementById("tab-infra-routers");e&&e.classList.toggle("active",t==="switches"),n&&n.classList.toggle("active",t==="routers");const o=document.getElementById("infra-tab-content-switches"),a=document.getElementById("infra-tab-content-routers");o&&(o.classList.toggle("hidden",t!=="switches"),o.classList.toggle("active",t==="switches")),a&&(a.classList.toggle("hidden",t!=="routers"),a.classList.toggle("active",t==="routers")),t==="switches"?this.fetchAndRenderSwitchesStatus():t==="routers"&&this.fetchAndRenderRoutersStatus()},render(){J==="alerts"?this.renderGnewServicesStatus():J==="events"?this.fetchAndRenderEventHistory():J==="apis"?this.fetchAndRenderApisStatus():J==="infra"&&(ye==="switches"?this.fetchAndRenderSwitchesStatus():this.fetchAndRenderRoutersStatus())},renderGnewServicesStatus(){const t=document.getElementById("monitoring-alerts-grid");if(!t)return;t.style.display="flex",t.style.flexDirection="column",t.style.gap="0";const e=C&&C.servicos&&Array.isArray(C.servicos.servicos)?C.servicos.servicos:[],n=at||[],o=xt||[],a=Et||[];if(e.length===0&&n.length===0&&o.length===0&&a.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">Nenhum dado de monitoramento disponível.</p>
                    <p style="font-size: 0.85rem;">Aguardando carga dos serviços do PABX, das APIs integradas ou da infraestrutura...</p>
                </div>
            `;return}const s=e.length+n.length+o.length+a.length,i=e.filter(b=>b.status!=="active"&&b.status_label!=="ativo").length,r=n.filter(b=>!b.online||b.status==="warning").length,l=o.filter(b=>!b.online).length,u=a.filter(b=>!b.online).length,d=i+r+l+u,p=s-d,m=document.getElementById("monitor-kpi-total"),f=document.getElementById("monitor-kpi-warning"),g=document.getElementById("monitor-kpi-info");m&&(m.textContent=s),f&&(f.textContent=d),g&&(g.textContent=p);const y=document.getElementById("monitoring-search-input"),v=y?y.value.toLowerCase().trim():"";let L=e,$=n,x=o,M=a;v&&(L=e.filter(b=>b.nome.toLowerCase().includes(v)),$=n.filter(b=>b.name.toLowerCase().includes(v)||b.description.toLowerCase().includes(v)),x=o.filter(b=>b.name.toLowerCase().includes(v)||b.ip.toLowerCase().includes(v)),M=a.filter(b=>b.name.toLowerCase().includes(v)||b.ip.toLowerCase().includes(v)));let T=`
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Serviço / API / Infraestrutura</span>
                    <span class="monitor-list-col-status">Status</span>
                </div>
        `,w=0;L.forEach(b=>{const h=b.status==="active"||b.status_label==="ativo",E=h?"#10b981":"#ef4444",D=h?"Online":b.status_label||b.status||"Offline",A=h?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",H=h?"#6ee7b7":"#fca5a5",S=h?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)",Y=w%2===0?"transparent":"rgba(255,255,255,0.015)";w++,T+=`
                <div class="monitor-list-row" style="background: ${Y};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${E};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem;">[Serviço PABX] ${b.nome}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${A}; color:${H}; border-color:${S};">${D}</span>
                    </div>
                </div>`}),$.forEach(b=>{let h="#10b981",E="Online",D="rgba(16,185,129,0.12)",A="#6ee7b7",H="rgba(16,185,129,0.3)";b.status==="warning"?(h="#f59e0b",E="Alerta",D="rgba(245,158,11,0.12)",A="#fde047",H="rgba(245,158,11,0.3)"):(b.status==="offline"||!b.online)&&(h="#ef4444",E="Offline",D="rgba(239,68,68,0.12)",A="#fca5a5",H="rgba(239,68,68,0.3)");const S=w%2===0?"transparent":"rgba(255,255,255,0.015)";w++,T+=`
                <div class="monitor-list-row" style="background: ${S};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${h};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:var(--accent);">[API] ${b.name}</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${D}; color:${A}; border-color:${H};">${E}</span>
                    </div>
                </div>`}),x.forEach(b=>{let h="#10b981",E="Online",D="rgba(16,185,129,0.12)",A="#6ee7b7",H="rgba(16,185,129,0.3)";b.online===null?(h="#94a3b8",E="Aguardando...",D="rgba(255, 255, 255, 0.05)",A="var(--text-muted)",H="rgba(255, 255, 255, 0.1)"):b.online||(h="#ef4444",E="Offline",D="rgba(239,68,68,0.12)",A="#fca5a5",H="rgba(239,68,68,0.3)");const S=w%2===0?"transparent":"rgba(255,255,255,0.015)";w++,T+=`
                <div class="monitor-list-row" style="background: ${S};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${h};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#38bdf8;">[Switch] ${b.name} (${b.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${D}; color:${A}; border-color:${H};">${E}</span>
                    </div>
                </div>`}),M.forEach(b=>{let h="#10b981",E="Online",D="rgba(16,185,129,0.12)",A="#6ee7b7",H="rgba(16,185,129,0.3)";b.online===null?(h="#94a3b8",E="Aguardando...",D="rgba(255, 255, 255, 0.05)",A="var(--text-muted)",H="rgba(255, 255, 255, 0.1)"):b.online||(h="#ef4444",E="Offline",D="rgba(239,68,68,0.12)",A="#fca5a5",H="rgba(239,68,68,0.3)");const S=w%2===0?"transparent":"rgba(255,255,255,0.015)";w++,T+=`
                <div class="monitor-list-row" style="background: ${S};">
                    <div class="monitor-list-col-name">
                        <span class="monitor-dot" style="background: ${h};"></span>
                        <span class="monitor-svc-name" style="font-size:0.88rem; font-weight:600; color:#f43f5e;">[Roteador] ${b.name} (${b.ip})</span>
                    </div>
                    <div class="monitor-list-col-status">
                        <span class="monitor-badge" style="background:${D}; color:${A}; border-color:${H};">${E}</span>
                    </div>
                </div>`}),T+="</div>",t.innerHTML=T},async fetchAndRenderEventHistory(){const t=document.getElementById("monitoring-events-grid");if(t){t.innerHTML=`
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div class="event-history-loading">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite; margin-bottom: 0.75rem; opacity: 0.5;">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <p style="font-size: 0.9rem;">Carregando histórico...</p>
                </div>
            </div>`;try{let e=await I.get("/monitoring/events?limit=1000");if(Se&&(e=e.filter(i=>(i.title||"").toLowerCase().includes(Se)||(i.description||"").toLowerCase().includes(Se)||(i.source||"").toLowerCase().includes(Se))),ot!=="all"&&(e=e.filter(i=>i.severity===ot)),Fe){const i=new Date(Fe+"T00:00:00").getTime();e=e.filter(r=>r.created_at?new Date(r.created_at).getTime()>=i:!1)}if(Ve){const i=new Date(Ve+"T23:59:59").getTime();e=e.filter(r=>r.created_at?new Date(r.created_at).getTime()<=i:!1)}he=e.length;const n=Math.max(1,Math.ceil(he/Ce));W>n&&(W=n);const o=document.getElementById("event-history-count");o&&(o.textContent=he>0?he:"",o.style.display=he>0?"inline-flex":"none");const a=(W-1)*Ce,s=e.slice(a,a+Ce);this.renderEvents(s),this.renderPagination(he,n)}catch(e){console.error("Erro ao buscar histórico de eventos:",e),t.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p style="font-size: 0.9rem; color: #fca5a5;">Erro ao carregar o histórico de eventos.</p>
                    <p style="font-size: 0.8rem; margin-top: 4px;">${e.message}</p>
                </div>`}}},renderPagination(t,e){const n=document.getElementById("event-history-pagination");if(!n)return;if(e<=1){n.innerHTML="";return}const o=W,a=(o-1)*Ce+1,s=Math.min(o*Ce,t),i=[],r=2;let l=Math.max(1,o-r),u=Math.min(e,o+r);l>1&&(i.push('<button class="eh-page-btn" data-page="1">1</button>'),l>2&&i.push('<span class="eh-page-ellipsis">…</span>'));for(let d=l;d<=u;d++)i.push(`<button class="eh-page-btn${d===o?" active":""}" data-page="${d}">${d}</button>`);u<e&&(u<e-1&&i.push('<span class="eh-page-ellipsis">…</span>'),i.push(`<button class="eh-page-btn" data-page="${e}">${e}</button>`)),n.innerHTML=`
            <div class="eh-pagination">
                <span class="eh-page-info">Exibindo <strong>${a}–${s}</strong> de <strong>${t}</strong> eventos</span>
                <div class="eh-page-controls">
                    <button class="eh-page-btn eh-page-nav" data-page="${o-1}" ${o<=1?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    ${i.join("")}
                    <button class="eh-page-btn eh-page-nav" data-page="${o+1}" ${o>=e?"disabled":""}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>`,n.querySelectorAll(".eh-page-btn[data-page]").forEach(d=>{d.addEventListener("click",()=>{const p=parseInt(d.dataset.page,10);if(!isNaN(p)&&p>=1&&p<=e&&p!==W){W=p,this.fetchAndRenderEventHistory();const m=document.getElementById("monitoring-events-grid");m&&m.scrollIntoView({behavior:"smooth",block:"start"})}})})},renderEvents(t){const e=document.getElementById("monitoring-events-grid");if(!e)return;e.style.display="flex",e.style.flexDirection="column",e.style.gap="0";const n=t||[];if(n.length===0){e.innerHTML=`
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
                </div>`;return}const o={};n.forEach(s=>{const i=s.created_at?new Date(s.created_at).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"Data desconhecida";o[i]||(o[i]=[]),o[i].push(s)});const a=Object.entries(o).map(([s,i])=>{const r=i.map(l=>{const u=l.severity||"info";let d="Info",p="#3b82f6",m="rgba(59,130,246,0.12)",f="#93c5fd",g="rgba(59,130,246,0.3)",y="#3b82f6";u==="critical"?(d="Crítico",p="#ef4444",y="#ef4444",m="rgba(239,68,68,0.12)",f="#fca5a5",g="rgba(239,68,68,0.3)"):u==="warning"?(d="Alerta",p="#f59e0b",y="#f59e0b",m="rgba(245,158,11,0.12)",f="#fde047",g="rgba(245,158,11,0.3)"):u==="success"&&(d="Ok",p="#10b981",y="#10b981",m="rgba(16,185,129,0.12)",f="#6ee7b7",g="rgba(16,185,129,0.3)");const v=l.created_at?new Date(l.created_at):null,L=v?v.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"-",$=v?this._relativeTime(v):"",x=l.value_pct!=null?`${l.value_pct}%`:null;return`
                    <div class="event-history-row" style="border-left: 3px solid ${y};">
                        <div class="event-history-row-left">
                            <span class="monitor-dot" style="background: ${p}; flex-shrink: 0;"></span>
                            <div class="event-history-row-info">
                                <span class="event-history-row-title">${l.title}</span>
                                ${l.description?`<span class="event-history-row-desc">${l.description}</span>`:""}
                            </div>
                        </div>
                        <div class="event-history-row-meta">
                            ${x?`<span class="event-history-row-value">${x}</span>`:""}
                            <span class="monitor-badge" style="background:${m}; color:${f}; border-color:${g}; flex-shrink: 0;">${d}</span>
                            <div class="event-history-row-time">
                                <span class="event-time-clock">${L}</span>
                                ${$?`<span class="event-time-rel">${$}</span>`:""}
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
                </div>`}).join("");e.innerHTML=`<div class="event-history-list">${a}</div>`},_relativeTime(t){const n=new Date-t,o=Math.floor(n/6e4),a=Math.floor(o/60),s=Math.floor(a/24);return n<6e4?"agora mesmo":o<60?`${o}min atrás`:a<24?`${a}h atrás`:s===1?"ontem":`${s} dias atrás`},updateKPIs(t,e){const n=t-e,o=document.getElementById("monitor-kpi-total"),a=document.getElementById("monitor-kpi-warning"),s=document.getElementById("monitor-kpi-info");o&&(o.textContent=t),a&&(a.textContent=e),s&&(s.textContent=n)},async fetchDiagnostics(){try{const[t,e,n,o]=await Promise.all([I.get("/monitoring/diagnostico?t="+Date.now()),I.get("/monitoring/apis-status?t="+Date.now()),I.get("/monitoring/switches?t="+Date.now()),I.get("/monitoring/routers?t="+Date.now())]),a=t&&t.status==="online";if(this.updateGnewApiStatus(a,a?"Gnew Online":"Gnew Offline (Contingência)",t?t.message:""),t&&t.data)C=t.data,this.renderGnewDiagnostics();else throw new Error("Dados inválidos na resposta da API.");e&&e.success&&Array.isArray(e.apis)&&(at=e.apis),n&&n.success&&Array.isArray(n.switches)&&(xt=n.switches),o&&o.success&&Array.isArray(o.routers)&&(Et=o.routers),J==="alerts"&&this.renderGnewServicesStatus()}catch(t){console.error("Erro ao buscar dados de monitoramento:",t),this.updateGnewApiStatus(!1,"Erro de Conexão",t.message)}},updateGnewApiStatus(t,e,n){const o=document.getElementById("gnew-api-status-badge"),a=document.getElementById("gnew-api-message");if(o){o.className=`api-status-badge ${t?"online":"offline"}`,o.style.background=t?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",o.style.color=t?"#6ee7b7":"#fca5a5",o.style.borderColor=t?"#10b981":"#ef4444";const s=o.querySelector(".status-text");s&&(s.textContent=e)}a&&n&&(a.textContent=n)},parseMemoryOutput(t){try{const n=t.split(`
`).find(o=>o.trim().startsWith("Mem:"));if(n){const o=n.trim().split(/\s+/);if(o.length>=3){const a=o[1],s=o[2],i=u=>{const d=parseFloat(u);return u.toLowerCase().includes("g")?d*1024:u.toLowerCase().includes("m")?d:u.toLowerCase().includes("k")?d/1024:d},r=i(a),l=i(s);if(!isNaN(r)&&!isNaN(l)&&r>0)return{percentage:Math.round(l/r*100),detail:`${s} em uso de ${a} total`}}}}catch(e){console.warn("Erro ao fazer parse da memória:",e)}return{percentage:0,detail:"Erro no parse"}},parseDiskOutput(t){try{const n=t.split(`
`).find(o=>o.trim().endsWith(" /"));if(n){const o=n.trim().split(/\s+/);if(o.length>=5){const a=o[1],s=o[2],i=o[4].replace("%",""),r=parseInt(i,10);if(!isNaN(r))return{percentage:r,detail:`${s} em uso de ${a} (Montagem em /)`}}}}catch(e){console.warn("Erro ao fazer parse do disco:",e)}return{percentage:0,detail:"Erro no parse"}},renderGnewDiagnostics(){if(!C)return;if(C.memoria){let n={percentage:0,detail:"Dados de memória indisponíveis"};if(C.memoria.output)n=this.parseMemoryOutput(C.memoria.output);else if(typeof C.memoria.percent<"u"){const i=(C.memoria.total_mb/1024).toFixed(1),r=(C.memoria.used_mb/1024).toFixed(1);n={percentage:Math.round(C.memoria.percent),detail:`${r}GB em uso de ${i}GB total`}}const o=document.getElementById("gnew-kpi-mem-text"),a=document.getElementById("gnew-kpi-mem-bar"),s=document.getElementById("gnew-kpi-mem-detail");o&&(o.textContent=`${n.percentage}%`),a&&(a.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}if(C.disco){let n={percentage:0,detail:"Dados de disco indisponíveis"};if(C.disco.output)n=this.parseDiskOutput(C.disco.output);else if(Array.isArray(C.disco)){const i=C.disco.find(r=>r.mountpoint==="/");i&&(n={percentage:Math.round(i.percent),detail:`${i.used_gb.toFixed(1)}GB em uso de ${i.total_gb.toFixed(1)}GB (Montagem em /)`})}const o=document.getElementById("gnew-kpi-disk-text"),a=document.getElementById("gnew-kpi-disk-bar"),s=document.getElementById("gnew-kpi-disk-detail");o&&(o.textContent=`${n.percentage}%`),a&&(a.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}const t=document.getElementById("gnew-disk-table-body");if(t){let n=[];if(C.disco)if(C.disco.output)try{const o=C.disco.output.trim().split(`
`);for(let a=1;a<o.length;a++){const s=o[a].trim().split(/\s+/);s.length>=6&&n.push({mountpoint:s[5],total:s[1],used:s[2],free:s[3],percent:parseInt(s[4].replace("%",""),10)||0})}}catch(o){console.warn("Erro ao fazer parse da tabela de disco offline:",o)}else Array.isArray(C.disco)&&(n=C.disco.map(o=>({mountpoint:o.mountpoint,total:typeof o.total_gb=="number"?`${o.total_gb.toFixed(2)} GB`:o.total_gb||"0 GB",used:typeof o.used_gb=="number"?`${o.used_gb.toFixed(2)} GB`:o.used_gb||"0 GB",free:typeof o.free_gb=="number"?`${o.free_gb.toFixed(2)} GB`:o.free_gb||"0 GB",percent:typeof o.percent=="number"?Math.round(o.percent):parseInt(o.percent,10)||0})));n.length>0?t.innerHTML=n.map(o=>{const a=o.percent;return`
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
                    `}).join(""):t.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                            Nenhum ponto de montagem de disco encontrado.
                        </td>
                    </tr>
                `}if(C.servicos&&C.servicos.timestamp)try{const o=new Date(C.servicos.timestamp).toLocaleString("pt-BR"),a=document.getElementById("gnew-services-timestamp");a&&(a.textContent=`Última verificação: ${o}`)}catch(n){console.warn("Erro ao formatar timestamp dos serviços:",n)}const e=document.getElementById("gnew-services-list");if(e){let n=[];C.servicos&&Array.isArray(C.servicos.servicos)&&(n=C.servicos.servicos),n.length>0?(e.innerHTML=n.map(a=>{const s=a.status==="active"||a.status_label==="ativo",i=s?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",r=s?"#6ee7b7":"#fca5a5",l=s?"#10b981":"#ef4444",u=s?"#10b981":"#ef4444";return`
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
                    `}).join(""),e.querySelectorAll(".service-header-row").forEach(a=>{a.addEventListener("click",()=>{const s=a.closest(".service-card"),i=s.querySelector(".service-log-content"),r=s.querySelector(".service-chevron");i.style.maxHeight==="300px"?(i.style.maxHeight="0px",i.style.borderTopColor="transparent",r.style.transform="rotate(0deg)"):(i.style.maxHeight="300px",i.style.borderTopColor="rgba(255, 255, 255, 0.05)",r.style.transform="rotate(90deg)")})})):e.innerHTML=`
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic;">
                        Nenhum serviço encontrado no servidor.
                    </div>
                `}if(C.ipExterno){const n=document.getElementById("gnew-kpi-ip-text");n&&(n.textContent=C.ipExterno.ip||"Não detectado")}},async clearEventHistory(){const t=document.getElementById("btn-clear-event-history");if(confirm("Tem certeza que deseja limpar todo o histórico de eventos? Esta ação não pode ser desfeita."))try{t&&(t.disabled=!0,t.textContent="Limpando..."),await fetch("/api/monitoring/events",{method:"DELETE"}),await this.fetchAndRenderEventHistory();const e=document.getElementById("event-history-count");e&&(e.style.display="none")}catch(e){console.error("Erro ao limpar histórico:",e),alert("Erro ao limpar o histórico. Tente novamente.")}finally{t&&(t.disabled=!1,t.textContent="Limpar Histórico")}},async fetchAndRenderApisStatus(){const t=document.getElementById("monitoring-apis-grid");if(!t)return;t.innerHTML=`
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 12px; color: var(--text-muted);">
                <div class="api-loading-spinner" style="width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="font-size: 0.9rem;">Verificando integridade das APIs...</span>
            </div>
        `;const e=document.getElementById("btn-refresh-apis-status");let n=null;e&&(n=e.querySelector("svg"),e.disabled=!0,e.style.opacity="0.6",e.style.cursor="not-allowed",n&&(n.style.animation="spin 0.8s linear infinite"));try{const o=await I.get("/monitoring/apis-status?refresh=true&t="+Date.now());if(o&&o.success&&Array.isArray(o.apis))at=o.apis,J==="alerts"&&this.renderGnewServicesStatus(),this.renderApisGrid(o.apis);else throw new Error("Resposta inválida do servidor.")}catch(o){console.error("Erro ao buscar status das APIs:",o),t.innerHTML=`
                <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                    <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status das APIs</p>
                    <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${o.message}</p>
                </div>
            `}finally{e&&(e.disabled=!1,e.style.opacity="",e.style.cursor="pointer",n&&(n.style.animation=""))}},renderApisGrid(t){const e=document.getElementById("monitoring-apis-grid");if(e){if(t.length===0){e.innerHTML=`
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted);">
                    Nenhuma API cadastrada.
                </div>
            `;return}e.innerHTML=t.map(n=>{let o="online",a="rgba(16, 185, 129, 0.1)",s="#6ee7b7",i="#10b981",r="Online";n.status==="warning"?(o="warning",a="rgba(245, 158, 11, 0.1)",s="#fde047",i="#f59e0b",r="Alerta"):(n.status==="offline"||!n.online)&&(o="offline",a="rgba(239, 68, 68, 0.1)",s="#fca5a5",i="#ef4444",r="Offline");const l=n.latency<500?"#6ee7b7":n.latency<2e3?"#fde047":"#fca5a5";return`
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
            `}).join("")}},async fetchAndRenderSwitchesStatus(t=!1,e=!1){const n=document.getElementById("switches-auto-refresh"),o=e||n&&n.checked,a=document.getElementById("monitoring-switches-tbody");if(!a)return;const s=document.getElementById("btn-refresh-switches-status");let i=null;s&&(i=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",i&&(i.style.animation="spin 0.8s linear infinite"));try{if(o){const r=await I.get(`/monitoring/switches?ping=false&refresh=${t}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.switches)){this.renderSwitchesTable(r.switches),r.switches.forEach(l=>{const u=document.getElementById(`switch-row-${l.id}`);if(u){const d=u.querySelector(".switch-sync-indicator");d&&(d.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ne=!0;for(const l of r.switches){if(J!=="infra")break;const u=document.getElementById(`switch-row-${l.id}`);if(u){const d=u.querySelector(".switch-sync-indicator");d&&(d.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const d=await I.get(`/monitoring/switches/${l.id}/ping?t=${Date.now()}`);if(d&&d.success&&d.switch){const p=d.switch,m=document.getElementById(`switch-row-${p.id}`);if(m){let f="rgba(16, 185, 129, 0.12)",g="#6ee7b7",y="rgba(16, 185, 129, 0.3)",v="Online";p.online||(f="rgba(239, 68, 68, 0.12)",g="#fca5a5",y="rgba(239, 68, 68, 0.3)",v="Offline");const L=p.latency<50?"#6ee7b7":p.latency<150?"#fde047":"#fca5a5",$=p.online?`${p.latency}ms`:"-",x=m.querySelector(".monitor-badge");x&&(x.style.background=f,x.style.color=g,x.style.borderColor=y,x.textContent=v);const M=m.querySelector(".switch-latency");M&&(M.style.color=L,M.textContent=$);const T=m.querySelector(".switch-sync-indicator");T&&(T.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{T.querySelector("polyline")&&(T.innerHTML="")},3e3))}}}catch(d){console.error(`Erro ao pingar switch ${l.name}:`,d);const p=document.getElementById(`switch-row-${l.id}`);if(p){const m=p.querySelector(".monitor-badge");m&&(m.style.background="rgba(239, 68, 68, 0.12)",m.style.color="#fca5a5",m.style.borderColor="rgba(239, 68, 68, 0.3)",m.textContent="Erro");const f=p.querySelector(".switch-sync-indicator");f&&(f.innerHTML="")}}}Ne=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/switches?refresh=${t}&t=${Date.now()}`,l=await I.get(r);if(l&&l.success&&Array.isArray(l.switches))this.renderSwitchesTable(l.switches);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos switches:",r),a.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos switches</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",i&&(i.style.animation=""))}},renderSwitchesTable(t){const e=document.getElementById("monitoring-switches-tbody");if(e){if(t.length===0){e.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum switch encontrado.
                    </td>
                </tr>
            `;return}e.innerHTML=t.map(n=>{let o="rgba(16, 185, 129, 0.12)",a="#6ee7b7",s="rgba(16, 185, 129, 0.3)",i="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",a="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",i="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",a="#fca5a5",s="rgba(239, 68, 68, 0.3)",i="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
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
            `}).join("")}},async fetchAndRenderRoutersStatus(t=!1,e=!1){console.log("📊 [MONITORING] fetchAndRenderRoutersStatus called. forceRefresh:",t,"sequential:",e);const n=document.getElementById("routers-auto-refresh"),o=e||n&&n.checked,a=document.getElementById("monitoring-routers-tbody");if(!a){console.error("📊 [MONITORING] Element #monitoring-routers-tbody not found in DOM!");return}const s=document.getElementById("btn-refresh-routers-status");let i=null;s&&(i=s.querySelector("svg"),s.disabled=!0,s.style.opacity="0.6",s.style.cursor="not-allowed",i&&(i.style.animation="spin 0.8s linear infinite"));try{if(console.log("📊 [MONITORING] Fetching routers, sequential mode:",o),o){const r=await I.get(`/monitoring/routers?ping=false&refresh=${t}&t=${Date.now()}`);if(r&&r.success&&Array.isArray(r.routers)){this.renderRoutersTable(r.routers),r.routers.forEach(l=>{const u=document.getElementById(`router-row-${l.id}`);if(u){const d=u.querySelector(".router-sync-indicator");d&&(d.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); opacity: 0.5;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}}),Ne=!0;for(const l of r.routers){if(J!=="infra"||ye!=="routers")break;const u=document.getElementById(`router-row-${l.id}`);if(u){const d=u.querySelector(".router-sync-indicator");d&&(d.innerHTML=`
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent); animation: spin 1s linear infinite;">
                                        <polyline points="23 4 23 10 17 10"></polyline>
                                        <polyline points="1 20 1 14 7 14"></polyline>
                                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                                    </svg>
                                `)}try{const d=await I.get(`/monitoring/routers/${l.id}/ping?t=${Date.now()}`);if(d&&d.success&&d.router){const p=d.router,m=document.getElementById(`router-row-${p.id}`);if(m){let f="rgba(16, 185, 129, 0.12)",g="#6ee7b7",y="rgba(16, 185, 129, 0.3)",v="Online";p.online||(f="rgba(239, 68, 68, 0.12)",g="#fca5a5",y="rgba(239, 68, 68, 0.3)",v="Offline");const L=p.latency<50?"#6ee7b7":p.latency<150?"#fde047":"#fca5a5",$=p.online?`${p.latency}ms`:"-",x=m.querySelector(".monitor-badge");x&&(x.style.background=f,x.style.color=g,x.style.borderColor=y,x.textContent=v);const M=m.querySelector(".router-latency");M&&(M.style.color=L,M.textContent=$);const T=m.querySelector(".router-sync-indicator");T&&(T.innerHTML=`
                                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        `,setTimeout(()=>{T.querySelector("polyline")&&(T.innerHTML="")},3e3))}}}catch(d){console.error(`Erro ao pingar roteador ${l.name}:`,d);const p=document.getElementById(`router-row-${l.id}`);if(p){const m=p.querySelector(".monitor-badge");m&&(m.style.background="rgba(239, 68, 68, 0.12)",m.style.color="#fca5a5",m.style.borderColor="rgba(239, 68, 68, 0.3)",m.textContent="Erro");const f=p.querySelector(".router-sync-indicator");f&&(f.innerHTML="")}}}Ne=!1}else throw new Error("Resposta inválida do servidor.")}else{const r=`/monitoring/routers?refresh=${t}&t=${Date.now()}`,l=await I.get(r);if(l&&l.success&&Array.isArray(l.routers))this.renderRoutersTable(l.routers);else throw new Error("Resposta inválida do servidor.")}}catch(r){console.error("Erro ao buscar status dos roteadores:",r),a.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #fca5a5; background: rgba(239, 68, 68, 0.07);">
                        <p style="margin: 0; font-weight: 600;">Falha ao obter status dos roteadores</p>
                        <p style="margin: 4px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${r.message}</p>
                    </td>
                </tr>
            `}finally{s&&(s.disabled=!1,s.style.opacity="",s.style.cursor="pointer",i&&(i.style.animation=""))}},renderRoutersTable(t){const e=document.getElementById("monitoring-routers-tbody");if(e){if(t.length===0){e.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum roteador encontrado.
                    </td>
                </tr>
            `;return}e.innerHTML=t.map(n=>{let o="rgba(16, 185, 129, 0.12)",a="#6ee7b7",s="rgba(16, 185, 129, 0.3)",i="Online";n.online===null?(o="rgba(255, 255, 255, 0.05)",a="var(--text-muted)",s="rgba(255, 255, 255, 0.1)",i="Aguardando..."):n.online||(o="rgba(239, 68, 68, 0.12)",a="#fca5a5",s="rgba(239, 68, 68, 0.3)",i="Offline");const r=n.online?n.latency<50?"#6ee7b7":n.latency<150?"#fde047":"#fca5a5":"var(--text-muted)",l=n.online?`${n.latency}ms`:"-";return`
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
            `}).join("")}}};let re="list";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=q,Jt(),Wt(),Qt(),It.init(),pt.init(),q.init()?(console.log("Sessão restaurada:",q.getUser().email),St()):Ct()});let rt,le,Ae,He;function Jt(){rt=document.querySelectorAll(".nav-btn"),le=document.getElementById("btn-new-item"),Ae=document.getElementById("login-section"),He=document.getElementById("app-container")}function Ct(){Ae&&Ae.classList.remove("hidden"),He&&He.classList.add("hidden"),document.body.style.overflow="hidden"}function Wt(){const t=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=t-5;o<=t+5;o++){const a=document.createElement("option");a.value=o,a.textContent=o,o===t&&(a.selected=!0),n.appendChild(a)}})}function St(){if(Ae&&Ae.classList.add("hidden"),He&&He.classList.remove("hidden"),document.body.style.overflow="",re="list",je(),j.fetch(),ne.fetch(),it.fetch(),z.fetch(),window.auth){const t=document.getElementById("timeline-tab-anexo");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"));const e=document.getElementById("timeline-tab-config");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"))}}function je(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section","monitoring-section"].forEach(t=>{c.hide(t)}),le&&le.classList.add("hidden"),gt.stop(),re){case"account":case"profile":c.show("account-section"),c.setText("section-title","Minha Conta"),setTimeout(()=>gt.start(),100);break;case"list":c.show("list-section"),c.setText("section-title","Listagem Geral"),q.isAdmin()&&le&&le.classList.remove("hidden");break;case"docs":c.show("docs-section"),c.setText("section-title","Documentação");break;case"detail":c.show("detail-section"),c.setText("section-title","Procedimento");break;case"users":c.show("users-section"),c.setText("section-title","Gestão de Usuários");break;case"accounts":c.show("accounts-section"),c.setText("section-title","Gestão de Contas"),z.handleSearch();break;case"timeline":c.show("timeline-section"),c.setText("section-title","Timeline");break;case"telephony":c.show("telephony-section"),c.setText("section-title","Telefonia");break;case"monitoring":c.show("monitoring-section"),c.setText("section-title","Monitoramento"),pt.fetch();break}Dt()}function Dt(){const t=q.isAdmin();c.toggle("nav-users",!t),c.toggle("nav-accounts",!t),le&&le.classList.toggle("role-hidden",!t);const e=document.getElementById("btn-floating-edit");e&&e.classList.toggle("role-hidden",!t),document.querySelectorAll(".btn-actions-container").forEach(i=>{i.classList.toggle("role-hidden",!t)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(i=>{const r=document.getElementById(i);r&&r.classList.toggle("role-hidden",!t)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!t);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!t);const a=document.getElementById("btn-new-doc");a&&a.classList.toggle("role-hidden",!t);const s=q.getUser();if(s){let i=s.name;(i.toLowerCase().startsWith("usuário ")||i.toLowerCase().startsWith("usuario "))&&(i=i.substring(8)),c.setText("profile-name-display",i),c.setText("profile-role-display",s.role);let r=i.substring(0,2).toUpperCase();const l=i.trim().split(/\s+/);l.length>1&&(r=(l[0][0]+l[l.length-1][0]).toUpperCase()),c.setText("profile-avatar-initials",r)}}function Qt(){const t=document.getElementById("sidebar"),e=document.getElementById("sidebar-toggle");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("collapsed")}),rt.forEach(i=>{i.addEventListener("click",()=>{if(rt.forEach(r=>r.classList.remove("active")),i.classList.add("active"),re=i.dataset.section,je(),window.innerWidth<=768){t.classList.remove("open");const r=document.getElementById("sidebar-overlay");r&&r.classList.remove("active")}})}),window.addEventListener("SectionChange",i=>{re=i.detail.section,je()}),c.on("login-form","submit",async i=>{i.preventDefault();const r=document.getElementById("login-btn"),l=document.getElementById("login-error");r&&(r.disabled=!0);const u=await q.login(c.getValue("login-email"),c.getValue("login-password"));r&&(r.disabled=!1),u.success?St():l&&(l.innerText=u.error,l.classList.remove("hidden"))}),c.on("btn-logout","click",()=>{const i=document.getElementById("auto-refresh-toggle");i&&i.checked&&(i.checked=!1,i.dispatchEvent(new Event("change"))),q.logout(),Ct()}),document.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{const r=i.closest(".modal");r&&r.classList.add("hidden")})}),window.UsersHandler=it,window.DocsHandler=ne,window.ProceduresHandler=j,window.AccountsHandler=z,window.TelephonyHandler=Be,window.monitoringHandler=pt,["extensions","queues","blf","users"].forEach(i=>{c.on(`tab-telephony-${i}`,"click",()=>Be.setActiveTab(i))}),c.on("telephony-search","input",i=>Be.search(i.target.value.toLowerCase())),c.on("telephony-page-size","change",i=>Be.setPageSize(i.target.value)),c.on("telephony-reload-btn","click",()=>{const i=document.getElementById("telephony-search");i&&(i.value=""),Be.fetch()}),c.on("accounts-search","input",()=>z.handleSearch()),c.on("filter-status","change",()=>z.handleSearch()),c.on("filter-date-toggle","change",i=>{const r=document.getElementById("sidebar-mini-calendar-list");r&&(r.style.opacity=i.target.checked?"1":"0.4",r.style.pointerEvents=i.target.checked?"auto":"none"),z.handleSearch()}),c.on("filter-cal-month","change",()=>z.handleFilterChange(!0)),c.on("filter-cal-year","change",()=>z.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(i=>{c.on(i,"change",()=>{re==="accounts"&&z.renderDashboard()})}),c.on("btn-dash-clear-dates","click",()=>{c.setValue("dash-filter-start",""),c.setValue("dash-filter-end",""),c.setValue("dash-filter-type","Todos"),c.setValue("dash-filter-status","Todos"),c.setValue("dash-filter-payment","Todos"),z.resetMultiselects(),c.setValue("dash-sort-empresas","desc"),c.setValue("dash-sort-categorias","desc"),re==="accounts"&&z.renderDashboard()}),c.on("user-form","submit",i=>it.save(i)),c.on("doc-form","submit",i=>ne.handleUpload(i)),c.on("account-form","submit",i=>z.save(i)),c.on("faq-form","submit",i=>j.saveMeta(i));const n=document.getElementById("proc-color-palette"),o=document.getElementById("proc-color");n&&o&&(n.addEventListener("click",i=>{const r=i.target.closest(".color-swatch");if(r)if(r.id==="color-custom-swatch")o.click();else{const l=r.dataset.color;l&&(o.value=l,n.querySelectorAll(".color-swatch").forEach(u=>u.classList.remove("active")),r.classList.add("active"))}}),o.addEventListener("input",i=>{const r=document.getElementById("color-custom-swatch");r&&(r.style.background=i.target.value,n.querySelectorAll(".color-swatch").forEach(l=>l.classList.remove("active")),r.classList.add("active"))})),c.on("btn-new-item","click",()=>{if(c.setText("modal-form-title","Novo Procedimento"),c.setValue("proc-id",""),c.setValue("proc-content","[]"),n){n.querySelectorAll(".color-swatch").forEach(r=>r.classList.remove("active"));const i=n.querySelector('[data-color="#4F46E5"]');i&&i.classList.add("active")}o&&(o.value="#4F46E5"),c.show("modal-form")}),c.on("btn-new-account","click",()=>z.openAccountModal()),c.on("btn-new-account-cal","click",()=>z.openAccountModal()),c.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),c.setValue("user-id-form",""),c.show("modal-user")}),c.on("list-search","input",i=>{j.search(i.target.value.toLowerCase())}),c.on("doc-search","input",i=>{ne.search(i.target.value.toLowerCase())}),c.on("doc-dash-search","input",()=>{ne.renderDashboard()}),c.on("doc-dash-filter-category","change",()=>{ne.renderDashboard()}),c.on("doc-dash-filter-status","change",()=>{ne.renderDashboard()}),c.on("btn-new-doc","click",()=>{c.show("modal-upload")}),["geral","contratos","termo-de-uso","dashboard"].forEach(i=>{c.on(`tab-doc-${i}`,"click",()=>{let r;i==="termo-de-uso"?r="Termo de Uso":i==="dashboard"?r="dashboard":r=i,ne.setActiveTab(r)})}),c.on("doc-category","change",i=>{const r=i.target.value.toLowerCase(),l=document.getElementById("doc-dates-container");l&&(l.style.display=r==="contratos"||r==="termo de uso"?"grid":"none")}),c.on("doc-indefinite","change",i=>{const r=document.getElementById("doc-end-date");r&&(r.disabled=i.target.checked,i.target.checked&&(r.value=""))});const a=document.getElementById("drop-zone"),s=document.getElementById("doc-file");a&&s&&(a.addEventListener("click",i=>{i.target!==s&&s.click()}),s.addEventListener("click",i=>{i.stopPropagation()}),s.addEventListener("change",i=>{i.target.files.length>0&&c.setText("file-name-display",i.target.files[0].name)}),a.addEventListener("dragover",i=>{i.preventDefault(),a.classList.add("dragover")}),a.addEventListener("dragleave",()=>{a.classList.remove("dragover")}),a.addEventListener("drop",i=>{i.preventDefault(),a.classList.remove("dragover"),i.dataTransfer.files.length>0&&(s.files=i.dataTransfer.files,c.setText("file-name-display",i.dataTransfer.files[0].name))})),c.on("toggle-list","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),j.setListingMode("list")}),c.on("toggle-cards","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),j.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes"].forEach(i=>{c.on(`tab-acc-${i}`,"click",r=>{document.querySelectorAll(".acc-tab-btn").forEach(m=>m.classList.remove("active")),r.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(m=>{m.classList.add("hidden"),m.classList.remove("active")});const l=document.getElementById("accounts-dashboard-view");l&&(l.classList.add("hidden"),l.classList.remove("active"));const u=i==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${i}`,d=document.getElementById(u);d&&(d.classList.remove("hidden"),d.classList.add("active"));const p=document.getElementById("calendar-view-toggle-container");p&&(i==="calendario"?(p.classList.remove("hidden"),p.style.display="flex"):(p.classList.add("hidden"),p.style.display="none")),z.setAccountsViewMode(i==="calendario"?"calendar":i==="dashboard"?"dashboard":i==="notificacoes"?"notificacoes":"list")})}),["day","month","year"].forEach(i=>{c.on(`toggle-accounts-cal-${i}`,"click",r=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(l=>l.classList.remove("active")),r.currentTarget.classList.add("active"),["day","month","year"].forEach(l=>{document.getElementById(`cal-${l}-view-container`).classList.toggle("hidden-cal-view",l!==i)}),z.setCalendarSubView(i)})}),c.on("btn-prev-date-nav","click",()=>z.shiftCalendarDate(-1)),c.on("btn-next-date-nav","click",()=>z.shiftCalendarDate(1)),c.on("btn-back-to-accounts","click",()=>{c.hide("dedicated-account-page"),c.show("accounts-section"),Dt()}),c.on("btn-back-to-list","click",()=>{const i=document.getElementById("procedure-edit-wrapper");i&&!i.classList.contains("hidden")?j.toggleEditMode(!1):(re="list",je())}),c.on("btn-floating-edit","click",()=>j.toggleEditMode(!0)),c.on("btn-cancel-edit","click",()=>j.toggleEditMode(!1)),c.on("btn-save-procedure","click",()=>j.handleSaveProcedure()),c.on("confirm-yes","click",()=>{c.hide("modal-confirm"),j.openDetail(j.getPendingProcId())}),c.on("confirm-no","click",()=>{c.hide("modal-confirm")}),c.on("procedure-search","input",i=>{j.filterProcedureContent(i.target.value)}),c.on("btn-add-block","click",()=>{const i=document.getElementById("section-title-input"),r=document.getElementById("section-type-input");i&&(i.value=""),r&&(r.value="TEXTO"),c.show("modal-add-section")}),c.on("btn-confirm-add-section","click",()=>{const i=c.getValue("section-title-input"),r=c.getValue("section-type-input");if(!i)return alert("Por favor, informe o título da seção.");j.addSection(i,r),c.hide("modal-add-section")})}
