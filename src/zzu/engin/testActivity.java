package zzu.engin;

import com.phonegap.DroidGap;

import android.os.Bundle;


public class testActivity extends DroidGap
{
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
  /****************************************************************/  
}
