import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import useSWR, { mutate } from 'swr'

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2FtcG9kZXIiLCJhIjoiY2todDBzdGE1MGhtYjJxcm04d3d1eGNiZyJ9.BFl0606fHUex_oRZ7Y0Sqw'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Map({ setSelectedItem, selectedCategories }) {
  const map = useRef(null)
  const mapContainer = useRef(null)
  const { data, error } = useSWR('/api/opportunities', fetcher)
  const [lng, setLng] = useState(103.8229)
  const [lat, setLat] = useState(1.3485)
  const [zoom, setZoom] = useState(11.08)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11?optimize=true',
      center: [lng, lat],
      zoom: zoom,
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
          'circle-color': '#11b4da',
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
    const data2 = data
    const fullData = data
    let filteredData = data2
    console.log('Data object:')
    console.log(data)
    console.log('Before filtering:')
    console.log(filteredData)
    filteredData.features = filteredData.features.filter(function (el) {
      console.log(el.properties.tags)
      return el.properties.tags.some(r=> selectedCategories.includes(r));
    });
    map.current
      .getSource('opportunities')
      .setData(!filteredData ? `/api/opportunities?tags=${arrStr}` : filteredData)
  }, [selectedCategories])
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
      <style>
        {`
        .mapboxgl-ctrl > a{
          display: none!important; 
        }`}
      </style>
    </div>
  )
}
