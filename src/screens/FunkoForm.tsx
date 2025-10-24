import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useCreateFunko } from '@/hooks/useFunkos';
import { images } from '@/services/images';

export default function FunkoForm() {
  const [name, setName] = useState('');
  const [series, setSeries] = useState('');
  const [imagePath, setImagePath] = useState<string | null>(null);
  
const createFunko = useCreateFunko({
    onSuccess: () => {
        Alert.alert('Success', 'Funko added successfully!');
        setName('');
        setSeries('');
        setImagePath(null);
    },
    onError: (error: unknown) => {
        Alert.alert('Error', (error as Error).message || 'Failed to add Funko');
    },
});

  const handlePickImage = async () => {
    try {
      const path = await images.pickImageFromLibrary();
      setImagePath(path);
    } catch (error) {
      Alert.alert('Error', (error as Error).message || 'Failed to pick image');
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!name.trim() || !series.trim()) {
      Alert.alert('Validation Error', 'Please enter both the Funko name and series.');
      return;
    }

    createFunko.mutate({
      name,
      series,
      number: '001',
      category: 'Pop!',
      condition: 'mint',
      image_path: imagePath || undefined,
    });
  };

  return (
    <View>
      <TextInput placeholder="Funko name" value={name} onChangeText={setName} />
      <TextInput placeholder="Series" value={series} onChangeText={setSeries} />
      <Button title="Pick Image" onPress={handlePickImage} />
      <Button title="Add Funko" onPress={handleSubmit} />
    </View>
  );
}