"""Build-time translation of public editorial text only; no visitor/API runtime.
Machine drafts are saved incrementally for review. Never send source PDFs,
credentials, private forum messages or contact lists to this process.
"""
from pathlib import Path
import concurrent.futures,json,re,time,urllib.parse,urllib.request,urllib.error
ROOT=Path(__file__).resolve().parents[1]
CAT=json.loads((ROOT/'src/locales/catalog.ru.json').read_text(encoding='utf-8'))
TERMS=['Rainbow Gatherings','Rainbow Gathering','Rainbow Guide Australia','Rainbow Guide','Rainbow Rising','Welcome Home','Magic Hat','Shanti Sena','Seed Camp','Main Circle','Main Council','Talking Circle','Vision Council','Kid Village','COOPerations','Mini-Manual']
def protect(text):
    replacements={}
    for term in TERMS:
        if term in text:
            token=f'QZKEEP{len(replacements)}QZ';text=text.replace(term,token);replacements[token]=term
    text=re.sub(r'\bРадуг(?:а|и|е|у|ой)\b','Rainbow',text)
    return text,replacements
def request(text,lang):
    params=urllib.parse.urlencode({'client':'gtx','sl':'ru','tl':lang,'dt':'t','q':text})
    req=urllib.request.Request('https://translate.googleapis.com/translate_a/single?'+params,headers={'User-Agent':'Mozilla/5.0'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req,timeout=45) as response:data=json.load(response)
            return ''.join(x[0] for x in data[0] if x[0])
        except urllib.error.HTTPError as e:
            if e.code in (400,413,414):raise
            if attempt==3:raise
            time.sleep(2**attempt+1)
        except Exception:
            if attempt==3:raise
            time.sleep(2**attempt+1)
def batch_translate(items,lang):
    protected=[]
    for text in items:protected.append(protect(text.strip()))
    query='\n\n'.join(f'ZXQ{i:04d}QXZ\n{p[0]}' for i,p in enumerate(protected))
    try:
        output=request(query,lang)
        markers=list(re.finditer(r'ZXQ\s*(\d{4})\s*QXZ',output,re.I))
        if [int(m.group(1)) for m in markers]!=list(range(len(items))):raise ValueError('Segment markers changed')
        values=[output[m.end():markers[i+1].start() if i+1<len(markers) else len(output)].strip() for i,m in enumerate(markers)]
    except Exception:
        if len(items)>1:
            mid=len(items)//2
            return {**batch_translate(items[:mid],lang),**batch_translate(items[mid:],lang)}
        values=[request(protected[0][0],lang).strip()]
    result={}
    for text,value,(_,terms) in zip(items,values,protected):
        for token,term in terms.items():value=re.sub(re.escape(token),lambda _:term,value,flags=re.I)
        if re.search(r'QZKEEP|ZXQ\d',value,re.I):raise ValueError('Unrestored protected term')
        if not value:raise ValueError('Empty translation')
        left=text[:len(text)-len(text.lstrip())];right=text[len(text.rstrip()):]
        result[text]=left+value+right
    return result
def language(lang):
    destination=ROOT/f'src/locales/{lang}.json'
    catalog=json.loads(destination.read_text(encoding='utf-8')) if destination.exists() else {}
    pending=[s for s in CAT if s not in catalog]
    batches=[];batch=[];size=0
    for text in pending:
        if batch and size+len(text)>3000:batches.append(batch);batch=[];size=0
        batch.append(text);size+=len(text)+20
    if batch:batches.append(batch)
    for index,items in enumerate(batches):
        catalog.update(batch_translate(items,lang))
        destination.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(f'{lang}: {len(catalog)}/{len(CAT)} strings ({index+1}/{len(batches)} batches)',flush=True)
        time.sleep(.2)
    return {'language':lang,'strings':len(catalog),'complete':all(s in catalog for s in CAT)}
if __name__=='__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures=[pool.submit(language,lang) for lang in ['en','nl','de','fr','es']]
        for future in concurrent.futures.as_completed(futures):print(json.dumps(future.result()),flush=True)
