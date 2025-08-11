import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import WebFont from 'webfontloader';


WebFont.load({
  google: {
    families: ['Source Sans 3:200,300,400,600,700,900'],
  },
});


const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          "500": { value: "tomato" },
        },
      },
      fonts: {
        heading: "Arial, system-ui, sans-serif" ,
        body:  "Arial, system-ui, sans-serif" ,
      },
    },
  },
})


export const system = createSystem(defaultConfig, config)