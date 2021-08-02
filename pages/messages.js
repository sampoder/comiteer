import {
  Grid,
  Button,
  Box,
  Text,
  Heading,
  Input,
  Flex,
  Textarea,
  Select,
} from 'theme-ui'
import { useSwipeable } from 'react-swipeable'
import { getSession } from 'next-auth/client'
import { useState, useRef } from 'react'
import useSWR, { mutate } from 'swr'
import { Modal, ModalContent, ModalFooter } from '@mattjennings/react-modal'
import { useRouter } from 'next/router'
var sentiment = require('wink-sentiment')
import prisma from '../lib/prisma'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function ReportModal(props) {
  const router = useRouter()
  const [buttonDetails, setButtonDetails] = useState({
    text: 'Report User',
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
        mt: 4,
      }}
      {...props}
    >
      <ModalContent>
        <Textarea
          sx={{ mb: 3, mt: 1 }}
          rows={8}
          placeholder="Describe The Incident"
          type="email"
          ref={inputRefEl}
        />
        <Select
          sx={{ mb: 1, mt: 1 }}
          arrow={
            <Box
              as="svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentcolor"
              sx={{
                ml: -28,
                mt: 0,
                alignSelf: 'center',
                pointerEvents: 'none',
              }}
            >
              <path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z" />
            </Box>
          }
          defaultValue="Please Categorize This Incident"
        >
          <option>Please Categorize This Incident</option>
          <option>Micro Aggressions</option>
          <option>Direct Insults</option>
          <option>Inappropriate Behavior</option>
          <option>Spam-like Behavior</option>
          <option>Scamming</option>
          <option>Illegal Behavior</option>
        </Select>
        <Box sx={{ mb: 3, mt: 1, color: 'muted' }}>
          <small>
            Please note, by doing this your entire chat contents with this user
            may be reviewed.
          </small>
        </Box>
      </ModalContent>
      <ModalFooter>
        <Button
          sx={{ width: '100%', bg: buttonDetails.bg }}
          onClick={() => router.push('/')}
        >
          {buttonDetails.text}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

function CalmDownModal(props) {
  const router = useRouter()
  const [buttonDetails, setButtonDetails] = useState({
    text: 'OK',
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
        mt: 4,
      }}
      {...props}
    >
      <ModalContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          👋 Hey! Our robots have detected an abundance of negativity in your
          recent messages, just a quick reminder: Comiteer is a friendly
          platform for people of all ages and backgrounds. You can read more
          about positive interactions online here and report a user here.
        </Box>
      </ModalContent>
      <ModalFooter>
        <Button
          sx={{ width: '100%', bg: buttonDetails.bg }}
          onClick={() => props.setLoginIsOpen(false)}
        >
          {buttonDetails.text}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default function Messages({
  enlargedBox,
  selectedItem,
  setEnlargedBox,
  setSelectedItem,
  initialConversations,
  initialMessages,
  newConvo,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [draftMessage, setDraftMessage] = useState('')
  const [isReportOpen, setReportIsOpen] = useState(false)
  const [isCalmDownOpen, setCalmDownIsOpen] = useState(false)
  const [viewingMessages, setViewingMessages] = useState(
    newConvo == null ? {} : { identity: newConvo },
  )
  const { data, error } = useSWR(`/api/messages`, fetcher, {
    refreshInterval: 1000,
  })
  let messages = data ? data.messages : initialMessages
  let conversations = data ? data.conversations : initialConversations
  const boxHandlers = useSwipeable({
    onSwipedUp: eventData => setEnlargedBox(true),
  })

  const headerHandlers = useSwipeable({
    onSwipedDown: eventData => setEnlargedBox(false),
    onSwipedLeft: eventData => setViewingMessages(undefined),
    onSwipedRight: eventData => setViewingMessages(undefined)
  })

  const unEnlargedProps = {
    onClick: () => setEnlargedBox(true),
  }
  const handleKeyDown = async event => {
    if (event.key === 'Enter') {
      let message = draftMessage
      let {normalizedScore} = sentiment(message)
      if(normalizedScore < -3.99){
        setCalmDownIsOpen(true)
      }
      else{
        setDraftMessage('')
        await fetch(`/api/send?to=${viewingMessages.identity.id}&text=${message}`)
        mutate('/api/messages')
      }
    }
  }

  return (
    <>
      <CalmDownModal open={isCalmDownOpen} setLoginIsOpen={setCalmDownIsOpen} />
      <ReportModal open={isReportOpen} setLoginIsOpen={setReportIsOpen} />
      <Box as="main" sx={{ maxHeight: '100vh', overflowY: 'hidden' }}>
        <Box
          sx={{
            position: 'fixed',
            zIndex: '100',
            height: '100vh',
            transition: 'height ease-in 0.5s',
            width: [
              '100%',
              viewingMessages.identity === undefined ? '400px' : '100%',
            ],
            p: [0, 3],
            bottom: 0,
          }}
          {...(enlargedBox ? {} : unEnlargedProps)}
          {...boxHandlers}
        >
          <Grid
            sx={{
              bg: '#E6E4E0',
              boxShadow: 'card',
              height: '100%',
              p: 3,
              borderRadius: 6,
            }}
            columns={[
              1,
              viewingMessages.identity === undefined ? 1 : '400px 3fr',
            ]}
          >
            <Box sx={{display: viewingMessages.identity === undefined ? 'block' : 'none',}}>
              <Box
                sx={{
                  height: 'calc(100% - 42px)',
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
                <Box {...headerHandlers}>
                  <Heading as="h1">Messages</Heading>
                </Box>
                <Box my={2}>
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search Threads"
                    sx={{ border: '1px dashed' }}
                  />
                </Box>
                {conversations.map(x => (
                  <Flex
                    mt={3}
                    sx={{ cursor: 'pointer' }}
                    key={x.name}
                    onClick={() =>
                      setViewingMessages({
                        sent: messages.sent[x.id],
                        received: messages.received[x.id],
                        identity: x,
                      })
                    }
                  >
                    <img
                      src={x.image}
                      style={{
                        height: '36px',
                        objectFit: 'cover',
                        width: '36px',
                      }}
                    />
                    <Box ml={'9px'} sx={{ alignSelf: 'center' }}>
                      <Heading as="h3">{x.nickname}</Heading>
                    </Box>
                  </Flex>
                ))}
              </Box>
              <Box
                sx={{
                  height: '42px',
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
            {viewingMessages.identity !== undefined && (
              <Box
                sx={{
                  display: [
                    'block',
                    viewingMessages.identity === undefined ? 'none' : 'block',
                  ],

                  height: '100%',
                }}
              >
                <Flex
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'muted',
                    pb: 2,
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={viewingMessages.identity.image}
                    style={{
                      height: '36px',
                      objectFit: 'cover',
                      width: '36px',
                    }}
                  />
                  <Heading as="h1" sx={{ ml: 2 }}>
                    {viewingMessages.identity.nickname}
                  </Heading>
                  <Heading
                    sx={{ flexGrow: 1, textAlign: 'right' }}
                    onClick={() => setReportIsOpen(true)}
                  >
                    ⚠️
                  </Heading>
                </Flex>
                <Box
                  sx={{
                    maxHeight: ['calc(100vh - 45px)', 'calc(100vh - 64px - 45px)'],
                    overflowY: 'scroll',
                  }}
                >
                  <Flex
                    sx={{
                      flexDirection: 'column-reverse',
                      my: 0,
                      overflowY: 'scroll',
                      height: ['calc(100vh - 45px - 32px - 42px - 4px)', 'calc(100vh - 64px - 45px - 42px - 4px)'],
                      maxHeight: ['calc(100vh - 45px - 32px - 42px - 4px)', 'calc(100vh - 64px - 45px - 42px - 4px)'],
                    }}
                  >
                    {[
                      ...(typeof messages.received[
                        viewingMessages.identity.id
                      ] == 'undefined'
                        ? []
                        : messages.received[viewingMessages.identity.id]),
                      ...(typeof messages.sent[viewingMessages.identity.id] ==
                      'undefined'
                        ? []
                        : messages.sent[viewingMessages.identity.id]),
                    ]
                      .sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                      )
                      .reverse()
                      .map(x => (
                        <Box
                          bg={x.sent ? 'blue' : 'green'}
                          color="white"
                          sx={{
                            width: 'fit-content',
                            p: 2,
                            borderRadius: 4,
                            mb: 1,
                            alignSelf: x.sent ? 'flex-end' : null,
                          }}
                          title={x.createdAt}
                          key={x.createdAt + x.sent}
                        >
                          {x.text}
                        </Box>
                      ))}
                  </Flex>
                  <Box mt={2}>
                    <Input
                      value={draftMessage}
                      onChange={e => setDraftMessage(e.target.value)}
                      placeholder="Send A Message"
                      sx={{ border: '1px dashed' }}
                      onKeyDown={handleKeyDown}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>
        </Box>
      </Box>
      <style>{`
        html {
          overscroll-behavior-y: none!important;
        }
        img {
          object-fit: cover;
          border-radius: 4px;
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps({ res, req, query }) {
  const md5 = require('md5')
  const session = await getSession({ req })
  console.log(session)
  if (session === null) {
    res.writeHead(301, {
      Location: '/',
    })
    res.end()
    return
  }
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    include: {
      from: { include: { to: true } },
      to: { include: { from: true } },
    },
  })
  let newConvo = query.new
    ? await prisma.user.findFirst({
        where: {
          id: parseInt(query.new),
        },
      })
    : null
  newConvo =
    newConvo == null
      ? null
      : {
          id: newConvo.id,
          nickname: newConvo.nickname,
          image: `https://www.gravatar.com/avatar/${md5(
            newConvo.email,
          )}?d=retro`,
          lastMessaged: newConvo.createdAt,
        }
  let conversations = [...user.from.map(x => x.to), ...user.to.map(x => x.from)]
    .map(x => ({
      id: x.id,
      nickname: x.nickname,
      image: `https://www.gravatar.com/avatar/${md5(x.email)}?d=retro`,
      lastMessaged: x.createdAt,
    }))
    .sort((a, b) => b.lastMessaged - a.lastMessaged)
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
  console.log(conversations)
  let messages = { sent: {}, received: {} }
  user.from.map(x => {
    if (typeof messages.sent[x.toId] == 'undefined') {
      messages.sent[x.toId] = [
        {
          text: x.text,
          attachments: x.attachements,
          createdAt: x.createdAt,
          sent: true,
          received: false,
        },
      ]
    } else {
      messages.sent[x.toId].push({
        text: x.text,
        attachments: x.attachements,
        createdAt: x.createdAt,
        sent: true,
        received: false,
      })
    }
  })
  user.to.map(x => {
    if (typeof messages.received[x.fromId] == 'undefined') {
      messages.received[x.fromId] = [
        {
          text: x.text,
          attachments: x.attachements,
          createdAt: x.createdAt,
          sent: false,
          received: true,
        },
      ]
    } else {
      messages.received[x.fromId].push({
        text: x.text,
        attachments: x.attachements,
        createdAt: x.createdAt,
        sent: false,
        received: true,
      })
    }
  })
  return {
    props: {
      initialConversations: conversations,
      initialMessages: messages,
      newConvo,
    },
  }
}
