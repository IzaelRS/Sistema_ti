(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const ve="/api",L={async get(t){const e=await fetch(`${ve}${t}`);if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${e.status}`)}return await e.json()},async post(t,e){const n=await fetch(`${ve}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(t,e){const n=await fetch(`${ve}${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(t){const e=await fetch(`${ve}${t}`,{method:"DELETE"});if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${e.status}`)}return await e.json()},async upload(t,e){const n=await fetch(`${ve}${t}`,{method:"POST",body:e});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let me=null;const F={init(){const t=localStorage.getItem("user");if(t)try{return me=JSON.parse(t),!0}catch{return this.logout(),!1}return!1},getUser(){return me},isAdmin(){return me&&me.role==="Administrador"},async login(t,e){try{const n=await L.post("/login",{email:t,password:e});return me=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){me=null,localStorage.removeItem("user")}},l={show(t){const e=document.getElementById(t);e&&e.classList.remove("hidden")},hide(t){const e=document.getElementById(t);e&&e.classList.add("hidden")},toggle(t,e){const n=document.getElementById(t);n&&n.classList.toggle("hidden",e)},setText(t,e){const n=document.getElementById(t);n&&(n.innerText=e)},setValue(t,e){const n=document.getElementById(t);n&&(n.value=e)},getValue(t){const e=document.getElementById(t);return e?e.value:null},on(t,e,n){const o=document.getElementById(t);o&&o.addEventListener(e,n)}},st={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const t=window.innerWidth<=768;this.particleCount=t?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let e=0;e<this.particleCount;e++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const t=document.getElementById("account-section");t&&(this.canvas.width=t.clientWidth,this.canvas.height=t.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let t=0;t<this.particles.length;t++){const e=this.particles[t];e.x+=e.vx,e.y+=e.vy,(e.x<0||e.x>this.canvas.width)&&(e.vx*=-1),(e.y<0||e.y>this.canvas.height)&&(e.vy*=-1),this.ctx.beginPath(),this.ctx.arc(e.x,e.y,e.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=t+1;n<this.particles.length;n++){const o=this.particles[n],a=e.x-o.x,s=e.y-o.y,i=Math.sqrt(a*a+s*s);if(i<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const r=1-i/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${r*.4})`,this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let be=[];const Ke={async fetch(){try{be=await L.get("/users"),this.render(be)}catch(t){console.error("Error fetching Users:",t)}},getUsers(){return be},render(t){const e=document.getElementById("user-table-body");e&&(e.innerHTML=t.map(n=>{const o=n.role==="Administrador",a=F.isAdmin()?`
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
            </tr>`}).join(""))},openEditModal(t){const e=be.find(n=>n.id===t);e&&(l.setText("modal-user-title","Editar Usuário"),l.setValue("user-id-form",e.id),l.setValue("user-name-form",e.name),l.setValue("user-email-form",e.email),l.setValue("user-password-form",""),l.setValue("user-role-form",e.role),l.show("modal-user"))},async save(t){t.preventDefault();const e=l.getValue("user-id-form"),n={name:l.getValue("user-name-form"),email:l.getValue("user-email-form"),password:l.getValue("user-password-form"),role:l.getValue("user-role-form")};try{e?await L.put(`/users/${e}`,n):await L.post("/users",n),l.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(e?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(t){if(confirm("Deseja excluir este usuário?"))try{await L.delete(`/users/${t}`),this.fetch()}catch(e){alert("Erro ao excluir: "+e.message)}},search(t){const e=be.filter(n=>n.name.toLowerCase().includes(t)||n.email.toLowerCase().includes(t));this.render(e)}};let Ae=[],ae="Geral",H=1;const we=10;let rt=[];const te={async fetch(){try{H=1,Ae=await L.get("/documents"),this.filterAndRender()}catch(t){console.error("Error fetching Documents:",t)}},setActiveTab(t){ae=t,H=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(e=>{const n=e.textContent.trim().toLowerCase();e.classList.toggle("active",n===t.toLowerCase())}),this.filterAndRender()},filterAndRender(){const t=document.querySelector(".docs-header");if(ae.toLowerCase()==="dashboard")t&&(t.style.display="none"),l.hide("doc-list-container"),l.show("doc-dashboard-container"),this.renderDashboard();else{t&&(t.style.display="flex"),l.show("doc-list-container"),l.hide("doc-dashboard-container");const e=Ae.filter(n=>(n.category||"Geral").toLowerCase()===ae.toLowerCase());this.render(e)}},calculateRemainingTime(t){if(!t||t==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const e=new Date;e.setHours(0,0,0,0);const n=new Date(t+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-e.getTime(),a=Math.ceil(o/(1e3*60*60*24));if(a<0){const s=Math.abs(a);let i=`Expirado há ${s} dia(s)`;return s>=30&&(i=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:i,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:a}}else{if(a===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:a};if(a<=30)return{text:`Expira em ${a} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:a};{const s=Math.floor(a/30);let i=`Expira em ${s} mês(es)`;if(s>=12){const r=Math.floor(s/12),c=s%12;i=`Expira em ${r} ano(s)${c>0?` e ${c} mês(es)`:""}`}return{text:i,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:a}}}},renderDashboard(){const t=document.getElementById("doc-dashboard-tbody");if(!t)return;const e=Ae.filter(g=>{const y=(g.category||"").toLowerCase();return y==="contratos"||y==="termo de uso"});let n=0,o=0,a=0,s=0;e.forEach(g=>{const y=(g.category||"").toLowerCase(),f=this.calculateRemainingTime(g.end_date);f.status==="expired"?s++:f.status==="critical"?(a++,y==="contratos"&&n++,y==="termo de uso"&&o++):(y==="contratos"&&n++,y==="termo de uso"&&o++)}),l.setText("doc-kpi-active-contracts",n),l.setText("doc-kpi-active-terms",o),l.setText("doc-kpi-warning-docs",a),l.setText("doc-kpi-expired-docs",s);const i=document.getElementById("doc-dash-search"),r=document.getElementById("doc-dash-filter-category"),c=document.getElementById("doc-dash-filter-status"),u=i?i.value.toLowerCase().trim():"",d=r?r.value:"Todos",p=c?c.value:"Todos";let m=e.filter(g=>{if(u&&!g.original_name.toLowerCase().includes(u)||d!=="Todos"&&(g.category||"").toLowerCase()!==d.toLowerCase())return!1;const y=this.calculateRemainingTime(g.end_date);return!(p!=="Todos"&&(p==="Ativos"&&(y.status==="expired"||y.status==="critical")||p==="Expirando"&&y.status!=="critical"||p==="Expirados"&&y.status!=="expired"||p==="Indeterminado"&&y.status!=="indefinite"))});if(m.sort((g,y)=>{const f=this.calculateRemainingTime(g.end_date),w=this.calculateRemainingTime(y.end_date),$={expired:1,critical:2,active:3,indefinite:4},k=$[f.status]||5,N=$[w.status]||5;return k!==N?k-N:f.days-w.days}),m.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const h=window.auth&&window.auth.isAdmin();t.innerHTML=m.map(g=>{const y=g.mimetype==="application/pdf"?"📕":"🖼️",f=g.start_date?new Date(g.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",w=g.end_date?g.end_date==="Indefinido"?"Indefinido":new Date(g.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",$=this.calculateRemainingTime(g.end_date),k=h?`<button class="btn-delete" onclick="window.DocsHandler.delete(${g.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
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
                    <td>${f}</td>
                    <td>${w}</td>
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
                            ${k}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(t){const e=document.getElementById("doc-list-body");if(!e)return;const n=document.getElementById("doc-list-thead"),o=ae.toLowerCase()==="contratos"||ae.toLowerCase()==="termo de uso",a=window.auth&&window.auth.isAdmin(),s=a?"":'class="role-hidden"';rt=t;const i=t.length,r=Math.ceil(i/we);H>r&&(H=Math.max(1,r)),H<1&&(H=1);const c=(H-1)*we,u=t.slice(c,c+we);if(n&&(o?n.innerHTML=`
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
            `,this.renderPaginationControls("doc-pagination",0,0);return}e.innerHTML=u.map(d=>{const p=d.mimetype==="application/pdf"?"📕":"🖼️",m=(d.size/1024).toFixed(1)+" KB",h=d.created_at?new Date(d.created_at).toLocaleDateString("pt-BR"):"-",g=d.mimetype==="application/pdf"?"PDF":"Imagem",y=a?`<button class="btn-delete" onclick="window.DocsHandler.delete(${d.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",f=d.start_date?new Date(d.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",w=d.end_date?d.end_date==="Indefinido"?"Indefinido":new Date(d.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-";return o?`
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
                        <td>${w}</td>
                        <td>${h}</td>
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
                        <td>${h}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${d.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${y}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",r,i)},async handleUpload(t){t.preventDefault();const e=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!e.files.length){alert("Selecione um arquivo.");return}const a=new FormData,s=n?n.value:"Geral";a.append("category",s),a.append("customName",o?o.value:""),a.append("document",e.files[0]);const i=s.toLowerCase();if(i==="contratos"||i==="termo de uso"){const r=document.getElementById("doc-start-date"),c=document.getElementById("doc-end-date"),u=document.getElementById("doc-indefinite");r&&r.value&&a.append("startDate",r.value),u&&u.checked?a.append("endDate","Indefinido"):c&&c.value&&a.append("endDate",c.value)}try{await L.upload("/documents",a),l.hide("modal-upload"),document.getElementById("doc-form").reset();const r=document.getElementById("doc-dates-container");r&&(r.style.display="none");const c=document.getElementById("doc-end-date");c&&(c.disabled=!1),l.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(r){console.error(r),alert("Erro ao subir arquivo.")}},async delete(t){if(confirm("Deletar este documento?"))try{await L.delete(`/documents/${t}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(t){if(ae.toLowerCase()==="dashboard")this.renderDashboard();else{H=1;const e=Ae.filter(n=>(n.category||"Geral").toLowerCase()===ae.toLowerCase()&&n.original_name.toLowerCase().includes(t));this.render(e)}},changePage(t){H=t,this.render(rt)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${H===1?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${H-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=e;c++)(c===1||c===e||c>=H-1&&c<=H+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===H?"active":""}" 
                            onclick="window.DocsHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${H===e?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${H+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(H-1)*we+1,r=Math.min(H*we,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let ee=[],E={summaries:[]},lt=null,B=null,qe="list",xe=null,X=null,ct=null,_=1;const Ee=10;let He=[];const z={getPendingProcId(){return lt},async fetch(){try{_=1,ee=await L.get("/procedures"),this.renderTable(ee)}catch(t){console.error("Error fetching FAQs:",t)}},getFaqs(){return ee},setListingMode(t){qe=t,_=1,this.renderTable(He.length?He:ee)},renderTable(t){const e=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!e||!n||!o)return;He=t;const a=t.length,s=Math.ceil(a/Ee);_>s&&(_=Math.max(1,s)),_<1&&(_=1);const i=(_-1)*Ee,r=t.slice(i,i+Ee);qe==="list"?(l.show("list-table-container"),l.hide("list-cards-container"),r.length===0?o.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            Nenhum procedimento encontrado.
                        </td>
                    </tr>
                `:o.innerHTML=r.map(u=>{const d=F.isAdmin()?`
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
                `:n.innerHTML=r.map(u=>{const d=F.isAdmin()?`
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
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,a),(qe==="list"?o:n).addEventListener("click",function(d){const p=d.target.closest('[data-action="edit"], [data-action="delete"]');if(p){d.stopPropagation(),d.preventDefault();const h=Number(p.dataset.id);p.dataset.action==="edit"?z.openEditModal(h):p.dataset.action==="delete"&&z.deleteProcedure(h);return}const m=d.target.closest('[data-action="open"]');if(m){const h=Number(m.dataset.id);z.openDetail(h)}})},openDetail(t){const e=ee.find(o=>o.id===t);if(!e)return;l.setText("detail-title",e.name||e.title||"Sem título"),l.setValue("proc-id",e.id);try{let o=e.content?JSON.parse(e.content):[];Array.isArray(o)?E={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?E=o:E={summaries:[]}}catch{E={summaries:[]}}E.summaries.length>0?B=E.summaries[0].id:B=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(t){const e=ee.find(n=>n.id===t);e&&(l.setText("modal-form-title","Editar Procedimento"),l.setValue("proc-id",e.id),l.setValue("proc-name",e.name||e.title||""),l.setValue("proc-responsible",e.responsible||""),l.setValue("proc-group",e.group_name||""),l.setValue("proc-note",e.note||""),l.setValue("proc-content",e.content||""),l.setValue("proc-color",e.color||"#4F46E5"),l.show("modal-form"))},async saveMeta(t){t&&t.preventDefault();const e=l.getValue("proc-id"),n={name:l.getValue("proc-name").toUpperCase(),responsible:l.getValue("proc-responsible").toUpperCase(),group_name:l.getValue("proc-group"),note:l.getValue("proc-note"),content:l.getValue("proc-content"),color:l.getValue("proc-color")};try{const o=e?`/procedures/${e}`:"/procedures";lt=(e?await L.put(o,n):await L.post(o,n)).id,l.hide("modal-form"),document.getElementById("faq-form").reset(),l.setValue("proc-responsible","TI"),l.setValue("proc-group","Geral"),await this.fetch(),l.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(t){if(confirm("Deseja excluir este procedimento?"))try{await L.delete(`/procedures/${t}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(t){const e=document.querySelector(".procedure-sidebar");t?(l.hide("procedure-view-container"),l.hide("procedure-view-sidebar"),l.show("procedure-edit-wrapper"),l.show("procedure-edit-sidebar"),l.hide("btn-floating-edit"),e&&e.classList.add("glass","has-border"),E.summaries.length>0?E.summaries.find(n=>n.id===B)||(B=E.summaries[0].id):B=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(l.show("procedure-view-container"),l.show("procedure-view-sidebar"),l.hide("procedure-edit-wrapper"),l.hide("procedure-edit-sidebar"),l.show("btn-floating-edit"),e&&e.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const t=document.getElementById("procedure-view-container"),e=document.getElementById("procedure-view-index");if(!t||!e)return;if(E.summaries.length===0){t.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',e.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";E.summaries.forEach((a,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${a.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${a.title}</li>`,n+=`<div id="sum-view-${a.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(E.summaries.length>1||a.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${a.title}</h4>`),a.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const i=a.sections.map((r,c)=>{let u="";if(r.type==="TEXTO")u=`<div class="gh-content"><div class="gh-text-view">${r.data||"Sem conteúdo."}</div></div>`;else if(r.type==="FAQ")u='<div class="gh-faq-list">'+(r.data||[]).map((m,h)=>`
                         <div class="gh-accordion" id="gh-faq-${a.id}-${c}-${h}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${a.id}-${c}-${h}')">
                                   <div class="gh-accordion-title">${m.q||"Pergunta sem título"}</div>
                                   <span class="gh-accordion-icon">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                   </span>
                              </div>
                              <div class="gh-accordion-content gh-text-view">${m.a||"Sem resposta."}</div>
                         </div>
                     `).join("")+"</div>";else if(r.type==="DOCUMENTO"&&r.data&&r.data.path){const p=r.data.mimetype&&r.data.mimetype.startsWith("image/"),m=r.data.mimetype==="application/pdf";let h="";p?h=`<div class="doc-embed-container"><img src="${r.data.path}" alt="${r.data.name}" class="doc-embed-image" /></div>`:m?h=`<div class="doc-embed-container" style="display: block;"><iframe src="${r.data.path}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="doc-embed-pdf" title="${r.data.name}"></iframe></div>`:h='<div class="doc-embed-container" style="padding: 20px; text-align: center; color: var(--text-muted);"><p>Visualização não disponível para este formato.</p></div>',u=`
                        <div class="gh-doc-container">
                            ${h}
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
                 `}).join("");n+=i,n+="</div>"}),e.innerHTML=o,t.innerHTML=n},filterProcedureContent(t){t=t.toLowerCase();const e=document.getElementById("procedure-view-container");if(!e)return;e.querySelectorAll(".gh-box").forEach(o=>{const a=o.querySelector(".gh-faq-list");let s=!1;const i=o.querySelector(".gh-header"),r=i?i.textContent.toLowerCase().includes(t):!1;a&&a.querySelectorAll(".gh-accordion").forEach(d=>{const p=d.textContent.toLowerCase();r||p.includes(t)?(d.classList.remove("hidden"),s=!0):d.classList.add("hidden")});const c=o.textContent.toLowerCase();r||c.includes(t)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const t=document.getElementById("procedure-edit-index"),e=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!t)return;t.innerHTML=E.summaries.map((a,s)=>`
             <li class="sidebar-index-item ${a.id===B?"active":""} editable-section style-none"
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
            `).join("");const o=E.summaries.find(a=>a.id===B);o?(n.textContent=o.title,n.style.color="var(--text-main)",e.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",e.classList.add("hidden"))},selectSummary(t){B=t,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(t,e){const n=E.summaries.find(a=>a.id===t);n&&(n.title=e||"Sem título"),this.renderProcedureBuilderSidebar();const o=E.summaries.find(a=>a.id===B);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const t="sum_"+Date.now();E.summaries.push({id:t,title:`Sumário ${E.summaries.length+1}`,sections:[]}),B=t,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(t){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(E.summaries=E.summaries.filter(e=>e.id!==t),B===t&&(B=E.summaries.length>0?E.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const t=document.getElementById("procedure-edit-container");if(!t)return;if(!B){t.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const e=E.summaries.find(o=>o.id===B);if(!e)return;const n=e.sections;if(n.length===0){t.innerHTML=`<p class="empty-state">Nenhum campo em "${e.title}". Clique em "+ Novo Container" para começar.</p>`;return}t.innerHTML=n.map((o,a)=>`
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
             </div>`).join("")},handleSumDragStart(t,e){xe="summary",X=e,t.dataTransfer.effectAllowed="move",setTimeout(()=>{t.target&&t.target.classList.add("dragging")},0)},handleSumDrop(t,e){if(t.preventDefault(),xe!=="summary"||X===null||X===e)return;const n=E.summaries.splice(X,1)[0];E.summaries.splice(e,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(t,e,n){xe="container",X=e,ct=n,t.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=t.target.nodeType===1?t.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(t){t.preventDefault(),t.dataTransfer.dropEffect="move"},handleSecDrop(t,e,n){if(t.preventDefault(),xe!=="container"||X===null||ct!==n)return;const o=E.summaries.find(s=>s.id===n);if(!o||X===e)return;const a=o.sections.splice(X,1)[0];o.sections.splice(e,0,a),this.renderProcedureBuilder()},handleDragEnd(t){document.querySelectorAll(".editable-section.dragging").forEach(e=>e.classList.remove("dragging")),t&&t.target&&t.target.setAttribute&&t.target.setAttribute("draggable","false"),xe=null,X=null},updateSectionTitle(t,e){const n=E.summaries.find(o=>o.id===B);n&&(n.sections[t].title=e)},updateSectionData(t,e){const n=E.summaries.find(o=>o.id===B);n&&(n.sections[t].data=e)},removeSection(t){const e=E.summaries.find(n=>n.id===B);e&&e.sections.splice(t,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(t){const e=E.summaries.find(n=>n.id===B);e&&(e.sections[t].data=e.sections[t].data||[],e.sections[t].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(t,e,n,o){const a=E.summaries.find(s=>s.id===B);a&&(a.sections[t].data[e][n]=o)},removeFaqItem(t,e){const n=E.summaries.find(o=>o.id===B);n&&n.sections[t].data.splice(e,1),this.renderProcedureBuilder()},addSection(t,e){if(!B){alert("Selecione primeiro um sumário na barra lateral.");return}const n=E.summaries.find(o=>o.id===B);n&&(n.sections.push({id:Date.now(),title:t,type:e,data:e==="FAQ"?[]:e==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(t,e){e.dataTransfer.files&&e.dataTransfer.files.length>0&&await this.uploadSectionFile(t,e.dataTransfer.files[0])},async handleSectionFileUpload(t,e){const n=e.files[0];n&&await this.uploadSectionFile(t,n)},async uploadSectionFile(t,e){const n=new FormData;n.append("file",e);try{const o=await L.upload("/upload",n),a=E.summaries.find(s=>s.id===B);a&&(a.sections[t].data={name:e.name,path:o.path,mimetype:e.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const t=parseInt(l.getValue("proc-id"));if(!t)return;const n={...ee.find(o=>o.id===t),content:JSON.stringify(E)};try{await L.put(`/procedures/${t}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(t),this.fetch()}catch{alert("Erro ao salvar")}},search(t){_=1;const e=ee.filter(n=>(n.name||n.title||"").toLowerCase().includes(t)||(n.responsible||"").toLowerCase().includes(t)||(n.group_name||"").toLowerCase().includes(t));this.renderTable(e)},changePage(t){_=t,this.renderTable(He)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${_===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${_-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=e;c++)(c===1||c===e||c>=_-1&&c<=_+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===_?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${_===e?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${_+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(_-1)*Ee+1,r=Math.min(_*Ee,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};window.toggleGhAccordion=function(t){const e=document.getElementById(t);e&&e.classList.toggle("open")};let j=[],pe="list",ie="month",T=new Date,R=1;const $e=10;let dt=[];const P={async fetch(){try{R=1,j=await L.get("/accounts"),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(t){console.error("Falha ao obter contas",t)}},populateCompanyFilter(){const t=document.getElementById("dash-filter-company-dynamic-options");if(t){const e=new Set;t.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{e.add(a.value)});const n=[...new Set(j.map(a=>a.company_name).filter(Boolean))].sort((a,s)=>a.localeCompare(s));let o="";n.forEach(a=>{const s=e.has(a)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${a}" ${s}> <span>${a}</span></label>`}),t.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(t){if(!document.getElementById(`${t}-container`))return;const n=document.getElementById(`${t}-trigger`),o=document.getElementById(`${t}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",r=>{r.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(c=>{c!==o&&c.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const a=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(r=>r.value!=="Todos"),i=()=>{const r=s.filter(u=>u.checked).map(u=>u.value),c=n.querySelector(".trigger-label");a.checked||s.length>0&&r.length===s.length?(a.checked=!0,c&&(c.innerText="Todos")):r.length===0?c&&(c.innerText="Nenhum"):r.length===1?c&&(c.innerText=r[0]):c&&(c.innerText=`${r.length} selecionados`)};a&&!a.dataset.listenerBound&&(a.addEventListener("change",()=>{s.forEach(r=>{r.checked=a.checked}),i(),this.renderDashboard()}),a.dataset.listenerBound="true"),s.forEach(r=>{r.dataset.listenerBound||(r.addEventListener("change",()=>{s.every(u=>u.checked)?a.checked=!0:a.checked=!1,i(),this.renderDashboard()}),r.dataset.listenerBound="true")}),i()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",t=>{t.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(e=>{e.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(t){const e=document.getElementById(`${t}-dropdown`);if(!e)return["Todos"];const n=e.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(e.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(t=>{const e=document.getElementById(`${t}-dropdown`);if(e){e.querySelectorAll('input[type="checkbox"]').forEach(a=>{a.checked=a.value==="Todos"});const o=document.getElementById(`${t}-trigger`);if(o){const a=o.querySelector(".trigger-label");a&&(a.innerText="Todos")}}})},getAccounts(){return j},setAccountsViewMode(t){pe=t,this.handleSearch()},setCalendarSubView(t){ie=t,this.handleSearch()},shiftCalendarDate(t){ie==="day"?T.setDate(T.getDate()+t):ie==="month"?T.setMonth(T.getMonth()+t):ie==="year"&&T.setFullYear(T.getFullYear()+t),l.setValue("filter-day",T.getDate()),l.setValue("filter-month",T.getMonth()),l.setValue("filter-year",T.getFullYear()),this.handleSearch()},handleFilterChange(t=!1){if(t){const e=l.getValue("filter-cal-year")?parseInt(l.getValue("filter-cal-year")):T.getFullYear(),n=l.getValue("filter-cal-month")?parseInt(l.getValue("filter-cal-month")):T.getMonth();T=new Date(e,n,1)}else{const e=l.getValue("filter-year")?parseInt(l.getValue("filter-year")):T.getFullYear(),n=l.getValue("filter-month")?parseInt(l.getValue("filter-month")):T.getMonth(),o=l.getValue("filter-day")?parseInt(l.getValue("filter-day")):T.getDate();T=new Date(e,n,o)}l.setValue("filter-month",T.getMonth()),l.setValue("filter-year",T.getFullYear()),this.handleSearch()},handleSearch(){const t=(l.getValue("accounts-search")||"").toLowerCase();let e=j.filter(n=>n.company_name.toLowerCase().includes(t)||n.description&&n.description.toLowerCase().includes(t));if(pe==="list"){R=1;const n=l.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),a=o?o.checked:!1,s=T.getFullYear(),i=T.getMonth(),r=T.getDate();e=e.filter(c=>{if(n&&c.status!==n)return!1;if(!a||!c.due_date)return!0;const[u,d,p]=c.due_date.split("-"),m=parseInt(u,10),h=parseInt(d,10)-1,g=parseInt(p,10);return c.type==="Único"?m===s&&h===i&&g===r:c.type==="Recorrente"?g===r:!0}),this.renderAccountsList(e)}else pe==="notificacoes"?this.renderNotifications():pe==="dashboard"?this.renderDashboard():this.renderCalendarWrapper(e)},checkAccountAlerts(){let t=!1;const e=new Date;e.setHours(0,0,0,0),j.forEach(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a==="on"&&s==="pendente"&&o.due_date){const[i,r,c]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(c,10));u.setHours(0,0,0,0),u.getTime()<=e.getTime()&&(t=!0)}});const n=document.getElementById("icon-alert-bell");n&&(t?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const t=document.getElementById("accounts-notifications-body");if(!t)return;t.innerHTML="";const e=new Date;e.setHours(0,0,0,0);let n=j.filter(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a!=="on"||s!=="pendente"||!o.due_date)return!1;const[i,r,c]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(c,10));return u.setHours(0,0,0,0),u.getTime()<=e.getTime()});if(n.length===0){t.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const a=document.createElement("tr");let s="Sem Data";if(o.due_date){const r=o.due_date.split("-");r.length===3&&(s=`${r[2]}/${r[1]}/${r[0]}`)}const i=F.isAdmin()?`
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
            `,t.appendChild(a)})},renderAccountsList(t){const e=document.getElementById("accounts-table-body");if(!e)return;e.innerHTML="",this.renderSidebarMiniCalendar(),dt=t;const n=t.length,o=Math.ceil(n/$e);R>o&&(R=Math.max(1,o)),R<1&&(R=1);const a=(R-1)*$e,s=t.slice(a,a+$e);if(s.length===0){e.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(i=>{const r=document.createElement("tr");let c="Sem Data";if(i.due_date){const p=i.due_date.split("-");p.length===3&&(c=`${p[2]}/${p[1]}/${p[0]}`)}const u=i.status==="Off",d=F.isAdmin()?`
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
            `,e.appendChild(r)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(pe!=="dashboard")return;this.initDashboardMultiselects();const t=l.getValue("dash-filter-start"),e=l.getValue("dash-filter-end"),n=l.getValue("dash-filter-type")||"Todos",o=l.getValue("dash-filter-status")||"Todos",a=l.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),i=this.getMultiselectValues("dash-filter-company");let r=t?new Date(t+"T00:00:00"):null,c=e?new Date(e+"T23:59:59"):null;if(!r&&!c){const b=new Date;r=new Date(b.getFullYear(),b.getMonth(),1,0,0,0),c=new Date(b.getFullYear(),b.getMonth()+1,0,23,59,59)}else r?c||(c=new Date(2100,11,31)):r=new Date(2e3,0,1);let u=0,d=0,p=new Set,m=new Set,h=0,g=0,y=0,f="-",w=0,$=0,k={},N={},V={};j.forEach(b=>{if(!b.due_date||n!=="Todos"&&b.type!==n||o!=="Todos"&&b.status!==o||a!=="Todos"&&b.payment_status!==a)return;if(!s.includes("Todos")){if(s.length===0)return;const C=b.category||"Outros";if(!s.includes(C))return}if(!i.includes("Todos")&&(i.length===0||!i.includes(b.company_name)))return;let A=0,O=new Date(r);O.setHours(0,0,0,0);let G=new Date(c);G.setHours(0,0,0,0);let Y=3650;for(;O<=G&&Y>0;){if(this.isEventOnDate(b,O.getFullYear(),O.getMonth(),O.getDate())){A++;const C=`${O.getFullYear()}-${String(O.getMonth()+1).padStart(2,"0")}`;V[C]||(V[C]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const J=parseFloat(b.value||0);V[C].total+=J,b.payment_status==="Pago"&&(V[C].pago+=J),b.payment_status==="Pendente"&&(V[C].pendente+=J),b.type==="Recorrente"&&(V[C].fixo+=J),b.type==="Único"&&(V[C].variavel+=J)}O.setDate(O.getDate()+1),Y--}if(A>0){const C=parseFloat(b.value||0)*A;u+=C,d+=A,p.add(b.category||"Outros"),m.add(b.company_name),b.payment_status==="Pago"&&(h+=C),b.payment_status==="Pendente"&&(g+=C),b.type==="Recorrente"&&(w+=C),b.type==="Único"&&($+=C),C>y&&(y=C,f=b.company_name);const J=b.category||"Outros";N[J]=(N[J]||0)+C;const ue=b.company_name||"Sem Empresa";k[ue]=(k[ue]||0)+C}}),l.setText("dash-metric-valor","R$ "+u.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-contas",d.toString()),l.setText("dash-metric-tipos",p.size.toString()),l.setText("dash-metric-empresas",m.size.toString()),l.setText("dash-metric-pago","R$ "+h.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-pendente","R$ "+g.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-maior-valor","R$ "+y.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-maior-nome",f),l.setText("dash-metric-fixo","R$ "+w.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-variavel","R$ "+$.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const x=l.getValue("dash-sort-empresas")||"desc",D=l.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",k,x),this.renderTierList("dash-list-categorias",N,D),this.renderTimeChart(V)},renderTimeChart(t){window.timeChartInstance&&window.timeChartInstance.destroy();const e=document.getElementById("chart-dashboard-time");if(!e)return;const n=Object.keys(t).sort(),o=n.map(d=>{const[p,m]=d.split("-");return`${m}/${p}`}),a=n.map(d=>t[d].total),s=n.map(d=>t[d].pago),i=n.map(d=>t[d].pendente),r=n.map(d=>t[d].fixo),c=n.map(d=>t[d].variavel),u={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:a,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:i,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:r,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:c,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(d){let p=d.dataset.label||"";return p&&(p+=": "),d.parsed.y!==null&&(p+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(d.parsed.y)),p}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(d,p,m){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(d)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(e.getContext("2d"),u)},renderTierList(t,e,n){const o=document.getElementById(t);if(!o)return;const a=Object.entries(e);if(a.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}a.sort((r,c)=>n==="asc"?r[1]-c[1]:c[1]-r[1]);const s=a.slice(0,10);let i="";s.forEach(([r,c],u)=>{const d=u===0&&n==="desc",p=d?"🏆 ":u+1+". ";i+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${d?"bold":"normal"}; color: ${d?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${r}">
                        ${p}${r}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${c.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=i},renderCharts(t){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const e=document.getElementById("chart-category");if(e){const o={labels:Object.keys(t),datasets:[{data:Object.values(t),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(e.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],a=[];let s=new Date;for(let i=-5;i<=6;i++){let r=new Date(s.getFullYear(),s.getMonth()+i,1);o.push(r.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let c=0;j.forEach(u=>{if(!u.due_date||u.status==="Off")return;const[d,p]=u.due_date.split("-"),m=new Date(parseInt(d),parseInt(p)-1,1);(u.type==="Recorrente"&&r.getTime()>=m.getTime()||u.type==="Único"&&r.getFullYear()===parseInt(d)&&r.getMonth()===parseInt(p)-1)&&(c+=parseFloat(u.value||0))}),a.push(c)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:a,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(t){const e={},n=[];return t.forEach(o=>{if(o.type==="Único")n.push(o);else if(!e[o.company_name])e[o.company_name]=o;else{const a=new Date(e[o.company_name].due_date||0);new Date(o.due_date||0)>a&&(e[o.company_name]=o)}}),[...n,...Object.values(e)]},isEventOnDate(t,e,n,o){if(!t.due_date)return!1;const[a,s,i]=t.due_date.split("-"),r=parseInt(a,10),c=parseInt(s,10)-1,u=parseInt(i,10);if(t.type==="Único")return e===r&&n===c&&o===u;if(t.type==="Recorrente"){const d=new Date(r,c,u).setHours(0,0,0,0);if(new Date(e,n,o).setHours(0,0,0,0)<d)return!1;const m=t.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(m)){const h=(e-r)*12+(n-c),g=new Date(e,n+1,0).getDate(),y=Math.min(u,g);if(o!==y||h<0)return!1;if(m==="1 mes")return!0;if(m==="3 meses")return h%3===0;if(m==="6 meses")return h%6===0;if(m==="1 ano")return n===c}else{const h=Date.UTC(r,c,u),g=Date.UTC(e,n,o),y=Math.round((g-h)/(1e3*60*60*24));if(m==="1 dia")return!0;if(m==="7 dias")return y%7===0;if(m==="15 dias")return y%15===0}}return!1},renderCalendarWrapper(t){const e=T.getFullYear(),n=T.getMonth(),o=T.getDate();ie==="month"?this.renderCalendarMonth(t,e,n):ie==="year"?this.renderCalendarYear(t,e):ie==="day"&&this.renderCalendarDay(t,e,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const t=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],e=T.getFullYear(),n=T.getMonth(),o=T.getDate(),a=new Date(e,n,1).getDay(),s=new Date(e,n+1,0).getDate(),i=new Date,r=i.getFullYear(),c=i.getMonth(),u=i.getDate(),d=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let p="";d.forEach((g,y)=>{p+=`<option value="${y}" ${y===n?"selected":""}>${g}</option>`});let m="";for(let g=r-5;g<=r+5;g++)m+=`<option value="${g}" ${g===e?"selected":""}>${g}</option>`;let h=`
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
        `;for(let g=0;g<a;g++)h+='<div class="smc-day empty"></div>';for(let g=1;g<=s;g++)h+=`<div class="smc-day ${g===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${e}, ${n}, ${g})">${g}</div>`;h+="</div>",t.forEach(g=>{g&&(g.innerHTML=h)})},changeMiniCalendarMonthYear(t,e){let n=T.getDate();const o=new Date(t,parseInt(e)+1,0).getDate();n>o&&(n=o),T=new Date(t,e,n);try{l.setValue("filter-cal-year",t),l.setValue("filter-cal-month",e)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(t,e,n){T=new Date(t,e,n);try{l.setValue("filter-cal-year",t),l.setValue("filter-cal-month",e)}catch{}if(pe==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(t,e,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];l.setText("calendar-date-display",`${o[n]} ${e}`);const a=document.getElementById("calendar-month-grid");a.innerHTML="";const s=new Date(e,n,1).getDay(),i=new Date(e,n+1,0).getDate(),r=new Date,c=r.getFullYear()===e&&r.getMonth()===n;new Date(r.getFullYear(),r.getMonth(),1);for(let d=0;d<s;d++)a.innerHTML+='<div class="calendar-day empty"></div>';for(let d=1;d<=i;d++){const p=c&&r.getDate()===d?"today":"";a.innerHTML+=`<div class="calendar-day ${p}" id="cal-day-cell-${d}">
                <div class="calendar-date">${d}</div>
                <div class="calendar-events" id="cal-events-${d}"></div>
            </div>`}this.getLatestRecorrenteAccounts(t).forEach(d=>{if(!d.due_date)return;const p=new Date(e,n,1),m=new Date(r.getFullYear(),r.getMonth(),1);let h=!0;if(d.status==="Off"&&p.getTime()>=m.getTime()&&(h=!1),!!h){for(let g=1;g<=i;g++)if(this.isEventOnDate(d,e,n,g)){const y=document.getElementById(`cal-events-${g}`);if(y){const f=`${e}-${String(n+1).padStart(2,"0")}-${String(g).padStart(2,"0")}`;let w=d.payment_status==="Pago"?"event-paid":d.payment_status==="Pendente"?"event-pending":"event-canceled";d.type==="Recorrente"&&f!==d.due_date&&(w="event-pending");const $=document.createElement("div");$.className=`event-pill event-${d.type.toLowerCase()} ${w}`,$.title=d.company_name,$.innerText=d.company_name,$.onclick=k=>{this.openDedicatedPage(d.id,f)},y.appendChild($)}}}})},renderCalendarDay(t,e,n,o){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];l.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${a[n]} de ${e}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const i=new Date(e,n,o),r=new Date;r.setHours(0,0,0,0),i.setHours(0,0,0,0);let c=0;this.getLatestRecorrenteAccounts(t).forEach(d=>{let p=!0;if(d.status==="Off"&&i.getTime()>=r.getTime()&&(p=!1),!!p&&this.isEventOnDate(d,e,n,o)){c++;const m=`${e}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let h=d.payment_status==="Pago"?"#4ade80":d.payment_status==="Pendente"?"#facc15":"#ef4444";d.type==="Recorrente"&&m!==d.due_date&&(h="#facc15"),s.innerHTML+=`
                    <div class="day-event-row ${d.type.toLowerCase()}">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${h}; margin-top: 5px;"></div>
                        <div class="day-evt-info">
                            <h4>${d.company_name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8">(${d.type} - ${d.category||"Outros"})</span></h4>
                            <p style="font-weight: bold; color: var(--text-main); margin: 4px 0;">R$ ${parseFloat(d.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                            <p>${d.description||"Nenhuma descrição detalhada."}</p>
                        </div>
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${d.id}, '${m}')" title="Detalhes">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                `}}),c===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(t,e){l.setText("calendar-date-display",`Ano de ${e}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],a=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const i=new Date(e,s,1);let r=0,c=0,u=0;this.getLatestRecorrenteAccounts(t).forEach(m=>{let h=!0;if(m.status==="Off"&&i.getTime()>=a.getTime()&&(h=!1),!h)return;const g=new Date(e,s+1,0).getDate();for(let y=1;y<=g;y++)this.isEventOnDate(m,e,s,y)&&(r++,m.type==="Recorrente"?c++:u++)});const p=r>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${p}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${r}</strong></p>
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${c}</p>`:""}
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${u}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(t){T.setMonth(t),l.setValue("filter-month",t),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(t=null){document.getElementById("account-form").reset();const e=document.getElementById("account-type");if(e.onchange=()=>{e.value==="Recorrente"?l.show("account-frequency-group"):l.hide("account-frequency-group")},t){l.setText("account-modal-title","Editar Conta");const n=j.find(o=>o.id===t);n&&(l.setValue("account-id",n.id),l.setValue("account-company",n.company_name),l.setValue("account-type",n.type),l.setValue("account-category",n.category||"Outros"),l.setValue("account-frequency",n.frequency||"1 mes"),l.setValue("account-value",parseFloat(n.value||0).toFixed(2)),l.setValue("account-status",n.status),l.setValue("account-payment-status",n.payment_status||"Pendente"),l.setValue("account-due-date",n.due_date||""),l.setValue("account-description",n.description||""),l.setValue("account-observation",n.observation||""),e.onchange())}else l.setText("account-modal-title","Nova Conta"),l.setValue("account-id",""),e.onchange();l.show("account-modal-form")},openDedicatedPage(t,e=null){const n=j.find(m=>m.id===t);if(!n)return;let o=j.filter(m=>m.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((m,h)=>new Date(h.due_date||0)-new Date(m.due_date||0)),l.hide("accounts-section"),l.show("dedicated-account-page"),l.setText("ded-acc-company",n.company_name);let a=0,s=0,i=0;const r=new Date;r.setHours(0,0,0,0),this.currentCompanyHistory.forEach(m=>{const h=parseFloat(m.value||0);if(m.payment_status==="Pago")a+=h,i++;else if(m.payment_status==="Pendente"&&m.due_date){const[g,y,f]=m.due_date.split("-"),w=new Date(parseInt(g,10),parseInt(y,10)-1,parseInt(f,10));w.setHours(0,0,0,0),w.getTime()<r.getTime()&&(s+=h)}});const c=a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),u=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});l.setText("ded-acc-total-paid","R$ "+c),l.setText("ded-acc-total-pending","R$ "+u),l.setText("ded-acc-total-count",i.toString());const d=document.getElementById("ded-acc-status-badge");n.status==="On"?d.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':d.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,e);const p=document.getElementById("btn-ded-add-history");p&&(p.onclick=()=>{this.openAccountModal(),setTimeout(()=>{l.setValue("account-company",n.company_name),l.setValue("account-type",n.type),l.setValue("account-category",n.category)},100)},F.isAdmin()||(p.style.display="none"))},injectCurrentMonthProjections(t){const e=new Date,n=e.getFullYear(),o=e.getMonth(),a=new Date(n,o+1,0).getDate();let s=null;if(t.forEach(c=>{c.type==="Recorrente"&&(s?new Date(c.due_date||0)>new Date(s.due_date||0)&&(s=c):s=c)}),!s)return t;const i=[...t],r=new Set(t.map(c=>c.due_date));for(let c=1;c<=a;c++)if(this.isEventOnDate(s,n,o,c)){const u=`${n}-${String(o+1).padStart(2,"0")}-${String(c).padStart(2,"0")}`;r.has(u)||i.push({...s,is_projection:!0,due_date:u,payment_status:"Pendente",unique_key:s.id+"_"+u})}return i.forEach(c=>{c.unique_key||(c.unique_key=c.id.toString())}),i},renderDedicatedHistoryList(){const t=document.getElementById("ded-acc-history-list");if(t){if(t.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){t.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(e=>{let n="Sem Data";if(e.due_date){const i=e.due_date.split("-");i.length===3&&(n=`${i[2]}/${i[1]}/${i[0]}`)}const o=parseFloat(e.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let a="#eab308";e.payment_status==="Pago"?a="#4ade80":e.payment_status==="Cancelado"&&(a="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==e.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===e.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(e.id,e.is_projection?e.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${a}22; color: ${a}; font-size: 0.75rem;">${e.payment_status||"Pendente"}</span>
                </div>
            `,t.appendChild(s)})}},selectHistoryItem(t,e=null){this.currentSelectedHistoryKey=e?t+"_"+e:t.toString(),this.renderDedicatedHistoryList();let n=null;if(e&&(n=this.currentCompanyHistory.find(r=>r.id===t&&r.due_date===e&&r.is_projection)),n||(n=this.currentCompanyHistory.find(r=>r.id===t&&!r.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){l.show("ded-acc-details-empty"),l.hide("ded-acc-details-content");return}l.hide("ded-acc-details-empty"),l.show("ded-acc-details-content");let o="DD/MM/YYYY";const a=e||n.due_date;if(a){const r=a.split("-");r.length===3&&(o=`${r[2]}/${r[1]}/${r[0]}`)}l.setText("ded-acc-det-date",o),l.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),l.setValue("ded-acc-det-date-input",a||""),l.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),l.setValue("ded-acc-det-account-status-input",n.status||"On"),l.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(l.show("ded-acc-det-freq-group"),l.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):l.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const r={...n,value:l.getValue("ded-acc-det-val-input"),due_date:l.getValue("ded-acc-det-date-input"),payment_status:l.getValue("ded-acc-det-status-input"),status:l.getValue("ded-acc-det-account-status-input"),observation:l.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?l.getValue("ded-acc-det-freq-input"):"1 mes"};try{await L.put(`/accounts/${n.id}`,r),alert("Fatura atualizada com sucesso!"),await this.fetch(),this.currentCompanyHistory=j.filter(c=>c.company_name===n.company_name).sort((c,u)=>new Date(u.due_date||0)-new Date(c.due_date||0)),this.openDedicatedPage(n.id)}catch{alert("Erro ao atualizar fatura.")}},F.isAdmin()||(s.style.display="none"));const i=document.getElementById("btn-ded-delete-account");i&&(i.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await L.delete(`/accounts/${n.id}`),await this.fetch();const r=j.filter(c=>c.company_name===n.company_name);r.length>0?this.openDedicatedPage(r[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},F.isAdmin()||(i.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(t){document.getElementById("ded-acc-file-input");const e=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),t.attachment_path){l.hide("ded-acc-upload-area"),l.show("ded-acc-preview-area");const n=t.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),a=t.attachment_path.split("/").pop()||"documento";l.setText("ded-acc-preview-name",a);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async r=>{r.preventDefault();const c=s.innerText;s.innerText="Carregando...";try{const u=await fetch(t.attachment_path);if(!u.ok)throw new Error("Doc não encontrado");const d=await u.blob(),p=window.URL.createObjectURL(d);window.open(p,"_blank")}catch(u){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",u)}finally{s.innerText=c}},n?(o.innerHTML="",o.style.backgroundImage=`url('${t.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const i=document.getElementById("btn-ded-remove-attachment");i.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await L.put(`/accounts/${t.id}`,{...t,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=j.filter(r=>r.company_name===t.company_name).sort((r,c)=>new Date(c.due_date||0)-new Date(r.due_date||0)),this.selectHistoryItem(t.id)}catch{alert("Erro ao remover anexo")}},F.isAdmin()||(i.style.display="none")}else{if(l.show("ded-acc-upload-area"),l.hide("ded-acc-preview-area"),F.isAdmin())e.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,e.style.cursor="pointer";else{e.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',e.style.cursor="default";return}e.onclick=s=>{const i=document.getElementById("ded-acc-file-input");i&&s.target!==i&&i.click()},e.addEventListener("dragover",s=>{s.preventDefault(),e.style.borderColor="var(--accent)",e.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{e.style.borderColor="rgba(255,255,255,0.2)",e.style.background="rgba(0,0,0,0.1)"};e.addEventListener("dragleave",()=>{n()});const o=async s=>{if(!s)return;e.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const i=new FormData;i.append("file",s);try{const r=await fetch("/api/upload",{method:"POST",body:i}),c=await r.json();r.ok?(await L.put(`/accounts/${t.id}`,{...t,attachment_path:c.path}),await this.fetch(),this.currentCompanyHistory=j.filter(u=>u.company_name===t.company_name).sort((u,d)=>new Date(d.due_date||0)-new Date(u.due_date||0)),this.selectHistoryItem(t.id)):(alert(c.error||"Erro no upload"),this.selectHistoryItem(t.id))}catch(r){alert("Falha na comunicação: "+r.message),console.error("Upload Error:",r),this.selectHistoryItem(t.id)}};e.addEventListener("drop",async s=>{if(s.preventDefault(),n(),s.dataTransfer.files.length>0){const i=s.dataTransfer.files[0];await o(i)}});const a=document.getElementById("ded-acc-file-input");a&&(a.onclick=s=>{s.stopPropagation()},a.onchange=async s=>{const i=s.target.files[0];await o(i)})}},async save(t){t.preventDefault();const e=l.getValue("account-id"),n={company_name:l.getValue("account-company"),type:l.getValue("account-type"),category:l.getValue("account-category"),value:l.getValue("account-value"),status:l.getValue("account-status"),payment_status:l.getValue("account-payment-status"),due_date:l.getValue("account-due-date"),description:l.getValue("account-description"),observation:l.getValue("account-observation"),frequency:l.getValue("account-type")==="Recorrente"?l.getValue("account-frequency"):"1 mes"};try{const o=e?`/accounts/${e}`:"/accounts";e?await L.put(o,n):await L.post(o,n),l.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(t){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await L.delete(`/accounts/${t}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(t){R=t,this.renderAccountsList(dt)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${R===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${R-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=e;c++)(c===1||c===e||c>=R-1&&c<=R+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===R?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${R===e?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${R+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(R-1)*$e+1,r=Math.min(R*$e,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let ce=[],W={},ne=null,Ne=null,Ge=null,q=[],Re=[],Xe={},K={},ye,et,ze,je,pt,Oe;const gt={init(){ye=document.getElementById("timeline-event-form"),et=document.getElementById("view-visualizacao"),ze=document.getElementById("view-attention"),je=document.getElementById("view-anexo"),pt=document.getElementById("view-relatorio"),Oe=document.getElementById("view-config"),window.timelineHandler=gt,window.applyFilters=Tt,window.clearFilters=Lt,window.toggleFilters=It,window.handleDelete=$t,window.resetForm=ot,window.toggleAccordion=ht,window.handleFormSubmit=mt,window.editEvent=nt,window.deleteTopic=Mt,window.deleteSubtopic=At,window.handleTrackDragStart=Ht,window.handleTrackDragOver=_t,window.handleTrackDragEnd=Pt;const t=document.getElementById("timeline-topic-form");t&&t.addEventListener("submit",Dt);const e=document.getElementById("timeline-subtopic-form");e&&e.addEventListener("submit",St);const n=document.getElementById("topico");n&&n.addEventListener("change",u=>{tt(u.target.value)});const o=document.getElementById("em-ocorrencia");o&&o.addEventListener("change",u=>{const d=document.getElementById("fim"),p=document.getElementById("inicio");if(u.target.checked){if(!p.value){const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),p.value=m.toISOString().slice(0,16)}d.required=!1}else{const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),d.value=m.toISOString().slice(0,16),d.required=!0}});const a=document.getElementById("auto-refresh-toggle");a&&a.addEventListener("change",u=>{ft(u.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(u=>{u.addEventListener("click",d=>{const p=d.currentTarget.getAttribute("data-timeline-tab");Me(p)})}),ye&&ye.addEventListener("submit",mt);const s=document.getElementById("rep-filter-start"),i=document.getElementById("rep-filter-end"),r=document.getElementById("rep-filter-topic"),c=document.getElementById("rep-filter-subtopic");s&&s.addEventListener("change",()=>ke()),i&&i.addEventListener("change",()=>ke()),r&&r.addEventListener("change",u=>{Ct(u.target.value),ke()}),c&&c.addEventListener("change",()=>ke()),window.addEventListener("SectionChange",u=>{u.detail&&u.detail.section==="timeline"&&de().then(()=>{Z(),ut()})}),de().then(()=>{Z(),ut()})}};window.addEventListener("focus",()=>{et&&Z()});function tt(t,e=null){const n=document.getElementById("sub-topico");if(!n)return;const o=t?t.toLowerCase().trim():"";if(!o||!K[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',K[o].forEach(a=>{const s=document.createElement("option");s.value=a.toLowerCase(),s.textContent=a,e&&s.value===e.toLowerCase()&&(s.selected=!0),n.appendChild(s)}),e||(n.selectedIndex=1),n.classList.add("has-options")}async function de(){try{const t=await fetch("/api/timeline/config");if(!t.ok)throw new Error("Falha ao buscar configurações");const e=await t.json();q=e.topics||[],Re=e.subtopics||[],Xe={},K={},q.forEach(o=>{Xe[o.id]=o.color,K[o.id]=[]}),Re.forEach(o=>{const a=o.topic_id;K[a]&&K[a].push(o.name)}),Et();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&vt()}catch(t){console.error("Error loading config:",t)}}function Et(){const t=document.getElementById("topico");if(t){const o=t.value;t.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',q.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,t.appendChild(s)}),t.value=o}const e=document.getElementById("rep-filter-topic");if(e){const o=e.value;e.innerHTML='<option value="Todos">Todos</option>',q.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,e.appendChild(s)}),o&&[...e.options].some(a=>a.value===o)?e.value=o:e.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',q.forEach(o=>{const a=document.createElement("option");a.value=o.id,a.textContent=o.name,n.appendChild(a)}))}function Z(){fetch("/api/timeline/events").then(t=>{if(!t.ok)throw new Error("Failed to fetch");return t.json()}).then(t=>{ce=t,at(),ze&&ze.classList.contains("active")&&yt()}).catch(t=>{console.error("Error loading events:",t)})}function ut(){const t=document.getElementById("timeline-tab-anexo"),e=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())t&&t.classList.remove("role-hidden"),e&&e.classList.remove("role-hidden");else{t&&t.classList.add("role-hidden"),e&&e.classList.add("role-hidden");const o=je&&je.classList.contains("active"),a=Oe&&Oe.classList.contains("active");(o||a)&&Me("visualizacao")}}function Me(t){const e={visualizacao:{section:et,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:ze,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:je,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:pt,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:Oe,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(e).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),e[t]&&(e[t].section&&e[t].section.classList.add("active"),e[t].button&&e[t].button.classList.add("active")),t==="visualizacao"?(Z(),Te(!0)):t==="attention"?(yt(),Te(!0)):t==="relatorio"?(ke(),Te(!1)):(t==="config"&&vt(),Te(!1))}function Te(t){const e=document.getElementById("floating-refresh-control");if(e)if(t){e.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!ne&&ft(!0)}else e.classList.add("hidden"),ne&&(clearInterval(ne),ne=null)}function ft(t){ne&&(clearInterval(ne),ne=null),t&&(Z(),ne=setInterval(Z,6e4))}function mt(t){t.preventDefault();const e=ye.querySelector('button[type="submit"]');e&&(e.textContent="Salvando...",e.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async a=>{const s=await a.text();if(!a.ok)throw new Error(`Server error (${a.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),ot(),Me("visualizacao")}).catch(a=>{console.error("Error saving event:",a),alert("Erro ao salvar evento: "+a.message)}).finally(()=>{e&&(e.textContent="Salvar Evento",e.disabled=!1)})}function nt(t){const e=ce.find(s=>s.id===t);if(!e)return;document.getElementById("event-id").value=e.id,document.getElementById("nome").value=e.nome;const n=Ce(e.topico);document.getElementById("topico").value=n,tt(n,e.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=e.em_ocorrencia==1||e.em_ocorrencia==="true"||!e.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=e.inicio,document.getElementById("fim").value=e.fim||"",document.getElementById("descricao").value=e.descricao||"",document.getElementById("anotacao").value=e.anotacao||"",document.getElementById("cor").value=e.cor||"#000000",Me("anexo");const a=document.getElementById("btn-delete");a&&(a.style.display="block")}function ot(){ye&&ye.reset();const t=document.getElementById("event-id");t&&(t.value=""),tt("");const e=document.getElementById("fim");e&&(e.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function $t(){const t=document.getElementById("event-id").value;t&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Failed to delete");return e.json()}).then(()=>{alert("Evento excluído!"),ot(),Me("visualizacao")}).catch(e=>{console.error("Error deleting:",e),alert("Erro ao excluir: "+e.message)})}function Tt(t){const e=document.getElementById(`filter-start-${t}`),n=document.getElementById(`filter-end-${t}`),o=document.getElementById(`filter-sub-topic-${t}`),a=e&&e.value?new Date(e.value).getTime():null,s=n&&n.value?new Date(n.value).getTime():null,i=o?o.value:"";W[t]={start:a,end:s,subTopic:i},at()}function Lt(t){const e=document.getElementById(`filter-start-${t}`),n=document.getElementById(`filter-end-${t}`),o=document.getElementById(`filter-sub-topic-${t}`);e&&(e.value=""),n&&(n.value=""),o&&(o.value=""),W[t]=null,at()}function It(t){const e=document.getElementById(`filters-panel-${t}`),n=document.getElementById(`btn-toggle-${t}`);e&&n&&(e.classList.toggle("hidden"),n.classList.toggle("active"))}function ht(t){const e=document.getElementById(t);e&&e.classList.toggle("active")}function at(){const t=document.getElementById("timeline-tracks-container");if(!t)return;const e=Array.from(t.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId),n=q.map(a=>a.id);if(e.length!==n.length||!n.every(a=>e.includes(a))){t.innerHTML="";const a=window.auth&&window.auth.isAdmin(),s=a?'style="cursor: grab;"':"";q.forEach(i=>{const r=`
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
            `;t.insertAdjacentHTML("beforeend",r);const c=document.getElementById(`filter-sub-topic-${i.id}`);c&&K[i.id]&&K[i.id].forEach(u=>{const d=document.createElement("option");d.value=u.toLowerCase(),d.textContent=u,c.appendChild(d)})})}q.forEach(a=>{const s=document.getElementById(`track-${a.id}`),i=document.getElementById(`min-date-${a.id}`),r=document.getElementById(`max-date-${a.id}`);s&&(s.innerHTML=""),i&&(i.textContent=""),r&&(r.textContent="")}),ce.length!==0&&q.forEach(a=>{const s=a.id,i=ce.filter(f=>Ce(f.topico)===s);let r=i;W[s]&&W[s].subTopic&&(r=i.filter(f=>(f.sub_topico?f.sub_topico.toLowerCase():"")===W[s].subTopic.toLowerCase()));const c=W[s]&&W[s].start?W[s].start:new Date("2026-01-01T00:00:00").getTime(),u=W[s]&&W[s].end?W[s].end:Date.now();Bt(s,r,c,u);const d=c,p=u,m=p-d,h=document.getElementById(`min-date-${s}`),g=document.getElementById(`max-date-${s}`);h&&(h.textContent=new Date(d).toLocaleDateString()+" "+new Date(d).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),g&&(g.textContent=new Date(p).toLocaleDateString()+" "+new Date(p).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const y=document.getElementById(`track-${s}`);y&&r.forEach(f=>{const w=new Date(f.inicio).getTime(),$=f.fim?new Date(f.fim).getTime():Date.now();if($<d||w>p)return;const k=Math.max(w,d),N=Math.min($,p),V=(k-d)/m*100,x=(N-k)/m*100;if(x<=0)return;const D=document.createElement("div");D.className="timeline-bar",D.style.left=`${V}%`,D.style.width=`${x}%`,D.style.color=f.cor&&f.cor!=="#000000"?f.cor:Xe[s]||"#6b7280";const b=document.createElement("div");b.className="timeline-bar-visual",D.appendChild(b);const A=document.createElement("div");A.className="timeline-identifier-point";const O=new Date(f.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),G=f.fim?new Date(f.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",Y=a.name,C=f.sub_topico?f.sub_topico.charAt(0).toUpperCase()+f.sub_topico.slice(1):"-";A.setAttribute("data-tooltip",`Tópico: ${Y}
Eventos: ${C}
Início: ${O} - Fim: ${G}
Descrição: ${f.descricao||"-"}`),!f.fim&&A.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(A.style.cursor="pointer",A.onclick=ue=>{ue.stopPropagation(),nt(f.id)}):A.style.cursor="default",D.appendChild(A),y.appendChild(D)})})}function Ce(t){return t?t.toLowerCase().trim():""}function Bt(t,e,n,o){const a=document.getElementById(`sla-${t}`);if(!a)return;const s=o-n;if(s<=0){a.textContent="N/A";return}const r=e.filter(m=>{const h=new Date(m.inicio).getTime();return(m.fim?new Date(m.fim).getTime():Date.now())>n&&h<o}).map(m=>({start:Math.max(new Date(m.inicio).getTime(),n),end:Math.min(m.fim?new Date(m.fim).getTime():Date.now(),o)}));r.sort((m,h)=>m.start-h.start);const c=[];if(r.length>0){let m=r[0];for(let h=1;h<r.length;h++){const g=r[h];g.start<m.end?m.end=Math.max(m.end,g.end):(c.push(m),m=g)}c.push(m)}let u=0;c.forEach(m=>{u+=m.end-m.start});const d=(s-u)/s*100;let p="#10b981";d<50?p="#ef4444":d<90&&(p="#f97316"),a.style.color=p,a.textContent=d.toFixed(4)+"%"}function yt(){const t=document.getElementById("attention-topics-container");if(!t)return;t.innerHTML="";const e=ce.filter(n=>!n.fim);q.forEach(n=>{const o=n.id,a=e.filter(y=>Ce(y.topico)===o),s=document.createElement("div");s.className=a.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const i=document.createElement("div");i.className="accordion-header",i.onclick=()=>ht(`attn-acc-${o}`);const r=document.createElement("div");r.className="accordion-title-group";const c=document.createElement("div");c.className="topic-indicator",c.style.backgroundColor=n.color;const u=document.createElement("h3");u.textContent=n.name;const d=document.createElement("span");d.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",d.textContent=`${a.length}`,r.appendChild(c),r.appendChild(u),r.appendChild(d);const p=document.createElement("span");p.className="accordion-chevron",p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',i.appendChild(r),i.appendChild(p);const m=document.createElement("div");m.className="accordion-content";const h=document.createElement("div");h.className="accordion-body";const g=document.createElement("div");if(g.className="attention-carousel",a.length===0){const y=document.createElement("div");y.className="empty-state",y.textContent="Nenhum evento em andamento.",g.appendChild(y)}else a.forEach(y=>{const f=document.createElement("div");f.className="attention-card",f.style.borderLeftColor=y.cor&&y.cor!=="#000000"?y.cor:n.color;const w=document.createElement("h3");w.textContent=y.nome;const $=document.createElement("div");$.className="sub-topic",$.textContent=y.sub_topico||"-";const k=document.createElement("div");k.className="card-detail",k.innerHTML=`<strong>Início:</strong> ${new Date(y.inicio).toLocaleString()}`;const N=Date.now()-new Date(y.inicio).getTime(),V=document.createElement("div");V.className="card-duration",V.innerHTML=`<strong>Tempo:</strong> <span>${kt(N)}</span>`;const x=document.createElement("div");x.className="card-description",x.textContent=y.descricao||"-",f.appendChild(w),f.appendChild($),f.appendChild(k),f.appendChild(V),f.appendChild(x),window.auth&&window.auth.isAdmin()?(f.style.cursor="pointer",f.onclick=()=>nt(y.id)):f.style.cursor="default",g.appendChild(f)});h.appendChild(g),m.appendChild(h),s.appendChild(i),s.appendChild(m),t.appendChild(s)})}function kt(t){if(t<0)return"0s";const e=Math.floor(t/1e3),n=Math.floor(e/60),o=Math.floor(n/60),a=Math.floor(o/24),s=[];return a>0&&s.push(`${a}d`),(o%24>0||a>0)&&s.push(`${o%24}h`),(n%60>0||o>0)&&s.push(`${n%60}m`),s.push(`${e%60}s`),s.join(" ")}function Ct(t){const e=document.getElementById("rep-filter-subtopic");if(!e)return;e.innerHTML='<option value="Todos">Todos</option>';const n=t?t.toLowerCase().trim():"";n&&K[n]&&K[n].forEach(o=>{const a=document.createElement("option");a.value=o.toLowerCase(),a.textContent=o,e.appendChild(a)})}function ke(){let t=ce;const e=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,a=document.getElementById("rep-filter-subtopic")?.value;if(e){const x=new Date(e+"T00:00:00").getTime();t=t.filter(D=>new Date(D.inicio).getTime()>=x)}if(n){const x=new Date(n+"T23:59:59").getTime();t=t.filter(D=>new Date(D.inicio).getTime()<=x)}o&&o!=="Todos"&&(t=t.filter(x=>Ce(x.topico)===o.toLowerCase())),a&&a!=="Todos"&&(t=t.filter(x=>x.sub_topico&&x.sub_topico.toLowerCase()===a.toLowerCase()));const s=document.getElementById("rep-kpi-total"),i=document.getElementById("rep-kpi-active"),r=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=t.length);const c=t.filter(x=>x.em_ocorrencia==1||x.em_ocorrencia==="true"||!x.fim);i&&(i.textContent=c.length);const u=t.filter(x=>x.fim);let d="0h 0m";if(u.length>0){const D=u.reduce((G,Y)=>G+(new Date(Y.fim).getTime()-new Date(Y.inicio).getTime()),0)/u.length,b=Math.floor(D/6e4),A=Math.floor(b/60),O=b%60;d=`${A}h ${O}m`}if(r&&(r.textContent=d),!window.Chart){console.warn("Chart.js is not loaded.");return}const p=q,m=e?new Date(e+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),h=n?new Date(n+"T23:59:59").getTime():Date.now(),g=p.map(x=>x.name),y=p.map(x=>{const D=x.id,b=ce.filter(S=>Ce(S.topico)===D),A=h-m;if(A<=0)return 100;const G=b.filter(S=>{const Q=new Date(S.inicio).getTime();return(S.fim?new Date(S.fim).getTime():Date.now())>m&&Q<h}).map(S=>({start:Math.max(new Date(S.inicio).getTime(),m),end:Math.min(S.fim?new Date(S.fim).getTime():Date.now(),h)}));G.sort((S,Q)=>S.start-Q.start);const Y=[];if(G.length>0){let S=G[0];for(let Q=1;Q<G.length;Q++){const oe=G[Q];oe.start<S.end?S.end=Math.max(S.end,oe.end):(Y.push(S),S=oe)}Y.push(S)}const J=(S=>{let Q=0;return S.forEach(oe=>{Q+=oe.end-oe.start}),Q})(Y),ue=(A-J)/A*100;return parseFloat(ue.toFixed(4))}),f=p.map(x=>x.color||"#6b7280"),w=document.getElementById("chart-rep-sla");w&&(Ne&&Ne.destroy(),Ne=new window.Chart(w,{type:"bar",data:{labels:g,datasets:[{label:"Disponibilidade %",data:y,backgroundColor:f,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...y)-5),max:100,ticks:{callback:x=>x+"%"}}}}}));const $={};t.forEach(x=>{const D=x.sub_topico?x.sub_topico.charAt(0).toUpperCase()+x.sub_topico.slice(1).toLowerCase():"Não especificado";$[D]=($[D]||0)+1});const k=Object.keys($),N=Object.values($),V=document.getElementById("chart-rep-qty");V&&(Ge&&Ge.destroy(),Ge=new window.Chart(V,{type:"doughnut",data:{labels:k.length>0?k:["Nenhum evento"],datasets:[{data:N.length>0?N:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function Dt(t){t.preventDefault();const e=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!e||!n||!o)return;const a={id:e.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!a.id){alert("Por favor, defina um ID para o tópico.");return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>{alert("Tópico salvo com sucesso!"),e.value="",n.value="",o.value="#3b82f6",de().then(()=>{Z()})}).catch(s=>{console.error(s),alert("Erro: "+s.message)})}function St(t){t.preventDefault();const e=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!e||!n)return;const o={topic_id:e.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento.");return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(a=>{if(!a.ok)throw new Error("Erro ao adicionar evento");return a.json()}).then(()=>{alert("Evento adicionado!"),n.value="",de()}).catch(a=>{console.error(a),alert("Erro: "+a.message)})}function Mt(t){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Erro ao excluir tópico");return e.json()}).then(()=>{alert("Tópico excluído!"),de().then(()=>{Z()})}).catch(e=>{console.error(e),alert("Erro: "+e.message)})}function At(t){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Erro ao excluir evento");return e.json()}).then(()=>{alert("Evento excluído!"),de()}).catch(e=>{console.error(e),alert("Erro: "+e.message)})}function vt(){const t=document.getElementById("config-topics-list");t&&(t.innerHTML="",q.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':q.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(o)}));const e=document.getElementById("config-subtopics-list");e&&(e.innerHTML="",Re.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':Re.forEach(n=>{const o=q.find(r=>r.id===n.topic_id),a=o?o.name:n.topic_id,s=o?o.color:"#6b7280",i=document.createElement("div");i.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",i.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${a}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(i)}))}function Ht(t,e){t.currentTarget.classList.add("dragging"),t.dataTransfer.effectAllowed="move"}function _t(t){t.preventDefault();const e=document.querySelector(".timeline-container.dragging");if(!e)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const a=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const i=s.getBoundingClientRect();return t.clientY<=i.top+i.height/2});a?n.insertBefore(e,a):n.appendChild(e)}function Pt(t){const e=document.querySelector(".timeline-container.dragging");e&&e.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(a=>{a.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId);Ft(o)}function Ft(t){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:t})}).then(e=>{if(!e.ok)throw new Error("Erro ao salvar nova ordenação");return e.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),de().then(()=>{Z()})}).catch(e=>{console.error(e),alert("Erro ao salvar ordenação: "+e.message)})}let ge=[],Ue=[],Ye=[],Je=[],I="extensions",M=1,fe=100,We=[];const Le={setActiveTab(t){I=t,M=1;const e=document.getElementById("telephony-search");e&&(e.value="",t==="extensions"?e.placeholder="Pesquisar ramais por número, nome ou usuário...":t==="queues"?e.placeholder="Pesquisar filas por número ou nome...":t==="blf"?e.placeholder="Pesquisar BLF por nome...":t==="users"&&(e.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(s=>{s.id===`tab-telephony-${t}`?s.classList.add("active"):s.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(s=>{s.id===`telephony-view-${t==="users"?"users":t==="queues"?"queues":t}`?s.classList.remove("hidden"):s.classList.add("hidden")});const a=this.getActiveDataList();this.render(a)},getActiveDataList(){return I==="extensions"?ge:I==="queues"?Ue:I==="blf"?Ye:I==="users"?Je:[]},async fetch(){const t=this.getActiveTableBody();t&&(t.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(M=1,I==="extensions")ge=await L.get("/telephony/extensions"),this.render(ge);else if(I==="queues")Ue=await L.get("/telephony/queues"),this.render(Ue);else if(I==="blf"){if(ge.length===0)try{ge=await L.get("/telephony/extensions")}catch(e){console.warn("Could not pre-fetch extensions for BLF mapping:",e)}Ye=await L.get("/telephony/blfs"),this.render(Ye)}else I==="users"&&(Je=await L.get("/telephony/users"),this.render(Je))}catch(e){console.error(`Error fetching telephony ${I}:`,e),t&&(t.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${e.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return I==="extensions"?document.getElementById("telephony-table-body"):I==="queues"?document.getElementById("telephony-queues-table-body"):I==="blf"?document.getElementById("telephony-blf-table-body"):I==="users"?document.getElementById("telephony-users-table-body"):null},render(t){const e=this.getActiveTableBody();if(!e)return;We=t;const n=t.length,o=Math.ceil(n/fe);M>o&&(M=Math.max(1,o)),M<1&&(M=1);const a=(M-1)*fe,s=t.slice(a,a+fe);if(s.length===0){const i=I==="extensions"?7:I==="queues"?6:I==="blf"?4:5;e.innerHTML=`
                <tr>
                    <td colspan="${i}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}I==="extensions"?this.renderExtensionsList(e,s):I==="queues"?this.renderQueuesList(e,s):I==="blf"?this.renderBlfsList(e,s):I==="users"&&this.renderUsersList(e,s),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(t,e){t.innerHTML=e.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.ddr||"-",i=n.Username||"-",r=n.Secret||"",c=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",u=n.observacao||"-",d=r.replace(/'/g,"\\'");return`
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
            `}).join("")},renderQueuesList(t,e){t.innerHTML=e.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.Estrategia||"-",i=n.TimeoutAgente?`${n.TimeoutAgente}s`:"-",r=n.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',c=n.membros?n.membros.length:0,u=n.membros&&n.membros.length>0?n.membros.map(d=>`
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
            `}).join("")},renderBlfsList(t,e){t.innerHTML=e.map(n=>{const o=n.id,a=n.Nome||"-",s=n.quantidade_extensoes||0,i=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",r=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(c=>{const u=ge.find(m=>m.id===c||m.extensao_id===c),d=u?u.exten:`ID ${c}`,p=u?u.nome:"Não encontrado";return`
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
            `}).join("")},toggleQueueRow(t){const e=document.getElementById(`queue-details-${t}`),n=document.getElementById(`queue-arrow-${t}`);e&&(e.classList.toggle("hidden"),n&&(e.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(t){const e=document.getElementById(`blf-details-${t}`),n=document.getElementById(`blf-arrow-${t}`);e&&(e.classList.toggle("hidden"),n&&(e.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(t){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(t){M=1;const n=this.getActiveDataList().filter(o=>I==="extensions"?(o.exten||"").toLowerCase().includes(t)||(o.nome||"").toLowerCase().includes(t)||(o.Username||"").toLowerCase().includes(t)||(o.ddr||"").toLowerCase().includes(t)||(o.observacao||"").toLowerCase().includes(t):I==="queues"?(o.exten||"").toLowerCase().includes(t)||(o.nome||"").toLowerCase().includes(t)||(o.Estrategia||"").toLowerCase().includes(t):I==="blf"?(o.Nome||"").toLowerCase().includes(t):I==="users"?(o.username||"").toLowerCase().includes(t)||(o.email||"").toLowerCase().includes(t)||(o.Tipo||"").toLowerCase().includes(t):!1);this.render(n)},changePage(t){M=t,this.render(We)},setPageSize(t){fe=parseInt(t,10),M=1,this.render(We)},toggleSecret(t,e){const n=document.getElementById(`secret-txt-${t}`),o=document.getElementById(`secret-icon-${t}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=e,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${M===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${M-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=e;c++)(c===1||c===e||c>=M-1&&c<=M+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===M?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${M===e?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${M+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(M-1)*fe+1,r=Math.min(M*fe,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}},Ie=30;let Be="",Qe="all",_e="",Pe="",U=1,he=0,se="alerts",v=null,Fe=null;const it={init(){const t=document.getElementById("tab-monitoring-alerts");t&&t.addEventListener("click",()=>this.setActiveTab("alerts"));const e=document.getElementById("tab-monitoring-events");e&&e.addEventListener("click",()=>this.setActiveTab("events"));const n=document.getElementById("tab-monitoring-apis");n&&n.addEventListener("click",()=>this.setActiveTab("apis"));const o=document.getElementById("tab-monitoring-gnew");o&&o.addEventListener("click",()=>this.setActiveTab("gnew"));const a=document.getElementById("monitoring-events-search-input");a&&a.addEventListener("input",f=>{Be=f.target.value.toLowerCase(),U=1,this.fetchAndRenderEventHistory()});const s=document.getElementById("monitoring-events-severity-filter");s&&s.addEventListener("change",f=>{Qe=f.target.value,U=1,this.fetchAndRenderEventHistory()});const i=document.getElementById("monitoring-events-date-start"),r=document.getElementById("monitoring-events-date-end");i&&i.addEventListener("change",f=>{_e=f.target.value,U=1,this.fetchAndRenderEventHistory()}),r&&r.addEventListener("change",f=>{Pe=f.target.value,U=1,this.fetchAndRenderEventHistory()});const c=document.getElementById("btn-clear-event-date-filter");c&&c.addEventListener("click",()=>{_e="",Pe="",U=1,i&&(i.value=""),r&&(r.value=""),this.fetchAndRenderEventHistory()});const u=document.getElementById("btn-clear-event-history");u&&u.addEventListener("click",()=>this.clearEventHistory());const d=document.getElementById("btn-refresh-monitoring");d&&d.addEventListener("click",()=>this.fetchDiagnostics());const p=document.getElementById("gnew-disk-accordion-header");p&&p.addEventListener("click",()=>{const f=document.getElementById("gnew-disk-accordion-content"),w=document.getElementById("gnew-disk-chevron");f&&w&&(f.style.maxHeight==="0px"?(f.style.maxHeight="1000px",w.style.transform="rotate(0deg)"):(f.style.maxHeight="0px",w.style.transform="rotate(-90deg)"))});const m=document.getElementById("btn-refresh-gnew-disk");m&&m.addEventListener("click",f=>{f.stopPropagation(),this.fetchDiagnostics()});const h=document.getElementById("btn-refresh-gnew-services");h&&h.addEventListener("click",async()=>{const f=h,w=f.querySelector("svg");if(!f.disabled){f.disabled=!0,f.style.opacity="0.6",f.style.cursor="not-allowed",w&&(w.style.animation="spin 0.8s linear infinite");try{await this.fetchDiagnostics()}finally{f.disabled=!1,f.style.opacity="",f.style.cursor="pointer",w&&(w.style.animation="")}}});const g=document.getElementById("btn-refresh-apis-status");g&&g.addEventListener("click",()=>this.fetchAndRenderApisStatus());const y=document.getElementById("monitoring-auto-refresh");y&&(y.addEventListener("change",f=>{f.target.checked?this._startAutoRefresh():this._stopAutoRefresh()}),y.checked&&this._startAutoRefresh()),window.monitoringHandler=this},_startAutoRefresh(){this._stopAutoRefresh(),Fe=setInterval(()=>{(se==="alerts"||se==="gnew")&&this.fetchDiagnostics()},3e4)},_stopAutoRefresh(){Fe&&(clearInterval(Fe),Fe=null)},fetch(){this.setActiveTab("alerts"),this.fetchDiagnostics()},setActiveTab(t){se=t;const e=document.getElementById("tab-monitoring-alerts"),n=document.getElementById("tab-monitoring-events"),o=document.getElementById("tab-monitoring-apis"),a=document.getElementById("tab-monitoring-gnew");e&&e.classList.toggle("active",t==="alerts"),n&&n.classList.toggle("active",t==="events"),o&&o.classList.toggle("active",t==="apis"),a&&a.classList.toggle("active",t==="gnew");const s=document.getElementById("monitoring-tab-content-alerts"),i=document.getElementById("monitoring-tab-content-events"),r=document.getElementById("monitoring-tab-content-apis"),c=document.getElementById("monitoring-tab-content-gnew");s&&(s.classList.toggle("hidden",t!=="alerts"),s.classList.toggle("active",t==="alerts")),i&&(i.classList.toggle("hidden",t!=="events"),i.classList.toggle("active",t==="events")),r&&(r.classList.toggle("hidden",t!=="apis"),r.classList.toggle("active",t==="apis")),c&&(c.classList.toggle("hidden",t!=="gnew"),c.classList.toggle("active",t==="gnew")),t==="gnew"?this.fetchDiagnostics():t==="events"?(U=1,this.fetchAndRenderEventHistory()):t==="apis"?this.fetchAndRenderApisStatus():this.renderGnewServicesStatus()},render(){se==="alerts"?this.renderGnewServicesStatus():se==="events"?this.fetchAndRenderEventHistory():se==="apis"&&this.fetchAndRenderApisStatus()},renderGnewServicesStatus(){const t=document.getElementById("monitoring-alerts-grid");if(!t)return;if(t.style.display="flex",t.style.flexDirection="column",t.style.gap="0",!v||!v.servicos||!Array.isArray(v.servicos.servicos)||v.servicos.servicos.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">Nenhum dado de serviço disponível.</p>
                    <p style="font-size: 0.85rem;">Acesse a aba <strong>Gnew</strong> para carregar os dados do PABX.</p>
                </div>
            `;return}const e=v.servicos.servicos,n=e.length,o=e.filter(c=>c.status!=="active"&&c.status_label!=="ativo").length,a=n-o,s=document.getElementById("monitor-kpi-total"),i=document.getElementById("monitor-kpi-warning"),r=document.getElementById("monitor-kpi-info");s&&(s.textContent=n),i&&(i.textContent=o),r&&(r.textContent=a),t.innerHTML=`
            <div class="monitor-list">
                <div class="monitor-list-header">
                    <span class="monitor-list-col-name">Serviço</span>
                    <span class="monitor-list-col-status">Status</span>
                </div>
                ${e.map((c,u)=>{const d=c.status==="active"||c.status_label==="ativo",p=d?"#10b981":"#ef4444",m=d?"Online":c.status_label||c.status||"Offline",h=d?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",g=d?"#6ee7b7":"#fca5a5",y=d?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)";return`
                        <div class="monitor-list-row" style="background: ${u%2===0?"transparent":"rgba(255,255,255,0.015)"};">
                            <div class="monitor-list-col-name">
                                <span class="monitor-dot" style="background: ${p};"></span>
                                <span class="monitor-svc-name">${c.nome}</span>
                            </div>
                            <div class="monitor-list-col-status">
                                <span class="monitor-badge" style="background:${h}; color:${g}; border-color:${y};">${m}</span>
                            </div>
                        </div>`}).join("")}
            </div>`},async fetchAndRenderEventHistory(){const t=document.getElementById("monitoring-events-grid");if(t){t.innerHTML=`
            <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                <div class="event-history-loading">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" style="animation: spin 1s linear infinite; margin-bottom: 0.75rem; opacity: 0.5;">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <polyline points="1 20 1 14 7 14"></polyline>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <p style="font-size: 0.9rem;">Carregando histórico...</p>
                </div>
            </div>`;try{let e=await L.get("/monitoring/events?limit=1000");if(Be&&(e=e.filter(i=>(i.title||"").toLowerCase().includes(Be)||(i.description||"").toLowerCase().includes(Be)||(i.source||"").toLowerCase().includes(Be))),Qe!=="all"&&(e=e.filter(i=>i.severity===Qe)),_e){const i=new Date(_e+"T00:00:00").getTime();e=e.filter(r=>r.created_at?new Date(r.created_at).getTime()>=i:!1)}if(Pe){const i=new Date(Pe+"T23:59:59").getTime();e=e.filter(r=>r.created_at?new Date(r.created_at).getTime()<=i:!1)}he=e.length;const n=Math.max(1,Math.ceil(he/Ie));U>n&&(U=n);const o=document.getElementById("event-history-count");o&&(o.textContent=he>0?he:"",o.style.display=he>0?"inline-flex":"none");const a=(U-1)*Ie,s=e.slice(a,a+Ie);this.renderEvents(s),this.renderPagination(he,n)}catch(e){console.error("Erro ao buscar histórico de eventos:",e),t.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <p style="font-size: 0.9rem; color: #fca5a5;">Erro ao carregar o histórico de eventos.</p>
                    <p style="font-size: 0.8rem; margin-top: 4px;">${e.message}</p>
                </div>`}}},renderPagination(t,e){const n=document.getElementById("event-history-pagination");if(!n)return;if(e<=1){n.innerHTML="";return}const o=U,a=(o-1)*Ie+1,s=Math.min(o*Ie,t),i=[],r=2;let c=Math.max(1,o-r),u=Math.min(e,o+r);c>1&&(i.push('<button class="eh-page-btn" data-page="1">1</button>'),c>2&&i.push('<span class="eh-page-ellipsis">…</span>'));for(let d=c;d<=u;d++)i.push(`<button class="eh-page-btn${d===o?" active":""}" data-page="${d}">${d}</button>`);u<e&&(u<e-1&&i.push('<span class="eh-page-ellipsis">…</span>'),i.push(`<button class="eh-page-btn" data-page="${e}">${e}</button>`)),n.innerHTML=`
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
            </div>`,n.querySelectorAll(".eh-page-btn[data-page]").forEach(d=>{d.addEventListener("click",()=>{const p=parseInt(d.dataset.page,10);if(!isNaN(p)&&p>=1&&p<=e&&p!==U){U=p,this.fetchAndRenderEventHistory();const m=document.getElementById("monitoring-events-grid");m&&m.scrollIntoView({behavior:"smooth",block:"start"})}})})},renderEvents(t){const e=document.getElementById("monitoring-events-grid");if(!e)return;e.style.display="flex",e.style.flexDirection="column",e.style.gap="0";const n=t||[];if(n.length===0){e.innerHTML=`
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
                </div>`;return}const o={};n.forEach(s=>{const i=s.created_at?new Date(s.created_at).toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):"Data desconhecida";o[i]||(o[i]=[]),o[i].push(s)});const a=Object.entries(o).map(([s,i])=>{const r=i.map(c=>{const u=c.severity||"info";let d="Info",p="#3b82f6",m="rgba(59,130,246,0.12)",h="#93c5fd",g="rgba(59,130,246,0.3)",y="#3b82f6";u==="critical"?(d="Crítico",p="#ef4444",y="#ef4444",m="rgba(239,68,68,0.12)",h="#fca5a5",g="rgba(239,68,68,0.3)"):u==="warning"?(d="Alerta",p="#f59e0b",y="#f59e0b",m="rgba(245,158,11,0.12)",h="#fde047",g="rgba(245,158,11,0.3)"):u==="success"&&(d="Ok",p="#10b981",y="#10b981",m="rgba(16,185,129,0.12)",h="#6ee7b7",g="rgba(16,185,129,0.3)");const f=c.created_at?new Date(c.created_at):null,w=f?f.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}):"-",$=f?this._relativeTime(f):"",k=c.value_pct!=null?`${c.value_pct}%`:null;return`
                    <div class="event-history-row" style="border-left: 3px solid ${y};">
                        <div class="event-history-row-left">
                            <span class="monitor-dot" style="background: ${p}; flex-shrink: 0;"></span>
                            <div class="event-history-row-info">
                                <span class="event-history-row-title">${c.title}</span>
                                ${c.description?`<span class="event-history-row-desc">${c.description}</span>`:""}
                            </div>
                        </div>
                        <div class="event-history-row-meta">
                            ${k?`<span class="event-history-row-value">${k}</span>`:""}
                            <span class="monitor-badge" style="background:${m}; color:${h}; border-color:${g}; flex-shrink: 0;">${d}</span>
                            <div class="event-history-row-time">
                                <span class="event-time-clock">${w}</span>
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
                </div>`}).join("");e.innerHTML=`<div class="event-history-list">${a}</div>`},_relativeTime(t){const n=new Date-t,o=Math.floor(n/6e4),a=Math.floor(o/60),s=Math.floor(a/24);return n<6e4?"agora mesmo":o<60?`${o}min atrás`:a<24?`${a}h atrás`:s===1?"ontem":`${s} dias atrás`},updateKPIs(t,e){const n=t-e,o=document.getElementById("monitor-kpi-total"),a=document.getElementById("monitor-kpi-warning"),s=document.getElementById("monitor-kpi-info");o&&(o.textContent=t),a&&(a.textContent=e),s&&(s.textContent=n)},async fetchDiagnostics(){try{const t=await L.get("/monitoring/diagnostico?t="+Date.now()),e=t&&t.status==="online";if(this.updateGnewApiStatus(e,e?"Gnew Online":"Gnew Offline (Contingência)",t?t.message:""),t&&t.data)v=t.data,this.renderGnewDiagnostics();else throw new Error("Dados inválidos na resposta da API.")}catch(t){console.error("Erro ao buscar diagnósticos da Gnew:",t),this.updateGnewApiStatus(!1,"Erro de Conexão",t.message)}},updateGnewApiStatus(t,e,n){const o=document.getElementById("gnew-api-status-badge"),a=document.getElementById("gnew-api-message");if(o){o.className=`api-status-badge ${t?"online":"offline"}`,o.style.background=t?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",o.style.color=t?"#6ee7b7":"#fca5a5",o.style.borderColor=t?"#10b981":"#ef4444";const s=o.querySelector(".status-text");s&&(s.textContent=e)}a&&n&&(a.textContent=n)},parseMemoryOutput(t){try{const n=t.split(`
`).find(o=>o.trim().startsWith("Mem:"));if(n){const o=n.trim().split(/\s+/);if(o.length>=3){const a=o[1],s=o[2],i=u=>{const d=parseFloat(u);return u.toLowerCase().includes("g")?d*1024:u.toLowerCase().includes("m")?d:u.toLowerCase().includes("k")?d/1024:d},r=i(a),c=i(s);if(!isNaN(r)&&!isNaN(c)&&r>0)return{percentage:Math.round(c/r*100),detail:`${s} em uso de ${a} total`}}}}catch(e){console.warn("Erro ao fazer parse da memória:",e)}return{percentage:0,detail:"Erro no parse"}},parseDiskOutput(t){try{const n=t.split(`
`).find(o=>o.trim().endsWith(" /"));if(n){const o=n.trim().split(/\s+/);if(o.length>=5){const a=o[1],s=o[2],i=o[4].replace("%",""),r=parseInt(i,10);if(!isNaN(r))return{percentage:r,detail:`${s} em uso de ${a} (Montagem em /)`}}}}catch(e){console.warn("Erro ao fazer parse do disco:",e)}return{percentage:0,detail:"Erro no parse"}},renderGnewDiagnostics(){if(!v)return;if(v.memoria){let n={percentage:0,detail:"Dados de memória indisponíveis"};if(v.memoria.output)n=this.parseMemoryOutput(v.memoria.output);else if(typeof v.memoria.percent<"u"){const i=(v.memoria.total_mb/1024).toFixed(1),r=(v.memoria.used_mb/1024).toFixed(1);n={percentage:Math.round(v.memoria.percent),detail:`${r}GB em uso de ${i}GB total`}}const o=document.getElementById("gnew-kpi-mem-text"),a=document.getElementById("gnew-kpi-mem-bar"),s=document.getElementById("gnew-kpi-mem-detail");o&&(o.textContent=`${n.percentage}%`),a&&(a.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}if(v.disco){let n={percentage:0,detail:"Dados de disco indisponíveis"};if(v.disco.output)n=this.parseDiskOutput(v.disco.output);else if(Array.isArray(v.disco)){const i=v.disco.find(r=>r.mountpoint==="/");i&&(n={percentage:Math.round(i.percent),detail:`${i.used_gb.toFixed(1)}GB em uso de ${i.total_gb.toFixed(1)}GB (Montagem em /)`})}const o=document.getElementById("gnew-kpi-disk-text"),a=document.getElementById("gnew-kpi-disk-bar"),s=document.getElementById("gnew-kpi-disk-detail");o&&(o.textContent=`${n.percentage}%`),a&&(a.style.width=`${n.percentage}%`),s&&(s.textContent=n.detail)}const t=document.getElementById("gnew-disk-table-body");if(t){let n=[];if(v.disco)if(v.disco.output)try{const o=v.disco.output.trim().split(`
`);for(let a=1;a<o.length;a++){const s=o[a].trim().split(/\s+/);s.length>=6&&n.push({mountpoint:s[5],total:s[1],used:s[2],free:s[3],percent:parseInt(s[4].replace("%",""),10)||0})}}catch(o){console.warn("Erro ao fazer parse da tabela de disco offline:",o)}else Array.isArray(v.disco)&&(n=v.disco.map(o=>({mountpoint:o.mountpoint,total:typeof o.total_gb=="number"?`${o.total_gb.toFixed(2)} GB`:o.total_gb||"0 GB",used:typeof o.used_gb=="number"?`${o.used_gb.toFixed(2)} GB`:o.used_gb||"0 GB",free:typeof o.free_gb=="number"?`${o.free_gb.toFixed(2)} GB`:o.free_gb||"0 GB",percent:typeof o.percent=="number"?Math.round(o.percent):parseInt(o.percent,10)||0})));n.length>0?t.innerHTML=n.map(o=>{const a=o.percent;return`
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
                `}if(v.servicos&&v.servicos.timestamp)try{const o=new Date(v.servicos.timestamp).toLocaleString("pt-BR"),a=document.getElementById("gnew-services-timestamp");a&&(a.textContent=`Última verificação: ${o}`)}catch(n){console.warn("Erro ao formatar timestamp dos serviços:",n)}const e=document.getElementById("gnew-services-list");if(e){let n=[];v.servicos&&Array.isArray(v.servicos.servicos)&&(n=v.servicos.servicos),n.length>0?(e.innerHTML=n.map(a=>{const s=a.status==="active"||a.status_label==="ativo",i=s?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",r=s?"#6ee7b7":"#fca5a5",c=s?"#10b981":"#ef4444",u=s?"#10b981":"#ef4444";return`
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
                                <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; border: 1px solid ${c}; background: ${i}; color: ${r};">
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
                `}if(v.ipExterno){const n=document.getElementById("gnew-kpi-ip-text");n&&(n.textContent=v.ipExterno.ip||"Não detectado")}this.checkGnewThresholds()},async checkGnewThresholds(){if(!v)return;const t=90,e=80,n=[];let o=0;v.memoria&&(v.memoria.output?o=this.parseMemoryOutput(v.memoria.output).percentage:typeof v.memoria.percent<"u"&&(o=Math.round(v.memoria.percent))),o>=t&&n.push({alert_key:"gnew-alert-ram",title:`RAM crítica: ${o}%`,description:`Uso de memória RAM atingiu ${o}%, superando o limite de ${t}%. Verifique os processos em execução no PABX.`,severity:"critical",source:"Gnew Monitor",value_pct:o});let a=[];if(v.disco)if(v.disco.output)try{const s=v.disco.output.trim().split(`
`);for(let i=1;i<s.length;i++){const r=s[i].trim().split(/\s+/);r.length>=6&&a.push({mountpoint:r[5],percent:parseInt(r[4].replace("%",""),10)||0})}}catch{}else Array.isArray(v.disco)&&(a=v.disco.map(s=>({mountpoint:s.mountpoint,percent:Math.round(s.percent||0)})));if(a.forEach(s=>{s.percent>=e&&n.push({alert_key:`gnew-alert-disk-${s.mountpoint}`,title:`Disco (${s.mountpoint}): ${s.percent}%`,description:`Ponto de montagem "${s.mountpoint}" está com ${s.percent}% de uso, superando o limite de ${e}%.`,severity:s.percent>=95?"critical":"warning",source:"Gnew Monitor",value_pct:s.percent})}),v.servicos&&Array.isArray(v.servicos.servicos)&&v.servicos.servicos.forEach(s=>{s.status==="active"||s.status_label==="ativo"||n.push({alert_key:`gnew-alert-svc-${s.nome}`,title:`Serviço offline: ${s.nome}`,description:`O serviço "${s.nome}" está com status "${s.status_label||s.status}". Verifique o systemd do PABX.`,severity:"critical",source:"Gnew Monitor",value_pct:null})}),n.length>0){const s=n.map(i=>fetch("/api/monitoring/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)}).catch(()=>{}));await Promise.all(s)}se==="events"&&this.fetchAndRenderEventHistory()},async clearEventHistory(){const t=document.getElementById("btn-clear-event-history");if(confirm("Tem certeza que deseja limpar todo o histórico de eventos? Esta ação não pode ser desfeita."))try{t&&(t.disabled=!0,t.textContent="Limpando..."),await fetch("/api/monitoring/events",{method:"DELETE"}),await this.fetchAndRenderEventHistory();const e=document.getElementById("event-history-count");e&&(e.style.display="none")}catch(e){console.error("Erro ao limpar histórico:",e),alert("Erro ao limpar o histórico. Tente novamente.")}finally{t&&(t.disabled=!1,t.textContent="Limpar Histórico")}},async fetchAndRenderApisStatus(){const t=document.getElementById("monitoring-apis-grid");if(!t)return;t.innerHTML=`
            <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; gap: 12px; color: var(--text-muted);">
                <div class="api-loading-spinner" style="width: 28px; height: 28px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span style="font-size: 0.9rem;">Verificando integridade das APIs...</span>
            </div>
        `;const e=document.getElementById("btn-refresh-apis-status");let n=null;e&&(n=e.querySelector("svg"),e.disabled=!0,e.style.opacity="0.6",e.style.cursor="not-allowed",n&&(n.style.animation="spin 0.8s linear infinite"));try{const o=await L.get("/monitoring/apis-status?t="+Date.now());if(o&&o.success&&Array.isArray(o.apis))this.renderApisGrid(o.apis);else throw new Error("Resposta inválida do servidor.")}catch(o){console.error("Erro ao buscar status das APIs:",o),t.innerHTML=`
                <div style="grid-column: 1 / -1; background: rgba(239, 68, 68, 0.07); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
                    <p style="margin: 0; font-size: 0.95rem; font-weight: 600;">Falha ao obter status das APIs</p>
                    <p style="margin: 6px 0 0 0; font-size: 0.82rem; opacity: 0.85;">${o.message}</p>
                </div>
            `}finally{e&&(e.disabled=!1,e.style.opacity="",e.style.cursor="pointer",n&&(n.style.animation=""))}},renderApisGrid(t){const e=document.getElementById("monitoring-apis-grid");if(e){if(t.length===0){e.innerHTML=`
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--text-muted);">
                    Nenhuma API cadastrada.
                </div>
            `;return}e.innerHTML=t.map(n=>{const o=n.online?"online":"offline",a=n.online?"rgba(16, 185, 129, 0.1)":"rgba(239, 68, 68, 0.1)",s=n.online?"#6ee7b7":"#fca5a5",i=n.online?"#10b981":"#ef4444",r=n.latency<200?"#6ee7b7":n.latency<500?"#fde047":"#fca5a5";return`
                <div class="api-status-card glass" data-api-id="${n.id}">
                    <div class="api-card-header">
                        <div class="api-info-meta">
                            <span class="api-type-tag">${n.type}</span>
                            <h4 class="api-name">${n.name}</h4>
                        </div>
                        <span class="api-badge ${o}" style="background: ${a}; color: ${s}; border: 1px solid ${i};">
                            <span class="status-dot"></span>
                            ${n.online?"Online":"Offline"}
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
                            <span class="stat-value" style="color: ${r}">${n.latency}ms</span>
                        </div>
                        <div class="api-stat" style="max-width: 60%;">
                            <span class="stat-label">Detalhe:</span>
                            <span class="stat-value detail-value" title="${n.message||"-"}">${n.message||"-"}</span>
                        </div>
                    </div>
                </div>
            `}).join("")}}};let re="list";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=F,Vt(),Rt(),zt(),gt.init(),it.init(),F.init()?(console.log("Sessão restaurada:",F.getUser().email),wt()):bt()});let Ze,le,De,Se;function Vt(){Ze=document.querySelectorAll(".nav-btn"),le=document.getElementById("btn-new-item"),De=document.getElementById("login-section"),Se=document.getElementById("app-container")}function bt(){De&&De.classList.remove("hidden"),Se&&Se.classList.add("hidden"),document.body.style.overflow="hidden"}function Rt(){const t=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=t-5;o<=t+5;o++){const a=document.createElement("option");a.value=o,a.textContent=o,o===t&&(a.selected=!0),n.appendChild(a)}})}function wt(){if(De&&De.classList.add("hidden"),Se&&Se.classList.remove("hidden"),document.body.style.overflow="",re="list",Ve(),z.fetch(),te.fetch(),Ke.fetch(),P.fetch(),window.auth){const t=document.getElementById("timeline-tab-anexo");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"));const e=document.getElementById("timeline-tab-config");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"))}}function Ve(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section","monitoring-section"].forEach(t=>{l.hide(t)}),le&&le.classList.add("hidden"),st.stop(),re){case"account":case"profile":l.show("account-section"),l.setText("section-title","Minha Conta"),setTimeout(()=>st.start(),100);break;case"list":l.show("list-section"),l.setText("section-title","Listagem Geral"),F.isAdmin()&&le&&le.classList.remove("hidden");break;case"docs":l.show("docs-section"),l.setText("section-title","Documentação");break;case"detail":l.show("detail-section"),l.setText("section-title","Procedimento");break;case"users":l.show("users-section"),l.setText("section-title","Gestão de Usuários");break;case"accounts":l.show("accounts-section"),l.setText("section-title","Gestão de Contas"),P.handleSearch();break;case"timeline":l.show("timeline-section"),l.setText("section-title","Timeline");break;case"telephony":l.show("telephony-section"),l.setText("section-title","Telefonia");break;case"monitoring":l.show("monitoring-section"),l.setText("section-title","Monitoramento"),it.fetch();break}xt()}function xt(){const t=F.isAdmin();l.toggle("nav-users",!t),l.toggle("nav-accounts",!t),le&&le.classList.toggle("role-hidden",!t);const e=document.getElementById("btn-floating-edit");e&&e.classList.toggle("role-hidden",!t),document.querySelectorAll(".btn-actions-container").forEach(i=>{i.classList.toggle("role-hidden",!t)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(i=>{const r=document.getElementById(i);r&&r.classList.toggle("role-hidden",!t)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!t);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!t);const a=document.getElementById("btn-new-doc");a&&a.classList.toggle("role-hidden",!t);const s=F.getUser();if(s){let i=s.name;(i.toLowerCase().startsWith("usuário ")||i.toLowerCase().startsWith("usuario "))&&(i=i.substring(8)),l.setText("profile-name-display",i),l.setText("profile-role-display",s.role);let r=i.substring(0,2).toUpperCase();const c=i.trim().split(/\s+/);c.length>1&&(r=(c[0][0]+c[c.length-1][0]).toUpperCase()),l.setText("profile-avatar-initials",r)}}function zt(){const t=document.getElementById("sidebar"),e=document.getElementById("sidebar-toggle");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("collapsed")}),Ze.forEach(i=>{i.addEventListener("click",()=>{if(Ze.forEach(r=>r.classList.remove("active")),i.classList.add("active"),re=i.dataset.section,Ve(),window.innerWidth<=768){t.classList.remove("open");const r=document.getElementById("sidebar-overlay");r&&r.classList.remove("active")}})}),window.addEventListener("SectionChange",i=>{re=i.detail.section,Ve()}),l.on("login-form","submit",async i=>{i.preventDefault();const r=document.getElementById("login-btn"),c=document.getElementById("login-error");r&&(r.disabled=!0);const u=await F.login(l.getValue("login-email"),l.getValue("login-password"));r&&(r.disabled=!1),u.success?wt():c&&(c.innerText=u.error,c.classList.remove("hidden"))}),l.on("btn-logout","click",()=>{const i=document.getElementById("auto-refresh-toggle");i&&i.checked&&(i.checked=!1,i.dispatchEvent(new Event("change"))),F.logout(),bt()}),document.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{const r=i.closest(".modal");r&&r.classList.add("hidden")})}),window.UsersHandler=Ke,window.DocsHandler=te,window.ProceduresHandler=z,window.AccountsHandler=P,window.TelephonyHandler=Le,window.monitoringHandler=it,["extensions","queues","blf","users"].forEach(i=>{l.on(`tab-telephony-${i}`,"click",()=>Le.setActiveTab(i))}),l.on("telephony-search","input",i=>Le.search(i.target.value.toLowerCase())),l.on("telephony-page-size","change",i=>Le.setPageSize(i.target.value)),l.on("telephony-reload-btn","click",()=>{const i=document.getElementById("telephony-search");i&&(i.value=""),Le.fetch()}),l.on("accounts-search","input",()=>P.handleSearch()),l.on("filter-status","change",()=>P.handleSearch()),l.on("filter-date-toggle","change",i=>{const r=document.getElementById("sidebar-mini-calendar-list");r&&(r.style.opacity=i.target.checked?"1":"0.4",r.style.pointerEvents=i.target.checked?"auto":"none"),P.handleSearch()}),l.on("filter-cal-month","change",()=>P.handleFilterChange(!0)),l.on("filter-cal-year","change",()=>P.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(i=>{l.on(i,"change",()=>{re==="accounts"&&P.renderDashboard()})}),l.on("btn-dash-clear-dates","click",()=>{l.setValue("dash-filter-start",""),l.setValue("dash-filter-end",""),l.setValue("dash-filter-type","Todos"),l.setValue("dash-filter-status","Todos"),l.setValue("dash-filter-payment","Todos"),P.resetMultiselects(),l.setValue("dash-sort-empresas","desc"),l.setValue("dash-sort-categorias","desc"),re==="accounts"&&P.renderDashboard()}),l.on("user-form","submit",i=>Ke.save(i)),l.on("doc-form","submit",i=>te.handleUpload(i)),l.on("account-form","submit",i=>P.save(i)),l.on("faq-form","submit",i=>z.saveMeta(i));const n=document.getElementById("proc-color-palette"),o=document.getElementById("proc-color");n&&o&&(n.addEventListener("click",i=>{const r=i.target.closest(".color-swatch");if(r)if(r.id==="color-custom-swatch")o.click();else{const c=r.dataset.color;c&&(o.value=c,n.querySelectorAll(".color-swatch").forEach(u=>u.classList.remove("active")),r.classList.add("active"))}}),o.addEventListener("input",i=>{const r=document.getElementById("color-custom-swatch");r&&(r.style.background=i.target.value,n.querySelectorAll(".color-swatch").forEach(c=>c.classList.remove("active")),r.classList.add("active"))})),l.on("btn-new-item","click",()=>{if(l.setText("modal-form-title","Novo Procedimento"),l.setValue("proc-id",""),l.setValue("proc-content","[]"),n){n.querySelectorAll(".color-swatch").forEach(r=>r.classList.remove("active"));const i=n.querySelector('[data-color="#4F46E5"]');i&&i.classList.add("active")}o&&(o.value="#4F46E5"),l.show("modal-form")}),l.on("btn-new-account","click",()=>P.openAccountModal()),l.on("btn-new-account-cal","click",()=>P.openAccountModal()),l.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),l.setValue("user-id-form",""),l.show("modal-user")}),l.on("list-search","input",i=>{z.search(i.target.value.toLowerCase())}),l.on("doc-search","input",i=>{te.search(i.target.value.toLowerCase())}),l.on("doc-dash-search","input",()=>{te.renderDashboard()}),l.on("doc-dash-filter-category","change",()=>{te.renderDashboard()}),l.on("doc-dash-filter-status","change",()=>{te.renderDashboard()}),l.on("btn-new-doc","click",()=>{l.show("modal-upload")}),["geral","contratos","termo-de-uso","dashboard"].forEach(i=>{l.on(`tab-doc-${i}`,"click",()=>{let r;i==="termo-de-uso"?r="Termo de Uso":i==="dashboard"?r="dashboard":r=i,te.setActiveTab(r)})}),l.on("doc-category","change",i=>{const r=i.target.value.toLowerCase(),c=document.getElementById("doc-dates-container");c&&(c.style.display=r==="contratos"||r==="termo de uso"?"grid":"none")}),l.on("doc-indefinite","change",i=>{const r=document.getElementById("doc-end-date");r&&(r.disabled=i.target.checked,i.target.checked&&(r.value=""))});const a=document.getElementById("drop-zone"),s=document.getElementById("doc-file");a&&s&&(a.addEventListener("click",i=>{i.target!==s&&s.click()}),s.addEventListener("click",i=>{i.stopPropagation()}),s.addEventListener("change",i=>{i.target.files.length>0&&l.setText("file-name-display",i.target.files[0].name)}),a.addEventListener("dragover",i=>{i.preventDefault(),a.classList.add("dragover")}),a.addEventListener("dragleave",()=>{a.classList.remove("dragover")}),a.addEventListener("drop",i=>{i.preventDefault(),a.classList.remove("dragover"),i.dataTransfer.files.length>0&&(s.files=i.dataTransfer.files,l.setText("file-name-display",i.dataTransfer.files[0].name))})),l.on("toggle-list","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),z.setListingMode("list")}),l.on("toggle-cards","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),z.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes"].forEach(i=>{l.on(`tab-acc-${i}`,"click",r=>{document.querySelectorAll(".acc-tab-btn").forEach(m=>m.classList.remove("active")),r.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(m=>{m.classList.add("hidden"),m.classList.remove("active")});const c=document.getElementById("accounts-dashboard-view");c&&(c.classList.add("hidden"),c.classList.remove("active"));const u=i==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${i}`,d=document.getElementById(u);d&&(d.classList.remove("hidden"),d.classList.add("active"));const p=document.getElementById("calendar-view-toggle-container");p&&(i==="calendario"?(p.classList.remove("hidden"),p.style.display="flex"):(p.classList.add("hidden"),p.style.display="none")),P.setAccountsViewMode(i==="calendario"?"calendar":i==="dashboard"?"dashboard":i==="notificacoes"?"notificacoes":"list")})}),["day","month","year"].forEach(i=>{l.on(`toggle-accounts-cal-${i}`,"click",r=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(c=>c.classList.remove("active")),r.currentTarget.classList.add("active"),["day","month","year"].forEach(c=>{document.getElementById(`cal-${c}-view-container`).classList.toggle("hidden-cal-view",c!==i)}),P.setCalendarSubView(i)})}),l.on("btn-prev-date-nav","click",()=>P.shiftCalendarDate(-1)),l.on("btn-next-date-nav","click",()=>P.shiftCalendarDate(1)),l.on("btn-back-to-accounts","click",()=>{l.hide("dedicated-account-page"),l.show("accounts-section"),xt()}),l.on("btn-back-to-list","click",()=>{const i=document.getElementById("procedure-edit-wrapper");i&&!i.classList.contains("hidden")?z.toggleEditMode(!1):(re="list",Ve())}),l.on("btn-floating-edit","click",()=>z.toggleEditMode(!0)),l.on("btn-cancel-edit","click",()=>z.toggleEditMode(!1)),l.on("btn-save-procedure","click",()=>z.handleSaveProcedure()),l.on("confirm-yes","click",()=>{l.hide("modal-confirm"),z.openDetail(z.getPendingProcId())}),l.on("confirm-no","click",()=>{l.hide("modal-confirm")}),l.on("procedure-search","input",i=>{z.filterProcedureContent(i.target.value)}),l.on("btn-add-block","click",()=>{const i=document.getElementById("section-title-input"),r=document.getElementById("section-type-input");i&&(i.value=""),r&&(r.value="TEXTO"),l.show("modal-add-section")}),l.on("btn-confirm-add-section","click",()=>{const i=l.getValue("section-title-input"),r=l.getValue("section-type-input");if(!i)return alert("Por favor, informe o título da seção.");z.addSection(i,r),l.hide("modal-add-section")})}
