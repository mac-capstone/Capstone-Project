import { Octicons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoogleGenAI } from '@google/genai';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router, Stack } from 'expo-router';
import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import {
  Button,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';
import { white } from '@/components/ui/colors';
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

  // Loading permission state
  if (!permission) return <View />;
  // Not granted UI
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
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
      // 1. Take a photo and get base64 data for upload
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      const base64Image = photo.base64;
      // 2. Send POST to Gemini
      const geminiApiKey = 'AIzaSyB-e1mHwUNsdjnqPp2Z-nel4M-6JRsF4Vg'; // Replace with your API key, or load from env
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const contents = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `You are an OCR model specialized in restaurant receipts. Extract only the items ordered (dish names) and their prices. Return the results as a JSON array of objects, each with keys "dish" and "price", like this: [{"dish": "Chicken Curry", "price": "$12.99"}, {"dish": "Spring Rolls", "price": "$5.50"}]`,
        },
      ];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: contents,
      });
      console.log(response.text);
    } catch (err) {
      alert('Failed to process image: ' + err.message);
    }
  }

  return (
    <View className="flex-[1]">
      <View className="flex-row items-center justify-between">
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
        <View className="flex-row items-center justify-between px-4 py-2">
          <Text className="flex-1 text-center font-futuraBold text-4xl dark:text-text-50">
            Receipt Camera
          </Text>
        </View>
      </View>
      <View className="w-11/12 flex-row items-center justify-between self-center rounded-2xl bg-background-900 px-6 py-5">
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
      </View>
      <View className="flex-[1] items-center justify-center p-2">
        <View className="aspect-[3/4] w-11/12">
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
          />
        </View>
      </View>
      <View className="justify-center px-5 py-10 pt-2">
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
      </View>
    </View>
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
