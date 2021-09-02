import React, {useState, FC, useRef} from 'react';
import {View, Text, Modal, StyleSheet, Image, Button, TouchableOpacity} from 'react-native';
import {BarCodeScanner, BarCodeScannerResult} from 'expo-barcode-scanner';
import { useEffect } from 'react';
import {Camera, CameraCapturedPicture} from 'expo-camera';

type ModalProps = {
  visible: boolean;
  onShoot: (value: Array<CameraCapturedPicture>) => void;
  onClose: () => void;
  minShots?: number;
}

const CameraView: FC<ModalProps> = (props) => {
  const {visible, onShoot, onClose, minShots = 2 } = props;
  const [hasPermission, setHasPermission] = useState<boolean | undefined>();
  const [reaady, setReady] = useState<boolean>(false);
  const [pics, setPics] = useState<Array<CameraCapturedPicture>>([]);
  const [waiting, setWaiting] = useState<boolean>(false)
  const [pictureSizes, setPictureSizes] = useState<Array<string>>([])

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    (async () => {
      // setPictureSizes(await cameraRef.current?.getAvailablePictureSizesAsync() || []);
      console.log('sizes', await cameraRef.current?.getAvailablePictureSizesAsync('16:9'))
    })();

    return () => {
      setPics([]);

    }

  }, []);

  useEffect(() => {
    console.log(pictureSizes);
  }, [pictureSizes])


  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const cameraRef = useRef<Camera>(null);

  const onSnap = () => {
    setWaiting(true);
    if(!cameraRef.current || !reaady) return
    cameraRef.current.takePictureAsync({base64: true}).then((picture) => {
      setPics([...pics, picture]);
      setWaiting(false);
    })
  }

  const onDone = () => {
    onShoot(pics);
    onClose();
    setPics([]);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {hasPermission === undefined && <Text>Wait...</Text>}
          {!hasPermission && <Text>No access to camera</Text>}
          <Camera
            ratio={'16:9'}
            pictureSize={'1280x720'}
            autoFocus
            style={styles.absoluteFillObject}
            ref={cameraRef}
            onCameraReady={() => setReady(true)}
          />
          <View style={styles.QR}>
            <Text style={{color: 'white', textAlign: 'center', paddingBottom: 10}}>{`Необходимо сделать ${minShots} фото с разных ракурсов`}</Text>
            <TouchableOpacity style={{...styles.shotButton, backgroundColor: waiting ? 'darkred' : 'red' }} onPress={onSnap} >
              <Text style={{color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold'}}>{`${pics.length}`}</Text>
            </TouchableOpacity>
            <Button disabled={pics.length < minShots} title={'Завершить'} onPress={onDone} />
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
    paddingBottom: 100,
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
    height: '100%',
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  QR: {
    bottom: 35,
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  shotButton: {
    borderRadius: 30,
    height: 60,
    width: 60,
    color: 'white',
    backgroundColor: 'red',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    marginBottom: 40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tinyLogo: {
    width: '100%',
    height: '100%',
  }
});

export default CameraView;