# Food Log (AI-Powered)
<table border="0" style="border-collapse: collapse;">
  <colgroup>
    <col style="width:20%;">
    <col style="width:70%;">
  </colgroup>

  <tr>
    <td style="vertical-align: top;">
      A small, lightweight tool for logging what you eat.  
      You type a natural-language description (“oatmeal, banana, cappuccino”), and the system:
      <ul>
        <li>sends it to a Google Apps Script backend</li>
        <li>uses OpenAI to break it into individual food items</li>
        <li>estimates kcal, protein, carbs, and fats</li>
        <li>stores each item as a separate row in Google Sheets</li>
        <li>displays recent entries synced from the sheet</li>
      </ul>
    </td>
    <td style="vertical-align: top; text-align:center;">
      <img src="screenshot_app.png" width="350">
    </td>
  </tr>
</table>

Everything runs on free services: Cloudflare(/GitHub Pages) + Google Apps Script + Google Sheets.


<div style="flex: 1; min-width: 250px;">
  <h2>Why This Is Useful</h2>
  <ul>
    <li>Fast food tracking: just type what you ate, no menus or dropdowns.</li>
    <li>AI handles splitting foods and estimating macros.</li>
    <li>All entries sync across phone and laptop automatically.</li>
    <li>No servers, no databases, no frameworks.</li>
    <li>Fully private: OpenAI key stays inside Apps Script, never exposed to the frontend.</li>
    <li>Good, low effort way of tracking calories approximately, ideal for getting started with minimal engagement.</li>
    <li>Easy to extend for nutrients, allergens, FODMAPs and more.</li>
  </ul>
</div>



## How to Set It Up Yourself

1. Create a Google Sheet  
   Add a sheet named `Sheet1` with columns:

   date | time | meal | description | amount | kcal | protein | carbs | fats

2. Add the Apps Script backend  
   Open Extensions → Apps Script in your sheet.  
   Copy the contents of `deployment_apps_script_example.gs` into the editor.  
   Insert your OpenAI key.  
   Make sure both doPost and doGet functions are present.

3. Deploy the Script as a Web App  
   Deploy → New Deployment → Web App  
   Execute as: Me  
   Who has access: Anyone  
   Copy the /exec URL.

4. Update the Frontend  
   In index.html, set:
   const ENDPOINT = "YOUR_EXEC_URL_HERE";

5. Host (I'm using Cloudflare Pages, since it can be used to host a private repo, to avoid spam).   
   Place index.html and README.md in a repository.  
   Share it to Cloudflare pages.  
   Open the URL on your phone or laptop.

---

## Files
- index.html  
- deployment_apps_script_example.gs  
- README.md
- favicon.png
- share-image.png


A simple, practical way to track meals using nothing but a browser, a Google Sheet, and a bit of AI.





