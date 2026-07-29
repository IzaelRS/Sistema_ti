(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=n(a);fetch(a.href,r)}})();const ve="/api",v={async get(e){const t=await fetch(`${ve}${e}`);if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async post(e,t){const n=await fetch(`${ve}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(e,t){const n=await fetch(`${ve}${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(e){const t=await fetch(`${ve}${e}`,{method:"DELETE"});if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async upload(e,t){const n=await fetch(`${ve}${e}`,{method:"POST",body:t});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let he=null;const D={init(){const e=localStorage.getItem("user");if(e)try{return he=JSON.parse(e),!0}catch{return this.logout(),!1}return!1},getUser(){return he},isAdmin(){return he&&he.role==="Administrador"},async login(e,t){try{const n=await v.post("/login",{email:e,password:t});return he=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){he=null,localStorage.removeItem("user")}},s={show(e){const t=document.getElementById(e);t&&t.classList.remove("hidden")},hide(e){const t=document.getElementById(e);t&&t.classList.add("hidden")},toggle(e,t){const n=document.getElementById(e);n&&n.classList.toggle("hidden",t)},setText(e,t){const n=document.getElementById(e);n&&(n.innerText=t)},setValue(e,t){const n=document.getElementById(e);n&&(n.value=t)},getValue(e){const t=document.getElementById(e);return t?t.value:null},on(e,t,n){const o=document.getElementById(e);o&&o.addEventListener(t,n)}},it={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const e=window.innerWidth<=768;this.particleCount=e?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let t=0;t<this.particleCount;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const e=document.getElementById("account-section");e&&(this.canvas.width=e.clientWidth,this.canvas.height=e.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let e=0;e<this.particles.length;e++){const t=this.particles[e];t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.canvas.width)&&(t.vx*=-1),(t.y<0||t.y>this.canvas.height)&&(t.vy*=-1),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=e+1;n<this.particles.length;n++){const o=this.particles[n],a=t.x-o.x,r=t.y-o.y,l=Math.sqrt(a*a+r*r);if(l<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const i=1-l/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${i*.4})`,this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let be=[];const Ve={async fetch(){try{be=await v.get("/users"),this.render(be)}catch(e){console.error("Error fetching Users:",e)}},getUsers(){return be},render(e){const t=document.getElementById("user-table-body");t&&(t.innerHTML=e.map(n=>{const o=n.role==="Administrador",a=D.isAdmin()?`
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
            </tr>`}).join(""))},openEditModal(e){const t=be.find(n=>n.id===e);t&&(s.setText("modal-user-title","Editar Usuário"),s.setValue("user-id-form",t.id),s.setValue("user-name-form",t.name),s.setValue("user-email-form",t.email),s.setValue("user-password-form",""),s.setValue("user-role-form",t.role),s.show("modal-user"))},async save(e){e.preventDefault();const t=s.getValue("user-id-form"),n={name:s.getValue("user-name-form"),email:s.getValue("user-email-form"),password:s.getValue("user-password-form"),role:s.getValue("user-role-form")};try{t?await v.put(`/users/${t}`,n):await v.post("/users",n),s.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(t?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(e){if(confirm("Deseja excluir este usuário?"))try{await v.delete(`/users/${e}`),this.fetch()}catch(t){alert("Erro ao excluir: "+t.message)}},search(e){const t=be.filter(n=>n.name.toLowerCase().includes(e)||n.email.toLowerCase().includes(e));this.render(t)}};let se=[],He="";const xt=[{name:"Padrão",value:"#1e293b",border:"#334155"},{name:"Âmbar",value:"#78350f",border:"#92400e"},{name:"Esmeralda",value:"#064e3b",border:"#065f46"},{name:"Ciano",value:"#164e63",border:"#155e75"},{name:"Azul",value:"#1e3a8a",border:"#1e40af"},{name:"Roxo",value:"#4c1d95",border:"#5b21b6"},{name:"Rosa",value:"#831843",border:"#9d174d"},{name:"Vermelho",value:"#7f1d1d",border:"#991b1b"},{name:"Grafite",value:"#374151",border:"#4b5563"}],rt={Poppins:"'Poppins', sans-serif","Space Mono":"'Space Mono', monospace",Georgia:"'Georgia', serif",Roboto:"'Roboto', sans-serif",Caveat:"'Caveat', cursive, sans-serif"},st={small:"0.85rem",medium:"1rem",large:"1.2rem",xlarge:"1.4rem"},Le={async fetch(){try{const e=await v.get("/keep-notes");se=Array.isArray(e)?e:[]}catch(e){console.error("Erro ao buscar notas Keep:",e),se=[]}this.render()},search(e){He=(e||"").toLowerCase().trim(),this.render()},getFilteredNotes(){return He?se.filter(e=>e.title&&e.title.toLowerCase().includes(He)||e.content&&e.content.toLowerCase().includes(He)):se},render(){const e=document.getElementById("keep-pinned-grid"),t=document.getElementById("keep-other-grid"),n=document.getElementById("keep-pinned-section"),o=document.getElementById("keep-other-title"),a=document.getElementById("keep-empty-state"),r=document.getElementById("keep-count-badge");if(!e||!t)return;const l=this.getFilteredNotes();if(r&&(r.innerText=se.length),l.length===0){n&&(n.style.display="none"),e.innerHTML="",t.innerHTML="",a&&(a.style.display="block");return}a&&(a.style.display="none");const i=l.filter(d=>d.is_pinned),c=l.filter(d=>!d.is_pinned);i.length>0?(n&&(n.style.display="block"),e.innerHTML=i.map(d=>this.renderNoteCard(d)).join(""),o&&(o.innerText="OUTRAS NOTAS")):(n&&(n.style.display="none"),e.innerHTML="",o&&(o.innerText="TODAS AS NOTAS")),t.innerHTML=c.map(d=>this.renderNoteCard(d)).join("")},renderNoteCard(e){const t=rt[e.font_family]||rt.Poppins,n=st[e.font_size]||st.medium,o=e.color||"#1e293b",a=e.is_pinned?"#f59e0b":"rgba(255,255,255,0.4)",r=e.is_pinned?"Desafixar Nota":"Fixar Nota";return`
            <div class="keep-card keep-card-enhanced" style="background: ${o}; font-family: ${t}; border: 1px solid rgba(255,255,255,0.15); padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0,0,0,0.25);" onclick="if(!event.target.closest('button')){ window.keepsHandler.openEditModal(${e.id}); }">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 8px;">
                        ${e.title?`<h4 style="margin: 0; font-size: 1.15rem; font-weight: 600; color: #ffffff; word-break: break-word; line-height: 1.3;">${e.title}</h4>`:'<span style="flex:1;"></span>'}
                        <button class="btn-icon" onclick="event.stopPropagation(); window.keepsHandler.togglePin(${e.id})" title="${r}" style="padding: 6px; color: ${a}; opacity: 0.9; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="${e.is_pinned?"#f59e0b":"none"}" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="17" x2="12" y2="22"></line>
                                <path d="M5 17h14l-1.5-6H6.5L5 17z"></path>
                                <path d="M9 11V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"></path>
                            </svg>
                        </button>
                    </div>
                    <div style="font-size: ${n}; color: rgba(255,255,255,0.92); line-height: 1.55; white-space: pre-wrap; word-break: break-word; margin-bottom: 16px;">
                        ${e.content}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 10px; margin-top: 8px;">
                    <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                        <span class="badge" style="background: rgba(0,0,0,0.3); color: #e2e8f0; font-size: 0.7rem; padding: 3px 8px; border-radius: 6px;">${e.font_family||"Poppins"}</span>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button class="btn-icon" onclick="event.stopPropagation(); window.keepsHandler.openEditModal(${e.id})" title="Editar Nota" style="padding: 6px; color: #60a5fa;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon" onclick="event.stopPropagation(); window.keepsHandler.deleteNote(${e.id})" title="Excluir Nota" style="padding: 6px; color: #f87171;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        `},renderColorSwatches(e="#1e293b"){const t=document.getElementById("keep-modal-swatches");t&&(t.innerHTML=xt.map(n=>`
            <div class="keep-swatch-item ${n.value===e?"selected":""}"
                 style="background: ${n.value}; border-color: ${n.value===e?"#ffffff":n.border};"
                 title="${n.name}"
                 onclick="window.keepsHandler.selectColor('${n.value}')">
            </div>
        `).join(""))},selectColor(e){s.setValue("keep-edit-color",e),this.renderColorSwatches(e)},openNewModal(){s.setValue("keep-edit-id",""),s.setValue("keep-edit-title",""),s.setValue("keep-edit-content",""),s.setValue("keep-edit-color","#1e293b"),s.setValue("keep-edit-font","Poppins"),s.setValue("keep-edit-size","medium");const e=document.getElementById("keep-edit-pin");e&&(e.checked=!1),s.setText("modal-keep-title","Nova Nota Keep"),s.setText("btn-save-keep","Criar Nota"),this.renderColorSwatches("#1e293b"),s.show("modal-edit-keep")},openEditModal(e){const t=se.find(a=>a.id===e||String(a.id)===String(e));if(!t)return;s.setValue("keep-edit-id",t.id),s.setValue("keep-edit-title",t.title||""),s.setValue("keep-edit-content",t.content||"");const n=t.color||"#1e293b";s.setValue("keep-edit-color",n),s.setValue("keep-edit-font",t.font_family||"Poppins"),s.setValue("keep-edit-size",t.font_size||"medium");const o=document.getElementById("keep-edit-pin");o&&(o.checked=!!t.is_pinned),s.setText("modal-keep-title","Editar Nota Keep"),s.setText("btn-save-keep","Salvar Alterações"),this.renderColorSwatches(n),s.show("modal-edit-keep")},async saveEditModal(e){e&&e.preventDefault();const t=s.getValue("keep-edit-id"),n=s.getValue("keep-edit-content");if(!n||!n.trim()){alert("O conteúdo da nota é obrigatório.");return}const o=s.getValue("keep-edit-title"),a=s.getValue("keep-edit-color"),r=s.getValue("keep-edit-font"),l=s.getValue("keep-edit-size"),i=document.getElementById("keep-edit-pin"),c={title:o?o.trim():"",content:n.trim(),color:a||"#1e293b",font_family:r||"Poppins",font_size:l||"medium",is_pinned:i?i.checked:!1};try{t?await v.put(`/keep-notes/${t}`,c):await v.post("/keep-notes",c),s.hide("modal-edit-keep"),await this.fetch()}catch(d){alert("Erro ao salvar nota: "+(d.message||"Erro desconhecido."))}},async togglePin(e){const t=se.find(n=>n.id===e||String(n.id)===String(e));if(t)try{await v.put(`/keep-notes/${e}`,{is_pinned:!t.is_pinned}),await this.fetch()}catch(n){alert("Erro ao atualizar status da nota: "+(n.message||"Erro desconhecido."))}},async deleteNote(e){if(confirm("Deseja realmente excluir esta nota?"))try{await v.delete(`/keep-notes/${e}`),await this.fetch()}catch(t){alert("Erro ao excluir nota: "+(t.message||"Erro desconhecido."))}}};window.keepsHandler=Le;let Ae=[],ee="Geral",F=1;const we=10;let lt=[];const Z={async fetch(){try{F=1,Ae=await v.get("/documents"),this.filterAndRender()}catch(e){console.error("Error fetching Documents:",e)}},setActiveTab(e){ee=e,F=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(t=>{const n=t.textContent.trim().toLowerCase();t.classList.toggle("active",n===e.toLowerCase())}),this.filterAndRender()},filterAndRender(){const e=document.querySelector(".docs-header");if(ee.toLowerCase()==="dashboard")e&&(e.style.display="none"),s.hide("doc-list-container"),s.hide("doc-keeps-container"),s.show("doc-dashboard-container"),this.renderDashboard();else if(ee.toLowerCase()==="keeps")e&&(e.style.display="none"),s.hide("doc-list-container"),s.hide("doc-dashboard-container"),s.show("doc-keeps-container"),Le.fetch();else{e&&(e.style.display="flex"),s.show("doc-list-container"),s.hide("doc-dashboard-container"),s.hide("doc-keeps-container");const t=Ae.filter(n=>(n.category||"Geral").toLowerCase()===ee.toLowerCase());this.render(t)}},calculateRemainingTime(e){if(!e||e==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const t=new Date;t.setHours(0,0,0,0);const n=new Date(e+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-t.getTime(),a=Math.ceil(o/(1e3*60*60*24));if(a<0){const r=Math.abs(a);let l=`Expirado há ${r} dia(s)`;return r>=30&&(l=`Expirado há ${Math.floor(r/30)} mês(es)`),{text:l,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:a}}else{if(a===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:a};if(a<=30)return{text:`Expira em ${a} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:a};{const r=Math.floor(a/30);let l=`Expira em ${r} mês(es)`;if(r>=12){const i=Math.floor(r/12),c=r%12;l=`Expira em ${i} ano(s)${c>0?` e ${c} mês(es)`:""}`}return{text:l,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:a}}}},renderDashboard(){const e=document.getElementById("doc-dashboard-tbody");if(!e)return;const t=Ae.filter(g=>{const f=(g.category||"").toLowerCase();return f==="contratos"||f==="termo de uso"});let n=0,o=0,a=0,r=0;t.forEach(g=>{const f=(g.category||"").toLowerCase(),y=this.calculateRemainingTime(g.end_date);y.status==="expired"?r++:y.status==="critical"?(a++,f==="contratos"&&n++,f==="termo de uso"&&o++):(f==="contratos"&&n++,f==="termo de uso"&&o++)}),s.setText("doc-kpi-active-contracts",n),s.setText("doc-kpi-active-terms",o),s.setText("doc-kpi-warning-docs",a),s.setText("doc-kpi-expired-docs",r);const l=document.getElementById("doc-dash-search"),i=document.getElementById("doc-dash-filter-category"),c=document.getElementById("doc-dash-filter-status"),d=l?l.value.toLowerCase().trim():"",u=i?i.value:"Todos",m=c?c.value:"Todos";let p=t.filter(g=>{if(d&&!g.original_name.toLowerCase().includes(d)||u!=="Todos"&&(g.category||"").toLowerCase()!==u.toLowerCase())return!1;const f=this.calculateRemainingTime(g.end_date);return!(m!=="Todos"&&(m==="Ativos"&&(f.status==="expired"||f.status==="critical")||m==="Expirando"&&f.status!=="critical"||m==="Expirados"&&f.status!=="expired"||m==="Indeterminado"&&f.status!=="indefinite"))});if(p.sort((g,f)=>{const y=this.calculateRemainingTime(g.end_date),$=this.calculateRemainingTime(f.end_date),T={expired:1,critical:2,active:3,indefinite:4},C=T[y.status]||5,_=T[$.status]||5;return C!==_?C-_:y.days-$.days}),p.length===0){e.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const h=window.auth&&window.auth.isAdmin();e.innerHTML=p.map(g=>{const f=g.mimetype==="application/pdf"?"📕":"🖼️",y=g.start_date?new Date(g.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",$=g.end_date?g.end_date==="Indefinido"?"Indefinido":new Date(g.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",T=this.calculateRemainingTime(g.end_date),C=h?`<button class="btn-delete" onclick="window.DocsHandler.delete(${g.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
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
                    <td>
                        <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 500; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">
                            ${g.department||"-"}
                        </span>
                    </td>
                    <td>${y}</td>
                    <td>${$}</td>
                    <td>
                        <span class="badge" style="background: ${T.color}; color: ${T.textColor}; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                            ${T.text}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <a href="${g.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                Ver
                            </a>
                            ${C}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(e){const t=document.getElementById("doc-list-body");if(!t)return;const n=document.getElementById("doc-list-thead"),o=ee.toLowerCase()==="contratos"||ee.toLowerCase()==="termo de uso",a=window.auth&&window.auth.isAdmin(),r=a?"":'class="role-hidden"';lt=e;const l=e.length,i=Math.ceil(l/we);F>i&&(F=Math.max(1,i)),F<1&&(F=1);const c=(F-1)*we,d=e.slice(c,c+we);if(n&&(o?n.innerHTML=`
                    <tr>
                        <th>Nome</th>
                        <th>Setor / Depto</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Cadastro</th>
                        <th id="th-doc-actions" ${r}>Ações</th>
                    </tr>
                `:n.innerHTML=`
                    <tr>
                        <th>Nome</th>
                        <th>Tamanho</th>
                        <th>Tipo</th>
                        <th>Data</th>
                        <th id="th-doc-actions" ${r}>Ações</th>
                    </tr>
                `),d.length===0){t.innerHTML=`
                <tr>
                    <td colspan="${o?8:5}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `,this.renderPaginationControls("doc-pagination",0,0);return}t.innerHTML=d.map(u=>{const m=u.mimetype==="application/pdf"?"📕":"🖼️",p=(u.size/1024).toFixed(1)+" KB",h=u.created_at?new Date(u.created_at).toLocaleDateString("pt-BR"):"-",g=u.mimetype==="application/pdf"?"PDF":"Imagem",f=a?`<button class="btn-delete" onclick="window.DocsHandler.delete(${u.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",y=u.start_date?new Date(u.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",$=u.end_date?u.end_date==="Indefinido"?"Indefinido":new Date(u.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",T=u.department?`<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 500; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">${u.department}</span>`:'<span style="color: var(--text-muted); font-size: 0.85rem;">-</span>';return o?`
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${m}</span>
                                <span title="${u.original_name}">${u.original_name}</span>
                            </span>
                        </td>
                        <td>${T}</td>
                        <td>${p}</td>
                        <td>${g}</td>
                        <td>${y}</td>
                        <td>${$}</td>
                        <td>${h}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${u.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
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
                                <span>${m}</span>
                                <span title="${u.original_name}">${u.original_name}</span>
                            </span>
                        </td>
                        <td>${p}</td>
                        <td>${g}</td>
                        <td>${h}</td>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <a href="${u.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                    Ver / Baixar
                                </a>
                                ${f}
                            </div>
                        </td>
                    </tr>
                `}).join(""),this.renderPaginationControls("doc-pagination",i,l)},async handleUpload(e){e.preventDefault();const t=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!t.files.length){alert("Selecione um arquivo.");return}const a=new FormData,r=n?n.value:"Geral";a.append("category",r),a.append("customName",o?o.value:""),a.append("document",t.files[0]);const l=r.toLowerCase();if(l==="contratos"||l==="termo de uso"){const i=document.getElementById("doc-start-date"),c=document.getElementById("doc-end-date"),d=document.getElementById("doc-indefinite"),u=document.getElementById("doc-department");i&&i.value&&a.append("startDate",i.value),d&&d.checked?a.append("endDate","Indefinido"):c&&c.value&&a.append("endDate",c.value),u&&u.value.trim()&&a.append("department",u.value.trim())}try{await v.upload("/documents",a),s.hide("modal-upload"),document.getElementById("doc-form").reset();const i=document.getElementById("doc-dates-container");i&&(i.style.display="none");const c=document.getElementById("doc-end-date");c&&(c.disabled=!1);const d=document.getElementById("doc-department");d&&(d.value=""),s.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(i){console.error(i),alert("Erro ao subir arquivo.")}},async delete(e){if(confirm("Deletar este documento?"))try{await v.delete(`/documents/${e}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(e){if(ee.toLowerCase()==="dashboard")this.renderDashboard();else{F=1;const t=Ae.filter(n=>(n.category||"Geral").toLowerCase()===ee.toLowerCase()&&n.original_name.toLowerCase().includes(e));this.render(t)}},changePage(e){F=e,this.render(lt)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${F===1?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${F-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let r=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=F-1&&c<=F+1)&&(r&&c-r>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===F?"active":""}" 
                            onclick="window.DocsHandler.changePage(${c})">
                        ${c}
                    </button>
                `,r=c);a+=`
            <button class="pagination-btn" 
                    ${F===t?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${F+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const l=(F-1)*we+1,i=Math.min(F*we,n);a+=`
            <span class="pagination-info">
                Exibindo ${l}-${i} de ${n}
            </span>
        `,o.innerHTML=a}};let te=[],x={summaries:[]},ct=null,I=null,je="list",xe=null,K=null,dt=null,z=1;const Ee=10;let _e=[];const R={getPendingProcId(){return ct},async fetch(){try{z=1,te=await v.get("/procedures"),this.renderTable(te)}catch(e){console.error("Error fetching FAQs:",e)}},getFaqs(){return te},setListingMode(e){je=e,z=1,this.renderTable(_e.length?_e:te)},renderTable(e){const t=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!t||!n||!o)return;_e=e;const a=e.length,r=Math.ceil(a/Ee);z>r&&(z=Math.max(1,r)),z<1&&(z=1);const l=(z-1)*Ee,i=e.slice(l,l+Ee);je==="list"?(s.show("list-table-container"),s.hide("list-cards-container"),i.length===0?o.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            Nenhum procedimento encontrado.
                        </td>
                    </tr>
                `:o.innerHTML=i.map(d=>{const u=D.isAdmin()?`
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
                    </tr>`}).join("")):(s.hide("list-table-container"),s.show("list-cards-container"),i.length===0?n.innerHTML=`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum procedimento encontrado.
                    </div>
                `:n.innerHTML=i.map(d=>{const u=D.isAdmin()?`
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
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",r,a),(je==="list"?o:n).addEventListener("click",function(u){const m=u.target.closest('[data-action="edit"], [data-action="delete"]');if(m){u.stopPropagation(),u.preventDefault();const h=Number(m.dataset.id);m.dataset.action==="edit"?R.openEditModal(h):m.dataset.action==="delete"&&R.deleteProcedure(h);return}const p=u.target.closest('[data-action="open"]');if(p){const h=Number(p.dataset.id);R.openDetail(h)}})},openDetail(e){const t=te.find(o=>o.id===e);if(!t)return;s.setText("detail-title",t.name||t.title||"Sem título"),s.setValue("proc-id",t.id);try{let o=t.content?JSON.parse(t.content):[];Array.isArray(o)?x={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?x=o:x={summaries:[]}}catch{x={summaries:[]}}x.summaries.length>0?I=x.summaries[0].id:I=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(e){const t=te.find(n=>n.id===e);t&&(s.setText("modal-form-title","Editar Procedimento"),s.setValue("proc-id",t.id),s.setValue("proc-name",t.name||t.title||""),s.setValue("proc-responsible",t.responsible||""),s.setValue("proc-group",t.group_name||""),s.setValue("proc-note",t.note||""),s.setValue("proc-content",t.content||""),s.setValue("proc-color",t.color||"#4F46E5"),s.show("modal-form"))},async saveMeta(e){e&&e.preventDefault();const t=s.getValue("proc-id"),n={name:s.getValue("proc-name").toUpperCase(),responsible:s.getValue("proc-responsible").toUpperCase(),group_name:s.getValue("proc-group"),note:s.getValue("proc-note"),content:s.getValue("proc-content"),color:s.getValue("proc-color")};try{const o=t?`/procedures/${t}`:"/procedures";ct=(t?await v.put(o,n):await v.post(o,n)).id,s.hide("modal-form"),document.getElementById("faq-form").reset(),s.setValue("proc-responsible","TI"),s.setValue("proc-group","Geral"),await this.fetch(),s.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(e){if(confirm("Deseja excluir este procedimento?"))try{await v.delete(`/procedures/${e}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(e){const t=document.querySelector(".procedure-sidebar");e?(s.hide("procedure-view-container"),s.hide("procedure-view-sidebar"),s.show("procedure-edit-wrapper"),s.show("procedure-edit-sidebar"),s.hide("btn-floating-edit"),t&&t.classList.add("glass","has-border"),x.summaries.length>0?x.summaries.find(n=>n.id===I)||(I=x.summaries[0].id):I=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(s.show("procedure-view-container"),s.show("procedure-view-sidebar"),s.hide("procedure-edit-wrapper"),s.hide("procedure-edit-sidebar"),s.show("btn-floating-edit"),t&&t.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const e=document.getElementById("procedure-view-container"),t=document.getElementById("procedure-view-index");if(!e||!t)return;if(x.summaries.length===0){e.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',t.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";x.summaries.forEach((a,r)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${a.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${a.title}</li>`,n+=`<div id="sum-view-${a.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(x.summaries.length>1||a.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${a.title}</h4>`),a.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const l=a.sections.map((i,c)=>{let d="";if(i.type==="TEXTO")d=`<div class="gh-content"><div class="gh-text-view">${i.data||"Sem conteúdo."}</div></div>`;else if(i.type==="FAQ")d='<div class="gh-faq-list">'+(i.data||[]).map((p,h)=>`
                         <div class="gh-accordion" id="gh-faq-${a.id}-${c}-${h}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${a.id}-${c}-${h}')">
                                   <div class="gh-accordion-title">${p.q||"Pergunta sem título"}</div>
                                   <span class="gh-accordion-icon">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                   </span>
                              </div>
                              <div class="gh-accordion-content gh-text-view">${p.a||"Sem resposta."}</div>
                         </div>
                     `).join("")+"</div>";else if(i.type==="DOCUMENTO"&&i.data&&i.data.path){const m=i.data.mimetype&&i.data.mimetype.startsWith("image/"),p=i.data.mimetype==="application/pdf";let h="";m?h=`<div class="doc-embed-container"><img src="${i.data.path}" alt="${i.data.name}" class="doc-embed-image" /></div>`:p?h=`<div class="doc-embed-container" style="display: block;"><iframe src="${i.data.path}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="doc-embed-pdf" title="${i.data.name}"></iframe></div>`:h='<div class="doc-embed-container" style="padding: 20px; text-align: center; color: var(--text-muted);"><p>Visualização não disponível para este formato.</p></div>',d=`
                        <div class="gh-doc-container">
                            ${h}
                            <div class="doc-actions" style="margin-top: 15px; text-align: center;">
                                <a href="${i.data.path}" target="_blank" class="btn-secondary-small" style="display: inline-block;">
                                    Abrir/Download Original (${i.data.name})
                                </a>
                            </div>
                        </div>`}let u="var(--text-muted)";return i.type==="DOCUMENTO"?u="#10B981":i.type==="FAQ"?u="#FBBF24":i.type==="TEXTO"&&(u="#3B82F6"),`
                     <div class="gh-box">
                         <div class="gh-header" style="display: flex; align-items: center; gap: 10px;">
                             <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${u};"></span>
                             <h3>${i.title}</h3>
                         </div>
                         ${d}
                     </div>
                 `}).join("");n+=l,n+="</div>"}),t.innerHTML=o,e.innerHTML=n},filterProcedureContent(e){e=e.toLowerCase();const t=document.getElementById("procedure-view-container");if(!t)return;t.querySelectorAll(".gh-box").forEach(o=>{const a=o.querySelector(".gh-faq-list");let r=!1;const l=o.querySelector(".gh-header"),i=l?l.textContent.toLowerCase().includes(e):!1;a&&a.querySelectorAll(".gh-accordion").forEach(u=>{const m=u.textContent.toLowerCase();i||m.includes(e)?(u.classList.remove("hidden"),r=!0):u.classList.add("hidden")});const c=o.textContent.toLowerCase();i||c.includes(e)||r?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const e=document.getElementById("procedure-edit-index"),t=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!e)return;e.innerHTML=x.summaries.map((a,r)=>`
             <li class="sidebar-index-item ${a.id===I?"active":""} editable-section style-none"
                 draggable="true" 
                 ondragstart="window.ProceduresHandler.handleSumDragStart(event, ${r})"
                 ondragover="window.ProceduresHandler.handleDragOver(event)"
                 ondrop="window.ProceduresHandler.handleSumDrop(event, ${r})"
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
            `).join("");const o=x.summaries.find(a=>a.id===I);o?(n.textContent=o.title,n.style.color="var(--text-main)",t.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",t.classList.add("hidden"))},selectSummary(e){I=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(e,t){const n=x.summaries.find(a=>a.id===e);n&&(n.title=t||"Sem título"),this.renderProcedureBuilderSidebar();const o=x.summaries.find(a=>a.id===I);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const e="sum_"+Date.now();x.summaries.push({id:e,title:`Sumário ${x.summaries.length+1}`,sections:[]}),I=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(e){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(x.summaries=x.summaries.filter(t=>t.id!==e),I===e&&(I=x.summaries.length>0?x.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const e=document.getElementById("procedure-edit-container");if(!e)return;if(!I){e.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const t=x.summaries.find(o=>o.id===I);if(!t)return;const n=t.sections;if(n.length===0){e.innerHTML=`<p class="empty-state">Nenhum campo em "${t.title}". Clique em "+ Novo Container" para começar.</p>`;return}e.innerHTML=n.map((o,a)=>`
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
                          ${(o.data||[]).map((r,l)=>`
                              <div class="faq-pair">
                                  <button class="btn-remove-faq" onclick="window.ProceduresHandler.removeFaqItem(${a}, ${l})" title="Remover Pergunta">&times;</button>
                                  <input type="text" placeholder="Pergunta" value="${r.q}" onchange="window.ProceduresHandler.updateFaqItem(${a}, ${l}, 'q', this.value)">
                                  
                                  <div class="rte-container" style="margin-top: 10px;">
                                      ${window.ProceduresHandler.getRteToolbarHTML()}
                                      <div class="proc-textarea-edit" style="min-height: 80px;" contenteditable="true" placeholder="Resposta da FAQ..."
                                           oninput="window.ProceduresHandler.updateFaqItem(${a}, ${l}, 'a', this.innerHTML)" 
                                           onblur="window.ProceduresHandler.updateFaqItem(${a}, ${l}, 'a', this.innerHTML)">${r.a||""}</div>
                                  </div>
                              </div>
                          `).join("")}
                          <button class="btn-secondary-small" style="align-self: flex-start; margin-top: 10px;" onclick="window.ProceduresHandler.addFaqItem(${a})">+ Adicionar Pergunta</button>
                      </div>
                      `:""}
                 </div>
             </div>`).join("")},handleSumDragStart(e,t){xe="summary",K=t,e.dataTransfer.effectAllowed="move",setTimeout(()=>{e.target&&e.target.classList.add("dragging")},0)},handleSumDrop(e,t){if(e.preventDefault(),xe!=="summary"||K===null||K===t)return;const n=x.summaries.splice(K,1)[0];x.summaries.splice(t,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(e,t,n){xe="container",K=t,dt=n,e.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=e.target.nodeType===1?e.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect="move"},handleSecDrop(e,t,n){if(e.preventDefault(),xe!=="container"||K===null||dt!==n)return;const o=x.summaries.find(r=>r.id===n);if(!o||K===t)return;const a=o.sections.splice(K,1)[0];o.sections.splice(t,0,a),this.renderProcedureBuilder()},handleDragEnd(e){document.querySelectorAll(".editable-section.dragging").forEach(t=>t.classList.remove("dragging")),e&&e.target&&e.target.setAttribute&&e.target.setAttribute("draggable","false"),xe=null,K=null},updateSectionTitle(e,t){const n=x.summaries.find(o=>o.id===I);n&&(n.sections[e].title=t)},updateSectionData(e,t){const n=x.summaries.find(o=>o.id===I);n&&(n.sections[e].data=t)},removeSection(e){const t=x.summaries.find(n=>n.id===I);t&&t.sections.splice(e,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(e){const t=x.summaries.find(n=>n.id===I);t&&(t.sections[e].data=t.sections[e].data||[],t.sections[e].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(e,t,n,o){const a=x.summaries.find(r=>r.id===I);a&&(a.sections[e].data[t][n]=o)},removeFaqItem(e,t){const n=x.summaries.find(o=>o.id===I);n&&n.sections[e].data.splice(t,1),this.renderProcedureBuilder()},addSection(e,t){if(!I){alert("Selecione primeiro um sumário na barra lateral.");return}const n=x.summaries.find(o=>o.id===I);n&&(n.sections.push({id:Date.now(),title:e,type:t,data:t==="FAQ"?[]:t==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(e,t){t.dataTransfer.files&&t.dataTransfer.files.length>0&&await this.uploadSectionFile(e,t.dataTransfer.files[0])},async handleSectionFileUpload(e,t){const n=t.files[0];n&&await this.uploadSectionFile(e,n)},async uploadSectionFile(e,t){const n=new FormData;n.append("file",t);try{const o=await v.upload("/upload",n),a=x.summaries.find(r=>r.id===I);a&&(a.sections[e].data={name:t.name,path:o.path,mimetype:t.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const e=parseInt(s.getValue("proc-id"));if(!e)return;const n={...te.find(o=>o.id===e),content:JSON.stringify(x)};try{await v.put(`/procedures/${e}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(e),this.fetch()}catch{alert("Erro ao salvar")}},search(e){z=1;const t=te.filter(n=>(n.name||n.title||"").toLowerCase().includes(e)||(n.responsible||"").toLowerCase().includes(e)||(n.group_name||"").toLowerCase().includes(e));this.renderTable(t)},changePage(e){z=e,this.renderTable(_e)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${z===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${z-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let r=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=z-1&&c<=z+1)&&(r&&c-r>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===z?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${c})">
                        ${c}
                    </button>
                `,r=c);a+=`
            <button class="pagination-btn" 
                    ${z===t?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${z+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const l=(z-1)*Ee+1,i=Math.min(z*Ee,n);a+=`
            <span class="pagination-info">
                Exibindo ${l}-${i} de ${n}
            </span>
        `,o.innerHTML=a}};window.toggleGhAccordion=function(e){const t=document.getElementById(e);t&&t.classList.toggle("open")};let A=[],ne=[],le="list",ce="month",E=new Date,N=1;const $e=10;let ut=[];const B={async fetch(){try{N=1,A=await v.get("/accounts"),await this.fetchCategories(),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(e){console.error("Falha ao obter contas",e)}},async fetchCategories(){try{ne=await v.get("/account-categories"),this.populateCategoryFilter(),this.populateCategoryModalSelect(),this.renderCategoriesList()}catch(e){console.error("Falha ao obter categorias de contas",e)}},populateCategoryFilter(){const e=document.getElementById("dash-filter-category-dynamic-options");if(e){const t=new Set;e.querySelectorAll('input[type="checkbox"]:checked').forEach(l=>{t.add(l.value)});const n=(ne||[]).map(l=>l.name),o=(A||[]).map(l=>l.category).filter(Boolean),a=[...new Set([...n,...o])].sort((l,i)=>l.localeCompare(i));let r="";a.forEach(l=>{const i=t.has(l)?"checked":"";r+=`<label class="multiselect-option"><input type="checkbox" value="${l}" ${i}> <span>${l}</span></label>`}),e.innerHTML=r,this.setupMultiselectListeners("dash-filter-category")}},populateCategoryModalSelect(){const e=document.getElementById("account-category");if(e){const t=e.value,n=(ne||[]).map(l=>l.name),o=(A||[]).map(l=>l.category).filter(Boolean),a=[...new Set([...n,...o])].sort((l,i)=>l.localeCompare(i));let r="";a.forEach(l=>{r+=`<option value="${l}" ${l===t?"selected":""}>${l}</option>`}),e.innerHTML=r}},renderCategoriesList(){const e=document.getElementById("account-categories-table-body");if(!e)return;if(!ne||ne.length===0){e.innerHTML='<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma categoria cadastrada.</td></tr>';return}let t="";ne.forEach(n=>{const o=n.is_system,a=o?"rgba(59, 130, 246, 0.2)":"rgba(16, 185, 129, 0.2)",r=o?"#60a5fa":"#34d399",l=o?"Sistema":"Personalizada",i=D.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.deleteCategory(${n.id})" title="Excluir Categoria" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; color: #ef4444;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `:"-";t+=`
                <tr>
                    <td><strong>${n.name}</strong></td>
                    <td><span class="badge" style="background: ${a}; color: ${r}; font-size: 0.75rem;">${l}</span></td>
                    <td style="text-align: right; display: flex; justify-content: flex-end;">${i}</td>
                </tr>
            `}),e.innerHTML=t},async saveCategory(e){e&&e.preventDefault();const t=document.getElementById("input-new-category-name");if(!t)return;const n=t.value.trim();if(n)try{await v.post("/account-categories",{name:n}),t.value="",await this.fetchCategories(),this.handleSearch(),alert("Categoria criada com sucesso!")}catch(o){alert("Erro ao criar categoria: "+(o.message||"Erro desconhecido."))}},deleteCategory(e){const t=parseInt(e,10),n=ne.find(c=>c.id===t||String(c.id)===String(e));if(!n){console.error("Categoria não encontrada para exclusão:",e);return}const a=A.filter(c=>c.category===n.name).length,r=ne.filter(c=>String(c.id)!==String(n.id));if(r.length===0){alert("Não é possível excluir esta categoria porque não existem outras categorias para as quais transferir as contas.");return}const l=document.getElementById("select-transfer-category-target");l&&(l.innerHTML=r.map(c=>`<option value="${c.name}">${c.name}</option>`).join(""));const i=document.getElementById("delete-category-warning-text");i&&(a>0?i.innerHTML=`Existem <strong>${a}</strong> conta(s) vinculada(s) à categoria <strong>"${n.name}"</strong>.<br>Selecione para qual categoria deseja transferi-las antes de prosseguir com a exclusão:`:i.innerHTML=`Confirma a exclusão da categoria <strong>"${n.name}"</strong>?`),s.setValue("delete-category-id",n.id),s.show("modal-delete-category")},async confirmDeleteCategory(){const e=s.getValue("delete-category-id"),t=s.getValue("select-transfer-category-target");if(e)try{const n=`/account-categories/${e}${t?`?transferTo=${encodeURIComponent(t)}`:""}`;await v.delete(n),s.hide("modal-delete-category"),alert("Categoria excluída e contas transferidas com sucesso!"),await this.fetch(),this.renderCategoriesList()}catch(n){alert("Erro ao excluir categoria: "+(n.message||"Erro desconhecido."))}},populateCompanyFilter(){const e=document.getElementById("dash-filter-company-dynamic-options");if(e){const t=new Set;e.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{t.add(a.value)});const n=[...new Set(A.map(a=>a.company_name).filter(Boolean))].sort((a,r)=>a.localeCompare(r));let o="";n.forEach(a=>{const r=t.has(a)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${a}" ${r}> <span>${a}</span></label>`}),e.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(e){if(!document.getElementById(`${e}-container`))return;const n=document.getElementById(`${e}-trigger`),o=document.getElementById(`${e}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",i=>{i.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(c=>{c!==o&&c.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const a=o.querySelector('input[value="Todos"]'),r=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(i=>i.value!=="Todos"),l=()=>{const i=r.filter(d=>d.checked).map(d=>d.value),c=n.querySelector(".trigger-label");a.checked||r.length>0&&i.length===r.length?(a.checked=!0,c&&(c.innerText="Todos")):i.length===0?c&&(c.innerText="Nenhum"):i.length===1?c&&(c.innerText=i[0]):c&&(c.innerText=`${i.length} selecionados`)};a&&!a.dataset.listenerBound&&(a.addEventListener("change",()=>{r.forEach(i=>{i.checked=a.checked}),l(),this.renderDashboard()}),a.dataset.listenerBound="true"),r.forEach(i=>{i.dataset.listenerBound||(i.addEventListener("change",()=>{r.every(d=>d.checked)?a.checked=!0:a.checked=!1,l(),this.renderDashboard()}),i.dataset.listenerBound="true")}),l()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",e=>{e.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(t=>{t.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(e){const t=document.getElementById(`${e}-dropdown`);if(!t)return["Todos"];const n=t.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(e=>{const t=document.getElementById(`${e}-dropdown`);if(t){t.querySelectorAll('input[type="checkbox"]').forEach(a=>{a.checked=a.value==="Todos"});const o=document.getElementById(`${e}-trigger`);if(o){const a=o.querySelector(".trigger-label");a&&(a.innerText="Todos")}}})},getAccounts(){return A},setAccountsViewMode(e){le=e,this.handleSearch()},setCalendarSubView(e){ce=e,this.handleSearch()},shiftCalendarDate(e){ce==="day"?E.setDate(E.getDate()+e):ce==="month"?E.setMonth(E.getMonth()+e):ce==="year"&&E.setFullYear(E.getFullYear()+e),s.setValue("filter-day",E.getDate()),s.setValue("filter-month",E.getMonth()),s.setValue("filter-year",E.getFullYear()),this.handleSearch()},handleFilterChange(e=!1){if(e){const t=s.getValue("filter-cal-year")?parseInt(s.getValue("filter-cal-year")):E.getFullYear(),n=s.getValue("filter-cal-month")?parseInt(s.getValue("filter-cal-month")):E.getMonth();E=new Date(t,n,1)}else{const t=s.getValue("filter-year")?parseInt(s.getValue("filter-year")):E.getFullYear(),n=s.getValue("filter-month")?parseInt(s.getValue("filter-month")):E.getMonth(),o=s.getValue("filter-day")?parseInt(s.getValue("filter-day")):E.getDate();E=new Date(t,n,o)}s.setValue("filter-month",E.getMonth()),s.setValue("filter-year",E.getFullYear()),this.handleSearch()},handleSearch(){const e=(s.getValue("accounts-search")||"").toLowerCase();let t=A.filter(n=>n.company_name.toLowerCase().includes(e)||n.description&&n.description.toLowerCase().includes(e));if(le==="list"){N=1;const n=s.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),a=o?o.checked:!1,r=E.getFullYear(),l=E.getMonth(),i=E.getDate();t=t.filter(c=>{if(n&&c.status!==n)return!1;if(!a||!c.due_date)return!0;const[d,u,m]=c.due_date.split("-"),p=parseInt(d,10),h=parseInt(u,10)-1,g=parseInt(m,10);return c.type==="Único"?p===r&&h===l&&g===i:c.type==="Recorrente"?g===i:!0}),this.renderAccountsList(t)}else le==="notificacoes"?this.renderNotifications():le==="dashboard"?this.renderDashboard():le==="configuracoes"?this.renderCategoriesList():this.renderCalendarWrapper(t)},checkAccountAlerts(){let e=!1;const t=new Date;t.setHours(0,0,0,0),A.forEach(o=>{const a=(o.status||"").trim().toLowerCase(),r=(o.payment_status||"").trim().toLowerCase();if(a==="on"&&r==="pendente"&&o.due_date){const[l,i,c]=o.due_date.split("-");let d=new Date(parseInt(l,10),parseInt(i,10)-1,parseInt(c,10));d.setHours(0,0,0,0),d.getTime()<=t.getTime()&&(e=!0)}});const n=document.getElementById("icon-alert-bell");n&&(e?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const e=document.getElementById("accounts-notifications-body");if(!e)return;e.innerHTML="";const t=new Date;t.setHours(0,0,0,0);let n=A.filter(o=>{const a=(o.status||"").trim().toLowerCase(),r=(o.payment_status||"").trim().toLowerCase();if(a!=="on"||r!=="pendente"||!o.due_date)return!1;const[l,i,c]=o.due_date.split("-");let d=new Date(parseInt(l,10),parseInt(i,10)-1,parseInt(c,10));return d.setHours(0,0,0,0),d.getTime()<=t.getTime()});if(n.length===0){e.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const a=document.createElement("tr");let r="Sem Data";if(o.due_date){const i=o.due_date.split("-");i.length===3&&(r=`${i[2]}/${i[1]}/${i[0]}`)}const l=D.isAdmin()?`
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
                <td style="color: #ef4444; font-weight: bold;">${r}</td>
                <td><strong>R$ ${parseFloat(o.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong></td>
                <td><span class="badge" style="background:rgba(234, 179, 8, 0.2); color:#eab308">${o.payment_status}</span></td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${o.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${l}
                    </div>
                </td>
            `,e.appendChild(a)})},renderAccountsList(e){const t=document.getElementById("accounts-table-body");if(!t)return;t.innerHTML="",this.renderSidebarMiniCalendar(),ut=e;const n=e.length,o=Math.ceil(n/$e);N>o&&(N=Math.max(1,o)),N<1&&(N=1);const a=(N-1)*$e,r=e.slice(a,a+$e);if(r.length===0){t.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}r.forEach(l=>{const i=document.createElement("tr");let c="Sem Data";if(l.due_date){const m=l.due_date.split("-");m.length===3&&(c=`${m[2]}/${m[1]}/${m[0]}`)}const d=l.status==="Off",u=D.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${l.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon" onclick="window.AccountsHandler.delete(${l.id})" title="Excluir" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `:"";i.innerHTML=`
                <td>
                    <strong>${l.company_name}</strong>
                    <div style="margin-top: 4px;">
                        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd; font-size: 0.7rem; padding: 2px 6px;">
                            ${l.category||"Outros"}
                        </span>
                    </div>
                </td>
                <td>
                    <span class="badge" style="background:${l.type==="Recorrente"?"rgba(79, 70, 229, 0.2)":"rgba(234, 179, 8, 0.2)"}; color:${l.type==="Recorrente"?"#818cf8":"#eab308"}">
                        ${l.type}
                    </span>
                </td>
                <td>${c}</td>
                <td>
                    <strong>R$ ${parseFloat(l.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                </td>
                <td>
                    <span class="badge" style="background:${d?"rgba(239, 68, 68, 0.2)":"rgba(34, 197, 94, 0.2)"}; color:${d?"#f87171":"#4ade80"}">
                        ${l.status}
                    </span>
                </td>
                <td>
                    <span class="badge" style="background:${l.payment_status==="Pago"?"rgba(34, 197, 94, 0.2)":l.payment_status==="Pendente"?"rgba(234, 179, 8, 0.2)":"rgba(239, 68, 68, 0.2)"}; color:${l.payment_status==="Pago"?"#4ade80":l.payment_status==="Pendente"?"#eab308":"#f87171"}">
                        ${l.payment_status||"Pendente"}
                    </span>
                </td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${l.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${u}
                    </div>
                </td>
            `,t.appendChild(i)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(le!=="dashboard")return;this.initDashboardMultiselects();const e=s.getValue("dash-filter-start"),t=s.getValue("dash-filter-end"),n=s.getValue("dash-filter-type")||"Todos",o=s.getValue("dash-filter-status")||"Todos",a=s.getValue("dash-filter-payment")||"Todos",r=this.getMultiselectValues("dash-filter-category"),l=this.getMultiselectValues("dash-filter-company");let i=e?new Date(e+"T00:00:00"):null,c=t?new Date(t+"T23:59:59"):null;if(!i&&!c){const b=new Date;i=new Date(b.getFullYear(),b.getMonth(),1,0,0,0),c=new Date(b.getFullYear(),b.getMonth()+1,0,23,59,59)}else i?c||(c=new Date(2100,11,31)):i=new Date(2e3,0,1);let d=0,u=0,m=new Set,p=new Set,h=0,g=0,f=0,y="-",$=0,T=0,C={},_={},S={};A.forEach(b=>{if(!b.due_date||n!=="Todos"&&b.type!==n||o!=="Todos"&&b.status!==o||a!=="Todos"&&b.payment_status!==a)return;if(!r.includes("Todos")){if(r.length===0)return;const L=b.category||"Outros";if(!r.includes(L))return}if(!l.includes("Todos")&&(l.length===0||!l.includes(b.company_name)))return;let V=0,j=new Date(i);j.setHours(0,0,0,0);let q=new Date(c);q.setHours(0,0,0,0);let U=3650;for(;j<=q&&U>0;){if(this.isEventOnDate(b,j.getFullYear(),j.getMonth(),j.getDate())){V++;const L=`${j.getFullYear()}-${String(j.getMonth()+1).padStart(2,"0")}`;S[L]||(S[L]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const Y=parseFloat(b.value||0);S[L].total+=Y,b.payment_status==="Pago"&&(S[L].pago+=Y),b.payment_status==="Pendente"&&(S[L].pendente+=Y),b.type==="Recorrente"&&(S[L].fixo+=Y),b.type==="Único"&&(S[L].variavel+=Y)}j.setDate(j.getDate()+1),U--}if(V>0){const L=parseFloat(b.value||0)*V;d+=L,u+=V,m.add(b.category||"Outros"),p.add(b.company_name),b.payment_status==="Pago"&&(h+=L),b.payment_status==="Pendente"&&(g+=L),b.type==="Recorrente"&&($+=L),b.type==="Único"&&(T+=L),L>f&&(f=L,y=b.company_name);const Y=b.category||"Outros";_[Y]=(_[Y]||0)+L;const ge=b.company_name||"Sem Empresa";C[ge]=(C[ge]||0)+L}}),s.setText("dash-metric-valor","R$ "+d.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),s.setText("dash-metric-contas",u.toString()),s.setText("dash-metric-tipos",m.size.toString()),s.setText("dash-metric-empresas",p.size.toString()),s.setText("dash-metric-pago","R$ "+h.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),s.setText("dash-metric-pendente","R$ "+g.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),s.setText("dash-metric-maior-valor","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),s.setText("dash-metric-maior-nome",y),s.setText("dash-metric-fixo","R$ "+$.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),s.setText("dash-metric-variavel","R$ "+T.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const w=s.getValue("dash-sort-empresas")||"desc",M=s.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",C,w),this.renderTierList("dash-list-categorias",_,M),this.renderTimeChart(S)},renderTimeChart(e){window.timeChartInstance&&window.timeChartInstance.destroy();const t=document.getElementById("chart-dashboard-time");if(!t)return;const n=Object.keys(e).sort(),o=n.map(u=>{const[m,p]=u.split("-");return`${p}/${m}`}),a=n.map(u=>e[u].total),r=n.map(u=>e[u].pago),l=n.map(u=>e[u].pendente),i=n.map(u=>e[u].fixo),c=n.map(u=>e[u].variavel),d={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:a,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:r,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:l,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:i,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:c,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(u){let m=u.dataset.label||"";return m&&(m+=": "),u.parsed.y!==null&&(m+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(u.parsed.y)),m}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(u,m,p){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(u)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(t.getContext("2d"),d)},renderTierList(e,t,n){const o=document.getElementById(e);if(!o)return;const a=Object.entries(t);if(a.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}a.sort((i,c)=>n==="asc"?i[1]-c[1]:c[1]-i[1]);const r=a.slice(0,10);let l="";r.forEach(([i,c],d)=>{const u=d===0&&n==="desc",m=u?"🏆 ":d+1+". ";l+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${u?"bold":"normal"}; color: ${u?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${i}">
                        ${m}${i}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${c.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=l},renderCharts(e){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const t=document.getElementById("chart-category");if(t){const o={labels:Object.keys(e),datasets:[{data:Object.values(e),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(t.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],a=[];let r=new Date;for(let l=-5;l<=6;l++){let i=new Date(r.getFullYear(),r.getMonth()+l,1);o.push(i.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let c=0;A.forEach(d=>{if(!d.due_date||d.status==="Off")return;const[u,m]=d.due_date.split("-"),p=new Date(parseInt(u),parseInt(m)-1,1);(d.type==="Recorrente"&&i.getTime()>=p.getTime()||d.type==="Único"&&i.getFullYear()===parseInt(u)&&i.getMonth()===parseInt(m)-1)&&(c+=parseFloat(d.value||0))}),a.push(c)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:a,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(e){const t={},n=[];return e.forEach(o=>{if(o.type==="Único")n.push(o);else if(!t[o.company_name])t[o.company_name]=o;else{const a=new Date(t[o.company_name].due_date||0);new Date(o.due_date||0)>a&&(t[o.company_name]=o)}}),[...n,...Object.values(t)]},isEventOnDate(e,t,n,o){if(!e.due_date)return!1;const[a,r,l]=e.due_date.split("-"),i=parseInt(a,10),c=parseInt(r,10)-1,d=parseInt(l,10);if(e.type==="Único")return t===i&&n===c&&o===d;if(e.type==="Recorrente"){const u=new Date(i,c,d).setHours(0,0,0,0);if(new Date(t,n,o).setHours(0,0,0,0)<u)return!1;const p=e.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(p)){const h=(t-i)*12+(n-c),g=new Date(t,n+1,0).getDate(),f=Math.min(d,g);if(o!==f||h<0)return!1;if(p==="1 mes")return!0;if(p==="3 meses")return h%3===0;if(p==="6 meses")return h%6===0;if(p==="1 ano")return n===c}else{const h=Date.UTC(i,c,d),g=Date.UTC(t,n,o),f=Math.round((g-h)/(1e3*60*60*24));if(p==="1 dia")return!0;if(p==="7 dias")return f%7===0;if(p==="15 dias")return f%15===0}}return!1},renderCalendarWrapper(e){const t=E.getFullYear(),n=E.getMonth(),o=E.getDate();ce==="month"?this.renderCalendarMonth(e,t,n):ce==="year"?this.renderCalendarYear(e,t):ce==="day"&&this.renderCalendarDay(e,t,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const e=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],t=E.getFullYear(),n=E.getMonth(),o=E.getDate(),a=new Date(t,n,1).getDay(),r=new Date(t,n+1,0).getDate(),l=new Date,i=l.getFullYear(),c=l.getMonth(),d=l.getDate(),u=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let m="";u.forEach((g,f)=>{m+=`<option value="${f}" ${f===n?"selected":""}>${g}</option>`});let p="";for(let g=i-5;g<=i+5;g++)p+=`<option value="${g}" ${g===t?"selected":""}>${g}</option>`;let h=`
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.parentElement.children[1].value, this.value)">
                    ${m}
                </select>
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.value, this.parentElement.children[0].value)">
                    ${p}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button class="btn-primary" style="width: 100%; padding: 4px 0; justify-content: center; font-size: 0.85rem;" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${i}, ${c}, ${d})">Hoje</button>
            </div>
            <div class="smc-header">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div class="smc-grid">
        `;for(let g=0;g<a;g++)h+='<div class="smc-day empty"></div>';for(let g=1;g<=r;g++)h+=`<div class="smc-day ${g===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${t}, ${n}, ${g})">${g}</div>`;h+="</div>",e.forEach(g=>{g&&(g.innerHTML=h)})},changeMiniCalendarMonthYear(e,t){let n=E.getDate();const o=new Date(e,parseInt(t)+1,0).getDate();n>o&&(n=o),E=new Date(e,t,n);try{s.setValue("filter-cal-year",e),s.setValue("filter-cal-month",t)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(e,t,n){E=new Date(e,t,n);try{s.setValue("filter-cal-year",e),s.setValue("filter-cal-month",t)}catch{}if(le==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(e,t,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];s.setText("calendar-date-display",`${o[n]} ${t}`);const a=document.getElementById("calendar-month-grid");a.innerHTML="";const r=new Date(t,n,1).getDay(),l=new Date(t,n+1,0).getDate(),i=new Date,c=i.getFullYear()===t&&i.getMonth()===n;new Date(i.getFullYear(),i.getMonth(),1);for(let u=0;u<r;u++)a.innerHTML+='<div class="calendar-day empty"></div>';for(let u=1;u<=l;u++){const m=c&&i.getDate()===u?"today":"";a.innerHTML+=`<div class="calendar-day ${m}" id="cal-day-cell-${u}">
                <div class="calendar-date">${u}</div>
                <div class="calendar-events" id="cal-events-${u}"></div>
            </div>`}this.getLatestRecorrenteAccounts(e).forEach(u=>{if(!u.due_date)return;const m=new Date(t,n,1),p=new Date(i.getFullYear(),i.getMonth(),1);let h=!0;if(u.status==="Off"&&m.getTime()>=p.getTime()&&(h=!1),!!h){for(let g=1;g<=l;g++)if(this.isEventOnDate(u,t,n,g)){const f=document.getElementById(`cal-events-${g}`);if(f){const y=`${t}-${String(n+1).padStart(2,"0")}-${String(g).padStart(2,"0")}`;let $=u.payment_status==="Pago"?"event-paid":u.payment_status==="Pendente"?"event-pending":"event-canceled",T=u.id;if(u.type==="Recorrente"&&y!==u.due_date){const _=A.find(S=>S.company_name===u.company_name&&S.due_date===y);_?($=_.payment_status==="Pago"?"event-paid":_.payment_status==="Pendente"?"event-pending":"event-canceled",T=_.id):$="event-pending"}const C=document.createElement("div");C.className=`event-pill event-${u.type.toLowerCase()} ${$}`,C.title=u.company_name,C.innerText=u.company_name,C.onclick=_=>{this.openDedicatedPage(T,y)},f.appendChild(C)}}}})},renderCalendarDay(e,t,n,o){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];s.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${a[n]} de ${t}`);const r=document.getElementById("calendar-day-list");r.innerHTML="";const l=new Date(t,n,o),i=new Date;i.setHours(0,0,0,0),l.setHours(0,0,0,0);let c=0;this.getLatestRecorrenteAccounts(e).forEach(u=>{let m=!0;if(u.status==="Off"&&l.getTime()>=i.getTime()&&(m=!1),!!m&&this.isEventOnDate(u,t,n,o)){c++;const p=`${t}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let h=u.payment_status==="Pago"?"#4ade80":u.payment_status==="Pendente"?"#facc15":"#ef4444",g=u.id;if(u.payment_status,u.type==="Recorrente"&&p!==u.due_date){const f=A.find(y=>y.company_name===u.company_name&&y.due_date===p);f?(h=f.payment_status==="Pago"?"#4ade80":f.payment_status==="Pendente"?"#facc15":"#ef4444",g=f.id,f.payment_status):h="#facc15"}r.innerHTML+=`
                    <div class="day-event-row ${u.type.toLowerCase()}">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${h}; margin-top: 5px;"></div>
                        <div class="day-evt-info">
                            <h4>${u.company_name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8">(${u.type} - ${u.category||"Outros"})</span></h4>
                            <p style="font-weight: bold; color: var(--text-main); margin: 4px 0;">R$ ${parseFloat(u.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                            <p>${u.description||"Nenhuma descrição detalhada."}</p>
                        </div>
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${g}, '${p}')" title="Detalhes">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                `}}),c===0&&(r.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(e,t){s.setText("calendar-date-display",`Ano de ${t}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],a=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let r=0;r<12;r++){const l=new Date(t,r,1);let i=0,c=0,d=0;this.getLatestRecorrenteAccounts(e).forEach(p=>{let h=!0;if(p.status==="Off"&&l.getTime()>=a.getTime()&&(h=!1),!h)return;const g=new Date(t,r+1,0).getDate();for(let f=1;f<=g;f++)this.isEventOnDate(p,t,r,f)&&(i++,p.type==="Recorrente"?c++:d++)});const m=i>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${m}" onclick="window.AccountsHandler.jumpToMonthFromYear(${r})">
                   <div class="year-month-title">${o[r]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${i}</strong></p>
                       ${i>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${c}</p>`:""}
                       ${i>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${d}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(e){E.setMonth(e),s.setValue("filter-month",e),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(e=null){document.getElementById("account-form").reset(),this.populateCategoryModalSelect();const t=document.getElementById("account-type");if(t.onchange=()=>{t.value==="Recorrente"?s.show("account-frequency-group"):s.hide("account-frequency-group")},e){s.setText("account-modal-title","Editar Conta");const n=A.find(o=>o.id===e);n&&(s.setValue("account-id",n.id),s.setValue("account-company",n.company_name),s.setValue("account-type",n.type),s.setValue("account-category",n.category||"Outros"),s.setValue("account-frequency",n.frequency||"1 mes"),s.setValue("account-value",parseFloat(n.value||0).toFixed(2)),s.setValue("account-status",n.status),s.setValue("account-payment-status",n.payment_status||"Pendente"),s.setValue("account-due-date",n.due_date||""),s.setValue("account-description",n.description||""),s.setValue("account-observation",n.observation||""),t.onchange())}else s.setText("account-modal-title","Nova Conta"),s.setValue("account-id",""),t.onchange();s.show("account-modal-form")},openDedicatedPage(e,t=null){const n=A.find(p=>p.id===e);if(!n)return;let o=A.filter(p=>p.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((p,h)=>new Date(h.due_date||0)-new Date(p.due_date||0)),s.hide("accounts-section"),s.show("dedicated-account-page"),s.setText("ded-acc-company",n.company_name);let a=0,r=0,l=0;const i=new Date;i.setHours(0,0,0,0),this.currentCompanyHistory.forEach(p=>{const h=parseFloat(p.value||0);if(p.payment_status==="Pago")a+=h,l++;else if(p.payment_status==="Pendente"&&p.due_date){const[g,f,y]=p.due_date.split("-"),$=new Date(parseInt(g,10),parseInt(f,10)-1,parseInt(y,10));$.setHours(0,0,0,0),$.getTime()<i.getTime()&&(r+=h)}});const c=a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),d=r.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});s.setText("ded-acc-total-paid","R$ "+c),s.setText("ded-acc-total-pending","R$ "+d),s.setText("ded-acc-total-count",l.toString());const u=document.getElementById("ded-acc-status-badge");n.status==="On"?u.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':u.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,t);const m=document.getElementById("btn-ded-add-history");m&&(m.onclick=()=>{this.openAccountModal(),setTimeout(()=>{s.setValue("account-company",n.company_name),s.setValue("account-type",n.type),s.setValue("account-category",n.category)},100)},D.isAdmin()||(m.style.display="none"))},injectCurrentMonthProjections(e){const t=new Date;let n=null;if(e.forEach(r=>{r.type==="Recorrente"&&(n?new Date(r.due_date||0)>new Date(n.due_date||0)&&(n=r):n=r)}),!n)return e;const o=[...e],a=new Set(e.map(r=>r.due_date));for(let r=0;r<3;r++){const l=new Date(t.getFullYear(),t.getMonth()+r,1),i=l.getFullYear(),c=l.getMonth(),d=new Date(i,c+1,0).getDate();for(let u=1;u<=d;u++)if(this.isEventOnDate(n,i,c,u)){const m=`${i}-${String(c+1).padStart(2,"0")}-${String(u).padStart(2,"0")}`;a.has(m)||(o.push({...n,is_projection:!0,due_date:m,payment_status:"Pendente",unique_key:n.id+"_"+m}),a.add(m))}}return o.forEach(r=>{r.unique_key||(r.unique_key=r.id.toString())}),o},renderDedicatedHistoryList(){const e=document.getElementById("ded-acc-history-list");if(e){if(e.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){e.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(t=>{let n="Sem Data";if(t.due_date){const l=t.due_date.split("-");l.length===3&&(n=`${l[2]}/${l[1]}/${l[0]}`)}const o=parseFloat(t.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let a="#eab308";t.payment_status==="Pago"?a="#4ade80":t.payment_status==="Cancelado"&&(a="#f87171");const r=document.createElement("div");r.className="glass history-item-card",r.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",r.onmouseover=()=>r.style.background="rgba(255,255,255,0.05)",r.onmouseout=()=>{this.currentSelectedHistoryKey!==t.unique_key&&(r.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===t.unique_key&&(r.style.background="rgba(255,255,255,0.1)",r.style.borderColor="var(--accent)"),r.onclick=()=>this.selectHistoryItem(t.id,t.is_projection?t.due_date:null),r.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${a}22; color: ${a}; font-size: 0.75rem;">${t.payment_status||"Pendente"}</span>
                </div>
            `,e.appendChild(r)})}},selectHistoryItem(e,t=null){this.currentSelectedHistoryKey=t?e+"_"+t:e.toString(),this.renderDedicatedHistoryList();let n=null;if(t&&(n=this.currentCompanyHistory.find(i=>i.id===e&&i.due_date===t&&i.is_projection)),n||(n=this.currentCompanyHistory.find(i=>i.id===e&&!i.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){s.show("ded-acc-details-empty"),s.hide("ded-acc-details-content");return}s.hide("ded-acc-details-empty"),s.show("ded-acc-details-content");let o="DD/MM/YYYY";const a=t||n.due_date;if(a){const i=a.split("-");i.length===3&&(o=`${i[2]}/${i[1]}/${i[0]}`)}s.setText("ded-acc-det-date",o),s.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),s.setValue("ded-acc-det-date-input",a||""),s.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),s.setValue("ded-acc-det-account-status-input",n.status||"On"),s.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(s.show("ded-acc-det-freq-group"),s.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):s.hide("ded-acc-det-freq-group");const r=document.getElementById("btn-ded-save-details");r&&(r.onclick=async()=>{const i={company_name:n.company_name,type:n.type,category:n.category,description:n.description,value:s.getValue("ded-acc-det-val-input"),due_date:s.getValue("ded-acc-det-date-input"),payment_status:s.getValue("ded-acc-det-status-input"),status:s.getValue("ded-acc-det-account-status-input"),observation:s.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?s.getValue("ded-acc-det-freq-input"):"1 mes"};try{let c=n.id;n.is_projection?(c=(await v.post("/accounts",i)).id,alert("Fatura materializada e salva com sucesso!")):(await v.put(`/accounts/${n.id}`,i),alert("Fatura atualizada com sucesso!")),await this.fetch(),this.currentCompanyHistory=A.filter(d=>d.company_name===n.company_name).sort((d,u)=>new Date(u.due_date||0)-new Date(d.due_date||0)),this.openDedicatedPage(c)}catch{alert("Erro ao salvar fatura.")}},D.isAdmin()||(r.style.display="none"));const l=document.getElementById("btn-ded-delete-account");l&&(l.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await v.delete(`/accounts/${n.id}`),await this.fetch();const i=A.filter(c=>c.company_name===n.company_name);i.length>0?this.openDedicatedPage(i[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},D.isAdmin()||(l.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(e){document.getElementById("ded-acc-file-input");const t=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),e.attachment_path){s.hide("ded-acc-upload-area"),s.show("ded-acc-preview-area");const n=e.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),a=e.attachment_path.split("/").pop()||"documento";s.setText("ded-acc-preview-name",a);const r=document.getElementById("ded-acc-preview-link");r.href="javascript:void(0)",r.onclick=async i=>{i.preventDefault();const c=r.innerText;r.innerText="Carregando...";try{const d=await fetch(e.attachment_path);if(!d.ok)throw new Error("Doc não encontrado");const u=await d.blob(),m=window.URL.createObjectURL(u);window.open(m,"_blank")}catch(d){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",d)}finally{r.innerText=c}},n?(o.innerHTML="",o.style.backgroundImage=`url('${e.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const l=document.getElementById("btn-ded-remove-attachment");l.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await v.put(`/accounts/${e.id}`,{...e,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=A.filter(i=>i.company_name===e.company_name).sort((i,c)=>new Date(c.due_date||0)-new Date(i.due_date||0)),this.selectHistoryItem(e.id)}catch{alert("Erro ao remover anexo")}},D.isAdmin()||(l.style.display="none")}else{if(s.show("ded-acc-upload-area"),s.hide("ded-acc-preview-area"),D.isAdmin())t.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,t.style.cursor="pointer";else{t.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',t.style.cursor="default";return}t.onclick=r=>{const l=document.getElementById("ded-acc-file-input");l&&r.target!==l&&l.click()},t.addEventListener("dragover",r=>{r.preventDefault(),t.style.borderColor="var(--accent)",t.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{t.style.borderColor="rgba(255,255,255,0.2)",t.style.background="rgba(0,0,0,0.1)"};t.addEventListener("dragleave",()=>{n()});const o=async r=>{if(!r)return;t.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const l=new FormData;l.append("file",r);try{const i=await fetch("/api/upload",{method:"POST",body:l}),c=await i.json();i.ok?(await v.put(`/accounts/${e.id}`,{...e,attachment_path:c.path}),await this.fetch(),this.currentCompanyHistory=A.filter(d=>d.company_name===e.company_name).sort((d,u)=>new Date(u.due_date||0)-new Date(d.due_date||0)),this.selectHistoryItem(e.id)):(alert(c.error||"Erro no upload"),this.selectHistoryItem(e.id))}catch(i){alert("Falha na comunicação: "+i.message),console.error("Upload Error:",i),this.selectHistoryItem(e.id)}};t.addEventListener("drop",async r=>{if(r.preventDefault(),n(),r.dataTransfer.files.length>0){const l=r.dataTransfer.files[0];await o(l)}});const a=document.getElementById("ded-acc-file-input");a&&(a.onclick=r=>{r.stopPropagation()},a.onchange=async r=>{const l=r.target.files[0];await o(l)})}},async save(e){e.preventDefault();const t=s.getValue("account-id"),n={company_name:s.getValue("account-company"),type:s.getValue("account-type"),category:s.getValue("account-category"),value:s.getValue("account-value"),status:s.getValue("account-status"),payment_status:s.getValue("account-payment-status"),due_date:s.getValue("account-due-date"),description:s.getValue("account-description"),observation:s.getValue("account-observation"),frequency:s.getValue("account-type")==="Recorrente"?s.getValue("account-frequency"):"1 mes"};try{const o=t?`/accounts/${t}`:"/accounts";t?await v.put(o,n):await v.post(o,n),s.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(e){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await v.delete(`/accounts/${e}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},changePage(e){N=e,this.renderAccountsList(ut)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${N===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${N-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let r=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=N-1&&c<=N+1)&&(r&&c-r>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===N?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${c})">
                        ${c}
                    </button>
                `,r=c);a+=`
            <button class="pagination-btn" 
                    ${N===t?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${N+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const l=(N-1)*$e+1,i=Math.min(N*$e,n);a+=`
            <span class="pagination-info">
                Exibindo ${l}-${i} de ${n}
            </span>
        `,o.innerHTML=a}};let me=[],J={},ae=null,Oe=null,qe=null,Ue=!1,Te=!1,ke=!1,O=[],Fe=[],Qe={},W={},ye,Ze,ze,Re,mt,Ne;const et={init(){ye=document.getElementById("timeline-event-form"),Ze=document.getElementById("view-visualizacao"),ze=document.getElementById("view-attention"),Re=document.getElementById("view-anexo"),mt=document.getElementById("view-relatorio"),Ne=document.getElementById("view-config"),window.timelineHandler=et,window.applyFilters=Tt,window.clearFilters=kt,window.toggleFilters=Ct,window.handleDelete=$t,window.resetForm=ot,window.toggleAccordion=ht,window.handleFormSubmit=pt,window.editEvent=nt,window.deleteTopic=Mt,window.deleteSubtopic=Ht,window.handleTrackDragStart=At,window.handleTrackDragOver=_t,window.handleTrackDragEnd=Pt;const e=document.getElementById("timeline-topic-form");e&&(e.onsubmit=Dt);const t=document.getElementById("timeline-subtopic-form");t&&(t.onsubmit=St);const n=document.getElementById("topico");n&&(n.onchange=d=>{tt(d.target.value)});const o=document.getElementById("em-ocorrencia");o&&(o.onchange=d=>{const u=document.getElementById("fim"),m=document.getElementById("inicio");if(d.target.checked){if(!m.value){const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),m.value=p.toISOString().slice(0,16)}u.required=!1}else{const p=new Date;p.setMinutes(p.getMinutes()-p.getTimezoneOffset()),u.value=p.toISOString().slice(0,16),u.required=!0}});const a=document.getElementById("auto-refresh-toggle");a&&(a.onchange=d=>{gt(d.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(d=>{d.onclick=u=>{const m=u.currentTarget.getAttribute("data-timeline-tab");Me(m)}}),ye&&(ye.onsubmit=pt);const r=document.getElementById("rep-filter-start"),l=document.getElementById("rep-filter-end"),i=document.getElementById("rep-filter-topic"),c=document.getElementById("rep-filter-subtopic");r&&(r.onchange=()=>Ie()),l&&(l.onchange=()=>Ie()),i&&(i.onchange=d=>{Bt(d.target.value),Ie()}),c&&(c.onchange=()=>Ie()),window._timelineSectionChangeHandler&&window.removeEventListener("SectionChange",window._timelineSectionChangeHandler),window._timelineSectionChangeHandler=d=>{d.detail&&d.detail.section==="timeline"&&ie().then(()=>{Q(),Ye()})},window.addEventListener("SectionChange",window._timelineSectionChangeHandler),ie().then(()=>{Q(),Ye()})},fetch(){return ie().then(()=>{Q(),Ye()})}};window._timelineFocusHandler&&window.removeEventListener("focus",window._timelineFocusHandler);window._timelineFocusHandler=()=>{Ze&&Q()};window.addEventListener("focus",window._timelineFocusHandler);function tt(e,t=null){const n=document.getElementById("sub-topico");if(!n)return;const o=e?e.toLowerCase().trim():"";if(!o||!W[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',W[o].forEach(a=>{const r=document.createElement("option");r.value=a.toLowerCase(),r.textContent=a,t&&r.value===t.toLowerCase()&&(r.selected=!0),n.appendChild(r)}),t||(n.selectedIndex=1),n.classList.add("has-options")}async function ie(){try{const e=await fetch("/api/timeline/config");if(!e.ok)throw new Error("Falha ao buscar configurações");const t=await e.json();O=t.topics||[],Fe=t.subtopics||[],Qe={},W={},O.forEach(o=>{Qe[o.id]=o.color,W[o.id]=[]}),Fe.forEach(o=>{const a=o.topic_id;W[a]&&W[a].push(o.name)}),Et();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&yt()}catch(e){console.error("Error loading config:",e)}}function Et(){const e=document.getElementById("topico");if(e){const o=e.value;e.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',O.forEach(a=>{const r=document.createElement("option");r.value=a.id,r.textContent=a.name,e.appendChild(r)}),e.value=o}const t=document.getElementById("rep-filter-topic");if(t){const o=t.value;t.innerHTML='<option value="Todos">Todos</option>',O.forEach(a=>{const r=document.createElement("option");r.value=a.id,r.textContent=a.name,t.appendChild(r)}),o&&[...t.options].some(a=>a.value===o)?t.value=o:t.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',O.forEach(o=>{const a=document.createElement("option");a.value=o.id,a.textContent=o.name,n.appendChild(a)}))}function Q(){fetch("/api/timeline/events").then(e=>{if(!e.ok)throw new Error("Failed to fetch");return e.json()}).then(e=>{me=e,at(),ze&&ze.classList.contains("active")&&ft()}).catch(e=>{console.error("Error loading events:",e)})}function Ye(){const e=document.getElementById("timeline-tab-anexo"),t=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())e&&e.classList.remove("role-hidden"),t&&t.classList.remove("role-hidden");else{e&&e.classList.add("role-hidden"),t&&t.classList.add("role-hidden");const o=Re&&Re.classList.contains("active"),a=Ne&&Ne.classList.contains("active");(o||a)&&Me("visualizacao")}}function Me(e){const t={visualizacao:{section:Ze,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:ze,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:Re,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:mt,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:Ne,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(t).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),t[e]&&(t[e].section&&t[e].section.classList.add("active"),t[e].button&&t[e].button.classList.add("active")),e==="visualizacao"?(Q(),Ce(!0)):e==="attention"?(ft(),Ce(!0)):e==="relatorio"?(Ie(),Ce(!1)):(e==="config"&&yt(),Ce(!1))}function Ce(e){const t=document.getElementById("floating-refresh-control");if(t)if(e){t.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!ae&&gt(!0)}else t.classList.add("hidden"),ae&&(clearInterval(ae),ae=null)}function gt(e){ae&&(clearInterval(ae),ae=null),e&&(Q(),ae=setInterval(Q,6e4))}function pt(e){if(e.preventDefault(),Ue){console.warn("[Timeline] O salvamento já está em andamento. Ignorando envio duplicado.");return}Ue=!0;const t=ye.querySelector('button[type="submit"]');t&&(t.textContent="Salvando...",t.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async a=>{const r=await a.text();if(!a.ok)throw new Error(`Server error (${a.status}): ${r}`);return JSON.parse(r)}).then(()=>{alert("Evento salvo com sucesso!"),ot(),Me("visualizacao")}).catch(a=>{console.error("Error saving event:",a),alert("Erro ao salvar evento: "+a.message)}).finally(()=>{t&&(t.textContent="Salvar Evento",t.disabled=!1),Ue=!1})}function nt(e){const t=me.find(r=>r.id===e);if(!t)return;document.getElementById("event-id").value=t.id,document.getElementById("nome").value=t.nome;const n=Be(t.topico);document.getElementById("topico").value=n,tt(n,t.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=t.em_ocorrencia==1||t.em_ocorrencia==="true"||!t.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=t.inicio,document.getElementById("fim").value=t.fim||"",document.getElementById("descricao").value=t.descricao||"",document.getElementById("anotacao").value=t.anotacao||"",document.getElementById("cor").value=t.cor||"#000000",Me("anexo");const a=document.getElementById("btn-delete");a&&(a.style.display="block")}function ot(){ye&&ye.reset();const e=document.getElementById("event-id");e&&(e.value=""),tt("");const t=document.getElementById("fim");t&&(t.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function $t(){const e=document.getElementById("event-id").value;e&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Failed to delete");return t.json()}).then(()=>{alert("Evento excluído!"),ot(),Me("visualizacao")}).catch(t=>{console.error("Error deleting:",t),alert("Erro ao excluir: "+t.message)})}function Tt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`),a=t&&t.value?new Date(t.value).getTime():null,r=n&&n.value?new Date(n.value).getTime():null,l=o?o.value:"";J[e]={start:a,end:r,subTopic:l},at()}function kt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`);t&&(t.value=""),n&&(n.value=""),o&&(o.value=""),J[e]=null,at()}function Ct(e){const t=document.getElementById(`filters-panel-${e}`),n=document.getElementById(`btn-toggle-${e}`);t&&n&&(t.classList.toggle("hidden"),n.classList.toggle("active"))}function ht(e){const t=document.getElementById(e);t&&t.classList.toggle("active")}function at(){const e=document.getElementById("timeline-tracks-container");if(!e)return;const t=Array.from(e.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId),n=O.map(a=>a.id);if(t.length!==n.length||!n.every(a=>t.includes(a))){e.innerHTML="";const a=window.auth&&window.auth.isAdmin(),r=a?'style="cursor: grab;"':"";O.forEach(l=>{const i=`
                <div class="timeline-container" data-topic-id="${l.id}" draggable="false"
                     ondragstart="window.handleTrackDragStart(event, '${l.id}')"
                     ondragover="window.handleTrackDragOver(event)"
                     ondragend="window.handleTrackDragEnd(event)">
                    <div class="topic-header" ${r}
                         ${a?`
                         onmousedown="this.closest('.timeline-container').setAttribute('draggable', 'true')"
                         onmouseup="this.closest('.timeline-container').setAttribute('draggable', 'false')"
                         onmouseleave="this.closest('.timeline-container').setAttribute('draggable', 'false')"`:""}>
                        <div class="topic-indicator" style="background-color: ${l.color};"></div>
                        <h2>${l.name}</h2>
                        <div class="sla-container">SLA: <span id="sla-${l.id}">100%</span></div>
                    </div>
                    <div class="timeline-filters-wrapper">
                        <button class="filters-toggle" onclick="toggleFilters('${l.id}')" id="btn-toggle-${l.id}">
                            <span class="hamburger-icon">☰</span>
                            <span>Filtros</span>
                            <span class="toggle-arrow">▼</span>
                        </button>
                        <div class="timeline-filters hidden" id="filters-panel-${l.id}">
                            <div class="filter-group">
                                <label for="filter-start-${l.id}">De:</label>
                                <input type="datetime-local" id="filter-start-${l.id}" min="2026-01-01T00:00" onchange="applyFilters('${l.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-end-${l.id}">Até:</label>
                                <input type="datetime-local" id="filter-end-${l.id}" min="2026-01-01T00:00" onchange="applyFilters('${l.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-sub-topic-${l.id}">Eventos:</label>
                                <select id="filter-sub-topic-${l.id}" onchange="applyFilters('${l.id}')">
                                    <option value="">Todos</option>
                                </select>
                            </div>
                            <button class="btn-clear-filter" onclick="clearFilters('${l.id}')" title="Limpar Filtro">×</button>
                        </div>
                    </div>
                    <div class="timeline-helper-dates">
                        <span id="min-date-${l.id}"></span>
                        <span id="max-date-${l.id}"></span>
                    </div>
                    <div class="timeline-track-container">
                        <div class="timeline-track" id="track-${l.id}"></div>
                    </div>
                </div>
            `;e.insertAdjacentHTML("beforeend",i);const c=document.getElementById(`filter-sub-topic-${l.id}`);c&&W[l.id]&&W[l.id].forEach(d=>{const u=document.createElement("option");u.value=d.toLowerCase(),u.textContent=d,c.appendChild(u)})})}O.forEach(a=>{const r=document.getElementById(`track-${a.id}`),l=document.getElementById(`min-date-${a.id}`),i=document.getElementById(`max-date-${a.id}`);r&&(r.innerHTML=""),l&&(l.textContent=""),i&&(i.textContent="")}),me.length!==0&&O.forEach(a=>{const r=a.id,l=me.filter(y=>Be(y.topico)===r);let i=l;J[r]&&J[r].subTopic&&(i=l.filter(y=>(y.sub_topico?y.sub_topico.toLowerCase():"")===J[r].subTopic.toLowerCase()));const c=J[r]&&J[r].start?J[r].start:new Date("2026-01-01T00:00:00").getTime(),d=J[r]&&J[r].end?J[r].end:Date.now();It(r,i,c,d);const u=c,m=d,p=m-u,h=document.getElementById(`min-date-${r}`),g=document.getElementById(`max-date-${r}`);h&&(h.textContent=new Date(u).toLocaleDateString()+" "+new Date(u).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),g&&(g.textContent=new Date(m).toLocaleDateString()+" "+new Date(m).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const f=document.getElementById(`track-${r}`);f&&i.forEach(y=>{const $=new Date(y.inicio).getTime(),T=y.fim?new Date(y.fim).getTime():Date.now();if(T<u||$>m)return;const C=Math.max($,u),_=Math.min(T,m),S=(C-u)/p*100,w=(_-C)/p*100;if(w<=0)return;const M=document.createElement("div");M.className="timeline-bar",M.style.left=`${S}%`,M.style.width=`${w}%`,M.style.color=y.cor&&y.cor!=="#000000"?y.cor:Qe[r]||"#6b7280";const b=document.createElement("div");b.className="timeline-bar-visual",M.appendChild(b);const V=document.createElement("div");V.className="timeline-identifier-point";const j=new Date(y.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),q=y.fim?new Date(y.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",U=a.name,L=y.sub_topico?y.sub_topico.charAt(0).toUpperCase()+y.sub_topico.slice(1):"-";V.setAttribute("data-tooltip",`Tópico: ${U}
Eventos: ${L}
Início: ${j} - Fim: ${q}
Descrição: ${y.descricao||"-"}`),!y.fim&&V.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(V.style.cursor="pointer",V.onclick=ge=>{ge.stopPropagation(),nt(y.id)}):V.style.cursor="default",M.appendChild(V),f.appendChild(M)})})}function Be(e){return e?e.toLowerCase().trim():""}function It(e,t,n,o){const a=document.getElementById(`sla-${e}`);if(!a)return;const r=o-n;if(r<=0){a.textContent="N/A";return}const i=t.filter(p=>{const h=new Date(p.inicio).getTime();return(p.fim?new Date(p.fim).getTime():Date.now())>n&&h<o}).map(p=>({start:Math.max(new Date(p.inicio).getTime(),n),end:Math.min(p.fim?new Date(p.fim).getTime():Date.now(),o)}));i.sort((p,h)=>p.start-h.start);const c=[];if(i.length>0){let p=i[0];for(let h=1;h<i.length;h++){const g=i[h];g.start<p.end?p.end=Math.max(p.end,g.end):(c.push(p),p=g)}c.push(p)}let d=0;c.forEach(p=>{d+=p.end-p.start});const u=(r-d)/r*100;let m="#10b981";u<50?m="#ef4444":u<90&&(m="#f97316"),a.style.color=m,a.textContent=u.toFixed(4)+"%"}function ft(){const e=document.getElementById("attention-topics-container");if(!e)return;e.innerHTML="";const t=me.filter(n=>!n.fim);O.forEach(n=>{const o=n.id,a=t.filter(f=>Be(f.topico)===o),r=document.createElement("div");r.className=a.length>0?"accordion-item active":"accordion-item",r.id=`attn-acc-${o}`;const l=document.createElement("div");l.className="accordion-header",l.onclick=()=>ht(`attn-acc-${o}`);const i=document.createElement("div");i.className="accordion-title-group";const c=document.createElement("div");c.className="topic-indicator",c.style.backgroundColor=n.color;const d=document.createElement("h3");d.textContent=n.name;const u=document.createElement("span");u.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",u.textContent=`${a.length}`,i.appendChild(c),i.appendChild(d),i.appendChild(u);const m=document.createElement("span");m.className="accordion-chevron",m.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',l.appendChild(i),l.appendChild(m);const p=document.createElement("div");p.className="accordion-content";const h=document.createElement("div");h.className="accordion-body";const g=document.createElement("div");if(g.className="attention-carousel",a.length===0){const f=document.createElement("div");f.className="empty-state",f.textContent="Nenhum evento em andamento.",g.appendChild(f)}else a.forEach(f=>{const y=document.createElement("div");y.className="attention-card",y.style.borderLeftColor=f.cor&&f.cor!=="#000000"?f.cor:n.color;const $=document.createElement("h3");$.textContent=f.nome;const T=document.createElement("div");T.className="sub-topic",T.textContent=f.sub_topico||"-";const C=document.createElement("div");C.className="card-detail",C.innerHTML=`<strong>Início:</strong> ${new Date(f.inicio).toLocaleString()}`;const _=Date.now()-new Date(f.inicio).getTime(),S=document.createElement("div");S.className="card-duration",S.innerHTML=`<strong>Tempo:</strong> <span>${Lt(_)}</span>`;const w=document.createElement("div");w.className="card-description",w.textContent=f.descricao||"-",y.appendChild($),y.appendChild(T),y.appendChild(C),y.appendChild(S),y.appendChild(w),window.auth&&window.auth.isAdmin()?(y.style.cursor="pointer",y.onclick=()=>nt(f.id)):y.style.cursor="default",g.appendChild(y)});h.appendChild(g),p.appendChild(h),r.appendChild(l),r.appendChild(p),e.appendChild(r)})}function Lt(e){if(e<0)return"0s";const t=Math.floor(e/1e3),n=Math.floor(t/60),o=Math.floor(n/60),a=Math.floor(o/24),r=[];return a>0&&r.push(`${a}d`),(o%24>0||a>0)&&r.push(`${o%24}h`),(n%60>0||o>0)&&r.push(`${n%60}m`),r.push(`${t%60}s`),r.join(" ")}function Bt(e){const t=document.getElementById("rep-filter-subtopic");if(!t)return;t.innerHTML='<option value="Todos">Todos</option>';const n=e?e.toLowerCase().trim():"";n&&W[n]&&W[n].forEach(o=>{const a=document.createElement("option");a.value=o.toLowerCase(),a.textContent=o,t.appendChild(a)})}function Ie(){let e=me;const t=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,a=document.getElementById("rep-filter-subtopic")?.value;if(t){const w=new Date(t+"T00:00:00").getTime();e=e.filter(M=>new Date(M.inicio).getTime()>=w)}if(n){const w=new Date(n+"T23:59:59").getTime();e=e.filter(M=>new Date(M.inicio).getTime()<=w)}o&&o!=="Todos"&&(e=e.filter(w=>Be(w.topico)===o.toLowerCase())),a&&a!=="Todos"&&(e=e.filter(w=>w.sub_topico&&w.sub_topico.toLowerCase()===a.toLowerCase()));const r=document.getElementById("rep-kpi-total"),l=document.getElementById("rep-kpi-active"),i=document.getElementById("rep-kpi-avg-time");r&&(r.textContent=e.length);const c=e.filter(w=>w.em_ocorrencia==1||w.em_ocorrencia==="true"||!w.fim);l&&(l.textContent=c.length);const d=e.filter(w=>w.fim);let u="0h 0m";if(d.length>0){const M=d.reduce((q,U)=>q+(new Date(U.fim).getTime()-new Date(U.inicio).getTime()),0)/d.length,b=Math.floor(M/6e4),V=Math.floor(b/60),j=b%60;u=`${V}h ${j}m`}if(i&&(i.textContent=u),!window.Chart){console.warn("Chart.js is not loaded.");return}const m=O,p=t?new Date(t+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),h=n?new Date(n+"T23:59:59").getTime():Date.now(),g=m.map(w=>w.name),f=m.map(w=>{const M=w.id,b=me.filter(H=>Be(H.topico)===M),V=h-p;if(V<=0)return 100;const q=b.filter(H=>{const G=new Date(H.inicio).getTime();return(H.fim?new Date(H.fim).getTime():Date.now())>p&&G<h}).map(H=>({start:Math.max(new Date(H.inicio).getTime(),p),end:Math.min(H.fim?new Date(H.fim).getTime():Date.now(),h)}));q.sort((H,G)=>H.start-G.start);const U=[];if(q.length>0){let H=q[0];for(let G=1;G<q.length;G++){const re=q[G];re.start<H.end?H.end=Math.max(H.end,re.end):(U.push(H),H=re)}U.push(H)}const Y=(H=>{let G=0;return H.forEach(re=>{G+=re.end-re.start}),G})(U),ge=(V-Y)/V*100;return parseFloat(ge.toFixed(4))}),y=m.map(w=>w.color||"#6b7280"),$=document.getElementById("chart-rep-sla");$&&(Oe&&Oe.destroy(),Oe=new window.Chart($,{type:"bar",data:{labels:g,datasets:[{label:"Disponibilidade %",data:f,backgroundColor:y,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...f)-5),max:100,ticks:{callback:w=>w+"%"}}}}}));const T={};e.forEach(w=>{const M=w.sub_topico?w.sub_topico.charAt(0).toUpperCase()+w.sub_topico.slice(1).toLowerCase():"Não especificado";T[M]=(T[M]||0)+1});const C=Object.keys(T),_=Object.values(T),S=document.getElementById("chart-rep-qty");S&&(qe&&qe.destroy(),qe=new window.Chart(S,{type:"doughnut",data:{labels:C.length>0?C:["Nenhum evento"],datasets:[{data:_.length>0?_:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function Dt(e){if(e.preventDefault(),Te)return;Te=!0;const t=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!t||!n||!o){Te=!1;return}const a={id:t.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!a.id){alert("Por favor, defina um ID para o tópico."),Te=!1;return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(r=>{if(!r.ok)throw new Error("Erro ao salvar tópico");return r.json()}).then(()=>(alert("Tópico salvo com sucesso!"),t.value="",n.value="",o.value="#3b82f6",ie().then(()=>{Q()}))).catch(r=>{console.error(r),alert("Erro: "+r.message)}).finally(()=>{Te=!1})}function St(e){if(e.preventDefault(),ke)return;ke=!0;const t=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!t||!n){ke=!1;return}const o={topic_id:t.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento."),ke=!1;return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(a=>{if(!a.ok)throw new Error("Erro ao adicionar evento");return a.json()}).then(()=>(alert("Evento adicionado!"),n.value="",ie())).catch(a=>{console.error(a),alert("Erro: "+a.message)}).finally(()=>{ke=!1})}function Mt(e){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir tópico");return t.json()}).then(()=>{alert("Tópico excluído!"),ie().then(()=>{Q()})}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function Ht(e){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir evento");return t.json()}).then(()=>{alert("Evento excluído!"),ie()}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function yt(){const e=document.getElementById("config-topics-list");e&&(e.innerHTML="",O.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':O.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(o)}));const t=document.getElementById("config-subtopics-list");t&&(t.innerHTML="",Fe.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':Fe.forEach(n=>{const o=O.find(i=>i.id===n.topic_id),a=o?o.name:n.topic_id,r=o?o.color:"#6b7280",l=document.createElement("div");l.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",l.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${r}22; color: ${r}; font-weight: 600; border: 1px solid ${r}44;">${a}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(l)}))}function At(e,t){e.currentTarget.classList.add("dragging"),e.dataTransfer.effectAllowed="move"}function _t(e){e.preventDefault();const t=document.querySelector(".timeline-container.dragging");if(!t)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const a=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(r=>{const l=r.getBoundingClientRect();return e.clientY<=l.top+l.height/2});a?n.insertBefore(t,a):n.appendChild(t)}function Pt(e){const t=document.querySelector(".timeline-container.dragging");t&&t.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(a=>{a.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId);Vt(o)}function Vt(e){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:e})}).then(t=>{if(!t.ok)throw new Error("Erro ao salvar nova ordenação");return t.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),ie().then(()=>{Q()})}).catch(t=>{console.error(t),alert("Erro ao salvar ordenação: "+t.message)})}let X=[],de=[],Je=[],Ge=[],k="extensions",P=1,fe=100,We=[];const ue={setActiveTab(e){k=e,P=1;const t=document.getElementById("telephony-search");t&&(t.value="",e==="extensions"?t.placeholder="Pesquisar ramais por número, nome ou usuário...":e==="queues"?t.placeholder="Pesquisar filas por número ou nome...":e==="blf"?t.placeholder="Pesquisar BLF por nome...":e==="users"&&(t.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(l=>{l.id===`tab-telephony-${e}`?l.classList.add("active"):l.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(l=>{l.id===`telephony-view-${e}`?l.classList.remove("hidden"):l.classList.add("hidden")});const a=document.querySelector("#telephony-section .search-bar"),r=document.getElementById("telephony-pagination");if(a&&(a.style.display=e==="history"?"none":"flex"),r&&(r.style.display=e==="history"?"none":"block"),e==="history")this.fetchAndRenderHistory();else{const l=this.getActiveDataList();this.render(l)}},getActiveDataList(){return k==="extensions"?X:k==="queues"?de:k==="blf"?Je:k==="users"?Ge:[]},async fetch(){const e=this.getActiveTableBody();e&&(e.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(P=1,k==="extensions")X=await v.get("/telephony/extensions"),this.render(X);else if(k==="queues")de=await v.get("/telephony/queues"),this.render(de);else if(k==="blf"){const t=[];if(X.length===0&&t.push(v.get("/telephony/extensions").then(n=>{X=n}).catch(n=>console.warn("Could not pre-fetch extensions:",n))),de.length===0&&t.push(v.get("/telephony/queues").then(n=>{de=n}).catch(n=>console.warn("Could not pre-fetch queues:",n))),t.length>0)try{await Promise.all(t)}catch(n){console.warn("Could not pre-fetch extensions/queues for BLF mapping:",n)}Je=await v.get("/telephony/blfs"),this.render(Je)}else k==="users"?(Ge=await v.get("/telephony/users"),this.render(Ge)):k==="history"&&await this.fetchAndRenderHistory()}catch(t){console.error(`Error fetching telephony ${k}:`,t),e&&(e.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${t.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return k==="extensions"?document.getElementById("telephony-table-body"):k==="queues"?document.getElementById("telephony-queues-table-body"):k==="blf"?document.getElementById("telephony-blf-table-body"):k==="users"?document.getElementById("telephony-users-table-body"):null},render(e){const t=this.getActiveTableBody();if(!t)return;We=e;const n=e.length,o=Math.ceil(n/fe);P>o&&(P=Math.max(1,o)),P<1&&(P=1);const a=(P-1)*fe,r=e.slice(a,a+fe);if(r.length===0){const l=k==="extensions"?9:k==="queues"?6:k==="blf"?4:5;t.innerHTML=`
                <tr>
                    <td colspan="${l}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}k==="extensions"?this.renderExtensionsList(t,r):k==="queues"?this.renderQueuesList(t,r):k==="blf"?this.renderBlfsList(t,r):k==="users"&&this.renderUsersList(t,r),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",r=n.local_username||"",l=n.local_department||"",i=n.ddr||"-",c=n.Username||"-",d=n.Secret||"",u=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",m=n.observacao||"-",p=d.replace(/'/g,"\\'");return`
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
                    <td>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" class="form-control glass" 
                                   style="width: 130px; padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); color: var(--text-main);" 
                                   value="${r}" 
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
                               value="${l}" 
                               placeholder="Depto..." 
                               onchange="window.TelephonyHandler.updateDepartment('${o}', this.value)">
                    </td>
                    <td>${i}</td>
                    <td><strong style="color: var(--accent);">${c}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 140px;">
                            <span id="secret-txt-${n.id}" style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleSecret(${n.id}, '${p}')" title="Mostrar/Ocultar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg id="secret-icon-${n.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${u}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${m}">${m}</td>
                </tr>
            `}).join("")},renderQueuesList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",r=n.Estrategia||"-",l=n.TimeoutAgente?`${n.TimeoutAgente}s`:"-",i=n.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',c=n.membros?n.membros.length:0,d=n.membros&&n.membros.length>0?n.membros.map(u=>`
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
                    <td><strong>${a}</strong></td>
                    <td style="text-transform: capitalize;">${r}</td>
                    <td>${l}</td>
                    <td>${i}</td>
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
                            ${d}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderBlfsList(e,t){e.innerHTML=t.map(n=>{const o=n.id,a=n.Nome||"-",r=n.quantidade_extensoes||0,l=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",i=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(c=>{let d=X.find(m=>m.extensao_id===c),u=de.find(m=>m.extensao_id===c);if(!d&&!u&&(d=X.find(m=>m.id===c),d||(u=de.find(m=>m.id===c))),d){const m=d.exten||`ID ${c}`,p=d.nome||"Sem nome";return`
                            <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500;">${m} - ${p} <small style="color: var(--text-muted); font-size: 0.75rem;">(Ramal)</small></span>
                            </div>
                        `}else if(u){const m=u.exten||`Fila ${c}`,p=u.nome||"Sem nome";return`
                            <div style="background: rgba(16,185,129,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(16,185,129,0.15); display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: #10b981;">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500; color: #6ee7b7;">${m} - ${p} <small style="color: #a7f3d0; font-size: 0.75rem; opacity: 0.8;">(Fila)</small></span>
                            </div>
                        `}else return`
                            <div style="background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px; opacity: 0.6;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--text-muted);">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">ID ${c} - Não encontrado</span>
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
                    <td><strong>${a}</strong></td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${r} ramais</span>
                            <svg id="blf-arrow-${o}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                    <td style="color: var(--text-muted);">${l}</td>
                </tr>
                <tr id="blf-details-${o}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="4" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${i}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderUsersList(e,t){e.innerHTML=t.map(n=>{const o=n.username||"-",a=n.email||"-",r=n.Tipo||"-",l=n.is_active?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Ativo</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Inativo</span>';return`
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
                    <td style="text-transform: capitalize; font-weight: 600; color: var(--accent);">${r}</td>
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
                    <td>${l}</td>
                </tr>
            `}).join("")},toggleQueueRow(e){const t=document.getElementById(`queue-details-${e}`),n=document.getElementById(`queue-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(e){const t=document.getElementById(`blf-details-${e}`),n=document.getElementById(`blf-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(e){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(e){P=1;const n=this.getActiveDataList().filter(o=>k==="extensions"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.local_username||"").toLowerCase().includes(e)||(o.local_department||"").toLowerCase().includes(e)||(o.Username||"").toLowerCase().includes(e)||(o.ddr||"").toLowerCase().includes(e)||(o.observacao||"").toLowerCase().includes(e):k==="queues"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Estrategia||"").toLowerCase().includes(e):k==="blf"?(o.Nome||"").toLowerCase().includes(e):k==="users"?(o.username||"").toLowerCase().includes(e)||(o.email||"").toLowerCase().includes(e)||(o.Tipo||"").toLowerCase().includes(e):!1);this.render(n)},changePage(e){P=e,this.render(We)},setPageSize(e){fe=parseInt(e,10),P=1,this.render(We)},async updateLocalUsername(e,t){try{console.log(`[TELEFONIA] Atualizando nome de usuário local do ramal ${e} para: ${t}`);const n=window.auth&&window.auth.getUser()?window.auth.getUser().name:"Sistema",o=await v.post("/telephony/extensions/username",{exten:e,username:t,changed_by:n});if(o.success){const a=X.find(r=>r.exten===e);a&&(a.local_username=t),console.log(`[TELEFONIA] Nome de usuário local atualizado para ${e}`)}else alert("Erro ao salvar nome de usuário: "+(o.error||"Erro desconhecido"))}catch(n){console.error("Erro ao atualizar nome de usuário local:",n),alert("Erro de rede ao salvar nome de usuário: "+n.message)}},async updateDepartment(e,t){try{console.log(`[TELEFONIA] Atualizando departamento do ramal ${e} para: ${t}`);const n=window.auth&&window.auth.getUser()?window.auth.getUser().name:"Sistema",o=await v.post("/telephony/extensions/department",{exten:e,department:t,changed_by:n});if(o.success){const a=X.find(r=>r.exten===e);a&&(a.local_department=t),console.log(`[TELEFONIA] Departamento local atualizado para ${e}`)}else alert("Erro ao salvar departamento: "+(o.error||"Erro desconhecido"))}catch(n){console.error("Erro ao atualizar departamento local:",n),alert("Erro de rede ao salvar departamento: "+n.message)}},showExtensionHistory(e){const t=document.getElementById("telephony-history-start"),n=document.getElementById("telephony-history-end");t&&(t.value=""),n&&(n.value="");const o=document.getElementById("telephony-history-exten");o&&(o.value=e);const a=document.getElementById("telephony-history-username");a&&(a.value=""),this.setActiveTab("history")},toggleSecret(e,t){const n=document.getElementById(`secret-txt-${e}`),o=document.getElementById(`secret-icon-${e}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=t,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a="";a+=`
            <button class="pagination-btn" 
                    ${P===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${P-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let r=0;for(let c=1;c<=t;c++)(c===1||c===t||c>=P-1&&c<=P+1)&&(r&&c-r>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${c===P?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${c})">
                        ${c}
                    </button>
                `,r=c);a+=`
            <button class="pagination-btn" 
                    ${P===t?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${P+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const l=(P-1)*fe+1,i=Math.min(P*fe,n);a+=`
            <span class="pagination-info">
                Exibindo ${l}-${i} de ${n}
            </span>
        `,o.innerHTML=a},init(){console.log("📞 [TELEFONIA] Inicializando telephonyHandler...");const e=document.getElementById("telephony-history-start"),t=document.getElementById("telephony-history-end");e&&(e.value=""),t&&(t.value=""),["telephony-history-start","telephony-history-end"].forEach(o=>{const a=document.getElementById(o);a&&a.addEventListener("change",()=>this.fetchAndRenderHistory())}),["telephony-history-exten","telephony-history-username"].forEach(o=>{const a=document.getElementById(o);a&&a.addEventListener("input",()=>this.fetchAndRenderHistory())});const n=document.getElementById("btn-clear-telephony-history-filters");n&&n.addEventListener("click",()=>{e&&(e.value=""),t&&(t.value="");const o=document.getElementById("telephony-history-exten"),a=document.getElementById("telephony-history-username");o&&(o.value=""),a&&(a.value=""),this.fetchAndRenderHistory()})},async fetchAndRenderHistory(){const e=document.getElementById("telephony-history-timeline-container");e&&(e.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Carregando histórico...
                </div>
            `);try{const t=document.getElementById("telephony-history-start")?.value||"",n=document.getElementById("telephony-history-end")?.value||"",o=document.getElementById("telephony-history-exten")?.value||"",a=document.getElementById("telephony-history-username")?.value||"",r=new URLSearchParams({startDate:t,endDate:n,exten:o,username:a}),l=await v.get("/telephony/extensions/history?"+r.toString());this.renderHistoryTimeline(l)}catch(t){console.error("Error fetching extension history:",t),e&&(e.innerHTML=`
                    <div style="text-align: center; padding: 3rem; color: #ef4444; width: 100%;">
                        Erro ao carregar histórico: ${t.message||"Erro desconhecido"}
                    </div>
                `)}},renderHistoryTimeline(e){const t=document.getElementById("telephony-history-timeline-container");if(t){if(!e||e.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Nenhum registro de histórico encontrado para os filtros selecionados.
                </div>
            `;return}t.innerHTML=e.map(n=>{const o=new Date(n.changed_at).toLocaleString("pt-BR"),a=n.exten||"-",r=n.changed_by||"Sistema";let l="";if(n.new_username!==void 0&&n.new_username!==null&&n.old_username!==n.new_username){const i=n.old_username||"<i>(Vazio)</i>",c=n.new_username||"<i>(Removido)</i>";l=`
                     Nome de usuário alterado:
                     <span style="text-decoration: line-through; color: var(--text-muted); margin: 0 6px;">${i}</span>
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="vertical-align: middle; margin-right: 6px; color: var(--success, #10b981);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                     <strong style="color: var(--success, #10b981);">${c}</strong>
                `}else if(n.new_department!==void 0&&n.new_department!==null&&n.old_department!==n.new_department){const i=n.old_department||"<i>(Vazio)</i>",c=n.new_department||"<i>(Removido)</i>";l=`
                     Departamento alterado:
                     <span style="text-decoration: line-through; color: var(--text-muted); margin: 0 6px;">${i}</span>
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="vertical-align: middle; margin-right: 6px; color: var(--success, #10b981);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                     <strong style="color: var(--success, #10b981);">${c}</strong>
                `}else l="Alteração registrada no ramal.";return`
                <div class="timeline-item" style="position: relative; padding-bottom: 10px;">
                    <!-- Bullet point indicating event -->
                    <span style="position: absolute; left: -26px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent, #4F46E5); border: 2px solid var(--text-main, #ffffff); box-shadow: 0 0 8px var(--accent);"></span>
                    
                    <div class="glass" style="padding: 15px; border-radius: 8px; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.02);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 10px;">
                            <span style="font-weight: bold; color: var(--accent); font-size: 0.95rem;">
                                Ramal ${a}
                            </span>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">
                                ${o}
                            </span>
                        </div>
                        <div style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 8px;">
                             ${l}
                         </div>
                         <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
                             <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                             <span>Alterado por: <strong>${r}</strong></span>
                         </div>
                    </div>
                </div>
            `}).join("")}}};let oe="docs";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=D,Ft(),zt(),Rt(),et.init(),ue.init(),D.init()?(console.log("Sessão restaurada:",D.getUser().email),bt()):vt()});let Ke,pe,De,Se;function Ft(){Ke=document.querySelectorAll(".nav-btn"),pe=document.getElementById("btn-new-item"),De=document.getElementById("login-section"),Se=document.getElementById("app-container")}function vt(){De&&De.classList.remove("hidden"),Se&&Se.classList.add("hidden"),document.body.style.overflow="hidden"}function zt(){const e=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=e-5;o<=e+5;o++){const a=document.createElement("option");a.value=o,a.textContent=o,o===e&&(a.selected=!0),n.appendChild(a)}})}function bt(){if(De&&De.classList.add("hidden"),Se&&Se.classList.remove("hidden"),document.body.style.overflow="",oe="docs",Pe(),R.fetch(),Z.fetch(),Ve.fetch(),B.fetch(),window.auth){const e=document.getElementById("timeline-tab-anexo");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"));const t=document.getElementById("timeline-tab-config");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"))}}function wt(){const e=D.getUser();e&&(s.setValue("profile-name",e.name||""),s.setValue("profile-email",e.email||""),s.setValue("profile-role",e.role||""),s.setValue("profile-password",""))}function Pe(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section"].forEach(e=>{s.hide(e)}),pe&&pe.classList.add("hidden"),it.stop(),oe){case"account":case"profile":s.show("account-section"),s.setText("section-title","Minha Conta"),wt(),setTimeout(()=>it.start(),100);break;case"list":s.show("list-section"),s.setText("section-title","Listagem Geral"),R.fetch(),D.isAdmin()&&pe&&pe.classList.remove("hidden");break;case"docs":s.show("docs-section"),s.setText("section-title","Documentação"),Z.fetch();break;case"detail":s.show("detail-section"),s.setText("section-title","Procedimento");break;case"users":s.show("users-section"),s.setText("section-title","Gestão de Usuários"),Ve.fetch();break;case"accounts":s.show("accounts-section"),s.setText("section-title","Gestão de Contas"),B.fetch(),B.handleSearch();break;case"timeline":s.show("timeline-section"),s.setText("section-title","Timeline"),et.fetch();break;case"telephony":s.show("telephony-section"),s.setText("section-title","Telefonia"),ue.fetch();break}Xe()}function Xe(){const e=D.isAdmin();s.toggle("nav-users",!e),s.toggle("nav-accounts",!e),pe&&pe.classList.toggle("role-hidden",!e);const t=document.getElementById("btn-floating-edit");t&&t.classList.toggle("role-hidden",!e),document.querySelectorAll(".btn-actions-container").forEach(l=>{l.classList.toggle("role-hidden",!e)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(l=>{const i=document.getElementById(l);i&&i.classList.toggle("role-hidden",!e)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!e);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!e);const a=document.getElementById("btn-new-doc");a&&a.classList.toggle("role-hidden",!e);const r=D.getUser();if(r){let l=r.name;(l.toLowerCase().startsWith("usuário ")||l.toLowerCase().startsWith("usuario "))&&(l=l.substring(8)),s.setText("profile-name-display",l),s.setText("profile-role-display",r.role);let i=l.substring(0,2).toUpperCase();const c=l.trim().split(/\s+/);c.length>1&&(i=(c[0][0]+c[c.length-1][0]).toUpperCase()),s.setText("profile-avatar-initials",i)}}function Rt(){const e=document.getElementById("sidebar"),t=document.getElementById("sidebar-toggle");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("collapsed")}),Ke.forEach(i=>{i.addEventListener("click",()=>{if(Ke.forEach(c=>c.classList.remove("active")),i.classList.add("active"),oe=i.dataset.section,window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:oe}})),Pe(),window.innerWidth<=768){e.classList.remove("open");const c=document.getElementById("sidebar-overlay");c&&c.classList.remove("active")}})}),window.addEventListener("SectionChange",i=>{oe=i.detail.section,Pe()});const n=async i=>{i&&(i.preventDefault(),i.stopPropagation());const c=document.getElementById("login-btn"),d=document.getElementById("login-error"),u=s.getValue("login-email"),m=s.getValue("login-password");if(d&&d.classList.add("hidden"),!u||!m)return d&&(d.innerText="Por favor, informe o e-mail e a senha.",d.classList.remove("hidden")),!1;c&&(c.disabled=!0,c.innerText="Entrando...");try{const p=await D.login(u,m);p.success?bt():d&&(d.innerText=p.error||"Credenciais inválidas. Tente novamente.",d.classList.remove("hidden"))}catch(p){d&&(d.innerText=p.message||"Erro de conexão com o servidor.",d.classList.remove("hidden"))}finally{c&&(c.disabled=!1,c.innerText="Entrar")}return!1};s.on("login-form","submit",n),s.on("login-btn","click",n),s.on("btn-logout","click",()=>{const i=document.getElementById("auto-refresh-toggle");i&&i.checked&&(i.checked=!1,i.dispatchEvent(new Event("change"))),D.logout(),vt()}),document.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{const c=i.closest(".modal");c&&c.classList.add("hidden")})}),window.UsersHandler=Ve,window.DocsHandler=Z,window.ProceduresHandler=R,window.AccountsHandler=B,window.TelephonyHandler=ue,window.keepsHandler=Le,["extensions","queues","blf","users","history"].forEach(i=>{s.on(`tab-telephony-${i}`,"click",()=>ue.setActiveTab(i))}),s.on("telephony-search","input",i=>ue.search(i.target.value.toLowerCase())),s.on("telephony-page-size","change",i=>ue.setPageSize(i.target.value)),s.on("telephony-reload-btn","click",()=>{const i=document.getElementById("telephony-search");i&&(i.value=""),ue.fetch()}),s.on("accounts-search","input",()=>B.handleSearch()),s.on("filter-status","change",()=>B.handleSearch()),s.on("filter-date-toggle","change",i=>{const c=document.getElementById("sidebar-mini-calendar-list");c&&(c.style.opacity=i.target.checked?"1":"0.4",c.style.pointerEvents=i.target.checked?"auto":"none"),B.handleSearch()}),s.on("filter-cal-month","change",()=>B.handleFilterChange(!0)),s.on("filter-cal-year","change",()=>B.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(i=>{s.on(i,"change",()=>{oe==="accounts"&&B.renderDashboard()})}),s.on("btn-dash-clear-dates","click",()=>{s.setValue("dash-filter-start",""),s.setValue("dash-filter-end",""),s.setValue("dash-filter-type","Todos"),s.setValue("dash-filter-status","Todos"),s.setValue("dash-filter-payment","Todos"),B.resetMultiselects(),s.setValue("dash-sort-empresas","desc"),s.setValue("dash-sort-categorias","desc"),oe==="accounts"&&B.renderDashboard()}),s.on("profile-form","submit",async i=>{i.preventDefault();const c=D.getUser();if(!c)return;const d=s.getValue("profile-name"),u=s.getValue("profile-email"),m=s.getValue("profile-password");try{const p={name:d,email:u,role:c.role};m&&(p.password=m);const h=await v.put(`/users/${c.id}`,p),g={...c,...h};localStorage.setItem("user",JSON.stringify(g)),D.init(),Xe(),wt(),alert("Perfil atualizado com sucesso!")}catch(p){console.error("Erro ao atualizar perfil:",p),alert("Erro ao atualizar perfil: "+(p.message||"Falha na requisição"))}}),s.on("user-form","submit",i=>Ve.save(i)),s.on("doc-form","submit",i=>Z.handleUpload(i)),s.on("account-form","submit",i=>B.save(i)),s.on("form-new-account-category","submit",i=>B.saveCategory(i)),s.on("btn-confirm-delete-category","click",()=>B.confirmDeleteCategory()),s.on("form-quick-keep","submit",i=>Le.saveQuickNote(i)),s.on("form-edit-keep","submit",i=>Le.saveEditModal(i)),s.on("faq-form","submit",i=>R.saveMeta(i));const o=document.getElementById("proc-color-palette"),a=document.getElementById("proc-color");o&&a&&(o.addEventListener("click",i=>{const c=i.target.closest(".color-swatch");if(c)if(c.id==="color-custom-swatch")a.click();else{const d=c.dataset.color;d&&(a.value=d,o.querySelectorAll(".color-swatch").forEach(u=>u.classList.remove("active")),c.classList.add("active"))}}),a.addEventListener("input",i=>{const c=document.getElementById("color-custom-swatch");c&&(c.style.background=i.target.value,o.querySelectorAll(".color-swatch").forEach(d=>d.classList.remove("active")),c.classList.add("active"))})),s.on("btn-new-item","click",()=>{if(s.setText("modal-form-title","Novo Procedimento"),s.setValue("proc-id",""),s.setValue("proc-content","[]"),o){o.querySelectorAll(".color-swatch").forEach(c=>c.classList.remove("active"));const i=o.querySelector('[data-color="#4F46E5"]');i&&i.classList.add("active")}a&&(a.value="#4F46E5"),s.show("modal-form")}),s.on("btn-new-account","click",()=>B.openAccountModal()),s.on("btn-new-account-cal","click",()=>B.openAccountModal()),s.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),s.setValue("user-id-form",""),s.show("modal-user")}),s.on("list-search","input",i=>{R.search(i.target.value.toLowerCase())}),s.on("doc-search","input",i=>{Z.search(i.target.value.toLowerCase())}),s.on("doc-dash-search","input",()=>{Z.renderDashboard()}),s.on("doc-dash-filter-category","change",()=>{Z.renderDashboard()}),s.on("doc-dash-filter-status","change",()=>{Z.renderDashboard()}),s.on("btn-new-doc","click",()=>{s.show("modal-upload")}),["geral","contratos","termo-de-uso","keeps","dashboard"].forEach(i=>{s.on(`tab-doc-${i}`,"click",()=>{let c;i==="termo-de-uso"?c="Termo de Uso":i==="dashboard"?c="dashboard":i==="keeps"?c="keeps":c=i,Z.setActiveTab(c)})}),s.on("doc-category","change",i=>{const c=i.target.value.toLowerCase(),d=document.getElementById("doc-dates-container");d&&(d.style.display=c==="contratos"||c==="termo de uso"?"flex":"none")}),s.on("doc-indefinite","change",i=>{const c=document.getElementById("doc-end-date");c&&(c.disabled=i.target.checked,i.target.checked&&(c.value=""))});const r=document.getElementById("drop-zone"),l=document.getElementById("doc-file");r&&l&&(r.addEventListener("click",i=>{i.target!==l&&l.click()}),l.addEventListener("click",i=>{i.stopPropagation()}),l.addEventListener("change",i=>{i.target.files.length>0&&s.setText("file-name-display",i.target.files[0].name)}),r.addEventListener("dragover",i=>{i.preventDefault(),r.classList.add("dragover")}),r.addEventListener("dragleave",()=>{r.classList.remove("dragover")}),r.addEventListener("drop",i=>{i.preventDefault(),r.classList.remove("dragover"),i.dataTransfer.files.length>0&&(l.files=i.dataTransfer.files,s.setText("file-name-display",i.dataTransfer.files[0].name))})),s.on("toggle-list","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),R.setListingMode("list")}),s.on("toggle-cards","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),R.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes","configuracoes"].forEach(i=>{s.on(`tab-acc-${i}`,"click",c=>{document.querySelectorAll(".acc-tab-btn").forEach(h=>h.classList.remove("active")),c.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(h=>{h.classList.add("hidden"),h.classList.remove("active")});const d=document.getElementById("accounts-dashboard-view");d&&(d.classList.add("hidden"),d.classList.remove("active"));const u=i==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${i}`,m=document.getElementById(u);m&&(m.classList.remove("hidden"),m.classList.add("active"));const p=document.getElementById("calendar-view-toggle-container");p&&(i==="calendario"?(p.classList.remove("hidden"),p.style.display="flex"):(p.classList.add("hidden"),p.style.display="none")),B.setAccountsViewMode(i==="calendario"?"calendar":i==="dashboard"?"dashboard":i==="notificacoes"?"notificacoes":i==="configuracoes"?"configuracoes":"list"),i==="configuracoes"&&B.fetchCategories()})}),["day","month","year"].forEach(i=>{s.on(`toggle-accounts-cal-${i}`,"click",c=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(d=>d.classList.remove("active")),c.currentTarget.classList.add("active"),["day","month","year"].forEach(d=>{document.getElementById(`cal-${d}-view-container`).classList.toggle("hidden-cal-view",d!==i)}),B.setCalendarSubView(i)})}),s.on("btn-prev-date-nav","click",()=>B.shiftCalendarDate(-1)),s.on("btn-next-date-nav","click",()=>B.shiftCalendarDate(1)),s.on("btn-back-to-accounts","click",()=>{s.hide("dedicated-account-page"),s.show("accounts-section"),Xe()}),s.on("btn-back-to-list","click",()=>{const i=document.getElementById("procedure-edit-wrapper");i&&!i.classList.contains("hidden")?R.toggleEditMode(!1):(oe="docs",Pe())}),s.on("btn-floating-edit","click",()=>R.toggleEditMode(!0)),s.on("btn-cancel-edit","click",()=>R.toggleEditMode(!1)),s.on("btn-save-procedure","click",()=>R.handleSaveProcedure()),s.on("confirm-yes","click",()=>{s.hide("modal-confirm"),R.openDetail(R.getPendingProcId())}),s.on("confirm-no","click",()=>{s.hide("modal-confirm")}),s.on("procedure-search","input",i=>{R.filterProcedureContent(i.target.value)}),s.on("btn-add-block","click",()=>{const i=document.getElementById("section-title-input"),c=document.getElementById("section-type-input");i&&(i.value=""),c&&(c.value="TEXTO"),s.show("modal-add-section")}),s.on("btn-confirm-add-section","click",()=>{const i=s.getValue("section-title-input"),c=s.getValue("section-type-input");if(!i)return alert("Por favor, informe o título da seção.");R.addSection(i,c),s.hide("modal-add-section")})}
