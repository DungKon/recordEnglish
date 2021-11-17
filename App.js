import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import Voice from '@react-native-voice/voice';
import { FontAwesome } from "@expo/vector-icons";

const App = () => {

  const [result, setResult] = useState('')
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    permisionsVoice()
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  const permisionsVoice = async () => {
    //replace your function with this code.
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for record audio',
            message: 'Give permission to your device to record audio',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('permission granted');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  }

  const onSpeechStartHandler = (e) => {
    console.log("start handler==>>>", e)
  }
  const onSpeechEndHandler = (e) => {
    setLoading(false)
    console.log("stop handler", e)
  }

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0]
    setResult(text)
    console.log("speech result handler", e)
  }

  const startRecording = async () => {
    setLoading(true)
    try {
      await Voice.start('en-Us')
    } catch (error) {
      console.log("error raised", error)
    }
  }

  const stopRecording = async () => {
    setLoading(false)
    try {
      await Voice.stop()
    } catch (error) {
      console.log("error raised", error)
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>{result}</Text>
      </View>
      <View style={styles.speech}>
        <TouchableOpacity style={styles.btn_speech} onPress={startRecording}>
          {isLoading ? <ActivityIndicator size="large" color="white" /> :
            <FontAwesome name="microphone" size={35} color="white" />
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            backgroundColor: 'red',
            padding: 8,
            borderRadius: 4,
            marginTop:20
          }}
          onPress={stopRecording}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 26
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 48,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4
  },
  content: {
    flex: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },

  speech: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },

  btn_speech: {
    width: 100,
    height: 100,
    backgroundColor: '#4267b2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  }
});

export default App;