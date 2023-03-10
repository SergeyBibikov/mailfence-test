import { defineConfig } from "cypress";

export default defineConfig({

  e2e: {

    baseUrl: "https://mailfence.com",
    pageLoadTimeout: 30000,
    setupNodeEvents(on, config) {

      on('task', {

        //Logging to node console
        log(valToLog: any[]) {
          console.log(
            "\n=====TEST DEBUG INFO======\n",
            ...valToLog,
            "\n==========================\n")

          return null
        }

      })

    },

  },
});
