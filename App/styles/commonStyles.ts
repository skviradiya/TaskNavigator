import colors from '@App/constants/colors';
import {StyleSheet} from 'react-native';

const commonStyles = StyleSheet.create({
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    shadowColor: colors.primary,
  },
});
export default commonStyles;
