import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { usePosition } from 'use-position'
import { Box, Button } from 'theme-ui'
import { colors } from '../lib/theme'
const title = require('title')

const categories = [
  { color: 'blue', label: 'Hands-on', key: 'handsOn' },
  { color: 'purple', label: 'Digital', key: 'digital' },
  {
    color: 'green',
    label: 'Environmental Awareness',
    key: 'environmentalAwareness',
  },
  { color: 'yellow', label: 'Social Services', key: 'socialServices' },
  { color: 'pink', label: 'Re-occurring', key: 'reOccurring' },
  { color: 'red', label: 'Crisis Support', key: 'crisisSupport' },
  { color: 'navy', label: 'Elderly Support', key: 'elderlySupport' },
  { color: 'peach', label: 'COVID-19', key: 'covid19' },
  { color: 'orange', label: 'Teaching', key: 'teaching' },
  { color: 'brown', label: 'Outdoors', key: 'outdoors' },
  { color: 'cyan', label: 'Disability Care', key: 'disabilityCare' },
]

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2FtcG9kZXIiLCJhIjoiY2todDBzdGE1MGhtYjJxcm04d3d1eGNiZyJ9.BFl0606fHUex_oRZ7Y0Sqw'

export default function Map({
  setSelectedItem,
  selectedCategories,
  data,
  searchQuery,
}) {
  const map = useRef(null)
  const mapContainer = useRef(null)
  const [lng, setLng] = useState(103.8229)
  const [lat, setLat] = useState(1.3485)
  const [zoom, setZoom] = useState(11.08)
  const [loaded, setLoaded] = useState(false)
  const { latitude, longitude, speed, timestamp, accuracy, error } =
    usePosition()
  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11?optimize=true',
      center: [longitude ? longitude : lng, latitude ? latitude : lat],
      zoom: longitude ? 14 : zoom,
      minZoom: 10,
      innerHeight: 100,
    })
    map.current.on('load', function () {
      setLoaded(true)
      map.current.addSource('opportunities', {
        type: 'geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'opportunities',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      })

      map.current
        .getSource('opportunities')
        .setData(!data ? '/api/opportunities' : data)
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'opportunities',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
      })

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'opportunities',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'firstTag'],
            ...categories.map(x => [x.key, colors[x.color]]).flat(),
            '#0e90db',
          ],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      })
      map.current.on('click', 'clusters', function (e) {
        var features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        })
        var clusterId = features[0].properties.cluster_id
        map.current
          .getSource('opportunities')
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return

            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            })
          })
      })
      map.current.on('click', 'unclustered-point', function (e) {
        setSelectedItem(e.features[0].properties)
      })

      map.current.on('mouseenter', 'clusters', function () {
        map.current.getCanvas().style.cursor = 'pointer'
      })
      map.current.on('mouseleave', 'clusters', function () {
        map.current.getCanvas().style.cursor = ''
      })
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      })

      map.current.on('mouseenter', 'unclustered-point', function (e) {
        // Change the cursor style as a UI indicator.
        map.current.getCanvas().style.cursor = 'pointer'

        var coordinates = e.features[0].geometry.coordinates.slice()
        var description = title(e.features[0].properties.name)

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup
          .setLngLat(coordinates)
          .setHTML(`<b>${description}</b>`)
          .addTo(map.current)
      })

      map.current.on('mouseleave', 'unclustered-point', function () {
        map.current.getCanvas().style.cursor = ''
        popup.remove()
      })
    })
  })
  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
  })
  useEffect(() => {
    if (!map.current || !loaded) return // wait for map to initialize
    var arrStr = encodeURIComponent(selectedCategories)
    map.current.getSource('opportunities').setData(
      !data
        ? `/api/opportunities?tags=${arrStr}`
        : {
            ...data,
            features: data.features.filter(function (el) {
              return (
                (selectedCategories.length === 0
                  ? true
                  : el.properties.tags.some(r =>
                      selectedCategories.includes(r),
                    )) &&
                (el.properties.name
                  .toUpperCase()
                  .includes(searchQuery.trim().toUpperCase()) ||
                  searchQuery.trim().length === 0)
              )
            }),
          },
    )
    // console.log(data)
  }, [selectedCategories, searchQuery])
  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{
          height: '100vh',
          position: 'absolute',
          width: '100%',
          top: 0,
          zIndex: 0,
          opacity: loaded ? 1 : 0,
        }}
      />
      <Box sx={{ position: 'fixed', bottom: 3, right: 3, zIndex: 3 }}>
        <Button
          onClick={() => {
            map.current.easeTo({
              center: [longitude, latitude],
              zoom: 15,
            })
          }}
          sx={{}}
        >
          📍
        </Button>
      </Box>
      <style>
        {`
        .mapboxgl-ctrl > a{
          display: none!important; 
        }`}
      </style>
    </div>
  )
}
