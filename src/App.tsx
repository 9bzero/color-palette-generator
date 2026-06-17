import{useState,useCallback}from'react'
  function hslToHex(h:number,s:number,l:number){const a=s*(Math.min(l,100-l))/100;const f=(n:number)=>{const k=(n+h/30)%12;const c=a-Math.min(k-3,9-k,1)*a;return Math.round(255*(l/100+c)).toString(16).padStart(2,"0")};return"#"+f(0)+f(8)+f(4)}
  const schemes=["Analogous","Complementary","Triadic","Tetradic","Monochromatic"] as const
  type Scheme=typeof schemes[number]
  function generate(baseH:number,baseS:number,baseL:number,scheme:Scheme):string[]{
    const h=(n:number)=>hslToHex((baseH+n+360)%360,baseS,baseL)
    if(scheme==="Analogous")return[h(-30),h(-15),h(0),h(15),h(30)]
    if(scheme==="Complementary")return[h(0),h(30),h(60),h(180),h(210)]
    if(scheme==="Triadic")return[h(0),h(20),h(120),h(140),h(240)]
    if(scheme==="Tetradic")return[h(0),h(15),h(90),h(180),h(270)]
    return[hslToHex(baseH,baseS,Math.max(15,baseL-30)),hslToHex(baseH,baseS,Math.max(20,baseL-15)),h(0),hslToHex(baseH,baseS,Math.min(90,baseL+15)),hslToHex(baseH,baseS,Math.min(95,baseL+30))]
  }
  function hexToRgb(hex:string){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return r+","+g+","+b}
  function hexToHsl(hex:string){const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;if(mx===mn)return"hsl(0,0%,"+Math.round(l*100)+"%)";const d=mx-mn,s=l>0.5?d/(2-mx-mn):d/(mx+mn);let h=0;if(mx===r)h=(g-b)/d+(g<b?6:0);else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;return"hsl("+Math.round(h*60)+","+Math.round(s*100)+"%,"+Math.round(l*100)+"%)"}
  export default function App(){
    const[baseColor,setBaseColor]=useState("#0ea5e9")
    const[scheme,setScheme]=useState<Scheme>("Analogous")
    const[cp,setCp]=useState("")
    const baseH=parseInt(baseColor.slice(1),16)%360
    const palette=useCallback(()=>{
      const r=parseInt(baseColor.slice(1,3),16)/255,g=parseInt(baseColor.slice(3,5),16)/255,b=parseInt(baseColor.slice(5,7),16)/255
      const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2
      const d=mx-mn,s=mx===mn?0:l>0.5?d/(2-mx-mn):d/(mx+mn)
      let h=0;if(mx===r)h=(g-b)/d+(g<b?6:0);else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60
      return generate(h,Math.round(s*100),Math.round(l*100),scheme)
    },[baseColor,scheme])
    const colors=palette()
    const copy=(hex:string)=>{navigator.clipboard.writeText(hex);setCp(hex);setTimeout(()=>setCp(""),2000)}
    const cssVars=colors.map((c,i)=>"  --color-"+(i+1)+": "+c+";").join("\n")
    return(
      <div style={{minHeight:"100vh",fontFamily:"Inter,system-ui,sans-serif",color:"#e2e8f0",padding:"2rem"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <h1 style={{fontWeight:800,fontSize:"1.75rem",marginBottom:"0.5rem",color:"#f8fafc"}}>🎨 Color Palette</h1>
          <div style={{display:"flex",gap:"1rem",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
              <span style={{color:"#94a3b8",fontSize:"0.85rem"}}>Base color:</span>
              <input type="color" value={baseColor} onChange={e=>setBaseColor(e.target.value)} style={{width:44,height:44,border:"none",background:"none",cursor:"pointer"}}/>
              <span style={{color:"#38bdf8",fontFamily:"monospace",fontSize:"0.9rem"}}>{baseColor.toUpperCase()}</span>
            </div>
            <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
              {schemes.map(s=><button key={s} onClick={()=>setScheme(s)} style={{padding:"0.3rem 0.75rem",background:scheme===s?"#6366f1":"#1e293b",color:scheme===s?"#fff":"#94a3b8",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600,fontSize:"0.78rem"}}>{s}</button>)}
            </div>
          </div>
          <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.5rem"}}>
            {colors.map(c=><div key={c} style={{height:120,flex:1,background:c,borderRadius:10,cursor:"pointer",position:"relative",overflow:"hidden",border:"2px solid "+(cp===c?"#fff":"transparent"),transition:"border-color 0.2s"}} onClick={()=>copy(c)}><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0.4rem",background:"rgba(0,0,0,0.4)",fontSize:"0.65rem",fontFamily:"monospace",textAlign:"center",opacity:0,transition:"opacity 0.2s"}} className="label">{c.toUpperCase()}</div></div>)}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",marginBottom:"1.5rem"}}>
            {colors.map(c=>(
              <div key={c} style={{display:"flex",alignItems:"center",gap:"0.75rem",background:"#111827",border:"1px solid #1e293b",borderRadius:8,padding:"0.6rem 1rem"}}>
                <div style={{width:36,height:36,borderRadius:6,background:c,flexShrink:0,border:"1px solid rgba(255,255,255,0.15)"}}/>
                <div style={{flex:1,display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
                  <span style={{fontFamily:"monospace",fontWeight:700,color:"#f1f5f9",fontSize:"0.88rem"}}>{c.toUpperCase()}</span>
                  <span style={{color:"#475569",fontSize:"0.8rem"}}>rgb({hexToRgb(c)})</span>
                  <span style={{color:"#475569",fontSize:"0.8rem"}}>{hexToHsl(c)}</span>
                </div>
                <button onClick={()=>copy(c)} style={{padding:"0.25rem 0.6rem",background:cp===c?"#166534":"#1e293b",color:cp===c?"#86efac":"#94a3b8",border:"1px solid #334155",borderRadius:4,cursor:"pointer",fontSize:"0.75rem",flexShrink:0}}>{cp===c?"✓":"Copy"}</button>
              </div>
            ))}
          </div>
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:8,padding:"1rem"}}>
            <div style={{color:"#94a3b8",fontSize:"0.75rem",marginBottom:"0.5rem"}}>CSS VARIABLES</div>
            <pre style={{margin:0,fontSize:"0.8rem",fontFamily:"JetBrains Mono,monospace",color:"#86efac"}}>:root {"{"}
  {cssVars}
  {"}"}</pre>
          </div>
        </div>
      </div>
    )
  }