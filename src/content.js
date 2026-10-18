const clean=(v,n=4000)=>String(v??"").replace(/\s+/g," ").trim().slice(0,n);
function detectPlatform(url=""){try{const h=new URL(url).hostname.toLowerCase();if(h==="meesho.com"||h.endsWith(".meesho.com"))return "meesho";if(h==="amazon.in"||h.endsWith(".amazon.in")||h==="amazon.com"||h.endsWith(".amazon.com"))return "amazon";if(h==="flipkart.com"||h.endsWith(".flipkart.com"))return "flipkart";}catch{}return "unknown";}
function normalizeSnapshot(input){return {id:crypto.randomUUID(),capturedAt:new Date().toISOString(),url:input.url,platform:input.platform,fields:input.fields,evidence:input.evidence,notes:input.notes};}
function first(selectors){for(const s of selectors){const n=document.querySelector(s);const v=n?.getAttribute?.("content")||n?.innerText||n?.textContent||"";if(clean(v))return clean(v);}return "";}
function visible(n){if(!n?.isConnected)return false;const r=n.getBoundingClientRect(),s=getComputedStyle(n);return r.width>0&&r.height>0&&s.display!=="none"&&s.visibility!=="hidden";}
function productPrice(){
 const meta=first(["meta[property='product:price:amount']","meta[itemprop='price']"]);
 if(meta)return {value:meta,source:"product-price-metadata",confidence:.9};
 const candidates=[...document.querySelectorAll("[itemprop='price'],[data-testid*='price'],[class*='price'],[aria-label*='₹']")]
 .filter(visible).filter(n=>!n.closest("a") && /₹\s*[\d,]+|[\d,]+\s*₹/.test(clean(n.getAttribute("content")||n.innerText||n.textContent,150)))
 .map(n=>({n,value:clean(n.getAttribute("content")||n.innerText||n.textContent,150)}));
 const h=document.querySelector("h1");
 if(h){
  let ancestor=h;
  for(let depth=0;ancestor&&depth<6;depth++,ancestor=ancestor.parentElement){
   const inScope=candidates.filter(c=>ancestor.contains(c.n)&&!c.n.closest("a"));
   if(inScope.length){
    inScope.sort((a,b)=>Math.abs(a.n.getBoundingClientRect().top-h.getBoundingClientRect().top)-Math.abs(b.n.getBoundingClientRect().top-h.getBoundingClientRect().top));
    const pick=inScope[0];
    if(/₹\s*[\d,]+|[\d,]+\s*₹/.test(pick.value))return {value:pick.value,source:"nearest-price-to-product-title",confidence:.7};
   }
  }
 }
 return {value:"",source:"",confidence:0};
}
function collectPage(){
 const title=first(["meta[property='og:title']","h1","title"]);
 const price=productPrice();
 const fields={title,description:first(["meta[name='description']","meta[property='og:description']","[itemprop='description']"]),price:price.value,rating:first(["[itemprop='ratingValue']","[aria-label*='out of 5']"]),reviewCount:first(["[itemprop='reviewCount']","[class*='review-count']"]),brand:first(["[itemprop='brand']","meta[property='product:brand']"]),availability:first(["[itemprop='availability']"])};
 const evidence=Object.entries(fields).filter(([,v])=>v).map(([field,value])=>({field,value,source:field==="price"?price.source:"rendered-dom",confidence:field==="price"?price.confidence:.5}));
 const body=clean(document.body?.innerText,30000);
 const metricPatterns=[
  ["estimatedDailySales",/ESTIMATED PER DAY SALES\s+([^\n]+)/i],
  ["tillDateOrders",/TILL DATE ORDERS\s+([^\n]+)/i],
  ["listingAge",/LISTING AGE\s+([^\n]+)/i],
  ["listingRating",/RATING\s+([^\n]+)/i],
  ["listingPrice",/LISTING PRICE\s+(₹\s*[\d,]+(?:\.\d+)?)/i],
  ["productId",/PRODUCT ID\s+([\d]+)/i],
  ["listingCreated",/CREATED\s+([^\n]+)/i],
  ["returnShippingEstimate",/RETURN SHIPPING\s*\/\s*UNIT\s+([^\n]+)/i]
 ];
 const sellerLens={};for(const [key,re] of metricPatterns){const m=body.match(re);if(m)sellerLens[key]=clean(m[1],200);}
 const headings=[...document.querySelectorAll("h1,h2,h3")].filter(visible).slice(0,60).map(n=>clean(n.innerText||n.textContent,300));
 const links=[...document.querySelectorAll("a[href]")].filter(visible).slice(0,100).map(n=>({text:clean(n.innerText||n.textContent,180),url:n.href})).filter(x=>x.text&&/^https?:/.test(x.url));
 return {...normalizeSnapshot({url:location.href,platform:detectPlatform(location.href),fields,evidence,notes:["Rendered DOM only. Price extraction prioritizes product metadata and then visible prices near the product title; verify against the page before acting.","Seller Lens values are captured separately and may be estimates, not verified marketplace facts."]}),sellerLens,headings,links,visibleText:body.slice(0,12000)};
}
chrome.runtime.onMessage.addListener((m,_s,reply)=>{if(m?.type!=="SCOUT_CAPTURE_PAGE")return false;try{reply({ok:true,snapshot:collectPage()});}catch(e){reply({ok:false,error:String(e?.message||e)});}return true;});
