import { Box, Button, Container, Heading, Input, Flex, Card } from 'theme-ui'

export default function Home() {
  return (
    <Flex
      sx={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
      }}
    >
      <Card py={4} sx={{ maxWidth: '600px' }}>
        <Heading as="h1">Verify Your Identity</Heading>
        <Box mt={2}>
          To protect all of our users and ensure trust we require you to provide
          your personal details (Full Name & Date of Birth) through SingPass.
        </Box>
        <Button
          mt={2}
          bg="red"
          as="a"
          href={`https://test.api.myinfo.gov.sg/com/v3/authorise?client_id=STG2-MYINFO-DEMO-APP&attributes=uinfin,name,dob&purpose=demonstrating Comiteer&state=${Math.floor(Math.random() * 100000)}&redirect_uri=http://localhost:3001/callback`}
        >
          Verify Through Singpass
        </Button>
      </Card>
    </Flex>
  )
}
