(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const Me="/api",b={async get(e){const t=await fetch(`${Me}${e}`);if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async post(e,t){const n=await fetch(`${Me}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async put(e,t){const n=await fetch(`${Me}${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()},async delete(e){const t=await fetch(`${Me}${e}`,{method:"DELETE"});if(!t.ok){const n=await t.json().catch(()=>({}));throw new Error(n.error||`HTTP error! status: ${t.status}`)}return await t.json()},async upload(e,t){const n=await fetch(`${Me}${e}`,{method:"POST",body:t});if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`HTTP error! status: ${n.status}`)}return await n.json()}};let Be=null;const L={init(){const e=localStorage.getItem("user");if(e)try{return Be=JSON.parse(e),!0}catch{return this.logout(),!1}return!1},getUser(){return Be},isAdmin(){return Be&&Be.role==="Administrador"},async login(e,t){try{const n=await b.post("/login",{email:e,password:t});return Be=n,localStorage.setItem("user",JSON.stringify(n)),{success:!0,user:n}}catch(n){return{success:!1,error:n.message}}},logout(){Be=null,localStorage.removeItem("user")}},d={show(e){const t=document.getElementById(e);t&&t.classList.remove("hidden")},hide(e){const t=document.getElementById(e);t&&t.classList.add("hidden")},toggle(e,t){const n=document.getElementById(e);n&&n.classList.toggle("hidden",t)},setText(e,t){const n=document.getElementById(e);n&&(n.innerText=t)},setValue(e,t){const n=document.getElementById(e);n&&(n.value=t)},getValue(e){const t=document.getElementById(e);return t?t.value:null},on(e,t,n){const o=document.getElementById(e);o&&o.addEventListener(t,n)}},wt={canvas:null,ctx:null,particles:[],animationFrameId:null,isActive:!1,init(){if(this.canvas=document.getElementById("account-network-bg"),!this.canvas)return;this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>{this.isActive&&this.resize()});const e=window.innerWidth<=768;this.particleCount=e?30:60,this.connectDistance=150,this.particleColor="rgba(34, 211, 238, 0.5)",this.particles=[];for(let t=0;t<this.particleCount;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,vx:(Math.random()-.5)*1.5,vy:(Math.random()-.5)*1.5,radius:Math.random()*2+1})},resize(){if(!this.canvas)return;const e=document.getElementById("account-section");e&&(this.canvas.width=e.clientWidth,this.canvas.height=e.clientHeight)},updateAndDraw(){if(!(!this.isActive||!this.canvas)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let e=0;e<this.particles.length;e++){const t=this.particles[e];t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.canvas.width)&&(t.vx*=-1),(t.y<0||t.y>this.canvas.height)&&(t.vy*=-1),this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.radius,0,Math.PI*2),this.ctx.fillStyle=this.particleColor,this.ctx.fill();for(let n=e+1;n<this.particles.length;n++){const o=this.particles[n],a=t.x-o.x,s=t.y-o.y,r=Math.sqrt(a*a+s*s);if(r<this.connectDistance){this.ctx.beginPath(),this.ctx.lineWidth=1;const i=1-r/this.connectDistance;this.ctx.strokeStyle=`rgba(34, 211, 238, ${i*.4})`,this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(o.x,o.y),this.ctx.stroke()}}}this.animationFrameId=requestAnimationFrame(()=>this.updateAndDraw())}},start(){this.canvas||this.init(),this.isActive||(this.isActive=!0,this.resize(),this.updateAndDraw())},stop(){this.isActive=!1,this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}};let De=[],j=1,re=10,_e=[];const Je={async fetch(){try{De=await b.get("/users"),this.render(De)}catch(e){console.error("Error fetching Users:",e)}},getUsers(){return De},setPageSize(e){re=e,j=1,this.render(_e)},changePage(e){j=e,this.render(_e)},render(e){_e=e||[];const t=document.getElementById("user-table-body");if(!t)return;const n=_e.length,o=Math.ceil(n/re);j>o&&(j=Math.max(1,o)),j<1&&(j=1);const a=(j-1)*re,s=_e.slice(a,a+re);if(s.length===0){t.innerHTML='<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted);">Nenhum usuário encontrado.</td></tr>',this.renderPaginationControls("users-pagination",0,0);return}t.innerHTML=s.map(r=>{const i=r.role==="Administrador",l=L.isAdmin()?`
                <td onclick="event.stopPropagation()">
                    <div class="btn-actions-container">
                        <button class="btn-icon" onclick="window.UsersHandler.openEditModal(${r.id})" title="Editar">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="btn-icon delete" onclick="window.UsersHandler.delete(${r.id})" title="Excluir" ${i?'disabled style="opacity:0.3;cursor:not-allowed"':""}>
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                    </div>
                </td>`:"";return`
            <tr>
                <td><strong>${r.name}</strong></td>
                <td>${r.email}</td>
                <td><span class="badge" style="background: ${r.role==="Administrador"?"var(--accent)":"rgba(255,255,255,0.1)"}">${r.role}</span></td>
                ${l}
            </tr>`}).join(""),this.renderPaginationControls("users-pagination",o,n)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a=`
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.UsersHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${re===10?"selected":""}>10</option>
                    <option value="25" ${re===25?"selected":""}>25</option>
                    <option value="50" ${re===50?"selected":""}>50</option>
                </select>
            </div>
        `;a+=`
            <button class="pagination-btn" 
                    ${j===1?"disabled":""} 
                    onclick="window.UsersHandler.changePage(${j-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=j-1&&l<=j+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===j?"active":""}" 
                            onclick="window.UsersHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${j===t?"disabled":""} 
                    onclick="window.UsersHandler.changePage(${j+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const r=(j-1)*re+1,i=Math.min(j*re,n);a+=`
            <span class="pagination-info">
                Exibindo ${r}-${i} de ${n}
            </span>
        `,o.innerHTML=a},openEditModal(e){const t=De.find(n=>n.id===e);t&&(d.setText("modal-user-title","Editar Usuário"),d.setValue("user-id-form",t.id),d.setValue("user-name-form",t.name),d.setValue("user-email-form",t.email),d.setValue("user-password-form",""),d.setValue("user-role-form",t.role),d.show("modal-user"))},async save(e){e.preventDefault();const t=d.getValue("user-id-form"),n={name:d.getValue("user-name-form"),email:d.getValue("user-email-form"),password:d.getValue("user-password-form"),role:d.getValue("user-role-form")};try{t?await b.put(`/users/${t}`,n):await b.post("/users",n),d.hide("modal-user"),document.getElementById("user-form").reset(),this.fetch(),alert(t?"Usuário atualizado!":"Usuário criado!")}catch(o){console.error("Erro ao salvar usuário:",o),alert("Erro: "+o.message)}},async delete(e){if(confirm("Deseja excluir este usuário?"))try{await b.delete(`/users/${e}`),this.fetch()}catch(t){alert("Erro ao excluir: "+t.message)}},search(e){j=1;const t=De.filter(n=>n.name.toLowerCase().includes(e)||n.email.toLowerCase().includes(e));this.render(t)}};let me=[],xe="",we=null;const Pt=[{name:"Padrão",value:"#1e293b",border:"#334155"},{name:"Âmbar",value:"#78350f",border:"#92400e"},{name:"Esmeralda",value:"#064e3b",border:"#065f46"},{name:"Ciano",value:"#164e63",border:"#155e75"},{name:"Azul",value:"#1e3a8a",border:"#1e40af"},{name:"Roxo",value:"#4c1d95",border:"#5b21b6"},{name:"Rosa",value:"#831843",border:"#9d174d"},{name:"Vermelho",value:"#7f1d1d",border:"#991b1b"},{name:"Grafite",value:"#374151",border:"#4b5563"}],Et={Poppins:"'Poppins', sans-serif","Space Mono":"'Space Mono', monospace",Georgia:"'Georgia', serif",Roboto:"'Roboto', sans-serif",Caveat:"'Caveat', cursive, sans-serif"},$t={small:"0.85rem",medium:"1rem",large:"1.2rem",xlarge:"1.4rem"},he={async fetch(){try{const e=await b.get("/keep-notes");me=Array.isArray(e)?e:[]}catch(e){console.error("Erro ao buscar notas Keep:",e),me=[]}this.render()},getSearchQuery(){return xe},search(e){xe=(e||"").toLowerCase().trim();const t=document.getElementById("doc-search");t&&t.value!==e&&(t.value=e),this.render()},getFilteredNotes(){return(xe?me.filter(t=>t.title&&t.title.toLowerCase().includes(xe)||t.content&&t.content.toLowerCase().includes(xe)):[...me]).sort((t,n)=>(t.position??0)-(n.position??0))},render(){const e=document.getElementById("keep-pinned-grid"),t=document.getElementById("keep-other-grid"),n=document.getElementById("keep-pinned-section"),o=document.getElementById("keep-other-title"),a=document.getElementById("keep-empty-state"),s=document.getElementById("keep-count-badge");if(!e||!t)return;const r=this.getFilteredNotes();if(s&&(s.innerText=me.length),r.length===0){if(n&&(n.style.display="none"),e.innerHTML="",t.innerHTML="",a){a.style.display="block";const c=a.querySelector("p");c&&(c.innerText=xe?`Nenhuma nota encontrada para "${xe}".`:"Nenhuma nota cadastrada.")}return}a&&(a.style.display="none");const i=r.filter(c=>c.is_pinned),l=r.filter(c=>!c.is_pinned);i.length>0?(n&&(n.style.display="block"),e.innerHTML=i.map(c=>this.renderNoteCard(c)).join(""),o&&(o.innerText="OUTRAS NOTAS")):(n&&(n.style.display="none"),e.innerHTML="",o&&(o.innerText="TODAS AS NOTAS")),t.innerHTML=l.map(c=>this.renderNoteCard(c)).join(""),this.initDragAndDrop()},renderNoteCard(e){const t=Et[e.font_family]||Et.Poppins,n=$t[e.font_size]||$t.medium,o=e.color||"#1e293b",a=e.is_pinned?"#f59e0b":"rgba(255,255,255,0.4)",s=e.is_pinned?"Desafixar Nota":"Fixar Nota";return`
            <div class="keep-card keep-card-enhanced keep-draggable-card"
                 draggable="true"
                 data-id="${e.id}"
                 data-pinned="${e.is_pinned?"true":"false"}"
                 style="background: ${o}; font-family: ${t}; border: 1px solid rgba(255,255,255,0.15); padding: 18px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 20px rgba(0,0,0,0.25);"
                 onclick="if(!event.target.closest('button') && !event.target.closest('.keep-drag-handle')){ window.keepsHandler.openEditModal(${e.id}); }">
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                            <span class="keep-drag-handle" title="Arrastar para reordenar" style="cursor: grab; display: inline-flex; align-items: center; padding: 2px;">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" style="opacity: 0.5;">
                                    <circle cx="9" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/>
                                    <circle cx="15" cy="5" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
                                </svg>
                            </span>
                            ${e.title?`<h4 style="margin: 0; font-size: 1.15rem; font-weight: 600; color: #ffffff; word-break: break-word; line-height: 1.3;">${e.title}</h4>`:'<span style="flex:1;"></span>'}
                        </div>
                        <button class="btn-icon" onclick="event.stopPropagation(); window.keepsHandler.togglePin(${e.id})" title="${s}" style="padding: 6px; color: ${a}; opacity: 0.9; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
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
        `},initDragAndDrop(){[document.getElementById("keep-pinned-grid"),document.getElementById("keep-other-grid")].filter(Boolean).forEach(t=>{t.dataset.dragInitialized||(t.dataset.dragInitialized="true",t.addEventListener("dragstart",n=>{const o=n.target.closest(".keep-draggable-card");o&&(we=o,o.classList.add("dragging"),n.dataTransfer.effectAllowed="move",n.dataTransfer.setData("text/plain",o.dataset.id))}),t.addEventListener("dragend",async n=>{const o=n.target.closest(".keep-draggable-card")||we;o&&o.classList.remove("dragging"),we=null,await this.saveCardOrder()}),t.addEventListener("dragover",n=>{if(n.preventDefault(),n.dataTransfer.dropEffect="move",!we)return;const o=this.getDragAfterElement(t,n.clientX,n.clientY);o!==we&&(o?t.insertBefore(we,o):t.appendChild(we))}))})},getDragAfterElement(e,t,n){const o=[...e.querySelectorAll(".keep-draggable-card:not(.dragging)")];if(o.length===0)return null;let a=null,s=Number.POSITIVE_INFINITY;for(const l of o){const c=l.getBoundingClientRect(),u=c.left+c.width/2,p=c.top+c.height/2,m=Math.hypot(t-u,n-p);m<s&&(s=m,a=l)}if(!a)return null;const r=a.getBoundingClientRect(),i=r.left+r.width/2;return t<i?a:a.nextElementSibling},async saveCardOrder(){const e=document.getElementById("keep-pinned-grid"),t=document.getElementById("keep-other-grid"),n=[];e&&[...e.querySelectorAll(".keep-draggable-card")].forEach((a,s)=>{const r=Number(a.dataset.id);r&&n.push({id:r,position:s,is_pinned:!0})}),t&&[...t.querySelectorAll(".keep-draggable-card")].forEach((a,s)=>{const r=Number(a.dataset.id);r&&n.push({id:r,position:s,is_pinned:!1})}),n.forEach(o=>{const a=me.find(s=>s.id===o.id);a&&(a.position=o.position,a.is_pinned=o.is_pinned)});try{await b.put("/keep-notes-reorder",{items:n})}catch(o){console.error("Erro ao salvar nova ordem das notas:",o)}},renderColorSwatches(e="#1e293b"){const t=document.getElementById("keep-modal-swatches");t&&(t.innerHTML=Pt.map(n=>`
            <div class="keep-swatch-item ${n.value===e?"selected":""}"
                 style="background: ${n.value}; border-color: ${n.value===e?"#ffffff":n.border};"
                 title="${n.name}"
                 onclick="window.keepsHandler.selectColor('${n.value}')">
            </div>
        `).join(""))},selectColor(e){d.setValue("keep-edit-color",e),this.renderColorSwatches(e)},openNewModal(){d.setValue("keep-edit-id",""),d.setValue("keep-edit-title",""),d.setValue("keep-edit-content",""),d.setValue("keep-edit-color","#1e293b"),d.setValue("keep-edit-font","Poppins"),d.setValue("keep-edit-size","medium");const e=document.getElementById("keep-edit-pin");e&&(e.checked=!1),d.setText("modal-keep-title","Nova Nota Keep"),d.setText("btn-save-keep","Criar Nota"),this.renderColorSwatches("#1e293b"),d.show("modal-edit-keep")},openEditModal(e){const t=me.find(a=>a.id===e||String(a.id)===String(e));if(!t)return;d.setValue("keep-edit-id",t.id),d.setValue("keep-edit-title",t.title||""),d.setValue("keep-edit-content",t.content||"");const n=t.color||"#1e293b";d.setValue("keep-edit-color",n),d.setValue("keep-edit-font",t.font_family||"Poppins"),d.setValue("keep-edit-size",t.font_size||"medium");const o=document.getElementById("keep-edit-pin");o&&(o.checked=!!t.is_pinned),d.setText("modal-keep-title","Editar Nota Keep"),d.setText("btn-save-keep","Salvar Alterações"),this.renderColorSwatches(n),d.show("modal-edit-keep")},async saveEditModal(e){e&&e.preventDefault();const t=d.getValue("keep-edit-id"),n=d.getValue("keep-edit-content");if(!n||!n.trim()){alert("O conteúdo da nota é obrigatório.");return}const o=d.getValue("keep-edit-title"),a=d.getValue("keep-edit-color"),s=d.getValue("keep-edit-font"),r=d.getValue("keep-edit-size"),i=document.getElementById("keep-edit-pin"),l={title:o?o.trim():"",content:n.trim(),color:a||"#1e293b",font_family:s||"Poppins",font_size:r||"medium",is_pinned:i?i.checked:!1};try{t?await b.put(`/keep-notes/${t}`,l):await b.post("/keep-notes",l),d.hide("modal-edit-keep"),await this.fetch()}catch(c){alert("Erro ao salvar nota: "+(c.message||"Erro desconhecido."))}},async togglePin(e){const t=me.find(n=>n.id===e||String(n.id)===String(e));if(t)try{await b.put(`/keep-notes/${e}`,{is_pinned:!t.is_pinned}),await this.fetch()}catch(n){alert("Erro ao atualizar status da nota: "+(n.message||"Erro desconhecido."))}},async deleteNote(e){if(confirm("Deseja realmente excluir esta nota?"))try{await b.delete(`/keep-notes/${e}`),await this.fetch()}catch(t){alert("Erro ao excluir nota: "+(t.message||"Erro desconhecido."))}}};window.keepsHandler=he;let Ue=[],le="Geral",F=1,te=10,et=[];const X={async fetch(){try{F=1,Ue=await b.get("/documents"),this.filterAndRender()}catch(e){console.error("Error fetching Documents:",e)}},getActiveTab(){return le},setActiveTab(e){le=e,F=1,document.querySelectorAll(".docs-tabs-nav .acc-tab-btn").forEach(t=>{const n=t.textContent.trim().toLowerCase();t.classList.toggle("active",n===e.toLowerCase())}),this.filterAndRender()},filterAndRender(){const e=document.querySelector(".docs-header"),t=document.getElementById("doc-search"),n=document.getElementById("btn-new-doc"),o=document.getElementById("btn-new-keep");if(le.toLowerCase()==="dashboard")e&&(e.style.display="none"),d.hide("doc-list-container"),d.hide("doc-keeps-container"),d.show("doc-dashboard-container"),d.hide("doc-pagination"),this.renderDashboard();else if(le.toLowerCase()==="keeps")e&&(e.style.display="flex"),t&&(t.placeholder="Pesquisar nas notas Keep...",t.value=he.getSearchQuery?he.getSearchQuery():""),n&&n.classList.add("hidden"),o&&o.classList.remove("hidden"),d.hide("doc-list-container"),d.hide("doc-dashboard-container"),d.show("doc-keeps-container"),d.hide("doc-pagination"),he.fetch();else{if(e&&(e.style.display="flex"),t&&(t.placeholder="Pesquisar documentos...",t.value=""),n){const s=window.auth&&window.auth.isAdmin?window.auth.isAdmin():!0;n.classList.toggle("role-hidden",!s),n.classList.remove("hidden")}o&&o.classList.add("hidden"),d.show("doc-list-container"),d.hide("doc-dashboard-container"),d.hide("doc-keeps-container"),d.show("doc-pagination");const a=Ue.filter(s=>(s.category||"Geral").toLowerCase()===le.toLowerCase());this.render(a)}},calculateRemainingTime(e){if(!e||e==="Indefinido")return{text:"Vigência Indeterminada",color:"rgba(139, 92, 246, 0.2)",textColor:"#c4b5fd",status:"indefinite",days:1/0};const t=new Date;t.setHours(0,0,0,0);const n=new Date(e+"T00:00:00");n.setHours(0,0,0,0);const o=n.getTime()-t.getTime(),a=Math.ceil(o/(1e3*60*60*24));if(a<0){const s=Math.abs(a);let r=`Expirado há ${s} dia(s)`;return s>=30&&(r=`Expirado há ${Math.floor(s/30)} mês(es)`),{text:r,color:"rgba(239, 68, 68, 0.2)",textColor:"#f87171",status:"expired",days:a}}else{if(a===0)return{text:"Expira hoje!",color:"rgba(249, 115, 22, 0.2)",textColor:"#fb923c",status:"critical",days:a};if(a<=30)return{text:`Expira em ${a} dia(s)`,color:"rgba(245, 158, 11, 0.2)",textColor:"#facc15",status:"critical",days:a};{const s=Math.floor(a/30);let r=`Expira em ${s} mês(es)`;if(s>=12){const i=Math.floor(s/12),l=s%12;r=`Expira em ${i} ano(s)${l>0?` e ${l} mês(es)`:""}`}return{text:r,color:"rgba(34, 197, 94, 0.2)",textColor:"#4ade80",status:"active",days:a}}}},renderDashboard(){const e=document.getElementById("doc-dashboard-tbody");if(!e)return;const t=Ue.filter(y=>{const h=(y.category||"").toLowerCase();return h==="contratos"||h==="termo de uso"});let n=0,o=0,a=0,s=0;t.forEach(y=>{const h=(y.category||"").toLowerCase(),g=this.calculateRemainingTime(y.end_date);g.status==="expired"?s++:g.status==="critical"?(a++,h==="contratos"&&n++,h==="termo de uso"&&o++):(h==="contratos"&&n++,h==="termo de uso"&&o++)}),d.setText("doc-kpi-active-contracts",n),d.setText("doc-kpi-active-terms",o),d.setText("doc-kpi-warning-docs",a),d.setText("doc-kpi-expired-docs",s);const r=document.getElementById("doc-dash-search"),i=document.getElementById("doc-dash-filter-category"),l=document.getElementById("doc-dash-filter-status"),c=r?r.value.toLowerCase().trim():"",u=i?i.value:"Todos",p=l?l.value:"Todos";let m=t.filter(y=>{if(c&&!y.original_name.toLowerCase().includes(c)||u!=="Todos"&&(y.category||"").toLowerCase()!==u.toLowerCase())return!1;const h=this.calculateRemainingTime(y.end_date);return!(p!=="Todos"&&(p==="Ativos"&&(h.status==="expired"||h.status==="critical")||p==="Expirando"&&h.status!=="critical"||p==="Expirados"&&h.status!=="expired"||p==="Indeterminado"&&h.status!=="indefinite"))});if(m.sort((y,h)=>{const g=this.calculateRemainingTime(y.end_date),v=this.calculateRemainingTime(h.end_date),w={expired:1,critical:2,active:3,indefinite:4},x=w[g.status]||5,P=w[v.status]||5;return x!==P?x-P:g.days-v.days}),m.length===0){e.innerHTML=`
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento atende aos filtros selecionados.
                    </td>
                </tr>
            `;return}const f=window.auth&&window.auth.isAdmin();e.innerHTML=m.map(y=>{const h=y.mimetype==="application/pdf"?"📕":"🖼️",g=y.start_date?new Date(y.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",v=y.end_date?y.end_date==="Indefinido"?"Indefinido":new Date(y.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",w=this.calculateRemainingTime(y.end_date),x=f?`<button class="btn-delete" onclick="window.DocsHandler.delete(${y.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"";return`
                <tr>
                    <td>
                        <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                            <span>${h}</span>
                            <span title="${y.original_name}">${y.original_name}</span>
                        </span>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.75rem;">
                            ${y.category}
                        </span>
                    </td>
                    <td>
                        <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 500; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">
                            ${y.department||"-"}
                        </span>
                    </td>
                    <td>${g}</td>
                    <td>${v}</td>
                    <td>
                        <span class="badge" style="background: ${w.color}; color: ${w.textColor}; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                            ${w.text}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <a href="${y.path}" target="_blank" class="btn-secondary" style="padding: 4px 10px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                                Ver
                            </a>
                            ${x}
                        </div>
                    </td>
                </tr>
            `}).join("")},render(e){const t=document.getElementById("doc-list-body");if(!t)return;const n=document.getElementById("doc-list-thead"),o=le.toLowerCase()==="contratos"||le.toLowerCase()==="termo de uso",a=window.auth&&window.auth.isAdmin(),s=a?"":'class="role-hidden"';et=e;const r=e.length,i=Math.ceil(r/te);F>i&&(F=Math.max(1,i)),F<1&&(F=1);const l=(F-1)*te,c=e.slice(l,l+te);if(n&&(o?n.innerHTML=`
                    <tr>
                        <th>Nome</th>
                        <th>Setor / Depto</th>
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
                `),c.length===0){t.innerHTML=`
                <tr>
                    <td colspan="${o?8:5}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum documento encontrado nesta categoria.
                    </td>
                </tr>
            `,this.renderPaginationControls("doc-pagination",0,0);return}t.innerHTML=c.map(u=>{const p=u.mimetype==="application/pdf"?"📕":"🖼️",m=(u.size/1024).toFixed(1)+" KB",f=u.created_at?new Date(u.created_at).toLocaleDateString("pt-BR"):"-",y=u.mimetype==="application/pdf"?"PDF":"Imagem",h=a?`<button class="btn-delete" onclick="window.DocsHandler.delete(${u.id})" style="padding: 4px 10px; font-size: 0.85rem;">Deletar</button>`:"",g=u.start_date?new Date(u.start_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",v=u.end_date?u.end_date==="Indefinido"?"Indefinido":new Date(u.end_date+"T00:00:00").toLocaleDateString("pt-BR"):"-",w=u.department?`<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 500; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">${u.department}</span>`:'<span style="color: var(--text-muted); font-size: 0.85rem;">-</span>';return o?`
                    <tr>
                        <td>
                            <span style="font-weight: 500; display: flex; align-items: center; gap: 8px;">
                                <span>${p}</span>
                                <span title="${u.original_name}">${u.original_name}</span>
                            </span>
                        </td>
                        <td>${w}</td>
                        <td>${m}</td>
                        <td>${y}</td>
                        <td>${g}</td>
                        <td>${v}</td>
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
                                <span>${p}</span>
                                <span title="${u.original_name}">${u.original_name}</span>
                            </span>
                        </td>
                        <td>${m}</td>
                        <td>${y}</td>
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
                `}).join(""),this.renderPaginationControls("doc-pagination",i,r)},async handleUpload(e){e.preventDefault();const t=document.getElementById("doc-file"),n=document.getElementById("doc-category"),o=document.getElementById("doc-display-name");if(!t.files.length){alert("Selecione um arquivo.");return}const a=new FormData,s=n?n.value:"Geral";a.append("category",s),a.append("customName",o?o.value:""),a.append("document",t.files[0]);const r=s.toLowerCase();if(r==="contratos"||r==="termo de uso"){const i=document.getElementById("doc-start-date"),l=document.getElementById("doc-end-date"),c=document.getElementById("doc-indefinite"),u=document.getElementById("doc-department");i&&i.value&&a.append("startDate",i.value),c&&c.checked?a.append("endDate","Indefinido"):l&&l.value&&a.append("endDate",l.value),u&&u.value.trim()&&a.append("department",u.value.trim())}try{await b.upload("/documents",a),d.hide("modal-upload"),document.getElementById("doc-form").reset();const i=document.getElementById("doc-dates-container");i&&(i.style.display="none");const l=document.getElementById("doc-end-date");l&&(l.disabled=!1);const c=document.getElementById("doc-department");c&&(c.value=""),d.setText("file-name-display","Respeite o formato .png ou .pdf"),this.fetch(),alert("Documento adicionado com sucesso!")}catch(i){console.error(i),alert("Erro ao subir arquivo.")}},async delete(e){if(confirm("Deletar este documento?"))try{await b.delete(`/documents/${e}`),this.fetch()}catch{alert("Erro ao excluir documento.")}},search(e){if(le.toLowerCase()==="dashboard")this.renderDashboard();else{F=1;const t=Ue.filter(n=>(n.category||"Geral").toLowerCase()===le.toLowerCase()&&n.original_name.toLowerCase().includes(e));this.render(t)}},setPageSize(e){te=e,F=1,this.render(et)},changePage(e){F=e,this.render(et)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a=`
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.DocsHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${te===10?"selected":""}>10</option>
                    <option value="25" ${te===25?"selected":""}>25</option>
                    <option value="50" ${te===50?"selected":""}>50</option>
                    <option value="100" ${te===100?"selected":""}>100</option>
                </select>
            </div>
        `;a+=`
            <button class="pagination-btn" 
                    ${F===1?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${F-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=F-1&&l<=F+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===F?"active":""}" 
                            onclick="window.DocsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${F===t?"disabled":""} 
                    onclick="window.DocsHandler.changePage(${F+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const r=(F-1)*te+1,i=Math.min(F*te,n);a+=`
            <span class="pagination-info">
                Exibindo ${r}-${i} de ${n}
            </span>
        `,o.innerHTML=a}};let pe=[],I={summaries:[]},It=null,C=null,tt="list",Ae=null,de=null,Tt=null,q=1,ne=10,He=[];const O={getPendingProcId(){return It},async fetch(){try{q=1,pe=await b.get("/procedures"),this.renderTable(pe)}catch(e){console.error("Error fetching FAQs:",e)}},getFaqs(){return pe},setListingMode(e){tt=e,q=1,this.renderTable(He.length?He:pe)},renderTable(e){const t=document.getElementById("list-table-container"),n=document.getElementById("list-cards-container"),o=document.getElementById("proc-table-body");if(!t||!n||!o)return;He=e;const a=e.length,s=Math.ceil(a/ne);q>s&&(q=Math.max(1,s)),q<1&&(q=1);const r=(q-1)*ne,i=e.slice(r,r+ne);tt==="list"?(d.show("list-table-container"),d.hide("list-cards-container"),i.length===0?o.innerHTML=`
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                            Nenhum procedimento encontrado.
                        </td>
                    </tr>
                `:o.innerHTML=i.map(c=>{const u=L.isAdmin()?`
                        <td>
                            <div class="btn-actions-container">
                                <button class="btn-icon edit" data-action="edit" data-id="${c.id}" title="Editar">
                                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                </button>
                                <button class="btn-icon delete" data-action="delete" data-id="${c.id}" title="Deletar">
                                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </td>`:"";return`
                    <tr data-action="open" data-id="${c.id}" class="draggable-row">
                        <td style="border-left: 5px solid ${c.color||"#4F46E5"}"><strong>${c.name||c.title||"Sem título"}</strong></td>
                        <td>${c.responsible||"N/A"}</td>
                        <td><span class="badge" style="background: var(--accent); color: var(--bg-dark);">${c.group_name||"N/A"}</span></td>
                        <td>${c.note||"-"}</td>
                        ${u}
                    </tr>`}).join("")):(d.hide("list-table-container"),d.show("list-cards-container"),i.length===0?n.innerHTML=`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum procedimento encontrado.
                    </div>
                `:n.innerHTML=i.map(c=>{const u=L.isAdmin()?`
                        <div class="card-footer">
                            <div class="btn-actions-container">
                                <button class="btn-icon edit" data-action="edit" data-id="${c.id}" title="Editar">
                                    <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                </button>
                                <button class="btn-icon delete" data-action="delete" data-id="${c.id}" title="Deletar">
                                    <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </div>`:"";return`
                    <div class="card draggable-card" data-action="open" data-id="${c.id}" style="border-top: 5px solid ${c.color||"#4F46E5"}">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                <span class="badge" style="background: var(--accent); color: var(--bg-dark);">${c.group_name||"N/A"}</span>
                            </div>
                            <h3>${c.name||c.title||"Sem título"}</h3>
                            <div class="card-details" style="border: none; padding: 0;">
                                <div style="margin-bottom: 5px;"><strong>Responsável:</strong> ${c.responsible||"N/A"}</div>
                                ${c.note?`<div><strong>Nota:</strong> ${c.note}</div>`:""}
                            </div>
                        </div>
                        ${u}
                    </div>`}).join("")),this.renderPaginationControls("list-pagination",s,a),(tt==="list"?o:n).addEventListener("click",function(u){const p=u.target.closest('[data-action="edit"], [data-action="delete"]');if(p){u.stopPropagation(),u.preventDefault();const f=Number(p.dataset.id);p.dataset.action==="edit"?O.openEditModal(f):p.dataset.action==="delete"&&O.deleteProcedure(f);return}const m=u.target.closest('[data-action="open"]');if(m){const f=Number(m.dataset.id);O.openDetail(f)}})},openDetail(e){const t=pe.find(o=>o.id===e);if(!t)return;d.setText("detail-title",t.name||t.title||"Sem título"),d.setValue("proc-id",t.id);try{let o=t.content?JSON.parse(t.content):[];Array.isArray(o)?I={summaries:[{id:"sum_"+Date.now(),title:"Sumário 1",sections:o}]}:o&&o.summaries&&Array.isArray(o.summaries)?I=o:I={summaries:[]}}catch{I={summaries:[]}}I.summaries.length>0?C=I.summaries[0].id:C=null,this.toggleEditMode(!1),this.renderProcedureView();const n=document.getElementById("procedure-search");n&&(n.value=""),window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:"detail"}}))},openEditModal(e){const t=pe.find(n=>n.id===e);t&&(d.setText("modal-form-title","Editar Procedimento"),d.setValue("proc-id",t.id),d.setValue("proc-name",t.name||t.title||""),d.setValue("proc-responsible",t.responsible||""),d.setValue("proc-group",t.group_name||""),d.setValue("proc-note",t.note||""),d.setValue("proc-content",t.content||""),d.setValue("proc-color",t.color||"#4F46E5"),d.show("modal-form"))},async saveMeta(e){e&&e.preventDefault();const t=d.getValue("proc-id"),n={name:d.getValue("proc-name").toUpperCase(),responsible:d.getValue("proc-responsible").toUpperCase(),group_name:d.getValue("proc-group"),note:d.getValue("proc-note"),content:d.getValue("proc-content"),color:d.getValue("proc-color")};try{const o=t?`/procedures/${t}`:"/procedures";It=(t?await b.put(o,n):await b.post(o,n)).id,d.hide("modal-form"),document.getElementById("faq-form").reset(),d.setValue("proc-responsible","TI"),d.setValue("proc-group","Geral"),await this.fetch(),d.show("modal-confirm")}catch(o){alert("Erro ao salvar procedimento: "+o.message)}},async deleteProcedure(e){if(confirm("Deseja excluir este procedimento?"))try{await b.delete(`/procedures/${e}`),this.fetch()}catch{alert("Erro ao excluir.")}},toggleEditMode(e){const t=document.querySelector(".procedure-sidebar");e?(d.hide("procedure-view-container"),d.hide("procedure-view-sidebar"),d.show("procedure-edit-wrapper"),d.show("procedure-edit-sidebar"),d.hide("btn-floating-edit"),t&&t.classList.add("glass","has-border"),I.summaries.length>0?I.summaries.find(n=>n.id===C)||(C=I.summaries[0].id):C=null,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()):(d.show("procedure-view-container"),d.show("procedure-view-sidebar"),d.hide("procedure-edit-wrapper"),d.hide("procedure-edit-sidebar"),d.show("btn-floating-edit"),t&&t.classList.remove("glass","has-border"),this.renderProcedureView())},renderProcedureView(){const e=document.getElementById("procedure-view-container"),t=document.getElementById("procedure-view-index");if(!e||!t)return;if(I.summaries.length===0){e.innerHTML='<p class="empty-state">Este procedimento ainda não possui conteúdo.</p>',t.innerHTML='<li class="sidebar-index-item" style="color:var(--text-muted); justify-content:center;">Vazio</li>';return}let n="",o="";I.summaries.forEach((a,s)=>{o+=`<li class="sidebar-index-item" onclick="document.getElementById('sum-view-${a.id}').scrollIntoView({behavior: 'smooth', block: 'start'})">${a.title}</li>`,n+=`<div id="sum-view-${a.id}" class="summary-group-view" style="margin-bottom: 40px;">`,(I.summaries.length>1||a.title!=="Sumário 1")&&(n+=`<h4 style="color: var(--text-main); font-size: 0.95rem; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 6px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;"><span style="color: var(--primary); font-size: 1.2rem; line-height: 0;">&bull;</span> ${a.title}</h4>`),a.sections.length===0&&(n+='<p class="empty-state" style="padding: 10px 0;">Sumário vazio.</p>');const r=a.sections.map((i,l)=>{let c="";if(i.type==="TEXTO")c=`<div class="gh-content"><div class="gh-text-view">${i.data||"Sem conteúdo."}</div></div>`;else if(i.type==="FAQ")c='<div class="gh-faq-list">'+(i.data||[]).map((m,f)=>`
                         <div class="gh-accordion" id="gh-faq-${a.id}-${l}-${f}">
                              <div class="gh-accordion-header" onclick="window.toggleGhAccordion('gh-faq-${a.id}-${l}-${f}')">
                                   <div class="gh-accordion-title">${m.q||"Pergunta sem título"}</div>
                                   <span class="gh-accordion-icon">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                   </span>
                              </div>
                              <div class="gh-accordion-content gh-text-view">${m.a||"Sem resposta."}</div>
                         </div>
                     `).join("")+"</div>";else if(i.type==="DOCUMENTO"&&i.data&&i.data.path){const p=i.data.mimetype&&i.data.mimetype.startsWith("image/"),m=i.data.mimetype==="application/pdf";let f="";p?f=`<div class="doc-embed-container"><img src="${i.data.path}" alt="${i.data.name}" class="doc-embed-image" /></div>`:m?f=`<div class="doc-embed-container" style="display: block;"><iframe src="${i.data.path}#toolbar=1&navpanes=1&scrollbar=1" type="application/pdf" class="doc-embed-pdf" title="${i.data.name}"></iframe></div>`:f='<div class="doc-embed-container" style="padding: 20px; text-align: center; color: var(--text-muted);"><p>Visualização não disponível para este formato.</p></div>',c=`
                        <div class="gh-doc-container">
                            ${f}
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
                         ${c}
                     </div>
                 `}).join("");n+=r,n+="</div>"}),t.innerHTML=o,e.innerHTML=n},filterProcedureContent(e){e=e.toLowerCase();const t=document.getElementById("procedure-view-container");if(!t)return;t.querySelectorAll(".gh-box").forEach(o=>{const a=o.querySelector(".gh-faq-list");let s=!1;const r=o.querySelector(".gh-header"),i=r?r.textContent.toLowerCase().includes(e):!1;a&&a.querySelectorAll(".gh-accordion").forEach(u=>{const p=u.textContent.toLowerCase();i||p.includes(e)?(u.classList.remove("hidden"),s=!0):u.classList.add("hidden")});const l=o.textContent.toLowerCase();i||l.includes(e)||s?o.classList.remove("hidden"):o.classList.add("hidden")})},renderProcedureBuilderSidebar(){const e=document.getElementById("procedure-edit-index"),t=document.getElementById("btn-add-block"),n=document.getElementById("current-summary-name");if(!e)return;e.innerHTML=I.summaries.map((a,s)=>`
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
            `).join("");const o=I.summaries.find(a=>a.id===C);o?(n.textContent=o.title,n.style.color="var(--text-main)",t.classList.remove("hidden")):(n.textContent="Nenhum sumário selecionado",n.style.color="var(--accent)",t.classList.add("hidden"))},selectSummary(e){C=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},updateSummaryTitle(e,t){const n=I.summaries.find(a=>a.id===e);n&&(n.title=t||"Sem título"),this.renderProcedureBuilderSidebar();const o=I.summaries.find(a=>a.id===C);o&&(document.getElementById("current-summary-name").textContent=o.title)},addSummary(){const e="sum_"+Date.now();I.summaries.push({id:e,title:`Sumário ${I.summaries.length+1}`,sections:[]}),C=e,this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder()},removeSummary(e){confirm("Excluir este sumário apagará todos os campos dentro dele. Deseja continuar?")&&(I.summaries=I.summaries.filter(t=>t.id!==e),C===e&&(C=I.summaries.length>0?I.summaries[0].id:null),this.renderProcedureBuilderSidebar(),this.renderProcedureBuilder())},renderProcedureBuilder(){const e=document.getElementById("procedure-edit-container");if(!e)return;if(!C){e.innerHTML='<p class="empty-state">Crie um novo sumário na barra lateral para adicionar conteúdo.</p>';return}const t=I.summaries.find(o=>o.id===C);if(!t)return;const n=t.sections;if(n.length===0){e.innerHTML=`<p class="empty-state">Nenhum campo em "${t.title}". Clique em "+ Novo Container" para começar.</p>`;return}e.innerHTML=n.map((o,a)=>`
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
                          ${(o.data||[]).map((s,r)=>`
                              <div class="faq-pair">
                                  <button class="btn-remove-faq" onclick="window.ProceduresHandler.removeFaqItem(${a}, ${r})" title="Remover Pergunta">&times;</button>
                                  <input type="text" placeholder="Pergunta" value="${s.q}" onchange="window.ProceduresHandler.updateFaqItem(${a}, ${r}, 'q', this.value)">
                                  
                                  <div class="rte-container" style="margin-top: 10px;">
                                      ${window.ProceduresHandler.getRteToolbarHTML()}
                                      <div class="proc-textarea-edit" style="min-height: 80px;" contenteditable="true" placeholder="Resposta da FAQ..."
                                           oninput="window.ProceduresHandler.updateFaqItem(${a}, ${r}, 'a', this.innerHTML)" 
                                           onblur="window.ProceduresHandler.updateFaqItem(${a}, ${r}, 'a', this.innerHTML)">${s.a||""}</div>
                                  </div>
                              </div>
                          `).join("")}
                          <button class="btn-secondary-small" style="align-self: flex-start; margin-top: 10px;" onclick="window.ProceduresHandler.addFaqItem(${a})">+ Adicionar Pergunta</button>
                      </div>
                      `:""}
                 </div>
             </div>`).join("")},handleSumDragStart(e,t){Ae="summary",de=t,e.dataTransfer.effectAllowed="move",setTimeout(()=>{e.target&&e.target.classList.add("dragging")},0)},handleSumDrop(e,t){if(e.preventDefault(),Ae!=="summary"||de===null||de===t)return;const n=I.summaries.splice(de,1)[0];I.summaries.splice(t,0,n),this.renderProcedureBuilderSidebar()},handleSecDragStart(e,t,n){Ae="container",de=t,Tt=n,e.dataTransfer.effectAllowed="move",setTimeout(()=>{const o=e.target.nodeType===1?e.target.closest(".editable-section"):null;o&&o.classList.add("dragging")},0)},handleDragOver(e){e.preventDefault(),e.dataTransfer.dropEffect="move"},handleSecDrop(e,t,n){if(e.preventDefault(),Ae!=="container"||de===null||Tt!==n)return;const o=I.summaries.find(s=>s.id===n);if(!o||de===t)return;const a=o.sections.splice(de,1)[0];o.sections.splice(t,0,a),this.renderProcedureBuilder()},handleDragEnd(e){document.querySelectorAll(".editable-section.dragging").forEach(t=>t.classList.remove("dragging")),e&&e.target&&e.target.setAttribute&&e.target.setAttribute("draggable","false"),Ae=null,de=null},updateSectionTitle(e,t){const n=I.summaries.find(o=>o.id===C);n&&(n.sections[e].title=t)},updateSectionData(e,t){const n=I.summaries.find(o=>o.id===C);n&&(n.sections[e].data=t)},removeSection(e){const t=I.summaries.find(n=>n.id===C);t&&t.sections.splice(e,1),this.renderProcedureBuilder()},getRteToolbarHTML(){return`
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
        `},addFaqItem(e){const t=I.summaries.find(n=>n.id===C);t&&(t.sections[e].data=t.sections[e].data||[],t.sections[e].data.push({q:"",a:""}),this.renderProcedureBuilder())},updateFaqItem(e,t,n,o){const a=I.summaries.find(s=>s.id===C);a&&(a.sections[e].data[t][n]=o)},removeFaqItem(e,t){const n=I.summaries.find(o=>o.id===C);n&&n.sections[e].data.splice(t,1),this.renderProcedureBuilder()},addSection(e,t){if(!C){alert("Selecione primeiro um sumário na barra lateral.");return}const n=I.summaries.find(o=>o.id===C);n&&(n.sections.push({id:Date.now(),title:e,type:t,data:t==="FAQ"?[]:t==="TEXTO"?"":null}),this.renderProcedureBuilder())},async handleSectionFileDrop(e,t){t.dataTransfer.files&&t.dataTransfer.files.length>0&&await this.uploadSectionFile(e,t.dataTransfer.files[0])},async handleSectionFileUpload(e,t){const n=t.files[0];n&&await this.uploadSectionFile(e,n)},async uploadSectionFile(e,t){const n=new FormData;n.append("file",t);try{const o=await b.upload("/upload",n),a=I.summaries.find(s=>s.id===C);a&&(a.sections[e].data={name:t.name,path:o.path,mimetype:t.type},this.renderProcedureBuilder())}catch{alert("Erro no upload")}},async handleSaveProcedure(){const e=parseInt(d.getValue("proc-id"));if(!e)return;const n={...pe.find(o=>o.id===e),content:JSON.stringify(I)};try{await b.put(`/procedures/${e}`,n),alert("Salvo com sucesso!"),this.toggleEditMode(!1),this.openDetail(e),this.fetch()}catch{alert("Erro ao salvar")}},search(e){q=1;const t=pe.filter(n=>(n.name||n.title||"").toLowerCase().includes(e)||(n.responsible||"").toLowerCase().includes(e)||(n.group_name||"").toLowerCase().includes(e));this.renderTable(t)},setPageSize(e){ne=e,q=1,this.renderTable(He)},changePage(e){q=e,this.renderTable(He)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a=`
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.ProceduresHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${ne===10?"selected":""}>10</option>
                    <option value="25" ${ne===25?"selected":""}>25</option>
                    <option value="50" ${ne===50?"selected":""}>50</option>
                    <option value="100" ${ne===100?"selected":""}>100</option>
                </select>
            </div>
        `;a+=`
            <button class="pagination-btn" 
                    ${q===1?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${q-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=q-1&&l<=q+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===q?"active":""}" 
                            onclick="window.ProceduresHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${q===t?"disabled":""} 
                    onclick="window.ProceduresHandler.changePage(${q+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const r=(q-1)*ne+1,i=Math.min(q*ne,n);a+=`
            <span class="pagination-info">
                Exibindo ${r}-${i} de ${n}
            </span>
        `,o.innerHTML=a}};window.toggleGhAccordion=function(e){const t=document.getElementById(e);t&&t.classList.toggle("open")};let H=[],ge=[],Ee="list",$e="month",T=new Date,R=1,oe=10,nt=[];const M={async fetch(){try{R=1,H=await b.get("/accounts"),await this.fetchCategories(),this.initDashboardMultiselects(),this.populateCompanyFilter(),this.handleSearch(),this.checkAccountAlerts()}catch(e){console.error("Falha ao obter contas",e)}},async fetchCategories(){try{ge=await b.get("/account-categories"),this.populateCategoryFilter(),this.populateCategoryModalSelect(),this.renderCategoriesList()}catch(e){console.error("Falha ao obter categorias de contas",e)}},populateCategoryFilter(){const e=document.getElementById("dash-filter-category-dynamic-options");if(e){const t=new Set;e.querySelectorAll('input[type="checkbox"]:checked').forEach(r=>{t.add(r.value)});const n=(ge||[]).map(r=>r.name),o=(H||[]).map(r=>r.category).filter(Boolean),a=[...new Set([...n,...o])].sort((r,i)=>r.localeCompare(i));let s="";a.forEach(r=>{const i=t.has(r)?"checked":"";s+=`<label class="multiselect-option"><input type="checkbox" value="${r}" ${i}> <span>${r}</span></label>`}),e.innerHTML=s,this.setupMultiselectListeners("dash-filter-category")}},populateCategoryModalSelect(){const e=document.getElementById("account-category");if(e){const t=e.value,n=(ge||[]).map(r=>r.name),o=(H||[]).map(r=>r.category).filter(Boolean),a=[...new Set([...n,...o])].sort((r,i)=>r.localeCompare(i));let s="";a.forEach(r=>{s+=`<option value="${r}" ${r===t?"selected":""}>${r}</option>`}),e.innerHTML=s}},renderCategoriesList(){const e=document.getElementById("account-categories-table-body");if(!e)return;if(!ge||ge.length===0){e.innerHTML='<tr><td colspan="3" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma categoria cadastrada.</td></tr>';return}let t="";ge.forEach(n=>{const o=n.is_system,a=o?"rgba(59, 130, 246, 0.2)":"rgba(16, 185, 129, 0.2)",s=o?"#60a5fa":"#34d399",r=o?"Sistema":"Personalizada",i=L.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.deleteCategory(${n.id})" title="Excluir Categoria" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; color: #ef4444;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `:"-";t+=`
                <tr>
                    <td><strong>${n.name}</strong></td>
                    <td><span class="badge" style="background: ${a}; color: ${s}; font-size: 0.75rem;">${r}</span></td>
                    <td style="text-align: right; display: flex; justify-content: flex-end;">${i}</td>
                </tr>
            `}),e.innerHTML=t},async saveCategory(e){e&&e.preventDefault();const t=document.getElementById("input-new-category-name");if(!t)return;const n=t.value.trim();if(n)try{await b.post("/account-categories",{name:n}),t.value="",await this.fetchCategories(),this.handleSearch(),alert("Categoria criada com sucesso!")}catch(o){alert("Erro ao criar categoria: "+(o.message||"Erro desconhecido."))}},deleteCategory(e){const t=parseInt(e,10),n=ge.find(l=>l.id===t||String(l.id)===String(e));if(!n){console.error("Categoria não encontrada para exclusão:",e);return}const a=H.filter(l=>l.category===n.name).length,s=ge.filter(l=>String(l.id)!==String(n.id));if(s.length===0){alert("Não é possível excluir esta categoria porque não existem outras categorias para as quais transferir as contas.");return}const r=document.getElementById("select-transfer-category-target");r&&(r.innerHTML=s.map(l=>`<option value="${l.name}">${l.name}</option>`).join(""));const i=document.getElementById("delete-category-warning-text");i&&(a>0?i.innerHTML=`Existem <strong>${a}</strong> conta(s) vinculada(s) à categoria <strong>"${n.name}"</strong>.<br>Selecione para qual categoria deseja transferi-las antes de prosseguir com a exclusão:`:i.innerHTML=`Confirma a exclusão da categoria <strong>"${n.name}"</strong>?`),d.setValue("delete-category-id",n.id),d.show("modal-delete-category")},async confirmDeleteCategory(){const e=d.getValue("delete-category-id"),t=d.getValue("select-transfer-category-target");if(e)try{const n=`/account-categories/${e}${t?`?transferTo=${encodeURIComponent(t)}`:""}`;await b.delete(n),d.hide("modal-delete-category"),alert("Categoria excluída e contas transferidas com sucesso!"),await this.fetch(),this.renderCategoriesList()}catch(n){alert("Erro ao excluir categoria: "+(n.message||"Erro desconhecido."))}},populateCompanyFilter(){const e=document.getElementById("dash-filter-company-dynamic-options");if(e){const t=new Set;e.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{t.add(a.value)});const n=[...new Set(H.map(a=>a.company_name).filter(Boolean))].sort((a,s)=>a.localeCompare(s));let o="";n.forEach(a=>{const s=t.has(a)?"checked":"";o+=`<label class="multiselect-option"><input type="checkbox" value="${a}" ${s}> <span>${a}</span></label>`}),e.innerHTML=o,this.setupMultiselectListeners("dash-filter-company")}},setupMultiselectListeners(e){if(!document.getElementById(`${e}-container`))return;const n=document.getElementById(`${e}-trigger`),o=document.getElementById(`${e}-dropdown`);if(!n||!o)return;n.dataset.listenerBound||(n.addEventListener("click",i=>{i.stopPropagation(),document.querySelectorAll(".multiselect-dropdown").forEach(l=>{l!==o&&l.classList.add("hidden")}),o.classList.toggle("hidden")}),n.dataset.listenerBound="true");const a=o.querySelector('input[value="Todos"]'),s=Array.from(o.querySelectorAll('input[type="checkbox"]')).filter(i=>i.value!=="Todos"),r=()=>{const i=s.filter(c=>c.checked).map(c=>c.value),l=n.querySelector(".trigger-label");a.checked||s.length>0&&i.length===s.length?(a.checked=!0,l&&(l.innerText="Todos")):i.length===0?l&&(l.innerText="Nenhum"):i.length===1?l&&(l.innerText=i[0]):l&&(l.innerText=`${i.length} selecionados`)};a&&!a.dataset.listenerBound&&(a.addEventListener("change",()=>{s.forEach(i=>{i.checked=a.checked}),r(),this.renderDashboard()}),a.dataset.listenerBound="true"),s.forEach(i=>{i.dataset.listenerBound||(i.addEventListener("change",()=>{s.every(c=>c.checked)?a.checked=!0:a.checked=!1,r(),this.renderDashboard()}),i.dataset.listenerBound="true")}),r()},initDashboardMultiselects(){this.setupMultiselectListeners("dash-filter-category"),window.multiselectOutsideClickListenerBound||(document.addEventListener("click",e=>{e.target.closest(".custom-multiselect-container")||document.querySelectorAll(".multiselect-dropdown").forEach(t=>{t.classList.add("hidden")})}),window.multiselectOutsideClickListenerBound=!0)},getMultiselectValues(e){const t=document.getElementById(`${e}-dropdown`);if(!t)return["Todos"];const n=t.querySelector('input[value="Todos"]');return n&&n.checked?["Todos"]:Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(o=>o.value).filter(o=>o!=="Todos")},resetMultiselects(){["dash-filter-category","dash-filter-company"].forEach(e=>{const t=document.getElementById(`${e}-dropdown`);if(t){t.querySelectorAll('input[type="checkbox"]').forEach(a=>{a.checked=a.value==="Todos"});const o=document.getElementById(`${e}-trigger`);if(o){const a=o.querySelector(".trigger-label");a&&(a.innerText="Todos")}}})},getAccounts(){return H},setAccountsViewMode(e){Ee=e,this.handleSearch()},setCalendarSubView(e){$e=e,this.handleSearch()},shiftCalendarDate(e){$e==="day"?T.setDate(T.getDate()+e):$e==="month"?T.setMonth(T.getMonth()+e):$e==="year"&&T.setFullYear(T.getFullYear()+e),d.setValue("filter-day",T.getDate()),d.setValue("filter-month",T.getMonth()),d.setValue("filter-year",T.getFullYear()),this.handleSearch()},handleFilterChange(e=!1){if(e){const t=d.getValue("filter-cal-year")?parseInt(d.getValue("filter-cal-year")):T.getFullYear(),n=d.getValue("filter-cal-month")?parseInt(d.getValue("filter-cal-month")):T.getMonth();T=new Date(t,n,1)}else{const t=d.getValue("filter-year")?parseInt(d.getValue("filter-year")):T.getFullYear(),n=d.getValue("filter-month")?parseInt(d.getValue("filter-month")):T.getMonth(),o=d.getValue("filter-day")?parseInt(d.getValue("filter-day")):T.getDate();T=new Date(t,n,o)}d.setValue("filter-month",T.getMonth()),d.setValue("filter-year",T.getFullYear()),this.handleSearch()},handleSearch(){const e=(d.getValue("accounts-search")||"").toLowerCase();let t=H.filter(n=>n.company_name.toLowerCase().includes(e)||n.description&&n.description.toLowerCase().includes(e));if(Ee==="list"){R=1;const n=d.getValue("filter-status")||"",o=document.getElementById("filter-date-toggle"),a=o?o.checked:!1,s=T.getFullYear(),r=T.getMonth(),i=T.getDate();t=t.filter(l=>{if(n&&l.status!==n)return!1;if(!a||!l.due_date)return!0;const[c,u,p]=l.due_date.split("-"),m=parseInt(c,10),f=parseInt(u,10)-1,y=parseInt(p,10);return l.type==="Único"?m===s&&f===r&&y===i:l.type==="Recorrente"?y===i:!0}),this.renderAccountsList(t)}else Ee==="notificacoes"?this.renderNotifications():Ee==="dashboard"?this.renderDashboard():Ee==="configuracoes"?this.renderCategoriesList():this.renderCalendarWrapper(t)},checkAccountAlerts(){let e=!1;const t=new Date;t.setHours(0,0,0,0),H.forEach(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a==="on"&&s==="pendente"&&o.due_date){const[r,i,l]=o.due_date.split("-");let c=new Date(parseInt(r,10),parseInt(i,10)-1,parseInt(l,10));c.setHours(0,0,0,0),c.getTime()<=t.getTime()&&(e=!0)}});const n=document.getElementById("icon-alert-bell");n&&(e?n.classList.add("alert-pulse"):n.classList.remove("alert-pulse"))},renderNotifications(){const e=document.getElementById("accounts-notifications-body");if(!e)return;e.innerHTML="";const t=new Date;t.setHours(0,0,0,0);let n=H.filter(o=>{const a=(o.status||"").trim().toLowerCase(),s=(o.payment_status||"").trim().toLowerCase();if(a!=="on"||s!=="pendente"||!o.due_date)return!1;const[r,i,l]=o.due_date.split("-");let c=new Date(parseInt(r,10),parseInt(i,10)-1,parseInt(l,10));return c.setHours(0,0,0,0),c.getTime()<=t.getTime()});if(n.length===0){e.innerHTML='<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta urgente ou atrasada.</td></tr>';return}n.forEach(o=>{const a=document.createElement("tr");let s="Sem Data";if(o.due_date){const i=o.due_date.split("-");i.length===3&&(s=`${i[2]}/${i[1]}/${i[0]}`)}const r=L.isAdmin()?`
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
                        ${r}
                    </div>
                </td>
            `,e.appendChild(a)})},renderAccountsList(e){const t=document.getElementById("accounts-table-body");if(!t)return;t.innerHTML="",this.renderSidebarMiniCalendar(),nt=e;const n=e.length,o=Math.ceil(n/oe);R>o&&(R=Math.max(1,o)),R<1&&(R=1);const a=(R-1)*oe,s=e.slice(a,a+oe);if(s.length===0){t.innerHTML='<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhuma conta encontrada.</td></tr>',this.renderPaginationControls("accounts-list-pagination",0,0),this.renderDashboard();return}s.forEach(r=>{const i=document.createElement("tr");let l="Sem Data";if(r.due_date){const p=r.due_date.split("-");p.length===3&&(l=`${p[2]}/${p[1]}/${p[0]}`)}const c=r.status==="Off",u=L.isAdmin()?`
                <button class="btn-icon" onclick="window.AccountsHandler.openAccountModal(${r.id})" title="Editar" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon" onclick="window.AccountsHandler.delete(${r.id})" title="Excluir" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            `:"";i.innerHTML=`
                <td>
                    <strong>${r.company_name}</strong>
                    <div style="margin-top: 4px;">
                        <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c4b5fd; font-size: 0.7rem; padding: 2px 6px;">
                            ${r.category||"Outros"}
                        </span>
                    </div>
                </td>
                <td>
                    <span class="badge" style="background:${r.type==="Recorrente"?"rgba(79, 70, 229, 0.2)":"rgba(234, 179, 8, 0.2)"}; color:${r.type==="Recorrente"?"#818cf8":"#eab308"}">
                        ${r.type}
                    </span>
                </td>
                <td>${l}</td>
                <td>
                    <strong>R$ ${parseFloat(r.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong>
                </td>
                <td>
                    <span class="badge" style="background:${c?"rgba(239, 68, 68, 0.2)":"rgba(34, 197, 94, 0.2)"}; color:${c?"#f87171":"#4ade80"}">
                        ${r.status}
                    </span>
                </td>
                <td>
                    <span class="badge" style="background:${r.payment_status==="Pago"?"rgba(34, 197, 94, 0.2)":r.payment_status==="Pendente"?"rgba(234, 179, 8, 0.2)":"rgba(239, 68, 68, 0.2)"}; color:${r.payment_status==="Pago"?"#4ade80":r.payment_status==="Pendente"?"#eab308":"#f87171"}">
                        ${r.payment_status||"Pendente"}
                    </span>
                </td>
                <td class="action-cell">
                    <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${r.id})" title="Abrir Ficha" style="padding: 4px; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        ${u}
                    </div>
                </td>
            `,t.appendChild(i)}),this.renderPaginationControls("accounts-list-pagination",o,n),this.renderDashboard()},renderDashboard(){if(Ee!=="dashboard")return;this.initDashboardMultiselects();const e=d.getValue("dash-filter-start"),t=d.getValue("dash-filter-end"),n=d.getValue("dash-filter-type")||"Todos",o=d.getValue("dash-filter-status")||"Todos",a=d.getValue("dash-filter-payment")||"Todos",s=this.getMultiselectValues("dash-filter-category"),r=this.getMultiselectValues("dash-filter-company");let i=e?new Date(e+"T00:00:00"):null,l=t?new Date(t+"T23:59:59"):null;if(!i&&!l){const E=new Date;i=new Date(E.getFullYear(),E.getMonth(),1,0,0,0),l=new Date(E.getFullYear(),E.getMonth()+1,0,23,59,59)}else i?l||(l=new Date(2100,11,31)):i=new Date(2e3,0,1);let c=0,u=0,p=new Set,m=new Set,f=0,y=0,h=0,g="-",v=0,w=0,x={},P={},D={};H.forEach(E=>{if(!E.due_date||n!=="Todos"&&E.type!==n||o!=="Todos"&&E.status!==o||a!=="Todos"&&E.payment_status!==a)return;if(!s.includes("Todos")){if(s.length===0)return;const B=E.category||"Outros";if(!s.includes(B))return}if(!r.includes("Todos")&&(r.length===0||!r.includes(E.company_name)))return;let N=0,U=new Date(i);U.setHours(0,0,0,0);let G=new Date(l);G.setHours(0,0,0,0);let Q=3650;for(;U<=G&&Q>0;){if(this.isEventOnDate(E,U.getFullYear(),U.getMonth(),U.getDate())){N++;const B=`${U.getFullYear()}-${String(U.getMonth()+1).padStart(2,"0")}`;D[B]||(D[B]={total:0,pago:0,pendente:0,fixo:0,variavel:0});const J=parseFloat(E.value||0);D[B].total+=J,E.payment_status==="Pago"&&(D[B].pago+=J),E.payment_status==="Pendente"&&(D[B].pendente+=J),E.type==="Recorrente"&&(D[B].fixo+=J),E.type==="Único"&&(D[B].variavel+=J)}U.setDate(U.getDate()+1),Q--}if(N>0){const B=parseFloat(E.value||0)*N;c+=B,u+=N,p.add(E.category||"Outros"),m.add(E.company_name),E.payment_status==="Pago"&&(f+=B),E.payment_status==="Pendente"&&(y+=B),E.type==="Recorrente"&&(v+=B),E.type==="Único"&&(w+=B),B>h&&(h=B,g=E.company_name);const J=E.category||"Outros";P[J]=(P[J]||0)+B;const Ce=E.company_name||"Sem Empresa";x[Ce]=(x[Ce]||0)+B}}),d.setText("dash-metric-valor","R$ "+c.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-contas",u.toString()),d.setText("dash-metric-tipos",p.size.toString()),d.setText("dash-metric-empresas",m.size.toString()),d.setText("dash-metric-pago","R$ "+f.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-pendente","R$ "+y.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-maior-valor","R$ "+h.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-maior-nome",g),d.setText("dash-metric-fixo","R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})),d.setText("dash-metric-variavel","R$ "+w.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));const $=d.getValue("dash-sort-empresas")||"desc",_=d.getValue("dash-sort-categorias")||"desc";this.renderTierList("dash-list-empresas",x,$),this.renderTierList("dash-list-categorias",P,_),this.renderTimeChart(D)},renderTimeChart(e){window.timeChartInstance&&window.timeChartInstance.destroy();const t=document.getElementById("chart-dashboard-time");if(!t)return;const n=Object.keys(e).sort(),o=n.map(u=>{const[p,m]=u.split("-");return`${m}/${p}`}),a=n.map(u=>e[u].total),s=n.map(u=>e[u].pago),r=n.map(u=>e[u].pendente),i=n.map(u=>e[u].fixo),l=n.map(u=>e[u].variavel),c={type:"line",data:{labels:o,datasets:[{label:"Valor Total (R$)",data:a,borderColor:"#3b82f6",backgroundColor:"rgba(59, 130, 246, 0.1)",borderWidth:2,pointBackgroundColor:"#3b82f6",pointRadius:4,fill:!0,tension:.3},{label:"Total Pago (R$)",data:s,borderColor:"#4ade80",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#4ade80",pointRadius:4,fill:!1,tension:.3},{label:"Total Pendente (R$)",data:r,borderColor:"#facc15",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#facc15",pointRadius:4,fill:!1,tension:.3},{label:"Custo Fixo (R$)",data:i,borderColor:"#60a5fa",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#60a5fa",pointRadius:4,fill:!1,tension:.3},{label:"Custo Variável (R$)",data:l,borderColor:"#c084fc",backgroundColor:"transparent",borderWidth:2,pointBackgroundColor:"#c084fc",pointRadius:4,fill:!1,tension:.3}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",labels:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-main").trim()||"#e2e8f0",usePointStyle:!0,boxWidth:8}},tooltip:{callbacks:{label:function(u){let p=u.dataset.label||"";return p&&(p+=": "),u.parsed.y!==null&&(p+=new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(u.parsed.y)),p}}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8",callback:function(u,p,m){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(u)}}},x:{grid:{color:"rgba(255, 255, 255, 0.05)",drawBorder:!1},ticks:{color:getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim()||"#94a3b8"}}}}};window.timeChartInstance=new Chart(t.getContext("2d"),c)},renderTierList(e,t,n){const o=document.getElementById(e);if(!o)return;const a=Object.entries(t);if(a.length===0){o.innerHTML='<div style="color: var(--text-muted); text-align: center; font-size: 0.9rem; padding: 10px;">Nenhum dado encontrado no período</div>';return}a.sort((i,l)=>n==="asc"?i[1]-l[1]:l[1]-i[1]);const s=a.slice(0,10);let r="";s.forEach(([i,l],c)=>{const u=c===0&&n==="desc",p=u?"🏆 ":c+1+". ";r+=`
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: var(--border-radius); border: 1px solid var(--glass-border);">
                    <div style="font-size: 0.9rem; font-weight: ${u?"bold":"normal"}; color: ${u?"#fbbf24":"var(--text-main)"}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 65%;" title="${i}">
                        ${p}${i}
                    </div>
                    <div style="font-size: 0.95rem; font-weight: bold; color: var(--text-main);">
                        R$ ${l.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </div>
                </div>
            `}),o.innerHTML=r},renderCharts(e){window.catChartInstance&&window.catChartInstance.destroy(),window.forecastChartInstance&&window.forecastChartInstance.destroy();const t=document.getElementById("chart-category");if(t){const o={labels:Object.keys(e),datasets:[{data:Object.values(e),backgroundColor:["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#64748b"],borderWidth:0}]};window.catChartInstance=new Chart(t.getContext("2d"),{type:"doughnut",data:o,options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{color:"#94a3b8"}}}}})}const n=document.getElementById("chart-forecast");if(n){const o=[],a=[];let s=new Date;for(let r=-5;r<=6;r++){let i=new Date(s.getFullYear(),s.getMonth()+r,1);o.push(i.toLocaleDateString("pt-BR",{month:"short",year:"2-digit"}));let l=0;H.forEach(c=>{if(!c.due_date||c.status==="Off")return;const[u,p]=c.due_date.split("-"),m=new Date(parseInt(u),parseInt(p)-1,1);(c.type==="Recorrente"&&i.getTime()>=m.getTime()||c.type==="Único"&&i.getFullYear()===parseInt(u)&&i.getMonth()===parseInt(p)-1)&&(l+=parseFloat(c.value||0))}),a.push(l)}window.forecastChartInstance=new Chart(n.getContext("2d"),{type:"bar",data:{labels:o,datasets:[{label:"Despesa Prevista",data:a,backgroundColor:"#4f46e5",borderRadius:4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(255,255,255,0.05)"}},x:{ticks:{color:"#94a3b8"},grid:{display:!1}}},plugins:{legend:{display:!1}}}})}},getLatestRecorrenteAccounts(e){const t={},n=[];return e.forEach(o=>{if(o.type==="Único")n.push(o);else if(!t[o.company_name])t[o.company_name]=o;else{const a=new Date(t[o.company_name].due_date||0);new Date(o.due_date||0)>a&&(t[o.company_name]=o)}}),[...n,...Object.values(t)]},isEventOnDate(e,t,n,o){if(!e.due_date)return!1;const[a,s,r]=e.due_date.split("-"),i=parseInt(a,10),l=parseInt(s,10)-1,c=parseInt(r,10);if(e.type==="Único")return t===i&&n===l&&o===c;if(e.type==="Recorrente"){const u=new Date(i,l,c).setHours(0,0,0,0);if(new Date(t,n,o).setHours(0,0,0,0)<u)return!1;const m=e.frequency||"1 mes";if(["1 mes","3 meses","6 meses","1 ano"].includes(m)){const f=(t-i)*12+(n-l),y=new Date(t,n+1,0).getDate(),h=Math.min(c,y);if(o!==h||f<0)return!1;if(m==="1 mes")return!0;if(m==="3 meses")return f%3===0;if(m==="6 meses")return f%6===0;if(m==="1 ano")return n===l}else{const f=Date.UTC(i,l,c),y=Date.UTC(t,n,o),h=Math.round((y-f)/(1e3*60*60*24));if(m==="1 dia")return!0;if(m==="7 dias")return h%7===0;if(m==="15 dias")return h%15===0}}return!1},renderCalendarWrapper(e){const t=T.getFullYear(),n=T.getMonth(),o=T.getDate();$e==="month"?this.renderCalendarMonth(e,t,n):$e==="year"?this.renderCalendarYear(e,t):$e==="day"&&this.renderCalendarDay(e,t,n,o),this.renderSidebarMiniCalendar()},renderSidebarMiniCalendar(){const e=[document.getElementById("sidebar-mini-calendar"),document.getElementById("sidebar-mini-calendar-list")],t=T.getFullYear(),n=T.getMonth(),o=T.getDate(),a=new Date(t,n,1).getDay(),s=new Date(t,n+1,0).getDate(),r=new Date,i=r.getFullYear(),l=r.getMonth(),c=r.getDate(),u=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];let p="";u.forEach((y,h)=>{p+=`<option value="${h}" ${h===n?"selected":""}>${y}</option>`});let m="";for(let y=i-5;y<=i+5;y++)m+=`<option value="${y}" ${y===t?"selected":""}>${y}</option>`;let f=`
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.parentElement.children[1].value, this.value)">
                    ${p}
                </select>
                <select class="form-control glass" style="flex: 1; padding: 4px; font-size: 0.8rem;" onchange="window.AccountsHandler.changeMiniCalendarMonthYear(this.value, this.parentElement.children[0].value)">
                    ${m}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <button class="btn-primary" style="width: 100%; padding: 4px 0; justify-content: center; font-size: 0.85rem;" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${i}, ${l}, ${c})">Hoje</button>
            </div>
            <div class="smc-header">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div class="smc-grid">
        `;for(let y=0;y<a;y++)f+='<div class="smc-day empty"></div>';for(let y=1;y<=s;y++)f+=`<div class="smc-day ${y===o?"active":""}" onclick="window.AccountsHandler.selectDateFromMiniCalendar(${t}, ${n}, ${y})">${y}</div>`;f+="</div>",e.forEach(y=>{y&&(y.innerHTML=f)})},changeMiniCalendarMonthYear(e,t){let n=T.getDate();const o=new Date(e,parseInt(t)+1,0).getDate();n>o&&(n=o),T=new Date(e,t,n);try{d.setValue("filter-cal-year",e),d.setValue("filter-cal-month",t)}catch{}this.handleSearch(),this.renderSidebarMiniCalendar()},selectDateFromMiniCalendar(e,t,n){T=new Date(e,t,n);try{d.setValue("filter-cal-year",e),d.setValue("filter-cal-month",t)}catch{}if(Ee==="calendar"){const o=document.getElementById("toggle-accounts-cal-day");o&&o.click()}else this.handleSearch(),this.renderSidebarMiniCalendar()},renderCalendarMonth(e,t,n){const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];d.setText("calendar-date-display",`${o[n]} ${t}`);const a=document.getElementById("calendar-month-grid");a.innerHTML="";const s=new Date(t,n,1).getDay(),r=new Date(t,n+1,0).getDate(),i=new Date,l=i.getFullYear()===t&&i.getMonth()===n;new Date(i.getFullYear(),i.getMonth(),1);for(let u=0;u<s;u++)a.innerHTML+='<div class="calendar-day empty"></div>';for(let u=1;u<=r;u++){const p=l&&i.getDate()===u?"today":"";a.innerHTML+=`<div class="calendar-day ${p}" id="cal-day-cell-${u}">
                <div class="calendar-date">${u}</div>
                <div class="calendar-events" id="cal-events-${u}"></div>
            </div>`}this.getLatestRecorrenteAccounts(e).forEach(u=>{if(!u.due_date)return;const p=new Date(t,n,1),m=new Date(i.getFullYear(),i.getMonth(),1);let f=!0;if(u.status==="Off"&&p.getTime()>=m.getTime()&&(f=!1),!!f){for(let y=1;y<=r;y++)if(this.isEventOnDate(u,t,n,y)){const h=document.getElementById(`cal-events-${y}`);if(h){const g=`${t}-${String(n+1).padStart(2,"0")}-${String(y).padStart(2,"0")}`;let v=u.payment_status==="Pago"?"event-paid":u.payment_status==="Pendente"?"event-pending":"event-canceled",w=u.id;if(u.type==="Recorrente"&&g!==u.due_date){const P=H.find(D=>D.company_name===u.company_name&&D.due_date===g);P?(v=P.payment_status==="Pago"?"event-paid":P.payment_status==="Pendente"?"event-pending":"event-canceled",w=P.id):v="event-pending"}const x=document.createElement("div");x.className=`event-pill event-${u.type.toLowerCase()} ${v}`,x.title=u.company_name,x.innerText=u.company_name,x.onclick=P=>{this.openDedicatedPage(w,g)},h.appendChild(x)}}}})},renderCalendarDay(e,t,n,o){const a=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];d.setText("calendar-date-display",`${String(o).padStart(2,"0")} de ${a[n]} de ${t}`);const s=document.getElementById("calendar-day-list");s.innerHTML="";const r=new Date(t,n,o),i=new Date;i.setHours(0,0,0,0),r.setHours(0,0,0,0);let l=0;this.getLatestRecorrenteAccounts(e).forEach(u=>{let p=!0;if(u.status==="Off"&&r.getTime()>=i.getTime()&&(p=!1),!!p&&this.isEventOnDate(u,t,n,o)){l++;const m=`${t}-${String(n+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`;let f=u.payment_status==="Pago"?"#4ade80":u.payment_status==="Pendente"?"#facc15":"#ef4444",y=u.id;if(u.payment_status,u.type==="Recorrente"&&m!==u.due_date){const h=H.find(g=>g.company_name===u.company_name&&g.due_date===m);h?(f=h.payment_status==="Pago"?"#4ade80":h.payment_status==="Pendente"?"#facc15":"#ef4444",y=h.id,h.payment_status):f="#facc15"}s.innerHTML+=`
                    <div class="day-event-row ${u.type.toLowerCase()}">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${f}; margin-top: 5px;"></div>
                        <div class="day-evt-info">
                            <h4>${u.company_name} <span style="font-size:0.8rem; font-weight:normal; opacity:0.8">(${u.type} - ${u.category||"Outros"})</span></h4>
                            <p style="font-weight: bold; color: var(--text-main); margin: 4px 0;">R$ ${parseFloat(u.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
                            <p>${u.description||"Nenhuma descrição detalhada."}</p>
                        </div>
                        <button class="btn-icon" onclick="window.AccountsHandler.openDedicatedPage(${y}, '${m}')" title="Detalhes">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                `}}),l===0&&(s.innerHTML='<div style="text-align:center; padding: 40px; color: var(--text-muted);"><p>Nenhuma conta registrada para este dia.</p></div>')},renderCalendarYear(e,t){d.setText("calendar-date-display",`Ano de ${t}`);const n=document.getElementById("calendar-year-grid");n.innerHTML="";const o=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],a=new Date(new Date().getFullYear(),new Date().getMonth(),1);for(let s=0;s<12;s++){const r=new Date(t,s,1);let i=0,l=0,c=0;this.getLatestRecorrenteAccounts(e).forEach(m=>{let f=!0;if(m.status==="Off"&&r.getTime()>=a.getTime()&&(f=!1),!f)return;const y=new Date(t,s+1,0).getDate();for(let h=1;h<=y;h++)this.isEventOnDate(m,t,s,h)&&(i++,m.type==="Recorrente"?l++:c++)});const p=i>0?"background: rgba(34, 211, 238, 0.05); border-color: rgba(34, 211, 238, 0.3);":"";n.innerHTML+=`
               <div class="year-month-card" style="${p}" onclick="window.AccountsHandler.jumpToMonthFromYear(${s})">
                   <div class="year-month-title">${o[s]}</div>
                   <div class="year-month-stats">
                       <p style="margin: 0 0 5px 0;">Total: <strong>${i}</strong></p>
                       ${i>0?`<p style="margin: 0; font-size: 0.75rem; color: #818cf8;">Recorrentes: ${l}</p>`:""}
                       ${i>0?`<p style="margin: 0; font-size: 0.75rem; color: #eab308;">Únicas: ${c}</p>`:""}
                   </div>
               </div>
            `}},jumpToMonthFromYear(e){T.setMonth(e),d.setValue("filter-month",e),document.getElementById("toggle-accounts-cal-month").click()},openAccountModal(e=null){document.getElementById("account-form").reset(),this.populateCategoryModalSelect();const t=document.getElementById("account-type");if(t.onchange=()=>{t.value==="Recorrente"?d.show("account-frequency-group"):d.hide("account-frequency-group")},e){d.setText("account-modal-title","Editar Conta");const n=H.find(o=>o.id===e);n&&(d.setValue("account-id",n.id),d.setValue("account-company",n.company_name),d.setValue("account-type",n.type),d.setValue("account-category",n.category||"Outros"),d.setValue("account-frequency",n.frequency||"1 mes"),d.setValue("account-value",parseFloat(n.value||0).toFixed(2)),d.setValue("account-status",n.status),d.setValue("account-payment-status",n.payment_status||"Pendente"),d.setValue("account-due-date",n.due_date||""),d.setValue("account-description",n.description||""),d.setValue("account-observation",n.observation||""),t.onchange())}else d.setText("account-modal-title","Nova Conta"),d.setValue("account-id",""),t.onchange();d.show("account-modal-form")},openDedicatedPage(e,t=null){const n=H.find(m=>m.id===e);if(!n)return;let o=H.filter(m=>m.company_name===n.company_name);o=this.injectCurrentMonthProjections(o),this.currentCompanyHistory=o.sort((m,f)=>new Date(f.due_date||0)-new Date(m.due_date||0)),d.hide("accounts-section"),d.show("dedicated-account-page"),d.setText("ded-acc-company",n.company_name);let a=0,s=0,r=0;const i=new Date;i.setHours(0,0,0,0),this.currentCompanyHistory.forEach(m=>{const f=parseFloat(m.value||0);if(m.payment_status==="Pago")a+=f,r++;else if(m.payment_status==="Pendente"&&m.due_date){const[y,h,g]=m.due_date.split("-"),v=new Date(parseInt(y,10),parseInt(h,10)-1,parseInt(g,10));v.setHours(0,0,0,0),v.getTime()<i.getTime()&&(s+=f)}});const l=a.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}),c=s.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});d.setText("ded-acc-total-paid","R$ "+l),d.setText("ded-acc-total-pending","R$ "+c),d.setText("ded-acc-total-count",r.toString());const u=document.getElementById("ded-acc-status-badge");n.status==="On"?u.innerHTML='<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">Ativa</span>':u.innerHTML='<span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171;">Inativa</span>',this.renderDedicatedHistoryList(),this.selectHistoryItem(n.id,t);const p=document.getElementById("btn-ded-add-history");p&&(p.onclick=()=>{this.openAccountModal(),setTimeout(()=>{d.setValue("account-company",n.company_name),d.setValue("account-type",n.type),d.setValue("account-category",n.category)},100)},L.isAdmin()||(p.style.display="none"))},injectCurrentMonthProjections(e){const t=new Date;let n=null;if(e.forEach(s=>{s.type==="Recorrente"&&(n?new Date(s.due_date||0)>new Date(n.due_date||0)&&(n=s):n=s)}),!n)return e;const o=[...e],a=new Set(e.map(s=>s.due_date));for(let s=0;s<3;s++){const r=new Date(t.getFullYear(),t.getMonth()+s,1),i=r.getFullYear(),l=r.getMonth(),c=new Date(i,l+1,0).getDate();for(let u=1;u<=c;u++)if(this.isEventOnDate(n,i,l,u)){const p=`${i}-${String(l+1).padStart(2,"0")}-${String(u).padStart(2,"0")}`;a.has(p)||(o.push({...n,is_projection:!0,due_date:p,payment_status:"Pendente",unique_key:n.id+"_"+p}),a.add(p))}}return o.forEach(s=>{s.unique_key||(s.unique_key=s.id.toString())}),o},renderDedicatedHistoryList(){const e=document.getElementById("ded-acc-history-list");if(e){if(e.innerHTML="",!this.currentCompanyHistory||this.currentCompanyHistory.length===0){e.innerHTML='<div class="text-center" style="color: var(--text-muted); padding: 20px;">Nenhum histórico encontrado.</div>';return}this.currentCompanyHistory.forEach(t=>{let n="Sem Data";if(t.due_date){const r=t.due_date.split("-");r.length===3&&(n=`${r[2]}/${r[1]}/${r[0]}`)}const o=parseFloat(t.value||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});let a="#eab308";t.payment_status==="Pago"?a="#4ade80":t.payment_status==="Cancelado"&&(a="#f87171");const s=document.createElement("div");s.className="glass history-item-card",s.style.cssText="padding: 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; display: flex; align-items: center; justify-content: space-between;",s.onmouseover=()=>s.style.background="rgba(255,255,255,0.05)",s.onmouseout=()=>{this.currentSelectedHistoryKey!==t.unique_key&&(s.style.background="var(--glass-bg)")},this.currentSelectedHistoryKey===t.unique_key&&(s.style.background="rgba(255,255,255,0.1)",s.style.borderColor="var(--accent)"),s.onclick=()=>this.selectHistoryItem(t.id,t.is_projection?t.due_date:null),s.innerHTML=`
                <div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-main);">R$ ${o}</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Venc: ${n}</div>
                </div>
                <div>
                    <span class="badge" style="background: ${a}22; color: ${a}; font-size: 0.75rem;">${t.payment_status||"Pendente"}</span>
                </div>
            `,e.appendChild(s)})}},selectHistoryItem(e,t=null){this.currentSelectedHistoryKey=t?e+"_"+t:e.toString(),this.renderDedicatedHistoryList();let n=null;if(t&&(n=this.currentCompanyHistory.find(i=>i.id===e&&i.due_date===t&&i.is_projection)),n||(n=this.currentCompanyHistory.find(i=>i.id===e&&!i.is_projection)),document.getElementById("ded-acc-details-empty"),document.getElementById("ded-acc-details-content"),!n){d.show("ded-acc-details-empty"),d.hide("ded-acc-details-content");return}d.hide("ded-acc-details-empty"),d.show("ded-acc-details-content");let o="DD/MM/YYYY";const a=t||n.due_date;if(a){const i=a.split("-");i.length===3&&(o=`${i[2]}/${i[1]}/${i[0]}`)}d.setText("ded-acc-det-date",o),d.setValue("ded-acc-det-val-input",parseFloat(n.value||0).toFixed(2)),d.setValue("ded-acc-det-date-input",a||""),d.setValue("ded-acc-det-status-input",n.payment_status||"Pendente"),d.setValue("ded-acc-det-account-status-input",n.status||"On"),d.setValue("ded-acc-det-obs-input",n.observation||""),n.type==="Recorrente"?(d.show("ded-acc-det-freq-group"),d.setValue("ded-acc-det-freq-input",n.frequency||"1 mes")):d.hide("ded-acc-det-freq-group");const s=document.getElementById("btn-ded-save-details");s&&(s.onclick=async()=>{const i={company_name:n.company_name,type:n.type,category:n.category,description:n.description,value:d.getValue("ded-acc-det-val-input"),due_date:d.getValue("ded-acc-det-date-input"),payment_status:d.getValue("ded-acc-det-status-input"),status:d.getValue("ded-acc-det-account-status-input"),observation:d.getValue("ded-acc-det-obs-input"),frequency:n.type==="Recorrente"?d.getValue("ded-acc-det-freq-input"):"1 mes"};try{let l=n.id;n.is_projection?(l=(await b.post("/accounts",i)).id,alert("Fatura materializada e salva com sucesso!")):(await b.put(`/accounts/${n.id}`,i),alert("Fatura atualizada com sucesso!")),await this.fetch(),this.currentCompanyHistory=H.filter(c=>c.company_name===n.company_name).sort((c,u)=>new Date(u.due_date||0)-new Date(c.due_date||0)),this.openDedicatedPage(l)}catch{alert("Erro ao salvar fatura.")}},L.isAdmin()||(s.style.display="none"));const r=document.getElementById("btn-ded-delete-account");r&&(r.onclick=async()=>{if(confirm("Atenção: Tem certeza que deseja excluir DESTA fatura mensal especificamente?"))try{await b.delete(`/accounts/${n.id}`),await this.fetch();const i=H.filter(l=>l.company_name===n.company_name);i.length>0?this.openDedicatedPage(i[0].id):document.getElementById("btn-back-to-accounts").click()}catch{alert("Erro ao excluir fatura")}},L.isAdmin()||(r.style.display="none")),this.renderAttachmentArea(n)},renderAttachmentArea(e){document.getElementById("ded-acc-file-input");const t=document.getElementById("ded-acc-upload-area");if(document.getElementById("ded-acc-preview-area"),e.attachment_path){d.hide("ded-acc-upload-area"),d.show("ded-acc-preview-area");const n=e.attachment_path.match(/\.(jpeg|jpg|gif|png)$/)!=null,o=document.getElementById("ded-acc-preview-thumb"),a=e.attachment_path.split("/").pop()||"documento";d.setText("ded-acc-preview-name",a);const s=document.getElementById("ded-acc-preview-link");s.href="javascript:void(0)",s.onclick=async i=>{i.preventDefault();const l=s.innerText;s.innerText="Carregando...";try{const c=await fetch(e.attachment_path);if(!c.ok)throw new Error("Doc não encontrado");const u=await c.blob(),p=window.URL.createObjectURL(u);window.open(p,"_blank")}catch(c){alert("Erro ao visualizar documento. O arquivo pode ter sido movido ou o proxy falhou."),console.error("Blob fetch error:",c)}finally{s.innerText=l}},n?(o.innerHTML="",o.style.backgroundImage=`url('${e.attachment_path}')`):(o.style.backgroundImage="none",o.innerHTML=`
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.5" fill="none" class="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                `);const r=document.getElementById("btn-ded-remove-attachment");r.onclick=async()=>{if(confirm("Remover o anexo desta fatura? (O arquivo fisicamente não será deletado até limpeza de storage, mas a referência sumirá)"))try{await b.put(`/accounts/${e.id}`,{...e,attachment_path:null}),await this.fetch(),this.currentCompanyHistory=H.filter(i=>i.company_name===e.company_name).sort((i,l)=>new Date(l.due_date||0)-new Date(i.due_date||0)),this.selectHistoryItem(e.id)}catch{alert("Erro ao remover anexo")}},L.isAdmin()||(r.style.display="none")}else{if(d.show("ded-acc-upload-area"),d.hide("ded-acc-preview-area"),L.isAdmin())t.innerHTML=`
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="var(--text-muted)" stroke-width="1.5" fill="none" style="margin-bottom: 10px;">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p style="margin: 0; color: var(--text-main); font-size: 0.95rem;">Clique para anexar arquivo</p>
                    <p style="margin: 5px 0 0 0; color: var(--text-muted); font-size: 0.8rem;">PDF ou Imagem (Máx 10MB)</p>
                    <input type="file" id="ded-acc-file-input" style="display: none;" accept=".pdf,image/*">
               `,t.style.cursor="pointer";else{t.innerHTML='<p style="color:var(--text-muted); font-size:0.9rem;">Nenhum anexo disponível.</p>',t.style.cursor="default";return}t.onclick=s=>{const r=document.getElementById("ded-acc-file-input");r&&s.target!==r&&r.click()},t.addEventListener("dragover",s=>{s.preventDefault(),t.style.borderColor="var(--accent)",t.style.background="rgba(255, 255, 255, 0.05)"});const n=()=>{t.style.borderColor="rgba(255,255,255,0.2)",t.style.background="rgba(0,0,0,0.1)"};t.addEventListener("dragleave",()=>{n()});const o=async s=>{if(!s)return;t.innerHTML='<p style="color:var(--accent);">Fazendo upload...</p>';const r=new FormData;r.append("file",s);try{const i=await fetch("/api/upload",{method:"POST",body:r}),l=await i.json();i.ok?(await b.put(`/accounts/${e.id}`,{...e,attachment_path:l.path}),await this.fetch(),this.currentCompanyHistory=H.filter(c=>c.company_name===e.company_name).sort((c,u)=>new Date(u.due_date||0)-new Date(c.due_date||0)),this.selectHistoryItem(e.id)):(alert(l.error||"Erro no upload"),this.selectHistoryItem(e.id))}catch(i){alert("Falha na comunicação: "+i.message),console.error("Upload Error:",i),this.selectHistoryItem(e.id)}};t.addEventListener("drop",async s=>{if(s.preventDefault(),n(),s.dataTransfer.files.length>0){const r=s.dataTransfer.files[0];await o(r)}});const a=document.getElementById("ded-acc-file-input");a&&(a.onclick=s=>{s.stopPropagation()},a.onchange=async s=>{const r=s.target.files[0];await o(r)})}},async save(e){e.preventDefault();const t=d.getValue("account-id"),n={company_name:d.getValue("account-company"),type:d.getValue("account-type"),category:d.getValue("account-category"),value:d.getValue("account-value"),status:d.getValue("account-status"),payment_status:d.getValue("account-payment-status"),due_date:d.getValue("account-due-date"),description:d.getValue("account-description"),observation:d.getValue("account-observation"),frequency:d.getValue("account-type")==="Recorrente"?d.getValue("account-frequency"):"1 mes"};try{const o=t?`/accounts/${t}`:"/accounts";t?await b.put(o,n):await b.post(o,n),d.hide("account-modal-form"),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao salvar conta.")}},async delete(e){if(confirm("Tem certeza que deseja excluir esta conta? Isso não pode ser desfeito."))try{await b.delete(`/accounts/${e}`),this.fetch(),this.checkAccountAlerts()}catch{alert("Erro ao excluir conta.")}},setPageSize(e){oe=e,R=1,this.renderAccountsList(nt)},changePage(e){R=e,this.renderAccountsList(nt)},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a=`
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.AccountsHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${oe===10?"selected":""}>10</option>
                    <option value="25" ${oe===25?"selected":""}>25</option>
                    <option value="50" ${oe===50?"selected":""}>50</option>
                    <option value="100" ${oe===100?"selected":""}>100</option>
                </select>
            </div>
        `;a+=`
            <button class="pagination-btn" 
                    ${R===1?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${R-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=R-1&&l<=R+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===R?"active":""}" 
                            onclick="window.AccountsHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${R===t?"disabled":""} 
                    onclick="window.AccountsHandler.changePage(${R+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const r=(R-1)*oe+1,i=Math.min(R*oe,n);a+=`
            <span class="pagination-info">
                Exibindo ${r}-${i} de ${n}
            </span>
        `,o.innerHTML=a}};let Le=[],Z={},ye=null,ot=null,at=null,it=!1,Pe=!1,Fe=!1,Y=[],Ke=[],ut={},ie={},Se,gt,We,Xe,Ct,Ze;const ft={init(){Se=document.getElementById("timeline-event-form"),gt=document.getElementById("view-visualizacao"),We=document.getElementById("view-attention"),Xe=document.getElementById("view-anexo"),Ct=document.getElementById("view-relatorio"),Ze=document.getElementById("view-config"),window.timelineHandler=ft,window.applyFilters=zt,window.clearFilters=Vt,window.toggleFilters=Nt,window.handleDelete=qt,window.resetForm=vt,window.toggleAccordion=St,window.handleFormSubmit=kt,window.editEvent=yt,window.deleteTopic=Gt,window.deleteSubtopic=Qt,window.handleTrackDragStart=Jt,window.handleTrackDragOver=Kt,window.handleTrackDragEnd=Wt;const e=document.getElementById("timeline-topic-form");e&&(e.onsubmit=Ut);const t=document.getElementById("timeline-subtopic-form");t&&(t.onsubmit=Yt);const n=document.getElementById("topico");n&&(n.onchange=c=>{ht(c.target.value)});const o=document.getElementById("em-ocorrencia");o&&(o.onchange=c=>{const u=document.getElementById("fim"),p=document.getElementById("inicio");if(c.target.checked){if(!p.value){const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),p.value=m.toISOString().slice(0,16)}u.required=!1}else{const m=new Date;m.setMinutes(m.getMinutes()-m.getTimezoneOffset()),u.value=m.toISOString().slice(0,16),u.required=!0}});const a=document.getElementById("auto-refresh-toggle");a&&(a.onchange=c=>{Bt(c.target.checked)}),document.querySelectorAll("[data-timeline-tab]").forEach(c=>{c.onclick=u=>{const p=u.currentTarget.getAttribute("data-timeline-tab");je(p)}}),Se&&(Se.onsubmit=kt);const s=document.getElementById("rep-filter-start"),r=document.getElementById("rep-filter-end"),i=document.getElementById("rep-filter-topic"),l=document.getElementById("rep-filter-subtopic");s&&(s.onchange=()=>Ve()),r&&(r.onchange=()=>Ve()),i&&(i.onchange=c=>{jt(c.target.value),Ve()}),l&&(l.onchange=()=>Ve()),window._timelineSectionChangeHandler&&window.removeEventListener("SectionChange",window._timelineSectionChangeHandler),window._timelineSectionChangeHandler=c=>{c.detail&&c.detail.section==="timeline"&&ve().then(()=>{se(),st()})},window.addEventListener("SectionChange",window._timelineSectionChangeHandler),ve().then(()=>{se(),st()})},fetch(){return ve().then(()=>{se(),st()})}};window._timelineFocusHandler&&window.removeEventListener("focus",window._timelineFocusHandler);window._timelineFocusHandler=()=>{gt&&se()};window.addEventListener("focus",window._timelineFocusHandler);function ht(e,t=null){const n=document.getElementById("sub-topico");if(!n)return;const o=e?e.toLowerCase().trim():"";if(!o||!ie[o]){n.innerHTML='<option value="">Selecione o tópico primeiro...</option>',n.classList.remove("has-options");return}n.innerHTML='<option value="" disabled selected>Escolha o evento...</option>',ie[o].forEach(a=>{const s=document.createElement("option");s.value=a.toLowerCase(),s.textContent=a,t&&s.value===t.toLowerCase()&&(s.selected=!0),n.appendChild(s)}),t||(n.selectedIndex=1),n.classList.add("has-options")}async function ve(){try{const e=await fetch("/api/timeline/config");if(!e.ok)throw new Error("Falha ao buscar configurações");const t=await e.json();Y=t.topics||[],Ke=t.subtopics||[],ut={},ie={},Y.forEach(o=>{ut[o.id]=o.color,ie[o.id]=[]}),Ke.forEach(o=>{const a=o.topic_id;ie[a]&&ie[a].push(o.name)}),Ft();const n=document.getElementById("view-config");n&&n.classList.contains("active")&&Dt()}catch(e){console.error("Error loading config:",e)}}function Ft(){const e=document.getElementById("topico");if(e){const o=e.value;e.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',Y.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,e.appendChild(s)}),e.value=o}const t=document.getElementById("rep-filter-topic");if(t){const o=t.value;t.innerHTML='<option value="Todos">Todos</option>',Y.forEach(a=>{const s=document.createElement("option");s.value=a.id,s.textContent=a.name,t.appendChild(s)}),o&&[...t.options].some(a=>a.value===o)?t.value=o:t.value="Todos"}const n=document.getElementById("subtopic-topic-id");n&&(n.innerHTML='<option value="" disabled selected>Selecione um tópico...</option>',Y.forEach(o=>{const a=document.createElement("option");a.value=o.id,a.textContent=o.name,n.appendChild(a)}))}function se(){fetch("/api/timeline/events").then(e=>{if(!e.ok)throw new Error("Failed to fetch");return e.json()}).then(e=>{Le=e,bt(),We&&We.classList.contains("active")&&Mt()}).catch(e=>{console.error("Error loading events:",e)})}function st(){const e=document.getElementById("timeline-tab-anexo"),t=document.getElementById("timeline-tab-config");if(window.auth&&window.auth.isAdmin())e&&e.classList.remove("role-hidden"),t&&t.classList.remove("role-hidden");else{e&&e.classList.add("role-hidden"),t&&t.classList.add("role-hidden");const o=Xe&&Xe.classList.contains("active"),a=Ze&&Ze.classList.contains("active");(o||a)&&je("visualizacao")}}function je(e){const t={visualizacao:{section:gt,button:document.querySelector('[data-timeline-tab="visualizacao"]')},attention:{section:We,button:document.querySelector('[data-timeline-tab="attention"]')},anexo:{section:Xe,button:document.querySelector('[data-timeline-tab="anexo"]')},relatorio:{section:Ct,button:document.querySelector('[data-timeline-tab="relatorio"]')},config:{section:Ze,button:document.querySelector('[data-timeline-tab="config"]')}};Object.values(t).forEach(n=>{n.section&&n.section.classList.remove("active"),n.button&&n.button.classList.remove("active")}),t[e]&&(t[e].section&&t[e].section.classList.add("active"),t[e].button&&t[e].button.classList.add("active")),e==="visualizacao"?(se(),qe(!0)):e==="attention"?(Mt(),qe(!0)):e==="relatorio"?(Ve(),qe(!1)):(e==="config"&&Dt(),qe(!1))}function qe(e){const t=document.getElementById("floating-refresh-control");if(t)if(e){t.classList.remove("hidden");const n=document.getElementById("auto-refresh-toggle");n&&n.checked&&!ye&&Bt(!0)}else t.classList.add("hidden"),ye&&(clearInterval(ye),ye=null)}function Bt(e){ye&&(clearInterval(ye),ye=null),e&&(se(),ye=setInterval(se,6e4))}function kt(e){if(e.preventDefault(),it){console.warn("[Timeline] O salvamento já está em andamento. Ignorando envio duplicado.");return}it=!0;const t=Se.querySelector('button[type="submit"]');t&&(t.textContent="Salvando...",t.disabled=!0);const o={id:document.getElementById("event-id").value||Date.now().toString(),nome:document.getElementById("nome").value,topico:document.getElementById("topico").value,sub_topico:document.getElementById("sub-topico").value,em_ocorrencia:document.getElementById("em-ocorrencia").checked?1:0,inicio:document.getElementById("inicio").value,fim:document.getElementById("fim").value,descricao:document.getElementById("descricao").value,anotacao:document.getElementById("anotacao").value,cor:document.getElementById("cor").value};fetch("/api/timeline/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(async a=>{const s=await a.text();if(!a.ok)throw new Error(`Server error (${a.status}): ${s}`);return JSON.parse(s)}).then(()=>{alert("Evento salvo com sucesso!"),vt(),je("visualizacao")}).catch(a=>{console.error("Error saving event:",a),alert("Erro ao salvar evento: "+a.message)}).finally(()=>{t&&(t.textContent="Salvar Evento",t.disabled=!1),it=!1})}function yt(e){const t=Le.find(s=>s.id===e);if(!t)return;document.getElementById("event-id").value=t.id,document.getElementById("nome").value=t.nome;const n=Ne(t.topico);document.getElementById("topico").value=n,ht(n,t.sub_topico);const o=document.getElementById("em-ocorrencia");o.checked=t.em_ocorrencia==1||t.em_ocorrencia==="true"||!t.fim,o.dispatchEvent(new Event("change")),document.getElementById("inicio").value=t.inicio,document.getElementById("fim").value=t.fim||"",document.getElementById("descricao").value=t.descricao||"",document.getElementById("anotacao").value=t.anotacao||"",document.getElementById("cor").value=t.cor||"#000000",je("anexo");const a=document.getElementById("btn-delete");a&&(a.style.display="block")}function vt(){Se&&Se.reset();const e=document.getElementById("event-id");e&&(e.value=""),ht("");const t=document.getElementById("fim");t&&(t.required=!0);const n=document.getElementById("cor");n&&(n.value="#000000");const o=document.getElementById("btn-delete");o&&(o.style.display="none")}function qt(){const e=document.getElementById("event-id").value;e&&confirm("Tem certeza que deseja excluir este evento?")&&fetch(`/api/timeline/events/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Failed to delete");return t.json()}).then(()=>{alert("Evento excluído!"),vt(),je("visualizacao")}).catch(t=>{console.error("Error deleting:",t),alert("Erro ao excluir: "+t.message)})}function zt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`),a=t&&t.value?new Date(t.value).getTime():null,s=n&&n.value?new Date(n.value).getTime():null,r=o?o.value:"";Z[e]={start:a,end:s,subTopic:r},bt()}function Vt(e){const t=document.getElementById(`filter-start-${e}`),n=document.getElementById(`filter-end-${e}`),o=document.getElementById(`filter-sub-topic-${e}`);t&&(t.value=""),n&&(n.value=""),o&&(o.value=""),Z[e]=null,bt()}function Nt(e){const t=document.getElementById(`filters-panel-${e}`),n=document.getElementById(`btn-toggle-${e}`);t&&n&&(t.classList.toggle("hidden"),n.classList.toggle("active"))}function St(e){const t=document.getElementById(e);t&&t.classList.toggle("active")}function bt(){const e=document.getElementById("timeline-tracks-container");if(!e)return;const t=Array.from(e.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId),n=Y.map(a=>a.id);if(t.length!==n.length||!n.every(a=>t.includes(a))){e.innerHTML="";const a=window.auth&&window.auth.isAdmin(),s=a?'style="cursor: grab;"':"";Y.forEach(r=>{const i=`
                <div class="timeline-container" data-topic-id="${r.id}" draggable="false"
                     ondragstart="window.handleTrackDragStart(event, '${r.id}')"
                     ondragover="window.handleTrackDragOver(event)"
                     ondragend="window.handleTrackDragEnd(event)">
                    <div class="topic-header" ${s}
                         ${a?`
                         onmousedown="this.closest('.timeline-container').setAttribute('draggable', 'true')"
                         onmouseup="this.closest('.timeline-container').setAttribute('draggable', 'false')"
                         onmouseleave="this.closest('.timeline-container').setAttribute('draggable', 'false')"`:""}>
                        <div class="topic-indicator" style="background-color: ${r.color};"></div>
                        <h2>${r.name}</h2>
                        <div class="sla-container">SLA: <span id="sla-${r.id}">100%</span></div>
                    </div>
                    <div class="timeline-filters-wrapper">
                        <button class="filters-toggle" onclick="toggleFilters('${r.id}')" id="btn-toggle-${r.id}">
                            <span class="hamburger-icon">☰</span>
                            <span>Filtros</span>
                            <span class="toggle-arrow">▼</span>
                        </button>
                        <div class="timeline-filters hidden" id="filters-panel-${r.id}">
                            <div class="filter-group">
                                <label for="filter-start-${r.id}">De:</label>
                                <input type="datetime-local" id="filter-start-${r.id}" min="2026-01-01T00:00" onchange="applyFilters('${r.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-end-${r.id}">Até:</label>
                                <input type="datetime-local" id="filter-end-${r.id}" min="2026-01-01T00:00" onchange="applyFilters('${r.id}')">
                            </div>
                            <div class="filter-group">
                                <label for="filter-sub-topic-${r.id}">Eventos:</label>
                                <select id="filter-sub-topic-${r.id}" onchange="applyFilters('${r.id}')">
                                    <option value="">Todos</option>
                                </select>
                            </div>
                            <button class="btn-clear-filter" onclick="clearFilters('${r.id}')" title="Limpar Filtro">×</button>
                        </div>
                    </div>
                    <div class="timeline-helper-dates">
                        <span id="min-date-${r.id}"></span>
                        <span id="max-date-${r.id}"></span>
                    </div>
                    <div class="timeline-track-container">
                        <div class="timeline-track" id="track-${r.id}"></div>
                    </div>
                </div>
            `;e.insertAdjacentHTML("beforeend",i);const l=document.getElementById(`filter-sub-topic-${r.id}`);l&&ie[r.id]&&ie[r.id].forEach(c=>{const u=document.createElement("option");u.value=c.toLowerCase(),u.textContent=c,l.appendChild(u)})})}Y.forEach(a=>{const s=document.getElementById(`track-${a.id}`),r=document.getElementById(`min-date-${a.id}`),i=document.getElementById(`max-date-${a.id}`);s&&(s.innerHTML=""),r&&(r.textContent=""),i&&(i.textContent="")}),Le.length!==0&&Y.forEach(a=>{const s=a.id,r=Le.filter(g=>Ne(g.topico)===s);let i=r;Z[s]&&Z[s].subTopic&&(i=r.filter(g=>(g.sub_topico?g.sub_topico.toLowerCase():"")===Z[s].subTopic.toLowerCase()));const l=Z[s]&&Z[s].start?Z[s].start:new Date("2026-01-01T00:00:00").getTime(),c=Z[s]&&Z[s].end?Z[s].end:Date.now();Rt(s,i,l,c);const u=l,p=c,m=p-u,f=document.getElementById(`min-date-${s}`),y=document.getElementById(`max-date-${s}`);f&&(f.textContent=new Date(u).toLocaleDateString()+" "+new Date(u).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),y&&(y.textContent=new Date(p).toLocaleDateString()+" "+new Date(p).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}));const h=document.getElementById(`track-${s}`);h&&i.forEach(g=>{const v=new Date(g.inicio).getTime(),w=g.fim?new Date(g.fim).getTime():Date.now();if(w<u||v>p)return;const x=Math.max(v,u),P=Math.min(w,p),D=(x-u)/m*100,$=(P-x)/m*100;if($<=0)return;const _=document.createElement("div");_.className="timeline-bar",_.style.left=`${D}%`,_.style.width=`${$}%`,_.style.color=g.cor&&g.cor!=="#000000"?g.cor:ut[s]||"#6b7280";const E=document.createElement("div");E.className="timeline-bar-visual",_.appendChild(E);const N=document.createElement("div");N.className="timeline-identifier-point";const U=new Date(g.inicio).toLocaleString([],{dateStyle:"short",timeStyle:"short"}),G=g.fim?new Date(g.fim).toLocaleString([],{dateStyle:"short",timeStyle:"short"}):"Em andamento",Q=a.name,B=g.sub_topico?g.sub_topico.charAt(0).toUpperCase()+g.sub_topico.slice(1):"-";N.setAttribute("data-tooltip",`Tópico: ${Q}
Eventos: ${B}
Início: ${U} - Fim: ${G}
Descrição: ${g.descricao||"-"}`),!g.fim&&N.classList.add("pulsing"),window.auth&&window.auth.isAdmin()?(N.style.cursor="pointer",N.onclick=Ce=>{Ce.stopPropagation(),yt(g.id)}):N.style.cursor="default",_.appendChild(N),h.appendChild(_)})})}function Ne(e){return e?e.toLowerCase().trim():""}function Rt(e,t,n,o){const a=document.getElementById(`sla-${e}`);if(!a)return;const s=o-n;if(s<=0){a.textContent="N/A";return}const i=t.filter(m=>{const f=new Date(m.inicio).getTime();return(m.fim?new Date(m.fim).getTime():Date.now())>n&&f<o}).map(m=>({start:Math.max(new Date(m.inicio).getTime(),n),end:Math.min(m.fim?new Date(m.fim).getTime():Date.now(),o)}));i.sort((m,f)=>m.start-f.start);const l=[];if(i.length>0){let m=i[0];for(let f=1;f<i.length;f++){const y=i[f];y.start<m.end?m.end=Math.max(m.end,y.end):(l.push(m),m=y)}l.push(m)}let c=0;l.forEach(m=>{c+=m.end-m.start});const u=(s-c)/s*100;let p="#10b981";u<50?p="#ef4444":u<90&&(p="#f97316"),a.style.color=p,a.textContent=u.toFixed(4)+"%"}function Mt(){const e=document.getElementById("attention-topics-container");if(!e)return;e.innerHTML="";const t=Le.filter(n=>!n.fim);Y.forEach(n=>{const o=n.id,a=t.filter(h=>Ne(h.topico)===o),s=document.createElement("div");s.className=a.length>0?"accordion-item active":"accordion-item",s.id=`attn-acc-${o}`;const r=document.createElement("div");r.className="accordion-header",r.onclick=()=>St(`attn-acc-${o}`);const i=document.createElement("div");i.className="accordion-title-group";const l=document.createElement("div");l.className="topic-indicator",l.style.backgroundColor=n.color;const c=document.createElement("h3");c.textContent=n.name;const u=document.createElement("span");u.style.cssText="background: #f1f5f9; padding: 2px 8px; border-radius: 12px; font-size: 0.95rem; font-weight: 900; color: #0f172a; margin-left: 0.5rem; border: 1px solid #cbd5e1;",u.textContent=`${a.length}`,i.appendChild(l),i.appendChild(c),i.appendChild(u);const p=document.createElement("span");p.className="accordion-chevron",p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>',r.appendChild(i),r.appendChild(p);const m=document.createElement("div");m.className="accordion-content";const f=document.createElement("div");f.className="accordion-body";const y=document.createElement("div");if(y.className="attention-carousel",a.length===0){const h=document.createElement("div");h.className="empty-state",h.textContent="Nenhum evento em andamento.",y.appendChild(h)}else a.forEach(h=>{const g=document.createElement("div");g.className="attention-card",g.style.borderLeftColor=h.cor&&h.cor!=="#000000"?h.cor:n.color;const v=document.createElement("h3");v.textContent=h.nome;const w=document.createElement("div");w.className="sub-topic",w.textContent=h.sub_topico||"-";const x=document.createElement("div");x.className="card-detail",x.innerHTML=`<strong>Início:</strong> ${new Date(h.inicio).toLocaleString()}`;const P=Date.now()-new Date(h.inicio).getTime(),D=document.createElement("div");D.className="card-duration",D.innerHTML=`<strong>Tempo:</strong> <span>${Ot(P)}</span>`;const $=document.createElement("div");$.className="card-description",$.textContent=h.descricao||"-",g.appendChild(v),g.appendChild(w),g.appendChild(x),g.appendChild(D),g.appendChild($),window.auth&&window.auth.isAdmin()?(g.style.cursor="pointer",g.onclick=()=>yt(h.id)):g.style.cursor="default",y.appendChild(g)});f.appendChild(y),m.appendChild(f),s.appendChild(r),s.appendChild(m),e.appendChild(s)})}function Ot(e){if(e<0)return"0s";const t=Math.floor(e/1e3),n=Math.floor(t/60),o=Math.floor(n/60),a=Math.floor(o/24),s=[];return a>0&&s.push(`${a}d`),(o%24>0||a>0)&&s.push(`${o%24}h`),(n%60>0||o>0)&&s.push(`${n%60}m`),s.push(`${t%60}s`),s.join(" ")}function jt(e){const t=document.getElementById("rep-filter-subtopic");if(!t)return;t.innerHTML='<option value="Todos">Todos</option>';const n=e?e.toLowerCase().trim():"";n&&ie[n]&&ie[n].forEach(o=>{const a=document.createElement("option");a.value=o.toLowerCase(),a.textContent=o,t.appendChild(a)})}function Ve(){let e=Le;const t=document.getElementById("rep-filter-start")?.value,n=document.getElementById("rep-filter-end")?.value,o=document.getElementById("rep-filter-topic")?.value,a=document.getElementById("rep-filter-subtopic")?.value;if(t){const $=new Date(t+"T00:00:00").getTime();e=e.filter(_=>new Date(_.inicio).getTime()>=$)}if(n){const $=new Date(n+"T23:59:59").getTime();e=e.filter(_=>new Date(_.inicio).getTime()<=$)}o&&o!=="Todos"&&(e=e.filter($=>Ne($.topico)===o.toLowerCase())),a&&a!=="Todos"&&(e=e.filter($=>$.sub_topico&&$.sub_topico.toLowerCase()===a.toLowerCase()));const s=document.getElementById("rep-kpi-total"),r=document.getElementById("rep-kpi-active"),i=document.getElementById("rep-kpi-avg-time");s&&(s.textContent=e.length);const l=e.filter($=>$.em_ocorrencia==1||$.em_ocorrencia==="true"||!$.fim);r&&(r.textContent=l.length);const c=e.filter($=>$.fim);let u="0h 0m";if(c.length>0){const _=c.reduce((G,Q)=>G+(new Date(Q.fim).getTime()-new Date(Q.inicio).getTime()),0)/c.length,E=Math.floor(_/6e4),N=Math.floor(E/60),U=E%60;u=`${N}h ${U}m`}if(i&&(i.textContent=u),!window.Chart){console.warn("Chart.js is not loaded.");return}const p=Y,m=t?new Date(t+"T00:00:00").getTime():new Date(new Date().getFullYear()+"-01-01T00:00:00").getTime(),f=n?new Date(n+"T23:59:59").getTime():Date.now(),y=p.map($=>$.name),h=p.map($=>{const _=$.id,E=Le.filter(A=>Ne(A.topico)===_),N=f-m;if(N<=0)return 100;const G=E.filter(A=>{const ee=new Date(A.inicio).getTime();return(A.fim?new Date(A.fim).getTime():Date.now())>m&&ee<f}).map(A=>({start:Math.max(new Date(A.inicio).getTime(),m),end:Math.min(A.fim?new Date(A.fim).getTime():Date.now(),f)}));G.sort((A,ee)=>A.start-ee.start);const Q=[];if(G.length>0){let A=G[0];for(let ee=1;ee<G.length;ee++){const be=G[ee];be.start<A.end?A.end=Math.max(A.end,be.end):(Q.push(A),A=be)}Q.push(A)}const J=(A=>{let ee=0;return A.forEach(be=>{ee+=be.end-be.start}),ee})(Q),Ce=(N-J)/N*100;return parseFloat(Ce.toFixed(4))}),g=p.map($=>$.color||"#6b7280"),v=document.getElementById("chart-rep-sla");v&&(ot&&ot.destroy(),ot=new window.Chart(v,{type:"bar",data:{labels:y,datasets:[{label:"Disponibilidade %",data:h,backgroundColor:g,borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},scales:{y:{min:Math.max(0,Math.min(...h)-5),max:100,ticks:{callback:$=>$+"%"}}}}}));const w={};e.forEach($=>{const _=$.sub_topico?$.sub_topico.charAt(0).toUpperCase()+$.sub_topico.slice(1).toLowerCase():"Não especificado";w[_]=(w[_]||0)+1});const x=Object.keys(w),P=Object.values(w),D=document.getElementById("chart-rep-qty");D&&(at&&at.destroy(),at=new window.Chart(D,{type:"doughnut",data:{labels:x.length>0?x:["Nenhum evento"],datasets:[{data:P.length>0?P:[0],backgroundColor:["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f43f5e","#a855f7","#06b6d4"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"right",labels:{boxWidth:12}}}}}))}function Ut(e){if(e.preventDefault(),Pe)return;Pe=!0;const t=document.getElementById("topic-id"),n=document.getElementById("topic-name"),o=document.getElementById("topic-color");if(!t||!n||!o){Pe=!1;return}const a={id:t.value.trim().toLowerCase(),name:n.value.trim(),color:o.value};if(!a.id){alert("Por favor, defina um ID para o tópico."),Pe=!1;return}fetch("/api/timeline/config/topics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then(s=>{if(!s.ok)throw new Error("Erro ao salvar tópico");return s.json()}).then(()=>(alert("Tópico salvo com sucesso!"),t.value="",n.value="",o.value="#3b82f6",ve().then(()=>{se()}))).catch(s=>{console.error(s),alert("Erro: "+s.message)}).finally(()=>{Pe=!1})}function Yt(e){if(e.preventDefault(),Fe)return;Fe=!0;const t=document.getElementById("subtopic-topic-id"),n=document.getElementById("subtopic-name");if(!t||!n){Fe=!1;return}const o={topic_id:t.value,name:n.value.trim()};if(!o.topic_id||!o.name){alert("Preencha todos os campos do evento."),Fe=!1;return}fetch("/api/timeline/config/subtopics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(a=>{if(!a.ok)throw new Error("Erro ao adicionar evento");return a.json()}).then(()=>(alert("Evento adicionado!"),n.value="",ve())).catch(a=>{console.error(a),alert("Erro: "+a.message)}).finally(()=>{Fe=!1})}function Gt(e){confirm("Excluir este tópico também removerá todos os seus eventos associados. Deseja continuar?")&&fetch(`/api/timeline/config/topics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir tópico");return t.json()}).then(()=>{alert("Tópico excluído!"),ve().then(()=>{se()})}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function Qt(e){confirm("Deseja realmente excluir este evento?")&&fetch(`/api/timeline/config/subtopics/${e}`,{method:"DELETE"}).then(t=>{if(!t.ok)throw new Error("Erro ao excluir evento");return t.json()}).then(()=>{alert("Evento excluído!"),ve()}).catch(t=>{console.error(t),alert("Erro: "+t.message)})}function Dt(){const e=document.getElementById("config-topics-list");e&&(e.innerHTML="",Y.length===0?e.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum tópico cadastrado.</div>':Y.forEach(n=>{const o=document.createElement("div");o.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",o.innerHTML=`
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${n.color}; display: inline-block;"></span>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name} <small style="color: var(--text-muted); font-size: 0.75rem;">(${n.id})</small></span>
                    </div>
                    <button type="button" onclick="deleteTopic('${n.id}')" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,e.appendChild(o)}));const t=document.getElementById("config-subtopics-list");t&&(t.innerHTML="",Ke.length===0?t.innerHTML='<div style="color: var(--text-muted); font-size: 0.9rem;">Nenhum evento cadastrado.</div>':Ke.forEach(n=>{const o=Y.find(i=>i.id===n.topic_id),a=o?o.name:n.topic_id,s=o?o.color:"#6b7280",r=document.createElement("div");r.style.cssText="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid var(--glass-border); margin-bottom: 6px;",r.innerHTML=`
                    <div>
                        <span style="font-weight: 500; color: var(--text-main);">${n.name}</span>
                        <span style="display: inline-block; margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; background: ${s}22; color: ${s}; font-weight: 600; border: 1px solid ${s}44;">${a}</span>
                    </div>
                    <button type="button" onclick="deleteSubtopic(${n.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; font-weight: 600; padding: 4px 8px;">Excluir</button>
                `,t.appendChild(r)}))}function Jt(e,t){e.currentTarget.classList.add("dragging"),e.dataTransfer.effectAllowed="move"}function Kt(e){e.preventDefault();const t=document.querySelector(".timeline-container.dragging");if(!t)return;const n=document.getElementById("timeline-tracks-container");if(!n)return;const a=[...n.querySelectorAll(".timeline-container:not(.dragging)")].find(s=>{const r=s.getBoundingClientRect();return e.clientY<=r.top+r.height/2});a?n.insertBefore(t,a):n.appendChild(t)}function Wt(e){const t=document.querySelector(".timeline-container.dragging");t&&t.classList.remove("dragging"),document.querySelectorAll(".timeline-container").forEach(a=>{a.setAttribute("draggable","false")});const n=document.getElementById("timeline-tracks-container");if(!n)return;const o=Array.from(n.querySelectorAll(".timeline-container")).map(a=>a.dataset.topicId);Xt(o)}function Xt(e){fetch("/api/timeline/config/topics/reorder",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:e})}).then(t=>{if(!t.ok)throw new Error("Erro ao salvar nova ordenação");return t.json()}).then(()=>{console.log("Ordem dos tópicos atualizada com sucesso."),ve().then(()=>{se()})}).catch(t=>{console.error(t),alert("Erro ao salvar ordenação: "+t.message)})}let ce=[],Ie=[],rt=[],lt=[],k="extensions",z=1,K=100,dt=[];const Te={setActiveTab(e){k=e,z=1;const t=document.getElementById("telephony-search");t&&(t.value="",e==="extensions"?t.placeholder="Pesquisar ramais por número, nome ou usuário...":e==="queues"?t.placeholder="Pesquisar filas por número ou nome...":e==="blf"?t.placeholder="Pesquisar BLF por nome...":e==="users"&&(t.placeholder="Pesquisar usuários por nome ou perfil...")),document.querySelectorAll(".telephony-tabs-nav .acc-tab-btn").forEach(r=>{r.id===`tab-telephony-${e}`?r.classList.add("active"):r.classList.remove("active")}),document.querySelectorAll(".telephony-tab-content").forEach(r=>{r.id===`telephony-view-${e}`?r.classList.remove("hidden"):r.classList.add("hidden")});const a=document.querySelector("#telephony-section .search-bar"),s=document.getElementById("telephony-pagination");if(a&&(a.style.display=e==="history"?"none":"flex"),s&&(s.style.display=e==="history"?"none":"flex"),e==="history")this.fetchAndRenderHistory();else{const r=this.getActiveDataList();this.render(r)}},getActiveDataList(){return k==="extensions"?ce:k==="queues"?Ie:k==="blf"?rt:k==="users"?lt:[]},async fetch(){const e=this.getActiveTableBody();e&&(e.innerHTML='<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-muted);">Carregando dados...</td></tr>');try{if(z=1,k==="extensions")ce=await b.get("/telephony/extensions"),this.render(ce);else if(k==="queues")Ie=await b.get("/telephony/queues"),this.render(Ie);else if(k==="blf"){const t=[];if(ce.length===0&&t.push(b.get("/telephony/extensions").then(n=>{ce=n}).catch(n=>console.warn("Could not pre-fetch extensions:",n))),Ie.length===0&&t.push(b.get("/telephony/queues").then(n=>{Ie=n}).catch(n=>console.warn("Could not pre-fetch queues:",n))),t.length>0)try{await Promise.all(t)}catch(n){console.warn("Could not pre-fetch extensions/queues for BLF mapping:",n)}rt=await b.get("/telephony/blfs"),this.render(rt)}else k==="users"?(lt=await b.get("/telephony/users"),this.render(lt)):k==="history"&&await this.fetchAndRenderHistory()}catch(t){console.error(`Error fetching telephony ${k}:`,t),e&&(e.innerHTML=`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: #ef4444;">Erro ao carregar dados: ${t.message||"Erro de rede"}</td></tr>`)}},getActiveTableBody(){return k==="extensions"?document.getElementById("telephony-table-body"):k==="queues"?document.getElementById("telephony-queues-table-body"):k==="blf"?document.getElementById("telephony-blf-table-body"):k==="users"?document.getElementById("telephony-users-table-body"):null},render(e){const t=this.getActiveTableBody();if(!t)return;dt=e;const n=e.length,o=Math.ceil(n/K);z>o&&(z=Math.max(1,o)),z<1&&(z=1);const a=(z-1)*K,s=e.slice(a,a+K);if(s.length===0){const r=k==="extensions"?9:k==="queues"?6:k==="blf"?4:5;t.innerHTML=`
                <tr>
                    <td colspan="${r}" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        Nenhum registro encontrado.
                    </td>
                </tr>
            `,this.renderPaginationControls("telephony-pagination",0,0);return}k==="extensions"?this.renderExtensionsList(t,s):k==="queues"?this.renderQueuesList(t,s):k==="blf"?this.renderBlfsList(t,s):k==="users"&&this.renderUsersList(t,s),this.renderPaginationControls("telephony-pagination",o,n)},renderExtensionsList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.local_username||"",r=n.local_department||"",i=n.ddr||"-",l=n.Username||"-",c=n.Secret||"",u=n.regra_saida_nome?`<span class="badge" style="background: rgba(255,255,255,0.05); color: var(--text-main); font-size: 0.8rem; padding: 4px 8px; border-radius: 6px;">${n.regra_saida_nome}</span>`:"-",p=n.observacao||"-",m=c.replace(/'/g,"\\'");return`
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
                               value="${r}" 
                               placeholder="Depto..." 
                               onchange="window.TelephonyHandler.updateDepartment('${o}', this.value)">
                    </td>
                    <td>${i}</td>
                    <td><strong style="color: var(--accent);">${l}</strong></td>
                    <td>
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 140px;">
                            <span id="secret-txt-${n.id}" style="font-family: monospace; font-size: 0.9rem; letter-spacing: 0.5px;">••••••••</span>
                            <button class="btn-icon" onclick="window.TelephonyHandler.toggleSecret(${n.id}, '${m}')" title="Mostrar/Ocultar Senha" style="padding: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                                <svg id="secret-icon-${n.id}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                        </div>
                    </td>
                    <td>${u}</td>
                    <td style="color: var(--text-muted); font-size: 0.85rem; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p}">${p}</td>
                </tr>
            `}).join("")},renderQueuesList(e,t){e.innerHTML=t.map(n=>{const o=n.exten||"-",a=n.nome||"-",s=n.Estrategia||"-",r=n.TimeoutAgente?`${n.TimeoutAgente}s`:"-",i=n.Gravacao?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Sim</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Não</span>',l=n.membros?n.membros.length:0,c=n.membros&&n.membros.length>0?n.membros.map(u=>`
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
                    <td style="text-transform: capitalize;">${s}</td>
                    <td>${r}</td>
                    <td>${i}</td>
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
                            ${c}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderBlfsList(e,t){e.innerHTML=t.map(n=>{const o=n.id,a=n.Nome||"-",s=n.quantidade_extensoes||0,r=n.DataCriacao?new Date(n.DataCriacao).toLocaleString("pt-BR"):"-",i=n.extensoes_ids&&n.extensoes_ids.length>0?n.extensoes_ids.map(l=>{let c=ce.find(p=>p.extensao_id===l),u=Ie.find(p=>p.extensao_id===l);if(!c&&!u&&(c=ce.find(p=>p.id===l),c||(u=Ie.find(p=>p.id===l))),c){const p=c.exten||`ID ${l}`,m=c.nome||"Sem nome";return`
                            <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: var(--accent);">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500;">${p} - ${m} <small style="color: var(--text-muted); font-size: 0.75rem;">(Ramal)</small></span>
                            </div>
                        `}else if(u){const p=u.exten||`Fila ${l}`,m=u.nome||"Sem nome";return`
                            <div style="background: rgba(16,185,129,0.03); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(16,185,129,0.15); display: flex; align-items: center; gap: 8px;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="color: #10b981;">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span style="font-size: 0.85rem; font-weight: 500; color: #6ee7b7;">${p} - ${m} <small style="color: #a7f3d0; font-size: 0.75rem; opacity: 0.8;">(Fila)</small></span>
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
                    <td><strong>${a}</strong></td>
                    <td>
                        <span style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--accent);">
                            <span>${s} ramais</span>
                            <svg id="blf-arrow-${o}" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" style="transition: transform 0.2s;">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </td>
                    <td style="color: var(--text-muted);">${r}</td>
                </tr>
                <tr id="blf-details-${o}" class="hidden" style="background: rgba(0,0,0,0.2);">
                    <td colspan="4" style="padding: 15px 25px; border-bottom: 1px solid var(--glass-border);">
                        <h4 style="margin: 0 0 12px 0; font-size: 0.9rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Ramais Vinculados:</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px;">
                            ${i}
                        </div>
                    </td>
                </tr>
            `}).join("")},renderUsersList(e,t){e.innerHTML=t.map(n=>{const o=n.username||"-",a=n.email||"-",s=n.Tipo||"-",r=n.is_active?'<span class="badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Ativo</span>':'<span class="badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Inativo</span>';return`
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
                    <td>${r}</td>
                </tr>
            `}).join("")},toggleQueueRow(e){const t=document.getElementById(`queue-details-${e}`),n=document.getElementById(`queue-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleBlfRow(e){const t=document.getElementById(`blf-details-${e}`),n=document.getElementById(`blf-arrow-${e}`);t&&(t.classList.toggle("hidden"),n&&(t.classList.contains("hidden")?n.style.transform="rotate(0deg)":n.style.transform="rotate(180deg)"))},toggleUserSecret(e){alert("Por segurança do PABX Gnew, as senhas dos usuários do portal são armazenadas com criptografia unidirecional na base e não podem ser lidas em texto claro.")},search(e){z=1;const n=this.getActiveDataList().filter(o=>k==="extensions"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.local_username||"").toLowerCase().includes(e)||(o.local_department||"").toLowerCase().includes(e)||(o.Username||"").toLowerCase().includes(e)||(o.ddr||"").toLowerCase().includes(e)||(o.observacao||"").toLowerCase().includes(e):k==="queues"?(o.exten||"").toLowerCase().includes(e)||(o.nome||"").toLowerCase().includes(e)||(o.Estrategia||"").toLowerCase().includes(e):k==="blf"?(o.Nome||"").toLowerCase().includes(e):k==="users"?(o.username||"").toLowerCase().includes(e)||(o.email||"").toLowerCase().includes(e)||(o.Tipo||"").toLowerCase().includes(e):!1);this.render(n)},changePage(e){z=e,this.render(dt)},setPageSize(e){K=parseInt(e,10),z=1,this.render(dt)},async updateLocalUsername(e,t){try{console.log(`[TELEFONIA] Atualizando nome de usuário local do ramal ${e} para: ${t}`);const n=window.auth&&window.auth.getUser()?window.auth.getUser().name:"Sistema",o=await b.post("/telephony/extensions/username",{exten:e,username:t,changed_by:n});if(o.success){const a=ce.find(s=>s.exten===e);a&&(a.local_username=t),console.log(`[TELEFONIA] Nome de usuário local atualizado para ${e}`)}else alert("Erro ao salvar nome de usuário: "+(o.error||"Erro desconhecido"))}catch(n){console.error("Erro ao atualizar nome de usuário local:",n),alert("Erro de rede ao salvar nome de usuário: "+n.message)}},async updateDepartment(e,t){try{console.log(`[TELEFONIA] Atualizando departamento do ramal ${e} para: ${t}`);const n=window.auth&&window.auth.getUser()?window.auth.getUser().name:"Sistema",o=await b.post("/telephony/extensions/department",{exten:e,department:t,changed_by:n});if(o.success){const a=ce.find(s=>s.exten===e);a&&(a.local_department=t),console.log(`[TELEFONIA] Departamento local atualizado para ${e}`)}else alert("Erro ao salvar departamento: "+(o.error||"Erro desconhecido"))}catch(n){console.error("Erro ao atualizar departamento local:",n),alert("Erro de rede ao salvar departamento: "+n.message)}},showExtensionHistory(e){const t=document.getElementById("telephony-history-start"),n=document.getElementById("telephony-history-end");t&&(t.value=""),n&&(n.value="");const o=document.getElementById("telephony-history-exten");o&&(o.value=e);const a=document.getElementById("telephony-history-username");a&&(a.value=""),this.setActiveTab("history")},toggleSecret(e,t){const n=document.getElementById(`secret-txt-${e}`),o=document.getElementById(`secret-icon-${e}`);!n||!o||(n.textContent==="••••••••"?(n.textContent=t,o.innerHTML=`
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `):(n.textContent="••••••••",o.innerHTML=`
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `))},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a=`
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.TelephonyHandler.setPageSize(Number(this.value))" style="width: 85px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${K===10?"selected":""}>10</option>
                    <option value="25" ${K===25?"selected":""}>25</option>
                    <option value="50" ${K===50?"selected":""}>50</option>
                    <option value="100" ${K===100?"selected":""}>100</option>
                    <option value="500" ${K===500?"selected":""}>500</option>
                </select>
            </div>
        `;a+=`
            <button class="pagination-btn" 
                    ${z===1?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${z-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=z-1&&l<=z+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===z?"active":""}" 
                            onclick="window.TelephonyHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${z===t?"disabled":""} 
                    onclick="window.TelephonyHandler.changePage(${z+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const r=(z-1)*K+1,i=Math.min(z*K,n);a+=`
            <span class="pagination-info">
                Exibindo ${r}-${i} de ${n}
            </span>
        `,o.innerHTML=a},init(){console.log("📞 [TELEFONIA] Inicializando telephonyHandler...");const e=document.getElementById("telephony-history-start"),t=document.getElementById("telephony-history-end");e&&(e.value=""),t&&(t.value=""),["telephony-history-start","telephony-history-end"].forEach(o=>{const a=document.getElementById(o);a&&a.addEventListener("change",()=>this.fetchAndRenderHistory())}),["telephony-history-exten","telephony-history-username"].forEach(o=>{const a=document.getElementById(o);a&&a.addEventListener("input",()=>this.fetchAndRenderHistory())});const n=document.getElementById("btn-clear-telephony-history-filters");n&&n.addEventListener("click",()=>{e&&(e.value=""),t&&(t.value="");const o=document.getElementById("telephony-history-exten"),a=document.getElementById("telephony-history-username");o&&(o.value=""),a&&(a.value=""),this.fetchAndRenderHistory()})},async fetchAndRenderHistory(){const e=document.getElementById("telephony-history-timeline-container");e&&(e.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Carregando histórico...
                </div>
            `);try{const t=document.getElementById("telephony-history-start")?.value||"",n=document.getElementById("telephony-history-end")?.value||"",o=document.getElementById("telephony-history-exten")?.value||"",a=document.getElementById("telephony-history-username")?.value||"",s=new URLSearchParams({startDate:t,endDate:n,exten:o,username:a}),r=await b.get("/telephony/extensions/history?"+s.toString());this.renderHistoryTimeline(r)}catch(t){console.error("Error fetching extension history:",t),e&&(e.innerHTML=`
                    <div style="text-align: center; padding: 3rem; color: #ef4444; width: 100%;">
                        Erro ao carregar histórico: ${t.message||"Erro desconhecido"}
                    </div>
                `)}},renderHistoryTimeline(e){const t=document.getElementById("telephony-history-timeline-container");if(t){if(!e||e.length===0){t.innerHTML=`
                <div style="text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                    Nenhum registro de histórico encontrado para os filtros selecionados.
                </div>
            `;return}t.innerHTML=e.map(n=>{const o=new Date(n.changed_at).toLocaleString("pt-BR"),a=n.exten||"-",s=n.changed_by||"Sistema";let r="";if(n.new_username!==void 0&&n.new_username!==null&&n.old_username!==n.new_username){const i=n.old_username||"<i>(Vazio)</i>",l=n.new_username||"<i>(Removido)</i>";r=`
                     Nome de usuário alterado:
                     <span style="text-decoration: line-through; color: var(--text-muted); margin: 0 6px;">${i}</span>
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="vertical-align: middle; margin-right: 6px; color: var(--success, #10b981);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                     <strong style="color: var(--success, #10b981);">${l}</strong>
                `}else if(n.new_department!==void 0&&n.new_department!==null&&n.old_department!==n.new_department){const i=n.old_department||"<i>(Vazio)</i>",l=n.new_department||"<i>(Removido)</i>";r=`
                     Departamento alterado:
                     <span style="text-decoration: line-through; color: var(--text-muted); margin: 0 6px;">${i}</span>
                     <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" style="vertical-align: middle; margin-right: 6px; color: var(--success, #10b981);"><polyline points="9 18 15 12 9 6"></polyline></svg>
                     <strong style="color: var(--success, #10b981);">${l}</strong>
                `}else r="Alteração registrada no ramal.";return`
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
                             ${r}
                         </div>
                         <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px;">
                             <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" style="vertical-align: middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                             <span>Alterado por: <strong>${s}</strong></span>
                         </div>
                    </div>
                </div>
            `}).join("")}}};let S=[],Ye=[],ue=[],Lt="monitoring",V=1,ae=10,ct=null,W="all",Ge=new Set;const ze=[{name:"Notebook",description:"Laptops e computadores portáteis",is_system:!0},{name:"Desktop",description:"Computadores de mesa e estações de trabalho",is_system:!0},{name:"Headset",description:"Headsets, fones e equipamentos de áudio/comunicação",is_system:!0},{name:"Monitor",description:"Monitores e telas de vídeo",is_system:!0},{name:"Periférico",description:"Teclados, mouses, webcams e adaptadores",is_system:!0},{name:"Servidor",description:"Servidores físicos e lâminas de rack",is_system:!0},{name:"Switch",description:"Switches de rede de acesso e distribuição",is_system:!0},{name:"Roteador",description:"Roteadores e gateways de borda",is_system:!0},{name:"Impressora",description:"Impressoras térmicas, multifuncionais e laser",is_system:!0},{name:"Nobreak",description:"Nobreaks e estabilizadores",is_system:!0},{name:"Outro",description:"Diversos e equipamentos gerais",is_system:!0}],xt={init(){window.InventoryHandler=this,this.setupTabListeners(),this.setupFormListeners(),this.setupFilterListeners(),this.setupDetailsModalListeners(),this.setupPoolListeners(),this.setupLiveFormMatching(),this.setupMovementAutocomplete(),this.fetchCategories()},getProductKey(e,t){const n=(e||"").trim().toLowerCase(),o=(t||"Outro").trim().toLowerCase();return`${n}:::${o}`},getProductCatalog(){const e=new Map;return S.forEach(t=>{const n=this.getProductKey(t.name,t.category),o=(t.status||"ativo").toLowerCase();e.has(n)||e.set(n,{key:n,name:(t.name||"").trim(),category:t.category||"Outro",brand_model:t.brand_model||"",total:0,available:0,inUse:0,maintenance:0,desativado:0,items:[]});const a=e.get(n);a.total+=1,a.items.push(t),o==="reserva"?a.available+=1:o==="ativo"?a.inUse+=1:o==="manutencao"?a.maintenance+=1:o==="desativado"&&(a.desativado+=1)}),Array.from(e.values()).sort((t,n)=>t.name.localeCompare(n.name))},getProductAvailability(e,t){if(!e)return null;const n=this.getProductKey(e,t);return this.getProductCatalog().find(a=>a.key===n)||null},setupLiveFormMatching(){const e=document.getElementById("inv-form-name"),t=document.getElementById("inv-form-category"),n=document.getElementById("inv-form-product-match"),o=()=>{if(!e||!n)return;const a=e.value.trim(),s=t?t.value:"Outro";if(!a||a.length<2){n.classList.add("hidden"),n.innerHTML="";return}const r=this.getProductAvailability(a,s);r?(n.classList.remove("hidden"),n.innerHTML=`
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
                        <div>
                            <span style="color: #a5b4fc; font-weight: 700;">📦 Produto existente no catálogo:</span>
                            <strong style="color: #fff;">${this.escapeHtml(r.name)}</strong> (${this.escapeHtml(r.category)})
                        </div>
                        <div style="display: flex; gap: 10px; font-size: 0.8rem;">
                            <span style="color: #34d399; font-weight: 700;">🟢 Estoque: ${r.available}</span>
                            <span style="color: #60a5fa; font-weight: 700;">🔵 Em Uso: ${r.inUse}</span>
                            <span style="color: #fbbf24; font-weight: 700;">🟡 Manutenção: ${r.maintenance}</span>
                            <span style="color: #fff; font-weight: 700;">Total: ${r.total}</span>
                        </div>
                    </div>
                `):(n.classList.add("hidden"),n.innerHTML="")};e&&e.addEventListener("input",o),t&&t.addEventListener("change",o)},setupTabListeners(){const e=document.getElementById("tab-inv-monitoring"),t=document.getElementById("tab-inv-pool"),n=document.getElementById("tab-inv-config"),o=document.getElementById("tab-inv-categories"),a=document.getElementById("btn-inv-create-new"),s=document.getElementById("btn-inv-movement-in"),r=document.getElementById("btn-inv-movement-use"),i=document.getElementById("btn-inv-movement-maint"),l=document.getElementById("btn-inv-movement-out"),c=document.getElementById("btn-inv-clear-filters"),u=document.getElementById("btn-inv-export-csv");e&&e.addEventListener("click",()=>this.switchTab("monitoring")),t&&t.addEventListener("click",()=>this.switchTab("pool")),n&&n.addEventListener("click",()=>{this.resetForm(),this.switchTab("config")}),o&&o.addEventListener("click",()=>this.switchTab("categories")),a&&a.addEventListener("click",()=>{this.resetForm(),this.switchTab("config")}),s&&s.addEventListener("click",()=>this.openMovementModal("in")),r&&r.addEventListener("click",()=>this.openMovementModal("use")),i&&i.addEventListener("click",()=>this.openMovementModal("maint")),l&&l.addEventListener("click",()=>this.openMovementModal("out")),c&&c.addEventListener("click",()=>this.clearFilters()),u&&u.addEventListener("click",()=>this.exportToCSV())},async switchTab(e){Lt=e;const t=document.getElementById("tab-inv-monitoring"),n=document.getElementById("tab-inv-pool"),o=document.getElementById("tab-inv-config"),a=document.getElementById("tab-inv-categories"),s=document.getElementById("view-inv-monitoring"),r=document.getElementById("view-inv-pool"),i=document.getElementById("view-inv-config"),l=document.getElementById("view-inv-categories");[t,n,o,a].forEach(c=>c?.classList.remove("active")),[s,r,i,l].forEach(c=>c?.classList.add("hidden")),e==="monitoring"?(t?.classList.add("active"),s?.classList.remove("hidden"),await this.fetch(ct),ct=null):e==="pool"?(n?.classList.add("active"),r?.classList.remove("hidden"),(!S||S.length===0)&&await this.fetch(),this.renderCategoryDropdowns(),this.renderPoolView()):e==="config"?(o?.classList.add("active"),i?.classList.remove("hidden"),await this.fetchCategories()):e==="categories"&&(a?.classList.add("active"),l?.classList.remove("hidden"),await this.fetchCategories())},setupFormListeners(){const e=document.getElementById("inventory-form"),t=document.getElementById("btn-inv-form-reset"),n=document.getElementById("btn-inv-form-cancel");e&&e.addEventListener("submit",async m=>{m.preventDefault(),await this.handleSaveItem()});const o=document.getElementById("inventory-category-form");o&&o.addEventListener("submit",async m=>{m.preventDefault(),await this.handleSaveCategory()});const a=document.getElementById("form-inv-movement");a&&a.addEventListener("submit",async m=>{m.preventDefault(),await this.handleSaveMovement()});const s=document.getElementById("inv-move-quantity"),r=document.getElementById("btn-inv-qty-minus"),i=document.getElementById("btn-inv-qty-plus"),l=document.getElementById("inv-move-qty-hint"),c=()=>{if(!s)return;let m=parseInt(s.value)||1;m<1&&(m=1),s.value=m,l&&(l.textContent=`(${m} ${m===1?"unidade selecionada":"unidades selecionadas"})`)};r&&r.addEventListener("click",()=>{if(!s)return;let m=parseInt(s.value)||1;m>1&&(s.value=m-1,c())}),i&&i.addEventListener("click",()=>{if(!s)return;let m=parseInt(s.value)||1;s.value=m+1,c()}),s&&s.addEventListener("input",c);const u=document.getElementById("btn-close-inv-movement"),p=document.getElementById("btn-cancel-inv-movement");u&&u.addEventListener("click",()=>this.closeMovementModal()),p&&p.addEventListener("click",()=>this.closeMovementModal()),t&&t.addEventListener("click",()=>this.resetForm()),n&&n.addEventListener("click",()=>this.switchTab("monitoring"))},setupFilterListeners(){const e=document.getElementById("inv-search-input"),t=document.getElementById("inv-filter-category"),n=document.getElementById("inv-filter-status");let o;const a=()=>{clearTimeout(o),o=setTimeout(()=>{V=1,this.renderTable()},150)};e&&e.addEventListener("input",a),t&&t.addEventListener("change",a),n&&n.addEventListener("change",a)},setupDetailsModalListeners(){const e=document.getElementById("modal-inv-details"),t=document.getElementById("btn-close-inv-details"),n=document.getElementById("btn-close-inv-details-footer"),o=document.getElementById("btn-inv-detail-edit"),a=()=>{e&&e.classList.add("hidden")};t&&t.addEventListener("click",a),n&&n.addEventListener("click",a),o&&o.addEventListener("click",()=>{const s=Number(e?.getAttribute("data-item-id")),r=S.find(i=>i.id===s);a(),r&&this.openEditForm(r)})},setupPoolListeners(){const e=document.getElementById("pool-filter-category"),t=document.getElementById("btn-pool-clear-category"),n=document.getElementById("btn-pool-refresh"),o=document.getElementById("btn-pool-export-matrix"),a=document.getElementById("btn-pool-export-products");e&&e.addEventListener("change",s=>{W=s.target.value,this.renderPoolView()}),t&&t.addEventListener("click",()=>{W="all",e&&(e.value="all"),this.renderPoolView(),this.showToast("info","Filtro de categoria do Pool resetado.")}),n&&n.addEventListener("click",async()=>{await this.fetch(),this.showToast("success","Dados do Pool atualizados.")}),o&&o.addEventListener("click",()=>this.exportPoolMatrixToCSV()),a&&a.addEventListener("click",()=>this.exportPoolProductsToCSV())},clearFilters(){const e=document.getElementById("inv-search-input"),t=document.getElementById("inv-filter-category"),n=document.getElementById("inv-filter-status");e&&(e.value=""),t&&(t.value="all"),n&&(n.value="all"),V=1,this.renderTable(),this.showToast("info","Filtros restaurados com sucesso.")},async fetch(e=null){try{const t=await b.get("/inventory");S=Array.isArray(t)?t:[],this.renderStats(),this.renderTable(e),this.fetchAuditLogs(),Lt==="pool"&&this.renderPoolView()}catch(t){console.error("Erro ao buscar inventário:",t),this.showToast("error","Erro ao carregar dados do inventário.")}},async fetchAuditLogs(){try{const e=await b.get("/inventory/audit-logs");Ye=Array.isArray(e)?e:[],this.renderAuditTable()}catch(e){console.error("Erro ao buscar logs de auditoria:",e)}},renderAuditTable(){const e=document.getElementById("inv-audit-table-body");if(e){if(!Ye||Ye.length===0){e.innerHTML='<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">Nenhum registro de auditoria encontrado.</td></tr>';return}e.innerHTML=Ye.slice(0,50).map(t=>`
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px 10px; color: var(--text-muted); font-size: 0.8rem;">${t.created_at?new Date(t.created_at).toLocaleString("pt-BR"):"-"}</td>
                <td style="padding: 8px 10px; font-weight: 600; color: #fff;">${this.escapeHtml(t.item_name||"Item #"+t.item_id)}</td>
                <td style="padding: 8px 10px;"><span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem;">${this.escapeHtml(t.action)}</span></td>
                <td style="padding: 8px 10px; font-size: 0.85rem; color: #cbd5e1;">${this.escapeHtml(t.details||"-")}</td>
                <td style="padding: 8px 10px; font-size: 0.8rem; color: #818cf8;">${this.escapeHtml(t.performed_by||"-")}</td>
            </tr>
        `).join("")}},renderStats(){const e=document.getElementById("inv-stat-total"),t=document.getElementById("inv-stat-active"),n=document.getElementById("inv-stat-maintenance"),o=document.getElementById("inv-stat-reserve"),a=S.length,s=S.filter(l=>(l.status||"").toLowerCase()==="ativo").length,r=S.filter(l=>(l.status||"").toLowerCase()==="manutencao").length,i=S.filter(l=>(l.status||"").toLowerCase()==="reserva").length;e&&(e.textContent=a),t&&(t.textContent=s),n&&(n.textContent=r),o&&(o.textContent=i)},setPageSize(e){ae=e,V=1,this.renderTable()},changePage(e){V=e,this.renderTable()},renderTable(e=null){const t=document.getElementById("inv-table-body"),n=document.getElementById("inv-items-count");let o=this.getProductCatalog();const a=document.getElementById("inv-search-input"),s=document.getElementById("inv-filter-category"),r=document.getElementById("inv-filter-status"),i=a?a.value.trim().toLowerCase():"",l=s?s.value:"all",c=r?r.value:"all";i&&(o=o.filter(h=>h.name.toLowerCase().includes(i)||h.category&&h.category.toLowerCase().includes(i)||h.brand_model&&h.brand_model.toLowerCase().includes(i))),l&&l!=="all"&&(o=o.filter(h=>h.category===l)),c&&c!=="all"&&(c==="reserva"?o=o.filter(h=>h.available>0):c==="ativo"?o=o.filter(h=>h.inUse>0):c==="manutencao"?o=o.filter(h=>h.maintenance>0):c==="desativado"&&(o=o.filter(h=>h.desativado>0)));const u=o.length,p=o.reduce((h,g)=>h+g.total,0),m=Math.ceil(u/ae);if(V>m&&(V=Math.max(1,m)),V<1&&(V=1),n&&(n.textContent=`${u} ${u===1?"modelo de equipamento":"modelos de equipamentos"} (${p} unidades)`),!t)return;if(u===0){t.innerHTML=`
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                        <div style="font-size: 2rem; margin-bottom: 8px;">📦</div>
                        <div style="font-weight: 600; font-size: 1rem; color: #fff;">Nenhum equipamento encontrado</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
                            Tente limpar os filtros de pesquisa ou cadastre um novo equipamento na aba Configuração.
                        </div>
                    </td>
                </tr>
            `,this.renderPaginationControls("inventory-pagination",0,0);return}const f=(V-1)*ae,y=o.slice(f,f+ae);t.innerHTML=y.map(h=>{const g=e&&h.key===e;return`
            <tr class="${g?"row-newly-added":""}" style="border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'" data-product-key="${this.escapeHtml(h.key)}">
                <td style="padding: 12px 14px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <strong style="color: #fff; font-size: 0.95rem;">${this.escapeHtml(h.name)}</strong>
                        ${g?'<span style="font-size: 0.7rem; font-weight: 700; background: #10b981; color: #fff; padding: 2px 6px; border-radius: 10px;">NOVO</span>':""}
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">${h.brand_model?this.escapeHtml(h.brand_model):""}</span>
                </td>
                <td style="padding: 12px 14px;">
                    <span style="background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); padding: 4px 10px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                        📁 ${this.escapeHtml(h.category||"Outro")}
                    </span>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                    <span class="pool-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 800; font-size: 0.95rem; font-family: 'Space Mono', monospace; padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.3);">
                        ${h.available}
                    </span>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                    <span class="pool-badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 800; font-size: 0.95rem; font-family: 'Space Mono', monospace; padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.3);">
                        ${h.inUse}
                    </span>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                    <span class="pool-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; font-weight: 800; font-size: 0.95rem; font-family: 'Space Mono', monospace; padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(245, 158, 11, 0.3);">
                        ${h.maintenance}
                    </span>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                    <span class="pool-badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; font-weight: 800; font-size: 0.95rem; font-family: 'Space Mono', monospace; padding: 4px 12px; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.3);">
                        ${h.desativado}
                    </span>
                </td>
                <td style="padding: 12px 14px; text-align: center;">
                    <strong style="color: #fff; font-size: 1.05rem; font-family: 'Space Mono', monospace;">
                        ${h.total}
                    </strong>
                </td>
                <td style="padding: 12px 14px; text-align: right;" onclick="event.stopPropagation();">
                    <div style="display: inline-flex; gap: 6px; align-items: center;">
                        <button class="btn-icon btn-move-product" data-key="${this.escapeHtml(h.key)}" title="Movimentar Equipamento" style="color: #34d399; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 10px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; display: flex; align-items: center; gap: 4px;">
                            <span>⚡ Movimentar</span>
                        </button>
                        <button class="btn-icon btn-edit-product" data-key="${this.escapeHtml(h.key)}" title="Editar Equipamento" style="color: #818cf8; background: rgba(129, 140, 248, 0.15); border: 1px solid rgba(129, 140, 248, 0.3); padding: 6px; border-radius: 6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon btn-delete-product" data-key="${this.escapeHtml(h.key)}" data-name="${this.escapeHtml(h.name)}" title="Excluir Equipamento" style="color: #ef4444; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px; border-radius: 6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
            `}).join(""),t.querySelectorAll("tr[data-product-key]").forEach(h=>{h.addEventListener("click",()=>{const g=h.getAttribute("data-product-key");this.openMovementModal("in",g)})}),t.querySelectorAll(".btn-move-product").forEach(h=>{h.addEventListener("click",g=>{g.stopPropagation();const v=h.getAttribute("data-key");this.openMovementModal("in",v)})}),t.querySelectorAll(".btn-edit-product").forEach(h=>{h.addEventListener("click",g=>{g.stopPropagation();const v=h.getAttribute("data-key"),w=o.find(x=>x.key===v);w&&w.items&&w.items.length>0&&this.openEditForm(w.items[0])})}),t.querySelectorAll(".btn-delete-product").forEach(h=>{h.addEventListener("click",g=>{g.stopPropagation();const v=h.getAttribute("data-key"),w=h.getAttribute("data-name");this.deleteProduct(v,w)})}),this.renderPaginationControls("inventory-pagination",m,u)},async deleteProduct(e,t){const o=this.getProductCatalog().find(r=>r.key===e);if(!o||!confirm(`Tem certeza que deseja excluir o equipamento "${t}" (${o.total} unidade(s) registradas)? Esta ação removerá os itens do inventário.`))return;const a=L.getUser(),s=a?`${a.name} (${a.email})`:"Usuário TI";try{for(const r of o.items)await b.delete(`/inventory/${r.id}?performed_by=${encodeURIComponent(s)}`);this.showToast("success",`Equipamento "${t}" excluído.`),await this.fetch()}catch(r){console.error("Erro ao excluir produto:",r),this.showToast("error","Erro ao excluir equipamento: "+(r.message||"Falha na requisição."))}},renderPaginationControls(e,t,n){const o=document.getElementById(e);if(!o)return;if(t===0){o.innerHTML="";return}let a=`
            <div style="display: flex; align-items: center; gap: 8px; margin-right: 15px;">
                <label style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted); white-space: nowrap;">Itens por página:</label>
                <select class="form-control glass" onchange="window.InventoryHandler.setPageSize(Number(this.value))" style="width: 80px; padding: 4px 8px; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
                    <option value="10" ${ae===10?"selected":""}>10</option>
                    <option value="25" ${ae===25?"selected":""}>25</option>
                    <option value="50" ${ae===50?"selected":""}>50</option>
                    <option value="100" ${ae===100?"selected":""}>100</option>
                </select>
            </div>
        `;a+=`
            <button class="pagination-btn" 
                    ${V===1?"disabled":""} 
                    onclick="window.InventoryHandler.changePage(${V-1})"
                    title="Página Anterior">
                &laquo;
            </button>
        `;let s=0;for(let l=1;l<=t;l++)(l===1||l===t||l>=V-1&&l<=V+1)&&(s&&l-s>1&&(a+='<span style="color: var(--text-muted); padding: 0 4px;">...</span>'),a+=`
                    <button class="pagination-btn ${l===V?"active":""}" 
                            onclick="window.InventoryHandler.changePage(${l})">
                        ${l}
                    </button>
                `,s=l);a+=`
            <button class="pagination-btn" 
                    ${V===t?"disabled":""} 
                    onclick="window.InventoryHandler.changePage(${V+1})"
                    title="Próxima Página">
                &raquo;
            </button>
        `;const r=(V-1)*ae+1,i=Math.min(V*ae,n);a+=`
            <span class="pagination-info">
                Exibindo ${r}-${i} de ${n}
            </span>
        `,o.innerHTML=a},renderPoolView(){this.renderPoolKPIs(),this.renderPoolMatrix(),this.renderPoolProductsTable(),this.renderPoolGrid()},getFilteredPoolItems(){return W==="all"?S:S.filter(e=>(e.category||"Outro")===W)},renderPoolKPIs(){const e=this.getFilteredPoolItems(),t=e.length,n=e.filter(i=>(i.status||"").toLowerCase()==="ativo").length,o=e.filter(i=>(i.status||"").toLowerCase()==="reserva").length,a=e.filter(i=>(i.status||"").toLowerCase()==="manutencao").length,s=e.filter(i=>(i.status||"").toLowerCase()==="desativado").length,r=i=>t>0?`${(i/t*100).toFixed(1)}% do pool`:"0% do pool";d.setText("pool-stat-total",t),d.setText("pool-stat-active",n),d.setText("pool-stat-active-pct",r(n)),d.setText("pool-stat-reserve",o),d.setText("pool-stat-reserve-pct",r(o)),d.setText("pool-stat-maintenance",a),d.setText("pool-stat-maintenance-pct",r(a)),d.setText("pool-stat-desativado",s),d.setText("pool-stat-desativado-pct",r(s)),d.setText("pool-pill-all",t),d.setText("pool-pill-ativo",n),d.setText("pool-pill-reserva",o),d.setText("pool-pill-manutencao",a),d.setText("pool-pill-desativado",s)},getCategoryMatrixData(){const e=S.map(p=>p.category||"Outro"),t=(ue||[]).map(p=>p.name),n=ze.map(p=>p.name);let o=[...new Set([...e,...t,...n])].filter(Boolean).sort();W!=="all"&&(o=o.filter(p=>p===W));const a=[];let s=0,r=0,i=0,l=0,c=0;o.forEach(p=>{const m=S.filter(x=>(x.category||"Outro")===p),f=m.filter(x=>(x.status||"").toLowerCase()==="ativo").length,y=m.filter(x=>(x.status||"").toLowerCase()==="reserva").length,h=m.filter(x=>(x.status||"").toLowerCase()==="manutencao").length,g=m.filter(x=>(x.status||"").toLowerCase()==="desativado").length,v=m.length;s+=f,r+=y,i+=h,l+=g,c+=v;const w=v>0?(f/v*100).toFixed(0):0;a.push({category:p,active:f,reserve:y,maintenance:h,desativado:g,total:v,usagePct:w})});const u=c>0?(s/c*100).toFixed(0):0;return{matrix:a,totals:{totalActive:s,totalReserve:r,totalMaintenance:i,totalDesativado:l,totalGrand:c,grandUsagePct:u}}},renderPoolMatrix(){const e=document.getElementById("pool-matrix-tbody"),t=document.getElementById("pool-matrix-tfoot");if(!e)return;const{matrix:n,totals:o}=this.getCategoryMatrixData(),a=this.getProductCatalog();if(n.length===0){e.innerHTML='<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--text-muted);">Nenhum dado encontrado para a categoria selecionada.</td></tr>',t&&(t.innerHTML="");return}let s="";n.forEach((r,i)=>{const l=Number(r.usagePct)>=75?"#34d399":Number(r.usagePct)>=40?"#60a5fa":"#fbbf24",c=(r.category||"Outro").toLowerCase(),u=a.filter(f=>(f.category||"Outro").toLowerCase()===c),p=Ge.has(r.category),m=`pool-cat-${i}`;s+=`
                <tr class="pool-category-row" data-cat="${this.escapeHtml(r.category)}" data-target="${m}" style="cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06); transition: background 0.2s;" onmouseover="this.style.background='rgba(99, 102, 241, 0.08)'" onmouseout="this.style.background='transparent'">
                    <td style="font-weight: 600; color: #fff; padding: 12px 14px;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span class="pool-cat-toggle-icon" id="toggle-icon-${m}" style="display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 6px; background: rgba(99, 102, 241, 0.2); color: #818cf8; font-size: 0.75rem; transition: transform 0.2s; font-family: monospace;">
                                    ${p?"▼":"▶"}
                                </span>
                                <span style="font-size: 0.95rem; font-weight: 700;">📁 ${this.escapeHtml(r.category)}</span>
                            </div>
                            <span style="font-size: 0.75rem; color: #a5b4fc; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); padding: 2px 8px; border-radius: 10px; font-weight: 600;">
                                ${u.length} ${u.length===1?"modelo":"modelos"}
                            </span>
                        </div>
                    </td>
                    <td class="pool-cell-number" style="color: #34d399; font-weight: 700; font-size: 0.95rem;">${r.active}</td>
                    <td class="pool-cell-number" style="color: #60a5fa; font-weight: 700; font-size: 0.95rem;">${r.reserve}</td>
                    <td class="pool-cell-number" style="color: #fbbf24; font-weight: 700; font-size: 0.95rem;">${r.maintenance}</td>
                    <td class="pool-cell-number" style="color: #f87171; font-weight: 700; font-size: 0.95rem;">${r.desativado}</td>
                    <td class="pool-cell-number" style="color: #fff; font-size: 1.05rem; font-weight: 800; background: rgba(255,255,255,0.02);">${r.total}</td>
                    <td style="text-align: center; padding: 8px 12px;">
                        <div style="font-weight: 700; font-size: 0.82rem; color: ${l}; font-family: monospace;">${r.usagePct}%</div>
                        <div class="pool-progress-container">
                            <div class="pool-progress-bar" style="width: ${r.usagePct}%; background: ${l};"></div>
                        </div>
                    </td>
                </tr>
                <tr id="dropdown-${m}" class="pool-cat-dropdown-row ${p?"":"hidden"}" style="background: rgba(15, 23, 42, 0.65);">
                    <td colspan="7" style="padding: 0 0 16px 0;">
                        <div style="margin: 6px 14px 10px 14px; padding: 16px; border-radius: 12px; background: rgba(30, 41, 59, 0.75); border: 1px solid rgba(99, 102, 241, 0.25); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                                <strong style="color: #818cf8; font-size: 0.88rem; display: flex; align-items: center; gap: 6px;">
                                    <span>🏷️ Modelos, Marcas e Informações em "${this.escapeHtml(r.category)}"</span>
                                </strong>
                                <span style="font-size: 0.78rem; color: var(--text-muted);">
                                    ${u.length} ${u.length===1?"modelo cadastrado":"modelos cadastrados"}
                                </span>
                            </div>
                            
                            ${u.length===0?`
                                <div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 0.85rem;">
                                    Nenhum equipamento cadastrado nesta categoria ainda.
                                </div>
                            `:`
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                                        <thead>
                                            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); color: var(--text-muted); text-align: left;">
                                                <th style="padding: 8px 10px; font-size: 0.75rem;">EQUIPAMENTO / MODELO</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem;">MARCA / FABRICANTE</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem; text-align: center; color: #34d399;">🟢 ESTOQUE</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem; text-align: center; color: #60a5fa;">🔵 EM USO</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem; text-align: center; color: #fbbf24;">🟡 MANUT.</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem; text-align: center; color: #f87171;">🔴 BAIXA</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem; text-align: center; color: #fff;">TOTAL</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem;">INFORMAÇÕES / NOTAS</th>
                                                <th style="padding: 8px 10px; font-size: 0.75rem; text-align: right;">AÇÃO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${u.map(f=>`
                                                <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                                                    <td style="padding: 9px 10px; font-weight: 600; color: #fff;">
                                                        ${this.escapeHtml(f.name)}
                                                    </td>
                                                    <td style="padding: 9px 10px; color: #a5b4fc;">
                                                        ${f.brand_model?`<span style="background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.25); padding: 2px 7px; border-radius: 4px; font-weight: 600;">${this.escapeHtml(f.brand_model)}</span>`:'<span style="color: var(--text-muted);">-</span>'}
                                                    </td>
                                                    <td style="padding: 9px 10px; text-align: center; color: #34d399; font-weight: 700; font-family: 'Space Mono', monospace;">${f.available}</td>
                                                    <td style="padding: 9px 10px; text-align: center; color: #60a5fa; font-weight: 700; font-family: 'Space Mono', monospace;">${f.inUse}</td>
                                                    <td style="padding: 9px 10px; text-align: center; color: #fbbf24; font-weight: 700; font-family: 'Space Mono', monospace;">${f.maintenance}</td>
                                                    <td style="padding: 9px 10px; text-align: center; color: #f87171; font-weight: 700; font-family: 'Space Mono', monospace;">${f.desativado}</td>
                                                    <td style="padding: 9px 10px; text-align: center; color: #fff; font-weight: 800; font-family: 'Space Mono', monospace;">${f.total}</td>
                                                    <td style="padding: 9px 10px; color: var(--text-muted); font-size: 0.78rem; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                                        ${this.escapeHtml(f.items[0]?.notes||"Sem observações")}
                                                    </td>
                                                    <td style="padding: 9px 10px; text-align: right;">
                                                        <button class="btn-secondary btn-pool-move-model" data-key="${this.escapeHtml(f.key)}" style="padding: 4px 10px; font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); font-weight: 600; border-radius: 6px; cursor: pointer;">
                                                            ⚡ Movimentar
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join("")}
                                        </tbody>
                                    </table>
                                </div>
                            `}
                        </div>
                    </td>
                </tr>
            `}),e.innerHTML=s,e.querySelectorAll(".pool-category-row").forEach(r=>{r.addEventListener("click",i=>{const l=r.getAttribute("data-cat"),c=r.getAttribute("data-target"),u=document.getElementById(`dropdown-${c}`),p=document.getElementById(`toggle-icon-${c}`);Ge.has(l)?(Ge.delete(l),u&&u.classList.add("hidden"),p&&(p.textContent="▶")):(Ge.add(l),u&&u.classList.remove("hidden"),p&&(p.textContent="▼"))})}),e.querySelectorAll(".btn-pool-move-model").forEach(r=>{r.addEventListener("click",i=>{i.stopPropagation();const l=r.getAttribute("data-key");this.openMovementModal("in",l)})}),t&&(t.innerHTML=`
                <tr>
                    <td style="font-weight: 800; color: #fff; letter-spacing: 0.05em;">TOTAL GERAL DO POOL</td>
                    <td class="pool-cell-number" style="color: #34d399; font-size: 1.1rem;">${o.totalActive}</td>
                    <td class="pool-cell-number" style="color: #60a5fa; font-size: 1.1rem;">${o.totalReserve}</td>
                    <td class="pool-cell-number" style="color: #fbbf24; font-size: 1.1rem;">${o.totalMaintenance}</td>
                    <td class="pool-cell-number" style="color: #f87171; font-size: 1.1rem;">${o.totalDesativado}</td>
                    <td class="pool-cell-number" style="color: #fff; font-size: 1.2rem; background: rgba(99, 102, 241, 0.2);">${o.totalGrand}</td>
                    <td style="text-align: center;">
                        <div style="font-weight: 800; font-size: 0.9rem; color: #a5b4fc; font-family: monospace;">${o.grandUsagePct}%</div>
                    </td>
                </tr>
            `)},renderPoolProductsTable(){const e=document.getElementById("pool-products-tbody");if(!e)return;let t=this.getProductCatalog();if(W!=="all"&&(t=t.filter(n=>n.category===W)),t.length===0){e.innerHTML=`
                <tr>
                    <td colspan="7" style="text-align: center; padding: 25px; color: var(--text-muted);">
                        Nenhum produto cadastrado no catálogo com a categoria selecionada.
                    </td>
                </tr>
            `;return}e.innerHTML=t.map(n=>{let o;return n.available>1?o=`<span class="badge" style="background: rgba(16, 185, 129, 0.18); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🟢 Disponível (${n.available} un)</span>`:n.available===1?o='<span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🟡 Estoque Baixo (1 un)</span>':o='<span class="badge" style="background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">🔴 Sem Estoque (0 un)</span>',`
                <tr>
                    <td style="font-weight: 600; color: #fff;">
                        <span style="display: block; font-size: 0.92rem;">${this.escapeHtml(n.name)}</span>
                        ${n.brand_model?`<span style="font-size: 0.75rem; color: var(--text-muted);">${this.escapeHtml(n.brand_model)}</span>`:""}
                    </td>
                    <td style="color: #cbd5e1; font-size: 0.85rem;">
                        <span style="background: rgba(255,255,255,0.06); padding: 3px 8px; border-radius: 6px;">
                            ${this.escapeHtml(n.category)}
                        </span>
                    </td>
                    <td class="pool-cell-number" style="color: #34d399; font-size: 1.05rem;">
                        <strong>${n.available}</strong>
                    </td>
                    <td class="pool-cell-number" style="color: #60a5fa;">
                        ${n.inUse}
                    </td>
                    <td class="pool-cell-number" style="color: #fbbf24;">
                        ${n.maintenance}
                    </td>
                    <td class="pool-cell-number" style="color: #fff; font-size: 1.05rem; background: rgba(255,255,255,0.02);">
                        ${n.total}
                    </td>
                    <td style="text-align: center;">
                        ${o}
                    </td>
                </tr>
            `}).join("")},exportPoolProductsToCSV(){let e=this.getProductCatalog();if(W!=="all"&&(e=e.filter(l=>l.category===W)),e.length===0){this.showToast("info","Sem dados de produtos para exportar.");return}const t=["Produto / Modelo","Categoria","Disponível em Estoque (Reserva)","Em Uso (Ativo)","Em Manutenção","Desativado","Total Geral","Status Estoque"],n=e.map(l=>{const c=l.available>1?`Disponível (${l.available} un)`:l.available===1?"Estoque Baixo (1 un)":"Sem Estoque (0 un)";return[l.name,l.category,l.available,l.inUse,l.maintenance,l.desativado,l.total,c]});let o="\uFEFF";o+=t.map(l=>`"${l.replace(/"/g,'""')}"`).join(";")+`\r
`,n.forEach(l=>{o+=l.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(";")+`\r
`});const a=new Blob([o],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(a),r=document.createElement("a"),i=new Date().toISOString().slice(0,10);r.setAttribute("href",s),r.setAttribute("download",`disponibilidade_estoque_produtos_${i}.csv`),document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s),this.showToast("success","Relatório de disponibilidade de produtos exportado com sucesso.")},exportPoolMatrixToCSV(){const{matrix:e,totals:t}=this.getCategoryMatrixData();if(!e||e.length===0){this.showToast("info","Sem dados na matriz para exportar.");return}const n=["Categoria","Ativo / Em Uso","Estoque / Reserva","Em Manutenção","Desativado","Total Geral","% Em Uso"],o=e.map(c=>[c.category,c.active,c.reserve,c.maintenance,c.desativado,c.total,`${c.usagePct}%`]);o.push(["TOTAL GERAL DO POOL",t.totalActive,t.totalReserve,t.totalMaintenance,t.totalDesativado,t.totalGrand,`${t.grandUsagePct}%`]);let a="\uFEFF";a+=n.map(c=>`"${c.replace(/"/g,'""')}"`).join(";")+`\r
`,o.forEach(c=>{a+=c.map(u=>`"${String(u).replace(/"/g,'""')}"`).join(";")+`\r
`});const s=new Blob([a],{type:"text/csv;charset=utf-8;"}),r=URL.createObjectURL(s),i=document.createElement("a"),l=new Date().toISOString().slice(0,10);i.setAttribute("href",r),i.setAttribute("download",`pool_resumo_matriz_${l}.csv`),document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r),this.showToast("success","Matriz do Pool exportada com sucesso.")},exportPoolGridToCSV(){if(!S||S.length===0){this.showToast("info","Nenhum equipamento para exportar.");return}let e=this.getFilteredPoolItems();const t=["ID","Patrimônio","Nome","Categoria","Marca / Modelo","Status Pool","Localização / Setor","Responsável","Nº de Série","Endereço IP","Endereço MAC","Data de Compra","Vencimento Garantia","Observações"],n=e.map(l=>[l.id,l.asset_tag||"",l.name||"",l.category||"",l.brand_model||"",l.status||"",l.location||"",l.assigned_to||"",l.serial_number||"",l.ip_address||"",l.mac_address||"",l.purchase_date||"",l.warranty_expires||"",(l.notes||"").replace(/\r?\n/g," ")]);let o="\uFEFF";o+=t.map(l=>`"${l.replace(/"/g,'""')}"`).join(";")+`\r
`,n.forEach(l=>{o+=l.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(";")+`\r
`});const a=new Blob([o],{type:"text/csv;charset=utf-8;"}),s=URL.createObjectURL(a),r=document.createElement("a"),i=new Date().toISOString().slice(0,10);r.setAttribute("href",s),r.setAttribute("download",`pool_ativos_geral_${i}.csv`),document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(s),this.showToast("success",`Planilha do Pool exportada (${e.length} itens).`)},openItemDetailsModal(e){const t=document.getElementById("modal-inv-details");if(!t||!e)return;t.setAttribute("data-item-id",e.id),d.setText("inv-detail-asset-tag",e.asset_tag||"S/P-"+e.id),d.setText("inv-detail-name",e.name||"Sem nome"),d.setText("inv-detail-brand",e.brand_model||"Modelo não especificado"),d.setText("inv-detail-category",e.category||"Outro"),d.setText("inv-detail-serial",e.serial_number||"-"),d.setText("inv-detail-location",e.location||"Não informado"),d.setText("inv-detail-assigned",e.assigned_to||"Sem responsável atribuído"),d.setText("inv-detail-ip",e.ip_address||"-"),d.setText("inv-detail-mac",e.mac_address||"-"),d.setText("inv-detail-purchase-date",e.purchase_date?this.formatDateBR(e.purchase_date):"-"),d.setText("inv-detail-notes",e.notes||"Nenhuma observação cadastrada.");const n=document.getElementById("inv-detail-status-badge");if(n){const a=(e.status||"ativo").toLowerCase(),s={ativo:"Ativo / Em Uso",manutencao:"Em Manutenção",reserva:"Reserva / Estoque",desativado:"Desativado"},r={ativo:"#34d399",manutencao:"#fbbf24",reserva:"#60a5fa",desativado:"#f87171"};n.innerHTML=`
                <span class="badge" style="background: rgba(255,255,255,0.08); color: ${r[a]||"#fff"}; border: 1px solid ${r[a]||"#fff"}; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 12px;">
                    ● ${s[a]||e.status}
                </span>
            `}const o=document.getElementById("inv-detail-warranty-wrapper");if(o)if(!e.warranty_expires)o.innerHTML='<span style="color: var(--text-muted);">-</span>';else{const a=new Date(e.warranty_expires),s=new Date;s.setHours(0,0,0,0);const r=a.getTime()-s.getTime(),i=Math.ceil(r/(1e3*60*60*24));i>=0?o.innerHTML=`
                        <span class="warranty-badge-valid">
                            ✓ Em Garantia (${this.formatDateBR(e.warranty_expires)} - restam ${i} dias)
                        </span>
                    `:o.innerHTML=`
                        <span class="warranty-badge-expired">
                            ⚠ Expirada (${this.formatDateBR(e.warranty_expires)} - vencida há ${Math.abs(i)} dias)
                        </span>
                    `}t.classList.remove("hidden")},openEditForm(e){this.resetForm(),d.setValue("inv-form-id",e.id),d.setValue("inv-form-name",e.name||""),d.setValue("inv-form-category",e.category||"Outro"),d.setValue("inv-form-brand-model",e.brand_model||""),d.setValue("inv-form-notes",e.notes||"");const t=document.getElementById("group-inv-form-qty");t&&(t.style.display="none");const n=document.getElementById("btn-inv-form-save");n&&(n.textContent="Salvar Alterações");const o=document.getElementById("inv-form-title");o&&(o.innerHTML=`
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Editar Equipamento #${e.id} - ${this.escapeHtml(e.name)}
            `),this.switchTab("config")},resetForm(){const e=document.getElementById("inventory-form");e&&e.reset(),d.setValue("inv-form-id","");const t=document.getElementById("group-inv-form-qty");t&&(t.style.display="block");const n=document.getElementById("inv-form-quantity");n&&(n.value="1");const o=document.getElementById("btn-inv-form-save");o&&(o.textContent="Cadastrar Equipamento");const a=document.getElementById("inv-form-product-match");a&&(a.classList.add("hidden"),a.innerHTML="");const s=document.getElementById("inv-form-title");s&&(s.innerHTML=`
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Cadastrar Equipamento no Catálogo
            `)},async handleSaveItem(){const e=d.getValue("inv-form-id"),t=d.getValue("inv-form-name");if(!t||!t.trim()){this.showToast("error","O nome do equipamento é obrigatório.");return}const n=L.getUser(),o=n?`${n.name} (${n.email})`:"Usuário TI",a=d.getValue("inv-form-category")||"Outro",s=d.getValue("inv-form-brand-model")||"",r=d.getValue("inv-form-notes")||"",i=Math.max(1,parseInt(d.getValue("inv-form-quantity"))||1);try{if(e){const p=S.find(f=>f.id===Number(e)),m={name:t.trim(),category:a,brand_model:s,status:p?.status||"reserva",location:p?.location||"",assigned_to:p?.assigned_to||"",asset_tag:p?.asset_tag||"",serial_number:p?.serial_number||"",notes:r,performed_by:o};await b.put(`/inventory/${e}`,m),ct=Number(e),this.showToast("success",`Equipamento "${m.name}" atualizado com sucesso!`)}else{const p={name:t.trim(),category:a,brand_model:s,status:"reserva",location:"Estoque / TI",assigned_to:"",notes:r||"Equipamento cadastrado no catálogo",quantity:i,asset_tag_prefix:"PAT",performed_by:o};await b.post("/inventory/batch",p),this.showToast("success",`Equipamento "${t.trim()}" cadastrado com sucesso (${i} ${i===1?"unidade adicionada ao estoque":"unidades adicionadas ao estoque"})!`)}const l=document.getElementById("inv-search-input"),c=document.getElementById("inv-filter-category"),u=document.getElementById("inv-filter-status");l&&(l.value=""),c&&(c.value="all"),u&&(u.value="all"),V=1,this.resetForm(),await this.switchTab("monitoring")}catch(l){console.error("Erro ao salvar item de inventário:",l),this.showToast("error","Erro ao salvar equipamento: "+(l.message||"Falha na requisição."))}},async deleteItem(e,t){if(!confirm(`Tem certeza que deseja excluir o equipamento "${t}"? Esta ação registrará um log de exclusão no histórico.`))return;const n=L.getUser(),o=n?`${n.name} (${n.email})`:"Usuário TI";try{await b.delete(`/inventory/${e}?performed_by=${encodeURIComponent(o)}`),this.showToast("success",`Equipamento "${t}" excluído.`),await this.fetch()}catch(a){console.error("Erro ao excluir item:",a),this.showToast("error","Erro ao excluir equipamento: "+(a.message||"Falha na requisição."))}},async fetchCategories(){try{const e=await b.get("/inventory/categories");ue=Array.isArray(e)&&e.length>0?e:ze,this.renderCategoryDropdowns(),this.renderCategoryTable()}catch(e){console.error("Erro ao buscar categorias:",e),ue=ze,this.renderCategoryDropdowns(),this.renderCategoryTable()}},renderCategoryDropdowns(){const e=document.getElementById("inv-filter-category"),t=document.getElementById("inv-form-category"),n=document.getElementById("pool-filter-category"),o=ue&&ue.length>0?ue:ze;if(e){const a=e.value;let s='<option value="all">Todas as Categorias</option>';o.forEach(r=>{s+=`<option value="${this.escapeHtml(r.name)}">${this.escapeHtml(r.name)}</option>`}),e.innerHTML=s,a&&Array.from(e.options).some(r=>r.value===a)&&(e.value=a)}if(t){const a=t.value;let s="";o.forEach(r=>{s+=`<option value="${this.escapeHtml(r.name)}">${this.escapeHtml(r.name)}</option>`}),t.innerHTML=s,a&&Array.from(t.options).some(r=>r.value===a)&&(t.value=a)}if(n){const a=n.value||W;let s='<option value="all">📁 Todas as Categorias (Geral)</option>';o.forEach(r=>{const i=S.filter(l=>(l.category||"Outro")===r.name).length;s+=`<option value="${this.escapeHtml(r.name)}">${this.escapeHtml(r.name)} (${i})</option>`}),n.innerHTML=s,a&&Array.from(n.options).some(r=>r.value===a)&&(n.value=a)}},renderCategoryTable(){const e=document.getElementById("inv-cat-table-body"),t=document.getElementById("inv-cat-count"),n=ue&&ue.length>0?ue:ze;t&&(t.textContent=`${n.length} ${n.length===1?"categoria":"categorias"}`),e&&(e.innerHTML=n.map(o=>`
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 10px; font-weight: 600; color: #fff;">${this.escapeHtml(o.name)}</td>
                <td style="padding: 10px; color: var(--text-muted); font-size: 0.85rem;">${this.escapeHtml(o.description||"-")}</td>
                <td style="padding: 10px;">
                    ${o.is_system?'<span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;">Padrão do Sistema</span>':'<span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); padding: 3px 8px; border-radius: 12px; font-size: 0.75rem;">Personalizada</span>'}
                </td>
                <td style="padding: 10px; text-align: right;">
                    ${o.is_system?'<span style="font-size: 0.75rem; color: var(--text-muted);">-</span>':`
                        <button class="btn-icon btn-delete-cat" data-id="${o.id}" data-name="${this.escapeHtml(o.name)}" title="Excluir Categoria" style="color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 6px; border-radius: 6px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    `}
                </td>
            </tr>
        `).join(""),e.querySelectorAll(".btn-delete-cat").forEach(o=>{o.addEventListener("click",()=>{const a=Number(o.getAttribute("data-id")),s=o.getAttribute("data-name");this.deleteCategory(a,s)})}))},async handleSaveCategory(){const e=document.getElementById("inv-cat-name"),t=document.getElementById("inv-cat-desc"),n=e?e.value.trim():"",o=t?t.value.trim():"";if(!n){this.showToast("error","Por favor, informe o nome da categoria.");return}try{await b.post("/inventory/categories",{name:n,description:o}),e&&(e.value=""),t&&(t.value=""),await this.fetchCategories(),this.showToast("success",`Categoria "${n}" criada com sucesso!`)}catch(a){console.error("Erro ao salvar categoria:",a),this.showToast("error","Erro ao criar categoria: "+(a.message||"Falha na requisição."))}},async deleteCategory(e,t){if(confirm(`Deseja realmente excluir a categoria "${t}"?`))try{await b.delete(`/inventory/categories/${e}`),await this.fetchCategories(),this.showToast("success",`Categoria "${t}" excluída.`)}catch(n){console.error("Erro ao excluir categoria:",n),this.showToast("error","Erro ao excluir categoria: "+(n.message||"Falha na requisição."))}},setupMovementAutocomplete(){const e=document.getElementById("inv-move-item-input"),t=document.getElementById("inv-move-item-id"),n=document.getElementById("btn-inv-move-clear-select"),o=document.getElementById("inv-move-autocomplete-list");if(["in","use","maint","out"].forEach(r=>{const i=document.getElementById(`btn-type-${r}`);i&&i.addEventListener("click",()=>{this.setMovementType(r)})}),!e||!o)return;let a=-1;const s=(r="")=>{const i=this.getProductCatalog(),l=r.trim().toLowerCase(),c=l?i.filter(p=>p.name.toLowerCase().includes(l)||p.category&&p.category.toLowerCase().includes(l)):i;if(c.length===0){o.innerHTML=`
                    <div style="padding: 14px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
                        Nenhum equipamento cadastrado corresponde a "${this.escapeHtml(r)}"
                    </div>
                `,o.classList.remove("hidden");return}let u="";c.forEach((p,m)=>{const f=this.highlightMatch(p.name,l),y=this.highlightMatch(p.category||"Outro",l);u+=`
                    <div class="inv-autocomplete-item" data-key="${this.escapeHtml(p.key)}" data-name="${this.escapeHtml(p.name)}" data-category="${this.escapeHtml(p.category||"Outro")}" data-index="${m}">
                        <div>
                            <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${f}</div>
                            <div style="font-size: 0.75rem; color: #818cf8; margin-top: 2px;">📁 ${y}</div>
                        </div>
                        <div style="text-align: right; font-size: 0.72rem; font-family: 'Space Mono', monospace; display: flex; flex-direction: column; gap: 2px;">
                            <span style="color: #34d399; font-weight: 600;">🟢 ${p.available} no Estoque</span>
                            <span style="color: #60a5fa;">🔵 ${p.inUse} em Uso</span>
                            <span style="color: #fbbf24;">🟡 ${p.maintenance} em Manut.</span>
                        </div>
                    </div>
                `}),o.innerHTML=u,o.classList.remove("hidden"),a=-1,o.querySelectorAll(".inv-autocomplete-item").forEach(p=>{p.addEventListener("click",()=>{const m=p.getAttribute("data-key"),f=p.getAttribute("data-name"),y=p.getAttribute("data-category");this.selectAutocompleteProduct(m,f,y)})})};e.addEventListener("input",()=>{t.value="",n&&(n.style.display=e.value?"block":"none"),s(e.value),this.updateMovementStockSummary(null)}),e.addEventListener("focus",()=>{t.value||s(e.value)}),n&&n.addEventListener("click",()=>{e.value="",t.value="",n.style.display="none",o.classList.add("hidden"),this.updateMovementStockSummary(null),e.focus()}),document.addEventListener("click",r=>{!e.contains(r.target)&&!o.contains(r.target)&&o.classList.add("hidden")}),e.addEventListener("keydown",r=>{const i=o.querySelectorAll(".inv-autocomplete-item");if(o.classList.contains("hidden")||i.length===0){(r.key==="ArrowDown"||r.key==="Enter")&&s(e.value);return}r.key==="ArrowDown"?(r.preventDefault(),a=(a+1)%i.length,this.highlightAutocompleteItem(i,a)):r.key==="ArrowUp"?(r.preventDefault(),a=(a-1+i.length)%i.length,this.highlightAutocompleteItem(i,a)):r.key==="Enter"?(r.preventDefault(),a>=0&&i[a]?i[a].click():i.length===1&&i[0].click()):r.key==="Escape"&&o.classList.add("hidden")})},setMovementType(e){const t=document.getElementById("inv-move-type"),n=document.getElementById("inv-movement-modal-title"),o=document.getElementById("inv-movement-icon"),a=document.getElementById("lbl-inv-move-assigned-to");t&&(t.value=e),["in","use","maint","out"].forEach(r=>{const i=document.getElementById(`btn-type-${r}`);i&&(r===e?i.classList.add("active"):i.classList.remove("active"))}),e==="in"?(o&&(o.textContent="🟢"),n&&(n.innerHTML="<span>🟢</span> + Entrada de Equipamento no Estoque"),a&&(a.textContent="USUÁRIO RESPONSÁVEL (Opcional)")):e==="use"?(o&&(o.textContent="🔵"),n&&(n.innerHTML="<span>🔵 👤</span> Equipamento Em Uso / Alocação"),a&&(a.textContent="USUÁRIO RESPONSÁVEL *")):e==="maint"?(o&&(o.textContent="🟡"),n&&(n.innerHTML="<span>🟡 🔧</span> Enviar Equipamento para Manutenção"),a&&(a.textContent="USUÁRIO RESPONSÁVEL (Opcional)")):(o&&(o.textContent="🔴"),n&&(n.innerHTML="<span>🔴</span> - Saída / Baixa Definitiva"),a&&(a.textContent="USUÁRIO RESPONSÁVEL (Opcional)")),this.renderMovementActionOptions();const s=this.getSelectedMovementProduct();this.updateMovementStockSummary(s)},renderMovementActionOptions(e=null){const t=document.getElementById("inv-move-action-options"),n=document.getElementById("lbl-inv-move-action-title"),o=document.getElementById("inv-move-type"),a=o?o.value:"in",s=this.getSelectedMovementProduct();if(!t)return;let r=[];a==="in"?(n&&(n.textContent="3. AÇÃO DE ENTRADA (DESTINO: ESTOQUE) *"),r=[{id:"add_stock",title:"📦 Adicionar Novo Lote ao Estoque",desc:"Cadastra novas unidades de compra/reposição diretamente no estoque.",badge:"Novo Lote",badgeColor:"#34d399",badgeBg:"rgba(16, 185, 129, 0.25)"},{id:"return_from_use",title:"🔄 Retorno / Devolução de Item em Uso",desc:"Equipamento devolvido por colaborador; retorna para a reserva do estoque.",badge:`${s?s.inUse:0} em uso`,badgeColor:"#60a5fa",badgeBg:"rgba(59, 130, 246, 0.25)"},{id:"return_from_maint",title:"🔧 Retorno de Manutenção para o Estoque",desc:"Equipamento reparado; retorna pronto para o estoque.",badge:`${s?s.maintenance:0} em manut.`,badgeColor:"#fbbf24",badgeBg:"rgba(245, 158, 11, 0.25)"}]):a==="use"?(n&&(n.textContent="3. AÇÃO EM USO (DESTINO: COLABORADOR / SETOR) *"),r=[{id:"use_from_stock",title:"📦 Retirar do Estoque e Entregar ao Usuário",desc:"Retira itens disponíveis da reserva e aloca para o colaborador/setor.",badge:`${s?s.available:0} disp. no estoque`,badgeColor:"#34d399",badgeBg:"rgba(16, 185, 129, 0.25)"},{id:"use_direct_new",title:"✨ Adicionar Direto no Uso (Novo Item)",desc:"Cadastra novas unidades entregues diretamente ao usuário (sem passar pelo estoque).",badge:"Novo Lote",badgeColor:"#60a5fa",badgeBg:"rgba(59, 130, 246, 0.25)"}]):a==="maint"?(n&&(n.textContent="3. ORIGEM DO ENVIO PARA MANUTENÇÃO *"),r=[{id:"maint_from_use",title:"👤 Retirar de Em Uso e Enviar para Manutenção",desc:"Equipamento com defeito que estava com colaborador; enviado para conserto.",badge:`${s?s.inUse:0} em uso`,badgeColor:"#60a5fa",badgeBg:"rgba(59, 130, 246, 0.25)"},{id:"maint_from_stock",title:"📦 Retirar do Estoque e Enviar para Manutenção",desc:"Equipamento do estoque que apresentou defeito; enviado para conserto.",badge:`${s?s.available:0} disp. no estoque`,badgeColor:"#34d399",badgeBg:"rgba(16, 185, 129, 0.25)"}]):(n&&(n.textContent="3. ORIGEM DA SAÍDA / BAIXA DEFINITIVA *"),r=[{id:"out_from_use",title:"👤 Retirar de Em Uso (Baixa Definitiva)",desc:"Baixa em equipamento que estava com colaborador (perda / descarte / desativação).",badge:`${s?s.inUse:0} em uso`,badgeColor:"#60a5fa",badgeBg:"rgba(59, 130, 246, 0.25)"},{id:"out_from_maint",title:"🔧 Retirar de Manutenção (Baixa / Sucata)",desc:"Equipamento sem conserto / sucata / perda irreparável em manutenção.",badge:`${s?s.maintenance:0} em manut.`,badgeColor:"#fbbf24",badgeBg:"rgba(245, 158, 11, 0.25)"},{id:"out_from_stock",title:"📦 Retirar do Estoque (Baixa / Descarte)",desc:"Baixa definitiva em equipamento que estava guardado no estoque.",badge:`${s?s.available:0} disp. no estoque`,badgeColor:"#34d399",badgeBg:"rgba(16, 185, 129, 0.25)"}]);const i=e||r[0]?.id;let l="";r.forEach(c=>{const u=c.id===i;l+=`
                <label class="inv-action-pill ${u?"active":""}" data-action="${c.id}">
                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                        <input type="radio" name="inv_movement_action" value="${c.id}" ${u?"checked":""} style="margin-top: 3px; accent-color: #6366f1;">
                        <div>
                            <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${c.title}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${c.desc}</div>
                        </div>
                    </div>
                    <span class="pool-badge" style="background: ${c.badgeBg}; color: ${c.badgeColor}; font-size: 0.72rem; white-space: nowrap; margin-left: 8px;">
                        ${c.badge}
                    </span>
                </label>
            `}),t.innerHTML=l,t.querySelectorAll(".inv-action-pill").forEach(c=>{c.addEventListener("click",()=>{t.querySelectorAll(".inv-action-pill").forEach(p=>p.classList.remove("active")),c.classList.add("active");const u=c.querySelector('input[type="radio"]');u&&(u.checked=!0),this.updateMovementStockSummary(this.getSelectedMovementProduct())})})},getSelectedMovementAction(){const e=document.querySelector('input[name="inv_movement_action"]:checked');return e?e.value:null},highlightMatch(e,t){if(!t)return this.escapeHtml(e);const n=new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi");return this.escapeHtml(e).replace(n,'<span class="match-highlight">$1</span>')},highlightAutocompleteItem(e,t){e.forEach((n,o)=>{o===t?(n.classList.add("active"),n.scrollIntoView({block:"nearest"})):n.classList.remove("active")})},getSelectedMovementProduct(){const e=document.getElementById("inv-move-item-id"),t=document.getElementById("inv-move-item-input"),n=e?.value,o=this.getProductCatalog();if(n)return o.find(s=>s.key===n)||null;const a=(t?.value||"").trim().toLowerCase();return a&&(o.find(s=>`${s.name} / ${s.category}`.toLowerCase()===a)||o.find(s=>s.name.toLowerCase()===a))||null},selectAutocompleteProduct(e,t,n){const o=document.getElementById("inv-move-item-input"),a=document.getElementById("inv-move-item-id"),s=document.getElementById("btn-inv-move-clear-select"),r=document.getElementById("inv-move-autocomplete-list"),i=document.getElementById("inv-move-location"),l=document.getElementById("inv-move-assigned-to");o&&(o.value=`${t} / ${n}`),a&&(a.value=e),s&&(s.style.display="block"),r&&r.classList.add("hidden");const u=this.getProductCatalog().find(p=>p.key===e);u&&(i&&!i.value&&(i.value=u.items[0]?.location||""),l&&!l.value&&(l.value=u.items[0]?.assigned_to||""),this.renderMovementActionOptions(this.getSelectedMovementAction()),this.updateMovementStockSummary(u))},updateMovementStockSummary(e){const t=document.getElementById("inv-move-stock-summary"),n=document.getElementById("inv-move-stock-alert"),o=this.getSelectedMovementAction();e&&t?(t.classList.remove("hidden"),d.setText("inv-move-avail-stock",e.available),d.setText("inv-move-in-use",e.inUse),d.setText("inv-move-in-maint",e.maintenance),d.setText("inv-move-total-stock",e.total),n&&(["use_from_stock","maint_from_stock","out_from_stock"].includes(o)&&e.available===0?(n.classList.remove("hidden"),n.innerHTML="⚠️ Atenção: Não há unidades disponíveis no estoque (reserva) deste produto para retirar."):["return_from_use","maint_from_use","out_from_use"].includes(o)&&e.inUse===0?(n.classList.remove("hidden"),n.innerHTML="⚠️ Atenção: Não há unidades em uso cadastradas para este produto."):["return_from_maint","out_from_maint"].includes(o)&&e.maintenance===0?(n.classList.remove("hidden"),n.innerHTML="⚠️ Atenção: Não há unidades em manutenção cadastradas para este produto."):n.classList.add("hidden"))):(t&&t.classList.add("hidden"),n&&n.classList.add("hidden"))},openMovementModal(e="in",t=null){const n=document.getElementById("modal-inv-movement"),o=document.getElementById("inv-move-item-input"),a=document.getElementById("inv-move-item-id"),s=document.getElementById("btn-inv-move-clear-select"),r=document.getElementById("inv-move-autocomplete-list"),i=document.getElementById("inv-move-quantity"),l=document.getElementById("inv-move-qty-hint"),c=document.getElementById("inv-move-location"),u=document.getElementById("inv-move-assigned-to"),p=document.getElementById("inv-move-notes");if(n){if(i&&(i.value="1"),l&&(l.textContent="(1 unidade selecionada)"),c&&(c.value=""),u&&(u.value=""),p&&(p.value=""),o&&(o.value=""),a&&(a.value=""),s&&(s.style.display="none"),r&&r.classList.add("hidden"),this.setMovementType(e),t){const f=this.getProductCatalog().find(y=>y.key===t||y.items.some(h=>h.id===Number(t)));f&&this.selectAutocompleteProduct(f.key,f.name,f.category)}n.classList.remove("hidden")}},closeMovementModal(){const e=document.getElementById("modal-inv-movement"),t=document.getElementById("form-inv-movement"),n=document.getElementById("inv-move-item-input"),o=document.getElementById("inv-move-item-id"),a=document.getElementById("btn-inv-move-clear-select"),s=document.getElementById("inv-move-autocomplete-list"),r=document.getElementById("inv-move-quantity"),i=document.getElementById("inv-move-qty-hint");e&&e.classList.add("hidden"),t&&t.reset(),n&&(n.value=""),o&&(o.value=""),a&&(a.style.display="none"),s&&s.classList.add("hidden"),r&&(r.value="1"),i&&(i.textContent="(1 unidade selecionada)"),this.updateMovementStockSummary(null)},async handleSaveMovement(){const e=d.getValue("inv-move-item-id"),t=(d.getValue("inv-move-item-input")||"").trim(),n=d.getValue("inv-move-type")||"in",o=this.getSelectedMovementAction(),a=d.getValue("inv-move-location"),s=d.getValue("inv-move-assigned-to"),r=d.getValue("inv-move-notes"),i=Math.max(1,parseInt(d.getValue("inv-move-quantity"))||1),l=this.getProductCatalog();let c=l.find(m=>m.key===e);if(!c&&t){const m=t.toLowerCase();c=l.find(f=>`${f.name} / ${f.category}`.toLowerCase()===m)||l.find(f=>f.name.toLowerCase()===m)}if(!c){this.showToast("error","Por favor, selecione um equipamento cadastrado válido no campo de busca.");return}if(n==="use"&&!s&&o!=="add_stock"){this.showToast("warning","Informe o Usuário Responsável para alocar o equipamento em uso.");const m=document.getElementById("inv-move-assigned-to");m&&m.focus();return}const u=L.getUser(),p=u?`${u.name} (${u.email})`:"Usuário TI";try{if(o==="add_stock"||o==="use_direct_new"){const g=c.items[0],v=o==="use_direct_new"?"ativo":"reserva",w=o==="use_direct_new"?"Adicionado diretamente em uso":"Entrada em lote no estoque",x={name:c.name,category:c.category||"Outro",brand_model:c.brand_model||g?.brand_model||"",status:v,location:a||g?.location||"",assigned_to:o==="use_direct_new"?s:"",purchase_date:g?.purchase_date||"",warranty_expires:g?.warranty_expires||"",notes:r||g?.notes||w,quantity:i,asset_tag_prefix:g?.asset_tag?g.asset_tag.split("-")[0]:"PAT",performed_by:p};await b.post("/inventory/batch",x),this.closeMovementModal(),this.showToast("success",`${i} ${i===1?"unidade":"unidades"} de "${c.name} / ${c.category}" ${o==="use_direct_new"?"alocadas em uso com sucesso!":"adicionadas ao estoque com sucesso!"}`),await this.fetch();return}const m=S.filter(g=>this.getProductKey(g.name,g.category)===c.key);let f=[],y="reserva",h="";if(o==="return_from_use"){y="reserva";const g=m.filter(v=>(v.status||"").toLowerCase()==="ativo");if(g.length===0){this.showToast("error",`Não há unidades em uso de "${c.name}" para devolução.`);return}if(g.length<i){this.showToast("error",`Quantidade solicitada (${i}) maior que o saldo em uso (${g.length} un.).`);return}f=g.slice(0,i),h=`Devolução concluída: ${f.length} ${f.length===1?"unidade retornou":"unidades retornaram"} ao estoque.`}else if(o==="return_from_maint"){y="reserva";const g=m.filter(v=>(v.status||"").toLowerCase()==="manutencao");if(g.length===0){this.showToast("error",`Não há unidades em manutenção de "${c.name}" para retornar.`);return}if(g.length<i){this.showToast("error",`Quantidade solicitada (${i}) maior que o saldo em manutenção (${g.length} un.).`);return}f=g.slice(0,i),h=`Retorno de manutenção concluído: ${f.length} ${f.length===1?"unidade retornou":"unidades retornaram"} ao estoque.`}else if(o==="use_from_stock"){y="ativo";const g=m.filter(v=>(v.status||"").toLowerCase()==="reserva");if(g.length===0){this.showToast("error",`Não há unidades no estoque (reserva) de "${c.name}".`);return}if(g.length<i){this.showToast("error",`Saldo insuficiente no estoque: apenas ${g.length} ${g.length===1?"unidade disponível":"unidades disponíveis"}.`);return}f=g.slice(0,i),h=`Alocação concluída: ${f.length} ${f.length===1?"unidade alocada":"unidades alocadas"} para ${s||"o responsável"}.`}else if(o==="maint_from_use"){y="manutencao";const g=m.filter(v=>(v.status||"").toLowerCase()==="ativo");if(g.length===0){this.showToast("error",`Não há unidades em uso de "${c.name}" para enviar à manutenção.`);return}if(g.length<i){this.showToast("error",`Quantidade solicitada (${i}) maior que o saldo em uso (${g.length} un.).`);return}f=g.slice(0,i),h=`Envio para manutenção concluído: ${f.length} ${f.length===1?"unidade enviada":"unidades enviadas"}.`}else if(o==="maint_from_stock"){y="manutencao";const g=m.filter(v=>(v.status||"").toLowerCase()==="reserva");if(g.length===0){this.showToast("error",`Não há unidades no estoque de "${c.name}" para enviar à manutenção.`);return}if(g.length<i){this.showToast("error",`Saldo insuficiente no estoque: apenas ${g.length} ${g.length===1?"unidade disponível":"unidades disponíveis"}.`);return}f=g.slice(0,i),h=`Envio para manutenção concluído: ${f.length} ${f.length===1?"unidade do estoque enviada":"unidades do estoque enviadas"}.`}else if(o==="out_from_use"){y="desativado";const g=m.filter(v=>(v.status||"").toLowerCase()==="ativo");if(g.length===0){this.showToast("error",`Não há unidades em uso de "${c.name}" para dar saída.`);return}if(g.length<i){this.showToast("error",`Quantidade solicitada (${i}) maior que o saldo em uso (${g.length} un.).`);return}f=g.slice(0,i),h=`Saída / Baixa concluída: ${f.length} ${f.length===1?"unidade desativada":"unidades desativadas"}.`}else if(o==="out_from_maint"){y="desativado";const g=m.filter(v=>(v.status||"").toLowerCase()==="manutencao");if(g.length===0){this.showToast("error",`Não há unidades em manutenção de "${c.name}" para dar baixa.`);return}if(g.length<i){this.showToast("error",`Quantidade solicitada (${i}) maior que o saldo em manutenção (${g.length} un.).`);return}f=g.slice(0,i),h=`Baixa por sucata / defeito concluída: ${f.length} ${f.length===1?"unidade baixada":"unidades baixadas"}.`}else if(o==="out_from_stock"){y="desativado";const g=m.filter(v=>(v.status||"").toLowerCase()==="reserva");if(g.length===0){this.showToast("error",`Não há unidades no estoque de "${c.name}" para dar saída.`);return}if(g.length<i){this.showToast("error",`Saldo insuficiente no estoque: apenas ${g.length} ${g.length===1?"unidade disponível":"unidades disponíveis"}.`);return}f=g.slice(0,i),h=`Saída do estoque concluída: ${f.length} ${f.length===1?"unidade desativada":"unidades desativadas"}.`}if(f.length===0){this.showToast("error","Nenhum item disponível para a movimentação selecionada.");return}await Promise.all(f.map(g=>{const v={name:g.name,category:g.category,status:y,brand_model:g.brand_model,asset_tag:g.asset_tag,serial_number:g.serial_number,location:a!==void 0?a:g.location,assigned_to:y==="reserva"||y==="desativado"?"":s!==void 0?s:g.assigned_to,ip_address:g.ip_address,mac_address:g.mac_address,purchase_date:g.purchase_date,warranty_expires:g.warranty_expires,notes:r?g.notes?g.notes+" | "+r:r:g.notes,performed_by:p};return b.put(`/inventory/${g.id}`,v)})),this.closeMovementModal(),this.showToast("success",h||`Movimentação de ${f.length} unidades concluída com sucesso!`),await this.fetch(f[0]?.id)}catch(m){console.error("Erro ao salvar movimentação:",m),this.showToast("error","Erro ao registrar movimentação: "+(m.message||"Falha na requisição."))}},exportToCSV(){if(!S||S.length===0){this.showToast("info","Nenhum equipamento para exportar.");return}const e=["ID","Patrimônio","Nome","Categoria","Marca / Modelo","Status","Localização / Setor","Responsável","Nº de Série","Endereço IP","Endereço MAC","Data de Compra","Vencimento Garantia","Observações"],t=S.map(i=>[i.id,i.asset_tag||"",i.name||"",i.category||"",i.brand_model||"",i.status||"",i.location||"",i.assigned_to||"",i.serial_number||"",i.ip_address||"",i.mac_address||"",i.purchase_date||"",i.warranty_expires||"",(i.notes||"").replace(/\r?\n/g," ")]);let n="\uFEFF";n+=e.map(i=>`"${i.replace(/"/g,'""')}"`).join(";")+`\r
`,t.forEach(i=>{n+=i.map(l=>`"${String(l).replace(/"/g,'""')}"`).join(";")+`\r
`});const o=new Blob([n],{type:"text/csv;charset=utf-8;"}),a=URL.createObjectURL(o),s=document.createElement("a"),r=new Date().toISOString().slice(0,10);s.setAttribute("href",a),s.setAttribute("download",`inventario_ti_${r}.csv`),document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(a),this.showToast("success",`Exportação concluída (${S.length} itens exportados).`)},showToast(e,t){let n=document.getElementById("inv-toast-container");n||(n=document.createElement("div"),n.id="inv-toast-container",n.className="inv-toast-container",document.body.appendChild(n));const o={success:"✅",error:"❌",info:"ℹ️"},a=document.createElement("div");a.className=`inv-toast ${e}`,a.innerHTML=`
            <span>${o[e]||"🔔"}</span>
            <div style="flex: 1;">${this.escapeHtml(t)}</div>
        `,n.appendChild(a),setTimeout(()=>{a.classList.add("fade-out"),setTimeout(()=>{a.parentElement&&a.parentElement.removeChild(a)},300)},4e3)},formatDateBR(e){if(!e)return"-";try{const t=e.split("-");return t.length===3?`${t[2]}/${t[1]}/${t[0]}`:e}catch{return e}},escapeHtml(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}};let fe="docs";document.addEventListener("DOMContentLoaded",async()=>{console.log("%c 🚀 SISTEMA TI: INICIALIZANDO (MODULAR)... ","background: #4f46e5; color: white; font-weight: bold;"),window.auth=L,Zt(),en(),tn(),ft.init(),Te.init(),xt.init(),L.init()?(console.log("Sessão restaurada:",L.getUser().email),At()):_t()});let mt,ke,Re,Oe;function Zt(){mt=document.querySelectorAll(".nav-btn"),ke=document.getElementById("btn-new-item"),Re=document.getElementById("login-section"),Oe=document.getElementById("app-container")}function _t(){Re&&Re.classList.remove("hidden"),Oe&&Oe.classList.add("hidden"),document.body.style.overflow="hidden"}function en(){const e=new Date().getFullYear();[document.getElementById("filter-cal-year")].forEach(n=>{if(n&&n.options.length<=1)for(let o=e-5;o<=e+5;o++){const a=document.createElement("option");a.value=o,a.textContent=o,o===e&&(a.selected=!0),n.appendChild(a)}})}function At(){if(Re&&Re.classList.add("hidden"),Oe&&Oe.classList.remove("hidden"),document.body.style.overflow="",fe="docs",Qe(),O.fetch(),X.fetch(),Je.fetch(),M.fetch(),window.auth){const e=document.getElementById("timeline-tab-anexo");e&&(window.auth.isAdmin()?e.classList.remove("role-hidden"):e.classList.add("role-hidden"));const t=document.getElementById("timeline-tab-config");t&&(window.auth.isAdmin()?t.classList.remove("role-hidden"):t.classList.add("role-hidden"))}}function Ht(){const e=L.getUser();e&&(d.setValue("profile-name",e.name||""),d.setValue("profile-email",e.email||""),d.setValue("profile-role",e.role||""),d.setValue("profile-password",""))}function Qe(){switch(["account-section","docs-section","list-section","detail-section","users-section","accounts-section","timeline-section","dedicated-account-page","telephony-section","inventory-section"].forEach(e=>{d.hide(e)}),ke&&ke.classList.add("hidden"),wt.stop(),fe){case"account":case"profile":d.show("account-section"),d.setText("section-title","Minha Conta"),Ht(),setTimeout(()=>wt.start(),100);break;case"list":d.show("list-section"),d.setText("section-title","Listagem Geral"),O.fetch(),L.isAdmin()&&ke&&ke.classList.remove("hidden");break;case"docs":d.show("docs-section"),d.setText("section-title","Documentação"),X.fetch();break;case"detail":d.show("detail-section"),d.setText("section-title","Procedimento");break;case"users":d.show("users-section"),d.setText("section-title","Gestão de Usuários"),Je.fetch();break;case"accounts":d.show("accounts-section"),d.setText("section-title","Gestão de Contas"),M.fetch(),M.handleSearch();break;case"timeline":d.show("timeline-section"),d.setText("section-title","Timeline"),ft.fetch();break;case"telephony":d.show("telephony-section"),d.setText("section-title","Telefonia"),Te.fetch();break;case"inventory":d.show("inventory-section"),d.setText("section-title","Inventário"),xt.fetch();break}pt()}function pt(){const e=L.isAdmin();d.toggle("nav-users",!e),d.toggle("nav-accounts",!e),ke&&ke.classList.toggle("role-hidden",!e);const t=document.getElementById("btn-floating-edit");t&&t.classList.toggle("role-hidden",!e),document.querySelectorAll(".btn-actions-container").forEach(r=>{r.classList.toggle("role-hidden",!e)}),["th-proc-actions","th-user-actions","th-account-actions","th-doc-actions"].forEach(r=>{const i=document.getElementById(r);i&&i.classList.toggle("role-hidden",!e)});const n=document.getElementById("btn-new-user");n&&n.classList.toggle("role-hidden",!e);const o=document.getElementById("btn-new-account");o&&o.classList.toggle("role-hidden",!e);const a=document.getElementById("btn-new-doc");a&&a.classList.toggle("role-hidden",!e);const s=L.getUser();if(s){let r=s.name;(r.toLowerCase().startsWith("usuário ")||r.toLowerCase().startsWith("usuario "))&&(r=r.substring(8)),d.setText("profile-name-display",r),d.setText("profile-role-display",s.role);let i=r.substring(0,2).toUpperCase();const l=r.trim().split(/\s+/);l.length>1&&(i=(l[0][0]+l[l.length-1][0]).toUpperCase()),d.setText("profile-avatar-initials",i)}}function tn(){const e=document.getElementById("sidebar"),t=document.getElementById("sidebar-toggle");t&&e&&t.addEventListener("click",()=>{e.classList.toggle("collapsed")}),mt.forEach(i=>{i.addEventListener("click",()=>{if(mt.forEach(l=>l.classList.remove("active")),i.classList.add("active"),fe=i.dataset.section,window.dispatchEvent(new CustomEvent("SectionChange",{detail:{section:fe}})),Qe(),window.innerWidth<=768){e.classList.remove("open");const l=document.getElementById("sidebar-overlay");l&&l.classList.remove("active")}})}),window.addEventListener("SectionChange",i=>{fe=i.detail.section,Qe()});const n=async i=>{i&&(i.preventDefault(),i.stopPropagation());const l=document.getElementById("login-btn"),c=document.getElementById("login-error"),u=d.getValue("login-email"),p=d.getValue("login-password");if(c&&c.classList.add("hidden"),!u||!p)return c&&(c.innerText="Por favor, informe o e-mail e a senha.",c.classList.remove("hidden")),!1;l&&(l.disabled=!0,l.innerText="Entrando...");try{const m=await L.login(u,p);m.success?At():c&&(c.innerText=m.error||"Credenciais inválidas. Tente novamente.",c.classList.remove("hidden"))}catch(m){c&&(c.innerText=m.message||"Erro de conexão com o servidor.",c.classList.remove("hidden"))}finally{l&&(l.disabled=!1,l.innerText="Entrar")}return!1};d.on("login-form","submit",n),d.on("login-btn","click",n),d.on("btn-logout","click",()=>{const i=document.getElementById("auto-refresh-toggle");i&&i.checked&&(i.checked=!1,i.dispatchEvent(new Event("change"))),L.logout(),_t()}),document.querySelectorAll(".close-modal").forEach(i=>{i.addEventListener("click",()=>{const l=i.closest(".modal");l&&l.classList.add("hidden")})}),window.UsersHandler=Je,window.DocsHandler=X,window.ProceduresHandler=O,window.AccountsHandler=M,window.TelephonyHandler=Te,window.InventoryHandler=xt,window.keepsHandler=he,["extensions","queues","blf","users","history"].forEach(i=>{d.on(`tab-telephony-${i}`,"click",()=>Te.setActiveTab(i))}),d.on("telephony-search","input",i=>Te.search(i.target.value.toLowerCase())),d.on("telephony-page-size","change",i=>Te.setPageSize(i.target.value)),d.on("telephony-reload-btn","click",()=>{const i=document.getElementById("telephony-search");i&&(i.value=""),Te.fetch()}),d.on("accounts-search","input",()=>M.handleSearch()),d.on("filter-status","change",()=>M.handleSearch()),d.on("filter-date-toggle","change",i=>{const l=document.getElementById("sidebar-mini-calendar-list");l&&(l.style.opacity=i.target.checked?"1":"0.4",l.style.pointerEvents=i.target.checked?"auto":"none"),M.handleSearch()}),d.on("filter-cal-month","change",()=>M.handleFilterChange(!0)),d.on("filter-cal-year","change",()=>M.handleFilterChange(!0)),["dash-filter-start","dash-filter-end","dash-filter-type","dash-filter-status","dash-filter-payment","dash-sort-empresas","dash-sort-categorias"].forEach(i=>{d.on(i,"change",()=>{fe==="accounts"&&M.renderDashboard()})}),d.on("btn-dash-clear-dates","click",()=>{d.setValue("dash-filter-start",""),d.setValue("dash-filter-end",""),d.setValue("dash-filter-type","Todos"),d.setValue("dash-filter-status","Todos"),d.setValue("dash-filter-payment","Todos"),M.resetMultiselects(),d.setValue("dash-sort-empresas","desc"),d.setValue("dash-sort-categorias","desc"),fe==="accounts"&&M.renderDashboard()}),d.on("profile-form","submit",async i=>{i.preventDefault();const l=L.getUser();if(!l)return;const c=d.getValue("profile-name"),u=d.getValue("profile-email"),p=d.getValue("profile-password");try{const m={name:c,email:u,role:l.role};p&&(m.password=p);const f=await b.put(`/users/${l.id}`,m),y={...l,...f};localStorage.setItem("user",JSON.stringify(y)),L.init(),pt(),Ht(),alert("Perfil atualizado com sucesso!")}catch(m){console.error("Erro ao atualizar perfil:",m),alert("Erro ao atualizar perfil: "+(m.message||"Falha na requisição"))}}),d.on("user-form","submit",i=>Je.save(i)),d.on("doc-form","submit",i=>X.handleUpload(i)),d.on("account-form","submit",i=>M.save(i)),d.on("form-new-account-category","submit",i=>M.saveCategory(i)),d.on("btn-confirm-delete-category","click",()=>M.confirmDeleteCategory()),d.on("form-quick-keep","submit",i=>he.saveQuickNote(i)),d.on("form-edit-keep","submit",i=>he.saveEditModal(i)),d.on("faq-form","submit",i=>O.saveMeta(i));const o=document.getElementById("proc-color-palette"),a=document.getElementById("proc-color");o&&a&&(o.addEventListener("click",i=>{const l=i.target.closest(".color-swatch");if(l)if(l.id==="color-custom-swatch")a.click();else{const c=l.dataset.color;c&&(a.value=c,o.querySelectorAll(".color-swatch").forEach(u=>u.classList.remove("active")),l.classList.add("active"))}}),a.addEventListener("input",i=>{const l=document.getElementById("color-custom-swatch");l&&(l.style.background=i.target.value,o.querySelectorAll(".color-swatch").forEach(c=>c.classList.remove("active")),l.classList.add("active"))})),d.on("btn-new-item","click",()=>{if(d.setText("modal-form-title","Novo Procedimento"),d.setValue("proc-id",""),d.setValue("proc-content","[]"),o){o.querySelectorAll(".color-swatch").forEach(l=>l.classList.remove("active"));const i=o.querySelector('[data-color="#4F46E5"]');i&&i.classList.add("active")}a&&(a.value="#4F46E5"),d.show("modal-form")}),d.on("btn-new-account","click",()=>M.openAccountModal()),d.on("btn-new-account-cal","click",()=>M.openAccountModal()),d.on("btn-new-user","click",()=>{document.getElementById("user-form").reset(),d.setValue("user-id-form",""),d.show("modal-user")}),d.on("list-search","input",i=>{O.search(i.target.value.toLowerCase())}),d.on("doc-search","input",i=>{const l=i.target.value;X.getActiveTab()&&X.getActiveTab().toLowerCase()==="keeps"?he.search(l):X.search(l.toLowerCase())}),d.on("doc-dash-search","input",()=>{X.renderDashboard()}),d.on("doc-dash-filter-category","change",()=>{X.renderDashboard()}),d.on("doc-dash-filter-status","change",()=>{X.renderDashboard()}),d.on("btn-new-doc","click",()=>{d.show("modal-upload")}),["geral","contratos","termo-de-uso","keeps","dashboard"].forEach(i=>{d.on(`tab-doc-${i}`,"click",()=>{let l;i==="termo-de-uso"?l="Termo de Uso":i==="dashboard"?l="dashboard":i==="keeps"?l="keeps":l=i,X.setActiveTab(l)})}),d.on("doc-category","change",i=>{const l=i.target.value.toLowerCase(),c=document.getElementById("doc-dates-container");c&&(c.style.display=l==="contratos"||l==="termo de uso"?"flex":"none")}),d.on("doc-indefinite","change",i=>{const l=document.getElementById("doc-end-date");l&&(l.disabled=i.target.checked,i.target.checked&&(l.value=""))});const s=document.getElementById("drop-zone"),r=document.getElementById("doc-file");s&&r&&(s.addEventListener("click",i=>{i.target!==r&&r.click()}),r.addEventListener("click",i=>{i.stopPropagation()}),r.addEventListener("change",i=>{i.target.files.length>0&&d.setText("file-name-display",i.target.files[0].name)}),s.addEventListener("dragover",i=>{i.preventDefault(),s.classList.add("dragover")}),s.addEventListener("dragleave",()=>{s.classList.remove("dragover")}),s.addEventListener("drop",i=>{i.preventDefault(),s.classList.remove("dragover"),i.dataTransfer.files.length>0&&(r.files=i.dataTransfer.files,d.setText("file-name-display",i.dataTransfer.files[0].name))})),d.on("toggle-list","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-cards").classList.remove("active"),O.setListingMode("list")}),d.on("toggle-cards","click",i=>{i.currentTarget.classList.add("active"),document.getElementById("toggle-list").classList.remove("active"),O.setListingMode("cards")}),["lista","calendario","dashboard","notificacoes","configuracoes"].forEach(i=>{d.on(`tab-acc-${i}`,"click",l=>{document.querySelectorAll(".acc-tab-btn").forEach(f=>f.classList.remove("active")),l.currentTarget.classList.add("active"),document.querySelectorAll(".acc-tab-content").forEach(f=>{f.classList.add("hidden"),f.classList.remove("active")});const c=document.getElementById("accounts-dashboard-view");c&&(c.classList.add("hidden"),c.classList.remove("active"));const u=i==="dashboard"?"accounts-dashboard-view":`acc-tab-content-${i}`,p=document.getElementById(u);p&&(p.classList.remove("hidden"),p.classList.add("active"));const m=document.getElementById("calendar-view-toggle-container");m&&(i==="calendario"?(m.classList.remove("hidden"),m.style.display="flex"):(m.classList.add("hidden"),m.style.display="none")),M.setAccountsViewMode(i==="calendario"?"calendar":i==="dashboard"?"dashboard":i==="notificacoes"?"notificacoes":i==="configuracoes"?"configuracoes":"list"),i==="configuracoes"&&M.fetchCategories()})}),["day","month","year"].forEach(i=>{d.on(`toggle-accounts-cal-${i}`,"click",l=>{document.querySelectorAll("#calendar-view-toggle-container .toggle-btn").forEach(c=>c.classList.remove("active")),l.currentTarget.classList.add("active"),["day","month","year"].forEach(c=>{document.getElementById(`cal-${c}-view-container`).classList.toggle("hidden-cal-view",c!==i)}),M.setCalendarSubView(i)})}),d.on("btn-prev-date-nav","click",()=>M.shiftCalendarDate(-1)),d.on("btn-next-date-nav","click",()=>M.shiftCalendarDate(1)),d.on("btn-back-to-accounts","click",()=>{d.hide("dedicated-account-page"),d.show("accounts-section"),pt()}),d.on("btn-back-to-list","click",()=>{const i=document.getElementById("procedure-edit-wrapper");i&&!i.classList.contains("hidden")?O.toggleEditMode(!1):(fe="docs",Qe())}),d.on("btn-floating-edit","click",()=>O.toggleEditMode(!0)),d.on("btn-cancel-edit","click",()=>O.toggleEditMode(!1)),d.on("btn-save-procedure","click",()=>O.handleSaveProcedure()),d.on("confirm-yes","click",()=>{d.hide("modal-confirm"),O.openDetail(O.getPendingProcId())}),d.on("confirm-no","click",()=>{d.hide("modal-confirm")}),d.on("procedure-search","input",i=>{O.filterProcedureContent(i.target.value)}),d.on("btn-add-block","click",()=>{const i=document.getElementById("section-title-input"),l=document.getElementById("section-type-input");i&&(i.value=""),l&&(l.value="TEXTO"),d.show("modal-add-section")}),d.on("btn-confirm-add-section","click",()=>{const i=d.getValue("section-title-input"),l=d.getValue("section-type-input");if(!i)return alert("Por favor, informe o título da seção.");O.addSection(i,l),d.hide("modal-add-section")})}
