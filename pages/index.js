import { Button, Box, Container, Heading } from 'theme-ui'
import Map from '../components/map'
import { useState } from 'react'
const title = require('title')
import Div100vh from 'react-div-100vh'
import { useSwipeable } from 'react-swipeable'

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [enlargedBox, setEnlargedBox] = useState(false)
  function handleSelection(value) {
    setEnlargedBox(true)
    if (selectedItem !== value) {
      setSelectedItem(value)
    } else {
      setSelectedItem(null)
    }
  }
  const handlers = useSwipeable({
    onSwipedUp: eventData => setEnlargedBox(true),
    onSwipedDown: eventData => setEnlargedBox(false),
  })
  return (
    <Div100vh>
      <Box
        as="main"
        sx={{ bg: '#E6E4E0', maxHeight: '100vh', overflow: 'hidden' }}
      >
        <Box
          sx={{
            position: 'fixed',
            zIndex: '999',
            height: [enlargedBox ? '60vh' : '22vh', '100vh'],
            transition: 'height ease-in 0.5s',
            width: ['100%', '400px'],
            p: [0, 3],
            bottom: 0,
          }}
          onClick={() => setEnlargedBox(!enlargedBox)}
          {...handlers}
        >
          <Box sx={{ bg: '#E6E4E0', boxShadow: 'card', height: '100%', p: 3 }}>
            <Box sx={{ height: 'calc(100% - 36px)', overflowY: 'scroll' }}>
              <Box
                sx={{
                  height: [enlargedBox ? '0px' : '5px', '0px'],
                  borderRadius: 2,
                  bg: '#c7c2bb',
                  width: '60px',
                  mb: [enlargedBox ? 0 : 2, 0],
                  opacity: [enlargedBox ? 0 : 1, 0],
                  transition: 'ease-in 0.5s',
                }}
              ></Box>
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
            <Box
              sx={{
                height: '36px',
                borderTop: '1px solid',
                borderColor: 'muted',
                color: 'muted',
                pt: '6px',
              }}
            >
              © Comiteer 2021
            </Box>
          </Box>
        </Box>
        <Map setSelectedItem={handleSelection} selectedItem={selectedItem} />
      </Box>
      <style>{`
      html {
        overscroll-behavior-y: none!important;
      }
      `}</style>
    </Div100vh>
  )
}
