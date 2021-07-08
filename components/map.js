import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2FtcG9kZXIiLCJhIjoiY2todDBzdGE1MGhtYjJxcm04d3d1eGNiZyJ9.BFl0606fHUex_oRZ7Y0Sqw'

export default function Map({ setSelectedItem }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [localItem, setLocalItem] = useState()
  const [lng, setLng] = useState(103.8229)
  const [lat, setLat] = useState(1.3485)
  const [zoom, setZoom] = useState(11.08)
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
      // Add a new source from our GeoJSON data and
      // set the 'cluster' option to true. GL-JS will
      // add the point_count property to your source data.
      map.current.addSource('opportunities', {
        type: 'geojson',
        data: '/api/opportunities',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      })

      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'opportunities',
        filter: ['has', 'point_count'],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
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

      // inspect a cluster on click
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

      // When a click event occurs on a feature in
      // the unclustered-point layer, open a popup at
      // the location of the feature, with
      // description HTML from its properties.
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
  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: 'calc(100vh - calc(100vh - 100%))' }}
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
