document.addEventListener('DOMContentLoaded', () => {
  // 1.0 Get the services from the server
  fetch('/api/getservices')
    .then((response) => response.json())
    .then(({ result: arr }) => {
      const drop = document.querySelector('#ioc-services');
      arr.forEach((item) => {
        const el = document.createElement('option');
        el.setAttribute('value', item);
        el.textContent = item;
        drop.appendChild(el);
      });
    });
  // 2.0 Attach listeners to HTML elements for sending data to server
  document.querySelector('#send-button').onclick = async () => {
    fetch(`/api?input=${document.querySelector('#text-content').value}`)
      .then((response) => response.json())
      .then(({ result: text }) => {
        document.querySelector('#response-field').textContent = text;
      });
  };

  // 3.0 Inject a new dependency every time another option is chosen
  const select = document.querySelector('#ioc-services');
  select.onchange = () => {
    fetch(`/api/${select.value}`, {
      method: 'PATCH',
    });
  };
});
