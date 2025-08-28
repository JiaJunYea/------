/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

import VuetifyUseDialog from 'vuetify-use-dialog'
import router from '@/router'
import pinia from '@/stores'
// Plugins
import vuetify from './vuetify'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(VuetifyUseDialog, {
      snackbar: {
        showCloseButton: false,
        snackbarProps: {
          timeout: 2000,
        },
      },
    })
    .use(router)
    .use(pinia)
}
