import React, { useState, FC } from 'react';
import { View, Modal, StyleSheet, Image } from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';

type ModalProps = {
  visible: boolean
  onScanned: (value: string) => void
  onClose: () => void
}

const QRScanner: FC<ModalProps> = (props) => {
  const {visible, onScanned, onClose} = props;

  const [scanned, setScanned] = useState(false);
  const onBarCodeScanned = (result: BarCodeScannerResult) => {
    onScanned(result.data);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView} onTouchEnd={onClose}>
        <View style={styles.modalView}>
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={onBarCodeScanned}
            style={styles.absoluteFillObject}
          />
          <View style={styles.QR}>
            <Image style={styles.tinyLogo} source={require('../assets/QR.png')} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modalView: {
    margin: 0,
    backgroundColor: 'white',
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
    top: -200,
    bottom: -200,
    left: 0,
    right: 0,
  },
  QR: {
    top: 35,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
  }
});

export default QRScanner;