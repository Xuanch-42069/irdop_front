function el_hide (el) {
  // check el must be an HtmlElement
  if (!(el instanceof HTMLElement)) {
    throw new Error('el_hide: invalid element');
  }
  // add display-none class
  el.classList.add('display-none');
  // if el has display property, store it in data-displayToggle
  if (el.style.display) {
    el.dataset.displayToggle = el.style.display;
  }
}

function el_show (el) {
  // check el must be an HtmlElement
  if (!(el instanceof HTMLElement)) {
    throw new Error('el_show: invalid element');
  }
  // remove display-none class
  el.classList.remove('display-none');
  // if el has data-displayToggle, restore it and remove it
  if (el.dataset.displayToggle) {
    el.style.display = el.dataset.displayToggle;
    delete el.dataset.displayToggle;
  }
}

function dropbox_hide_all () {
  var dropboxes = document.querySelectorAll('.dropbox');
  dropboxes.forEach(function (dropbox) {
    dropbox_hide(dropbox);
  });
}

function dropbox_hide (dropbox) {
  // check dropbox must be an HtmlElement
  if (!(dropbox instanceof HTMLElement)) {
    throw new Error('dropbox_hide: invalid element');
  }

  // check dropbox must exist in the DOM
  if (!document.body.contains(dropbox)) {
    throw new Error('dropbox_hide: element not found');
  }
  
  // add display-none class
  dropbox.classList.add('display-none');
  // if dropbox has display property, store it in data-displayToggle
  if (dropbox.style.display) {
    dropbox.dataset.displayToggle = dropbox.style.display;
  }
}