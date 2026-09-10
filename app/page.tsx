'use client';

import { useEffect, useState } from 'react';

type Lang = 'en' | 'es';

const places = [
  {
    name: 'Copperas Cove',
    href: '/copperas-cove',
    noteEn: 'Charter, meetings, records, services and resident rights',
    noteEs: 'Carta, reuniones, registros, servicios y derechos de los residentes',
  },
  {
    name: 'Gatesville',
    href: '/gatesville',
    noteEn: 'Charter, meetings, records, services and resident rights',
    noteEs: 'Carta, reuniones, registros, servicios y derechos de los residentes',
  },
  {
    name: 'Coryell County',
    href: '/coryell-county',
    noteEn: 'Commissioners Court, county services, records, courts and elections',
    noteEs: 'Tribunal de Comisionados, servicios del condado, registros, tribunales y elecciones',
  },
];

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const es = lang === 'es';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const savedLang = window.localStorage.getItem('civic-guide-lang');
    const initial: Lang = urlLang === 'es' || (urlLang !== 'en' && savedLang === 'es') ? 'es' : 'en';
    setLang(initial);
    document.documentElement.lang = initial;
  }, []);

  function changeLanguage(next: Lang) {
    setLang(next);
    document.documentElement.lang = next;
    window.localStorage.setItem('civic-guide-lang', next);

    const params = new URLSearchParams(window.location.search);
    params.set('lang', next);
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }

  return (
    <main id="main" lang={lang}>
      <header className="masthead">
        <div className="brand">TEXAS <span>CIVIC GUIDE</span></div>
        <div className="home-tools">
          <span className="home-independent">{es ? 'Educación cívica independiente' : 'Independent civic education'}</span>
          <div className="language-switch" role="group" aria-label={es ? 'Seleccionar idioma' : 'Select language'}>
            <button type="button" className={lang === 'en' ? 'is-active' : ''} aria-pressed={lang === 'en'} onClick={() => changeLanguage('en')}>English</button>
            <span aria-hidden="true">/</span>
            <button type="button" className={lang === 'es' ? 'is-active' : ''} aria-pressed={lang === 'es'} onClick={() => changeLanguage('es')}>Español</button>
          </div>
        </div>
      </header>

      <section className="state-hero">
        <p className="eyebrow">{es ? 'GOBIERNO LOCAL, SIN EL LABERINTO' : 'LOCAL GOVERNMENT, WITHOUT THE MAZE'}</p>
        <h1>
          {es ? 'Entiende tu gobierno.' : 'Understand your government.'}<br />
          {es ? 'Encuentra el registro.' : 'Find the record.'}<br />
          <em>{es ? 'Conoce tus derechos.' : 'Know your rights.'}</em>
        </h1>
        <p className="lede">
          {es
            ? 'Una guía de gobierno local de Texas pensada primero para los residentes y construida alrededor de las preguntas que la gente realmente tiene.'
            : 'A resident-first guide to Texas local government, built around the questions people actually have.'}
        </p>

        <div className="city-picker" aria-label={es ? 'Elige tu gobierno local' : 'Choose your local government'}>
          {places.map(place => (
            <a key={place.name} href={`${place.href}?lang=${lang}`}>
              <strong>{place.name}</strong>
              <span>{es ? place.noteEs : place.noteEn}</span>
              <b aria-hidden="true">→</b>
            </a>
          ))}
        </div>
      </section>

      <section className="principle">
        <p>{es ? 'LA REGLA DETRÁS DE TODO LO QUE HACEMOS AQUÍ' : 'THE RULE BEHIND EVERYTHING HERE'}</p>
        <h2>{es ? 'Sin fuente = sin respuesta.' : 'No source = no answer.'}</h2>
        <span>
          {es
            ? 'Las fuentes oficiales de los gobiernos locales y del Estado de Texas siguen siendo la autoridad. Nosotros hacemos que sean más fáciles de encontrar, leer y entender.'
            : 'Official local-government and State of Texas sources remain authoritative. We make them easier to find, read and understand.'}
        </span>
      </section>

      <footer>
        <div>
          <b>Texas Civic Guide</b>
          <span>{es ? 'Recurso independiente de educación cívica' : 'Independent civic education resource'}</span>
        </div>
        <p>
          {es
            ? 'No está afiliado con la Ciudad de Copperas Cove, la Ciudad de Gatesville ni el Condado de Coryell.'
            : 'Not affiliated with the City of Copperas Cove, City of Gatesville, or Coryell County.'}
        </p>
        <nav>
          <button type="button" className="footer-lang" onClick={() => changeLanguage(es ? 'en' : 'es')}>
            {es ? 'English' : 'Español'}
          </button>
          <a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas ↗</a>
        </nav>
      </footer>
    </main>
  );
}
