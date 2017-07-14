function onClickHandler() {
    if(document.getElementById('navbarNav').style.display === '') {
        document.getElementById('navbarNav').style.display = 'block';
    }
    else if (document.getElementById('navbarNav').style.display === 'block') {
        document.getElementById('navbarNav').style.display = '';
    }
}
