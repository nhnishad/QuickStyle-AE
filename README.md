# QuickStyle AE

QuickStyle AE is a lightweight After Effects plugin that helps you save and reuse your favorite **colors, fonts, and effects** — all from one panel.  
Perfect for motion designers who want a quick style manager inside After Effects.

---

## 🧩 What It Does

- Save and organize custom colors (like Photoshop swatches)  
- Store fonts with display and PostScript names  
- Add favorite effects for quick access  
- Keeps your styles even after closing After Effects  
- Simple, fast, and beginner-friendly UI

---

## ⚙️ Installation

1. **Download or clone this repository**
2. Copy the `QuickStyle AE` folder to:

   - **Windows:**  
     `Program Files (x86)\Common Files\Adobe\CEP\extensions`

   - **macOS:**  
     `/Library/Application Support/Adobe/CEP/extensions`

3. Restart After Effects  
4. Go to **Window → QuickStyle AE** to open the panel

---

## 🎨 How to Use

### 1. Save Colors
- Open the plugin panel inside After Effects  
- Click **Add Color**  
- Pick a color and give it a name  
- The color will appear in your saved list  
- You can click any saved color later to reuse it

---

### 2. Add Fonts
Fonts are defined manually in the `main.js` file.

**Steps:**
1. Open the `main.js` file in any text editor  
2. Find the font list section  
3. Add your fonts in this format:

   ```js
   { name: "Font Name", postscriptName: "Font-PostScript-Name" }
* Find postscriptName from https://fontdrop.info - drop your font and copy the name(if not working try using - on space)
   


### 3. Add Effects

1. Open the main.js file in the QuickStyle AE folder using any text editor.
2. Find the effect list section (it looks like an array of objects).
3. Add your effect in this format:
   { name: "Effect Name", matchName: "EffectMatchName" }
Like this - { name: "Fill", matchName: "Fill" },

