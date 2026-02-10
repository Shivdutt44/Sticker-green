const customPhotoInput = document.getElementById("custom_photo");
const customPhotobtn = document.querySelectorAll(".upload-label")[1];
const submitButton = document.querySelector('button[type="submit"]');

setTimeout(() => {
  document.querySelectorAll('input[name="quantity"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      // Remove background color from all .quantity-options
      document.querySelectorAll(".quantity-options").forEach((option) => {
        option.style.background = "none";
      });

      // Add background color to the selected .quantity-options
      if (this.checked) {
        this.closest(".quantity-options").style.background = "#ececec";
      }
    });

    // Check if this radio button is already checked and apply background color
    if (radio.checked) {
      radio.closest(".quantity-options").style.background = "#ececec";
    }
  });
}, 2000);

setTimeout(() => {
  document
    .querySelector(".size-dropdown")
    .addEventListener("click", function () {
      const sizeOptions = document.getElementById("size-options");
      sizeOptions.style.display =
        sizeOptions.style.display === "block" ? "none" : "block";
    });

  // Handle radio button selection and update dropdown

  document
    .querySelectorAll('input[name="dimensions"]')
    .forEach(function (radio) {
      function handleEvent() {
        const selectedValue = this.closest("label").textContent.trim();
        document.querySelector(".size-dropdown").textContent = selectedValue;
        document.getElementById("size-options").style.display = "none";
      }

      // Apply both 'change' and 'click' event listeners
      radio.addEventListener("change", handleEvent);
      radio.addEventListener("click", handleEvent);
    });

  const firstSelectedValue = document
    .querySelector('input[name="dimensions"]:checked')
    .closest("label")
    .textContent.trim();
  document.querySelector(".size-dropdown").textContent = firstSelectedValue;
}, 3000);

function getVariantFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const variant = urlParams.get("variant");
  if (variant) {
    return parseInt(variant);
  } else {
    var firstvarient = document
      .querySelector("[var-id]")
      .getAttribute("var-id");
    document.querySelector("#size-options label").click();
    document.querySelectorAll('input[name="quantity"]')[4].click();
    document.querySelector(".size-dropdown").innerText = document.querySelector(
      "#size-options label"
    ).innerText;
    return parseInt(firstvarient);
  }
}

function getCurrentPrice() {
  const variantId = getVariantFromURL();
  if (!variantId) return 0;

  const elements = document.querySelectorAll('input[name="id"]');
  elements.forEach((element) => {
    element.value = variantId;
  });

  // Find the div element with the matching variant ID
  const priceElement = document.querySelector(
    `div[var-id="${variantId}"] span`
  );
  if (!priceElement) return 0;

  // Extract the price from the innerText of the element
  const priceText = priceElement.innerText.trim();
  const regex = /\d+,\d+/g; // Matches prices with commas as decimals
  const matches = priceText.match(regex);

  // If a match is found, replace the comma with a dot for correct parsing
  const priceWithDot = matches ? matches[0].replace(",", ".") : "0";

  return parseFloat(priceWithDot);
}

function populateOptions() {
  const sizeOptions = document.getElementById("size-options");
  const quantityOptions = document.getElementById("quantity-options");

  if (sizeOptions && quantityOptions) {
    data.sizes.forEach((size) => {
      const label = document.createElement("label");
      label.classList.add("size_options");
      label.classList.add("form__label");
      label.innerHTML = `<input type="radio" name="dimensions" value="${size.value}" onchange="toggleCustomSizeInput(this)" data-total="${size.total}" /> ${size.label}`;
      sizeOptions.appendChild(label);
    });

    data.quantities.forEach((quantity, index) => {
      var dynamic_save;
      if (quantity.discount != 0) {
        dynamic_save = `-${quantity.discount}%`;
      } else {
        dynamic_save = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      }

      const pcsText = quantity.value !== "custom" ? " pcs" : ""; // Conditional check for "pcs"

      const div = document.createElement("div");
      div.innerHTML = `<label class="quantity-options form__label">
                        <div class="quantity-data">
                            <input class="radio-inp" type="radio" name="quantity" value="${quantity.value}" onchange="toggleCustomQuantityInput(this)" /> &nbsp; ${quantity.label}${pcsText}</div>
                        <div class="dynamic_price" data-quantity="${quantity.value}" data-save="${quantity.discount}"></div>
                        <div class="dynamic_sav dynamic_save_${index}" data-save="${quantity.value}">${dynamic_save}</div>
                    </label>`;
      quantityOptions.appendChild(div);
    });

    // Automatically select size and quantity based on URL or localStorage
    const selectedVariantValue = getVariantFromURL();
    const selectedSizeValue = getSizeFromURL() || getSizeFromLocalStorage();
    const selectedQuantityValue =
      getQuantityFromURL() || getQuantityFromLocalStorage();

    if (selectedVariantValue) {
      selectSizeBasedOnVariant(selectedVariantValue);
    }
    if (selectedSizeValue) {
      selectSizeBasedOnValue(selectedSizeValue);
    }
    if (selectedQuantityValue) {
      selectQuantityBasedOnValue(selectedQuantityValue);
    }
  } else {
    console.error("Size options or quantity options element not found.");
  }
}

function getSizeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const size = urlParams.get("size");
  return size ? size : null;
}

function getQuantityFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const quantity = urlParams.get("quantity");
  return quantity ? quantity : null;
}

function getSizeFromLocalStorage() {
  return localStorage.getItem("selectedSize");
}

function getQuantityFromLocalStorage() {
  return localStorage.getItem("selectedQuantity");
}

function saveSizeToLocalStorage(size) {
  localStorage.setItem("selectedSize", size);
}

function saveQuantityToLocalStorage(quantity) {
  localStorage.setItem("selectedQuantity", quantity);
}

function selectSizeBasedOnVariant(variantValue) {
  const sizeRadios = document.querySelectorAll(
    '#size-options input[type="radio"]'
  );
  sizeRadios.forEach((radio) => {
    if (parseInt(radio.getAttribute("data-total")) === variantValue) {
      radio.checked = true;
      toggleCustomSizeInput(radio);
    }
  });
}




function selectSizeBasedOnValue(sizeValue) {
  const sizeRadios = document.querySelectorAll(
    '#size-options input[type="radio"]'
  );
  sizeRadios.forEach((radio) => {
    if (radio.value === sizeValue) {
      radio.checked = true;
      toggleCustomSizeInput(radio);
    }
  });
}

function selectQuantityBasedOnValue(quantityValue) {
  const quantityRadios = document.querySelectorAll(
    '#quantity-options input[type="radio"]'
  );
  quantityRadios.forEach((radio) => {
    if (radio.value === quantityValue) {
      radio.checked = true;
      toggleCustomQuantityInput(radio);
    }
  });
}

const checkbox = document.getElementById("enable_lamination");

function uncheckCheckbox() {
  checkbox.checked = false;
  checkbox.dispatchEvent(new Event("change")); // Trigger change event
  checkbox.setAttribute("name", "properties[Pelliculage]");
}
uncheckCheckbox();

checkbox.addEventListener("change", function () {
  var updatedP = getSizeFromLocalStorage();
  checkbox.setAttribute("name", "properties[Pelliculage]");
  // console.log(updatedP);
  if (this.checked) {
    variantHandler(updatedP);
    document.querySelector("#final-lami").innerHTML = "Oui";
    checkbox.value = "Oui"; // Set value to "Oui" when checked
  } else {
    variantHandler(updatedP);
    document.querySelector("#final-lami").innerHTML = "Non";
    checkbox.value = "Non"; // Set value to "Non" when unchecked
  }
});

// function updatePrice(selectedQuantity) {
//     let price = 0;
//             console.log(data.quantities);

//     if (isNaN(selectedQuantity)) {
//         const selectedQuantityObj = data.quantities.find(quantity => quantity.value === selectedQuantity);

//         if (selectedQuantityObj) {
//             price = selectedQuantityObj.price;
//             document.querySelector("#total-big").innerHTML = selectedQuantityObj.price;;
//         }
//     } else {
//         // Custom pricing logic
//         price = selectedQuantity * getCurrentPrice(); // Example custom pricing logic
//         document.querySelector("#total-big").innerHTML = `€${price.toFixed(2)}`;

//     }
// }

function updatePrice(selectedQuantity) {
  let price = 0;
  let discount = 0;

  if (!isNaN(selectedQuantity)) {
    let basePrice = getCurrentPrice(); // Assuming this function returns the base price

    const selectedQuantityObj = data.quantities.reduce((prev, curr) => {
      return selectedQuantity >= curr.value ? curr : prev;
    });

    // If a valid quantity object is found, apply the discount
    if (selectedQuantityObj) {
      discount = selectedQuantityObj.discount || 0; // Get the discount, default to 0 if undefined
    }

    // Calculate the final price with the discount applied
    price = (selectedQuantity * basePrice * (100 - discount)) / 100;

    // Update the displayed price
    document.querySelector("#total-big").innerHTML = `€${price.toFixed(2)}`;
  } else {
    // Handle case where selectedQuantity is not a valid number
    document.querySelector("#total-big").innerHTML = "Invalid quantity";
  }
  const quantityElement = document.querySelector(".quantity__input");
  quantityElement.value = selectedQuantity;
  quantityElement.setAttribute("value", selectedQuantity);
  saveQuantityToLocalStorage(selectedQuantity);
}

function variantHandler(sizeValue) {
  let variantInputs = document.querySelectorAll(
    ".product-form__input--pill input"
  );

  if (document.querySelector("#enable_lamination").checked) {
  } else {
    variantInputs = Array.from(variantInputs).filter((input) => {
      return /^\d+$/.test(input.value); // Regular expression to check if the value is only numbers
    });
  }

  if (!variantInputs) {
    // console.error('Variant input elements not found.');
    return;
  }
  let closestSize = null;
  variantInputs.forEach((values) => {
    let dataValue = parseInt(values.value, 10);
    if (
      closestSize === null ||
      (dataValue >= sizeValue &&
        (closestSize < sizeValue || dataValue < closestSize))
    ) {
      closestSize = dataValue;
      // console.log(closestSize,dataValue);

    }
  });

  variantInputs.forEach((values) => {
    let dataValue = parseInt(values.value, 10);
    if (dataValue === closestSize) {
      values.checked = true;
      const radioBtn = document.getElementById(values.id);
      if (radioBtn) {
        radioBtn.checked = true;
        const changeEvent = new Event("change", {
          bubbles: true,
          cancelable: true,
        });
        radioBtn.dispatchEvent(changeEvent);
        radioBtn.click();

        setTimeout(() => {
          const updated_price = getCurrentPrice();
          // console.log(updated_price);
          document
            .querySelectorAll("#quantity-options .dynamic_price")
            .forEach((d) => {
              var prices;

              const previousSibling = d.previousElementSibling;

              if (d.getAttribute("data-save") != 0) {
                var data_save = 100 - d.getAttribute("data-save");
                var discounted_variant_price =
                  (updated_price / 100) * data_save;
                var round_price = (discounted_variant_price * 100) / 100;
                var total_price = (
                  d.getAttribute("data-quantity") * round_price
                ).toFixed(2);

                // console.log(discounted_variant_price);
                if (
                  previousSibling &&
                  previousSibling.classList.contains("quantity-data")
                ) {
                  const radioButton = previousSibling.querySelector(
                    'input[type="radio"]:checked'
                  );
                  if (radioButton) {
                    document.querySelector("#total-big").innerHTML = `€${(
                      d.getAttribute("data-quantity") * round_price
                    ).toFixed(2)}`;
                  }
                  previousSibling
                    .querySelector('input[type="radio"]')
                    .setAttribute(
                      "data-final-price",
                      `€${(
                        d.getAttribute("data-quantity") * round_price
                      ).toFixed(2)}`
                    );
                }

                // <span class="updated_price">€${(d.getAttribute('data-quantity') * updated_price).toFixed(2)}</span>

                prices = `
                            <span class="discounted_price">
                            €${total_price}
                            </span>`;
              } else {
                if (
                  previousSibling &&
                  previousSibling.classList.contains("quantity-data")
                ) {
                  const radioButton = previousSibling.querySelector(
                    'input[type="radio"]:checked'
                  );
                  if (radioButton) {
                    document.querySelector("#total-big").innerHTML = `€${(
                      d.getAttribute("data-quantity") * updated_price
                    ).toFixed(2)}`;
                  }
                  previousSibling
                    .querySelector('input[type="radio"]')
                    .setAttribute(
                      "data-final-price",
                      `€${(
                        d.getAttribute("data-quantity") * updated_price
                      ).toFixed(2)}`
                    );
                }

                prices = `
                               <span class="">€${(
                    d.getAttribute("data-quantity") * updated_price
                  ).toFixed(2)}</span>
                               <span class="discounted_price">&nbsp;</span>
                             `;
              }
              d.innerHTML = `
                            <div class="prices">
                             ${prices}
                            </div>
                            `;
            });
        }, 100);
      } else {
        console.error("Radio button element not found for id:", values.id);
      }
    }
  });
}

function toggleCustomSizeInput(radio) {
  const customSizeInput = document.getElementById("custom-price-input");
  if (customSizeInput) {
    if (radio.value === "custom") {
      customSizeInput.style.display = "flex";
      var val1 = document.querySelector("#Custom_size1").value;
      var val2 = document.querySelector("#Custom_size2").value;
      radio.setAttribute("data-total", val1 * val2);
      //radio.value = `${val1}x${val2}`;


    } else {
      customSizeInput.style.display = "none";
    }
  } else {
    console.error("Custom size input element not found.");
  }

  var sizeValue = radio.getAttribute("data-total");

  variantHandler(sizeValue);
  saveSizeToLocalStorage(sizeValue);



  //start custom size input for poup box as classical-logo
  const calculatedValue = Math.sqrt(sizeValue);

  updateStcState({
    stickerWidth: calculatedValue,
    stickerHeight: calculatedValue
  });
  var heightInput = document.querySelector('#stc-height-input');
  document.querySelector('#stc-sticker-height-value').innerHTML = calculatedValue;
  document.querySelector('#stc-sticker-width-value').innerHTML = calculatedValue;
  var widthInput = document.querySelector('#stc-width-input');
  heightInput.value = calculatedValue;
  widthInput.value = calculatedValue;
  heightInput.setAttribute('value', calculatedValue);
  widthInput.setAttribute('value', calculatedValue);
  //End custom size input for poup box as classical-logo

  document.querySelector("#final-size").innerHTML = `${radio.value} cm`;
  document.querySelector("#final-size-input").value = `${radio.value} cm`;
}

const input1 = document.getElementById("Custom_size1");
const input2 = document.getElementById("Custom_size2");

function validateAndMultiply() {
  if (!input1 || !input2) {
    console.error("Custom size input elements not found.");
    return;
  }



  var value1 = parseFloat(input1.value);
  var value2 = parseFloat(input2.value);





  //start custom size input for poup box as classical-logo
  updateStcState({
    stickerWidth: value1,
    stickerHeight: value2
  });
  var heightInput = document.querySelector('#stc-height-input');
  var widthInput = document.querySelector('#stc-width-input');
  document.querySelector('#stc-sticker-height-value').innerHTML == value1;
  document.querySelector('#stc-sticker-width-value').innerHTML == value2;
  heightInput.value = value1;
  widthInput.value = value2;
  heightInput.setAttribute('value', value1);
  widthInput.setAttribute('value', value2);
  // var sizeValues = radio.getAttribute("data-total");


  //End custom size input for poup box as classical-logo

  let err_size = document.getElementById("err_size");
  if (isNaN(value1) || isNaN(value2)) {
    //console.log("Please enter valid numbers.");
    err_size.innerHTML = "Enter height & width";
    return;
  } else {
    err_size.innerHTML = "";
  }
  if (value1 < 2 || value1 > 60 || value2 < 2 || value2 > 60) {
    //console.log("Values must be between 1 and 30.");
    err_size.innerHTML = "La taille doit être comprise entre 2 et 60";
    return;
  } else {
    err_size.innerHTML = "";
  }
  let result = value1 * value2;
  document.querySelector("#final-size").innerHTML = `${value1}x${value2} cm`;
  document.querySelector("#final-size-input").value = `${value1}x${value2} cm`;
  variantHandler(result);
  saveSizeToLocalStorage(result);

  setTimeout(() => {
    const updated_price = getCurrentPrice();
    document
      .querySelectorAll("#quantity-options .dynamic_price")
      .forEach((d) => {
        var prices;

        const previousSibling = d.previousElementSibling;

        if (d.getAttribute("data-save") != 0) {
          var data_save = 100 - d.getAttribute("data-save");
          var discounted_variant_price = (
            (updated_price / 100) *
            data_save
          ).toFixed(2);
          var round_price = Math.ceil(discounted_variant_price * 100) / 100;
          if (
            previousSibling &&
            previousSibling.classList.contains("quantity-data")
          ) {
            const radioButton = previousSibling.querySelector(
              'input[type="radio"]:checked'
            );
            if (radioButton) {
              document.querySelector("#total-big").innerHTML = `€${(
                d.getAttribute("data-quantity") * round_price
              ).toFixed(2)}`;
            }
            previousSibling
              .querySelector('input[type="radio"]')
              .setAttribute(
                "data-final-price",
                `€${(d.getAttribute("data-quantity") * round_price).toFixed(2)}`
              );
          }

          // <span class="updated_price">€${(d.getAttribute('data-quantity') * updated_price).toFixed(2)}</span>
          prices = `
                            <span class="discounted_price">
                            €${(
              d.getAttribute("data-quantity") * round_price
            ).toFixed(2)}
                            </span>`;
        } else {
          if (
            previousSibling &&
            previousSibling.classList.contains("quantity-data")
          ) {
            const radioButton = previousSibling.querySelector(
              'input[type="radio"]:checked'
            );
            if (radioButton) {
              document.querySelector("#total-big").innerHTML = `€${(
                d.getAttribute("data-quantity") * updated_price
              ).toFixed(2)}`;
            }
            previousSibling
              .querySelector('input[type="radio"]')
              .setAttribute(
                "data-final-price",
                `€${(d.getAttribute("data-quantity") * updated_price).toFixed(
                  2
                )}`
              );
          }

          prices = `
                               <span class="">€${(
              d.getAttribute("data-quantity") * updated_price
            ).toFixed(2)}</span>
                               <span class="discounted_price">&nbsp;</span>
                             `;
        }
        d.innerHTML = `
                            <div class="prices">
                             ${prices}
                            </div>
                            `;
      });
  }, 100);
}

if (input1 && input2) {
  input1.addEventListener("input", validateAndMultiply);
  input2.addEventListener("input", validateAndMultiply);
}

function toggleCustomQuantityInput(radio) {
  let customQuantityInput = document.getElementById("custom-quantity-input");
  let customQuantityText = document.getElementById("custom-quantity-text");
  let quantityInput = document.querySelector(".quantity__input");
  let finalDays = document.getElementById("final-days");

  if (customQuantityInput && quantityInput && finalDays) {
    if (radio.value === "custom") {
      customQuantityInput.style.display = "block";
      customQuantityText.style.display = "block";

      updatePrice(100);
      saveQuantityToLocalStorage(100);
      document.querySelector("#final-qty").innerHTML = 100;
      updateDays(100);
      customQuantityInput.value = 100;
      radio.value = 100;
      const submitButton = document.querySelector(".product-form__submit");

      customQuantityInput.addEventListener("input", function () {
        let quantity = parseInt(customQuantityInput.value);
        radio.value = quantity;
        console.log(radio.value);
        let errorMessage = document.querySelector(".custom-error-msg");

        if (!errorMessage) {
          errorMessage = document.createElement("div");
          errorMessage.classList.add("custom-error-msg");
          errorMessage.style.color = "red"; // Optional styling
          document.querySelector("#custom-quantity-text").before(errorMessage);
        }

        if (quantity < 10 || isNaN(quantity)) {
          errorMessage.innerHTML = "la quantité doit être supérieure à 10";
          errorMessage.style.display = "block"; // Ensure the error message is visible
          submitButton.disabled = true;
        } else {
          errorMessage.innerHTML = "";
          errorMessage.style.display = "none"; // Hide the error message
          // quantityInput.value = 100;
          // quantityInput.setAttribute("value", 100);
          saveQuantityToLocalStorage(100);
          document.querySelector("#final-qty").innerHTML = quantity;
          updatePrice(quantity);
          updateDays(quantity);
          submitButton.disabled = false;
        }
      });

      updatePrice(100);
    } else {
      const radioInputs = document.querySelectorAll(".radio-inp");
      const lastRadioInput = radioInputs[radioInputs.length - 1];
      lastRadioInput.value = "custom";

      customQuantityInput.style.display = "none";
      customQuantityText.style.display = "none";
      // quantityInput.value = radio.value;
      // quantityInput.setAttribute("value", radio.value);
      updatePrice(radio.value);
      saveQuantityToLocalStorage(radio.value);
      document.querySelector("#final-qty").innerHTML = radio.value;
      updateDays(radio.value);


    }
  } else {
    console.error(
      "Custom quantity input, quantity input element, or final days element not found."
    );
  }

  function updateDays(quantity) {
    let days;
    if (quantity < 200) {
      days = 4;
    } else if (quantity < 499) {
      days = 6;
    } else if (quantity < 999) {
      days = 8;
    } else {
      days = 10;
    }
    finalDays.innerHTML = days + " Jours";
  }
}

document.addEventListener("DOMContentLoaded", populateOptions);

document.addEventListener("DOMContentLoaded", function () {
  var label = document.querySelector('h2[for="additional-text"]');
  var input = document.getElementById("additional-text");
  var previewContainer = document.querySelector(".image-preview-container");
  var previewImage = document.getElementById("image_preview");

  // label.addEventListener('click', function() {
  //     if (input.style.display === 'none' || !input.classList.contains('show')) {
  //         input.style.display = 'block';
  //         setTimeout(function() {
  //             input.classList.add('show');
  //         }, 10);
  //         input.focus();
  //     } else {
  //         input.classList.remove('show');
  //         setTimeout(function() {
  //             input.style.display = 'none';
  //         }, 500);
  //     }
  // });

  document
    .getElementById("custom_photo")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const previewImage = document.getElementById("image_preview"); // Assuming you have an image element with this ID
      const previewContainer = document.querySelector(".image-preview-container");

      if (file) {
        const fileType = file.type;

        if (fileType.startsWith("image/")) {
          // Check if the file is an image
          const reader = new FileReader();
          reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";

            // Get the current sticker shape and apply appropriate class
            const shapeSelect = document.getElementById("stc-sticker-shape-select");
            const shape = shapeSelect ? shapeSelect.value : "circle";

            // Remove all existing shape classes
            previewImage.classList.remove(
              "sticker-circle", "sticker-square", "sticker-rectangle",
              "sticker-hexagon", "sticker-pentagon", "sticker-octagon",
              "sticker-diamond", "sticker-triangle", "sticker-star",
              "sticker-heart", "cover-mode"
            );

            // Add cover mode for better image fitting
            previewImage.classList.add("cover-mode");

            // Add shape-specific class
            if (shape !== "none" && shape !== "contour") {
              previewImage.classList.add("sticker-" + shape);
            }

            // Update preview container style
            previewContainer.style.borderStyle = "solid";
            previewContainer.style.borderColor = "#00b67a";
          };
          reader.readAsDataURL(file);
        } else if (fileType === "application/pdf") {
          // Check if it's a PDF file
          previewImage.src =
            "https://cdn.shopify.com/s/files/1/0578/4882/3996/files/80942.png?v=1725791225"; // Set PDF icon
          previewImage.style.display = "block";
          // Remove all shape classes
          const shapeClasses = ["cover-mode", "sticker-circle", "sticker-square", "sticker-rectangle", "sticker-hexagon", "sticker-pentagon", "sticker-octagon", "sticker-diamond", "sticker-triangle", "sticker-star", "sticker-heart"];
          shapeClasses.forEach(cls => previewImage.classList.remove(cls));
          previewContainer.style.borderStyle = "solid";
        } else {
          // For other non-image and non-PDF files
          previewImage.src =
            "https://cdn.shopify.com/s/files/1/0578/4882/3996/files/page-file-icon.webp?v=1725791274"; // Set default file icon
          previewImage.style.display = "block";
          // Remove all shape classes
          const shapeClasses = ["cover-mode", "sticker-circle", "sticker-square", "sticker-rectangle", "sticker-hexagon", "sticker-pentagon", "sticker-octagon", "sticker-diamond", "sticker-triangle", "sticker-star", "sticker-heart"];
          shapeClasses.forEach(cls => previewImage.classList.remove(cls));
          previewContainer.style.borderStyle = "solid";
        }
      }
    });

  // Trigger the change event programmatically to ensure the preview is shown instantly
  if (customPhotoInput) {
    customPhotoInput.dispatchEvent(new Event('change'));
  }

  previewContainer.addEventListener("mouseenter", function () {
    previewImage.style.transform = "scale(1.05)";
  });

  previewContainer.addEventListener("mouseleave", function () {
    previewImage.style.transform = "scale(1)";
  });

  // Add event listener for sticker shape changes to update image preview
  const shapeSelect = document.getElementById("stc-sticker-shape-select");
  if (shapeSelect) {
    shapeSelect.addEventListener("change", function () {
      const shape = this.value;
      const previewImage = document.getElementById("image_preview");

      // Remove all existing shape classes
      const shapeClasses = ["cover-mode", "sticker-circle", "sticker-square", "sticker-rectangle", "sticker-hexagon", "sticker-pentagon", "sticker-octagon", "sticker-diamond", "sticker-triangle", "sticker-star", "sticker-heart"];
      shapeClasses.forEach(cls => previewImage.classList.remove(cls));

      // Add cover mode back for images
      if (previewImage.src && !previewImage.src.includes("80942.png") && !previewImage.src.includes("page-file-icon.webp")) {
        previewImage.classList.add("cover-mode");

        // Add the selected shape class
        if (shape !== "none" && shape !== "contour") {
          previewImage.classList.add("sticker-" + shape);
        }
      }
    });
  }
});














///// validtion///////////////////////
// document.addEventListener('DOMContentLoaded', () => {
//   const sizeEl = document.querySelector('.size-dropdown');
//   const stcWrapper = document.getElementById('stc-wrapper');

//   if (!sizeEl || !stcWrapper) return;

//   const toggleSTC = () => {
//     const value = sizeEl.innerText.trim();

//     if (value === '- × - cm') {
//       stcWrapper.classList.add('stc-disabled');
//       stcWrapper.setAttribute('aria-disabled', 'true');
//     } else {
//       stcWrapper.classList.remove('stc-disabled');
//       stcWrapper.removeAttribute('aria-disabled');
//     }
//   };

//   // Initial check
//   toggleSTC();

//   // Re-check when size changes dynamically
//   const observer = new MutationObserver(toggleSTC);
//   observer.observe(sizeEl, {
//     childList: true,
//     characterData: true,
//     subtree: true
//   });
// });


document.addEventListener('DOMContentLoaded', () => {
  const sizeEl = document.querySelector('.size-dropdown');
  const stcWrapper = document.getElementById('stc-wrapper');
  if (!sizeEl || !stcWrapper) return;

  /* Inject click blocker */
  if (!stcWrapper.querySelector('.stc-click-blocker')) {
    const blocker = document.createElement('div');
    blocker.className = 'stc-click-blocker';
    stcWrapper.appendChild(blocker);
  }

  /* Create modal once */
  let modal = document.querySelector('.size-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'size-modal';
    modal.innerHTML = `
      <div class="size-modal-box">
        <h3>Select Size</h3>
        <p>Please select size before continuing.</p>
        <button id="size-modal-ok">OK</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const openModal = () => {
    modal.classList.add('active');
    sizeEl.classList.add('indicate');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    sizeEl.classList.remove('indicate');
  };

  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.id === 'size-modal-ok') {
      closeModal();
    }
  });

  /* Enable / Disable logic */
  const toggleSTC = () => {
    const value = sizeEl.innerText.trim();
    if (value === '- × - cm') {
      stcWrapper.classList.add('stc-disabled');
    } else {
      stcWrapper.classList.remove('stc-disabled');
      closeModal();
    }
  };

  toggleSTC();

  new MutationObserver(toggleSTC).observe(sizeEl, {
    childList: true,
    characterData: true,
    subtree: true
  });

  /* Click catcher */
  stcWrapper.querySelector('.stc-click-blocker')
    .addEventListener('click', openModal);
});

