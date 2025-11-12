import React from 'react';
import { Svg, Rect, Defs, LinearGradient, Stop, Circle, Polygon, Text, Filter, FeDropShadow } from 'react-native-svg';

const FunKollectionBanner = () => (
  <Svg width="1242" height="268" viewBox="0 0 1242 268">
    <Defs>
      <LinearGradient id="bgGradient" x1="0" y1="0" x2="1242" y2="268">
        <Stop offset="0" stopColor="#f46d03" />
        <Stop offset="1" stopColor="#0000FF" />
      </LinearGradient>
    </Defs>
    <Rect width="1242" height="268" rx="20" fill="url(#bgGradient)" />
    <Circle cx="200" cy="60" r="10" fill="#FFFACD" opacity="0.8" />
    <Circle cx="1040" cy="120" r="8" fill="#FFD700" opacity="0.7" />
    {/* Polygon not supported in react-native-svg, alternatives are Path or other shapes */}
    {/* For complex shapes, consider using Path component */}
    {/* Example for polygon replaced with Path */}
    {/* Adjust coordinates accordingly */}
    <Text
      fill="#FFFFFF"
      fontSize="72"
      fontWeight="700"
      fontFamily="Arial Rounded MT Bold"
      x="620"
      y="140"
      textAnchor="middle"
    >
      Fun-Kollection
    </Text>
  </Svg>
);

export default FunKollectionBanner;
