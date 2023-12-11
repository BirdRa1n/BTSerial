/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Box,
  Center,
  ChevronRightIcon,
  HStack,
  Heading,
  Icon,
  Link,
  LinkText,
  useColorMode,
  Text,
} from '@gluestack-ui/themed';
import {useEffect, useState, useRef} from 'react';
import {SafeAreaView} from 'react-native';
import SearchingAnimation from '../components/searchingAnimation';
import {Modalize} from 'react-native-modalize';

interface HomeProps {
  navigation: any;
}

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  Pressable,
} from 'react-native';

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DeviceDetailsModel from '../components/deviceDetailsModal';

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

const Home: React.FC<HomeProps> = ({navigation}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const [serialDataList, setSerialDataList] = useState<string[]>([]); // ou qualquer tipo adequado
  const [connectedDevice, setConnectedDevice] = useState<{
    name: string;
    uuid: string;
  } | null>(null);

  const [lastValueSerial, setLastValueSerial] = useState('');

  const modalRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalRef.current?.open();
  };
  const onClose = () => {
    modalRef.current?.close();
  };

  const startScan = () => {
    if (!isScanning) {
      setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {})
          .catch((err: any) => {});
      } catch (error) {}
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    setPeripherals(map => {
      let p = map.get(event.peripheral);
      if (p) {
        p.connected = false;
        return new Map(map.set(event.peripheral, p));
      }
      return map;
    });
  };

  const handleConnectPeripheral = (event: any) => {};

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
    const receivedString = String.fromCharCode.apply(null, data.value);

    if (receivedString === '1') {
    }
  };
  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }

    setConnectedDevice({
      name: peripheral.name,
      uuid: peripheral.id,
    });

    setPeripherals(map => {
      return new Map(map.set(peripheral.id, peripheral));
    });
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (peripheral && peripheral.connected) {
      try {
        await BleManager.disconnect(peripheral.id);
      } catch (error) {}
    } else {
      setConnecting(true);
      await connectPeripheral(peripheral);
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        await sleep(100);

        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.descriptors) {
              for (let descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] ${characteristic.service} ${characteristic.characteristic} ${descriptor.uuid} descriptor read as:`,
                    data,
                  );

                  BleManager.startNotification(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                  )
                    .then(() =>
                      console.debug(
                        `Started notification for ${peripheral.id}`,
                      ),
                    )
                    .catch(error =>
                      console.error(`Failed to start notification: ${error}`),
                    );

                  bleManagerEmitter.addListener(
                    'BleManagerDidUpdateValueForCharacteristic',
                    (data: BleManagerDidUpdateValueForCharacteristicEvent) => {
                      /*
                      console.debug(
                        `[connectPeripheral][${peripheral.id}] received data: ${data.value}`,
                      );
                      */

                      const receivedString = String.fromCharCode.apply(
                        null,
                        data.value,
                      );

                      const filteredString = receivedString.replace(
                        /[\r\n]/g,
                        '',
                      );
                      console.debug(filteredString);

                      setSerialDataList(prevList => [
                        ...prevList,
                        filteredString,
                      ]);
                      setConnecting(false);
                      onOpen();

                      setLastValueSerial(filteredString);
                    },
                  );
                } catch (error) {}
              }
            }
          }
        }

        setPeripherals(map => {
          let p = map.get(peripheral.id);
          if (p) {
            p.rssi = rssi;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };
  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  function removerEspacos(str: string): string {
    if (typeof str !== 'string') {
      return 'NO NAME';
    }

    // Utiliza o método replace para substituir todos os espaços por uma string vazia
    return str.replace(/\s/g, '');
  }

  useEffect(() => {
    try {
      BleManager.start({showAlert: false})
        .then(() => {
          startScan();
        })
        .catch((error: any) =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
      bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        handleConnectPeripheral,
      ),
    ];

    handleAndroidPermissions();

    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
        } else {
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
            } else {
            }
          });
        }
      });
    }
  };

  const renderItem = ({item}: {item: Peripheral}) => {
    const name: string = String(item.name);
    const localName = item?.advertising?.localName
      ? String(` - ${item?.advertising?.localName}`)
      : '';
    return (
      <Pressable onPress={() => togglePeripheralConnection(item)}>
        <Box
          bg="#F8F9FA"
          sx={{_dark: {bg: item.connecting ? '#262626' : '#171717'}}}
          p={10}
          borderRadius={10}>
          <HStack justifyContent="space-between">
            <Box>
              <Heading fontSize={'$lg'}>
                {name}
                {localName}
              </Heading>
              <Text fontSize={'$sm'}>{item.id}</Text>
            </Box>
            <Center>
              <Icon as={ChevronRightIcon} m="$2" w="$4" h="$4" />
            </Center>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  const renderContent = () => {
    return (
      <>
        <DeviceDetailsModel
          onClose={onClose}
          onOpen={onOpen}
          connectedDevice={connectedDevice || {name: '', uuid: ''}}
          serialDataList={serialDataList}
          setSerialDataList={setSerialDataList}
        />
      </>
    );
  };

  return (
    <GestureHandlerRootView>
      <Box w={'100%'} h={'100%'} bg="white" sx={{_dark: {bg: 'black'}}} p={5}>
        <SafeAreaView>
          <HStack justifyContent="space-between">
            <Heading fontSize={'$2xl'}>Search Devices</Heading>
          </HStack>

          <Box w={'100%'} h={'95%'}>
            {isScanning || connecting ? (
              <Center h={'100%'}>
                <SearchingAnimation />

                {connecting ? (
                  <>
                    <Text>Connecting...</Text>
                  </>
                ) : (
                  <>
                    <Text>Searching for devices...</Text>
                  </>
                )}
              </Center>
            ) : (
              <>
                <Text marginBottom={15}>Devices Detected</Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  data={Array.from(peripherals.values())}
                  contentContainerStyle={{rowGap: 12}}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  style={{padding: 10}}
                />

                <Center>
                  <Link>
                    <LinkText color="black" sx={{_dark: {color: 'white'}}}>
                      Build by BirdRa1n
                    </LinkText>
                  </Link>
                </Center>
              </>
            )}
          </Box>
        </SafeAreaView>
        <Modalize
          modalStyle={{
            backgroundColor: useColorMode() === 'dark' ? '#171717' : 'white',
          }}
          adjustToContentHeight
          ref={modalRef}
          onClose={() => {
            BleManager.disconnect(connectedDevice?.uuid || '');
          }}>
          {renderContent()}
        </Modalize>
      </Box>
    </GestureHandlerRootView>
  );
};
export default Home;
