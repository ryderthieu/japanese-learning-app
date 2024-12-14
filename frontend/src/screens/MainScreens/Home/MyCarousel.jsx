import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const MyCarousel = () => {
    const width = Dimensions.get('window').width;
    const imageData = [
        require('../../../assets/images/home/slide1.png'),
        require('../../../assets/images/home/slide2.png'),
        require('../../../assets/images/home/slide3.png'),
        require('../../../assets/images/home/slide4.png'),
        require('../../../assets/images/home/slide5.png'),
    ];
    return (
        <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                data={imageData}
                scrollAnimationDuration={1000}
                // onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>
                            {index}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

export default MyCarousel;