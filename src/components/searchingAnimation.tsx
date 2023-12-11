import {Box} from '@gluestack-ui/themed';
import LottieView from 'lottie-react-native';

const SearchingAnimation = () => {
  return (
    <Box w={200} h={200}>
      <LottieView
        source={require('../../Assets/lottie-animations/bt-find.json')}
        style={{width: '100%', height: '100%'}}
        autoPlay
        loop
      />
    </Box>
  );
};

export default SearchingAnimation;
