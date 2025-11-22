```html
<form class="space-y-4">
  <div>
    <fibo-switch [field]="settingsForm.enableNotifications">
      Enable push notifications
    </fibo-switch>
  </div>
  
  <div>
    <fibo-switch [field]="settingsForm.enableDarkMode">
      Enable dark mode
    </fibo-switch>
  </div>
  
  <div>
    <fibo-switch [field]="settingsForm.enableAnalytics">
      Enable analytics tracking
    </fibo-switch>
  </div>
  
          <div>
            <fibo-switch [field]="settingsForm.requireTwoFactor">
              Require two-factor authentication
            </fibo-switch>
          </div>
        </form>
```

