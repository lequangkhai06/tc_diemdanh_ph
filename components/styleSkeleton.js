import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  // search
  header: {
    width: '100%',
    height: 60,
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  photo: {
    width: 65,
    height: 65,
    borderRadius: 25,
  },
  name: {
    width: '40%',
    height: 40,
    borderRadius: 4,
  },
  containerIcons: {
    flexDirection: 'row',
  },
  icons: {
    width: 20,
    height: 20,
    borderRadius: 100,
    marginHorizontal: 5,
  },
  lineCard: {
    width: '100%',
    height: 2,
  },
});

export default styles;
