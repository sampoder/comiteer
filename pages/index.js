import { Button, Box, Container, Heading } from 'theme-ui'
import Map from '../components/map'
import { useState } from 'react'
const title = require('title')

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null)
  function handleSelection(value) {
    console.log(value)
    console.log(selectedItem)
    if (selectedItem !== value) {
      setSelectedItem(value)
    } else {
      setSelectedItem(null)
    }
  }
  return (
    <Box as="main" sx={{ bg: '#E6E4E0' }}>
      <Box
        sx={{
          position: 'absolute',
          zIndex: '999',
          height: ['20vh', '100vh'],
          width: ['100%', '400px'],
          p: [0, 3],
          bottom: 0
        }}
      >
        <Box sx={{ bg: '#E6E4E0', boxShadow: 'card', height: '100%', p: 3 }}>
          <Box sx={{ height: 'calc(100% - 36px)', overflowY: 'scroll' }}>
            <Heading as="h1">
              {!selectedItem ? 'Comiteer' : selectedItem.name}
            </Heading>
            {selectedItem && (
              <Box mt={2} color="slate">
                {title(selectedItem.address)}
              </Box>
            )}
            <Box mt={2}>
              {!selectedItem
                ? `Explore the map of Singapore and find out what is happening in
              your area.`
                : selectedItem.description}
            </Box>
          </Box>
          <Box sx={{ height: '36px', borderTop: '1px solid', borderColor: 'muted', color: 'muted', pt: '6px' }}>
            © Comiteer 2021
          </Box>
        </Box>
      </Box>
      <Map setSelectedItem={handleSelection} selectedItem={selectedItem} />
    </Box>
  )
}
