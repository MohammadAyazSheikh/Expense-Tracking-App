import { useCallback, useEffect, useState } from 'react';
import {
    Keyboard,
    TextInput,
    UIManager,
    findNodeHandle,
    KeyboardEvent,
    NativeSyntheticEvent,
    TextInputFocusEventData,
    Dimensions,
} from 'react-native';
import {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useKeyboardStore } from '../store';
import { useUnistyles } from 'react-native-unistyles';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const EXTRA_OFFSET = 50;

export function useRegisterFocusedInput() {

    const setFocusedInput = useKeyboardStore(
        (s) => s.setFocusedInput
    );

    const onFocus = useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            const node = findNodeHandle(e.target);

            if (!node) return;

            UIManager.measure(
                node,
                (
                    _x,
                    _y,
                    _w,
                    height,
                    _px,
                    pageY
                ) => {
                    setFocusedInput({ pageY, height });
                }
            );
        },
        [setFocusedInput]
    );

    const onBlur = useCallback(() => {
        setFocusedInput(null);
    }, [setFocusedInput]);

    return { onFocus, onBlur };
}



export function useKeyboardAwareTranslateYAnimated(
    extraOffset: number = 16,
    duration: number = 250
) {
    const translateY = useSharedValue<number>(0);

    const measureAndUpdate = (e: KeyboardEvent) => {
        const focusedInput =
            TextInput.State.currentlyFocusedInput?.();

        if (!focusedInput) {
            translateY.value = withTiming(0, { duration });
            return;
        }

        const keyboardTopY = e.endCoordinates.screenY;
        const node = findNodeHandle(focusedInput);

        if (!node) {
            translateY.value = withTiming(0, { duration });
            return;
        }

        UIManager.measure(
            node,
            (
                _x: number,
                _y: number,
                _width: number,
                height: number,
                _pageX: number,
                pageY: number
            ) => {
                const inputBottomY = pageY + height;

                if (inputBottomY > keyboardTopY) {
                    const overlap =
                        inputBottomY - keyboardTopY + extraOffset;

                    translateY.value = withTiming(-overlap, { duration });
                } else {
                    translateY.value = withTiming(0, { duration });
                }
            }
        );
    };

    useEffect(() => {
        const showSub = Keyboard.addListener(
            'keyboardDidShow',
            measureAndUpdate
        );

        const frameSub = Keyboard.addListener(
            'keyboardDidChangeFrame',
            measureAndUpdate
        );

        const hideSub = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                translateY.value = withTiming(0, { duration });
            }
        );

        return () => {
            showSub.remove();
            frameSub.remove();
            hideSub.remove();
        };
    }, [duration, extraOffset]);

    return translateY;
}


export const useKeyboardAnimatedOffsetStyle = () => {

    const { rt } = useUnistyles();
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    const focusedInput = useKeyboardStore((state) => state.focusedInput);

    useEffect(() => {
        const showSub = Keyboard.addListener(
            'keyboardDidShow',
            () => setIsKeyboardOpen(true)
        );

        const hideSub = Keyboard.addListener(
            'keyboardDidHide',
            () => setIsKeyboardOpen(false)
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);


    return useAnimatedStyle(() => {

        const keyboardHeight = rt.insets.ime ?? 0;

        const keyboardTopY = SCREEN_HEIGHT - keyboardHeight;

        if (!focusedInput || keyboardHeight === 0) {
            return {
                transform: [{ translateY: withTiming(0) }],
            };
        }

        const inputBottomY = focusedInput.pageY + focusedInput.height + 100;

        if (inputBottomY > keyboardTopY) {
            const overlap = inputBottomY - keyboardTopY + EXTRA_OFFSET;

            return {
                transform: [{ translateY: withTiming(-overlap) }],
            };
        }
        if (!isKeyboardOpen) {
            return {
                transform: [{ translateY: withTiming(0) }],
            };
        }
        return {
            transform: [{ translateY: withTiming(0) }],
        };
    }, [focusedInput, rt.insets.ime, isKeyboardOpen]);


}
