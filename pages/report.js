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
import { useState, useRef } from 'react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Report() {
  return (
    <>
      <Box as="main" sx={{ maxHeight: '100vh', overflowY: 'hidden' }}>
        <Box
          sx={{
            position: 'fixed',
            zIndex: '100',
            height: '100vh',
            transition: 'height ease-in 0.5s',
            width: '100%',
            p: [0, 3],
            bottom: 0,
          }}
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
            <Heading as="h1">⚠️ Report: Case #181</Heading>
            <hr />
            We are currently reviewing your case, please hang tight. If you
            would like to provide additional details please do so{' '}
            <a style={{ textDecoration: 'underline' }}>here</a>.
          </Box>
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
