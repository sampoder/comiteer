import * as React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import 'mapbox-gl/dist/mapbox-gl.css'
import Meta from '../components/meta'
import theme from '../lib/theme'
import { ThemeProvider } from 'theme-ui'
import { withModalTheme } from '@mattjennings/react-modal'
import Map from '../components/map'
import { useState } from 'react'
import mapBG from '../public/map_bg.png'
import dynamic from 'next/dynamic'
const Login = dynamic(() => import('../components/login'), { ssr: false })
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
