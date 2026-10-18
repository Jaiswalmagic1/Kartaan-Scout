const clean=(v,n=4000)=>String(v??"").replace(/\s+/g," ").trim().slice(0,n);
function detectPlatform(url=""){try{const h=new URL(url).hostname.toLowerCase();if(h==="meesho.com"||h.endsWith(".meesho.com"))return "meesho";if(h==="amazon.in"||h.endsWith(".amazon.in")||h==="amazon.com"||h.endsWith(".amazon.com"))return "amazon";if(h==="flipkart.com"||h.endsWith(".flipkart.com"))return "flipkart";}catch{}return "unknown";}
function normalizeSnapshot(input){return {id:crypto.randomUUID(),capturedAt:new Date().toISOString(),url:input.url,platform:input.platform,fields:input.fields,evidence:input.evidence,notes:input.notes};}
function first(selectors){for(const s of selectors){const n=document.querySelector(s);const v=n?.getAttribute?.("content")||n?.innerText||n?.textContent||"";if(clean(v))return clean(v);}return "";}
function visible(n){if(!n?.isConnected)return false;const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden";}
function collectPage(){
 const fields={title:first(["meta[property='og:title']","h1","title"]),description:first(["meta[name='description']","meta[property='og:description']","[itemprop='description']"]),price:first(["meta[property='product:price:amount']","[itemprop='price']","[data-testid*='price']","[class*='price']"]),rating:first(["[itemprop='ratingValue']","[aria-label*='out of 5']"]),reviewCount:first(["[itemprop='reviewCount']","[class*='review-count']"]),brand:first(["[itemprop='brand']","meta[property='product:brand']"]),availability:first(["[itemprop='availability']"])};
 const evidence=Object.entries(fields).filter(([,v])=>v).map(([field,value])=>({field,value,source:"rendered-dom",confidence:.5}));
 const headings=[...document.querySelectorAll("h1,h2,h3")].filter(visible).slice(0,60).map(n=>clean(n.innerText||n.textContent,300));
 const links=[...document.querySelectorAll("a[href]")].filter(visible).slice(0,100).map(n=>({text:clean(n.innerText||n.textContent,180),url:n.href})).filter(x=>x.text&&/^https?:/.test(x.url));
 return {...normalizeSnapshot({url:location.href,platform:detectPlatform(location.href),fields,evidence,notes:["Rendered page data only; missing fields are not inferred."]}),headings,links,visibleText:clean(document.body?.innerText,12000)};
}
chrome.runtime.onMessage.addListener((m,_s,reply)=>{if(m?.type!=="SCOUT_CAPTURE_PAGE")return false;try{reply({ok:true,snapshot:collectPage()});}catch(e){reply({ok:false,error:String(e?.message||e)});}return true;});
