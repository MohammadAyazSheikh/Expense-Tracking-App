import { FadeInDown, FadeOut, LinearTransition } from "react-native-reanimated";

export const DAMPING = 90
export const EnteringAnimation = FadeInDown.springify().damping(DAMPING);
export const ExitingAnimation = FadeOut.springify().damping(DAMPING);
export const LayoutAnimation = LinearTransition.springify().damping(DAMPING);