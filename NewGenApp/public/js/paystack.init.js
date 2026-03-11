document.addEventListener("DOMContentLoaded", () => {
  const { isAuth, user } = window.getAuthState();

  if (!isAuth || !user?.email || !user?.username) {
    console.error("❌ Paystack init aborted: user not authenticated");
    return;
  }

  const API_BASE = window.API_BASE_URL;
  if (!API_BASE) {
    console.error("❌ API_BASE_URL not defined");
    return;
  }

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".buy-now");
    if (!button) return;

    const materialId = button.dataset.materialId;
    const price = Number(button.dataset.price);

    if (!materialId || !price || price <= 0) {
      console.error("❌ Invalid material data", { materialId, price });
      return;
    }

    const amountKobo = Math.round(price * 100);

    console.log("💳 Initializing Paystack:", {
      materialId,
      amountKobo,
      email: user.email,
      username: user.username,
    });

    const handler = PaystackPop.setup({
      key: window.PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: amountKobo,
      currency: "NGN",
      metadata: {
        username: user.username,
        materialId,
      },

      callback: (response) => {
        console.log("✅ Paystack success:", response.reference);

        fetch(`${API_BASE}/api/paystack/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            reference: response.reference,
            materialId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data?.success) {
              console.error("❌ Verification failed:", data);
              alert("Payment verification failed.");
              return;
            }

            console.log("🎉 Purchase verified:", data);

            // UI update (instant feedback)
            button.textContent = "✔ In Your Library";
            button.disabled = true;
            button.classList.add("owned");

          })
          .catch((err) => {
            console.error("❌ Verify request error:", err);
          });
      },

      onClose: () => {
        console.warn("⚠️ Paystack popup closed by user");
      },
    });

    handler.openIframe();
  });
});






/*document.addEventListener("DOMContentLoaded", function () {
  // Attach event listener to all "Buy" buttons
  document.querySelectorAll(".buy-button").forEach(button => {
    button.addEventListener("click", function () {
      const price = parseFloat(this.getAttribute("data-price"));
      const materialId = this.getAttribute("data-id"); // ✅ Get material ID

      if (isNaN(price) || price <= 0 || !materialId) {
        console.error("❌ Invalid material price or ID");
        return;
      }

      // ✅ Get email input from the same card as the clicked Buy button
      const emailInput = this.closest(".cards")?.querySelector(".email-input");
      if (!emailInput) {
        console.error("❌ Email input with class='email-input' not found in this card");
        alert("Please enter your email address.");
        return;
      }

      const email = emailInput.value.trim();
      console.log("Email being sent to Paystack:", email);

      // ✅ Minimal, robust email validation (stops 400 on Paystack)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return;
      }
      // ✅ Grab username input (parallel to email)
      const usernameInput = this.closest(".cards")?.querySelector(".username");
      if (!usernameInput) {
        console.error("❌ Username input with class='username-input' not found in this card");
        alert("Please enter your username.");
        return;
      }

      const username = usernameInput.value.trim();
      console.log("Username being sent to Paystack:", username);

      if (!username) {
        alert("Username is required.");
        usernameInput.focus();
        return;
      }

      // ✅ Ensure integer kobo (avoids float issues like 1999.999…)
      const amountKobo = Math.round(price * 100);

      const handler = PaystackPop.setup({
        key: window.PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amountKobo, // Paystack needs amount in kobo (integer)
        currency: "NGN",
        metadata: {
          username: username,
          materialId: materialId, 
       },
        callback: function (response) {
          console.log("✅ Payment completed. Ref:", response.reference);

          // Send reference + material ID to backend for verification
          fetch("http://localhost:3000/api/paystack/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}` // ✅ send token
            },
            body: JSON.stringify({
              reference: response.reference,
              materialId: materialId
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("🔍 Verification response:", data);
              if (data.success) {
                alert("✅ Payment successful! Material unlocked.");
                // reload purchased materials immediately
                if (typeof loadPurchasedMaterials === "function") {
                  loadPurchasedMaterials();
                }
              } else {
                alert("❌ Payment verification failed.");
              }
            })
            .catch((err) => {
              console.error("❌ Verification error:", err);
            });
        },
        onClose: function () {
          alert("Payment window closed.");
        },
      });

      handler.openIframe();
    });
  });
});

*/






















