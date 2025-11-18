import { Octicons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text as RText,
  View as RView,
} from 'react-native';

import { extractReceiptInfo } from '@/api/camera-receipt/camera-receipt-api';
import {
  Button,
  Pressable,
  Text as CustomText,
  TouchableOpacity,
  View as CustomView,
} from '@/components/ui';
import colors, { white } from '@/components/ui/colors';
import { useThemeConfig } from '@/lib/use-theme-config';

export default function CameraViewComponent() {
  // theme of the screen
  const theme = useThemeConfig();
  // Camera direction state
  const [facing, setFacing] = useState<CameraType>('back');
  // Camera flash state
  const [flash, setFlash] = useState<'on' | 'off'>('off');
  // Permission state & trigger
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [loading, setLoading] = useState(false);

  // Loading permission state
  if (!permission) return <CustomView />;
  // Not granted UI
  if (!permission.granted) {
    return (
      <CustomView style={styles.container}>
        <CustomText style={styles.message}>
          We need your permission to show the camera
        </CustomText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <CustomText style={styles.text}>Grant Permission</CustomText>
        </TouchableOpacity>
      </CustomView>
    );
  }

  // Flip camera
  function toggleCameraFacing() {
    setFacing(facing === 'back' ? 'front' : 'back');
  }
  // Flash camera
  function toggleFlash() {
    setFlash(flash === 'off' ? 'on' : 'off');
  }

  function getFlashIconProps() {
    if (flash === 'off') {
      return 'flash-off-outline';
    } else {
      return 'flash-outline'; // Gold/yellow when on
    }
  }
  // Get icon properties for current flash mode
  const flashIcon = getFlashIconProps();

  async function handleCapture() {
    if (!cameraRef.current) return;
    try {
      setLoading(true);
      // 1. Take a photo and get base64 data for upload
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.4,
      });

      const base64Image = photo.base64;
      // 2. Send POST to Gemini
      const result = await extractReceiptInfo(base64Image);
      console.log(result);
      setLoading(false);
    } catch (err) {
      alert('Failed to process image: ' + err.message);
    }
  }

  return (
    <RView className="flex-1">
      <Modal visible={loading} transparent animationType="fade">
        <RView
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'absolute', // <--- makes it overlay
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
          }}
        >
          <RView
            style={{
              backgroundColor: colors.background[950],
              padding: 24,
              borderRadius: 16,
              alignItems: 'center',
              minWidth: 220,
              elevation: 8,
            }}
          >
            <ActivityIndicator size="large" color="white" />
            <RText
              style={{
                marginTop: 12,
                fontWeight: 'bold',
                fontSize: 16,
                color: white,
              }}
            >
              Uploading and processing...
            </RText>
          </RView>
        </RView>
      </Modal>
      <CustomView className="flex-row items-center justify-between">
        <Stack.Screen
          options={{
            title: '',
            headerShadowVisible: false,
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: 'bold',
            },
            headerLeft: () => (
              <Pressable onPress={() => router.back()}>
                <Octicons
                  className="mr-2"
                  name="x"
                  color={theme.dark ? 'white' : 'black'}
                  size={24}
                />
              </Pressable>
            ),
          }}
        />
        <CustomView className="flex-row items-center justify-between px-4 py-2">
          <CustomText className="flex-1 text-center font-futuraBold text-4xl dark:text-text-50">
            Receipt Camera
          </CustomText>
        </CustomView>
      </CustomView>
      <CustomView className="w-11/12 flex-row items-center justify-between self-center rounded-2xl bg-background-900 px-6 py-5">
        <Pressable
          className="items-center justify-center"
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse-outline" size={24} color="white" />
        </Pressable>
        <Pressable
          className="items-center justify-center"
          onPress={toggleFlash}
        >
          <Ionicons name={flashIcon} size={24} color="white" />
        </Pressable>
      </CustomView>
      <CustomView className="flex-1 items-center justify-center p-2">
        <CustomView className="aspect-[3/4] w-11/12">
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
          />
        </CustomView>
      </CustomView>
      <CustomView className="justify-center px-5 py-10 pt-2">
        <Button
          className="min-h-12"
          label="Capture Reciept"
          icon={<Ionicons name="camera-reverse-outline" size={20} />}
          onPress={() => {
            handleCapture();
          }}
        />
        <Button
          className="min-h-12"
          label="Enter Manually"
          icon={<Ionicons name="pencil-outline" size={20} color={white} />}
          onPress={() => {
            router.back();
          }}
          variant="outline"
        />
      </CustomView>
    </RView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    borderRadius: 12, // Optional: make corners rounded
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 12,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
  },
});
