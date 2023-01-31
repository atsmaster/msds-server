import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React, { Component, useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel'
import '../../assets/css/component-carousel.css'
import useWindowDimensions from '../../hooks/useWindowDemension';





const CarouselView = function ({ children }) {

    const dimens = useWindowDimensions()
    const [title,setTitle] = useState(null);
    const containerWrapperRef = React.useRef();
    const [count, setCount] = React.useState(0);
    const refs = React.useRef([]);
    const observer = React.useRef(null);
    const addNode = React.useCallback(
        (node) => refs.current.push(node)
        , []);

    React.useEffect(() => {

        if (observer.current) {
            observer.current.disconnect();
        }
        const newObserver = getObserver(observer);

        for (const node of refs.current) {
            if (node){
                newObserver.observe(node);
            }
        }

        return () => newObserver?.disconnect();
    }, []);

    useEffect(()=>{
        const item = children[count];
        if (item){
            setTitle(item.file_nm);
        }
        console.log("current index",count,children);
    },[count])

    const handler = (entries, observer) => {
        for (const entry of entries) {
            if (entry.intersectionRatio >= 1) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                setCount(index)
            }
        }
    };
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0
    };
    
    const getObserver = (ref) => {
        let observer = ref.current;
        if (observer !== null) {
            return observer;
        }
        let newObserver = new IntersectionObserver(handler, options);
        ref.current = newObserver;
        return newObserver;
    };

    const OnPrev = function(){
       const mCount = count-1
       if (mCount >= 0){
        containerWrapperRef.current.children[mCount].scrollIntoView({behavior: "smooth"})
       } else {
        console.log("First Page!")
       }
    }

    const OnNext = function(){
        const mCount = count+1
        if (mCount < containerWrapperRef.current.children.length){
            containerWrapperRef.current.children[mCount].scrollIntoView({behavior: "smooth"})
        } else {
            console.log("Last Page!")
        }
    }
    
    return <>
        <Stack>
            <div className="indicators">
                <Button onClick={OnPrev}>
                    <Typography>Prev</Typography>
                </Button>
                <Box sx={{ alignSelf: 'center' }}>
                    <Typography  variant="subTitle" noWrap >{title}</Typography>
                </Box>
                <Button onClick={OnNext}>
                    <Typography>Next</Typography>
                </Button>
            </div>
            <div ref={containerWrapperRef} className="slides-container" style={{ height: `${dimens.height * 0.7}px` }} >
                {children.map((item, i) =>
                    <div key={item.fileThumbnailId} ref={addNode} className='slide' style={{ height: `${dimens.height * 0.8}px` }} >
                        <img src={item.file_path} style={{ width: '100%', height: 'auto' }} />
                    </div>
                )}
            </div>
        </Stack>
    </>
}


const HomeSliderView = function ({ children }) {


    return <>
        <Container maxWidth={false}>
            <CarouselView children={children}></CarouselView>
        </Container>
    </>
}


export default HomeSliderView