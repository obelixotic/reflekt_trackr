$(() => {
    console.log('linked');

    let colorAlreadySelected = $('#color-saved').val();

    $(`.${colorAlreadySelected}`).addClass('category-border');

    $('.category-col').click((event) => {
        $('.category-col').removeClass('category-border');
        $(event.target).addClass('category-border');
        $('#color-name').val($(event.target).attr('class').split(' ')[1]);
        console.log($('#color-name').val());
    })
});