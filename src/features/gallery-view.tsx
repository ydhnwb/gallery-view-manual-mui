// components/GalleryView.tsx
import { useState, FC, useEffect } from 'react'
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  DialogContent,
  Box,
  Grid,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { useSwipeable } from 'react-swipeable'

interface GalleryViewProps {
  images: string[] // Array of image URLs
  open: boolean // Control to open/close the dialog externally
  onClose: () => void // Function to handle closing of dialog
  useLargeScreenView?: boolean // to seaprate it is mobile view or not
}

const GalleryView: FC<GalleryViewProps> = ({
  images,
  open,
  onClose,
  useLargeScreenView,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [transitionDirection, setTransitionDirection] = useState<
    'left' | 'right' | ''
  >('') // Track swipe direction

  const handleSelectImage = (index: number) => {
    if (index !== 0 && index !== images.length - 1) {
      setTransitionDirection(index > selectedIndex ? 'left' : 'right')
    }

    setSelectedIndex(index)
  }

  // previous
  const handleSwipeLeft = () => {
    console.log('to left')
    if (selectedIndex !== 0) {
      setTransitionDirection('left')
      setSelectedIndex((prevIndex) => prevIndex - 1)
    }
  }

  // next
  const handleSwipeRight = () => {
    console.log('to rifght')
    if (selectedIndex !== images.length - 1) {
      setTransitionDirection('right')
      setSelectedIndex((prevIndex) => prevIndex + 1)
    }
  }

  // inverted
  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeRight,
    onSwipedRight: handleSwipeLeft,

    trackMouse: true, // Enable mouse swiping as well
  })

  useEffect(() => {
    if (transitionDirection !== '') {
      const timeout = setTimeout(() => setTransitionDirection(''), 200) // Match the CSS transition duration
      return () => clearTimeout(timeout)
    }
  }, [transitionDirection])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={true}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)', // Black tint with transparency
          overflowX: 'hidden',
        },
      }}
    >
      {/* AppBar with Close Button */}
      <AppBar position="relative" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: useLargeScreenView ? undefined : 0,
          paddingRight: useLargeScreenView ? undefined : 0,
        }}
      >
        {!useLargeScreenView ? (
          <Box
            {...handlers} // Attach swipe handlers to the main image container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              width: '100%',
              height: '100%',
              touchAction: 'pan-y', // Allow vertical scrolling while swiping
            }}
          >
            <Box
              {...handlers} // Attach swipe handlers to the main image container
              sx={{
                width: '100%',
                height: '65%',
                position: 'absolute',
                transition: 'transform 0.2s ease',
                transform:
                  transitionDirection === 'right'
                    ? 'translateX(100%) translateY(0)'
                    : transitionDirection === 'left'
                    ? 'translateX(-100%) translateY(0)'
                    : 'translateX(0) translateY(0)',
                opacity: transitionDirection ? 0 : 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                src={images[selectedIndex]}
                alt={`image-${selectedIndex}`}
                width={0}
                height={0}
                style={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '75%',
              backgroundColor: 'blue',
              mb: 2,
            }}
          >
            <Image
              src={images[selectedIndex]}
              alt="Selected image"
              width={0}
              height={0}
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
        )}

        <Container maxWidth="md" disableGutters={!useLargeScreenView}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              textAlign: 'center',
              mb: 2,
            }}
          >
            {`${images.length > 0 ? selectedIndex + 1 : 0}/${images.length}`}
          </Typography>

          {useLargeScreenView ? (
            <Grid
              columns={6}
              container
              gap={1}
              spacing={1}
              sx={{ justifyContent: 'center', overflowX: 'auto', mt: 2 }}
            >
              {images.map((image, index) => (
                <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  key={index}
                  // sx={{
                  //   display: 'flex',
                  //   justifyContent: 'center',
                  // }}
                  onClick={() => handleSelectImage(index)}
                >
                  <Image
                    src={image}
                    alt={`thumbnail-${index}`}
                    width={0}
                    height={0}
                    style={{
                      height: 120,
                      width: 120,
                      borderRadius: 8,
                      cursor: 'pointer',
                      objectFit: 'cover',
                      border:
                        index === selectedIndex
                          ? '2px solid green'
                          : '2px solid transparent',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack
              direction={'row'}
              sx={{
                flexDirection: 'row',
                overflowX: 'scroll', // Enable horizontal scrolling
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => handleSelectImage(index)}
                  sx={{}}
                >
                  <Image
                    src={image}
                    alt={`thumbnail-${index}`}
                    width={120} // Set a fixed width
                    height={120} // Set a fixed height
                    style={{
                      cursor: 'pointer',
                      border:
                        index === selectedIndex
                          ? '2px solid green'
                          : '2px solid transparent',
                      marginRight: index === images.length - 1 ? 50 : 0.5,
                      marginLeft: index === 0 ? 50 : 0.5,
                      transition: 'border-color 0.2s',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </Container>
      </DialogContent>
    </Dialog>
  )
}

export default GalleryView
