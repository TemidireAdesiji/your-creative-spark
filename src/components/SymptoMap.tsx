import { useState, useEffect, useRef, useCallback } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

const C = {
  bg:"#FFFFFF", bg2:"#F7F7F5", bg3:"#EEECEA",
  black:"#0E0E0E", mid:"#767676", light:"#C4C4C4", border:"#E8E8E8",
  teal:"#1DA39A", tealLight:"#E8F6F5", tealDark:"#136E68",
  amber:"#D97B2A", amberLight:"#FDF3EB",
  red:"#C94040", redLight:"#FDEAEA",
  purple:"#6E5DB0", purpleLight:"#F0EDF9",
  gold:"#C89A2E",
  // per-game accent colors
  walkBg:"#0A2540",   walkAccent:"#3B82F6",  walkAccentLight:"#DBEAFE",
  romBg:"#1A0A2E",    romAccent:"#A855F7",   romAccentLight:"#F3E8FF",
  gaitBg:"#0D1E1C",   gaitAccent:"#1DA39A",  gaitAccentLight:"#E8F6F5",
};

/* ── Icons ─────────────────────────────────────────────────────── */
const Icon=({name,size=18,color="currentColor",sw=1.8})=>{
  const p={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:color,strokeWidth:sw,strokeLinecap:"round" as const,strokeLinejoin:"round" as const};
  const d={
    home:    <><path d="M3 10L12 3l9 7v10a1 1 0 01-1 1H4a1 1 0 01-1-1V10z"/><path d="M9 21V12h6v9"/></>,
    game:    <><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 12h4M8 10v4"/><circle cx="16" cy="12" r="1" fill={color}/><circle cx="19" cy="10" r="1" fill={color}/></>,
    log:     <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></>,
    chart:   <><polyline points="3,18 8,11 13,14 21,5"/><circle cx="21" cy="5" r="2"/></>,
    brain:   <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></>,
    bolt:    <><polyline points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></>,
    moon:    <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
    sun:     <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    heart:   <><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>,
    fire:    <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>,
    warn:    <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/></>,
    phone:   <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    star:    <><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></>,
    trophy:  <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 22v-4M14 22v-4"/><path d="M6 4h12v8a6 6 0 0 1-12 0V4z"/></>,
    walk:    <><circle cx="12" cy="3" r="1.5"/><path d="M6 8l4-2 2 4-3 3"/><path d="M12 10l2 4 4 2"/><path d="M9 13l-2 6M14 14l1 6"/></>,
    skeleton:<><circle cx="12" cy="3" r="1.5"/><path d="M12 5v6M8.5 8l3.5 3 3.5-3M12 11l-3 5M12 11l3 5M9 16l-1 5M15 16l1 5"/></>,
    trend:   <><polyline points="3,17 8,11 13,14 21,5"/><polyline points="17,5 21,5 21,9"/></>,
    pill:    <><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"/><circle cx="18" cy="18" r="4"/><path d="M18 14v8M14 18h8"/></>,
    snow:    <><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5l-5 5-5-5M17 19l-5-5-5 5"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M5 7l5 5-5 5M19 7l-5 5 5 5"/></>,
    activity:<><path d="M3 12h4l2-8 4 16 2-8h4"/></>,
    balance: <><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 8h14M8 5l4 3 4-3M8 19l4-3 4 3"/><circle cx="12" cy="12" r="2"/></>,
    forward: <><polyline points="5,12 19,12"/><polyline points="13,6 19,12 13,18"/></>,
    pompe:   <><path d="M12 2a4 4 0 0 1 4 4v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V6a4 4 0 0 1 4-4z"/><path d="M9 12h6M12 9v6"/></>,
    check:   <><polyline points="20,6 9,17 4,12"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    camera:  <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    eye:     <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeoff:  <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    music:   <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
  };
  return <svg {...p}>{d[name]}</svg>;
};

/* ── Global Styles ─────────────────────────────────────────────── */
const GlobalStyles=()=>{
  useEffect(()=>{
    if(document.getElementById("sm-styles"))return;
    const s=document.createElement("style");s.id="sm-styles";
    s.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      *,*::before,*::after{box-sizing:border-box;}
      html,body{width:100%;height:100%;height:100dvh;margin:0;padding:0;background:#fff;-webkit-font-smoothing:antialiased;overscroll-behavior:none;}
      #root{width:100%;height:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;}
      @keyframes pulse-ring{0%{transform:scale(.9);opacity:.7}50%{transform:scale(1.12);opacity:.15}100%{transform:scale(.9);opacity:.7}}
      @keyframes ping{0%{transform:scale(1);opacity:1}80%,100%{transform:scale(2.4);opacity:0}}
      @keyframes bounce-in{0%{transform:scale(.4);opacity:0}65%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
      @keyframes slide-up{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes fade-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes sway{0%,100%{transform:rotate(-4deg) translateX(-2px)}50%{transform:rotate(4deg) translateX(2px)}}
      @keyframes sway-closed{0%,100%{transform:rotate(-6deg) translateX(-3px)}50%{transform:rotate(6deg) translateX(3px)}}
      @keyframes walk-cycle{0%{transform:translateY(0)}25%{transform:translateY(-3px)}50%{transform:translateY(0)}75%{transform:translateY(-2px)}100%{transform:translateY(0)}}
      @keyframes rec-blink{0%,100%{opacity:1}50%{opacity:.3}}
      @keyframes scan-line{0%{top:10%}100%{top:90%}}
      @keyframes grid-fade{0%,100%{opacity:.06}50%{opacity:.12}}
      input[type=range]{height:4px;border-radius:2px;outline:none;border:none;cursor:pointer;}
    `;
    document.head.appendChild(s);
  },[]);
  return null;
};

/* ── Spark ─────────────────────────────────────────────────────── */
const Spark=({data,color=C.teal,h=36})=>{
  const W=100,mn=Math.min(...data),mx=Math.max(...data);
  const pts=data.map((v,i)=>{const x=(i/(data.length-1))*W,y=h-((v-mn)/(mx-mn||1))*(h-4)-2;return`${x},${y}`;}).join(" ");
  const id=`sg${color.replace(/\W/g,"")}`;
  return(<svg viewBox={`0 0 ${W} ${h}`} style={{width:"100%",height:h}}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".2"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    <polygon points={`0,${h} ${pts} ${W},${h}`} fill={`url(#${id})`}/>
    <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    {data.map((v,i)=>{const x=(i/(data.length-1))*W,y=h-((v-mn)/(mx-mn||1))*(h-4)-2;return i===data.length-1?<circle key={i} cx={x} cy={y} r="2.5" fill={color} stroke="#fff" strokeWidth="1.5"/>:null;})}
  </svg>);
};

/* ── Stepper ───────────────────────────────────────────────────── */
const Stepper=({steps,current})=>(
  <div style={{display:"flex",alignItems:"flex-start",marginTop:14}}>
    {steps.map((s,i)=>{const done=i<current,active=i===current;return(
      <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,position:"relative"}}>
        {i<steps.length-1&&<div style={{position:"absolute",top:6,left:"50%",width:"100%",height:2,background:done?C.teal:C.border,transition:"background .4s"}}/>}
        <div style={{width:13,height:13,borderRadius:"50%",zIndex:1,background:done?C.teal:active?"#fff":C.border,border:active?`2px solid ${C.teal}`:"none",boxShadow:active?`0 0 0 3px ${C.tealLight}`:"none",transition:"all .3s"}}/>
        <span style={{fontSize:9,color:active?C.teal:done?C.black:C.light,fontWeight:active?700:400,textAlign:"center",fontFamily:"DM Sans,sans-serif",lineHeight:1.3}}>{s}</span>
      </div>
    );})}
  </div>
);

/* ── Btn ───────────────────────────────────────────────────────── */
const Btn=({label,onClick,variant="black",full=true,sm=false,icon=null})=>(
  <button onClick={onClick} style={{width:full?"100%":"auto",display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:sm?"9px 16px":"14px 20px",borderRadius:100,border:variant==="outline"?`1.5px solid ${C.border}`:"none",background:variant==="black"?C.black:variant==="teal"?C.teal:variant==="red"?C.red:variant==="amber"?C.amber:variant==="outline"?"#fff":C.bg2,color:(variant==="outline"||variant==="ghost")?C.black:"#fff",fontSize:sm?12:14,fontWeight:600,fontFamily:"DM Sans,sans-serif",cursor:"pointer",letterSpacing:.1,transition:"opacity .15s"}}>{icon}{label}</button>
);

/* ── Flare Engine ──────────────────────────────────────────────── */
const calcFlare=(vals)=>{
  const s=Math.min(100,Math.round((vals.spasm/15)*38+(vals.pain/10)*34+(vals.fatigue/10)*18+(vals.sleep<=5?(5-vals.sleep)/5*10:0)));
  if(s>=70)return{score:s,level:"severe",  color:C.red,  bg:C.redLight,  label:"Severe Flare Risk",  who:"Clinician + caregiver"};
  if(s>=45)return{score:s,level:"moderate",color:C.amber,bg:C.amberLight,label:"Moderate Flare Risk",who:"Caregiver notified"};
  return         {score:s,level:"low",     color:C.teal, bg:C.tealLight, label:"Low Risk",           who:null};
};

/* ── Camera Viewfinder HUD ─────────────────────────────────────── */
const CamHUD=({accent="#1DA39A",children,label,recording=false,metrics=[]})=>(
  <div style={{width:"100%",aspectRatio:"4/3",borderRadius:22,background:"#080e0d",position:"relative",overflow:"hidden"}}>
    {/* Simulated camera grain */}
    <div style={{position:"absolute",inset:0,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",opacity:.4}}/>
    {/* Viewfinder corners */}
    {[[0,0],[1,0],[0,1],[1,1]].map(([h,v],i)=>(
      <div key={i} style={{position:"absolute",[h?"right":"left"]:12,[v?"bottom":"top"]:12,width:20,height:20,borderTop:v?"none":`2px solid ${accent}`,borderBottom:v?`2px solid ${accent}`:"none",borderLeft:h?"none":`2px solid ${accent}`,borderRight:h?`2px solid ${accent}`:"none",opacity:.85}}/>
    ))}
    {/* Scan line */}
    <div style={{position:"absolute",left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accent}66,transparent)`,animation:"scan-line 3s linear infinite"}}/>
    {/* Grid overlay */}
    <svg style={{position:"absolute",inset:0,animation:"grid-fade 4s ease-in-out infinite"}} width="100%" height="100%" viewBox="0 0 100 75">
      {[33,66].map(x=><line key={x} x1={x} y1="0" x2={x} y2="75" stroke={accent} strokeWidth=".3" opacity=".4"/>)}
      {[25,50].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} stroke={accent} strokeWidth=".3" opacity=".4"/>)}
    </svg>
    {/* Content */}
    <div style={{position:"absolute",inset:0}}>{children}</div>
    {/* Top bar */}
    <div style={{position:"absolute",top:0,left:0,right:0,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",borderRadius:100,padding:"4px 10px"}}>
        {recording&&<div style={{width:6,height:6,borderRadius:"50%",background:"#ef4444",animation:"rec-blink 1s ease-in-out infinite"}}/>}
        <span style={{fontSize:9,color:"rgba(255,255,255,.85)",letterSpacing:1.5,fontFamily:"DM Sans,sans-serif",fontWeight:600}}>{label}</span>
      </div>
      <div style={{background:"rgba(0,0,0,.55)",backdropFilter:"blur(4px)",borderRadius:100,padding:"4px 8px",display:"flex",alignItems:"center",gap:4}}>
        <Icon name="camera" size={10} color={accent}/>
        <span style={{fontSize:9,color:accent,fontFamily:"DM Sans,sans-serif",fontWeight:600}}>LIVE</span>
      </div>
    </div>
    {/* Bottom metrics bar */}
    {metrics.length>0&&(
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 10px",display:"flex",justifyContent:"space-between",background:"linear-gradient(to top,rgba(0,0,0,.7),transparent)"}}>
        {metrics.map((m,i)=>(
          <div key={i} style={{background:"rgba(0,0,0,.6)",backdropFilter:"blur(4px)",borderRadius:10,padding:"5px 9px",textAlign:"center",minWidth:64}}>
            <p style={{margin:"0 0 1px",fontSize:8,color:"rgba(255,255,255,.5)",fontFamily:"DM Sans,sans-serif",letterSpacing:.6,textTransform:"uppercase"}}>{m.l}</p>
            <p style={{margin:0,fontSize:11,fontWeight:700,color:m.hi?accent:"#fff",fontFamily:"DM Sans,sans-serif"}}>{m.v}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ── Add Condition Modal ────────────────────────────────────────── */
const AddConditionModal=({onClose})=>{
  const [step,setStep]=useState(0);
  const [selected,setSelected]=useState(null);
  const conditions=[
    {id:"hsp",  name:"Hereditary Spastic Paraplegia",abbr:"HSP",   color:C.amber,  bg:C.amberLight,  icon:<Icon name="bolt"     size={18} color={C.amber}/>,  games:"GaitCam · Walk Quest · Romberg"},
    {id:"sca",  name:"Spinocerebellar Ataxia",       abbr:"SCA",   color:C.purple, bg:C.purpleLight, icon:<Icon name="activity" size={18} color={C.purple}/>, games:"Romberg · GaitCam · Walk Quest"},
    {id:"pompe",name:"Pompe Disease",                abbr:"GSD-II",color:C.teal,   bg:C.tealLight,   icon:<Icon name="pompe"    size={18} color={C.teal}/>,   games:"Walk Quest · GaitCam · posture"},
    {id:"dmd",  name:"Duchenne Muscular Dystrophy",  abbr:"DMD",   color:C.red,    bg:C.redLight,    icon:<Icon name="fire"     size={18} color={C.red}/>,    games:"Walk Quest · Romberg · posture"},
    {id:"cp",   name:"Cerebral Palsy",               abbr:"CP",    color:C.gold,   bg:"#FBF4E0",     icon:<Icon name="balance"  size={18} color={C.gold}/>,   games:"GaitCam · Walk Quest · Romberg"},
  ];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:1000,display:"flex",alignItems:"flex-end",WebkitOverflowScrolling:"touch"}}>
      <div style={{width:"100%",background:"#fff",borderRadius:"28px 28px 0 0",padding:"0 0 0",animation:"slide-up .35s ease",maxHeight:"92dvh",display:"flex",flexDirection:"column",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        <div style={{padding:"14px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 0 calc(50% - 18px)"}}/>
          <button onClick={onClose} style={{background:C.bg2,border:"none",borderRadius:"50%",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon name="x" size={14} color={C.mid}/></button>
        </div>
        <div style={{padding:"14px 20px 4px",flexShrink:0}}>
          <h2 style={{fontFamily:"Fraunces,serif",fontSize:24,fontWeight:900,color:C.black,margin:"0 0 3px"}}>Add Condition</h2>
          <p style={{margin:0,fontSize:12,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Select a condition to track · challenges auto-adapt</p>
        </div>
        <div style={{overflowY:"auto",padding:"8px 20px 0",flex:1}}>
          {step===0&&conditions.map(c=>(
            <button key={c.id} onClick={()=>setSelected(c.id===selected?null:c.id)} style={{width:"100%",background:"#fff",border:`1.5px solid ${selected===c.id?c.color:C.border}`,borderRadius:18,padding:"12px 14px",marginBottom:8,cursor:"pointer",display:"flex",gap:12,alignItems:"center",textAlign:"left",transition:"all .2s"}}>
              <div style={{width:42,height:42,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                  <p style={{margin:0,fontSize:13,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>{c.name}</p>
                  <span style={{fontSize:9,background:c.bg,color:c.color,borderRadius:100,padding:"2px 7px",fontWeight:700,fontFamily:"DM Sans,sans-serif"}}>{c.abbr}</span>
                </div>
                <p style={{margin:0,fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{c.games}</p>
              </div>
              {selected===c.id&&<div style={{width:20,height:20,borderRadius:"50%",background:c.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="check" size={11} color="#fff" sw={2.5}/></div>}
            </button>
          ))}
        </div>
        {selected&&(
          <div style={{padding:"12px 20px 16px",flexShrink:0,borderTop:`1px solid ${C.border}`,background:"#fff"}}>
            <Btn label="Add Condition" variant="teal" onClick={()=>{alert(`${conditions.find(c=>c.id===selected)?.name} added!`);onClose();}} icon={<Icon name="plus" size={14} color="#fff"/>}/>
          </div>
        )}
        {!selected&&<div style={{height:16,flexShrink:0}}/>}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════════════════════ */
const HomeScreen=({setTab,xp,streak})=>{
  const level=Math.floor(xp/200)+1,xpPct=((xp%200)/200)*100;
  const [showAddCondition,setShowAddCondition]=useState(false);
  return(
    <div style={{padding:"0 0 100px"}}>
      {showAddCondition&&<AddConditionModal onClose={()=>setShowAddCondition(false)}/>}
      <div style={{padding:"20px 22px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <p style={{margin:"0 0 3px",fontSize:12,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
          <h1 style={{fontSize:32,fontFamily:"Fraunces,serif",fontWeight:900,color:C.black,margin:0,lineHeight:1.05}}>Welcome back,<br/>Alex</h1>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <div style={{position:"relative"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 0 2px #fff,0 0 0 4px ${C.teal}`}}><Icon name="brain" size={20} color="#fff"/></div>
            <div style={{position:"absolute",bottom:-4,right:-4,background:C.gold,borderRadius:100,fontSize:9,fontWeight:700,color:"#fff",padding:"2px 5px",fontFamily:"DM Sans,sans-serif"}}>Lv{level}</div>
          </div>
          <span style={{fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{xp} XP</span>
        </div>
      </div>

      <div style={{margin:"10px 22px 0"}}>
        <div style={{height:5,background:C.bg3,borderRadius:3,overflow:"hidden"}}><div style={{width:`${xpPct}%`,height:"100%",background:`linear-gradient(90deg,${C.teal},${C.gold})`,borderRadius:3,transition:"width .6s ease"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.light,fontFamily:"DM Sans,sans-serif",marginTop:3}}><span>Lv{level}</span><span>{200-(xp%200)} XP to Lv{level+1}</span></div>
      </div>

      <div style={{padding:"10px 20px 0",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[
          {label:"Streak",val:`${streak}d`,sub:"Best 14d", color:C.amber, icon:<Icon name="fire"  size={13} color={C.amber}/>},
          {label:"Gait",  val:"80",        sub:"↑+4 today",color:C.teal,  icon:<Icon name="trend" size={13} color={C.teal}/>},
          {label:"Flare", val:"Low",       sub:"Score 22", color:C.teal,  icon:<Icon name="heart" size={13} color={C.teal}/>},
        ].map((s,i)=>(
          <div key={i} style={{background:C.bg2,borderRadius:14,padding:"10px 8px",textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:3}}>{s.icon}</div>
            <p style={{margin:"0 0 1px",fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif",textTransform:"uppercase",letterSpacing:.6}}>{s.label}</p>
            <p style={{margin:"0 0 1px",fontSize:18,fontWeight:900,fontFamily:"Fraunces,serif",color:C.black,lineHeight:1}}>{s.val}</p>
            <p style={{margin:0,fontSize:9,color:s.color,fontFamily:"DM Sans,sans-serif"}}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 2×2 Game tiles */}
      <div style={{padding:"16px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <h2 style={{fontFamily:"Fraunces,serif",fontWeight:900,fontSize:22,color:C.black,margin:"0 0 2px"}}>Movement Challenges</h2>
            <p style={{margin:0,fontSize:11,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Tap a game to start · Earn XP each session</p>
          </div>
          <button onClick={()=>setTab("game")} style={{background:"none",border:`1.5px solid ${C.border}`,borderRadius:100,padding:"5px 12px",fontSize:11,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif",cursor:"pointer"}}>All</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {label:"Walk Quest",       sub:"2-min walk test",        bg:`linear-gradient(145deg,${C.walkBg},#1e3a5f)`,       icon:<Icon name="walk"     size={18} color="#fff"/>, id:"game"},
            {label:"Romberg Challenge",sub:"Balance & stability",     bg:`linear-gradient(145deg,${C.romBg},#3b1f5e)`,        icon:<Icon name="balance"  size={18} color="#fff"/>, id:"game"},
            {label:"GaitCam",          sub:"Walk-toward analysis",    bg:`linear-gradient(145deg,${C.gaitBg},#1a3f3c)`,       icon:<Icon name="skeleton" size={18} color="#fff"/>, id:"game"},
            {label:"Daily Log",        sub:"Symptoms + flare",        bg:"none",                                               icon:<Icon name="log"      size={18} color={C.black}/>, id:"log",light:true},
          ].map((t,i)=>(
            <button key={i} onClick={()=>setTab(t.id)} style={{background:t.bg,border:t.light?`1.5px solid ${C.border}`:"none",borderRadius:22,padding:"18px 16px",cursor:"pointer",textAlign:"left",position:"relative",overflow:"hidden",minHeight:130}}>
              <div style={{position:"absolute",right:-10,bottom:-10,width:70,height:70,borderRadius:"50%",background:t.light?"rgba(0,0,0,.04)":"rgba(255,255,255,.06)"}}/>
              <div style={{width:36,height:36,borderRadius:12,background:t.light?"#fff":t.id==="log"?"#fff":"rgba(255,255,255,.15)",border:t.light?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>{t.icon}</div>
              <p style={{margin:"0 0 2px",fontSize:13,fontWeight:700,color:t.light?C.black:"#fff",fontFamily:"DM Sans,sans-serif",lineHeight:1.2}}>{t.label}</p>
              <p style={{margin:"0 0 8px",fontSize:10,color:t.light?C.mid:"rgba(255,255,255,.6)",fontFamily:"DM Sans,sans-serif"}}>{t.sub}</p>
              <span style={{fontSize:10,background:t.light?C.gold+"22":"rgba(255,255,255,.18)",border:t.light?`1px solid ${C.gold}44`:"none",borderRadius:100,padding:"3px 9px",color:t.light?C.gold:"#fff",fontFamily:"DM Sans,sans-serif",fontWeight:600}}>{t.light?"+15 XP":"+35 XP"}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{margin:"14px 20px 0",background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:"14px 16px 16px",boxShadow:"0 2px 12px rgba(0,0,0,.04)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><p style={{margin:0,fontSize:13,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Today's check-in</p><span style={{fontSize:11,color:C.gold,fontWeight:600,fontFamily:"DM Sans,sans-serif"}}>+50 XP</span></div>
        <Stepper steps={["GaitCam","Log","Flare","Done"]} current={1}/>
      </div>

      <div style={{margin:"12px 20px 0",background:C.tealLight,borderRadius:18,padding:"14px",display:"flex",gap:12}}>
        <div style={{width:34,height:34,borderRadius:11,background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="brain" size={16} color="#fff"/></div>
        <div><p style={{margin:"0 0 3px",fontSize:12,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Today's Insight</p><p style={{margin:0,fontSize:12,color:C.tealDark,lineHeight:1.6,fontFamily:"DM Sans,sans-serif"}}>7.5h sleep → spasm count typically <strong>62% lower</strong> on days after quality rest.</p></div>
      </div>

      {/* My Conditions */}
      <div style={{padding:"16px 20px 0"}}>
        <h2 style={{fontFamily:"Fraunces,serif",fontWeight:700,fontSize:20,color:C.black,margin:"0 0 4px"}}>My Conditions</h2>
        <p style={{margin:"0 0 12px",fontSize:11,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Movement challenges adapt to each condition's profile</p>
        {[
          {name:"Spastic Paraplegia",abbr:"HSP",  color:C.amber, bg:C.amberLight, icon:<Icon name="bolt"     size={17} color={C.amber}/>, sub:"Gait · balance · spasm",games:"GaitCam · Walk Quest · Romberg"},
          {name:"Cerebellar Ataxia", abbr:"SCA3", color:C.purple,bg:C.purpleLight,icon:<Icon name="activity" size={17} color={C.purple}/>,sub:"Coordination · tremor",  games:"Romberg · GaitCam · Walk Quest"},
          {name:"Pompe Disease",     abbr:"GSD-II",color:C.teal, bg:C.tealLight,  icon:<Icon name="pompe"    size={17} color={C.teal}/>,  sub:"Muscle · respiratory",  games:"Walk Quest · GaitCam",hint:true},
        ].map((c,i)=>(
          <div key={i} style={{background:"#fff",border:`1px solid ${i===2?C.teal+"44":C.border}`,borderRadius:18,padding:"12px 14px",marginBottom:10,position:"relative",overflow:"hidden"}}>
            {c.hint&&<div style={{position:"absolute",top:0,right:0,background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,borderRadius:"0 18px 0 14px",padding:"4px 10px"}}><span style={{fontSize:9,color:"#fff",fontWeight:600,fontFamily:"DM Sans,sans-serif",letterSpacing:.5}}>SUGGESTED</span></div>}
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1,paddingRight:c.hint?44:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><p style={{margin:0,fontSize:13,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>{c.name}</p><span style={{fontSize:9,background:c.bg,color:c.color,borderRadius:100,padding:"2px 7px",fontWeight:700,fontFamily:"DM Sans,sans-serif"}}>{c.abbr}</span></div>
                <p style={{margin:"0 0 5px",fontSize:11,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{c.sub}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{c.games.split(" · ").map((g,j)=><span key={j} style={{fontSize:9,background:C.bg2,borderRadius:100,padding:"2px 8px",color:C.mid,fontFamily:"DM Sans,sans-serif",fontWeight:500}}>{g}</span>)}</div>
              </div>
            </div>
          </div>
        ))}
        <Btn label="Add Condition" icon={<Icon name="plus" size={13} color="#fff"/>} variant="black" onClick={()=>setShowAddCondition(true)}/>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   GAME SCREEN — all 3 games use camera-first HUD
══════════════════════════════════════════════════════════════════ */
const GameScreen=({addXP})=>{
  const videoRef=useRef<HTMLVideoElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const poseLandmarkerRef=useRef<PoseLandmarker|null>(null);
  const animFrameRef=useRef<number>(0);
  const lastVideoTimeRef=useRef<number>(-1);
  const [phase,setPhase]=useState("choose");
  const [pct,setPct]=useState(0);
  const [score,setScore]=useState<number|null>(null);
  const [cd,setCd]=useState<number|null>(null);
  const [cdColor,setCdColor]=useState(C.gaitAccent);
  const [poseReady,setPoseReady]=useState(false);
  const [liveMetrics,setLiveMetrics]=useState({stride:"--",symmetry:"--",cadence:"--"});

  // Walk Quest
  const [walkTime,setWalkTime]=useState(120);
  const [walkActive,setWalkActive]=useState(false);
  const [walkDone,setWalkDone]=useState(false);
  const [beat,setBeat]=useState(false);
  const [steps,setSteps]=useState(0);
  const walkRef=useRef<any>(null),beatRef=useRef<any>(null);

  // Romberg
  const [romPhase,setRomPhase]=useState("ready");
  const [romTime,setRomTime]=useState(30);
  const [romScores,setRomScores]=useState<Record<string,number>>({});

  // Static fallback skeleton (used in done screen)
  const joints=[[50,8],[50,20],[40,30],[60,30],[30,42],[70,42],[50,38],[44,55],[56,55],[44,74],[56,74]];
  const bones=[[0,1],[1,2],[1,3],[2,4],[3,5],[1,6],[6,7],[6,8],[7,9],[8,10]];

  // MediaPipe Pose connections for drawing
  const POSE_CONNECTIONS = [
    [11,12],[11,13],[13,15],[12,14],[14,16], // torso + arms
    [11,23],[12,24],[23,24],                  // hips
    [23,25],[25,27],[24,26],[26,28],          // legs
    [27,29],[27,31],[28,30],[28,32],          // feet
    [15,17],[15,19],[16,18],[16,20],          // hands
  ];

  // Init MediaPipe PoseLandmarker
  const initPoseLandmarker = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      poseLandmarkerRef.current = landmarker;
      setPoseReady(true);
    } catch (e) {
      console.error("MediaPipe init failed:", e);
      // Fallback to CPU
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "CPU"
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });
        poseLandmarkerRef.current = landmarker;
        setPoseReady(true);
      } catch (e2) {
        console.error("MediaPipe CPU fallback also failed:", e2);
      }
    }
  }, []);

  // Pose detection loop
  const detectPose = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = poseLandmarkerRef.current;
    if (!video || !canvas || !landmarker || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detectPose);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const result = landmarker.detectForVideo(video, performance.now());

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (result.landmarks && result.landmarks.length > 0) {
        const lm = result.landmarks[0];
        const w = canvas.width, h = canvas.height;

        // Draw connections
        for (const [a, b] of POSE_CONNECTIONS) {
          if (lm[a] && lm[b] && lm[a].visibility > 0.5 && lm[b].visibility > 0.5) {
            ctx.beginPath();
            ctx.moveTo(lm[a].x * w, lm[a].y * h);
            ctx.lineTo(lm[b].x * w, lm[b].y * h);
            ctx.strokeStyle = C.gaitAccent;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }

        // Draw joints
        for (let i = 0; i < lm.length; i++) {
          if (lm[i].visibility > 0.5) {
            ctx.beginPath();
            ctx.arc(lm[i].x * w, lm[i].y * h, i < 11 ? 3 : 5, 0, 2 * Math.PI);
            ctx.fillStyle = "#fff";
            ctx.fill();
            ctx.strokeStyle = C.gaitAccent;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        // Compute live metrics from landmarks
        const lHip = lm[23], rHip = lm[24], lAnkle = lm[27], rAnkle = lm[28];
        if (lHip && rHip && lAnkle && rAnkle) {
          const hipWidth = Math.abs(lHip.x - rHip.x);
          const strideEst = Math.round(hipWidth * 200 + 40);
          const lLeg = Math.abs(lHip.y - lAnkle.y);
          const rLeg = Math.abs(rHip.y - rAnkle.y);
          const sym = Math.round((1 - Math.abs(lLeg - rLeg) / Math.max(lLeg, rLeg, 0.01)) * 100);
          setLiveMetrics({ stride: `~${strideEst}cm`, symmetry: `${sym}%`, cadence: "Live" });
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(detectPose);
  }, []);

  // Start/stop pose detection when gaitcam phase is active
  useEffect(() => {
    if (phase === "gaitcam" && poseReady) {
      animFrameRef.current = requestAnimationFrame(detectPose);
    }
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [phase, poseReady, detectPose]);

  // Cleanup landmarker on unmount
  useEffect(() => {
    return () => {
      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
        poseLandmarkerRef.current = null;
      }
    };
  }, []);

  const openCam=async(gid:string,accent:string)=>{
    setCdColor(accent); setCd(3);
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:640},height:{ideal:480}}});
      if(videoRef.current){videoRef.current.srcObject=s;videoRef.current.play();}
      // Init MediaPipe for gaitcam
      if(gid==="gaitcam" && !poseLandmarkerRef.current) await initPoseLandmarker();
    }catch(e){console.error("Camera error:",e);}
    let c=3;const iv=setInterval(()=>{c--;if(c===0){clearInterval(iv);setCd(null);setPhase(gid);}else setCd(c);},1000);
  };

  const analyze=(gid:string)=>{
    cancelAnimationFrame(animFrameRef.current);
    if(videoRef.current?.srcObject)(videoRef.current.srcObject as MediaStream).getTracks().forEach(t=>t.stop());
    setPct(0);setPhase("analyzing");
    const iv=setInterval(()=>setPct(p=>{if(p>=100){clearInterval(iv);const s=Math.floor(Math.random()*14)+73;setScore(s);setPhase(gid+"-done");addXP(35);return 100;}return p+2;}),60);
  };

  const reset=()=>{
    cancelAnimationFrame(animFrameRef.current);
    setPhase("choose");setScore(null);setPct(0);setWalkTime(120);setWalkActive(false);setWalkDone(false);setRomPhase("ready");setRomTime(30);setRomScores({});setSteps(0);setPoseReady(false);setLiveMetrics({stride:"--",symmetry:"--",cadence:"--"});
    clearInterval(walkRef.current);clearInterval(beatRef.current);
    if(poseLandmarkerRef.current){poseLandmarkerRef.current.close();poseLandmarkerRef.current=null;}
  };
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  // Walk Quest timer
  useEffect(()=>{
    if(!walkActive)return;
    beatRef.current=setInterval(()=>{setBeat(b=>!b);setSteps(s=>s+1);},700);
    walkRef.current=setInterval(()=>{setWalkTime(t=>{if(t<=1){clearInterval(walkRef.current);clearInterval(beatRef.current);setWalkActive(false);setWalkDone(true);addXP(35);return 0;}return t-1;});},1000);
    return()=>{clearInterval(walkRef.current);clearInterval(beatRef.current);};
  },[walkActive]);

  // Romberg timer
  useEffect(()=>{
    if(phase!=="romberg"||(romPhase!=="eyes-open"&&romPhase!=="eyes-closed"))return;
    const iv=setInterval(()=>{setRomTime(t=>{if(t<=1){clearInterval(iv);const sw=Math.floor(Math.random()*25)+5;setRomScores(prev=>{const next={...prev,[romPhase]:sw};if(romPhase==="eyes-open"){setRomPhase("eyes-closed");setRomTime(30);}else{setRomPhase("done");addXP(35);}return next;});return 30;}return t-1;});},1000);
    return()=>clearInterval(iv);
  },[phase,romPhase]);

  const GameCard=({game,onClick})=>(
    <button onClick={onClick} style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:20,padding:"14px",marginBottom:10,cursor:"pointer",display:"flex",gap:14,alignItems:"center",textAlign:"left"}}>
      <div style={{width:48,height:48,borderRadius:14,background:game.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{game.icon}</div>
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
          <p style={{margin:0,fontSize:14,fontWeight:700,color:C.black,fontFamily:"DM Sans,sans-serif"}}>{game.label}</p>
          <span style={{fontSize:9,background:C.bg2,borderRadius:100,padding:"2px 7px",color:C.mid,fontFamily:"DM Sans,sans-serif",fontWeight:600}}>{game.std}</span>
        </div>
        <p style={{margin:0,fontSize:11,color:C.mid,fontFamily:"DM Sans,sans-serif",lineHeight:1.5}}>{game.sub}</p>
      </div>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>
    </button>
  );

  return(
    <div style={{padding:"0 0 100px"}}>
      <div style={{padding:"20px 22px 14px"}}>
        <h1 style={{fontFamily:"Fraunces,serif",fontSize:30,fontWeight:900,color:C.black,margin:"0 0 3px",lineHeight:1.05}}>Movement Challenges</h1>
        <p style={{margin:0,fontSize:12,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Clinically standardized · Earn <span style={{color:C.gold,fontWeight:600}}>35 XP</span> per session</p>
      </div>

      {/* CHOOSE */}
      {phase==="choose"&&(
        <div style={{padding:"0 20px"}}>
          <GameCard game={{label:"Walk Quest",sub:"2-min music-guided walk · standardized 2MWT",std:"2MWT",bg:`linear-gradient(135deg,${C.walkBg},#1a3a5c)`,icon:<Icon name="walk" size={20} color="#fff"/>}} onClick={()=>setPhase("walkquest-ready")}/>
          <GameCard game={{label:"Romberg Challenge",sub:"Eyes open → closed balance test · 30s each",std:"Romberg",bg:`linear-gradient(135deg,${C.romBg},#3b1f5e)`,icon:<Icon name="balance" size={20} color="#fff"/>}} onClick={()=>openCam("romberg",C.romAccent)}/>
          <GameCard game={{label:"GaitCam",sub:"Walk toward camera · real-time pose landmarks",std:"TUG-adapted",bg:`linear-gradient(135deg,${C.gaitBg},#1a3f3c)`,icon:<Icon name="skeleton" size={20} color="#fff"/>}} onClick={()=>openCam("gaitcam",C.gaitAccent)}/>
          <div style={{background:C.bg2,borderRadius:18,padding:"14px",marginTop:4}}>
            <p style={{margin:"0 0 10px",fontSize:12,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Clinical standards used</p>
            {[
              {icon:<Icon name="walk"    size={13} color={C.walkAccent}/>, text:"Walk Quest: 2-Minute Walk Test (2MWT) — validated for HSP, Pompe, and neuromuscular conditions"},
              {icon:<Icon name="balance" size={13} color={C.romAccent}/>, text:"Romberg Challenge: Romberg sign test — standard neurological balance assessment"},
              {icon:<Icon name="skeleton" size={13} color={C.gaitAccent}/>,text:"GaitCam: MediaPipe Pose landmarks — real-time pediatric gait pattern capture"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<2?8:0}}>
                <div style={{width:26,height:26,borderRadius:8,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{r.icon}</div>
                <p style={{margin:"4px 0 0",fontSize:11,color:C.mid,fontFamily:"DM Sans,sans-serif",lineHeight:1.5}}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COUNTDOWN */}
      {cd!==null&&(
        <div style={{padding:"0 20px"}}>
          <CamHUD accent={cdColor} label="INITIALIZING" recording={false}>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:80,fontFamily:"Fraunces,serif",fontWeight:900,color:"#fff",lineHeight:1,animation:"bounce-in .25s"}}>{cd}</span>
              <p style={{color:cdColor,fontSize:10,letterSpacing:3,margin:0,fontFamily:"DM Sans,sans-serif"}}>GET INTO POSITION</p>
            </div>
          </CamHUD>
        </div>
      )}

      {/* ══ WALK QUEST READY ══ */}
      {phase==="walkquest-ready"&&(
        <div style={{padding:"0 20px"}}>
          <CamHUD accent={C.walkAccent} label="WALK QUEST · 2MWT" recording={false}
            metrics={[{l:"Duration",v:"2:00"},{l:"Standard",v:"2MWT"},{l:"Status",v:"READY"}]}>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:"0 20px"}}>
              {/* Animated walking figure */}
              <svg width="56" height="90" viewBox="0 0 56 90" style={{animation:"walk-cycle 1.2s ease-in-out infinite"}}>
                <circle cx="28" cy="9" r="7" fill="rgba(255,255,255,.9)"/>
                <line x1="28" y1="16" x2="28" y2="48" stroke={C.walkAccent} strokeWidth="3" strokeLinecap="round"/>
                <line x1="28" y1="28" x2="14" y2="44" stroke="rgba(255,255,255,.85)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="28" y1="28" x2="42" y2="40" stroke="rgba(255,255,255,.85)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="28" y1="48" x2="16" y2="72" stroke="rgba(255,255,255,.85)" strokeWidth="3" strokeLinecap="round"/>
                <line x1="28" y1="48" x2="40" y2="72" stroke="rgba(255,255,255,.85)" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="16" cy="72" r="3" fill={C.walkAccent}/>
                <circle cx="40" cy="72" r="3" fill={C.walkAccent}/>
              </svg>
              <div style={{textAlign:"center"}}>
                <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700,color:"#fff",fontFamily:"DM Sans,sans-serif"}}>Ready to start Walk Quest?</p>
                <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,.5)",fontFamily:"DM Sans,sans-serif"}}>Walk at your comfortable pace for 2 minutes</p>
              </div>
            </div>
          </CamHUD>
          <div style={{marginTop:10,background:C.walkAccentLight,borderRadius:16,padding:"12px 14px",marginBottom:10}}>
            {["Find a straight corridor of at least 10 meters","Walk at your normal comfortable pace — don't rush","The app plays music to guide your rhythm","Test ends automatically after 2 minutes"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<3?5:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:C.walkAccent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><span style={{fontSize:8,color:"#fff",fontWeight:700}}>{i+1}</span></div>
                <p style={{margin:0,fontSize:11,color:"#1e3a5f",fontFamily:"DM Sans,sans-serif",lineHeight:1.5}}>{t}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>{setWalkActive(true);setPhase("walkquest");}} style={{width:"100%",padding:"14px",borderRadius:100,border:"none",background:`linear-gradient(90deg,${C.walkBg},#1e3a5f)`,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"DM Sans,sans-serif",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <Icon name="walk" size={16} color="#fff"/> Start Walk Quest
          </button>
        </div>
      )}

      {/* ══ WALK QUEST ACTIVE ══ */}
      {phase==="walkquest"&&!walkDone&&(
        <div style={{padding:"0 20px"}}>
          <CamHUD accent={C.walkAccent} label="WALK QUEST · RECORDING" recording={true}
            metrics={[{l:"Time Left",v:fmt(walkTime),hi:true},{l:"Steps",v:steps},{l:"Cadence",v:`${Math.round(steps/(120-walkTime||1)*60)} spm`}]}>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
              {/* Big countdown */}
              <div style={{fontSize:56,fontWeight:900,fontFamily:"Fraunces,serif",color:"#fff",lineHeight:1,textShadow:`0 0 20px ${C.walkAccent}66`}}>{fmt(walkTime)}</div>
              {/* Music beat bars */}
              <div style={{display:"flex",gap:5,alignItems:"flex-end",height:28}}>
                {[...Array(12)].map((_,i)=>{const h=beat&&i%2===0?22:beat&&i%3===0?18:10;return(
                  <div key={i} style={{width:3.5,height:h,background:i%2===0?C.walkAccent:"rgba(255,255,255,.4)",borderRadius:2,transition:"height .12s ease"}}/>
                );})}
              </div>
              <p style={{color:"rgba(255,255,255,.5)",fontSize:10,letterSpacing:1,margin:0,fontFamily:"DM Sans,sans-serif"}}>KEEP WALKING · FOLLOW THE BEAT</p>
            </div>
          </CamHUD>
          <button onClick={()=>{clearInterval(walkRef.current);clearInterval(beatRef.current);setWalkActive(false);setWalkDone(true);addXP(35);}} style={{width:"100%",marginTop:10,padding:"13px",borderRadius:100,border:`1.5px solid ${C.border}`,background:"#fff",color:C.mid,fontSize:13,fontWeight:600,fontFamily:"DM Sans,sans-serif",cursor:"pointer"}}>
            Finish Early
          </button>
        </div>
      )}

      {/* Walk Quest done */}
      {phase==="walkquest"&&walkDone&&(
        <div style={{padding:"0 20px",animation:"fade-in .4s ease"}}>
          <div style={{background:`linear-gradient(145deg,${C.walkBg},#1e3a5f)`,borderRadius:22,padding:"24px",textAlign:"center",marginBottom:12}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}><Icon name="trophy" size={22} color="#fff"/></div>
            <p style={{margin:"0 0 3px",fontSize:10,color:"rgba(255,255,255,.55)",letterSpacing:2,fontFamily:"DM Sans,sans-serif"}}>WALK QUEST COMPLETE</p>
            <div style={{fontSize:52,fontWeight:900,fontFamily:"Fraunces,serif",color:"#fff",lineHeight:1,marginBottom:4}}>{fmt(120-walkTime)}</div>
            <p style={{margin:"0 0 12px",fontSize:12,color:"rgba(255,255,255,.6)",fontFamily:"DM Sans,sans-serif"}}>time walked</p>
            <div style={{background:"rgba(255,255,255,.12)",borderRadius:14,padding:"8px 14px",display:"inline-flex",gap:6,alignItems:"center"}}><Icon name="star" size={13} color={C.gold}/><span style={{fontSize:12,fontWeight:700,color:"#fff",fontFamily:"DM Sans,sans-serif"}}>+35 XP earned</span></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[{l:"Est. Distance",v:"148m"},{l:"Total Steps",v:steps||216},{l:"Avg Cadence",v:"96 spm"},{l:"vs Last Session",v:"+12m",accent:true}].map((m,i)=>(
              <div key={i} style={{background:m.accent?C.walkAccentLight:C.bg2,borderRadius:14,padding:"12px"}}>
                <p style={{margin:"0 0 4px",fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif",textTransform:"uppercase",letterSpacing:.7}}>{m.l}</p>
                <p style={{margin:0,fontSize:22,fontWeight:900,fontFamily:"Fraunces,serif",color:m.accent?C.walkAccent:C.black}}>{m.v}</p>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}><Btn label="Try Again" onClick={reset} variant="outline"/><Btn label="Save" icon={<Icon name="check" size={13} color="#fff"/>} onClick={()=>alert("Saved!")} variant="teal"/></div>
        </div>
      )}

      {/* ══ ROMBERG ACTIVE ══ */}
      {phase==="romberg"&&romPhase!=="done"&&(
        <div style={{padding:"0 20px"}}>
          <CamHUD accent={C.romAccent} label={`ROMBERG · ${romPhase==="ready"?"READY":romPhase==="eyes-open"?"PHASE 1 · EYES OPEN":"PHASE 2 · EYES CLOSED"}`} recording={romPhase!=="ready"}
            metrics={romPhase!=="ready"?[{l:"Phase",v:romPhase==="eyes-open"?"1/2":"2/2"},{l:"Time",v:romTime+"s",hi:true},{l:"Sway",v:"Tracking"}]:[]}>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:"0 16px"}}>
              {/* Standing figure */}
              <svg width="54" height="96" viewBox="0 0 54 96" style={{animation:romPhase==="eyes-closed"?"sway-closed 1.8s ease-in-out infinite":romPhase==="eyes-open"?"sway 2.5s ease-in-out infinite":"none"}}>
                <circle cx="27" cy="9" r="8" fill="rgba(255,255,255,.9)"/>
                {/* Eyes */}
                {romPhase==="eyes-open"?<><circle cx="24" cy="8" r="1.5" fill={C.romAccent}/><circle cx="30" cy="8" r="1.5" fill={C.romAccent}/></>
                  :<><line x1="22" y1="7.5" x2="26" y2="9.5" stroke={C.romAccent} strokeWidth="1.5" strokeLinecap="round"/><line x1="28" y1="7.5" x2="32" y2="9.5" stroke={C.romAccent} strokeWidth="1.5" strokeLinecap="round"/></>}
                <line x1="27" y1="17" x2="27" y2="55" stroke="rgba(255,255,255,.9)" strokeWidth="3" strokeLinecap="round"/>
                <line x1="27" y1="30" x2="12" y2="46" stroke="rgba(255,255,255,.8)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="27" y1="30" x2="42" y2="46" stroke="rgba(255,255,255,.8)" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="27" y1="55" x2="19" y2="82" stroke="rgba(255,255,255,.85)" strokeWidth="3" strokeLinecap="round"/>
                <line x1="27" y1="55" x2="35" y2="82" stroke="rgba(255,255,255,.85)" strokeWidth="3" strokeLinecap="round"/>
                {/* Feet together */}
                <ellipse cx="19" cy="85" rx="5" ry="2.5" fill={C.romAccent} opacity=".8"/>
                <ellipse cx="35" cy="85" rx="5" ry="2.5" fill={C.romAccent} opacity=".8"/>
                {/* Sway trail dots when active */}
                {(romPhase==="eyes-open"||romPhase==="eyes-closed")&&[...Array(4)].map((_,i)=>(
                  <circle key={i} cx={27+(i-1.5)*4} cy={10+i*2} r="1" fill={C.romAccent} opacity={(i+1)*.15}/>
                ))}
              </svg>
              {/* Concentric rings */}
              <svg style={{position:"absolute",bottom:30,opacity:.12}} width="120" height="50" viewBox="0 0 120 50">
                <ellipse cx="60" cy="25" rx="55" ry="20" stroke={C.romAccent} strokeWidth="1" fill="none" strokeDasharray="4 4"/>
                <ellipse cx="60" cy="25" rx="35" ry="12" stroke={C.romAccent} strokeWidth="1" fill="none"/>
                <ellipse cx="60" cy="25" rx="15" ry="5" stroke={C.romAccent} strokeWidth="1" fill="none"/>
              </svg>
              {romPhase==="ready"&&(
                <div style={{background:"rgba(0,0,0,.5)",borderRadius:14,padding:"10px 16px",textAlign:"center",maxWidth:200}}>
                  <p style={{margin:"0 0 3px",fontSize:12,fontWeight:600,color:"#fff",fontFamily:"DM Sans,sans-serif"}}>Stand still, feet together</p>
                  <p style={{margin:0,fontSize:10,color:"rgba(255,255,255,.55)",fontFamily:"DM Sans,sans-serif"}}>Arms at sides · camera will track your sway</p>
                </div>
              )}
              {romPhase==="eyes-open"&&(
                <div style={{background:"rgba(0,0,0,.5)",borderRadius:14,padding:"8px 14px",textAlign:"center"}}>
                  <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,.8)",fontFamily:"DM Sans,sans-serif"}}>Look straight ahead · stay still</p>
                </div>
              )}
              {romPhase==="eyes-closed"&&(
                <div style={{background:"rgba(168,85,247,.3)",border:`1px solid ${C.romAccent}55`,borderRadius:14,padding:"8px 14px",textAlign:"center"}}>
                  <p style={{margin:0,fontSize:11,color:"rgba(255,255,255,.9)",fontWeight:600,fontFamily:"DM Sans,sans-serif"}}>Eyes closed — keep still</p>
                </div>
              )}
            </div>
          </CamHUD>
          <div style={{marginTop:10}}>
            {romPhase==="ready"&&(
              <button onClick={()=>setRomPhase("eyes-open")} style={{width:"100%",padding:"14px",borderRadius:100,border:"none",background:`linear-gradient(90deg,${C.romBg},#3b1f5e)`,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"DM Sans,sans-serif",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <Icon name="eye" size={16} color="#fff"/> Begin Phase 1 — Eyes Open
              </button>
            )}
            {(romPhase==="eyes-open"||romPhase==="eyes-closed")&&(
              <div style={{background:C.romAccentLight,borderRadius:16,padding:"11px 14px",display:"flex",gap:10,alignItems:"center"}}>
                <Icon name={romPhase==="eyes-open"?"eye":"eyeoff"} size={14} color={C.romAccent}/>
                <p style={{margin:0,fontSize:11,color:"#3b1f5e",fontFamily:"DM Sans,sans-serif",fontWeight:500}}>{romPhase==="eyes-open"?"Hold still, eyes open — 30 seconds":"Eyes CLOSED — hold your balance — 30 seconds"}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Romberg done */}
      {phase==="romberg"&&romPhase==="done"&&(
        <div style={{padding:"0 20px",animation:"fade-in .4s ease"}}>
          <div style={{background:`linear-gradient(145deg,${C.romBg},#3b1f5e)`,borderRadius:22,padding:"22px",textAlign:"center",marginBottom:12}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px"}}><Icon name="balance" size={22} color="#fff"/></div>
            <p style={{margin:"0 0 3px",fontSize:10,color:"rgba(255,255,255,.55)",letterSpacing:2,fontFamily:"DM Sans,sans-serif"}}>ROMBERG COMPLETE</p>
            <div style={{background:"rgba(255,255,255,.12)",borderRadius:14,padding:"8px 14px",display:"inline-flex",gap:6,alignItems:"center",marginTop:8}}><Icon name="star" size={13} color={C.gold}/><span style={{fontSize:12,fontWeight:700,color:"#fff",fontFamily:"DM Sans,sans-serif"}}>+35 XP earned</span></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[{l:"Eyes Open Sway",v:`${romScores["eyes-open"]??12}mm`},{l:"Eyes Closed Sway",v:`${romScores["eyes-closed"]??22}mm`},{l:"Romberg Ratio",v:`${Math.round(((romScores["eyes-closed"]??22)/(romScores["eyes-open"]??12))*10)/10}×`},{l:"Balance Score",v:"74/100",accent:true}].map((m,i)=>(
              <div key={i} style={{background:m.accent?C.romAccentLight:C.bg2,borderRadius:14,padding:"12px"}}>
                <p style={{margin:"0 0 4px",fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif",textTransform:"uppercase",letterSpacing:.7}}>{m.l}</p>
                <p style={{margin:0,fontSize:22,fontWeight:900,fontFamily:"Fraunces,serif",color:m.accent?C.romAccent:C.black}}>{m.v}</p>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}><Btn label="Try Again" onClick={reset} variant="outline"/><Btn label="Save" icon={<Icon name="check" size={13} color="#fff"/>} onClick={()=>alert("Saved!")} variant="teal"/></div>
        </div>
      )}

      {/* ══ GAITCAM ACTIVE ══ */}
      {phase==="gaitcam"&&(
        <div style={{padding:"0 20px"}}>
          <CamHUD accent={C.gaitAccent} label={poseReady?"GAITCAM · MEDIAPIPE LIVE":"GAITCAM · LOADING MODEL..."} recording={poseReady}
            metrics={[{l:"Stride",v:liveMetrics.stride},{l:"Symmetry",v:liveMetrics.symmetry,hi:liveMetrics.symmetry!=="--"},{l:"Tracking",v:poseReady?"Active":"Init...",hi:poseReady}]}>
            <div style={{position:"absolute",inset:0}}>
              {/* Live video feed */}
              <video ref={videoRef} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",opacity:.45,position:"absolute",inset:0,transform:"scaleX(-1)"}}/>
              {/* MediaPipe pose canvas overlay */}
              <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",pointerEvents:"none",transform:"scaleX(-1)"}}/>
              {/* Grid guides */}
              <svg style={{position:"absolute",inset:0,pointerEvents:"none"}} width="100%" height="100%" viewBox="0 0 100 100">
                <line x1="0" y1="87" x2="100" y2="87" stroke={`${C.gaitAccent}44`} strokeWidth=".5" strokeDasharray="3 3"/>
                <line x1="50" y1="5" x2="50" y2="87" stroke={`${C.gaitAccent}22`} strokeWidth=".5" strokeDasharray="2 4"/>
              </svg>
              {/* Loading indicator */}
              {!poseReady&&(
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:"50%",border:`3px solid rgba(29,163,154,.25)`,borderTopColor:C.gaitAccent,animation:"spin 1s linear infinite"}}/>
                  <p style={{color:C.gaitAccent,fontSize:10,letterSpacing:2,margin:0,fontFamily:"DM Sans,sans-serif"}}>LOADING MEDIAPIPE...</p>
                </div>
              )}
              {/* Direction arrow */}
              {poseReady&&(
                <div style={{position:"absolute",bottom:50,left:0,right:0,display:"flex",justifyContent:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(0,0,0,.5)",borderRadius:100,padding:"4px 12px"}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.gaitAccent} strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                    <span style={{fontSize:9,color:C.gaitAccent,letterSpacing:1.5,fontFamily:"DM Sans,sans-serif",fontWeight:700}}>WALK TOWARD CAMERA</span>
                  </div>
                </div>
              )}
            </div>
          </CamHUD>
          <div style={{marginTop:10,display:"flex",gap:8}}>
            <div style={{flex:1,background:C.tealLight,borderRadius:14,padding:"11px 14px",display:"flex",gap:8,alignItems:"center"}}>
              <Icon name="forward" size={14} color={C.teal}/>
              <p style={{margin:0,fontSize:11,color:C.tealDark,fontFamily:"DM Sans,sans-serif"}}>Walk straight toward the camera · 10 steps</p>
            </div>
          </div>
          <div style={{marginTop:10}}>
            <Btn label="Analyze Gait" onClick={()=>analyze("gaitcam")} variant="teal"/>
          </div>
        </div>
      )}

      {/* ANALYZING */}
      {phase==="analyzing"&&(
        <div style={{padding:"0 20px"}}>
          <CamHUD accent={C.gaitAccent} label="PROCESSING" recording={false}>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:"0 32px"}}>
              <div style={{width:52,height:52,borderRadius:"50%",border:`3px solid rgba(29,163,154,.25)`,borderTopColor:C.gaitAccent,animation:"spin 1s linear infinite"}}/>
              <p style={{color:C.gaitAccent,fontSize:10,letterSpacing:3,margin:0,fontFamily:"DM Sans,sans-serif"}}>ANALYZING LANDMARKS</p>
              <div style={{width:"100%",height:4,background:"rgba(255,255,255,.1)",borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${C.gaitAccent},#4ECDC4)`,borderRadius:2,transition:"width .1s linear"}}/>
              </div>
              <p style={{color:"rgba(255,255,255,.3)",fontSize:11,margin:0,fontFamily:"DM Sans,sans-serif"}}>MediaPipe Pose · {Math.floor(pct)}%</p>
            </div>
          </CamHUD>
        </div>
      )}

      {/* GaitCam done */}
      {phase==="gaitcam-done"&&score&&(
        <div style={{padding:"0 20px",animation:"fade-in .4s ease"}}>
          <CamHUD accent={C.gaitAccent} label="GAITCAM · ANALYSIS COMPLETE" recording={false}
            metrics={[{l:"Stride Sym.",v:`${Math.floor(score*.96)}%`,hi:true},{l:"Cadence",v:"98 spm"},{l:"Score",v:`${score}/100`,hi:true}]}>
            <div style={{position:"absolute",inset:0}}>
              <svg style={{position:"absolute",inset:0}} width="100%" height="100%" viewBox="0 0 100 100">
                {bones.map(([a,b],i)=><line key={i} x1={joints[a][0]} y1={joints[a][1]} x2={joints[b][0]} y2={joints[b][1]} stroke={C.gaitAccent} strokeWidth="1.4" strokeOpacity=".85"/>)}
                {joints.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.8" fill="#fff" stroke={C.gaitAccent} strokeWidth=".8"/>)}
              </svg>
              <div style={{position:"absolute",top:50,right:12,background:C.gaitAccent,borderRadius:12,padding:"8px 12px",textAlign:"center"}}>
                <div style={{fontSize:7,color:"rgba(255,255,255,.7)",letterSpacing:1,fontFamily:"DM Sans,sans-serif"}}>SCORE</div>
                <div style={{fontSize:26,fontWeight:900,fontFamily:"Fraunces,serif",color:"#fff",lineHeight:1}}>{score}</div>
              </div>
              <div style={{position:"absolute",bottom:50,left:12,background:C.gold,borderRadius:100,padding:"3px 10px",display:"flex",alignItems:"center",gap:4}}>
                <Icon name="star" size={10} color="#fff"/>
                <span style={{fontSize:10,fontWeight:700,color:"#fff",fontFamily:"DM Sans,sans-serif"}}>+35 XP</span>
              </div>
            </div>
          </CamHUD>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"10px 0"}}>
            {[{l:"Stride Symmetry",v:`${Math.floor(score*.96)}%`},{l:"Cadence",v:"98 spm"},{l:"Ankle Variance",v:"3.2°"},{l:"Gait Score",v:`${score}/100`,accent:true}].map((m,i)=>(
              <div key={i} style={{background:m.accent?C.tealLight:C.bg2,borderRadius:14,padding:"12px"}}>
                <p style={{margin:"0 0 4px",fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif",textTransform:"uppercase",letterSpacing:.7}}>{m.l}</p>
                <p style={{margin:0,fontSize:22,fontWeight:900,fontFamily:"Fraunces,serif",color:m.accent?C.teal:C.black}}>{m.v}</p>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}><Btn label="Play Again" onClick={reset} variant="outline"/><Btn label="Save" icon={<Icon name="check" size={13} color="#fff"/>} onClick={()=>alert("Saved!")} variant="teal"/></div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   LOG
══════════════════════════════════════════════════════════════════ */
const LogScreen=({addXP})=>{
  const [vals,setVals]=useState({spasm:3,pain:4,fatigue:5,sleep:7,mood:3});
  const [notes,setNotes]=useState("");
  const [saved,setSaved]=useState(false);
  const [flareOpen,setFlareOpen]=useState(false);
  const [flareSyms,setFlareSyms]=useState([]);
  const [flareSev,setFlareSev]=useState(null);
  const [alertToast,setAlertToast]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const flare=calcFlare(vals);

  const fields=[
    {key:"spasm",  label:"Spasm / Stiffness",icon:<Icon name="bolt"  size={14} color="currentColor"/>,max:15,unit:"events",color:C.amber},
    {key:"pain",   label:"Pain Level",        icon:<Icon name="warn"  size={14} color="currentColor"/>,max:10,unit:"/10",  color:C.red},
    {key:"fatigue",label:"Fatigue",           icon:<Icon name="moon"  size={14} color="currentColor"/>,max:10,unit:"/10",  color:C.purple},
    {key:"sleep",  label:"Hours of Sleep",    icon:<Icon name="sun"   size={14} color="currentColor"/>,max:12,unit:"hrs",  color:C.teal},
    {key:"mood",   label:"Mood",              icon:<Icon name="heart" size={14} color="currentColor"/>,max:5, unit:"/5",   color:C.gold},
  ];
  const flareOpts=["Spasm surge","Tremor","Extreme fatigue","Vision changes","Near falls","Speech difficulty","Balance loss","Pain spike"];
  const sevs=[{id:"mild",label:"Mild",desc:"At home",color:C.amber},{id:"moderate",label:"Moderate",desc:"Daily impact",color:"#E0722A"},{id:"severe",label:"Severe",desc:"Urgent care",color:C.red}];

  const handleSubmit=()=>{setSaved(true);addXP(15);if(flare.level!=="low")setTimeout(()=>setShowModal(true),500);setTimeout(()=>setSaved(false),3000);};
  const sendAlert=(who)=>{setAlertToast(who);setShowModal(false);setTimeout(()=>setAlertToast(null),3500);};

  return(
    <div style={{padding:"0 0 100px",position:"relative"}}>
      {alertToast&&<div style={{position:"fixed",top:72,left:"50%",transform:"translateX(-50%)",zIndex:999,background:alertToast==="clinician"?C.red:C.amber,color:"#fff",fontFamily:"DM Sans,sans-serif",fontWeight:600,fontSize:12,padding:"9px 18px",borderRadius:100,whiteSpace:"nowrap",boxShadow:"0 8px 24px rgba(0,0,0,.2)",animation:"slide-up .35s ease"}}>{alertToast==="clinician"?"Clinician alerted — urgent response triggered":"Caregiver notified via SMS"}</div>}

      {/* Alert modal — NO DISMISS for severe */}
      {showModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:998,display:"flex",alignItems:"flex-end",WebkitOverflowScrolling:"touch"}}>
          <div style={{width:"100%",background:"#fff",borderRadius:"26px 26px 0 0",padding:"20px 20px 0",animation:"slide-up .3s ease",maxHeight:"90dvh",display:"flex",flexDirection:"column",overflowY:"auto",paddingBottom:"env(safe-area-inset-bottom,24px)"}}>
            <div style={{width:36,height:4,background:C.border,borderRadius:2,margin:"0 auto 16px",flexShrink:0}}/>
            {/* Severity banner */}
            <div style={{background:flare.bg,border:`1.5px solid ${flare.color}33`,borderRadius:16,padding:"12px 14px",marginBottom:14,display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:44,height:44,borderRadius:12,background:flare.level==="severe"?C.red:C.amber,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon name="warn" size={20} color="#fff"/></div>
              <div>
                <p style={{margin:"0 0 2px",fontSize:14,fontWeight:700,color:flare.color,fontFamily:"DM Sans,sans-serif"}}>{flare.label}</p>
                <p style={{margin:0,fontSize:12,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Flare Score: <strong style={{color:flare.color}}>{flare.score}/100</strong></p>
              </div>
            </div>
            {flare.level==="severe"&&(
              <div style={{background:C.redLight,borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",gap:8,alignItems:"flex-start",flexShrink:0}}>
                <Icon name="warn" size={14} color={C.red}/>
                <p style={{margin:0,fontSize:11,color:C.red,fontFamily:"DM Sans,sans-serif",lineHeight:1.5,fontWeight:500}}>This is a <strong>life-threatening severity level</strong>. Immediate medical contact is required — do not dismiss.</p>
              </div>
            )}
            <p style={{margin:"0 0 14px",fontSize:13,color:C.mid,fontFamily:"DM Sans,sans-serif",flexShrink:0}}>Who would you like to notify?</p>
            <div style={{display:"flex",flexDirection:"column",gap:9,paddingBottom:24,flexShrink:0}}>
              {flare.level==="severe"&&(
                <button onClick={()=>sendAlert("clinician")} style={{padding:"16px",borderRadius:100,background:C.red,border:"none",color:"#fff",fontSize:14,fontWeight:700,fontFamily:"DM Sans,sans-serif",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 20px ${C.red}44`,minHeight:54}}>
                  <Icon name="phone" size={16} color="#fff"/> Alert Clinician + Caregiver
                </button>
              )}
              {flare.level!=="severe"&&(
                <button onClick={()=>sendAlert("caregiver")} style={{padding:"14px",borderRadius:100,background:C.amber,border:"none",color:"#fff",fontSize:13,fontWeight:700,fontFamily:"DM Sans,sans-serif",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,minHeight:50}}>
                  <Icon name="phone" size={15} color="#fff"/> Notify Caregiver
                </button>
              )}
              {flare.level!=="severe"&&(
                <button onClick={()=>setShowModal(false)} style={{padding:"12px",borderRadius:100,background:"none",border:`1.5px solid ${C.border}`,color:C.mid,fontSize:12,fontWeight:600,fontFamily:"DM Sans,sans-serif",cursor:"pointer"}}>
                  Dismiss — I'll monitor myself
                </button>
              )}
              {flare.level==="severe"&&(
                <p style={{textAlign:"center",fontSize:11,color:C.red,fontFamily:"DM Sans,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:5,opacity:.7}}>
                  <Icon name="warn" size={11} color={C.red}/> This alert cannot be dismissed for your safety
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{padding:"20px 22px 12px"}}>
        <h1 style={{fontFamily:"Fraunces,serif",fontSize:30,fontWeight:900,color:C.black,margin:"0 0 3px",lineHeight:1.05}}>Daily Log</h1>
        <p style={{margin:0,fontSize:12,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} · <span style={{color:C.gold,fontWeight:600}}>+15 XP</span> on submit</p>
      </div>
      <div style={{padding:"0 20px"}}>
        {/* Live flare score */}
        <div style={{background:flare.bg,border:`1.5px solid ${flare.color}33`,borderRadius:20,padding:"14px",marginBottom:12,transition:"all .4s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><Icon name="fire" size={12} color={flare.color}/><p style={{margin:0,fontSize:11,fontWeight:700,color:flare.color,fontFamily:"DM Sans,sans-serif",textTransform:"uppercase",letterSpacing:.8}}>Live Flare Score</p></div><p style={{margin:0,fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Updates as you log</p></div>
            <div style={{textAlign:"right"}}><span style={{fontSize:34,fontWeight:900,fontFamily:"Fraunces,serif",color:flare.color,lineHeight:1}}>{flare.score}</span><span style={{fontSize:12,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>/100</span></div>
          </div>
          <div style={{height:5,background:"rgba(0,0,0,.08)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${flare.score}%`,height:"100%",borderRadius:3,transition:"width .5s ease",background:flare.level==="severe"?`linear-gradient(90deg,${C.amber},${C.red})`:flare.level==="moderate"?C.amber:C.teal}}/></div>
          {flare.who&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:flare.color,animation:"ping 1.2s infinite"}}/><span style={{fontSize:10,fontWeight:600,color:flare.color,fontFamily:"DM Sans,sans-serif"}}>{flare.level==="severe"?"Will alert clinician + caregiver — cannot dismiss":"Will notify caregiver on submit"}</span></div>}
        </div>

        {fields.map(f=>(
          <div key={f.key} style={{background:C.bg2,borderRadius:16,padding:"13px",marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
              <div style={{display:"flex",gap:7,alignItems:"center",color:C.mid}}>{f.icon}<span style={{fontSize:12,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>{f.label}</span></div>
              <div style={{background:"#fff",borderRadius:20,padding:"3px 9px",border:`1.5px solid ${f.color}33`}}><span style={{fontSize:16,fontWeight:900,color:f.color,fontFamily:"Fraunces,serif"}}>{vals[f.key]}</span><span style={{fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}> {f.unit}</span></div>
            </div>
            <input type="range" min={0} max={f.max} value={vals[f.key]} onChange={e=>setVals(v=>({...v,[f.key]:+e.target.value}))} style={{width:"100%",accentColor:f.color}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.light,marginTop:2,fontFamily:"DM Sans,sans-serif"}}><span>0</span><span>{f.max}</span></div>
          </div>
        ))}

        <div style={{background:C.bg2,borderRadius:16,padding:"13px",marginBottom:12}}>
          <p style={{margin:"0 0 7px",fontSize:12,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Notes</p>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any triggers, observations, or changes today…" style={{width:"100%",background:"transparent",border:"none",outline:"none",resize:"none",fontSize:12,color:C.black,fontFamily:"DM Sans,sans-serif",minHeight:56,lineHeight:1.6,boxSizing:"border-box"}}/>
        </div>

        <Btn label={saved?"Logged! +15 XP":"Submit Daily Log"} variant={saved?"teal":"black"} onClick={handleSubmit} icon={saved?<Icon name="check" size={13} color="#fff"/>:null}/>

        {/* Flare monitoring collapsible */}
        <div style={{marginTop:10,background:"#fff",border:`1.5px solid ${flareOpen?flare.color+"55":C.border}`,borderRadius:20,overflow:"hidden",transition:"border-color .3s"}}>
          <button onClick={()=>setFlareOpen(p=>!p)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",padding:"14px 16px",display:"flex",alignItems:"center",gap:11,textAlign:"left"}}>
            <div style={{width:36,height:36,borderRadius:11,background:flareOpen?flare.bg:C.bg2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background .3s"}}><Icon name="fire" size={16} color={flareOpen?flare.color:C.mid}/></div>
            <div style={{flex:1}}><p style={{margin:"0 0 1px",fontSize:13,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Flare Monitoring</p><p style={{margin:0,fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Report active symptoms · trigger care alerts</p></div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.light} strokeWidth="2" strokeLinecap="round" style={{transform:flareOpen?"rotate(180deg)":"none",transition:"transform .3s",flexShrink:0}}><polyline points="6,9 12,15 18,9"/></svg>
          </button>
          {flareOpen&&(
            <div style={{padding:"0 16px 16px",borderTop:`1px solid ${C.border}`}}>
              <p style={{margin:"12px 0 8px",fontSize:11,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Active symptoms</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{flareOpts.map((o,i)=>{const sel=flareSyms.includes(o);return(<button key={i} onClick={()=>setFlareSyms(p=>p.includes(o)?p.filter(s=>s!==o):[...p,o])} style={{padding:"6px 11px",borderRadius:100,border:`1.5px solid ${sel?flare.color:C.border}`,background:sel?flare.bg:"#fff",fontSize:11,fontWeight:sel?600:400,color:sel?flare.color:C.mid,fontFamily:"DM Sans,sans-serif",cursor:"pointer",transition:"all .2s"}}>{o}</button>);})}</div>
              <p style={{margin:"0 0 8px",fontSize:11,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Severity</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:12}}>{sevs.map(s=>{const sel=flareSev===s.id;return(<button key={s.id} onClick={()=>setFlareSev(s.id)} style={{padding:"9px 6px",borderRadius:12,border:`1.5px solid ${sel?s.color:C.border}`,background:sel?s.color+"18":"#fff",cursor:"pointer",textAlign:"center",transition:"all .2s"}}><p style={{margin:"0 0 2px",fontSize:11,fontWeight:700,color:sel?s.color:C.black,fontFamily:"DM Sans,sans-serif"}}>{s.label}</p><p style={{margin:0,fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{s.desc}</p></button>);})}</div>
              <div style={{background:C.bg2,borderRadius:12,padding:"10px 12px",marginBottom:10}}>{[{label:"Mild",who:"No alert sent",color:C.teal},{label:"Moderate",who:"Caregiver via SMS",color:C.amber},{label:"Severe",who:"Clinician + caregiver — mandatory",color:C.red}].map((r,i)=>(<div key={i} style={{display:"flex",gap:7,alignItems:"center",marginBottom:i<2?5:0}}><div style={{width:5,height:5,borderRadius:"50%",background:r.color,flexShrink:0}}/><span style={{fontSize:10,fontWeight:600,color:r.color,fontFamily:"DM Sans,sans-serif",width:56,flexShrink:0}}>{r.label}</span><span style={{fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{r.who}</span></div>))}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>sendAlert(flareSev==="severe"?"clinician":"caregiver")} style={{flex:1,padding:"11px",borderRadius:100,border:"none",background:flare.color,color:"#fff",fontSize:12,fontWeight:600,fontFamily:"DM Sans,sans-serif",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Icon name="phone" size={13} color="#fff"/>Send Alert</button>
                <button onClick={()=>alert("Flare logged!")} style={{flex:1,padding:"11px",borderRadius:100,border:`1.5px solid ${C.border}`,background:"#fff",color:C.black,fontSize:12,fontWeight:600,fontFamily:"DM Sans,sans-serif",cursor:"pointer"}}>Log Only</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   PROGRESS
══════════════════════════════════════════════════════════════════ */
const ProgressScreen=({xp,streak})=>{
  const [lbTab,setLbTab]=useState("all");
  const gaitData=[65,68,72,70,74,71,78,75,80,77,82,80,84,80];
  const spasmData=[7,8,6,7,5,6,4,5,3,4,2,3,2,2];
  const badges=[
    {label:"7-Day Streak",  earned:true, color:C.amber,  icon:<Icon name="fire"   size={17} color={C.amber}/>},
    {label:"Gait Master",   earned:true, color:C.teal,   icon:<Icon name="trend"  size={17} color={C.teal}/>},
    {label:"Med Consistent",earned:true, color:C.purple, icon:<Icon name="pill"   size={17} color={C.purple}/>},
    {label:"Top Reporter",  earned:false,color:C.gold,   icon:<Icon name="trophy" size={17} color={C.gold}/>},
    {label:"Flare Fighter", earned:false,color:C.red,    icon:<Icon name="fire"   size={17} color={C.red}/>},
    {label:"Level 5",       earned:false,color:C.mid,    icon:<Icon name="star"   size={17} color={C.mid}/>},
  ];
  const lb={
    all:[{rank:1,name:"Jordan M.",xp:1840,streak:21,you:false},{rank:2,name:"Sam T.",xp:1620,streak:14,you:false},{rank:3,name:"Alex (You)",xp:1190,streak:6,you:true},{rank:4,name:"Riley K.",xp:980,streak:9,you:false},{rank:5,name:"Casey P.",xp:740,streak:3,you:false}],
    hsp:[{rank:1,name:"Alex (You)",xp:1190,streak:6,you:true},{rank:2,name:"Morgan B.",xp:1050,streak:11,you:false},{rank:3,name:"Jamie L.",xp:880,streak:8,you:false},{rank:4,name:"Drew A.",xp:620,streak:4,you:false}],
  };
  const triggers=[
    {label:"Poor sleep (<6h)",     impact:"+62% spasm frequency",sev:"bad", icon:<Icon name="moon"  size={13} color="currentColor"/>},
    {label:"Cold weather (<55°F)", impact:"+38% stiffness",       sev:"warn",icon:<Icon name="snow"  size={13} color="currentColor"/>},
    {label:"Consistent medication",impact:"–41% spasm events",    sev:"good",icon:<Icon name="pill"  size={13} color="currentColor"/>},
    {label:"High-activity day",    impact:"–29% next-day gait",   sev:"warn",icon:<Icon name="bolt"  size={13} color="currentColor"/>},
  ];
  const sc={good:C.teal,warn:C.amber,bad:C.red},sb={good:C.tealLight,warn:C.amberLight,bad:C.redLight};
  const medals=["🥇","🥈","🥉"];
  return(
    <div style={{padding:"0 0 100px"}}>
      <div style={{padding:"20px 22px 12px"}}><h1 style={{fontFamily:"Fraunces,serif",fontSize:30,fontWeight:900,color:C.black,margin:"0 0 3px",lineHeight:1.05}}>Progress</h1><p style={{margin:0,fontSize:12,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>6 weeks · 38 sessions · {xp} XP earned</p></div>
      <div style={{padding:"0 20px"}}>
        <div style={{background:C.black,borderRadius:22,padding:"18px",marginBottom:10,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-16,top:-16,width:90,height:90,borderRadius:"50%",background:"rgba(29,163,154,.12)"}}/>
          <p style={{margin:"0 0 3px",fontSize:10,color:"rgba(255,255,255,.4)",letterSpacing:2,textTransform:"uppercase",fontFamily:"DM Sans,sans-serif"}}>OVERALL GAIT SCORE</p>
          <div style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:12}}><span style={{fontSize:52,fontWeight:900,fontFamily:"Fraunces,serif",color:"#fff",lineHeight:1}}>80</span><span style={{fontSize:14,color:"rgba(255,255,255,.3)",fontFamily:"DM Sans,sans-serif"}}>/100</span><span style={{marginLeft:4,fontSize:11,fontWeight:600,color:C.teal,fontFamily:"DM Sans,sans-serif"}}>↑ +23% this month</span></div>
          <Spark data={gaitData} color={C.teal} h={42}/>
        </div>
        <div style={{background:C.bg2,borderRadius:18,padding:"13px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><div><p style={{margin:"0 0 1px",fontSize:12,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Spasm Events / Day</p><p style={{margin:0,fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>14-day rolling window</p></div><div style={{background:C.redLight,borderRadius:20,padding:"3px 10px",alignSelf:"flex-start"}}><span style={{fontSize:11,fontWeight:700,color:C.red,fontFamily:"DM Sans,sans-serif"}}>↓ –71%</span></div></div>
          <Spark data={spasmData} color={C.amber} h={38}/>
        </div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:20,padding:"16px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><h2 style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700,color:C.black,margin:"0 0 1px"}}>Leaderboard</h2><p style={{margin:0,fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Anonymous · opt-in · this week</p></div>
            <div style={{display:"flex",background:C.bg2,borderRadius:100,padding:2}}>{["all","hsp"].map(t=>(<button key={t} onClick={()=>setLbTab(t)} style={{padding:"4px 11px",borderRadius:100,border:"none",cursor:"pointer",background:lbTab===t?"#fff":"transparent",fontSize:10,fontWeight:lbTab===t?700:400,color:lbTab===t?C.black:C.mid,fontFamily:"DM Sans,sans-serif",boxShadow:lbTab===t?"0 1px 4px rgba(0,0,0,.08)":"none",transition:"all .2s"}}>{t==="all"?"All":"HSP"}</button>))}</div>
          </div>
          {lb[lbTab].map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:12,marginBottom:4,background:p.you?C.tealLight:"transparent",border:`1.5px solid ${p.you?C.teal+"33":"transparent"}`,transition:"all .2s"}}>
              <span style={{fontSize:i<3?15:11,width:20,textAlign:"center",flexShrink:0,color:i>=3?C.mid:"inherit"}}>{i<3?medals[i]:`#${p.rank}`}</span>
              <div style={{flex:1}}><p style={{margin:"0 0 1px",fontSize:12,fontWeight:p.you?700:500,color:p.you?C.teal:C.black,fontFamily:"DM Sans,sans-serif"}}>{p.name}</p><div style={{display:"flex",alignItems:"center",gap:3}}><Icon name="fire" size={9} color={C.amber}/><span style={{fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{p.streak}d streak</span></div></div>
              <div style={{textAlign:"right"}}><p style={{margin:0,fontSize:13,fontWeight:700,fontFamily:"Fraunces,serif",color:C.black}}>{p.xp.toLocaleString()}</p><p style={{margin:0,fontSize:9,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>XP</p></div>
            </div>
          ))}
        </div>
        <h2 style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700,color:C.black,margin:"4px 0 4px"}}>Badges</h2>
        <p style={{margin:"0 0 10px",fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>{badges.filter(b=>b.earned).length}/{badges.length} earned</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:12}}>{badges.map((b,i)=>(<div key={i} style={{background:b.earned?b.color+"16":C.bg2,border:`1.5px solid ${b.earned?b.color+"44":C.border}`,borderRadius:14,padding:"12px 8px",textAlign:"center",opacity:b.earned?1:.4}}><div style={{display:"flex",justifyContent:"center",marginBottom:5}}>{b.icon}</div><p style={{margin:0,fontSize:10,fontWeight:600,color:b.earned?C.black:C.mid,fontFamily:"DM Sans,sans-serif",lineHeight:1.3}}>{b.label}</p></div>))}</div>
        <h2 style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700,color:C.black,margin:"4px 0 4px"}}>ML Triggers</h2>
        <p style={{margin:"0 0 10px",fontSize:10,color:C.mid,fontFamily:"DM Sans,sans-serif"}}>Personalized from 38 sessions</p>
        {triggers.map((t,i)=>(<div key={i} style={{background:sb[t.sev],borderRadius:14,padding:"11px 13px",marginBottom:8,display:"flex",gap:10,alignItems:"center"}}><div style={{width:34,height:34,borderRadius:11,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:sc[t.sev],flexShrink:0}}>{t.icon}</div><div style={{flex:1}}><p style={{margin:"0 0 1px",fontSize:12,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>{t.label}</p><p style={{margin:0,fontSize:11,color:sc[t.sev],fontWeight:500,fontFamily:"DM Sans,sans-serif"}}>{t.impact}</p></div></div>))}
        <div style={{background:C.bg2,borderRadius:18,padding:"14px",marginTop:4}}>
          <p style={{margin:"0 0 3px",fontSize:13,fontWeight:600,color:C.black,fontFamily:"DM Sans,sans-serif"}}>Share with your clinician</p>
          <p style={{margin:"0 0 11px",fontSize:11,color:C.mid,lineHeight:1.65,fontFamily:"DM Sans,sans-serif"}}>6-week PDF — gait trends, flare events, trigger analysis, session notes.</p>
          <Btn label="Generate Report" icon={<Icon name="log" size={14} color="#fff"/>} variant="black" onClick={()=>alert("Generating PDF…")}/>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SHELL
══════════════════════════════════════════════════════════════════ */
export default function App(){
  const [tab,setTab]=useState("home");
  const [mounted,setMounted]=useState(false);
  const [xp,setXP]=useState(990);
  const [streak]=useState(6);
  const [xpPop,setXpPop]=useState({show:false,val:0});
  useEffect(()=>{setTimeout(()=>setMounted(true),100);},[]);
  const addXP=(amt)=>{setXP(p=>p+amt);setXpPop({show:true,val:amt});setTimeout(()=>setXpPop({show:false,val:0}),1600);};
  return(
    <div style={{width:"100%",height:"100dvh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"DM Sans,sans-serif",position:"relative",overflow:"hidden",opacity:mounted?1:0,transition:"opacity .3s"}}>
      <GlobalStyles/>
      {xpPop.show&&<div style={{position:"fixed",top:"12%",left:"50%",transform:"translateX(-50%)",zIndex:9999,background:C.gold,color:"#fff",fontFamily:"Fraunces,serif",fontWeight:900,fontSize:20,padding:"9px 22px",borderRadius:100,animation:"bounce-in .4s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 8px 32px rgba(200,154,46,.45)",display:"flex",alignItems:"center",gap:6,pointerEvents:"none"}}><Icon name="star" size={16} color="#fff"/> +{xpPop.val} XP</div>}
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",height:0}}>
        {tab==="home"    &&<HomeScreen setTab={setTab} xp={xp} streak={streak}/>}
        {tab==="game"    &&<GameScreen addXP={addXP}/>}
        {tab==="log"     &&<LogScreen  addXP={addXP}/>}
        {tab==="progress"&&<ProgressScreen xp={xp} streak={streak}/>}
      </div>
      <div style={{display:"flex",background:C.bg,borderTop:`1px solid ${C.border}`,padding:"9px 0 calc(env(safe-area-inset-bottom, 0px) + 12px)",flexShrink:0,position:"sticky",bottom:0,zIndex:100}}>
        {[
          {id:"home",    label:"Home",      icon:(a)=><Icon name="home"  size={21} color={a?C.black:C.light}/>},
          {id:"game",    label:"Challenges", icon:(a)=><Icon name="game"  size={21} color={a?C.teal:C.light}/>},
          {id:"log",     label:"Log",        icon:(a)=><Icon name="log"   size={21} color={a?C.black:C.light}/>},
          {id:"progress",label:"Progress",   icon:(a)=><Icon name="chart" size={21} color={a?C.black:C.light}/>},
        ].map(t=>{const a=tab===t.id;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"3px 0"}}>
            {t.icon(a)}
            <span style={{fontSize:10,color:a?(t.id==="game"?C.teal:C.black):C.light,fontWeight:a?700:400,fontFamily:"DM Sans,sans-serif"}}>{t.label}</span>
          </button>
        );})}
      </div>
    </div>
  );
}
