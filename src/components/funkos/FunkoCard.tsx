import { Funko } from '@/database/schema';
import { GlassView } from 'expo-glass-effect';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

export type FunkoCardProps = Pick<Funko, 'id' | 'name' | 'image_path'> & {

}

export const FunkoCard = (props: FunkoCardProps) => {
  return (
    <Pressable style={styles.container} onPress={() => {}}>
      <GlassView style={styles.cardContainer}>
        <Image source={{ uri: props.image_path }} style={styles.image} />
        <Text style={styles.text}>{props.name}</Text>
      </GlassView>
    </Pressable>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  cardContainer: {
    marginHorizontal: 10,
    backgroundColor: '#f5c2834e',
    height: 120,
    flex: 0.5,
    marginBottom: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    
    marginBottom: 10,
  }
});
