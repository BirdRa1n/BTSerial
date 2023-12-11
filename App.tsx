import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import React from 'react';
import {useColorScheme} from 'react-native';
import StackNavigation from './src/router/stack.navigation';
import {Host} from 'react-native-portalize';

export default function App() {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  return (
    <Host>
      <GluestackUIProvider
        config={config}
        colorMode={isDarkMode ? 'dark' : 'light'}>
        <StackNavigation />
      </GluestackUIProvider>
    </Host>
  );
}
