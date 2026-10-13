(() => {
  'use strict';
  const nav=document.querySelector('.suite-nav');
  if(!nav)return;
  const links=[...nav.querySelectorAll('a[href^="#"]')];
  const weight=document.createElement('section');
  weight.id='weight-panel';weight.setAttribute('aria-label','Вес');
  const start=document.getElementById('diary'),end=document.getElementById('food-section');
  start.before(weight);
  let current=start;
  while(current&&current!==end){const next=current.nextSibling;weight.append(current);current=next;}
  const panels=links.map(link=>link.hash==='#diary'?weight:document.getElementById(link.hash.slice(1)));
  panels.forEach(panel=>panel.classList.add('diary-view'));
  document.documentElement.classList.add('section-navigation');
  document.querySelector('.brand').setAttribute('href','#today-section');
  let active=null;
  function open(id,options={}){
    const target=document.getElementById(id);
    const panel=panels.find(p=>p===target||p.contains(target))||panels[0];
    const changed=active!==panel;
    panels.forEach(p=>p.hidden=p!==panel);active=panel;
    links.forEach((link,i)=>{if(panels[i]===panel)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    if(options.history&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
    if(options.scroll!==false){
      const destination=target&&panel.contains(target)?target:panel;
      requestAnimationFrame(()=>{destination.scrollIntoView({behavior:'instant',block:'start'});if(options.focus){const heading=destination.querySelector('h2,h3')||destination;heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}});
    }
    if(changed)window.dispatchEvent(new Event('resize'));
  }
  window.ImpulseNavigate=id=>open(id,{history:true});
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(!link||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const id=link.hash.slice(1),target=document.getElementById(id);
    if(!target||!panels.some(p=>p===target||p.contains(target)))return;
    event.preventDefault();open(id,{history:true,focus:nav.contains(link)});
  },true);
  window.addEventListener('hashchange',()=>open(location.hash.slice(1)));
  window.addEventListener('popstate',()=>open(location.hash.slice(1)));
  const measure=()=>document.documentElement.style.setProperty('--section-nav-height',nav.offsetHeight+'px');
  window.addEventListener('resize',measure);
  if('ResizeObserver'in window)new ResizeObserver(measure).observe(nav);
  measure();open(location.hash.slice(1),{scroll:false});
})();
