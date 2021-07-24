import {
  Box,
  Button,
  Select,
  Container,
  Heading,
  Input,
  Flex,
  Card,
} from 'theme-ui'

export default function Home({ name }) {
  return (
    <Flex
      sx={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'url(https://cloud-ft66fulr0-hack-club-bot.vercel.app/0screenshot_2021-07-20_at_12.41.19.png)',
        backgroundSize: 'cover',
      }}
    >
      <Card py={4} sx={{ maxWidth: '600px' }}>
        <Heading as="h1">Hi {name}, please select your preferred name.</Heading>
        <Box as="form" mt={3} action="/api/nickname">
          <Select name="nickname">
            <option>{name.split(' ')[0]} {name.split(' ')[name.split(' ').length - 1][0].toUpperCase()}.</option>
            <option>{name.split(' ')[0][0].toUpperCase()}. {name.replace(name.split(' ')[0], '')}</option>
            <option>{name.replace(name.split(' ')[0], '')} {name.split(' ')[0][0].toUpperCase()}.</option>
            <option>{name}</option>
          </Select>
          <Button mt={2} bg="blue">
            Set Nickname
          </Button>
        </Box>
      </Card>
    </Flex>
  )
}

export function getServerSideProps({ query }) {
  return { props: { name: query.name } }
}
