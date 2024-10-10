package io.ionic.scitfortetasker;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;


import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;




@CapacitorPlugin(name = "Echo")
public class EchoPlugin extends Plugin {

  @PluginMethod()
  public void sendRequestToUpdateWorkerLocationForTracking(PluginCall call) {
    Log.d("Hammas","sendRequestToUpdateWorkerLocationForTracking get called.");
    String userId = call.getString("userId");
    SharedPreferences sharedPreferences = getContext().getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString("userId", userId);
    editor.apply();
  }

}
