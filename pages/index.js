import { Grid, Box, Container, Heading } from 'theme-ui'
import Map from '../components/map'
import { useState } from 'react'
const title = require('title')
import Div100vh from 'react-div-100vh'
import { useSwipeable } from 'react-swipeable'
import Image from 'next/image'

const images = [
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/0gems_innovation_week-2763-min.jpg',
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/1gems_innovation_week-2831-min.jpg',
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/2gems_innovation_week-2754-min.jpg',
]

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
          <Box sx={{ bg: '#E6E4E0', boxShadow: 'card', height: '100%', p: 3, borderRadius: 6 }}>
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
              {selectedItem && (
                <Grid mt={2} color="slate" gap={2} columns={2}>
                  {images.map(x => (
                    <Box sx={{ position: 'relative'}} key={x} >
                      <Image src={x} width={200} height={150} />
                    </Box>
                  ))}
                </Grid>
              )}
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
        img {
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.125);
        }
      `}</style>
    </Div100vh>
  )
}
