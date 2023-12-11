/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import {Button, ButtonText, Heading} from '@gluestack-ui/themed';
import {Box, ScrollView, Text} from '@gluestack-ui/themed';

interface DeviceDetailsModelProps {
  onOpen: any;
  onClose: any;
  setSerialDataList: any;
  serialDataList: {};
  connectedDevice: {
    name: string;
    uuid: string;
  };
}

const DeviceDetailsModel: React.FC<DeviceDetailsModelProps> = ({
  onOpen,
  onClose,
  serialDataList,
  connectedDevice,
  setSerialDataList,
}) => {
  return (
    <>
      <Box w={'100%'} p={10}>
        <Heading>{connectedDevice?.name.trim()}</Heading>
        <Text isTruncated marginBottom={15}>
          {connectedDevice?.uuid}
        </Text>
        <Text>Log Serial</Text>
        <Box padding={15}>
          <Box
            w={'100%'}
            h={135}
            borderColor="$borderLight300"
            sx={{
              _dark: {
                borderColor: '$borderDark600',
              },
            }}
            borderWidth={1}
            marginBottom={15}
            borderRadius={5}>
            <ScrollView p={10}>
              {serialDataList?.map((item: string, index: number) => {
                return (
                  <Box key={index}>
                    <Text> - {item}</Text>
                  </Box>
                );
              })}
            </ScrollView>
          </Box>
          <Button
            onPress={() => {
              setSerialDataList([]);
            }}
            marginBottom={35}>
            <ButtonText>Limpar Logs</ButtonText>
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default DeviceDetailsModel;
