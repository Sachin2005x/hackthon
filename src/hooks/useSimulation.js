import { useEffect,useRef,useState } from 'react';
import { simulationMessages } from '../data/simulationData';
import { api, getRunId } from '../api/client';

export function useSimulation(){
  const [running,setRunning]=useState(true),[speed,setSpeed]=useState(1),[items,setItems]=useState(simulationMessages.slice(0,3)),[cursor,setCursor]=useState(3),[processed,setProcessed]=useState(1284),[typing,setTyping]=useState(false);
  const pool=useRef(simulationMessages);
  useEffect(()=>{let alive=true;(async()=>{const id=await getRunId();if(!id||!alive)return;try{const d=await api('/validations/'+id+'/simulation');if(alive&&d.messages&&d.messages.length){pool.current=d.messages;setItems(d.messages.slice(0,3));setCursor(3)}}catch{}})();return()=>{alive=false}},[]);
  useEffect(()=>{if(!running)return;const delay=3000/speed;const id=setInterval(()=>{setTyping(true);setTimeout(()=>{setItems(x=>[...x.slice(-11),pool.current[cursor%pool.current.length]]);setCursor(x=>x+1);setProcessed(x=>x+1);setTyping(false)},Math.max(300,850/speed))},delay);return()=>clearInterval(id)},[running,speed,cursor]);
  return{running,setRunning,speed,setSpeed,items,processed,typing,restart:()=>{setItems(pool.current.slice(0,3));setCursor(3);setProcessed(1284)}}
}
