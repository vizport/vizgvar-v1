import axios from 'axios';
import './style.scss';

console.log(__ENV__);

axios.get('api/variations/ENSP00000478234')
.then(function (response) {
  console.log(response.data);
  document.getElementById('root').innerHTML = response.data.length;
})
.catch(function (error) {
  console.log(error);
});
