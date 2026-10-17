import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {App} from './Experience.jsx';
import {getDictionary} from './i18n.jsx';
import {readLocation} from './routing.js';
import './horizon.css';
import './materials.css';
import './door.css';
async function bootstrap(){const boot=document.getElementById('rainbow-page');const server=boot?JSON.parse(boot.textContent):null;const current=readLocation(location.href);const lang=current.lang||server?.lang||'ru';const route=current.route;const dictionary=await getDictionary(lang);const app=<App initialRoute={route} initialLanguage={lang} initialDictionary={dictionary}/>;const root=document.getElementById('root');if(server&&server.lang===lang&&server.route===route)hydrateRoot(root,app);else createRoot(root).render(app);

}
bootstrap();
