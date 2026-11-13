(function () {
  'use strict';

  document.querySelectorAll('[data-news]').forEach(function (news) {
    var filter = news.querySelector('.news__filter');
    var select = news.querySelector('select');
    var updates = news.querySelector('.news-scrollbox');
    var status = news.querySelector('[data-news-status]');
    var years = Array.from(news.querySelectorAll('[data-news-year]'));
    if (!filter || !select || !updates || !status || !years.length) return;

    years.forEach(function (group) {
      var year = group.dataset.newsYear;
      var option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      select.appendChild(option);
    });

    function showYear() {
      var selected = select.value;
      var count = 0;
      years.forEach(function (group) {
        group.hidden = selected !== 'all' && group.dataset.newsYear !== selected;
        if (!group.hidden) count += group.querySelectorAll('li').length;
      });
      updates.dataset.newsFiltered = String(selected !== 'all');
      updates.scrollTop = 0;
      status.textContent = 'Showing ' + count + (count === 1 ? ' update' : ' updates') +
        (selected === 'all' ? ' from all years.' : ' from ' + selected + '.');
    }

    select.value = 'all';
    showYear();
    select.addEventListener('change', showYear);
    filter.hidden = false;
  });
}());
