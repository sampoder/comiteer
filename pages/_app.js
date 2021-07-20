import * as React from 'react'
import Head from 'next/head'
import 'mapbox-gl/dist/mapbox-gl.css';
import Meta from '../components/meta'
import ColorSwitcher from '../components/color-switcher'
import theme from '../lib/theme'
import { ThemeProvider } from 'theme-ui'
import Script from 'next/script'
import { withModalTheme } from '@mattjennings/react-modal'

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={withModalTheme(theme)}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App


