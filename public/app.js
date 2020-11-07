$(() => {
    console.log('linked');

    let colorAlreadySelected = $('#color-saved').val();
    let iconAlreadySelected = $('#icon-saved').val();

    console.log(iconAlreadySelected, colorAlreadySelected);

    $(`.${colorAlreadySelected}`).addClass('category-border');
    $(`.${iconAlreadySelected}`).addClass('category-border');

    $('.category-col').click((event) => {
        $('.category-col').removeClass('category-border');
        $(event.target).addClass('category-border');
        $('#color-name').val($(event.target).attr('class').split(' ')[1]);
        console.log($('#color-name').val());
    });

    $('.category-icon').click((event) => {
        $('.category-icon').removeClass('category-border');
        $(event.target).addClass('category-border');
        $('#icon-name').val($(event.target).attr('class').split(' ')[1]);
        console.log($('#icon-name').val());
    });
});