import * as React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import 'mapbox-gl/dist/mapbox-gl.css'
import theme from '../lib/theme'
import { ThemeProvider } from 'theme-ui'
import { withModalTheme } from '@mattjennings/react-modal'
import Map from '../components/map'
import { useState } from 'react'
import mapBG from '../public/map_bg.png'
import dynamic from 'next/dynamic'
const Login = dynamic(() => import('../components/login'))
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const App = ({ Component, pageProps }) => {
  const router =  useRouter()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [enlargedBox, setEnlargedBox] = useState(false)
  const { data, error } = useSWR('/api/opportunities', fetcher)
  function handleSelection(value) {
    setEnlargedBox(true)
    if (selectedItem !== value) {
      setSelectedItem(value)
    } else {
      setSelectedItem(null)
    }
  }
  return (
    <ThemeProvider theme={withModalTheme(theme)}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#2196f3" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#2196f3" />
        <title>Comiteer</title>
      </Head>
      <Login />
      <div style={{ position: 'relative' }}>
        <div style={{ zIndex: '100', position: 'relative' }}>
          <Component
            {...pageProps}
            enlargedBox={enlargedBox}
            selectedItem={selectedItem}
            selectedCategories={selectedCategories}
            setEnlargedBox={setEnlargedBox}
            setSelectedItem={handleSelection}
            setSelectedCategories={setSelectedCategories}
            data={data}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <Map
          setSelectedItem={handleSelection}
          selectedItem={selectedItem}
          selectedCategories={selectedCategories}
          data={data}
          searchQuery={searchQuery}
        />
      </div>
      <div
        style={{
          zIndex: '-1',
          position: 'relative',
          height: '100vh',
          width: '100vw',
          position: 'absolute',
          top: 0,
        }}
      >
        <Image
          src={mapBG}
          alt="Map Background"
          priority={true}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    </ThemeProvider>
  )
}

export default App
