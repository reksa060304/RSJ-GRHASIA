package com.transmedic.ereservasi_rscibinong;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.http.SslError;
import android.os.Bundle;
import android.webkit.SslErrorHandler;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {
    String url ="https://transmedic.co.id:7777/e-reservasi/";
//    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (!DetectConnection.checkInternetConnection(this)) {
//            Toast.makeText(getApplicationContext(), "No Internet!", Toast.LENGTH_SHORT).show();
                showDiaglog();
        } else {
            loadWebView();
        }


// Function to load all URLs in same webview

    }
    private  void  showDiaglog(){
        final AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);

        builder.setTitle("Information");
        builder.setMessage("Check your internet connection and try again.");
        builder.setPositiveButton("try again", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
//                startActivity(MainActivity.this);
                Intent myIntent = new Intent(MainActivity.this, MainActivity.class);
                MainActivity.this.startActivity(myIntent);
            }
        });
        builder.setNegativeButton("cancel", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                finish();
                System.exit(0);
            }
        });
        final AlertDialog dialog = builder.create();
        dialog.show();
    }
    private  void  loadWebView (){
        WebView wv = (WebView) findViewById(R.id.webview);
        CustomWebViewClient c = new CustomWebViewClient();
//        wv.setWebViewClient(new SSLTolerentWebViewClient());
        wv.clearCache(true);
        wv.clearHistory();
        wv.getSettings().setBlockNetworkImage(false);
        // Whether the WebView should load image resources
        wv.getSettings().setLoadsImagesAutomatically(true);
        wv.getSettings().setJavaScriptEnabled(true);
        wv.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        wv.getSettings().setBuiltInZoomControls(true);


        //settings.pluginState = WebSettings.PluginState.ON
        wv.getSettings().setUseWideViewPort(true);
        wv.getSettings().setLoadWithOverviewMode(true);
        wv.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);

        // More optional settings, you can enable it by yourself
        wv.getSettings().setDomStorageEnabled(true);
        wv.getSettings().setSupportMultipleWindows(true);
        wv.getSettings().setAllowContentAccess(true);
        wv.getSettings().setGeolocationEnabled(true);
        wv.getSettings().setAllowFileAccess(true);

        // WebView settings
//            wv.getSettings().setFi = true

        wv.loadUrl(url);
    }
//L Error Tolerant Web View Client
    private class SSLTolerentWebViewClient extends WebViewClient {

        @Override
//        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
//            handler.proceed(); // Ignore SSL certificate errors
//        }
        public void onReceivedSslError(WebView view, final SslErrorHandler handler, SslError error) {
            final AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
            String message = "SSL Certificate error.";
            switch (error.getPrimaryError()) {
                case SslError.SSL_UNTRUSTED:
                    message = "The certificate authority is not trusted.";
                    break;
                case SslError.SSL_EXPIRED:
                    message = "The certificate has expired.";
                    break;
                case SslError.SSL_IDMISMATCH:
                    message = "The certificate Hostname mismatch.";
                    break;
                case SslError.SSL_NOTYETVALID:
                    message = "The certificate is not yet valid.";
                    break;
            }
            message += " Do you want to continue anyway?";

            builder.setTitle("SSL Certificate Error");
            builder.setMessage(message);
            builder.setPositiveButton("continue", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    handler.proceed();
                }
            });
            builder.setNegativeButton("cancel", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    handler.cancel();
                }
            });
            final AlertDialog dialog = builder.create();
            dialog.show();
        }
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (!DetectConnection.checkInternetConnection(MainActivity.this )) {
//                Toast.makeText(getApplicationContext(), "No Internet!", Toast.LENGTH_SHORT).show();
               showDiaglog();
            } else {
                view.loadUrl(url);
            }
            return true;
        }
    }
    private class CustomWebViewClient extends WebViewClient {
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (!DetectConnection.checkInternetConnection(MainActivity.this )) {
//                Toast.makeText(getApplicationContext(), "No Internet!", Toast.LENGTH_SHORT).show();
               showDiaglog();
            } else {
                view.loadUrl(url);
            }
            return true;
        }
    }
}
