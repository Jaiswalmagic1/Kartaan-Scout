import {snapshotsToCsv,makeResearchPrompt,approvedPayload} from "./lib.js";
const KEY="kartaanScoutSnapshots";
async function all(){const x=await chrome.storage.local.get(KEY);return Array.isArray(x[KEY])?x[KEY]:[];}
async function capture(){
 const [tab]=await chrome.tabs.query({active:true,lastFocusedWindow:true});
 if(!tab?.id||!/^https?:/.test(tab.url||""))throw Error("Open a normal web page first.");
 try{const r=await chrome.tabs.sendMessage(tab.id,{type:"SCOUT_CAPTURE_PAGE"});if(r?.ok)return r.snapshot;}catch{}
 await chrome.scripting.executeScript({target:{tabId:tab.id},files:["src/content.js"]});
 const r=await chrome.tabs.sendMessage(tab.id,{type:"SCOUT_CAPTURE_PAGE"});
 if(!r?.ok)throw Error(r?.error||"Capture failed. Reload the page and retry.");
 return r.snapshot;
}
chrome.runtime.onMessage.addListener((m,_s,reply)=>{
 (async()=>{try{switch(m?.type){
 case "SCOUT_CAPTURE":{const s=await capture(),items=[s,...(await all()).filter(x=>x.id!==s.id)].slice(0,100);await chrome.storage.local.set({[KEY]:items});reply({ok:true,snapshot:s});break;}
 case "SCOUT_LIST":reply({ok:true,snapshots:await all()});break;
 case "SCOUT_CLEAR":await chrome.storage.local.remove(KEY);reply({ok:true});break;
 case "SCOUT_CSV":reply({ok:true,data:snapshotsToCsv(await all())});break;
 case "SCOUT_JSON":reply({ok:true,data:JSON.stringify(await all(),null,2)});break;
 case "SCOUT_PROMPT":reply({ok:true,prompt:makeResearchPrompt(m.snapshot)});break;
 case "SCOUT_APPROVED_PAYLOAD":reply({ok:true,payload:approvedPayload(m.proposals)});break;
 default:reply({ok:false,error:"Unknown message."});
 }}catch(e){reply({ok:false,error:String(e?.message||e)});}})();return true;
});
