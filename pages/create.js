import { Box, Button, Container, Heading, Input, Textarea } from 'theme-ui'

export default function Home() {
  return (
    <Container py={4}>
      <Heading as='h1'>Add An Opportunity</Heading>
      <Box as="form" action="/api/create" method="post">
        <Input name="title" placeholder="Title" mt={2} />
        <Input name="postcode" placeholder="Postcode" mt={2} />
        <Textarea name="description" placeholder="Description" rows={8} mt={2} />
        <Button mt={2}>Submit</Button>
      </Box>
    </Container>
  )
}
