/* eslint-disable react/react-in-jsx-scope */
import {Box, Center} from '@gluestack-ui/themed';
import LottieView from 'lottie-react-native';
import {useRef, useEffect} from 'react';

interface SplashProps {
  navigation: any;
}

const Splash: React.FC<SplashProps> = ({navigation}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
    setTimeout(() => {
      animationRef.current?.reset();
    }, 1600);
  }, []);

  return (
    <Center h={'100%'} bg="white" sx={{_dark: {bg: 'black'}}}>
      <Box w={200} h={200}>
        <LottieView
          ref={animationRef}
          source={require('../../Assets/lottie-animations/splash.json')}
          onAnimationFinish={() => {
            navigation.navigate('home');
          }}
          style={{width: '100%', height: '100%'}}
        />
      </Box>
    </Center>
  );
};

export default Splash;
