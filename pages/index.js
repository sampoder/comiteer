import { Grid, Button, Badge, Box, Text, Heading, Input } from 'theme-ui'
import Map from '../components/map'
import { useState, useRef } from 'react'
const title = require('title')
import Div100vh from 'react-div-100vh'
import { useSwipeable } from 'react-swipeable'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/client'
const md5 = require('md5')
import dynamic from 'next/dynamic'
const Tooltip = dynamic(() => import('react-tooltip'), { ssr: false })
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from '@mattjennings/react-modal'

Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax
  while (L && this.length) {
    what = a[--L]
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1)
    }
  }
  return this
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const images = [
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/0gems_innovation_week-2763-min.jpg',
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/1gems_innovation_week-2831-min.jpg',
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/2gems_innovation_week-2754-min.jpg',
]

function LoginModal(props) {
  const [buttonDetails, setButtonDetails] = useState({
    text: 'Send Magic Link',
    bg: 'blue',
  })
  const inputRefEl = useRef(null)
  return (
    <Modal
      sx={{
        borderRadius: 5,
        p: 3,
        px: 0,
        width: '400px',
        maxWidth: '90vw',
        minHeight: '0vh',
      }}
      {...props}
    >
      <ModalContent>
        <Input
          sx={{ mb: 3, mt: 1 }}
          placeholder="Email"
          type="email"
          ref={inputRefEl}
        />
      </ModalContent>
      <ModalFooter>
        <Button
          sx={{ width: '100%', bg: buttonDetails.bg }}
          onClick={async () => {
            if (validateEmail(inputRefEl.current.value)) {
              setButtonDetails({ text: 'Sent!', bg: 'green' })
              signIn('email', {
                redirect: false,
                email: inputRefEl.current.value,
              })
              await sleep(3000)
              props.setLoginIsOpen(false)
            } else {
              setButtonDetails({ text: 'Invalid Email', bg: 'red' })
              await sleep(3000)
              setButtonDetails({ text: 'Send Magic Link', bg: 'blue' })
            }
          }}
        >
          {buttonDetails.text}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default function Home() {
  const [session, loading] = useSession()
  const [isLoginOpen, setLoginIsOpen] = useState(false)
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
  const [selectedCategories, setSelectedCategories] = useState([])
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
      <LoginModal open={isLoginOpen} setLoginIsOpen={setLoginIsOpen} />
      <Box
        as="main"
        sx={{ bg: '#E6E4E0', maxHeight: '100vh', overflowY: 'hidden' }}
      >
        <Box
          sx={{
            position: 'fixed',
            zIndex: '100',
            height: [enlargedBox ? '60vh' : '22vh', '100vh'],
            transition: 'height ease-in 0.5s',
            width: ['100%', '400px'],
            p: [0, 3],
            bottom: 0,
          }}
          onClick={() => setEnlargedBox(!enlargedBox)}
          {...handlers}
        >
          <Box
            sx={{
              bg: '#E6E4E0',
              boxShadow: 'card',
              height: '100%',
              p: 3,
              borderRadius: 6,
            }}
          >
            <Box
              sx={{
                height: 'calc(100% - 36px)',
                overflowY: [enlargedBox ? 'scroll' : 'hidden', 'scroll'],
              }}
            >
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
              <Box
                sx={{
                  cursor: 'pointer',
                  borderBottom: '1px solid',
                  borderColor: 'muted',
                  pb: 1,
                  mb: 1,
                  display: ['none', selectedItem == null ? 'none' : 'block'],
                }}
                onClick={() => setSelectedItem(null)}
              >
                Home
              </Box>
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
                    <Box sx={{ position: 'relative' }} key={x}>
                      <Image src={x} width={200} height={150} />
                    </Box>
                  ))}
                </Grid>
              )}
              {!selectedItem && (
                <Box mt={2}>
                  <Input
                    placeholder="Search Opportunities"
                    sx={{ border: '1px dashed' }}
                  />
                  <Box mt={2} sx={{ '> button': { m: 1, ml: 0 } }}>
                    {categories.map(category => (
                      <Button
                        bg={category.color}
                        sx={{
                          '&:hover': { opacity: 1, transform: 'scale(1)' },
                          opacity: selectedCategories.includes(category.key)
                            ? 1
                            : 0.4,
                        }}
                        onClick={() =>
                          setSelectedCategories(
                            selectedCategories.includes(category.key)
                              ? [...selectedCategories.remove(category.key)]
                              : [category.key, ...selectedCategories],
                          )
                        }
                        key={category.label}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
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
              <Box sx={{ display: 'flex' }}>
                <Text>© Comiteer 2021</Text>
                <Text
                  sx={{
                    flexGrow: 1,
                    textAlign: 'right',
                    display: [
                      selectedItem == null ? 'none' : 'inline-block',
                      'none',
                    ],
                  }}
                  onClick={() => setSelectedItem(null)}
                >
                  {'< '}Go Back
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ position: 'fixed', top: 3, right: 3, zIndex: 100 }}>
          {!loading ? (
            session != null ? (
              <>
                <img
                  src={`https://www.gravatar.com/avatar/${md5(
                    session != null ? session.user.email : '',
                  )}?d=retro`}
                  height="40"
                  data-tip
                  data-for={`tip-user-info`}
                />
                <Tooltip
                  id={`tip-user-info`}
                  place="left"
                  effect="solid"
                  delayShow={0}
                  delayHide={1000}
                  clickable
                  multiline
                >
                  Signed in as {session.user.email}.
                  <hr />
                  <Text onClick={() => signOut()} sx={{ cursor: 'pointer' }}>
                    Click here to log out
                  </Text>
                </Tooltip>
              </>
            ) : (
              !loading && (
                <Button onClick={() => setLoginIsOpen(true)}>Sign In</Button>
              )
            )
          ) : (
            ''
          )}
        </Box>
        <Map
          setSelectedItem={handleSelection}
          selectedItem={selectedItem}
          selectedCategories={selectedCategories}
        />
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
        .__react_component_tooltip{
          top: 20px!important;
          text-align: right;
        }
        .__react_component_tooltip::after {
          top: 20%!important;
        }
      `}</style>
    </Div100vh>
  )
}
