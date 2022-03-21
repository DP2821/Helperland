window.addEventListener("scroll", () => {
  if (!window.matchMedia("(max-width:992px").matches) {
    if (window.scrollY > 80) {
      document.getElementById("home-main-nav").style.backgroundColor =
        "#73706c";
      document.getElementById("nav-menu").style.marginTop = "10px";
      document.getElementById("home-nav-logo").style.height = "55px";
      // document.getElementById("home-nav-logo").style.src = "./assets/images/logo-small.png";
    } else {
      document.getElementById("home-main-nav").style.background = "none";
      document.getElementById("nav-menu").style.marginTop = "43px";
      document.getElementById("home-nav-logo").style.height = "130px";
    }
  }
});

if (window.matchMedia("(max-width:992px").matches) {
  document.getElementById("home-main-nav").style.backgroundColor = "#73706c";
  document.getElementById("nav-menu").style.marginTop = "10px";
  document.getElementById("home-nav-logo").style.height = "55px";
}

if (document.location.search.includes("loginModal=true")) {
    document.getElementById("loginbtn").click();
}
if (document.location.search.includes("resetLinkSent=true")) {
  showSuccessAlertMessage("An email has been sent to your account. Click on the link in received email to reset the password.")
}
if (document.location.search.includes("notApproved=true")) {
  showErrorAlertMessage("Your account is not approved, Please contact Admin");
}
if (document.location.search.includes("emailPass=wrong")) {
  showErrorAlertMessage("Email or Password is wrong");
  $("#custom-alert-modal-btn-ok").click(function(){
    location.replace("?loginModal=true");
  })
}