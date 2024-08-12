## How to Connect a Subdomain to Firebase Hosting (Domain Hosted with Squarespace)

This guide explains how to connect a subdomain (e.g., `app.zwisch.app`) to a Firebase Hosting site when your domain (`zwisch.app`) is managed by Squarespace.

**Prerequisites:**

* You have a Firebase project set up with Firebase Hosting.
* You have a custom domain (e.g., `zwisch.app`) registered with Squarespace.

**Step 1: Get Firebase Verification Records**

1.  **Go to Firebase Console:** Open your web browser and navigate to: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2.  **Select Your Project:** Click on your Firebase project (the one you want to use for hosting).
3.  **Go to Hosting:** In the left-hand side menu, find the "Hosting" section and click on it.
4. **Navigate to Domains:**  Once in the Hosting section, click on "Domains".
5.  **Add Custom Domain:** Click on "Connect a custom domain". 
6.  **Enter Subdomain:**  Type in your desired subdomain, including the full stop and your domain name (e.g., `app.zwisch.app`). 
7.  **Copy Records:**  Firebase will display two DNS records: an **A record** and a **TXT record**. Copy these values - you'll need them in the next step.

**Step 2: Add DNS Records in Squarespace**

1. **Log In to Squarespace:** Log in to your Squarespace account.
2.  **Access Domain Settings:**
    *   Go to the website that's connected to the domain you want to use.
    *   Go to **Settings** -> **Domains**. 
    *   Select your domain (`zwisch.app`).
3.  **Find DNS Management:** Look for an "Advanced Settings" option (or similar) where you can manage DNS records directly. The exact location may vary depending on your Squarespace version.
4.  **Create Subdomain (If Necessary):** Some Squarespace versions require you to explicitly create the subdomain (`app` in this case) before you can add DNS records for it. Look for a section to create subdomains within your Squarespace DNS settings. 
5.  **Add DNS Records:**
    *   **Add A Record:** Enter the "A record" values you copied from Firebase. You'll likely have fields for "Host" (enter your subdomain `app` or `app.zwisch.app` - check what Squarespace requires) and "Value" (Firebase's IP addresses). 
    *   **Add TXT Record:**  Do the same for the "TXT record" provided by Firebase. Enter the values into the appropriate fields.
6.  **Save Changes:** Make sure to save the DNS changes in your Squarespace settings. 

**Step 3: Verify and Wait**

1. **Wait for Propagation:** It can take a while (up to 48 hours, but usually much faster) for DNS changes to take full effect across the internet.
2. **Verify in Firebase:** Go back to your Firebase console -> Hosting -> Domains and click on the "Verify" button next to your subdomain. If the DNS records have propagated, Firebase will successfully connect your subdomain.

**Troubleshooting:**

* **Typos:**  Double-check every DNS record for typos. A single wrong character will cause problems.
* **Browser Cache:** Clear your browser cache or use an incognito/private browsing window to see the latest changes.
* **Squarespace Support:** If you have trouble finding the right settings in Squarespace, contact their support team for assistance. 
* **Firebase Support:**  For any issues within Firebase, don't hesitate to contact their support as well.

This detailed guide should help your colleague set up the subdomain connection! If you run into any more questions, just ask! 
