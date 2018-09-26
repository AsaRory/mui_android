package com.example.admin.jgtest2;

import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;
import cn.jpush.android.data.JPushLocalNotification;

public class MainActivity extends AppCompatActivity {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.setDebugMode(true);
        JPushInterface.init(this);
        setContentView(R.layout.activity_main);

        setAlias();

//        JPushLocalNotification ln = new JPushLocalNotification();
//        ln.setBuilderId(0);
//        ln.setContent("hhh");
//        ln.setTitle("ln");
//        ln.setNotificationId(11111111) ;
//        ln.setBroadcastTime(System.currentTimeMillis() + 1000 * 6);
//
//        Map<String , Object> map = new HashMap<String, Object>() ;
//        map.put("name", "jpush") ;
//        map.put("test", "111") ;
//        JSONObject json = new JSONObject(map) ;
//        ln.setExtras(json.toString()) ;
//        JPushInterface.addLocalNotification(getApplicationContext(), ln);
    }

    private void setAlias() {

        String alias = "17373349812";
        if (TextUtils.isEmpty(alias)) {
//            Toast.makeText(MainActivity.this,R.string.error_alias_empty, Toast.LENGTH_SHORT).show();
            return;
        }
//        if (!ExampleUtil.isValidTagAndAlias(alias)) {
//            Toast.makeText(PushSetActivity.this,R.string.error_tag_gs_empty, Toast.LENGTH_SHORT).show();
//            return;
//        }

        // 调用 Handler 来异步设置别名
        mHandler.sendMessage(mHandler.obtainMessage(MSG_SET_ALIAS, alias));
    }
    private final TagAliasCallback mAliasCallback = new TagAliasCallback() {
        @Override
        public void gotResult(int code, String alias, Set<String> tags) {
            String logs ;
            switch (code) {
                case 0:
                    logs = "Set tag and alias success";
                    Log.d("ceshi", logs);
                    // 建议这里往 SharePreference 里写一个成功设置的状态。成功设置一次后，以后不必再次设置了。
                    break;
                case 6002:
                    logs = "Failed to set alias and tags due to timeout. Try again after 60s.";
                    Log.d("ceshi", logs);
                    // 延迟 60 秒来调用 Handler 设置别名
                    mHandler.sendMessageDelayed(mHandler.obtainMessage(MSG_SET_ALIAS, alias), 1000 * 60);
                    break;
                default:
                    logs = "Failed with errorCode = " + code;
                    Log.d("ceshi", logs);
            }
//            ExampleUtil.showToast(logs, getApplicationContext());
        }
    };

    private static final int MSG_SET_ALIAS = 1001;
    private final Handler mHandler = new Handler() {
        @Override
        public void handleMessage(android.os.Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case MSG_SET_ALIAS:
                    Log.d("ceshi", "Set alias in handler.");
                    // 调用 JPush 接口来设置别名。
                    JPushInterface.setAliasAndTags(getApplicationContext(),
                            (String) msg.obj,
                            null,
                            mAliasCallback);
                    break;
                default:
                    Log.d("ceshi", "Unhandled msg - " + msg.what);
            }
        }
    };





}
