import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

let gui

const useGUI = () => {
  if (!gui) {
    gui = new Pane({ title: 'GUI', container: document.body })
    gui.registerPlugin(EssentialsPlugin)
  }

  return gui
}

export default useGUI
