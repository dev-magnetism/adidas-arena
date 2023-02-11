import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

class LoaderManager {
  constructor() {
    this.nbModels = null
    this.modelsLoaded = false
    this.progressLoad = { original: 0, normalized: 0, percentage: 0 }

    this.models = {}

    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('/draco/')

    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  async load(files, cbUpdate, cbComplete) {
    console.log('here preloader')

    this.nbModels = files.length

    for (const [i, file] of files.entries()) {
      this.models[file.id] = await this.gltfLoader.loadAsync(file.path)

      const index = i + 1

      this.progressLoad.original = index
      this.progressLoad.normalized = index / this.nbModels
      this.progressLoad.percentage = (100 * index) / this.nbModels

      cbUpdate(this.progressLoad, file.id)
    }

    this.modelsLoaded = true

    cbComplete()
  }

  getModel(id) {
    return this.models[id]
  }

  destroy() {}
}

export default new LoaderManager()
