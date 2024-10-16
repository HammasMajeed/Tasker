import { registerPlugin } from '@capacitor/core';

export interface EchoPlugin {
  sendRequestToUpdateWorkerLocationForTracking(options: {  userId: string }): Promise<{ value: string }>;
}

const Echo = registerPlugin<EchoPlugin>('Echo');

export default Echo;
