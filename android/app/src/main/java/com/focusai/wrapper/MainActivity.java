package com.focusai.wrapper;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(android.graphics.Color.parseColor("#07070C"));
        getWindow().setNavigationBarColor(android.graphics.Color.parseColor("#07070C"));
    }
}
