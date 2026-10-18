const clean=(v,n=4000)=>String(v??"").replace(/\s+/g," ").trim().slice(0,n);
function detectPlatform(url=""){try{const h=new URL(url).hostname.toLowerCase();if(h==="meesho.com"||h.endsWith(".meesho.com"))return "meesho";if(h==="amazon.in"||h.endsWith(".amazon.in")||h==="amazon.com"||h.endsWith(".amazon.com"))return "amazon";if(h==="flipkart.com"||h.endsWith(".flipkart.com"))return "flipkart";}catch{}return "unknown";}
function visible(n){if(!n?.isConnected)return false;const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden";}
function first(selectors){for(const s of selectors){const n=document.querySelector(s);const v=n?.getAttribute?.("content")||n?.innerText||n?.textContent||"";if(clean(v))return clean(v);}return "";}
function textOf(n){return clean(n?.innerText||n?.textContent||"",1200);}
function priceFrom(text){const m=String(text||"").match(/₹\s*[\d,]+(?:\.\d{1,2})?|[\d,]+(?:\.\d{1,2})?\s*₹/);return m?m[0].replace(/\s+/g," ").trim():"";}
function ratingFrom(text){const m=String(text||"").match(/(?:^|\s)([0-5](?:\.\d)?)\s*(?:★|Stars?\b)/i);return m?m[1]:"";}
function reviewsFrom(text){const m=String(text||"").match(/([\d,]+)\s+(?:Reviews?|Ratings?)\b/i);return m?m[1]:"";}
function productIdFrom(url){try{return new URL(url).pathname.match(/\/p\/([^/?]+)/)?.[1]||"";}catch{return "";}}
function extractCompetitors(){
 const map=new Map();
 for(const a of [...document.querySelectorAll("a[href*='/p/']")].filter(visible)){
  const url=new URL(a.href,location.href);if(url.hostname!==location.hostname)continue;
  const id=productIdFrom(url.href);if(!id)continue;
  const title=textOf(a);if(!title)continue;
  let card=a;for(let i=0;i<5&&card.parentElement;i++,card=card.parentElement){const t=textOf(card);if(t.length>title.length&&t.length<2500&&/₹\s*[\d,]+/.test(t))break;}
  const text=textOf(card);const price=priceFrom(text);
  const rec={id,url:url.href,title:title.slice(0,350),price,rating:ratingFrom(text),reviewCount:reviewsFrom(text),source:"visible-product-card"};
  const prior=map.get(id);if(!prior||(!prior.price&&rec.price)||rec.title.length>prior.title.length)map.set(id,rec);
 }
 return [...map.values()].filter(x=>x.title&&x.url).slice(0,100);
}
function collectPage(){
 const url=location.href,platform=detectPlatform(url),isSearch=/\/search(?:\/|\?|$)/i.test(location.pathname+location.search);
 const title=first(["meta[property='og:title']","h1","title"]);
 const body=clean(document.body?.innerText,30000);
 const competitors=isSearch?extractCompetitors():[];
 let price="",priceSource="",priceConfidence=0;
 if(!isSearch){
  const meta=first(["meta[property='product:price:amount']","meta[itemprop='price']"]);
  if(meta){price=meta;priceSource="product-price-metadata";priceConfidence=.9;}
  else{
   const h=document.querySelector("h1");
   if(h){let ancestor=h;for(let depth=0;ancestor&&depth<6;depth++,ancestor=ancestor.parentElement){const nodes=[...ancestor.querySelectorAll("[itemprop='price'],[data-testid*='price'],[class*='price'],[aria-label*='₹']")].filter(visible).filter(n=>!n.closest("a")).map(n=>({n,text:textOf(n)})).filter(x=>priceFrom(x.text));if(nodes.length){nodes.sort((a,b)=>Math.abs(a.n.getBoundingClientRect().top-h.getBoundingClientRect().top)-Math.abs(b.n.getBoundingClientRect().top-h.getBoundingClientRect().top));price=priceFrom(nodes[0].text);priceSource="nearest-price-to-product-title";priceConfidence=.65;break;}}}
  }
 }
 const fields={title,description:first(["meta[name='description']","meta[property='og:description']","[itemprop='description']"]),price,rating:isSearch?"":first(["[itemprop='ratingValue']","[aria-label*='out of 5']"]),reviewCount:isSearch?"":first(["[itemprop='reviewCount']"]),brand:first(["[itemprop='brand']","meta[property='product:brand']"]),availability:first(["[itemprop='availability']"])};
 const evidence=Object.entries(fields).filter(([,v])=>v).map(([field,value])=>({field,value,source:field==="price"?priceSource:"rendered-dom",confidence:field==="price"?priceConfidence:.5}));
 const sellerLens={};
 if(!isSearch){
  const patterns=[["estimatedDailySales",/ESTIMATED PER DAY SALES\s+([^\n]+)/i],["tillDateOrders",/TILL DATE ORDERS\s+([^\n]+)/i],["listingAge",/LISTING AGE\s+([^\n]+)/i],["listingPrice",/LISTING PRICE\s+(₹\s*[\d,]+(?:\.\d+)?)/i],["productId",/PRODUCT ID\s+([\d]+)/i],["listingCreated",/CREATED\s+(\d{1,2}\s+\w+\s+\d{4})/i],["returnShippingEstimate",/RETURN SHIPPING\s*\/\s*UNIT\s+([^\n]+)/i]];
  for(const [key,re] of patterns){const m=body.match(re);if(m)sellerLens[key]={value:clean(m[1],160),source:"seller-lens-visible-text",confidence:.45};}
 }
 const headings=[...document.querySelectorAll("h1,h2,h3")].filter(visible).slice(0,60).map(n=>textOf(n).slice(0,300));
 const links=[...document.querySelectorAll("a[href]")].filter(visible).slice(0,100).map(n=>({text:textOf(n).slice(0,180),url:n.href})).filter(x=>x.text&&/^https?:/.test(x.url));
 return {id:crypto.randomUUID(),capturedAt:new Date().toISOString(),url,platform,pageType:isSearch?"search-results":"product-or-other",fields,evidence,competitors,sellerLens,headings,links,notes:[isSearch?"Search results detected: product-level fields are not assigned from the whole page. Competitor cards are stored individually; check each extracted card before relying on its metrics.":"Product page assumed from URL. Verify price and Seller Lens values against the visible page before acting.","Seller Lens figures may be estimates and are kept separate from product fields."],visibleText:body.slice(0,12000)};
}
chrome.runtime.onMessage.addListener((m,_s,reply)=>{if(m?.type!=="SCOUT_CAPTURE_PAGE")return false;try{reply({ok:true,snapshot:collectPage()});}catch(e){reply({ok:false,error:String(e?.message||e)});}return true;});
