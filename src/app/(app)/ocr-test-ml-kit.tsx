import TextRecognition from '@react-native-ml-kit/text-recognition';
import { type Asset, useAssets } from 'expo-asset';
import { documentDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

// import { getTestImageAssets } from '@/api/ocr/test';
// import {
// } from '@/api/ocr/test';
import { Button, Text } from '@/components/ui';

interface TestResult {
  imageId: string;
  recognizedText: string;
  processingTime: number;
  blockCount: number;
}

// eslint-disable-next-line max-lines-per-function
export default function OCRTestScreen() {
  // const getTestImageAssets = () => [
  //   require('../../assets/reciepts/001.jpg'),
  //   require('../../assets/reciepts/002.jpg'),
  //   require('../../assets/reciepts/003.jpg'),
  //   require('../../assets/reciepts/004.jpg'),
  //   require('../../assets/reciepts/005.jpg'),
  //   require('../../assets/reciepts/006.jpg'),
  //   require('../../assets/reciepts/007.jpg'),
  //   require('../../assets/reciepts/008.jpg'),
  //   require('../../assets/reciepts/009.jpg'),
  //   require('../../assets/reciepts/010.jpg'),
  // ];
  // const imageUris = getTestImageAssets();
  // const [status, requestPermission] = MediaLibrary.usePermissions();
  const [assets, _error] = useAssets([
    require('../../../assets/reciepts/000.jpg'),
    require('../../../assets/reciepts/001.jpg'),
    require('../../../assets/reciepts/002.jpg'),
    require('../../../assets/reciepts/003.jpg'),
    require('../../../assets/reciepts/004.jpg'),
    require('../../../assets/reciepts/005.jpg'),
    require('../../../assets/reciepts/006.jpg'),
    require('../../../assets/reciepts/007.jpg'),
    require('../../../assets/reciepts/008.jpg'),
    require('../../../assets/reciepts/009.jpg'),
    require('../../../assets/reciepts/010.jpg'),
  ]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunTests = async () => {
    // // Make sure you have permission
    // if (!status?.granted) {
    //   const response = await requestPermission();
    //   if (!response.granted) {
    //     alert('Permission required to access external storage.');
    //     return;
    //   }
    // }
    setIsProcessing(true);
    setResults([]);

    try {
      if (!assets) {
        return;
      }
      const testResults = await runBatchTest(assets);
      setResults(testResults);

      alert(`Testing complete! Processed ${testResults.length} images.`);
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed. Check console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4">OCR Performance Testing</Text>

      <Button
        label={isProcessing ? 'Processing...' : 'Run Batch Test'}
        onPress={handleRunTests}
        disabled={isProcessing}
        className="mb-4"
      />

      {isProcessing && (
        <View className="mb-4 items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2">Processing images...</Text>
        </View>
      )}

      {results.length > 0 && (
        <ScrollView className="flex-1">
          <Text className="mb-2">Results: {results.length} images</Text>

          {results.map((result, index) => (
            <View
              key={index}
              className="mb-4 rounded border border-gray-300 p-3"
            >
              {/* <Text className="font-bold">{result.imageId}</Text> */}
              <Text className="text-sm text-gray-600">
                Time: {result.processingTime}ms | Blocks: {result.blockCount}
              </Text>
              <Text className="min-h-screen font-bold">
                {result.recognizedText}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const runBatchTest = async (imageUris: Asset[]): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  console.log(`Starting batch test with ${imageUris.length} images...`);

  for (let i = 0; i < imageUris.length; i++) {
    const asset = imageUris[i];
    const startTime = Date.now();

    try {
      const result = await TextRecognition.recognize(asset.uri);
      const processingTime = Date.now() - startTime;

      results.push({
        imageId: asset.uri.split('/').pop() || `image_${i}`,
        recognizedText: result.text,
        processingTime,
        blockCount: result.blocks.length,
      });

      console.log(
        `✓ Processed ${i + 1}/${imageUris.length}: ${asset.uri.split('/').pop()} (${processingTime}ms)`
      );
    } catch (error) {
      console.error(`✗ Error processing ${asset.uri}:`, error);

      results.push({
        imageId: asset.uri.split('/').pop() || `image_${i}`,
        recognizedText: `ERROR: ${error}`,
        processingTime: Date.now() - startTime,
        blockCount: 0,
      });
    }
  }

  // Save results
  try {
    const resultsPath = `${documentDirectory}ml_kit_results.json`;
    await writeAsStringAsync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n✓ Results saved to: ${resultsPath}`);
    console.log(`Total images processed: ${results.length}`);

    const avgTime =
      results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;
    console.log(`Average processing time: ${avgTime.toFixed(2)}ms`);
  } catch (error) {
    console.error('Error saving results:', error);
  }

  return results;
};
