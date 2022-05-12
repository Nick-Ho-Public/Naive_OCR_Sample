import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  View,
  ScrollView,
} from 'react-native';
import {NativeBaseProvider, Button} from 'native-base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import MlkitOcr from 'react-native-mlkit-ocr';

const App = () => {
  return <OCR />;
};

const OCR = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);

  useEffect(() => {
    (async () => {
      if (image === null) {
        return;
      }
      const result = await MlkitOcr.detectFromUri(image);
      let text = '';
      result.map(item => {
        text = text + item.text + ' ';
      });
      setOcrResult(text);
    })();
  }, [image]);

  return (
    <NativeBaseProvider>
      <Button alignItems="center">OCR sample!</Button>
      <SafeAreaView style={styled(isDarkMode, 'SafeAreaView')}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={styled(isDarkMode, 'ScrollView')}>
          <TouchableOpacity
            style={styled(isDarkMode, 'TouchableOpacity')}
            onPress={async () => {
              launchCamera({}, rsp => {
                if (rsp.didCancel || rsp.errorCode) {
                  setImage(null);
                  return;
                }
                setImage(rsp.assets[0].uri);
              });
            }}>
            <Text style={styled(isDarkMode, 'Text')}>Take a photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styled(isDarkMode, 'TouchableOpacity')}
            onPress={async () => {
              launchImageLibrary({}, rsp => {
                if (rsp.didCancel || rsp.errorCode) {
                  setImage(null);
                  return;
                }
                setImage(rsp.assets[0].uri);
              });
            }}>
            <Text style={styled(isDarkMode, 'Text')}>Pick a Photo</Text>
          </TouchableOpacity>
        </ScrollView>
        {!!image && (
          <View style={styled(isDarkMode, 'View')}>
            <Image style={styled(isDarkMode, 'Image')} source={{uri: image}} />
            <Text style={styled(isDarkMode, 'Text')}>{ocrResult}</Text>
          </View>
        )}
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

const colors = StyleSheet.create({
  lighter: '#F3F3F3',
  darker: '#222',
  lightBlue: '#0999CE',
  darkBlue: '#2950CE',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    padding: 50,
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 2,
  },
  text: {
    fontSize: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    padding: 50,
  },
  lightMode: {
    backgroundColor: colors.lighter,
    color: colors.darker,
  },
  darkMode: {
    backgroundColor: colors.darker,
    color: colors.lighter,
  },
});

const styled = (isDarkMode, tag) => {
  const mode = isDarkMode ? styles.darkMode : styles.lightMode;
  const styledComponents = {
    SafeAreaView: [styles.container, mode],
    ScrollView: [styles.container, mode],
    TouchableOpacity: [styles.block, mode],
    View: [styles.block, mode],
    Text: [styles.text, mode],
    Image: [styles.image],
  };
  return styledComponents[tag];
};

export default App;
