'use client';

import { FormEvent, useMemo, useState } from 'react';

type CityHomeProps = {
  city: string;
  subtitle: string;
  officialUrl: string;
  jurisdictionType?: 'city' | 'county';
};

type Lang = 'en' | 'es';
type ToolId = 'help' | 'meetings' | 'money' | 'records';
type Problem = [string,string,string,string,string,string];

type SearchItem = {
  kind: 'problem' | 'section' | 'redirect';
  id: string;
  titleEn: string;
  titleEs: string;
  descEn: string;
  descEs: string;
  target?: string;
};

const copy = {
  en: {
    sources:'Sources', accessibility:'Accessibility', toggle:'ESPAÑOL', your:'YOUR LOCAL GOVERNMENT',
    eyebrow:'LOCAL GOVERNMENT SHOULD NOT REQUIRE A TRANSLATOR', heroA:'What do you need', heroB:'from your government?',
    intro:'Start with the problem, question or record. We’ll point you toward the official answer.', search:'Search',
    cityPlaceholder:'water bill, pothole, permit, council agenda…',
    countyPlaceholder:'property tax, deed, county road, commissioners court…',
    searchNote:'Searches the right level of local government first.',
    explore:'EXPLORE LOCAL GOVERNMENT', start:'START WITH WHAT YOU NEED', skip:'Skip the department chart.',
    noResults:'No verified match yet. Try a broader term or use the official website.', results:'Search results',
    official:'Official sources remain authoritative.', visit:'Visit the official website', independent:'Independent civic education resource',
    notAffiliated:'Not affiliated with the City of Copperas Cove, City of Gatesville, or Coryell County.',
  },
  es: {
    sources:'Fuentes', accessibility:'Accesibilidad', toggle:'ENGLISH', your:'TU GOBIERNO LOCAL',
    eyebrow:'EL GOBIERNO LOCAL NO DEBERÍA NECESITAR TRADUCTOR', heroA:'¿Qué necesitas', heroB:'de tu gobierno?',
    intro:'Empieza con el problema, la pregunta o el documento. Te dirigiremos a la respuesta oficial.', search:'Buscar',
    cityPlaceholder:'factura de agua, bache, permiso, agenda del concejo…',
    countyPlaceholder:'impuesto predial, escritura, camino del condado, comisionados…',
    searchNote:'Busca primero en el nivel correcto del gobierno local.',
    explore:'EXPLORA TU GOBIERNO LOCAL', start:'EMPIEZA CON LO QUE NECESITAS', skip:'No necesitas saber qué departamento buscar.',
    noResults:'Todavía no hay una coincidencia verificada. Prueba un término más amplio o usa el sitio oficial.', results:'Resultados de búsqueda',
    official:'Las fuentes oficiales siguen siendo la autoridad.', visit:'Visitar el sitio oficial', independent:'Recurso independiente de educación cívica',
    notAffiliated:'No está afiliado con la Ciudad de Copperas Cove, la Ciudad de Gatesville ni el Condado de Coryell.',
  }
};

const nav = {
  en:['I Need Help','Your Local Government','Meetings','Follow the Money','Documents','Your Rights','Charter / Structure','Open Meetings Act','Public Information Act','Official Sources'],
  es:['Necesito Ayuda','Tu Gobierno Local','Reuniones','Sigue el Dinero','Documentos','Tus Derechos','Carta / Estructura','Ley de Reuniones Abiertas','Ley de Información Pública','Fuentes Oficiales']
};

const citySections = [
  {id:'meetings' as ToolId, en:'What is City Council doing?', es:'¿Qué está haciendo el Concejo Municipal?', descEn:'Council meetings, agendas, minutes and video', descEs:'Reuniones del concejo, agendas, actas y video', keywords:'meeting agenda council city council minutes video public comment mayor reunión agenda concejo alcalde actas video comentario público'},
  {id:'money' as ToolId, en:'Where is city money going?', es:'¿A dónde va el dinero de la ciudad?', descEn:'City budgets, utility funds, debt, audits and projects', descEs:'Presupuestos municipales, servicios, deuda, auditorías y proyectos', keywords:'city budget audit debt tax rate bond certificate obligation utility water sewer contract procurement capital presupuesto auditoría deuda tasa impuesto bono agua alcantarillado contrato compras capital'},
  {id:'records' as ToolId, en:'I need a city public record', es:'Necesito un registro público de la ciudad', descEn:'Find city records first, then build a focused request', descEs:'Busca primero los registros municipales y luego prepara una solicitud precisa', keywords:'city record TPIA PIR open records public information ordinance resolution council email city contract registro municipal información pública ordenanza resolución concejo contrato'},
  {id:'rights', en:'What are my rights at City Hall?', es:'¿Cuáles son mis derechos en el Ayuntamiento?', descEn:'Charter, public comment, OMA and TPIA', descEs:'Carta, comentario público, OMA y TPIA', keywords:'rights charter speak council public comment open meetings OMA TPIA city manager derechos carta hablar concejo comentario público reuniones abiertas administrador'}
];

const countySections = [
  {id:'meetings' as ToolId, en:'What is Commissioners Court doing?', es:'¿Qué está haciendo el Tribunal de Comisionados?', descEn:'Commissioners Court meetings, agendas and minutes', descEs:'Reuniones, agendas y actas del Tribunal de Comisionados', keywords:'commissioners court commissioner county judge meeting agenda minutes public comment comisionados juez del condado reunión agenda actas comentario público'},
  {id:'money' as ToolId, en:'Where is county money going?', es:'¿A dónde va el dinero del condado?', descEn:'County budget, audit, tax rate and capital spending', descEs:'Presupuesto, auditoría, tasa de impuestos y gasto de capital del condado', keywords:'county budget county audit tax rate commissioner spending capital procurement contract presupuesto condado auditoría tasa impuesto gasto compras contrato'},
  {id:'records' as ToolId, en:'I need a county public record', es:'Necesito un registro público del condado', descEn:'Find county records first, then use TPIA if needed', descEs:'Busca primero los registros del condado y usa TPIA si hace falta', keywords:'county record TPIA PIR public information deed official record clerk sheriff court registro condado información pública escritura secretario alguacil tribunal'},
  {id:'rights', en:'What are my rights with county government?', es:'¿Cuáles son mis derechos ante el gobierno del condado?', descEn:'Open meetings, public information and county authority', descEs:'Reuniones abiertas, información pública y autoridad del condado', keywords:'rights commissioners court open meetings OMA TPIA public information county authority derechos comisionados reuniones abiertas información pública autoridad condado'}
];

const cityProblems: Problem[] = [
  ['water','Water / sewer','Agua / alcantarillado','Utility / Public Works','Servicios públicos / Obras Públicas','water sewer leak pressure hydrant wastewater agua alcantarillado fuga presión'],
  ['billing','Utility bill / payment','Factura / pago de servicios','Utility Billing','Facturación de servicios','water bill utility bill payment disconnect reconnect factura agua servicios pago corte reconexión'],
  ['trash','Trash / bulk pickup','Basura / recogida grande','Solid Waste / Sanitation','Residuos Sólidos / Saneamiento','trash garbage recycling bulk pickup sanitation basura reciclaje recogida'],
  ['street','Pothole / city street / drainage','Bache / calle municipal / drenaje','Public Works / Streets','Obras Públicas / Calles','pothole city street road drainage ditch traffic sign bache calle municipal drenaje zanja señal'],
  ['permit','Permit / inspection','Permiso / inspección','Development / Building Inspections','Desarrollo / Inspecciones','permit inspection building remodel fence construction zoning permiso inspección construcción cerca zonificación'],
  ['code','Code enforcement','Cumplimiento de códigos','Code Enforcement','Cumplimiento de Códigos','code weeds junk vehicle nuisance property citation código maleza vehículo propiedad citación'],
  ['animal','Animal control','Control de animales','Animal Control','Control de Animales','animal dog cat stray bite shelter animal control perro gato callejero mordida refugio'],
  ['court','Ticket / municipal court','Multa / tribunal municipal','Municipal Court','Tribunal Municipal','ticket citation municipal court warrant fine traffic multa citación tribunal municipal orden arresto tránsito'],
  ['records','City public records','Registros públicos municipales','City Secretary / Public Information','Secretaría Municipal / Información Pública','city records public information TPIA PIR ordinance resolution minutes registros ciudad información pública ordenanza resolución actas'],
  ['elections','City elections','Elecciones municipales','City Secretary / Elections','Secretaría Municipal / Elecciones','city election council candidate ballot mayor elección municipal concejo candidato boleta alcalde']
];

const countyProblems: Problem[] = [
  ['tax','Property tax / vehicle registration','Impuesto predial / registro vehicular','Tax Assessor-Collector','Asesor-Recaudador de Impuestos','property tax vehicle registration title plates tax office impuesto predial registro vehicular título placas'],
  ['records','Deeds / property records / official records','Escrituras / propiedad / registros oficiales','County Clerk','Secretaría del Condado','deed marriage license birth death assumed name official records property records escritura matrimonio nacimiento defunción nombre comercial registros oficiales'],
  ['court','County or district court case / filing','Caso / presentación en tribunal del condado o distrito','County or District Clerk','Secretaría del Condado o Distrito','district court county court lawsuit criminal civil probate filing clerk caso tribunal distrito civil penal sucesión presentación'],
  ['elections','Voting / county elections','Votación / elecciones del condado','Elections Administration','Administración de Elecciones','vote voting polling registration ballot election precinct voter votar votación casilla registro boleta elección precinto'],
  ['road','County road / precinct issue','Camino del condado / asunto del precinto','County Commissioner Precinct','Comisionado del Precinto','county road precinct commissioner rural road bridge culvert camino condado precinto comisionado rural puente alcantarilla'],
  ['sheriff','Sheriff / non-emergency','Alguacil / no emergencia','Sheriff’s Office','Oficina del Alguacil','sheriff deputy patrol non emergency report alguacil diputado patrulla no emergencia informe'],
  ['jail','Jail / inmate information','Cárcel / información de reclusos','Sheriff / Jail','Alguacil / Cárcel','jail inmate bond booking visitation cárcel recluso fianza ingreso visita'],
  ['records-request','County public information request','Solicitud de información pública del condado','County record custodian / public-information officer','Custodio de registros / oficial de información pública','county TPIA PIR open records public information request records request información pública solicitud registros condado'],
  ['budget','County budget / audit','Presupuesto / auditoría del condado','County Auditor / Commissioners Court','Auditor del Condado / Tribunal de Comisionados','county budget audit expenditure check register accounts payable presupuesto auditoría gasto cheques cuentas por pagar'],
  ['emergency','Emergency management','Manejo de emergencias','Emergency Management','Manejo de Emergencias','emergency disaster shelter warning emergency management desastre refugio alerta manejo emergencias']
];

const countyOnlyTerms = 'property tax deed deeds vehicle registration vehicle title county clerk sheriff jail inmate district clerk county road precinct commissioner commissioners court county judge impuesto predial escritura registro vehicular secretario condado alguacil cárcel recluso distrito camino condado precinto comisionado juez condado';
const cityOnlyTerms = 'water bill sewer bill utility bill pothole city street trash pickup code enforcement building permit municipal court animal control factura agua alcantarillado bache calle municipal basura código permiso tribunal municipal control animales';

function includesAny(query:string, haystack:string){
  return haystack.toLowerCase().split(' ').some(term => term.length > 2 && query.includes(term));
}

export default function CityHome({ city, subtitle, officialUrl, jurisdictionType='city' }: CityHomeProps) {
  const [lang,setLang]=useState<Lang>('en');
  const [query,setQuery]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [activeTool,setActiveTool]=useState<ToolId | null>(null);
  const [selectedProblem,setSelectedProblem]=useState<string | null>(null);
  const t=copy[lang];
  const problems=jurisdictionType==='county'?countyProblems:cityProblems;
  const sections=jurisdictionType==='county'?countySections:citySections;

  const results=useMemo<SearchItem[]>(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return [];
    const found: SearchItem[]=[];

    for(const p of problems){
      const searchable=`${p[1]} ${p[2]} ${p[5]}`.toLowerCase();
      if(searchable.includes(q) || includesAny(q,p[5])){
        found.push({kind:'problem',id:p[0],titleEn:p[1],titleEs:p[2],descEn:`Start with ${p[3]}`,descEs:`Empieza con ${p[4]}`});
      }
    }

    for(const s of sections){
      const searchable=`${s.en} ${s.es} ${s.descEn} ${s.descEs} ${s.keywords}`.toLowerCase();
      if(searchable.includes(q) || includesAny(q,s.keywords)){
        found.push({kind:'section',id:s.id,titleEn:s.en,titleEs:s.es,descEn:s.descEn,descEs:s.descEs});
      }
    }

    if(jurisdictionType==='county' && (countyOnlyTerms.includes(q)?false:includesAny(q,cityOnlyTerms))){
      found.unshift({kind:'redirect',id:'city-jurisdiction',titleEn:'This is usually a CITY issue',titleEs:'Esto normalmente es un asunto de la CIUDAD',descEn:'Water utilities, city streets, trash, code enforcement, permits, municipal court and animal control are usually handled by the city, not Coryell County.',descEs:'Los servicios de agua, calles municipales, basura, códigos, permisos, tribunal municipal y control de animales normalmente corresponden a la ciudad, no al Condado de Coryell.',target:'/'});
    }

    if(jurisdictionType==='city' && includesAny(q,countyOnlyTerms)){
      found.unshift({kind:'redirect',id:'county-jurisdiction',titleEn:'This is usually a CORYELL COUNTY issue',titleEs:'Esto normalmente es un asunto del CONDADO DE CORYELL',descEn:'Property tax, deeds, vehicle registration, county courts, the Sheriff, jail and county roads are normally handled by Coryell County.',descEs:'Impuestos prediales, escrituras, registro vehicular, tribunales del condado, alguacil, cárcel y caminos del condado normalmente corresponden al Condado de Coryell.',target:'/coryell-county'});
    }

    return found.filter((item,index,array)=>array.findIndex(x=>x.kind===item.kind&&x.id===item.id)===index).slice(0,6);
  },[query,problems,sections,jurisdictionType]);

  function openTool(id:ToolId, problemId?:string){
    setActiveTool(id);
    setSelectedProblem(problemId || null);
    requestAnimationFrame(()=>document.getElementById('resident-tool')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function activateResult(item:SearchItem){
    if(item.kind==='problem') openTool('help',item.id);
    else if(item.kind==='section' && ['meetings','money','records'].includes(item.id)) openTool(item.id as ToolId);
    else if(item.kind==='section' && item.id==='rights') document.getElementById('rights')?.scrollIntoView({behavior:'smooth'});
  }

  function submit(e:FormEvent){
    e.preventDefault();
    setSubmitted(true);
    const first=results.find(r=>r.kind!=='redirect');
    if(first) activateResult(first);
    requestAnimationFrame(()=>document.getElementById('search-results')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  const ids=['help','hall','meetings','money','documents','rights','charter','oma','pia','sources'];
  const selected=problems.find(p=>p[0]===selectedProblem);
  const placeholder=jurisdictionType==='county'?t.countyPlaceholder:t.cityPlaceholder;

  return <main id="main" lang={lang}>
    <header className="city-header"><a className="wordmark" href="/">TEXAS <span>CIVIC GUIDE</span></a><nav aria-label="Utility"><a href="#sources">{t.sources}</a><a href="#accessibility">{t.accessibility}</a><button type="button" onClick={()=>{setLang(lang==='en'?'es':'en');setSubmitted(false)}} aria-label={lang==='en'?'Cambiar a español':'Switch to English'}>{t.toggle}</button></nav></header>
    <div className="city-label"><span>{t.your}</span><strong>{city}</strong><small>{subtitle}</small></div>
    <section className="resident-hero"><div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.heroA}<br/><em>{t.heroB}</em></h1><p>{t.intro}</p></div>
      <form className="big-search" onSubmit={submit}><label htmlFor="city-search">{t.search} {city}</label><div><input id="city-search" value={query} onChange={e=>{setQuery(e.target.value);setSubmitted(false)}} placeholder={placeholder}/><button type="submit">{t.search}</button></div><small>{t.searchNote}</small></form>
    </section>

    {submitted && <section id="search-results" className="search-results" aria-live="polite"><p className="section-kicker">{t.results}</p>{results.length? <div className="action-list">{results.map((r,i)=>r.kind==='redirect'?<a href={r.target} key={r.id} className="jurisdiction-result"><b>!</b><div><strong>{lang==='en'?r.titleEn:r.titleEs}</strong><span>{lang==='en'?r.descEn:r.descEs}</span></div><i>→</i></a>:<button type="button" onClick={()=>activateResult(r)} key={`${r.kind}-${r.id}`}><b>0{i+1}</b><div><strong>{lang==='en'?r.titleEn:r.titleEs}</strong><span>{lang==='en'?r.descEn:r.descEs}</span></div><i>→</i></button>)}</div>:<p>{t.noResults} <a href={officialUrl} target="_blank" rel="noreferrer">{t.visit} ↗</a></p>}</section>}

    <div className="city-layout"><aside><p>{t.explore}</p>{nav[lang].map((item,i)=><a key={item} href={'#'+ids[i]}>{item}<span>→</span></a>)}</aside><div className="city-content">
      <section className="start"><p className="section-kicker">{t.start}</p><h2>{t.skip}</h2><div className="action-list">
        <button type="button" onClick={()=>openTool('help')}><b>01</b><div><strong>{lang==='en'?'I have a local government problem':'Tengo un problema con el gobierno local'}</strong><span>{lang==='en'?'Find the office that handles it':'Encuentra la oficina que lo atiende'}</span></div><i>→</i></button>
        <button type="button" onClick={()=>openTool('meetings')}><b>02</b><div><strong>{lang==='en'?(jurisdictionType==='county'?'What is Commissioners Court doing?':'What is City Council doing?'):(jurisdictionType==='county'?'¿Qué está haciendo el Tribunal de Comisionados?':'¿Qué está haciendo el Concejo Municipal?')}</strong><span>{lang==='en'?'Meetings, agendas, minutes and video':'Reuniones, agendas, actas y video'}</span></div><i>→</i></button>
        <button type="button" onClick={()=>openTool('money')}><b>03</b><div><strong>{lang==='en'?'Where is the money going?':'¿A dónde va el dinero?'}</strong><span>{lang==='en'?'Budgets, debt, audits and projects':'Presupuestos, deuda, auditorías y proyectos'}</span></div><i>→</i></button>
        <button type="button" onClick={()=>openTool('records')}><b>04</b><div><strong>{lang==='en'?'I need a public record':'Necesito un registro público'}</strong><span>{lang==='en'?'Find it first, then build a focused request':'Encuéntralo primero y luego prepara una solicitud precisa'}</span></div><i>→</i></button>
      </div></section>

      <section id="resident-tool" className={`resident-tool ${activeTool?'is-open':''}`} aria-live="polite">
        {!activeTool && <div><p className="section-kicker">{lang==='en'?'RESIDENT TOOL':'HERRAMIENTA PARA RESIDENTES'}</p><h2>{lang==='en'?'Choose one of the four options above.':'Elige una de las cuatro opciones arriba.'}</h2></div>}
        {activeTool==='help' && <div><p className="section-kicker">{lang==='en'?'WHO HANDLES MY PROBLEM?':'¿QUIÉN ATIENDE MI PROBLEMA?'}</p><h2>{lang==='en'?'Tell us what happened.':'Dinos qué pasó.'}</h2><p>{lang==='en'?'Pick the closest match. We’ll tell you which local office normally handles it.':'Elige la opción más cercana. Te diremos qué oficina local normalmente lo atiende.'}</p><div className="problem-grid">{problems.map(p=><button type="button" className={selectedProblem===p[0]?'selected':''} onClick={()=>setSelectedProblem(p[0])} key={p[0]}>{lang==='en'?p[1]:p[2]}</button>)}</div>{selected && <div className="office-result"><span>{lang==='en'?'START HERE':'EMPIEZA AQUÍ'}</span><h3>{lang==='en'?selected[3]:selected[4]}</h3><p>{lang==='en'?`This is the office that normally handles “${selected[1]}” at this level of government. Verify current contact details on the official ${city} website.`:`Esta es la oficina que normalmente atiende “${selected[2]}” en este nivel de gobierno. Verifica los datos de contacto actuales en el sitio oficial de ${city}.`}</p><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Open official website':'Abrir sitio oficial'} ↗</a></div>}</div>}
        {activeTool==='meetings' && <div><p className="section-kicker">{lang==='en'?'MEETINGS':'REUNIONES'}</p><h2>{lang==='en'?(jurisdictionType==='county'?'Find Commissioners Court activity.':'Find City Council activity.'):(jurisdictionType==='county'?'Encuentra la actividad del Tribunal de Comisionados.':'Encuentra la actividad del Concejo Municipal.')}</h2><div className="tool-links"><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Find agendas and meeting notices':'Buscar agendas y avisos'} ↗</a><a href="#rights">{lang==='en'?'Learn your Open Meetings Act rights':'Conoce tus derechos bajo la Ley de Reuniones Abiertas'} →</a></div></div>}
        {activeTool==='money' && <div><p className="section-kicker">{lang==='en'?'FOLLOW THE MONEY':'SIGUE EL DINERO'}</p><h2>{lang==='en'?'Start with the official financial record.':'Empieza con el registro financiero oficial.'}</h2><div className="tool-links"><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Find budgets, audits and financial documents':'Buscar presupuestos, auditorías y documentos financieros'} ↗</a><a href="#money">{lang==='en'?'See what each document can tell you':'Ver qué puede decirte cada documento'} →</a></div></div>}
        {activeTool==='records' && <div><p className="section-kicker">{lang==='en'?'PUBLIC RECORDS':'REGISTROS PÚBLICOS'}</p><h2>{lang==='en'?'Find it before you request it.':'Encuéntralo antes de pedirlo.'}</h2><p>{lang==='en'?'Check the official site first. If the record is not already published, the next step is a focused Texas Public Information Act request.':'Primero revisa el sitio oficial. Si el registro no está publicado, el próximo paso es una solicitud precisa bajo la Ley de Información Pública de Texas.'}</p><div className="tool-links"><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Search official records':'Buscar registros oficiales'} ↗</a><a href="#rights">{lang==='en'?'Learn the Public Information Act':'Conoce la Ley de Información Pública'} →</a></div></div>}
      </section>

      <section id="help" className="editorial-section"><p className="section-kicker">{lang==='en'?'WHO HANDLES MY PROBLEM?':'¿QUIÉN ATIENDE MI PROBLEMA?'}</p><h2>{lang==='en'?'Get to the right office the first time.':'Llega a la oficina correcta desde el principio.'}</h2><p>{lang==='en'?'Use the resident tool above to choose your problem and get an office recommendation.':'Usa la herramienta de arriba para elegir tu problema y recibir una recomendación de oficina.'}</p><button className="inline-tool-button" type="button" onClick={()=>openTool('help')}>{lang==='en'?'Open problem finder':'Abrir buscador de oficinas'} →</button></section>
      <section id="meetings" className="editorial-section split"><div><p className="section-kicker">{lang==='en'?'WHAT ARE THEY DOING?':'¿QUÉ ESTÁN HACIENDO?'}</p><h2>{lang==='en'?'Meetings without the scavenger hunt.':'Reuniones sin búsqueda del tesoro.'}</h2><p>{lang==='en'?(jurisdictionType==='county'?'Commissioners Court meetings, agendas, minutes, how to speak and the Open Meetings Act rules that matter to residents.':'City Council meetings, agendas, packets, minutes, video, how to speak and the Open Meetings Act rules that matter to residents.'):(jurisdictionType==='county'?'Reuniones del Tribunal de Comisionados, agendas, actas, cómo participar y las reglas de reuniones abiertas.':'Reuniones del Concejo Municipal, agendas, paquetes, actas, video, cómo participar y las reglas de reuniones abiertas.')}</p></div><div className="source-note"><b>{lang==='en'?'Official first':'Primero lo oficial'}</b><p>{lang==='en'?'Every factual summary should trace back to the local government or State of Texas.':'Todo resumen factual debe poder rastrearse al gobierno local o al Estado de Texas.'}</p></div></section>
      <section id="money" className="editorial-section"><p className="section-kicker">{lang==='en'?'FOLLOW THE MONEY':'SIGUE EL DINERO'}</p><h2>{lang==='en'?'Numbers need receipts.':'Los números necesitan recibos.'}</h2><p>{lang==='en'?'Tax rates, budgets, debt, bonds, audits, contracts and capital projects, with an official source attached to every number.':'Tasas de impuestos, presupuestos, deuda, bonos, auditorías, contratos y proyectos de capital, con una fuente oficial para cada cifra.'}</p></section>
      <section id="records" className="dark-section"><p>{lang==='en'?'FIND IT BEFORE YOU PIR IT':'ENCUÉNTRALO ANTES DE PEDIRLO'}</p><h2>{lang==='en'?'The record may already be public.':'El registro quizá ya sea público.'}</h2><span>{lang==='en'?'Search the records published by this specific government before writing a Public Information Act request.':'Busca primero los registros publicados por este gobierno específico antes de presentar una solicitud de información pública.'}</span><button className="dark-tool-button" type="button" onClick={()=>openTool('records')}>{lang==='en'?'Start record finder':'Empezar buscador de registros'} →</button></section>
      <section id="rights" className="editorial-section"><p className="section-kicker">{lang==='en'?'YOUR RIGHTS':'TUS DERECHOS'}</p><h2>{lang==='en'?'Texas law, translated into human.':'La ley de Texas, explicada en lenguaje humano.'}</h2><p>{lang==='en'?`Learn the Open Meetings Act and Public Information Act from shared statewide legal modules, then see how they apply to ${city}.`:`Aprende la Ley de Reuniones Abiertas y la Ley de Información Pública y luego mira cómo se aplican a ${city}.`}</p></section>
      <section id="sources" className="sources"><strong>{t.official}</strong><a href={officialUrl} target="_blank" rel="noreferrer">{t.visit} ↗</a></section>
    </div></div>
    <footer><div><b>Texas Civic Guide</b><span>{t.independent}</span></div><p>{t.notAffiliated}</p><nav><a href="#sources">{t.sources}</a><a href="#accessibility">{t.accessibility}</a><button className="footer-lang" onClick={()=>setLang(lang==='en'?'es':'en')}>{t.toggle}</button><a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas ↗</a></nav></footer>
  </main>;
}
