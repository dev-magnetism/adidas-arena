import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
// import Viewport from '~/plugins/viewport'

let gui

const useGUI = () => {
  if (!gui) {
    gui = new Pane({ title: 'GUI', container: document.body })
    gui.registerPlugin(EssentialsPlugin)

    // if (Viewport.isMobile) {
    gui.hidden = true
    // } else {
    //   // gui.hidden = true
    // }
  }

  return gui
}

export default useGUI
