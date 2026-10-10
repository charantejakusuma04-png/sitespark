import http from 'node:http';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import tls from 'node:tls';
// Include Windows' trusted certificate authorities without disabling TLS verification.
if(tls.setDefaultCACertificates&&tls.getCACertificates){
  tls.setDefaultCACertificates([...tls.getCACertificates('default'),...tls.getCACertificates('system')]);
}
const root=path.dirname(fileURLToPath(import.meta.url));
try { process.loadEnvFile(path.join(root,'.env')); } catch(e) { if(e.code!=='ENOENT') throw e; }
const port=Number(process.env.PORT||3000);
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
http.createServer(async(req,res)=>{
  if(req.method==='GET'&&req.url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(readFileSync(path.join(root,'index.html')));}
  if(req.method==='GET'&&req.url==='/api/status')return send(res,200,{configured:Boolean(process.env.GEMINI_API_KEY)});
  if(req.method!=='POST'||req.url!=='/api/generate')return send(res,404,{error:'Not found'});
  if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)return send(res,403,{error:'Request origin is not allowed.'});
  let body='';
  try {
    for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>20000)return send(res,413,{error:'Description is too long.'});}
    let input;try{input=JSON.parse(body);}catch{return send(res,400,{error:'Invalid request.'});}
    if(typeof input.prompt!=='string'||input.prompt.trim().length<10||input.prompt.length>6000)return send(res,400,{error:'Describe your website in 10–6000 characters.'});
    if(!process.env.GEMINI_API_KEY)return send(res,503,{error:'Add your Gemini API key to the local .env file, then restart SiteSpark.'});
    const model=process.env.GEMINI_MODEL||'gemini-3-flash-preview';
    const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},signal:AbortSignal.timeout(90000),body:JSON.stringify({systemInstruction:{parts:[{text:'You design responsive single-page websites. Return ONLY a complete HTML document, no markdown fences. Use inline CSS and no scripts, external dependencies, remote assets, or forms. Use semantic HTML, accessible contrast, responsive layouts, polished typography, CSS illustration and working section anchor links. Include meaningful content matching the brief. Never invent real testimonials, statistics or contact details; mark illustrative claims as sample content. This is a static prototype; do not imply payments or backend functions work.'}]},contents:[{parts:[{text:input.prompt}]}],generationConfig:{maxOutputTokens:16000}})});
    const data=await response.json();
    if(!response.ok)return send(res,response.status===429?429:502,{error:response.status===429?'Gemini quota reached. Check your API limits or try again later.':response.status===400||response.status===403?'Gemini rejected the request. Check your API key and model access.':'Gemini is unavailable or the configured model is not accessible.'});
    if(data.candidates?.[0]?.finishReason!=='STOP')return send(res,502,{error:'Generation did not finish. Try a shorter, simpler description.'});
    let html=(data.candidates?.[0]?.content?.parts||[]).filter(p=>!p.thought).map(p=>p.text||'').join('').trim().replace(/^```(?:html)?\s*/i,'').replace(/\s*```$/,'');
    if(!/<html[\s>]/i.test(html)||!/<\/html>/i.test(html))return send(res,502,{error:'Gemini did not return a complete website. Please try again.'});
    const policy='<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:; font-src data:; form-action \'none\'; base-uri \'none\'; script-src \'none\'">';
    html=html.replace(/<head[^>]*>/i,match=>match+policy);
    if(!html.includes(policy))html=policy+html;
    return send(res,200,{html});
  }catch(e){return send(res,502,{error:e.name==='TimeoutError'?'Generation timed out. Please try again.':'Unable to reach Gemini. Check your connection and retry.'});}
}).listen(port,'127.0.0.1',()=>console.log(`SiteSpark ready: http://localhost:${port}`));
