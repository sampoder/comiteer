import { Button, Box, Container, Heading } from 'theme-ui'
import Map from '../components/map'

export default function Home() {
  return (
    <Box as="main">
      <Box
        sx={{
          position: 'absolute',
          zIndex: '999',
          height: '100vh',
          width: '400px',
          p: 3,
          display: ['none', 'block']
        }}
      >
        <Box sx={{ bg: '#E6E4E0', boxShadow: 'card', height: '100%', p: 3 }}>
          <Box sx={{ height: 'calc(100% - 36px)'}}>
            <Heading as="h1">Comiteer</Heading>
            <Box mt={2}>
              Explore the map of Singapore and find out what is happening in
              your area.
            </Box>
          </Box>
          <Box sx={{ height: '36px', borderTop: '1px solid black', pt: '6px'}}>
            © Mapbox © OpenStreetMap
          </Box>
        </Box>
      </Box>
      <Map />
    </Box>
  )
}
