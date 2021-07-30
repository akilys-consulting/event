import Vue from 'vue'
import '@morioh/v-quill-editor/dist/editor.css'
import Editor from '@morioh/v-quill-editor'
import L from 'leaflet'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

delete L.Icon.Default.prototype._getIconUrl

Vue.use(Editor)
