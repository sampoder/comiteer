import { Grid, Button, Box, Text, Heading, Input, Flex } from 'theme-ui'
const title = require('title')
import { useSwipeable } from 'react-swipeable'
import Image from 'next/image'

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

const images = [
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/0gems_innovation_week-2763-min.jpg',
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/1gems_innovation_week-2831-min.jpg',
  'https://cloud-okol6b1vm-hack-club-bot.vercel.app/2gems_innovation_week-2754-min.jpg',
]

export default function Home({
  enlargedBox,
  selectedItem,
  selectedCategories,
  setEnlargedBox,
  setSelectedItem,
  setSelectedCategories,
  searchQuery,
  setSearchQuery,
  data,
}) {
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
  const boxHandlers = useSwipeable({
    onSwipedUp: eventData => setEnlargedBox(true),
  })

  const headerHandlers = useSwipeable({
    onSwipedDown: eventData => setEnlargedBox(false),
  })

  const unEnlargedProps = {
    onClick: () => setEnlargedBox(true),
  }
  return (
    <>
      <Box as="main" sx={{ maxHeight: '100vh', overflowY: 'hidden' }}>
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
          {...(enlargedBox ? {} : unEnlargedProps)}
          {...boxHandlers}
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
              <Box {...headerHandlers}>
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
                <Box my={2}>
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search Opportunities"
                    sx={{ border: '1px dashed' }}
                  />
                  <Box
                    as={searchQuery.trim().length === 0 ? 'div' : 'details'}
                    mt={2}
                    sx={{ '> button': { m: 1, ml: 0 } }}
                  >
                    <summary
                      style={{
                        display:
                          searchQuery.trim().length === 0 ? 'none' : null,
                      }}
                    >
                      Show Filters
                    </summary>
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
                  {!data
                    ? ''
                    : data.features
                        .filter(function (el) {
                          return (
                            (selectedCategories.length === 0
                              ? true
                              : el.properties.tags.some(r =>
                                  selectedCategories.includes(r),
                                )) &&
                            (el.properties.name
                              .toUpperCase()
                              .includes(searchQuery.trim().toUpperCase()) ||
                              searchQuery.trim().length === 0)
                          )
                        })
                        .map(x => (
                          <Flex mt={3} sx={{cursor: 'pointer'}} key={x.properties.id} onClick={()=> setSelectedItem(x.properties)}>
                            <img
                              src={images[0]}
                              style={{
                                height: '64px',
                                objectFit: 'cover',
                                width: '64px',
                              }}
                            />
                            <Box ml={'9px'} sx={{ alignSelf: 'center' }}>
                              <Heading as="h3">{x.properties.name}</Heading>
                              {x.properties.description}
                            </Box>
                          </Flex>
                        ))}
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
