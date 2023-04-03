import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'

let gui

const useGUI = () => {
  if (!gui) {
    gui = new Pane({ title: 'GUI', container: document.body, expanded: false })
    gui.registerPlugin(EssentialsPlugin)

    if (process.env.NODE_ENV !== 'development') {
      gui.disabled = true
      gui.hidden = true
    }
  }

  return gui
}

export default useGUI
