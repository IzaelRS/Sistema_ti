(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const ge="/api",$={async get(t){const e=await fetch(`${ge}${t}`);if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${e.status}`)}return await e.json()},async post(t,e){const n=await fetch(`${ge}${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(t,e){const n=await fetch(`${ge}${t}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(t){const e=await fetch(`${ge}${t}`,{method:"DELETE"});if(!e.ok){const n=await e.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${e.status}`)}return await e.json()},async upload(t,e){const n=await fetch(`${ge}${t}`,{method:"POST",body:e});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let ce=null;const _={init(){const t=localStorage.getItem("user");if(t)try{return ce=JSON.parse(t),!0}catch{return this.logout(),!1}return!1},getUser(){return ce},isAdmin(){return ce&&ce.role==="Administrador"},async login(t,e){try{const n=await $.post("/login",{email:t,password:e});return ce=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){ce=null,localStorage.removeItem("user")}},l={show(t){const e=document.getElementById(t);e&&e.classList.remove("hidden")},hide(t){const e=document.getElementById(t);e&&e.classList.add("hidden")},toggle(t,e){const n=document.getElementById(t);n&&n.classList.toggle("hidden",e)},setText(t,e){const n=document.getElementById(t);n&&(n.innerText=e)},setValue(t,e){const n=document.getElementById(t);n&&(n.value=e)},getValue(t){const e=document.getElementById(t);return e?e.value:null},on(t,e,n){const o=document.getElementById(t);o&&o.addEventListener(e,n)}},We={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const t=window.innerWidth<=768;this.particleCount=t?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let e=0;e<this.particleCount;e++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const t=document.getElementById("account-section");t&&(this.canvas.width=t.clientWidth,this.canvas.height=t.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let t=0;t<this.particles.length;t++){const e=this.particles[t];e.x+=e.vx,e.y+=e.vy,(e.x<0||e.x>this.canvas.width)&&(e.vx*=-1),(e.y<0||e.y>this.canvas.height)&&(e.vy*=-1),this.ctx.beginPath(),this.ctx.arc(e.x,e.y,e.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=t+1;n<this.particles.length;n++){const o=this.particles[n],a=e.x-o.x,s=e.y-o.y,i=Math.sqrt(a*a+s*s);if(i<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const r=1-i/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${r*.4})`,this.ctx.moveTo(e.x,e.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let he=[];const je={async fetch(){try{he=await $.get("/users"),this.render(he)}catch(t){console.error("Error fetching Users:",t)}},getUsers(){return he},render(t){const e=document.getElementById("user-table-body");e&&(e.innerHTML=t.map(n=>{const o=n.role==="Administrador",a=_.isAdmin()?`
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
            </tr>`}).join(""))},openEditModal(t){const e=he.find(n=>n.id===t);e&&(l.setText("modal-user-title","Editar Usuário"),l.setValue("user-id-form",e.id),l.setValue("user-name-form",e.name),l.setValue("user-email-form",e.email),l.setValue("user-password-form",""),l.setValue("user-role-form",e.role),l.show("modal-user"))},async save(t){t.preventDefault();const e=l.getValue("user-id-form"),n={name:l.getValue("user-name-form"),email:l.getValue("user-email-form"),password:l.getValue("user-password-form"),role:l.getValue("user-role-form")};try{e?await $.put(`/users/${e}`,n):await $.post("/users",n),l.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(e?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(t){if(confirm("Deseja excluir este usuário?"))try{await $.delete(`/users/${t}`),this.fetch()}catch(e){alert("Erro ao excluir: "+e.message)}},search(t){const e=he.filter(n=>n.name.toLowerCase().includes(t)||n.email.toLowerCase().includes(t));this.render(e)}};let Ie=[],ne="Geral",H=1;const fe=10;let Qe=[];const Z={async fetch(){try{H=1,Ie=await $.get("/documents"),this.filterAndRender()}catch(t){console.error("Error fetching Documents:",t)}},setActiveTab(t){ne=t,H=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(e=>{const n=e.textContent.trim().toLowerCase();e.classList.toggle("active",n===t.toLowerCase())}),this.filterAndRender()},filterAndRender(){const t=document.querySelector(".docs-header");if(ne.toLowerCase()==="dashboard")t&&(t.style.display="none"),l.hide("doc-list-container"),l.show("doc-dashboard-container"),this.renderDashboard();else{t&&(t.style.display="flex"),l.show("doc-list-container"),l.hide("doc-dashboard-container");const e=Ie.filter(n=>(n.category||"Geral").toLowerCase()===ne.toLowerCase());this.render(e)}},calculateRemainingTime(t){if(!t||t==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const e=new Date;e.setHours(0,0,0,0);const n=new Date(t+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-e.getTime(),a=Math.ceil(o/(1e3*60*60*24));if(a<0){const s=Math.abs(a);let i=`Expirado há ${s} dia(s)`;return s>=30&&(i=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:i,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:a}}else{if(a===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:a};if(a<=30)return{text:`Expira em ${a} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:a};{const s=Math.floor(a/30);let i=`Expira em ${s} mês(es)`;if(s>=12){const r=Math.floor(s/12),c=s%12;i=`Expira em ${r} ano(s)${c>0?` e ${c} mês(es)`:""}`}return{text:i,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:a}}}},renderDashboard(){const t=document.getElementById("doc-dashboard-tbody");if(!t)return;const e=Ie.filter(g=>{const f=(g.category||"").toLowerCase();return f==="contratos"||f==="termo de uso"});let n=0,o=0,a=0,s=0;e.forEach(g=>{const f=(g.category||"").toLowerCase(),y=this.calculateRemainingTime(g.end_date);y.status==="expired"?s++:y.status==="critical"?(a++,f==="contratos"&&n++,f==="termo de uso"&&o++):(f==="contratos"&&n++,f==="termo de uso"&&o++)}),l.setText("doc-kpi-active-contracts",n),l.setText("doc-kpi-active-terms",o),l.setText("doc-kpi-warning-docs",a),l.setText("doc-kpi-expired-docs",s);const i=document.getElementById("doc-dash-search"),r=document.getElementById("doc-dash-filter-category"),c=document.getElementById("doc-dash-filter-status"),u=i?i.value.toLowerCase().trim():"",d=r?r.value:"Todos",p=c?c.value:"Todos";let m=e.filter(g=>{if(u&&!g.original_name.toLowerCase().includes(u)||d!=="Todos"&&(g.category||"").toLowerCase()!==d.toLowerCase())return!1;const f=this.calculateRemainingTime(g.end_date);return!(p!=="Todos"&&(p==="Ativos"&&(f.status==="expired"||f.status==="critical")||p==="Expirando"&&f.status!=="critical"||p==="Expirados"&&f.status!=="expired"||p==="Indeterminado"&&f.status!=="indefinite"))});if(m.sort((g,f)=>{const y=this.calculateRemainingTime(g.end_date),T=this.calculateRemainingTime(f.end_date),E={expired:1,critical:2,active:3,indefinite:4},B=E[y.status]||5,O=E[T.status]||5;return B!==O?B-O:y.days-T.days}),m.length===0){t.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const h=window.auth&&window.auth.isAdmin();t.innerHTML=m.map(g=>{const f=g.mimetype==="application/pdf"?"📕":"🖼️",y=g.start_date?new Date(g.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",T=g.end_date?g.end_date==="Indefinido"?"Indefinido":new Date(g.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",E=this.calculateRemainingTime(g.end_date),B=h?`<button class="btn-delete" onclick="window.DocsHandler.delete(${g.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
                <tr>
                    <td>
                        <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                            <span>${f}</span>
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
                        <span class="badge" style="background: ${E.color}; color: ${E.textColor}; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                            ${E.text}
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
            `}).join("")},render(t){const e=document.getElementById("doc-list-body");if(!e)return;const n=document.getElementById("doc-list-thead"),o=ne.toLowerCase()==="contratos"||ne.toLowerCase()==="termo de uso",a=window.auth&&window.auth.isAdmin(),s=a?"":'class="role-hidden"';Qe=t;const i=t.length,r=Math.ceil(i/fe);H>r&&(H=Math.max(1,r)),H<1&&(H=1);const c=(H-1)*fe,u=t.slice(c,c+fe);if(n&&(o?n.innerHTML=`
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
            `,this.renderPaginationControls("doc-pagination",0,0);return}e.innerHTML=u.map(d=>{const p=d.mimetype==="application/pdf"?"📕":"🖼️",m=(d.size/1024).toFixed(1)+" KB",h=d.created_at?new Date(d.created_at).toLocaleDateString("pt-BR"):"-",g=d.mimetype==="application/pdf"?"PDF":"Imagem",f=a?`<button class="btn-delete" onclick="window.DocsHandler.delete(${d.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",y=d.start_date?new Date(d.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",T=d.end_date?d.end_date==="Indefinido"?"Indefinido":new Date(d.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-";return o?`
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
                        <td>${h}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${d.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${f}
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
                                ${f}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",r,i)},async handleUpload(t){t.preventDefault();const e=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!e.files.length){alert("Selecione um arquivo.");return}const a=new FormData,s=n?n.value:"Geral";a.append("category",s),a.append("customName",o?o.value:""),a.append("document",e.files[0]);const i=s.toLowerCase();if(i==="contratos"||i==="termo de uso"){const r=document.getElementById("doc-start-date"),c=document.getElementById("doc-end-date"),u=document.getElementById("doc-indefinite");r&&r.value&&a.append("startDate",r.value),u&&u.checked?a.append("endDate","Indefinido"):c&&c.value&&a.append("endDate",c.value)}try{await $.upload("/documents",a),l.hide("modal-upload"),document.getElementById("doc-form").reset();const r=document.getElementById("doc-dates-container");r&&(r.style.display="none");const c=document.getElementById("doc-end-date");c&&(c.disabled=!1),l.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(r){console.error(r),alert("Erro ao subir arquivo.")}},async delete(t){if(confirm("Deletar este documento?"))try{await $.delete(`/documents/${t}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(t){if(ne.toLowerCase()==="dashboard")this.renderDashboard();else{H=1;const e=Ie.filter(n=>(n.category||"Geral").toLowerCase()===ne.toLowerCase()&&n.original_name.toLowerCase().includes(t));this.render(e)}},changePage(t){H=t,this.render(Qe)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
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
        `;const i=(H-1)*fe+1,r=Math.min(H*fe,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let X=[],w={summaries:[]},Ke=null,C=null,Ae="list",ye=null,Q=null,Xe=null,A=1;const ve=10;let De=[];const R={getPendingProcId(){return Ke},async fetch(){try{A=1,X=await $.get("/procedures"),this.renderTable(X)}catch(t){console.error("Error fetching FAQs:",t)}},getFaqs(){return X},setListingMode(t){Ae=t,A=1,this.renderTable(De.length?De:X)},renderTable(t){const e=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!e||!n||!o)return;De=t;const a=t.length,s=Math.ceil(a/ve);A>s&&(A=Math.max(1,s)),A<1&&(A=1);const i=(A-1)*ve,r=t.slice(i,i+ve);Ae==="list"?(l.show("list-table-container"),l.hide("list-cards-container"),r.length===0?o.innerHTML=`
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
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,a),(Ae==="list"?o:n).addEventListener("click",function(d){const p=d.target.closest('[data-action="edit"], [data-action="delete"]');if(p){d.stopPropagation(),d.preventDefault();const h=Number(p.dataset.id);p.dataset.action==="edit"?R.openEditModal(h):p.dataset.action==="delete"&&R.deleteProcedure(h);return}const m=d.target.closest('[data-action="open"]');if(m){const h=Number(m.dataset.id);R.openDetail(h)}})},openDetail(t){const e=X.find(o=>o.id===t);if(!e)return;l.setText("detail-title",e.name||e.title||"Sem título"),l.setValue("proc-id",e.id);try{let o=e.content?JSON.parse(e.content):[];Array.isArray(o)?w={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?w=o:w={summaries:[]}}catch{w={summaries:[]}}w.summaries.length>0?C=w.summaries[0].id:C=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(t){const e=X.find(n=>n.id===t);e&&(l.setText("modal-form-title","Editar Procedimento"),l.setValue("proc-id",e.id),l.setValue("proc-name",e.name||e.title||""),l.setValue("proc-responsible",e.responsible||""),l.setValue("proc-group",e.group_name||""),l.setValue("proc-note",e.note||""),l.setValue("proc-content",e.content||""),l.setValue("proc-color",e.color||"#4F46E5"),l.show("modal-form"))},async saveMeta(t){t&&t.preventDefault();const e=l.getValue("proc-id"),n={name:l.getValue("proc-name").toUpperCase(),responsible:l.getValue("proc-responsible").toUpperCase(),group_name:l.getValue("proc-group"),note:l.getValue("proc-note"),content:l.getValue("proc-content"),color:l.getValue("proc-color")};try{const o=e?`/procedures/${e}`:"/procedures";Ke=(e?await $.put(o,n):await $.post(o,n)).id,l.hide("modal-form"),document.getElementById("faq-form").reset(),l.setValue("proc-responsible","TI"),l.setValue("proc-group","Geral"),await this.fetch(),l.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(t){if(confirm("Deseja excluir este procedimento?"))try{await $.delete(`/procedures/${t}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(t){const e=document.querySelector(".procedure-sidebar");t?(l.hide("procedure-view-container"),l.hide("procedure-view-sidebar"),l.show("procedure-edit-wrapper"),l.show("procedure-edit-sidebar"),l.hide("btn-floating-edit"),e&&e.classList.add("glass","has-border"),w.summaries.length>0?w.summaries.find(n=>n.id===C)||(C=w.summaries[0].id):C=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(l.show("procedure-view-container"),l.show("procedure-view-sidebar"),l.hide("procedure-edit-wrapper"),l.hide("procedure-edit-sidebar"),l.show("btn-floating-edit"),e&&e.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const t=document.getElementById("procedure-view-container"),e=document.getElementById("procedure-view-index");if(!t||!e)return;if(w.summaries.length===0){t.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',e.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";w.summaries.forEach((a,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${a.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${a.title}</li>`,n+=`<div id="sum-view-${a.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(w.summaries.length>1||a.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${a.title}</h4>`),a.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const i=a.sections.map((r,c)=>{let u="";if(r.type==="TEXTO")u=`<div class="gh-content"><div class="gh-text-view">${r.data||"Sem conteúdo."}</div></div>`;else if(r.type==="FAQ")u='<div class="gh-faq-list">'+(r.data||[]).map((m,h)=>`
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
                 `}).join("");n+=i,n+="</div>"}),e.innerHTML=o,t.innerHTML=n},filterProcedureContent(t){t=t.toLowerCase();const e=document.getElementById("procedure-view-container");if(!e)return;e.querySelectorAll(".gh-box").forEach(o=>{const a=o.querySelector(".gh-faq-list");let s=!1;const i=o.querySelector(".gh-header"),r=i?i.textContent.toLowerCase().includes(t):!1;a&&a.querySelectorAll(".gh-accordion").forEach(d=>{const p=d.textContent.toLowerCase();r||p.includes(t)?(d.classList.remove("hidden"),s=!0):d.classList.add("hidden")});const c=o.textContent.toLowerCase();r||c.includes(t)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const t=document.getElementById("procedure-edit-index"),e=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!t)return;t.innerHTML=w.summaries.map((a,s)=>`
             <li class="sidebar-index-item ${a.id===C?"active":""} editable-section style-none"
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
            `).join("");const o=w.summaries.find(a=>a.id===C);o?(n.textContent=o.title,n.style.color="var(--text-main)",e.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",e.classList.add("hidden"))},selectSummary(t){C=t,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(t,e){const n=w.summaries.find(a=>a.id===t);n&&(n.title=e||"Sem título"),this.renderProcedureBuilderSidebar();const o=w.summaries.find(a=>a.id===C);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const t="sum_"+Date.now();w.summaries.push({id:t,title:`Sumário ${w.summaries.length+1}`,sections:[]}),C=t,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(t){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(w.summaries=w.summaries.filter(e=>e.id!==t),C===t&&(C=w.summaries.length>0?w.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const t=document.getElementById("procedure-edit-container");if(!t)return;if(!C){t.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const e=w.summaries.find(o=>o.id===C);if(!e)return;const n=e.sections;if(n.length===0){t.innerHTML=`<p class="empty-state">Nenhum campo em "${e.title}". Clique em "+ Novo Container" para começar.</p>`;return}t.innerHTML=n.map((o,a)=>`
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
             </div>`).join("")},handleSumDragStart(t,e){ye="summary",Q=e,t.dataTransfer.effectAllowed="move",setTimeout(()=>{t.target&&t.target.classList.add("dragging")},0)},handleSumDrop(t,e){if(t.preventDefault(),ye!=="summary"||Q===null||Q===e)return;const n=w.summaries.splice(Q,1)[0];w.summaries.splice(e,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(t,e,n){ye="container",Q=e,Xe=n,t.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=t.target.nodeType===1?t.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(t){t.preventDefault(),t.dataTransfer.dropEffect="move"},handleSecDrop(t,e,n){if(t.preventDefault(),ye!=="container"||Q===null||Xe!==n)return;const o=w.summaries.find(s=>s.id===n);if(!o||Q===e)return;const a=o.sections.splice(Q,1)[0];o.sections.splice(e,0,a),this.renderProcedureBuilder()},handleDragEnd(t){document.querySelectorAll(".editable-section.dragging").forEach(e=>e.classList.remove("dragging")),t&&t.target&&t.target.setAttribute&&t.target.setAttribute("draggable","false"),ye=null,Q=null},updateSectionTitle(t,e){const n=w.summaries.find(o=>o.id===C);n&&(n.sections[t].title=e)},updateSectionData(t,e){const n=w.summaries.find(o=>o.id===C);n&&(n.sections[t].data=e)},removeSection(t){const e=w.summaries.find(n=>n.id===C);e&&e.sections.splice(t,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(t){const e=w.summaries.find(n=>n.id===C);e&&(e.sections[t].data=e.sections[t].data||[],e.sections[t].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(t,e,n,o){const a=w.summaries.find(s=>s.id===C);a&&(a.sections[t].data[e][n]=o)},removeFaqItem(t,e){const n=w.summaries.find(o=>o.id===C);n&&n.sections[t].data.splice(e,1),this.renderProcedureBuilder()},addSection(t,e){if(!C){alert("Selecione primeiro um sumário na barra lateral.");return}const n=w.summaries.find(o=>o.id===C);n&&(n.sections.push({id:Date.now(),title:t,type:e,data:e==="FAQ"?[]:e==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(t,e){e.dataTransfer.files&&e.dataTransfer.files.length>0&&await this.uploadSectionFile(t,e.dataTransfer.files[0])},async handleSectionFileUpload(t,e){const n=e.files[0];n&&await this.uploadSectionFile(t,n)},async uploadSectionFile(t,e){const n=new FormData;n.append("file",e);try{const o=await $.upload("/upload",n),a=w.summaries.find(s=>s.id===C);a&&(a.sections[t].data={name:e.name,path:o.path,mimetype:e.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const t=parseInt(l.getValue("proc-id"));if(!t)return;const n={...X.find(o=>o.id===t),content:JSON.stringify(w)};try{await $.put(`/procedures/${t}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(t),this.fetch()}catch{alert("Erro ao salvar")}},search(t){A=1;const e=X.filter(n=>(n.name||n.title||"").toLowerCase().includes(t)||(n.responsible||"").toLowerCase().includes(t)||(n.group_name||"").toLowerCase().includes(t));this.renderTable(e)},changePage(t){A=t,this.renderTable(De)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${A===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${A-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=e;c++)(c===1||c===e||c>=A-1&&c<=A+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===A?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${A===e?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${A+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(A-1)*ve+1,r=Math.min(A*ve,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};window.toggleGhAccordion=function(t){const e=document.getElementById(t);e&&e.classList.toggle("open")};let z=[],de="list",oe="month",x=new Date,V=1;const be=10;let Ze=[];const P={async fetch(){try{V=1,z=await $.get("/accounts"),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(t){console.error("Falha ao obter contas",t)}},populateCompanyFilter(){const t=document.getElementById("dash-filter-company-dynamic-options");if(t){const e=new Set;t.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{e.add(a.value)});const n=[...new Set(z.map(a=>a.company_name).filter(Boolean))].sort((a,s)=>a.localeCompare(s));let o="";n.forEach(a=>{const s=e.has(a)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${a}" ${s}> <span>${a}</span></label>`}),t.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(t){if(!document.getElementById(`${t}-container`))return;const n=document.getElementById(`${t}-trigger`),o=document.getElementById(`${t}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",r=>{r.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(c=>{c!==o&&c.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const a=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(r=>r.value!=="Todos"),i=()=>{const r=s.filter(u=>u.checked).map(u=>u.value),c=n.querySelector(".trigger-label");a.checked||s.length>0&&r.length===s.length?(a.checked=!0,c&&(c.innerText="Todos")):r.length===0?c&&(c.innerText="Nenhum"):r.length===1?c&&(c.innerText=r[0]):c&&(c.innerText=`${r.length} selecionados`)};a&&!a.dataset.listenerBound&&(a.addEventListener("change",()=>{s.forEach(r=>{r.checked=a.checked}),i(),this.renderDashboard()}),a.dataset.listenerBound="true"),s.forEach(r=>{r.dataset.listenerBound||(r.addEventListener("change",()=>{s.every(u=>u.checked)?a.checked=!0:a.checked=!1,i(),this.renderDashboard()}),r.dataset.listenerBound="true")}),i()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",t=>{t.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(e=>{e.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(t){const e=document.getElementById(`${t}-dropdown`);if(!e)return["Todos"];const n=e.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(e.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(t=>{const e=document.getElementById(`${t}-dropdown`);if(e){e.querySelectorAll('input[type="checkbox"]').forEach(a=>{a.checked=a.value==="Todos"});const o=document.getElementById(`${t}-trigger`);if(o){const a=o.querySelector(".trigger-label");a&&(a.innerText="Todos")}}})},getAccounts(){return z},setAccountsViewMode(t){de=t,this.handleSearch()},setCalendarSubView(t){oe=t,this.handleSearch()},shiftCalendarDate(t){oe==="day"?x.setDate(x.getDate()+t):oe==="month"?x.setMonth(x.getMonth()+t):oe==="year"&&x.setFullYear(x.getFullYear()+t),l.setValue("filter-day",x.getDate()),l.setValue("filter-month",x.getMonth()),l.setValue("filter-year",x.getFullYear()),this.handleSearch()},handleFilterChange(t=!1){if(t){const e=l.getValue("filter-cal-year")?parseInt(l.getValue("filter-cal-year")):x.getFullYear(),n=l.getValue("filter-cal-month")?parseInt(l.getValue("filter-cal-month")):x.getMonth();x=new Date(e,n,1)}else{const e=l.getValue("filter-year")?parseInt(l.getValue("filter-year")):x.getFullYear(),n=l.getValue("filter-month")?parseInt(l.getValue("filter-month")):x.getMonth(),o=l.getValue("filter-day")?parseInt(l.getValue("filter-day")):x.getDate();x=new Date(e,n,o)}l.setValue("filter-month",x.getMonth()),l.setValue("filter-year",x.getFullYear()),this.handleSearch()},handleSearch(){const t=(l.getValue("accounts-search")||"").toLowerCase();let e=z.filter(n=>n.company_name.toLowerCase().includes(t)||n.description&&n.description.toLowerCase().includes(t));if(de==="list"){V=1;const n=l.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),a=o?o.checked:!1,s=x.getFullYear(),i=x.getMonth(),r=x.getDate();e=e.filter(c=>{if(n&&c.status!==n)return!1;if(!a||!c.due_date)return!0;const[u,d,p]=c.due_date.split("-"),m=parseInt(u,10),h=parseInt(d,10)-1,g=parseInt(p,10);return c.type==="Único"?m===s&&h===i&&g===r:c.type==="Recorrente"?g===r:!0}),this.renderAccountsList(e)}else de==="notificacoes"?this.renderNotifications():de==="dashboard"?this.renderDashboard():this.renderCalendarWrapper(e)},checkAccountAlerts(){let t=!1;const e=new Date;e.setHours(0,0,0,0),z.forEach(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a==="on"&&s==="pendente"&&o.due_date){const[i,r,c]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(c,10));u.setHours(0,0,0,0),u.getTime()<=e.getTime()&&(t=!0)}});const n=document.getElementById("icon-alert-bell");n&&(t?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const t=document.getElementById("accounts-notifications-body");if(!t)return;t.innerHTML="";const e=new Date;e.setHours(0,0,0,0);let n=z.filter(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a!=="on"||s!=="pendente"||!o.due_date)return!1;const[i,r,c]=o.due_date.split("-");let u=new Date(parseInt(i,10),parseInt(r,10)-1,parseInt(c,10));return u.setHours(0,0,0,0),u.getTime()<=e.getTime()});if(n.length===0){t.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const a=document.createElement("tr");let s="Sem Data";if(o.due_date){const r=o.due_date.split("-");r.length===3&&(s=`${r[2]}/${r[1]}/${r[0]}`)}const i=_.isAdmin()?`
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
            `,t.appendChild(a)})},renderAccountsList(t){const e=document.getElementById("accounts-table-body");if(!e)return;e.innerHTML="",this.renderSidebarMiniCalendar(),Ze=t;const n=t.length,o=Math.ceil(n/be);V>o&&(V=Math.max(1,o)),V<1&&(V=1);const a=(V-1)*be,s=t.slice(a,a+be);if(s.length===0){e.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(i=>{const r=document.createElement("tr");let c="Sem Data";if(i.due_date){const p=i.due_date.split("-");p.length===3&&(c=`${p[2]}/${p[1]}/${p[0]}`)}const u=i.status==="Off",d=_.isAdmin()?`
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
            `,e.appendChild(r)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(de!=="dashboard")return;this.initDashboardMultiselects();const t=l.getValue("dash-filter-start"),e=l.getValue("dash-filter-end"),n=l.getValue("dash-filter-type")||"Todos",o=l.getValue("dash-filter-status")||"Todos",a=l.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),i=this.getMultiselectValues("dash-filter-company");let r=t?new Date(t+"T00:00:00"):null,c=e?new Date(e+"T23:59:59"):null;if(!r&&!c){const v=new Date;r=new Date(v.getFullYear(),v.getMonth(),1,0,0,0),c=new Date(v.getFullYear(),v.getMonth()+1,0,23,59,59)}else r?c||(c=new Date(2100,11,31)):r=new Date(2e3,0,1);let u=0,d=0,p=new Set,m=new Set,h=0,g=0,f=0,y="-",T=0,E=0,B={},O={},F={};z.forEach(v=>{if(!v.due_date||n!=="Todos"&&v.type!==n||o!=="Todos"&&v.status!==o||a!=="Todos"&&v.payment_status!==a)return;if(!s.includes("Todos")){if(s.length===0)return;const I=v.category||"Outros";if(!s.includes(I))return}if(!i.includes("Todos")&&(i.length===0||!i.includes(v.company_name)))return;let M=0,j=new Date(r);j.setHours(0,0,0,0);let N=new Date(c);N.setHours(0,0,0,0);let U=3650;for(;j<=N&&U>0;){if(this.isEventOnDate(v,j.getFullYear(),j.getMonth(),j.getDate())){M++;const I=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`;F[I]||(F[I]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const Y=parseFloat(v.value||0);F[I].total+=Y,v.payment_status==="Pago"&&(F[I].pago+=Y),v.payment_status==="Pendente"&&(F[I].pendente+=Y),v.type==="Recorrente"&&(F[I].fixo+=Y),v.type==="Único"&&(F[I].variavel+=Y)}j.setDate(j.getDate()+1),U--}if(M>0){const I=parseFloat(v.value||0)*M;u+=I,d+=M,p.add(v.category||"Outros"),m.add(v.company_name),v.payment_status==="Pago"&&(h+=I),v.payment_status==="Pendente"&&(g+=I),v.type==="Recorrente"&&(T+=I),v.type==="Único"&&(E+=I),I>f&&(f=I,y=v.company_name);const Y=v.category||"Outros";O[Y]=(O[Y]||0)+I;const le=v.company_name||"Sem Empresa";B[le]=(B[le]||0)+I}}),l.setText("dash-metric-valor","R$ "+u.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-contas",d.toString()),l.setText("dash-metric-tipos",p.size.toString()),l.setText("dash-metric-empresas",m.size.toString()),l.setText("dash-metric-pago","R$ "+h.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-pendente","R$ "+g.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-maior-valor","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-maior-nome",y),l.setText("dash-metric-fixo","R$ "+T.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),l.setText("dash-metric-variavel","R$ "+E.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const b=l.getValue("dash-sort-empresas")||"desc",D=l.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",B,b),this.renderTierList("dash-list-categorias",O,D),this.renderTimeChart(F)},renderTimeChart(t){window.timeChartInstance&&window.timeChartInstance.destroy();const e=document.getElementById("chart-dashboard-time");if(!e)return;const n=Object.keys(t).sort(),o=n.map(d=>{const[p,m]=d.split("-");return`${m}/${p}`}),a=n.map(d=>t[d].total),s=n.map(d=>t[d].pago),i=n.map(d=>t[d].pendente),r=n.map(d=>t[d].fixo),c=n.map(d=>t[d].variavel),u={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:a,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:i,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:r,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:c,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(d){let p=d.dataset.label||"";return p&&(p+=": "),d.parsed.y!==null&&(p+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(d.parsed.y)),p}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(d,p,m){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(d)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(e.getContext("2d"),u)},renderTierList(t,e,n){const o=document.getElementById(t);if(!o)return;const a=Object.entries(e);if(a.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}a.sort((r,c)=>n==="asc"?r[1]-c[1]:c[1]-r[1]);const s=a.slice(0,10);let i="";s.forEach(([r,c],u)=>{const d=u===0&&n==="desc",p=d?"🏆 ":u+1+". ";i+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${d?"bold":"normal"}; color: ${d?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${r}">
                        ${p}${r}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${c.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=i},renderCharts(t){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const e=document.getElementById("chart-category");if(e){const o={labels:Object.keys(t),datasets:[{data:Object.values(t),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(e.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],a=[];let s=new Date;for(let i=-5;i<=6;i++){let r=new Date(s.getFullYear(),s.getMonth()+i,1);o.push(r.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let c=0;z.forEach(u=>{if(!u.due_date||u.status==="Off")return;const[d,p]=u.due_date.split("-"),m=new Date(parseInt(d),parseInt(p)-1,1);(u.type==="Recorrente"&&r.getTime()>=m.getTime()||u.type==="Único"&&r.getFullYear()===parseInt(d)&&r.getMonth()===parseInt(p)-1)&&(c+=parseFloat(u.value||0))}),a.push(c)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:a,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(t){const e={},n=[];return t.forEach(o=>{if(o.type==="Único")n.push(o);else if(!e[o.company_name])e[o.company_name]=o;else{const a=new Date(e[o.company_name].due_date||0);new Date(o.due_date||0)>a&&(e[o.company_name]=o)}}),[...n,...Object.values(e)]},isEventOnDate(t,e,n,o){if(!t.due_date)return!1;const[a,s,i]=t.due_date.split("-"),r=parseInt(a,10),c=parseInt(s,10)-1,u=parseInt(i,10);if(t.type==="Único")return e===r&&n===c&&o===u;if(t.type==="Recorrente"){const d=new Date(r,c,u).setHours(0,0,0,0);if(new Date(e,n,o).setHours(0,0,0,0)<d)return!1;const m=t.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(m)){const h=(e-r)*12+(n-c),g=new Date(e,n+1,0).getDate(),f=Math.min(u,g);if(o!==f||h<0)return!1;if(m==="1 mes")return!0;if(m==="3 meses")return h%3===0;if(m==="6 meses")return h%6===0;if(m==="1 ano")return n===c}else{const h=Date.UTC(r,c,u),g=Date.UTC(e,n,o),f=Math.round((g-h)/(1e3*60*60*24));if(m==="1 dia")return!0;if(m==="7 dias")return f%7===0;if(m==="15 dias")return f%15===0}}return!1},renderCalendarWrapper(t){const e=x.getFullYear(),n=x.getMonth(),o=x.getDate();oe==="month"?this.renderCalendarMonth(t,e,n):oe==="year"?this.renderCalendarYear(t,e):oe==="day"&&this.renderCalendarDay(t,e,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const t=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],e=x.getFullYear(),n=x.getMonth(),o=x.getDate(),a=new Date(e,n,1).getDay(),s=new Date(e,n+1,0).getDate(),i=new Date,r=i.getFullYear(),c=i.getMonth(),u=i.getDate(),d=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let p="";d.forEach((g,f)=>{p+=`<option value="${f}" ${f===n?"selected":""}>${g}</option>`});let m="";for(let g=r-5;g<=r+5;g++)m+=`<option value="${g}" ${g===e?"selected":""}>${g}</option>`;let h=`
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
        `;for(let g=0;g<a;g++)h+='<div class="smc-day empty"></div>';for(let g=1;g<=s;g++)h+=`<div class="smc-day ${g===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${e}, ${n}, ${g})">${g}</div>`;h+="</div>",t.forEach(g=>{g&&(g.innerHTML=h)})},changeMiniCalendarMonthYear(t,e){let n=x.getDate();const o=new Date(t,parseInt(e)+1,0).getDate();n>o&&(n=o),x=new Date(t,e,n);try{l.setValue("filter-cal-year",t),l.setValue("filter-cal-month",e)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(t,e,n){x=new Date(t,e,n);try{l.setValue("filter-cal-year",t),l.setValue("filter-cal-month",e)}catch{}if(de==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(t,e,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];l.setText("calendar-date-display",`${o[n]} ${e}`);const a=document.getElementById("calendar-month-grid");a.innerHTML="";const s=new Date(e,n,1).getDay(),i=new Date(e,n+1,0).getDate(),r=new Date,c=r.getFullYear()===e&&r.getMonth()===n;new Date(r.getFullYear(),r.getMonth(),1);for(let d=0;d<s;d++)a.innerHTML+='<div class="calendar-day empty"></div>';for(let d=1;d<=i;d++){const p=c&&r.getDate()===d?"today":"";a.innerHTML+=`<div class="calendar-day ${p}" id="cal-day-cell-${d}">
                <div class="calendar-date">${d}</div>
                <div class="calendar-events" id="cal-events-${d}"></div>
            </div>`}this.getLatestRecorrenteAccounts(t).forEach(d=>{if(!d.due_date)return;const p=new Date(e,n,1),m=new Date(r.getFullYear(),r.getMonth(),1);let h=!0;if(d.status==="Off"&&p.getTime()>=m.getTime()&&(h=!1),!!h){for(let g=1;g<=i;g++)if(this.isEventOnDate(d,e,n,g)){const f=document.getElementById(`cal-events-${g}`);if(f){const y=`${e}-${String(n+1).padStart(2,"0")}-${String(g).padStart(2,"0")}`;let T=d.payment_status==="Pago"?"event-paid":d.payment_status==="Pendente"?"event-pending":"event-canceled";d.type==="Recorrente"&&y!==d.due_date&&(T="event-pending");const E=document.createElement("div");E.className=`event-pill event-${d.type.toLowerCase()} ${T}`,E.title=d.company_name,E.innerText=d.company_name,E.onclick=B=>{this.openDedicatedPage(d.id,y)},f.appendChild(E)}}}})},renderCalendarDay(t,e,n,o){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];l.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${a[n]} de ${e}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const i=new Date(e,n,o),r=new Date;r.setHours(0,0,0,0),i.setHours(0,0,0,0);let c=0;this.getLatestRecorrenteAccounts(t).forEach(d=>{let p=!0;if(d.status==="Off"&&i.getTime()>=r.getTime()&&(p=!1),!!p&&this.isEventOnDate(d,e,n,o)){c++;const m=`${e}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let h=d.payment_status==="Pago"?"#4ade80":d.payment_status==="Pendente"?"#facc15":"#ef4444";d.type==="Recorrente"&&m!==d.due_date&&(h="#facc15"),s.innerHTML+=`
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
                `}}),c===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(t,e){l.setText("calendar-date-display",`Ano de ${e}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],a=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const i=new Date(e,s,1);let r=0,c=0,u=0;this.getLatestRecorrenteAccounts(t).forEach(m=>{let h=!0;if(m.status==="Off"&&i.getTime()>=a.getTime()&&(h=!1),!h)return;const g=new Date(e,s+1,0).getDate();for(let f=1;f<=g;f++)this.isEventOnDate(m,e,s,f)&&(r++,m.type==="Recorrente"?c++:u++)});const p=r>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${p}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${r}</strong></p>
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${c}</p>`:""}
                       ${r>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${u}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(t){x.setMonth(t),l.setValue("filter-month",t),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(t=null){document.getElementById("account-form").reset();const e=document.getElementById("account-type");if(e.onchange=()=>{e.value==="Recorrente"?l.show("account-frequency-group"):l.hide("account-frequency-group")},t){l.setText("account-modal-title","Editar Conta");const n=z.find(o=>o.id===t);n&&(l.setValue("account-id",n.id),l.setValue("account-company",n.company_name),l.setValue("account-type",n.type),l.setValue("account-category",n.category||"Outros"),l.setValue("account-frequency",n.frequency||"1 mes"),l.setValue("account-value",parseFloat(n.value||0).toFixed(2)),l.setValue("account-status",n.status),l.setValue("account-payment-status",n.payment_status||"Pendente"),l.setValue("account-due-date",n.due_date||""),l.setValue("account-description",n.description||""),l.setValue("account-observation",n.observation||""),e.onchange())}else l.setText("account-modal-title","Nova Conta"),l.setValue("account-id",""),e.onchange();l.show("account-modal-form")},openDedicatedPage(t,e=null){const n=z.find(m=>m.id===t);if(!n)return;let o=z.filter(m=>m.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((m,h)=>new Date(h.due_date||0)-new Date(m.due_date||0)),l.hide("accounts-section"),l.show("dedicated-account-page"),l.setText("ded-acc-company",n.company_name);let a=0,s=0,i=0;const r=new Date;r.setHours(0,0,0,0),this.currentCompanyHistory.forEach(m=>{const h=parseFloat(m.value||0);if(m.payment_status==="Pago")a+=h,i++;else if(m.payment_status==="Pendente"&&m.due_date){const[g,f,y]=m.due_date.split("-"),T=new Date(parseInt(g,10),parseInt(f,10)-1,parseInt(y,10));T.setHours(0,0,0,0),T.getTime()<r.getTime()&&(s+=h)}});const c=a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),u=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});l.setText("ded-acc-total-paid","R$ "+c),l.setText("ded-acc-total-pending","R$ "+u),l.setText("ded-acc-total-count",i.toString());const d=document.getElementById("ded-acc-status-badge");n.status==="On"?d.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':d.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,e);const p=document.getElementById("btn-ded-add-history");p&&(p.onclick=()=>{this.openAccountModal(),setTimeout(()=>{l.setValue("account-company",n.company_name),l.setValue("account-type",n.type),l.setValue("account-category",n.category)},100)},_.isAdmin()||(p.style.display="none"))},injectCurrentMonthProjections(t){const e=new Date,n=e.getFullYear(),o=e.getMonth(),a=new Date(n,o+1,0).getDate();let s=null;if(t.forEach(c=>{c.type==="Recorrente"&&(s?new Date(c.due_date||0)>new Date(s.due_date||0)&&(s=c):s=c)}),!s)return t;const i=[...t],r=new Set(t.map(c=>c.due_date));for(let c=1;c<=a;c++)if(this.isEventOnDate(s,n,o,c)){const u=`${n}-${String(o+1).padStart(2,"0")}-${String(c).padStart(2,"0")}`;r.has(u)||i.push({...s,is_projection:!0,due_date:u,payment_status:"Pendente",unique_key:s.id+"_"+u})}return i.forEach(c=>{c.unique_key||(c.unique_key=c.id.toString())}),i},renderDedicatedHistoryList(){const t=document.getElementById("ded-acc-history-list");if(t){if(t.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){t.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(e=>{let n="Sem Data";if(e.due_date){const i=e.due_date.split("-");i.length===3&&(n=`${i[2]}/${i[1]}/${i[0]}`)}const o=parseFloat(e.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let a="#eab308";e.payment_status==="Pago"?a="#4ade80":e.payment_status==="Cancelado"&&(a="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==e.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===e.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(e.id,e.is_projection?e.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${a}22; color: ${a}; font-size: 0.75rem;">${e.payment_status||"Pendente"}</span>
                </div>
            `,t.appendChild(s)})}},selectHistoryItem(t,e=null){this.currentSelectedHistoryKey=e?t+"_"+e:t.toString(),this.renderDedicatedHistoryList();let n=null;if(e&&(n=this.currentCompanyHistory.find(r=>r.id===t&&r.due_date===e&&r.is_projection)),n||(n=this.currentCompanyHistory.find(r=>r.id===t&&!r.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){l.show("ded-acc-details-empty"),l.hide("ded-acc-details-content");return}l.hide("ded-acc-details-empty"),l.show("ded-acc-details-content");let o="DD/MM/YYYY";const a=e||n.due_date;if(a){const r=a.split("-");r.length===3&&(o=`${r[2]}/${r[1]}/${r[0]}`)}l.setText("ded-acc-det-date",o),l.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),l.setValue("ded-acc-det-date-input",a||""),l.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),l.setValue("ded-acc-det-account-status-input",n.status||"On"),l.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(l.show("ded-acc-det-freq-group"),l.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):l.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const r={...n,value:l.getValue("ded-acc-det-val-input"),due_date:l.getValue("ded-acc-det-date-input"),payment_status:l.getValue("ded-acc-det-status-input"),status:l.getValue("ded-acc-det-account-status-input"),observation:l.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?l.getValue("ded-acc-det-freq-input"):"1 mes"};try{await $.put(`/accounts/${n.id}`,r),alert("Fatura atualizada com sucesso!"),await this.fetch(),this.currentCompanyHistory=z.filter(c=>c.company_name===n.company_name).sort((c,u)=>new Date(u.due_date||0)-new Date(c.due_date||0)),this.openDedicatedPage(n.id)}catch{alert("Erro ao atualizar fatura.")}},_.isAdmin()||(s.style.display="none"));const i=document.getElementById("btn-ded-delete-account");i&&(i.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await $.delete(`/accounts/${n.id}`),await this.fetch();const r=z.filter(c=>c.company_name===n.company_name);r.length>0?this.openDedicatedPage(r[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},_.isAdmin()||(i.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(t){document.getElementById("ded-acc-file-input");const e=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),t.attachment_path){l.hide("ded-acc-upload-area"),l.show("ded-acc-preview-area");const n=t.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),a=t.attachment_path.split("/").pop()||"documento";l.setText("ded-acc-preview-name",a);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async r=>{r.preventDefault();const c=s.innerText;s.innerText="Carregando...";try{const u=await fetch(t.attachment_path);if(!u.ok)throw new Error("Doc não encontrado");const d=await u.blob(),p=window.URL.createObjectURL(d);window.open(p,"_blank")}catch(u){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",u)}finally{s.innerText=c}},n?(o.innerHTML="",o.style.backgroundImage=`url('${t.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const i=document.getElementById("btn-ded-remove-attachment");i.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await $.put(`/accounts/${t.id}`,{...t,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=z.filter(r=>r.company_name===t.company_name).sort((r,c)=>new Date(c.due_date||0)-new Date(r.due_date||0)),this.selectHistoryItem(t.id)}catch{alert("Erro ao remover anexo")}},_.isAdmin()||(i.style.display="none")}else{if(l.show("ded-acc-upload-area"),l.hide("ded-acc-preview-area"),_.isAdmin())e.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,e.style.cursor="pointer";else{e.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',e.style.cursor="default";return}e.onclick=s=>{const i=document.getElementById("ded-acc-file-input");i&&s.target!==i&&i.click()},e.addEventListener("dragover",s=>{s.preventDefault(),e.style.borderColor="var(--accent)",e.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{e.style.borderColor="rgba(255,255,255,0.2)",e.style.background="rgba(0,0,0,0.1)"};e.addEventListener("dragleave",()=>{n()});const o=async s=>{if(!s)return;e.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const i=new FormData;i.append("file",s);try{const r=await fetch("/api/upload",{method:"POST",body:i}),c=await r.json();r.ok?(await $.put(`/accounts/${t.id}`,{...t,attachment_path:c.path}),await this.fetch(),this.currentCompanyHistory=z.filter(u=>u.company_name===t.company_name).sort((u,d)=>new Date(d.due_date||0)-new Date(u.due_date||0)),this.selectHistoryItem(t.id)):(alert(c.error||"Erro no upload"),this.selectHistoryItem(t.id))}catch(r){alert("Falha na comunicação: "+r.message),console.error("Upload Error:",r),this.selectHistoryItem(t.id)}};e.addEventListener("drop",async s=>{if(s.preventDefault(),n(),s.dataTransfer.files.length>0){const i=s.dataTransfer.files[0];await o(i)}});const a=document.getElementById("ded-acc-file-input");a&&(a.onclick=s=>{s.stopPropagation()},a.onchange=async s=>{const i=s.target.files[0];await o(i)})}},async save(t){t.preventDefault();const e=l.getValue("account-id"),n={company_name:l.getValue("account-company"),type:l.getValue("account-type"),category:l.getValue("account-category"),value:l.getValue("account-value"),status:l.getValue("account-status"),payment_status:l.getValue("account-payment-status"),due_date:l.getValue("account-due-date"),description:l.getValue("account-description"),observation:l.getValue("account-observation"),frequency:l.getValue("account-type")==="Recorrente"?l.getValue("account-frequency"):"1 mes"};try{const o=e?`/accounts/${e}`:"/accounts";e?await $.put(o,n):await $.post(o,n),l.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(t){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await $.delete(`/accounts/${t}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(t){V=t,this.renderAccountsList(Ze)},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${V===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${V-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=e;c++)(c===1||c===e||c>=V-1&&c<=V+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===V?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${V===e?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${V+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(V-1)*be+1,r=Math.min(V*be,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let se=[],J={},ee=null,Pe=null,_e=null,q=[],Be=[],qe={},W={},pe,Ne,Se,Me,nt,He;const ot={init(){pe=document.getElementById("timeline-event-form"),Ne=document.getElementById("view-visualizacao"),Se=document.getElementById("view-attention"),Me=document.getElementById("view-anexo"),nt=document.getElementById("view-relatorio"),He=document.getElementById("view-config"),window.timelineHandler=ot,window.applyFilters=pt,window.clearFilters=gt,window.toggleFilters=ht,window.handleDelete=mt,window.resetForm=Je,window.toggleAccordion=it,window.handleFormSubmit=tt,window.editEvent=Ye,window.deleteTopic=xt,window.deleteSubtopic=Et,window.handleTrackDragStart=$t,window.handleTrackDragOver=Tt,window.handleTrackDragEnd=Lt;const t=document.getElementById("timeline-topic-form");t&&t.addEventListener("submit",bt);const e=document.getElementById("timeline-subtopic-form");e&&e.addEventListener("submit",wt);const n=document.getElementById("topico");n&&n.addEventListener("change",u=>{Ue(u.target.value)});const o=document.getElementById("em-ocorrencia");o&&o.addEventListener("change",u=>{const d=document.getElementById("fim"),p=document.getElementById("inicio");if(u.target.checked){if(!p.value){const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),p.value=m.toISOString().slice(0,16)}d.required=!1}else{const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),d.value=m.toISOString().slice(0,16),d.required=!0}});const a=document.getElementById("auto-refresh-toggle");a&&a.addEventListener("change",u=>{at(u.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(u=>{u.addEventListener("click",d=>{const p=d.currentTarget.getAttribute("data-timeline-tab");Ce(p)})}),pe&&pe.addEventListener("submit",tt);const s=document.getElementById("rep-filter-start"),i=document.getElementById("rep-filter-end"),r=document.getElementById("rep-filter-topic"),c=document.getElementById("rep-filter-subtopic");s&&s.addEventListener("change",()=>Ee()),i&&i.addEventListener("change",()=>Ee()),r&&r.addEventListener("change",u=>{vt(u.target.value),Ee()}),c&&c.addEventListener("change",()=>Ee()),window.addEventListener("SectionChange",u=>{u.detail&&u.detail.section==="timeline"&&re().then(()=>{K(),et()})}),re().then(()=>{K(),et()})}};window.addEventListener("focus",()=>{Ne&&K()});function Ue(t,e=null){const n=document.getElementById("sub-topico");if(!n)return;const o=t?t.toLowerCase().trim():"";if(!o||!W[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',W[o].forEach(a=>{const s=document.createElement("option");s.value=a.toLowerCase(),s.textContent=a,e&&s.value===e.toLowerCase()&&(s.selected=!0),n.appendChild(s)}),e||(n.selectedIndex=1),n.classList.add("has-options")}async function re(){try{const t=await fetch("/api/timeline/config");if(!t.ok)throw new Error("Falha ao buscar configurações");const e=await t.json();q=e.topics||[],Be=e.subtopics||[],qe={},W={},q.forEach(o=>{qe[o.id]=o.color,W[o.id]=[]}),Be.forEach(o=>{const a=o.topic_id;W[a]&&W[a].push(o.name)}),ut();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&rt()}catch(t){console.error("Error loading config:",t)}}function ut(){const t=document.getElementById("topico");if(t){const o=t.value;t.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',q.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,t.appendChild(s)}),t.value=o}const e=document.getElementById("rep-filter-topic");if(e){const o=e.value;e.innerHTML='<option value="Todos">Todos</option>',q.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,e.appendChild(s)}),o&&[...e.options].some(a=>a.value===o)?e.value=o:e.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',q.forEach(o=>{const a=document.createElement("option");a.value=o.id,a.textContent=o.name,n.appendChild(a)}))}function K(){fetch("/api/timeline/events").then(t=>{if(!t.ok)throw new Error("Failed to fetch");return t.json()}).then(t=>{se=t,Ge(),Se&&Se.classList.contains("active")&&st()}).catch(t=>{console.error("Error loading events:",t)})}function et(){const t=document.getElementById("timeline-tab-anexo"),e=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())t&&t.classList.remove("role-hidden"),e&&e.classList.remove("role-hidden");else{t&&t.classList.add("role-hidden"),e&&e.classList.add("role-hidden");const o=Me&&Me.classList.contains("active"),a=He&&He.classList.contains("active");(o||a)&&Ce("visualizacao")}}function Ce(t){const e={visualizacao:{section:Ne,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:Se,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:Me,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:nt,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:He,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(e).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),e[t]&&(e[t].section&&e[t].section.classList.add("active"),e[t].button&&e[t].button.classList.add("active")),t==="visualizacao"?(K(),we(!0)):t==="attention"?(st(),we(!0)):t==="relatorio"?(Ee(),we(!1)):(t==="config"&&rt(),we(!1))}function we(t){const e=document.getElementById("floating-refresh-control");if(e)if(t){e.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!ee&&at(!0)}else e.classList.add("hidden"),ee&&(clearInterval(ee),ee=null)}function at(t){ee&&(clearInterval(ee),ee=null),t&&(K(),ee=setInterval(K,6e4))}function tt(t){t.preventDefault();const e=pe.querySelector('button[type="submit"]');e&&(e.textContent="Salvando...",e.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async a=>{const s=await a.text();if(!a.ok)throw new Error(`Server error (${a.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),Je(),Ce("visualizacao")}).catch(a=>{console.error("Error saving event:",a),alert("Erro ao salvar evento: "+a.message)}).finally(()=>{e&&(e.textContent="Salvar Evento",e.disabled=!1)})}function Ye(t){const e=se.find(s=>s.id===t);if(!e)return;document.getElementById("event-id").value=e.id,document.getElementById("nome").value=e.nome;const n=$e(e.topico);document.getElementById("topico").value=n,Ue(n,e.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=e.em_ocorrencia==1||e.em_ocorrencia==="true"||!e.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=e.inicio,document.getElementById("fim").value=e.fim||"",document.getElementById("descricao").value=e.descricao||"",document.getElementById("anotacao").value=e.anotacao||"",document.getElementById("cor").value=e.cor||"#000000",Ce("anexo");const a=document.getElementById("btn-delete");a&&(a.style.display="block")}function Je(){pe&&pe.reset();const t=document.getElementById("event-id");t&&(t.value=""),Ue("");const e=document.getElementById("fim");e&&(e.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function mt(){const t=document.getElementById("event-id").value;t&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Failed to delete");return e.json()}).then(()=>{alert("Evento excluído!"),Je(),Ce("visualizacao")}).catch(e=>{console.error("Error deleting:",e),alert("Erro ao excluir: "+e.message)})}function pt(t){const e=document.getElementById(`filter-start-${t}`),n=document.getElementById(`filter-end-${t}`),o=document.getElementById(`filter-sub-topic-${t}`),a=e&&e.value?new Date(e.value).getTime():null,s=n&&n.value?new Date(n.value).getTime():null,i=o?o.value:"";J[t]={start:a,end:s,subTopic:i},Ge()}function gt(t){const e=document.getElementById(`filter-start-${t}`),n=document.getElementById(`filter-end-${t}`),o=document.getElementById(`filter-sub-topic-${t}`);e&&(e.value=""),n&&(n.value=""),o&&(o.value=""),J[t]=null,Ge()}function ht(t){const e=document.getElementById(`filters-panel-${t}`),n=document.getElementById(`btn-toggle-${t}`);e&&n&&(e.classList.toggle("hidden"),n.classList.toggle("active"))}function it(t){const e=document.getElementById(t);e&&e.classList.toggle("active")}function Ge(){const t=document.getElementById("timeline-tracks-container");if(!t)return;const e=Array.from(t.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId),n=q.map(a=>a.id);if(e.length!==n.length||!n.every(a=>e.includes(a))){t.innerHTML="";const a=window.auth&&window.auth.isAdmin(),s=a?'style="cursor: grab;"':"";q.forEach(i=>{const r=`
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
            `;t.insertAdjacentHTML("beforeend",r);const c=document.getElementById(`filter-sub-topic-${i.id}`);c&&W[i.id]&&W[i.id].forEach(u=>{const d=document.createElement("option");d.value=u.toLowerCase(),d.textContent=u,c.appendChild(d)})})}q.forEach(a=>{const s=document.getElementById(`track-${a.id}`),i=document.getElementById(`min-date-${a.id}`),r=document.getElementById(`max-date-${a.id}`);s&&(s.innerHTML=""),i&&(i.textContent=""),r&&(r.textContent="")}),se.length!==0&&q.forEach(a=>{const s=a.id,i=se.filter(y=>$e(y.topico)===s);let r=i;J[s]&&J[s].subTopic&&(r=i.filter(y=>(y.sub_topico?y.sub_topico.toLowerCase():"")===J[s].subTopic.toLowerCase()));const c=J[s]&&J[s].start?J[s].start:new Date("2026-01-01T00:00:00").getTime(),u=J[s]&&J[s].end?J[s].end:Date.now();ft(s,r,c,u);const d=c,p=u,m=p-d,h=document.getElementById(`min-date-${s}`),g=document.getElementById(`max-date-${s}`);h&&(h.textContent=new Date(d).toLocaleDateString()+" "+new Date(d).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),g&&(g.textContent=new Date(p).toLocaleDateString()+" "+new Date(p).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const f=document.getElementById(`track-${s}`);f&&r.forEach(y=>{const T=new Date(y.inicio).getTime(),E=y.fim?new Date(y.fim).getTime():Date.now();if(E<d||T>p)return;const B=Math.max(T,d),O=Math.min(E,p),F=(B-d)/m*100,b=(O-B)/m*100;if(b<=0)return;const D=document.createElement("div");D.className="timeline-bar",D.style.left=`${F}%`,D.style.width=`${b}%`,D.style.color=y.cor&&y.cor!=="#000000"?y.cor:qe[s]||"#6b7280";const v=document.createElement("div");v.className="timeline-bar-visual",D.appendChild(v);const M=document.createElement("div");M.className="timeline-identifier-point";const j=new Date(y.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),N=y.fim?new Date(y.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",U=a.name,I=y.sub_topico?y.sub_topico.charAt(0).toUpperCase()+y.sub_topico.slice(1):"-";M.setAttribute("data-tooltip",`Tópico: ${U}
Eventos: ${I}
Início: ${j} - Fim: ${N}
Descrição: ${y.descricao||"-"}`),!y.fim&&M.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(M.style.cursor="pointer",M.onclick=le=>{le.stopPropagation(),Ye(y.id)}):M.style.cursor="default",D.appendChild(M),f.appendChild(D)})})}function $e(t){return t?t.toLowerCase().trim():""}function ft(t,e,n,o){const a=document.getElementById(`sla-${t}`);if(!a)return;const s=o-n;if(s<=0){a.textContent="N/A";return}const r=e.filter(m=>{const h=new Date(m.inicio).getTime();return(m.fim?new Date(m.fim).getTime():Date.now())>n&&h<o}).map(m=>({start:Math.max(new Date(m.inicio).getTime(),n),end:Math.min(m.fim?new Date(m.fim).getTime():Date.now(),o)}));r.sort((m,h)=>m.start-h.start);const c=[];if(r.length>0){let m=r[0];for(let h=1;h<r.length;h++){const g=r[h];g.start<m.end?m.end=Math.max(m.end,g.end):(c.push(m),m=g)}c.push(m)}let u=0;c.forEach(m=>{u+=m.end-m.start});const d=(s-u)/s*100;let p="#10b981";d<50?p="#ef4444":d<90&&(p="#f97316"),a.style.color=p,a.textContent=d.toFixed(4)+"%"}function st(){const t=document.getElementById("attention-topics-container");if(!t)return;t.innerHTML="";const e=se.filter(n=>!n.fim);q.forEach(n=>{const o=n.id,a=e.filter(f=>$e(f.topico)===o),s=document.createElement("div");s.className=a.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const i=document.createElement("div");i.className="accordion-header",i.onclick=()=>it(`attn-acc-${o}`);const r=document.createElement("div");r.className="accordion-title-group";const c=document.createElement("div");c.className="topic-indicator",c.style.backgroundColor=n.color;const u=document.createElement("h3");u.textContent=n.name;const d=document.createElement("span");d.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",d.textContent=`${a.length}`,r.appendChild(c),r.appendChild(u),r.appendChild(d);const p=document.createElement("span");p.className="accordion-chevron",p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',i.appendChild(r),i.appendChild(p);const m=document.createElement("div");m.className="accordion-content";const h=document.createElement("div");h.className="accordion-body";const g=document.createElement("div");if(g.className="attention-carousel",a.length===0){const f=document.createElement("div");f.className="empty-state",f.textContent="Nenhum evento em andamento.",g.appendChild(f)}else a.forEach(f=>{const y=document.createElement("div");y.className="attention-card",y.style.borderLeftColor=f.cor&&f.cor!=="#000000"?f.cor:n.color;const T=document.createElement("h3");T.textContent=f.nome;const E=document.createElement("div");E.className="sub-topic",E.textContent=f.sub_topico||"-";const B=document.createElement("div");B.className="card-detail",B.innerHTML=`<strong>Início:</strong> ${new Date(f.inicio).toLocaleString()}`;const O=Date.now()-new Date(f.inicio).getTime(),F=document.createElement("div");F.className="card-duration",F.innerHTML=`<strong>Tempo:</strong> <span>${yt(O)}</span>`;const b=document.createElement("div");b.className="card-description",b.textContent=f.descricao||"-",y.appendChild(T),y.appendChild(E),y.appendChild(B),y.appendChild(F),y.appendChild(b),window.auth&&window.auth.isAdmin()?(y.style.cursor="pointer",y.onclick=()=>Ye(f.id)):y.style.cursor="default",g.appendChild(y)});h.appendChild(g),m.appendChild(h),s.appendChild(i),s.appendChild(m),t.appendChild(s)})}function yt(t){if(t<0)return"0s";const e=Math.floor(t/1e3),n=Math.floor(e/60),o=Math.floor(n/60),a=Math.floor(o/24),s=[];return a>0&&s.push(`${a}d`),(o%24>0||a>0)&&s.push(`${o%24}h`),(n%60>0||o>0)&&s.push(`${n%60}m`),s.push(`${e%60}s`),s.join(" ")}function vt(t){const e=document.getElementById("rep-filter-subtopic");if(!e)return;e.innerHTML='<option value="Todos">Todos</option>';const n=t?t.toLowerCase().trim():"";n&&W[n]&&W[n].forEach(o=>{const a=document.createElement("option");a.value=o.toLowerCase(),a.textContent=o,e.appendChild(a)})}function Ee(){let t=se;const e=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,a=document.getElementById("rep-filter-subtopic")?.value;if(e){const b=new Date(e+"T00:00:00").getTime();t=t.filter(D=>new Date(D.inicio).getTime()>=b)}if(n){const b=new Date(n+"T23:59:59").getTime();t=t.filter(D=>new Date(D.inicio).getTime()<=b)}o&&o!=="Todos"&&(t=t.filter(b=>$e(b.topico)===o.toLowerCase())),a&&a!=="Todos"&&(t=t.filter(b=>b.sub_topico&&b.sub_topico.toLowerCase()===a.toLowerCase()));const s=document.getElementById("rep-kpi-total"),i=document.getElementById("rep-kpi-active"),r=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=t.length);const c=t.filter(b=>b.em_ocorrencia==1||b.em_ocorrencia==="true"||!b.fim);i&&(i.textContent=c.length);const u=t.filter(b=>b.fim);let d="0h 0m";if(u.length>0){const D=u.reduce((N,U)=>N+(new Date(U.fim).getTime()-new Date(U.inicio).getTime()),0)/u.length,v=Math.floor(D/6e4),M=Math.floor(v/60),j=v%60;d=`${M}h ${j}m`}if(r&&(r.textContent=d),!window.Chart){console.warn("Chart.js is not loaded.");return}const p=q,m=e?new Date(e+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),h=n?new Date(n+"T23:59:59").getTime():Date.now(),g=p.map(b=>b.name),f=p.map(b=>{const D=b.id,v=se.filter(k=>$e(k.topico)===D),M=h-m;if(M<=0)return 100;const N=v.filter(k=>{const G=new Date(k.inicio).getTime();return(k.fim?new Date(k.fim).getTime():Date.now())>m&&G<h}).map(k=>({start:Math.max(new Date(k.inicio).getTime(),m),end:Math.min(k.fim?new Date(k.fim).getTime():Date.now(),h)}));N.sort((k,G)=>k.start-G.start);const U=[];if(N.length>0){let k=N[0];for(let G=1;G<N.length;G++){const te=N[G];te.start<k.end?k.end=Math.max(k.end,te.end):(U.push(k),k=te)}U.push(k)}const Y=(k=>{let G=0;return k.forEach(te=>{G+=te.end-te.start}),G})(U),le=(M-Y)/M*100;return parseFloat(le.toFixed(4))}),y=p.map(b=>b.color||"#6b7280"),T=document.getElementById("chart-rep-sla");T&&(Pe&&Pe.destroy(),Pe=new window.Chart(T,{type:"bar",data:{labels:g,datasets:[{label:"Disponibilidade %",data:f,backgroundColor:y,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...f)-5),max:100,ticks:{callback:b=>b+"%"}}}}}));const E={};t.forEach(b=>{const D=b.sub_topico?b.sub_topico.charAt(0).toUpperCase()+b.sub_topico.slice(1).toLowerCase():"Não especificado";E[D]=(E[D]||0)+1});const B=Object.keys(E),O=Object.values(E),F=document.getElementById("chart-rep-qty");F&&(_e&&_e.destroy(),_e=new window.Chart(F,{type:"doughnut",data:{labels:B.length>0?B:["Nenhum evento"],datasets:[{data:O.length>0?O:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function bt(t){t.preventDefault();const e=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!e||!n||!o)return;const a={id:e.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!a.id){alert("Por favor, defina um ID para o tópico.");return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>{alert("Tópico salvo com sucesso!"),e.value="",n.value="",o.value="#3b82f6",re().then(()=>{K()})}).catch(s=>{console.error(s),alert("Erro: "+s.message)})}function wt(t){t.preventDefault();const e=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!e||!n)return;const o={topic_id:e.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento.");return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(a=>{if(!a.ok)throw new Error("Erro ao adicionar evento");return a.json()}).then(()=>{alert("Evento adicionado!"),n.value="",re()}).catch(a=>{console.error(a),alert("Erro: "+a.message)})}function xt(t){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Erro ao excluir tópico");return e.json()}).then(()=>{alert("Tópico excluído!"),re().then(()=>{K()})}).catch(e=>{console.error(e),alert("Erro: "+e.message)})}function Et(t){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${t}`,{method:"DELETE"}).then(e=>{if(!e.ok)throw new Error("Erro ao excluir evento");return e.json()}).then(()=>{alert("Evento excluído!"),re()}).catch(e=>{console.error(e),alert("Erro: "+e.message)})}function rt(){const t=document.getElementById("config-topics-list");t&&(t.innerHTML="",q.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':q.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(o)}));const e=document.getElementById("config-subtopics-list");e&&(e.innerHTML="",Be.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':Be.forEach(n=>{const o=q.find(r=>r.id===n.topic_id),a=o?o.name:n.topic_id,s=o?o.color:"#6b7280",i=document.createElement("div");i.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",i.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${a}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(i)}))}function $t(t,e){t.currentTarget.classList.add("dragging"),t.dataTransfer.effectAllowed="move"}function Tt(t){t.preventDefault();const e=document.querySelector(".timeline-container.dragging");if(!e)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const a=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const i=s.getBoundingClientRect();return t.clientY<=i.top+i.height/2});a?n.insertBefore(e,a):n.appendChild(e)}function Lt(t){const e=document.querySelector(".timeline-container.dragging");e&&e.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(a=>{a.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId);Ct(o)}function Ct(t){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:t})}).then(e=>{if(!e.ok)throw new Error("Erro ao salvar nova ordenação");return e.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),re().then(()=>{K()})}).catch(e=>{console.error(e),alert("Erro ao salvar ordenação: "+e.message)})}let ue=[],Fe=[],Ve=[],Re=[],L="extensions",S=1,me=100,ze=[];const xe={setActiveTab(t){L=t,S=1;const e=document.getElementById("telephony-search");e&&(e.value="",t==="extensions"?e.placeholder="Pesquisar ramais por número, nome ou usuário...":t==="queues"?e.placeholder="Pesquisar filas por número ou nome...":t==="blf"?e.placeholder="Pesquisar BLF por nome...":t==="users"&&(e.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(s=>{s.id===`tab-telephony-${t}`?s.classList.add("active"):s.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(s=>{s.id===`telephony-view-${t==="users"?"users":t==="queues"?"queues":t}`?s.classList.remove("hidden"):s.classList.add("hidden")});const a=this.getActiveDataList();this.render(a)},getActiveDataList(){return L==="extensions"?ue:L==="queues"?Fe:L==="blf"?Ve:L==="users"?Re:[]},async fetch(){const t=this.getActiveTableBody();t&&(t.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(S=1,L==="extensions")ue=await $.get("/telephony/extensions"),this.render(ue);else if(L==="queues")Fe=await $.get("/telephony/queues"),this.render(Fe);else if(L==="blf"){if(ue.length===0)try{ue=await $.get("/telephony/extensions")}catch(e){console.warn("Could not pre-fetch extensions for BLF mapping:",e)}Ve=await $.get("/telephony/blfs"),this.render(Ve)}else L==="users"&&(Re=await $.get("/telephony/users"),this.render(Re))}catch(e){console.error(`Error fetching telephony ${L}:`,e),t&&(t.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${e.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return L==="extensions"?document.getElementById("telephony-table-body"):L==="queues"?document.getElementById("telephony-queues-table-body"):L==="blf"?document.getElementById("telephony-blf-table-body"):L==="users"?document.getElementById("telephony-users-table-body"):null},render(t){const e=this.getActiveTableBody();if(!e)return;ze=t;const n=t.length,o=Math.ceil(n/me);S>o&&(S=Math.max(1,o)),S<1&&(S=1);const a=(S-1)*me,s=t.slice(a,a+me);if(s.length===0){const i=L==="extensions"?7:L==="queues"?6:L==="blf"?4:5;e.innerHTML=`
                <tr>
                    <td colspan="${i}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}L==="extensions"?this.renderExtensionsList(e,s):L==="queues"?this.renderQueuesList(e,s):L==="blf"?this.renderBlfsList(e,s):L==="users"&&this.renderUsersList(e,s),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(t,e){t.innerHTML=e.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.ddr||"-",i=n.Username||"-",r=n.Secret||"",c=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",u=n.observacao||"-",d=r.replace(/'/g,"\\'");return`
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
            `}).join("")},renderBlfsList(t,e){t.innerHTML=e.map(n=>{const o=n.id,a=n.Nome||"-",s=n.quantidade_extensoes||0,i=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",r=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(c=>{const u=ue.find(m=>m.id===c||m.extensao_id===c),d=u?u.exten:`ID ${c}`,p=u?u.nome:"Não encontrado";return`
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
            `}).join("")},toggleQueueRow(t){const e=document.getElementById(`queue-details-${t}`),n=document.getElementById(`queue-arrow-${t}`);e&&(e.classList.toggle("hidden"),n&&(e.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(t){const e=document.getElementById(`blf-details-${t}`),n=document.getElementById(`blf-arrow-${t}`);e&&(e.classList.toggle("hidden"),n&&(e.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(t){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(t){S=1;const n=this.getActiveDataList().filter(o=>L==="extensions"?(o.exten||"").toLowerCase().includes(t)||(o.nome||"").toLowerCase().includes(t)||(o.Username||"").toLowerCase().includes(t)||(o.ddr||"").toLowerCase().includes(t)||(o.observacao||"").toLowerCase().includes(t):L==="queues"?(o.exten||"").toLowerCase().includes(t)||(o.nome||"").toLowerCase().includes(t)||(o.Estrategia||"").toLowerCase().includes(t):L==="blf"?(o.Nome||"").toLowerCase().includes(t):L==="users"?(o.username||"").toLowerCase().includes(t)||(o.email||"").toLowerCase().includes(t)||(o.Tipo||"").toLowerCase().includes(t):!1);this.render(n)},changePage(t){S=t,this.render(ze)},setPageSize(t){me=parseInt(t,10),S=1,this.render(ze)},toggleSecret(t,e){const n=document.getElementById(`secret-txt-${t}`),o=document.getElementById(`secret-icon-${t}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=e,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(t,e,n){const o=document.getElementById(t);if(!o)return;if(e===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${S===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${S-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let c=1;c<=e;c++)(c===1||c===e||c>=S-1&&c<=S+1)&&(s&&c-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===S?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${c})">
                        ${c}
                    </button>
                `,s=c);a+=`
            <button class="pagination-btn" 
                    ${S===e?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${S+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const i=(S-1)*me+1,r=Math.min(S*me,n);a+=`
            <span class="pagination-info">
                Exibindo ${i}-${r} de ${n}
            </span>
        `,o.innerHTML=a}};let ae="list";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=_,It(),Dt(),kt(),ot.init(),_.init()?(console.log("Sessão restaurada:",_.getUser().email),ct()):lt()});let Oe,ie,Te,Le;function It(){Oe=document.querySelectorAll(".nav-btn"),ie=document.getElementById("btn-new-item"),Te=document.getElementById("login-section"),Le=document.getElementById("app-container")}function lt(){Te&&Te.classList.remove("hidden"),Le&&Le.classList.add("hidden"),document.body.style.overflow="hidden"}function Dt(){const t=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=t-5;o<=t+5;o++){const a=document.createElement("option");a.value=o,a.textContent=o,o===t&&(a.selected=!0),n.appendChild(a)}})}function ct(){if(Te&&Te.classList.add("hidden"),Le&&Le.classList.remove("hidden"),document.body.style.overflow="",ae="list",ke(),R.fetch(),Z.fetch(),je.fetch(),P.fetch(),window.auth){const t=document.getElementById("timeline-tab-anexo");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"));const e=document.getElementById("timeline-tab-config");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"))}}function ke(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section"].forEach(t=>{l.hide(t)}),ie&&ie.classList.add("hidden"),We.stop(),ae){case"account":case"profile":l.show("account-section"),l.setText("section-title","Minha Conta"),setTimeout(()=>We.start(),100);break;case"list":l.show("list-section"),l.setText("section-title","Listagem Geral"),_.isAdmin()&&ie&&ie.classList.remove("hidden");break;case"docs":l.show("docs-section"),l.setText("section-title","Documentação");break;case"detail":l.show("detail-section"),l.setText("section-title","Procedimento");break;case"users":l.show("users-section"),l.setText("section-title","Gestão de Usuários");break;case"accounts":l.show("accounts-section"),l.setText("section-title","Gestão de Contas"),P.handleSearch();break;case"timeline":l.show("timeline-section"),l.setText("section-title","Timeline");break;case"telephony":l.show("telephony-section"),l.setText("section-title","Telefonia");break}dt()}function dt(){const t=_.isAdmin();l.toggle("nav-users",!t),l.toggle("nav-accounts",!t),ie&&ie.classList.toggle("role-hidden",!t);const e=document.getElementById("btn-floating-edit");e&&e.classList.toggle("role-hidden",!t),document.querySelectorAll(".btn-actions-container").forEach(i=>{i.classList.toggle("role-hidden",!t)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(i=>{const r=document.getElementById(i);r&&r.classList.toggle("role-hidden",!t)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!t);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!t);const a=document.getElementById("btn-new-doc");a&&a.classList.toggle("role-hidden",!t);const s=_.getUser();if(s){let i=s.name;(i.toLowerCase().startsWith("usuário ")||i.toLowerCase().startsWith("usuario "))&&(i=i.substring(8)),l.setText("profile-name-display",i),l.setText("profile-role-display",s.role);let r=i.substring(0,2).toUpperCase();const c=i.trim().split(/\s+/);c.length>1&&(r=(c[0][0]+c[c.length-1][0]).toUpperCase()),l.setText("profile-avatar-initials",r)}}function kt(){const t=document.getElementById("sidebar"),e=document.getElementById("sidebar-toggle");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("collapsed")}),Oe.forEach(i=>{i.addEventListener("click",()=>{if(Oe.forEach(r=>r.classList.remove("active")),i.classList.add("active"),ae=i.dataset.section,ke(),window.innerWidth<=768){t.classList.remove("open");const r=document.getElementById("sidebar-overlay");r&&r.classList.remove("active")}})}),window.addEventListener("SectionChange",i=>{ae=i.detail.section,ke()}),l.on("login-form","submit",async i=>{i.preventDefault();const r=document.getElementById("login-btn"),c=document.getElementById("login-error");r&&(r.disabled=!0);const u=await _.login(l.getValue("login-email"),l.getValue("login-password"));r&&(r.disabled=!1),u.success?ct():c&&(c.innerText=u.error,c.classList.remove("hidden"))}),l.on("btn-logout","click",()=>{const i=document.getElementById("auto-refresh-toggle");i&&i.checked&&(i.checked=!1,i.dispatchEvent(new Event("change"))),_.logout(),lt()}),document.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{const r=i.closest(".modal");r&&r.classList.add("hidden")})}),window.UsersHandler=je,window.DocsHandler=Z,window.ProceduresHandler=R,window.AccountsHandler=P,window.TelephonyHandler=xe,["extensions","queues","blf","users"].forEach(i=>{l.on(`tab-telephony-${i}`,"click",()=>xe.setActiveTab(i))}),l.on("telephony-search","input",i=>xe.search(i.target.value.toLowerCase())),l.on("telephony-page-size","change",i=>xe.setPageSize(i.target.value)),l.on("telephony-reload-btn","click",()=>{const i=document.getElementById("telephony-search");i&&(i.value=""),xe.fetch()}),l.on("accounts-search","input",()=>P.handleSearch()),l.on("filter-status","change",()=>P.handleSearch()),l.on("filter-date-toggle","change",i=>{const r=document.getElementById("sidebar-mini-calendar-list");r&&(r.style.opacity=i.target.checked?"1":"0.4",r.style.pointerEvents=i.target.checked?"auto":"none"),P.handleSearch()}),l.on("filter-cal-month","change",()=>P.handleFilterChange(!0)),l.on("filter-cal-year","change",()=>P.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(i=>{l.on(i,"change",()=>{ae==="accounts"&&P.renderDashboard()})}),l.on("btn-dash-clear-dates","click",()=>{l.setValue("dash-filter-start",""),l.setValue("dash-filter-end",""),l.setValue("dash-filter-type","Todos"),l.setValue("dash-filter-status","Todos"),l.setValue("dash-filter-payment","Todos"),P.resetMultiselects(),l.setValue("dash-sort-empresas","desc"),l.setValue("dash-sort-categorias","desc"),ae==="accounts"&&P.renderDashboard()}),l.on("user-form","submit",i=>je.save(i)),l.on("doc-form","submit",i=>Z.handleUpload(i)),l.on("account-form","submit",i=>P.save(i)),l.on("faq-form","submit",i=>R.saveMeta(i));const n=document.getElementById("proc-color-palette"),o=document.getElementById("proc-color");n&&o&&(n.addEventListener("click",i=>{const r=i.target.closest(".color-swatch");if(r)if(r.id==="color-custom-swatch")o.click();else{const c=r.dataset.color;c&&(o.value=c,n.querySelectorAll(".color-swatch").forEach(u=>u.classList.remove("active")),r.classList.add("active"))}}),o.addEventListener("input",i=>{const r=document.getElementById("color-custom-swatch");r&&(r.style.background=i.target.value,n.querySelectorAll(".color-swatch").forEach(c=>c.classList.remove("active")),r.classList.add("active"))})),l.on("btn-new-item","click",()=>{if(l.setText("modal-form-title","Novo Procedimento"),l.setValue("proc-id",""),l.setValue("proc-content","[]"),n){n.querySelectorAll(".color-swatch").forEach(r=>r.classList.remove("active"));const i=n.querySelector('[data-color="#4F46E5"]');i&&i.classList.add("active")}o&&(o.value="#4F46E5"),l.show("modal-form")}),l.on("btn-new-account","click",()=>P.openAccountModal()),l.on("btn-new-account-cal","click",()=>P.openAccountModal()),l.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),l.setValue("user-id-form",""),l.show("modal-user")}),l.on("list-search","input",i=>{R.search(i.target.value.toLowerCase())}),l.on("doc-search","input",i=>{Z.search(i.target.value.toLowerCase())}),l.on("doc-dash-search","input",()=>{Z.renderDashboard()}),l.on("doc-dash-filter-category","change",()=>{Z.renderDashboard()}),l.on("doc-dash-filter-status","change",()=>{Z.renderDashboard()}),l.on("btn-new-doc","click",()=>{l.show("modal-upload")}),["geral","contratos","termo-de-uso","dashboard"].forEach(i=>{l.on(`tab-doc-${i}`,"click",()=>{let r;i==="termo-de-uso"?r="Termo de Uso":i==="dashboard"?r="dashboard":r=i,Z.setActiveTab(r)})}),l.on("doc-category","change",i=>{const r=i.target.value.toLowerCase(),c=document.getElementById("doc-dates-container");c&&(c.style.display=r==="contratos"||r==="termo de uso"?"grid":"none")}),l.on("doc-indefinite","change",i=>{const r=document.getElementById("doc-end-date");r&&(r.disabled=i.target.checked,i.target.checked&&(r.value=""))});const a=document.getElementById("drop-zone"),s=document.getElementById("doc-file");a&&s&&(a.addEventListener("click",i=>{i.target!==s&&s.click()}),s.addEventListener("click",i=>{i.stopPropagation()}),s.addEventListener("change",i=>{i.target.files.length>0&&l.setText("file-name-display",i.target.files[0].name)}),a.addEventListener("dragover",i=>{i.preventDefault(),a.classList.add("dragover")}),a.addEventListener("dragleave",()=>{a.classList.remove("dragover")}),a.addEventListener("drop",i=>{i.preventDefault(),a.classList.remove("dragover"),i.dataTransfer.files.length>0&&(s.files=i.dataTransfer.files,l.setText("file-name-display",i.dataTransfer.files[0].name))})),l.on("toggle-list","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),R.setListingMode("list")}),l.on("toggle-cards","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),R.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes"].forEach(i=>{l.on(`tab-acc-${i}`,"click",r=>{document.querySelectorAll(".acc-tab-btn").forEach(m=>m.classList.remove("active")),r.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(m=>{m.classList.add("hidden"),m.classList.remove("active")});const c=document.getElementById("accounts-dashboard-view");c&&(c.classList.add("hidden"),c.classList.remove("active"));const u=i==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${i}`,d=document.getElementById(u);d&&(d.classList.remove("hidden"),d.classList.add("active"));const p=document.getElementById("calendar-view-toggle-container");p&&(i==="calendario"?(p.classList.remove("hidden"),p.style.display="flex"):(p.classList.add("hidden"),p.style.display="none")),P.setAccountsViewMode(i==="calendario"?"calendar":i==="dashboard"?"dashboard":i==="notificacoes"?"notificacoes":"list")})}),["day","month","year"].forEach(i=>{l.on(`toggle-accounts-cal-${i}`,"click",r=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(c=>c.classList.remove("active")),r.currentTarget.classList.add("active"),["day","month","year"].forEach(c=>{document.getElementById(`cal-${c}-view-container`).classList.toggle("hidden-cal-view",c!==i)}),P.setCalendarSubView(i)})}),l.on("btn-prev-date-nav","click",()=>P.shiftCalendarDate(-1)),l.on("btn-next-date-nav","click",()=>P.shiftCalendarDate(1)),l.on("btn-back-to-accounts","click",()=>{l.hide("dedicated-account-page"),l.show("accounts-section"),dt()}),l.on("btn-back-to-list","click",()=>{const i=document.getElementById("procedure-edit-wrapper");i&&!i.classList.contains("hidden")?R.toggleEditMode(!1):(ae="list",ke())}),l.on("btn-floating-edit","click",()=>R.toggleEditMode(!0)),l.on("btn-cancel-edit","click",()=>R.toggleEditMode(!1)),l.on("btn-save-procedure","click",()=>R.handleSaveProcedure()),l.on("confirm-yes","click",()=>{l.hide("modal-confirm"),R.openDetail(R.getPendingProcId())}),l.on("confirm-no","click",()=>{l.hide("modal-confirm")}),l.on("procedure-search","input",i=>{R.filterProcedureContent(i.target.value)}),l.on("btn-add-block","click",()=>{const i=document.getElementById("section-title-input"),r=document.getElementById("section-type-input");i&&(i.value=""),r&&(r.value="TEXTO"),l.show("modal-add-section")}),l.on("btn-confirm-add-section","click",()=>{const i=l.getValue("section-title-input"),r=l.getValue("section-type-input");if(!i)return alert("Por favor, informe o título da seção.");R.addSection(i,r),l.hide("modal-add-section")})}
