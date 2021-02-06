const fs = require('fs');
const path = require('path');
const faker = require('faker');
const filePath = path.join(__dirname, 'CSV');
const ws = fs.createWriteStream(`${filePath}/items.csv`);
const csvColumns = '_id,seller,rating,sales,employee,employee_position,employee_ava,policy_updated,policy_acceptReturn,policy_allowExchange,policy_types,item,item_tags,price,item_availability,item_description,selector,shipping_origin\n';

function getTags() {
  const arr = [];
  for (let i = 0; i < Math.round(Math.random() * 12 + 1); i += 1) {
    arr.push(faker.commerce.productAdjective());
  }
  return arr;
}

function getSelectors() {
  function getOptions() {
    const arr = [];
    for (let i = 0; i < Math.round(Math.random() * 9 + 1); i += 1) {
      arr.push(`${faker.commerce.color()}`);
    }
    return arr;
  }
  const selector = {};
  for (let i = 0; i < Math.round(Math.random() * 4 + 1); i += 1) {
    selector[`${faker.commerce.productMaterial()}`] = getOptions();
  }
  return selector;
}

ws.write(csvColumns, 'utf-8');
for (let i = 1; i <= 10000000; i += 1) {
  const id = i.toString(16);
  const pic = Math.floor(Math.random() * (1000) + 1);
  const seller = faker.company.companyName();
  const rating = Math.random() * 5;
  const sales = Math.floor(Math.random() * 10000);
  const employee = faker.fake('{{name.firstName}} {{name.lastName}}');
  const employee_position = faker.name.jobTitle();
  const employee_ava = `https://zh-userpics.s3-us-west-2.amazonaws.com/prof${pic}.jpg`
  const policy_updated = faker.date.past().toISOString();
  const policy_acceptReturn = pic % 2 === 0 ? true : false;
  const policy_allowExchange = sales % 2 === 0 ? true : false;
  const policy_types = ['Custom or personalized orders', 'Items on sale'];
  const item = faker.commerce.productName();
  const item_tags = getTags();
  const price = faker.commerce.price();
  const availability = sales % 12 === 0 ? false : true;
  const description = `${faker.commerce.productDescription()}\n${faker.commerce.productDescription()}\n${faker.commerce.productDescription()}`;
  const selector = JSON.stringify(getSelectors());
  const shipping_origin = [faker.address.latitude(), faker.address.longitude()];
  const record = `${id},"${seller}",${rating},${sales},${employee},${employee_position},${employee_ava},${policy_updated},${policy_acceptReturn},${policy_allowExchange},"{${policy_types}}",${item},"{${item_tags}}",${price},${availability},"${description}","${selector.replace(/\"/g, '""')}","{${shipping_origin}}"`;


  if (i % 100000 === 0) {
    console.log(`${Math.floor(i/10000000 * 100)}%`);
  }

  ws.write(`${record}\n`, 'utf-8');
}
console.log('Done.');

ws.end();
ws.on('close', () => console.log('Complete.'));