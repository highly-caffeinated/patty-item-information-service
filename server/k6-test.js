import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
export let errorRate = new Rate('errors');
const randomNumber = () => {
  var rando = Math.floor(Math.random() * Math.floor(10000000)) + 1;
  return rando.toString(16);
};
export default function () {
  var url = 'http://localhost:3003/api/item/' + randomNumber();
  var params = {
  };
  check(http.get(url, params), {
    'status is 200': (r) => r.status === 200,
  }) || errorRate.add(1);
  sleep(0);
}