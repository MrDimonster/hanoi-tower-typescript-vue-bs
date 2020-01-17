<template>
  <div id="app">
    <div><h1>Tower of hanoi solver. Press 'Run'</h1></div>
     <div>
       <label for="disksCount">Disks count:</label>
       <select id="disksCount" v-model="disksCount">
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>&nbsp;
       <button :disabled="isStarted" v-on:click="emulate">Run</button>&nbsp;<span>Moves: {{solver.movesCount}}</span>
     </div>
     <div>
        <div class="main">
          <div :style="{width: 150/solver.disksCount*number +'px'}" class="block" v-for="(number, index) in solver.stack1" v-bind:key="index"></div>
        </div>
        <div class="main">
          <div :style="{width: 150/solver.disksCount*number +'px'}" class="block" v-for="(number, index) in solver.stack2" v-bind:key="index"></div>
        </div>
        <div class="main">
          <div :style="{width: 150/solver.disksCount*number +'px'}" class="block" v-for="(number, index) in solver.stack3" v-bind:key="index"></div>
        </div>
     </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Solver } from './classes/solver';
//warning!!! without this not work App. TODO: why?
@Component({
  components: {
  },
})
export default class App extends Vue {
  public solver: Solver;
  public disksCount = 3;
  public isStarted: boolean = false;
  constructor(){
    super();
    this.solver = new Solver();
  }
  public emulate(): void{
    this.solver.init(this.disksCount, 500);
    this.isStarted = true;
    this.solver.run().then(() => {
      this.isStarted = false;
    });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.main{
  width:150px; height:160px; display: table-cell; vertical-align:bottom; background-color:red;
}
.block{
  height:25px;background-color:green;border:1px solid gray;
  margin: auto;
}
</style>
