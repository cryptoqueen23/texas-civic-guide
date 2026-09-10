'use client';

import { FormEvent, useMemo, useState } from 'react';

type CityHomeProps = {
  city: string;
  subtitle: string;
  officialUrl: string;
  jurisdictionType?: 'city' | 'county';
};

type Lang = 'en' | 'es';

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
  {id:'help', en:'I have a local government problem', es:'Tengo un problema con el gobierno local', descEn:'Find the office that handles it', descEs:'Encuentra la oficina que lo atiende', keywords:'water sewer utility trash street pothole drainage permit inspection code animal court record election tax sheriff clerk agua alcantarillado factura basura calle bache drenaje permiso inspección código animal tribunal registro elección impuesto alguacil secretario'},
  {id:'meetings', en:'What are elected officials doing?', es:'¿Qué están haciendo los funcionarios electos?', descEn:'Meetings, agendas, minutes and video', descEs:'Reuniones, agendas, actas y video', keywords:'meeting agenda council commissioners court minutes video speak public comment reunión agenda concejo comisionados actas video hablar comentario público'},
  {id:'money', en:'Where is the money going?', es:'¿A dónde va el dinero?', descEn:'Budgets, debt, audits and projects', descEs:'Presupuestos, deuda, auditorías y proyectos', keywords:'budget audit debt tax bond contract procurement capital water sewer presupuesto auditoría deuda impuesto bono contrato compras capital'},
  {id:'records', en:'I need a public record', es:'Necesito un registro público', descEn:'Find it first, then build a focused request', descEs:'Encuéntralo primero y luego prepara una solicitud precisa', keywords:'record TPIA PIR open records public information document ordinance resolution report campaign finance registro información pública documento ordenanza resolución informe campaña finanzas'},
  {id:'rights', en:'What are my rights?', es:'¿Cuáles son mis derechos?', descEn:'Texas open government and local authority', descEs:'Gobierno abierto de Texas y autoridad local', keywords:'rights charter open meetings OMA public information PIA TPIA speak council authority manager derechos carta reuniones abiertas información pública hablar autoridad administrador'}
];

export default function CityHome({ city, subtitle, officialUrl }: CityHomeProps) {
  const [lang,setLang]=useState<Lang>('en');
  const [query,setQuery]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const t=copy[lang];
  const results=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q) return [];
    return sections.filter(s => `${s.en} ${s.es} ${s.descEn} ${s.descEs} ${s.keywords}`.toLowerCase().includes(q));
  },[query]);
  function submit(e:FormEvent){e.preventDefault();setSubmitted(true);requestAnimationFrame(()=>document.getElementById('search-results')?.scrollIntoView({behavior:'smooth',block:'start'}));}
  const ids=['help','hall','meetings','money','documents','rights','charter','oma','pia','sources'];
  return <main id="main" lang={lang}>
    <header className="city-header"><a className="wordmark" href="/">TEXAS <span>CIVIC GUIDE</span></a><nav aria-label="Utility"><a href="#sources">{t.sources}</a><a href="#accessibility">{t.accessibility}</a><button type="button" onClick={()=>{setLang(lang==='en'?'es':'en');setSubmitted(false)}} aria-label={lang==='en'?'Cambiar a español':'Switch to English'}>{t.toggle}</button></nav></header>
    <div className="city-label"><span>{t.your}</span><strong>{city}</strong><small>{subtitle}</small></div>
    <section className="resident-hero"><div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.heroA}<br/><em>{t.heroB}</em></h1><p>{t.intro}</p></div>
      <form className="big-search" onSubmit={submit}><label htmlFor="city-search">{t.search} {city}</label><div><input id="city-search" value={query} onChange={e=>{setQuery(e.target.value);setSubmitted(false)}} placeholder={t.placeholder}/><button type="submit">{t.search}</button></div><small>{t.searchNote}</small></form>
    </section>
    {submitted && <section id="search-results" className="search-results" aria-live="polite"><p className="section-kicker">{t.results}</p>{results.length? <div className="action-list">{results.map((r,i)=><a href={'#'+r.id} key={r.id}><b>0{i+1}</b><div><strong>{lang==='en'?r.en:r.es}</strong><span>{lang==='en'?r.descEn:r.descEs}</span></div><i>→</i></a>)}</div>:<p>{t.noResults} <a href={officialUrl} target="_blank" rel="noreferrer">{t.visit} ↗</a></p>}</section>}
    <div className="city-layout"><aside><p>{t.explore}</p>{nav[lang].map((item,i)=><a key={item} href={'#'+ids[i]}>{item}<span>→</span></a>)}</aside><div className="city-content">
      <section className="start"><p className="section-kicker">{t.start}</p><h2>{t.skip}</h2><div className="action-list">{sections.slice(0,4).map((s,i)=><a href={'#'+s.id} key={s.id}><b>0{i+1}</b><div><strong>{lang==='en'?s.en:s.es}</strong><span>{lang==='en'?s.descEn:s.descEs}</span></div><i>→</i></a>)}</div></section>
      <section id="help" className="editorial-section"><p className="section-kicker">{lang==='en'?'WHO HANDLES MY PROBLEM?':'¿QUIÉN ATIENDE MI PROBLEMA?'}</p><h2>{lang==='en'?'Get to the right office the first time.':'Llega a la oficina correcta desde el principio.'}</h2><p>{lang==='en'?'Water and sewer · utility billing · trash · streets and potholes · drainage · permits · inspections · code enforcement · animal control · police/sheriff non-emergency · fire · parks · municipal/county court · public records · elections · finance · HR · economic development · after-hours emergencies':'Agua y alcantarillado · facturación · basura · calles y baches · drenaje · permisos · inspecciones · cumplimiento de códigos · control de animales · policía/alguacil no emergencia · bomberos · parques · tribunal municipal/del condado · registros públicos · elecciones · finanzas · recursos humanos · desarrollo económico · emergencias fuera de horario'}</p></section>
      <section id="meetings" className="editorial-section split"><div><p className="section-kicker">{lang==='en'?'WHAT ARE THEY DOING?':'¿QUÉ ESTÁN HACIENDO?'}</p><h2>{lang==='en'?'Meetings without the scavenger hunt.':'Reuniones sin búsqueda del tesoro.'}</h2><p>{lang==='en'?'Next meeting, agenda, packet, minutes, video, how to speak and the Open Meetings Act rules that matter to residents.':'Próxima reunión, agenda, paquete, actas, video, cómo participar y las reglas de la Ley de Reuniones Abiertas que importan a los residentes.'}</p></div><div className="source-note"><b>{lang==='en'?'Official first':'Primero lo oficial'}</b><p>{lang==='en'?'Every factual summary should trace back to the local government or State of Texas.':'Todo resumen factual debe poder rastrearse al gobierno local o al Estado de Texas.'}</p></div></section>
      <section id="money" className="editorial-section"><p className="section-kicker">{lang==='en'?'FOLLOW THE MONEY':'SIGUE EL DINERO'}</p><h2>{lang==='en'?'Numbers need receipts.':'Los números necesitan recibos.'}</h2><p>{lang==='en'?'Tax rates, budgets, debt, bonds, audits, contracts and capital projects, with an official source attached to every number.':'Tasas de impuestos, presupuestos, deuda, bonos, auditorías, contratos y proyectos de capital, con una fuente oficial para cada cifra.'}</p></section>
      <section id="records" className="dark-section"><p>{lang==='en'?'FIND IT BEFORE YOU PIR IT':'ENCUÉNTRALO ANTES DE PEDIRLO'}</p><h2>{lang==='en'?'The record may already be public.':'El registro quizá ya sea público.'}</h2><span>{lang==='en'?'Search budgets, audits, contracts, agendas, minutes, ordinances, resolutions, reports and campaign finance before writing a Public Information Act request.':'Busca presupuestos, auditorías, contratos, agendas, actas, ordenanzas, resoluciones, informes y finanzas de campaña antes de presentar una solicitud de información pública.'}</span></section>
      <section id="rights" className="editorial-section"><p className="section-kicker">{lang==='en'?'YOUR RIGHTS':'TUS DERECHOS'}</p><h2>{lang==='en'?'Texas law, translated into human.':'La ley de Texas, explicada en lenguaje humano.'}</h2><p>{lang==='en'?`Learn the Open Meetings Act and Public Information Act from shared statewide legal modules, then see how they apply to ${city}.`:`Aprende la Ley de Reuniones Abiertas y la Ley de Información Pública y luego mira cómo se aplican a ${city}.`}</p></section>
      <section id="sources" className="sources"><strong>{t.official}</strong><a href={officialUrl} target="_blank" rel="noreferrer">{t.visit} ↗</a></section>
    </div></div>
    <footer><div><b>Texas Civic Guide</b><span>{t.independent}</span></div><p>{t.notAffiliated}</p><nav><a href="#sources">{t.sources}</a><a href="#accessibility">{t.accessibility}</a><button className="footer-lang" onClick={()=>setLang(lang==='en'?'es':'en')}>{t.toggle}</button><a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas ↗</a></nav></footer>
  </main>;
}
