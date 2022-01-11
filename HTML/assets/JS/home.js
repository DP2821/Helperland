window.addEventListener("scroll", () => {

	if (window.scrollY > 80) {
        document.getElementById("home-main-nav").style.backgroundColor = "#73706c";
        document.getElementById("nav-menu").style.marginTop = "10px";
        document.getElementById("home-nav-logo").style.height = "55px";
        // document.getElementById("home-nav-logo").style.src = "./assets/images/logo-small.png";

	} else {
		document.getElementById("home-main-nav").style.background = "none";
        document.getElementById("nav-menu").style.marginTop = "43px";
        document.getElementById("home-nav-logo").style.height = "130px";

	}
});