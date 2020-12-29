$(() => {
    console.log("linked");

    $(document).on("scroll", (event) => {
        localStorage.setItem("scrollY", window.pageYOffset - 11);
    });

    $(document).ready(() => {
        let scrollY = localStorage.getItem("scrollY");
        window.scrollTo(0, scrollY);
    });

    let colorAlreadySelected = $("#color-saved").val();
    let iconAlreadySelected = $("#icon-saved").val();

    $(`.${colorAlreadySelected}`).addClass("category-border");
    $(`.${iconAlreadySelected}`).addClass("category-border");

    $(".category-col").click((event) => {
        $(".category-col").removeClass("category-border");
        $(event.target).addClass("category-border");
        $("#color-name").val($(event.target).attr("class").split(" ")[1]);
        console.log($("#color-name").val());
    });

    $(".category-icon").click((event) => {
        $(".category-icon").removeClass("category-border");
        $(event.target).addClass("category-border");
        $("#icon-name").val($(event.target).attr("class").split(" ")[1]);
        console.log($("#icon-name").val());
    });
});