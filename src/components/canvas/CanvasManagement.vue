<template>
  <v-container fluid v-if="design">
    <v-row>
      <v-col cols="1"> </v-col>
      <v-col class="slider" cols="11">
        <v-slider
          v-model="resizeW"
          @end="updatewidth()"
          :thumb-size="24"
          thumb-label
          prepend-icon="mdi-arrow-left-right"
          hint="largeur"
          max="1000"
          min="200"
          step="50"
          hide-details
          light
        >
        </v-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="slider" cols="1">
        <v-slider
          v-model="resizeH"
          @end="updatewidth()"
          :thumb-size="24"
          vertical
          ligth
          prepend-icon="mdi-arrow-up-down"
          max="-200"
          min="-800"
          step="200"
          hide-details
        >
          <template v-slot:thumb-label="{ value }">
            {{ Math.abs(value) }}
          </template>
        </v-slider>
      </v-col>
      <v-col cols="11"><canvas class="canvas" ref="can"></canvas> </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <canvas class="canvas" ref="can"></canvas>
  </v-container>
</template>

<script>
import { fabric } from 'fabric'
import { fb } from '@/plugins/firebaseInit'

import jsPDF from 'jspdf'
import mixFunctions from '@/components/commun/Functions'
export default {
  name: 'canvasPlan',
  props: ['resa', 'design'],
  mixins: [mixFunctions],
  data () {
    return {
      size: {
        height: 100,
        width: 200
      },
      numReference: null,
      resizeW: 500,
      resizeH: 200,
      margin_height: 20,
      margin_width: 50,
      grid: 5,
      standWidth: 50,
      standHeight: 50,
      colorLineGrid: '#858180',
      colorBackGroundPlan: '#cee2f0',
      borderColor: '#80CBC4',
      colorObject: '#B0BEC5',
      objectOnPlan: false,
      textSize: 11,
      polygonDrawing: false,
      polygonPoints: [],
      lines: []
    }
  },
  watch: {
    resizeH: function () {
      this.refreshCanvas()
    },
    resizeW: function () {
      this.refreshCanvas()
    }
  },
  destroy () {
    this.$destroy()
    this.canvas.dispose()
  },

  mounted () {
    let self = this
    if (this.$store.getters['plan/getCurrentPlan']) {
      this.$store.dispatch('startWaiting')
      this.canvas = new fabric.Canvas(this.$refs.can, {
        selection: true,
        selectionBorderColor: '#00695C',
        enableRetinaScaling: true,
        containerClass: 'container_class',
        selectionKey: 'always',
        backgroundColor: this.colorBackGroundPlan
      })
      this.size = this.$store.getters['plan/getSizePlan']
      this.resizeH = -Math.abs(this.size.height)
      this.resizeW = this.size.width
      this.updatewidth()
    }
    //
    fabric.util.addListener(window, 'dblclick', function () {
      if (self.polygonDrawing) {
        self.finalize()
      }
    })
    fabric.util.addListener(window, 'keyup', function (evt) {
      if (evt.which === 13 && self.polygonDrawing) {
        self.finalize()
      }
    })

    this.canvas.on('selection:created', (evt) => {
      console.log('selection:created')
      if (evt.target !== null) {
        evt.target.set({
          borderColor: self.borderColor,
          cornerColor: self.borderColor
        })
      }
    })

    this.canvas.on('mouse:down', function (evt) {
      if (self.polygonDrawing) {
        var _mouse = this.getPointer(evt.e)
        var _x = _mouse.x
        var _y = _mouse.y
        var line = new fabric.Line([_x, _y, _x, _y], {
          strokeWidth: 1,
          selectable: false,
          stroke: 'red'
        })

        self.polygonPoints.push(new fabric.Point(_x, _y))
        self.lines.push(line)

        this.add(line)
        this.selection = false
      } else {
        if (evt.target !== null) {
          evt.target.set({
            borderColor: self.borderColor,
            cornerColor: self.borderColor
          })
        }
      }
    })

    this.canvas.on('mouse:move', function (evt) {
      if (self.lines.length && self.polygonDrawing) {
        var _mouse = this.getPointer(evt.e)
        self.lines[self.lines.length - 1]
          .set({
            x2: _mouse.x,
            y2: _mouse.y
          })
          .setCoords()
        this.renderAll()
      }
    })
    //
  },
  methods: {
    refreshCanvas: function () {
      this.canvas.setWidth(this.resizeW)
      this.canvas.setHeight(Math.abs(this.resizeH))
      this.canvas.calcOffset()
      this.canvas.renderAll()
    },
    updatewidth: function () {
      this.initPlanPlan()
      // mémorisation de la taille du canvas
      this.updateSizePlan()
    },
    updateSizePlan: function () {
      let size = {
        height: Math.abs(this.resizeH),
        width: this.resizeW
      }
      this.$store.commit('plan/setSizePlan', size)
    },
    convertHexRgdb: function (hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
        : null
    },

    initPlanPlan: function () {
      // on démarre le sablier
      this.$store.dispatch('startWaiting')
      let self = this

      // charge le fond
      this.afficherFondPlan().then(() => {
        // une fois chargé complétement, on charge les stands
        self
          .chargerStand()
          .then((data) => {
            // on affiche les stands chargés
            self.afficherStand()
            // dessiner les resa
            // self.chargerResa();
            // console.log("charger resa");
            // on affcihe la grille
            self.afficherGrid()
            // on fait le render
            self.canvas.renderAll()
            // on active l'aimant sur la grille pur les emplacements
            self.canvas.on('object:moving', function grid (options) {
              if (options.target.get('type') === 'emplacement') {
                options.target.set({
                  left: Math.round(options.target.left / self.grid) * self.grid,
                  top: Math.round(options.target.top / self.grid) * self.grid
                })
              }
            })
            // on arret le sablier
            this.$store.dispatch('stopWaiting')
          })
          .catch((err) => {
            self.$store.dispatch('displayMessage', {
              code: 'LOAS',
              param: err.message
            })
            this.$store.dispatch('stopWaiting')
          })
      }).catch((err) => {
            self.$store.dispatch('displayMessage', {
              code: 'LOAS',
              param: err.message
            })
            this.$store.dispatch('stopWaiting')})
    },

    chargerStand: function () {
      var self = this
      console.log('chargerstand')
      // chargement uniquement si un plan est chargé
      return new Promise((resolve, reject) => {
        if (self.$store.getters['plan/getCurrentPlanId']) {
          fb.planCollection
            .doc(self.$store.getters['plan/getCurrentPlanId'])
            .collection('stand')
            .get()
            .then(function (querySnapshot) {
              if (querySnapshot.empty) {
                self.$store.dispatch('stopWaiting')
                self.$store.dispatch('displayMessage', 'LOAS')
              } else {
                // utilisé pour chercher des resa , on ne le fait que s'il y a des emplacements
                self.objectOnPlan = true
                self.listEmplacement = querySnapshot
                resolve(true)
              }
            })
            .catch((err) => {
              self.$store.dispatch('stopWaiting')
              reject(err)
            })
        }
      })
    },

    afficherStand () {
      let self = this
      this.listEmplacement.forEach(function (stand) {
        // doc.data() is never undefined for query doc snapshots
        // display stand ith stand data
        var defaultstand = stand.data()
        defaultstand.id = stand.id
        self.dessinerEmplacement(defaultstand)
      })
    },

    chargerResa: function () {
      if (this.resa) {
        let self = this
        let societe = ''
        // on charge les résa en se basant sur les commandes ni refusée(4) ni annulée(5)
        if (this.$store.getters['plan/getCurrentPlanId'] && this.objectOnPlan) {
          fb.cmdCollection
            .where('status', 'in', [1, 2, 3, 5])
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (cmdPlan) {
                let currentCommande = cmdPlan.data()
                currentCommande.cmd.forEach((cmd) => {
                  if (cmd.plan.id === self.$store.getters.getCurrentPlanId) {
                    cmd.stand.forEach((stand) => {
                      let currentStand = self.getStandById(stand.standid)
                      self.dessinerResa(currentStand, societe)
                    })
                  }
                })
              })
            })
            .catch((err) => {
              self.$store.dispatch('stopWaiting')
              self.$store.dispatch('displayMessage', {
                code: 'REKO',
                param: err.message
              })
            })
        }
      }
    },
    getResa: function () {
      let currentObject = this.canvas.getActiveObject()
      if (currentObject.get('opacity') == 0.6) return true
      else return false
    },
    getImagePlan: function () {
      // on déselectionne tous les objets
      this.canvas.discardActiveObject()
      //
      // on genere une image que l'on sauvegarde dans la commande , sera utilisée pour générer le bon de commande
      var plan = this.canvas.toDataURL({
        format: 'png',
        left: 0,
        top: 0,
        width: 150,
        height: 100
      })
      return plan
    },
    //
    // plan format JSON du plan sans la grid
    getJsonPlan: function () {
      // on déselectionne tous les objets
      this.canvas.discardActiveObject()
      var plan = JSON.stringify(this.canvas)

      return plan
    },

    getSelectedStand () {
      return this.canvas.getActiveObject()
    },

    refraichirCanvas () {
      this.canvas.renderAll()
    },

    getCurrentStand: function (objStand = null) {
      let object = objStand === null ? this.canvas.getActiveObject() : objStand
      if (typeof object !== 'undefined') {
        let currentStand = {
          type: 'stand',
          reference: object.reference,
          id: object.id,
          couleur: object.couleur,
          left: object.left,
          top: object.top,
          // height: object.height,
          // width: object.width,
          angle: object.angle,
          modele: object.modele,
          scaleX: object.scaleX,
          scaleY: object.scaleY
        }
        return currentStand
      } else return false
    },
    getStandById: function (id) {
      var objects = this.canvas.getObjects('stand')
      for (let i in objects) {
        if (objects[i].id === id) return objects[i]
      }
      return false
    },
    afficherFondPlan () {
      let self = this
      let plan_fond = this.$store.getters['plan/getPlanPlanJson']

      return new Promise((resolve, reject) => {
        if (typeof plan_fond !== 'undefined' && plan_fond ) {
          self.canvas.loadFromJSON(plan_fond, function () {
            resolve(true)
          })
        } else {
          resolve(true)
        }
      })
    },
    afficherGrid: function () {
      // on positionne une grid pour aider à positionner les objets
      for (var j = 0; j < Math.abs(this.resizeH) / this.grid; j++) {
        this.canvas.add(
          new fabric.Line([0, j * this.grid, this.resizeW, j * this.grid], {
            stroke: this.colorLineGrid,
            selectable: false,
            excludeFromExport: true,
            strokeDashArray: [2, 5],
            objectCaching: true
          })
        )
      }
    },
    // display stand on canvas
    dessinerEmplacement: function (EmplacementObject, refresh = false) {
      //
      // on retire toute sélection
      this.canvas.discardActiveObject()

      // On donne un texte au stand
      let rgb = this.convertHexRgdb(EmplacementObject.couleur)
      let couleurTexte = this.testClairFonce(rgb)
      var text = new fabric.Text(EmplacementObject.reference, {
        fontFamily: 'Arial',
        fontSize: this.textSize,
        originX: 'center',
        originY: 'center',
        fill: couleurTexte,
        scaleX: 1 / EmplacementObject.scaleX,
        scaleY: 1 / EmplacementObject.scaleY,
        left: 0,
        top: 0
      })
      // utilisation des formes prédfiniées
      let forme = new fabric.Path(EmplacementObject.modele, {
        fill: EmplacementObject.couleur,
        originX: 'center',
        originY: 'center',
        top: 0,

        left: 0
      })
      //
      let groupForme = [forme, text]
      // pour faciliter le déplacement des objet stand on groupe le text et le dessin du stand
      var emplacement = new fabric.Group(groupForme, {
        type: 'emplacement',
        reference: EmplacementObject.reference,
        id: EmplacementObject.id,
        couleur: EmplacementObject.couleur,
        left: EmplacementObject.left,
        top: EmplacementObject.top,
        angle: EmplacementObject.angle,
        scaleX: EmplacementObject.scaleX,
        scaleY: EmplacementObject.scaleY,
        excludeFromExport: true,
        modele: EmplacementObject.modele

        // hasRotatingPoint: false
      })
      if (this.resa !== 'false') {
        emplacement.hasControls = false
        emplacement.lockMovementX = emplacement.lockMovementY = true
      }

      // on mais le selectd sur le nouveau stand
      this.canvas.setActiveObject(emplacement)

      //
      // save stand when moved
      var self = this
      // on active la sauveargde du stand quand celui-ci est déplacé
      emplacement.on('modified', function (object) {
        // on récupère la nouvelle taille et on la mémorise
        let currentEmplacement = self.getCurrentStand()
        currentEmplacement.height = object.target.getScaledHeight()
        currentEmplacement.width = object.target.getScaledWidth()
        currentEmplacement.angle = object.target.angle
        currentEmplacement.scaleX = object.target.scaleX
        currentEmplacement.scaleY = object.target.scaleY
        // on veut garder la taille du text intiale
        if (object.target.scaleX < 1) {
          object.target._objects[1].scaleX = 1 + (1 - object.target.scaleX)
        } else object.target._objects[1].scaleX = 1 / object.target.scaleX

        if (object.target.scaleY < 1) {
          object.target._objects[1].scaleY = 1 + (1 - object.target.scaleY)
        } else object.target._objects[1].scaleY = 1 / object.target.scaleY

        object.target._objects[1].set('fontSize', self.textSize)

        self.refreshEmplacement(currentEmplacement)
      })
      emplacement.on('selected', function (options) {
        var currentEmplacement = self.getCurrentStand()

        self.$store.commit('plan/setCurrentEmplacement', currentEmplacement)
      })
      emplacement.on('deselected', function (options) {
        self.$store.commit('plan/setInitCurrentEmplacement')
      })
      // add object stand on canvas
      this.canvas.add(emplacement)
      if (refresh) this.canvas.renderAll()
    },
    //
    // delete eand recreate stand
    refreshEmplacement: function (emplacement) {
      let self = this
      // mettre à jour les données du stand
      var currentEmplacement = this.canvas.getActiveObject()
      // delete stand
      this.canvas.remove(currentEmplacement)

      // recréate stand
      this.dessinerEmplacement(emplacement, false)
      // sauvegarde de l'emplacement
      this.$store
        .dispatch('plan/saveEmplacement', emplacement)
        .then(function (newdata) {
          // refresh canvas
          self.canvas.renderAll()
        })
    },
    //
    // delete eand recreate stand
    updateEmplacement: function (newData) {
      // mettre à jour les données du stand
      var currentEmplacement = this.canvas.getActiveObject()
      // delete stand
      this.canvas.remove(currentEmplacement)

      // recréate stand
      this.dessinerEmplacement(newData)

      // refresh canvas
      this.canvas.renderAll()
    },
    //
    // pemret de dupliquer un ou plusieurs objets
    // soit des emplacements soit des images soit des formes
    duplicateObject () {
      try {
        this.numReference = this.$store.getters['plan/getNumEmplacement']

        if (this.canvas.getActiveObject().type == 'activeSelection') {
          let test = this.canvas.getActiveObject().getObjects()
          test.forEach((obj) => {
            if (obj.type == 'emplacement') {
              this.cloneEmplacement(obj, this.numReference++)
            } else {
              this.cloneObject(obj)
            }
          })
        } else {
          if (this.canvas.getActiveObject().type == 'emplacement') {
            this.cloneEmplacement(
              this.canvas.getActiveObject(),
              this.numReference++
            )
          } else this.cloneObject(this.canvas.getActiveObject())
        }
        this.$store.commit('plan/setNumEmplacement', this.numReference)
        this.canvas.discardActiveObject()
        this.canvas.renderAll()
      } catch (error) {
        this.$store.dispatch('displayMessage', 'DLOJ')
      }
    },

    cloneEmplacement (object, numReference) {
      let self = this
      let newEmplacement = {}
      let transformation = fabric.util.qrDecompose(object.calcTransformMatrix())
      newEmplacement.modele = object.modele
      newEmplacement.reference = 'S-' + numReference
      newEmplacement.couleur = object.couleur
      newEmplacement.left = transformation.translateX + 5
      newEmplacement.top = transformation.translateY + 5

      newEmplacement.scaleX = object.scaleX
      newEmplacement.scaleY = object.scaleY
      newEmplacement.angle = object.angle
      this.$store
        .dispatch('plan/addEmplacement', newEmplacement)
        .then(function (newdata) {
          newEmplacement.id = newdata.id
          newEmplacement.evented = true
          object.clone((cloned) => {
            let clonedObject = Object.assign(cloned, newEmplacement)
            clonedObject._objects[1].text = newEmplacement.reference
            self.canvas.add(clonedObject)
          })
        })
        .catch(function (error) {
          self.$store.dispatch('displayMessage', {
            code: 'ASKO',
            param: error.message
          })
        })
    },
    cloneObject (object) {
      let self = this
      object.clone((cloned) => {
        let transformation = fabric.util.qrDecompose(
          object.calcTransformMatrix()
        )
        let left = object.left < 0 ? transformation.translateX : object.left + 5
        let top = object.left < 0 ? transformation.translateY : object.top + 5
        cloned.set({
          left: left,
          top: top
        })
        self.canvas.add(cloned)
      })
    },
    //
    // add objetc in canvas : objet is a empty grey shape
    ajoutObjet: function () {
      var objet = new fabric.Rect({
        width: 150,
        height: 20,
        fill: this.colorObject,
        centeredRotation: true
      })
      this.canvas.add(objet)
    },
    //
    // delete object One or more with multiple select
    supprimerObject: function () {
      // recuperer la liste ou l'objet à supprimer
      if (this.canvas.getActiveObject().type == 'activeSelection') {
        let allObjects = this.canvas.getActiveObject().getObjects()
        allObjects.forEach((obj) => {
          if (obj.type == 'emplacement') {
            this.supprimerEmplacement(obj)
          } else {
            this.canvas.remove(obj)
          }
        })
      } else {
        var activeObject = this.canvas.getActiveObject()
        if (activeObject.type == 'emplacement') {
          this.supprimerEmplacement(activeObject)
        } else {
          this.canvas.remove(activeObject)
        }
      }
      this.canvas.renderAll()
    },
    //
    // delete object One or more with multiple select
    supprimerEmplacement: function (emplacement) {
      this.$store.commit('plan/setCurrentEmplacement', emplacement)
      this.$store.dispatch('plan/delEmplacement').catch((data) => {
        this.$store.dispatch('displayMessage', 'SAKO')
      })
      this.$store.commit('plan/setInitCurrentEmplacement')
      this.canvas.remove(emplacement)
    },
    //
    // add a text on canvas
    ajoutTexte: function (Ptext = 'nouveau texte') {
      var text = new fabric.IText(Ptext, {
        fontFamily: 'Arial',
        fontSize: 12,
        top: 150,
        left: 150,
        originX: 'center',
        originY: 'center'
      })
      this.canvas.add(text)
      this.canvas.renderAll()
    },
    ajouterFenetre: function () {
      var path = new fabric.Path(
        'M 49.892857,129.3546 50.648809,57.452381 H 153.45833 c 0.0134,59.086099 -43.16199,72.438099 -103.565473,71.902219 z'
      )
      path.set({ left: 50, top: 50 })
      path.set({ stroke: 'green', opacity: 0.2 })
      this.canvas.add(path)
    },
    alignGauche () {
      let self = this
      let groupWidth = this.canvas.getActiveObject().width
      if (this.canvas.getActiveObject().type == 'activeSelection') {
        let test = this.canvas.getActiveObject().getObjects()
        test.forEach((obj) => {
          obj.set({
            left: -(groupWidth / 2),
            originX: 'left'
          })
          obj.setCoords()
        })
      } else console.log('on a un seul object')

      this.canvas.renderAll()
    },
    alignCentre () {
      let self = this
      let groupWidth = this.canvas.getActiveObject().width
      if (this.canvas.getActiveObject().type == 'activeSelection') {
        let test = this.canvas.getActiveObject().getObjects()
        test.forEach((obj) => {
          obj.set({
            left: 0 - obj.width / 2,
            originX: 'left'
          })
          obj.setCoords()
        })
      } else console.log('on a un seul object')

      this.canvas.renderAll()
    },
    alignDroite () {
      let self = this
      let groupWidth = this.canvas.getActiveObject().width
      if (this.canvas.getActiveObject().type == 'activeSelection') {
        let test = this.canvas.getActiveObject().getObjects()
        test.forEach((obj) => {
          obj.set({
            left: groupWidth / 2 - obj.width / 2,
            originX: 'center'
          })
          obj.setCoords()
        })
      } else console.log('on a un seul object')

      this.canvas.renderAll()
    },
    imprimerPlan: function () {
      var imgData = this.canvas.toDataURL({ format: 'png' })

      var pdf = new jsPDF()
      pdf.addImage(imgData, 'JPEG', 0, 0)
      pdf.save('download.pdf')
    },
    sauvegarderStands: function () {
      // récupération des stand
      var objects = this.canvas.getObjects('stand')
      for (let i in objects) {
        this.$store.dispatch('saveStand', this.getCurrentStand(objects[i]))
      }
    },
    supprimerResa: function (idStand) {
      // on supprime le marquage de la résa
      var objects = this.canvas.getObjects('resa')
      for (let i in objects) {
        if (idStand === objects[i].id) {
          this.canvas.remove(objects[i])
        }
      }
    },
    dessinerResa: function (ObjectStand) {
      if (typeof ObjectStand !== 'undefined') {
        ObjectStand.item(0).set('fill', '#CFD8DC')
        ObjectStand.set('opacity', 0.6)
        // refresh canvas
        this.canvas.renderAll()
      }
    },
    ajoutImage (imageUrl) {
      let self = this
      fabric.Image.fromURL(imageUrl, function (oImg) {
        self.canvas.add(oImg)
      })
    },
    finalize () {
      var self = this
      this.polygonDrawing = false
      this.lines.forEach(function (line) {
        self.canvas.remove(line)
      })

      this.canvas.add(this.makePolygon()).renderAll()
      this.canvas.selection = true
      this.lines.length = 0
      this.polygonPoints.length = 0
    },

    //
    makePolygon () {
      var left = fabric.util.array.min(this.polygonPoints, 'x')
      var top = fabric.util.array.min(this.polygonPoints, 'y')

      this.polygonPoints.push(
        new fabric.Point(this.polygonPoints[0].x, this.polygonPoints[0].y)
      )

      return new fabric.Polygon(this.polygonPoints.slice(), {
        left: left,
        top: top,
        fill: this.colorObject,
        stroke: this.colorObject
      })
    },
    activeDraw () {
      if (this.polygonDrawing) {
        this.finalize()
      } else {
        this.polygonDrawing = true
      }
    }
  }
}
</script>

<style>
.canvas {
  position: absolute;
  overflow: auto;
  margin-left: 3%;
  margin-right: 3%;
  margin-bottom: 3%;
  border: solid 1px blue;
}
.container_class {
  max-width: 100%;
}
.slider {
  padding: 0;
}
</style>
