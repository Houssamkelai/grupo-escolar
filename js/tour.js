export class Tour {
 constructor(viewer,steps,update){this.viewer=viewer;this.steps=steps;this.update=update;this.index=0;this.playing=false;this.timer=null;this.generation=0;}
 stop(){clearTimeout(this.timer);this.generation++;this.playing=false;this.viewer.cancel();}
 async start(){this.stop();this.viewer.setMode('tour');this.playing=true;await this.go(0);}
 async go(i){clearTimeout(this.timer);const token=++this.generation;this.index=Math.max(0,Math.min(this.steps.length-1,i));this.update(this);const s=this.steps[this.index];const arrived=await this.viewer.flyTo(s.position,s.target);if(!arrived||token!==this.generation)return;if(s.orbit){this.playing=false;this.viewer.orbit=true;this.update(this);return;}this.schedule();}
 schedule(){clearTimeout(this.timer);if(this.playing)this.timer=setTimeout(()=>this.go(this.index+1),this.steps[this.index].holdSeconds*1000);}
 toggle(){this.playing=!this.playing;if(this.playing){if(this.index===this.steps.length-1){this.go(0);}else if(!this.viewer.busy)this.schedule();}else clearTimeout(this.timer);this.update(this);}
}
