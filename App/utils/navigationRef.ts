import { RootStackParams } from '@App/types/navigation';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParams>();

export function navigate<T extends keyof RootStackParams>(
  name: T,
  params?: RootStackParams[T]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
