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

type Route = {
  phrases: string[];
  area: 'city' | 'county';
  tool: ToolId;
  titleEn: string;
  titleEs: string;
  officeEn: string;
  officeEs: string;
};

const cityRoutes: Route[] = [
  {phrases:['water bill','utility bill','bill payment','pay water bill','factura de agua','factura de servicios'],area:'city',tool:'help',titleEn:'Utility bill / payment',titleEs:'Factura / pago de servicios',officeEn:'Utility Billing',officeEs:'Facturación de servicios'},
  {phrases:['water leak','sewer','low water pressure','hydrant','wastewater','fuga de agua','alcantarillado','baja presión'],area:'city',tool:'help',titleEn:'Water / sewer',titleEs:'Agua / alcantarillado',officeEn:'Utility / Public Works',officeEs:'Servicios públicos / Obras Públicas'},
  {phrases:['pothole','city street','street repair','drainage','bache','calle','drenaje'],area:'city',tool:'help',titleEn:'Street / pothole / drainage',titleEs:'Calle / bache / drenaje',officeEn:'Public Works / Streets',officeEs:'Obras Públicas / Calles'},
  {phrases:['trash','garbage','bulk pickup','recycling','basura','reciclaje'],area:'city',tool:'help',titleEn:'Trash / sanitation',titleEs:'Basura / saneamiento',officeEn:'Solid Waste / Sanitation',officeEs:'Residuos Sólidos / Saneamiento'},
  {phrases:['permit','inspection','building permit','zoning','permiso','inspección','zonificación'],area:'city',tool:'help',titleEn:'Permit / inspection',titleEs:'Permiso / inspección',officeEn:'Development / Building Inspections',officeEs:'Desarrollo / Inspecciones'},
  {phrases:['code enforcement','weeds','junk vehicle','nuisance','cumplimiento de códigos','maleza'],area:'city',tool:'help',titleEn:'Code enforcement',titleEs:'Cumplimiento de códigos',officeEn:'Code Enforcement',officeEs:'Cumplimiento de Códigos'},
  {phrases:['animal control','stray dog','stray cat','dog bite','control de animales','perro callejero'],area:'city',tool:'help',titleEn:'Animal control',titleEs:'Control de animales',officeEn:'Animal Control',officeEs:'Control de Animales'},
  {phrases:['municipal court','ticket','traffic ticket','citation','multa','tribunal municipal'],area:'city',tool:'help',titleEn:'Municipal court / ticket',titleEs:'Tribunal municipal / multa',officeEn:'Municipal Court',officeEs:'Tribunal Municipal'},
  {phrases:['city election','mayor election','council election','elección municipal','elección de alcalde'],area:'city',tool:'help',titleEn:'City elections',titleEs:'Elecciones municipales',officeEn:'City Secretary / Elections',officeEs:'Secretaría Municipal / Elecciones'},
  {phrases:['council agenda','city council agenda','council meeting','council minutes','public comment','agenda del concejo','reunión del concejo'],area:'city',tool:'meetings',titleEn:'City Council meetings',titleEs:'Reuniones del Concejo Municipal',officeEn:'City Council / City Secretary',officeEs:'Concejo Municipal / Secretaría Municipal'},
  {phrases:['city budget','city audit','city debt','tax rate','bond','certificate of obligation','presupuesto municipal','auditoría municipal'],area:'city',tool:'money',titleEn:'City finances',titleEs:'Finanzas municipales',officeEn:'Finance / City Council',officeEs:'Finanzas / Concejo Municipal'},
  {phrases:['public record','open records','tpia','pir','ordinance','resolution','city records','registro público','información pública','ordenanza','resolución'],area:'city',tool:'records',titleEn:'City public records',titleEs:'Registros públicos municipales',officeEn:'City Secretary / Public Information',officeEs:'Secretaría Municipal / Información Pública'}
];

const countyRoutes: Route[] = [
  {phrases:['property tax','vehicle registration','vehicle title','license plates','impuesto predial','registro vehicular','título vehicular'],area:'county',tool:'help',titleEn:'Property tax / vehicle registration',titleEs:'Impuesto predial / registro vehicular',officeEn:'Tax Assessor-Collector',officeEs:'Asesor-Recaudador de Impuestos'},
  {phrases:['deed','property record','marriage license','birth certificate','death certificate','official records','escritura','registro de propiedad','licencia de matrimonio'],area:'county',tool:'help',titleEn:'Deeds / official records',titleEs:'Escrituras / registros oficiales',officeEn:'County Clerk',officeEs:'Secretaría del Condado'},
  {phrases:['district court','county court','court filing','probate','lawsuit','tribunal de distrito','presentación judicial'],area:'county',tool:'help',titleEn:'County or district court filing',titleEs:'Presentación en tribunal del condado o distrito',officeEn:'County or District Clerk',officeEs:'Secretaría del Condado o Distrito'},
  {phrases:['vote','voter registration','polling place','county election','votar','registro de votante','lugar de votación'],area:'county',tool:'help',titleEn:'Voting / elections',titleEs:'Votación / elecciones',officeEn:'Elections Administration',officeEs:'Administración de Elecciones'},
  {phrases:['county road','rural road','precinct road','bridge','culvert','camino del condado','camino rural','precinto'],area:'county',tool:'help',titleEn:'County road / precinct issue',titleEs:'Camino del condado / asunto del precinto',officeEn:'County Commissioner Precinct',officeEs:'Comisionado del Precinto'},
  {phrases:['sheriff','deputy','sheriff report','non emergency sheriff','alguacil','patrulla'],area:'county',tool:'help',titleEn:'Sheriff / non-emergency',titleEs:'Alguacil / no emergencia',officeEn:'Sheriff’s Office',officeEs:'Oficina del Alguacil'},
  {phrases:['jail','inmate','booking','bond','visitation','cárcel','recluso','fianza'],area:'county',tool:'help',titleEn:'Jail / inmate information',titleEs:'Cárcel / información de reclusos',officeEn:'Sheriff / Jail',officeEs:'Alguacil / Cárcel'},
  {phrases:['commissioners court','commissioners court agenda','county judge meeting','commissioner meeting','tribunal de comisionados','agenda de comisionados'],area:'county',tool:'meetings',titleEn:'Commissioners Court meetings',titleEs:'Reuniones del Tribunal de Comisionados',officeEn:'Commissioners Court',officeEs:'Tribunal de Comisionados'},
  {phrases:['county budget','county audit','county spending','county tax rate','presupuesto del condado','auditoría del condado'],area:'county',tool:'money',titleEn:'County finances',titleEs:'Finanzas del condado',officeEn:'County Auditor / Commissioners Court',officeEs:'Auditor del Condado / Tribunal de Comisionados'},
  {phrases:['county public record','county tpia','county open records','county records request','registro público del condado','información pública del condado'],area:'county',tool:'records',titleEn:'County public records',titleEs:'Registros públicos del condado',officeEn:'Record custodian / Public Information',officeEs:'Custodio de registros / Información Pública'}
];

function normalize(value:string){
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}

function findRoute(query:string){
  const q=normalize(query);
  const all=[...cityRoutes,...countyRoutes];
  const exact=all.find(r=>r.phrases.some(p=>normalize(p)===q));
  if(exact) return exact;
  return all.find(r=>r.phrases.some(p=>q.includes(normalize(p)) || normalize(p).includes(q)));
}

export default function CityHome({ city, subtitle, officialUrl, jurisdictionType='city' }: CityHomeProps) {
  const [lang,setLang]=useState<Lang>('en');
  const [query,setQuery]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [activeTool,setActiveTool]=useState<ToolId | null>(null);
  const [selected,setSelected]=useState<Route | null>(null);
  const result=useMemo(()=>findRoute(query),[query]);
  const isCounty=jurisdictionType==='county';

  function runRoute(route:Route){
    setSelected(route);
    setActiveTool(route.tool);
    requestAnimationFrame(()=>document.getElementById('resident-tool')?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function submit(e:FormEvent){
    e.preventDefault();
    setSubmitted(true);
    if(result && result.area===jurisdictionType) runRoute(result);
    else setSelected(result || null);
  }

  const navEn=['I Need Help','Your Local Government','Meetings','Follow the Money','Documents','Your Rights','Charter / Structure','Open Meetings Act','Public Information Act','Official Sources'];
  const navEs=['Necesito Ayuda','Tu Gobierno Local','Reuniones','Sigue el Dinero','Documentos','Tus Derechos','Carta / Estructura','Ley de Reuniones Abiertas','Ley de Información Pública','Fuentes Oficiales'];
  const ids=['help','hall','meetings','money','documents','rights','charter','oma','pia','sources'];

  const problemButtons=(isCounty?countyRoutes:cityRoutes).filter(r=>r.tool==='help');

  return <main id="main" lang={lang}>
    <header className="city-header"><a className="wordmark" href="/">TEXAS <span>CIVIC GUIDE</span></a><nav aria-label="Utility"><a href="#sources">{lang==='en'?'Sources':'Fuentes'}</a><a href="#accessibility">{lang==='en'?'Accessibility':'Accesibilidad'}</a><button type="button" onClick={()=>setLang(lang==='en'?'es':'en')}>{lang==='en'?'ESPAÑOL':'ENGLISH'}</button></nav></header>
    <div className="city-label"><span>{lang==='en'?'YOUR LOCAL GOVERNMENT':'TU GOBIERNO LOCAL'}</span><strong>{city}</strong><small>{subtitle}</small></div>

    <section className="resident-hero"><div className="hero-copy"><p className="eyebrow">{lang==='en'?'LOCAL GOVERNMENT SHOULD NOT REQUIRE A TRANSLATOR':'EL GOBIERNO LOCAL NO DEBERÍA NECESITAR TRADUCTOR'}</p><h1>{lang==='en'?'What do you need':'¿Qué necesitas'}<br/><em>{lang==='en'?'from your government?':'de tu gobierno?'}</em></h1><p>{lang==='en'?'Type the problem in plain language. We will give you one best answer.':'Escribe el problema en lenguaje sencillo. Te daremos una sola mejor respuesta.'}</p></div>
      <form className="big-search" onSubmit={submit}><label htmlFor="city-search">{lang==='en'?'Search':'Buscar'} {city}</label><div><input id="city-search" value={query} onChange={e=>{setQuery(e.target.value);setSubmitted(false)}} placeholder={isCounty?(lang==='en'?'property tax, deed, county road, commissioners court…':'impuesto predial, escritura, camino del condado…'):(lang==='en'?'water bill, pothole, permit, council agenda…':'factura de agua, bache, permiso, agenda del concejo…')}/><button type="submit">{lang==='en'?'Search':'Buscar'}</button></div><small>{lang==='en'?'One query. One best route.':'Una consulta. Una sola mejor ruta.'}</small></form>
    </section>

    {submitted && <section id="search-results" className="search-results" aria-live="polite"><p className="section-kicker">{lang==='en'?'BEST MATCH':'MEJOR COINCIDENCIA'}</p>{!result?<p>{lang==='en'?'No direct match yet. Choose a common issue below or use the official website.':'Todavía no hay una coincidencia directa. Elige un problema común abajo o usa el sitio oficial.'}</p>:result.area!==jurisdictionType?<div className="office-result"><span>{lang==='en'?'WRONG LEVEL OF GOVERNMENT':'NIVEL DE GOBIERNO INCORRECTO'}</span><h3>{lang==='en'?(result.area==='county'?'This belongs with Coryell County':'This is usually a city issue'):(result.area==='county'?'Esto corresponde al Condado de Coryell':'Esto normalmente corresponde a una ciudad')}</h3><p>{lang==='en'?`${result.titleEn} is normally handled by ${result.officeEn}.`:`${result.titleEs} normalmente lo atiende ${result.officeEs}.`}</p><a href={result.area==='county'?'/coryell-county':'/'}>{lang==='en'?'Go to the right government':'Ir al gobierno correcto'} →</a></div>:<button className="single-result" type="button" onClick={()=>runRoute(result)}><strong>{lang==='en'?result.titleEn:result.titleEs}</strong><span>{lang==='en'?`Start with ${result.officeEn}`:`Empieza con ${result.officeEs}`}</span><i>→</i></button>}</section>}

    <div className="city-layout"><aside><p>{lang==='en'?'EXPLORE LOCAL GOVERNMENT':'EXPLORA TU GOBIERNO LOCAL'}</p>{(lang==='en'?navEn:navEs).map((item,i)=><a key={item} href={'#'+ids[i]}>{item}<span>→</span></a>)}</aside><div className="city-content">
      <section className="start"><p className="section-kicker">{lang==='en'?'START WITH WHAT YOU NEED':'EMPIEZA CON LO QUE NECESITAS'}</p><h2>{lang==='en'?'Common problems':'Problemas comunes'}</h2><div className="problem-grid">{problemButtons.map(r=><button key={r.titleEn} type="button" onClick={()=>runRoute(r)}>{lang==='en'?r.titleEn:r.titleEs}</button>)}</div></section>

      <section id="resident-tool" className={`resident-tool ${activeTool?'is-open':''}`} aria-live="polite">
        {!activeTool && <div><p className="section-kicker">{lang==='en'?'RESIDENT TOOL':'HERRAMIENTA PARA RESIDENTES'}</p><h2>{lang==='en'?'Search above or choose a common problem.':'Busca arriba o elige un problema común.'}</h2></div>}
        {activeTool==='help' && selected && <div><p className="section-kicker">{lang==='en'?'START HERE':'EMPIEZA AQUÍ'}</p><h2>{lang==='en'?selected.officeEn:selected.officeEs}</h2><p>{lang==='en'?`Best match for “${selected.titleEn}.” Verify current contact information on the official ${city} website.`:`Mejor coincidencia para “${selected.titleEs}”. Verifica la información de contacto actual en el sitio oficial de ${city}.`}</p><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Open official website':'Abrir sitio oficial'} ↗</a></div>}
        {activeTool==='meetings' && <div><p className="section-kicker">{lang==='en'?'MEETINGS':'REUNIONES'}</p><h2>{isCounty?(lang==='en'?'Commissioners Court':'Tribunal de Comisionados'):(lang==='en'?'City Council':'Concejo Municipal')}</h2><p>{lang==='en'?'Use the official source for agendas, notices, minutes and meeting information.':'Usa la fuente oficial para agendas, avisos, actas e información de reuniones.'}</p><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Open official meeting source':'Abrir fuente oficial de reuniones'} ↗</a></div>}
        {activeTool==='money' && <div><p className="section-kicker">{lang==='en'?'FOLLOW THE MONEY':'SIGUE EL DINERO'}</p><h2>{lang==='en'?'Budgets, audits and financial records':'Presupuestos, auditorías y registros financieros'}</h2><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Open official financial source':'Abrir fuente financiera oficial'} ↗</a></div>}
        {activeTool==='records' && <div><p className="section-kicker">{lang==='en'?'PUBLIC RECORDS':'REGISTROS PÚBLICOS'}</p><h2>{lang==='en'?'Find it before you request it.':'Encuéntralo antes de pedirlo.'}</h2><p>{lang==='en'?'Check the official site first. If the record is not already published, then use a focused Texas Public Information Act request.':'Revisa primero el sitio oficial. Si el registro no está publicado, usa una solicitud precisa bajo la Ley de Información Pública de Texas.'}</p><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Search official records':'Buscar registros oficiales'} ↗</a></div>}
      </section>

      <section id="help" className="editorial-section"><p className="section-kicker">{lang==='en'?'WHO HANDLES MY PROBLEM?':'¿QUIÉN ATIENDE MI PROBLEMA?'}</p><h2>{lang==='en'?'One problem. One office.':'Un problema. Una oficina.'}</h2><p>{lang==='en'?'The guide now uses deterministic routing instead of fuzzy multi-result search.':'La guía ahora usa rutas deterministas en vez de búsquedas ambiguas con múltiples resultados.'}</p></section>
      <section id="meetings" className="editorial-section"><p className="section-kicker">{lang==='en'?'MEETINGS':'REUNIONES'}</p><h2>{lang==='en'?'See what elected officials are doing.':'Mira qué están haciendo los funcionarios electos.'}</h2></section>
      <section id="money" className="editorial-section"><p className="section-kicker">{lang==='en'?'FOLLOW THE MONEY':'SIGUE EL DINERO'}</p><h2>{lang==='en'?'Numbers need receipts.':'Los números necesitan recibos.'}</h2></section>
      <section id="records" className="dark-section"><p>{lang==='en'?'FIND IT BEFORE YOU PIR IT':'ENCUÉNTRALO ANTES DE PEDIRLO'}</p><h2>{lang==='en'?'The record may already be public.':'El registro quizá ya sea público.'}</h2></section>
      <section id="rights" className="editorial-section"><p className="section-kicker">{lang==='en'?'YOUR RIGHTS':'TUS DERECHOS'}</p><h2>{lang==='en'?'Texas law, translated into human.':'La ley de Texas, explicada en lenguaje humano.'}</h2></section>
      <section id="sources" className="sources"><strong>{lang==='en'?'Official sources remain authoritative.':'Las fuentes oficiales siguen siendo la autoridad.'}</strong><a href={officialUrl} target="_blank" rel="noreferrer">{lang==='en'?'Visit official website':'Visitar sitio oficial'} ↗</a></section>
    </div></div>

    <footer><div><b>Texas Civic Guide</b><span>{lang==='en'?'Independent civic education resource':'Recurso independiente de educación cívica'}</span></div><p>{lang==='en'?'Not affiliated with the City of Copperas Cove, City of Gatesville, or Coryell County.':'No está afiliado con la Ciudad de Copperas Cove, la Ciudad de Gatesville ni el Condado de Coryell.'}</p><nav><a href="#sources">{lang==='en'?'Sources':'Fuentes'}</a><button className="footer-lang" onClick={()=>setLang(lang==='en'?'es':'en')}>{lang==='en'?'Español':'English'}</button><a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas ↗</a></nav></footer>
  </main>;
}
