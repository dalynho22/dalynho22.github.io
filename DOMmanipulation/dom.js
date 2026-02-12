// Hide forms on page load
window.onload = function () {
    document.getElementById("newContent").style.display = "none";
    document.getElementById("filterContent").style.display = "none";
};

/* =====TOGGLE FILTER MENU===== */
function showFilter() {
    let filterForm = document.getElementById("filterContent");

    if (filterForm.style.display === "none") {
        filterForm.style.display = "block";
    } else {
        filterForm.style.display = "none";
    }
}

/* =====TOGGLE ADD ARTICLE FORM===== */
function showAddNew() {
    let newForm = document.getElementById("newContent");

    if (newForm.style.display === "none") {
        newForm.style.display = "block";
    } else {
        newForm.style.display = "none";
    }
}

/* =====FILTER ARTICLES===== */
function filterArticles() {
    let showOpinion = document.getElementById("opinionCheckbox").checked;
    let showRecipe = document.getElementById("recipeCheckbox").checked;
    let showUpdate = document.getElementById("updateCheckbox").checked;

    let articles = document.querySelectorAll("#articleList article");

    articles.forEach(article => {
        if (article.classList.contains("opinion")) {
            article.style.display = showOpinion ? "block" : "none";
        }
        else if (article.classList.contains("recipe")) {
            article.style.display = showRecipe ? "block" : "none";
        }
        else if (article.classList.contains("update")) {
            article.style.display = showUpdate ? "block" : "none";
        }
    });
}

/* =====ADD NEW ARTICLE===== */
function addNewArticle() {
    let title = document.getElementById("inputHeader").value;
    let content = document.getElementById("inputArticle").value;

    // Determine selected radio button
    let type = "";
    let markerText = "";

    if (document.getElementById("opinionRadio").checked) {
        type = "opinion";
        markerText = "Opinion";
    } 
    else if (document.getElementById("recipeRadio").checked) {
        type = "recipe";
        markerText = "Recipe";
    } 
    else if (document.getElementById("lifeRadio").checked) {
        type = "update";
        markerText = "Update";
    }

    // Basic validation
    if (title === "" || content === "" || type === "") {
        alert("Please complete all fields.");
        return;
    }

    // Create new article
    let newArticle = document.createElement("article");
    newArticle.classList.add(type);

    // Create marker
    let marker = document.createElement("span");
    marker.classList.add("marker");
    marker.textContent = markerText;

    // Create title
    let h2 = document.createElement("h2");
    h2.textContent = title;

    // Create paragraph
    let p = document.createElement("p");
    p.textContent = content;

    // Append elements
    newArticle.appendChild(marker);
    newArticle.appendChild(h2);
    newArticle.appendChild(p);

    // Add to article list
    document.getElementById("articleList").appendChild(newArticle);

    // Clear form
    document.getElementById("inputHeader").value = "";
    document.getElementById("inputArticle").value = "";
    document.getElementById("opinionRadio").checked = false;
    document.getElementById("recipeRadio").checked = false;
    document.getElementById("lifeRadio").checked = false;

    // Apply filter again in case some categories are hidden
    filterArticles();
}

