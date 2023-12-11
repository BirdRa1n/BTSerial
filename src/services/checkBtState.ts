import BleManager from 'react-native-ble-manager';

const CheckBtState = (setBtState: any): boolean => {
    BleManager.checkState().then((state) =>
        console.log(`current BLE state = '${state}'.`)
    );
    return true
}

export default CheckBtState