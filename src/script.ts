import Greeter from './scripts/greeter';

const greeter = new Greeter('world');

const element = document.getElementById('message');
if (element) element.innerText = greeter.greeting;
