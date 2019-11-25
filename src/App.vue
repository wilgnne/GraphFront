<template>
  <div id="app">

    <b-card title="Card Title" no-body>
      <b-card-header header-tag="nav">
        <b-row>
          <b-col>

            <b-nav card-header pills align="center">
              <b-input-group prepend="Busca">
                <template v-slot:append>
                  <b-dropdown :text="busca" variant="outline-success">
                    <b-dropdown-item v-for="item in ['BFS', 'DFS']" v-bind:key="item" v-on:click="BustaAtt(item)">{{item}}</b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-input-group>
            </b-nav>

          </b-col>
          <b-col>

            <b-nav card-header pills align="center">
              <b-input-group prepend="Vertex">
                <b-form-input v-model="vertex" placeholder="Enter vertex value"></b-form-input>
                <b-input-group-append>
                  <b-button v-on:click="AddVertex()" variant="outline-success">Add</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-nav>

          </b-col>
          <b-col>

            <b-nav card-header pills align="center">
              <b-input-group prepend="Edge">
                <b-input-group-prepend>
                  <b-dropdown :text="from" variant="outline-success">
                    <b-dropdown-item v-for="vertex in listVertices" v-bind:key="vertex" v-on:click="FromAtt(vertex)">{{vertex}}</b-dropdown-item>
                  </b-dropdown>
                </b-input-group-prepend>
                <b-form-input v-model="edge" placeholder="Enter edge value"></b-form-input>
                <b-input-group-append>
                  <b-dropdown :text="to" variant="outline-success">
                    <b-dropdown-item v-for="vertex in listVertices" v-bind:key="vertex" v-on:click="ToAtt(vertex)">{{vertex}}</b-dropdown-item>
                  </b-dropdown>
                  <b-button variant="outline-success" v-on:click="AddEdge()">Add</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-nav>

          </b-col>
          <b-col>

            <b-nav card-header pills align="center">
              <b-input-group prepend="Arvores">
                <template v-slot:append>
                  <b-dropdown :text="arvore" variant="outline-success">
                    <b-dropdown-item v-for="item in ['Kruskal', 'Prim', 'BellmanFord', 'Dijkstra']" v-bind:key="item" v-on:click="ArvoreAtt(item)">{{item}}</b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-input-group>
            </b-nav>

          </b-col>
        </b-row>

      </b-card-header>

      <b-card-body class="text-center">
        <div class="d-flex justify-content-center" id="p5Canvas"></div>
        <span style="white-space: pre-wrap;">{{ message }}</span>
      </b-card-body>

    </b-card>

  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    //HelloWorld
  },
  data() {
    var radar = require('./Radar.js')
    return {
      busca: "BFS",
      arvore: "Kruskal",
      from: "From",
      to: "To",
      message: "",
      vertex: "",
      edge: "",
      radar,
      listVertices:[]
    }
  },
  methods: {
    callbackOnP5: function(message) {
      this.message = message;
    },
    OnClickVertex: function(graph)
    {
      /* eslint-disable no-console */
      console.log(graph);
      /* eslint-enable no-console */
      axios.post("https://localhost:5001/api/graph/"+this.busca, graph)
      .then((response) => {
         this.radar.MargeGraph(response.data);
      })

      axios.post("https://localhost:5001/api/graph/"+this.arvore, graph)
      .then((response) => {
        /* eslint-disable no-console */
      console.log(response.data);
      /* eslint-enable no-console */
         this.radar.DestacUpdaye(response.data);
      })
    },
    AddVertex: function()
    {
      this.radar.AddVertex(this.vertex);
      this.UpdateVertices();
      this.vertex = "";
    },
    AddEdge: function()
    {
      this.radar.AddEdge(this.from, this.to, this.edge);
      this.from = "From";
      this.to = "To";
      this.edge = "";
    },
    UpdateVertices: function()
    {
      this.listVertices = this.radar.Vertices();
    },
    BustaAtt: function(newBusca)
    {
      this.busca = newBusca;
    },
    ArvoreAtt: function(newArvore)
    {
      this.arvore = newArvore;
    },
    FromAtt: function(newFrom)
    {
      this.from = newFrom;
    },
    ToAtt: function(newTo)
    {
      this.to = newTo;
    }
  },
  mounted() {   
    const P5 = require('p5')
    new P5(this.radar.main)
    this.radar.setDelegate(this.callbackOnP5);
    this.radar.setOnclickVertex(this.OnClickVertex);

    this.UpdateVertices();
  }
}
</script>

<style>
</style>
