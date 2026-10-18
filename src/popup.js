const $=s=>document.querySelector(s);let latest=null;
async function send(m){const r=await chrome.runtime.sendMessage(m);if(!r?.ok)throw Error(r?.error||"Request failed");return r;}
function status(t){$("#status").textContent=t;}
function render(s){latest=s;$("#latest").hidden=false;$("#details").replaceChildren();for(const text of [s.fields?.title||"(No title found)",s.url,s.platform+" · "+new Date(s.capturedAt).toLocaleString()]){const d=document.createElement("div");d.className="meta";d.textContent=text;$("#details").append(d);}}
async function history(){const {snapshots}=await send({type:"SCOUT_LIST"});$("#history").replaceChildren();if(!snapshots.length){$("#history").textContent="No captures yet.";return;}for(const s of snapshots.slice(0,12)){const d=document.createElement("div");d.className="row";d.textContent=(s.fields?.title||"(Untitled)")+" · "+s.platform;d.tabIndex=0;d.onclick=()=>render(s);$("#history").append(d);}}
async function download(type,ext,mime){const r=await send({type});const blob=URL.createObjectURL(new Blob([r.data],{type:mime}));const a=document.createElement("a");a.href=blob;a.download="kartaan-scout."+ext;a.click();setTimeout(()=>URL.revokeObjectURL(blob),1000);}
$("#capture").onclick=async()=>{try{$("#capture").disabled=true;status("Capturing visible page…");const {snapshot}=await send({type:"SCOUT_CAPTURE"});render(snapshot);await history();status("Saved locally. Review evidence before making changes.");}catch(e){status(e.message);}finally{$("#capture").disabled=false;}};
$("#prompt").onclick=async()=>{try{const r=await send({type:"SCOUT_PROMPT",snapshot:latest});await navigator.clipboard.writeText(r.prompt);status("Prompt copied. Paste it into your chosen AI tool.");}catch(e){status(e.message);}};
$("#json").onclick=()=>download("SCOUT_JSON","json","application/json").catch(e=>status(e.message));
$("#csv").onclick=()=>download("SCOUT_CSV","csv","text/csv").catch(e=>status(e.message));
$("#clear").onclick=async()=>{if(confirm("Clear all local Scout history?")){await send({type:"SCOUT_CLEAR"});await history();status("History cleared.");}};
history().catch(e=>status(e.message));
