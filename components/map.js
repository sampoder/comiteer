import React, { useRef, useEffect, useState } from 'react'
import { useColorMode } from 'theme-ui'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2FtcG9kZXIiLCJhIjoiY2todDBzdGE1MGhtYjJxcm04d3d1eGNiZyJ9.BFl0606fHUex_oRZ7Y0Sqw'

export default function Home() {
  const [mode, setMode] = useColorMode()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(103.8229)
  const [lat, setLat] = useState(1.3485)
  const [zoom, setZoom] = useState(11.08)
  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style:
        'mapbox://styles/mapbox/' +
        (mode === 'dark' ? 'light' : 'dark') +
        '-v10?optimize=true',
      center: [lng, lat],
      zoom: zoom,
      innerHeight: 100,
    })
    var marker = new mapboxgl.Marker().setLngLat([103.8229, 1.3485]).setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>")).addTo(map.current)
  })
  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.setStyle(
      'mapbox://styles/mapbox/' +
        (mode === 'dark' ? 'light' : 'dark') +
        '-v10?optimize=true',
    )
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
  })
  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: '100vh' }}
      />
    </div>
  )
}
