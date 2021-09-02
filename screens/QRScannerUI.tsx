import React, { useState, FC } from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import { useEffect } from 'react';
import { Camera } from 'expo-camera';

type ModalProps = {
  visible: boolean;
  onScanned: (value: string) => void;
  onClose: () => void;
  pos: [number, number];
}

const QRScannerUI: FC<ModalProps> = (props) => {
  const {visible, onScanned, onClose, pos} = props;
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  //const [scanned, setScanned] = useState(false);

  const onBarCodeScanned = (result: BarCodeScannerResult) => {
    onScanned(result.data);
    onClose();
  };

  

  return (<>
      {visible && <View style={{...styles.centeredView}} >
        <View style={styles.modalView}>
          {hasPermission === undefined && <Text>Wait...</Text>}
          {!hasPermission && <Text>No access to camera</Text>}
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={onBarCodeScanned}
            style={styles.absoluteFillObject}

          />
          <View style={styles.QR}>
            <Image style={styles.tinyLogo} source={require('../assets/QR.png')} width={300} height={300}/>
            
          </View>
        </View>
      </View>}
  </>)
}

const styles = StyleSheet.create({
  centeredView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  modalView: {
    margin: 0,
    backgroundColor: 'black',
    borderRadius: 0,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    height: '50%',
    position:'relative',
    overflow: 'hidden',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  absoluteFillObject: {
    position: 'absolute',
    top: "-200%",
    bottom: "-200%",
    left: 0,
    right: 0,
  },
  QR: {
    display: 'flex',
    justifyContent: 'center',
  },
  tinyLogo: {
  }
});

export default QRScannerUI;