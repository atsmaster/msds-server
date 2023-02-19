
// .swiper-slide img {
//     display: block;
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Container, Stack, Switch, Typography } from '@mui/material';
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const HomeSliderView2 = function ({ children }) {
    const swiperRef = useRef(null);
    const [slides, setSlides] = useState(children);
    const [swiper, setSwiper] = useState(null);
    const [title, setTitle] = useState("")
    const [autoPlay, setAutoPlay] = useState({
        delay: 5000,
        disableOnInteraction: false,
    });

    const handleChange = (event) => {
        if (event.target.checked){
            swiper.autoplay.start();
        } else {
            swiper.autoplay.stop();
        }
    };
    const handleSwiper = (swiper) => {
        setSwiper(swiper);
    };
    const handleSlideChange = () => {
        setTitle(slides[swiper?.activeIndex]?.file_nm)
    };

    useEffect(() => {
        setTitle(slides[swiper?.activeIndex]?.file_nm)
    }, [swiper])
    return <>
        <Container maxWidth={false}>
            <Stack>
                <Stack direction="row" spacing={1} alignItems="center" style={{position: 'absolute', zIndex: 100}}>
                    <Typography>Off</Typography>
                    <Switch 
                        onChange={handleChange}
                        defaultChecked  />
                    <Typography>On</Typography>
                </Stack>
                <div>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="subTitle" noWrap >{title}</Typography>
                    </Box>
                </div>
                <div style={{ display: "flex", overflow: 'auto', width: 'calc(100vw - 210px)'}}>
                    <Swiper
                        onSwiper={handleSwiper}
                        onSlideChange={handleSlideChange}
                        style={{
                            "--swiper-navigation-color": "black",
                            "--swiper-pagination-color": "#fff",
                        }}
                        centeredSlides={false}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, FreeMode, Navigation, Thumbs]}>
                        {slides.map((item, index) => {
                            return <SwiperSlide key={item?.fileThumbnailId} virtualIndex={index} style={{ textAlign: 'center'}}>
                                <img style={{ objectFit: "cover" }} src={item.file_path}></img>
                            </SwiperSlide>
                        })}
                    </Swiper>
                </div>
            </Stack>
        </Container>
    </>
}


export default HomeSliderView2