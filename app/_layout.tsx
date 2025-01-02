import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name='index' options={{ title: 'Widget' }} />
        <Stack.Screen name='lightbox' options={{ title: 'Lightbox' }} />
      </Stack>
      <StatusBar style='dark' />
    </>
  );
};