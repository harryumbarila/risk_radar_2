function onClickHandler() {
    if(document.getElementById('navbarNav').style.display === '') {
        document.getElementById('navbarNav').style.display = 'inline-flex';
    }
    else if (document.getElementById('navbarNav').style.display === 'inline-flex') {
        document.getElementById('navbarNav').style.display = '';
    }
}

function onSubmitHandler() {
    window.location.href = 'http://www.jobox.ai/routes/Careers/careers.html'
}
