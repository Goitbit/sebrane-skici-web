const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const skici = require("./data/skici.json");
const first = skici[0];
const latest = skici.at(-1);

const app = express();

// Nastavení EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Statické soubory (CSS, obrázky...)
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;


// ==========================================
// Homepage → poslední skicou
// ==========================================

app.get("/", (req, res) => {
    if (!latest) {
        return res.send("Žádné skici :-(");
    }

    res.redirect(`/${latest.id}`);

});


// ==========================================
// Archiv
// ==========================================

app.get("/archive", (req, res) => {

    res.render("archive", {
        title: "Archiv",
        skici
    });

});


// ==========================================
// O projektu
// ==========================================

app.get("/about", (req, res) => {

    res.render("about", {
        title: "O projektu",
        skiciCount: skici.length
    });

});


// ==========================================
// Náhodný komiks
// ==========================================

app.get("/random", (req, res) => {

    const currentId = Number(req.cookies?.currentId);

    const pool =
        Number.isFinite(currentId)
            ? skici.filter(c => c.id !== currentId)
            : skici;

    const skica = pool[Math.floor(Math.random() * pool.length)];

    res.redirect(`/${skica.id}`);
});


// ==========================================
// Kontakt
// ==========================================

app.get("/contact", (req, res) => {

    res.render("contact", {
        title: "Kontakt"
    });

});

// ==============================================
// Sitemapa
// ===============================================
app.get("/sitemap.xml", (req, res) => {
    res.header('Content-Type', 'application/xml');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    //Homepage
    xml += `  <url><loc>https://www.sebraneskici.cz/</loc><priority>1.0</priority></url>\n`;   
    //Kontakty
    xml += `  <url><loc>https://www.sebraneskici.cz/contact</loc><priority>0.5</priority></url>\n`;
    //Archive
    xml += `  <url><loc>https://www.sebraneskici.cz/archive</loc><priority>0.8</priority></url>\n`;    
    
    // Každý komiks
    skici.forEach(skica => {
        xml += `  <url>\n`;
        xml += `    <loc>https://www.sebraneskici.cz/${skica.id}</loc>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
    });
    
    xml += `</urlset>`;
    res.send(xml);
});

// ==========================================
// Detail komiksu
// ==========================================

app.get("/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = skici.findIndex(c => c.id === id);

    const skica = skici[index];

    if (index === -1) {
        return res.status(404).render("404", {
            title: "Komiks nenalezen"
        });
    }

    res.cookie("currentId", id);

    res.render("skica", {
      title: `${skica.title}`,
      skica,
      prev: skici[index - 1] ?? null,
      next: skici[index + 1] ?? null,
      first: first ?? null,
      last: latest ?? null,
      skiciCount: skici.length
    });
});


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).render("404", {
        title: "Stránka nenalezena"
    });

});


// ==========================================
// Start serveru
// ==========================================

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});



// ==========================================
// Homepage → poslední skicou
// ==========================================

app.get("/", (req, res) => {
    if (!latest) {
        return res.send("Žádné skici :-(");
    }

    res.redirect(`/${latest.id}`);

});


// ==========================================
// Archiv
// ==========================================

app.get("/archive", (req, res) => {

    res.render("archive", {
        title: "Archiv",
        skici
    });

});



// ==========================================
// O projektu
// ==========================================

app.get("/about", (req, res) => {

    res.render("about", {
        title: "O projektu",
        skiciCount: skici.length
    });

});



// ==========================================
// Náhodný komiks
// ==========================================

app.get("/random", (req, res) => {

    const currentId = Number(req.cookies?.currentId);

    const pool =
        Number.isFinite(currentId)
            ? skici.filter(c => c.id !== currentId)
            : skici;

    const skica = pool[Math.floor(Math.random() * pool.length)];

    res.redirect(`/${skica.id}`);
});


// ==========================================
// Detail komiksu
// ==========================================

app.get("/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = skici.findIndex(c => c.id === id);

    const skica = skici[index];

    if (index === -1) {
        return res.status(404).render("404", {
            title: "Komiks nenalezen"
        });
    }

    res.cookie("currentId", id);

    res.render("skica", {
      title: `${skica.title}`,
      skica,
      prev: skici[index - 1] ?? null,
      next: skici[index + 1] ?? null,
      first: first ?? null,
      last: latest ?? null,
      skiciCount: skici.length
    });
});


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).render("404", {
        title: "Stránka nenalezena"
    });

});


// ==========================================
// Start serveru
// ==========================================

app.listen(PORT, "0.0.0.0", function () {
  // ...
});