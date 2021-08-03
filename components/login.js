import { useState, useRef } from 'react'
import { signIn } from 'next-auth/client'
import { Modal, ModalContent, ModalFooter } from '@mattjennings/react-modal'
import { Button, Box, Text, Input } from 'theme-ui'
import { signOut, useSession } from 'next-auth/client'
import useSWR from 'swr'
const md5 = require('md5')
import dynamic from 'next/dynamic'
const Tooltip = dynamic(() => import('react-tooltip'), { ssr: false })
import { useRouter } from 'next/router'

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const fetcher = (...args) => fetch(...args).then(res => res.json())

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
        mt: 4,
        height: 'auto'
      }}
      {...props}
    >
      <ModalContent>
        Logins are currently unavailable on the public version as our
        application to use SingPass is currently pending. Our current account is
        limited to the demo version locally.
      </ModalContent>
      <ModalFooter>
        <Button
          sx={{ width: '100%', bg: buttonDetails.bg, mt: 2 }}
          onClick={async () => {
            props.setLoginIsOpen(false)
          }}
        >
          OK
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default function Login() {
  const router = useRouter()
  const [session, loading] = useSession()
  const [isLoginOpen, setLoginIsOpen] = useState(false)
  const verifiedCheck = useSWR(`/api/verified`, fetcher)
  return (
    <>
      <LoginModal open={isLoginOpen} setLoginIsOpen={setLoginIsOpen} />
      <Box sx={{ position: 'fixed', top: 3, right: 3, zIndex: 100, display: isLoginOpen ? 'none' : 'block' }}>
        {!loading ? (
          session != null && verifiedCheck.data != null ? (
            verifiedCheck.data.verified ? (
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
              <Button onClick={() => router.push('/verify')} bg="red">
                Verify User
              </Button>
            )
          ) : (
            !loading && (
              <Button onClick={() => setLoginIsOpen(true)}>Sign In</Button>
            )
          )
        ) : (
          ''
        )}
      </Box>
      <style jsx>{`
        img {
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.125);
        }
      `}</style>
      <style>{`
      .__react_component_tooltip{
        top: 20px!important;
        text-align: right;
      }
      .__react_component_tooltip::after {
        top: 20%!important;
      }`}</style>
    </>
  )
}
