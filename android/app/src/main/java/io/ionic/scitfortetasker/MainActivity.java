package io.ionic.scitfortetasker;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // registerPlugin(VoiceCallPlugin.class);
    registerPlugin(EchoPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
