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

const copy = {
  en: {
    sources:'Sources', accessibility:'Accessibility', toggle:'ESPAÑOL', your:'YOUR LOCAL GOVERNMENT',
    eyebrow:'LOCAL GOVERNMENT SHOULD NOT REQUIRE A TRANSLATOR', heroA:'What do you need', heroB:'from your government?',
    intro:'Start with the problem, question or record. We’ll point you toward the official answer.', search:'Search',
    placeholder:'water bill, 2025 audit, pothole, council agenda…', searchNote:'Searches services, records and civic guides on this page.',
    explore:'EXPLORE LOCAL GOVERNMENT', start:'START WITH WHAT YOU NEED', skip:'Skip the department chart.',
    noResults:'No verified match yet. Try a broader term or use the official website.', results:'Search results',
    official:'Official sources remain authoritative.', visit:'Visit the official website', independent:'Independent civic education resource',
    notAffiliated:'Not affiliated with the City of Copperas Cove, City of Gatesville, or Coryell County.',
  },
  es: {
    sources:'Fuentes', accessibility:'Accesibilidad', toggle:'ENGLISH', your:'TU GOBIERNO LOCAL',
    eyebrow:'EL GOBIERNO LOCAL NO DEBERÍA NECESITAR TRADUCTOR', heroA:'¿Qué necesitas', heroB:'de tu gobierno?',
    intro:'Empieza con el problema, la pregunta o el documento. Te dirigiremos a la respuesta oficial.', search:'Buscar',
    placeholder:'factura de agua, auditoría 2025, bache, agenda del concejo…', searchNote:'Busca servicios, registros y guías cívicas en esta página.',
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

const sections = [
  {id:'help' as ToolId, en:'I have a local government problem', es:'Tengo un problema con el gobierno local', descEn:'Find the office that handles it', descEs:'Encuentra la oficina que lo atiende', keywords:'water sewer utility trash street pothole drainage permit inspection code animal court record election tax sheriff clerk agua alcantarillado factura basura calle bache drenaje permiso inspección código animal tribunal registro elección impuesto alguacil secretario'},
  {id:'meetings' as ToolId, en:'What are elected officials doing?', es:'¿Qué están haciendo los funcionarios electos?', descEn:'Meetings, agendas, minutes and video', descEs:'Reuniones, agendas, actas y video', keywords:'meeting agenda council commissioners court minutes video speak public comment reunión agenda concejo comisionados actas video hablar comentario público'},
  {id:'money' as ToolId, en:'Where is the money going?', es:'¿A dónde va el dinero?', descEn:'Budgets, debt, audits and projects', descEs:'Presupuestos, deuda, auditorías y proyectos', keywords:'budget audit debt tax bond contract procurement capital water sewer presupuesto auditoría deuda impuesto bono contrato compras capital'},
  {id:'records' as ToolId, en:'I need a public record', es:'Necesito un registro público', descEn:'Find it first, then build a focused request', descEs:'Encuéntralo primero y luego prepara una solicitud precisa', keywords:'record TPIA PIR open records public information document ordinance resolution report campaign finance registro información pública documento ordenanza resolución informe campaña finanzas'},
  {id:'rights', en:'What are my rights?', es:'¿Cuáles son mis derechos?', descEn:'Texas open government and local authority', descEs:'Gobierno abierto de Texas y autoridad local', keywords:'rights charter open meetings OMA public information PIA TPIA speak council authority manager derechos carta reuniones abiertas información pública hablar autoridad administrador'}
];

const cityProblems = [
  ['water','Water / sewer','Agua / alcantarillado','Utility / Public Works','Servicios públicos / Obras Públicas'],
  ['billing','Utility bill / payment','Factura / pago de servicios','Utility Billing','Facturación de servicios'],
  ['trash','Trash / bulk pickup','Basura / recogida grande','Solid Waste / Sanitation','Residuos Sólidos / Saneamiento'],
  ['street','Pothole / street / drainage','Bache / calle / drenaje','Public Works / Streets','Obras Públicas / Calles'],
  ['permit','Permit / inspection','Permiso / inspección','Development / Building Inspections','Desarrollo / Inspecciones'],
  ['code','Code enforcement','Cumplimiento de códigos','Code Enforcement','Cumplimiento de Códigos'],
  ['animal','Animal control','Control de animales','Animal Control','Control de Animales'],
  ['court','Ticket / municipal court','Multa / tribunal municipal','Municipal Court','Tribunal Municipal'],
  ['records','Public records','Registros públicos','City Secretary / Public Information','Secretaría Municipal / Información Pública'],
  ['elections','City elections','Elecciones municipales','City Secretary / Elections','Secretaría Municipal / Elecciones']
];

const countyProblems = [
  ['tax','Property tax / vehicle registration','Impuesto predial / registro vehicular','Tax Assessor-Collector','Asesor-Recaudador de Impuestos'],
  ['records','Deeds / property records / official records','Escrituras / propiedad / registros oficiales','County Clerk','Secretaría del Condado'],
  ['court','Court case / filing','Caso judicial / presentación','County or District Clerk','Secretaría del Condado o Distrito'],
  ['elections','Voting / elections','Votación / elecciones','Elections Administration','Administración de Elecciones'],
  ['road','County road / precinct issue','Camino del condado / precinto','County Commissioner Precinct','Comisionado del Precinto'],
  ['sheriff','Sheriff / non-emergency','Alguacil / no emergencia','Sheriff’s Office','Oficina del Alguacil'],
  ['jail','Jail / inmate information','Cárcel / información de reclusos','Sheriff / Jail','Alguacil / Cárcel'],
  ['records-request','Public information request','Solicitud de información pública','County public-information officer / record custodian','Oficial de información pública / custodio'],
  ['budget','County budget / audit','Presupuesto / auditoría del condado','County Auditor / Commissioners Court','Auditor del Condado / Tribunal de Comisionados'],
  ['emergency','Emergency management','Manejo de emergencias','Emergency Management','Manejo de Emergencias']
];

export default function CityHome({ city, subtitle, officialUrl, jurisdictionType='city' }: CityHomeProps) {
  const [lang,setLang]=useState<Lang>('en');
  const [query,setQuery]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [activeTool,setActiveTool]=useState<ToolId | null>(null);
  const [selectedProblem,setSelectedProblem]=useState<string | null>(null);
  const t=copy[lang];
  const problems=jurisdictionType==='county'?countyProblems:cityProblems;

  const results=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return [];
    return sections.filter(s => `${s.en} ${s.es} ${s.descEn} ${s.descEs} ${s.keywords}`.toLowerCase().includes(q));
  },[query]);

  function openTool(id:ToolId){
    setActiveTool(id);
    setSelectedProblem(null);
    requestAnimationFrame(()=>document.getElementById('resident-tool')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function submit(e:FormEvent){
    e.preventDefault();
    setSubmitted(true);
    const first=results[0];
    if(first && ['help','meetings','money','records'].includes(first.id)) setActiveTool(first.id as ToolId);
    requestAnimationFrame(()=>document.getElementById('search-results')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  const ids=['help','hall','meetings','money','documents','rights','charter','oma','pia','sources'];
  const selected=problems.find(p=>p[0]===selectedProblem);

  return <main id="main" lang={lang}>
    <header className="city-header"><a className="wordmark" href="/">TEXAS <span>CIVIC GUIDE</span></a><nav aria-label="Utility"><a href="#sources">{t.sources}</a><a href="#accessibility">{t.accessibility}</a><button type="button" onClick={()=>{setLang(lang==='en'?'es':'en');setSubmitted(false)}} aria-label={lang==='en'?'Cambiar a español':'Switch to English'}>{t.toggle}</button></nav></header>
    <div className="city-label"><span>{t.your}</span><strong>{city}</strong><small>{subtitle}</small></div>
    <section className="resident-hero"><div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.heroA}<br/><em>{t.heroB}</em></h1><p>{t.intro}</p></div>
      <form className="big-search" onSubmit={submit}><label htmlFor="city-search">{t.search} {city}</label><div><input id="city-search" value={query} onChange={e=>{setQuery(e.target.value);setSubmitted(false)}} placeholder={t.placeholder}/><button type="submit">{t.search}</button></div><small>{t.searchNote}</small></form>
    </section>

    {submitted && <section id="search-results" className="search-results" aria-live="polite"><p className="section-kicker">{t.results}</p>{results.length? <div className="action-list">{results.map((r,i)=>['help','meetings','money','records'].includes(r.id)?<button type="button" onClick={()=>openTool(r.id as ToolId)} key={r.id}><b>0{i+1}</b><div><strong>{lang==='en'?r.en:r.es}</strong><span>{lang==='en'?r.descEn:r.descEs}</span></div><i>→</i></button>:<a href={'#'+r.id} key={r.id}><b>0{i+1}</b><div><strong>{lang==='en'?r.en:r.es}</strong><span>{lang==='en'?r.descEn:r.descEs}</span></div><i>→</i></a>)}</div>:<p>{t.noResults} <a href={officialUrl} target="_blank" rel="noreferrer">{t.visit} ↗</a></p>}</section>}

    <div className="city-layout"><aside><p>{t.explore}</p>{nav[lang].map((item,i)=><a key={item} href={'#'+ids[i]}>{item}<span>→</span></a>)}</aside><div className="city-content">
      <section className="start"><p className="section-kicker">{t.start}</p><h2>{t.skip}</h2><div className="action-list">{sections.slice(0,4).map((s,i)=><button type="button" onClick={()=>openTool(s.id as ToolId)} key={s.id}><b>0{i+1}</b><div><strong>{lang==='en'?s.en:s.es}</strong><span>{lang==='en'?s.descEn:s.descEs}</span></div><i>→</i></button>)}</div></section>

      <section id="resident-tool" className={`resident-tool ${activeTool?'is-open':''}`} aria-live="polite">
        {!activeTool && <div><p className="section-kicker">{lang==='en'?'RESIDENT TOOL':'HERRAMIENTA PARA RESIDENTES'}</p><h2>{lang==='en'?'Choose one of the four options above.':'Elige una de las cuatro opciones arriba.'}</h2></div>}

        {activeTool==='help' && <div>
          <p className="section-kicker">{lang==='en'?'WHO HANDLES MY PROBLEM?':'¿QUIÉN ATIENDE MI PROBLEMA?'}</p>
          <h2>{lang==='en'?'Tell us what happened.':'Dinos qué pasó.'}</h2>
          <p>{lang==='en'?'Pick the closest match. We’ll tell you which local office normally handles it.':'Elige la opción más cercana. Te diremos qué oficina local normalmente lo atiende.'}</p>
          <div className="problem-grid">{problems.map(p=><button type="button" className={selectedProblem===p[0]?'selected':''} onClick={()=>setSelectedProblem(p[0])} key={p[0]}>{lang==='en'?p[1]:p[2]}</button>)}</div>
          {selected && <div className="office-result"><span>{lang==='en'?'START HERE':'EMPIEZA AQUÍ'}</span><h3>{lang==='en'?selected[3]:selected[4]}</h3><p>{lang==='en'?`This is the office that normally handles “${selected[1]}” for this type of local government. Verify current contact details on the official ${city} website.`:`Esta es la oficina que normalmente atiende “${selected[2]}” para este tipo de gobierno local. Verifica los datos de contacto actuales en el sitio oficial de ${city}.`}</p><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Open official website':'Abrir sitio oficial'} ↗</a></div>}
        </div>}

        {activeTool==='meetings' && <div><p className="section-kicker">{lang==='en'?'MEETINGS':'REUNIONES'}</p><h2>{lang==='en'?'Find what elected officials are doing.':'Mira qué están haciendo los funcionarios electos.'}</h2><div className="tool-links"><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Find agendas and meeting notices':'Buscar agendas y avisos'} ↗</a><a href="#rights">{lang==='en'?'Learn your Open Meetings Act rights':'Conoce tus derechos bajo la Ley de Reuniones Abiertas'} →</a></div></div>}

        {activeTool==='money' && <div><p className="section-kicker">{lang==='en'?'FOLLOW THE MONEY':'SIGUE EL DINERO'}</p><h2>{lang==='en'?'Start with the official financial record.':'Empieza con el registro financiero oficial.'}</h2><div className="tool-links"><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Find budgets, audits and financial documents':'Buscar presupuestos, auditorías y documentos financieros'} ↗</a><a href="#money">{lang==='en'?'See what each document can tell you':'Ver qué puede decirte cada documento'} →</a></div></div>}

        {activeTool==='records' && <div><p className="section-kicker">{lang==='en'?'PUBLIC RECORDS':'REGISTROS PÚBLICOS'}</p><h2>{lang==='en'?'Find it before you request it.':'Encuéntralo antes de pedirlo.'}</h2><p>{lang==='en'?'Check the official site first for agendas, minutes, budgets, audits, ordinances, resolutions and reports. If it is not already published, the next step is a focused Texas Public Information Act request.':'Primero revisa el sitio oficial para agendas, actas, presupuestos, auditorías, ordenanzas, resoluciones e informes. Si no está publicado, el próximo paso es una solicitud precisa bajo la Ley de Información Pública de Texas.'}</p><div className="tool-links"><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Search official records':'Buscar registros oficiales'} ↗</a><a href="#rights">{lang==='en'?'Learn the Public Information Act':'Conoce la Ley de Información Pública'} →</a></div></div>}
      </section>

      <section id="help" className="editorial-section"><p className="section-kicker">{lang==='en'?'WHO HANDLES MY PROBLEM?':'¿QUIÉN ATIENDE MI PROBLEMA?'}</p><h2>{lang==='en'?'Get to the right office the first time.':'Llega a la oficina correcta desde el principio.'}</h2><p>{lang==='en'?'Use the resident tool above to choose your problem and get an office recommendation.':'Usa la herramienta de arriba para elegir tu problema y recibir una recomendación de oficina.'}</p><button className="inline-tool-button" type="button" onClick={()=>openTool('help')}>{lang==='en'?'Open problem finder':'Abrir buscador de oficinas'} →</button></section>
      <section id="meetings" className="editorial-section split"><div><p className="section-kicker">{lang==='en'?'WHAT ARE THEY DOING?':'¿QUÉ ESTÁN HACIENDO?'}</p><h2>{lang==='en'?'Meetings without the scavenger hunt.':'Reuniones sin búsqueda del tesoro.'}</h2><p>{lang==='en'?'Next meeting, agenda, packet, minutes, video, how to speak and the Open Meetings Act rules that matter to residents.':'Próxima reunión, agenda, paquete, actas, video, cómo participar y las reglas de la Ley de Reuniones Abiertas que importan a los residentes.'}</p></div><div className="source-note"><b>{lang==='en'?'Official first':'Primero lo oficial'}</b><p>{lang==='en'?'Every factual summary should trace back to the local government or State of Texas.':'Todo resumen factual debe poder rastrearse al gobierno local o al Estado de Texas.'}</p></div></section>
      <section id="money" className="editorial-section"><p className="section-kicker">{lang==='en'?'FOLLOW THE MONEY':'SIGUE EL DINERO'}</p><h2>{lang==='en'?'Numbers need receipts.':'Los números necesitan recibos.'}</h2><p>{lang==='en'?'Tax rates, budgets, debt, bonds, audits, contracts and capital projects, with an official source attached to every number.':'Tasas de impuestos, presupuestos, deuda, bonos, auditorías, contratos y proyectos de capital, con una fuente oficial para cada cifra.'}</p></section>
      <section id="records" className="dark-section"><p>{lang==='en'?'FIND IT BEFORE YOU PIR IT':'ENCUÉNTRALO ANTES DE PEDIRLO'}</p><h2>{lang==='en'?'The record may already be public.':'El registro quizá ya sea público.'}</h2><span>{lang==='en'?'Search budgets, audits, contracts, agendas, minutes, ordinances, resolutions, reports and campaign finance before writing a Public Information Act request.':'Busca presupuestos, auditorías, contratos, agendas, actas, ordenanzas, resoluciones, informes y finanzas de campaña antes de presentar una solicitud de información pública.'}</span><button className="dark-tool-button" type="button" onClick={()=>openTool('records')}>{lang==='en'?'Start record finder':'Empezar buscador de registros'} →</button></section>
      <section id="rights" className="editorial-section"><p className="section-kicker">{lang==='en'?'YOUR RIGHTS':'TUS DERECHOS'}</p><h2>{lang==='en'?'Texas law, translated into human.':'La ley de Texas, explicada en lenguaje humano.'}</h2><p>{lang==='en'?`Learn the Open Meetings Act and Public Information Act from shared statewide legal modules, then see how they apply to ${city}.`:`Aprende la Ley de Reuniones Abiertas y la Ley de Información Pública y luego mira cómo se aplican a ${city}.`}</p></section>
      <section id="sources" className="sources"><strong>{t.official}</strong><a href={officialUrl} target="_blank" rel="noreferrer">{t.visit} ↗</a></section>
    </div></div>
    <footer><div><b>Texas Civic Guide</b><span>{t.independent}</span></div><p>{t.notAffiliated}</p><nav><a href="#sources">{t.sources}</a><a href="#accessibility">{t.accessibility}</a><button className="footer-lang" onClick={()=>setLang(lang==='en'?'es':'en')}>{t.toggle}</button><a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas ↗</a></nav></footer>
  </main>;
}
