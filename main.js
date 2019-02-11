function onClickHandler() {
    if(document.getElementById('navbarNav').style.display === '') {
        document.getElementById('navbarNav').style.display = 'inline-flex';
    }
    else if (document.getElementById('navbarNav').style.display === 'inline-flex') {
        document.getElementById('navbarNav').style.display = '';
    }
}

function onSubmitHandler() {
    window.location.href = 'https://www.jobox.ai/routes/Careers/jobs.html'
}
