$(() => {
    console.log('linked');
    $('.category-col').click((event) => {
        $('.category-col').removeClass('category-border');
        $(event.target).addClass('category-border');
        $('#color-name').val($(event.target).attr('class').split(' ')[1]);
        console.log($('#color-name').val());
    })
});