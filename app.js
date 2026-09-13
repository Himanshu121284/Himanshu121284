const COMPANY_EMAIL = "verdantanaturalsinfo@yahoo.com";
const WHATSAPP_NUMBER = "919925551736";
const STORAGE_KEY = "verdanta-enquiries";

const products = [
  {
    id: "onion-powder",
    name: "Onion",
    form: "Powder",
    category: "vegetables",
    categoryLabel: "Dehydrated vegetables",
    image: "assets/onion.jpg",
    description: "A practical dehydrated onion format for seasoning, mixes, sauces and food applications.",
    application: "Seasonings, sauces, ready-to-eat foods",
    ingredient: "Onion ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated onion powder in a ceramic bowl",
    tag: "Everyday staple"
  },
  {
    id: "onion-flakes",
    name: "Onion",
    form: "Flakes",
    category: "vegetables",
    categoryLabel: "Dehydrated vegetables",
    image: "assets/onion.jpg",
    description: "Dehydrated onion flakes for blends, savoury applications and convenient cooking formats.",
    application: "Seasonings, soups, sauces, HoReCa",
    ingredient: "Onion ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated onion flakes in a ceramic bowl",
    tag: "Flexible format"
  },
  {
    id: "garlic-powder",
    name: "Garlic",
    form: "Powder",
    category: "vegetables",
    categoryLabel: "Dehydrated vegetables",
    image: "assets/garlic.jpg",
    description: "A convenient garlic powder format for seasoning, savoury blends and food product development.",
    application: "Seasonings, sauces, snacks, bakery",
    ingredient: "Garlic ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated garlic powder in a ceramic bowl",
    tag: "Aromatic base"
  },
  {
    id: "garlic-flakes",
    name: "Garlic",
    form: "Flakes",
    category: "vegetables",
    categoryLabel: "Dehydrated vegetables",
    image: "assets/garlic.jpg",
    description: "Dehydrated garlic flakes for visual texture, savoury blends and foodservice applications.",
    application: "Seasonings, soups, sauces, HoReCa",
    ingredient: "Garlic ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated garlic flakes in a ceramic bowl",
    tag: "Bold character"
  },
  {
    id: "potato-powder",
    name: "Potato",
    form: "Powder",
    category: "vegetables",
    categoryLabel: "Dehydrated vegetables",
    image: "assets/potato.jpg",
    description: "Potato in a convenient powder format for recipe development and savoury food applications.",
    application: "Ready-to-eat foods, soups, snacks",
    ingredient: "Potato ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated potato powder in a ceramic bowl",
    tag: "Kitchen essential"
  },
  {
    id: "potato-flakes",
    name: "Potato",
    form: "Flakes",
    category: "vegetables",
    categoryLabel: "Dehydrated vegetables",
    image: "assets/potato.jpg",
    description: "Potato flakes for convenient preparation, foodservice and product formulation conversations.",
    application: "Ready-to-eat foods, HoReCa, snacks",
    ingredient: "Potato ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated potato flakes in a ceramic bowl",
    tag: "Built for making"
  },
  {
    id: "banana-powder",
    name: "Banana",
    form: "Powder",
    category: "fruits",
    categoryLabel: "Fruit ingredients",
    image: "assets/banana.jpg",
    description: "Banana powder for baking, beverage, nutrition and natural food product conversations.",
    application: "Bakery, beverages, nutraceutical applications",
    ingredient: "Banana ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated banana powder in a ceramic bowl",
    tag: "Fruit ingredient"
  },
  {
    id: "banana-flakes",
    name: "Banana",
    form: "Flakes",
    category: "fruits",
    categoryLabel: "Fruit ingredients",
    image: "assets/banana.jpg",
    description: "Dehydrated banana flakes for topping, blending, baking and natural product exploration.",
    application: "Bakery, confectionery, retail, beverages",
    ingredient: "Banana ingredient — confirm current composition on enquiry.",
    alt: "Dehydrated banana flakes in a ceramic bowl",
    tag: "Natural sweetness"
  }
];

let selectedProductId = "";
let lastFocusedElement = null;
let toastTimer;

// Analytics-ready hooks. Add GA4 gtag.js and/or Meta Pixel IDs when the business is ready.
window.dataLayer = window.dataLayer || [];
function trackEvent(name, parameters = {}) {
  window.dataLayer.push({ event: name, ...parameters });
  if (typeof window.gtag === "function") window.gtag("event", name, parameters);
  if (typeof window.fbq === "function") window.fbq("trackCustom", name, parameters);
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[character]));
}

function renderProducts(filter = "all") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  let visible = products;
  if (filter === "powders" || filter === "flakes") {
    visible = products.filter((product) => product.form.toLowerCase() === filter.slice(0, -1));
  } else if (filter === "vegetables" || filter === "fruits") {
    visible = products.filter((product) => product.category === filter);
  } else if (filter === "granules" || filter === "other") {
    visible = [];
  }

  if (!visible.length) {
    grid.innerHTML = `
      <div class="empty-products">
        <span class="eyebrow eyebrow-purple"><span class="eyebrow-line"></span>New formats welcome</span>
        <h3>Looking for a different <em>ingredient format?</em></h3>
        <p>This part of the range is being developed. Tell us what you need and we will start with your requirement.</p>
        <button class="button button-primary" type="button" data-open-modal="requirement-modal">Submit a requirement <span aria-hidden="true">↗</span></button>
      </div>`;
    return;
  }

  grid.innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${escapeHtml(product.alt)}" loading="lazy" />
        <span class="product-tag">${escapeHtml(product.tag)}</span>
      </div>
      <div class="product-body">
        <span class="product-category">${escapeHtml(product.categoryLabel)}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <span class="product-form">${escapeHtml(product.form)}</span>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-actions">
          <button type="button" data-product-action="view" data-product-id="${product.id}">View details <span aria-hidden="true">↗</span></button>
          <button type="button" data-product-action="enquire" data-product-id="${product.id}">Enquire now <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>`).join("");
}

function populateProductSelects() {
  const options = products.map((product) => `<option value="${product.id}">${escapeHtml(product.name)} — ${escapeHtml(product.form)}</option>`).join("");
  document.querySelectorAll('select[name="product"]').forEach((select) => {
    const firstOption = select.querySelector("option");
    select.innerHTML = `${firstOption ? firstOption.outerHTML : '<option value="">Select a product</option>'}${options}`;
  });
}

function restoreForm(form) {
  if (!form) return;
  form.reset();
  form.querySelectorAll("[hidden]").forEach((element) => {
    if (element.classList.contains("form-success") || element.classList.contains("oem-fields")) return;
    element.hidden = false;
  });
  const success = form.querySelector(".form-success");
  if (success) success.hidden = true;
  form.querySelectorAll(".site-form > *").forEach((element) => {
    if (!element.classList.contains("form-success")) element.hidden = false;
  });
  const oemFields = form.querySelector(".oem-fields");
  if (oemFields) oemFields.hidden = true;
}

function resetModalState(modal) {
  if (!modal) return;
  modal.querySelectorAll("form").forEach(restoreForm);
}

function openModal(id, options = {}) {
  const modal = document.getElementById(id);
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  document.querySelectorAll(".modal:not([hidden])").forEach((open) => { open.hidden = true; });
  resetModalState(modal);
  modal.hidden = false;
  document.body.classList.add("modal-open");
  if (options.productId) selectedProductId = options.productId;
  else if (id !== "product-modal") selectedProductId = "";

  if (options.productId) {
    setProductContext(options.productId, modal);
  }
  if (options.application) {
    const application = modal.querySelector('[name="application"]');
    if (application) application.value = options.application;
  }
  const focusTarget = modal.querySelector("input, select, textarea, button.modal-close");
  if (focusTarget) window.setTimeout(() => focusTarget.focus(), 30);
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  if (!document.querySelector(".modal:not([hidden])")) document.body.classList.remove("modal-open");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
}

function setProductContext(productId, scope = document) {
  const product = productById(productId);
  if (!product) return;
  scope.querySelectorAll('select[name="product"]').forEach((select) => { select.value = product.id; });
  const category = scope.querySelector('[name="category"]');
  if (category) category.value = product.categoryLabel;
  const form = scope.querySelector('[name="form"]');
  if (form && Array.from(form.options).some((option) => option.value === product.form)) form.value = product.form;
}

function openProductDetails(productId) {
  const product = productById(productId);
  if (!product) return;
  selectedProductId = productId;
  trackEvent("product_view", { product_id: product.id, product_name: `${product.name} ${product.form}` });
  const modal = document.getElementById("product-modal");
  modal.querySelector("#product-modal-image").src = product.image;
  modal.querySelector("#product-modal-image").alt = product.alt;
  modal.querySelector("#product-modal-category").innerHTML = `<span class="eyebrow-line"></span>${escapeHtml(product.categoryLabel)}`;
  modal.querySelector("#product-modal-title").innerHTML = `${escapeHtml(product.name)} <em>${escapeHtml(product.form.toLowerCase())}.</em>`;
  modal.querySelector("#product-modal-description").textContent = product.description;
  modal.querySelector("#product-modal-form").textContent = product.form;
  modal.querySelector("#product-modal-application").textContent = product.application;
  modal.querySelector("#product-modal-enquire").onclick = () => {
    closeModal(modal);
    openModal("requirement-modal", { productId });
  };
  openModal("product-modal");
}

function collectFormData(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (value instanceof File) {
      if (value.name) data[key] = value.name;
    } else if (data[key]) {
      data[key] = `${data[key]}, ${value}`;
    } else {
      data[key] = value;
    }
  });
  if (selectedProductId && !data.product) data.product = selectedProductId;
  return data;
}

function createEnquiryId() {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  let existing = [];
  try { existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch (error) { existing = []; }
  return `VN-${datePart}-${String(existing.length + 1).padStart(3, "0")}`;
}

function saveEnquiry(formType, data) {
  const record = {
    enquiryId: createEnquiryId(),
    date: new Date().toISOString(),
    type: formType,
    status: "New",
    customerName: data.name || "",
    company: data.company || "",
    country: data.country || "",
    customerType: data.customerType || "",
    product: data.product || "",
    productForm: data.form || "",
    quantity: data.quantity || "",
    application: data.application || "",
    specifications: data.specification || data.otherSpecs || data.message || data.remarks || "",
    packaging: data.packaging || data.packagingRequirement || "",
    oemPrivateLabel: data.oem || "",
    deliveryLocation: data.deliveryLocation || data.delivery || data.city || "",
    documents: data.document || data.documents || "",
    contact: { email: data.email || "", phone: data.phone || "" },
    details: data
  };
  try {
    const records = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    records.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    // Local storage is a convenience for this static front-end; the form still completes if unavailable.
  }
  return record;
}

function successMessage(form, record) {
  const success = form.querySelector(".form-success");
  if (!success) return;
  form.querySelectorAll(":scope > *").forEach((element) => {
    if (!element.classList.contains("form-success")) element.hidden = true;
  });
  success.hidden = false;
  const idTarget = success.querySelector("[data-enquiry-id]");
  if (idTarget) idTarget.textContent = record.enquiryId;
  let reference = success.querySelector(".success-reference");
  if (!reference) {
    reference = document.createElement("p");
    reference.className = "success-reference";
    reference.style.cssText = "margin: 8px 0 0; color: #777970; font-size: 10px;";
    success.querySelector("div")?.appendChild(reference);
  }
  reference.textContent = `Reference: ${record.enquiryId}`;
  const subject = encodeURIComponent(`Verdanta enquiry ${record.enquiryId}`);
  const body = encodeURIComponent(`Hello Verdanta Naturals,\n\nI have submitted an enquiry (${record.enquiryId}).\nProduct: ${record.product || "Not specified"}\n\nPlease follow up with me.\n`);
  let emailLink = success.querySelector(".success-email");
  if (!emailLink && (form.dataset.form === "rfq" || form.dataset.form === "requirement" || form.dataset.form === "b2c" || form.dataset.form === "contact")) {
    emailLink = document.createElement("a");
    emailLink.className = "success-email";
    emailLink.style.cssText = "display:block; margin-top: 6px; color:#5b3a72; font-size:10px; text-transform:uppercase; letter-spacing:.08em; font-weight:700;";
    success.querySelector("div")?.appendChild(emailLink);
  }
  if (emailLink) {
    emailLink.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;
    emailLink.textContent = "Email the Verdanta team ↗";
  }
  notify(`Enquiry ${record.enquiryId} saved as New.`);
}

function handleFormSubmit(form) {
  if (form.elements.website_confirm?.value) return;
  if (!form.reportValidity()) return;
  const data = collectFormData(form);
  const formType = form.dataset.form || "general";
  const record = saveEnquiry(formType, data);
  trackEvent(`${formType}_submission`, { enquiry_id: record.enquiryId, product: data.product || "" });
  successMessage(form, record);
}

function notify(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4000);
}

function setupWhatsAppLinks() {
  document.querySelectorAll('[data-track="whatsapp"]').forEach((link) => {
    link.addEventListener("click", () => {
      const product = productById(selectedProductId);
      trackEvent("whatsapp_click", { product: product ? `${product.name} ${product.form}` : "" });
      const message = product
        ? `Hello Verdanta Naturals, I am interested in ${product.name} ${product.form}. Please share product details, pack sizes and pricing.`
        : "Hello Verdanta Naturals, I would like to know more about your natural ingredients.";
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    });
  });
}

function init() {
  renderProducts();
  populateProductSelects();
  setupWhatsAppLinks();
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelector(".menu-toggle")?.addEventListener("click", (event) => {
    const toggle = event.currentTarget;
    const nav = document.getElementById("primary-nav");
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  document.querySelectorAll(".primary-nav a").forEach((link) => link.addEventListener("click", () => {
    document.getElementById("primary-nav")?.classList.remove("open");
    document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
  }));

  document.addEventListener("click", (event) => {
    const modalTrigger = event.target.closest("[data-open-modal]");
    if (modalTrigger) {
      const options = {
        productId: modalTrigger.dataset.productId || "",
        application: modalTrigger.dataset.application || ""
      };
      openModal(modalTrigger.dataset.openModal, options);
      return;
    }
    const productAction = event.target.closest("[data-product-action]");
    if (productAction) {
      const productId = productAction.dataset.productId;
      if (productAction.dataset.productAction === "view") openProductDetails(productId);
      if (productAction.dataset.productAction === "enquire") {
        trackEvent("enquiry_click", { product_id: productId });
        openModal("requirement-modal", { productId });
      }
    }
    const closeTrigger = event.target.closest("[data-close-modal]");
    if (closeTrigger) closeModal(closeTrigger.closest(".modal"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const modal = document.querySelector(".modal:not([hidden])");
      if (modal) closeModal(modal);
    }
  });

  document.querySelectorAll(".category-tile").forEach((tile) => tile.addEventListener("click", () => {
    document.querySelectorAll(".category-tile").forEach((item) => item.classList.remove("active"));
    tile.classList.add("active");
    trackEvent("product_category_filter", { category: tile.dataset.filter });
    renderProducts(tile.dataset.filter);
    document.getElementById("products-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));

  document.querySelectorAll(".application-item").forEach((item) => item.addEventListener("click", () => {
    openModal("requirement-modal", { application: item.dataset.application });
  }));

  document.querySelectorAll(".site-form").forEach((form) => {
    form.insertAdjacentHTML("afterbegin", '<label class="honeypot" aria-hidden="true">Leave this field empty<input name="website_confirm" tabindex="-1" autocomplete="off" /></label>');
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handleFormSubmit(form);
    });
  });

  document.querySelectorAll('select[name="oem"]').forEach((select) => select.addEventListener("change", () => {
    const fields = select.closest(".site-form")?.querySelector(".oem-fields");
    if (fields) fields.hidden = select.value !== "Yes";
  }));

  document.querySelectorAll("[data-legal]").forEach((trigger) => trigger.addEventListener("click", () => {
    const title = document.getElementById("legal-modal-title");
    if (title) title.innerHTML = `${escapeHtml(trigger.dataset.legal).replace(" / ", " <em>/</em> ")}.`;
  }));
}

document.addEventListener("DOMContentLoaded", init);
