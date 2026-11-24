window.ZK_API = "https://script.google.com/macros/s/AKfycbw7g8YPUuC38_dsligXuXDr2tXO2ViBm2qIQR3VRuj2HPtI3v3A2XrbAY81oVGlWJ9Tag/exec";
// Elementos individuais de solo: sempre com a perna/lado forte (corrige dados já guardados)
(function(){
  try {
    const KEY = "zakigym_rm_junior_tg_v3", FIX = {"2 × cada perna, 5 s":"4 × 5 s, perna forte","8 rep, alternar perna":"8 rep, perna forte","6 rep, alternar lado":"6 rep, lado forte"};
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k, v){
      if (k === KEY && typeof v === "string" && /alternar|cada perna/.test(v)) {
        try { const s = JSON.parse(v); ((s.load2 || {}).solo || []).forEach(e => { if (FIX[e.dose]) e.dose = FIX[e.dose]; }); v = JSON.stringify(s); } catch (_) {}
      }
      return orig.call(this, k, v);
    };
  } catch (_) {}
})();
// Ligação ao servidor: se a rede falhar (ex.: telemóvel acabou de acordar), tenta outra vez sozinho
(function(){
  try {
    const API = window.ZK_API, of = window.fetch.bind(window);
    window.fetch = async function(u, o){
      if (!(typeof u === "string" && API && u.indexOf(API) === 0)) return of(u, o);
      const waits = [1500, 3000, 6000];
      for (let i = 0; ; i++) {
        try { return await of(u, o); }
        catch (e) { if (i >= waits.length || (e && e.name === "AbortError") || (o && o.signal && o.signal.aborted)) throw e; await new Promise(r => setTimeout(r, waits[i])); }
      }
    };
  } catch (_) {}
})();
