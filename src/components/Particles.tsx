import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// 1. Define Props Interface
interface ParticleProps {
  symbol?: string;
  onComplete?: () => void;
  initial?: boolean;
}

const Particle = ({ 
  symbol = "🌸", 
  onComplete, 
  initial = false 
}: ParticleProps) => {
  // 2. Animation Refs
  const fallAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // 3. Randomized State (Calculated once on mount)
  const [size] = useState(Math.random() * 20 + 15);
  const [duration] = useState(
    initial
      ? Math.random() * 4000 + 3000 
      : Math.random() * 4000 + 6000
  );
  const [xStart] = useState(Math.random() * width);
  const [swayRange] = useState(Math.random() * 30 + 15);
  const [rotateDegree] = useState(Math.random() * 360);

  useEffect(() => {
    // Fade in quickly at the start
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Infinite Swaying Left/Right
    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 1000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 1000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Falling Downward
    Animated.timing(fallAnim, {
      toValue: height + 50,
      duration,
      useNativeDriver: true,
    }).start(() => {
      // Fade out once it hits the bottom
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        if (onComplete) onComplete();
      });
    });
  }, [duration, fallAnim, onComplete, opacityAnim, swayAnim]);

  // 4. Interpolations
  const translateX = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-swayRange, swayRange],
  });

  const rotate = swayAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [`-${rotateDegree}deg`, `${rotateDegree}deg`] as string[],
  });

  return (
    <Animated.Text
      style={[
        styles.particle,
        {
          fontSize: size,
          left: xStart,
          opacity: opacityAnim,
          transform: [
            { translateX },
            { translateY: fallAnim },
            { rotate },
          ] as any, // Bypass TS internal Animated.ValueVariant error
        },
      ]}
    >
      {symbol}
    </Animated.Text>
  );
};

// 5. Memoize to prevent unnecessary re-renders during high-particle scenes
export default memo(Particle);

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    top: -50, // Start just off-screen
    zIndex: 999,
    backgroundColor: "transparent",
  },
});