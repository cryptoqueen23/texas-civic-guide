'use client';

import { FormEvent, useEffect, useState } from 'react';

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
  { phrases:['water bill','utility bill','bill payment','pay water bill','my water bill is wrong','high water bill','water payment','factura de agua','factura de servicios','pagar agua','mi factura de agua'], area:'city', tool:'help', titleEn:'Utility bill / payment', titleEs:'Factura / pago de servicios', officeEn:'Utility Billing', officeEs:'Facturación de servicios' },
  { phrases:['water leak','sewer','low water pressure','hydrant','wastewater','no water','broken water main','fuga de agua','alcantarillado','baja presión','sin agua'], area:'city', tool:'help', titleEn:'Water / sewer', titleEs:'Agua / alcantarillado', officeEn:'Water Distribution / Public Works', officeEs:'Distribución de Agua / Obras Públicas' },
  { phrases:['pothole','city street','street repair','drainage','street light','bache','calle','drenaje','luz de la calle'], area:'city', tool:'help', titleEn:'Street / pothole / drainage', titleEs:'Calle / bache / drenaje', officeEn:'Streets / Public Works', officeEs:'Calles / Obras Públicas' },
  { phrases:['trash','garbage','bulk pickup','recycling','missed trash','basura','reciclaje','no recogieron la basura'], area:'city', tool:'help', titleEn:'Trash / sanitation', titleEs:'Basura / saneamiento', officeEn:'Solid Waste', officeEs:'Residuos Sólidos' },
  { phrases:['permit','inspection','building permit','zoning','fence permit','permiso','inspección','zonificación'], area:'city', tool:'help', titleEn:'Permit / inspection', titleEs:'Permiso / inspección', officeEn:'Development Services / Building', officeEs:'Servicios de Desarrollo / Construcción' },
  { phrases:['code enforcement','code compliance','weeds','junk vehicle','nuisance','cumplimiento de códigos','maleza','vehículo abandonado'], area:'city', tool:'help', titleEn:'Code compliance', titleEs:'Cumplimiento de códigos', officeEn:'Code Compliance', officeEs:'Cumplimiento de Códigos' },
  { phrases:['animal control','stray dog','stray cat','dog bite','control de animales','perro callejero','gato callejero'], area:'city', tool:'help', titleEn:'Animal control', titleEs:'Control de animales', officeEn:'Animal Control', officeEs:'Control de Animales' },
  { phrases:['municipal court','ticket','traffic ticket','citation','pay ticket','multa','tribunal municipal','pagar multa'], area:'city', tool:'help', titleEn:'Municipal court / ticket', titleEs:'Tribunal municipal / multa', officeEn:'Municipal Court', officeEs:'Tribunal Municipal' },
  { phrases:['city election','mayor election','council election','candidate','ballot','elección municipal','elección de alcalde','candidato','boleta'], area:'city', tool:'help', titleEn:'City elections', titleEs:'Elecciones municipales', officeEn:'City Secretary / Elections', officeEs:'Secretaría Municipal / Elecciones' },
  { phrases:['council agenda','city council agenda','council meeting','council minutes','meeting video','public comment','next council meeting','when is council','agenda del concejo','reunión del concejo','cuando es la reunion del concejo','cuándo es la reunión del concejo'], area:'city', tool:'meetings', titleEn:'City Council meetings', titleEs:'Reuniones del Concejo Municipal', officeEn:'City Council / City Secretary', officeEs:'Concejo Municipal / Secretaría Municipal' },
  { phrases:['city budget','city audit','city debt','tax rate','certificate of obligation','bond','financial report','2025 audit','2026 budget','presupuesto municipal','auditoría municipal','deuda','tasa de impuestos'], area:'city', tool:'money', titleEn:'City finances', titleEs:'Finanzas municipales', officeEn:'Budget / Finance', officeEs:'Presupuesto / Finanzas' },
  { phrases:['public record','open records','tpia','pir','ordinance','resolution','city records','email records','contract','records request','registro público','información pública','ordenanza','resolución','solicitud de registros'], area:'city', tool:'records', titleEn:'City public records', titleEs:'Registros públicos municipales', officeEn:'City Secretary / Public Information', officeEs:'Secretaría Municipal / Información Pública' }
];

const countyRoutes: Route[] = [
  { phrases:['property tax','vehicle registration','vehicle title','license plates','tax office','impuesto predial','registro vehicular','título vehicular','placas'], area:'county', tool:'help', titleEn:'Property tax / vehicle registration', titleEs:'Impuesto predial / registro vehicular', officeEn:'Tax Assessor-Collector', officeEs:'Asesor-Recaudador de Impuestos' },
  { phrases:['deed','property record','marriage license','birth certificate','death certificate','official records','escritura','registro de propiedad','licencia de matrimonio','acta de nacimiento','acta de defunción'], area:'county', tool:'help', titleEn:'Deeds / official records', titleEs:'Escrituras / registros oficiales', officeEn:'County Clerk', officeEs:'Secretaría del Condado' },
  { phrases:['district court','county court','court filing','probate','lawsuit','tribunal de distrito','presentación judicial','sucesión'], area:'county', tool:'help', titleEn:'County or district court filing', titleEs:'Presentación en tribunal del condado o distrito', officeEn:'County or District Clerk', officeEs:'Secretaría del Condado o Distrito' },
  { phrases:['vote','voter registration','polling place','county election','votar','registro de votante','lugar de votación'], area:'county', tool:'help', titleEn:'Voting / elections', titleEs:'Votación / elecciones', officeEn:'Elections Administration', officeEs:'Administración de Elecciones' },
  { phrases:['county road','rural road','precinct road','bridge','culvert','camino del condado','camino rural','precinto','alcantarilla'], area:'county', tool:'help', titleEn:'County road / precinct issue', titleEs:'Camino del condado / asunto del precinto', officeEn:'County Commissioner Precinct', officeEs:'Comisionado del Precinto' },
  { phrases:['sheriff','deputy','sheriff report','non emergency sheriff','alguacil','patrulla'], area:'county', tool:'help', titleEn:'Sheriff / non-emergency', titleEs:'Alguacil / no emergencia', officeEn:'Sheriff’s Office', officeEs:'Oficina del Alguacil' },
  { phrases:['jail','inmate','booking','bond','visitation','cárcel','recluso','fianza','visita'], area:'county', tool:'help', titleEn:'Jail / inmate information', titleEs:'Cárcel / información de reclusos', officeEn:'Sheriff / Jail', officeEs:'Alguacil / Cárcel' },
  { phrases:['commissioners court','commissioners court agenda','county judge meeting','commissioner meeting','next commissioners court','tribunal de comisionados','agenda de comisionados'], area:'county', tool:'meetings', titleEn:'Commissioners Court meetings', titleEs:'Reuniones del Tribunal de Comisionados', officeEn:'Commissioners Court', officeEs:'Tribunal de Comisionados' },
  { phrases:['county budget','county audit','county spending','county tax rate','financial report','presupuesto del condado','auditoría del condado','gastos del condado'], area:'county', tool:'money', titleEn:'County finances', titleEs:'Finanzas del condado', officeEn:'County Auditor / Commissioners Court', officeEs:'Auditor del Condado / Tribunal de Comisionados' },
  { phrases:['county public record','county tpia','county open records','county records request','registro público del condado','información pública del condado'], area:'county', tool:'records', titleEn:'County public records', titleEs:'Registros públicos del condado', officeEn:'Record Custodian / Public Information', officeEs:'Custodio de Registros / Información Pública' }
];

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}

function scoreRoute(query: string, route: Route) {
  let best = 0;
  for (const phrase of route.phrases) {
    const p = normalize(phrase);
    if (query === p) best = Math.max(best, 1000 + p.length);
    else if (query.includes(p)) best = Math.max(best, 500 + p.length);
    else if (p.includes(query) && query.length >= 4) best = Math.max(best, 100 + query.length);
  }
  return best;
}

function findRoute(query: string, preferredArea: 'city' | 'county') {
  const q = normalize(query);
  if (!q) return undefined;
  const all = [...cityRoutes, ...countyRoutes];
  return all
    .map(route => ({ route, score: scoreRoute(q, route) + (route.area === preferredArea ? 25 : 0) }))
    .filter(item => item.score > 25)
    .sort((a,b) => b.score - a.score)[0]?.route;
}

function sectionId(tool: ToolId) {
  return tool === 'help' ? 'help' : tool;
}

export default function CityHome({ city, subtitle, officialUrl, jurisdictionType='city' }: CityHomeProps) {
  const [lang, setLang] = useState<Lang>('en');
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [selected, setSelected] = useState<Route | null>(null);
  const isCounty = jurisdictionType === 'county';

  function goToRoute(route: Route) {
    setSelected(route);
    setActiveTool(route.tool);
    setSubmitted(true);
    const id = sectionId(route.tool);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
      const params = new URLSearchParams(window.location.search);
      params.set('q', query || (lang === 'en' ? route.titleEn : route.titleEs));
      params.set('lang', lang);
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}#${id}`);
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incomingLang = params.get('lang');
    const incomingQuery = params.get('q');
    const initialLang: Lang = incomingLang === 'es' ? 'es' : 'en';
    setLang(initialLang);
    if (!incomingQuery) return;
    setQuery(incomingQuery);
    const route = findRoute(incomingQuery, jurisdictionType);
    if (route && route.area === jurisdictionType) {
      setSelected(route);
      setActiveTool(route.tool);
      setSubmitted(true);
      requestAnimationFrame(() => document.getElementById(sectionId(route.tool))?.scrollIntoView({ behavior:'auto', block:'start' }));
    } else {
      setSelected(route || null);
      setSubmitted(true);
    }
  }, [jurisdictionType]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const route = findRoute(query, jurisdictionType);
    setSubmitted(true);
    if (route && route.area === jurisdictionType) goToRoute(route);
    else {
      setSelected(route || null);
      setActiveTool(null);
    }
  }

  function changeLanguage(next: Lang) {
    setLang(next);
    const params = new URLSearchParams(window.location.search);
    params.set('lang', next);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }

  const navEn = ['I Need Help','Your Local Government','Meetings','Follow the Money','Documents','Your Rights','Charter / Structure','Open Meetings Act','Public Information Act','Official Sources'];
  const navEs = ['Necesito Ayuda','Tu Gobierno Local','Reuniones','Sigue el Dinero','Documentos','Tus Derechos','Carta / Estructura','Ley de Reuniones Abiertas','Ley de Información Pública','Fuentes Oficiales'];
  const ids = ['help','hall','meetings','money','documents','rights','charter','oma','pia','sources'];
  const problemButtons = (isCounty ? countyRoutes : cityRoutes).filter(route => route.tool === 'help');
  const currentTitle = selected ? (lang === 'en' ? selected.titleEn : selected.titleEs) : '';
  const currentOffice = selected ? (lang === 'en' ? selected.officeEn : selected.officeEs) : '';
  const crossHref = selected?.area === 'county'
    ? `/coryell-county?q=${encodeURIComponent(query)}&lang=${lang}`
    : `/`;

  return (
    <main id="main" lang={lang}>
      <header className="city-header">
        <a className="wordmark" href={`/?lang=${lang}`}>TEXAS <span>CIVIC GUIDE</span></a>
        <nav aria-label={lang === 'en' ? 'Utility' : 'Utilidades'}>
          <a href="#sources">{lang === 'en' ? 'Sources' : 'Fuentes'}</a>
          <div className="language-switch" role="group" aria-label={lang === 'en' ? 'Select language' : 'Seleccionar idioma'}>
            <button type="button" className={lang === 'en' ? 'is-active' : ''} aria-pressed={lang === 'en'} onClick={() => changeLanguage('en')}>English</button>
            <span aria-hidden="true">/</span>
            <button type="button" className={lang === 'es' ? 'is-active' : ''} aria-pressed={lang === 'es'} onClick={() => changeLanguage('es')}>Español</button>
          </div>
        </nav>
      </header>

      <div className="city-label"><span>{lang === 'en' ? 'YOUR LOCAL GOVERNMENT' : 'TU GOBIERNO LOCAL'}</span><strong>{city}</strong><small>{subtitle}</small></div>

      <section className="resident-hero">
        <div className="hero-copy">
          <p className="eyebrow">{lang === 'en' ? 'LOCAL GOVERNMENT SHOULD NOT REQUIRE A TRANSLATOR' : 'EL GOBIERNO LOCAL NO DEBERÍA NECESITAR TRADUCTOR'}</p>
          <h1>{lang === 'en' ? 'What do you need' : '¿Qué necesitas'}<br/><em>{lang === 'en' ? `from ${city}?` : `de ${city}?`}</em></h1>
          <p>{lang === 'en' ? 'Ask in plain English or Spanish. We’ll take you to the office, meeting, document, financial information or rights information that fits your question.' : 'Pregunta en inglés o español. Te llevaremos a la oficina, reunión, documento, información financiera o información sobre tus derechos que corresponda.'}</p>
        </div>
        <form className="big-search" onSubmit={submit}>
          <label htmlFor="city-search">{lang === 'en' ? 'What can we help you find?' : '¿Qué podemos ayudarte a encontrar?'}</label>
          <div>
            <input id="city-search" value={query} onChange={e => { setQuery(e.target.value); setSubmitted(false); }} placeholder={isCounty ? (lang === 'en' ? 'Property tax, deed, county road, Commissioners Court...' : 'Impuesto predial, escritura, camino del condado...') : (lang === 'en' ? 'Water bill, pothole, permit, council agenda...' : 'Factura de agua, bache, permiso, agenda del concejo...')} />
            <button type="submit">{lang === 'en' ? 'FIND IT' : 'ENCONTRAR'}</button>
          </div>
          <small>{lang === 'en' ? 'We’ll take you to the right office or information.' : 'Te llevaremos a la oficina o información correcta.'}</small>
        </form>
      </section>

      {submitted && selected && selected.area !== jurisdictionType && (
        <section id="search-results" className="search-results" aria-live="polite">
          <div className="office-result">
            <span>{lang === 'en' ? 'RIGHT GOVERNMENT' : 'GOBIERNO CORRECTO'}</span>
            <h3>{lang === 'en' ? (selected.area === 'county' ? 'This belongs with Coryell County' : 'This is usually a city issue') : (selected.area === 'county' ? 'Esto corresponde al Condado de Coryell' : 'Esto normalmente corresponde a una ciudad')}</h3>
            <p>{lang === 'en' ? `${selected.titleEn} is handled by ${selected.officeEn}.` : `${selected.titleEs} lo atiende ${selected.officeEs}.`}</p>
            <a href={crossHref}>{lang === 'en' ? 'Go there now' : 'Ir ahora'} →</a>
          </div>
        </section>
      )}

      {submitted && !selected && (
        <section id="search-results" className="search-results" aria-live="polite">
          <h2>{lang === 'en' ? 'We couldn’t verify that yet.' : 'Todavía no pudimos verificar eso.'}</h2>
          <p>{lang === 'en' ? 'Try a simpler phrase below. If we still do not have a verified route, use the official source rather than guessing.' : 'Prueba una frase más sencilla abajo. Si todavía no tenemos una ruta verificada, usa la fuente oficial en vez de adivinar.'}</p>
          <a href={officialUrl} target="_blank" rel="noreferrer">{lang === 'en' ? 'Search the official website' : 'Buscar en el sitio oficial'} ↗</a>
        </section>
      )}

      <div className="city-layout">
        <aside>
          <p>{lang === 'en' ? 'EXPLORE LOCAL GOVERNMENT' : 'EXPLORA TU GOBIERNO LOCAL'}</p>
          {(lang === 'en' ? navEn : navEs).map((item,i) => <a key={item} className={activeTool && ids[i] === sectionId(activeTool) ? 'active-nav' : ''} href={'#'+ids[i]}>{item}<span>→</span></a>)}
        </aside>
        <div className="city-content">
          <section className="start"><p className="section-kicker">{lang === 'en' ? 'START WITH WHAT YOU NEED' : 'EMPIEZA CON LO QUE NECESITAS'}</p><h2>{lang === 'en' ? 'Common problems' : 'Problemas comunes'}</h2><div className="problem-grid">{problemButtons.map(route => <button key={route.titleEn} type="button" onClick={() => { setQuery(lang === 'en' ? route.titleEn : route.titleEs); goToRoute(route); }}>{lang === 'en' ? route.titleEn : route.titleEs}</button>)}</div></section>

          <section id="help" className={`editorial-section destination ${activeTool === 'help' ? 'active-destination' : ''}`}><p className="section-kicker">{lang === 'en' ? 'I NEED HELP' : 'NECESITO AYUDA'}</p><h2>{activeTool === 'help' && selected ? currentOffice : (lang === 'en' ? 'One problem. One office.' : 'Un problema. Una oficina.')}</h2>{activeTool === 'help' && selected ? <><p>{lang === 'en' ? `You asked about ${currentTitle}. Start with ${currentOffice}.` : `Preguntaste sobre ${currentTitle}. Empieza con ${currentOffice}.`}</p><a className="destination-action" href={officialUrl} target="_blank" rel="noreferrer">{lang === 'en' ? 'Open official source' : 'Abrir fuente oficial'} ↗</a></> : <p>{lang === 'en' ? 'Tell us what you need above. We will bring the answer here.' : 'Dinos qué necesitas arriba. Traeremos la respuesta aquí.'}</p>}</section>

          <section id="hall" className="editorial-section"><p className="section-kicker">{lang === 'en' ? 'YOUR LOCAL GOVERNMENT' : 'TU GOBIERNO LOCAL'}</p><h2>{lang === 'en' ? 'Who does what?' : '¿Quién hace qué?'}</h2><p>{lang === 'en' ? 'Use this section to understand elected officials, appointed leadership and departments.' : 'Usa esta sección para entender a los funcionarios electos, el liderazgo designado y los departamentos.'}</p></section>

          <section id="meetings" className={`editorial-section destination ${activeTool === 'meetings' ? 'active-destination' : ''}`}><p className="section-kicker">{lang === 'en' ? 'MEETINGS' : 'REUNIONES'}</p><h2>{isCounty ? (lang === 'en' ? 'Commissioners Court' : 'Tribunal de Comisionados') : (lang === 'en' ? 'City Council' : 'Concejo Municipal')}</h2>{activeTool === 'meetings' && selected && <p>{lang === 'en' ? `You asked about ${currentTitle}. This is the meeting information you need.` : `Preguntaste sobre ${currentTitle}. Esta es la información de reuniones que necesitas.`}</p>}<a className="destination-action" href={officialUrl} target="_blank" rel="noreferrer">{lang === 'en' ? 'Open official meeting source' : 'Abrir fuente oficial de reuniones'} ↗</a></section>

          <section id="money" className={`editorial-section destination ${activeTool === 'money' ? 'active-destination' : ''}`}><p className="section-kicker">{lang === 'en' ? 'FOLLOW THE MONEY' : 'SIGUE EL DINERO'}</p><h2>{lang === 'en' ? 'Budgets, audits and financial records' : 'Presupuestos, auditorías y registros financieros'}</h2>{activeTool === 'money' && selected && <p>{lang === 'en' ? `You asked about ${currentTitle}. Start with ${currentOffice}.` : `Preguntaste sobre ${currentTitle}. Empieza con ${currentOffice}.`}</p>}<a className="destination-action" href={officialUrl} target="_blank" rel="noreferrer">{lang === 'en' ? 'Open official financial source' : 'Abrir fuente financiera oficial'} ↗</a></section>

          <section id="documents" className="editorial-section"><p className="section-kicker">{lang === 'en' ? 'DOCUMENTS' : 'DOCUMENTOS'}</p><h2>{lang === 'en' ? 'Find the public record first.' : 'Encuentra primero el registro público.'}</h2></section>

          <section id="records" className={`dark-section destination ${activeTool === 'records' ? 'active-destination' : ''}`}><p>{lang === 'en' ? 'FIND IT BEFORE YOU PIR IT' : 'ENCUÉNTRALO ANTES DE PEDIRLO'}</p><h2>{lang === 'en' ? 'The record may already be public.' : 'El registro quizá ya sea público.'}</h2>{activeTool === 'records' && selected && <span>{lang === 'en' ? `You asked about ${currentTitle}. Start with ${currentOffice}. Check the official source before filing a request.` : `Preguntaste sobre ${currentTitle}. Empieza con ${currentOffice}. Revisa la fuente oficial antes de presentar una solicitud.`}</span>}<a className="destination-action" href={officialUrl} target="_blank" rel="noreferrer">{lang === 'en' ? 'Search official records' : 'Buscar registros oficiales'} ↗</a></section>

          <section id="rights" className="editorial-section"><p className="section-kicker">{lang === 'en' ? 'YOUR RIGHTS' : 'TUS DERECHOS'}</p><h2>{lang === 'en' ? 'Texas law, translated into human.' : 'La ley de Texas, explicada en lenguaje humano.'}</h2></section>
          <section id="charter" className="editorial-section"><p className="section-kicker">{lang === 'en' ? 'CHARTER / STRUCTURE' : 'CARTA / ESTRUCTURA'}</p><h2>{lang === 'en' ? 'How your local government is organized.' : 'Cómo está organizado tu gobierno local.'}</h2></section>
          <section id="oma" className="editorial-section"><p className="section-kicker">{lang === 'en' ? 'OPEN MEETINGS ACT' : 'LEY DE REUNIONES ABIERTAS'}</p><h2>{lang === 'en' ? 'Know the rules for public meetings.' : 'Conoce las reglas de las reuniones públicas.'}</h2></section>
          <section id="pia" className="editorial-section"><p className="section-kicker">{lang === 'en' ? 'PUBLIC INFORMATION ACT' : 'LEY DE INFORMACIÓN PÚBLICA'}</p><h2>{lang === 'en' ? 'Know how to request public information.' : 'Conoce cómo solicitar información pública.'}</h2></section>
          <section id="sources" className="sources"><strong>{lang === 'en' ? 'Official sources remain authoritative.' : 'Las fuentes oficiales siguen siendo la autoridad.'}</strong><a href={officialUrl} target="_blank" rel="noreferrer">{lang === 'en' ? 'Visit official website' : 'Visitar sitio oficial'} ↗</a></section>
        </div>
      </div>

      <footer><div><b>Texas Civic Guide</b><span>{lang === 'en' ? 'Independent civic education resource' : 'Recurso independiente de educación cívica'}</span></div><p>{lang === 'en' ? 'Not affiliated with the City of Copperas Cove, City of Gatesville, or Coryell County.' : 'No está afiliado con la Ciudad de Copperas Cove, la Ciudad de Gatesville ni el Condado de Coryell.'}</p><nav><button className="footer-lang" type="button" onClick={() => changeLanguage(lang === 'en' ? 'es' : 'en')}>{lang === 'en' ? 'Español' : 'English'}</button><a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas ↗</a></nav></footer>
    </main>
  );
}
