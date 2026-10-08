// Workflows for movements, locations and operator convenience.
let locations=[],swapSeed=null;
const activeLocations=()=>locations.filter(l=>l.active);
const locationOptions=(selected='')=>'<option value="">Wybierz miejsce…</option>'+activeLocations().map(l=>`<option value="${l.id}" ${String(l.id)===String(selected)?'selected':''}>${esc(l.name)} · ${esc(l.hall)}</option>`).join('');
const originalReload=reload;
reload=async function(){locations=await api('locations');await originalReload()};

const originalApi=api;
api=async function(path,body){
 if(body){
  const ids={swap:'swapDestination','card-add':'new_destination','card-retire':'retire_destination',resolve:'resolve_destination'};
  const control=ids[path]&&$('#'+ids[path]);
  if(control){if(!control.value)throw Error('Wybierz miejsce ze słownika lokalizacji.');body.locationId=Number(control.value)}
 }
 const result=await originalApi(path,body);
 if(path==='swap'&&body)clearSwapDraft();
 return result;
};

function dictionaryPair(hallId,locationId,selectId){
 const hall=$('#'+hallId),loc=$('#'+locationId);if(!hall||!loc)return;
 const selected=activeLocations().find(l=>l.hall===hall.value&&l.name===loc.value);
 const parent=loc.closest('.field');
 parent.insertAdjacentHTML('beforebegin',`<div class="field full"><label for="${selectId}">Miejsce ze słownika (lokalizacja i hala)</label><select id="${selectId}">${locationOptions(selected?.id)}</select><small>Brak miejsca? Administrator może dodać je w zakładce Lokalizacje.</small></div>`);
 hall.readOnly=true;loc.readOnly=true;hall.removeAttribute('list');loc.removeAttribute('list');
 $('#'+selectId).onchange=()=>{const l=activeLocations().find(l=>String(l.id)===$('#'+selectId).value);hall.value=l?.hall||'';loc.value=l?.name||''};
}

const originalOpenModal=openModal;
openModal=function(t,b,f=''){
 originalOpenModal(t,b,f);
 for(const [h,l,s] of [['new_hall','new_location','new_destination'],['retire_hall','retire_location','retire_destination'],['resolveHall','resolveLocation','resolve_destination']])dictionaryPair(h,l,s);
 if($('#incomingVerified'))scanConfirmation('incomingVerified','incoming');
 if($('#outgoingVerified'))scanConfirmation('outgoingVerified','outgoing');
};
function scanConfirmation(checkId,cardSelect){
 const card=data.cards.find(c=>c.id===$('#'+cardSelect)?.value);if(!card)return;
 const scanId='scan_'+checkId;
 $('#'+checkId).closest('label').insertAdjacentHTML('afterend',`<div class="field"><label for="${scanId}">Skan S/N ${cardSelect==='incoming'?'wkładanej':'wyjmowanej'} (opcjonalnie, zatwierdź Enter)</label><input id="${scanId}" autocomplete="off" placeholder="Czytnik kodów działający jak klawiatura"><small id="${scanId}_message">Przy kilku S/N zeskanuj kolejno każdy numer. Po skanie sprawdź też fizyczne miejsce.</small></div>`);
 const expected=new Set(card.serial.split('+').map(normalizeSerial)),seen=new Set();
 $('#'+scanId).onkeydown=e=>{if(e.key!=='Enter')return;e.preventDefault();const tokens=e.target.value.split('+').map(normalizeSerial);const valid=tokens.every(t=>expected.has(t));if(valid)tokens.forEach(t=>seen.add(t));else seen.clear();const check=$('#'+checkId);check.checked=valid&&seen.size===expected.size;check.dispatchEvent(new Event('change'));$('#'+scanId+'_message').textContent=valid?`Rozpoznano ${seen.size} z ${expected.size} S/N. Potwierdź zgodność fizycznego miejsca przed zapisem.`:'Niezgodny S/N — sprawdź fizyczną kartę.';e.target.value=''};
}
function normalizeSerial(s){return s.toUpperCase().replace(/\s/g,'')}

const originalCardDetails=cardDetails;
cardDetails=function(id){originalCardDetails(id);const c=data.cards.find(c=>c.id===id);if(!c||!writable())return;$('.modalfoot').insertAdjacentHTML('afterbegin','<button id="moveCard">Przenieś / powrót z usługi</button>');bind('#moveCard',()=>moveForm(c))};
function moveForm(c){
 modal.close();openModal('Przenieś kartę · '+esc(c.serial),`<p>${esc(c.model)} · Obecnie: <strong>${esc(place(c))}</strong></p><p>Przy wymianie istniejącej karty na ATE użyj podmiany, aby zapisać oba ruchy.</p><div class="formgrid"><div class="field"><label for="moveOperation">Rodzaj operacji</label><select id="moveOperation"><option>przeniesienie</option><option>powrót z kalibracji</option><option>powrót z naprawy</option></select></div><div class="field"><label for="moveDestination">Nowe miejsce</label><select id="moveDestination">${locationOptions()}</select></div><div class="field"><label for="moveStatus">Status po operacji</label><select id="moveStatus">${statusOptions(c.status).replace('<option >wycofana</option>','')}</select></div></div><div id="serviceFields" hidden><div class="formgrid"><div class="field"><label for="serviceResult">Wynik usługi</label><select id="serviceResult"><option value="">Wybierz wynik…</option><option value="pozytywny">Pozytywny</option><option value="negatywny">Negatywny</option></select></div>${field('serviceDocument','Numer świadectwa / zlecenia')}${field('serviceCalibration','Termin kalibracji (opcjonalny, RRRR-MM-DD)',c.calibration)}</div></div>${field('moveReason','Powód / opis operacji')}<label class="check"><input type="checkbox" id="moveVerified"> Potwierdzam fizyczny S/N, obecne miejsce i nowe miejsce karty.</label><div id="installationFields" hidden><label class="check"><input type="checkbox" id="moveInstallation"> Montuję kartę bez zastępowania innej karty.</label><label class="check"><input type="checkbox" id="moveCalibration"> Karta ma ważną kalibrację lub nie wymaga kalibracji.</label></div><p id="moveError" class="error"></p>`,'<button id="saveMove" class="primary">Zapisz ruch karty</button>');
 $('#moveOperation').onchange=()=>{$('#serviceFields').hidden=$('#moveOperation').value==='przeniesienie'};
 $('#moveDestination').onchange=()=>{const l=activeLocations().find(l=>String(l.id)===$('#moveDestination').value);$('#installationFields').hidden=!l||!/^(ATE|SATE|VATE)/i.test(l.name)};
 $('#serviceResult').onchange=()=>{if($('#serviceResult').value==='negatywny')$('#moveStatus').value='do sprawdzenia'};
 bind('#saveMove',async()=>{const btn=$('#saveMove');btn.disabled=true;try{await api('move',{id:c.id,version:c.version,operation:$('#moveOperation').value,locationId:Number($('#moveDestination').value),status:$('#moveStatus').value,reason:$('#moveReason').value,physicallyVerified:$('#moveVerified').checked,result:$('#serviceResult').value,document:$('#serviceDocument').value,calibration:$('#serviceCalibration').value,installationVerified:$('#moveInstallation').checked,calibrationVerified:$('#moveCalibration').checked});modal.close();await reload();toast('Zapisano ruch, status i historię karty.')}catch(e){$('#moveError').textContent=e.message;btn.disabled=false}});
}

const originalDrawCards=drawCards;
drawCards=function(){originalDrawCards();if(!writable())return;document.querySelectorAll('[data-card]').forEach(b=>{const c=data.cards.find(c=>c.id===b.dataset.card);if(c&&/^(ATE|SATE|VATE)/i.test(c.location)){const btn=document.createElement('button');btn.textContent='Podmień tę kartę';btn.onclick=()=>{swapSeed=c.id;locationFilter=c.location;view='swap';render()};b.after(btn)}})};

const draftIds=['swapStation','incomingSearch','outgoingSearch','incoming','outgoing','swapPurpose','destStatus','destHall','destLoc','swapNote','swapDestination'];
const draftKey=()=>`maintenance.swap.${session.user?.id}`;
function clearSwapDraft(){try{sessionStorage.removeItem(draftKey())}catch{}}
function saveSwapDraft(){if(view!=='swap'||!$('#incoming'))return;const fields=Object.fromEntries(draftIds.map(k=>[k,$('#'+k)?.value||'']));const versions=Object.fromEntries(['incoming','outgoing'].map(k=>[k,data.cards.find(c=>c.id===fields[k])?.version]));try{sessionStorage.setItem(draftKey(),JSON.stringify({fields,versions}))}catch{}}
function readSwapDraft(){try{return JSON.parse(sessionStorage.getItem(draftKey())||'null')}catch{return null}}
function restoreSwapDraft(d){
 const f=d.fields;$('#swapStation').value=f.swapStation||'';$('#swapStation').onchange();$('#incomingSearch').value=f.incomingSearch||'';$('#incomingSearch').oninput();$('#incoming').value=f.incoming||'';$('#incoming').onchange();$('#outgoingSearch').value=f.outgoingSearch||'';$('#outgoingSearch').oninput();$('#outgoing').value=f.outgoing||'';$('#outgoing').onchange();
 for(const k of ['swapPurpose','destStatus','swapNote'])$('#'+k).value=f[k]||'';
 $('#swapDestination').value=f.swapDestination||'';$('#swapDestination').onchange();
 let stale=false;for(const k of ['incoming','outgoing']){const c=data.cards.find(c=>c.id===f[k]);if(f[k]&&(!c||c.version!==d.versions[k])){stale=true;$('#'+k).value=''}}
 if(stale){$('#incoming').onchange();toast('Karty zmieniły się od zapisania formularza. Wybierz i zweryfikuj je ponownie.')}else toast('Przywrócono formularz. Potwierdzenia fizyczne trzeba wykonać ponownie.');
}
const originalSwapForm=swapForm;
swapForm=function(){
 originalSwapForm();dictionaryPair('destHall','destLoc','swapDestination');
 const d=readSwapDraft();
 if(d&&!swapSeed){$('#content').insertAdjacentHTML('afterbegin','<div class="notice" id="draftNotice">Masz zapamiętany formularz podmiany. <button id="restoreDraft">Przywróć formularz</button> <button id="discardDraft">Odrzuć formularz</button></div>');bind('#restoreDraft',()=>{restoreSwapDraft(d);$('#draftNotice').remove()});bind('#discardDraft',()=>{clearSwapDraft();$('#draftNotice').remove()})}
 if(swapSeed){const id=swapSeed;swapSeed=null;$('#outgoing').value=id;$('#outgoing').onchange();saveSwapDraft()}
 for(const id of draftIds){const el=$('#'+id);if(el){el.addEventListener('input',saveSwapDraft);el.addEventListener('change',saveSwapDraft)}}
 // The physical confirmations are deliberately never persisted.
};

history=function(){
 const kinds=[...new Set(data.events.map(e=>e.kind))].sort(),actors=[...new Set(data.events.map(e=>e.actor))].sort();
 $('#content').innerHTML=title('Historia operacji','Podmiany, ruchy kart, wyniki usług i korekty.',exportBtn())+`<div class="panel"><div class="formgrid">${field('historySearch','Szukaj S/N, MU, ATE lub powodu')}<div class="field"><label for="historyKind">Rodzaj operacji</label><select id="historyKind"><option value="">Wszystkie operacje</option>${kinds.map(k=>`<option>${esc(k)}</option>`).join('')}</select></div><div class="field"><label for="historyActor">Autor</label><select id="historyActor"><option value="">Wszyscy autorzy</option>${actors.map(k=>`<option>${esc(k)}</option>`).join('')}</select></div>${field('historyFrom','Od dnia','','date')}${field('historyTo','Do dnia','','date')}</div><p id="historyCount"></p><div id="historyTable"></div></div>`;
 const draw=()=>{const term=$('#historySearch').value.toLowerCase();const rows=data.events.filter(e=>{const day=new Date(e.at).toLocaleDateString('sv-SE');return JSON.stringify(e).toLowerCase().includes(term)&&(!$('#historyKind').value||e.kind===$('#historyKind').value)&&(!$('#historyActor').value||e.actor===$('#historyActor').value)&&(!$('#historyFrom').value||day>=$('#historyFrom').value)&&(!$('#historyTo').value||day<=$('#historyTo').value)});$('#historyCount').textContent=`Znaleziono: ${rows.length} operacji`;$('#historyTable').innerHTML=eventTable(rows);bindEvents()};
 for(const id of ['historySearch','historyKind','historyActor','historyFrom','historyTo'])$('#'+id).oninput=draw;draw();
};
const originalEventDetails=eventDetails;
eventDetails=function(id){originalEventDetails(id);const e=data.events.find(e=>e.id===id);const before=JSON.parse(e.before_json),after=JSON.parse(e.after_json);$('.modalfoot').insertAdjacentHTML('beforebegin',`<div class="panel"><h3>Status i kalibracja przed / po</h3>${after.map((c,i)=>`<p><strong>${esc(c.serial)}</strong>: ${esc(before[i]?.status||'nowy rekord')} → ${esc(c.status)}<br>Kalibracja: ${esc(before[i]?.calibration||'brak daty')} → ${esc(c.calibration||'brak daty')}</p>`).join('')}</div>`)};

function locationsView(){
 $('#content').innerHTML=title('Lokalizacje','Miejsca docelowe z przypisaną halą. Wyłączenie miejsca nie zmienia historii ani obecnych lokalizacji kart.')+`<div class="panel"><table><thead><tr><th>Miejsce</th><th>Hala</th><th>Stan</th><th></th></tr></thead><tbody>${locations.map(l=>`<tr><td>${esc(l.name)}</td><td>${esc(l.hall)}</td><td>${l.active?'Aktywne':'Wyłączone'}</td><td>${admin()?`<button data-location="${l.id}">${l.active?'Wyłącz':'Włącz'}</button>`:''}</td></tr>`).join('')}</tbody></table></div>${admin()?`<div class="panel"><h2>Dodaj miejsce</h2><div class="formgrid">${field('locationName','Nazwa miejsca')}${field('locationHall','Hala')}</div><button id="saveLocation" class="primary">Dodaj lokalizację</button><p id="locationError" class="error"></p></div>`:''}`;
 bind('#saveLocation',async()=>{try{await api('location',{name:$('#locationName').value,hall:$('#locationHall').value,active:true});await reload()}catch(e){$('#locationError').textContent=e.message}});
 document.querySelectorAll('[data-location]').forEach(b=>b.onclick=async()=>{const l=locations.find(l=>String(l.id)===b.dataset.location);try{await api('location',{...l,active:!l.active});await reload()}catch(e){toast(e.message)}});
}
const originalSettings=settings;
settings=function(){originalSettings();if(!admin())return;$('#content').insertAdjacentHTML('afterbegin','<div class="panel"><h2>Kopie zapasowe</h2><p id="backupState">Odczytywanie stanu…</p><button id="backupNow">Wykonaj kopię teraz</button><p>Kopie są na tym komputerze. Regularnie kopiuj je także na osobny dysk lub firmowy zasób.</p></div>');const update=async()=>{try{const info=await api('backup-info');if($('#backupState'))$('#backupState').textContent=(info.at?'Ostatnia kopia: '+date(info.at)+' · '+info.name:'Brak kopii zapasowych.')+(info.error?' — Błąd automatycznej kopii: '+info.error:'')}catch(e){if($('#backupState'))$('#backupState').textContent=e.message}};update();bind('#backupNow',async()=>{const btn=$('#backupNow');btn.disabled=true;try{await api('backup',{});await update();toast('Wykonano i sprawdzono kopię bazy.')}catch(e){toast(e.message)}finally{if(btn.isConnected)btn.disabled=false}})};
const originalRender=render;
render=function(){originalRender();if(!session.user)return;$('.nav').insertAdjacentHTML('beforeend',`<button data-extra-nav="locations" class="${view==='locations'?'active':''}">Lokalizacje</button>`);bind('[data-extra-nav]',()=>{view='locations';render()});if(view==='locations')locationsView()};
